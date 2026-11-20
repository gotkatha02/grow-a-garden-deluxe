"""Click through the interface (menu buttons, shortcut keys, item / market / craft windows and every tab inside) and collect script errors.
python3 ui.py hero map"""
import asyncio,time,sys,json
from playwright.async_api import async_playwright
TABS="""()=>{const vis=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>6&&r.height>6&&s.visibility!=='hidden'&&s.display!=='none'&&r.x>=0&&r.y>=0&&r.x<innerWidth&&r.y<innerHeight;};
  const skip=/ลบ|เริ่มใหม่|รีเซ็ต|reset|ล้าง|ออกจาก|ยืนยัน|ซื้อ|ขาย|ตีบวก|คราฟต์|สร้าง|ย่อย|ทิ้ง|ใช้|เจาะ|ถอด|ยัด|รวม|ย้าย|ลงขาย|จอง|รับของ|\\+10|\\+1 /i;
  const out=[];for(const e of document.querySelectorAll('[data-tab],[data-t],[data-cat],[data-pg],[data-view],.tab,.tabs>button,.ix-tabs>button,.tt-tabs>button,nav>button')){if(!vis(e)||e.closest('#qual'))continue;const t=(e.textContent||'').trim();if(skip.test(t))continue;
    if(!e.dataset.__u)e.dataset.__u='u'+Math.random().toString(36).slice(2,8);out.push([e.dataset.__u,t.slice(0,16)]);}
  return out;}"""
async def main(hero,mp):
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':720});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:260]));pg.on('console',lambda m:errs.append('console: '+m.text[:200]) if m.type=='error' and 'Failed to load resource' not in m.text else None)
        pg.on('dialog',lambda d:asyncio.ensure_future(d.dismiss()))
        await pg.goto('http://localhost:8765/index.html?char=%s&map=%s&nosw=1&cb=%d'%(hero,mp,time.time()));await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()");await pg.wait_for_timeout(9000)
        seen=len(errs);print(hero,mp,'errors at load',errs[:4]);rep=[]
        async def step(name,js=None,key=None):
            nonlocal seen
            try:
                if js: await pg.evaluate(js)
                if key: await pg.keyboard.press(key)
                await pg.wait_for_timeout(450)
                tabs=await pg.evaluate(TABS);n=0
                for u,t in tabs[:40]:
                    try:
                        await pg.evaluate("u=>{const e=document.querySelector('[data-__u=\"'+u+'\"]');if(e)e.click();}",u);await pg.wait_for_timeout(140);n+=1
                    except Exception as x: errs.append('click '+t+': '+str(x)[:120])
                new=errs[seen:];seen=len(errs);rep.append((name,n,new))
                await pg.keyboard.press('Escape');await pg.wait_for_timeout(200)
            except Exception as x:
                rep.append((name,0,['STEP FAILED '+str(x)[:160]]))
        ms=await pg.evaluate("[...document.querySelectorAll('button[data-m]')].map(b=>b.dataset.m)")
        for m in ms:
            if m in('mgslow','test','play'): continue
            await step('menu '+m,"(()=>{const b=document.querySelector('button[data-m=%s]');if(b)b.click();})()"%m)
            await pg.evaluate("(()=>{const b=document.querySelector('button[data-m=%s]');if(b&&%s)b.click();})()"%(m,'false'))
        for k in ['Alt+A','Alt+Q','Alt+E','Alt+S','k','g','m','c','b','n','Tab','f','Alt+C','h','j','o','p','i','u','y','t']:
            await step('key '+k,key=k)
        api=await pg.evaluate("(()=>{const o={};for(const n of ['AFItems','MKT','TGEMS','AFNpc','WORLDMAP','FASHION','KMW']){try{const v=eval(n);if(v)o[n]=Object.keys(v).filter(k=>typeof v[k]==='function'&&/^open|^show/.test(k));}catch(e){}}return o;})()")
        print('open functions',api)
        for n,fs in api.items():
            for f in fs:
                await step('%s.%s()'%(n,f),"(()=>{try{%s.%s();}catch(e){console.error('%s.%s threw '+e);}})()"%(n,f,n,f))
        bad=[r for r in rep if r[2]]
        print('steps',len(rep),'· tabs clicked',sum(r[1] for r in rep),'· steps with errors',len(bad))
        for name,n,new in bad: print('  !!',name,'|',' || '.join(new[:3])[:420])
        print('  ok:',', '.join('%s(%d)'%(r[0].replace('menu ','').replace('key ','⌨'),r[1]) for r in rep if not r[2])[:900]);await b.close()
a=sys.argv[1:];asyncio.run(main(a[0] if a else 'wolf',a[1] if len(a)>1 else 'capT'))
