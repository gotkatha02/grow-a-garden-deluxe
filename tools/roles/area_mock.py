"""Phone-screen mock (ROLE_SYSTEM_TH.md): current vs proposed hit areas on the drake in grkF1, drawn every frame with the game's own projection (S = ox + x·Z, oy + y·K·Z).
Server on :8765.  OUT=/tmp/roles python3 tools/roles/area_mock.py -> OUT/mock_breath.png, mock_ult.png, mock_both.jpg"""
import asyncio, os, time
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw
W, H = 844, 390
OUT = os.environ.get('OUT', '/tmp/roles'); os.makedirs(OUT, exist_ok=True)
URL = 'http://localhost:8765/index.html?char=drake&map=grkF1&nosw=1&cb=%d' % time.time()

PLACE = """(()=>{const L=enemies.filter(e=>!e.dead&&!e.boss&&!e.mini&&window.MSPR_HAS&&MSPR_HAS(e));let best=null,bn=-1;
 for(const e of L){const n=L.filter(q=>Math.hypot(q.x-e.x,q.y-e.y)<170).length;if(n>bn){bn=n;best=e;}}
 if(!best)return null;const P=L.filter(q=>Math.hypot(q.x-best.x,q.y-best.y)<170);let cx=0,cy=0;for(const q of P){cx+=q.x;cy+=q.y;}cx/=P.length;cy/=P.length;
 player.x=cx-120;player.y=cy+8;player.phi=Math.atan2(cy-player.y,cx-player.x);
 for(const q of enemies){if(Math.hypot(q.x-cx,q.y-cy)<700){q.aggro=0;q.atkCd=99;q.wait=99;q.tx=q.x;q.ty=q.y;}}
 return {n:P.length,cx,cy};})()"""

DRAW = """(spec)=>{window.__aoeSpec=spec;if(window.__aoeLoop)return;window.__aoeLoop=1;const frame=()=>{requestAnimationFrame(frame);const spec=window.__aoeSpec;let c=document.getElementById('aoeMock');if(!c){c=document.createElement('canvas');c.id='aoeMock';c.style.cssText='position:fixed;left:0;top:0;pointer-events:none;z-index:60';document.body.appendChild(c);}
 const dpr=devicePixelRatio||1,w=innerWidth,h=innerHeight;c.width=w*dpr;c.height=h*dpr;c.style.width=w+'px';c.style.height=h+'px';
 const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);
 const S=(x,y)=>[ox+x*Z,oy+y*K*Z],X=player.x,Y=player.y,phi=player.phi;
 const shape=(s)=>{g.beginPath();if(s.k==='cone'){const n=28;const [a,b]=S(X,Y);g.moveTo(a,b);for(let i=0;i<=n;i++){const t=phi-s.h+2*s.h*i/n;const [p,q]=S(X+Math.cos(t)*s.r,Y+Math.sin(t)*s.r);g.lineTo(p,q);}g.closePath();}
   else{const [a,b]=S(X,Y);g.ellipse(a,b,s.r*Z,s.r*Z*K,0,0,7);}};
 const lab=(t,x,y,col)=>{g.font='bold 15px Sarabun, Tahoma, sans-serif';g.lineWidth=4;g.strokeStyle='rgba(20,10,0,.85)';g.strokeText(t,x,y);g.fillStyle=col;g.fillText(t,x,y);};
 /* proposed first (gold), current on top (blue) so both read */
 shape(spec.nw);g.fillStyle='rgba(255,196,60,.20)';g.fill();g.setLineDash([]);g.lineWidth=3;g.strokeStyle='rgba(255,200,70,.98)';g.stroke();
 shape(spec.now);g.fillStyle='rgba(110,200,255,.30)';g.fill();g.setLineDash([7,5]);g.lineWidth=2.5;g.strokeStyle='rgba(225,245,255,.98)';g.stroke();g.setLineDash([]);
 const tip=(s,f)=>{const r=s.k==='cone'?s.r:s.r;const ang=s.k==='cone'?phi+f*s.h*.55:-Math.PI/2+f;return S(X+Math.cos(ang)*r,Y+Math.sin(ang)*r);};
 let [a1,b1]=tip(spec.now,spec.k==='cone'?-1:-.9),[a2,b2]=tip(spec.nw,spec.k==='cone'?-1:-.9);
 lab(spec.tNow,a1-30,b1-8,'#cfeeff');lab(spec.tNew,Math.min(a2-30,w-260),Math.max(18,b2-10),'#ffd76a');
 g.font='bold 17px Sarabun, Tahoma, sans-serif';lab(spec.title,12,h*.33,'#ffffff');};frame();}"""


async def main():
    errs = []
    async with async_playwright() as pw:
        b = await pw.chromium.launch(args=["--use-gl=swiftshader"])
        ctx = await b.new_context(viewport={'width': W, 'height': H}, is_mobile=True, has_touch=True, device_scale_factor=2)
        pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto(URL)
        for i in range(40):
            await pg.wait_for_timeout(1000)
            if await pg.evaluate("!!window.__bootDone"): break
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()")
        for i in range(30):
            await pg.wait_for_timeout(1000)
            if await pg.evaluate("typeof curMap!=='undefined'&&curMap==='grkF1'&&enemies.filter(e=>!e.dead).length>50"): break
        await pg.wait_for_timeout(2500)
        print('pack', await pg.evaluate(PLACE))
        await pg.wait_for_timeout(3500)
        await pg.evaluate("timeScale=0")
        await pg.wait_for_timeout(300)
        await pg.evaluate(DRAW, {'k': 'cone', 'now': {'k': 'cone', 'r': 140, 'h': .55}, 'nw': {'k': 'cone', 'r': 240, 'h': .8},
                                 'tNow': 'ตอนนี้ 140', 'tNew': 'เสนอ 240 · พ่นต่อเนื่อง', 'title': 'พ่นไฟ'})
        await pg.wait_for_timeout(600); await pg.screenshot(path=OUT + '/mock_breath.png')
        await pg.evaluate(DRAW, {'k': 'circle', 'now': {'k': 'circle', 'r': 180}, 'nw': {'k': 'circle', 'r': 260},
                                 'tNow': 'อัลติตอนนี้ ~180', 'tNew': 'เสนอ 260 · ตีรัว 10–15 ครั้ง', 'title': 'อัลติ'})
        await pg.wait_for_timeout(600); await pg.screenshot(path=OUT + '/mock_ult.png')
        await ctx.close(); await b.close()
    a = Image.open(OUT + '/mock_breath.png'); c = Image.open(OUT + '/mock_ult.png')
    both = Image.new('RGB', (a.width, a.height + c.height + 12), (30, 20, 12)); both.paste(a, (0, 0)); both.paste(c, (0, a.height + 12))
    both = both.resize((both.width // 2, both.height // 2), Image.LANCZOS); both.save(OUT + '/mock_both.jpg', quality=88)
    print('errors', len(errs), errs[:3])

asyncio.run(main())
