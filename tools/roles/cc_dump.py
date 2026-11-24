"""Dump SK_CC / SK_KO / branch / ult flag of every skill (ROLE_SYSTEM_TH.md §1.3).
OUT=/tmp/roles python3 tools/roles/cc_dump.py hero… -> OUT/cc_<hero>.json"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
OUT=os.environ.get('OUT','/tmp/roles');os.makedirs(OUT,exist_ok=True)
async def one(ch):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':900,'height':600})
        await pg.goto(f'http://localhost:8765/index.html?char={ch}&map=snowpine&nosw=1');await pg.wait_for_timeout(5000)
        r=await pg.evaluate("""(()=>{const o={};for(const k in SKILLS){const s=SKILLS[k];o[k]={name:s.name,br:s.br||'',col:s.col||'',type:s.type||'',passive:!!s.passive,make:!!s.make,
          ult:!!(s.ult||/ULTIMATE/.test(s.th||'')||(s.row===8&&(s.br==='A'||s.br==='B'))),cc:SK_CC[k]||null,ko:(typeof skKO==='function'?skKO(k):null),dt:(typeof skDT==='function'?skDT(k):'')};}
          return {skills:o,classBase:typeof CLASS_BASE!=='undefined'?CLASS_BASE:null,aspd:typeof CHAR_ASPD!=='undefined'?CHAR_ASPD:null,range:typeof BASIC_RANGE!=='undefined'?BASIC_RANGE:null};})()""")
        await b.close();return r
for ch in sys.argv[1:]:
    r=asyncio.run(one(ch));json.dump(r,open(os.path.join(OUT,'cc_'+ch+'.json'),'w'));print(ch,len(r['skills']),flush=True)
