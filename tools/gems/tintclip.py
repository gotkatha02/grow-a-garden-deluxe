"""2x2 comparison video of one skill: no gem / fire / ice / volt (gem_fx.js), the mutation put on skill hole 1 for real
so burning, frost, freeze and sparks happen.   HERO=wolf python3 tools/gems/tintclip.py key [dur=2.6] [near=60] [dx=40] [dy=-15] [w=420] [h=300] [fps=30] [force=1 (tint only)]
Output: $OUT (default /tmp/fx)/clip_<hero>_<key>.mp4"""
import asyncio,sys,os,re,subprocess,shutil
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','fx'))
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
K=sys.argv[1];A=dict(a.split('=',1) for a in sys.argv[2:] if '=' in a)
DUR=float(A.get('dur',2.6));NEAR=float(A.get('near',60));DX=float(A.get('dx',40));DY=float(A.get('dy',-15));CW=int(A.get('w',420));CH=int(A.get('h',300));FPS=int(A.get('fps',30))
ROOT=A.get('out',os.environ.get('OUT','/tmp/fx'));HERO=os.environ.get('HERO','wolf');FORCE=A.get('force')
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'tintcmp.py')).read()
CAST=re.search(r'CAST="""(.*?)"""',src,re.S).group(1);SETUP=re.search(r'SETUP="""(.*?)"""',src,re.S).group(1);CLEAN=re.search(r'CLEAN="""(.*?)"""',src,re.S).group(1)
FONT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf')
NAMES=[('-','ไม่ใส่เจม'),('fire','เจมธาตุไฟ'),('ice','เจมธาตุน้ำแข็ง'),('volt','เจมธาตุสายฟ้า')]
async def main():
    tmp=f'{ROOT}/_clip_{HERO}_{K}';shutil.rmtree(tmp,ignore_errors=True);os.makedirs(tmp)
    fnt=ImageFont.truetype(FONT,20)
    async with async_playwright() as pw:
        g=Game(hero=HERO);await g.start(pw)
        await g.ev(SETUP,'one');await g.step(60)
        if not FORCE:await g.ev("()=>{window.__REAL=1;}")
        name=await g.ev("(k)=>SKILLS[k]&&SKILLS[k].name||k",K)
        frames=[]
        for v,lab in NAMES:
            await g.step(300);await g.ev(CLEAN)
            r=await g.ev(CAST,[K,NEAR,v])
            if r!='ok':print(v,r)
            seq=[];n=int(DUR*FPS);st=60//FPS
            cx,cy=await g.ev("([dx,dy,w,h])=>{const q=P(player.x+dx,player.y+dy,0);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}",[DX,DY,CW,CH])
            for i in range(n):
                p=f'{tmp}/{v}_{i:03d}.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':CW,'height':CH});seq.append(p)
                await g.step(st)
            frames.append((lab,seq))
        await g.ev("()=>{const d=totemGems.data();d.ss[0]=null;d.sm[0]=null;totemGems.apply();GEMFX.force(null);}")
        if g.errs:print('ERRORS',g.errs[:4])
        await g.close()
    n=min(len(s) for _,s in frames)
    for i in range(n):
        S=Image.new('RGB',(CW*2,CH*2+34),(18,14,30));d=ImageDraw.Draw(S)
        d.text((10,4),f'{name} — ภาพสกิลตามเจม',fill=(255,233,168),font=fnt)
        for j,(lab,seq) in enumerate(frames):
            im=Image.open(seq[i]).convert('RGB');x,y=(j%2)*CW,34+(j//2)*CH;S.paste(im,(x,y))
            d.rectangle([x,y,x+len(lab)*13+16,y+28],fill=(0,0,0));d.text((x+8,y+2),lab,fill=(255,255,255),font=fnt)
        S.save(f'{tmp}/g_{i:03d}.png')
    out=f'{ROOT}/clip_{HERO}_{K}.mp4'
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate',str(FPS),'-i',f'{tmp}/g_%03d.png','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2',out],check=True)
    print(out)
asyncio.run(main())
