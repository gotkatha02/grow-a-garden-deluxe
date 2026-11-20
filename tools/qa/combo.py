"""Real input paths: (1) basic attack lands hits for every hero, (2) every combo follow-up through its parent's key (useSkill twice), (3) keyboard path useSkill for every hot-bar skill.
python3 combo.py hero…"""
import asyncio,time,sys
from playwright.async_api import async_playwright
PREP="""()=>{window.__H={n:0,d:0};const h0=hurt;hurt=function(e,d){try{if(e&&e!==player&&enemies.includes(e)){__H.n++;__H.d+=(+d||0);}}catch(x){}return h0.apply(this,arguments);};}"""
async def hero(pw,h,out):
    b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1100,'height':640});errs=[];L=[];P=lambda *a:L.append(' '.join(str(x) for x in a))
    pg.on('pageerror',lambda e:errs.append(str(e)[:260]))
    try:
        await pg.goto('http://localhost:8765/index.html?char=%s&map=vikF2&testroom=1&nosw=1&cb=%d'%(h,time.time()));await pg.wait_for_timeout(17000)
        await pg.evaluate(PREP)
        r=await pg.evaluate("""async()=>{const e=enemies.filter(e=>!e.dead)[0];if(!e)return {no:1};const d0=Math.round(Math.hypot(e.x-player.x,e.y-player.y));__H.n=0;__H.d=0;player.attackTarget=e;await new Promise(r=>setTimeout(r,4500));const o={hits:__H.n,dmg:Math.round(__H.d),d0,d1:Math.round(Math.hypot(e.x-player.x,e.y-player.y)),act:!!player.action,tgt:!!player.attackTarget};player.attackTarget=null;return o;}""")
        P(f"  basic attack 4.5 s: {r}")
        # keyboard path for every hot-bar skill + follow-ups
        ks=await pg.evaluate("(()=>{const o=[];for(const t of TABS)for(const k of t.keys)if(k&&SKILLS[k]&&!SKILLS[k].passive&&!o.includes(k))o.push(k);return o.map(k=>[k,SKILLS[k].follow||null,SKILLS[k].type||'']);})()")
        seen=len(errs);bad=0;fol=0;folok=0;nohit=[]
        for k,f,ty in ks:
            r=await pg.evaluate("""async([k,f])=>{const near=()=>enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];
              try{if(player.action)endAction();}catch(x){}player.combo=null;player.queue=null;player.pending=null;player.ccT=0;player.hp=player.maxHp||player.hp;player.mp=player.maxMp||player.mp;for(const c in player.cd)player.cd[c]=0;
              const e=near();if(e){const d=Math.hypot(e.x-player.x,e.y-player.y);if(d>150||d<30){player.x=e.x-90;player.y=e.y;}mouse.wx=e.x;mouse.wy=e.y;}
              __H.n=0;let res='ok',fres=null;
              try{useSkill(k);if(typeof targeting!=='undefined'&&targeting){const t=targeting;targeting=null;castSkill(k,{target:e||null,phi:e?Math.atan2(e.y-player.y,e.x-player.x):0,gx:e?e.x:player.x+90,gy:e?e.y:player.y});res='ok(aimed)';}}catch(x){res='THROW '+String(x&&x.stack||x).slice(0,240);}
              if(f){fres='no combo window';for(let i=0;i<40;i++){await new Promise(r=>setTimeout(r,80));if(player.combo&&player.combo.parent===k){await new Promise(r=>setTimeout(r,60));try{const m0=window.__lastMsg;useSkill(k);fres='pressed';}catch(x){fres='THROW '+String(x&&x.stack||x).slice(0,240);}break;}}
                await new Promise(r=>setTimeout(r,900));}
              else await new Promise(r=>setTimeout(r,800));
              return {res,fres,hits:__H.n,act:player.action&&player.action.skill||null};}""",[k,f])
            new=errs[seen:];seen=len(errs)
            if f:
                fol+=1
                if r['fres']=='pressed' and not new: folok+=1
            if r['res'].startswith('THROW') or (r['fres'] or '').startswith('THROW') or new:
                bad+=1;P(f"   !! {k}{' → '+f if f else ''}: {r['res']} / {r['fres']} {' | '.join(new[:2])}"[:460])
            elif f and r['fres']!='pressed': P(f"   .. {k} → {f}: {r['fres']} (needs a condition?)")
            if r['hits']==0 and ty not in('self','buff'): nohit.append(k)
        P(f"  hot-bar skills {len(ks)} · with an error {bad} · follow-ups {fol} (worked {folok}) · no hit on the dummy: {len(nohit)} {nohit[:12]}")
    except Exception as x:
        P('  PROBLEM',str(x)[:200]);[P('     ',e) for e in errs[:3]]
    out[h]=L;await b.close()
async def main(hs):
    out={}
    async with async_playwright() as pw:
        for i in range(0,len(hs),3):
            await asyncio.gather(*[hero(pw,h,out) for h in hs[i:i+3]])
            for h in hs[i:i+3]:
                print('=== '+h,flush=True);[print(l,flush=True) for l in out.get(h,[])]
asyncio.run(main(sys.argv[1:]))
