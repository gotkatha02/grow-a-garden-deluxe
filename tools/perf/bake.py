"""Hitches while walking into new ground: time of every frame (drawing forced to finish) after a jump to unbaked ground. python3 bake.py <map> [dx dy]"""
import asyncio,time,sys
from playwright.async_api import async_playwright
async def main(mp,dx,dy):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--disable-gpu","--disable-accelerated-2d-canvas"]);pg=await b.new_page(viewport={'width':1280,'height':720});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
        await pg.goto('http://localhost:8765/index.html?char=wolf&map=frostheim&nosw=1&cb=%d'%time.time());await pg.wait_for_timeout(7000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()");await pg.wait_for_timeout(11000)
        await pg.evaluate("setInterval(()=>{try{perfT=-1e9;}catch(e){}},200)")
        await pg.evaluate("id=>enterMap(id)",mp);await pg.wait_for_timeout(9000)
        await pg.evaluate("""()=>{window.__F=[];const r0=render;render=function(){const a=performance.now();r0();mctx.getImageData(0,0,1,1);__F.push(+(performance.now()-a).toFixed(1));};}""")
        await pg.wait_for_timeout(1500)
        base=await pg.evaluate("(()=>{const f=__F.slice(-20).sort((a,b)=>a-b);__F.length=0;return f[10];})()")
        out=[]
        for k in range(3):
            await pg.evaluate("([dx,dy,k])=>{const h=mapHosts[curMap];const p=h.randomSpawn?h.randomSpawn():null;if(p){player.x=p.x;player.y=p.y;}else{player.x=Math.min(h.W-200,player.x+dx);player.y=Math.min(h.H-200,player.y+dy);}__F.length=0;}",[dx,dy,k])
            await pg.wait_for_timeout(2500);f=await pg.evaluate("__F.slice(0,60)");out.append(f)
        print(mp,'steady frame',base,'ms')
        for f in out:
            big=[x for x in f if x>base*1.6+4];print('  after a jump: frames over normal',len(big),'· worst',max(f),'ms · extra time in total',round(sum(x-base for x in big)),'ms ·',[round(x) for x in f[:14]])
        print('errors',errs[:3]);await b.close()
a=sys.argv[1:];asyncio.run(main(a[0],float(a[1]) if len(a)>1 else 2600,float(a[2]) if len(a)>2 else 1700))
