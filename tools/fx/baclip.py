"""Bastet showcase clip per tree: DSF=2 python3 tools/fx/baclip.py basic|a|b|c [extra-query]  (DSF = device pixel ratio, CW/CH = crop in css px)  → $OUT/bastet_<tree>.mp4 (30 fps, Thai labels)
Each entry: (key | 'js:<code>', label, seconds, pre-js, distance to the dummy, test-room mode). In js / pre code the dummy is __e.
Serve the repo on 8765 first (python3 -m http.server 8765). OUT=/tmp/fx by default."""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('HERO','bastet')
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TREE=sys.argv[1];EXTRA=sys.argv[2] if len(sys.argv)>2 else ''
HEX4="__e.bHex=4;__e.bHexT=gameTime+6;"
SEQ={'basic':[('basic','Ankh Tome · ยิงหน้ากระดาษไฟวิญญาณ',.55,'',160,'one'),('basic','',.55,'',160,'one'),
      ('js:BA.bellN=3;startAction(mkBasic(__e));','Black Cat Omen · ทุกจังหวะที่ 4 เงาแมวดำกระโจน',.8,'',160,'one'),
      ('js:player.basicIdx=4;player.basicLast=gameTime;startAction(mkBasic(__e));','Nine Pages · จังหวะที่ 5 หน้ากระดาษหมุนรอบตัว',.9,'',90,'one'),
      ('bnGrace',"Cat's Grace + Shadow Cat · กระโดดแมว เงาแมวดำล่อแล้วระเบิด",2.1,'',70,'one',(-110,34)),
      ('bnVeil','Sand Veil · ผ้าคลุมทรายเป็นโล่',1.5,'',130,'one'),('bnAnkh','Ankh of Life · ชูอังค์ฟื้น HP / SP',1.2,'',130,'one'),
      ('bnObelisk','Temple Obelisk · เสาโอเบลิสก์ ยืนในวงได้ SP',1.8,'',130,'one')],
 'a':[('baGlyph','Curse Glyph (+Triple Glyph) · อักษรคำสาป คำสาป +1',1.3,'',160,'one'),
      ('baLocust','Plague of Locusts · ฝูงตั๊กแตนต้องสาป',2.4,'',160,'one'),
      ('baLink','Curse Link (+Shared Fate) · ด้ายคำสาปโยงศัตรู',1.6,'',0,'room'),
      ('baApep','Mark of Apep (+Apep Awakens) · งูอาเปปเลื้อย งูยักษ์งับปลายทาง',1.5,'',110,'one'),
      ('baWrap',"Mummy's Wrap · ผ้าพันมัมมี่รัดตรึง",1.9,'',160,'one'),
      ('baDoom','Word of Doom · คำสาปทุกชั้นระเบิดเป็นไฟม่วง',1.4,HEX4,110,'one'),
      ('baPharaoh','Curse of the Pharaoh · ULT A ดวงตาฟาโรห์ลืมบนฟ้า',2.4,'',0,'room',(0,120))],
 'b':[('bbSiphon','Soul Siphon (+Soul Tether) · ดูดวิญญาณ 4 ครั้ง',1.7,'',160,'one'),
      ('bbMummy','Raise Mummy (+Bandage Lash) · มัมมี่โผล่จากทราย',2.8,'',160,'one'),
      ('bbScarab','Scarab Swarm (+Golden Scarab) · ฝูงสคารับทอง',2.4,'',160,'one'),
      ('bbAnubis','Anubis Shade (+Jackal Pack, Weighing of the Heart) · เงาอนูบิส ตาชั่งมาอัต',3.2,'',0,'room'),
      ('bbGate','Duat Gate · ประตูดูอัต สลับที่กับผู้รับใช้',1.2,'',140,'one'),
      ('bbHarvest','Soul Harvest · ปล่อยวิญญาณทั้งหมดพุ่งใส่ศัตรู',1.5,'BA.souls=6;',0,'room'),
      ("js:castSkill('bbArmy',{target:__e,phi:0,gx:__e.x,gy:__e.y});setFxTimer(1.5,()=>{if(BA.armyEnd)BA.armyEnd=gameTime+1.4;});",'Army of the Duat (+Ammit) · ULT B ประตูสุสานเปิด กองทัพมัมมี่',3.6,'',150,'room')],
 'c':[('bcStorm','Locust Storm · พายุตั๊กแตนพุ่งไปข้างหน้า',1.3,'',120,'one'),
      ('bcLord','Mummy Lord · มัมมี่ฟาโรห์ ฟาดคทาเป็นวง',2.6,'',150,'one'),
      ('bcOsiris','Judgment of Osiris · ผู้รับใช้ทุกตัวระเบิดพร้อมกัน',1.5,'',150,'one'),
      ('bcBless',"Bastet's Blessing · พรบาสเทต จานสุริยะทอง",1.6,'',130,'one'),
      ('bcAvatar','Avatar of Bastet · ร่างเทพีแมวทอง',2.2,'',130,'one'),
      ('bcSekhmet',"Sekhmet's Plague Sun · ดวงอาทิตย์แดงตก ล้างคำสาป",2.0,HEX4,170,'one')]}[TREE]
OUT=os.environ.get('OUT','/tmp/fx');os.makedirs(OUT,exist_ok=True);FR=f'/tmp/frba_{TREE}';shutil.rmtree(FR,ignore_errors=True);os.makedirs(FR)
W,H=int(os.environ.get('CW','600')),int(os.environ.get('CH','350'))
CAST="""([k,near,pre])=>{try{if(player.action)endAction();}catch(x){}player.casting=null;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;player.cd={};
  const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)),e=es[0];window.__e=e;
  for(const q of enemies)if(q._dummy&&!q.H0){q.H0=[q.hx,q.hy];for(const k of ['hx','hy'])Object.defineProperty(q,k,{get(){return k==='hx'?this.x:this.y;},set(v){},configurable:true});}
  if(e&&near>0){e.x=e.H0[0];e.y=e.H0[1];e.z=0;player.x=e.x-near;player.y=e.y;}
  if(near===0){const D=enemies.filter(q=>q._dummy);for(const q of D){q.x=q.H0[0];q.y=q.H0[1];q.z=0;}player.x=D.reduce((s,q)=>s+q.x,0)/D.length-60;player.y=D.reduce((s,q)=>s+q.y,0)/D.length;}const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  window.__cx=near===0?player.x+60:(e?(player.x+e.x)/2:player.x+70);window.__cy=player.y;if(pre)(0,eval)(pre);
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
            if not k.startswith('js:') and k!='basic':await g.step(36)
            r=await g.ev(CAST,[k,near,pre])
            if r not in ('ok','true','undefined','[object Object]'):print(k,r)
            for i in range(int(secs*30)):
                await g.step(2)
                cx,cy=await g.ev("([w,h,dx,dz])=>{const q=P(window.__cx+dx,window.__cy,dz);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}",[W,H,ofs[0],ofs[1]])
                p=f'{FR}/{n:05d}.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':W,'height':H})
                im=Image.open(p).convert('RGB')
                if im.width>1280:im=im.resize((1280,round(im.height*1280/im.width)),Image.LANCZOS)
                if label:
                    d=ImageDraw.Draw(im);tw=d.textlength(label,font=fnt)
                    d.rounded_rectangle([10,10,24+tw,46],8,fill=(36,20,60));d.text((17,13),label,font=fnt,fill=(245,235,255))
                im.save(p)
                n+=1
        await g.close()
        if g.errs:print('ERRORS',g.errs[:4])
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/bastet_{TREE}.mp4'],check=True)
    print(f'{OUT}/bastet_{TREE}.mp4',n,'frames')
asyncio.run(main())
