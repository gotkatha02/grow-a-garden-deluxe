"""Still frames of one skill with each SUPPORT gem socketed for real (gem_sup_fx.js): rows = supports, columns = seconds after the first cast.
   HERO=wolf python3 tools/gems/supcmp.py TAG key [vars=echo,third,…] [times=.8,1.0,1.2] [casts=0] [w=520] [h=320] [scale=.6] [near=60]
     [dx=40] [dy=-20] [mode=room|one] [full=0] [js=<code before each cast>]
   Supports go in the teal hole of skill hole 1 (half strength) — full=1 = both teal holes (full strength). Output: $OUT (default /tmp/fx)/TAG_<key>.png"""
import asyncio,sys,os,re
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','fx'))
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TAG=sys.argv[1];K=sys.argv[2];A=dict(a.split('=',1) for a in sys.argv[3:] if '=' in a)
VARS=A.get('vars','echo,third,force,splash,chain,quick,thrift,burn,frost,pierce,leech,impact').split(',')
TIMES=[float(t) for t in A.get('times','.8,1.0,1.2').split(',')];CASTS=[float(t) for t in A.get('casts','0').split(',')]
CW=int(A.get('w',520));CH=int(A.get('h',320));SC=float(A.get('scale',.6));NEAR=float(A.get('near',60));DX=float(A.get('dx',40));DY=float(A.get('dy',-20))
MODE=A.get('mode','room');FULL=A.get('full','0')=='1';HERO=os.environ.get('HERO','wolf');ROOT=A.get('out',os.environ.get('OUT','/tmp/fx'));os.makedirs(ROOT,exist_ok=True)
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'supclip.py')).read()
SETUP=re.search(r'SETUP="""(.*?)"""',src,re.S).group(1);SOCK=re.search(r'SOCK="""(.*?)"""',src,re.S).group(1);CAST=re.search(r'CAST="""(.*?)"""',src,re.S).group(1);CLEAN=re.search(r'CLEAN="""(.*?)"""',src,re.S).group(1);NOC=re.search(r'NOC="""(.*?)"""',src,re.S).group(1)
FONT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf')
async def main():
    async with async_playwright() as pw:
        g=Game(hero=HERO);await g.start(pw)
        await g.ev(SETUP,MODE);await g.step(60)
        if A.get('allc','0')!='1':await g.ev(NOC)
        if A.get('js'):await g.ev("(j)=>{window.__PREJS=j;}",A['js'])
        fnt=ImageFont.truetype(FONT,15);rows=[]
        for v in VARS:
            await g.step(200);await g.ev(CLEAN)
            await g.ev("([near])=>{if(!window.__mcT||window.__mcT.dead){const L=enemies.filter(e=>!e.dead);let b=L[0],bn=-1;for(const e of L){const n=L.filter(o=>o!==e&&Math.hypot(o.x-e.x,o.y-e.y)<110).length;if(n>bn){bn=n;b=e;}}window.__mcT=b;}const e=window.__mcT;player.x=e.x-near;player.y=e.y;player.vx=player.vy=0;player.hp=player.maxHp*.55;}",[NEAR]);await g.step(70)
            await g.ev(SOCK,[K,v,FULL])
            ev=sorted([(t,'c') for t in CASTS]+[(t,'s') for t in TIMES]);t=0.0;fr=[]
            for T,kind in ev:
                n=max(0,round((T-t)*60));t+=n/60
                if n:await g.step(n)
                if kind=='c':
                    if A.get('js'):await g.ev("()=>{try{(0,eval)(window.__PREJS);}catch(e){}}")
                    r=await g.ev(CAST,[K])
                    if r!='ok':print(v,r)
                else:
                    cx,cy=await g.ev("([dx,dy,w,h])=>{const q=P(player.x+dx,player.y+dy,0);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}",[DX,DY,CW,CH])
                    p=f'{ROOT}/_sc.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':CW,'height':CH})
                    im=Image.open(p).convert('RGB').resize((int(CW*SC),int(CH*SC)));d=ImageDraw.Draw(im);d.rectangle([0,0,im.width,19],fill=(0,0,0));d.text((4,0),f'{v} · {T:.2f}s',fill=(255,255,255),font=fnt);fr.append(im)
            rows.append(fr)
        await g.ev("()=>{const d=totemGems.data();d.ss[0]=null;d.ssu[0]=[null,null];totemGems.apply();}")
        if g.errs:print('ERRORS',g.errs[:5])
        await g.close()
    W,H=rows[0][0].size;S=Image.new('RGB',(W*len(TIMES),H*len(rows)))
    for i,fr in enumerate(rows):
        for j,im in enumerate(fr):S.paste(im,(j*W,i*H))
    out=f'{ROOT}/{TAG}_{K}.png';S.save(out);print(out)
asyncio.run(main())
