const FARMER_PRICES_URL = "https://farmer.in/api/open/prices.json";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "केवल GET request स्वीकार है।" });
  }

  try {
    const upstream = await fetch(FARMER_PRICES_URL, {
      headers: { Accept: "application/json" }
    });
    if (!upstream.ok) return response.status(upstream.status).json({ error: "किसान बाजार API ने " + upstream.status + " response दिया।" });
    const payload = await upstream.json();
    const commodities = Array.isArray(payload.commodities) ? payload.commodities : [];
    const records = commodities.filter((item) => Array.isArray(item.major_states) && item.major_states.includes("Madhya Pradesh")).map((item) => ({
      commodity: item.hindi || item.name,
      commodity_en: item.name,
      market: "मध्य प्रदेश क्षेत्रीय भाव",
      district: "मध्य प्रदेश",
      min_price: item.min,
      max_price: item.max,
      modal_price: item.price,
      category: item.category,
      change: item.change,
      trend: item.trend,
      season: item.season,
      description: item.description,
      unit: item.unit === "quintal" ? "रु./क्विंटल" : item.unit,
      arrival_date: item.updated,
      source: payload.source,
      source_url: payload.website
    }));
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return response.status(200).json({ records, source: payload.source, attribution: payload.attribution, updated: payload.updated, districtLevel: false });
  } catch (error) {
    return response.status(502).json({ error: "सरकारी बाजार API तक पहुंच नहीं हो सकी।", detail: error.message });
  }
}
