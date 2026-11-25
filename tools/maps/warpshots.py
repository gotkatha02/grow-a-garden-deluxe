# Screenshots at every warp of a map (where a hero arrives: 130 px toward the map centre). python3 warpshots.py OUT MAP [w=1280 h=720 touch=0 port=8765]
import asyncio, sys, time, os
from playwright.async_api import async_playwright
args = [a for a in sys.argv[1:] if '=' not in a]; kv = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
OUT, MAP = args[0], args[1]; W, H = int(kv.get('w', 1280)), int(kv.get('h', 720)); TOUCH = kv.get('touch', '0') == '1'; PORT = int(kv.get('port', 8765))
os.makedirs(OUT, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': W, 'height': H}, has_touch=TOUCH, is_mobile=TOUCH, device_scale_factor=1,
                                  user_agent=('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile' if TOUCH else None))
        pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('http://localhost:%d/index.html?char=wolf&map=%s&nosw=1&guide=0&cb=%d' % (PORT, MAP, time.time())); await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()"); await pg.wait_for_timeout(6000)
        await pg.evaluate("id=>{if(curMap!==id)enterMap(id);}", MAP)
        for _ in range(60):
            await pg.wait_for_timeout(400)
            if await pg.evaluate("(()=>{const h=mapHosts[curMap];return !!(h&&h.ready);})()"): break
        ws = await pg.evaluate("(()=>mapHosts[curMap].warps.map(w=>[w.id,w.x,w.y]))()")
        for wid, x, y in ws:
            await pg.evaluate("""([x,y])=>{const h=mapHosts[curMap],W2=h.W/2,H2=h.H/2,d=Math.hypot(W2-x,H2-y)||1;const q={x:x+(W2-x)/d*130,y:y+(H2-y)/d*130};const w=M2W(q);
              player.x=w[0];player.y=w[1];cam.x=player.x;cam.y=player.y;for(const e of enemies){const m=W2M(e.x,e.y);if(Math.hypot(m.x-q.x,m.y-q.y)<700)e.x+=1e5;}}""", [x, y])
            await pg.wait_for_timeout(2800)
            f = os.path.join(OUT, '%s_%s.png' % (MAP, wid)); await pg.screenshot(path=f); print(f, flush=True)
        if errs: print('ERR', errs[:4])
        await b.close()
asyncio.run(main())
