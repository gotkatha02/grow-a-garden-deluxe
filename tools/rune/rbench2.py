"""Per-rune ring bench in one page: HERO=wolf RUNS=2 python3 rbench2.py phys"""
import asyncio,sys,os,json
from playwright.async_api import async_playwright
HERO=os.environ.get('HERO','wolf');RUNS=int(os.environ.get('RUNS','2'));KIND=sys.argv[1] if len(sys.argv)>1 else 'phys'
R1='c_str' if KIND=='phys' else 'c_matk';R2='c_atk' if KIND=='phys' else 'c_matk'
SMALL={'e0':'c_def','e1':R1,'e2':'c_aspd','e3':R2,'e4':'c_aspd','e5':R2,'i0':R1,'i1':'c_cdr','i2':'c_hit' if KIND=='phys' else 'c_dex','i3':'c_luk','i4':'c_dex','i5':'c_aspd'}
BIG=[[0,'sr_wolfHunt_2'],[1,'sr_tbCharge_2'],[2,'sr_tbWing_2'],[3,'sr_owlNight_2'],[4,'sr_wolfPack_2'],[5,'sr_eagleEye_2']]
WEAK={'e0':'c_def','e1':'c_hit','e2':'c_luk','e3':'c_hit','e4':'c_luk','e5':'c_hit','i0':'c_hit','i1':'c_luk','i2':'c_hit','i3':'c_luk','i4':'c_hit','i5':'c_luk'}
SM3={'r':'c_hit','b':'c_def','g':'c_luk','*':'c_hit'}   # weak carved runes that only light the lines
CFG=[('empty',None)]+[(k,k) for k in ([x for x in sys.argv[2].split(',') if x!='none'] if len(sys.argv)>2 else 'wolfHunt,tbCharge,tbWing,owlNight,wolfPack,eagleEye,eagleSwoop,wolfHowl,tbRoar'.split(','))]+([('carved',None)] if 'carved' in sys.argv else [])+([('bigonly',None)] if 'bigonly' in sys.argv else [])+([('full',None),('empty2',None)] if 'nofull' not in sys.argv else [])
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':900,'height':600})
        await pg.goto(f'http://localhost:8765/index.html?char={HERO}&map=snowpine&nosw=1');await pg.wait_for_timeout(4000)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(5000)
        await pg.add_script_tag(path='tools/balance_bench.js');await pg.evaluate("mapTest.enterMap(null,null)");await pg.wait_for_timeout(500)
        await pg.evaluate("window.__BENCH_RUNES=1;window.__ROOTS_OFF=1;applyStats();")
        base=None
        for name,k in CFG:
            if name=='empty':await pg.evaluate("RING.clear()")
            elif name=='carved':await pg.evaluate(f"RING.force([],{json.dumps(SMALL)},10)")
            elif name=='full':await pg.evaluate(f"RING.force({json.dumps(BIG)},{json.dumps(SMALL)},10)")
            elif name=='bigonly':await pg.evaluate(f"RING.force({json.dumps(BIG)},{json.dumps(WEAK)},1)")
            elif name=='empty2':await pg.evaluate("RING.clear()")
            else:
                req=await pg.evaluate(f"RUNEDATA.SRK['{k}'].req");sm={'e5':SM3[req[0]],'e0':SM3[req[1]],'i0':SM3[req[2]]}
                await pg.evaluate(f"RING.force([[0,'sr_{k}_2']],{json.dumps(sm)},1)")
            r=await pg.evaluate(f"balanceBench({RUNS})");sc=r['score']
            if base is None:base=sc
            print(f"{HERO} {name:11s} score {sc:6.0f} {100*(sc/base-1):+5.1f}%  dps1 {r['dps1']:.0f} dpsG {r['dpsG']:.0f}",flush=True)
        await b.close()
asyncio.run(main())
