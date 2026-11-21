"""Grid video of one skill with each MUTATION gem socketed for real (gem_mut_fx.js), Thai labels.
   HERO=wolf python3 tools/gems/mutclip.py key [vars=focus,spread,heavy,rapid,stack,guard,rage,siphon,totem] [cols=3] [dur=3.0]
     [near=60] [mode=room|one] [dx=20] [dy=-30] [w=300] [h=230] [fps=30] [tag=]
   Scripted moments so the lasting looks show their whole life: guard = hits drain the bubble and break it, rage = the hero is hurt
   while raging (cracks). Output: $OUT (default /tmp/fx)/mut_<hero>_<key><tag>.mp4"""
import asyncio,sys,os,re,subprocess,shutil
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','fx'))
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
K=sys.argv[1];A=dict(a.split('=',1) for a in sys.argv[2:] if '=' in a)
VARS=A.get('vars','focus,spread,heavy,rapid,stack,guard,rage,siphon,totem').split(',');COLS=int(A.get('cols',3))
DUR=float(A.get('dur',3.0));NEAR=float(A.get('near',60));DX=float(A.get('dx',34));DY=float(A.get('dy',-30));CW=int(A.get('w',300));CH=int(A.get('h',230));FPS=int(A.get('fps',30))
MODE=A.get('mode','room');ROOT=A.get('out',os.environ.get('OUT','/tmp/fx'));HERO=os.environ.get('HERO','wolf');TAG=A.get('tag','')
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mutcmp.py')).read()
CAST=re.search(r'CAST="""(.*?)"""',src,re.S).group(1).replace('const e=es[0];','const e=window.__mcT||es[0];');   # always the same target, straight to the right of the hero
SETUP=re.search(r'SETUP="""(.*?)"""',src,re.S).group(1);CLEAN=re.search(r'CLEAN="""(.*?)"""',src,re.S).group(1)
FONT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf')
NAMES={'-':'ไม่ใส่เจม','focus':'◎ รวมศูนย์','spread':'✺ แผ่กว้าง','heavy':'⬇ ทุ่มหนัก','rapid':'≫ รัวเร็ว','stack':'⧉ สะสมแต้ม','guard':'⛨ ตั้งการ์ด','rage':'✶ บ้าคลั่ง','siphon':'◆ ดูดพลัง','totem':'♆ เสาร่ายแทน'}
LAB={'-':'ไม่ใส่เจม','focus':'รวมศูนย์','spread':'แผ่กว้าง','heavy':'ทุ่มหนัก','rapid':'รัวเร็ว','stack':'สะสมแต้ม','guard':'ตั้งการ์ด','rage':'บ้าคลั่ง','siphon':'ดูดพลัง','totem':'เสาร่ายแทน'}
EVENTS={'guard':[(1.0,'ENH_ABSORB(totemGems.fxs().GU.sh*.4)'),(1.7,'ENH_ABSORB(totemGems.fxs().GU.sh*.5)'),(2.3,'ENH_ABSORB(99999)')],
        'rage':[(1.2,'player.hp-=60'),(1.9,'player.hp-=60')]}
async def main():
    tmp=f'{ROOT}/_mclip_{HERO}_{K}';shutil.rmtree(tmp,ignore_errors=True);os.makedirs(tmp)
    fnt=ImageFont.truetype(FONT,19);fnt2=ImageFont.truetype(FONT,21)
    async with async_playwright() as pw:
        g=Game(hero=HERO);await g.start(pw)
        await g.ev(SETUP,MODE);await g.step(60)
        name=await g.ev("(k)=>SKILLS[k]&&SKILLS[k].name||k",K)
        frames=[]
        for v in VARS:
            await g.step(200);await g.ev(CLEAN)
            # one fixed target for every row: the dummy with the most neighbours; stand `near` left of it and let the camera settle
            await g.ev("([near])=>{if(!window.__mcT||window.__mcT.dead){const L=enemies.filter(e=>!e.dead);let b=L[0],bn=-1;for(const e of L){const n=L.filter(o=>o!==e&&Math.hypot(o.x-e.x,o.y-e.y)<110).length;if(n>bn){bn=n;b=e;}}window.__mcT=b;}const e=window.__mcT;player.x=e.x-near;player.y=e.y;player.vx=player.vy=0;}",[NEAR]);await g.step(70)
            r=await g.ev(CAST,[K,NEAR,v])
            if r!='ok':print(v,r)
            seq=[];n=int(DUR*FPS);st=60//FPS;ev=list(EVENTS.get(v,[]))
            cx,cy=await g.ev("([dx,dy,w,h])=>{const q=P(player.x+dx,player.y+dy,0);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}",[DX,DY,CW,CH])
            for i in range(n):
                tnow=i/FPS
                while ev and ev[0][0]<=tnow:
                    await g.ev('()=>{try{'+ev.pop(0)[1]+'}catch(e){}}')
                p=f'{tmp}/{v}_{i:03d}.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':CW,'height':CH});seq.append(p)
                await g.step(st)
            frames.append((v,seq))
        await g.ev("()=>{const d=totemGems.data();d.ss[0]=null;d.sm[0]=null;totemGems.apply();}")
        if g.errs:print('ERRORS',g.errs[:4])
        await g.close()
    n=min(len(s) for _,s in frames);rows=(len(frames)+COLS-1)//COLS
    for i in range(n):
        S=Image.new('RGB',(CW*COLS,CH*rows+36),(18,14,30));d=ImageDraw.Draw(S)
        d.text((10,5),f'{name} — เจมแปรสภาพแต่ละแบบบนท่าจริง',fill=(255,233,168),font=fnt2)
        for j,(v,seq) in enumerate(frames):
            im=Image.open(seq[i]).convert('RGB');x,y=(j%COLS)*CW,36+(j//COLS)*CH;S.paste(im,(x,y))
            lab=LAB.get(v,v);w=int(d.textlength(lab,font=fnt))+16;d.rectangle([x,y,x+w,y+27],fill=(0,0,0));d.text((x+8,y+2),lab,fill=(255,255,255),font=fnt)
        S.save(f'{tmp}/g_{i:03d}.png')
    out=f'{ROOT}/mut_{HERO}_{K}{TAG}.mp4'
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate',str(FPS),'-i',f'{tmp}/g_%03d.png','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2',out],check=True)
    Image.open(f'{tmp}/g_{int(n*.3):03d}.png').save(f'{ROOT}/mut_{HERO}_{K}{TAG}_t.png')
    print(out)
asyncio.run(main())
