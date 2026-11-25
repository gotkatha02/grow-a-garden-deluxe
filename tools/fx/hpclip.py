"""Hippo showcase clip per tree: DSF=1.5 MAP=egyF1 python3 tools/fx/hpclip.py basic|a|b|c [extra-query]  → $OUT/hippo_<tree>.mp4 (30 fps, Thai labels)
(DSF = device pixel ratio, CW/CH = crop in css px, MAP = map of the test room: egyF1 = desert sand, default vikF2 = snow; extra-query e.g. '&vfx3=0' = the old look)
Each entry: (key | 'js:<code>', label, seconds, pre-js, distance to the dummy (0 = stand in the middle of the room), test-room mode [, (dx, dz) camera offset [, zoom]]). In js / pre code the dummy is __e.
zoom 1 = a crop of CW × CH css px (660 × 400), zoom 1.7 = a close-up; every frame is scaled to OW × OH (960 × 582). Same machinery as anclip.py.
Serve the repo on 8765 first (python3 -m http.server 8765). OUT=/tmp/fx by default."""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('HERO','hippo')
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TREE=sys.argv[1];EXTRA=sys.argv[2] if len(sys.argv)>2 else ''
FIN="player.basicIdx=HB.hnCombo.chain[Math.max(1,hL('hnCombo'))-1]-1;player.basicLast=gameTime;startAction(mkBasic(__e));"
SEQ={'basic':[('basic','Hippo Combo · คทาสำริดทุบลงพื้น',.6,'',70,'one',(0,30),1.7),('basic','',.6,'',70,'one',(0,30),1.7),('basic','',.6,'',70,'one',(0,30),1.7),
      ('js:'+FIN,'ท่าปิดคอมโบ · กระโดดเตี้ยทิ้งพุงทับ',1.2,'',70,'one',(20,30),1.5),
      ('hnWaddle','Waddle Rush · เดินตุ้ยพุ่งชน',1.0,'',120,'one',(60,30),1.4),
      ('hnYawn','Yawn Threat · หาวขู่ ศัตรูหันมาตี',1.5,'',110,'one',(40,30),1.4),
      ('hnNap','Nap · งีบเติม SP (ฟองจมูก + Zzz)',2.0,'',150,'one',(-30,30),1.7),
      ('hnFeast','Feast · กินแตงโมทั้งลูก',1.6,'',150,'one',(-30,40),1.7)],
 'a':[('haFlop','Belly Flop (+Triple Flop) · กระโดดทิ้งพุงทับ',1.7,'',130,'one',(70,30),1.1),
      ('haGulp','Gulp · ดูดศัตรูเข้าปาก',1.3,'',120,'one',(30,30),1.4),
      ('haBurp','Burp Cannon · เรอยิงศัตรูที่อมไว้ออกไป',1.2,'',30,'one',(60,30),1.2),
      ('haBounce','Bounce Slam · ทับแล้วเด้งไปทับตัวถัดไป',1.8,'',150,'room',(80,40),1.0),
      ('haWard',"Taweret's Ward · โดมพรเทพีทาเวเรต",1.6,'',130,'one',(-30,40),1.6),
      ('haPound','Ground Pound · กระทืบสองเท้า',1.2,'',0,'room',(-60,30),1.1),
      ('haSky','Sky Belly · กระโดดหายแล้วตกจากฟ้า',2.0,'',150,'room',(60,40),1.0),
      ('haDouble','Double Drop · เด้งขึ้นทับซ้ำ พื้นแตก',1.2,'',0,'room',(-60,40),1.0),
      ('haRoll','Rolling Hippo · ขดตัวกลิ้งบด',1.7,'',150,'room',(90,30),1.0),
      ('haMountain','Mountain Drop · เผาความอิ่ม ตกทับเหมือนภูเขาถล่ม',2.8,'',150,'room',(60,40),.95),
      ('haBehemoth','Behemoth Drop · ULT A ตัวยักษ์ แผ่นดินไหว',3.4,'',0,'room',(-60,50),.95)],
 'b':[('hbMud','Mud Ball · ปาลูกโคลน ทิ้งบ่อโคลน',1.4,'',170,'one',(80,30),1.15),
      ('hbWallow','Mud Wallow (+Mud Splash) · คลุกโคลน บ่อใหญ่',1.2,'',150,'one',(30,30),1.1),
      ('hbSplash','',1.0,'',150,'one',(30,30),1.1),
      ('hbWave','Nile Wave · คลื่นแม่น้ำไนล์',1.4,'',200,'one',(100,30),1.0),
      ('hbGeyser','Geyser · น้ำพุร้อนพุ่งจากบ่อ',1.4,'',160,'one',(80,40),1.1),
      ('hbQuick','Quicksand Mire · หล่มทรายดูดเข้ากลาง',2.0,'',150,'room',(80,30),1.0),
      ('hbLotus','Lotus Bloom (+Lotus Storm) · บัวผุดในบ่อ ยิงกลีบ',1.6,'',150,'room',(80,30),1.0),
      ('hbLotusStorm','',1.2,'',150,'room',(80,30),1.0),
      ('hbBounty',"Hapi's Bounty · พรเทพฮาปิ ฟื้นต่อเนื่อง",1.6,'',150,'one',(-30,40),1.6),
      ('hbWrath','Wrath of the Nile · คลื่นยักษ์ ทิ้งโคลนตลอดทาง',1.8,'',160,'room',(100,40),.95),
      ('hbSea','The Great Inundation · ULT B น้ำท่วมใหญ่',4.2,'',0,'room',(-60,60),.85)],
 'c':[('hcChomp','Chomp Chomp · งับรัว 4 ครั้ง',1.6,'',70,'room',(60,30),1.2),
      ('hcGobble','Gobble Up · ดูดฮุบหลายตัว',1.5,'',0,'room',(-40,30),1.1),
      ('hcSubmerge','Submerge · ดำโคลน โผล่ทับ',2.4,'',200,'one',(90,30),1.05),
      ('hcMeteor','Meteor Belly · ทับลุกเป็นไฟ 3 ครั้ง',2.8,'',160,'room',(60,40),1.0),
      ('hcJar',"Hapi's Jar · โถศักดิ์สิทธิ์ ฟื้นในวง",3.2,'',0,'room',(-30,40),1.0)]}[TREE]
OUT=os.environ.get('OUT','/tmp/fx');os.makedirs(OUT,exist_ok=True);FR=f'/tmp/fran_{TREE}';shutil.rmtree(FR,ignore_errors=True);os.makedirs(FR)
W,H=int(os.environ.get('CW','660')),int(os.environ.get('CH','400'));OW,OH=int(os.environ.get('OW','960')),int(os.environ.get('OH','582'))   # crop of zoom 1 in css px · size of the video
CAST="""([k,near,pre])=>{try{if(player.action)endAction();}catch(x){}player.casting=null;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;player.cd={};
  const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)),e=es[0];window.__e=e;
  for(const q of enemies)if(q._dummy&&!q.H0){q.H0=[q.hx,q.hy];for(const k of ['hx','hy'])Object.defineProperty(q,k,{get(){return k==='hx'?this.x:this.y;},set(v){},configurable:true});}
  for(const q of enemies)if(q._dummy&&q.H0){q.x=q.H0[0];q.y=q.H0[1];q.z=0;q.vx=q.vy=0;if(q.st)for(const k in q.st)q.st[k]=0;}
  if(e&&near>0){player.x=e.x-near;player.y=e.y;}
  if(near===0){const D=enemies.filter(q=>q._dummy);for(const q of D){q.x=q.H0[0];q.y=q.H0[1];q.z=0;}player.x=D.reduce((s,q)=>s+q.x,0)/D.length-60;player.y=D.reduce((s,q)=>s+q.y,0)/D.length;}const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  window.__cx=near===0?player.x+60:(e?(player.x+e.x)/2:player.x+70);window.__cy=player.y;if(pre)(0,eval)(pre);
  if(k.startsWith('js:')){(0,eval)(k.slice(3));return 'ok';}
  if(k==='basic'){startAction(mkBasic(e));return 'ok';}return String(castSkill(k,{target:e,phi,gx:e?e.x:player.x+120,gy:e?e.y:player.y}));}"""
async def main():
    async with async_playwright() as pw:
        g=Game(w=1280,h=720,extra=EXTRA);await g.start(pw);await g.pg.add_style_tag(content='body>*:not(#c){visibility:hidden!important}');await g.step(60);await g.ev("()=>{window.__p0=[player.x,player.y];}")   # only the game canvas: no HUD, map label or menus in the crop
        fnt=ImageFont.truetype(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf'),22)
        n=0;mode='one'
        for ent in SEQ:
            k,label,secs,pre,near,md=ent[:6];ofs=ent[6] if len(ent)>6 else (0,34);zm=ent[7] if len(ent)>7 else 1;w,h=W/zm,H/zm
            if md!=mode:
                mode=md;await g.ev("(m)=>{try{if(player.action)endAction();}catch(x){}player.x=__p0[0];player.y=__p0[1];const b=document.querySelector('[data-tr='+m+']');if(b)b.click();}",md);await g.step(30)   # the test room puts its dummies round the hero: always from the same spot
            if not k.startswith('js:') and k!='basic':await g.step(36)
            r=await g.ev(CAST,[k,near,pre])
            if r not in ('ok','true','undefined','[object Object]'):print(k,r)
            for i in range(int(secs*30)):
                await g.step(2)
                cx,cy=await g.ev("([w,h,dx,dz])=>{const q=P(window.__cx+dx,window.__cy,dz);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}",[w,h,ofs[0],ofs[1]])
                p=f'{FR}/{n:05d}.png';await g.shot(p,clip={'x':max(0,min(1280-w,cx)),'y':max(0,min(720-h,cy)),'width':w,'height':h})
                im=Image.open(p).convert('RGB').resize((OW,OH),Image.LANCZOS)
                if label:
                    d=ImageDraw.Draw(im);tw=d.textlength(label,font=fnt)
                    d.rounded_rectangle([10,10,24+tw,46],8,fill=(46,30,14));d.text((17,13),label,font=fnt,fill=(255,236,190))
                im.save(p)
                n+=1
        await g.close()
        if g.errs:print('ERRORS',g.errs[:4])
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/hippo_{TREE}.mp4'],check=True)
    print(f'{OUT}/hippo_{TREE}.mp4',n,'frames')
asyncio.run(main())
