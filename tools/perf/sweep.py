"""Every map, one after another in ONE session: loads?, frames keep coming?, monsters?, errors? picture memory. python3 sweep.py [port] > sweep.log"""
import asyncio,time,sys,json
from playwright.async_api import async_playwright
INIT="""(()=>{const R=window.__CV=[];const ce=document.createElement.bind(document);document.createElement=function(t){const e=ce.apply(document,arguments);if(String(t).toLowerCase()==='canvas')R.push(new WeakRef(e));return e;};
  window.__cvMB=()=>{let px=0;for(const r of R){const c=r.deref();if(c)px+=c.width*c.height;}return Math.round(px*4/1048576);};})()"""
async def main(port):
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':1280,'height':720});await ctx.add_init_script(INIT);pg=await ctx.new_page();cdp=await ctx.new_cdp_session(pg);errs=[]
        pg.on('pageerror',lambda e:errs.append('ERR '+str(e)[:220]));pg.on('console',lambda m:errs.append('console '+m.text[:200]) if m.type=='error' and 'favicon' not in m.text else None)
        pg.on('requestfailed',lambda r:errs.append('404? '+r.url[-80:]));pg.on('response',lambda r:errs.append('HTTP %d %s'%(r.status,r.url[-90:])) if r.status>=400 else None)
        await pg.goto('http://localhost:%d/index.html?char=wolf&map=frostheim&nosw=1&cb=%d'%(port,time.time()));await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()");await pg.wait_for_timeout(8000)
        await pg.evaluate("()=>{window.__n=0;const r0=render;render=function(){__n++;r0();};}")
        maps=await pg.evaluate("Object.keys(MAPDEF)");print('maps',len(maps),flush=True);bad=0;seen=0
        for i,m in enumerate(maps):
            try:
                await pg.evaluate("id=>{enterMap(id);}",m);t0=time.time();ready=False
                while time.time()-t0<25:
                    await pg.wait_for_timeout(500)
                    if await pg.evaluate("(()=>{const h=mapHosts[curMap];return !!(h&&(h.ready||h.failed));})()"): ready=True;break
                load=time.time()-t0;await pg.wait_for_timeout(1500);n0=await pg.evaluate("__n");await pg.wait_for_timeout(2000)
                r=await pg.evaluate("""(()=>{const h=mapHosts[curMap];const mp=W2M(player.x,player.y);let blk=null;try{blk=h.blocked?!!h.blocked(mp.x,mp.y):null;}catch(e){blk='x'}
                  return {n:__n,en:enemies.length,failed:!!h.failed,ready:!!h.ready,blk,W:h.W,H:h.H,sp:(h.spawns||[]).length,mons:!!(window.VK_MONS&&VK_MONS[curMap]),hosts:Object.keys(mapHosts).length,nanE:enemies.filter(e=>!isFinite(e.x)||!isFinite(e.y)).length,pl:isFinite(player.x)&&isFinite(player.y)};})()""")
                fps=(r['n']-n0)/2.0;new=errs[seen:];seen=len(errs);flag=[]
                if not ready or r['failed']: flag.append('NOT READY')
                if fps<8: flag.append('NO FRAMES')
                if r['mons'] and r['en']==0: flag.append('NO MONSTERS')
                if r['blk'] is True: flag.append('HERO IN WALL')
                if r['nanE'] or not r['pl']: flag.append('NaN')
                if new: flag.append('ERRORS %d'%len(new))
                mem=''
                if i%10==9:
                    await cdp.send('HeapProfiler.collectGarbage');mem=' · canvases %d MB · maps kept %d'%(await pg.evaluate("__cvMB()"),r['hosts'])
                print(f"{i+1:3d} {m:10s} load {load:4.1f}s · {fps:4.0f} fps · monsters {r['en']:4d} · {r['W']}×{r['H']}{mem} {'  <<< '+', '.join(flag) if flag else ''}",flush=True)
                for e in new[:4]: print('      ',e,flush=True)
                bad+=1 if flag else 0
            except Exception as e:
                print(i+1,m,'SWEEP FAILED',str(e)[:160],flush=True);bad+=1
                if 'crash' in str(e).lower() or 'closed' in str(e).lower(): break
        print('DONE · maps with a problem:',bad,flush=True);await b.close()
asyncio.run(main(int(sys.argv[1]) if len(sys.argv)>1 else 8765))
