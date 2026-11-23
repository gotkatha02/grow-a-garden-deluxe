/* =====================================================================
   Toon code hats (owner 2026-11-23 11:24 'เจนภาพมาได้ไหมจะได้สวยๆ').
   There is no image model here, so these hats are DRAWN BY CODE on the 3D head frame of fashion.js
   (headFrame → COSTUME parts): every hat is a list of small 3D pieces (leaves, feathers, band
   segments, a medallion …) projected for the frame's direction and sorted by depth. Pieces behind
   the head (d < -6) are drawn before the sprite, so the head hides them — right in all 8 directions
   and on every animation frame, gently animated, no pictures to cut.
   Look = the game's cartoon style: flat 2–3 tones from a light at the upper left, dark-brown ink.
   Wardrobe items: FITEMS[id].hatKey (icon = the hat itself, rendered once by hatIcon()).
   ===================================================================== */
(function(){
'use strict';
if(typeof COSTUME==='undefined'||typeof FITEMS==='undefined'||typeof FINV==='undefined')return;
if(/[?&]toonhat=0/.test(location.search))return;   /* ?toonhat=0 = the old Aetherfall drawings (comparison) */
const TOON={};
const INK='#3b2314',PI=Math.PI,T2=PI*2;
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
const nrm=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l];};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const UP=[0,1,0];
/* light in view space (R = screen right, U = up, V = toward the camera): upper left, a little in front */
const LV=nrm([-.6,.6,.55]);
function view(H,n){return [-n[0]*H.ca+n[2]*H.sa,n[1],n[0]*H.sa+n[2]*H.ca];}
function shade(H,n){const v=view(H,n);return v[0]*LV[0]+v[1]*LV[1]+v[2]*LV[2];}
const tone=(c,k)=>k>.34?c[0]:k>-.14?c[1]:c[2];
const P=(H,p)=>H.proj(p[0],p[1],p[2]);
const avgD=pts=>pts.reduce((s,q)=>s+q[2],0)/pts.length;
function poly(pts){ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();}
function line(pts){ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));}
function ink(w){ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=INK;ctx.lineWidth=w;ctx.stroke();}
const SC=H=>H.sc||SPR;                       /* world px per atlas px (the icon renderer passes its own) */
function star(x,y,r,a){ctx.beginPath();for(let i=0;i<8;i++){const q=i*PI/4,rr=i%2?r*.28:r;ctx.lineTo(x+Math.cos(q)*rr,y+Math.sin(q)*rr);}ctx.closePath();ctx.globalAlpha=a;ctx.fill();ctx.globalAlpha=1;}

/* a blade-shaped piece (leaf / feather) lying along D, wide along W, profile wf(s) 0..1, length len;
   returns the projected outline (+W side out, −W side back) and the projected spine */
function blade(H,base,D,W,len,wid,wf,bulge,Nb){
  const m=9,A=[],B=[],S=[];
  for(let i=0;i<=m;i++){const s=i/m,w=wid*wf(s),b=bulge*Math.sin(PI*s),c=add(add(base,mul(D,len*s)),mul(Nb,b));
    S.push(P(H,c));A.push(P(H,add(c,mul(W,w))));B.push(P(H,add(c,mul(W,-w))));}
  return {out:[...A,...B.slice().reverse()],a:A,b:B,s:S};}

/* ------------------------------------------------------------------ golden laurel wreath (Greek, sits under the ears) */
const LEAF=s=>Math.pow(Math.sin(PI*Math.pow(s,.8)),.85)*(1-.18*s);
const GOLD=['#fff7c4','#ffd458','#d99a2b'],GOLD2=['#fff0a0','#f5c443','#c98a22'],RIB=['#ff8a78','#ec4a3c','#b52b2c'],VEIN='#a8651a';
TOON.laurel=(H,t)=>{
  const sc=SC(H),OL=4.2*sc,parts=[],cy=1,rx=60,rz=55,N=7;
  const ring=(ta,y)=>[Math.sin(ta)*rx,y,Math.cos(ta)*rz];
  for(const s of [-1,1]){
    const stem=[];
    for(let i=0;i<=N;i++){
      const u=i/N,ta=s*PI*(.95-.83*u),y=cy+(1-u)*2,p=ring(ta,y);stem.push(p);
      const T=nrm(add(ring(ta-s*.02,y),mul(p,-1))),No=nrm([Math.sin(ta)/rx,0,Math.cos(ta)/rz]);
      for(const sg of [1,-1]){
        if(sg<0&&i===N)continue;
        const uu=sg>0?u:u+.5/N,be=(sg>0?36:-30)*PI/180,len=(21-6*uu)*(sg>0?1:.9),wid=6.4-1.6*uu;
        const D=nrm(add(add(mul(T,Math.cos(be)),mul(UP,Math.sin(be))),mul(No,.16)));
        const W=nrm(cross(No,D)),base=add(ring(s*PI*(.95-.83*uu),cy+(1-uu)*2),mul(No,1.5));
        const L=blade(H,base,D,W,len,wid,LEAF,2.4,No),n=nrm(add(No,mul(UP,.5*sg)));
        const k=shade(H,n)+.12,wl=shade(H,W),pal=sg>0?GOLD:GOLD2,dark=wl>0?L.b:L.a,d=avgD(L.out)+(sg>0?.6:0);
        parts.push({d,f:()=>{if(GP==='fx')return;
          poly(L.out);ctx.fillStyle=tone(pal,k);ctx.fill();
          poly([...L.s,...dark.slice().reverse()]);ctx.fillStyle=tone(pal,k-.3);ctx.fill();
          line(L.s.slice(1,8));ctx.strokeStyle=k>-.1?'rgba(255,252,226,.9)':'rgba(255,236,170,.6)';ctx.lineWidth=OL*.34;ctx.lineCap='round';ctx.stroke();
          poly(L.out);ctx.lineJoin='round';ctx.strokeStyle=VEIN;ctx.lineWidth=OL*.5;ctx.stroke();}});
      }
    }
    for(let i=0;i<N;i++){const a=P(H,stem[i]),b=P(H,stem[i+1]);parts.push({d:(a[2]+b[2])/2-1,f:()=>{if(GP==='fx')return;
      ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.strokeStyle=VEIN;ctx.lineWidth=OL*.9;ctx.stroke();ctx.strokeStyle='#e0a83a';ctx.lineWidth=OL*.4;ctx.stroke();}});}
  }
  /* small red ribbon bow at the back of the head, short tails sway */
  const bk=[0,cy+1,-rz-2],sw=Math.sin(t*2.1)*2;
  for(const s of [-1,1]){
    const lp=[];for(let i=0;i<14;i++){const a=i/14*T2;lp.push(P(H,add(bk,[s*(7+Math.cos(a)*6),1.5+Math.sin(a)*4.2,-2-Math.abs(Math.sin(a))*1.2])));}
    const k=shade(H,nrm([s*.3,.4,-1]))+.2;
    parts.push({d:avgD(lp),f:()=>{if(GP==='fx')return;poly(lp);ctx.fillStyle=tone(RIB,k);ctx.fill();poly(lp);ink(OL*.6);}});
    const tl=[[s*1.5,0,0],[s*6+sw*.4,-14,-2],[s*8+sw,-22,-3],[s*5+sw,-19,-3],[s*2+sw*.6,-23,-3],[s*-1.5,-6,-1]].map(q=>P(H,add(bk,q)));
    parts.push({d:avgD(tl)-.5,f:()=>{if(GP==='fx')return;poly(tl);ctx.fillStyle=tone(RIB,k-.2);ctx.fill();poly(tl);ink(OL*.6);}});
  }
  const kn=[];for(let i=0;i<10;i++){const a=i/10*T2;kn.push(P(H,add(bk,[Math.cos(a)*3.2,1.5+Math.sin(a)*3.2,-3])));}
  parts.push({d:avgD(kn)+.3,f:()=>{if(GP==='fx')return;poly(kn);ctx.fillStyle=RIB[1];ctx.fill();poly(kn);ink(OL*.6);}});
  /* a soft glint that walks over the front leaves */
  const g=P(H,ring((((t*.35)%1)-.5)*1.6,cy+8));
  parts.push({d:60,f:()=>{if(GP==='body'||g[2]<10)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle='#fff6c8';star(g[0],g[1],6*sc,.75);ctx.restore();}});
  return parts;};

/* ------------------------------------------------------------------ quetzal feather crown (Aztec, fan behind the ears) */
const TURQ=['#5ff0dc','#1fb3a6','#0c6f6a'],JADE=['#7ff0b0','#2fbf86','#167050'],RED=['#ff8a6e','#e2473b','#9a2228'],
      FG=['#ffe58a','#f0b232','#a86b12'],NAVY=['#4b6fc4','#2c4690','#18275a'];
const FEATH=[TURQ,RED,FG,TURQ,NAVY,RED];
const FEAT=s=>s<.12?.25+s/.12*.35:Math.pow(Math.sin(PI*Math.min(1,.18+s*.86)),.7)*(s>.86?1-(s-.86)/.14*.55:1);
TOON.quetzalcrown=(H,t)=>{
  const sc=SC(H),OL=4.2*sc,parts=[],y0=-1,y1=15,rx=64,rz=59,SEG=30;
  const R=(a,y,o=0)=>[Math.sin(a)*(rx+o),y,Math.cos(a)*(rz+o)];
  /* headband: turquoise with gold rims and gold step studs */
  for(let i=0;i<SEG;i++){const a0=i/SEG*T2,a1=(i+1)/SEG*T2,am=(a0+a1)/2;
    const q=[R(a0,y0),R(a1,y0),R(a1,y1),R(a0,y1)].map(p=>P(H,p)),k=shade(H,nrm([Math.sin(am)/rx,0,Math.cos(am)/rz]));
    const tp=[R(a0,y1-3.2,.4),R(a1,y1-3.2,.4),R(a1,y1+.6,.4),R(a0,y1+.6,.4)].map(p=>P(H,p)),bt=[R(a0,y0-.6,.4),R(a1,y0-.6,.4),R(a1,y0+3,.4),R(a0,y0+3,.4)].map(p=>P(H,p));
    const st=i%2?null:[R(am-.07,(y0+y1)/2,.8),R(am,(y0+y1)/2+3.6,.8),R(am+.07,(y0+y1)/2,.8),R(am,(y0+y1)/2-3.6,.8)].map(p=>P(H,p));
    parts.push({d:avgD(q),f:()=>{if(GP==='fx')return;
      poly(q);ctx.fillStyle=tone(TURQ,k);ctx.fill();
      poly(tp);ctx.fillStyle=tone(FG,k);ctx.fill();poly(bt);ctx.fillStyle=tone(FG,k-.2);ctx.fill();
      if(st){poly(st);ctx.fillStyle=tone(FG,k+.1);ctx.fill();}
      ctx.lineCap='round';ctx.strokeStyle=INK;ctx.lineWidth=OL*.75;line([tp[3],tp[2]]);ctx.stroke();line([bt[0],bt[1]]);ctx.stroke();}});}
  /* feather fan rooted at the back of the band */
  const NF=11,c=(NF-1)/2;
  for(let i=0;i<NF;i++){
    const sg=(i-c)/c,ph=sg*1.08+Math.sin(t*1.6+i*.9)*.035,ta=PI-sg*.95;
    const root=R(ta,y1-3,-3),out=[Math.sin(ta),0,Math.cos(ta)],D=nrm([Math.sin(ph)*1.05,Math.cos(ph),-.32-.38*(1-Math.abs(sg))]);
    const W0=nrm(cross(D,nrm(add([0,0,1],mul(out,-.55))))),tw=(i%2?.5:-.5)+sg*.35,W=nrm(add(mul(W0,Math.cos(tw)),mul(cross(D,W0),Math.sin(tw)))),len=(98-30*Math.pow(Math.abs(sg),1.2))*(i%2?.9:1),wid=11.5-2.6*Math.abs(sg);
    const F=blade(H,root,D,W,len,wid,FEAT,0,[0,0,1]),pal=FEATH[Math.round(Math.abs(i-c))%FEATH.length];
    let n=nrm(cross(W,D));if(view(H,n)[2]<0)n=mul(n,-1);const k=shade(H,n)*.8+.12,tipPal=pal===FG?RED:FG,fo=Math.min(1,Math.abs(view(H,n)[2])*2.2),iw=OL*(.32+.5*fo);
    const cut=Math.round(F.a.length*.78),tipPts=[...F.a.slice(cut),...F.b.slice(cut).reverse()];
    parts.push({d:avgD(F.out)-2,f:()=>{if(GP==='fx')return;
      poly(F.out);ctx.fillStyle=tone(pal,k);ctx.fill();
      poly([...F.s,...F.b.slice().reverse()]);ctx.fillStyle=tone(pal,k-.38);ctx.globalAlpha=.55;ctx.fill();ctx.globalAlpha=1;
      poly(tipPts);ctx.fillStyle=tone(tipPal,k);ctx.fill();
      line(F.s.slice(0,8));ctx.strokeStyle='rgba(255,252,236,.9)';ctx.lineWidth=OL*.45;ctx.lineCap='round';ctx.stroke();
      poly(F.out);ink(iw);}});
  }
  /* sun medallion with a jade eye on the forehead */
  const cf=[0,(y0+y1)/2+2,rz+2.5],X=[1,0,0],ring=(r,n,o=0)=>{const o2=[];for(let i=0;i<n;i++){const a=i/n*T2+o;o2.push(P(H,add(cf,[Math.cos(a)*r,Math.sin(a)*r,0])));}return o2;};
  const kf=shade(H,[0,.15,1]),rim=ring(12.5,20),jade=ring(7.5,16),dot=ring(2.6,10),rays=[];
  for(let i=0;i<8;i++){const a=i/8*T2+PI/8,b=.24;rays.push([[Math.cos(a-b)*11.5,Math.sin(a-b)*11.5,0],[Math.cos(a)*18,Math.sin(a)*18,0],[Math.cos(a+b)*11.5,Math.sin(a+b)*11.5,0]].map(q=>P(H,add(cf,q))));}
  const front=P(H,cf)[2];
  parts.push({d:front+1,f:()=>{if(GP==='fx'||front<-30)return;
    for(const r of rays){poly(r);ctx.fillStyle=tone(FG,kf-.2);ctx.fill();poly(r);ink(OL*.7);}
    poly(rim);ctx.fillStyle=tone(FG,kf);ctx.fill();poly(rim);ink(OL*.8);
    poly(jade);ctx.fillStyle=tone(JADE,kf);ctx.fill();poly(jade);ink(OL*.6);
    poly(dot);ctx.fillStyle='#e9fff4';ctx.fill();}});
  parts.push({d:front+2,f:()=>{if(GP==='body'||front<0)return;const g=P(H,add(cf,[-3,3,1]));const a=.45+.45*Math.sin(t*2.4);
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle='#d8fff0';star(g[0],g[1],5.5*sc,a);ctx.restore();}});
  /* jade beads on the band sides */
  for(const a of [-1.15,1.15,-2.1,2.1]){const cb=R(a,(y0+y1)/2,1.2),pts=[];for(let i=0;i<10;i++){const q=i/10*T2;pts.push(P(H,add(cb,[Math.cos(q)*3.6*Math.cos(a),Math.sin(q)*3.6,-Math.cos(q)*3.6*Math.sin(a)])));}
    const k=shade(H,nrm([Math.sin(a),0,Math.cos(a)]));parts.push({d:avgD(pts)+.5,f:()=>{if(GP==='fx')return;poly(pts);ctx.fillStyle=tone(JADE,k);ctx.fill();poly(pts);ink(OL*.6);}});}
  return parts;};

/* ------------------------------------------------------------------ replace the old drawings of these wardrobe items (same ids, names, stats) */
const OLD={};
for(const id in TOON){OLD[id]=COSTUME[id];COSTUME[id]=TOON[id];if(FITEMS[id])FITEMS[id].hatKey=id;}
window.TOON_HATS={TOON,OLD};
const ICO={};
function hatIcon(key,px){const k=key+px;if(ICO[k])return ICO[k];
  const cv=document.createElement('canvas');cv.width=cv.height=px;const g=cv.getContext('2d'),yaw=28*PI/180,ca=Math.cos(yaw),sa=Math.sin(yaw),p=20*PI/180,cp=Math.cos(p),sp=Math.sin(p);
  const mk=(s,ox,oy)=>({ca,sa,face:ca,sc:s,proj:(lx,ly,lz)=>{const R=-lx*ca+lz*sa,V=lx*sa+lz*ca;return [ox+R*s,oy-(ly*cp-V*sp)*s,V];}});
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;const probe=mk(1,0,0),pr=probe.proj;
  probe.proj=(a,b,c)=>{const q=pr(a,b,c);x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);return q;};
  TOON[key](probe,0);
  const s=(px*.86)/Math.max(x1-x0,y1-y0),H=mk(s,px/2-(x0+x1)/2*s,px/2-(y0+y1)/2*s);
  const old=ctx,gp=GP;ctx=g;GP='all';try{for(const q of TOON[key](H,0).sort((a,b)=>a.d-b.d))q.f();}catch(e){}finally{ctx=old;GP=gp;}
  return ICO[k]=cv.toDataURL('image/png');}
window.hatIcon=hatIcon;
const _ii=itemIcon;
itemIcon=function(it,sz){if(it&&it.hatKey)return `<img src="${hatIcon(it.hatKey,48)}" width="${sz||24}" height="${sz||24}" style="vertical-align:middle">`;return _ii.apply(this,arguments);};
})();
