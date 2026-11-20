"""Trace one skill frame by frame: python3 one.py hero key [dist] [wait_ms]"""
import asyncio,time,sys,json
from playwright.async_api import async_playwright
async def main(h,k,dist,wait):
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1100,'height':640});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:260]))
        await pg.goto('http://localhost:8765/index.html?char=%s&map=vikF2&testroom=1&nosw=1&cb=%d'%(h,time.time()));await pg.wait_for_timeout(17000)
        r=await pg.evaluate("""async([k,dist,wait])=>{const e=enemies.filter(e=>!e.dead)[0];try{if(player.action)endAction();}catch(x){}for(const c in player.cd)player.cd[c]=0;player.mp=player.maxMp||999;
          player.x=e.x-dist;player.y=e.y;mouse.wx=e.x;mouse.wy=e.y;const log=[];let hp=e.hp,t0=performance.now(),stop=false;const msgs=[];const m0=msg;msg=function(t){msgs.push(String(t).replace(/<[^>]+>/g,'').slice(0,50));return m0.apply(this,arguments);};
          (function tick(){if(stop)return;if(e.hp!==hp){log.push(Math.round(performance.now()-t0)+'ms hp '+(e.hp-hp).toFixed(0));hp=e.hp;}requestAnimationFrame(tick);})();
          let how='key';useSkill(k);if(typeof targeting!=='undefined'&&targeting){targeting=null;how='aimed';castSkill(k,{target:e,phi:0,gx:e.x,gy:e.y});}
          const a0=player.action?(player.action.skill||player.action.name):null;const p0=[Math.round(player.x-e.x),Math.round(player.y-e.y)];
          await new Promise(r=>setTimeout(r,wait));stop=true;
          return {how,a0,p0,p1:[Math.round(player.x-e.x),Math.round(player.y-e.y)],log:log.slice(0,14),msgs,LV:LV[k],type:SKILLS[k].type,ehp:Math.round(e.hp),emax:Math.round(e.maxHp||0),lvE:e.lv,inv:!!e.invuln,face:+(player.phi||0).toFixed(2),dir:player.dir};}""",[k,dist,wait])
        print(json.dumps(r,ensure_ascii=False)[:900]);print('errors',errs[:3]);await b.close()
a=sys.argv[1:];asyncio.run(main(a[0],a[1],float(a[2]) if len(a)>2 else 70,int(a[3]) if len(a)>3 else 4000))
