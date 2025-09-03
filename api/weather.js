export default async function handler(req, res) {
  const city = (req.query.city || 'Jakarta');
  const key = process.env.OPENWEATHER_KEY || null;
  if(!key){
    return res.status(200).json({source:'dummy', city, temp:29, condition:'Cerah berawan'});
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${key}`;
    const r = await fetch(url);
    const j = await r.json();
    return res.status(200).json({source:'openweather', city, temp:j.main.temp, condition:j.weather[0].description});
  } catch(e){ return res.status(500).json({error:String(e)}); }
}
