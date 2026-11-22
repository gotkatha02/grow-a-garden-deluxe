"""In-game shots of a world-boss arena (maps/wboss-arenas.js). Serve the repo on 8765 first.
python3 tools/fx/arenashot.py ARENA_ID [w=1536 h=864 out=/tmp/arenashot hero=wolf touch=0 hud=0 crowd=1 views=mid,top,camp,all
                                        night=0 grid=0]
views: mid = the boss in the middle · top = the far rim · camp = the guild camp at the bottom · left/right = the sides
       all = the whole map zoomed out (mapTest.zoom so the map fits the screen) · x:y = a map-pixel point
crowd=1 puts 10 copies of the hero round the boss (the real hero is hidden and only anchors the camera)
grid=1 paints the blocked cells red (host debug view)"""
import asyncio, sys, time, json, os
from playwright.async_api import async_playwright
ID = sys.argv[1]; A = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
W = int(A.get('w', 1536)); H = int(A.get('h', 864)); HERO = A.get('hero', 'wolf'); OUT = A.get('out', '/tmp/arenashot')
TOUCH = A.get('touch', '0') == '1'; HUD = A.get('hud', '0') == '1'; CROWD = A.get('crowd', '1') == '1'
VIEWS = A.get('views', 'mid,top,camp,all').split(','); GRID = A.get('grid', '0') == '1'
os.makedirs(OUT, exist_ok=True)
INIT = """(()=>{try{const h=%s;localStorage.setItem('af_prog_v1_'+h,JSON.stringify({v:1,mode:'test',save:{map:%s}}));localStorage.setItem('af_guide_off','1');}catch(e){}})()""" % (json.dumps(HERO), json.dumps(ID))
SETUP = r"""([hud,crowd,grid])=>{
 try{perfHold=1e9;Q=QUALITY.high;}catch(e){}
 if(!hud){const st=document.createElement('style');st.textContent='body > *:not(#c){visibility:hidden !important}';document.head.appendChild(st);}
 const h=mapTest.host,c=VK_MAPS[mapTest.cur]||{};if(grid)h.debug=true;
 fx.push({layer:'none',update(){enemies.length=0;return true;},draw(){}});
 const orig=drawPlayer;let inCopy=false;drawPlayer=function(){if(inCopy)return orig.apply(this,arguments);};
 const b=(c.land||[]).find(l=>l.preview&&/^wbBoss/.test(l.n))||{x:c.W/2,y:c.H*.45};const [bx,by]=M2W({x:b.x,y:b.y});
 const spots=crowd?[[-300,40],[-200,150],[-60,230],[90,240],[230,160],[320,30],[-330,-120],[330,-150],[-120,330],[160,330]]:[];
 for(const s of spots)fx.push({layer:'sorted',sy:by+s[1],update(){return true;},draw(){const sx=player.x,sy=player.y,d=player.dir,ph=player.phi;
   player.x=bx+s[0];player.y=by+s[1];const a=Math.atan2(by-player.y,bx-player.x);player.phi=a;player.dir=dirOf(a);
   try{inCopy=true;orig();}finally{inCopy=false;player.x=sx;player.y=sy;player.dir=d;player.phi=ph;}}});
 return {W:h.W,H:h.H,boss:[b.x,b.y],start:h.spawn.start,warps:h.warps.map(w=>[w.id,w.x|0,w.y|0]),ready:h.ready};}"""
LOOK = r"""([mx,my,zm])=>{const [x,y]=M2W({x:mx,y:my});player.x=x;player.y=y;cam.x=x;cam.y=y;mapTest.zoom=zm;return true;}"""
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); ctx = await b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2 if W < 1000 else 1, has_touch=TOUCH, is_mobile=TOUCH)
        pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:240]))
        pg.on('console', lambda m: errs.append('console: ' + m.text[:200]) if m.type == 'error' else None)
        await pg.add_init_script(INIT)
        await pg.goto('http://localhost:8765/index.html?char=%s&map=%s&nosw=1&guide=0&cb=%d' % (HERO, ID, time.time()))
        for _ in range(60):
            await pg.wait_for_timeout(1000)
            if await pg.evaluate('()=>!!(window.mapTest&&mapTest.host&&mapTest.host.ready&&window.__bootDone)'): break
        await pg.wait_for_timeout(1500)
        info = await pg.evaluate(SETUP, [HUD, CROWD, GRID]); print(ID, json.dumps(info))
        Wm, Hm = info['W'], info['H']; bx, by = info['boss']
        for v in VIEWS:
            zm = 1.0
            if v == 'mid': pt = (bx, by - 120)
            elif v == 'top': pt = (Wm / 2, 300)
            elif v == 'camp': pt = (Wm / 2, Hm - 260)
            elif v == 'left': pt = (420, Hm / 2)
            elif v == 'right': pt = (Wm - 420, Hm / 2)
            elif v == 'all': pt = (Wm / 2, Hm / 2); zm = .5
            else: x, y = v.split(':'); pt = (float(x), float(y))
            await pg.evaluate(LOOK, [pt[0], pt[1], zm]); await pg.wait_for_timeout(2200)
            out = f'{OUT}/{ID}_{v.replace(":", "-")}.png'; await pg.screenshot(path=out); print(out)
        print('errors', errs[:6])
        await b.close()
asyncio.run(main())
