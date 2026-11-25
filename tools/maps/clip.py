"""Record a short in-game clip at a map spot (HUD hidden). python3 clip.py OUT.mp4 MAP X Y [secs=8 hero=wolf w=1280 h=720 walk=0]"""
import asyncio, sys, time, os, shutil, subprocess, glob
from playwright.async_api import async_playwright
a=[x for x in sys.argv[1:] if '=' not in x]; kv=dict(x.split('=',1) for x in sys.argv[1:] if '=' in x)
OUT,MAP,X,Y=a[0],a[1],float(a[2]),float(a[3]); SECS=float(kv.get('secs',8)); HERO=kv.get('hero','wolf'); W,H=int(kv.get('w',1280)),int(kv.get('h',720)); WALK=kv.get('walk','0')
async def main():
    tmp='/tmp/clipvid'; shutil.rmtree(tmp,ignore_errors=True); os.makedirs(tmp)
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':W,'height':H},device_scale_factor=1,record_video_dir=tmp,record_video_size={'width':W,'height':H})
        pg=await ctx.new_page()
        await pg.goto('http://localhost:8765/index.html?char=%s&map=%s&nosw=1&guide=0&cb=%d'%(HERO,MAP,time.time())); await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()"); await pg.wait_for_timeout(5000)
        await pg.evaluate("id=>{if(curMap!==id)enterMap(id);}",MAP)
        for _ in range(80):
            await pg.wait_for_timeout(400)
            if await pg.evaluate("(()=>{const h=mapHosts[curMap];return !!(h&&h.ready);})()"): break
        await pg.evaluate("(()=>{for(const el of document.body.children)if(el.tagName!=='CANVAS'&&el.tagName!=='SCRIPT')el.style.visibility='hidden';})()")
        await pg.evaluate("([x,y])=>{const w=M2W({x,y});player.x=w[0];player.y=w[1];cam.x=player.x;cam.y=player.y;}",[X,Y])
        await pg.wait_for_timeout(2500)
        t0=await pg.evaluate("performance.now()")
        if WALK!='0':
            await pg.evaluate("([x,y])=>{const w=M2W({x,y});if(!mapRouteTo(w[0],w[1]))player.moveT={x:w[0],y:w[1]};}",[X+float(WALK),Y])
        await pg.wait_for_timeout(int(SECS*1000))
        await ctx.close(); await b.close()
    vids=glob.glob(tmp+'/*.webm'); src=vids[0]
    # skip the loading part: keep the last SECS seconds
    dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',src]).decode().strip() or 0)
    ss=max(0,dur-SECS)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss','%.2f'%ss,'-i',src,'-c:v','libx264','-pix_fmt','yuv420p','-crf','23','-preset','veryfast',OUT],check=True)
    print(OUT,'dur',dur)
asyncio.run(main())
