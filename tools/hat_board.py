#!/usr/bin/env python3
"""Head board for painted-hat art (owner 2026-11-23 'พวกหมวกต้องเจนรูปแบบไหน').

  python3 tools/hat_board.py [hero]          (game served on http://localhost:8765, Playwright)
  -> tools/ref/hat_ref_<hero>.png  = the hero's head from the 5 source views (idle frame 0, atlas size x1.3),
     labelled 1 FRONT · 2 FRONT 3/4 · 3 SIDE · 4 BACK 3/4 · 5 BACK. The owner attaches it to ChatGPT with the
     hat prompt in FASHION_HAT_PROMPTS_TH.md so the hat is drawn at the head's angles and size.
Needs FASHION.head (tracked head point per frame) for the hero — only the wolf has it so far (assets_fashion.js).
"""
import asyncio,sys,time,base64,io,os
from PIL import Image,ImageDraw,ImageFont
from playwright.async_api import async_playwright
HERO=sys.argv[1] if len(sys.argv)>1 else 'wolf'
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D=['S','SE','E','NE','N']
JS=r"""async()=>{
 for(const s of ['top','mid','low','garment','back'])try{fUnequip(s);}catch(e){}
 await new Promise(r=>setTimeout(r,300));
 if(!window.FASHION||!FASHION.head||!FASHION.head.idle)return {err:'no FASHION.head for this hero'};
 const Z=1/SPR,out=[];
 for(const d of ['S','SE','E','NE','N']){const e={st:'idle',d,f:0},hp=FASHION.head.idle[d][0];
   const cv=document.createElement('canvas');cv.width=SPR_META.cell.w;cv.height=SPR_META.cell.h;const g=cv.getContext('2d');
   const old=ctx;ctx=g;g.setTransform(Z,0,0,Z,0,0);const pv=SPR_META.pivot;
   try{g.filter=armorFilter()||'none';drawFrame(e,pv.x*SPR,pv.y*SPR,1);g.filter='none';}finally{ctx=old;}
   out.push({d,hp,url:cv.toDataURL('image/png')});}
 return {out};}"""
async def grab():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader']);pg=await (await b.new_context(viewport={'width':1280,'height':720})).new_page()
        await pg.goto('http://localhost:8765/index.html?nosw=1')
        await pg.evaluate(f"()=>{{localStorage.setItem('af_prog_v1_{HERO}',JSON.stringify({{mode:'test',save:{{map:'frostheim'}}}}));localStorage.setItem('af_char','{HERO}');}}")
        await pg.goto(f'http://localhost:8765/index.html?char={HERO}&nosw=1&guide=0&cb={time.time()}');await pg.wait_for_timeout(9000)
        o=await pg.evaluate(JS);await b.close();return o
o=asyncio.run(grab())
if o.get('err'):sys.exit(o['err'])
UP,CW,W,TOP,H=1.3,320,236,26,214
EN=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',26)
heads=[]
for v in o['out']:
    im=Image.open(io.BytesIO(base64.b64decode(v['url'].split(',')[1]))).convert('RGBA');x=v['hp'][0]
    c=im.crop((x-W//2,TOP,x+W//2,TOP+H));heads.append(c.resize((round(c.width*UP),round(c.height*UP)),Image.LANCZOS))
hw,hh=heads[0].size;B=Image.new('RGB',(CW*5,hh+70),(236,236,236));g=ImageDraw.Draw(B)
for i,(h,t) in enumerate(zip(heads,['1 FRONT','2 FRONT 3/4','3 SIDE','4 BACK 3/4','5 BACK'])):
    B.paste(h,(i*CW+(CW-hw)//2,8),h);tw=g.textlength(t,font=EN);g.text((i*CW+(CW-tw)/2,hh+22),t,fill=(60,60,70),font=EN)
out=os.path.join(ROOT,'tools','ref',f'hat_ref_{HERO}.png');B.save(out);print(out,B.size)
