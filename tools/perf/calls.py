"""Every canvas call of a frame, forced to finish and timed, grouped by the game function that made it (software canvas).
python3 calls.py <map> [q=low|med|high] [js first]"""
import asyncio,time,json,sys
from playwright.async_api import async_playwright
INJ=r"""()=>{const P=CanvasRenderingContext2D.prototype,A=window.__C={on:0,t:{},n:{}};
  for(const m of ['drawImage','fillRect','fill','stroke','fillText','strokeText','clearRect','putImageData']){const f=P[m];P[m]=function(){const r=f.apply(this,arguments);if(!A.on)return r;const a=performance.now();try{this.getImageData(0,0,1,1);}catch(e){}const dt=performance.now()-a;
      const L=(new Error().stack.split('\n')[2]||'').trim().replace(/^at\s+/,'').replace(/\(?https?:\/\/[^/]+\//,'').replace(/\?[^:]*/,'').replace(/:\d+\)?$/,'');const op=this.globalCompositeOperation,k=L+' · '+m+(op!=='source-over'?' ['+op+']':'')+(this.filter&&this.filter!=='none'?' {filter}':'');A.t[k]=(A.t[k]||0)+dt;A.n[k]=(A.n[k]||0)+1;return r;};}}"""
RUN=r"""()=>{const A=__C,N=4;render();mctx.getImageData(0,0,1,1);A.t={};A.n={};A.on=1;for(let i=0;i<N;i++)render();A.on=0;const o=[];let tot=0;for(const k in A.t){o.push([k,+(A.t[k]/N).toFixed(2),Math.round(A.n[k]/N)]);tot+=A.t[k]/N;}o.sort((a,b)=>b[1]-a[1]);return {tot:+tot.toFixed(1),o:o.slice(0,34)};}"""
async def main(mp,q,pre):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--disable-gpu","--disable-accelerated-2d-canvas"]);pg=await b.new_page(viewport={'width':1280,'height':720});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
        await pg.goto('http://localhost:8765/index.html?char=wolf&map=frostheim&nosw=1&cb=%d'%time.time());await pg.wait_for_timeout(7000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()");await pg.wait_for_timeout(11000)
        await pg.evaluate("setInterval(()=>{try{perfT=-1e9;}catch(e){}},400)")
        await pg.evaluate("(q)=>{Q=QUALITY[q];resize();}",q or 'high')
        await pg.evaluate("id=>enterMap(id)",mp);await pg.wait_for_timeout(10000)
        if pre: await pg.evaluate("()=>{"+pre+"}");await pg.wait_for_timeout(1500)
        await pg.evaluate(INJ);r=await pg.evaluate(RUN);info=await pg.evaluate("[cvs.width,cvs.height,enemies.length,Object.keys(QUALITY).find(k=>QUALITY[k]===Q)]")
        print(f"{mp} [{info[3]}] canvas {info[0]}×{info[1]} · {info[2]} monsters → drawing of one frame {r['tot']} ms")
        for k,v,n in r['o']:
            if v>=.12: print(f"  {v:6.2f} ms ×{n:<4d} {k[:112]}")
        print('errors',errs[:3]);await b.close()
a=sys.argv[1:];mp=a.pop(0);q=None
if a and a[0].startswith('q='): q=a.pop(0)[2:]
asyncio.run(main(mp,q,a[0] if a else ''))
