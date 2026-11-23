"""Snow Monkey showcase clip per tree: DSF=2 python3 tools/fx/wkclip.py basic|a|b [extra-query]  (DSF = device pixel ratio, CW/CH = crop in css px)  → $OUT/wukong_<tree>.mp4 (30 fps, Thai labels)
Each entry: (key | 'js:<code>', label, seconds, pre-js, distance to the dummy, test-room mode). In js / pre code the dummy is __e.
Beats are pre-filled in `pre` so the autospells show inside a short clip. Serve the repo on 8765 first. OUT=/tmp/fx by default."""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('HERO','wukong')
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TREE=sys.argv[1];EXTRA=sys.argv[2] if len(sys.argv)>2 else ''
HIT="setFxTimer(%s,()=>{try{if(window.jgPreHit(__e)!==0)window.jgAbsorb(60,__e);}catch(x){}});"
SKA="window.__BENCH_SKIP=k=>gCol(k)==='B';"
SKB="window.__BENCH_SKIP=k=>gCol(k)==='A';"
CLR="for(const c of WK.swarm)c.gone=1;WK.swarm.length=0;WK.beats={};WK.last={};WK.rp=0;WK.mob=null;WK.cave=null;WK.storm=null;"
BB="WK.beats.gnHair=2.5;"
SEQ={'basic':[('basic','Ruyi Staff · ไม้เท้าห่วงฟาดต่อเนื่อง ตีโดน = 1 จังหวะ',.5,CLR+SKA+'WK.beats.gnHair=1.5;',80,'one'),('basic','',.45,'',80,'one'),('basic','Hair Clone · ครบจังหวะ ร่างขนทองโผล่ฟาดแทนเรา',.6,'',80,'one'),
      ('basic','',.45,'',80,'one'),('basic','',.6,'',80,'one'),
      ('gnCloud','Somersault Cloud · ตีลังกาขึ้นเมฆ ลงแล้ว 3 วิ ตีโดน = 2 จังหวะ',1.1,'',230,'one'),
      ('gnPeach','Peach of Immortality · กินท้อเซียน ฟื้น HP',1.0,'',90,'one'),
      ('gnSub','Hair Substitute · ร่างขนรับท่าแทน ได้จังหวะคืน',1.3,HIT%'.5',80,'one'),
      ('gxFurnace','Out of the Furnace · ไฟทองท่วมตัว ทุก 3 จังหวะแถม 1',1.6,'',90,'one')],
 'a':[('gaSmash','Pillar Smash · ไม้เท้าโตเป็นเสาค้ำฟ้าทุบ +3 อาละวาด',1.0,CLR+SKA,85,'one'),
      ('basic','Ruyi Rhythm · ร่างขนโผล่หลังเป้า แทงทะลุมาหาเรา',.8,'WK.beats.gaRhythm=2.6;WK.last={};',85,'one'),
      ('basic','Thousand Staves · ร่างขน 3 ร่างรุมฟาด',.9,'WK.beats.gaThousand=5.6;WK.last={};',85,'one'),
      ('basic','Sky-Pillar Drop · วิญญาณหงอคงยักษ์ปักไม้เท้าจากฟ้า',1.3,'WK.beats.gaPillar=9.6;WK.last={};',85,'one'),
      ('gaNeedle','Needle Strike · ขว้างเข็มแล้วยืดเป็นไม้เท้าฟาด',1.0,'',230,'one'),
      ('gaLeap','Heaven-Smashing Leap · กระโดดลงทุบ (+Quake Landing)',1.1,'',220,'one'),
      ('gaSplit','Mountain Splitter · ใช้อาละวาดทั้งหมดผ่าภูเขา (+Unbound)',1.5,'WK.rp=rpCap();WK.rpT=gameTime;',90,'one'),
      ('gaUlt','Havoc in Heaven · ULT A หงอคงเข้าสิง ท่าออโต้ออกเป็นคู่',2.6,'WK.beats.gaRhythm=2.6;WK.beats.gaThousand=5.6;WK.last={};',85,'one'),
      ('basic','',.6,'WK.beats.gaRhythm=2.6;WK.last={};',85,'one'),
      ('gxBang','Ruyi Jingu Bang · ไม้เท้าเท่าภูเขาทุบลงเป้าเดียว',1.7,'WK.ultA=-99;WK.ultAOn=0;',200,'one')],
 'b':[('gbBlow','Pluck & Blow · ถอนขนเป่า ร่างขน 3 ร่างโผล่',1.3,CLR+SKB,110,'room'),
      ('basic','Copycat Swarm · ร่างขนตีตามเรา (ร่างงอกเองทุก 4 จังหวะ)',.6,'',110,'room'),('basic','',.6,'',110,'room'),
      ('basic','Monkey Pile-On · ทุกร่างกระโดดทับเป้า',.9,'WK.beats.gbPile=5.6;WK.last={};',110,'room'),
      ('basic','Staff Whirlwind · เรากับทุกร่างหมุนไม้เท้า',.9,'WK.beats.gbWhirl=8.6;WK.last={};',110,'room'),
      ('basic','Thousand-Monkey Barrage · ร่างชั่วคราว 6 ร่างรัวไม้เท้า',1.6,'WK.beats.gbBarrage=14.6;WK.last={};',110,'room'),
      ('gbForm','Seventy-Two Transformations · ร่างเสือ',.9,'',110,'room'),('gbForm','ร่างผึ้ง',.9,'',110,'room'),('gbForm','ร่างหิน (+Master of Change ท่าเข้าร่าง)',.9,'',110,'room'),
      ('gbMob','Monkey Mob · ทุกร่างกระโดดเกาะเป้า',1.4,'',110,'room'),
      ('gbCave','Water Curtain Cave · ม่านน้ำตก ร่างงอกเร็ว',1.6,'',110,'room'),
      ('gbUlt','Flower-Fruit Mountain Army · ULT B กองทัพวานร',2.2,'',0,'room'),
      ('gxStorm','Storm of Ten Thousand Monkeys · พายุวานรหมื่นตัว',2.2,'',0,'room'),
      ('gbRecall','Hair Recall · เรียกร่างกลับเป็นขน ได้จังหวะ + HP',1.2,'',0,'room')],
 # jump smash sprite (owner's 8-frame sheet 2026-11-23): 7th field = playback speed (1/3 = slow motion)
 'jump':[('gaLeap','Heaven-Smashing Leap · ท่ากระโดดทุบ (สไปร์ใหม่)',1.0,CLR+SKA+'window.__cy=player.y-40;',220,'one'),
      ('gaLeap','ช้าลง 3 เท่า',1.0,'window.__cy=player.y-40;',220,'one',1/3),
      ('gaLeap','กระโดดไปทางซ้าย (ภาพกลับด้านให้เอง)',1.0,'player.x=__e.x+220;window.__cx=(player.x+__e.x)/2;window.__cy=player.y-40;',220,'one'),
      ('gxBang','Ruyi Jingu Bang · กระโดดทุบ + ไม้เท้าเท่าภูเขา',1.7,'WK.ultA=-99;WK.ultAOn=0;window.__cy=player.y-40;',200,'one')]}[TREE]
OUT=os.environ.get('OUT','/tmp/fx');os.makedirs(OUT,exist_ok=True);FR=f'/tmp/frwk_{TREE}';shutil.rmtree(FR,ignore_errors=True);os.makedirs(FR)
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
        for (k,label,secs,pre,near,md,*sp) in SEQ:
            sp=sp[0] if sp else 1
            if md!=mode:
                mode=md;await g.ev("(m)=>{const b=document.querySelector('[data-tr='+m+']');if(b)b.click();}",md);await g.step(30)
            if not k.startswith('js:') and k!='basic':await g.step(36)
            r=await g.ev(CAST,[k,near,pre])
            if r not in ('ok','true','undefined','[object Object]'):print(k,r)
            for i in range(int(secs*30/sp)):
                await g.step(2) if sp==1 else await g.step(1,sp/30)
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
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/wukong_{TREE}.mp4'],check=True)
    print(f'{OUT}/wukong_{TREE}.mp4',n,'frames')
asyncio.run(main())
