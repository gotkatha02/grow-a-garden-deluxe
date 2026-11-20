"""Before / after: same spot drawn by the last pushed version (port 8766) and the working copy (8765).
python3 cmp.py <map…>  → out/cmp_<map>_{old,new}.png screenshots, ground-picture difference, layout equality"""
import asyncio,time,sys,base64,io,json,hashlib,os
from playwright.async_api import async_playwright
import numpy as np
from PIL import Image
os.makedirs('out',exist_ok=True)
GROUND=r"""async()=>{const h=mapHosts[curMap];frame=function(){};await new Promise(r=>setTimeout(r,120));
  const c=document.createElement('canvas');c.width=1400;c.height=900;const g=c.getContext('2d');const out=[];
  const pts=[[h.W*.5,h.H*.5],[h.W*.27,h.H*.3],[h.W*.7,h.H*.66]];
  for(const [x,y] of pts){const X=Math.max(0,Math.min(h.W-1400,Math.round(x-700))),Y=Math.max(0,Math.min(h.H-900,Math.round(y-450)));
    for(let i=0;i<140;i++){g.setTransform(1,0,0,1,-X,-Y);h.drawBase(g,123456,false);if(i%10===9)await new Promise(r=>setTimeout(r,0));}
    g.setTransform(1,0,0,1,0,0);g.fillStyle='#888';g.fillRect(0,0,1400,900);g.setTransform(1,0,0,1,-X,-Y);h.drawBase(g,123456,false);out.push(c.toDataURL('image/png'));}
  const o=(h._objs||[]).map(o=>[Math.round(o.x),Math.round(o.y),Math.round(o.w||0),Math.round(o.h||0),o.k||o.type||o.name||'']);
  return {out,objs:JSON.stringify(o),n:o.length,W:h.W,H:h.H,sp:(h.spawns||[]).length};}"""
async def one(pw,port,maps,tag,res):
    b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':720});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    for m in maps:
        await pg.goto('http://localhost:%d/index.html?char=wolf&map=%s&nosw=1&cb=%d'%(port,m,time.time()));await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()");await pg.wait_for_timeout(11000)
        await pg.evaluate("()=>{Q=QUALITY.high;resize();setInterval(()=>{try{perfT=-1e9;enemies.length=0;}catch(e){}},50);const h=mapHosts[curMap];const s=h.spawn&&h.spawn.start;if(s){player.x=s.x;player.y=s.y;}}")
        await pg.wait_for_timeout(2500);await pg.screenshot(path='out/cmp_%s_%s.png'%(m,tag))
        r=await pg.evaluate(GROUND);ims=[np.asarray(Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')).astype(np.int16) for u in r['out']]
        res.setdefault(m,{})[tag]={'ims':ims,'objs':hashlib.md5(r['objs'].encode()).hexdigest(),'n':r['n'],'W':r['W'],'H':r['H'],'sp':r['sp']}
    if errs: print(tag,'errors',errs[:3])
    await b.close()
async def main(maps):
    res={}
    async with async_playwright() as pw:
        await asyncio.gather(one(pw,8766,maps,'old',res),one(pw,8765,maps,'new',res))
    for m in maps:
        a,b=res[m]['old'],res[m]['new'];same=a['objs']==b['objs']
        ds=[]
        for k,(x,y) in enumerate(zip(a['ims'],b['ims'])):
            d=np.abs(x-y).max(axis=2);ds.append('max %d · mean %.3f · >12: %.2f%%'%(d.max(),d.mean(),(d>12).mean()*100))
            if k==0: Image.fromarray(np.clip(d*8,0,255).astype(np.uint8)).save('out/cmp_%s_grounddiff.png'%m);Image.fromarray(y.astype(np.uint8)).save('out/cmp_%s_ground_new.png'%m);Image.fromarray(x.astype(np.uint8)).save('out/cmp_%s_ground_old.png'%m)
        print(f"{m}: {a['W']}×{a['H']} · objects {a['n']} / {b['n']} layout {'IDENTICAL' if same else 'DIFFERENT'} · spawn points {a['sp']}/{b['sp']} · ground: "+' | '.join(ds))
asyncio.run(main(sys.argv[1:]))
