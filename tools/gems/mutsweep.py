"""Mutation-gem looks on every skill of a hero (gem_mut_fx.js): each active skill is socketed for real in skill hole 1 with one of the
nine mutations in turn (focus, spread, heavy, rapid, stack, guard, rage, siphon, totem), cast next to a test dummy, run on; one frame per
skill goes on a contact sheet, page errors are listed.   python3 tools/gems/mutsweep.py hero [hero…] [t=.9] [near=70] [run=2.4] [sheet=0]
Output: $OUT (default /tmp/fx)/msweep_<hero>.png"""
import asyncio,sys,os
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','fx'))
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
A=dict(a.split('=',1) for a in sys.argv[1:] if '=' in a);HEROES=[a for a in sys.argv[1:] if '=' not in a]
TT=float(A.get('t',.9));NEAR=float(A.get('near',70));RUN=float(A.get('run',2.4));SHEET=A.get('sheet','0')=='1'
MV=['focus','spread','heavy','rapid','stack','guard','rage','siphon','totem']
ROOT=A.get('out',os.environ.get('OUT','/tmp/fx'));os.makedirs(ROOT,exist_ok=True)
FONT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf')
CAST="""([k,v,near])=>{try{if(player.action)endAction();}catch(x){}player.casting=null;player.combo=null;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;player.cd={};
  for(let i=fx.length-1;i>=0;i--){const f=fx[i];if(f.__gt||f._sk)fx.splice(i,1);}
  {const d=totemGems.data();d.ss[0]=k;d.sm[0]=v;if(d.ssu)d.ssu[0]=[null,null];totemGems.apply();}
  const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));const e=es[0];if(e){player.x=e.x-near;player.y=e.y;}
  const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  let r;try{r=castSkill(k,{target:e||null,phi,gx:e?e.x:player.x+120,gy:e?e.y:player.y});}catch(x){return 'THROW '+String(x.stack||x).slice(0,200);}
  return r===false?'refused':'ok';}"""
async def one(pw,h):
    os.environ['HERO']=h;g=Game(hero=h,w=960,h=600);await g.start(pw)
    await g.ev("()=>{const b=document.querySelector('[data-tr=one]');if(b)b.click();}");await g.step(200)
    keys=await g.ev("()=>Object.entries(SKILLS).filter(([k,s])=>s.make&&!s.passive&&!s.parent).map(([k,s])=>[k,s.name||k])")
    try:fnt=ImageFont.truetype(FONT,13)
    except Exception:fnt=ImageFont.load_default()
    cells=[];errs0=len(g.errs);bad=[]
    for i,(k,nm) in enumerate(keys):
        v=MV[i%len(MV)]
        await g.step(12)
        r=await g.ev(CAST,[k,v,NEAR])
        if r!='ok':bad.append(f'{k}:{r}');continue
        await g.step(max(1,round(TT*60)))
        if SHEET:
            cx,cy=await g.ev("()=>{const q=P(player.x+40,player.y,0);return [q[0]*Z+ox-170,q[1]*Z+oy-150];}")
            p=f'{ROOT}/_s.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':340,'height':220})
            im=Image.open(p).convert('RGB');d=ImageDraw.Draw(im);d.rectangle([0,0,340,17],fill=(0,0,0));d.text((4,0),f"{nm} · {v}",fill=(255,255,255),font=fnt);cells.append(im)
        await g.step(max(1,round((RUN-TT)*60)))
    st=await g.ev("()=>JSON.stringify(GEMFX.mut.state().LIVE)")
    await g.ev("()=>{const d=totemGems.data();d.ss[0]=null;d.sm[0]=null;totemGems.apply();}")
    if cells:
        C=6;R=(len(cells)+C-1)//C;W,H=cells[0].size;S=Image.new('RGB',(C*W,R*H))
        for i,c in enumerate(cells):S.paste(c,((i%C)*W,(i//C)*H))
        S=S.resize((C*W*2//3,R*H*2//3));out=f'{ROOT}/msweep_{h}.png';S.save(out)
    else:out='-'
    print(h,len(keys),'skills',out,'live pieces at end',st,'refused/throw:',bad[:6],'errors:',g.errs[errs0:][:5])
    await g.close()
async def main():
    async with async_playwright() as pw:
        for h in HEROES:
            try:await one(pw,h)
            except Exception as e:print(h,'FAILED',str(e)[:300])
asyncio.run(main())
