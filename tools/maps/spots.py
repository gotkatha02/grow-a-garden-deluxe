"""In-game screenshot of a map at given spots or along the coast (HUD hidden by default). Serve the repo on 8765.
python3 spots.py OUT MAP [hero=wolf w=1280 h=720 at=coast|X,Y;X,Y inland=260 along=.5,.3 side=E hud=0 wait=2600 port=8765 touch=0 q=&extra=1]"""
import asyncio, sys, time, os, json
from playwright.async_api import async_playwright
args=[a for a in sys.argv[1:] if '=' not in a]; kv=dict(a.split('=',1) for a in sys.argv[1:] if '=' in a)
OUT,MAP=args[0],args[1]; HERO=kv.get('hero','wolf'); W,H=int(kv.get('w',1280)),int(kv.get('h',720)); PORT=int(kv.get('port',8765))
AT=kv.get('at','coast'); INL=float(kv.get('inland',260)); ALONG=[float(a) for a in kv.get('along','.5').split(',')]; HUD=kv.get('hud','0')=='1'
WAIT=int(kv.get('wait',2600)); TOUCH=kv.get('touch','0')=='1'; TAG=kv.get('tag',''); Q=kv.get('q','')
os.makedirs(OUT,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':W,'height':H},has_touch=TOUCH,is_mobile=TOUCH,device_scale_factor=1)
        pg=await ctx.new_page(); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:300]))
        pg.on('console',lambda m:errs.append('console:'+m.text[:200]) if m.type=='error' else None)
        await pg.goto('http://localhost:%d/index.html?char=%s&map=%s&nosw=1&guide=0&cb=%d%s'%(PORT,HERO,MAP,time.time(),Q)); await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()"); await pg.wait_for_timeout(5000)
        await pg.evaluate("id=>{if(curMap!==id)enterMap(id);}",MAP)
        for _ in range(80):
            await pg.wait_for_timeout(400)
            if await pg.evaluate("(()=>{const h=mapHosts[curMap];return !!(h&&h.ready);})()"): break
        await pg.wait_for_timeout(1200)
        if AT=='coast':
            pts=await pg.evaluate("""([al,inl])=>{const h=mapHosts[curMap],s=(h.cfg.sea&&h.cfg.sea.side)||'S',out=[];
              for(const f of al){let x,y;for(let a=10;a<Math.max(h.W,h.H);a+=12){[x,y]=s==='E'?[h.W-a,h.H*f]:s==='W'?[a,h.H*f]:s==='N'?[h.W*f,a]:[h.W*f,h.H-a];if(h.isReachable(x,y))break;}
                const ox=s==='E'?-1:s==='W'?1:0,oy=s==='S'?-1:s==='N'?1:0;out.push([x+ox*inl,y+oy*inl*.8]);}return out;}""",[ALONG,INL])
        else:
            pts=[[float(v) for v in q.split(',')] for q in AT.split(';')]
        if not HUD:
            await pg.evaluate("(()=>{for(const el of document.body.children)if(el.tagName!=='CANVAS'&&el.tagName!=='SCRIPT')el.style.visibility='hidden';})()")
        for i,(x,y) in enumerate(pts):
            await pg.evaluate("([x,y])=>{const w=M2W({x,y});player.x=w[0];player.y=w[1];cam.x=player.x;cam.y=player.y;}",[x,y])
            await pg.wait_for_timeout(WAIT)
            f=os.path.join(OUT,'%s%s_%d.png'%(MAP,TAG,i)); await pg.screenshot(path=f); print(f,int(x),int(y),flush=True)
        if errs: print('ERR',errs[:6])
        await b.close()
asyncio.run(main())
