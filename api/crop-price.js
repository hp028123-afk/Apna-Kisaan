/* ================================================================
   api/crop-price.js  —  Vercel Serverless Function
   Proxies farmer.in API, filters for crop/agricultural commodities,
   and flags records relevant to Madhya Pradesh.
   Deployed path: /api/crop-price
   ================================================================ */

const FARMER_API_URL = "https://farmer.in/api/open/prices.json";

/* Crop category keywords */
const CROP_CATEGORIES = [
  "grain", "cereal", "pulse", "oilseed", "cash crop", "spice crop",
  "fiber", "fodder", "plantation", "crop", "fasal"
];

/* English crop name keywords */
const CROP_KEYWORDS = [
  "wheat", "rice", "paddy", "maize", "corn", "soybean", "soya",
  "mustard", "cotton", "sugarcane", "jowar", "bajra", "barley",
  "chana", "gram", "chickpea", "lentil", "masoor", "arhar",
  "toor", "pigeon", "moong", "urad", "black gram", "green gram",
  "groundnut", "peanut", "sesame", "til", "sunflower", "safflower",
  "flax", "linseed", "jute", "hemp", "tobacco", "ragi", "finger",
  "amaranth", "quinoa", "sorghum", "millet", "oat", "triticale",
  "soyabean"
];

/* Words that flag something as a fresh vegetable (exclude from crop page) */
const VEG_EXCLUSIONS = [
  "tomato", "onion", "potato", "brinjal", "cauliflower", "cabbage",
  "okra", "carrot", "radish", "spinach", "cucumber", "capsicum",
  "mushroom", "beetroot", "pumpkin", "tinda", "parwal", "colocasia",
  "drumstick", "fenugreek", "mint", "celery", "leek", "broccoli",
  "bhindi", "baingan", "shimla mirch"
];

/* Crops associated with Madhya Pradesh */
const MP_CROPS = [
  "soybean", "soya", "soyabean", "wheat", "gram", "chana", "chickpea",
  "mustard", "maize", "corn", "arhar", "toor", "moong", "urad",
  "linseed", "til", "sesame", "groundnut", "cotton", "paddy"
];

function isCrop(item) {
  const cat  = (item.category || "").toLowerCase();
  const name = (item.name     || "").toLowerCase();

  /* Explicit vegetable → exclude */
  if (VEG_EXCLUSIONS.some(k => name.includes(k))) return false;

  /* Explicit crop category → include */
  if (CROP_CATEGORIES.some(k => cat.includes(k))) return true;

  /* Name-based crop match → include */
  if (CROP_KEYWORDS.some(k => name.includes(k))) return true;

  return false;
}

function isMP(item) {
  /* Check API's major_states array first */
  if (Array.isArray(item.major_states)) {
    const states = item.major_states.map(s => s.toLowerCase());
    if (states.some(s => s.includes("madhya") || s.includes("mp"))) return true;
  }
  /* Fallback: crop name is a known MP crop */
  const name = (item.name || "").toLowerCase();
  return MP_CROPS.some(k => name.includes(k));
}

function normaliseTrend(raw) {
  if (!raw) return "same";
  const t = String(raw).toLowerCase();
  if (t === "up"   || t === "increase" || t === "rise")  return "up";
  if (t === "down" || t === "decrease" || t === "fall")  return "down";
  return "same";
}

function normaliseUnit(u) {
  if (!u) return "रु./क्विंटल";
  const lower = u.toLowerCase();
  if (lower === "quintal" || lower === "qtl") return "रु./क्विंटल";
  if (lower === "kg")    return "रु./किग्रा";
  if (lower === "tonne") return "रु./टन";
  return u;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "केवल GET request स्वीकार है।" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  try {
    const upstream = await fetch(FARMER_API_URL, {
      headers: { Accept: "application/json" }
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: `farmer.in API ने ${upstream.status} response दिया।`
      });
    }

    const payload    = await upstream.json();
    const commodities = Array.isArray(payload.commodities) ? payload.commodities : [];

    const records = commodities
      .filter(isCrop)
      .map(item => {
        const mpFlag = isMP(item);
        return {
          commodity:    item.hindi  || item.name || "—",
          commodity_en: item.name  || "—",
          category:     item.category || "फसल",
          min_price:    item.min   ?? null,
          max_price:    item.max   ?? null,
          modal_price:  item.price ?? null,
          change:       item.change ?? 0,
          trend:        normaliseTrend(item.trend),
          unit:         normaliseUnit(item.unit),
          arrival_date: item.updated || new Date().toISOString().slice(0, 10),
          season:       item.season  || "",
          description:  item.description || "",
          is_mp:        mpFlag,
          district:     mpFlag ? "मध्य प्रदेश" : "भारत",
          major_states: item.major_states || []
        };
      });

    /* Sort: MP crops first, then others */
    records.sort((a, b) => (b.is_mp ? 1 : 0) - (a.is_mp ? 1 : 0));

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

    return res.status(200).json({
      records,
      total:       records.length,
      mp_count:    records.filter(r => r.is_mp).length,
      source:      payload.source      || "farmer.in",
      attribution: payload.attribution || "Powered by farmer.in Open Agriculture Data",
      updated:     payload.updated     || new Date().toISOString(),
      website:     payload.website     || "https://farmer.in"
    });

  } catch (err) {
    console.error("[crop-price API]", err);
    return res.status(502).json({
      error:  "फसल भाव API तक पहुंच नहीं हो सकी।",
      detail: err.message
    });
  }
}
