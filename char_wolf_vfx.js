/* =====================================================================
   TOTEM LEGEND — Wolf (Frost Raider) · skill effects v2 (owner 2026-11-19, same method as the dragon)
   Replaces wolf_fx.js. Painted pictures (assets/fx/wolf + 4 cat pieces) are the main shapes; vfx25.js adds 2.5D support.
   The wolf's old code VFX (generic index.html classes, all visual-only — checked) are dropped while the wolf is played.
   Storms and the axe cyclone are flat pictures on the floor + code ribbons; no picture is spun.
   ===================================================================== */
(function(){
const N=n=>'wolf/'+n;
const WC={red:'#ff3d4a',blood:'#c8102e',ice:'#9fe0ff',ice2:'#e8f8ff',gold:'#ffcf6a',bolt:'#bfe8ff'};
const PIC=['w01_axe','w03_hitred','w04_cyclone','w05_howl','w06_vamp','w07_rage','w08_exec','w09_parry','w10_armor','w11_frost','w13_prison','w14_rune','w15_bolt','w16_spear','w17_blizzard','w18_shatter','w19_spirit','w20_banner','w21_glacial','w22_worldstorm','x01_silver_slash','x02_heavy_chop','x03_cross_slash','x04_ice_hit','x05_ground_crack','x06_red_splash','x07_thunder_slash','x08_snow_burst','y01_spin_ring','y02_snow_curtain','y03_icicle_fall','y04_sky_lightning','y05_ground_rift','y06_wolf_dive','y07_rock_shock','y08_fenrir_spirit','y09_frost_aura','y10_spear_burst','y11_red_cleave'];
const DROPN=['Bolt','ClawMarks','Constellation','Crack','CrackStar','Crystal','CycloneRing','Drain','FrostGround','GLight','GRing','Ghost','GroundShatter','Guillotine','Impact','JgEye','JgGlint','JgShade','LightPillar','LineCut','OrbitShards','PactAura','RuneCircle','RuneSeal','RuneShield','ScorchLine','ShadowPool','Slash','SpectralAxe','SpiralWave','Streak','TexGhost','UnbrokenFx','WindArc'];
const A_SET=new Set(['warFury','bloodCleave','savageRend','axeDance','wolfFinale','ironCounter','revengeBreaker','vampiricAxe','bloodRush','axeCyclone','cycloneLeap','executioner','predatorsLeap','valhallasWrath','reversalSlash','armorBreak','basic']);

function install(){const X=window.V25;if(!X||typeof CHAR==='undefined'||CHAR!=='wolf')return;
  const {im,add,punch,scr,aim,ribbon,eo,GPic,SPic,XPic,HPic,Shock,Crack,Puffs,Debris,Whirl,Pillar,Pool,Speed,Stain,Bolt,V,c01}=X;
  PIC.forEach(n=>im(N(n)));['09_crater','25_shock'].forEach(n=>im('cat/'+n));
  if(window.TV&&TV.toonHeroes)TV.toonHeroes.delete('wolf');
  const blood=(x,y,n,o={})=>add(new Debris(Object.assign({x,y,n,kind:'drop',col:WC.blood,col2:'#ff9aa8',v0:60,v1:180,up:220,z:26,life:.8},o)));
  const ice=(x,y,n,o={})=>add(new Debris(Object.assign({x,y,n,kind:'shard',col:'#d8f4ff',col2:'#ffffff',v0:80,v1:200,up:220,z:26,life:.8},o)));
  const zaps=(x,y,n)=>add(new Debris({x,y,n,kind:'zap',col:WC.bolt,col2:'#fff',v0:70,v1:180,up:180,life:.5}));
  const tgt=(c,r=200)=>(c&&c.target&&!c.target.dead)?c.target:nearestEnemy(player.x,player.y,r,player.phi)||nearestEnemy(player.x,player.y,r);
  const W={
    slash(phi,w,kind,flip){const frost=kind==='frost',x=player.x+Math.cos(phi)*w*.25,y=player.y+Math.sin(phi)*w*.25;
      const p=add(new XPic({n:N(frost?'w11_frost':'w01_axe'),x,y,phi,w,z:30,life:.34,fadeOut:.5,trail:3}));if(p&&flip)p.fy=!p.fy;
      const ex=player.x+Math.cos(phi)*w*.45,ey=player.y+Math.sin(phi)*w*.45;frost?ice(ex,ey,3,{dir:phi,spread:.8}):blood(ex,ey,3,{dir:phi,spread:.8});},
    crater(x,y,w=170){add(new GPic({n:'cat/09_crater',x,y,w,life:1.4,s0:.6,fadeOut:.35}));V.slam(x,y,w*.55,WC.gold,{kind:'rock',dcol:'#cfc6b8',dust:'#f4f0ff',dustE:'#c2b6e0'});},
    bolt(x,y,h=170){add(new Bolt({x,y,col:WC.bolt,h:h*1.6,life:.3}));add(new SPic({n:N('w15_bolt'),x,y,w:h*.6,life:.35,fadeIn:.001,fadeOut:.6,shadow:0,pool:WC.bolt,sortOff:8}));add(new Shock({x,y,R:h*.35,col:WC.bolt,w:8,life:.3}));add(new Stain({x,y,R:30,col:'rgba(30,40,70,.35)',life:1.2}));zaps(x,y,4);},
    sky(x,y,h=130){add(new SPic({n:N('y04_sky_lightning'),x,y,w:h*.5,ay:.97,life:.3,fadeIn:.001,fadeOut:.6,shadow:0,pool:WC.bolt,sortOff:8}));add(new Shock({x,y,R:h*.3,col:WC.bolt,w:7,life:.28}));add(new Stain({x,y,R:26,col:'rgba(30,40,70,.35)',life:1}));zaps(x,y,3);},
    shatter(x,y,w=110){add(new SPic({n:N('w18_shatter'),x,y,w,ay:.8,life:.5,fadeIn:.001,fadeOut:.6,shadow:.2,pool:WC.ice,sink:.4}));add(new Shock({x,y,R:w*.55,col:WC.ice,w:10,life:.35}));ice(x,y,6);},
    storm(n,x,y,R,dur,o={}){add(new GPic({n:N(n),x,y,w:R*2.1,life:dur,s0:.4,a0:.9,fadeOut:.15,breathe:.02,add:.15,follow:o.follow}));
      add(new Whirl({x,y,R:R*.8,n:4,w:20,col:o.col||'#cfeaff',col2:'#ffffff',life:dur,spd:o.spd||5,follow:o.follow}));
      if(o.funnel)add(new Whirl({x,y,R:R*.5,n:3,w:13,col:o.col||'#e8f6ff',col2:'#fff',life:dur,spd:(o.spd||5)*1.4,h:o.funnel,a0:.55,follow:o.follow}));},
  };
  /* ---- painted swing (owner 2026-11-19: the slash picture must come out in time with the hand) ----
     Same arc as the old code slash: centred on the shoulder, from the wind-up axe-head position through the contact-frame
     axe-head position. The picture is bent onto that arc in thin slices and revealed only as far as the live axe head has gone. */
  const DEG=Math.PI/180;
  const ART={axe:{n:N('w01_axe'),T:[6,136],E:[196,6],G:[250,120],k:1},frost:{n:N('w11_frost'),T:[330,238],E:[382,62],G:[150,140],k:1},
    silver:{n:N('x01_silver_slash'),T:[6,76],E:[502,207],G:[175,144],k:.85},thunder:{n:N('x07_thunder_slash'),T:[7,67],E:[502,196],G:[191,165],k:.9}};
  const hue=h=>{const r=parseInt(h.slice(1,3),16)/255,g=parseInt(h.slice(3,5),16)/255,b=parseInt(h.slice(5,7),16)/255,M=Math.max(r,g,b),m=Math.min(r,g,b);if(M===m)return 0;let H=M===r?(g-b)/(M-m):M===g?2+(b-r)/(M-m):4+(r-g)/(M-m);return (H*60+360)%360;};
  const angD=(a,b)=>{let d=(a-b)%(2*Math.PI);if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;return d;};
  class PSlash{constructor(o){Object.assign(this,{t:0,layer:'top',prog:0,er:0,hold:.05,fade:.16},o);this.done=-1;}
    p3(th,r){return [player.x+Math.cos(th)*r*.6,player.y,30-Math.sin(th)*r*.6];}
    C(){const [px,py]=P(player.x,player.y,player.z||0);return [px+this.cx,py+this.cy];}
    update(dt){this.t+=dt;const T=(typeof ACTION_TEMPO!=='undefined'?ACTION_TEMPO:1);
      const L=(player.action===this.act)&&liveSocket();let pr=L?c01((this.t*T/this.grow-.5)*2):c01(this.t*T/this.grow);
      if(L){const [cx,cy]=this.C(),ha=Math.atan2(L.head[1]-cy,L.head[0]-cx);pr=Math.max(pr,c01(angD(ha,this.ta)*this.sg/Math.abs(this.span)));}
      this.prog=Math.max(this.prog,pr);if(this.prog>=1&&this.done<0)this.done=this.t;
      if(this.done>=0){const q=(this.t-this.done-this.hold)/this.fade;this.er=c01(q);if(q>=1)return false;}
      return this.t<3;}
    /* rigid picture (the art is never bent): its tail→tip chord is laid on the swing chord, its bulge away from the shoulder;
       revealed by an angular wipe round the shoulder that follows the live axe head, then erased tail-first */
    draw(){const A=ART[this.art],i=im(A.n);if(!i||this.prog<=0)return;const [cx,cy]=this.C(),ta=this.ta,sp=this.span,R=this.R2,te=ta+sp;
      const ax=cx+Math.cos(ta)*R,ay=cy+Math.sin(ta)*R,bx=cx+Math.cos(te)*R,by=cy+Math.sin(te)*R,mx=cx+Math.cos(ta+sp/2)*R,my=cy+Math.sin(ta+sp/2)*R;
      const T=A.T,E=A.E,G=A.G,lp=Math.hypot(E[0]-T[0],E[1]-T[1]),ld=Math.hypot(bx-ax,by-ay),k=ld/lp*(A.k||1);
      const sp1=Math.sign((E[0]-T[0])*(G[1]-T[1])-(E[1]-T[1])*(G[0]-T[0])),sd=Math.sign((bx-ax)*(my-ay)-(by-ay)*(mx-ax)),m=sp1===sd?1:-1;
      const f0=eo(this.er),f1=this.prog,al=this.al*(1-.5*this.er);if(f1<=f0)return;
      ctx.save();
      if(f1<1||f0>0){const M=.35,lo=ta+sp*f0-(f0>0?0:M*Math.sign(sp)),hi=ta+sp*f1+(f1>=1?M*Math.sign(sp):0);ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R*6,Math.min(lo,hi),Math.max(lo,hi));ctx.closePath();ctx.clip();}
      ctx.translate(ax,ay);ctx.rotate(Math.atan2(by-ay,bx-ax));ctx.scale(k,k*m);ctx.rotate(-Math.atan2(E[1]-T[1],E[0]-T[0]));ctx.translate(-T[0],-T[1]);
      ctx.globalAlpha=al;ctx.drawImage(i,0,0);
      if(this.t<.07){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=al*.7*(1-this.t/.07);ctx.drawImage(i,0,0);}
      ctx.restore();ctx.globalAlpha=1;}}
  const pslash=(s,k1,o={})=>{const B=headR(s,k1);if(!B)return null;const [px,py]=P(player.x,player.y,player.z||0),C=[px,py-44];
    let A=null,best=0;for(let k=Math.max(0,k1-3);k<k1;k++){const h=headR(s,k);if(h){const dd=Math.hypot(h[0]-B[0],h[1]-B[1]);if(dd>best){best=dd;A=h;}}}
    if(!A||best<14)A=[C[0]-(B[0]-C[0])*.6,C[1]-Math.abs(B[1]-C[1])-26];
    const r=Math.max(26,Math.min(72,Math.hypot(B[0]-C[0],B[1]-C[1])));let ta=Math.atan2(A[1]-C[1],A[0]-C[0]);const tb=Math.atan2(B[1]-C[1],B[0]-C[0]);
    const md=x=>((x%(2*Math.PI))+2*Math.PI)%(2*Math.PI),d1=md(tb-ta),d2=d1-2*Math.PI;let sw=Math.abs(d1)<Math.abs(d2)?d1:d2;
    if(Math.abs(Math.abs(d1)-Math.abs(d2))<1)sw=Math.sin(ta+d1/2)<Math.sin(ta+d2/2)?d1:d2;
    const mp=o.maxPre??1.9;if(Math.abs(sw)>mp)sw=Math.sign(sw)*mp;if(Math.abs(sw)<.8)sw=Math.sign(sw||1)*.8;ta=tb-sw+(o.rot||0);sw=tb-ta;const sg=Math.sign(sw),over=o.over??.45;
    const W=o.W||20,cl=o.colors||{},art=o.art||(()=>{const g=(cl.glow||'#ff0000').toLowerCase(),h=hue(g);if(g==='#3d7bff')return 'thunder';if(g==='#8fb8ff'||g==='#8fd0ff')return 'silver';return (h>150&&h<260)?'frost':'axe';})();
    const R=(r*(o.rs??1.08)+W*.3)*(.8+W/90)*.55*(o.szMul||1);
    return add(new PSlash({art,cx:C[0]-px,cy:C[1]-py,ta,span:sw+sg*over,sg,R2:R,al:o.alpha??1,grow:o.grow||.12,fade:o.editor?Math.max(.05,o.fade||.2):Math.max(.12,(o.fade||.15)+.04),hold:o.hold??.05,act:player.action,a0:ta,a1:tb+sg*over,R}));};
  window._wPSlash=pslash;
  /* ---- composed pieces (owner 2026-11-19: generated parts put together on the hit timing) ---- */
  const fwdP=(d,phi=player.phi)=>[player.x+Math.cos(phi)*d,player.y+Math.sin(phi)*d];
  const gp=(n,x,y,w,o={})=>add(new GPic(Object.assign({n:N(n),x,y,w,life:.7,s0:.6,fadeOut:.45},o)));
  const sp=(n,x,y,w,o={})=>add(new SPic(Object.assign({n:N(n),x,y,w,life:.55,fadeIn:.001,fadeOut:.5,shadow:.25},o)));
  const hp=(n,e,w,o={})=>add(new HPic(Object.assign({n:N(n),x:e.x,y:e.y,e,w:w*(e.boss?1.3:1),z:(e.boss?40:26),life:.3},o)));
  /* a picture dropping out of the sky, then land() */
  class Drop{constructor(o){Object.assign(this,{t:0,life:.28,layer:'sorted',z0:300,w:70},o);}get sy(){return this.y+8;}
    update(dt){this.t+=dt;if(this.t>=this.life){this.land&&this.land();return false;}return true;}
    draw(){const i=im(this.n);if(!i)return;const k=Math.min(1,this.t/this.life),z=this.z0*(1-k*k),w=this.w,h=w*i.naturalHeight/i.naturalWidth,[x,y]=scr(this.x,this.y,z);ctx.drawImage(i,x-w/2,y-h*.95,w,h);}}
  const drop=(n,x,y,w,land,o={})=>add(new Drop(Object.assign({n:N(n),x,y,w,land},o)));
  const slam=(x,y,w=200,heavy)=>{gp('y07_rock_shock',x,y,w,{life:.8,s0:.5});if(heavy)gp('x05_ground_crack',x,y,w*.8,{life:1.2,layer:'ground'});shake(heavy?4:2.5);punch(.03);add(new Debris({x,y,n:5,kind:'rock',col:'#a8a0a0',col2:'#fff',v0:80,v1:220,up:260,z:10}));};
  /* ---- moving storms (owner 2026-11-19: storms 'float stiffly') ----
     A storm is many painted pieces that travel: flakes / shards / drops cut from the strip pictures are sucked round a
     2.5D spiral (in toward the centre and up, then respawn at the rim), curtains of wind orbit the centre, axe slashes chase
     round the hero. The ground picture stays for the whole storm (obj) and only breathes; no picture spins in place
     except the small flakes, which tumble like real snow. */
  const STRIPS={};
  function strip(n){let S=STRIPS[n];if(S)return S.ok?S:null;S=STRIPS[n]={ok:0,parts:[]};const i=new Image();i.onload=()=>{try{const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;const g=c.getContext('2d');g.drawImage(i,0,0);
      const d=g.getImageData(0,0,c.width,c.height).data,W2=c.width,H2=c.height,col=x=>{for(let y=0;y<H2;y++)if(d[(y*W2+x)*4+3]>40)return 1;return 0;};let st=-1;
      for(let x=0;x<=W2;x++){const on=x<W2&&col(x);if(on&&st<0)st=x;if(!on&&st>=0){if(x-st>8)S.parts.push([st,x-st]);st=-1;}}S.img=i;S.H=H2;S.ok=1;}catch(e){}};i.src='assets/fx/'+n+'.webp';return null;}
  ['wolf/w12_ice','wolf/w02_blood'].forEach(strip);
  class Swirl{constructor(o){this._pic=1;Object.assign(this,{t:0,life:2,layer:'sorted',R:120,n:16,src:'wolf/w12_ice',size:[14,26],spd:2.2,dir:1,inward:.35,rise:90,h:160,a0:1,follow:null,fadeIn:.3,fadeOut:.4},o);
      this.P=Array.from({length:this.n},(_,i)=>this.spawn(i/this.n));}
    spawn(u){return {a:rnd(0,6.283),r:this.R*(u!=null?.35+.65*u:rnd(.85,1.05)),z:rnd(0,this.h*.5),s:rnd(this.size[0],this.size[1]),k:(Math.random()*99)|0,sp:rnd(-6,6),rot:rnd(0,6.28),w:rnd(.8,1.25)};}
    get sy(){return this.y+2;}
    update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}if(this.until&&this.until()&&this.t<this.life-this.fadeOut)this.t=this.life-this.fadeOut;
      for(let i=0;i<this.P.length;i++){const q=this.P[i];q.a+=this.dir*this.spd*q.w*dt*(this.R/Math.max(20,q.r))**.5;q.r-=this.R*this.inward*dt;q.z+=this.rise*dt;q.rot+=q.sp*dt;if(q.r<this.R*.12||q.r>this.R*1.5||q.z>this.h)this.P[i]=this.spawn();}
      return this.t<this.life;}
    draw(){const S=strip(this.src);if(!S)return;const A=this.a0*c01(this.t/this.fadeIn)*c01((this.life-this.t)/this.fadeOut);if(A<.02)return;
      for(const q of this.P){const [sx,sw]=S.parts[q.k%S.parts.length],x=this.x+Math.cos(q.a)*q.r,y=this.y+Math.sin(q.a)*q.r,[px,py]=scr(x,y,q.z+10),front=Math.sin(q.a);
        const s=q.s*(1+.25*front),fade=c01(q.r/(this.R*.3))*c01((this.h-q.z)/(this.h*.25));ctx.save();ctx.globalAlpha=A*fade*(.65+.35*(front+1)/2);ctx.translate(px,py);ctx.rotate(q.rot);ctx.drawImage(S.img,sx,0,sw,S.H,-s/2,-s/2*S.H/sw,s,s*S.H/sw);ctx.restore();}ctx.globalAlpha=1;}}
  /* curtains / slashes travelling round an ellipse; each piece faces its direction of travel (it is not spun in place) */
  class Orbit{constructor(o){this._pic=1;Object.assign(this,{t:0,life:2,layer:'sorted',R:110,n:3,spd:1.2,w:110,ay:.95,z:0,a0:.9,follow:null,tangent:false,fadeIn:.25,fadeOut:.35,sway:.06,ph:rnd(0,6.28)},o);}
    get sy(){return this.y+1;}
    update(dt){this.t+=dt;if(this.follow){this.x=this.follow.x;this.y=this.follow.y;}if(this.until&&this.until()&&this.t<this.life-this.fadeOut)this.t=this.life-this.fadeOut;return this.t<this.life;}
    draw(){const i=im(this.n2);if(!i)return;const A=this.a0*c01(this.t/this.fadeIn)*c01((this.life-this.t)/this.fadeOut);if(A<.02)return;const h0=this.w*i.naturalHeight/i.naturalWidth;
      const L=[];for(let k=0;k<this.n;k++){const a=this.ph+this.t*this.spd+k*6.283/this.n;L.push([Math.sin(a),a]);}L.sort((p,q)=>p[0]-q[0]);
      for(const [f,a] of L){const x=this.x+Math.cos(a)*this.R,y=this.y+Math.sin(a)*this.R,[px,py]=scr(x,y,this.z),sc=.8+.2*(f+1)/2,w=this.w*sc,h=h0*sc;
        ctx.save();ctx.globalAlpha=A*(.55+.45*(f+1)/2);ctx.translate(px,py);
        if(this.tangent){const vx=-Math.sin(a)*Math.sign(this.spd),vy=Math.cos(a)*K*Math.sign(this.spd);ctx.rotate(Math.atan2(vy,vx));if(vx<0)ctx.scale(1,-1);ctx.drawImage(i,-w/2,-h/2,w,h);}
        else{const vx=-Math.sin(a)*Math.sign(this.spd);if(vx<0)ctx.scale(-1,1);ctx.transform(1,0,Math.sin(this.t*3+a)*this.sway,1,0,0);ctx.drawImage(i,-w/2,-h*this.ay,w,h);}
        ctx.restore();}ctx.globalAlpha=1;}}
  const ground=(n,x,y,w,dur,o={})=>add(new GPic(Object.assign({n:N(n),x,y,w,life:dur,obj:1,s0:.5,a0:.9,fadeIn:.15,fadeOut:.4,breathe:.03},o)));
  const AT={
    bloodCleave:c=>{const [x,y]=fwdP(70);gp('x06_red_splash',x,y,150,{life:.9,layer:'ground'});},
    savageRend:c=>{const t=tgt(c);if(t){hp('x03_cross_slash',t,130,{life:.4});gp('x06_red_splash',t.x,t.y,130,{life:.9});}},
    wolfFinale:()=>{const [x,y]=fwdP(45);sp('x02_heavy_chop',x,y,120,{ay:.97});slam(x,y,220,1);},
    revengeBreaker:c=>{const t=tgt(c)||{x:fwdP(60)[0],y:fwdP(60)[1]};sp('x02_heavy_chop',t.x,t.y,110,{ay:.97});gp('x05_ground_crack',t.x,t.y,150,{life:1});shake(3);},
    vampiricAxe:()=>{add(new SPic({n:N('w06_vamp'),x:player.x,y:player.y,w:90,follow:player,sortOff:-4,life:.9,a0:.85,shadow:0,pool:WC.red}));},
    armorBreak:c=>{const t=tgt(c);if(t){add(new HPic({n:N('w10_armor'),x:t.x,y:t.y,e:t,w:t.boss?140:100,z:30,life:.55}));gp('x05_ground_crack',t.x,t.y,140,{life:1});add(new Debris({x:t.x,y:t.y,n:6,kind:'rock',col:'#a8a8b8',col2:'#fff',v0:80,v1:200,up:240,z:30}));}},
    executioner:c=>{const t=tgt(c)||player;add(new SPic({n:N('w08_exec'),x:t.x,y:t.y,w:t.boss?115:90,life:.55,fadeIn:.001,pool:WC.red,sink:.5}));gp('y11_red_cleave',t.x,t.y,220,{life:1.1});gp('x06_red_splash',t.x,t.y,140,{life:.9});shake(4);flash.a=Math.max(flash.a,.2);flash.c=WC.red;},
    cycloneLeap:()=>slam(player.x,player.y,200),
    ironCounter:()=>add(new SPic({n:N('w09_parry'),x:player.x+Math.cos(player.phi)*24,y:player.y+Math.sin(player.phi)*24,w:80,ay:.6,z:10,life:.5,fadeIn:.001,shadow:0,pool:WC.gold})),
    warHowl:()=>{add(new SPic({n:N('w05_howl'),x:player.x,y:player.y,w:130,ay:.75,z:20,follow:player,sortOff:-4,life:.9,shadow:0}));V.release(player.x,player.y,WC.gold,{R:160,h:240,w:80});},
    warFury:()=>{add(new SPic({n:N('w05_howl'),x:player.x,y:player.y,w:110,ay:.75,z:20,follow:player,sortOff:-4,life:.7,shadow:0}));add(new Shock({x:player.x,y:player.y,R:90,col:WC.red,w:12}));},
    bloodRush:()=>{add(new Shock({x:player.x,y:player.y,R:80,col:WC.red,w:12}));blood(player.x,player.y,6);},
    predatorsLeap:()=>{setFxTimer(.3,()=>slam(player.x,player.y,190));},
    valhallasWrath:c=>{const t=tgt(c,260)||player;add(new SPic({n:N('w07_rage'),x:player.x,y:player.y,w:130,follow:player,sortOff:-4,life:1,a0:.8,shadow:0}));
      setFxTimer(.15,()=>{add(new SPic({n:N('w08_exec'),x:t.x,y:t.y,w:t.boss?150:125,life:.6,fadeIn:.001,pool:WC.red,sink:.5}));gp('y11_red_cleave',t.x,t.y,260,{life:1.2});slam(t.x,t.y,240,1);V.release(t.x,t.y,WC.red,{R:160,h:300,w:90});});},
    frostFang:()=>{},
    iceBreak:c=>{const t=tgt(c);if(t){W.shatter(t.x,t.y,t.boss?150:110);gp('x05_ground_crack',t.x,t.y,150,{life:1});}},
    runeBurst:()=>{add(new GPic({n:N('w14_rune'),x:player.x,y:player.y,w:200,life:.8,s0:.4,grow:1.1,add:.35}));W.shatter(player.x,player.y,150);V.release(player.x,player.y,WC.ice,{R:120,h:220,w:70});},
    runeGuard:()=>add(new Shock({x:player.x,y:player.y,R:80,col:WC.ice,w:10})),
    thunderFang:c=>{const t=tgt(c,240);if(t)W.sky(t.x,t.y,120);},
    lightningPursuit:c=>{const t=tgt(c,300);if(t)W.sky(t.x,t.y,140);},
    stormStep:()=>{W.sky(player.x,player.y,110);add(new Speed({x:player.x,y:player.y,phi:player.phi,life:.3,col:WC.bolt}));},
    shatterPulse:()=>{W.shatter(player.x,player.y,180);gp('x08_snow_burst',player.x,player.y,220,{life:.7});V.slam(player.x,player.y,140,WC.ice,{kind:'shard',dcol:'#d8f4ff',crack:false});},
    frozenDescent:()=>{const x=player.x,y=player.y;drop('y03_icicle_fall',x,y,90,()=>{gp('y05_ground_rift',x,y,240,{life:1.4});W.shatter(x,y,170);slam(x,y,220);},{life:.22});},
    thunderSpear:c=>{const t=tgt(c,320),phi=t?angTo(t):player.phi,L=t?Math.hypot(t.x-player.x,t.y-player.y):200;
      add(new XPic({n:N('w16_spear'),x:player.x+Math.cos(phi)*L*.5,y:player.y+Math.sin(phi)*L*.5,phi,w:Math.max(150,L),z:34,life:.35,trail:2}));if(t)setFxTimer(.1,()=>{hp('y10_spear_burst',t,110,{life:.35});W.sky(t.x,t.y,130);});},
    icePrison:c=>{const x=c.gx??player.x,y=c.gy??player.y,r=(typeof prisonR==='function'?prisonR():70);add(new SPic({n:N('w13_prison'),obj:1,x,y,w:r*1.8,ay:.9,life:2.6,a0:.95,pool:WC.ice,sink:.6}));W.shatter(x,y,r*2);},
    runeStorm:c=>{const x=c.gx??player.x,y=c.gy??player.y,r=70+10*(LV.runeStorm||1),d=1.6;ground('w14_rune',x,y,r*2.4,d);add(new Swirl({x,y,R:r,n:12,life:d,spd:2.6,inward:.5,rise:120,h:150,size:[12,22]}));for(let i=0;i<5;i++)setFxTimer(.15+i*.28,()=>W.sky(x+rnd(-r,r)*.6,y+rnd(-r,r)*.4,110));},
    blizzard:c=>{const x=c.gx??player.x,y=c.gy??player.y,lv=LV.blizzard||1,r=100+15*lv,dur=2.4+.4*lv;ground('w17_blizzard',x,y,r*2.1,dur);
      add(new Orbit({n2:N('y02_snow_curtain'),x,y,R:r*.62,n:3,spd:1.6,w:105,life:dur,a0:.85}));add(new Swirl({x,y,R:r,n:26,life:dur,spd:2.4,inward:.3,rise:70,h:170,size:[12,26]}));
      let k=0;const T=()=>{if(k++>dur*3)return;const dx=x+rnd(-r,r)*.7,dy=y+rnd(-r,r)*.5;drop('y03_icicle_fall',dx,dy,46,()=>{ice(dx,dy,3,{up:120});gp('x08_snow_burst',dx,dy,90,{life:.5});});setFxTimer(.33,T);};T();skyDarkT=Math.max(skyDarkT,.45);setFxTimer(dur,()=>{skyDarkT=0;});},
    tempestField:c=>{const x=c.gx??player.x,y=c.gy??player.y,lv=LV.tempestField||1,r=120+10*lv,d=4;ground('w14_rune',x,y,r*2.3,d);add(new Swirl({x,y,R:r,n:14,life:d,spd:1.8,inward:.25,rise:60,h:140,size:[12,22]}));for(let i=0;i<10;i++)setFxTimer(.2+i*.38,()=>W.sky(x+rnd(-r,r)*.7,y+rnd(-r,r)*.5,120));},
    ragnaroksJudgment:()=>{const x=player.x,y=player.y,d=2.6;ground('w22_worldstorm',x,y,420,d);gp('y05_ground_rift',x,y,300,{life:d,obj:1,fadeOut:.3});add(new Orbit({n2:N('y02_snow_curtain'),x,y,R:150,n:4,spd:1.9,w:130,life:d,a0:.85}));add(new Swirl({x,y,R:200,n:34,life:d,spd:2.8,inward:.35,rise:90,h:240,size:[14,30]}));V.release(x,y,WC.ice,{R:200,h:400,w:120});skyDarkT=Math.max(skyDarkT,.7);setFxTimer(d,()=>{skyDarkT=0;});for(let i=0;i<10;i++)setFxTimer(.2+i*.22,()=>W.sky(x+rnd(-170,170),y+rnd(-110,110),140));},
    runicDetonation:c=>{const t=tgt(c,260)||player;add(new GPic({n:N('w14_rune'),x:t.x,y:t.y,w:130,life:.6,s0:.4,add:.4}));setFxTimer(.15,()=>{W.shatter(t.x,t.y,150);gp('y05_ground_rift',t.x,t.y,180,{life:1});V.release(t.x,t.y,WC.ice,{R:110,h:240,w:70});});},
    ravenousLeap:()=>{setFxTimer(.3,()=>slam(player.x,player.y,180));},
    frostbloodPact:()=>{sp('y09_frost_aura',player.x,player.y,110,{follow:player,sortOff:-4,life:.9,shadow:0,pool:WC.ice});W.shatter(player.x,player.y,120);},
    warBanner:()=>{window._wBAN={x:player.x+18,y:player.y-6};V.slam(player.x+18,player.y-6,70,WC.gold,{debris:false,crack:false,puffs:4,shake:1.5,punch:.02});},
    fenrirsSpirit:()=>{sp('y08_fenrir_spirit',player.x-24,player.y-6,125,{life:.8,ay:.97,pool:WC.ice,shadow:.3});V.release(player.x,player.y,WC.ice,{R:90,h:200,w:60});},
    axeCyclone:(c,a)=>{const dur=Math.max(.6,(a.dur||1)*.95);ground('y01_spin_ring',player.x,player.y,190,dur,{follow:player,breathe:.05});
      add(new Orbit({n2:N('w01_axe'),x:player.x,y:player.y,follow:player,R:62,n:3,spd:-11,w:92,z:26,tangent:true,life:dur,a0:.95,fadeIn:.08,fadeOut:.2}));
      add(new Swirl({x:player.x,y:player.y,follow:player,src:'wolf/w02_blood',R:85,n:10,life:dur,spd:-5,inward:-.6,rise:40,h:90,size:[10,18],dir:1}));},
    battleStep:()=>add(new Puffs({x:player.x,y:player.y,R:30,n:3,size:9,life:.5})),
  };
  if(!window._wv2h){window._wv2h=1;
    /* 1. old visuals off (wolf only) */
    const DROP=DROPN.map(n=>{try{return eval(n);}catch(e){return null;}}).filter(c=>typeof c==='function');
    const A=window.addFx;window.addFx=addFx=function(f){if(CHAR==='wolf'&&f&&!f._v2&&DROP.some(c=>f instanceof c))return f;return A.apply(this,arguments);};
    const E=window.emit;window.emit=emit=function(o){if(CHAR==='wolf'&&o&&/^(round|spark|ember|dust|shard|frag|glint|snow|mist)$/.test(o.type))return;return E.apply(this,arguments);};
    if(typeof dustPuff==='function'){window.dustPuff=dustPuff=function(x,y,n,col,spd){add(new Puffs({x,y,R:(spd||60)*.9,n:Math.max(2,Math.round((n||4)*.6)),size:9,life:.6}));};}
    /* projectiles with gameplay: repaint only */
    if(typeof CrescentWave!=='undefined')CrescentWave.prototype.draw=function(){const i=im(N('w11_frost'));if(!i)return;const k=this.d/this.max,a=Math.max(0,1-Math.max(0,k-.6)/.4)*(1-(this.fade||0)),x=this.x+Math.cos(this.phi)*this.d,y=this.y+Math.sin(this.phi)*this.d,[px,py]=scr(x,y,30),r=aim(this.phi),w=120,h=w*i.naturalHeight/i.naturalWidth;
      ctx.save();ctx.globalAlpha=a;ctx.translate(px,py);ctx.rotate(r);if(Math.cos(r)<0)ctx.scale(1,-1);ctx.drawImage(i,-w/2,-h/2,w,h);ctx.restore();ctx.globalAlpha=1;};
    if(typeof FrostWave!=='undefined')FrostWave.prototype.draw=function(){const i=im(N('w21_glacial'));if(!i)return;const a=Math.max(0,1-(this.fade||0)),[x0,y0]=scr(this.x,this.y,0),[x1,y1]=scr(this.x+Math.cos(this.phi)*this.d,this.y+Math.sin(this.phi)*this.d,0),L=Math.hypot(x1-x0,y1-y0);if(L<4)return;
      const h=Math.max(30,this.half*1.2);ctx.save();ctx.globalAlpha=a;ctx.translate(x0,y0);ctx.rotate(Math.atan2(y1-y0,x1-x0));ctx.drawImage(i,0,-h/2,L,h);ctx.restore();ctx.globalAlpha=1;};
    if(typeof FrostPath!=='undefined')FrostPath.prototype.draw=function(){const i=im(N('w21_glacial'));if(!i)return;const a=c01((this.life-this.t)/.4)*c01(this.t/.15),[x0,y0]=scr(this.x,this.y,0),[x1,y1]=scr(this.x+Math.cos(this.phi)*this.len,this.y+Math.sin(this.phi)*this.len,0),L=Math.hypot(x1-x0,y1-y0);
      ctx.save();ctx.globalAlpha=a*.95;ctx.translate(x0,y0);ctx.rotate(Math.atan2(y1-y0,x1-x0));ctx.drawImage(i,0,-this.w*.6,L,this.w*1.2);ctx.restore();ctx.globalAlpha=1;};
    /* 2. watchers: rage, rune guard, banner, fenrir */
    const live=[];const watch=(test,mk)=>live.push({test,mk,on:null});
    watch(()=>!(window.FXED&&FXED.off('warFury'))&&hasBuff('warFury'),()=>add(new SPic({n:N('w07_rage'),x:player.x,y:player.y,w:110,ay:.9,follow:player,oy:2,sortOff:-4,life:99,a0:.75,pulse:.2,shadow:0,until:()=>!hasBuff('warFury')})));
    watch(()=>!(window.FXED&&FXED.off('runeGuard'))&&hasBuff('runeGuard'),()=>add(new GPic({n:N('w14_rune'),x:player.x,y:player.y,w:130,follow:player,life:99,a0:.85,breathe:.03,add:.2,until:()=>!hasBuff('runeGuard')})));
    watch(()=>!(window.FXED&&FXED.off('warBanner'))&&hasBuff('banner')&&window._wBAN,()=>{const B=window._wBAN;return add(new SPic({n:N('w20_banner'),obj:1,x:B.x,y:B.y,w:56,ay:.96,life:99,shadow:.3,pool:WC.gold,until:()=>!hasBuff('banner')||window._wBAN!==B}));});
    /* fenrir: the game's own FenrirSpirit companion (it attacks) stays, no extra picture */
    A({layer:'none',_v2:1,draw(){},update(){if(CHAR!=='wolf')return false;for(const w of live){const on=!!w.test();if(on&&!w.was)w.on=w.mk();w.was=on;}return true;}});
    /* 3. hits */
    const h0=hurt;let last=0;
    hurt=function(e,mult,o={}){const wasDead=e&&e.dead;const r=h0.apply(this,arguments);if(CHAR!=='wolf'||!e||wasDead||!r||(o&&o.dot))return r;
      const k=(o&&o.skill)||(o&&o.auto?'basic':null)||window.SKCTX||'basic';if(window.FXED&&FXED.off(k))return r;if(gameTime-last<.035&&!(o&&o.big))return r;last=gameTime;const z=(e.boss?40:26)+rnd(-6,8);
      if(!A_SET.has(k)){const th=/thunder|lightning|storm|tempest|ragnarok|runeStorm/i.test(k);add(new HPic({n:N(th?'y10_spear_burst':'x04_ice_hit'),x:e.x,y:e.y,e,w:(e.boss?66:48)*(o&&o.big?1.4:1),z,life:.24}));}
      else{add(new HPic({n:N(k==='savageRend'||(k==='axeDance'&&o&&o.big)?'x03_cross_slash':'w03_hitred'),x:e.x,y:e.y,e,w:(o&&o.big?80:56)*(e.boss?1.3:1),z,life:.22}));}
      return r;};
    /* 4. every swing on the real attack clip (basic + slash skills) → painted swing in time with the axe head */
    if(typeof spriteSlash==='function'){const ss=spriteSlash;spriteSlash=function(sq,k0,k1,k2,o){if(CHAR!=='wolf')return ss.apply(this,arguments);const key=player.action&&player.action.key;if(window.FXED&&FXED.off(key)){const sw=FXED.swing(key);if(!sw)return null;return pslash(sq,k1,Object.assign({},o||{},{art:sw.art,szMul:sw.size,rot:((o&&o.rot)||0)+(sw.rot||0)*DEG,alpha:sw.alpha,fade:sw.fade,editor:1}));}return pslash(sq,k1,o||{});};}
  }
  /* 5. per-skill moments at the contact time (+ a charge-up for longer wind-ups) */
  for(const k in AT){const sk=SKILLS[k]||(typeof CSK!=='undefined'&&CSK[k]);if(!sk||!sk.make||sk._wv2)continue;const mk=sk.make;sk._wv2=1;
    sk.make=function(c){const a=mk.apply(this,arguments);if(a&&a.events&&k==='iceBreak'&&a.seq&&!(window.FXED&&FXED.off(k))){let kh=0;while(kh<a.seq.length&&seqTimeAt(a.seq,kh+1)<=a.windup+1e-6)kh++;const sq=a.seq;a.events.push({t:seqTimeAt(sq,Math.max(0,kh-1)),f:()=>pslash(sq,kh,{W:20,art:'frost',grow:seqTimeAt(sq,kh+1)-seqTimeAt(sq,Math.max(0,kh-1)),fade:.2})});}if(a&&a.events&&!(window.FXED&&FXED.off(k))){const t=Math.max(.02,Math.min(a.windup||.02,(a.dur||1)-.02));if(t>=.12&&!(c&&c.gx!=null&&(SKILLS[k]||{}).type==='ground'))V.charge(A_SET.has(k)?WC.red:WC.ice,t);a.events.push({t,f:()=>{try{AT[k](c||{},a);}catch(e){console.error('wolf v2 '+k+': '+e);}}});}return a;};}
  /* painted skill icons (assets/icons/wolf/<key>.webp); a missing file keeps the old icon */
  if(typeof SKILL_ICON_ART!=='undefined'&&!window._wv2i){window._wv2i=1;const all=Object.assign({},SKILLS,typeof CSK!=='undefined'?CSK:{});
    for(const k in all){const sk=all[k];if(!sk||!sk.name)continue;const src='assets/icons/wolf/'+k+'.webp',ic=new Image();
      ic.onload=()=>{SKILL_ICON_ART[sk.name]=src;if(typeof renderSkillTree==='function'&&document.getElementById('skwin')&&document.getElementById('skwin').offsetParent)try{renderSkillTree();}catch(_){}};ic.src=src;}}
}
window.installWolfFx=install;
})();
