"""Which canvases hold the picture memory: grouped by the code that created them. python3 memtop.py <port> map…"""
import asyncio,time,sys
from playwright.async_api import async_playwright
INIT="""(()=>{const R=window.__CV=[];const ce=document.createElement.bind(document);document.createElement=function(t){const e=ce.apply(document,arguments);if(String(t).toLowerCase()==='canvas'){const L=(new Error().stack.split('\\n').slice(2,4).join(' < ')).replace(/https?:\\/\\/[^/]+\\//g,'').replace(/\\?[^:]*/g,'').replace(/\\s+at\\s+/g,' ');R.push([new WeakRef(e),L.trim()]);}return e;};
  window.__cvTop=()=>{const o={};let tot=0;for(const [r,L] of R){const c=r.deref();if(c){const mb=c.width*c.height*4/1048576;tot+=mb;const q=o[L]||(o[L]=[0,0]);q[0]+=mb;q[1]++;}}return {tot:Math.round(tot),top:Object.entries(o).sort((a,b)=>b[1][0]-a[1][0]).slice(0,14).map(([k,v])=>[k,Math.round(v[0]),v[1]])};};})()"""
async def main(port,maps):
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':1280,'height':720});await ctx.add_init_script(INIT);pg=await ctx.new_page();cdp=await ctx.new_cdp_session(pg)
        await pg.goto('http://localhost:%d/index.html?char=wolf&map=frostheim&nosw=1&cb=%d'%(port,time.time()));await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()");await pg.wait_for_timeout(8000)
        for m in maps:
            await pg.evaluate("id=>enterMap(id)",m);await pg.wait_for_timeout(6000)
        await cdp.send('HeapProfiler.collectGarbage');await pg.wait_for_timeout(300);r=await pg.evaluate("__cvTop()")
        print('total',r['tot'],'MB')
        for k,mb,n in r['top']: print(f"  {mb:5d} MB ×{n:<4d} {k[:150]}")
        await b.close()
a=sys.argv[1:];asyncio.run(main(int(a[0]),a[1:]))
