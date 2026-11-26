"""Woolly Rhino (Glacier Titan) showcase clip per tree: DSF=1.5 python3 tools/fx/rhclip.py basic|a|b|c|pics [extra-query]  → $OUT/rhino_<tree>.mp4 (30 fps, Thai labels)
Made from tools/fx/anclip.py (same entries: key | 'js:<code>', label, seconds, pre-js, distance to the dummy (0 = middle of the room), test-room mode, (dx, dz) camera offset, zoom).
'&vfx3=0' = the old look. Serve the repo on 8765 first. OUT=/tmp/fx by default."""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('HERO','rhino')
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TREE=sys.argv[1];EXTRA=sys.argv[2] if len(sys.argv)>2 else ''
SEQ={'basic':[('basic','Iron Fist Combo · หมัดวิญญาณน้ำแข็ง',.62,'',100,'one',(0,34),1.6),('basic','',.62,'',100,'one',(0,34),1.6),('basic','',.62,'',100,'one',(0,34),1.6),('basic','หมัดท้าย · หมัดทองแดง',.8,'',100,'one',(0,34),1.6),
      ('rhCharge','Rhino Charge · พุ่งชน ฝุ่นตามหลัง',1.3,'',220,'one',(60,34),1.1),
      ('rhGuard','Iron Guard · ยกแผ่นโล่เหล็ก',.9,'',130,'one',(-10,40),1.7),('js:window.jgPreHit(__e);','',.6,'',130,'one',(-10,40),1.7),
      ('rhCounter','Counter Punch · หมัดสวนทองแดง',1.4,'',100,'one',(0,40),1.4),
      ('rhRoar','Battle Roar · หัววิญญาณคำราม',1.4,'',130,'one',(-30,50),1.3),
      ('rhCrusher','Armor Crusher · หมัดทุบเกราะแตก',1.8,'',100,'one',(0,40),1.4)],
 'a':[('rhSkin','Iron Skin · แผ่นเหล็กประกบตัว',1.4,'',130,'one',(-30,40),1.5),
      ('rhStance','Guardian Stance (+Frozen Bastion) · ตราเหล็ก + ป้อมน้ำแข็ง',1.6,'',130,'one',(-30,40),1.5),
      ('rhCrushCounter','Crushing Counter (+Reflection) · ถุงมือวิญญาณยักษ์',1.6,'',100,'one',(10,40),1.4),
      ('rhWall','Steel Wall · กำแพงเหล็กโผล่จากพื้น',1.3,'',130,'one',(0,40),1.5),('js:rhWallObj&&(rhWallObj.flash=1);','',.5,'',130,'one',(0,40),1.5),
      ('rhPulse','Shielding Pulse · คลื่นน้ำแข็ง + โดมโล่',1.4,'',100,'room',(-30,40),1.2),
      ('rhRevenge','Revenge Fist · วงวนแดง หมัดแค้น',1.7,'',100,'one',(0,40),1.4),
      ('rhFortress','Rhino Fortress · ป้อมแผ่นโล่ + ยั่วยุ',1.6,'',0,'room',(-30,50),1.1),
      ('rhRetribution','Iron Retribution · ทุบพื้นน้ำแข็ง แผ่นเหล็กกระเด็น',1.7,'',100,'room',(-30,40),1.15),
      ('rhAnchor','Ground Anchor · สมอเหล็ก + โซ่',1.4,'',130,'one',(-30,40),1.5),
      ('rhQuake','Fortress Quake · แผ่นดินไหวน้ำแข็ง',1.8,'',100,'room',(-30,40),1.1),
      ('rhColossus','Immovable Colossus · วิญญาณยักษ์น้ำแข็ง',1.8,'',130,'one',(-30,60),1.3),
      ('rhAbsolute','Absolute Fortress · ULT A ป้อมสมบูรณ์ แล้วทุบ',3.6,'',0,'room',(-30,60),.95)],
 'b':[('rhKnuckle','Heavy Knuckle · หมัดหนักทองแดง',1.6,'',100,'one',(0,40),1.4),
      ('rhHammer','Double Hammer Fist · ทุบคู่ลงจากฟ้า',1.8,'',100,'one',(0,50),1.4),
      ('rhUppercut','Rising Uppercut · หมัดเสยลอย',1.5,'',100,'one',(0,60),1.3),
      ('rhTitan','Titan Combo · หมัด หมัด ทุบ',2.0,'',100,'one',(0,50),1.3),
      ('rhMeteor','Meteor Knuckle · หมัดอุกกาบาต',1.7,'',170,'one',(40,40),1.25),
      ('rhBone','Bone Crusher · หมัดทุบกระดูก',1.8,'',100,'one',(0,40),1.4),
      ('rhRush','Breaker Rush · พุ่ง 4 หมัด',1.5,'',180,'one',(40,40),1.25),
      ('rhShaker','Earthshaker (+Avalanche Chain) · ทุบพื้นหินแตก 2 คลื่น',2.2,'',100,'room',(-30,40),1.0),
      ('rhSeismic','Seismic Follow-up · หินผุดรอบวง',1.8,'',100,'room',(-30,40),1.05),
      ('rhAvalanche','Avalanche Punch · หมัดรัวหิมะ',2.4,'',100,'one',(0,40),1.3),
      ('rhFinale','Crushing Finale · หมัดยักษ์ตกจากฟ้า',2.0,'',120,'one',(20,60),1.15),
      ('rhFury','Fury · ไฟโทสะ',1.6,'',130,'one',(-30,50),1.4),
      ('rhSkybreaker','Skybreaker Fist · กระโดดทุบพื้น',1.8,'',150,'room',(60,60),1.0),
      ('rhWorldbreaker','Worldbreaker Impact (+Cataclysm) · ULT B ทุบโลกแตก',4.6,'',160,'room',(60,80),.85)],
 'pics':[('basic','ตีปกติ · หมัดเบา',.62,'',100,'one',(0,34),1.6),('basic','',.62,'',100,'one',(0,34),1.6),
      ('rhKnuckle','Heavy Knuckle · หมัดหนัก',1.6,'',100,'one',(0,40),1.4),
      ('rhHammer','Double Hammer Fist · หมัดคู่ทุบลง',1.8,'',100,'one',(0,50),1.4),
      ('rhUppercut','Rising Uppercut · หมัดเสย',1.5,'',100,'one',(0,60),1.3),
      ('rhMeteor','Meteor Knuckle · หมัดอุกกาบาต',1.7,'',170,'one',(40,40),1.25),
      ('rhRevenge','Revenge Fist · หมัดแก้แค้น',1.7,'',100,'one',(0,40),1.4),
      ('rhTitan','Titan Combo · หมัด หมัด ทุบ + หมัดวิญญาณ',2.2,'',100,'one',(0,50),1.3),
      ('rhFinale','Crushing Finale · หมัดยักษ์ตกจากฟ้า',2.0,'',120,'one',(20,60),1.15),
      ('rhWorldbreaker','Worldbreaker · ถุงมือยักษ์บนแขน แล้วทุบโลก',4.6,'',160,'room',(60,80),.85),
      ('rhRoar','Battle Roar · หัววิญญาณคำราม',1.5,'',130,'one',(-30,50),1.3),
      ('rhWall','Steel Wall · กำแพงเหล็ก',1.3,'',130,'one',(0,40),1.5),
      ('rhColossus','Immovable Colossus · วิญญาณยักษ์น้ำแข็ง',1.9,'',130,'one',(-30,70),1.1)],
 'c':[('rcGlacier','Glacier Charge · ลิ่มธารน้ำแข็งพุ่งชน',1.3,'',220,'one',(70,34),1.05),
      ('rcGrip','Colossus Grip · จับยกแล้วทุ่มลงพื้น',2.5,'',100,'one',(10,80),1.2),
      ('rcPact','Ironblood Pact · พันธสัญญาเลือดเหล็ก',1.4,'',130,'one',(-30,50),1.4),
      ('rcTotem','Glacier Bulwark · เสาน้ำแข็ง 3 ต้น',3.0,'',100,'one',(10,70),1.1)]}[TREE]
OUT=os.environ.get('OUT','/tmp/fx');os.makedirs(OUT,exist_ok=True);FR=f'/tmp/frrh_{TREE}';shutil.rmtree(FR,ignore_errors=True);os.makedirs(FR)
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
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/rhino_{TREE}.mp4'],check=True)
    print(f'{OUT}/rhino_{TREE}.mp4',n,'frames')
asyncio.run(main())
