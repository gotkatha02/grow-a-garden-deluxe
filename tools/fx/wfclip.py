"""Wolf showcase clip of the v5 code effects (wolf_vfx5.js): DSF=1.5 python3 tools/fx/wfclip.py a|b|pic|pose|dance [extra-query] (pose = the 2.5D wolf's extra poses of 2026-11-26, '&wpose=0' = the frames before; pic = the 5 painted pictures of 2026-11-26; '&wpic=0' = the old ones; dance = Axe Dance with its own poses, also slowed down and facing left)  → $OUT/wolf_<tree>.mp4 (30 fps, Thai labels)
A key 'fu:<skill>' = a combo follow-up: cast on top of the entry before it (hero not moved, the parent's action is passed on); 'block:' in a pre-js = the dummy hits the wolf once (Iron Counter / Rune Guard).
(DSF = device pixel ratio, CW/CH = crop in css px, MAP = map of the test room: egyF1 = desert sand, default vikF2 = snow; extra-query e.g. '&vfx3=0' = the old painted look)
Each entry: (key | 'js:<code>', label, seconds, pre-js, distance to the dummy (0 = stand in the middle of the room, < 0 = on the dummy's right, facing left), test-room mode [, (dx, dz) camera offset [, zoom [, game frames per video frame: 2 = real time, 1 = half speed]]]). In js / pre code the dummy is __e.
zoom 1 = a crop of CW × CH css px (660 × 400), zoom 1.7 = a close-up; every frame is scaled to OW × OH (960 × 582).
Serve the repo on 8765 first (python3 -m http.server 8765). OUT=/tmp/fx by default."""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('HERO','wolf')
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TREE=sys.argv[1];EXTRA=sys.argv[2] if len(sys.argv)>2 else ''
HIT="setTimeout(()=>0,0);window.__blk=3;"
SEQ={'a':[('basic','Wolf Combo · คมขวานวาดตามหัวขวานจริง',.56,'',62,'one',(0,34),1.7),('basic','',.5,'',62,'one',(0,34),1.7),('basic','',.5,'',62,'one',(0,34),1.7),('basic','',.7,'',62,'one',(0,34),1.7),
      ('battleStep','Battle Step → Reversal Slash · พุ่งหลบแล้วฟันสวนกลับ',.34,'',40,'one',(20,34),1.3),('fu:reversalSlash','',.9,'',0,'one',(20,34),1.3),
      ('armorBreak','Armor Break · ทุบเกราะแตก เศษเหล็กกระเด็น',1.5,'',62,'one',(0,34),1.6),
      ('bloodCleave','Blood Cleave → Savage Rend · ฟันกว้างสีเลือด ต่อด้วยรอยกรงเล็บ 3 เส้น',1.0,'',62,'one',(10,34),1.4),('fu:savageRend','',1.3,'',0,'one',(10,34),1.4),
      ('axeDance','Axe Dance · ระบำขวาน 6 จังหวะคนละระนาบ + แทงปิด',2.5,'',62,'one',(0,34),1.5),
      ('ironCounter','Iron Counter → Revenge Breaker · กำแพงรูนตั้งรับ แล้วสวนสีทอง โซ่ขาดกระเด็น',.42,HIT,62,'one',(0,34),1.6),('fu:revengeBreaker','',1.3,'',0,'one',(0,34),1.6),
      ('vampiricAxe','Vampiric Axe → Blood Rush · ดูดเลือดกลับเข้าตัว แล้วพุ่งผ่าน',1.25,'',120,'one',(30,34),1.4),('fu:bloodRush','',1.0,'',0,'one',(30,34),1.4),
      ('predatorsLeap',"Predator's Leap · กระโจนตะครุบ รอยเล็บบนพื้น",1.7,'',170,'one',(60,40),1.25)],
 'rest':[('warFury','War Fury · วงรูนสีเลือดใต้เท้า ระเบิดพลังหนึ่งจังหวะ แล้วขนแดง',1.9,'',100,'one',(-50,40),1.6),
      ('ironCounter','Iron Counter → Revenge Breaker · กำแพงรูนเหล็กตั้งรับด้านหน้า ปัดแล้วสวน',.42,HIT,62,'one',(0,34),1.6),('fu:revengeBreaker','',1.3,'',0,'one',(0,34),1.6),
      ('axeCyclone','Axe Cyclone → Cyclone Leap · เกลียวลมหมุนขึ้นรอบตัว แล้วลงหมุนทุบพื้น',.55,'',62,'one',(0,40),1.25),('fu:cycloneLeap','',1.6,'',0,'one',(0,40),1.25),
      ('ravenousLeap','Ravenous Leap · วงรูนเฟนเรียร์ที่จุดกระโดดและจุดลง น้ำแข็งแตกทะลุพื้น',2.4,'',200,'one',(0,70),1.0),
      ('fenrirsSpirit',"Fenrir's Spirit · วงรูนเรียก เสาแสงเย็น เขี้ยวน้ำแข็งล้อมตัว แล้วเฟนเรียร์ออกล่า",5.2,'',90,'one',(-30,60),1.15)],
 'pose':[('warHowl','War Howl · ท่าใหม่ เงยหน้าหอน',1.5,'',100,'one',(-50,55),1.6),
      ('ironCounter','Iron Counter · ท่าใหม่ ตั้งการ์ดขวานขวางหน้า โดนตีแล้วรับไว้',.9,HIT,62,'one',(0,40),1.6),
      ('runeGuard','Rune Guard → Rune Burst · ยกขวานตั้งรับ แล้วแทงขวานสวน',.8,HIT,62,'one',(-20,40),1.4),('fu:runeBurst','',1.2,'',0,'one',(-20,40),1.4),
      ('battleStep','Battle Step · ท่าใหม่ พุ่งตัวต่ำ',.9,'',40,'one',(20,40),1.3),
      ('stormStep','Storm Step · ท่าพุ่ง',1.2,'',110,'one',(60,40),1.25),
      ('predatorsLeap',"Predator's Leap · ท่าใหม่ กระโดดเงื้อขวานฟันลง",1.7,'',170,'one',(60,45),1.25),
      ('axeCyclone','Axe Cyclone → Cyclone Leap · หมุนตัวเห็นครบทุกด้าน แล้วกระโดดทุบ',.55,'',62,'one',(0,45),1.25),('fu:cycloneLeap','',1.6,'',0,'one',(0,45),1.25),
      ('executioner','Executioner · ท่าใหม่ ย่อตัวชาร์จก่อนสับ',1.7,'if(!window.__sure){window.__sure=1;const _h=hurt;hurt=function(e,m,o){return _h.call(this,e,m,Object.assign({},o||{},{sure:1}));};}',62,'one',(10,60),1.3),
      ('axeDance','Axe Dance → Wolf Finale · ปิดท่าด้วยท่าชาร์จแทนการยกขวาน',2.5,'',62,'one',(0,45),1.4),('fu:wolfFinale','',1.7,'',0,'one',(0,45),1.4),
      ('ravenousLeap','Ravenous Leap · ย่อตัว ถีบตัวขึ้นสูง',2.4,'',200,'one',(0,70),1.0),
      ('fenrirsSpirit',"Fenrir's Spirit · หอนเรียกเฟนเรียร์",2.0,'',90,'one',(-30,55),1.3),
      ('warBanner','War Banner · หอนแล้วปักธง',2.0,'',120,'one',(0,50),1.3),
      ('warFury','War Fury · ท่าใหม่ แยกเขี้ยวคำราม (บัฟนี้ย้อมตัวแดง จึงไว้ท้ายคลิป)',1.8,'',100,'one',(-50,45),1.6)],
 'dance':[('axeDance','Axe Dance · ความเร็วจริง',2.7,'',95,'one',(0,42),1.45),
      ('axeDance','Axe Dance · ช้าลงครึ่งหนึ่ง',5.3,'',95,'one',(0,42),1.45,1),
      ('axeDance','Axe Dance · หันซ้าย (เกมกลับภาพให้เอง)',2.7,'',-95,'one',(0,42),1.45)],
 'pic':[('warHowl','War Howl · วิญญาณหมาป่าขาวหอนอยู่หลังตัว',1.4,'',100,'one',(-50,70),1.45),
      ('executioner','Executioner · ขวานผีสีแดงลอยเหนือเป้า แล้วฟันลง',1.7,'if(!window.__sure){window.__sure=1;const _h=hurt;hurt=function(e,m,o){return _h.call(this,e,m,Object.assign({},o||{},{sure:1}));};}',62,'one',(10,70),1.3),
      ('valhallasWrath',"Valhalla's Wrath · ขวานทองยักษ์เหวี่ยงตามทุกครั้งที่ฟัน แล้วตกลงกลางวง",6.0,'if(!window.__sure){window.__sure=1;const _h=hurt;hurt=function(e,m,o){return _h.call(this,e,m,Object.assign({},o||{},{sure:1}));};}',70,'one',(30,70),.95),
      ('runeGuard','Rune Guard · โล่รูนน้ำแข็ง 3 ใบลอยวนรอบตัว',1.8,'',100,'one',(-50,40),1.6),
      ('warBanner','War Banner · ธงศึกปักลงที่เป้า',2.2,'',120,'one',(0,50),1.3)],
 'b':[('frostFang','Frost Fang → Ice Break · เขี้ยวน้ำแข็งผุดเป็นแถว แล้วทุบแตก',1.0,'',120,'one',(30,34),1.4),('fu:iceBreak','',1.5,'',0,'one',(30,34),1.4),
      ('runeGuard','Rune Guard → Rune Burst · วงรูนระเบิดรอบตัว',.8,HIT,62,'one',(-20,40),1.3),('fu:runeBurst','',1.2,'',0,'one',(-20,40),1.3),
      ('thunderFang','Thunder Fang → Lightning Pursuit · ฟันสายฟ้า ฟ้าผ่าลง แล้วพุ่งตาม',.85,'',62,'one',(10,50),1.3),('fu:lightningPursuit','',1.2,'',0,'one',(10,50),1.3),
      ('stormStep','Storm Step · พุ่งเป็นสายฟ้า',1.2,'',110,'one',(60,34),1.25),
      ('thunderSpear','Thunder Spear · หอกสายฟ้าจากหัวขวาน วงรูนชี้เป้า',1.6,'',170,'one',(10,40),1.3),
      ('runeStorm','Rune Storm · วงรูนใหญ่ รูนลอยวน ฟ้าผ่าในวง ระเบิดปิด',3.5,'',130,'one',(60,50),1.0),
      ('blizzard','Blizzard (ของเดิม) → Frozen Descent · ผลึกยักษ์ตกกลางพายุ',.75,'',150,'one',(60,60),.95),('fu:frozenDescent','',1.9,'',0,'one',(60,60),.95)]}[TREE]
OUT=os.environ.get('OUT','/tmp/fx');os.makedirs(OUT,exist_ok=True);FR=f'/tmp/frwf_{TREE}'+('_'+''.join(ch for ch in EXTRA if ch.isalnum()) if EXTRA else '');shutil.rmtree(FR,ignore_errors=True);os.makedirs(FR)
W,H=int(os.environ.get('CW','660')),int(os.environ.get('CH','400'));OW,OH=int(os.environ.get('OW','960')),int(os.environ.get('OH','582'))   # crop of zoom 1 in css px · size of the video
CAST="""([k,near,pre])=>{const fu=k.startsWith('fu:');if(fu)k=k.slice(3);const pa=player.action||window.__pa;
  if(!fu){try{if(player.action)endAction();}catch(x){}}player.casting=null;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;player.cd={};
  const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)),e=es[0];window.__e=e;
  for(const q of enemies)if(q._dummy&&!q.H0){q.H0=[q.hx,q.hy];for(const k of ['hx','hy'])Object.defineProperty(q,k,{get(){return k==='hx'?this.x:this.y;},set(v){},configurable:true});}
  if(!fu){for(const q of enemies)if(q._dummy&&q.H0){q.x=q.H0[0];q.y=q.H0[1];q.z=0;q.vx=q.vy=0;if(q.st)for(const k in q.st)q.st[k]=0;}
    if(e&&near){player.x=e.x-near;player.y=e.y;}
    const phi0=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi0);window.__cx=e?(player.x+e.x)/2:player.x+70;window.__cy=player.y;}
  const phi=e?Math.atan2(e.y-player.y,e.x-player.x):player.phi;mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;window.__blk=0;if(pre)(0,eval)(pre);
  if(k==='basic'){startAction(mkBasic(e));return 'ok';}
  try{castSkillNow(k,{target:e,phi,gx:e?e.x:player.x+120,gy:e?e.y:player.y,action:fu?pa:null});}catch(x){return 'THROW '+String(x.stack||x).slice(0,200);}return 'ok';}"""
async def main():
    async with async_playwright() as pw:
        g=Game(w=1280,h=720,extra=EXTRA);await g.start(pw);await g.pg.add_style_tag(content='body>*:not(#c){visibility:hidden!important}');await g.step(60);await g.ev("()=>{window.__p0=[player.x,player.y];}")   # only the game canvas: no HUD, map label or menus in the crop
        fnt=ImageFont.truetype(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf'),22)
        n=0;mode='one'
        for ent in SEQ:
            k,label,secs,pre,near,md=ent[:6];ofs=ent[6] if len(ent)>6 else (0,34);zm=ent[7] if len(ent)>7 else 1;spf=ent[8] if len(ent)>8 else 2;w,h=W/zm,H/zm
            if md!=mode:
                mode=md;await g.ev("(m)=>{try{if(player.action)endAction();}catch(x){}player.x=__p0[0];player.y=__p0[1];const b=document.querySelector('[data-tr='+m+']');if(b)b.click();}",md);await g.step(30)   # the test room puts its dummies round the hero: always from the same spot
            if not k.startswith('fu:') and k!='basic':await g.step(40)
            r=await g.ev(CAST,[k,near,pre])
            if r not in ('ok','true','undefined','[object Object]'):print(k,r)
            for i in range(int(secs*30)):
                await g.step(spf);await g.ev("()=>{if(player.action)window.__pa=player.action;if(window.__blk>0&&--window.__blk===0&&window.__e){try{hitPlayer(window.__e,10,{});}catch(x){}}}")
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
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/wolf_{TREE}.mp4'],check=True)
    print(f'{OUT}/wolf_{TREE}.mp4',n,'frames')
asyncio.run(main())
