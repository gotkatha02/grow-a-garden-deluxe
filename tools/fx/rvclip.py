"""Odin's raven showcase clip per tree: DSF=2 python3 tools/fx/rvclip.py basic|a|b [extra-query]  (DSF = device pixel ratio, CW/CH = crop in css px)  → $OUT/raven_<tree>.mp4 (30 fps, Thai labels)
Each entry: (key | 'js:<code>', label, seconds, pre-js, distance to the dummy, test-room mode). In js / pre code the dummy is __e.
Serve the repo on 8765 first (python3 -m http.server 8765). OUT=/tmp/fx by default."""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('HERO','raven')
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TREE=sys.argv[1];EXTRA=sys.argv[2] if len(sys.argv)>2 else ''
HIT="setFxTimer(%s,()=>{try{window.jgAbsorb(60,__e);}catch(x){}});"
MEM4="RV.mem.length=0;for(let i=0;i<4;i++)RV.mem.push({key:'vaThrust',name:'Memory Thrust',m:2,aoe:0,t:gameTime});"
SEQ={'basic':[('basic',"Rune Spear · แทงหอกรูน — มูนินแทงซ้ำตามช้ากว่า 1 จังหวะ",.6,'RV.hug=null;RV.mem.length=0;',85,'one'),('basic','',.6,'',85,'one'),('basic','',.6,'',85,'one'),
      ('js:player.basicIdx=4;player.basicLast=gameTime;startAction(mkBasic(__e));','Gungnir Combo · จังหวะสุดท้ายแทงทะลุเป็นแนว',1.0,'',85,'one'),
      ('vnDive','Raven Dive · บินโฉบลงใส่เป้า',1.1,'',220,'one'),('vnCloak','Feather Cloak · ร่างขนนกดำ มูนินแทงสวน',1.4,HIT%'.6',80,'one'),
      ('vnEye',"Odin's Eye · ดวงตาโอดินจ้องศัตรู",1.2,'',90,'one'),('vnNights','Nine Nights · ภาวนา 9 คืน ฟื้น HP',1.2,'',90,'one'),
      ('vxAllfather',"Allfather's Gaze · ดวงตาจ้องทุกตัว ความทรงจำ/รูน ×2",1.6,'',0,'room')],
 'a':[('vaThrust','Memory Thrust · แทง 2 ครั้ง → ขนนกบินเข้าความทรงจำ',1.0,'RV.mem.length=0;RV.hug=null;',90,'one'),
      ('vaSweep','Twin Crescent · เรากวาดหน้า มูนินกวาดหลัง',1.1,'',90,'one'),('vaSwap','Shadow Swap · สลับตัวกับมูนินแล้วแทงประกบ',1.2,'',190,'one'),
      ('vaGungnir','Gungnir Throw (+Returning Spear) · ขว้างทะลุ มูนินขว้างกลับ',1.5,'',160,'one'),
      ('vaRecall',"Muninn's Recall · มูนินปล่อยทุกท่าที่จำไว้รวดเดียว",1.6,'',110,'one'),
      ('vaParry','Wing Parry · ตั้งปีกรับ ปัดแล้วแทงสวน',1.2,HIT%'.45',75,'one'),
      ('vxHaunt','Haunting Memory · มูนินสิงเป้า ตีซ้ำทุกครั้งที่เราตี',.8,'',90,'one'),('basic','',.6,'',90,'one'),('basic','',.6,'',90,'one'),
      ('vxGungnir','Gungnir, Spear of Odin · ใช้ความทรงจำทั้งหมด ไม่มีวันพลาด',1.9,MEM4,170,'one'),
      ('vaValhalla','Memories of Valhalla · ULT A หอกวิญญาณ 10 ครั้ง',3.2,'',0,'room')],
 'b':[('vbBolt','Rune Bolt · เรากับฮูกินยิงกระสุนรูนพร้อมกัน',1.1,'RV.hug=null;RV.storm=null;RV.runes=0;RV.runeN=0;',170,'one'),
      ('vbFlight',"Huginn's Flight · ส่งฮูกินไปเกาะ = จุดร่ายที่สอง",1.5,'',170,'one'),
      ('vbCircle','Rune Circle · วงรูนของเรา + วงของฮูกิน',1.5,'',170,'one'),('vbStorm','Thought Storm · พายุรูนรอบตัวฮูกิน',2.2,'',150,'one'),
      ('vbTether','Rune Tether (+Snapping Thread) · สายรูนเรากับฮูกิน',3.6,'RV.storm=null;',150,'one'),
      ('vbWard','Algiz Ward · รูนกันตี 2 ครั้ง กันได้ = สลักรูน',1.4,HIT%'.6'+HIT%'1.0',90,'one'),
      ('vxHavamal','Havamal Verse · รูนยักษ์จากบทกวีของโอดิน',1.8,'RV.runes=3;',150,'one'),
      ('vbRunes','Runes of the Allfather · ULT B รูน 9 ตัวรอบตัว',4.0,'',0,'room')]}[TREE]
OUT=os.environ.get('OUT','/tmp/fx');os.makedirs(OUT,exist_ok=True);FR=f'/tmp/frrv_{TREE}';shutil.rmtree(FR,ignore_errors=True);os.makedirs(FR)
W,H=int(os.environ.get('CW','600')),int(os.environ.get('CH','350'))
CAST="""([k,near,pre])=>{try{if(player.action)endAction();}catch(x){}player.casting=null;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;player.cd={};
  const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)),e=es[0];window.__e=e;
  for(const q of enemies)if(q._dummy&&!q.H0){q.H0=[q.hx,q.hy];for(const k of ['hx','hy'])Object.defineProperty(q,k,{get(){return k==='hx'?this.x:this.y;},set(v){},configurable:true});}   /* dummies stay where throws leave them */
  if(e&&near>0){e.x=e.H0[0];e.y=e.H0[1];e.z=0;player.x=e.x-near;player.y=e.y;}
  if(near===0){const D=enemies.filter(q=>q._dummy);for(const q of D){q.x=q.H0[0];q.y=q.H0[1];q.z=0;}player.x=D.reduce((s,q)=>s+q.x,0)/D.length;player.y=D.reduce((s,q)=>s+q.y,0)/D.length;}const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  window.__cx=near===0?player.x:(e?(player.x+e.x)/2:player.x+70);window.__cy=player.y;if(pre)(0,eval)(pre);
  if(k.startsWith('js:')){(0,eval)(k.slice(3));return 'ok';}
  if(k==='basic'){startAction(mkBasic(e));return 'ok';}return String(castSkill(k,{target:e,phi,gx:e?e.x:player.x+120,gy:e?e.y:player.y}));}"""
async def main():
    async with async_playwright() as pw:
        g=Game(w=1280,h=720,extra=EXTRA);await g.start(pw);await g.step(60)
        fnt=ImageFont.truetype(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf'),22)
        n=0;mode='one'
        for (k,label,secs,pre,near,md) in SEQ:
            if md!=mode:
                mode=md;await g.ev("(m)=>{const b=document.querySelector('[data-tr='+m+']');if(b)b.click();}",md);await g.step(30)
            if not k.startswith('js:') and k!='basic':await g.step(36)
            r=await g.ev(CAST,[k,near,pre])
            if r not in ('ok','true','undefined','[object Object]'):print(k,r)
            for i in range(int(secs*30)):
                await g.step(2)
                cx,cy=await g.ev("([w,h])=>{const q=P(window.__cx,window.__cy-30,0);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}",[W,H])
                p=f'{FR}/{n:05d}.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':W,'height':H})
                im=Image.open(p).convert('RGB')
                if im.width>1280:im=im.resize((1280,round(im.height*1280/im.width)),Image.LANCZOS)
                if label:
                    d=ImageDraw.Draw(im);tw=d.textlength(label,font=fnt)
                    d.rounded_rectangle([10,10,24+tw,46],8,fill=(20,24,60));d.text((17,13),label,font=fnt,fill=(235,240,255))
                im.save(p)
                n+=1
        await g.close()
        if g.errs:print('ERRORS',g.errs[:4])
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/raven_{TREE}.mp4'],check=True)
    print(f'{OUT}/raven_{TREE}.mp4',n,'frames')
asyncio.run(main())
