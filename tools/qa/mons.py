import asyncio,time,json
from playwright.async_api import async_playwright
JS=r"""async()=>{const MON=window.VK_MONS||{},MS=window.MSPR||{},CAT=window.MONCAT||{},MAP=window.MONCAT_MAP||{};const out={noSprite:[],urls:[]};const seen=new Set();let total=0;
  for(const id in MON)for(const m of MON[id]){total++;if(!m.name){out.noSprite.push(id+': entry without a name');continue;}if(!MS[m.name]){out.noSprite.push(id+': '+m.name+' (base '+m.base+')');continue;}
    if(seen.has(m.name))continue;seen.add(m.name);const d=MS[m.name];
    if(d.file){out.urls.push('assets/monsters/'+d.file+'.webp');if(d.walk)out.urls.push('assets/monsters/'+d.file+'_walk.webp');}
    else if(MAP[m.name]){const c=CAT[MAP[m.name]];const fs=Object.values(c||{}).filter(a=>a&&a.f).map(a=>'assets/monsters/'+a.f+'.webp');out.urls.push(...fs);if(!fs.length)out.noAn=(out.noAn||[]).concat([m.name]);}
    else out.other=(out.other||[]).concat([m.name]);}
  out.total=total;out.kinds=seen.size;out.catSample=JSON.stringify(CAT[Object.keys(CAT)[0]]).slice(0,260);
  const bad=[];let ok=0;const U=[...new Set(out.urls)];for(let i=0;i<U.length;i+=24){await Promise.all(U.slice(i,i+24).map(u=>fetch(u,{method:'HEAD'}).then(r=>{if(r.ok)ok++;else bad.push(u+' '+r.status);}).catch(e=>bad.push(u+' ERR'))));}
  out.urlN=U.length;out.ok=ok;out.bad=bad;delete out.urls;
  // levels: monsters' level ranges inside a map vs the map's level
  const lv=[];for(const id in MON){const c=(window.VK_MAPS||{})[id];for(const m of MON[id]){if(!m.lv||m.lv[0]>m.lv[1])lv.push(id+': '+m.name+' lv '+JSON.stringify(m.lv));}}out.lv=lv;return out;}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page();await pg.goto('http://localhost:8765/index.html?char=wolf&map=frostheim&nosw=1&cb=%d'%time.time());await pg.wait_for_timeout(6000)
        r=await pg.evaluate(JS);print(json.dumps({k:(v if not isinstance(v,list) else v[:14]) for k,v in r.items()},ensure_ascii=False,indent=0)[:2400]);print('counts',{k:len(v) for k,v in r.items() if isinstance(v,list)});await b.close()
asyncio.run(main())
