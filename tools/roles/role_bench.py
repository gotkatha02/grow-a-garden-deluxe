"""Role profile per hero / branch (ROLE_SYSTEM_TH.md §1.4): damage (dps1, dpsG), toughness (maxHp, takenPS), sustain (healPS).
RUNS=2 OUT=/tmp/roles python3 tools/roles/role_bench.py wolf:A:STR wolf:B:INT …  (branch A / B / all, preset = STR AGI INT VIT DEX) -> OUT/roles.jsonl"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
OUT=os.environ.get('OUT','/tmp/roles');os.makedirs(OUT,exist_ok=True);ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BENCH=os.path.join(ROOT,'tools','balance_bench.js');RUNS=int(os.environ.get('RUNS','2'))
async def run(hero,br,pre):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':900,'height':600})
        await pg.goto(f'http://localhost:8765/index.html?char={hero}&map=snowpine&nosw=1');await pg.wait_for_timeout(4000)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(5000)
        await pg.add_script_tag(path=BENCH)
        await pg.evaluate("mapTest.enterMap(null,null)");await pg.wait_for_timeout(500)
        await pg.evaluate("(p)=>{PS._pre=p;Object.assign(PS,presetAt(p,PS.lv));applyStats();player.hp=player.maxHp;player.mp=player.maxMp;}",pre)
        if br in('A','B'):
            other='B' if br=='A' else 'A'
            await pg.evaluate("o=>{window.__BENCH_SKIP=k=>{const s=SKILLS[k];if(!s)return false;const c=s.br==='C'?(s.col||''):s.br;return c===o;}}",other)
            await pg.evaluate("b=>{window.__ROLE_BR=b}",br)   # roles.js
            if hero in('wolf','jaguar','owl','hippo','dragon','lion','raven','drake'):
                await pg.evaluate("a=>{window.__BENCH_AVOID=a}",'m' if br=='A' else 'p')
        r=await pg.evaluate(f"balanceBench({RUNS})");await b.close();return r
for spec in sys.argv[1:]:
    h,br,pre=spec.split(':')
    r=asyncio.run(run(h,br,pre))
    o=dict(hero=h,br=br,pre=pre,score=r['score'],dps1=round(r['dps1']),dpsG=round(r['dpsG']),takenPS=round(r.get('takenPS',0),1),healPS=round(r.get('healPS',0),1),maxHp=r.get('maxHp'))
    open(os.path.join(OUT,'roles.jsonl'),'a').write(json.dumps(o)+'\n');print(o,flush=True)
