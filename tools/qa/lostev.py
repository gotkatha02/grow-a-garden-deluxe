"""Action events that can never fire (2026-11-21, found on the lion): the engine ends an action at dur+recover (at dur when an input is queued)
and drops any event still waiting. For every skill (and the basic attack) of each hero: make the action next to a dummy and compare each
event time with the action's length.  python3 tools/qa/lostev.py [hero…]   LOST = after dur+recover (never fires) · late = after dur
(lost when the player has already queued the next input).  Serve the repo on 8765 first."""
import asyncio,sys,json,time
from playwright.async_api import async_playwright
HEROES=sys.argv[1:] or ['wolf','cat','kitsune','bastet','anubis','dragon','lion','axolotl','sheep','hippo','croc','jaguar','owl','rhino','raven','wukong']
PROBE="""()=>{const out=[];const e=enemies.find(q=>!q.dead);if(!e)return ['no dummy'];
 const keys=Object.keys(SKILLS).filter(k=>SKILLS[k].make);keys.push('basic');
 for(const k of keys){try{player.action=null;player.casting=null;player.x=e.x-80;player.y=e.y;faceTo(0);player.mp=player.maxMp;
   const A=k==='basic'?mkBasic(e):SKILLS[k].make({target:e,phi:0,gx:e.x,gy:e.y});if(!A||!A.events)continue;
   const end=A.dur+(A.recover||0),evs=A.events.map(v=>v.t).filter(t=>typeof t==='number');if(!evs.length)continue;const mx=Math.max(...evs);
   if(mx>end+1e-6)out.push(['LOST',k,+mx.toFixed(3),'end',+end.toFixed(3),evs.filter(t=>t>end+1e-6).length+' of '+evs.length]);
   else if(mx>A.dur+1e-6)out.push(['late',k,+mx.toFixed(3),'dur',+A.dur.toFixed(3),'end',+end.toFixed(3)]);}catch(x){out.push(['ERR',k,String(x).slice(0,60)]);}}
 player.action=null;return out;}"""
async def one(pw,h):
    b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1000,'height':620});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)[:120]))
    await pg.goto('http://localhost:8765/index.html?char=%s&map=vikF2&testroom=1&nosw=1&cb=%d'%(h,time.time()))
    for i in range(60):
        await pg.wait_for_timeout(500)
        try:ok=await pg.evaluate("(()=>{try{return enemies.length>0&&!!document.getElementById('trbar')}catch(e){return false}})()")
        except Exception:ok=False   # the test room may reload the page once
        if ok and i>8:break
    try:r=await pg.evaluate(PROBE)
    except Exception as x:r=[['ERR','probe',str(x)[:80]]]
    await b.close();return h,[x for x in r if x[0]!='ERR' or x[1]=='probe'],errs   # ERR = a skill whose make() needs a combo parent / context
async def main():
    async with async_playwright() as pw:
        for i in range(0,len(HEROES),3):
            for h,r,errs in await asyncio.gather(*[one(pw,h) for h in HEROES[i:i+3]]):
                print('===',h,'· events past the action end:',sum(1 for x in r if x[0]=='LOST'),'· after dur:',sum(1 for x in r if x[0]=='late'))
                for x in r:print('   ',*x)
                if errs:print('    page errors',errs[:2])
asyncio.run(main())
