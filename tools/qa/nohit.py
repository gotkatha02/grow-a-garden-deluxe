"""Re-test skills that did not hit in the quick pass: stand at 70 px, aim at the dummy, wait up to 5 s. python3 nohit.py hero k1,k2… [hero2 k…]"""
import asyncio,time,sys
from playwright.async_api import async_playwright
PREP="""()=>{window.__H={n:0};const h0=hurt;hurt=function(e,d){try{if(e&&e!==player&&enemies.includes(e))__H.n++;}catch(x){}return h0.apply(this,arguments);};window.__M=[];const m0=msg;msg=function(t){__M.push(String(t).replace(/<[^>]+>/g,'').slice(0,40));return m0.apply(this,arguments);};}"""
async def hero(pw,h,ks,out):
    b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1100,'height':640});errs=[];L=[]
    pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    await pg.goto('http://localhost:8765/index.html?char=%s&map=vikF2&testroom=1&nosw=1&cb=%d'%(h,time.time()));await pg.wait_for_timeout(17000);await pg.evaluate(PREP)
    for k in ks:
        r=await pg.evaluate("""async(k)=>{const e=enemies.filter(e=>!e.dead)[0];try{if(player.action)endAction();}catch(x){}player.combo=null;player.queue=null;player.pending=null;player.ccT=0;player.hp=player.maxHp||player.hp;player.mp=player.maxMp||player.mp;for(const c in player.cd)player.cd[c]=0;
          player.x=e.x-70;player.y=e.y;mouse.wx=e.x;mouse.wy=e.y;__H.n=0;__M.length=0;const sk=SKILLS[k];if(!sk)return {err:'no such skill'};let how='key';window.__hpT=enemies.reduce((s,q)=>s+(q.hp||0),0);
          try{useSkill(k);if(typeof targeting!=='undefined'&&targeting){targeting=null;how='aimed';castSkill(k,{target:e,phi:0,gx:e.x,gy:e.y});}}catch(x){return {err:String(x).slice(0,160)};}
          let t=0,first=null,started=false,loss=0,hp=e.hp;while(t<7000){await new Promise(r=>setTimeout(r,50));t+=50;if(player.action||player.pending)started=true;const tot=enemies.reduce((s,q)=>s+(q.hp||0),0);if(window.__hpT!==undefined&&tot<window.__hpT-.5){loss+=window.__hpT-tot;if(first===null)first=t;}window.__hpT=tot;if(first!==null&&t>first+900)break;}window.__hpT=undefined;__H.n=Math.round(loss);
          return {type:sk.type||'',range:sk.range||0,how,started,first,hits:__H.n,msg:__M.slice(0,2),d:Math.round(Math.hypot(e.x-player.x,e.y-player.y)),th:(sk.th||'').slice(0,34)};}""",k)
        L.append(f"   {k:16s} {'HP LOSS %d after %.1fs'%(r['hits'],r['first']/1000) if r.get('first') else 'NO DAMAGE':26s} {r}")
    out[h]=L+(['   errors '+str(errs[:2])] if errs else []);await b.close()
async def main(a):
    jobs=[(a[i],a[i+1].split(',')) for i in range(0,len(a),2)];out={}
    async with async_playwright() as pw:
        for i in range(0,len(jobs),3):
            await asyncio.gather(*[hero(pw,h,ks,out) for h,ks in jobs[i:i+3]])
    for h,_ in jobs:
        print('=== '+h);[print(l[:330]) for l in out[h]]
asyncio.run(main(sys.argv[1:]))
