"""Bench one hero, one branch at a time (pure heroes with two same-stat branches).
HERO=bastet COL=bCol python3 tools/qa/bench_branch.py A,B 8      (kitsune: COL=kCol · anubis: COL=uCol · croc: COL=crCol · PORT=8765 by default)
'all' = the whole hero, nothing skipped (e.g. HERO=croc COL=crCol python3 tools/qa/bench_branch.py all,A,B 8)
Two-way heroes (CLAUDE.md rule 5): PRESET=สายเวท benches with the TAL build, e.g. HERO=dragon COL=dCol PRESET=สายเวท python3 tools/qa/bench_branch.py A,B 8
EXTRA='&vfx3=0' adds to the page query (compare effect passes).
Level: the bench runs at the Lv 60 cap by default (tools/balance_bench.js); LV=99 = the old Lv 99 reference.
Needs the game served: python3 -m http.server 8765 in the repo folder."""
import asyncio,sys,os
from playwright.async_api import async_playwright
PORT=os.environ.get('PORT','8765');HERO=os.environ.get('HERO','kitsune');COL=os.environ.get('COL','kCol');PRESET=os.environ.get('PRESET','');EXTRA=os.environ.get('EXTRA','');LV=os.environ.get('LV','')   # LV=99 benches the old Lv 99 reference (default: the Lv 60 cap, tools/balance_bench.js)
BENCH=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','balance_bench.js')
async def run(branch,runs):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':900,'height':600})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:160]))
        await pg.goto(f'http://localhost:{PORT}/index.html?char={HERO}&map=snowpine&nosw=1{EXTRA}');await pg.wait_for_timeout(4000)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(5000)
        await pg.add_script_tag(path=BENCH)
        await pg.evaluate("mapTest.enterMap(null,null)");await pg.wait_for_timeout(500)
        if PRESET:await pg.evaluate("(p)=>{PS._pre=p;Object.assign(PS,presetAt(p,PS.lv));applyStats();player.hp=player.maxHp;player.mp=player.maxMp;}",PRESET)
        if LV:await pg.evaluate("(l)=>{window.__BENCH_LV=l;}",int(LV))
        if branch!='all':
            other='B' if branch=='A' else 'A'
            await pg.evaluate(f"window.__BENCH_SKIP=k=>{COL}(k)==='{other}'")
            await pg.evaluate(f"window.__ROLE_BR='{branch}'")   # roles.js: basic attacks / Basic branch use this branch's role
        r=await pg.evaluate(f"balanceBench({runs})");await b.close();return r,errs
runs=int(sys.argv[2]) if len(sys.argv)>2 else 8
for br in (sys.argv[1] if len(sys.argv)>1 else 'A,B').split(','):
    r,errs=asyncio.run(run(br,runs));print(HERO,br,PRESET or '-',EXTRA or '','Lv',r.get('lv'),'score',r['score'],'dps1',round(r['dps1']),'dpsG',round(r['dpsG']),errs[:2],flush=True)
