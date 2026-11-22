"""Roots bench: the migrated test-mode roots (paths to the 5 C skills the gem board had on, ~97 nodes) on vs off. HERO=wolf RUNS=6"""
import asyncio,os
from playwright.async_api import async_playwright
HERO=os.environ.get('HERO','wolf');RUNS=int(os.environ.get('RUNS','6'))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':900,'height':600})
        await pg.goto(f'http://localhost:8765/index.html?char={HERO}&map=snowpine&nosw=1');await pg.wait_for_timeout(4000)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(5000)
        await pg.add_script_tag(path='tools/balance_bench.js');await pg.evaluate("mapTest.enterMap(null,null)");await pg.wait_for_timeout(500)
        await pg.evaluate("window.__BENCH_RUNES=1;window.__RING_OFF=1;RING.clear();")
        print(HERO,'lit',await pg.evaluate("Object.keys(ROOTS.data().lit).length"),'eff',await pg.evaluate("JSON.stringify(ROOTS.eff().bon)"),flush=True)
        for off in (1,0,1):
            await pg.evaluate(f"window.__ROOTS_OFF={off};applyStats();")
            r=await pg.evaluate(f"balanceBench({RUNS})");print(HERO,'roots','off' if off else 'ON ','score',round(r['score']),'dps1',round(r['dps1']),'dpsG',round(r['dpsG']),flush=True)
        await b.close()
asyncio.run(main())
