"""First-time player path in PLAY mode: create a hero, enter the world, walk, open windows, enter the first field, fight. python3 play1.py [carousel steps]"""
import asyncio,time,json,sys
from playwright.async_api import async_playwright
async def main(nxt):
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':720});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:260]));pg.on('console',lambda m:errs.append('console: '+m.text[:200]) if m.type=='error' and 'Failed to load resource' not in m.text else None)
        pg.on('dialog',lambda d:asyncio.ensure_future(d.accept()))
        await pg.goto('http://localhost:8765/index.html?nosw=1&cb=%d'%time.time());await pg.wait_for_timeout(7000)
        for i in range(nxt):
            await pg.mouse.click(1135,360);await pg.wait_for_timeout(500)
        btn=lambda t:"(()=>{const b=[...document.querySelectorAll('button')].find(b=>/%s/.test(b.textContent)&&b.getBoundingClientRect().width>8);if(b){b.click();return true;}return false;})()"%t
        print('create hero click',await pg.evaluate(btn('Create Hero')));await pg.wait_for_timeout(6000);await pg.screenshot(path='play_2.png')
        r=await pg.evaluate("""()=>{const vis=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>8&&r.height>8&&s.visibility!=='hidden'&&s.display!=='none';};return {char:window.CHAR,btn:[...document.querySelectorAll('button')].filter(vis).filter(b=>b.closest('[id*=cc],[class*=cc]')).map(b=>(b.textContent||'').trim().slice(0,22)),inp:[...document.querySelectorAll('input')].filter(vis).map(i=>[i.id,i.placeholder,i.value])};}""")
        print('step 2',json.dumps(r,ensure_ascii=False)[:500])
        await pg.fill('#ccname','Tester');await pg.evaluate(btn('Random Stats'));await pg.wait_for_timeout(300)
        ok=await pg.evaluate(btn('Okay'))
        print('start button',ok);await pg.wait_for_timeout(9000);await pg.screenshot(path='play_3.png')
        st=await pg.evaluate("(()=>{try{return {char:CHAR,map:curMap,lv:PS.lv,hp:Math.round(player.hp),zeny:(window.AFItems&&AFItems.zeny!==undefined)?AFItems.zeny:null,mode:window.AFItems&&AFItems.MODE,name:(JSON.parse(localStorage.getItem('af_prog_v1_'+CHAR)||'{}').name),bag:window.AFItems&&AFItems.bag?Object.keys(AFItems.bag).length:null};}catch(e){return {err:String(e)};}})()")
        print('in game',json.dumps(st,ensure_ascii=False));print('errors so far',errs[:6])
        # walk, open the bag / status / skills, then go out to the first field and fight
        seen=len(errs)
        for k in ['Alt+E','Escape','Alt+A','Escape','Alt+S','Escape','Alt+Q','Escape','g','Escape','m','m']:
            await pg.keyboard.press(k);await pg.wait_for_timeout(350)
        r=await pg.evaluate("""async()=>{const h=mapHosts[curMap];const w=(h.warps||[])[0];const out={warps:(h.warps||[]).map(w=>w.to)};if(!w)return out;
          const p=M2W({x:w.x,y:w.y});player.x=p[0];player.y=p[1]+30;await new Promise(r=>setTimeout(r,400));player.moveT={x:p[0],y:p[1]};for(let i=0;i<40&&curMap==='frostheim';i++)await new Promise(r=>setTimeout(r,250));
          await new Promise(r=>setTimeout(r,5000));out.map=curMap;out.en=enemies.length;const e=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];
          if(e){out.elv=(e.vdef&&e.vdef.lv)||e.lv||e.level;out.name=e.vdef&&e.vdef.name;out.ehp=Math.round(e.maxHp||e.hp);player.x=e.x-60;player.y=e.y;for(const id of ['statb','eqb','itb'])void 0;command({kind:'attack',e});let t=0;const h0=e.hp;while(!e.dead&&t<90){await new Promise(r=>setTimeout(r,500));t++;if(t===20)out.hpAfter10s=Math.round(e.hp);}out.killed=!!e.dead;out.secs=t/2;out.dealt=Math.round(h0-e.hp);out.zeny=window.AFItems&&AFItems.zeny;out.hp=Math.round(player.hp)+'/'+Math.round(player.maxHp);out.exp=PS.exp;out.lv=PS.lv;}
          return out;}""")
        print('field',json.dumps(r,ensure_ascii=False));await pg.screenshot(path='play_4.png');print('errors after play',errs[seen:seen+6])
        await b.close()
asyncio.run(main(int(sys.argv[1]) if len(sys.argv)>1 else 0))
