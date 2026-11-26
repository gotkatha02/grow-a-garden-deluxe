# Time the painting of every ground chunk of a map (software canvas, like tools/perf): max / mean / slowest chunks.  python3 bakeall.py MAP [port] [extra query, e.g. '&isoao=0']
import asyncio, sys, time
from playwright.async_api import async_playwright
MAP = sys.argv[1]; PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8765; XQ = sys.argv[3] if len(sys.argv) > 3 else ''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--disable-gpu", "--disable-accelerated-2d-canvas"]); pg = await b.new_page(viewport={'width': 1280, 'height': 720})
        await pg.goto('http://localhost:%d/index.html?char=wolf&map=frostheim&nosw=1&guide=0&cb=%d%s' % (PORT, time.time(), XQ)); await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()"); await pg.wait_for_timeout(8000)
        await pg.evaluate("id=>enterMap(id)", MAP)
        for _ in range(80):
            await pg.wait_for_timeout(300)
            if await pg.evaluate("(()=>{const h=mapHosts[curMap];return !!(h&&h.ready);})()"): break
        await pg.wait_for_timeout(2000)
        r = await pg.evaluate("""()=>{const h=mapHosts[curMap],CH=h.CH,ni=Math.ceil(h.W/CH),nj=Math.ceil(h.H/CH),t=[];const g=document.createElement('canvas').getContext('2d');
          for(let j=0;j<nj;j+=1)for(let i=0;i<ni;i+=1){const a=performance.now();const c=h._bake(i,j);g.drawImage(c,0,0,1,1);g.getImageData(0,0,1,1);t.push([+(performance.now()-a).toFixed(1),i,j]);}
          t.sort((a,b)=>b[0]-a[0]);const s=t.reduce((x,y)=>x+y[0],0);return {n:t.length,mean:+(s/t.length).toFixed(1),max:t[0],top:t.slice(0,6),p90:t[Math.floor(t.length*.1)][0]};}""")
        print(MAP, PORT, r, flush=True); await b.close()
asyncio.run(main())
