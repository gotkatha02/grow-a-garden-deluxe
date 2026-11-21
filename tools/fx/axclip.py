"""Axolotl showcase clip per tree: python3 tools/fx/axclip.py basic|a|b|c [extra-query]  → $OUT/<tree>.mp4 (30 fps, Thai labels, OUT=/tmp/fx by default)"""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TREE=sys.argv[1];EXTRA=sys.argv[2] if len(sys.argv)>2 else ''
SEQ={'basic':[('basic','Water Flick · ตีปกติ (ดีดหยดน้ำ)',1.0,''),('basic','',.9,''),('axSlip','Slipstream · ไถลบนน้ำ',1.2,''),('axPop','Splash Pop · ฟองน้ำพองแล้วแตก',1.7,''),('axRinse','Gentle Rinse · สายน้ำล้างฟื้น HP',1.8,'AX.drops=3;')],
 'a':[('axNeedle','Needle Jet · ลำน้ำแรงดันทะลุ',1.3,''),('axDrill','Water Drill · สว่านน้ำเจาะ',1.9,''),('axSlap','Hydro Slap · ฝ่ามือน้ำตบ',1.5,''),('axSaw','Water Saw · จานเลื่อยน้ำ',1.6,''),
      ('axCollapse','Pressure Collapse · วงน้ำยุบ',1.7,''),('axGyro','Gyro Current · น้ำวนรอบเป้า',2.4,''),('axCompress','Compression Shot · ลูกน้ำอัด',1.6,''),('axCannon','Hydro Cannon · ปืนใหญ่น้ำ',2.4,''),("axHeart","Ocean's Heartbeat · ULT A หัวใจมหาสมุทร",5.0,'')],
 'b':[('asDrop','Healing Drop · หยดน้ำรักษา',1.6,''),('asMist','Regen Mist · หมอกมินต์',2.0,''),('asPurify','Purifying Rinse · น้ำชำระล้าง',1.5,''),('asCushion','Liquid Cushion · เยื่อน้ำกันตี',1.5,''),
      ('asLift','Bubble Lift · ฟองยกศัตรู',2.2,''),('asMending','Mending Stream · สายน้ำรักษาต่อเนื่อง',2.6,''),('asFloat','Emergency Float · ห่วงน้ำพยุง',1.6,''),('asRenewal','Spring Renewal · คลื่นฤดูใบไม้ผลิ',1.5,''),('asMiracle','Miracle of Life · ULT B ปาฏิหาริย์แห่งชีวิต',4.4,'')],
 'c':[('acBlink','Aqua Blink · ละลายเป็นแอ่งน้ำ',1.4,''),('acMembrane','Living Membrane · เยื่อน้ำมีชีวิต',1.3,''),('js:if(axMembraneFx){axMembraneFx.hit(0);setFxTimer(.15,()=>{axMembraneFx&&axMembraneFx.pop();delete player.buffs.axMembrane;});}','(โดนตี → เยื่อแตก)',.9,''),
      ('acSpring','Second Spring · ฤดูใบไม้ผลิครั้งที่สอง',1.8,''),('js:cocoonStart();','(ตายแล้ว → ดักแด้น้ำ → ฟื้น)',3.2,'')]}[TREE]
OUT=os.environ.get('OUT','/tmp/fx');os.makedirs(OUT,exist_ok=True);FR=f'/tmp/fr_{TREE}';shutil.rmtree(FR,ignore_errors=True);os.makedirs(FR)
W,H=720,420
CAST="""(k)=>{if(window.__px0==null){window.__px0=player.x;window.__py0=player.y;}if(!k.startsWith('js:')){player.x=__px0;player.y=__py0;cam.x=player.x;cam.y=player.y;}try{if(player.action)endAction();}catch(x){}player.casting=null;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;player.cd={};
  const e=enemies.filter(e=>!e.dead)[0];if(e){e.x=e.hx;e.y=e.hy;}const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  if(k.startsWith('js:')){(0,eval)(k.slice(3));return 'ok';}
  if(k==='basic'){startAction(mkBasic(e));return 'ok';}return String(castSkill(k,{target:e,phi,gx:e?e.x:player.x+120,gy:e?e.y:player.y}));}"""
async def main():
    async with async_playwright() as pw:
        g=Game(w=1280,h=720,extra=EXTRA);await g.start(pw);await g.step(60)
        fnt=ImageFont.truetype(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf'),22)
        n=0;sheet=[]
        for (k,label,secs,pre) in SEQ:
            if pre:await g.ev("()=>{"+pre+"}")
            if not k.startswith('js:') and k!='basic':await g.step(40)
            await g.ev(CAST,k)
            frames=int(secs*30);best=None
            for i in range(frames):
                await g.step(2)
                cx,cy=await g.ev("([w,h])=>{const q=P(player.x+70,player.y-30,0);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}",[W,H])
                p=f'{FR}/{n:05d}.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':W,'height':H})
                if label:
                    im=Image.open(p).convert('RGB');d=ImageDraw.Draw(im);tw=d.textlength(label,font=fnt)
                    d.rounded_rectangle([10,10,24+tw,46],8,fill=(14,40,60));d.text((17,13),label,font=fnt,fill=(220,250,255));im.save(p)
                    if i==int(frames*.45):sheet.append(im.copy())
                n+=1
        await g.close()
        if g.errs:print('ERRORS',g.errs[:4])
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/{TREE}.mp4'],check=True)
    print(f'{OUT}/{TREE}.mp4',n,'frames')
asyncio.run(main())
