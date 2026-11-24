"""Screenshots of a map at a few random walkable spots.
python3 shots.py OUT map hero [w=1280 h=720 touch=0 n=4 seed=1 hud=1 port=8765]"""
import asyncio, sys, time, os, random
from playwright.async_api import async_playwright
args = [a for a in sys.argv[1:] if '=' not in a]; kv = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
OUT, MAP, HERO = args[0], args[1], args[2] if len(args) > 2 else 'wolf'
W, H = int(kv.get('w', 1280)), int(kv.get('h', 720)); TOUCH = kv.get('touch', '0') == '1'; N = int(kv.get('n', 4)); SEED = int(kv.get('seed', 1)); PORT = int(kv.get('port', 8765))
os.makedirs(OUT, exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': W, 'height': H}, has_touch=TOUCH, is_mobile=TOUCH, device_scale_factor=1,
                                  user_agent=('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile' if TOUCH else None))
        pg = await ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('http://localhost:%d/index.html?char=%s&map=%s&nosw=1&guide=0&cb=%d' % (PORT, HERO, MAP, time.time())); await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()"); await pg.wait_for_timeout(6000)
        await pg.evaluate("id=>{if(curMap!==id)enterMap(id);}", MAP)
        for _ in range(60):
            await pg.wait_for_timeout(400)
            if await pg.evaluate("(()=>{const h=mapHosts[curMap];return !!(h&&h.ready);})()"): break
        await pg.wait_for_timeout(1500)
        pts = await pg.evaluate("""(seed)=>{let s=seed*9301+49297;const r=()=>{s=(s*9301+49297)%233280;return s/233280;};const h=mapHosts[curMap],out=[];
          for(let i=0;i<4000&&out.length<12;i++){const x=r()*h.W,y=r()*h.H;if(h.isReachable?h.isReachable(x,y):!h.blocked(x,y))out.push([x,y]);}return out;}""", SEED)
        pts = [[None, None]] + pts
        for i, (x, y) in enumerate(pts[:N]):
            if x is not None:
                await pg.evaluate("([x,y])=>{const w=M2W({x,y});player.x=w[0];player.y=w[1];cam.x=player.x;cam.y=player.y;}", [x, y])
            await pg.wait_for_timeout(2600)
            info = await pg.evaluate("""(()=>{const Zs=document.body.classList.contains('mob');let vis=0;const m=W2M(player.x,player.y);for(const e of enemies){if(e.dead)continue;const q=W2M(e.x,e.y);if(Math.abs(q.x-m.x)<VW/2/Z&&Math.abs(q.y-m.y)<VH/2/Z)vis++;}return {vis,Z:+Z.toFixed(3),VW,VH,mob:Zs,x:m.x|0,y:m.y|0};})()""")
            f = os.path.join(OUT, '%s_%s_%d.png' % (MAP, HERO, i)); await pg.screenshot(path=f)
            print(f, info, flush=True)
        if errs: print('ERR', errs[:4])
        await b.close()
asyncio.run(main())
