// api/tiktok.js
export default async function handler(req, res) {
  try {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "RAPIDAPI_KEY belum di set" });
    }

    const url = "https://tiktok-scraper7.p.rapidapi.com/trending/feed";
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "tiktok-scraper7.p.rapidapi.com"
      }
    });

    const data = await resp.json();
    const keywords = (data.data || []).map(v => v.title).slice(0, 5);

    res.status(200).json({ source: "tiktok", keywords });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
