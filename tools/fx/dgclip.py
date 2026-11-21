"""Dragon-lion showcase clip per tree: DSF=2 python3 tools/fx/dgclip.py basic|a|b [extra-query]  (DSF = device pixel ratio, CW/CH = crop in css px)  → $OUT/dragon_<tree>.mp4 (30 fps, Thai labels)
Each entry: (key | 'js:<code>', label, seconds, pre-js, distance to the dummy, test-room mode). In js / pre code the dummy is __e.
Serve the repo on 8765 first (python3 -m http.server 8765). OUT=/tmp/fx by default."""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('HERO','dragon')
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TREE=sys.argv[1];EXTRA=sys.argv[2] if len(sys.argv)>2 else ''
SEQ={'basic':[('basic','Azure Fist Combo · หมัดน้ำต่อเนื่อง',.55,'',62,'one'),('basic','',.55,'',62,'one'),('basic','',.6,'',62,'one'),
      ('js:LV.dcChain=0;player.basicIdx=3;player.basicLast=gameTime;startAction(mkBasic(__e));','Dragon Tail Sweep · หางกวาดรอบตัว',.9,'',62,'one'),
      ('js:LV.dcChain=1;player.basicIdx=4;player.basicLast=gameTime;startAction(mkBasic(__e));','Dragon Chain · หมัดปราณจังหวะที่ 5',1.0,'',62,'one'),
      ('dnGuard','Komainu Guard · โล่โคมะอินุ',.45,'',62,'one'),('js:window.jgAbsorb(60,__e);','(กันได้ → Stone Guardian คลื่นหิน)',1.0,'',0,'one'),
      ('dnRush','Horn Rush · พุ่งเขาทอง',.9,'',150,'one'),('dnBreath','Calm Breath · ลมหายใจหยก ฟื้น HP/SP',2.5,'',90,'one'),("dnRoar","Lion's Roar · คำรามสิงห์มังกร",1.3,'',70,'one')],
 'a':[('daJab','Tide Jab (+Riptide Barrage) · แย็บน้ำ 5 หมัด',1.1,'',62,'one'),('daHook','Whirlpool Hook · ฮุกน้ำวนดึงเป้า',1.0,'',150,'one'),('daStep','Riptide Step · พุ่งทะลุแล้วต่อยหลัง',1.0,'',130,'one'),
      ('daHundred','Hundred Waves (+Thousand Waves) · ร้อยหมัด + คลื่นยักษ์',1.7,'',62,'one'),('daTsunami','Tsunami Uppercut (+Crashing Tide) · อัปเปอร์คัตน้ำพุ',1.3,'',62,'one'),
      ('daEbb','Ebb and Flow · โดมน้ำเก็บแรงแล้วปล่อยหมัด',3.0,'for(let i=0;i<4;i++)setFxTimer(.4+i*.42,()=>{try{window.jgAbsorb(140,__e);}catch(x){}});',62,'one'),
      ('dcAbyss','Abyssal Torrent · ทุบพื้นเกิดคลื่นยักษ์',1.5,'',70,'one'),('daTorrent','Great Azure Torrent · ULT A หายตัวต่อยทีละตัว',1.6,'',90,'room'),
      ('dcMaelstrom','Maelstrom · วังน้ำวนดูดแล้วต่อยกลางวง',2.8,'',90,'room')],
 'b':[('dkPalm','Wind Palm (+Gale Fan) · ฝ่ามือลม 3 ทาง',1.0,'',170,'one'),('dkSeal','Thunder Seal Palm · ตราอัสนีครบ 3 → ฟ้าผ่า',1.4,'__e.dgSeal=2;__e.dgSealT=gameTime+10;',170,'one'),
      ('dkCloud','Cloud Step (+Rain Cloud) · ก้าวถอยทิ้งเมฆฝน',2.4,'',70,'one'),('dkTwin','Twin Dragon Palms (+Nine Dragons, Dragon Coil) · มังกรปราณ',2.0,'',180,'one'),
      ('dkPush','Heaven Push (+Gale Wall) · ฝ่ามือสวรรค์ + กำแพงลม',2.0,'DG.orbs=3;',70,'one'),('dkMirror','Mirror Pond · สระกระจกสะท้อน',1.4,'setFxTimer(.6,()=>{try{dHit(__e,1,\'dkMirror\');dArc(player,__e);}catch(x){}});',170,'one'),
      ('dcBreath',"Dragon's Breath · ลมหายใจมังกร",1.2,'',90,'one'),('dcAwaken','Shishi Awakening · แผงคอไฟคราม',1.8,'',90,'one'),('dcSovereign','Storm Sovereign · ขี่เมฆพายุ',1.6,'',90,'one'),
      ('dkDescend','Azure Dragon Descends · ULT B มังกรครามลงมาขดรอบพื้นที่',6.6,'',150,'room')]}[TREE]
OUT=os.environ.get('OUT','/tmp/fx');os.makedirs(OUT,exist_ok=True);FR=f'/tmp/frdg_{TREE}';shutil.rmtree(FR,ignore_errors=True);os.makedirs(FR)
W,H=int(os.environ.get('CW','600')),int(os.environ.get('CH','350'))
CAST="""([k,near,pre])=>{try{if(player.action)endAction();}catch(x){}player.casting=null;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;player.cd={};
  const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)),e=es[0];window.__e=e;
  if(e&&near>0){e.x=e.hx;e.y=e.hy;player.x=e.x-near;player.y=e.y;}const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  window.__cx=e?(player.x+e.x)/2:player.x+70;window.__cy=player.y;if(pre)(0,eval)(pre);
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
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/dragon_{TREE}.mp4'],check=True)
    print(f'{OUT}/dragon_{TREE}.mp4',n,'frames')
asyncio.run(main())
