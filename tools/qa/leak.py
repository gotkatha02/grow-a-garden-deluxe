import asyncio,time,json,sys
from playwright.async_api import async_playwright
async def main(h):
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1100,'height':640});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:260]))
        await pg.goto('http://localhost:8765/index.html?char=%s&map=vikF2&testroom=1&nosw=1&cb=%d'%(h,time.time()));await pg.wait_for_timeout(17000)
        r=await pg.evaluate("""async()=>{const ks=[];for(const t of TABS)for(const k of t.keys)if(k&&SKILLS[k]&&!SKILLS[k].passive&&!ks.includes(k))ks.push(k);const out=[];
          const cnt=()=>{const c={};for(const f of fx){const n=f.constructor&&f.constructor.name||'?';c[n]=(c[n]||0)+1;}return c;};
          for(let round=0;round<3;round++){for(const k of ks){const e=enemies.filter(e=>!e.dead)[0];try{if(player.action)endAction();}catch(x){}for(const c in player.cd)player.cd[c]=0;player.mp=player.maxMp;player.x=e.x-80;player.y=e.y;
              try{castSkill(k,{target:e,phi:0,gx:e.x,gy:e.y});}catch(x){}await new Promise(r=>setTimeout(r,260));}
            await new Promise(r=>setTimeout(r,6000));const c=cnt();out.push({round,fx:fx.length,top:Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,6)});}
          return out;}""")
        for x in r: print(h,json.dumps(x))
        print('errors',errs[:3]);await b.close()
asyncio.run(main(sys.argv[1]))
