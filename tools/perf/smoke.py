"""Enter maps and report page errors + whether frames keep coming. python3 smoke.py [q=low] map…"""
import asyncio,time,sys
from playwright.async_api import async_playwright
async def main(q,maps):
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':720});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:300]));pg.on('console',lambda m:errs.append('console: '+m.text[:200]) if m.type=='error' else None)
        await pg.goto('http://localhost:8765/index.html?char=wolf&map=frostheim&nosw=1&cb=%d'%time.time());await pg.wait_for_timeout(7000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()");await pg.wait_for_timeout(9000)
        if q: await pg.evaluate("(q)=>{Q=QUALITY[q];resize();}",q)
        for m in maps:
            await pg.evaluate("id=>{window.__n=0;enterMap(id);const r0=window.__r0||render;window.__r0=r0;render=function(){__n++;r0();};}",m);await pg.wait_for_timeout(6000)
            print(m,'frames in 6 s:',await pg.evaluate("__n"),'· errors so far',len(errs))
        for e in errs[:8]: print('  ',e)
        await b.close()
a=sys.argv[1:];q=None
if a and a[0].startswith('q='): q=a.pop(0)[2:]
asyncio.run(main(q,a))
