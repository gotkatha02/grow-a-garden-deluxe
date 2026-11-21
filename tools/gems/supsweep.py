"""Support-gem looks on every skill of a hero (gem_sup_fx.js): each active skill is socketed for real in skill hole 1 with TWO support gems
in its teal holes (cycling through all 12), cast three times next to a test dummy (so 'every 3rd cast / hit' counters fire), run on.
Page errors and refused casts are listed; sheet=1 also saves one frame per skill.
   python3 -u tools/gems/supsweep.py hero [hero…] [t=.9] [near=70] [gap=1.0] [run=1.6] [mode=one|room] [sheet=0] [fps=20: game steps per second —
   fewer, longer steps keep a 14-hero sweep near 20 min]
Output: $OUT (default /tmp/fx)/ssweep_<hero>.png"""
import asyncio,sys,os
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','fx'))
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
A=dict(a.split('=',1) for a in sys.argv[1:] if '=' in a);HEROES=[a for a in sys.argv[1:] if '=' not in a]
FPS=int(A.get('fps',20));TT=float(A.get('t',.9));NEAR=float(A.get('near',70));GAP=float(A.get('gap',1.0));RUN=float(A.get('run',1.6));SHEET=A.get('sheet','0')=='1';MODE=A.get('mode','room')
SV=['echo','third','force','splash','chain','quick','thrift','burn','frost','pierce','leech','impact']
ROOT=A.get('out',os.environ.get('OUT','/tmp/fx'));os.makedirs(ROOT,exist_ok=True)
FONT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf')
SOCK="""([k,v1,v2])=>{const d=totemGems.data();d.ss[0]=k;d.sm[0]=null;d.ssu[0]=[v1,v2];totemGems.apply();totemGems.apply();for(let i=fx.length-1;i>=0;i--){const f=fx[i];if((f.__gt||f._sk)&&!f._core)fx.splice(i,1);}}"""
CAST="""([k,near,first])=>{try{if(player.action)endAction();}catch(x){}player.casting=null;player.combo=null;player.hp=player.maxHp*.6;player.mp=player.maxMp;player.ccT=0;player.cd={};
  const es=enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));const e=es[0];if(e&&first){player.x=e.x-near;player.y=e.y;}
  const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  let r;try{r=castSkill(k,{target:e||null,phi,gx:e?e.x:player.x+120,gy:e?e.y:player.y});}catch(x){return 'THROW '+String(x.stack||x).slice(0,200);}
  return r===false?'refused':'ok';}"""
async def one(pw,h):
    os.environ['HERO']=h;g=Game(hero=h,w=960,h=600);await g.start(pw)
    await g.ev("(m)=>{const b=document.querySelector('[data-tr='+m+']');if(b)b.click();}",MODE);await g.step(200)
    keys=await g.ev("()=>Object.entries(SKILLS).filter(([k,s])=>s.make&&!s.passive&&!s.parent).map(([k,s])=>[k,s.name||k])")
    try:fnt=ImageFont.truetype(FONT,13)
    except Exception:fnt=ImageFont.load_default()
    cells=[];errs0=len(g.errs);bad=[];peak=0
    for i,(k,nm) in enumerate(keys):
        v1=SV[i%12];v2=SV[(i+5)%12]
        await g.step(4,1/FPS);await g.ev(SOCK,[k,v1,v2])
        for c in range(3):
            r=await g.ev(CAST,[k,NEAR,c==0])
            if r!='ok':bad.append(f'{k}#{c}:{r}');break
            await g.step(max(1,round((TT if c==2 else GAP)*FPS)),1/FPS)
            peak=max(peak,await g.ev("()=>GEMFX.sup.state().LIVE"))
        if SHEET:
            cx,cy=await g.ev("()=>{const q=P(player.x+40,player.y,0);return [q[0]*Z+ox-170,q[1]*Z+oy-150];}")
            p=f'{ROOT}/_s.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':340,'height':220})
            im=Image.open(p).convert('RGB');d=ImageDraw.Draw(im);d.rectangle([0,0,340,17],fill=(0,0,0));d.text((4,0),f"{nm} · {v1}+{v2}",fill=(255,255,255),font=fnt);cells.append(im)
        await g.step(max(1,round(RUN*FPS)),1/FPS)
    st=await g.ev("()=>JSON.stringify(GEMFX.sup.state())")
    await g.ev("()=>{const d=totemGems.data();d.ss[0]=null;d.ssu[0]=[null,null];totemGems.apply();}")
    if cells:
        C=6;R=(len(cells)+C-1)//C;W,H=cells[0].size;S=Image.new('RGB',(C*W,R*H))
        for i,c in enumerate(cells):S.paste(c,((i%C)*W,(i//C)*H))
        S=S.resize((C*W*2//3,R*H*2//3));out=f'{ROOT}/ssweep_{h}.png';S.save(out)
    else:out='-'
    print(h,len(keys),'skills',out,'peak live',peak,'state at end',st,'refused/throw:',bad[:6],'errors:',g.errs[errs0:][:5])
    await g.close()
async def main():
    async with async_playwright() as pw:
        for h in HEROES:
            try:await one(pw,h)
            except Exception as e:print(h,'FAILED',str(e)[:300])
asyncio.run(main())
