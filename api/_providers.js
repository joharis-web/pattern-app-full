// Providers helper - returns dummy data if real APIs not configured.
async function fetchJson(url){
  const resp = await fetch(url);
  if(!resp.ok) throw new Error('HTTP '+resp.status);
  return await resp.json();
}

async function fetchYouTubeTrending(limit=6){
  const key = process.env.YT_API_KEY || null;
  if(!key) {
    return Array.from({length:limit}).map((_,i)=>({title:`Dummy YT Title ${i+1}`}));
  }
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=ID&maxResults=${limit}&key=${key}`;
  try {
    const j = await fetchJson(url);
    return (j.items||[]).map(it=>({title: it.snippet.title, channel: it.snippet.channelTitle}));
  }catch(e){ console.warn('YT fail',e); return Array.from({length:limit}).map((_,i)=>({title:`Fallback YT ${i+1}`})); }
}

async function fetchGoogle(q='trending', limit=6){
  const custom = process.env.GOOGLE_CUSTOM_SEARCH_URL || null;
  if(custom){
    try{
      const url = custom + '?q=' + encodeURIComponent(q) + '&limit=' + limit;
      const j = await fetchJson(url);
      return j.items || [];
    }catch(e){ console.warn('custom google fail',e); }
  }
  return Array.from({length:limit}).map((_,i)=>({title:`Dummy Google ${i+1} for ${q}`}));
}

async function fetchTikTok(limit=6){
  const custom = process.env.TIKTOK_CUSTOM_URL || null;
  if(custom){
    try{
      const url = custom + '?limit=' + limit;
      const j = await fetchJson(url);
      return j.items || [];
    }catch(e){ console.warn('custom tiktok fail',e); }
  }
  return Array.from({length:limit}).map((_,i)=>({title:`Dummy TikTok ${i+1}`}));
}

module.exports = { fetchYouTubeTrending, fetchGoogle, fetchTikTok };
