import { fetchYouTubeTrending, fetchGoogle, fetchTikTok } from './_providers.js';

export default async function handler(req, res){
  try{
    const [yt, gg, tt] = await Promise.all([fetchYouTubeTrending(6), fetchGoogle('trending',6), fetchTikTok(6)]);
    const keywords = [];
    yt.forEach(i=> keywords.push(i.title));
    gg.forEach(i=> keywords.push(i.title || i.snippet || i.name || ''));
    tt.forEach(i=> keywords.push(i.title || i.name || ''));
    const uniq = Array.from(new Set(keywords)).slice(0,10).map(s=>String(s).replace(/\n/g,' ').trim()).filter(Boolean);
    return res.status(200).json({source:'aggregated', keywords:uniq});
  }catch(e){
    return res.status(500).json({error:String(e)});
  }
}
