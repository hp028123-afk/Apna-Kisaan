/* ================================================================
   api/market.js  —  Vercel Serverless Function
   General market proxy → farmer.in, filtered to Madhya Pradesh.
   Also supports ?type=vegetable or ?type=crop query params.
   ================================================================ */

const FARMER_PRICES_URL = "https://farmer.in/api/open/prices.json";

const VEG_KEYWORDS = [
  "tomato","onion","potato","brinjal","eggplant","cauliflower","cabbage",
  "okra","ladyfinger","carrot","radish","spinach","peas","beans","cucumber",
  "gourd","capsicum","chilli","coriander","ginger","garlic","mushroom",
  "turnip","beetroot","pumpkin","tinda","parwal","methi","palak","bhindi",
  "baingan","shimla"
];

const CROP_KEYWORDS = [
  "wheat","rice","paddy","maize","corn","soybean","soya","soyabean","mustard",
  "cotton","sugarcane","jowar","bajra","barley","chana","gram","chickpea",
  "lentil","masoor","arhar","toor","moong","urad","groundnut","sesame","til",
  "sunflower","safflower","jute","tobacco","ragi"
];

const MP_CROPS = [
  "soybean","soya","soyabean","wheat","gram","chana","chickpea","mustard",
  "maize","corn","arhar","toor","moong","urad","linseed","til","sesame",
  "groundnut","cotton","paddy","ragi"
];

function isVeg(name) { return VEG_KEYWORDS.some(k => name.includes(k)); }
function isCrop(name) { return CROP_KEYWORDS.some(k => name.includes(k)); }

function isMP(item) {
  if (Array.isArray(item.major_states)) {
    const states = item.major_states.map(s => s.toLowerCase());
    if (states.some(s => s.includes("madhya") || s === "mp")) return true;
  }
  const name = (item.name || "").toLowerCase();
  return MP_CROPS.some(k => name.includes(k));
}

function normTrend(raw) {
  if (!raw) return "same";
  const t = String(raw).toLowerCase();
  if (t === "up"   || t === "increase" || t === "rise")  return "up";
  if (t === "down" || t === "decrease" || t === "fall")  return "down";
  return "same";
}

function normUnit(u) {
  if (!u) return "रु./क्विंटल";
  const l = u.toLowerCase();
  if (l === "quintal" || l === "qtl") return "रु./क्विंटल";
  if (l === "kg")    return "रु./किग्रा";
  if (l === "tonne") return "रु./टन";
  return u;
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "केवल GET request स्वीकार है।" });
  }

  response.setHeader("Access-Control-Allow-Origin",  "*");
  response.setHeader("Access-Control-Allow-Methods", "GET");

  const typeFilter = (request.query && request.query.type) || "";

  try {
    const upstream = await fetch(FARMER_PRICES_URL, {
      headers: { Accept: "application/json" }
    });
    if (!upstream.ok) {
      return response.status(upstream.status).json({
        error: "किसान बाजार API ने " + upstream.status + " response दिया।"
      });
    }

    const payload     = await upstream.json();
    const commodities = Array.isArray(payload.commodities) ? payload.commodities : [];

    const records = commodities
      .filter(item => {
        const name = (item.name || "").toLowerCase();
        /* Apply type filter if provided */
        if (typeFilter === "vegetable") return isVeg(name);
        if (typeFilter === "crop")      return isCrop(name);
        /* Default: everything that is relevant to MP */
        return isMP(item);
      })
      .map(item => {
        const name  = (item.name || "").toLowerCase();
        const mpFlag = isMP(item);
        return {
          commodity:    item.hindi  || item.name || "—",
          commodity_en: item.name  || "—",
          market:       "मध्य प्रदेश क्षेत्रीय भाव",
          district:     mpFlag ? "मध्य प्रदेश" : "भारत",
          min_price:    item.min   ?? null,
          max_price:    item.max   ?? null,
          modal_price:  item.price ?? null,
          category:     item.category || (isVeg(name) ? "सब्जियां" : "फसल"),
          change:       item.change ?? 0,
          trend:        normTrend(item.trend),
          season:       item.season || "मौसम के अनुसार",
          description:  item.description || "मध्य प्रदेश में इस फसल की खेती और बाजार मांग के अनुसार भाव बदल सकता है।",
          unit:         normUnit(item.unit),
          arrival_date: item.updated || new Date().toISOString().slice(0, 10),
          is_mp:        mpFlag,
          major_states: item.major_states || []
        };
      });

    /* Sort: MP first */
    records.sort((a, b) => (b.is_mp ? 1 : 0) - (a.is_mp ? 1 : 0));

    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return response.status(200).json({
      records,
      total:         records.length,
      source:        payload.source      || "farmer.in",
      attribution:   payload.attribution || "Powered by farmer.in Open Agriculture Data",
      updated:       payload.updated     || new Date().toISOString(),
      districtLevel: false
    });

  } catch (error) {
    console.error("[market API]", error);
    return response.status(502).json({
      error:  "सरकारी बाजार API तक पहुंच नहीं हो सकी।",
      detail: error.message
    });
  }
}
