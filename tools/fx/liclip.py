"""Olympian lion showcase clip per tree: DSF=2 python3 tools/fx/liclip.py basic|a|b [extra-query]  (DSF = device pixel ratio, CW/CH = crop in css px)  → $OUT/lion_<tree>.mp4 (30 fps, Thai labels)
Each entry: (key | 'js:<code>', label, seconds, pre-js, distance to the dummy, test-room mode). In js / pre code the dummy is __e.
Serve the repo on 8765 first (python3 -m http.server 8765). OUT=/tmp/fx by default."""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('HERO','lion')
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TREE=sys.argv[1];EXTRA=sys.argv[2] if len(sys.argv)>2 else ''
HIT="setFxTimer(%s,()=>{try{window.jgAbsorb(60,__e);}catch(x){}});"
SEQ={'basic':[('basic','Olympian Fist Combo · หมัดสายฟ้าซ้าย-ขวา',.5,'',62,'one'),('basic','',.5,'',62,'one'),('basic','',.5,'',62,'one'),
      ('js:player.basicIdx=4;player.basicLast=gameTime;startAction(mkBasic(__e));','Thunder Combo · หมัดที่ 5 อัปเปอร์คัตสายฟ้า',.9,'',62,'one'),
      ('lnHide','Nemean Hide · หนังสิงห์เนเมียน',1.1,'',90,'one'),('lnPounce','Lion Pounce · กระโจนใส่เป้า',1.1,'',210,'one'),
      ('lnRest','Laurel Rest · มงกุฎลอเรลพักฟื้น',1.3,'',90,'one'),("lnRoar","King's Roar · คำรามราชสีห์",1.2,'',90,'one'),
      ('lcCrown','Laurel Crown · มงกุฎลอเรลทอง',1.3,'',90,'one'),('lcAscend','Olympian Ascension · ร่างทองปีกสายฟ้า',1.8,'',90,'one')],
 'a':[('laGrab','Clinch Grab · ตะครุบจับล็อก',1.0,'',70,'one'),('laSuplex','Olympian Suplex · ยกทุ่มข้ามหัว',1.2,'',70,'one'),
      ('laShove','Heracles Shove · ผลักกระเด็น',1.0,'',70,'one'),('laSpin','Arena Spin (+Hurricane, Atlas Slam) · เหวี่ยงรอบวง',2.0,'',70,'one'),
      ('laLift',"Titan Lift (+Gaia's Crack) · ยกทุ่มพื้นแตก",1.5,'LI.glory=3;',70,'one'),('laCounter','Counter Hold · ตั้งท่ารับแล้วทุ่ม',1.6,HIT%'.5',70,'one'),
      ('lcToss','Titan Toss · ขว้างไกลระเบิดตอนตก',1.6,'',70,'one'),('lcTwelfth','The Twelfth Labor · ยกขึ้นฟ้าแล้วทุ่มลง',1.8,'LI.glory=3;',70,'one'),
      ('laLabors','Labors of Heracles · ULT A ไล่ทุ่ม 12 ครั้ง',3.4,'LI.glory=3;',0,'room')],
 'b':[('lbJavelin','Thunderbolt Javelin (+Forked) · หอกสายฟ้า',1.0,'',170,'one'),('lbSky','Sky Strike (+Thunder Rain, Twin Strike) · ฟ้าผ่า',1.6,'',170,'one'),
      ('lbEagle','Eagle of Zeus (+Aetos Guard) · อินทรีทองโฉบ',1.9,'',170,'one'),('lbCloud','Storm Cloud (+Thunderhead) · เมฆพายุ',2.4,'',130,'one'),
      ('lbOver','Overcharge · ประจุครบ 10',1.4,'LI.charge=10;',130,'one'),('lbAegis','Aegis Flash · โดมอีจิสกันตี 2 ครั้ง',1.8,HIT%'.7'+HIT%'1.2',90,'one'),
      ('lcKeraunos','Keraunos · สายฟ้าเคราอูนอสของซุส',1.6,'LI.charge=10;',170,'one'),
      ('lbWrath','Wrath of Olympus (+King of the Gods) · ULT B ฟ้าผ่า 12 สาย',4.4,'LI.charge=10;',0,'room')]}[TREE]
OUT=os.environ.get('OUT','/tmp/fx');os.makedirs(OUT,exist_ok=True);FR=f'/tmp/frli_{TREE}';shutil.rmtree(FR,ignore_errors=True);os.makedirs(FR)
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
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/lion_{TREE}.mp4'],check=True)
    print(f'{OUT}/lion_{TREE}.mp4',n,'frames')
asyncio.run(main())
