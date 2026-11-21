"""Frame strips of axolotl skills.  python3 strip.py TAG key1,key2 [every=3] [n=24] [cols=8] [w=520] [h=300] [mode=one] [near=0 (put the hero this far left of the dummy first)] [extra=&vfx3=0] [dx=75] [dy=-20] [scale=.6] [pre=0] [free=1 (dummies are not pulled home)] [js=<code run before each cast, dummy = __e>]
Each key: hero reset, skill cast at the dummy, frames stepped at 60 fps, one capture every `every` frames.
Labels: time since the cast + HIT when damage landed since the last capture."""
import asyncio,sys,os,os,json
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
A=dict(a.split('=',1) for a in sys.argv[3:] if '=' in a)
TAG=sys.argv[1];KEYS=sys.argv[2].split(',')
EV=int(A.get('every',3));N=int(A.get('n',24));COLS=int(A.get('cols',8));CW=int(A.get('w',520));CH=int(A.get('h',300));MODE=A.get('mode','one')
NEAR=float(A.get('near',0));EXTRA=A.get('extra','');DX=float(A.get('dx',75));DY=float(A.get('dy',-20));SC=float(A.get('scale',.6));PRE=int(A.get('pre',0));SKIP=int(A.get('skip',0));ROOT=A.get('out',os.environ.get('OUT','/tmp/fx'))
os.makedirs(ROOT,exist_ok=True)
SETUP="""(mode)=>{window.__hits=[];if(!window.__hw){window.__hw=1;const _h=hurt;hurt=function(e,m,o){const d=_h(e,m,o);if(d>0&&!(o&&o.dot))window.__hits.push(gameTime);return d;};}
  const b=document.querySelector('[data-tr='+mode+']');if(b)b.click();return enemies.length;}"""
CAST="""([k,near])=>{try{if(player.action)endAction();}catch(x){}player.casting=null;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;player.cd={};
  const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));const e=window.__FAR?es[es.length-1]:es[0];if(near>0&&e){player.x=e.x-near;player.y=e.y;}
  const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  window.__e=e;if(window.__PREJS)(0,eval)(window.__PREJS);
  window.__t0=gameTime;window.__hits=[];let r;try{if(k==='basic'){const a=mkBasic(e);startAction(a);r=true;}else r=castSkill(k,{target:e||null,phi,gx:e?e.x:player.x+120,gy:e?e.y:player.y});}catch(x){return 'THROW '+String(x.stack||x).slice(0,300);}
  return r===false?'refused':'ok';}"""
CLIP="""([dx,dy,w,h])=>{const q=P(player.x+dx,player.y+dy,0);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}"""
async def main():
    async with async_playwright() as pw:
        g=Game(extra=EXTRA);await g.start(pw)
        g.pg.on("framenavigated",lambda f:print("NAV",f.url))
        await g.ev(SETUP,MODE);await g.step(20)
        if A.get('js'):await g.ev("(j)=>{window.__PREJS=j;}",A['js'])   # js=<code>: run before every cast (the dummy is __e)
        if A.get('free'):await g.ev("()=>{for(const e of enemies)for(const k of ['hx','hy'])Object.defineProperty(e,k,{get(){return k==='hx'?this.x:this.y;},set(v){},configurable:true});}")   # free=1: the test room stops pulling dummies home (throws / knock-backs stay visible)
        fnt=ImageFont.load_default()
        for k in KEYS:
            await g.step(120)  # let the previous effects end
            r=await g.ev(CAST,[k,NEAR])
            if r!='ok':print(k,r);continue
            frames=[];last=0
            if SKIP:await g.step(SKIP)
            for i in range(N):
                if i>0:await g.step(EV)
                cx,cy=await g.ev(CLIP,[DX,DY,CW,CH])
                p=f'{ROOT}/_f.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':CW,'height':CH})
                st=await g.ev("()=>[gameTime-__t0,__hits.length,player.action?player.action.key:(player.casting?'cast':'-')]")
                im=Image.open(p).convert('RGB').resize((int(CW*SC),int(CH*SC)))
                d=ImageDraw.Draw(im);hit=st[1]>last;last=st[1]
                d.rectangle([0,0,im.width,12],fill=(0,0,0));d.text((3,1),f"{st[0]:.2f}s {st[2]}"+("  HIT x%d"%st[1] if hit else ""),fill=(255,80,80) if hit else (255,255,255),font=fnt)
                frames.append(im)
            rows=(len(frames)+COLS-1)//COLS;W,H=frames[0].size
            sheet=Image.new('RGB',(COLS*W,rows*H),(0,0,0))
            for i,f in enumerate(frames):sheet.paste(f,((i%COLS)*W,(i//COLS)*H))
            out=f'{ROOT}/{TAG}_{k}.png';sheet.save(out);print(out,'hits',last)
        if g.errs:print('ERRORS',g.errs[:6])
        await g.close()
asyncio.run(main())
