import asyncio,sys,json
from playwright.async_api import async_playwright
HERO=sys.argv[1] if len(sys.argv)>1 else 'wolf'
W=int(sys.argv[2]) if len(sys.argv)>2 else 1280;H=int(sys.argv[3]) if len(sys.argv)>3 else 760;TOUCH=len(sys.argv)>4
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);ctx=await b.new_context(viewport={'width':W,'height':H},has_touch=TOUCH,is_mobile=TOUCH,device_scale_factor=2 if TOUCH else 1);pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:300]))
        await pg.goto(f'http://localhost:8765/index.html?char={HERO}&map=snowpine&nosw=1');await pg.wait_for_timeout(4000)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(6000)
        tag=f'{HERO}_{W}'
        await pg.evaluate("ROOTS.open('hoarfrostEdge')");await pg.wait_for_timeout(1200)
        await pg.screenshot(path=f'/tmp/{tag}_plan.png')
        await pg.evaluate("document.querySelector('#rtSide [data-a=walk]')?.click()");await pg.wait_for_timeout(1200)
        r=await pg.evaluate("()=>({on:ROOTS.cOn('hoarfrostEdge'),lv:LV.hoarfrostEdge,lit:Object.keys(ROOTS.data().lit).length})");print(r)
        await pg.screenshot(path=f'/tmp/{tag}_walked.png')
        # a small node card
        await pg.evaluate("ROOTS.close();ROOTS.open('Hr0')");await pg.wait_for_timeout(800)
        await pg.screenshot(path=f'/tmp/{tag}_small.png')
        print('errs',errs[:5]);await b.close()
asyncio.run(main())
