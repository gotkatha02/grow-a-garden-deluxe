"""Frames after running custom JS.  python3 custom.py TAG "<js run at t0>" [every=3] [n=16] [cols=4] [scale=1] [w=420] [h=260] [dx=30] [dy=-34] [skip=0] [pre=<js before, then 60 frames>]"""
import asyncio,sys,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
TAG=sys.argv[1];JS=sys.argv[2];A=dict(a.split('=',1) for a in sys.argv[3:] if '=' in a)
EV=int(A.get('every',3));N=int(A.get('n',16));COLS=int(A.get('cols',4));SC=float(A.get('scale',1));CW=int(A.get('w',420));CH=int(A.get('h',260));DX=float(A.get('dx',30));DY=float(A.get('dy',-34));SKIP=int(A.get('skip',0));PRE=A.get('pre','')
async def main():
    async with async_playwright() as pw:
        g=Game();await g.start(pw);await g.step(30)
        if PRE:
            await g.ev("()=>{"+PRE+"}");await g.step(60)
        await g.ev("()=>{window.__t0=gameTime;"+JS+"}")
        if SKIP:await g.step(SKIP)
        frames=[];fnt=ImageFont.load_default()
        for i in range(N):
            if i>0:await g.step(EV)
            cx,cy=await g.ev("([dx,dy,w,h])=>{const q=P(player.x+dx,player.y+dy,0);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}",[DX,DY,CW,CH])
            await g.shot('/tmp/_c.png',clip={'x':max(0,cx),'y':max(0,cy),'width':CW,'height':CH})
            t=await g.ev("()=>(gameTime-__t0).toFixed(2)+'s '+(player.action?player.action.key:'-')")
            im=Image.open('/tmp/_c.png').convert('RGB').resize((int(CW*SC),int(CH*SC)));d=ImageDraw.Draw(im);d.rectangle([0,0,im.width,12],fill=(0,0,0));d.text((3,1),t,fill=(255,255,255),font=fnt);frames.append(im)
        W,H=frames[0].size;rows=(len(frames)+COLS-1)//COLS;sh=Image.new('RGB',(COLS*W,rows*H))
        for i,f in enumerate(frames):sh.paste(f,((i%COLS)*W,(i//COLS)*H))
        out=os.path.join(os.environ.get('OUT','/tmp/fx'),TAG+'.png');sh.save(out);print(out)
        if g.errs:print('ERRORS',g.errs[:5])
        await g.close()
asyncio.run(main())
