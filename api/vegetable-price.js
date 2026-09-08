/* ================================================================
   api/vegetable-price.js  —  Vercel Serverless Function
   Proxies farmer.in API and filters for vegetable commodities.
   Deployed path: /api/vegetable-price
   ================================================================ */

const FARMER_API_URL = "https://farmer.in/api/open/prices.json";

/* Categories / keywords that identify vegetables */
const VEG_CATEGORIES = [
  "vegetable", "vegetables", "sabji", "sabzi",
  "greens", "leafy", "root vegetable", "spice"
];

/* English names that are vegetables (catch-all for uncategorised entries) */
const VEG_KEYWORDS = [
  "tomato", "onion", "potato", "brinjal", "eggplant", "cauliflower",
  "cabbage", "okra", "ladyfinger", "carrot", "radish", "spinach",
  "peas", "beans", "cucumber", "gourd", "capsicum", "chilli", "chili",
  "coriander", "ginger", "garlic", "mushroom", "turnip", "beetroot",
  "pumpkin", "bitter", "bottle", "ridge", "snake", "tinda", "parwal",
  "arbi", "yam", "colocasia", "drumstick", "moringa", "fenugreek",
  "mint", "celery", "leek", "broccoli", "asparagus", "methi", "palak",
  "bhindi", "baingan", "shimla"
];

/* Words that flag something as a CROP (exclude from vegetable page) */
const CROP_KEYWORDS = [
  "wheat", "rice", "paddy", "maize", "soybean", "soya", "mustard",
  "cotton", "sugarcane", "jowar", "bajra", "barley", "gram", "chana",
  "lentil", "groundnut", "sesame", "sunflower", "jute", "tobacco",
  "arhar", "moong", "urad", "tur", "ragi"
];

function isVegetable(item) {
  const cat = (item.category || "").toLowerCase();
  const name = (item.name || "").toLowerCase();

  /* Explicit crop → exclude */
  if (CROP_KEYWORDS.some(k => name.includes(k))) return false;

  /* Explicit vegetable category → include */
  if (VEG_CATEGORIES.some(k => cat.includes(k))) return true;

  /* Name-based vegetable match → include */
  if (VEG_KEYWORDS.some(k => name.includes(k))) return true;

  return false;
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
  if (lower === "kg")      return "रु./किग्रा";
  if (lower === "tonne")   return "रु./टन";
  return u;
}

export default async function handler(req, res) {
  /* Only allow GET */
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "केवल GET request स्वीकार है।" });
  }

  /* CORS — allow same origin and direct browser calls */
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

    const payload = await upstream.json();
    const commodities = Array.isArray(payload.commodities) ? payload.commodities : [];

    const records = commodities
      .filter(isVegetable)
      .map(item => ({
        commodity:    item.hindi  || item.name || "—",
        commodity_en: item.name  || "—",
        category:     item.category || "सब्जियां",
        min_price:    item.min   ?? null,
        max_price:    item.max   ?? null,
        modal_price:  item.price ?? null,
        change:       item.change ?? 0,
        trend:        normaliseTrend(item.trend),
        unit:         normaliseUnit(item.unit),
        arrival_date: item.updated || new Date().toISOString().slice(0, 10),
        season:       item.season  || "",
        description:  item.description || "",
        market_count: item.market_count || null,
        major_states: item.major_states || []
      }));

    /* Cache for 5 min on CDN, serve stale for 10 min */
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

    return res.status(200).json({
      records,
      total:       records.length,
      source:      payload.source      || "farmer.in",
      attribution: payload.attribution || "Powered by farmer.in Open Agriculture Data",
      updated:     payload.updated     || new Date().toISOString(),
      website:     payload.website     || "https://farmer.in"
    });

  } catch (err) {
    console.error("[vegetable-price API]", err);
    return res.status(502).json({
      error:  "सब्जी भाव API तक पहुंच नहीं हो सकी।",
      detail: err.message
    });
  }
}
