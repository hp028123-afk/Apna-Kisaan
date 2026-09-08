/* ================================================================
   bhav-api.js  —  Shared API service for vegetable & crop price pages
   Tries Vercel proxy first → direct farmer.in CORS fallback →
   local fallback demo data.
   ================================================================ */

(function (root) {
  "use strict";

  /* ── Public namespace ─────────────────────────────────────── */
  root.BhavAPI = root.BhavAPI || {};

  /* ── farmer.in direct URL (for CORS fallback) ─────────────── */
  var FARMER_DIRECT = "https://farmer.in/api/open/prices.json";

  /* ── Vegetable keywords ───────────────────────────────────── */
  var VEG_KEYWORDS = [
    "tomato","onion","potato","brinjal","eggplant","cauliflower","cabbage",
    "okra","ladyfinger","carrot","radish","spinach","peas","beans",
    "cucumber","gourd","capsicum","chilli","chili","coriander","ginger",
    "garlic","mushroom","turnip","beetroot","pumpkin","bitter","bottle",
    "ridge","snake","tinda","parwal","arbi","yam","colocasia","drumstick",
    "moringa","fenugreek","mint","celery","leek","broccoli","asparagus",
    "methi","palak","bhindi","baingan","shimla"
  ];

  var VEG_CATEGORIES = [
    "vegetable","vegetables","sabji","sabzi","greens","leafy",
    "root vegetable","spice"
  ];

  /* ── Crop keywords ────────────────────────────────────────── */
  var CROP_KEYWORDS = [
    "wheat","rice","paddy","maize","corn","soybean","soya","soyabean",
    "mustard","cotton","sugarcane","jowar","bajra","barley","chana","gram",
    "chickpea","lentil","masoor","arhar","toor","pigeon","moong","urad",
    "black gram","green gram","groundnut","peanut","sesame","til",
    "sunflower","safflower","flax","linseed","jute","hemp","tobacco",
    "ragi","finger millet","sorghum","millet","oat"
  ];

  var CROP_CATEGORIES = [
    "grain","cereal","pulse","oilseed","cash crop","spice crop",
    "fiber","fodder","plantation","crop","fasal"
  ];

  var MP_CROPS = [
    "soybean","soya","soyabean","wheat","gram","chana","chickpea",
    "mustard","maize","corn","arhar","toor","moong","urad",
    "linseed","til","sesame","groundnut","cotton","paddy","ragi"
  ];

  /* ── Classifier helpers ───────────────────────────────────── */
  function isVegetable(item) {
    var cat  = (item.category || "").toLowerCase();
    var name = (item.name     || "").toLowerCase();
    if (CROP_KEYWORDS.some(function (k) { return name.indexOf(k) !== -1; })) return false;
    if (VEG_CATEGORIES.some(function (k) { return cat.indexOf(k)  !== -1; })) return true;
    if (VEG_KEYWORDS.some(function (k)   { return name.indexOf(k) !== -1; })) return true;
    return false;
  }

  function isCrop(item) {
    var cat  = (item.category || "").toLowerCase();
    var name = (item.name     || "").toLowerCase();
    if (VEG_KEYWORDS.some(function (k) { return name.indexOf(k) !== -1; })) return false;
    if (CROP_CATEGORIES.some(function (k) { return cat.indexOf(k)  !== -1; })) return true;
    if (CROP_KEYWORDS.some(function (k)   { return name.indexOf(k) !== -1; })) return true;
    return false;
  }

  function isMPCrop(item) {
    if (Array.isArray(item.major_states)) {
      var states = item.major_states.map(function (s) { return s.toLowerCase(); });
      if (states.some(function (s) { return s.indexOf("madhya") !== -1 || s === "mp"; })) return true;
    }
    var name = (item.name || "").toLowerCase();
    return MP_CROPS.some(function (k) { return name.indexOf(k) !== -1; });
  }

  /* ── Normalise trend / unit ───────────────────────────────── */
  function normTrend(raw) {
    if (!raw) return "same";
    var t = String(raw).toLowerCase();
    if (t === "up"   || t === "increase" || t === "rise") return "up";
    if (t === "down" || t === "decrease" || t === "fall") return "down";
    return "same";
  }

  function normUnit(u) {
    if (!u) return "रु./क्विंटल";
    var l = u.toLowerCase();
    if (l === "quintal" || l === "qtl") return "रु./क्विंटल";
    if (l === "kg")    return "रु./किग्रा";
    if (l === "tonne") return "रु./टन";
    return u;
  }

  /* ── Map a raw farmer.in commodity to a normalised record ─── */
  function mapVeg(item) {
    return {
      commodity:    item.hindi  || item.name || "—",
      commodity_en: item.name  || "—",
      category:     item.category || "सब्जियां",
      min_price:    item.min   != null ? Number(item.min)   : null,
      max_price:    item.max   != null ? Number(item.max)   : null,
      modal_price:  item.price != null ? Number(item.price) : null,
      change:       item.change != null ? Number(item.change) : 0,
      trend:        normTrend(item.trend),
      unit:         normUnit(item.unit),
      arrival_date: item.updated || "",
      season:       item.season  || "",
      description:  item.description || ""
    };
  }

  function mapCrop(item) {
    var mp = isMPCrop(item);
    return {
      commodity:    item.hindi  || item.name || "—",
      commodity_en: item.name  || "—",
      category:     item.category || "फसल",
      min_price:    item.min   != null ? Number(item.min)   : null,
      max_price:    item.max   != null ? Number(item.max)   : null,
      modal_price:  item.price != null ? Number(item.price) : null,
      change:       item.change != null ? Number(item.change) : 0,
      trend:        normTrend(item.trend),
      unit:         normUnit(item.unit),
      arrival_date: item.updated || "",
      season:       item.season  || "",
      description:  item.description || "",
      is_mp:        mp,
      district:     mp ? "मध्य प्रदेश" : "भारत",
      major_states: item.major_states || []
    };
  }

  /* ── Parse raw farmer.in payload ─────────────────────────── */
  function parseVegetables(payload) {
    var commodities = Array.isArray(payload.commodities) ? payload.commodities : [];
    return commodities.filter(isVegetable).map(mapVeg);
  }

  function parseCrops(payload) {
    var commodities = Array.isArray(payload.commodities) ? payload.commodities : [];
    var records = commodities.filter(isCrop).map(mapCrop);
    records.sort(function (a, b) { return (b.is_mp ? 1 : 0) - (a.is_mp ? 1 : 0); });
    return records;
  }

  /* ── Generic fetch with timeout ──────────────────────────── */
  function fetchWithTimeout(url, timeoutMs) {
    timeoutMs = timeoutMs || 8000;
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () {
        reject(new Error("Request timed out after " + timeoutMs + "ms"));
      }, timeoutMs);
      fetch(url, { headers: { Accept: "application/json" } })
        .then(function (res) {
          clearTimeout(timer);
          resolve(res);
        })
        .catch(function (err) {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  /* ── Detect if running on Vercel / a real server ─────────── */
  function hasServer() {
    var proto = window.location.protocol;
    var host  = window.location.hostname;
    return proto === "https:" || proto === "http:" && host !== "" && host !== "localhost" && host !== "127.0.0.1"
      ? true
      : proto === "http:" && (host === "localhost" || host === "127.0.0.1");
  }

  /* ── Core fetch strategy:
        1. Vercel proxy /api/*  (works on vercel.app + localhost)
        2. Direct farmer.in    (CORS — works in browsers that allow it)
        3. Demo fallback        (always works)
     ─────────────────────────────────────────────────────────── */
  async function fetchVegetables() {
    /* Try Vercel proxy */
    if (hasServer()) {
      try {
        var proxyUrl = window.APNA_KISAAN_VEG_API || "/api/vegetable-price";
        var res = await fetchWithTimeout(proxyUrl, 8000);
        if (res.ok) {
          var payload = await res.json();
          var records = Array.isArray(payload.records) ? payload.records : [];
          if (records.length) {
            return {
              records: records,
              source: payload.source || "farmer.in",
              updated: payload.updated || "",
              isDemo: false,
              isFallback: false
            };
          }
        }
      } catch (e) {
        console.warn("[BhavAPI] Proxy fetch failed, trying direct:", e.message);
      }
    }

    /* Try direct farmer.in */
    try {
      var directRes = await fetchWithTimeout(FARMER_DIRECT, 10000);
      if (directRes.ok) {
        var directPayload = await directRes.json();
        var directRecords = parseVegetables(directPayload);
        if (directRecords.length) {
          return {
            records: directRecords,
            source: directPayload.source || "farmer.in",
            updated: directPayload.updated || "",
            isDemo: false,
            isFallback: false
          };
        }
      }
    } catch (e) {
      console.warn("[BhavAPI] Direct farmer.in fetch failed:", e.message);
    }

    /* Fallback demo data */
    return {
      records: VEG_DEMO_DATA,
      source: "डेमो डेटा",
      updated: "",
      isDemo: true,
      isFallback: true
    };
  }

  async function fetchCrops() {
    if (hasServer()) {
      try {
        var proxyUrl = window.APNA_KISAAN_CROP_API || "/api/crop-price";
        var res = await fetchWithTimeout(proxyUrl, 8000);
        if (res.ok) {
          var payload = await res.json();
          var records = Array.isArray(payload.records) ? payload.records : [];
          if (records.length) {
            return {
              records: records,
              source: payload.source || "farmer.in",
              updated: payload.updated || "",
              mp_count: payload.mp_count || 0,
              isDemo: false,
              isFallback: false
            };
          }
        }
      } catch (e) {
        console.warn("[BhavAPI] Crop proxy failed, trying direct:", e.message);
      }
    }

    try {
      var directRes = await fetchWithTimeout(FARMER_DIRECT, 10000);
      if (directRes.ok) {
        var directPayload = await directRes.json();
        var directRecords = parseCrops(directPayload);
        if (directRecords.length) {
          return {
            records: directRecords,
            source: directPayload.source || "farmer.in",
            updated: directPayload.updated || "",
            mp_count: directRecords.filter(function (r) { return r.is_mp; }).length,
            isDemo: false,
            isFallback: false
          };
        }
      }
    } catch (e) {
      console.warn("[BhavAPI] Direct crop fetch failed:", e.message);
    }

    return {
      records: CROP_DEMO_DATA,
      source: "डेमो डेटा",
      updated: "",
      mp_count: CROP_DEMO_DATA.filter(function (r) { return r.is_mp; }).length,
      isDemo: true,
      isFallback: true
    };
  }

  /* ── Demo / Fallback vegetable data ───────────────────────── */
  var VEG_DEMO_DATA = [
    { commodity:"टमाटर",      commodity_en:"Tomato",       category:"सब्जियां",       min_price:1400, max_price:3500, modal_price:2500, change:0,    trend:"same", unit:"रु./क्विंटल" },
    { commodity:"प्याज",      commodity_en:"Onion",        category:"सब्जियां",       min_price:1800, max_price:3200, modal_price:2400, change:200,  trend:"up",   unit:"रु./क्विंटल" },
    { commodity:"आलू",        commodity_en:"Potato",       category:"सब्जियां",       min_price:1200, max_price:2100, modal_price:1600, change:-100, trend:"down", unit:"रु./क्विंटल" },
    { commodity:"बैंगन",      commodity_en:"Brinjal",      category:"सब्जियां",       min_price:1600, max_price:2800, modal_price:2100, change:150,  trend:"up",   unit:"रु./क्विंटल" },
    { commodity:"फूलगोभी",    commodity_en:"Cauliflower",  category:"सब्जियां",       min_price:1800, max_price:3000, modal_price:2400, change:0,    trend:"same", unit:"रु./क्विंटल" },
    { commodity:"भिंडी",      commodity_en:"Okra",         category:"सब्जियां",       min_price:2500, max_price:4500, modal_price:3200, change:300,  trend:"up",   unit:"रु./क्विंटल" },
    { commodity:"हरी मिर्च",  commodity_en:"Green Chilli", category:"सब्जियां",       min_price:3000, max_price:5500, modal_price:4200, change:-200, trend:"down", unit:"रु./क्विंटल" },
    { commodity:"पत्तागोभी",  commodity_en:"Cabbage",      category:"सब्जियां",       min_price:1000, max_price:1900, modal_price:1400, change:0,    trend:"same", unit:"रु./क्विंटल" },
    { commodity:"गाजर",       commodity_en:"Carrot",       category:"सब्जियां",       min_price:2200, max_price:3800, modal_price:2900, change:400,  trend:"up",   unit:"रु./क्विंटल" },
    { commodity:"लहसुन",      commodity_en:"Garlic",       category:"सब्जियां",       min_price:6000, max_price:10000,modal_price:7800, change:-500, trend:"down", unit:"रु./क्विंटल" },
    { commodity:"अदरक",       commodity_en:"Ginger",       category:"सब्जियां",       min_price:4000, max_price:8000, modal_price:5500, change:600,  trend:"up",   unit:"रु./क्विंटल" },
    { commodity:"मूली",       commodity_en:"Radish",       category:"सब्जियां",       min_price:800,  max_price:1800, modal_price:1200, change:0,    trend:"same", unit:"रु./क्विंटल" },
    { commodity:"पालक",       commodity_en:"Spinach",      category:"पत्तेदार सब्जी", min_price:1200, max_price:2400, modal_price:1700, change:100,  trend:"up",   unit:"रु./क्विंटल" },
    { commodity:"मटर",        commodity_en:"Green Peas",   category:"सब्जियां",       min_price:2800, max_price:4800, modal_price:3600, change:-300, trend:"down", unit:"रु./क्विंटल" },
    { commodity:"शिमला मिर्च",commodity_en:"Capsicum",     category:"सब्जियां",       min_price:3500, max_price:6500, modal_price:4800, change:200,  trend:"up",   unit:"रु./क्विंटल" },
    { commodity:"लौकी",       commodity_en:"Bottle Gourd", category:"सब्जियां",       min_price:900,  max_price:1800, modal_price:1300, change:0,    trend:"same", unit:"रु./क्विंटल" },
    { commodity:"करेला",      commodity_en:"Bitter Gourd", category:"सब्जियां",       min_price:2000, max_price:3800, modal_price:2800, change:150,  trend:"up",   unit:"रु./क्विंटल" },
    { commodity:"खीरा",       commodity_en:"Cucumber",     category:"सब्जियां",       min_price:1000, max_price:2200, modal_price:1500, change:0,    trend:"same", unit:"रु./क्विंटल" }
  ];

  /* ── Demo / Fallback crop data ────────────────────────────── */
  var CROP_DEMO_DATA = [
    { commodity:"गेहूं",     commodity_en:"Wheat",       category:"अनाज",     min_price:2200, max_price:2600, modal_price:2400, change:50,   trend:"up",   unit:"रु./क्विंटल", is_mp:true,  district:"मध्य प्रदेश" },
    { commodity:"सोयाबीन",  commodity_en:"Soybean",     category:"तिलहन",    min_price:4500, max_price:5200, modal_price:4900, change:-100, trend:"down", unit:"रु./क्विंटल", is_mp:true,  district:"मध्य प्रदेश" },
    { commodity:"मक्का",    commodity_en:"Maize",       category:"अनाज",     min_price:1900, max_price:2400, modal_price:2100, change:0,    trend:"same", unit:"रु./क्विंटल", is_mp:true,  district:"मध्य प्रदेश" },
    { commodity:"चना",      commodity_en:"Chickpea",    category:"दलहन",     min_price:5000, max_price:5800, modal_price:5400, change:200,  trend:"up",   unit:"रु./क्विंटल", is_mp:true,  district:"मध्य प्रदेश" },
    { commodity:"सरसों",    commodity_en:"Mustard",     category:"तिलहन",    min_price:5200, max_price:6100, modal_price:5700, change:150,  trend:"up",   unit:"रु./क्विंटल", is_mp:true,  district:"मध्य प्रदेश" },
    { commodity:"अरहर",     commodity_en:"Pigeon Pea",  category:"दलहन",     min_price:6800, max_price:7800, modal_price:7200, change:-50,  trend:"down", unit:"रु./क्विंटल", is_mp:true,  district:"मध्य प्रदेश" },
    { commodity:"उड़द",     commodity_en:"Black Gram",  category:"दलहन",     min_price:7000, max_price:8200, modal_price:7600, change:0,    trend:"same", unit:"रु./क्विंटल", is_mp:true,  district:"मध्य प्रदेश" },
    { commodity:"मूंग",     commodity_en:"Green Gram",  category:"दलहन",     min_price:7200, max_price:8500, modal_price:7900, change:300,  trend:"up",   unit:"रु./क्विंटल", is_mp:true,  district:"मध्य प्रदेश" },
    { commodity:"धान",      commodity_en:"Paddy",       category:"अनाज",     min_price:2200, max_price:2600, modal_price:2400, change:0,    trend:"same", unit:"रु./क्विंटल", is_mp:false, district:"भारत" },
    { commodity:"बाजरा",    commodity_en:"Pearl Millet",category:"अनाज",     min_price:2100, max_price:2700, modal_price:2400, change:100,  trend:"up",   unit:"रु./क्विंटल", is_mp:false, district:"भारत" },
    { commodity:"ज्वार",    commodity_en:"Jowar",       category:"अनाज",     min_price:2600, max_price:3200, modal_price:2900, change:0,    trend:"same", unit:"रु./क्विंटल", is_mp:false, district:"भारत" },
    { commodity:"कपास",     commodity_en:"Cotton",      category:"नकदी फसल", min_price:6500, max_price:7500, modal_price:7000, change:-200, trend:"down", unit:"रु./क्विंटल", is_mp:false, district:"भारत" },
    { commodity:"जौ",       commodity_en:"Barley",      category:"अनाज",     min_price:1800, max_price:2300, modal_price:2050, change:80,   trend:"up",   unit:"रु./क्विंटल", is_mp:false, district:"भारत" },
    { commodity:"मसूर",     commodity_en:"Lentil",      category:"दलहन",     min_price:6200, max_price:7400, modal_price:6800, change:-80,  trend:"down", unit:"रु./क्विंटल", is_mp:false, district:"भारत" },
    { commodity:"मूंगफली",  commodity_en:"Groundnut",   category:"तिलहन",    min_price:5400, max_price:6500, modal_price:5900, change:100,  trend:"up",   unit:"रु./क्विंटल", is_mp:false, district:"भारत" },
    { commodity:"तिल",      commodity_en:"Sesame",      category:"तिलहन",    min_price:13000,max_price:16000,modal_price:14500,change:500,  trend:"up",   unit:"रु./क्विंटल", is_mp:false, district:"भारत" },
    { commodity:"सूरजमुखी", commodity_en:"Sunflower",   category:"तिलहन",    min_price:5800, max_price:6800, modal_price:6300, change:0,    trend:"same", unit:"रु./क्विंटल", is_mp:false, district:"भारत" },
    { commodity:"गन्ना",    commodity_en:"Sugarcane",   category:"नकदी फसल", min_price:360,  max_price:410,  modal_price:385,  change:10,   trend:"up",   unit:"रु./क्विंटल", is_mp:false, district:"भारत" }
  ];

  /* ── Expose public API ────────────────────────────────────── */
  root.BhavAPI.fetchVegetables = fetchVegetables;
  root.BhavAPI.fetchCrops      = fetchCrops;
  root.BhavAPI.VEG_DEMO_DATA   = VEG_DEMO_DATA;
  root.BhavAPI.CROP_DEMO_DATA  = CROP_DEMO_DATA;

}(window));
