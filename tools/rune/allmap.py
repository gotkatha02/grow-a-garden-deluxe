import asyncio,json
from playwright.async_api import async_playwright
import sys
HEROES=(sys.argv[1] if len(sys.argv)>1 else 'wolf cat kitsune bastet anubis dragon lion jaguar owl hippo croc rhino sheep axolotl').split()
async def one(p,h):
    b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':1000,'height':640})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto(f'http://localhost:8765/index.html?char={h}&map=snowpine&nosw=1');await pg.wait_for_timeout(3500)
    await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(5500)
    r=await pg.evaluate("()=>{const S=SKILLS,C=Object.keys(S).filter(k=>S[k].br==='C');return {n:C.length,mapped:Object.keys(ROOTS.CNODE).length,on:C.filter(k=>LV[k]>0).length,lit:Object.keys(ROOTS.data().lit).length,miss:C.filter(k=>!ROOTS.CNODE[k]).map(k=>k+':'+S[k].col+S[k].tier)}}")
    await pg.evaluate("ROOTS.open()");await pg.wait_for_timeout(600);await pg.evaluate("ROOTS.close()")
    await b.close();return r,errs
async def main():
    async with async_playwright() as p:
        for h in HEROES:
            r,e=await one(p,h);print(h,json.dumps(r),e[:2],flush=True)
asyncio.run(main())
