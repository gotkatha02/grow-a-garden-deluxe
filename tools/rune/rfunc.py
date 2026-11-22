import asyncio,sys,json
from playwright.async_api import async_playwright
HERO=sys.argv[1] if len(sys.argv)>1 else 'wolf'
SETUP="""window.__T={sl:ms=>new Promise(r=>setTimeout(r,ms)),
 K:Object.keys(SKILLS).find(k=>LV[k]>0&&SKILLS[k].make&&!SKILLS[k].passive&&SKILLS[k].br!=='C'&&!SKILLS[k].parent&&!(SKILLS[k].ult||/ULTIMATE/.test(SKILLS[k].th||''))&&(SKILLS[k].type==='melee'||SKILLS[k].range)),
 U:Object.keys(SKILLS).find(k=>LV[k]>0&&SKILLS[k].make&&!SKILLS[k].passive&&(SKILLS[k].ult||/ULTIMATE/.test(SKILLS[k].th||''))),
 E(){const L=enemies.filter(m=>!m.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));return L;},
 near(n){const L=this.E().slice(0,n||3);L.forEach((e,i)=>{e.x=player.x+50+i*14;e.y=player.y+(i-1)*16;e.hp=e.maxHp=Math.max(e.maxHp,5e5);e.aggro=0;e.st={};});return L;},
 async cast(n,k){k=k||this.K;for(let i=0;i<n;i++){for(let w=0;w<60&&busy();w++)await this.sl(50);player.cd={};player.mp=player.maxMp;this.near(3);useSkill(k);await this.sl(120);}for(let w=0;w<60&&busy();w++)await this.sl(50);}};"""
SM={'r':'c_str','b':'c_vit','g':'c_int','*':'c_str'}
SC={
'bearHide':"for(let i=0;i<6;i++)ENH_ABSORB(10);return RING.rs().sh>0",
'bearStand':"player.action={skill:__T.K,t:0};const d=ENH_ABSORB(100);player.action=null;return d<100?'100→'+d:false",
'bearSleep':"player.hp=5;const h0=player.hp;ENH_ABSORB(1);return player.hp>h0?('hp '+h0+'→'+player.hp):false",
'owlNight':"await __T.cast(3);const a=RING.rs().owlN;await __T.cast(1);return a===3&&RING.rs().owlN===0?'n 3→0':('owlN '+a+' '+RING.rs().owlN)",
'owlWing':"const e=__T.near(1)[0];e.st={};applyCC(e,{stun:1});return e.st.stun>1?('stun '+e.st.stun.toFixed(2)):false",
'owlMoon':"for(let i=0;i<3;i++){player.action={skill:__T.K};addBuff('rtest'+i,2);player.action=null;}return RING.rs().moonArm",
'wolfPack':"const L=__T.near(3);player.action={skill:__T.K};const a0=BON.atk;for(const e of L)hurt(e,1,{sure:1});player.action=null;applyStats();return RING.rs().packStk===1?('atk '+a0+'→'+BON.atk):false",
'wolfHowl':"const e=__T.near(1)[0];for(let i=0;i<8;i++)onKill(e);return RING.rs().wolves.length===2",
'wolfHunt':"const e=__T.near(1)[0];const run=st=>{let s=0;for(let i=0;i<30;i++){e.st=st?{slow:5}:{};const h=e.hp;player.action={skill:__T.K};hurt(e,1,{sure:1});player.action=null;s+=h-e.hp;}return s/30;};const a=run(0),b=run(1);return b>a?(a.toFixed(0)+'→'+b.toFixed(0)):false",
'eagleEye':"const e=__T.near(1)[0];e.x=player.x+300;const c0=D.crit;hurt(e,1,{auto:1,sure:1});return D.crit===c0",
'eagleSwoop':"RING.rs().swoopArm=true;await __T.cast(1);return RING.rs().swoopUsed===true",
'eagleFeather':"let z=0;for(let i=0;i<5;i++)if(ENH_ABSORB(10)===0)z++;return z===1",
'tbWing':"await __T.cast(5);const a=RING.rs().tbN;await __T.cast(1);return a===5&&RING.rs().tbN===0",
'tbRoar':"if(!__T.U)return 'no ult';for(let w=0;w<60&&busy();w++)await __T.sl(50);player.cd={};player.mp=player.maxMp;__T.near(3);const L=__T.near(3),h=L.map(e=>e.hp);castSkill(__T.U,{phi:player.phi});let q=0;for(let i=0;i<60;i++){await __T.sl(40);q=Math.max(q,RING.rs().q.length);}return q===4?('q 4 · dmg '+L.reduce((a,e,i)=>a+h[i]-e.hp,0)):('q '+q)",
'tbCharge':"const e=__T.near(1)[0];onKill(e);const s=RING.rs().tbStk;await __T.cast(1);return s===1&&RING.rs().chAdd>0?('add '+RING.rs().chAdd):false",
'orcaFlow':"await __T.cast(4);const a=RING.rs().flowN;await __T.cast(1);return a===4&&RING.rs().flowN===0?'n 4→0':('flowN '+a+' '+RING.rs().flowN)",
'orcaDive':"for(let w=0;w<60&&busy();w++)await __T.sl(50);player.cd={};player.mp=player.maxMp;__T.near(3);useSkill(__T.K);await __T.sl(30);player.hp=player.maxHp-500;const h=player.hp,act=!!player.action;player.x+=40;await __T.sl(80);return player.hp>h?('+'+(player.hp-h)):('act '+act)",
'orcaWave':"for(let w=0;w<60&&busy();w++)await __T.sl(50);player.cd={};player.mp=player.maxMp;__T.near(3);RING.rs().lastFight=gameTime-30;useSkill(__T.K);await __T.sl(30);return !(player.cd[__T.K]>0)",
}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':1000,'height':640})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:300]));pg.on('console',lambda m:errs.append('C:'+m.text[:200]) if 'ring' in m.text else None)
        await pg.goto(f'http://localhost:8765/index.html?char={HERO}&map=snowpine&nosw=1');await pg.wait_for_timeout(4000)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(6000)
        await pg.evaluate(SETUP)
        print('skill',await pg.evaluate("[__T.K,__T.U]"))
        for k,js in SC.items():
            req=await pg.evaluate(f"RUNEDATA.SRK['{k}'].req")
            small={'e5':SM[req[0]],'e0':SM[req[1]],'i0':SM[req[2]]}
            await pg.evaluate(f"RING.force([[0,'sr_{k}_2']],{json.dumps(small)},1);Object.assign(RING.rs(),{{hitN:0,sh:0,owlN:0,owlArm:false,buffN:0,moonArm:false,packStk:0,kills:0,wolves:[],tbN:0,tbStk:0,flowN:0,featherN:0,q:[],sleepT:-999,swoopArm:false,swoopUsed:false}});player.hp=player.maxHp")
            act=await pg.evaluate(f"(RING.act()['{k}']||{{}}).t")
            try:r=await pg.evaluate("async ()=>{"+js+"}")
            except Exception as ex:r='ERR '+str(ex)[:120]
            print(f"{k:13s} tier {act} → {r}",flush=True)
        print('errs',errs[:6]);await b.close()
asyncio.run(main())
