const DATA_RESOURCE = "9ef84268-d588-465a-a308-a864a43d0070";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "केवल GET request स्वीकार है।" });
  }

  const apiKey = process.env.DATA_GOV_API_KEY || request.query.apiKey;
  if (!apiKey) {
    return response.status(503).json({ error: "DATA_GOV_API_KEY configure नहीं है। Vercel Environment Variables में इसे जोड़कर redeploy करें।" });
  }

  const query = new URLSearchParams({
    "api-key": apiKey,
    format: "json",
    limit: String(Math.min(Number(request.query.limit) || 500, 1000)),
    "filters[state]": "Madhya Pradesh"
  });
  if (request.query.district) query.set("filters[district]", request.query.district);
  if (request.query.date) query.set("filters[arrival_date]", request.query.date);

  try {
    const upstream = await fetch(`https://api.data.gov.in/resource/${DATA_RESOURCE}?${query.toString()}`, {
      headers: { Accept: "application/json" }
    });
    const payload = await upstream.json();
    response.setHeader("Cache-Control", process.env.DATA_GOV_API_KEY ? "s-maxage=300, stale-while-revalidate=600" : "no-store");
    return response.status(upstream.status).json(payload);
  } catch (error) {
    return response.status(502).json({ error: "सरकारी बाजार API तक पहुंच नहीं हो सकी।", detail: error.message });
  }
}
