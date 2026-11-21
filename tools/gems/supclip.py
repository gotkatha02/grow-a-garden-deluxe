"""Grid video of one skill with each SUPPORT gem socketed for real (gem_sup_fx.js), Thai labels.
   HERO=wolf python3 tools/gems/supclip.py key [vars=echo,third,force,splash,chain,quick,thrift,burn,frost,pierce,leech,impact] [cols=4]
     [casts=0,1.2,2.4] [dur=3.6] [near=60] [mode=room|one] [dx=34] [dy=-30] [w=300] [h=230] [fps=30] [full=0] [tag=] [allc=0]
     [nogrid=1 = only record the frames (run two halves in parallel with tag=_a / tag=_b)]   [grid=_a,_b = build one grid video from those halves]
   The support goes into the teal hole of skill hole 1 (half strength, like the real game); full=1 puts it in both teal holes (= a C-gem
   support's full strength, only for checking sizes). The skill is cast at every time in `casts` (cooldown and SP refilled), so cast
   counters (every 3rd cast, every 3rd / 5th / 6th hit) show. Class C skills are switched off (allc=1 keeps the test room's 'all C on':
   the wolf's own Savage Echo also prints 'ECHO'). Output: $OUT (default /tmp/fx)/sup_<hero>_<key><tag>.mp4 + _t.png"""
import asyncio,sys,os,subprocess,shutil
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','fx'))
from harness import Game
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
K=sys.argv[1];A=dict(a.split('=',1) for a in sys.argv[2:] if '=' in a)
VARS=A.get('vars','echo,third,force,splash,chain,quick,thrift,burn,frost,pierce,leech,impact').split(',');COLS=int(A.get('cols',4))
CASTS=[float(x) for x in A.get('casts','0,1.2,2.4').split(',')];DUR=float(A.get('dur',3.6));NEAR=float(A.get('near',60))
DX=float(A.get('dx',34));DY=float(A.get('dy',-30));CW=int(A.get('w',300));CH=int(A.get('h',230));FPS=int(A.get('fps',30))
MODE=A.get('mode','room');FULL=A.get('full','0')=='1';ROOT=A.get('out',os.environ.get('OUT','/tmp/fx'));HERO=os.environ.get('HERO','wolf');TAG=A.get('tag','')
ALLC=A.get('allc','0')=='1';NOGRID=A.get('nogrid','0')=='1';GRID=[x for x in A.get('grid','').split(',') if x]
FONT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets','fonts','Mitr-Medium.ttf')
LAB={'-':'ไม่ใส่เจม','echo':'เงาสกิล','third':'ทุกครั้งที่สาม','force':'เพิ่มแรง','splash':'กระจาย','chain':'ชิ่ง','quick':'เร่ง','thrift':'ประหยัด',
     'burn':'เผาไหม้','frost':'เยือกแข็ง','pierce':'ทะลวง','leech':'ดูดชีวิต','impact':'กระแทก'}
SETUP="""(mode)=>{const b=document.querySelector('[data-tr='+mode+']');if(b)b.click();return enemies.length;}"""
NOC="""()=>{window.__GEMS_ALL=0;totemGems.apply();totemGems.apply();}"""
SOCK="""([k,v,full])=>{const d=totemGems.data();d.ss[0]=v==='-'?null:k;d.sm[0]=null;d.ssu[0]=v==='-'?[null,null]:[v,full?v:null];totemGems.apply();totemGems.apply();
  const S=totemGems.fxs();S.GU.sh=0;S.GU.shT=0;S.GU.guardT=0;S.GU.rageT=0;S.PIL.length=0;const A=totemGems.act()[k];if(A){A.n=0;A.casts=0;}return !!A;}"""
CAST="""([k])=>{try{if(player.action)endAction();}catch(x){}player.casting=null;player.hp=Math.min(player.hp,player.maxHp);player.mp=player.maxMp;player.ccT=0;player.cd={};
  const e=window.__mcT;const phi=e?Math.atan2(e.y-player.y,e.x-player.x):0;faceTo(phi);mouse.wx=e?e.x:player.x+150;mouse.wy=e?e.y:player.y;
  let r;try{if(k==='basic'){startAction(mkBasic(e));r=true;}else r=castSkill(k,{target:e||null,phi,gx:e?e.x:player.x+120,gy:e?e.y:player.y});}catch(x){return 'THROW '+String(x.stack||x).slice(0,300);}
  return r===false?'refused':'ok';}"""
CLEAN="""()=>{for(let i=fx.length-1;i>=0;i--){const f=fx[i];if((f.__gt||f._sk)&&!f._core)fx.splice(i,1);}for(const e of enemies){e._gFlat=null;e._gBurn=null;e._gfI=0;e._gfF=0;if(e.st){e.st.slow=0;e.st.frozen=0;e.st.stun=0;}}}"""
async def main():
    fnt=ImageFont.truetype(FONT,19);fnt2=ImageFont.truetype(FONT,21)
    if GRID:   # build one grid from halves recorded with nogrid=1
        frames=[];name=K
        for tg in GRID:
            d=f'{ROOT}/_sclip_{HERO}_{K}{tg}'
            if os.path.exists(f'{d}/name.txt'):name=open(f'{d}/name.txt').read()
            for v in open(f'{d}/vars.txt').read().split(','):
                frames.append((v,sorted(f'{d}/{f}' for f in os.listdir(d) if f.startswith(v+'_'))))
        return grid(frames,name,f'{ROOT}/_sclip_{HERO}_{K}{GRID[0]}',fnt,fnt2)
    tmp=f'{ROOT}/_sclip_{HERO}_{K}{TAG}';shutil.rmtree(tmp,ignore_errors=True);os.makedirs(tmp)
    async with async_playwright() as pw:
        g=Game(hero=HERO);await g.start(pw)
        await g.ev(SETUP,MODE);await g.step(60)
        if not ALLC:await g.ev(NOC)
        name=await g.ev("(k)=>SKILLS[k]&&SKILLS[k].name||k",K)
        frames=[]
        for v in VARS:
            await g.step(200);await g.ev(CLEAN)
            await g.ev("([near])=>{if(!window.__mcT||window.__mcT.dead){const L=enemies.filter(e=>!e.dead);let b=L[0],bn=-1;for(const e of L){const n=L.filter(o=>o!==e&&Math.hypot(o.x-e.x,o.y-e.y)<110).length;if(n>bn){bn=n;b=e;}}window.__mcT=b;}const e=window.__mcT;player.x=e.x-near;player.y=e.y;player.vx=player.vy=0;player.hp=player.maxHp*.55;}",[NEAR]);await g.step(70)
            ok=await g.ev(SOCK,[K,v,FULL])
            if not ok:print(v,'no gem entry')
            seq=[];n=int(DUR*FPS);st=60//FPS;cs=list(CASTS)
            cx,cy=await g.ev("([dx,dy,w,h])=>{const q=P(player.x+dx,player.y+dy,0);return [q[0]*Z+ox-w/2,q[1]*Z+oy-h/2];}",[DX,DY,CW,CH])
            for i in range(n):
                tnow=i/FPS
                while cs and cs[0]<=tnow+1e-6:
                    cs.pop(0);r=await g.ev(CAST,[K])
                    if r!='ok':print(v,r)
                p=f'{tmp}/{v}_{i:03d}.png';await g.shot(p,clip={'x':max(0,cx),'y':max(0,cy),'width':CW,'height':CH});seq.append(p)
                await g.step(st)
            frames.append((v,seq))
        await g.ev("()=>{const d=totemGems.data();d.ss[0]=null;d.ssu[0]=[null,null];totemGems.apply();}")
        if g.errs:print('ERRORS',g.errs[:4])
        await g.close()
    open(f'{tmp}/vars.txt','w').write(','.join(VARS));open(f'{tmp}/name.txt','w').write(name)
    if NOGRID:print(tmp);return
    grid(frames,name,tmp,fnt,fnt2)
def grid(frames,name,tmp,fnt,fnt2):
    n=min(len(s) for _,s in frames);rows=(len(frames)+COLS-1)//COLS
    for i in range(n):
        S=Image.new('RGB',(CW*COLS,CH*rows+36),(18,14,30));d=ImageDraw.Draw(S)
        d.text((10,5),f'{name} — เจมเสริมแต่ละแบบบนท่าจริง (ใช้ท่า 3 ครั้ง)',fill=(255,233,168),font=fnt2)
        for j,(v,seq) in enumerate(frames):
            im=Image.open(seq[i]).convert('RGB');x,y=(j%COLS)*CW,36+(j//COLS)*CH;S.paste(im,(x,y))
            lab=LAB.get(v,v);w=int(d.textlength(lab,font=fnt))+16;d.rectangle([x,y,x+w,y+27],fill=(0,0,0));d.text((x+8,y+2),lab,fill=(255,255,255),font=fnt)
        S.save(f'{tmp}/g_{i:03d}.png')
    out=f'{ROOT}/sup_{HERO}_{K}{TAG}.mp4'
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate',str(FPS),'-i',f'{tmp}/g_%03d.png','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2',out],check=True)
    Image.open(f'{tmp}/g_{int(n*.3):03d}.png').save(f'{ROOT}/sup_{HERO}_{K}{TAG}_t.png')
    print(out)
asyncio.run(main())
