"""Atmosphere before / after, deterministic: same ground + foreground(g,t) drawn by the pushed version (8766) and the working copy (8765),
compared at 1/8 size so loose particles average out. python3 fg.py map…  → out/fg_<map>.png (old | new) for the biggest differences"""
import asyncio,time,sys,base64,io,json,os
from playwright.async_api import async_playwright
import numpy as np
from PIL import Image
os.makedirs('out',exist_ok=True)
JS=r"""async(id)=>{enterMap(id);await new Promise(r=>setTimeout(r,7500));const h=mapHosts[curMap];if(!h||!h.ready)return null;
  const f0=frame;frame=function(){};await new Promise(r=>setTimeout(r,150));
  const c=document.createElement('canvas');c.width=1280;c.height=720;const g=c.getContext('2d');const s=h.spawn&&h.spawn.start||{x:h.W/2,y:h.H/2};
  const X=Math.max(0,Math.min(h.W-1280,Math.round(s.x-640))),Y=Math.max(0,Math.min(h.H-720,Math.round(s.y-360)));const out=[];
  for(let i=0;i<120;i++){g.setTransform(1,0,0,1,-X,-Y);h.drawBase(g,500000,false);if(i%10===9)await new Promise(r=>setTimeout(r,0));}
  for(const night of [false,true]){g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.fillStyle='#777';g.fillRect(0,0,1280,720);g.setTransform(1,0,0,1,-X,-Y);h.drawBase(g,500000,night);
    for(let k=0;k<3;k++){g.setTransform(1,0,0,1,-X,-Y);if(k==2){g.save();h.foreground(g,500000+k*16,night);g.restore();}else{const c2=document.createElement('canvas');c2.width=1280;c2.height=720;const g2=c2.getContext('2d');g2.setTransform(1,0,0,1,-X,-Y);h.foreground(g2,500000+k*16,night);}}
    out.push(c.toDataURL('image/jpeg',.93));}
  frame=f0;requestAnimationFrame(frame);return out;}"""
async def one(pw,port,maps,tag,res):
    b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':720});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:%d/index.html?char=wolf&map=frostheim&nosw=1&cb=%d'%(port,time.time()));await pg.wait_for_timeout(6000)
    await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()");await pg.wait_for_timeout(9000)
    await pg.evaluate("()=>{Q=QUALITY.high;resize();setInterval(()=>{try{perfT=-1e9;}catch(e){}},50);}")
    for m in maps:
        try:
            r=await pg.evaluate(JS,m)
            if r: res.setdefault(m,{})[tag]=[Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB') for u in r]
        except Exception as e: print(tag,m,'FAILED',str(e)[:160])
    print(tag,'page errors:',errs[:4]);await b.close()
async def main(maps):
    res={}
    async with async_playwright() as pw: await asyncio.gather(one(pw,8766,maps,'old',res),one(pw,8765,maps,'new',res))
    rows=[]
    for m in maps:
        if m not in res or len(res[m])<2: print(m,'missing');continue
        for k,nm in enumerate(['day','night']):
            a,b=res[m]['old'][k],res[m]['new'][k];A=np.asarray(a.resize((160,90),Image.BOX)).astype(float);B=np.asarray(b.resize((160,90),Image.BOX)).astype(float);d=np.abs(A-B).max(axis=2)
            rows.append((d.max(),d.mean(),m,nm));im=Image.new('RGB',(2568,720),'white');im.paste(a,(0,0));im.paste(b,(1288,0));im.resize((1284,360),Image.LANCZOS).save('out/fg_%s_%s.png'%(m,nm))
    rows.sort(reverse=True)
    for mx,mean,m,nm in rows: print(f"{m:10s} {nm:5s} biggest area difference {mx:5.1f}/255 · average {mean:5.2f}")
asyncio.run(main(sys.argv[1:]))
