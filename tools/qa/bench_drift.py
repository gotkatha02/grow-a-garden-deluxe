"""Does a hero's bench score climb when the bench is repeated in one page (state that carries over / grows)?
python3 tools/qa/bench_drift.py hero branch(A|B|all) preset reps [runs]   e.g. hippo B INT 4 2 (2026-11-22: 1,974 → 2,363 over 4 reps)"""
import asyncio,sys,os
from playwright.async_api import async_playwright
H,BR,PRE,REPS=sys.argv[1],sys.argv[2],sys.argv[3],int(sys.argv[4]);RUNS=int(sys.argv[5]) if len(sys.argv)>5 else 2
BENCH=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','balance_bench.js');GEN="(k=>{const s=SKILLS[k];return s&&s.br})"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':900,'height':600})
        await pg.goto(f'http://localhost:8765/index.html?char={H}&map=snowpine&nosw=1');await pg.wait_for_timeout(4000)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(5000)
        await pg.add_script_tag(path=BENCH);await pg.evaluate("mapTest.enterMap(null,null)");await pg.wait_for_timeout(500)
        if BR!='all':await pg.evaluate(f"window.__BENCH_SKIP=k=>{GEN}(k)==='{'B' if BR=='A' else 'A'}'")
        await pg.evaluate("(p)=>{PS.lv=LV_CAP;PS._pre=p;Object.assign(PS,presetAt(p,LV_CAP));applyStats();player.hp=player.maxHp;player.mp=player.maxMp;}",PRE)
        for i in range(REPS):
            r=await pg.evaluate(f"balanceBench({RUNS})")
            g=await pg.evaluate("()=>{const o={};for(const k of Object.keys(window))if(/^(HP|HIP|HPP|HI|HG)[A-Z_]*$/.test(k)&&typeof window[k]==='object')o[k]=JSON.stringify(window[k]).slice(0,160);return o;}")
            print(H,BR,PRE,'rep',i,'score',r['score'],'dps1',r['dps1'],'dpsG',r['dpsG'],'mp',await pg.evaluate("Math.round(player.maxMp)"),g if i==REPS-1 else '',flush=True)
        await b.close()
asyncio.run(main())
