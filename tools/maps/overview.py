"""Stitched overview of a whole field map from in-game screenshots (HUD hidden). python3 overview.py OUT.jpg MAP [cols=6 rows=5 scale=.25]"""
import asyncio, sys, time
from playwright.async_api import async_playwright
from PIL import Image
a=[x for x in sys.argv[1:] if '=' not in x]; kv=dict(x.split('=',1) for x in sys.argv[1:] if '=' in x)
OUT,MAP=a[0],a[1]; C,R=int(kv.get('cols',6)),int(kv.get('rows',5)); SC=float(kv.get('scale',.25)); W,H=2560,1440
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':W,'height':H},device_scale_factor=1); pg=await ctx.new_page()
        await pg.goto('http://localhost:8765/index.html?char=wolf&map=%s&nosw=1&guide=0&cb=%d'%(MAP,time.time())); await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()"); await pg.wait_for_timeout(5000)
        await pg.evaluate("id=>{if(curMap!==id)enterMap(id);}",MAP)
        for _ in range(80):
            await pg.wait_for_timeout(400)
            if await pg.evaluate("(()=>{const h=mapHosts[curMap];return !!(h&&h.ready);})()"): break
        await pg.evaluate("(()=>{for(const el of document.body.children)if(el.tagName!=='CANVAS'&&el.tagName!=='SCRIPT')el.style.visibility='hidden';})()")
        info=await pg.evaluate("(()=>{const h=mapHosts[curMap];return {W:h.W,H:h.H,Z,K:typeof K!=='undefined'?K:.62};})()")
        Z=info['Z']; vw=W/Z; vh=H/(Z*info['K']); MW,MH=info['W'],info['H']
        print(info, vw, vh)
        tw,th=int(W*SC),int(H*SC); sheet=Image.new('RGB',(tw*C,th*R))
        for j in range(R):
            for i in range(C):
                x=MW*(i+.5)/C; y=MH*(j+.5)/R
                await pg.evaluate("([x,y])=>{const h=mapHosts[curMap],n=h.nav.nearest({x,y})||{x,y},w=M2W(n),t=M2W({x,y});player.x=w[0];player.y=w[1];window.CAM_BIAS={x:t[0]-w[0],y:t[1]-w[1]};cam.x=t[0];cam.y=t[1];}",[x,y])
                await pg.wait_for_timeout(1800)
                await pg.screenshot(path='/tmp/ov_tile.png')
                im=Image.open('/tmp/ov_tile.png').convert('RGB')
                # crop the exact cell extent (MW/C x MH/R map px) out of the view
                cw=MW/C*Z; ch=MH/R*Z*info['K']
                box=(int(W/2-cw/2),int(H/2-ch/2),int(W/2+cw/2),int(H/2+ch/2))
                im=im.crop(box).resize((tw,th))
                sheet.paste(im,(i*tw,j*th))
        sheet.save(OUT,quality=88); print(OUT,sheet.size)
        await b.close()
asyncio.run(main())
