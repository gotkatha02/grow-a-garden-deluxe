"""Whole-kit bench of one hero (HERO=axolotl by default), test mode, empty arena — the same method as tools/qa/bench_branch.py without the branch skip.
HERO=axolotl python3 tools/fx/bench_hero.py RUNS [extra-query ...]   e.g. 8 '' '&vfx3=0' (effects on vs off)"""
import asyncio,sys,os
from playwright.async_api import async_playwright
BENCH=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','balance_bench.js')
HERO=os.environ.get('HERO','axolotl')
async def run(extra,runs):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':900,'height':600})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:160]))
        await pg.add_init_script("try{const h=new URLSearchParams(location.search).get('char');if(!localStorage.getItem('af_prog_v1_'+h))localStorage.setItem('af_prog_v1_'+h,JSON.stringify({v:1,mode:'test',save:{map:'snowpine'}}));localStorage.setItem('af_tempo','0.75');}catch(e){}")
        await pg.goto(f'http://localhost:8765/index.html?char={HERO}&map=snowpine&nosw=1{extra}');await pg.wait_for_timeout(6000)
        await pg.add_script_tag(path=BENCH)
        await pg.evaluate("mapTest.enterMap(null,null)");await pg.wait_for_timeout(500)
        r=await pg.evaluate(f"balanceBench({runs})");await b.close();return r,errs
runs=int(sys.argv[1]);exts=sys.argv[2:] or ['']
for ex in exts:
    r,errs=asyncio.run(run(ex,runs));print(HERO,repr(ex),'score',r['score'],'dps1',round(r['dps1']),'dpsG',round(r['dpsG']),'healPS',round(r.get('healPS',0)),errs[:2],flush=True)
