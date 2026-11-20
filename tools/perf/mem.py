"""Memory after visiting maps one after another in one session (picture memory of all live canvases + script heap).
python3 mem.py <port> map…"""
import asyncio,time,sys
from playwright.async_api import async_playwright
INIT="""(()=>{const R=window.__CV=[];const ce=document.createElement.bind(document);document.createElement=function(t){const e=ce.apply(document,arguments);if(String(t).toLowerCase()==='canvas')R.push(new WeakRef(e));return e;};
  window.__cvMB=()=>{let px=0,n=0;for(const r of R){const c=r.deref();if(c){px+=c.width*c.height;n++;}}return [Math.round(px*4/1048576),n];};})()"""
async def main(port,maps):
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':1280,'height':720});await ctx.add_init_script(INIT);pg=await ctx.new_page();cdp=await ctx.new_cdp_session(pg)
        dead=[];pg.on('crash',lambda *_:dead.append(1))
        await pg.goto('http://localhost:%d/index.html?char=wolf&map=frostheim&nosw=1&cb=%d'%(port,time.time()));await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()");await pg.wait_for_timeout(8000)
        for i,m in enumerate(maps):
            try:
                await pg.evaluate("id=>enterMap(id)",m);await pg.wait_for_timeout(5000)
                # walk about: three jumps so the ground cache fills as it does in play
                for k in range(3):
                    await pg.evaluate("()=>{const h=mapHosts[curMap];if(h&&h.spawns&&h.spawns.length){const s=h.spawns[(Math.random()*h.spawns.length)|0];const p=M2W({x:s.x??s[0],y:s.y??s[1]});player.x=p[0];player.y=p[1];}}");await pg.wait_for_timeout(1200)
                await cdp.send('HeapProfiler.collectGarbage');await pg.wait_for_timeout(300)
                cv=await pg.evaluate("__cvMB()");hp=(await cdp.send('Runtime.getHeapUsage'))['usedSize']/1048576;nh=await pg.evaluate("Object.keys(mapHosts).length")
                print(f"  after map {i+1:2d} {m:9s}: canvases {cv[0]:5d} MB ({cv[1]} live) · script heap {hp:6.0f} MB · maps kept {nh}",flush=True)
            except Exception as e:
                print('  CRASHED at map',i+1,m,str(e)[:80]);break
        await b.close()
a=sys.argv[1:];asyncio.run(main(int(a[0]),a[1:]))
