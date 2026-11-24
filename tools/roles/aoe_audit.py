"""Hit-area audit of every hero (ROLE_SYSTEM_TH.md §1): shape, reach, hits per target, duration.
Server on :8765.  OUT=/tmp/roles python3 tools/roles/aoe_audit.py [hero ...] -> OUT/<hero>.json
SIM=7 ULT=1 SUF=_ult = only the ultimates with a 7 s window."""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__));OUT=os.environ.get('OUT','/tmp/roles');os.makedirs(OUT,exist_ok=True)
SIM=int(os.environ.get('SIM','3'));ULT=int(os.environ.get('ULT','0'));SUF=os.environ.get('SUF','')
HEROES=['wolf','rhino','owl','jaguar','croc','axolotl','cat','hippo','sheep','dragon','lion','kitsune','bastet','anubis','raven','wukong','drake']
async def probe(ch):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':900,'height':600})
        await pg.goto(f'http://localhost:8765/index.html?char={ch}&map=snowpine&nosw=1');await pg.wait_for_timeout(4000)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(5000)
        await pg.evaluate("window.__GEMS_ALL=1")
        await pg.add_script_tag(path=os.path.join(HERE,'aoe_probe.js'))
        await pg.evaluate("mapTest.enterMap(null,null)");await pg.wait_for_timeout(500)
        r=await pg.evaluate("probeAoe({sim:%d,ult:%d})"%(SIM,ULT));await b.close();return r
for ch in (sys.argv[1:] or HEROES):
    r=asyncio.run(probe(ch));json.dump(r,open(os.path.join(OUT,ch+SUF+'.json'),'w'));print(ch,len(r),flush=True)
