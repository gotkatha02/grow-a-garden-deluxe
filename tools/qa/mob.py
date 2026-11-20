"""Phone check (touch, 844x390): mobile controls start, joystick walk, attack button, a skill tap, memory keeps one map; then save / reload in play mode."""
import asyncio,time,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();dev=p.devices['iPhone 13'];ctx=await b.new_context(**{**dev,'viewport':{'width':844,'height':390},'screen':{'width':844,'height':390}});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:260]));pg.on('console',lambda m:errs.append('console: '+m.text[:200]) if m.type=='error' and 'Failed to load resource' not in m.text else None)
        await pg.goto('http://localhost:8765/index.html?char=kitsune&map=vikF2&testroom=1&nosw=1&cb=%d'%time.time());await pg.wait_for_timeout(18000)
        r=await pg.evaluate("""()=>{const vis=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>8&&r.height>8&&s.visibility!=='hidden'&&s.display!=='none';};
          return {mob:document.body.className,ids:[...document.querySelectorAll('[id^=mob]')].filter(vis).map(e=>e.id).slice(0,20),keep:typeof MAP_KEEP!=='undefined'?MAP_KEEP:null,dpr:devicePixelRatio,cv:[cvs.width,cvs.height],q:Object.keys(QUALITY).find(k=>QUALITY[k]===Q)};}""")
        print('phone',json.dumps(r));await pg.screenshot(path='mob_1.png')
        # joystick: drag in the left half; attack button; a skill slot
        x0,y0=150,280;await pg.touchscreen.tap(x0,y0)
        cdp=await ctx.new_cdp_session(pg)
        p0=await pg.evaluate("[player.x,player.y]")
        await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x0,'y':y0,'id':1}]})
        for i in range(8):
            await cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x0+8*i,'y':y0-3*i,'id':1}]});await pg.wait_for_timeout(120)
        await pg.wait_for_timeout(900);p1=await pg.evaluate("[player.x,player.y]")
        await cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
        print('joystick moved the hero by',round(((p1[0]-p0[0])**2+(p1[1]-p0[1])**2)**.5),'px')
        btns=await pg.evaluate("""()=>[...document.querySelectorAll('#mobAtk,#mobTgt,.mobsk,[id^=mobS],[class*=mob] button')].map(e=>{const r=e.getBoundingClientRect();return [e.id||e.className.slice(0,14),Math.round(r.x+r.width/2),Math.round(r.y+r.height/2),Math.round(r.width)];}).filter(a=>a[3]>10).slice(0,24)""")
        print('buttons',btns[:14])
        for nm,x,y,w in btns[:10]:
            await pg.touchscreen.tap(x,y);await pg.wait_for_timeout(450)
        await pg.screenshot(path='mob_2.png');print('errors',errs[:5]);await b.close()
        # ---- save / reload in play mode (desktop)
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':1280,'height':720});pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:260]))
        await pg.goto('http://localhost:8765/index.html?nosw=1&cb=%d'%time.time());await pg.wait_for_timeout(7000)
        btn=lambda t:"(()=>{const b=[...document.querySelectorAll('button')].find(b=>/%s/.test(b.textContent)&&b.getBoundingClientRect().width>8);if(b){b.click();return true;}return false;})()"%t
        await pg.evaluate(btn('Create Hero'));await pg.wait_for_timeout(5000);await pg.fill('#ccname','Saver');await pg.evaluate(btn('Okay'));await pg.wait_for_timeout(8000)
        await pg.evaluate("(()=>{enterMap('snowpine');})()");await pg.wait_for_timeout(5000)
        a=await pg.evaluate("(()=>{window.dispatchEvent(new Event('pagehide'));window.dispatchEvent(new Event('beforeunload'));return {map:curMap,lv:PS.lv,z:AFItems.zeny,keys:Object.keys(localStorage).filter(k=>k.startsWith('af_')).slice(0,30)};})()")
        await pg.goto('http://localhost:8765/index.html?nosw=1&cb=%d'%(time.time()+1));await pg.wait_for_timeout(9000)
        c=await pg.evaluate("(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>8&&getComputedStyle(e).display!=='none';};return {char:CHAR,map:curMap,lv:PS.lv,z:AFItems.zeny,mode:AFItems.MODE,name:(JSON.parse(localStorage.getItem('af_prog_v1_'+CHAR)||'{}').name),dialog:[...document.querySelectorAll('button')].filter(vis).map(b=>(b.textContent||'').trim()).filter(t=>/เล่นต่อ|Continue|ทดสอบ|เริ่มใหม่|Create/.test(t)).slice(0,6)};})()")
        print('before reload',json.dumps(a,ensure_ascii=False)[:420]);print('after reload',json.dumps(c,ensure_ascii=False)[:420]);await pg.screenshot(path='reload.png');print('errors',errs[:4]);await b.close()
asyncio.run(main())
