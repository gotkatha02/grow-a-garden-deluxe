"""Why does a pure-ATK hero's INT build bench as high as its STR build? Prints ATK parts, SP, and the bench with SP kept full.
python3 tools/qa/sp_probe.py hero [RUNS]  (STR and INT presets: ATK parts, SP pool / regen, bench as is and with SP kept full)"""
import asyncio,sys,json,os
from playwright.async_api import async_playwright
H=sys.argv[1];RUNS=int(sys.argv[2]) if len(sys.argv)>2 else 3
BENCH=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','balance_bench.js')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':900,'height':600})
        await pg.goto(f'http://localhost:8765/index.html?char={H}&map=snowpine&nosw=1');await pg.wait_for_timeout(4000)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(5000)
        await pg.add_script_tag(path=BENCH);await pg.evaluate("mapTest.enterMap(null,null)");await pg.wait_for_timeout(500)
        for name in ['STR','INT']:
            await pg.evaluate("(p)=>{PS.lv=LV_CAP;PS._pre=p;Object.assign(PS,presetAt(p,LV_CAP));applyStats();player.hp=player.maxHp;player.mp=player.maxMp;}",name)
            d=await pg.evaluate("()=>({patk:D.patk,sAtk:D.sAtk,wAtk:BON.atk||0,ref:WEAPON.refAtk,mag:D.mag,maxSp:D.maxSp,spReg:D.spReg,hit:D.hit,aspd:Math.round(D.aspd)})")
            r=await pg.evaluate(f"balanceBench({RUNS})")
            # SP kept full every frame: wrap updatePlayer
            await pg.evaluate("()=>{if(!window.__up0){window.__up0=updatePlayer;updatePlayer=function(dt){player.mp=player.maxMp;return __up0(dt);};}}")
            r2=await pg.evaluate(f"balanceBench({RUNS})")
            await pg.evaluate("()=>{if(window.__up0){updatePlayer=__up0;window.__up0=null;}}")
            print(H,name,d,'bench',r['score'],'(dps1',r['dps1'],'dpsG',r['dpsG'],') | SP full',r2['score'],'(dps1',r2['dps1'],'dpsG',r2['dpsG'],')',flush=True)
        await b.close()
asyncio.run(main())
