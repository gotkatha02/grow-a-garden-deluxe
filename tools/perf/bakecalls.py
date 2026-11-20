"""What the painting of new ground is made of: every canvas call after a jump to unbaked ground, forced to finish, grouped by caller. python3 bakecalls.py <map> [variant]"""
import asyncio,time,sys
from playwright.async_api import async_playwright
INJ=r"""()=>{const P=CanvasRenderingContext2D.prototype,A=window.__C={on:0,t:{},n:{}};
  for(const m of ['drawImage','fillRect','fill','stroke','fillText','strokeText','clearRect','putImageData']){const f=P[m];P[m]=function(){const r=f.apply(this,arguments);if(!A.on)return r;const a=performance.now();try{this.getImageData(0,0,1,1);}catch(e){}const dt=performance.now()-a;
      const L=(new Error().stack.split('\n')[2]||'').trim().replace(/^at\s+/,'').replace(/\(?https?:\/\/[^/]+\//,'').replace(/\?[^:]*/,'').replace(/:\d+\)?$/,'');const op=this.globalCompositeOperation,k=L+' · '+m+(op!=='source-over'?' ['+op+']':'')+(this.filter&&this.filter!=='none'?' {filter}':'');A.t[k]=(A.t[k]||0)+dt;A.n[k]=(A.n[k]||0)+1;return r;};}}"""

async def main(mp,old):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--disable-gpu","--disable-accelerated-2d-canvas"]);pg=await b.new_page(viewport={'width':1280,'height':720});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
        if old:
            async def h(route):
                await route.fulfill(body=open(old,'rb').read(),content_type='application/javascript')
            await pg.route('**/maps/fieldmap.js*',h)
        await pg.goto('http://localhost:8765/index.html?char=wolf&map=frostheim&nosw=1&cb=%d'%time.time());await pg.wait_for_timeout(7000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()");await pg.wait_for_timeout(11000)
        await pg.evaluate("setInterval(()=>{try{perfT=-1e9;}catch(e){}},200)")
        await pg.evaluate("id=>enterMap(id)",mp);await pg.wait_for_timeout(9000)
        await pg.evaluate(INJ)
        r=await pg.evaluate("""()=>{const A=__C,h=mapHosts[curMap];let s=7;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647;};const T={},N={};let fr=0,tot=0;
          for(let k=0;k<3;k++){player.x=h.W*(.2+.6*rnd());player.y=h.H*(.2+.6*rnd());cam&&(cam.x=player.x,cam.y=player.y);
            for(let i=0;i<40;i++){A.t={};A.n={};A.on=1;const a=performance.now();render();A.on=0;const d=performance.now()-a;let any=0;for(const q in A.t){if(/bake|paint|ground|tile|blend|draw[A-Z]\\w*G|fieldmap/i.test(q)){}}
              for(const q in A.t){T[q]=(T[q]||0)+A.t[q];N[q]=(N[q]||0)+A.n[q];}fr++;tot+=d;}}
          const o=Object.keys(T).map(q=>[q,+T[q].toFixed(0),N[q]]).sort((a,b)=>b[1]-a[1]);return {o:o.slice(0,26),fr,tot:Math.round(tot)};}""")
        print(mp,'·',r['fr'],'frames after 3 jumps, total',r['tot'],'ms')
        for k,v,n in r['o']: print(f"  {v:6d} ms ×{n:<5d} {k[:118]}")
        print('errors',errs[:3]);await b.close()
a=sys.argv[1:];asyncio.run(main(a[0],a[1] if len(a)>1 else None))
