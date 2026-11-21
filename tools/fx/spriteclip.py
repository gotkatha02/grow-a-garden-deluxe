"""Hero sprite showcase (2026-11-21, made for the axolotl's own sprite): turn round through the 8 directions, walk a circle,
basic attacks toward 4 directions, then a few casts.  HERO=axolotl DSF=2 python3 tools/fx/spriteclip.py [extra-query]
→ $OUT/<hero>_sprite.mp4 (30 fps, Thai labels).  Casts: CASTS="key|label,key|label" (default: the axolotl's)."""
import asyncio,sys,os,subprocess,shutil,math
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('HERO','axolotl')
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
HERO=os.environ['HERO'];EXTRA=sys.argv[1] if len(sys.argv)>1 else ''
OUT=os.environ.get('OUT','/tmp/fx');os.makedirs(OUT,exist_ok=True);FR=f'/tmp/frsp_{HERO}';shutil.rmtree(FR,ignore_errors=True);os.makedirs(FR)
W,H=int(os.environ.get('CW','560')),int(os.environ.get('CH','380'))
DIRS=[('S',90),('SE',45),('E',0),('NE',-45),('N',-90),('NW',-135),('W',180),('SW',135)]
TH={'S':'ใต้','SE':'ตะวันออกเฉียงใต้','E':'ตะวันออก','NE':'ตะวันออกเฉียงเหนือ','N':'เหนือ','NW':'ตะวันตกเฉียงเหนือ','W':'ตะวันตก','SW':'ตะวันตกเฉียงใต้'}
CASTS=[c.split('|') for c in os.environ.get('CASTS','axNeedle|Needle Jet · ร่ายลำน้ำ,axCompress|Compression Shot · ลูกน้ำอัด,asDrop|Healing Drop · หยดน้ำรักษา,axCannon|Hydro Cannon · ปืนใหญ่น้ำ').split(',')]
SEQ=[]
for d,a in DIRS:SEQ.append((f"js:__face({a})",f'ยืน · หัน{TH[d]} ({d})',.75,0))
SEQ.append(("js:__walk()",'เดิน · วนรอบ',4.2,0))
for d,a in [('E',0),('S',90),('W',180),('NE',-45)]:
    SEQ.append((f"js:__hit({a})",f'ตีปกติ · หัน{TH[d]} ({d})',.8,0));SEQ.append((f"js:__hit({a})",'',.8,0))
for k,lab in CASTS:SEQ.append((k,lab,1.5,1))
CAST="""([k,cast])=>{try{if(player.action)endAction();}catch(x){}player.casting=null;player.moveT=null;player.moveQ=null;player.hp=player.maxHp;player.mp=player.maxMp;player.cd={};
  const e=enemies.find(q=>!q.dead&&q._dummy)||enemies.find(q=>!q.dead);window.__e=e;
  if(e&&!e.H0){e.H0=[e.hx,e.hy];for(const k of ['hx','hy'])Object.defineProperty(e,k,{get(){return k==='hx'?this.x:this.y;},set(v){},configurable:true});}
  if(window.__X0==null){window.__X0=e.H0[0]-110;window.__Y0=e.H0[1];}
  window.__face=a=>{player.x=__X0;player.y=__Y0;e.x=__X0+999;e.y=__Y0;faceTo(a*Math.PI/180);};
  window.__walk=()=>{player.x=__X0;player.y=__Y0;e.x=__X0+999;const q=[];for(let i=1;i<=16;i++){const t=i/16*Math.PI*2;q.push({x:__X0+Math.cos(t-Math.PI/2)*80,y:__Y0+80+Math.sin(t-Math.PI/2)*80});}player.moveT=q.shift();player.moveQ=q;};
  window.__hit=a=>{player.x=__X0;player.y=__Y0;const r=a*Math.PI/180;e.x=__X0+Math.cos(r)*70;e.y=__Y0+Math.sin(r)*70;faceTo(r);startAction(mkBasic(e));};
  window.__cx=__X0;window.__cy=__Y0;
  if(k.startsWith('js:')){(0,eval)(k.slice(3));return 'ok';}
  player.x=__X0;player.y=__Y0;e.x=__X0+130;e.y=__Y0;const phi=0;faceTo(phi);mouse.wx=e.x;mouse.wy=e.y;window.__cx=__X0+40;
  return String(castSkill(k,{target:e,phi,gx:e.x,gy:e.y}));}"""
async def main():
    async with async_playwright() as pw:
        g=Game(w=1280,h=720,extra=EXTRA);await g.start(pw);await g.step(60)
        fnt=ImageFont.truetype(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf'),22)
        n=0
        for (k,label,secs,cast) in SEQ:
            if cast:await g.step(36)
            r=await g.ev(CAST,[k,cast])
            if r not in ('ok','true','undefined','[object Object]'):print(k,r)
            for i in range(int(secs*30)):
                await g.step(2)
                cx,cy=await g.ev("([w,h])=>{const q=P(window.__cx,window.__cy-36,0);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}",[W,H])
                p=f'{FR}/{n:05d}.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':W,'height':H})
                im=Image.open(p).convert('RGB')
                if im.width>1280:im=im.resize((1280,round(im.height*1280/im.width)),Image.LANCZOS)
                if label:
                    d=ImageDraw.Draw(im);tw=d.textlength(label,font=fnt)
                    d.rounded_rectangle([10,10,24+tw,46],8,fill=(20,24,60));d.text((17,13),label,font=fnt,fill=(235,240,255))
                im.save(p);n+=1
        await g.close()
        if g.errs:print('ERRORS',g.errs[:4])
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{FR}/%05d.png','-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',f'{OUT}/{HERO}_sprite.mp4'],check=True)
    print(f'{OUT}/{HERO}_sprite.mp4',n,'frames')
asyncio.run(main())
