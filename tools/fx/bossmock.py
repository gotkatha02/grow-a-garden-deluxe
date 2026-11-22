"""Scale mock of a big boss picture in a real map: the cut-out drawn in the sorted layer + 10 copies of the hero around it
(the real hero is invisible and only anchors the camera). Serve the repo on 8765 first.
python3 tools/fx/bossmock.py TAG [img=assets/bosses/world/urtok_cut.webp w=1280 h=720 zoom=0.8 bw=400 (world px) dx= dy= (boss offset from the start spot)
                                  map=egyF1 hero=wolf touch=0 hud=0 out=/tmp/bossmock lift=0 (world px a flyer floats above its shadow)]
zoom = map zoom factor (mapTest.zoom); phone check: w=844 h=390 touch=1 zoom=0.7"""
import asyncio,sys,time,json
from playwright.async_api import async_playwright
TAG=sys.argv[1];A=dict(a.split('=',1) for a in sys.argv[2:] if '=' in a)
W=int(A.get('w',1280));H=int(A.get('h',720));ZM=float(A.get('zoom',.8));BW=float(A.get('bw',400));MAP=A.get('map','egyF1');HERO=A.get('hero','wolf')
TOUCH=A.get('touch','0')=='1';HUD=A.get('hud','0')=='1';IMG=A.get('img','assets/bosses/world/urtok_cut.webp');OUTD=A.get('out','/tmp/bossmock')
import os;os.makedirs(OUTD,exist_ok=True)
INIT="""(()=>{try{const h=%s;localStorage.setItem('af_prog_v1_'+h,JSON.stringify({v:1,mode:'test',save:{map:%s}}));}catch(e){}})()"""%(json.dumps(HERO),json.dumps(MAP))
JS=r"""async([zm,bw,hud])=>{
 const img=new Image();img.src=window.__IMG;await img.decode();
 try{perfHold=1e9;Q=QUALITY.high;}catch(e){}
 if(!hud)for(const id of ['hotbar','hbw','chat','trbar'])(document.getElementById(id)||{style:{}}).style.visibility='hidden';
 const iw=img.width,ih=img.height,sc=bw/iw,lf=window.__LIFT||0;
 const bx=player.x+(window.__DX||0),by=player.y+(window.__DY||0);window.__B={x:bx,y:by};
 fx.push({layer:'none',update(){enemies.length=0;return true;},draw(){}});      // keep the field empty
 fx.push({layer:'sorted',sy:by,update(){return true;},draw(){const [x,y]=P(bx,by);ctx.save();
   ctx.fillStyle=lf?'rgba(20,16,30,.22)':'rgba(20,16,30,.32)';ctx.beginPath();ctx.ellipse(x+8,y+2,bw*(lf?.36:.47),bw*(lf?.11:.15),0,0,6.283);ctx.fill();
   ctx.drawImage(img,x-iw*sc*.5,y-lf-ih*sc*.94,iw*sc,ih*sc);ctx.restore();}});
 const orig=drawPlayer;let inCopy=false;drawPlayer=function(){if(inCopy)return orig.apply(this,arguments);};
 const spots=[[-175,40],[-60,95],[150,120],[255,40],[-330,150],[360,-30],[-250,-60],[40,175],[300,160],[-420,40]];
 for(const s of spots)fx.push({layer:'sorted',sy:by+s[1],update(){return true;},draw(){const sx=player.x,sy=player.y,d=player.dir,ph=player.phi;
   player.x=bx+s[0];player.y=by+s[1];const a=Math.atan2(by-player.y,bx-player.x);player.phi=a;player.dir=dirOf(a);
   try{const [x,y]=P(player.x,player.y);ctx.fillStyle='rgba(10,15,20,.28)';ctx.beginPath();ctx.ellipse(x,y,15,5.5,0,0,6.283);ctx.fill();inCopy=true;orig();}finally{inCopy=false;player.x=sx;player.y=sy;player.dir=d;player.phi=ph;}}});
 // camera anchor: the boss's middle at the centre of the screen
 player.x=bx+20;player.y=by-(ih*sc*.40+lf*.6)/K;cam.x=player.x;cam.y=player.y;
 mapTest.zoom=zm;return [bx,by,K];}"""
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch();ctx=await b.new_context(viewport={'width':W,'height':H},device_scale_factor=2 if W<1000 else 1,has_touch=TOUCH,is_mobile=TOUCH)
        pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
        await pg.add_init_script(INIT)
        await pg.goto('http://localhost:8765/index.html?char=%s&map=%s&nosw=1&cb=%d'%(HERO,MAP,time.time()));await pg.wait_for_timeout(20000)
        await pg.evaluate('([a,b,i,l])=>{window.__DX=a;window.__DY=b;window.__IMG=i;window.__LIFT=l;}',[float(A.get('dx',0)),float(A.get('dy',0)),IMG,float(A.get('lift',0))]);r=await pg.evaluate(JS,[ZM,BW,HUD]);print('boss',r)
        await pg.wait_for_timeout(2500)
        out=f'{OUTD}/{TAG}.png';await pg.screenshot(path=out);print(out,errs[:3])
        await b.close()
asyncio.run(main())
