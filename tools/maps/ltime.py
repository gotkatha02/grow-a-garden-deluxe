"""Layout cost of maps: long main-thread tasks while a map is entered (first visit and re-entry).
python3 ltime.py map1 map2 ... [port=8765]"""
import asyncio, sys, time
from playwright.async_api import async_playwright
args = [a for a in sys.argv[1:] if '=' not in a]; kv = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
PORT = int(kv.get('port', 8765))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 720}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('http://localhost:%d/index.html?char=wolf&map=frostheim&nosw=1&guide=0&cb=%d' % (PORT, time.time())); await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()"); await pg.wait_for_timeout(6000)
        await pg.evaluate("""()=>{window.__LT=[];new PerformanceObserver(l=>{for(const e of l.getEntries())__LT.push([e.startTime,e.duration]);}).observe({type:'longtask',buffered:false});}""")
        for rnd in (1, 2):
            for m in args:
                t0 = await pg.evaluate("id=>{const t=performance.now();enterMap(id);window.__T0=t;return t;}", m)
                t = time.time()
                while time.time() - t < 40:
                    await pg.wait_for_timeout(100)
                    if await pg.evaluate("(()=>{const h=mapHosts[curMap];return !!(h&&(h.ready||h.failed));})()"): break
                r = await pg.evaluate("()=>{const t=performance.now();const L=__LT.filter(e=>e[0]>=__T0-5);__LT.length=0;return {wall:Math.round(t-__T0),max:Math.round(Math.max(0,...L.map(e=>e[1]))),sum:Math.round(L.reduce((a,e)=>a+e[1],0)),n:enemies.length};}")
                print(f"round {rnd} {m:9s} ready after {r['wall']} ms · longest task {r['max']} ms · long tasks total {r['sum']} ms · monsters {r['n']}", flush=True)
                await pg.wait_for_timeout(1500)
            # force re-layout on the next round: drop the hosts
            await pg.evaluate("()=>{for(const k in mapHosts){if(k!==curMap){try{mapHosts[k].release()}catch(e){};delete mapHosts[k];}}}")
        if errs: print('ERR', errs[:4])
        await b.close()
asyncio.run(main())
