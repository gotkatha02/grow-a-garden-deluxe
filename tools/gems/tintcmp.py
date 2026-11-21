"""Side-by-side frames of one skill drawn plain / fire / ice / volt (gem_fx.js element tint).
   HERO=wolf python3 tools/gems/tintcmp.py TAG key1,key2 [times=.15,.3,.45,.7] [w=520] [h=320] [scale=.55] [near=0] [dx=75] [dy=-20]
   [vars=-,fire,ice,volt] [gap=200 frames between casts] [real=1 (put the mutation on skill hole 1 for real)] [extra=&vfx3=0] [mode=one] [js=<code before each cast; dummy = __e>]
   Rows = variants, columns = seconds after the cast. Serve the repo on 8765 first (or let tools/fxlab.py do it).
   Output: $OUT (default /tmp/fx)/TAG_<key>.png"""
import asyncio,sys,os
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','fx'))
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
A=dict(a.split('=',1) for a in sys.argv[3:] if '=' in a)
TAG=sys.argv[1];KEYS=sys.argv[2].split(',')
TIMES=[float(t) for t in A.get('times','.15,.3,.45,.7').split(',')]
CW=int(A.get('w',520));CH=int(A.get('h',320));SC=float(A.get('scale',.55));NEAR=float(A.get('near',0))
DX=float(A.get('dx',75));DY=float(A.get('dy',-20));VARS=A.get('vars','-,fire,ice,volt').split(',');MODE=A.get('mode','one')
GAP=int(A.get('gap',200))
ROOT=A.get('out',os.environ.get('OUT','/tmp/fx'));os.makedirs(ROOT,exist_ok=True)
SETUP="""(mode)=>{window.__hits=[];if(!window.__hw){window.__hw=1;const _h=hurt;hurt=function(e,m,o){const d=_h(e,m,o);if(d>0&&!(o&&o.dot))window.__hits.push(gameTime);return d;};}
  const b=document.querySelector('[data-tr='+mode+']');if(b)b.click();return enemies.length;}"""
CAST="""([k,near,v])=>{try{if(player.action)endAction();}catch(x){}player.casting=null;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;player.cd={};
  if(window.__REAL){GEMFX.force(null);const d=totemGems.data();d.ss[0]=v==='-'?null:k;d.sm[0]=v==='-'?null:v;totemGems.apply();}
  else GEMFX.force(v==='-'?null:{[k==='basic'?'@auto':k]:v});
  const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));const e=es[0];if(near>0&&e){player.x=e.x-near;player.y=e.y;}
  const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  window.__e=e;if(window.__PREJS)(0,eval)(window.__PREJS);
  window.__t0=gameTime;window.__hits=[];let r;try{if(k==='basic'){const a=mkBasic(e);startAction(a);r=true;}else r=castSkill(k,{target:e||null,phi,gx:e?e.x:player.x+120,gy:e?e.y:player.y});}catch(x){return 'THROW '+String(x.stack||x).slice(0,300);}
  return r===false?'refused':'ok';}"""
CLEAN="""()=>{for(let i=fx.length-1;i>=0;i--){const f=fx[i];if(f.__gt||f._sk)fx.splice(i,1);}}"""
CLIP="""([dx,dy,w,h])=>{const q=P(player.x+dx,player.y+dy,0);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}"""
NAMES={'-':'ไม่ใส่','fire':'ไฟ','ice':'น้ำแข็ง','volt':'สายฟ้า'}
async def main():
    async with async_playwright() as pw:
        g=Game(extra=A.get('extra',''));await g.start(pw)
        await g.ev(SETUP,MODE);await g.step(20)
        if A.get('js'):await g.ev("(j)=>{window.__PREJS=j;}",A['js'])
        if A.get('real')=='1':await g.ev("()=>{window.__REAL=1;}")
        try:fnt=ImageFont.truetype(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf'),14)
        except Exception:fnt=ImageFont.load_default()
        for k in KEYS:
            rows=[]
            for v in VARS:
                await g.step(GAP);await g.ev(CLEAN)
                r=await g.ev(CAST,[k,NEAR,v])
                if r!='ok':print(k,v,r);continue
                fr=[];t=0.0
                for T in TIMES:
                    n=max(0,round((T-t)*60));t+=n/60
                    if n:await g.step(n)
                    cx,cy=await g.ev(CLIP,[DX,DY,CW,CH])
                    p=f'{ROOT}/_t.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':CW,'height':CH})
                    im=Image.open(p).convert('RGB').resize((int(CW*SC),int(CH*SC)))
                    d=ImageDraw.Draw(im);d.rectangle([0,0,im.width,18],fill=(0,0,0));d.text((4,0),f"{NAMES.get(v,v)} · {T:.2f}s",fill=(255,255,255),font=fnt)
                    fr.append(im)
                rows.append(fr)
            await g.ev("()=>GEMFX.force(null)")
            if not rows:continue
            W,H=rows[0][0].size;sheet=Image.new('RGB',(W*len(TIMES),H*len(rows)),(0,0,0))
            for i,fr in enumerate(rows):
                for j,im in enumerate(fr):sheet.paste(im,(j*W,i*H))
            out=f'{ROOT}/{TAG}_{k}.png';sheet.save(out);print(out)
        if g.errs:print('ERRORS',g.errs[:6])
        await g.close()
asyncio.run(main())
