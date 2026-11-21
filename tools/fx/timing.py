"""Real timing of every skill of HERO (default axolotl): cast bar, action start, release (windup), hits, action end — seconds after the key press.
python3 timing.py [keys] [mode=one|room]"""
import asyncio,sys,os,json
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from harness import Game
from playwright.async_api import async_playwright
A=dict(a.split('=',1) for a in sys.argv[1:] if '=' in a);KS=[k for a in sys.argv[1:] if '=' not in a for k in a.split(',') if k]
MODE=A.get('mode','one')
SETUP="""(mode)=>{window.__hits=[];if(!window.__hw){window.__hw=1;const _h=hurt;hurt=function(e,m,o){const d=_h(e,m,o);if(d>0&&!(o&&o.dot))window.__hits.push(+(gameTime-window.__t0).toFixed(3));return d;};}
  const b=document.querySelector('[data-tr='+mode+']');if(b)b.click();return Object.keys(SKILLS).filter(k=>SKILLS[k].make&&!SKILLS[k].passive);}"""
CAST="""(k)=>{try{if(player.action)endAction();}catch(x){}player.casting=null;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;player.cd={};
  const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));const e=es[0];
  const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  window.__t0=gameTime;window.__hits=[];window.__ph={};let r;
  if(k==='basic'){const a=mkBasic(e);startAction(a);r=true;}else r=castSkill(k,{target:e||null,phi,gx:e?e.x:player.x+120,gy:e?e.y:player.y});
  return r===false?'refused':'ok';}"""
WATCH="""()=>{const t=+(gameTime-__t0).toFixed(3),a=player.action,P=__ph;if(player.casting&&P.c0==null)P.c0=t;if(!player.casting&&P.c0!=null&&P.c1==null)P.c1=t;
  if(a&&P.a0==null){P.a0=t;P.key=a.key;P.wind=+(a.windup/ACTION_TEMPO).toFixed(3);P.len=+((a.dur+(a.recover||0))/ACTION_TEMPO).toFixed(3);}if(!a&&P.a0!=null&&P.a1==null)P.a1=t;return [t,!!a||!!player.casting];}"""
async def main():
    async with async_playwright() as pw:
        g=Game();await g.start(pw)
        ks=await g.ev(SETUP,MODE);await g.step(20)
        ks=KS or (['basic']+ks)
        out={}
        for k in ks:
            await g.step(150)
            r=await g.ev(CAST,k)
            if r!='ok':out[k]=r;continue
            busyEnd=None
            for i in range(60*5):
                await g.step(1)
                t,b=await g.ev(WATCH)
                if not b and busyEnd is None and t>.05: busyEnd=t
                if busyEnd is not None and t>busyEnd+1.2: break
            ph=await g.ev("()=>__ph");hits=await g.ev("()=>__hits")
            rel=None
            if ph.get('a0') is not None: rel=round(ph['a0']+ph['wind'],3)
            out[k]=dict(cast=ph.get('c1'),act=ph.get('a0'),release=rel,end=ph.get('a1'),hits=hits[:14],nh=len(hits))
            print(k,json.dumps(out[k]),flush=True)
        json.dump(out,open(os.path.join(os.environ.get('OUT','/tmp/fx'),'timing_%s.json'%MODE),'w'),indent=1)
        if g.errs:print('ERRORS',g.errs[:5])
        await g.close()
asyncio.run(main())
