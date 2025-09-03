import fs from 'fs';
import path from 'path';
import { fetchYouTubeTrending, fetchGoogle, fetchTikTok } from './_providers.js';

function simpleHash(s){ let h=0; for(let i=0;i<s.length;i++){ h=(h<<5)-h + s.charCodeAt(i); h |= 0; } return Math.abs(h); }

export default async function handler(req, res){
  try{
    const dataDir = path.join(process.cwd(),'data');
    const shio = JSON.parse(fs.readFileSync(path.join(dataDir,'shio.json')));
    const zodiak = JSON.parse(fs.readFileSync(path.join(dataDir,'zodiak.json')));
    const erekData = JSON.parse(fs.readFileSync(path.join(dataDir,'erek.json')));
    let keywords = [];
    try{
      const [yt, gg, tt] = await Promise.all([fetchYouTubeTrending(5), fetchGoogle('trending',5), fetchTikTok(5)]);
      yt.forEach(i=>keywords.push(i.title)); gg.forEach(i=>keywords.push(i.title||i.name||'')); tt.forEach(i=>keywords.push(i.title||i.name||''));
    }catch(e){ /* ignore */ }
    if(!keywords.length){
      keywords = ['uang','motor','cicak','tikus','ikan'];
    }
    const base = keywords.join('|') + '|' + new Date().toISOString().slice(0,10);
    const num = String(simpleHash(base)).slice(-4).padStart(4,'0');
    const lowWords = keywords.join(' ').toLowerCase();
    let matched = null;
    for(const k in erekData.erek){
      if(lowWords.includes(k)) { matched = {key:k, vals: erekData.erek[k]}; break; }
    }
    let chosen4d = num;
    let matchLabel = null;
    if(matched){
      const opts = matched.vals['4D']||[];
      if(opts.length) chosen4d = opts[Math.floor(Math.random()*opts.length)];
      matchLabel = matched.key;
    }
    const y = new Date().getFullYear();
    let shioName = Object.keys(shio).find(k=> shio[k].includes(y)) || null;
    if(!shioName){ shioName = Object.keys(shio)[(y-2020)%12]; }
    const today = new Date(); const m = today.getMonth()+1; const d = today.getDate();
    let zodiacName = 'Unknown';
    for(const z of zodiak){
      const [sm, sd] = z.start.split('-').map(Number); const [em, ed] = z.end.split('-').map(Number);
      if(sm <= em){
        if((m>sm || (m===sm && d>=sd)) && (m<em || (m===em && d<=ed))){ zodiacName = z.name; break; }
      } else {
        if((m>sm || (m===sm && d>=sd)) || (m<em || (m===em && d<=ed))){ zodiacName = z.name; break; }
      }
    }
    return res.status(200).json({
      date: new Date().toISOString(),
      number: chosen4d,
      shio: shioName,
      zodiac: zodiacName,
      keywords: keywords.slice(0,8),
      match: matchLabel
    });
  }catch(e){
    return res.status(500).json({error:String(e)});
  }
}
