"""Data consistency in one page: warps, monster tables and their pictures, item icons."""
import asyncio,time,json
from playwright.async_api import async_playwright
JS=r"""async()=>{const out={};const M=window.VK_MAPS||{},MON=window.VK_MONS||{};
  // warps: target map exists, and the arrival warp exists on the target
  const w=[];for(const id in M)for(const p of (M[id].warps||[])){if(!p.to)continue;if(!MAPDEF[p.to]){w.push(id+'.'+p.id+' -> missing map '+p.to);continue;}const T=M[p.to];if(T&&p.at&&!(T.warps||[]).some(q=>q.id===p.at))w.push(id+'.'+p.id+' -> '+p.to+' has no warp "'+p.at+'"');
    if(T&&p.at){const back=(T.warps||[]).find(q=>q.id===p.at);if(back&&back.to!==id)w.push(id+'.'+p.id+' -> '+p.to+'.'+p.at+' leads to '+back.to+' (not back)');}}
  out.warps=w;
  // maps nobody can walk to
  const reach=new Set();for(const id in M)for(const p of (M[id].warps||[]))if(p.to)reach.add(p.to);out.noWayIn=Object.keys(M).filter(id=>!reach.has(id));
  // monsters per map: definition + picture
  const kinds={};for(const id in MON){const L=MON[id];const arr=Array.isArray(L)?L:(L.list||L.mons||Object.values(L));for(const m of arr){const k=typeof m==='string'?m:(m&&(m.k||m.kind||m.id||m.n||m.type));if(k)(kinds[k]=kinds[k]||[]).push(id);}}
  out.monKinds=Object.keys(kinds).length;out.sample=JSON.stringify(MON[Object.keys(MON)[0]]).slice(0,300);
  out.globals=['MS','MSPR_HAS','MCAT','MONCAT','MON_CAT','ENEMY_TYPES','ETYPE','MONS','MONDEF','VK_MONDEF','MON_KINDS'].filter(n=>{try{return eval('typeof '+n)!=='undefined';}catch(e){return false;}});
  return out;}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':720});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
        await pg.goto('http://localhost:8765/index.html?char=wolf&map=frostheim&nosw=1&cb=%d'%time.time());await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()");await pg.wait_for_timeout(6000)
        r=await pg.evaluate(JS);print('warp problems',len(r['warps']));[print('  ',x) for x in r['warps'][:30]]
        print('maps with no warp leading in:',r['noWayIn']);print('monster kinds',r['monKinds']);print('sample',r['sample']);print('globals',r['globals']);print('errors',errs[:3]);await b.close()
asyncio.run(main())
