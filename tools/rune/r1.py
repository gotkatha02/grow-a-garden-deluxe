import asyncio,sys,json
from playwright.async_api import async_playwright
HERO=sys.argv[1] if len(sys.argv)>1 else 'wolf'
W=int(sys.argv[2]) if len(sys.argv)>2 else 1280;H=int(sys.argv[3]) if len(sys.argv)>3 else 760;TOUCH=len(sys.argv)>4
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);ctx=await b.new_context(viewport={'width':W,'height':H},has_touch=TOUCH,is_mobile=TOUCH,device_scale_factor=2 if TOUCH else 1);pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:300]));pg.on('console',lambda m:errs.append('C:'+m.text[:200]) if 'ring' in m.text else None)
        await pg.goto(f'http://localhost:8765/index.html?char={HERO}&map=snowpine&nosw=1');await pg.wait_for_timeout(4000)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(6000)
        tag=f'{HERO}_{W}'
        # socket a few runes through the UI functions
        await pg.evaluate("""()=>{RING.open();}""");await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'/tmp/ring_{tag}_empty.png')
        await pg.evaluate("""()=>{RING.force([[0,'sr_wolfHunt_2'],[1,'sr_tbCharge_2'],[2,'sr_bearHide_1'],[3,'sr_owlNight_0'],[4,'sr_eagleSwoop_2'],[5,'sr_orcaFlow_1']],{e0:'c_str',e1:'c_atk',e5:'c_dex',i0:'c_crit',i1:'c_int',e2:'c_vit',i2:'c_def',e3:'c_luk',i3:'c_aspd',e4:'c_hit',i4:'c_matk',i5:'c_flee'},5);RING.close();RING.open();}""");await pg.wait_for_timeout(700)
        await pg.screenshot(path=f'/tmp/ring_{tag}_full.png')
        r=await pg.evaluate("()=>({act:Object.fromEntries(Object.entries(RING.act()).map(([k,v])=>[k,[v.t,v.g,v.v]])),bon:{str:BON.str,atk:BON.atk,crit:BON.crit,aspd:BON.aspd},buffs:Object.keys(player.buffs).filter(k=>/^rn_/.test(k))})")
        print(json.dumps(r,ensure_ascii=False))
        # read tab + smelt tab
        await pg.evaluate("document.querySelector('#rgw [data-t=read]').click()");await pg.wait_for_timeout(200)
        await pg.evaluate("document.querySelector('#rgw [data-read=\"2\"][data-n=\"1\"]').click()");await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'/tmp/ring_{tag}_read.png')
        print('errs',errs[:6]);await b.close()
asyncio.run(main())
