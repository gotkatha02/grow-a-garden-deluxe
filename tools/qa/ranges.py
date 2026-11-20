import asyncio,time,sys,json
from playwright.async_api import async_playwright
async def one(pw,h,out):
    b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':900,'height':600})
    await pg.goto('http://localhost:8765/index.html?char=%s&map=vikF2&testroom=1&nosw=1&cb=%d'%(h,time.time()));await pg.wait_for_timeout(15000)
    out[h]=await pg.evaluate("""()=>{const o=[];const bar=new Set();for(const t of TABS)for(const k of t.keys)if(k)bar.add(k);for(const k in SKILLS){const s=SKILLS[k];if(s.passive)continue;const r=s.range;const bad=(s.type==='melee'&&!(r>=45))||(s.type==='ground'&&!(r>0))||(!['melee','ground','self','dir','target','buff'].includes(s.type||''));
      if(bad)o.push([k,s.type===undefined?'(no type)':s.type,r===undefined?'none':r,bar.has(k)?'on bar':'-',s.name]);}return {bad:o,types:[...new Set(Object.values(SKILLS).filter(s=>!s.passive).map(s=>s.type))],basic:typeof BASIC_RANGE!=='undefined'?BASIC_RANGE:null};}""");await b.close()
async def main(hs):
    out={}
    async with async_playwright() as pw:
        for i in range(0,len(hs),5): await asyncio.gather(*[one(pw,h,out) for h in hs[i:i+5]])
    for h in hs:
        r=out[h];print(h,'types',r['types'],'basic range',r['basic']);[print('    ',x) for x in r['bad']]
asyncio.run(main(sys.argv[1:]))
