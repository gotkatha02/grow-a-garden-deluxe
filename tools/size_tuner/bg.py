import asyncio, time, sys, json
from playwright.async_api import async_playwright
# bg.py MAP OUTPREFIX [n=3] [W=3200] [H=760] [dpr=1.5] [rowf=.70] [seed=1] [at=mx,my;mx,my] : ground strips of a map for the size tuner
# (game served on localhost:8765; player kept off screen by CAM_BIAS, monsters cleared, HUD hidden, vignette off; writes OUTPREFIX_<i>.png + OUTPREFIX.json)
mp = sys.argv[1]; out = sys.argv[2]; kw = dict(a.split('=', 1) for a in sys.argv[3:])
N = int(kw.get('n', '3')); W = int(kw.get('W', '3200')); H = int(kw.get('H', '760')); DPR = float(kw.get('dpr', '1.5')); ROWF = float(kw.get('rowf', '.70'))
INIT = """(()=>{try{localStorage.setItem('af_char','wolf');localStorage.setItem('af_prog_v1_wolf',JSON.stringify({v:1,mode:'test',save:{map:'%s'}}));}catch(e){}})();""" % mp
SETUP = r"""()=>{window.__bgI=setInterval(()=>{try{enemies.length=0;perfT=0;perfBad=0;}catch(e){}},25);
  try{Q=QUALITY.high;resize();}catch(e){}
  try{const g=vignette.getContext('2d');g.clearRect(0,0,vignette.width,vignette.height);}catch(e){}
  const st=document.createElement('style');st.textContent='.__hid{visibility:hidden!important;opacity:0!important}';document.head.appendChild(st);
  const hide=()=>{const anc=new Set();let e=cvs;while(e){anc.add(e);e=e.parentElement;}for(const el of document.querySelectorAll('body *'))if(!anc.has(el))el.classList.add('__hid');};hide();setInterval(hide,200);
  return {Z,K,DPR,VW,VH,map:curMap,charK:((window.VK_MAPS||{})[curMap]||{}).charK||1,cf:(mapHost()&&mapHost().charFilter)||'',SPR};}"""
SPOTS = r"""(a)=>{const [n,seed]=a;let s=seed*9301+49297;const R=()=>{s=(s*9301+49297)%233280;return s/233280;};
  const h=mapHost(),ok=fieldWalk(h),ms=mapMS(),res=[];
  for(let t=0;t<1500&&res.length<60;t++){const x=400+R()*(h.W-800),y=300+R()*(h.H-600);if(!ok(x,y))continue;
    let c=0,m=0;for(let dx=-1150;dx<=1150;dx+=46){m++;if(ok(x+dx/ms,y))c++;}if(c/m<.93)continue;
    let below=ok(x,y+520*K/ms)?1:0;if(!below)continue;
    let tr=0,tm=0;for(let dx=-1300;dx<=1300;dx+=90)for(const dy of [-180,-300,-420]){tm++;if(!ok(x+dx/ms,y+dy*K/ms))tr++;}
    res.push({x,y,open:c/m,trees:tr/tm});}
  res.sort((a,b)=>Math.abs(a.trees-.3)-Math.abs(b.trees-.3));return res.slice(0,n).map(p=>{const [wx,wy]=M2W(p);return {wx,wy,open:+p.open.toFixed(2),trees:+p.trees.toFixed(2)};});}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--disable-gpu-vsync'])
        pg = await b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=DPR)
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.add_init_script(INIT)
        await pg.goto('http://localhost:8765/index.html?char=wolf&map=%s&nosw=1&guide=0&aura=0&comp=0&cb=%d' % (mp, time.time()))
        for i in range(90):
            await pg.wait_for_timeout(500)
            if await pg.evaluate("(()=>{try{return !!(window.__bootDone&&player&&curMap&&mapHost()&&mapHost().ready)}catch(e){return false}})()") and i > 6: break
        await pg.wait_for_timeout(1500)
        info = await pg.evaluate(SETUP)
        spots = await pg.evaluate(SPOTS, [N, int(kw.get('seed', '1'))])
        if kw.get('at'):
            spots = await pg.evaluate("(L)=>L.map(([x,y])=>{const [wx,wy]=M2W({x,y});return {wx,wy,open:1,trees:0};})", [[float(v) for v in a.split(',')] for a in kw['at'].split(';')])
        print(mp, info, len(spots))
        meta = []
        for i, sp in enumerate(spots):
            camY = sp['wy'] - (ROWF - .5) * info['VH'] / (info['K'] * info['Z'])
            await pg.evaluate("(a)=>{const [x,y,cy]=a;player.x=x;player.y=y+600;player.moveT=null;player.attackTarget=null;window.CAM_BIAS={x:0,y:cy-(y+600)};cam.x=x;cam.y=cy;}", [sp['wx'], sp['wy'], camY])
            await pg.wait_for_timeout(7000)
            r = await pg.evaluate("(a)=>{const [x,y]=a;const q=P(x,y,0);return {row:[q[0],q[1]],Z,cam:[cam.x,cam.y],pl:[player.x,player.y]};}", [sp['wx'], sp['wy']])
            fn = '%s_%d.png' % (out, i)
            await pg.screenshot(path=fn)
            meta.append(dict(sp, **r, file=fn)); print(i, sp, r)
        json.dump(dict(info=info, spots=meta), open(out + '.json', 'w'))
        print('errors', errs[:4]); await b.close()
asyncio.run(main())
