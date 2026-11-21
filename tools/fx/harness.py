"""Effect test harness (any hero: HERO=axolotl by default). The game loop is stepped by hand (requestAnimationFrame stubbed before load),
test mode is pre-seeded in localStorage so the test room never reloads the page. Serve the repo on 8765 first.
usage (as module): from harness import Game"""
import asyncio,time,json,os,sys
from playwright.async_api import async_playwright
INIT=r"""
(()=>{const R=window.requestAnimationFrame.bind(window);let Q=[];window.__man=false;window.__t=0;
window.requestAnimationFrame=function(cb){if(window.__man){Q.push(cb);return 1;}return R(ts=>{if(window.__man){Q.push(cb);return;}window.__t=ts;cb(ts);});};
window.__step=function(n,dt){for(let i=0;i<n;i++){window.__t+=dt*1000;const q=Q;Q=[];for(const cb of q)cb(window.__t);}return Q.length;};
try{localStorage.setItem('af_tempo','0.75');const h=new URLSearchParams(location.search).get('char')||'axolotl';if(!localStorage.getItem('af_prog_v1_'+h))localStorage.setItem('af_prog_v1_'+h,JSON.stringify({v:1,mode:'test',save:{map:'vikF2'}}));}catch(e){}})();
"""
class Game:
    def __init__(s,hero=None,w=1280,h=720,extra=''):
        hero=hero or os.environ.get('HERO','axolotl')
        s.hero=hero;s.w=w;s.h=h;s.extra=extra;s.errs=[];s.miss=[]
    async def start(s,pw):
        s.b=await pw.chromium.launch(args=['--disable-gpu-vsync'])
        s.pg=await s.b.new_page(viewport={'width':s.w,'height':s.h},device_scale_factor=float(os.environ.get('DSF','1')))   # DSF=2 → sharper close-up frames
        s.pg.on('pageerror',lambda e:s.errs.append(str(e)[:400]))
        s.pg.on('console',lambda m:s.errs.append('console: '+m.text[:300]) if m.type=='error' and 'Failed to load resource' not in m.text else None)
        s.pg.on('response',lambda r:s.miss.append(r.url.split('/',3)[-1].split('?')[0]) if r.status>=400 and 'fonts.g' not in r.url else None)
        await s.pg.add_init_script(INIT)
        await s.pg.goto('http://localhost:8765/index.html?char=%s&map=vikF2&testroom=1&nosw=1&cb=%d%s'%(s.hero,time.time(),s.extra))
        for i in range(60):
            await s.pg.wait_for_timeout(500)
            ok=await s.pg.evaluate("(()=>{try{return !!(document.getElementById('trbar')&&enemies.length>0&&player)}catch(e){return false}})()")
            if ok and i>6: break
        await s.pg.wait_for_timeout(1500)
        await s.pg.evaluate("""()=>{const b=document.getElementById('trbar');if(b)b.style.display='none';
          for(const id of ['hud','hotbar','chat','minimap']){const e=document.getElementById(id);if(e)e.style.visibility='hidden';}
          try{perfHold=1e9;}catch(e){} try{Q=QUALITY.high;}catch(e){} window.__man=true;}""")
        await s.pg.wait_for_timeout(300)
        await s.step(2,1/60)
    async def step(s,n,dt=1/60):
        return await s.pg.evaluate("([n,dt])=>__step(n,dt)",[n,dt])
    async def ev(s,js,arg=None):
        return await s.pg.evaluate(js,arg) if arg is not None else await s.pg.evaluate(js)
    async def shot(s,path,clip=None):
        await s.pg.screenshot(path=path,clip=clip)
    async def close(s):
        await s.b.close()
