"""Skill buttons with gems (gem_btn.js): the PC hotbar (or the phone wheel with TOUCH=1) before and after casts.
   HERO=wolf python3 tools/gems/btnshot.py TAG [w=1280] [h=720] [scale=2] [set=A|B]
   set A: hole 1 fire + third/leech · hole 2 ice + quick/thrift · hole 3 volt + chain/echo · hole 4 stack + force/pierce · hole 5 totem + burn/frost
   set B: hole 1 rage + third · hole 2 guard + leech · hole 3 heavy · hole 4 stack · hole 5 focus
   Shots: 'still' (just socketed) · 'live' (skill 1 cast twice → ×1.5 next, skill 4 cast once → a charge refilling, skill 5 cast → pillar,
   set B: skill 1 → rage window, skill 2 → gem shield). Phone: TOUCH=1 w=844 h=390. Output: $OUT (default /tmp/fx)/TAG_btn.png"""
import asyncio,sys,os
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','fx'))
os.environ['KEEPHUD']='1'
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TAG=sys.argv[1];A=dict(a.split('=',1) for a in sys.argv[2:] if '=' in a)
W=int(A.get('w',1280));H=int(A.get('h',720));SC=float(A.get('scale',2));SET=A.get('set','A');PHONE=os.environ.get('TOUCH')=='1'
ROOT=A.get('out',os.environ.get('OUT','/tmp/fx'));os.makedirs(ROOT,exist_ok=True)
FONT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf')
SETS={'A':[('fire','third','leech'),('ice','quick','thrift'),('volt','chain','echo'),('stack','force','pierce'),('totem','burn','frost')],
      'B':[('rage','third',None),('guard','leech',None),('heavy',None,None),('stack',None,None),('focus',None,None)]}
SOCK="""([lay])=>{const sel=document.body.classList.contains('mob')?'.mobSk[data-k]':'.hbt[data-k]';
  const ks=[...document.querySelectorAll(sel)].map(e=>e.dataset.k).filter((k,i,a)=>a.indexOf(k)===i&&SKILLS[k]&&!SKILLS[k].passive&&SKILLS[k].cd>0&&SKILLS[k].br!=='C'&&!SKILLS[k].parent).slice(0,5);
  const d=totemGems.data();window.__wk=window.__wk||{};
  ks.forEach((k,i)=>{const L=lay[i];d.ss[i]=k;d.sm[i]=L[0];d.ssu[i]=[L[1],L[2]];});totemGems.apply();totemGems.apply();window.__bk=ks;return ks;}"""
CAST="""([i])=>{const k=window.__bk[i];try{if(player.action)endAction();}catch(x){}player.casting=null;player.mp=player.maxMp;player.cd[k]=0;
  const e=enemies.filter(e=>!e.dead)[0];if(e){player.x=e.x-60;player.y=e.y;faceTo(0);}
  const st=totemGems.fxs().STK[k];if(st&&st.ch<=0)st.ch=1;
  return castSkill(k,{target:e||null,phi:0,gx:e?e.x:player.x+120,gy:e?e.y:player.y});}"""
BOX="""()=>{const el=document.body.classList.contains('mob')?document.getElementById('mobSkW'):document.getElementById('hotbar');
  if(!el)return null;let r=el.getBoundingClientRect();if(document.body.classList.contains('mob')){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const b of el.querySelectorAll('.mobSk')){const q=b.getBoundingClientRect();if(!q.width)continue;x0=Math.min(x0,q.left);y0=Math.min(y0,q.top);x1=Math.max(x1,q.right);y1=Math.max(y1,q.bottom);}r={left:x0,top:y0,width:x1-x0,height:y1-y0};}
  return [Math.max(0,r.left-26),Math.max(0,r.top-30),Math.min(innerWidth,r.width+52),Math.min(innerHeight,r.height+54)];}"""
async def main():
    async with async_playwright() as pw:
        g=Game(hero=os.environ.get('HERO','wolf'),w=W,h=H);await g.start(pw)
        await g.ev("()=>{const b=document.querySelector('[data-tr=one]');if(b)b.click();}");await g.step(60)
        if PHONE:await g.ev("()=>{document.body.classList.add('mob');dispatchEvent(new Event('resize'));}");await g.step(10)
        ks=await g.ev(SOCK,[SETS[SET]]);print('skills',ks)
        await g.step(6);await g.pg.wait_for_timeout(150);await g.step(4)
        shots=[]
        async def snap(lab):
            b=await g.ev(BOX)
            if not b:print('no box');return
            p=f'{ROOT}/_b.png';await g.shot(p,clip={'x':b[0],'y':b[1],'width':b[2],'height':b[3]})
            im=Image.open(p).convert('RGB');im=im.resize((int(im.width*SC),int(im.height*SC)),Image.LANCZOS);shots.append((lab,im))
        await snap('ใส่เจมแล้ว (ยังไม่ใช้)')
        if SET=='A':
            await g.ev(CAST,[0]);await g.step(70);await g.ev(CAST,[0]);await g.step(70)
            await g.ev(CAST,[3]);await g.step(40);await g.ev(CAST,[4]);await g.step(20)
        else:
            await g.ev(CAST,[0]);await g.step(30);await g.ev(CAST,[1]);await g.step(30);await g.ev(CAST,[3]);await g.step(30)
        await g.pg.wait_for_timeout(150);await g.step(4)
        await snap('หลังใช้สกิล')
        if g.errs:print('ERRORS',g.errs[:5])
        await g.close()
    fnt=ImageFont.truetype(FONT,22);Wd=max(im.width for _,im in shots);Ht=sum(im.height+34 for _,im in shots)
    S=Image.new('RGB',(Wd,Ht),(24,18,30));d=ImageDraw.Draw(S);y=0
    for lab,im in shots:d.text((10,y+4),lab,fill=(255,233,168),font=fnt);S.paste(im,(0,y+34));y+=im.height+34
    out=f'{ROOT}/{TAG}_btn.png';S.save(out);print(out)
asyncio.run(main())
