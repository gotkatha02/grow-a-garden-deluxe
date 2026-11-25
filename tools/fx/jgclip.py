"""Eclipse Jaguar showcase clip per tree (effects v3, 2026-11-25): DSF=2 python3 tools/fx/jgclip.py basic|a|b|c|ult [extra-query]  (ult: use CW=900 CH=540)  (DSF = device pixel ratio, CW/CH = crop in css px)
→ $OUT/jaguar_<tree>.mp4 (30 fps, Thai labels). Serve the repo on 8765 first (python3 -m http.server 8765). OUT=/tmp/fx by default.
Each entry: (key | 'js:<code>', label, seconds, pre-js, distance to the dummy (<0 = stay where the last entry left her), test-room mode[, (dx,dz) crop offset]).
In js / pre code the dummy is __e and setFxTimer runs on the game clock (the clip steps the game by hand)."""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('HERO','jaguar')
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TREE=sys.argv[1];EXTRA=sys.argv[2] if len(sys.argv)>2 else ''
CAST1="castSkill('%s',{target:__e,phi:Math.atan2(__e.y-player.y,__e.x-player.x),gx:__e.x,gy:__e.y,action:{attacker:__e}});"
def then(k):return 'js:'+(CAST1%k)
HIT="hitPlayer(__e,{});"
SEQ={'basic':[('basic','Twin Fang · มีดคู่ออบซิเดียน ฟันไขว้ทอง-ม่วง',.5,'',95,'one'),('basic','',.5,'',-1,'one'),('basic','',.7,'',-1,'one'),
      ('jgStep','Jaguar Step · พุ่งเป็นเงา รอยเท้าเสือ ใบไม้ปลิว',.9,'',170,'one',(-60,34)),
      ('js:'+CAST1%'jgCountercut'+'setFxTimer(.18,()=>{'+HIT+'});','Countercut · ไขว้มีดรับ แล้วหลบเฉียงฟันสวน',1.2,'',80,'one'),
      ('jgCry',"Predator's Cry · วิญญาณเสือจากัวร์ทองคำรามข้างหลัง",1.7,'',130,'one'),
      ('jgFocus',"Hunter's Focus · ดวงตานักล่า ล็อกเหยื่อ",1.4,'',150,'one'),
      ('jgExpose','Expose Armor · แทงทะลวง แผ่นเกราะแตกกระเด็น',1.1,'',100,'one')],
 'a':[('jgTempo','Savage Tempo · กลองศึก ตีเร็วตามจังหวะกลอง',1.4,'',130,'one'),
      ('jgRending','Rending Fang · เขี้ยวฉีก ทิ้งรอยเล็บเหยื่อ',.9,'',95,'one'),(then('jgOpenWound'),'+ Open Wound · แผลแยก เลือดพุ่งเป็นมงกุฎ',1.0,'',-1,'one'),
      ('jgTalon','Twin Talon Dance · ระบำกรงเล็บคู่',1.5,'',95,'one'),(then('jgFinalTalon'),'+ Final Talon · กากบาทแดงทองฉีกเหยื่อ',1.1,'',-1,'one'),
      ('js:'+CAST1%'jgParry'+'setFxTimer(.2,()=>{'+HIT+'setFxTimer(.2,()=>{'+CAST1%'jgReprisal'+'});});','Obsidian Parry + Backstab Reprisal · ปัดแล้วอ้อมหลังแทงสวน',1.5,'',80,'one'),
      ('jgSiphon','Life Siphon · ดูดเลือดกลับเข้าตัว',.9,'',95,'one'),(then('jgBloodChase'),'+ Blood Chase · พุ่งตามกลิ่นเลือด',.8,'',-1,'one'),
      ('jgCyclone','Jaguar Cyclone · มีดคู่หมุนเป็นพายุ',1.3,'',70,'one'),(then('jgSpiral'),'+ Spiral Ambush · พุ่งเกลียวซุ่มแทง',1.0,'',-1,'one'),
      ('jgDrop','Predator Drop · กระโจนจากฟ้า ตะปบพื้นแตก',1.3,'',150,'one'),
      ('jgThrone','Throne of Claws · ULT A หายตัวฟันวาร์ป รอยแผลค้างแล้วระเบิด',4.0,'',120,'one')],
 'b':[('jgTwilight','Twilight Fang · เขี้ยวพลบค่ำ จันทร์คราสฟันผ่าน',1.2,'',100,'one'),
      ('jgVeil','Shadow Veil · ม่านเงา หลอมเข้ากับความมืด',1.4,'',130,'one'),
      ('jgVenom','Venom Sigil · ตราอสรพิษ แอ่งพิษหยก',1.0,'',95,'one'),(then('jgBloom'),'+ Venom Bloom · ดอกพิษบาน',1.1,'',-1,'one'),
      ('jgSlip','Shadow Slip · ละลายเป็นเงา โผล่หลังเหยื่อ',.8,'addBrand(__e,3);',110,'one'),(then('jgEBackstab'),'+ Eclipse Backstab · ดึงตราคราสออก ระเบิดดวงอาทิตย์ดำ',1.1,'',-1,'one'),
      ('js:'+CAST1%'jgMirror'+'setFxTimer(.5,()=>{'+HIT+'setFxTimer(.25,()=>{'+CAST1%'jgShatter'+'});});','Obsidian Mirror + Mirror Shatter · กระจกเทซคาทลิโปคา แตกพุ่งใส่',1.8,'',110,'one'),
      ('jgMoonTrap','Moon Trap · กับดักจันทร์ ฟันออบซิเดียนงับ',2.2,'',130,'one',(60,30)),
      ('jgNightfall','Nightfall Dance · ร่างเงาโผล่สองข้างฟันไขว้',1.2,'',100,'one'),(then('jgPhantom'),'+ Phantom Riposte · ร่างเงาสวนกลับ',1.0,'',-1,'one'),
      ('jgHorizon','Black Horizon · กำแพงเงาดำกลิ้งออกเป็นพัด ตราคราสระเบิด',1.5,'for(const q of enemies)if(q._dummy)addBrand(q,2);',0,'room'),
      ('jgFifthSun','Eclipse of the Fifth Sun · ULT B ดวงอาทิตย์ดำ ฝนหอกออบซิเดียน',4.4,'',0,'room',(0,60))],
 'ult':[('jgThrone','Throne of Claws · ULT A หายตัวฟันวาร์ป รอยแผลค้างแล้วระเบิด',4.0,'',120,'one',(0,50)),
      ('jgFifthSun','Eclipse of the Fifth Sun · ULT B ดวงอาทิตย์ดำ ฝนหอกออบซิเดียน',4.6,'',0,'room',(0,110))],
 'c':[('jcSeal','Obsidian Seal · ขว้างแผ่นผนึก ชาร์จแล้วระเบิด',1.9,'',130,'one',(60,30)),
      ('jcTotem','Blood Moon Hunt · จันทร์เลือดขึ้นหลังนักล่า',2.4,'',130,'one'),
      ('jcSkyPounce','Sky-Pounce · กระโจนพร้อมวิญญาณเสือทอง',1.6,'',170,'one'),
      ('jgSlip','',.7,'for(const q of enemies)if(q._dummy)addBrand(q,3);',0,'room'),(then('jgEBackstab'),'Dark Sun Chain · ตราคราสระเบิด โซ่ออบซิเดียนกระโดดไปเป้าอื่น',1.4,'',-1,'room')]}[TREE]
OUT=os.environ.get('OUT','/tmp/fx');os.makedirs(OUT,exist_ok=True);FR=f'/tmp/frjg_{TREE}';shutil.rmtree(FR,ignore_errors=True);os.makedirs(FR)
W,H=int(os.environ.get('CW','600')),int(os.environ.get('CH','350'))
CAST="""([k,near,pre])=>{try{if(near>=0&&player.action)endAction();}catch(x){}player.casting=null;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;player.cd={};
  for(const q of enemies)if(q._dummy&&!q.H0){q.H0=[q.hx,q.hy];for(const kk of ['hx','hy'])Object.defineProperty(q,kk,{get(){return kk==='hx'?this.x:this.y;},set(v){},configurable:true});}
  const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)),e=near<0&&window.__e&&!window.__e.dead?window.__e:es[0];window.__e=e;
  if(e&&near>0){e.x=e.H0[0];e.y=e.H0[1];e.z=0;player.x=e.x-near;player.y=e.y;}
  if(near===0){const D=enemies.filter(q=>q._dummy);for(const q of D){q.x=q.H0[0];q.y=q.H0[1];q.z=0;}player.x=D.reduce((s,q)=>s+q.x,0)/D.length-60;player.y=D.reduce((s,q)=>s+q.y,0)/D.length;}
  const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;if(near>=0)faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  if(near>=0){window.__cx=near===0?player.x+60:(e?(player.x+e.x)/2:player.x+70);window.__cy=player.y;}if(pre)(0,eval)(pre);
  if(k.startsWith('js:')){(0,eval)(k.slice(3));return 'ok';}
  if(k==='basic'){startAction(mkBasic(e));return 'ok';}return String(castSkill(k,{target:e,phi,gx:e?e.x:player.x+120,gy:e?e.y:player.y}));}"""
async def main():
    async with async_playwright() as pw:
        g=Game(w=1280,h=720,extra=EXTRA);await g.start(pw);await g.step(60)
        fnt=ImageFont.truetype(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf'),22)
        n=0;mode='one'
        for ent in SEQ:
            k,label,secs,pre,near,md=ent[:6];ofs=ent[6] if len(ent)>6 else (0,34)
            if md!=mode:
                mode=md;await g.ev("(m)=>{const b=document.querySelector('[data-tr='+m+']');if(b)b.click();}",md);await g.step(30)
            if near>=0 and not k.startswith('js:') and k!='basic':await g.step(36)
            r=await g.ev(CAST,[k,near,pre])
            if r not in ('ok','true','undefined','[object Object]'):print(k[:40],r)
            for i in range(int(secs*30)):
                await g.step(2)
                cx,cy=await g.ev("([w,h,dx,dz])=>{const q=P(window.__cx+dx,window.__cy,dz);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}",[W,H,ofs[0],ofs[1]])
                p=f'{FR}/{n:05d}.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':W,'height':H})
                im=Image.open(p).convert('RGB')
                if im.width>1280:im=im.resize((1280,round(im.height*1280/im.width)),Image.LANCZOS)
                if label:
                    d=ImageDraw.Draw(im);tw=d.textlength(label,font=fnt)
                    d.rounded_rectangle([10,10,24+tw,46],8,fill=(40,22,12));d.text((17,13),label,font=fnt,fill=(255,236,200))
                im.save(p)
                n+=1
        await g.close()
        if g.errs:print('ERRORS',g.errs[:4])
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/jaguar_{TREE}.mp4'],check=True)
    print(f'{OUT}/jaguar_{TREE}.mp4',n,'frames')
asyncio.run(main())
