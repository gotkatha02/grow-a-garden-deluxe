"""Every hero in the skill test room: cast every skill once, basic attack, walk — collect script errors, missing files, NaN, skills that never start.
python3 herosweep.py hero…  (prints one block per hero)"""
import asyncio,time,sys,json
from playwright.async_api import async_playwright
CAST="""async(k)=>{const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));const e=es[0];
  try{if(player.action)endAction();}catch(x){}
  player.hp=player.maxHp||player.hp;player.mp=player.maxMp||player.mp;player.ccT=0;
  const hp0=enemies.reduce((s,e)=>s+(e.hp||0),0);let res='ok',act=false;
  try{const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;const r=castSkill(k,{target:e||null,phi,gx:e?e.x:player.x+90,gy:e?e.y:player.y});if(r===false)res='refused';}catch(x){res='THROW '+String(x&&x.stack||x).slice(0,260);}
  for(let i=0;i<9;i++){await new Promise(r=>setTimeout(r,110));if(player.action)act=true;}
  const hp1=enemies.reduce((s,e)=>s+(e.hp||0),0);
  return {res,act,dmg:Math.round(hp0-hp1),nan:!isFinite(player.x)||!isFinite(player.y)||!isFinite(player.hp)||enemies.some(e=>!isFinite(e.x)||!isFinite(e.y)||!isFinite(e.hp)),fx:fx.length,en:enemies.length};}"""
async def hero(pw,h,out):
    b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1100,'height':640});errs=[];miss=[]
    pg.on('pageerror',lambda e:errs.append(str(e)[:300]));pg.on('console',lambda m:errs.append('console: '+m.text[:240]) if m.type=='error' and 'Failed to load resource' not in m.text else None)
    pg.on('response',lambda r:miss.append(r.url.split('/',3)[-1].split('?')[0]) if r.status>=400 and 'fonts.g' not in r.url else None)
    L=[];P=lambda *a:L.append(' '.join(str(x) for x in a))
    try:
        await pg.goto('http://localhost:8765/index.html?char=%s&map=vikF2&testroom=1&nosw=1&cb=%d'%(h,time.time()));await pg.wait_for_timeout(17000)
        info=await pg.evaluate("(()=>{try{return {char:window.CHAR,ks:Object.keys(SKILLS).filter(k=>!SKILLS[k].passive),pas:Object.keys(SKILLS).filter(k=>SKILLS[k].passive).length,en:enemies.length,map:curMap,lv:player.lv||player.level||0};}catch(e){return {err:String(e)};}})()")
        if 'err' in info: P('  COULD NOT START',info['err']);raise Exception('start')
        P(f"  loaded as {info['char']} on {info['map']} · {len(info['ks'])} active skills + {info['pas']} passive · dummies {info['en']} · errors at load {len(errs)}")
        for e in errs[:5]: P('     load error:',e)
        seen=len(errs);bad=0;zero=[];refused=[];noact=[]
        for k in info['ks']:
            try: r=await pg.evaluate(CAST,k)
            except Exception as x: r={'res':'EVAL FAILED '+str(x)[:120],'act':False,'dmg':0,'nan':False,'fx':0,'en':0}
            new=errs[seen:];seen=len(errs)
            if r['res'].startswith('THROW') or r['res'].startswith('EVAL') or new or r['nan']:
                bad+=1;P(f"   !! {k}: {r['res'] if r['res']!='ok' else ''} {'NaN ' if r['nan'] else ''}{' | '.join(new[:2])}"[:420])
            elif r['res']=='refused': refused.append(k)
            elif not r['act'] and r['dmg']<=0: noact.append(k)
            if r['fx']>900: P(f"   ?? {k}: {r['fx']} effect objects alive")
        # basic attack + walking
        r=await pg.evaluate("""async()=>{try{if(player.action)endAction();}catch(x){}const e=enemies.filter(e=>!e.dead)[0];const hp0=enemies.reduce((s,e)=>s+(e.hp||0),0);if(e)player.attackTarget=e;await new Promise(r=>setTimeout(r,3500));const d=hp0-enemies.reduce((s,e)=>s+(e.hp||0),0);player.attackTarget=null;
          const x0=player.x,y0=player.y;try{player.moveT={x:player.x+160,y:player.y+60};}catch(x){}await new Promise(r=>setTimeout(r,1500));return {basic:Math.round(d),moved:Math.round(Math.hypot(player.x-x0,player.y-y0)),fx:fx.length};}""")
        new=errs[seen:];seen=len(errs)
        P(f"  skills with an error: {bad} · refused (need a condition / combo): {len(refused)} · started nothing: {len(noact)} {noact[:8]}")
        P(f"  basic attack 3.5 s: damage {r['basic']} · walk: moved {r['moved']} px · effects alive at the end {r['fx']}" + (' · errors: '+' | '.join(new[:2]) if new else ''))
        m=sorted(set(miss));P(f"  missing files (HTTP 4xx): {len(m)} {m[:10]}")
    except Exception as x:
        P('  SWEEP PROBLEM',str(x)[:200]);[P('     ',e) for e in errs[:4]]
    out[h]=L;await b.close()
async def main(hs):
    out={}
    async with async_playwright() as pw:
        for i in range(0,len(hs),3):
            await asyncio.gather(*[hero(pw,h,out) for h in hs[i:i+3]])
            for h in hs[i:i+3]:
                print('=== '+h,flush=True);[print(l,flush=True) for l in out.get(h,[])]
asyncio.run(main(sys.argv[1:]))
