"""Anubis showcase clip per tree: DSF=1.5 MAP=egyF1 python3 tools/fx/anclip.py basic|a|b|c [extra-query]  → $OUT/anubis_<tree>.mp4 (30 fps, Thai labels)
(DSF = device pixel ratio, CW/CH = crop in css px, MAP = map of the test room: egyF1 = desert sand, default vikF2 = snow; extra-query e.g. '&vfx3=0' = the old painted look)
Each entry: (key | 'js:<code>', label, seconds, pre-js, distance to the dummy (0 = stand in the middle of the room), test-room mode [, (dx, dz) camera offset [, zoom]]). In js / pre code the dummy is __e.
zoom 1 = a crop of CW × CH css px (660 × 400), zoom 1.7 = a close-up; every frame is scaled to OW × OH (960 × 582).
Serve the repo on 8765 first (python3 -m http.server 8765). OUT=/tmp/fx by default."""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('HERO','anubis')
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TREE=sys.argv[1];EXTRA=sys.argv[2] if len(sys.argv)>2 else ''
SIN3="ANU.cond=__e;ANU.sin=3;";MOM5="ANU.mom=5;ANU.momT=gameTime+9;"
SEQ={'basic':[('basic','Chain Flail · ลูกตุ้มหนามเหวี่ยงบนโซ่ทอง',.62,'',100,'one',(0,34),1.7),('basic','',.62,'',100,'one',(0,34),1.7),('basic','',.62,'',100,'one',(0,34),1.7),
      ('js:ANU.spikeN=UK.anSpike.every-1;startAction(mkBasic(__e));','Ankh Spike · ครบจังหวะ อังค์ทองผุดรอบตัว',1.1,'',100,'one',(0,34),1.5),
      ('anLunge','Jackal Lunge (+Jackal Rush) · เงาหมาจิ้งจอกพุ่งทะลุแนว 2 ครั้ง',1.6,'',120,'one',(110,34),.92),
      ('anWraps','Linen Wraps · ผ้าลินินพันตัวเป็นโล่',1.7,'',130,'one',(-30,40),1.7),
      ('anRite','Embalming Rite · พิธีชำระ ฟื้น HP',1.5,'',130,'one',(-30,40),1.7),
      ('anStandard','Standard of Ra · ปักธงสุริยะ ยืนในวงได้ SP',2.2,'',130,'one',(-40,50),1.2)],
 'a':[('aaSweep','Ankh Sweep (+Twin Sweep) · กวาดครึ่งวงกว้าง แล้วกวาดกลับ',1.4,'',100,'room',(0,34),1.3),
      ('aaSpin','Sandstorm Spin (+Eye of the Storm) · หมุนลูกตุ้มเป็นพายุทราย',2.7,'',0,'room',(-60,40),1.15),
      ('aaLasso','Chain Lasso (+Ricochet) · เหวี่ยงลูกตุ้มทะลุแนว แล้วกระชากกลับ',1.5,'',130,'room',(40,34),1.2),
      ('aaMeteor','Meteor Ankh (+Shockwave Ring, Twin Meteors) · กระโดดทุบพื้น',1.9,'',150,'room',(60,40),1.15),
      ('aaCyclone','Duat Cyclone · ระเบิดแรงเหวี่ยงทั้งหมดเป็นพายุหมุน',1.7,MOM5,0,'room',(-60,50),1.05),
      ('aaGuard','Chain Guard · วงโซ่กันการโจมตี 3 ครั้ง',1.2,'',130,'one',(-30,40),1.7),('js:window.jgPreHit(__e);','',.8,'',130,'one',(-30,40),1.7),
      ('aaWheel','Wheel of Ra (+Solar Flare) · ULT A ดวงอาทิตย์โคจรรอบตัว',5.7,'',0,'room',(-60,60),.95)],
 'b':[('abHook','Soul Hook (+Barbed Hook) · ตะขอเกี่ยววิญญาณ ลากเข้าหา',1.5,'',190,'one',(0,34),1.3),
      ('abCrush',"Heart Crush (+Feather of Ma'at) · ลูกตุ้มทุบหัวใจ",1.5,SIN3,110,'one',(20,50),1.6),
      ('abBind','Binding Chains (+Shackle Spread) · โซ่จากพื้นรัดตรึง',2.0,'',140,'room',(40,40),1.25),
      ('abPounce',"Jackal Pounce (+Death's Door, Pack Leader) · เงาหมาจิ้งจอกกระโจนข้ามเป้า",1.6,SIN3,150,'one',(60,40),1.2),
      ('abJudge','Final Judgment (+Second Verdict) · ตาชั่งชี้ขาด เสาแสงพิพากษา',1.9,SIN3,120,'one',(30,60),1.4),
      ('abGate','Underworld Gate · จมลงประตูยมโลก โผล่หลังศัตรู',2.8,'',150,'one',(40,40),1.25),
      ('abHall',"Hall of Two Truths (+Osiris's Seal) · ULT B ตาชั่งยักษ์ ทุบ 10 ครั้ง",4.9,'',140,'room',(60,120),.95)],
 'c':[('js:player.basicIdx=4;player.basicLast=gameTime;startAction(mkBasic(__e));','Chain Frenzy · ตีปกติจังหวะที่ 5 กวาดครบวง',1.2,'',80,'room',(-20,34),1.3),
      ('acDevil','Dust Devil · พายุทรายไล่ตามศัตรู',3.2,'',150,'room',(60,50),1.3),
      ('acBreaker','Scale Breaker · ทุบแยกพื้น ไฟวิญญาณพุ่งตามแนว',1.7,'',100,'room',(70,40),1.2),
      ('acRebirth','Rite of Rebirth · วงดอกบัวชุบชีวิต',1.7,'',130,'one',(-30,40),1.7),
      ('acAvatar','Avatar of Anubis · ร่างเทพอนูบิสผุดขึ้นหลังตัว',2.7,'',130,'one',(-30,70),1.35),
      ('acWrath',"Ra's Wrath · ดวงอาทิตย์ตกใส่วง",2.7,MOM5,170,'room',(70,90),1.0),
      ('acVerdict','Anubis Verdict · หัวอนูบิสยักษ์งับผู้ถูกตัดสิน',2.4,SIN3,120,'one',(30,70),1.3)]}[TREE]
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
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/anubis_{TREE}.mp4'],check=True)
    print(f'{OUT}/anubis_{TREE}.mp4',n,'frames')
asyncio.run(main())
