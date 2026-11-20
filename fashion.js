/* =====================================================================
   TOTEM LEGEND — fashion system (ported from Aetherfall v72, 2026-11-18)
   • Wolf only for now: head / weapon points (assets_fashion.js) and fur / skin masks are made for the wolf sprite.
   • Costume layer: fashion has its own slots (FEQ) and its own wardrobe list (FINV). It never replaces crafted gear
     in EQ; it only changes the look, plus small flat bonuses (piece bonus + full-set bonus) mapped to the 8 stats.
   • Saved per hero: af_fashion_<CHAR> (slots), af_fur_<CHAR> / af_skin_<CHAR> (colours).
   ===================================================================== */
/* ---------- fashion: headgear drawn on the tracked head point of every sprite frame ---------- */
const FASH_VIS={vikinghelm:'viking'};const fashImg={};
function fashImgOf(k,d){const key=k+d;let im=fashImg[key];if(!im){im=new Image();im.src=FASHION.items[k].img[d];fashImg[key]=im;}return im;}
function drawFashion(e,x,y){if(!window.FASHION||!e||GP==='fx')return;const k=FASH_VIS[FEQ.top];if(!k)return;const it=FASHION.items[k];
  const sd=srcDir(e.d),mir=isMir(e.d),tr=FASHION.head[e.st]&&FASHION.head[e.st][sd];if(!tr)return;const hp=tr[Math.min(e.f,tr.length-1)];
  const pv=SPR_META.pivot,o=it.off[sd]||[0,0];let hx=hp[0]+o[0];if(mir)hx=SPR_META.cell.w-hx;const hy=hp[1]+o[1];
  const im=fashImgOf(k,sd);if(!im.complete||!im.naturalWidth)return;const s=it.size*it.scale*SPR;
  ctx.save();ctx.translate(x+(hx-pv.x)*SPR,y+(hy-pv.y)*SPR);if(mir)ctx.scale(-1,1);ctx.drawImage(im,-s/2,-s/2,s,s);ctx.restore();}
/* ---------- gear visuals: ice wings (garment) + glacier axe (weapon skin) ---------- */
const GEAR_YAW={S:0,SE:45,E:90,NE:135,N:180,NW:225,W:270,SW:315};
const BACK_OFF={S:[0,78],SE:[-12,76],E:[-24,74],NE:[-12,74],N:[0,76]};
function gearCell(e){const sd=srcDir(e.d),mir=isMir(e.d);return {sd,mir,f:e.f};}
function c2s(cx,cy,x,y){const pv=SPR_META.pivot;return [x+(cx-pv.x)*SPR,y+(cy-pv.y)*SPR];}
function wingGeom(e,x,y,t,moving){
  const sd=srcDir(e.d),mir=isMir(e.d),tr=FASHION.head[e.st]&&FASHION.head[e.st][sd];if(!tr)return null;
  const hp=tr[Math.min(e.f,tr.length-1)],bo=BACK_OFF[sd]||[0,62];let ax=hp[0]+bo[0];if(mir)ax=SPR_META.cell.w-ax;const ay=hp[1]+bo[1];
  const [sx0,sy0]=c2s(ax,ay,x,y);const a=(GEAR_YAW[e.d]||0)*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),p=24*Math.PI/180,cp=Math.cos(p),sp=Math.sin(p);
  const proj=(lx,ly,lz)=>{const R=-lx*ca+lz*sa,V=lx*sa+lz*ca;return [sx0+R*SPR,sy0-(ly*cp-V*sp)*SPR,V];};
  const body=proj(0,0,16)[2];
  const sp2=moving?9:3.2,amp=moving?.32:.16,ph=Math.sin(t*sp2);
  const wings=[];
  for(const side of [-1,1]){
    const phi=.22+amp*ph,tau=.18,uo=[side*Math.cos(phi),0,-Math.sin(phi)],vu=[0,Math.cos(tau),-Math.sin(tau)],root=[side*9,4,-14];
    const P=(u,v)=>proj(root[0]+uo[0]*u+vu[0]*v,root[1]+uo[1]*u+vu[1]*v,root[2]+uo[2]*u+vu[2]*v);
    const TH=[-30,-10,10,30,50,70,88],L=[96,140,184,214,206,170,118],W=[14,17,20,22,21,18,14],sh=[];
    for(let i=0;i<TH.length;i++){const th=TH[i]*Math.PI/180+ph*.05*(i-2),dx=Math.cos(th),dy=Math.sin(th),px=-dy,py=dx,l=L[i],w=W[i];
      sh.push({pts:[P(dx*10,dy*10),P(dx*l*.42+px*w,dy*l*.42+py*w),P(dx*l*.8+px*w*.4,dy*l*.8+py*w*.4),P(dx*l,dy*l),P(dx*l*.8-px*w*.35,dy*l*.8-py*w*.35),P(dx*l*.42-px*w,dy*l*.42-py*w)],tip:P(dx*l,dy*l),root:P(dx*10,dy*10),i});}
    const mem=[P(0,0),...TH.map((d,i)=>{const th=d*Math.PI/180,l=L[i]*.86;return P(Math.cos(th)*l,Math.sin(th)*l);})];
    const dep=sh.reduce((s,o)=>s+o.tip[2],0)/sh.length;
    wings.push({sh,mem,front:dep>body,dep});}
  return wings;}
function drawWing(w,t){
  ctx.save();ctx.lineJoin='round';
  if(GP!=='fx'){
  ctx.globalAlpha*=.32;ctx.fillStyle='#bfe9ff';ctx.beginPath();w.mem.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.fill();ctx.globalAlpha/=.32;
  const order=w.sh.slice().sort((a,b)=>a.tip[2]-b.tip[2]);
  for(const s of order){const g=ctx.createLinearGradient(s.root[0],s.root[1],s.tip[0],s.tip[1]);g.addColorStop(0,'rgba(110,190,245,.82)');g.addColorStop(.55,'rgba(190,236,255,.9)');g.addColorStop(1,'rgba(245,253,255,.97)');
    ctx.fillStyle=g;ctx.beginPath();s.pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.fill();}
  for(const s of order){ctx.strokeStyle='rgba(28,72,124,.9)';ctx.lineWidth=.9;ctx.beginPath();s.pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(s.root[0],s.root[1]);ctx.lineTo(s.tip[0],s.tip[1]);ctx.stroke();}
  }if(GP!=='body'){ctx.globalCompositeOperation='lighter';
  for(const s of w.sh){const k=.5+.5*Math.sin(t*3.1+s.i*1.7);if(k<.35)continue;const [qx,qy]=s.tip,r=(.8+1.3*k);ctx.fillStyle=`rgba(200,240,255,${.5*k})`;
    ctx.beginPath();ctx.moveTo(qx,qy-r*2);ctx.lineTo(qx+r*.4,qy-r*.4);ctx.lineTo(qx+r*2,qy);ctx.lineTo(qx+r*.4,qy+r*.4);ctx.lineTo(qx,qy+r*2);ctx.lineTo(qx-r*.4,qy+r*.4);ctx.lineTo(qx-r*2,qy);ctx.lineTo(qx-r*.4,qy-r*.4);ctx.closePath();ctx.fill();}}
  ctx.restore();}
function drawGlacierAxe(e,x,y,t){
  const sd=srcDir(e.d),mir=isMir(e.d),tr=FASHION.axe[e.st]&&FASHION.axe[e.st][sd];if(!tr)return;const s=tr[Math.min(e.f,tr.length-1)];
  let [hx,hy,gx,gy]=s;if(mir){hx=SPR_META.cell.w-hx;gx=SPR_META.cell.w-gx;}
  let ux=hx-gx,uy=hy-gy;const ul=Math.hypot(ux,uy)||1;ux/=ul;uy/=ul;const nx=-uy,ny=ux;
  const cx=hx+ux*12,cy=hy+uy*12;const P=(a,b)=>c2s(cx+ux*a+nx*b,cy+uy*a+ny*b,x,y);
  ctx.save();ctx.lineJoin='round';
  if(GP!=='fx'){
  const [g0x,g0y]=c2s(gx-ux*10,gy-uy*10,x,y),[h0x,h0y]=c2s(hx,hy,x,y);ctx.strokeStyle='rgba(170,230,255,.55)';ctx.lineWidth=3.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(g0x,g0y);ctx.lineTo(h0x,h0y);ctx.stroke();}
  const [ccx,ccy]=P(0,0),pul=.75+.25*Math.sin(t*4);if(GP!=='body'){ctx.globalCompositeOperation='lighter';const gr=ctx.createRadialGradient(ccx,ccy,0,ccx,ccy,34*SPR*1.6);
  gr.addColorStop(0,`rgba(150,225,255,${.24*pul})`);gr.addColorStop(1,'rgba(150,225,255,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(ccx,ccy,34*SPR*1.6,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';}
  if(GP!=='fx'){
  const bit=sg=>[[-7,4*sg],[-13,15*sg],[-27,29*sg],[-40,42*sg],[-30,50*sg],[-21,53*sg],[-12,59*sg],[-2,56*sg],[6,61*sg],[16,55*sg],[27,52*sg],[40,42*sg],[27,29*sg],[13,15*sg],[7,4*sg]].map(([a,b])=>P(a,b));
  const shapes=[bit(1),bit(-1),[P(-14,-8),P(22,-6),P(46,0),P(22,6),P(-14,8)]];
  for(const pts of shapes){const g=ctx.createLinearGradient(...P(0,0),...pts[Math.floor(pts.length/2)]);g.addColorStop(0,'rgba(240,252,255,.95)');g.addColorStop(.6,'rgba(160,220,255,.9)');g.addColorStop(1,'rgba(90,170,240,.88)');
    ctx.fillStyle=g;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.fill();}
  for(const pts of shapes){ctx.strokeStyle='rgba(24,66,118,.95)';ctx.lineWidth=1;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=.7;const c0=P(0,0);for(let i=2;i<pts.length-1;i+=3){ctx.beginPath();ctx.moveTo(...c0);ctx.lineTo(...pts[i]);ctx.stroke();}}
  // core gem
  const [kx,ky]=P(0,0);ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(kx,ky,1.1,0,TAU);ctx.fill();}
  if(GP!=='body'){ctx.globalCompositeOperation='lighter';
  for(let i=0;i<6;i++){const ph=(t*.7+i/6)%1,an=i*2.4+t*.6,[px,py]=P(Math.cos(an)*30,Math.sin(an)*44);const k=Math.sin(ph*Math.PI);ctx.fillStyle=`rgba(210,245,255,${.55*k})`;
    const r=.6+1.1*k;ctx.beginPath();ctx.moveTo(px,py-r*1.8);ctx.lineTo(px+r*.35,py);ctx.lineTo(px,py+r*1.8);ctx.lineTo(px-r*.35,py);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(px-r*1.8,py);ctx.lineTo(px,py+r*.35);ctx.lineTo(px+r*1.8,py);ctx.lineTo(px,py-r*.35);ctx.closePath();ctx.fill();}}
  ctx.restore();}
/* ---------- Seraph Wings: layered golden feather wings (3D-projected, flaps) ---------- */
function seraphGeom(e,x,y,t,moving){
  const sd=srcDir(e.d),mir=isMir(e.d),tr=FASHION.head[e.st]&&FASHION.head[e.st][sd];if(!tr)return null;
  const hp=tr[Math.min(e.f,tr.length-1)],bo=BACK_OFF[sd]||[0,76];let ax=hp[0]+bo[0];if(mir)ax=SPR_META.cell.w-ax;const ay=hp[1]+bo[1]-6;
  const [sx0,sy0]=c2s(ax,ay,x,y);const a=(GEAR_YAW[e.d]||0)*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),p=24*Math.PI/180,cp=Math.cos(p),sp=Math.sin(p);
  const proj=(lx,ly,lz)=>{const R=-lx*ca+lz*sa,V=lx*sa+lz*ca;return [sx0+R*SPR,sy0-(ly*cp-V*sp)*SPR,V];};
  const body=proj(0,0,16)[2],ph=Math.sin(t*(moving?6:2.4)),amp=moving?.22:.1;
  const bez=(q,tt)=>{const m=1-tt;return [m*m*m*q[0][0]+3*m*m*tt*q[1][0]+3*m*tt*tt*q[2][0]+tt*tt*tt*q[3][0],m*m*m*q[0][1]+3*m*m*tt*q[1][1]+3*m*tt*tt*q[2][1]+tt*tt*tt*q[3][1]];};
  const lift=ph*6;const BONE=[[6,-6],[22,112+lift],[78,152+lift*1.5],[132,128+lift*2.2]];
  const wings=[];
  for(const side of [-1,1]){
    const phi=.46+amp*ph,tau=.1,uo=[side*Math.cos(phi),0,-Math.sin(phi)],vu=[0,Math.cos(tau),-Math.sin(tau)],root=[side*8,0,-14];
    const P=(u,v)=>{u*=SER_S;v*=SER_S;if(SER_ROT){const c=Math.cos(SER_ROT),sn=Math.sin(SER_ROT),u2=u*c-v*sn;v=u*sn+v*c;u=u2;}return proj(root[0]+uo[0]*u+vu[0]*v,root[1]+vu[1]*v,root[2]+uo[2]*u+vu[2]*v);};
    const feather=(t0,ang,len,wid,lay)=>{const [bu,bv]=bez(BONE,t0),dx=Math.cos(ang),dy=Math.sin(ang),px=-dy,py=dx,L=[],R=[];
      for(let i=0;i<=7;i++){const s=i/7,w=wid*Math.sqrt(Math.max(0,1-s*s*s))*(.5+.5*Math.min(1,s*3));const cu=bu+dx*len*s,cv=bv+dy*len*s;L.push(P(cu+px*w,cv+py*w));R.push(P(cu-px*w,cv-py*w));}
      return {pts:[...L,...R.reverse()],base:P(bu,bv),tip:P(bu+dx*len,bv+dy*len),lay};};
    const F=[],D=Math.PI/180,wig=ph*.03;
    for(let i=0;i<7;i++){const k=i/6;F.push(feather(.58+.42*k,(-96+50*k)*D+wig*(1+k),150+30*Math.sin(Math.PI*k*.7),21,0));}       // primaries
    for(let i=0;i<7;i++){const k=i/6;F.push(feather(.06+.54*k,(-100+8*k)*D+wig,92+56*k,20,1));}                            // secondaries
    for(let i=0;i<9;i++){const k=i/8;F.push(feather(.06+.9*k,(-98+40*k*k)*D+wig*.6,60+26*Math.sin(Math.PI*k),19,2));}      // greater coverts
    for(let i=0;i<11;i++){const k=i/10;F.push(feather(.03+.95*k,(-94+40*k*k)*D,32+10*Math.sin(Math.PI*k),16,3));}              // lesser coverts
    const bone=[];for(let i=0;i<=16;i++)bone.push(P(...bez(BONE,i/16)));
    {const st=WGROW.pv!=null?WGROW.pv:wingStage(),kf=st===0?3:st===1?2:st===2?1:0;for(let q=F.length-1;q>=0;q--)if(F[q].lay<kf)F.splice(q,1);if(!F.some(f=>f.lay===0))F.push(...F.filter(f=>f.lay===Math.min(...F.map(z=>z.lay))).slice(0,1).map(f=>({...f,lay:0,_g:1})));}
    const dep=F.filter(f=>f.lay===0).reduce((s2,f)=>s2+f.tip[2],0)/7;
    wings.push({F,bone,front:dep>body,dep,pal:SER_PAL});}
  return wings;}
function foldedGeom(e,x,y,t,moving){
  const sd=srcDir(e.d),mir=isMir(e.d),tr=FASHION.head[e.st]&&FASHION.head[e.st][sd];if(!tr)return null;
  const hp=tr[Math.min(e.f,tr.length-1)],bo=BACK_OFF[sd]||[0,76];let ax=hp[0]+bo[0];if(mir)ax=SPR_META.cell.w-ax;const ay=hp[1]+bo[1]-14;
  const [sx0,sy0]=c2s(ax,ay,x,y);const a=(GEAR_YAW[e.d]||0)*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),p=24*Math.PI/180,cp=Math.cos(p),sp=Math.sin(p);
  const proj=(lx,ly,lz)=>{const R=-lx*ca+lz*sa,V=lx*sa+lz*ca;return [sx0+R*SPR,sy0-(ly*cp-V*sp)*SPR,V];};
  const body=proj(0,0,16)[2],ph=Math.sin(t*(moving?5:1.8)),amp=moving?.08:.035;
  const bez=(q,tt)=>{const m=1-tt;return [m*m*m*q[0][0]+3*m*m*tt*q[1][0]+3*m*tt*tt*q[2][0]+tt*tt*tt*q[3][0],m*m*m*q[0][1]+3*m*m*tt*q[1][1]+3*m*tt*tt*q[2][1]+tt*tt*tt*q[3][1]];};
  const lift=ph*2;const BONE=[[4,-2],[14,30+lift],[40,44+lift],[60,30+lift*1.5]];
  const wings=[];
  for(const side of [-1,1]){
    const phi=.62+amp*ph,tau=.05,uo=[side*Math.cos(phi),0,-Math.sin(phi)],vu=[0,Math.cos(tau),-Math.sin(tau)],root=[side*8,0,-14];
    const P=(u,v)=>proj(root[0]+uo[0]*u+vu[0]*v,root[1]+vu[1]*v,root[2]+uo[2]*u+vu[2]*v);
    const feather=(t0,ang,len,wid,lay)=>{const [bu,bv]=bez(BONE,t0),dx=Math.cos(ang),dy=Math.sin(ang),px=-dy,py=dx,L=[],R=[];
      for(let i=0;i<=7;i++){const s=i/7,w=wid*Math.sqrt(Math.max(0,1-s*s*s))*(.5+.5*Math.min(1,s*3));const cu=bu+dx*len*s,cv=bv+dy*len*s;L.push(P(cu+px*w,cv+py*w));R.push(P(cu-px*w,cv-py*w));}
      return {pts:[...L,...R.reverse()],base:P(bu,bv),tip:P(bu+dx*len,bv+dy*len),lay};};
    const F=[],D=Math.PI/180,wig=ph*.03;
    for(let i=0;i<7;i++){const k=i/6;F.push(feather(.45+.55*k,(-96+22*k)*D+wig*(1+k),196+10*Math.sin(Math.PI*k),17,0));}       // primaries
    for(let i=0;i<7;i++){const k=i/6;F.push(feather(.08+.7*k,(-98+16*k)*D+wig,150+26*k,17,1));}                            // secondaries
    for(let i=0;i<8;i++){const k=i/7;F.push(feather(.06+.9*k,(-97+20*k)*D+wig*.6,104+16*Math.sin(Math.PI*k),16,2));}      // greater coverts
    for(let i=0;i<9;i++){const k=i/8;F.push(feather(.03+.95*k,(-95+24*k)*D,58+10*Math.sin(Math.PI*k),15,3));}              // lesser coverts
    const bone=[];for(let i=0;i<=16;i++)bone.push(P(...bez(BONE,i/16)));
    const dep=F.filter(f=>f.lay===0).reduce((s2,f)=>s2+f.tip[2],0)/7;
    wings.push({F,bone,front:dep>body,dep,pal:FOLD_COL});}
  return wings;}
const SER_COL=[['#b47a2a','#efc868','#fff2cc'],['#c0882f','#f3d27a','#fff5d6'],['#cc9338','#f7da88','#fff8e2'],['#d9a244','#fbe39c','#fffbef']];
const FOLD_COL=[['#a2601c','#d9a352','#f7e0ac'],['#b06c26','#e2b264','#f9e8c0'],['#be7c36','#eac07a','#fbefd0'],['#cc904c','#f0d092','#fdf5e2']];
function drawSeraph(w,t){
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  if(GP!=='fx'){
  for(let lay=0;lay<4;lay++){const c=(w.pal||SER_COL)[lay];
    for(const f of w.F){if(f.lay!==lay)continue;const g=ctx.createLinearGradient(f.base[0],f.base[1],f.tip[0],f.tip[1]);g.addColorStop(0,c[0]);g.addColorStop(.45,c[1]);g.addColorStop(1,c[2]);
      ctx.fillStyle=g;ctx.beginPath();f.pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(112,66,22,.85)';ctx.lineWidth=.65;ctx.stroke();
      ctx.strokeStyle='rgba(255,246,214,.55)';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(f.base[0],f.base[1]);const m=f.pts[Math.floor(f.pts.length/2)];ctx.lineTo((f.tip[0]*3+m[0])/4,(f.tip[1]*3+m[1])/4);ctx.stroke();}}
  // leading-edge arch (wing bone)
  ctx.beginPath();w.bone.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));
  ctx.strokeStyle='rgba(112,66,22,.9)';ctx.lineWidth=12*SPR*1.15;ctx.stroke();ctx.strokeStyle=(w.pal||SER_COL)[3][1];ctx.lineWidth=12*SPR*.8;ctx.stroke();ctx.strokeStyle='rgba(255,248,220,.8)';ctx.lineWidth=12*SPR*.28;ctx.stroke();
  }
  if(GP!=='body'){ctx.globalCompositeOperation='lighter';const k=.5+.5*Math.sin(t*2.2),q=w.bone[11];const gr=ctx.createRadialGradient(q[0],q[1],0,q[0],q[1],60*SPR);gr.addColorStop(0,`rgba(255,220,140,${.08+.06*k})`);gr.addColorStop(1,'rgba(255,220,140,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(q[0],q[1],60*SPR,0,TAU);ctx.fill();}
  ctx.restore();}
let _gearB=null,_gearW=null,_gearC=null,GP='all',SER_S=1,SER_PAL=null,SER_ROT=0;
const WHITE_COL=[['#9aa0b4','#dfe2ee','#ffffff'],['#a8aec2','#e8eaf4','#ffffff'],['#b6bccc','#eef0f8','#ffffff'],['#c4c8d6','#f4f5fa','#ffffff']];
/* ---------- RO-style costume headgear (top / mid / low) — 3D head frame, depth-split parts ---------- */
const HEAD_OFF={S:[0,0],SE:[4,0],E:[9,0],NE:[2,0],N:[0,0]};
function headFrame(e,x,y){
  const sd=srcDir(e.d),mir=isMir(e.d),tr=FASHION.head[e.st]&&FASHION.head[e.st][sd];if(!tr)return null;
  const hp=tr[Math.min(e.f,tr.length-1)],ho=HEAD_OFF[sd]||[0,0];let ax=hp[0]+ho[0];if(mir)ax=SPR_META.cell.w-ax;const ay=hp[1]+ho[1];
  const [sx0,sy0]=c2s(ax,ay,x,y);const a=(GEAR_YAW[e.d]||0)*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),p=20*Math.PI/180,cp=Math.cos(p),sp=Math.sin(p);
  const proj=(lx,ly,lz)=>{const R=-lx*ca+lz*sa,V=lx*sa+lz*ca;return [sx0+R*SPR,sy0-(ly*cp-V*sp)*SPR,V];};
  return {proj,ca,sa,face:ca};}
const cpoly=(pts)=>{ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();};
const avgD=pts=>pts.reduce((s,q)=>s+q[2],0)/pts.length;
function lgrad(a,b,stops){const g=ctx.createLinearGradient(a[0],a[1],b[0],b[1]);stops.forEach((c,i)=>g.addColorStop(i/(stops.length-1),c));return g;}
function bez3(P,t){const m=1-t;return [0,1,2].map(k=>m*m*m*P[0][k]+3*m*m*t*P[1][k]+3*m*t*t*P[2][k]+t*t*t*P[3][k]);}
/* tapered tube along a 3D bezier -> screen polygon */
function tube(H,P,r0,r1,n=12){const c=[];for(let i=0;i<=n;i++){const q=bez3(P,i/n);c.push(H.proj(...q));}
  const L=[],R=[];for(let i=0;i<=n;i++){const a=c[Math.max(0,i-1)],b=c[Math.min(n,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;const r=(r0+(r1-r0)*i/n)*SPR;L.push([c[i][0]-dy*r,c[i][1]+dx*r]);R.push([c[i][0]+dy*r,c[i][1]-dx*r]);}
  return {pts:[...L,...R.reverse()],c,d:avgD(c)};}
function ring3(H,cy,rx,rz,n,y2){const o=[];for(let i=0;i<n;i++){const a=i/n*TAU;o.push(H.proj(Math.cos(a)*rx,cy+(y2?y2(a):0),Math.sin(a)*rz));}return o;}
const COSTUME={
  halo:(H,t)=>{const pts=ring3(H,80+Math.sin(t*2)*3,38,38,32);return [{d:99,f:()=>{
    if(GP!=='fx'){ctx.lineJoin='round';cpoly(pts);ctx.strokeStyle='#c98a1c';ctx.lineWidth=8*SPR;ctx.stroke();ctx.strokeStyle='#ffe58a';ctx.lineWidth=5*SPR;ctx.stroke();ctx.strokeStyle='#fffbe0';ctx.lineWidth=1.6*SPR;ctx.stroke();}
    if(GP!=='body'){ctx.globalCompositeOperation='lighter';cpoly(pts);ctx.strokeStyle='rgba(255,220,120,.28)';ctx.lineWidth=16*SPR;ctx.stroke();ctx.globalCompositeOperation='source-over';}}}];},
  devilhorns:(H)=>[-1,1].map(s=>{const T=tube(H,[[s*24,42,8],[s*38,62,12],[s*54,74,6],[s*48,100,-4]],15,1.4);return {d:T.d,f:()=>{if(GP==='fx')return;
    ctx.fillStyle=lgrad(T.c[0],T.c[T.c.length-1],['#5a0c12','#a8202a','#f0705a']);cpoly(T.pts);ctx.fill();
    ctx.strokeStyle='rgba(255,200,180,.55)';ctx.lineWidth=1.2*SPR*3;ctx.beginPath();T.c.slice(2,9).forEach((q,i)=>i?ctx.lineTo(q[0]-1.5*SPR,q[1]):ctx.moveTo(q[0]-1.5*SPR,q[1]));ctx.stroke();}};}),
  bunnyband:(H,t)=>[-1,1].map(s=>{const fl=s>0?1:0,w=Math.sin(t*2.2+s)*4;
    const P=fl?[[s*16,48,-6],[s*22,110,-10],[s*44,150+w,-8],[s*86,128+w,0]]:[[s*16,48,-6],[s*18,110,-10],[s*24+w,150,-12],[s*30+w,176,-14]];
    const O=tube(H,P,15,10,14),I=tube(H,P,7,4,14);return {d:O.d,f:()=>{if(GP==='fx')return;
    ctx.fillStyle=lgrad(O.c[0],O.c[14],['#d8cfd6','#ffffff','#f4eef2']);cpoly(O.pts);ctx.fill();
    if(H.face>-.3){ctx.fillStyle=lgrad(I.c[0],I.c[14],['#e98aa2','#f6b6c6']);cpoly(I.pts.slice(0));ctx.globalAlpha*=.9;ctx.fill();ctx.globalAlpha/=.9;}}};}),
  crown:(H,t)=>{const n=20,R=34,parts=[];const B=ring3(H,50,R,R,n),T=ring3(H,64,R,R,n),S=ring3(H,64,R+.5,R+.5,n,a=>{const k=(a/TAU*10)%2;return k<1?28*k:28*(2-k);});
    for(let i=0;i<n;i++){const j=(i+1)%n,q=[B[i],B[j],S[j],S[i]],d=avgD(q);parts.push({d,f:()=>{if(GP==='fx')return;
      const lit=.5+.5*Math.cos(i/n*TAU+.6);ctx.fillStyle=`rgb(${200+50*lit|0},${150+70*lit|0},${40+50*lit|0})`;cpoly(q);ctx.fill();
      if(i%4===1){const g=S[i];ctx.fillStyle=i%8===1?'#e0304a':'#3a7ae8';ctx.beginPath();ctx.arc((B[i][0]+T[i][0])/2,(B[i][1]+T[i][1])/2,2.8*SPR*3,0,TAU);ctx.fill();}}});}
    return parts;},
  witchhat:(H,t)=>{const br=ring3(H,44,76,74,36),base=ring3(H,50,42,42,24),sw=Math.sin(t*1.6)*6,apex=H.proj(16+sw,212,-30),bend=H.proj(4,150,-14);
    const back=br.filter(q=>q[2]<0),front=br.filter(q=>q[2]>=0),c=H.proj(0,44,0);
    const disk=()=>{cpoly(br);ctx.fillStyle=lgrad(H.proj(0,44,-70),H.proj(0,44,70),['#2e1d4e','#4a2e78','#6a46a0']);ctx.fill();};
    const cone=()=>{const L=base.slice().sort((a,b)=>a[0]-b[0]);const l=L[0],r=L[L.length-1];
      ctx.beginPath();ctx.moveTo(l[0],l[1]);ctx.quadraticCurveTo(bend[0]-14*SPR,bend[1],apex[0],apex[1]);ctx.quadraticCurveTo(bend[0]+12*SPR,bend[1]+8*SPR,r[0],r[1]);
      base.filter(q=>q[2]>=0).sort((a,b)=>b[0]-a[0]).forEach(q=>ctx.lineTo(q[0],q[1]));ctx.closePath();ctx.fillStyle=lgrad(l,r,['#3a2462','#6c48a4','#4a2e7c']);ctx.fill();
      const b1=ring3(H,52,43,43,24).filter(q=>q[2]>=-4).sort((a,b)=>a[0]-b[0]),b2=ring3(H,62,40,40,24).filter(q=>q[2]>=-4).sort((a,b)=>b[0]-a[0]);
      cpoly([...b1,...b2]);ctx.fillStyle='#d9a63a';ctx.fill();
      const bk=ring3(H,57,43,43,24).reduce((m,q)=>q[2]>m[2]?q:m);ctx.fillStyle='#f6e2a0';ctx.fillRect(bk[0]-3*SPR*2,bk[1]-3*SPR*2,6*SPR*2,6*SPR*2);};
    return [{d:-60,f:()=>{if(GP!=='fx')disk();}},{d:30,f:()=>{if(GP!=='fx')cone();}}];},
  bigribbon:(H,t)=>{const k=H.proj(0,54,-38),fl=Math.sin(t*2.4)*3;
    const loop=s=>[k,H.proj(s*34,92+fl,-30),H.proj(s*72,84+fl,-58),H.proj(s*66,50,-62),H.proj(s*30,44,-44)];
    const tail=s=>[H.proj(s*6,46,-40),H.proj(s*30,0,-46),H.proj(s*22,-34+fl,-48),H.proj(s*40,-30+fl,-46),H.proj(s*14,44,-40)];
    const pts=[loop(-1),loop(1),tail(-1),tail(1)],d=k[2];
    return [{d,f:()=>{if(GP==='fx')return;for(const q of pts){ctx.fillStyle=lgrad(k,q[2],['#a8182c','#e23a4c','#ff7a84']);cpoly(q);ctx.fill();ctx.strokeStyle='rgba(120,10,24,.6)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(k[0],k[1]);ctx.lineTo(q[2][0],q[2][1]);ctx.stroke();}
      ctx.fillStyle='#c0203a';ctx.beginPath();ctx.arc(k[0],k[1],9*SPR,0,TAU);ctx.fill();ctx.fillStyle='rgba(255,180,190,.8)';ctx.beginPath();ctx.arc(k[0]-2*SPR,k[1]-2*SPR,3*SPR,0,TAU);ctx.fill();}}];},
  flowerpin:(H,t)=>{const c=H.proj(-50,34,12);return [{d:c[2],f:()=>{if(GP==='fx')return;const r=10*SPR,sw=Math.sin(t*1.8)*.15;
    for(let i=0;i<5;i++){const a=i/5*TAU+sw,px=c[0]+Math.cos(a)*r*1.15,py=c[1]+Math.sin(a)*r*1.15;ctx.fillStyle=lgrad([c[0],c[1]],[px+Math.cos(a)*r,py+Math.sin(a)*r],['#c8203c','#ff5a6e','#ffc0c8']);ctx.beginPath();ctx.ellipse(px,py,r*1.05,r*.8,a,0,TAU);ctx.fill();}
    ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.arc(c[0],c[1],r*.55,0,TAU);ctx.fill();
    const lf=H.proj(-60,22,4);ctx.fillStyle='#4a9a3a';ctx.beginPath();ctx.ellipse(lf[0],lf[1],r*1.1,r*.45,.6,0,TAU);ctx.fill();}}];},
  shades:(H)=>{if(H.face<-.25)return [];const lens=s=>{const o=[];for(let i=0;i<16;i++){const a=i/16*TAU;o.push(H.proj(s*22+Math.cos(a)*14,-24+Math.sin(a)*(Math.sin(a)>0?7:10),52-Math.abs(Math.cos(a))*3));}return o;};
    const L=lens(-1),R=lens(1),b1=H.proj(-8,-22,54),b2=H.proj(8,-22,54),a1=H.proj(-36,-20,34),a2=H.proj(36,-20,34),a3=H.proj(-50,-18,0),a4=H.proj(50,-18,0);
    return [{d:60,f:()=>{if(GP==='fx')return;ctx.lineCap='round';ctx.strokeStyle='#15131c';ctx.lineWidth=2.6*SPR*3;
      ctx.beginPath();ctx.moveTo(b1[0],b1[1]);ctx.lineTo(b2[0],b2[1]);if(H.face<.9){ctx.moveTo(a1[0],a1[1]);ctx.lineTo(a3[0],a3[1]);ctx.moveTo(a2[0],a2[1]);ctx.lineTo(a4[0],a4[1]);}ctx.stroke();
      for(const q of [L,R]){if(avgD(q)<0)continue;ctx.fillStyle=lgrad(q[12],q[4],['#101018','#2a2a3e','#4a4a66']);cpoly(q);ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.4*SPR*3;ctx.beginPath();ctx.moveTo(q[10][0],q[10][1]);ctx.lineTo(q[13][0],q[13][1]);ctx.stroke();}}}];},
  pipe:(H,t)=>{if(H.face<-.3)return [];const s0=H.proj(8,-42,46),s1=H.proj(30,-52,62),b0=H.proj(32,-56,64),b1=H.proj(36,-34,66);
    return [{d:62,f:()=>{if(GP!=='fx'){ctx.lineCap='round';ctx.strokeStyle='#3a2414';ctx.lineWidth=4*SPR*1.6;ctx.beginPath();ctx.moveTo(s0[0],s0[1]);ctx.lineTo(s1[0],s1[1]);ctx.stroke();
      ctx.fillStyle=lgrad(b0,b1,['#5a3418','#9a6230']);ctx.beginPath();ctx.moveTo(b0[0]-6*SPR,b0[1]);ctx.lineTo(b1[0]-7*SPR,b1[1]);ctx.lineTo(b1[0]+7*SPR,b1[1]);ctx.lineTo(b0[0]+6*SPR,b0[1]);ctx.closePath();ctx.fill();}
      if(GP!=='body'){for(let i=0;i<4;i++){const k=((t*.5+i/4)%1);ctx.fillStyle=`rgba(230,230,240,${.35*(1-k)})`;ctx.beginPath();ctx.arc(b1[0]+Math.sin(k*6+i)*6*SPR,b1[1]-k*60*SPR,(4+10*k)*SPR,0,TAU);ctx.fill();}}}}];},
};
/* bat wings (garment) — membrane + finger bones in the same back-plane rig as the other wings */
function batGeom(e,x,y,t,moving){
  const sd=srcDir(e.d),mir=isMir(e.d),tr=FASHION.head[e.st]&&FASHION.head[e.st][sd];if(!tr)return null;
  const hp=tr[Math.min(e.f,tr.length-1)],bo=BACK_OFF[sd]||[0,76];let ax=hp[0]+bo[0];if(mir)ax=SPR_META.cell.w-ax;const ay=hp[1]+bo[1]-10;
  const [sx0,sy0]=c2s(ax,ay,x,y);const a=(GEAR_YAW[e.d]||0)*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),p=24*Math.PI/180,cp=Math.cos(p),sp=Math.sin(p);
  const proj=(lx,ly,lz)=>{const R=-lx*ca+lz*sa,V=lx*sa+lz*ca;return [sx0+R*SPR,sy0-(ly*cp-V*sp)*SPR,V];};
  const body=proj(0,0,16)[2],ph=Math.sin(t*(moving?9:3.4)),wings=[];
  for(const side of [-1,1]){const phi=.38+(moving?.3:.14)*ph,uo=[side*Math.cos(phi),0,-Math.sin(phi)];
    const P=(u,v)=>proj(side*8+uo[0]*u,10+v,-14+uo[2]*u);
    const sh=P(0,0),el=P(46,58),wr=P(92,84),f1=P(168,74),f2=P(150,14),f3=P(112,-26),s1=P(150,46),s2=P(124,-2),s3=P(72,-30),bt=P(24,-30);
    const mem=[sh,el,wr,f1,s1,f2,s2,f3,s3,bt];wings.push({mem,bones:[[sh,el,wr],[wr,f1],[wr,f2],[wr,f3]],claw:wr,front:avgD([f1,f2,f3])>body,bat:1});}
  return wings;}
function drawBat(w,t){if(GP==='fx')return;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  ctx.fillStyle=lgrad(w.mem[0],w.mem[3],['#24142e','#4a2a5e','#7a4a8e']);cpoly(w.mem);ctx.fill();
  ctx.strokeStyle='#1a0e22';ctx.lineWidth=5*SPR*1.4;for(const b of w.bones){ctx.beginPath();b.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();}
  ctx.strokeStyle='rgba(190,140,220,.5)';ctx.lineWidth=1.6*SPR*1.4;for(const b of w.bones){ctx.beginPath();b.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();}
  const c=w.claw;ctx.fillStyle='#e8dcc8';ctx.beginPath();ctx.moveTo(c[0],c[1]-8*SPR);ctx.lineTo(c[0]+3*SPR,c[1]);ctx.lineTo(c[0]-3*SPR,c[1]);ctx.closePath();ctx.fill();ctx.restore();}
const COSTUME_ITEMS={
  halo:{n:'Angel Halo',slot:'top',kind:'Upper Headgear',def:1,w:10,b:{int:1},d:'วงแหวนเทวทูตลอยเหนือหัว INT +1'},
  devilhorns:{n:'Devil Horns',slot:'top',kind:'Upper Headgear',def:2,w:20,b:{str:1},d:'เขาปีศาจสีแดงเข้ม STR +1'},
  bunnyband:{n:'Bunny Band',slot:'top',kind:'Upper Headgear',def:1,w:10,b:{agi:1},d:'ที่คาดผมหูกระต่าย หูข้างหนึ่งพับ AGI +1'},
  crown:{n:'Royal Crown',slot:'top',kind:'Upper Headgear',def:3,w:40,b:{luk:2},d:'มงกุฎทองฝังอัญมณี LUK +2'},
  witchhat:{n:'Witch Hat',slot:'top',kind:'Upper Headgear',def:2,w:30,b:{int:2},d:'หมวกแม่มดทรงสูงปลายพับ INT +2'},
  bigribbon:{n:'Big Ribbon',slot:'top',kind:'Upper Headgear',def:1,w:10,b:{dex:1},d:'โบว์ใหญ่สีแดงผูกหลังศีรษะ DEX +1'},
  flowerpin:{n:'Flower Hairpin',slot:'mid',kind:'Middle Headgear',def:0,w:5,b:{luk:1},d:'กิ๊บดอกไม้สีแดงที่ข้างหู LUK +1'},
  shades:{n:'Sunglasses',slot:'mid',kind:'Middle Headgear',def:0,w:10,b:{hit:3},d:'แว่นกันแดดสีดำ HIT +3'},
  pipe:{n:'Smoking Pipe',slot:'low',kind:'Lower Headgear',def:0,w:10,b:{vit:1},d:'ไปป์ไม้มีควันลอยเบาๆ VIT +1'},
  batwings:{n:'Bat Wings',slot:'garment',kind:'Garment',def:2,mdef:3,w:30,b:{flee:8},d:'ปีกค้างคาวสีม่วงดำ กระพือเร็ว FLEE +8'},
  angelwings:{n:'Little Angel Wings',slot:'garment',kind:'Garment',def:2,mdef:3,w:30,b:{flee:6,int:1},d:'ปีกเทวดาสีขาวขนาดเล็ก FLEE +6 · INT +1'},
};
/* ---------- Themed fashion sets (all-new pieces): Egypt / Greek / Aztec / Japan / Viking ---------- */
function domeParts(H,rings,cols,n=20,ox=0){const R=rings.map(([y,r,rz])=>{const o=[];for(let i=0;i<n;i++){const a=i/n*TAU;o.push(H.proj(Math.cos(a)*r+ox,y,Math.sin(a)*(rz||r)));}return o;}),out=[];
  for(let k=0;k<R.length-1;k++)for(let i=0;i<n;i++){const j=(i+1)%n,q=[R[k][i],R[k][j],R[k+1][j],R[k+1][i]],lit=.55+.45*Math.cos(i/n*TAU+.7),c=cols[k%cols.length];
    out.push({d:avgD(q),f:()=>{if(GP==='fx')return;fillPoly(q,shadeC(c,lit));ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=.4;cpoly(q);ctx.stroke();}});}
  return out;}
function shadeC(hex,k){const A=parseInt(hex.slice(1),16),f=.62+.5*k;return `rgb(${Math.min(255,((A>>16)&255)*f)|0},${Math.min(255,((A>>8)&255)*f)|0},${Math.min(255,(A&255)*f)|0})`;}
function panel(H,pts,col,stripes,scol){const q=pts.map(p=>H.proj(...p));return {d:avgD(q),f:()=>{if(GP==='fx')return;fillPoly(q,col);if(stripes){ctx.strokeStyle=scol;ctx.lineWidth=2.2*SPR*3;for(let k=1;k<stripes;k++){const f=k/stripes,a=[q[0][0]+(q[3][0]-q[0][0])*f,q[0][1]+(q[3][1]-q[0][1])*f],b=[q[1][0]+(q[2][0]-q[1][0])*f,q[1][1]+(q[2][1]-q[1][1])*f];ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}ctx.strokeStyle='rgba(30,20,6,.55)';ctx.lineWidth=.6;cpoly(q);ctx.stroke();}};}
const LWc=()=>SPR*3;
Object.assign(COSTUME,{
  /* EGYPT */
  nemes:(H,t)=>{const P=domeParts(H,[[26,50,52],[44,49,51],[58,44,46],[68,34,36],[75,18,20],[78,2,2]],['#2a4aa8','#e2b43c']);
    for(const s of [-1,1]){P.push(panel(H,[[s*44,30,24],[s*54,26,6],[s*50,-78,4],[s*38,-78,20]],'#e2b43c',8,'#2a4aa8'));}
    P.push(panel(H,[[-30,28,-46],[30,28,-46],[22,-40,-42],[-22,-40,-42]],'#2a4aa8',6,'#e2b43c'));
    const u0=H.proj(0,30,46),u1=H.proj(0,42,48);P.push({d:u0[2]+2,f:()=>{if(GP==='fx')return;const L=LWc();ctx.fillStyle='#f0c858';ctx.strokeStyle='#6a4a10';ctx.lineWidth=.6*L;ctx.beginPath();ctx.ellipse(u1[0],u1[1],3.4*L,4.6*L,0,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#c23a26';ctx.beginPath();ctx.arc(u1[0],u1[1]-1*L,1.4*L,0,TAU);ctx.fill();ctx.strokeStyle='#f0c858';ctx.lineWidth=2*L;ctx.beginPath();ctx.moveTo(u1[0],u1[1]+4*L);ctx.lineTo(u0[0],u0[1]);ctx.stroke();}});
    return P;},
  usekh:(H)=>{const out=[],cols=['#e2b43c','#23419e','#22a6a0','#c23a26','#e2b43c'];for(let k=0;k<5;k++){const y0=-66-k*6,y1=y0-6,r0=26+k*5,r1=r0+5;
      for(let i=0;i<12;i++){const a0=Math.PI*(i/12),a1=Math.PI*((i+1)/12);const q=[H.proj(Math.cos(a0)*r0,y0,Math.sin(a0)*r0*.9+6),H.proj(Math.cos(a1)*r0,y0,Math.sin(a1)*r0*.9+6),H.proj(Math.cos(a1)*r1,y1,Math.sin(a1)*r1*.9+6),H.proj(Math.cos(a0)*r1,y1,Math.sin(a0)*r1*.9+6)];
        out.push({d:avgD(q)+40,f:()=>{if(GP==='fx')return;fillPoly(q,cols[k]);ctx.strokeStyle='rgba(30,20,6,.6)';ctx.lineWidth=.5;cpoly(q);ctx.stroke();}});}}return out;},
  /* GREEK */
  laurel:(H,t)=>{const out=[];for(let i=0;i<26;i++){const a=i/26*TAU;if(Math.abs(Math.sin(a)-1)<.06)continue;const p=H.proj(Math.cos(a)*44,34+Math.sin(a*2)*2,Math.sin(a)*42),n=H.proj(Math.cos(a+.2)*44,34,Math.sin(a+.2)*42);
      out.push({d:p[2],f:()=>{if(GP==='fx')return;const L=LWc(),an=Math.atan2(n[1]-p[1],n[0]-p[0]);for(const sd of [-1,1]){ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(an+sd*.7);ctx.fillStyle=sd>0?'#d8a838':'#f2cc58';ctx.beginPath();ctx.ellipse(4*L,0,4.6*L,1.8*L,0,0,TAU);ctx.fill();ctx.strokeStyle='rgba(110,70,10,.6)';ctx.lineWidth=.4*L;ctx.stroke();ctx.restore();}}});}
    const f=H.proj(0,34,42);out.push({d:f[2]+1,f:()=>{if(GP==='fx')return;const L=LWc();ctx.fillStyle='#fff2b0';ctx.beginPath();ctx.arc(f[0],f[1],1.8*L,0,TAU);ctx.fill();}});return out;},
  goldtorc:(H)=>{const out=[];const pts=[];for(let i=0;i<=16;i++){const a=Math.PI*(i/16);pts.push(H.proj(Math.cos(a)*24,-92,Math.sin(a)*20+4));}
    out.push({d:60,f:()=>{if(GP==='fx')return;const L=LWc();ctx.lineCap='round';ctx.strokeStyle='#7a5410';ctx.lineWidth=4.2*L;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.strokeStyle='#f0c858';ctx.lineWidth=2.8*L;ctx.stroke();
      for(const q of [pts[0],pts[16]]){ctx.fillStyle='#f0c858';ctx.beginPath();ctx.arc(q[0],q[1],2.6*L,0,TAU);ctx.fill();}const m=pts[8];ctx.fillStyle='#e8f0ff';ctx.beginPath();ctx.arc(m[0],m[1]+3*L,2.2*L,0,TAU);ctx.fill();}});return out;},
  /* AZTEC */
  quetzalcrown:(H,t)=>{const out=domeParts(H,[[30,50,50],[44,51,51]],['#e6b030'],20);
    const cols=['#18a060','#20b0b4','#18a060','#c4282a','#18a060','#2a4ab0','#18a060','#20b0b4','#18a060'];
    for(let i=0;i<9;i++){const a=Math.PI*(.12+.76*i/8),bx=Math.cos(a)*44,bz=-Math.sin(a)*40,sw=Math.sin(t*2.4+i)*4;const T=tube(H,[[bx,44,bz],[bx*1.3,96,bz-10],[bx*1.8+sw,140,bz-18],[bx*2.2+sw,168,bz-24]],8,2.5,10);
      out.push({d:T.d-12,f:()=>{if(GP==='fx')return;fillPoly(T.pts,lgrad(T.c[0],T.c[10],['#0a3a22',cols[i],'#9af060']));ctx.strokeStyle='rgba(6,30,18,.7)';ctx.lineWidth=.5;cpoly(T.pts);ctx.stroke();const tp=T.c[9];ctx.fillStyle=cols[i]==='#c4282a'?'#ffd040':'#1a3a8a';ctx.beginPath();ctx.arc(tp[0],tp[1],1.8*LWc(),0,TAU);ctx.fill();}});}
    const j=H.proj(0,38,46);out.push({d:j[2]+2,f:()=>{if(GP==='fx')return;const L=LWc();ctx.fillStyle='#3ab878';ctx.strokeStyle='#0a3a22';ctx.lineWidth=.7*L;ctx.beginPath();ctx.arc(j[0],j[1],5*L,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#e6b030';ctx.beginPath();ctx.arc(j[0],j[1],2.2*L,0,TAU);ctx.fill();}});
    return out;},
  jademask:(H)=>{if(H.face<-.2)return [];const q=[[-40,4],[-14,0],[0,6],[14,0],[40,4],[36,-24],[12,-30],[0,-24],[-12,-30],[-36,-24]].map(([x,y])=>H.proj(x*.82,y,40-Math.abs(x)*.4));
    const eL=[[-30,-6],[-14,-4],[-12,-14],[-28,-16]].map(([x,y])=>H.proj(x*.82,y,42-Math.abs(x)*.4)),eR=[[30,-6],[14,-4],[12,-14],[28,-16]].map(([x,y])=>H.proj(x*.82,y,42-Math.abs(x)*.4));
    return [{d:70,f:()=>{if(GP==='fx')return;fillPoly(q,lgrad(q[0],q[4],['#1e8a5a','#3ab878','#1e8a5a']));const L=LWc();ctx.strokeStyle='rgba(20,140,140,.7)';ctx.lineWidth=.5*L;for(let i=1;i<6;i++){const a=q[i%5],b=q[5+(i%5)];ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
      for(const e of [eL,eR]){fillPoly(e,'#0c1a14');}ctx.strokeStyle='#e6b030';ctx.lineWidth=1*L;cpoly(q);ctx.stroke();}}];},
  /* JAPAN */
  kabuto:(H,t)=>{const out=domeParts(H,[[30,52,52],[48,50,50],[62,42,42],[72,28,28],[78,10,10]],['#2a2630','#3a3440'],20);
    out.push(...domeParts(H,[[30,52,52],[18,62,62],[8,68,68]],['#8a1e22','#2a2630'],20).map(p=>({...p,d:p.d})));
    for(const s of [-1,1]){const T=tube(H,[[s*6,40,46],[s*20,62,50],[s*34,86,46],[s*40,108,38]],5,1.2,10);out.push({d:T.d+30,f:()=>{if(GP==='fx')return;fillPoly(T.pts,lgrad(T.c[0],T.c[10],['#a07418','#f6d468','#fff0b0']));ctx.strokeStyle='rgba(90,60,10,.7)';ctx.lineWidth=.6;cpoly(T.pts);ctx.stroke();}});}
    const m=H.proj(0,38,48);out.push({d:m[2]+30,f:()=>{if(GP==='fx')return;const L=LWc();ctx.fillStyle='#f6d468';ctx.beginPath();ctx.arc(m[0],m[1],3*L,0,TAU);ctx.fill();ctx.fillStyle='#c23a26';ctx.beginPath();ctx.arc(m[0],m[1],1.4*L,0,TAU);ctx.fill();}});
    return out;},
  kitsunemask:(H)=>{const c=H.proj(-46,30,18),n=H.proj(-60,24,30);if(c[2]<-10)return [];return [{d:c[2]+40,f:()=>{if(GP==='fx')return;const L=LWc();const dir=Math.sign(n[0]-c[0])||1;ctx.save();ctx.translate(c[0],c[1]);ctx.scale(dir,1);
      ctx.fillStyle='#f8f6f2';ctx.strokeStyle='#3a3238';ctx.lineWidth=.7*L;ctx.beginPath();ctx.moveTo(-6*L,-9*L);ctx.lineTo(-3*L,-15*L);ctx.lineTo(0,-8*L);ctx.lineTo(5*L,-8*L);ctx.lineTo(8*L,-15*L);ctx.lineTo(9*L,-6*L);ctx.lineTo(13*L,4*L);ctx.lineTo(2*L,10*L);ctx.lineTo(-8*L,2*L);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#d8263a';ctx.beginPath();ctx.moveTo(-4*L,-12*L);ctx.lineTo(-3*L,-9*L);ctx.lineTo(-1*L,-10*L);ctx.fill();ctx.beginPath();ctx.moveTo(7*L,-12*L);ctx.lineTo(7*L,-8*L);ctx.lineTo(5*L,-9*L);ctx.fill();
      ctx.strokeStyle='#d8263a';ctx.lineWidth=1*L;ctx.beginPath();ctx.moveTo(-4*L,-3*L);ctx.lineTo(0,-2*L);ctx.moveTo(4*L,-3*L);ctx.lineTo(8*L,-2*L);ctx.stroke();ctx.fillStyle='#1a1418';ctx.beginPath();ctx.arc(11*L,4*L,1.2*L,0,TAU);ctx.fill();ctx.restore();}}];},
  /* VIKING */
  valkyriehelm:(H,t)=>{const out=domeParts(H,[[28,51,51],[44,50,50],[58,44,44],[68,32,32],[75,14,14]],['#b8c0cc','#d8dee6'],20);
    out.push(...domeParts(H,[[26,53,53],[32,53,53]],['#c49a3a'],20));
    const nose=[[-4,30,54],[4,30,54],[3,-4,56],[-3,-4,56]];out.push(panel(H,nose,'#c8d0da'));
    for(const s of [-1,1]){const fl=Math.sin(t*3+s)*3;for(let k=0;k<4;k++){const a=(15+k*22)*Math.PI/180,l=70-k*8;const base=[s*50,42,0];const tip=[s*(50+Math.cos(a)*l),40+Math.sin(a)*l+fl,-6];
        const q=[[base[0],base[1]-10,base[2]],[base[0],base[1]+10,base[2]],tip,[tip[0]-s*10,tip[1]-8,tip[2]]].map(p=>H.proj(...p));const mid=H.proj((base[0]+tip[0])/2+s*0,(base[1]+tip[1])/2+6,-3);
        out.push({d:avgD(q),f:()=>{if(GP==='fx')return;ctx.fillStyle=k%2?'#f4f6fa':'#e2e6ee';ctx.beginPath();ctx.moveTo(q[1][0],q[1][1]);ctx.quadraticCurveTo(mid[0],mid[1],q[2][0],q[2][1]);ctx.lineTo(q[3][0],q[3][1]);ctx.lineTo(q[0][0],q[0][1]);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(60,70,90,.6)';ctx.lineWidth=.5;ctx.stroke();}});}}
    return out;},
  odinpatch:(H)=>{if(H.face<-.3)return [];const p=H.proj(-15,-10,40),a=H.proj(-44,4,8),b=H.proj(44,8,8),m=H.proj(0,-2,42);
    return [{d:70,f:()=>{if(GP==='fx')return;const L=LWc();ctx.strokeStyle='#2a1c14';ctx.lineWidth=1.2*L;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo(m[0],m[1]-4*L,b[0],b[1]);ctx.stroke();ctx.fillStyle='#2a1c14';ctx.beginPath();ctx.ellipse(p[0],p[1],4*L,3.2*L,0,0,TAU);ctx.fill();ctx.strokeStyle='#c49a3a';ctx.lineWidth=.6*L;ctx.stroke();ctx.fillStyle='#c49a3a';ctx.beginPath();ctx.moveTo(p[0],p[1]-1.6*L);ctx.lineTo(p[0]+1*L,p[1]+1.1*L);ctx.lineTo(p[0]-1*L,p[1]+1.1*L);ctx.closePath();ctx.fill();}}];},
});
const SET2_ITEMS={
  nemes:{n:'Pharaoh Nemes',slot:'top',kind:'Upper Headgear',def:3,w:30,b:{int:2},d:'ผ้าโพกฟาโรห์ลายทองสลับลาพิส มีงูเห่าทองที่หน้าผาก'},
  usekh:{n:'Usekh Broad Collar',slot:'low',kind:'Lower Headgear',def:1,w:20,b:{dex:1},d:'สร้อยคอแผ่นกว้างแบบอียิปต์ ทอง ลาพิส เทอร์คอยซ์ แดง'},
  laurel:{n:'Golden Laurel Wreath',slot:'top',kind:'Upper Headgear',def:1,w:10,b:{luk:2},d:'มงกุฎใบลอเรลทองของผู้ชนะแห่งโอลิมปัส'},
  goldtorc:{n:'Hero Torc',slot:'low',kind:'Lower Headgear',def:1,w:10,b:{str:1},d:'ห่วงคอทองของวีรบุรุษกรีก ประดับไข่มุก'},
  quetzalcrown:{n:'Quetzal Feather Crown',slot:'top',kind:'Upper Headgear',def:2,w:30,b:{agi:2},d:'มงกุฎขนนกเควตซัลแผ่เป็นพัด คาดทองฝังหยก'},
  jademask:{n:'Jade Mosaic Mask',slot:'mid',kind:'Middle Headgear',def:1,w:10,b:{dex:1},d:'หน้ากากหยกโมเสกขอบทอง'},
  kabuto:{n:'Crescent Kabuto',slot:'top',kind:'Upper Headgear',def:4,w:50,b:{vit:2},d:'หมวกเกราะซามูไร มีเขาจันทร์เสี้ยวทองด้านหน้า'},
  kitsunemask:{n:'Kitsune Side Mask',slot:'mid',kind:'Middle Headgear',def:0,w:5,b:{luk:1},d:'หน้ากากจิ้งจอกขาวลายแดง สวมเอียงข้างหัว'},
  valkyriehelm:{n:'Valkyrie Winged Helm',slot:'top',kind:'Upper Headgear',def:4,w:50,b:{str:1,vit:1},d:'หมวกเหล็กวัลคิรีมีปีกขาวสองข้าง ขอบทอง'},
  odinpatch:{n:'Allfather Eyepatch',slot:'mid',kind:'Middle Headgear',def:0,w:5,b:{int:1},d:'ผ้าปิดตาหนังแบบโอดิน ประดับรูนทอง'},
};
/* ---------- Theme armour: pauldrons (new 'shoulder' slot) + war helms ---------- */
function pauldron(H,t,o){const out=[];
  for(const s of [-1,1]){const ox=s*46,rings=[[-56,10],[-61,19],[-68,25],[-77,29],[-87,31],[-97,32]].slice(0,o.n||6).map(([y,r])=>[y+(o.dy||0),r*(o.r||1),r*(o.r||1)*.95]);
    const P=domeParts(H,rings,o.cols,16,ox);for(const p of P)out.push(p);
    if(o.deco){const c=H.proj(ox+s*22,-72+(o.dy||0),0);out.push({d:c[2]+4,f:()=>{if(GP==='fx')return;o.deco(c,s,LWc(),t);}});}
    if(o.trim){const ring=[];const yb=rings[rings.length-1][0],rb=rings[rings.length-1][1]+1;for(let i=0;i<16;i++){const a=i/16*TAU;ring.push(H.proj(Math.cos(a)*rb+ox,yb,Math.sin(a)*rb*.95));}
      for(let i=0;i<16;i++){const a=ring[i],b=ring[(i+1)%16];const d=(a[2]+b[2])/2;out.push({d:d+.5,f:()=>{if(GP==='fx')return;ctx.strokeStyle=o.trim;ctx.lineWidth=1.8*LWc();ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}});}}
    if(o.hang)for(let k=0;k<o.hang.n;k++){const a=(k/(o.hang.n-1)-.5)*1.6,b0=[ox+s*Math.cos(a)*30,-96+(o.dy||0),Math.sin(a)*28],sw=Math.sin(t*3+k)*3;
      const T=tube(H,[b0,[b0[0]+s*2,b0[1]-14,b0[2]],[b0[0]+s*4+sw,b0[1]-28,b0[2]],[b0[0]+s*5+sw,b0[1]-40,b0[2]]],4,1.4,8);
      out.push({d:T.d,f:()=>{if(GP==='fx')return;fillPoly(T.pts,lgrad(T.c[0],T.c[8],o.hang.c));}});}}
  return out;}
const ARMOR_COST={
  vikpauldron:(H,t)=>pauldron(H,t,{cols:['#e8e2d4','#7a7e88','#8e929c','#7a7e88','#8e929c','#5a5e68'],trim:'#c49a3a',
    deco:(c,s,L)=>{ctx.fillStyle='#c49a3a';ctx.beginPath();ctx.arc(c[0],c[1],2.6*L,0,TAU);ctx.fill();ctx.strokeStyle='#5ad8ff';ctx.lineWidth=.8*L;ctx.beginPath();ctx.moveTo(c[0]-1.2*L,c[1]-1.6*L);ctx.lineTo(c[0],c[1]+1.6*L);ctx.lineTo(c[0]+1.2*L,c[1]-1.6*L);ctx.stroke();}}),
  greekpauldron:(H,t)=>pauldron(H,t,{cols:['#a8742a','#d8a048','#c08a38','#d8a048','#c08a38'],n:5,trim:'#7a4a14',
    hang:{n:5,c:['#8a1a1a','#c8282a','#e8584a']},
    deco:(c,s,L)=>{ctx.fillStyle='#f0c868';ctx.beginPath();ctx.arc(c[0],c[1],3.6*L,0,TAU);ctx.fill();ctx.strokeStyle='#7a4a14';ctx.lineWidth=.7*L;ctx.stroke();ctx.fillStyle='#7a4a14';ctx.beginPath();ctx.arc(c[0]-1*L,c[1]-.6*L,.6*L,0,TAU);ctx.arc(c[0]+1*L,c[1]-.6*L,.6*L,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(c[0],c[1]+1*L,1.2*L,0,Math.PI);ctx.stroke();}}),
  egyptpauldron:(H,t)=>pauldron(H,t,{cols:['#e2b43c','#23419e','#e2b43c','#22a6a0','#e2b43c','#c23a26'],trim:'#7a5410',
    deco:(c,s,L)=>{ctx.fillStyle='#22a6a0';ctx.strokeStyle='#5a3e0c';ctx.lineWidth=.6*L;ctx.beginPath();ctx.ellipse(c[0],c[1],2.6*L,3.4*L,0,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#e2b43c';for(const d of [-1,1]){ctx.beginPath();ctx.ellipse(c[0]+d*4*L,c[1]-.5*L,3*L,1.4*L,d*.3,0,TAU);ctx.fill();ctx.stroke();}}}),
  aztecpauldron:(H,t)=>pauldron(H,t,{cols:['#e8b838','#d89a28','#e8b838','#d89a28','#20b0b4'],n:5,trim:'#c4282a',
    hang:{n:6,c:['#0c5a3a','#18a060','#9af060']},
    deco:(c,s,L)=>{ctx.fillStyle='#2a1a10';for(let i=0;i<5;i++){const a=i*1.3+s;ctx.beginPath();ctx.ellipse(c[0]+Math.cos(a)*4*L,c[1]+Math.sin(a)*3*L,1.4*L,1*L,a,0,TAU);ctx.fill();}}}),
  japanpauldron:(H,t)=>pauldron(H,t,{cols:['#2a2630','#8a1e22','#2a2630','#8a1e22','#2a2630','#8a1e22'],r:1.05,trim:'#e6b030',
    deco:(c,s,L)=>{ctx.strokeStyle='#f0e6d0';ctx.lineWidth=.8*L;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(c[0]+k*3*L,c[1]-4*L);ctx.lineTo(c[0]+k*3*L,c[1]+6*L);ctx.stroke();}ctx.fillStyle='#e6b030';ctx.beginPath();ctx.arc(c[0],c[1]-6*L,1.8*L,0,TAU);ctx.fill();}}),
  /* war helms */
  corinthhelm:(H,t)=>{const out=domeParts(H,[[18,50,52],[34,52,54],[50,48,50],[64,38,40],[74,22,24],[79,4,4]],['#c08a38','#d8a048'],20);
    for(const s of [-1,1])out.push(panel(H,[[s*48,22,30],[s*50,20,10],[s*44,-30,14],[s*30,-34,40]],'#b88234'));
    const cr=[];for(let i=0;i<=14;i++){const a=Math.PI*(.08+.84*i/14);cr.push([0,60+Math.sin(a)*40,Math.cos(a)*62]);}
    for(let i=0;i<14;i++){const a=cr[i],b=cr[i+1],q=[H.proj(-5,a[1],a[2]),H.proj(5,a[1],a[2]),H.proj(5,b[1]+8*Math.sin(t*2+i),b[2]),H.proj(-5,b[1]+8*Math.sin(t*2+i),b[2])];out.push({d:avgD(q)+8,f:()=>{if(GP==='fx')return;fillPoly(q,i%2?'#c8282a':'#a81e22');}});}
    return out;},
  khepresh:(H,t)=>{const out=domeParts(H,[[24,52,52],[40,54,54],[58,52,50],[76,44,42],[92,32,30],[102,16,14],[106,2,2]],['#23419e','#2a4aa8'],20);
    for(let i=0;i<20;i+=2){const a=i/20*TAU,p=H.proj(Math.cos(a)*53,52,Math.sin(a)*52);out.push({d:p[2]+1,f:()=>{if(GP==='fx')return;ctx.fillStyle='#e2b43c';ctx.beginPath();ctx.arc(p[0],p[1],1.4*LWc(),0,TAU);ctx.fill();}});}
    out.push(...domeParts(H,[[22,53,53],[30,54,54]],['#e2b43c'],20));const u=H.proj(0,40,58);out.push({d:u[2]+4,f:()=>{if(GP==='fx')return;const L=LWc();ctx.fillStyle='#f0c858';ctx.strokeStyle='#6a4a10';ctx.lineWidth=.6*L;ctx.beginPath();ctx.ellipse(u[0],u[1],3*L,4.4*L,0,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#c23a26';ctx.beginPath();ctx.arc(u[0],u[1]-1*L,1.3*L,0,TAU);ctx.fill();}});
    return out;},
  jaguarhelm:(H,t)=>{const out=domeParts(H,[[24,54,56],[40,56,58],[56,52,54],[70,40,42],[80,22,24],[84,4,4]],['#e8b838','#d89a28'],20);
    for(let i=0;i<18;i++){const a=i/18*TAU+.2,y=36+(i%3)*14,p=H.proj(Math.cos(a)*(y>60?44:55),y,Math.sin(a)*(y>60?46:57));out.push({d:p[2]+1,f:()=>{if(GP==='fx')return;ctx.fillStyle='#2a1a10';ctx.beginPath();ctx.arc(p[0],p[1],2*LWc(),0,TAU);ctx.fill();}});}
    for(const s of [-1,1]){const q=[H.proj(s*30,74,10),H.proj(s*46,70,0),H.proj(s*42,96,4)];out.push({d:avgD(q),f:()=>{if(GP==='fx')return;fillPoly(q,'#d89a28');ctx.strokeStyle='#5a3a10';ctx.lineWidth=.6;cpoly(q);ctx.stroke();}});}
    for(let k=-3;k<=3;k++){const a=H.proj(k*10,26,56-Math.abs(k)*2),b=H.proj(k*10+2,14,57-Math.abs(k)*2);out.push({d:a[2]+3,f:()=>{if(GP==='fx')return;const L=LWc();ctx.fillStyle='#f4ead0';ctx.beginPath();ctx.moveTo(a[0]-1.6*L,a[1]);ctx.lineTo(a[0]+1.6*L,a[1]);ctx.lineTo(b[0],b[1]);ctx.closePath();ctx.fill();}});}
    return out;},
};
Object.assign(COSTUME,ARMOR_COST);
const ARMOR_ITEMS={
  vikpauldron:{n:'Jarl Fur Pauldrons',slot:'shoulder',kind:'Shoulder Armor',def:4,w:60,b:{vit:2},d:'เกราะไหล่เหล็กเกล็ด คลุมขนหมาป่า ขอบทอง ฝังรูนเรืองฟ้า'},
  greekpauldron:{n:'Hoplite Bronze Pauldrons',slot:'shoulder',kind:'Shoulder Armor',def:4,w:60,b:{str:2},d:'เกราะไหล่ทองแดงหัวสิงห์ ห้อยพู่หนังแดง'},
  egyptpauldron:{n:'Scarab Gold Pauldrons',slot:'shoulder',kind:'Shoulder Armor',def:3,w:50,b:{int:2},d:'เกราะไหล่ทองลายแถบลาพิส ประดับแมลงสการับปีกทอง'},
  aztecpauldron:{n:'Jaguar Knight Pauldrons',slot:'shoulder',kind:'Shoulder Armor',def:3,w:50,b:{agi:2},d:'เกราะไหล่หนังเสือจากัวร์ ห้อยขนนกเควตซัล'},
  japanpauldron:{n:'Lacquered Sode',slot:'shoulder',kind:'Shoulder Armor',def:4,w:60,b:{dex:2},d:'เกราะไหล่ซามูไรแผ่นลงรักดำแดงซ้อนชั้น ร้อยเชือกขาว'},
  corinthhelm:{n:'Corinthian Crest Helm',slot:'top',kind:'Upper Headgear',def:5,w:60,b:{str:1,vit:1},d:'หมวกเกราะกรีกทองแดง หงอนขนแดงพาดหัว'},
  khepresh:{n:'Khepresh War Crown',slot:'top',kind:'Upper Headgear',def:4,w:40,b:{int:2},d:'มงกุฎศึกฟาโรห์สีน้ำเงินจุดทอง มีงูเห่าทอง'},
  jaguarhelm:{n:'Jaguar Warrior Helm',slot:'top',kind:'Upper Headgear',def:4,w:50,b:{agi:1,str:1},d:'หมวกหัวเสือจากัวร์ ลายจุด เขี้ยวงาครอบหน้าผาก'},
};
/* ---------- Abyss Sovereign set: full-body dark plate (sprite re-tint) + horned mask helm + spiked pauldrons + white flame aura ---------- */
const MONARCH_FILTER='grayscale(.85) sepia(.3) hue-rotate(-8deg) brightness(.6) contrast(1.45)';
function armorFilter(){return FEQ.armor==='abyssplate'?MONARCH_FILTER:'';}
Object.assign(COSTUME,{
  abysshelm:(H,t)=>{const out=domeParts(H,[[-30,36,42],[-6,46,50],[18,50,52],[40,48,50],[58,40,42],[70,26,28],[76,8,8]],['#3a3632','#4e4842'],20);
    out.push(panel(H,[[-26,30,54],[26,30,54],[18,-30,52],[0,-44,54],[-18,-30,52]].slice(0,4),'#55504a'));
    for(const s of [-1,1]){const T=tube(H,[[s*30,56,20],[s*52,92,14],[s*58,132,0],[s*46,170,-12]],13,1.2,12);
      out.push({d:T.d,f:()=>{if(GP==='fx')return;fillPoly(T.pts,lgrad(T.c[0],T.c[12],['#1a1816','#3a3632','#8a8478']));ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=.6;cpoly(T.pts);ctx.stroke();}});
      const sp=[[s*44,30,30],[s*56,40,18],[s*70,30,6]].map(p=>H.proj(...p));out.push({d:avgD(sp),f:()=>{if(GP==='fx')return;fillPoly(sp,'#2e2a26');}});}
    const crest=[H.proj(-6,74,10),H.proj(6,74,10),H.proj(0,118,-6)];out.push({d:avgD(crest),f:()=>{if(GP==='fx')return;fillPoly(crest,lgrad(crest[0],crest[2],['#2a2622','#6a645a']));}});
    const eL=H.proj(-14,-4,52),eR=H.proj(14,-4,52);
    out.push({d:80,f:()=>{const L=LWc();if(H.face<-.2)return;
      if(GP!=='fx'){ctx.fillStyle='#0c0a08';for(const e of [eL,eR]){ctx.beginPath();ctx.ellipse(e[0],e[1],5*L,1.8*L,0,0,TAU);ctx.fill();}}
      if(GP!=='body'){ctx.globalCompositeOperation='lighter';const k=.75+.25*Math.sin(t*5);for(const e of [eL,eR]){const g=ctx.createRadialGradient(e[0],e[1],0,e[0],e[1],7*L);g.addColorStop(0,`rgba(255,250,230,${k})`);g.addColorStop(.4,`rgba(255,220,150,${.6*k})`);g.addColorStop(1,'rgba(255,200,120,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(e[0],e[1],7*L,3*L,0,0,TAU);ctx.fill();}ctx.globalCompositeOperation='source-over';}}});
    return out;},
  abysspauldron:(H,t)=>{const out=pauldron(H,t,{cols:['#2a2622','#3e3a34','#2a2622','#3e3a34','#2a2622','#1e1a18'],r:1.15});
    for(const s of [-1,1])for(let k=0;k<3;k++){const b=[s*(50+k*6),-70-k*9,(k-1)*16],tip=[s*(84+k*4),-50-k*12,(k-1)*22];
      const q=[H.proj(b[0],b[1]+6,b[2]),H.proj(...tip),H.proj(b[0],b[1]-6,b[2])];out.push({d:avgD(q)+1,f:()=>{if(GP==='fx')return;fillPoly(q,lgrad(q[0],q[1],['#1a1816','#5a554c','#bab2a2']));ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=.5;cpoly(q);ctx.stroke();}});}
    for(const s of [-1,1]){const c=H.proj(s*58,-80,6);out.push({d:c[2]+2,f:()=>{if(GP==='body')return;const L=LWc(),k=.6+.4*Math.sin(t*4+s);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,240,200,${.8*k})`;ctx.lineWidth=1.2*L;ctx.beginPath();ctx.moveTo(c[0]-5*L,c[1]-2*L);ctx.lineTo(c[0]+5*L,c[1]+1*L);ctx.stroke();}});}
    return out;},
  abyssplate:(H,t)=>{const out=[];const slits=[[-16,-104,38,-6,-98],[16,-104,38,6,-98],[-20,-122,36,-8,-118],[20,-122,36,8,-118]];
    for(const [x0,y0,z,x1,y1] of slits){const a=H.proj(x0,y0,z),b=H.proj(x1,y1,z);out.push({d:a[2]+20,f:()=>{if(GP==='body'||H.face<0)return;const L=LWc(),k=.6+.4*Math.sin(t*3+x0);ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.strokeStyle=`rgba(255,230,170,${.35*k})`;ctx.lineWidth=4*L;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.strokeStyle=`rgba(255,252,236,${.9*k})`;ctx.lineWidth=1.3*L;ctx.stroke();}});}
    return out;},
});
function drawFlameAura(R,t){if(GP==='body')return;ctx.save();ctx.globalCompositeOperation='lighter';const LW=SPR*3;
  const tongues=[[-90,-40,1.0],[-56,0,1.3],[-22,30,1.6],[22,30,1.6],[56,0,1.3],[90,-40,1.0],[-120,-90,.75],[120,-90,.75],[0,40,1.8]];
  for(let i=0;i<tongues.length;i++){const [bx,by,h]=tongues[i];for(let layer=0;layer<3;layer++){const sc=1-layer*.28,ph=t*(3+layer)+i*1.7;
      const base=R.proj(bx*sc,by-10,-30),hh=(300+70*Math.sin(ph*.7))*h*sc,sw=Math.sin(ph)*26*sc;
      const tip=R.proj(bx*sc*1.25+sw,by+hh,-34),c1=R.proj(bx*sc-70*sc+sw*.4,by+hh*.42,-32),c2=R.proj(bx*sc+70*sc+sw*.4,by+hh*.42,-32);
      const g=ctx.createLinearGradient(base[0],base[1],tip[0],tip[1]);const a=[.34,.46,.7][layer];
      g.addColorStop(0,`rgba(255,250,235,${a})`);g.addColorStop(.45,`rgba(255,226,170,${a*.8})`);g.addColorStop(1,'rgba(255,200,120,0)');ctx.fillStyle=g;
      ctx.beginPath();ctx.moveTo(base[0]-34*sc*LW*.45,base[1]);ctx.quadraticCurveTo(c1[0],c1[1],tip[0],tip[1]);ctx.quadraticCurveTo(c2[0],c2[1],base[0]+34*sc*LW*.45,base[1]);ctx.closePath();ctx.fill();}}
  for(let i=0;i<10;i++){const k=(t*.6+i/10)%1,p=R.proj(Math.sin(i*3.1)*130,20+k*460,-30);ctx.fillStyle=`rgba(255,240,210,${.7*(1-k)})`;ctx.beginPath();ctx.arc(p[0]+Math.sin(t*2+i)*6*LW,p[1],(1.2+1.5*(1-k))*LW,0,TAU);ctx.fill();}
  ctx.restore();}
const ABYSS_ITEMS={
  abysshelm:{n:'Abyss Sovereign Helm',slot:'top',kind:'Upper Headgear',def:6,w:60,b:{str:2},d:'หมวกเกราะเต็มหน้าเขาคู่ ช่องตาเรืองแสงขาว'},
  abysspauldron:{n:'Abyss Spiked Pauldrons',slot:'shoulder',kind:'Shoulder Armor',def:5,w:70,b:{vit:2},d:'เกราะไหล่หนามสีเหล็กดำ รอยแยกเรืองแสง'},
  abyssplate:{n:'Abyss Sovereign Plate',slot:'armor',kind:'Armor',def:14,mdef:4,ref:7,cards:1,w:300,b:{vit:3,str:2},d:'เกราะเต็มตัวสีเหล็กดำทั้งร่าง มีรอยแยกเรืองแสงที่อก'},
};
function costumeParts(e,x,y,t){const H=headFrame(e,x,y);if(!H)return [];const out=[];
  for(const sl of ['top','mid','low','shoulder','armor']){const id=FEQ[sl];if(id&&COSTUME[id])for(const p of COSTUME[id](H,t))out.push(p);}
  return out;}

const _hc=[document.createElement('canvas'),document.createElement('canvas')];
function sceneFilter(){return (typeof mapNight!=='undefined'&&curMap&&mapNight)?'brightness(.72) saturate(.78) hue-rotate(-6deg)':'';}
/* harmonizer: gear solids -> offscreen, warm-graded + sprite-style dark outline + slight softening; glows drawn after, lighter */
function harmonized(x,y,fn,opt){opt=opt||{};
  const m=ctx.getTransform(),k=Math.hypot(m.a,m.b)||1,u=SPR*k;
  const W=Math.min(2048,Math.ceil(720*u)),H=Math.min(2048,Math.ceil(680*u));
  const py=y-230*SPR,cx=m.a*x+m.c*py+m.e,cy=m.b*x+m.d*py+m.f,ox=Math.floor(cx-W/2),oy=Math.floor(cy-H/2);
  const [c1,c2]=_hc;for(const c of _hc)if(c.width<W||c.height<H){c.width=Math.max(c.width,W);c.height=Math.max(c.height,H);}
  const g1=c1.getContext('2d'),g2=c2.getContext('2d');g1.setTransform(1,0,0,1,0,0);g1.globalAlpha=1;g1.filter='none';g1.globalCompositeOperation='source-over';g1.clearRect(0,0,W,H);
  g1.setTransform(m.a,m.b,m.c,m.d,m.e-ox,m.f-oy);
  const old=ctx,ga=ctx.globalAlpha;ctx=g1;GP='body';try{fn();}finally{ctx=old;}
  g1.setTransform(1,0,0,1,0,0);g1.globalAlpha=1;
  if(opt.grade!==false){g1.globalCompositeOperation='source-atop';g1.fillStyle='rgba(128,62,44,.13)';g1.fillRect(0,0,W,H);}
  g1.globalCompositeOperation='source-over';
  const r=Math.max(1,(opt.crisp?2.2:3.4)*u);g2.setTransform(1,0,0,1,0,0);g2.globalAlpha=1;g2.globalCompositeOperation='source-over';g2.clearRect(0,0,W,H);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;g2.drawImage(c1,0,0,W,H,Math.cos(a)*r,Math.sin(a)*r,W,H);}
  g2.globalCompositeOperation='source-in';g2.fillStyle=opt.oc||'rgba(40,22,14,.96)';g2.fillRect(0,0,W,H);g2.globalCompositeOperation='source-over';
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ga;const sf=sceneFilter();
  ctx.filter=sf||'none';ctx.drawImage(c2,0,0,W,H,ox,oy,W,H);
  ctx.filter=((sf?sf+' ':'')+(opt.grade===false?'':'saturate(.86) contrast(1.04) ')+(opt.crisp?'':'blur('+Math.max(.3,.45*u/0.4).toFixed(2)+'px)'));if(ctx.filter==='')ctx.filter='none';ctx.drawImage(c1,0,0,W,H,ox,oy,W,H);
  ctx.restore();
  GP='fx';ctx.save();if(sceneFilter())ctx.globalAlpha*=.6;try{fn();}finally{ctx.restore();GP='all';}}
/* ---------- Wing pack 2: flashy MMO-style wings (butterfly, phoenix, mecha, leaf, energy, void, demon, dragon, shadow, six-wing) ---------- */
function rigFor(e,x,y,dy){
  const sd=srcDir(e.d),mir=isMir(e.d),tr=FASHION.head[e.st]&&FASHION.head[e.st][sd];if(!tr)return null;
  const hp=tr[Math.min(e.f,tr.length-1)],bo=BACK_OFF[sd]||[0,76];let ax=hp[0]+bo[0];if(mir)ax=SPR_META.cell.w-ax;const ay=hp[1]+bo[1]+(dy||0);
  const [sx0,sy0]=c2s(ax,ay,x,y);const a=(GEAR_YAW[e.d]||0)*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),p=24*Math.PI/180,cp=Math.cos(p),sp=Math.sin(p);
  const proj=(lx,ly,lz)=>{const R=-lx*ca+lz*sa,V=lx*sa+lz*ca;return [sx0+R*SPR,sy0-(ly*cp-V*sp)*SPR,V];};
  return {proj,body:proj(0,0,16)[2]};}
function planeP(R,side,phi,tau,S=1,rot=0,root=[8,0,-14]){const uo=[side*Math.cos(phi),0,-Math.sin(phi)],vu=[0,Math.cos(tau),-Math.sin(tau)],cr=Math.cos(rot),sr=Math.sin(rot);
  return (u,v)=>{u*=S;v*=S;const u2=u*cr-v*sr,v2=u*sr+v*cr;return R.proj(side*root[0]+uo[0]*u2,root[1]+vu[1]*v2,root[2]+uo[2]*u2+vu[2]*v2);};}
const fillPoly=(pts,style)=>{ctx.fillStyle=style;cpoly(pts);ctx.fill();};
function star4(x,y,r,col){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x,y-r*2);ctx.lineTo(x+r*.35,y-r*.35);ctx.lineTo(x+r*2,y);ctx.lineTo(x+r*.35,y+r*.35);ctx.lineTo(x,y+r*2);ctx.lineTo(x-r*.35,y+r*.35);ctx.lineTo(x-r*2,y);ctx.lineTo(x-r*.35,y-r*.35);ctx.closePath();ctx.fill();}
const lobe=(P,pts)=>pts.map(([u,v])=>P(u,v));
/* ---- butterfly ---- */
function butterflyGeom(e,x,y,t,moving,pal){const R=rigFor(e,x,y,-8);if(!R)return null;const ph=Math.sin(t*(moving?7:2.6)),W=[];
  for(const side of [-1,1]){const P=planeP(R,side,.3+(moving?.42:.22)*ph,.1);
    const up=lobe(P,[[4,8],[30,70],[66,124],[112,150],[160,138],[176,100],[150,60],[96,26],[40,8]]),lo=lobe(P,[[4,-2],[30,-34],[52,-82],[84,-112],[112,-100],[116,-62],[88,-22],[40,-4]]);
    const eyes=[P(118,104),P(78,-70)],veins=[[P(4,6),P(120,130)],[P(4,6),P(160,104)],[P(4,6),P(140,62)],[P(4,-2),P(96,-100)],[P(4,-2),P(108,-50)]];
    W.push({front:avgD(up)>R.body,draw:tt=>{ctx.save();ctx.lineJoin='round';
      if(GP!=='fx'){for(const [q,c] of [[lo,pal.lo],[up,pal.up]]){fillPoly(q,lgrad(q[0],q[Math.floor(q.length/2)],c));}
        ctx.strokeStyle=pal.vein;ctx.lineWidth=1.4*SPR*3;for(const [a,b] of veins){ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
        for(const q of eyes){ctx.fillStyle=pal.eye[0];ctx.beginPath();ctx.arc(q[0],q[1],9*SPR*1.6,0,TAU);ctx.fill();ctx.fillStyle=pal.eye[1];ctx.beginPath();ctx.arc(q[0],q[1],5*SPR*1.6,0,TAU);ctx.fill();}
        ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.2*SPR*3;for(const q of [up,lo]){cpoly(q);ctx.stroke();}}
      if(GP!=='body'){ctx.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const k=(tt*.6+i/7)%1,q=up[(i*2)%up.length];star4(q[0]+Math.sin(i*3+tt)*6*SPR,q[1]+k*80*SPR,(.6+1.2*(1-k))*SPR*4,`rgba(${pal.dust},${.6*(1-k)})`);}}
      ctx.restore();}});}
  return W;}
/* ---- shard family (leaf / void crystal / mecha) ---- */
function shardGeom(e,x,y,t,moving,opt){const R=rigFor(e,x,y,opt.dy||0);if(!R)return null;const ph=Math.sin(t*(moving?opt.fs*1.8:opt.fs)),W=[];
  for(const side of [-1,1]){const P=planeP(R,side,opt.phi+(moving?opt.amp*1.8:opt.amp)*ph,.15,opt.S||1);const sh=[];
    opt.th.forEach((d,i)=>{const th=d*Math.PI/180+ph*.04*(i-2),dx=Math.cos(th),dy=Math.sin(th),px=-dy,py=dx,l=opt.L[i],w=opt.W[i];
      const prof=opt.shape==='leaf'?[[.05,0],[.25,.8],[.55,1],[.85,.55],[1,0]]:opt.shape==='plate'?[[.06,.3],[.12,1],[.88,1],[1,0]]:[[.06,0],[.42,1],[.8,.4],[1,0]];
      const L=prof.map(([s,k])=>P(dx*l*s+px*w*k,dy*l*s+py*w*k)),Rr=prof.slice().reverse().map(([s,k])=>P(dx*l*s-px*w*k,dy*l*s-py*w*k));
      sh.push({pts:[...L,...Rr],root:P(dx*l*.05,dy*l*.05),tip:P(dx*l,dy*l),mid:P(dx*l*.5,dy*l*.5),i});});
    const dep=sh.reduce((s,o)=>s+o.tip[2],0)/sh.length,thr=P(4,10);
    W.push({front:dep>R.body,draw:tt=>{ctx.save();ctx.lineJoin='round';const order=sh.slice().sort((a,b)=>a.tip[2]-b.tip[2]);
      if(GP!=='fx')for(const s of order){fillPoly(s.pts,lgrad(s.root,s.tip,opt.col));
        ctx.strokeStyle=opt.rib;ctx.lineWidth=1.3*SPR*3;ctx.beginPath();ctx.moveTo(s.root[0],s.root[1]);ctx.lineTo(s.tip[0],s.tip[1]);ctx.stroke();
        if(opt.shape==='plate'){ctx.strokeStyle='rgba(30,40,60,.6)';ctx.lineWidth=.9*SPR*3;ctx.beginPath();ctx.moveTo(s.mid[0]-4*SPR,s.mid[1]-4*SPR);ctx.lineTo(s.mid[0]+4*SPR,s.mid[1]+4*SPR);ctx.stroke();}}
      if(GP!=='body'&&opt.glow){ctx.globalCompositeOperation='lighter';
        for(const s of order){const k=.55+.45*Math.sin(tt*opt.gs+s.i*1.3);ctx.strokeStyle=`rgba(${opt.glow},${.55*k})`;ctx.lineWidth=2.2*SPR*3;ctx.beginPath();ctx.moveTo(s.root[0],s.root[1]);ctx.lineTo(s.tip[0],s.tip[1]);ctx.stroke();
          if(opt.stars&&k>.8)star4(s.tip[0],s.tip[1],1.4*SPR*4,`rgba(${opt.glow},${k})`);}
        if(opt.thruster){const k=.7+.3*Math.sin(tt*20);const g=ctx.createRadialGradient(thr[0],thr[1],0,thr[0],thr[1],26*SPR*2);g.addColorStop(0,`rgba(${opt.glow},${.7*k})`);g.addColorStop(1,`rgba(${opt.glow},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(thr[0],thr[1],26*SPR*2,0,TAU);ctx.fill();
          for(let i=0;i<5;i++){const q=(tt*2.2+i/5)%1;ctx.fillStyle=`rgba(${opt.glow},${.6*(1-q)})`;ctx.beginPath();ctx.arc(thr[0]+Math.sin(i*7)*4*SPR,thr[1]+q*90*SPR,(3-2*q)*SPR*2,0,TAU);ctx.fill();}}}
      ctx.restore();}});}
  return W;}
/* ---- phoenix: seraph rig + flame recolor + embers ---- */
const FIRE_COL=[['#8a1a08','#e0501a','#ffb040'],['#a02a0a','#f06a20','#ffc860'],['#b83c10','#f88a2c','#ffd880'],['#c85018','#ffa83a','#ffeaa8']];
const SHADOW_COL=[['#0c0812','#2a1e3a','#5a4878'],['#120c1a','#322448','#66528a'],['#181022','#3a2a54','#705c98'],['#1e142a','#44325e','#7c68a8']];
function phoenixGeom(e,x,y,t,moving){SER_PAL=FIRE_COL;SER_S=1;const W=seraphGeom(e,x,y,t,moving);SER_PAL=null;if(!W)return null;
  for(const w of W){const base=w;w.draw=tt=>{drawSeraph(base,tt);if(GP==='body')return;ctx.save();ctx.globalCompositeOperation='lighter';
    const tips=base.F.filter(f=>f.lay<2).map(f=>f.tip);for(let i=0;i<14;i++){const q=tips[(i*5)%tips.length],k=(tt*.9+i/14)%1;const r=(1.2+2*(1-k))*SPR*4;
      const g=ctx.createRadialGradient(q[0],q[1]-k*70*SPR,0,q[0],q[1]-k*70*SPR,r*2);g.addColorStop(0,`rgba(255,220,120,${.8*(1-k)})`);g.addColorStop(1,'rgba(255,90,20,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q[0]+Math.sin(i+tt*3)*5*SPR,q[1]-k*70*SPR,r*2,0,TAU);ctx.fill();}
    const b=base.bone[10];const g=ctx.createRadialGradient(b[0],b[1],0,b[0],b[1],90*SPR);g.addColorStop(0,'rgba(255,140,40,.22)');g.addColorStop(1,'rgba(255,80,20,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(b[0],b[1],90*SPR,0,TAU);ctx.fill();ctx.restore();};}
  return W;}
function shadowGeom(e,x,y,t,moving){SER_PAL=SHADOW_COL;SER_S=1.05;const W=seraphGeom(e,x,y,t,moving);SER_PAL=null;SER_S=1;if(!W)return null;
  for(const w of W){const base=w;w.draw=tt=>{drawSeraph(base,tt);if(GP==='body')return;ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<10;i++){const f=base.F[(i*7)%base.F.length],k=(tt*.5+i/10)%1;ctx.fillStyle=`rgba(150,90,230,${.45*(1-k)})`;ctx.beginPath();ctx.arc(f.tip[0],f.tip[1]+k*50*SPR,(4+6*k)*SPR*1.6,0,TAU);ctx.fill();}ctx.restore();};}
  return W;}
/* ---- six-wing seraph: three stacked pairs ---- */
function sixWingGeom(e,x,y,t,moving){const out=[];const pal=[['#c9a24a','#fff0c0','#ffffff'],['#d4b060','#fff4d0','#ffffff'],['#e0c070','#fff8e0','#ffffff'],['#ecd090','#fffcee','#ffffff']];
  for(const [s,r] of [[.72,.5],[1,0],[.66,-.62]]){SER_S=s;SER_ROT=r;SER_PAL=pal;const W=seraphGeom(e,x,y,t+r,moving);if(W)for(const w of W)out.push(w);}
  SER_S=1;SER_ROT=0;SER_PAL=null;
  for(const w of out){const base=w;w.draw=tt=>{drawSeraph(base,tt);if(GP==='body')return;ctx.save();ctx.globalCompositeOperation='lighter';const k=.5+.5*Math.sin(tt*2);
    for(const f of base.F)if(f.lay===0&&(f===base.F[0]||f===base.F[3]||f===base.F[6]))star4(f.tip[0],f.tip[1],(1+k)*SPR*3,`rgba(255,240,190,${.5+.4*k})`);ctx.restore();};}
  return out;}
/* ---- membrane recolors (demon / dragon) ---- */
function membraneGeom(e,x,y,t,moving,pal,S){const W=batGeom(e,x,y,t,moving);if(!W)return null;
  for(const w of W){const base=w;w.draw=tt=>{if(GP!=='fx'){ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
      fillPoly(base.mem,lgrad(base.mem[0],base.mem[3],pal.mem));
      if(pal.scale){ctx.strokeStyle=pal.scale;ctx.lineWidth=.8*SPR*3;for(let i=1;i<6;i++){ctx.beginPath();base.mem.forEach((q,j)=>{const c=base.mem[0];const xx=c[0]+(q[0]-c[0])*i/6,yy=c[1]+(q[1]-c[1])*i/6;j?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);});ctx.stroke();}}
      ctx.strokeStyle=pal.bone;ctx.lineWidth=5*SPR*1.4;for(const b of base.bones){ctx.beginPath();b.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();}
      for(const b of base.bones){const q=b[b.length-1];ctx.fillStyle=pal.spike;ctx.beginPath();ctx.moveTo(q[0],q[1]-9*SPR);ctx.lineTo(q[0]+3.5*SPR,q[1]+2*SPR);ctx.lineTo(q[0]-3.5*SPR,q[1]+2*SPR);ctx.closePath();ctx.fill();}ctx.restore();}
    if(GP!=='body'&&pal.glow){ctx.save();ctx.globalCompositeOperation='lighter';const k=.6+.4*Math.sin(tt*3);ctx.strokeStyle=`rgba(${pal.glow},${.5*k})`;ctx.lineWidth=1.8*SPR*3;
      for(const b of base.bones){ctx.beginPath();b.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();}ctx.restore();}};}
  return W;}
/* ---- energy wings: pure light outlines (no solid body) ---- */
function energyGeom(e,x,y,t,moving){SER_PAL=null;SER_S=1.05;const W=seraphGeom(e,x,y,t,moving);SER_S=1;if(!W)return null;
  for(const w of W){const base=w;w.draw=tt=>{if(GP==='body')return;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineJoin='round';
    for(const f of base.F){if(f.lay>1)continue;const k=.55+.45*Math.sin(tt*6+f.tip[0]*.05);ctx.strokeStyle=`rgba(90,200,255,${.55*k})`;ctx.lineWidth=2.4*SPR*3;cpoly(f.pts);ctx.stroke();ctx.strokeStyle=`rgba(220,250,255,${.7*k})`;ctx.lineWidth=.9*SPR*3;ctx.stroke();}
    ctx.beginPath();base.bone.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.strokeStyle='rgba(160,230,255,.9)';ctx.lineWidth=3*SPR*3;ctx.stroke();
    if(Math.sin(tt*13)>.6){const a=base.bone[4],b=base.F[(Math.floor(tt*7))%base.F.length].tip;ctx.strokeStyle='rgba(230,250,255,.9)';ctx.lineWidth=1*SPR*3;ctx.beginPath();ctx.moveTo(a[0],a[1]);for(let i=1;i<6;i++){ctx.lineTo(a[0]+(b[0]-a[0])*i/6+(Math.random()-.5)*10*SPR,a[1]+(b[1]-a[1])*i/6+(Math.random()-.5)*10*SPR);}ctx.stroke();}
    ctx.restore();};}
  return W;}
const WING2={
  butterflywings:{g:(e,x,y,t,m)=>butterflyGeom(e,x,y,t,m,{up:['#5a2aa8','#b45ae0','#ffb0f0'],lo:['#3a1a8a','#7a4ad8','#f0a0e8'],vein:'rgba(40,14,70,.75)',eye:['#2a0e4a','#7ff0ff'],dust:'255,190,250'}),
    it:{n:'Fairy Butterfly Wings',d:'ปีกผีเสื้อนางฟ้าสีม่วงชมพู โปรยละอองประกาย FLEE +8 · DEX +1',b:{flee:8,dex:1}}},
  phoenixwings:{g:phoenixGeom,it:{n:'Phoenix Wings',d:'ปีกขนนกเพลิง มีประกายไฟลอยขึ้นตลอด ATK สายไฟ STR +2',b:{flee:6,str:2}}},
  mechawings:{g:(e,x,y,t,m)=>shardGeom(e,x,y,t,m,{phi:.5,amp:.06,fs:1.6,th:[-20,5,30,55,78],L:[140,190,210,190,140],W:[17,19,20,19,16],shape:'plate',col:['#1e2636','#55657e','#a8b6cc'],rib:'rgba(120,230,255,.8)',glow:'90,210,255',gs:5,thruster:1,dy:-6}),
    it:{n:'Mecha Thruster Wings',d:'ปีกจักรกลแผ่นเหล็ก มีไอพ่นฟ้าเรืองแสง AGI +2',b:{flee:6,agi:2}}},
  leafwings:{g:(e,x,y,t,m)=>shardGeom(e,x,y,t,m,{phi:.3,amp:.12,fs:2.2,th:[-35,-12,12,36,60,82],L:[90,130,160,170,150,110],W:[18,22,26,26,22,18],shape:'leaf',col:['#2a6a1e','#62b03a','#c8f08a'],rib:'rgba(230,255,190,.75)',glow:null,dy:0}),
    it:{n:'Sylvan Leaf Wings',d:'ปีกใบไม้แห่งป่าลึก VIT +2',b:{flee:6,vit:2}}},
  voidwings:{g:(e,x,y,t,m)=>shardGeom(e,x,y,t,m,{phi:.24,amp:.14,fs:3,th:[-30,-10,10,30,50,70,88],L:[96,140,184,214,206,170,118],W:[14,17,20,22,21,18,14],shape:'crystal',col:['#2a0e5a','#7a3ad8','#e8c8ff'],rib:'rgba(255,220,255,.75)',glow:'200,120,255',gs:3,stars:1}),
    it:{n:'Void Crystal Wings',d:'ปีกคริสตัลแห่งความว่างเปล่า ประกายดาวที่ปลาย INT +2',b:{flee:8,int:2}}},
  energywings:{g:energyGeom,it:{n:'Arc Energy Wings',d:'ปีกพลังงานไฟฟ้าโปร่งแสง มีสายฟ้าแลบ DEX +2',b:{flee:8,dex:2}}},
  demonwings:{g:(e,x,y,t,m)=>membraneGeom(e,x,y,t,m,{mem:['#1a0406','#6a0a14','#c42a2a'],bone:'#140406',spike:'#e8d8c8',glow:'255,60,40'}),
    it:{n:'Archfiend Wings',d:'ปีกจอมมารเส้นเลือดเรืองแดง STR +2',b:{flee:6,str:2}}},
  dragonwings:{g:(e,x,y,t,m)=>membraneGeom(e,x,y,t,m,{mem:['#0e3a1e','#2a7a3a','#8ad06a'],bone:'#0a2412',spike:'#f0e6c0',scale:'rgba(10,40,20,.35)',glow:null}),
    it:{n:'Emerald Dragon Wings',d:'ปีกมังกรเกล็ดมรกต VIT +1 · STR +1',b:{flee:6,vit:1,str:1}}},
  shadowwings:{g:shadowGeom,it:{n:'Fallen Shadow Wings',d:'ปีกขนนกดำของเทวทูตตกสวรรค์ มีหมอกม่วงลอย LUK +2',b:{flee:8,luk:2}}},
  sixwings:{g:sixWingGeom,it:{n:'Seraphim Six Wings',d:'ปีกเทวทูตชั้นสูงหกปีก ส่องประกายศักดิ์สิทธิ์ ALL +1',b:{flee:10,str:1,agi:1,vit:1,int:1,dex:1,luk:1}}},
};
/* ---------- Wing pack 3: reference-matched styles (uv-shape wings with curved feathers, facets, clipped star fields) ---------- */
function curvFeather(bu,bv,angDeg,len,wid,bend,n=9){const pts=[],L=[],R=[],c=[];let a=angDeg*Math.PI/180,u=bu,v=bv;const da=bend/n,step=len/n;
  for(let i=0;i<=n;i++){c.push([u,v,a]);u+=Math.cos(a)*step;v+=Math.sin(a)*step;a+=da;}
  for(let i=0;i<=n;i++){const s=i/n,w=wid*Math.sqrt(Math.max(0,1-s*s*s))*(.5+.5*Math.min(1,s*3)),[cu,cv,ca]=c[i];L.push([cu-Math.sin(ca)*w,cv+Math.cos(ca)*w]);R.push([cu+Math.sin(ca)*w,cv-Math.cos(ca)*w]);}
  return {uv:[...L,...R.reverse()],spine:c.map(q=>[q[0],q[1]]),g0:[bu,bv],g1:c[n].slice(0,2)};}
function boneAt(B,t){const m=1-t;return [m*m*B[0][0]+2*m*t*B[1][0]+t*t*B[2][0],m*m*B[0][1]+2*m*t*B[1][1]+t*t*B[2][1]];}
function sleekShapes(t,o){const B=[[0,0],[56,26],[104,74]],S=[];
  [[.08,-66,44,13,.45],[.26,-52,56,14,.4],[.46,-38,62,14,.35],[.64,-24,58,13,.3]].forEach(([k,a,l,w,b],i)=>{const [u,v]=boneAt(B,k);S.push({...curvFeather(u,v,a,l*(o.L||1),w,b),lay:0});});
  [[.3,86,64,18,-.3],[.48,76,82,19,-.32],[.64,66,98,20,-.34],[.8,56,110,20,-.36],[.94,46,116,19,-.38],[1,34,108,17,-.4]].forEach(([k,a,l,w,b],i)=>{const [u,v]=boneAt(B,k);const fl=o.flick?1+.07*Math.sin(t*13+i*2.1):1;S.push({...curvFeather(u,v,a,l*fl*(o.L||1),w*(o.W||1),b*(o.bend||1)),lay:1});});
  [[.12,40,34,16,.1],[.36,34,40,16,.1],[.6,28,42,16,.08],[.84,22,40,15,.06]].forEach(([k,a,l,w,b])=>{const [u,v]=boneAt(B,k);S.push({...curvFeather(u,v,a,l,w,b,6),lay:2});});
  return S;}
function flameShapes(t){const B=[[0,0],[48,22],[92,60]],S=[];
  [[.25,96,82,20,-1.6],[.5,80,104,20,-1.5],[.72,64,118,19,-1.35],[.92,46,112,17,-1.2],[1,26,86,15,-1.0]].forEach(([k,a,l,w,b],i)=>{const [u,v]=boneAt(B,k);const fl=1+.08*Math.sin(t*12+i*1.9);S.push({...curvFeather(u,v,a,l*fl,w,b*(1+.06*Math.sin(t*9+i)),11),lay:1});});
  [[.2,-60,70,18,1.9],[.55,-40,60,15,1.6]].forEach(([k,a,l,w,b],i)=>{const [u,v]=boneAt(B,k);const fl=1+.08*Math.sin(t*11+i*3);S.push({...curvFeather(u,v,a,l*fl,w,b,11),lay:0});});
  return S;}
function crystalShapes(t){const S=[];
  const shard=(bu,bv,a,l,w,lay,skew=.15)=>{const A=a*Math.PI/180,dx=Math.cos(A),dy=Math.sin(A),px=-dy,py=dx;
    const p0=[bu,bv],tip=[bu+dx*l,bv+dy*l],s1=[bu+dx*l*(.35)+px*w,bv+dy*l*.35+py*w],s2=[bu+dx*l*(.5+skew)-px*w*.85,bv+dy*l*(.5+skew)-py*w*.85],mid=[bu+dx*l*.45,bv+dy*l*.45];
    S.push({uv:[p0,s1,tip,s2],facets:[[p0,s1,tip,mid],[p0,mid,tip,s2]],g0:p0,g1:tip,lay});};
  shard(10,6,72,92,16,1);shard(22,16,58,132,20,1);shard(38,26,44,150,22,1,.2);shard(54,30,30,128,20,1);shard(66,30,14,96,16,1);
  shard(30,4,-12,84,16,0);shard(22,-4,-34,72,14,0);shard(12,-6,-58,56,12,0);
  shard(40,22,40,70,12,2);shard(24,10,60,58,11,2);
  return S;}
function glacierShapes(t){const S=[];
  // crystal: base -> shoulder L -> tip -> shoulder R, ridge from base to tip; three faces (lit / mid / shadow)
  const shard=(bu,bv,a,l,w,lay)=>{const A=a*Math.PI/180,dx=Math.cos(A),dy=Math.sin(A),px=-dy,py=dx;const P2=(f,k)=>[bu+dx*l*f+px*w*k,bv+dy*l*f+py*w*k];
    const b=P2(0,0),sL=P2(.32,1),sR=P2(.42,-.9),tip=P2(1,0),bL=P2(.06,.45),bR=P2(.08,-.4),r1=P2(.36,.1),hi0=P2(.3,.62),hi1=P2(.86,.12);
    S.push({uv:[bL,sL,tip,sR,bR],faces:[[bL,sL,tip,r1],[r1,tip,sR],[bR,r1,sR],[bL,b,bR,r1]],hl:[hi0,hi1],ridge:[r1,tip],g0:b,g1:tip,lay});};
  // back tier: tall spires
  [[10,16,74,176,24],[26,26,62,206,27],[44,34,50,192,26],[62,38,38,162,23]].forEach(([u,v,a,l,w])=>shard(u,v,a,l,w,0));
  // between-spire small shards
  [[18,24,68,120,15],[36,32,56,130,16],[54,38,44,118,15],[70,40,30,100,13]].forEach(([u,v,a,l,w])=>shard(u,v,a,l,w,0));
  // outward blades
  [[40,16,22,146,23],[46,8,6,132,21],[44,0,-10,116,20],[48,12,14,96,15]].forEach(([u,v,a,l,w])=>shard(u,v,a,l,w,1));
  // drooping lower shards
  [[32,-6,-30,104,19],[22,-10,-48,88,17],[12,-10,-66,70,15],[28,-8,-40,70,12]].forEach(([u,v,a,l,w])=>shard(u,v,a,l,w,1));
  // front inner crystals over the root
  [[10,8,64,86,18],[22,8,38,84,18],[28,0,6,72,16],[20,-4,-24,58,14],[14,4,20,50,12]].forEach(([u,v,a,l,w])=>shard(u,v,a,l,w,2));
  return S;}
function drawCrystalSet(shapes,P,tt,cfg){ctx.save();ctx.lineJoin='round';ctx.lineCap='round';const LW=SPR*3;
  if(GP!=='fx'){for(let lay=0;lay<3;lay++)for(const s of shapes){if(s.lay!==lay)continue;const q=s.uv.map(v=>P(v[0],v[1]));
      const F=s.faces.map(f=>f.map(v=>P(v[0],v[1]))),dk=lay===0?.12:0;
      fillPoly(F[0],lgrad(F[0][0],F[0][2],[cfg.lit[0],cfg.lit[1],cfg.lit[2]]));   // lit face
      fillPoly(F[1],lgrad(F[1][0],F[1][1],[cfg.mid[0],cfg.mid[1]]));               // mid face
      fillPoly(F[2],lgrad(F[2][0],F[2][2],[cfg.shd[0],cfg.shd[1]]));               // shadow face
      fillPoly(F[3],cfg.shd[0]);
      if(dk){ctx.fillStyle=`rgba(20,60,140,${dk})`;cpoly(q);ctx.fill();}
      const h=s.hl.map(v=>P(v[0],v[1]));ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=1.6*LW;ctx.beginPath();ctx.moveTo(h[0][0],h[0][1]);ctx.lineTo(h[1][0],h[1][1]);ctx.stroke();
      const r=s.ridge.map(v=>P(v[0],v[1]));ctx.strokeStyle='rgba(225,248,255,.85)';ctx.lineWidth=.9*LW;ctx.beginPath();ctx.moveTo(r[0][0],r[0][1]);ctx.lineTo(r[1][0],r[1][1]);ctx.stroke();
      ctx.strokeStyle=cfg.edge;ctx.lineWidth=1.05*LW;cpoly(q);ctx.stroke();}}
  if(GP!=='body'){ctx.globalCompositeOperation='lighter';const k=.75+.25*Math.sin(tt*3);
    for(let i=0;i<9;i++){const s2=shapes[(i*5)%shapes.length],t=P(...s2.g1),kk=.5+.5*Math.sin(tt*2.6+i*1.7);if(kk>.55)star4(t[0],t[1],(1+1.6*kk)*LW,`rgba(240,253,255,${kk})`);}}
  ctx.restore();}
const NEB_SIL=[[2,6],[14,64],[2,122],[38,104],[46,176],[72,126],[100,196],[112,132],[150,176],[150,112],[196,136],[172,74],[206,62],[164,22],[184,-2],[150,-12],[176,-46],[132,-42],[142,-86],[102,-58],[92,-100],[66,-58],[40,-90],[32,-40],[4,-12]];
const NEB_STARS=(()=>{const o=[];let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<46;i++)o.push([10+r()*180,-80+r()*250,.6+r()*1.4]);return o;})();
const NEB_LINES=[[[30,40],[58,62],[52,96],[80,110],[96,150]],[[120,80],[140,104],[160,96],[176,72]],[[60,10],[86,30],[110,22],[128,46]],[[40,140],[64,152]]];
function uvWingGeom(e,x,y,t,moving,cfg){const R=rigFor(e,x,y,cfg.dy||0);if(!R)return null;const ph=Math.sin(t*(moving?cfg.fs*1.8:cfg.fs)),W=[];
  for(const side of [-1,1]){const P=planeP(R,side,cfg.phi+(moving?cfg.pamp*1.6:cfg.pamp)*ph,cfg.tau||.1,cfg.S||1,(cfg.rot0||0)+(moving?cfg.ramp*1.5:cfg.ramp)*ph,cfg.root||[8,0,-14]);
    const shapes=evolveShapes(cfg.build(t)).map(s=>({...s,pts:s.uv.map(q=>P(q[0],q[1])),G0:P(...s.g0),G1:P(...s.g1),sp:s.spine?s.spine.map(q=>P(q[0],q[1])):null,fc:s.facets?s.facets.map(f=>f.map(q=>P(q[0],q[1]))):null}));
    const dep=shapes.reduce((a,s)=>a+s.G1[2],0)/shapes.length;
    W.push({front:dep>R.body,draw:tt=>cfg.draw(shapes,P,tt,cfg)});}
  W.outline=cfg.outline;W.crisp=cfg.crisp;W.grade=false;return W;}
function drawFeatherSet(shapes,P,tt,cfg){ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  if(GP!=='fx'){for(let lay=0;lay<3;lay++)for(const s of shapes){if(s.lay!==lay)continue;const c=cfg.col[lay]||cfg.col[0];fillPoly(s.pts,lgrad(s.G0,s.G1,c));
      if(s.sp&&cfg.shaft){ctx.strokeStyle=cfg.shaft;ctx.lineWidth=1.2*SPR*3;ctx.beginPath();s.sp.slice(1,-2).forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();}
      if(s.fc){ctx.fillStyle=cfg.facet;cpoly(s.fc[1]);ctx.fill();if(cfg.edge){ctx.strokeStyle=cfg.edge;ctx.lineWidth=2*SPR*3;cpoly(s.pts);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1*SPR*3;ctx.beginPath();ctx.moveTo(s.fc[0][0][0],s.fc[0][0][1]);ctx.lineTo(s.fc[0][1][0],s.fc[0][1][1]);ctx.stroke();}ctx.strokeStyle=cfg.shaft;ctx.lineWidth=.9*SPR*3;ctx.beginPath();ctx.moveTo(s.fc[0][0][0],s.fc[0][0][1]);ctx.lineTo(s.fc[0][3][0],s.fc[0][3][1]);ctx.lineTo(s.fc[0][2][0],s.fc[0][2][1]);ctx.stroke();}}}
  if(GP!=='body'){ctx.globalCompositeOperation='lighter';const k=.75+.25*Math.sin(tt*3);ctx.shadowColor=`rgba(${cfg.glow},${.9*k})`;ctx.shadowBlur=14;
    for(const s of shapes){ctx.fillStyle=`rgba(${cfg.glow},${.12*k})`;cpoly(s.pts);ctx.fill();}ctx.shadowBlur=0;
    if(cfg.fx)cfg.fx(shapes,P,tt);}
  ctx.restore();}
function drawNebula(shapes,P,tt,cfg){const sil=shapes[0];ctx.save();ctx.lineJoin='round';
  if(GP!=='fx'){fillPoly(sil.pts,lgrad(P(80,190),P(80,-90),['#100838','#180e4c','#241462','#341c7a','#4a2890','#7a3c9e','#e0709a','#ff9c8c','#ffc0a8']));
    ctx.save();cpoly(sil.pts);ctx.clip();
    ctx.globalCompositeOperation='lighter';const neb=ctx.createRadialGradient(...P(110,120).slice(0,2),0,...P(110,120).slice(0,2),70*SPR*2.4);neb.addColorStop(0,'rgba(140,90,220,.35)');neb.addColorStop(1,'rgba(140,90,220,0)');ctx.fillStyle=neb;ctx.fillRect(-1e4,-1e4,2e4,2e4);ctx.globalCompositeOperation='source-over';
    ctx.strokeStyle='rgba(235,225,255,.75)';ctx.lineWidth=1*SPR*3;for(const L of NEB_LINES){ctx.beginPath();L.forEach((q,i)=>{const p=P(q[0],q[1]);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});ctx.stroke();}
    for(const L of NEB_LINES)for(const q of L){const p=P(q[0],q[1]);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p[0],p[1],2.4*SPR*2,0,TAU);ctx.fill();}
    for(const [u,v,r] of NEB_STARS){if(v<-20)continue;const p=P(u,v);ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(p[0],p[1],r*SPR*1.6,0,TAU);ctx.fill();}
    const m=P(98,92);const mg=ctx.createRadialGradient(m[0],m[1],0,m[0],m[1],17*SPR*1.4);mg.addColorStop(0,'#ffffff');mg.addColorStop(.75,'#f4f0ff');mg.addColorStop(1,'rgba(220,210,255,.0)');ctx.fillStyle=mg;ctx.beginPath();ctx.arc(m[0],m[1],17*SPR*1.4,0,TAU);ctx.fill();
    ctx.restore();
    ctx.strokeStyle='rgba(255,200,220,.45)';ctx.lineWidth=1.4*SPR*3;cpoly(sil.pts);ctx.stroke();}
  if(GP!=='body'){ctx.globalCompositeOperation='lighter';ctx.shadowColor='rgba(200,140,255,.8)';ctx.shadowBlur=16;ctx.fillStyle='rgba(180,120,255,.08)';cpoly(sil.pts);ctx.fill();ctx.shadowBlur=0;
    for(let i=0;i<9;i++){const q=NEB_STARS[i*5],k=.5+.5*Math.sin(tt*3+i*1.7);if(k<.4)continue;const p=P(q[0],q[1]);star4(p[0],p[1],(1+1.6*k)*SPR*3,`rgba(255,240,255,${.8*k})`);}
    for(let i=0;i<6;i++){const k=(tt*.4+i/6)%1,q=NEB_SIL[14+i%10],p=P(q[0],q[1]-k*30);star4(p[0],p[1],(1.6*(1-k))*SPR*3,`rgba(255,220,200,${.7*(1-k)})`);}}
  ctx.restore();}
const WING3={
  glacierwings:{cfg:{phi:.34,pamp:.05,fs:1.8,ramp:.1,rot0:-.12,S:1.5,dy:-14,root:[30,0,-14],build:glacierShapes,draw:drawCrystalSet,crisp:true,
    lit:['#eaf9ff','#bfe9ff','#9ad8fb'],mid:['#7ec6f4','#5aa8ea'],shd:['#3f86d6','#2a66bc'],edge:'rgba(26,78,160,.95)',glow:'140,215,255',outline:'rgba(14,44,110,1)'},
    it:{n:'Glacier Seraph Wings',d:'ปีกผลึกน้ำแข็งขนาดใหญ่ เหลี่ยมคริสตัลสองโทนเรียงซ้อนสามชั้น ประกายระยิบที่ปลาย INT +2 · AGI +1',b:{flee:10,int:2,agi:1}}},
  azurewings:{cfg:{phi:.42,pamp:.06,fs:2.4,ramp:.2,rot0:.05,S:1,dy:-6,build:t=>sleekShapes(t,{}),draw:drawFeatherSet,
    col:[['#1a4ab8','#4aa0f0','#c8ecff'],['#1c56cc','#5ab8ff','#effaff'],['#3a7ae0','#8ad0ff','#ffffff']],shaft:'rgba(255,255,255,.6)',glow:'110,190,255',outline:'rgba(18,48,128,.95)'},
    it:{n:'Azure Sky Wings',d:'ปีกขนนกสีฟ้าใสเรืองแสง ปลายปีกโค้งพลิ้ว AGI +2',b:{flee:8,agi:2}}},
  crimsonwings:{cfg:{phi:.42,pamp:.06,fs:2.4,ramp:.2,rot0:.05,S:1,dy:-6,build:t=>sleekShapes(t,{W:1.05}),draw:drawFeatherSet,
    col:[['#0a0204','#3a0a12','#8a1c2c'],['#0c0306','#4a0c18','#b02a3c'],['#14040a','#5a1420','#c03a4a']],shaft:'rgba(255,120,140,.35)',glow:'255,40,80',outline:'rgba(30,2,8,.95)',
    fx:(sh,P,tt)=>{for(let i=0;i<8;i++){const s=sh[(i*3)%sh.length],k=(tt*.45+i/8)%1;ctx.fillStyle=`rgba(255,60,90,${.25*(1-k)})`;ctx.beginPath();ctx.arc(s.G1[0],s.G1[1]-k*40*SPR,(5+10*k)*SPR*1.4,0,TAU);ctx.fill();}}},
    it:{n:'Crimson Wraith Wings',d:'ปีกขนนกดำแดงมีไอเลือดลอย STR +2',b:{flee:8,str:2}}},
  blazewings:{cfg:{phi:.4,pamp:.05,fs:2.8,ramp:.14,rot0:.08,S:1.25,dy:-4,build:flameShapes,draw:drawFeatherSet,
    col:[['#c83a08','#ff8a1a','#ffe27a'],['#d84a0a','#ffa024','#fff2a8']],shaft:'rgba(255,250,200,.5)',glow:'255,150,40',outline:'rgba(150,40,6,.95)',
    fx:(sh,P,tt)=>{for(let i=0;i<10;i++){const s=sh[i%sh.length],k=(tt*1.1+i/10)%1;const r=(1.5+2.5*(1-k))*SPR*4;const g=ctx.createRadialGradient(s.G1[0],s.G1[1]-k*60*SPR,0,s.G1[0],s.G1[1]-k*60*SPR,r);g.addColorStop(0,`rgba(255,230,140,${.8*(1-k)})`);g.addColorStop(1,'rgba(255,100,20,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(s.G1[0],s.G1[1]-k*60*SPR,r,0,TAU);ctx.fill();}}},
    it:{n:'Blaze Spirit Wings',d:'ปีกเปลวไฟม้วนเป็นเกลียว ลุกโชนตลอดเวลา STR +1 · INT +1',b:{flee:6,str:1,int:1}}},
  frostcrystalwings:{cfg:{phi:.36,pamp:.05,fs:2,ramp:.12,rot0:0,S:1.3,dy:-4,build:crystalShapes,draw:drawFeatherSet,
    col:[['#2a78c8','#7cc4f0','#e6f8ff'],['#3a8ad8','#9ad6fa','#f4fcff'],['#4a9ae0','#b4e2ff','#ffffff']],facet:'rgba(30,90,170,.32)',shaft:'rgba(255,255,255,.75)',glow:'150,220,255',outline:'rgba(26,70,140,.95)',
    fx:(sh,P,tt)=>{for(let i=0;i<6;i++){const s=sh[(i*2)%sh.length],k=.5+.5*Math.sin(tt*3.3+i*1.9);if(k>.55)star4(s.G1[0],s.G1[1],(1+1.4*k)*SPR*3,`rgba(230,250,255,${k})`);}}},
    it:{n:'Frost Crystal Wings',d:'ปีกผลึกน้ำแข็งเหลี่ยมเพชร สะท้อนแสงระยิบ INT +2',b:{flee:8,int:2}}},
  nebulawings:{cfg:{phi:.2,pamp:.04,fs:1.4,ramp:.06,rot0:.22,S:1.6,dy:-30,root:[22,0,-14],build:()=>[{uv:NEB_SIL,g0:[80,190],g1:[80,-90],lay:0}],draw:drawNebula,outline:'rgba(30,14,64,.9)'},
    it:{n:'Starlit Nebula Wings',d:'ปีกกลุ่มดาวขนาดใหญ่ ไล่สีม่วงสู่ชมพู มีดวงจันทร์และกลุ่มดาวในปีก LUK +3',b:{flee:10,luk:3}}},
};
for(const k in WING3)WING2[k]={g:(e,x,y,t,m)=>uvWingGeom(e,x,y,t,m,WING3[k].cfg),it:WING3[k].it};
/* ---------- City-theme wings: Viking / Greek / Egypt / Aztec / Japan ---------- */
function bezQ(B,t){const m=1-t;return [m*m*B[0][0]+2*m*t*B[1][0]+t*t*B[2][0],m*m*B[0][1]+2*m*t*B[1][1]+t*t*B[2][1]];}
function themedShapes(o){const S=[],B=o.B;
  const add=(k,ang,len,wid,bend,lay,c,tip)=>{const [u,v]=bezQ(B,k);const f=curvFeather(u,v,ang,len,wid,bend,9);f.lay=lay;f.c=c;f.tip=tip;f.tipuv=f.uv.slice(6,14);S.push(f);};
  for(const row of o.rows){for(let i=0;i<row.n;i++){const k=row.n>1?i/(row.n-1):0;
    add(row.t0+(row.t1-row.t0)*k,row.a0+(row.a1-row.a0)*k,(row.l0+(row.l1-row.l0)*Math.sin(Math.PI*Math.min(1,k*(row.peak||1)))*(row.sin===false?0:1))+(row.sin===false?(row.l1-row.l0)*k:0),row.w,row.b||0,row.lay,row.c,row.tip);}}
  return S;}
function drawThemed(shapes,P,tt,cfg){ctx.save();ctx.lineJoin='round';ctx.lineCap='round';const LW=SPR*3;
  if(GP!=='fx'){
    for(let lay=0;lay<4;lay++)for(const s of shapes){if(s.lay!==lay)continue;const col=cfg.pal[s.c];
      fillPoly(s.pts,lgrad(s.G0,s.G1,col));
      if(s.tip){const tp=s.tipuv.map(q=>P(q[0],q[1]));fillPoly(tp,cfg.tipc[s.tip]);}
      ctx.strokeStyle=cfg.vein;ctx.lineWidth=.8*LW;cpoly(s.pts);ctx.stroke();
      if(s.sp&&cfg.shaft){ctx.strokeStyle=cfg.shaft;ctx.lineWidth=.8*LW;ctx.beginPath();s.sp.slice(1,-2).forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();}}
    if(cfg.bone){const bp=[];for(let i=0;i<=16;i++){const q=bezQ(cfg.B,i/16);bp.push(P(q[0],q[1]));}
      ctx.beginPath();bp.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.strokeStyle=cfg.bone[0];ctx.lineWidth=cfg.bone[2]*1.35*LW;ctx.stroke();ctx.strokeStyle=cfg.bone[1];ctx.lineWidth=cfg.bone[2]*LW;ctx.stroke();
      if(cfg.boneDeco)cfg.boneDeco(bp,P,tt,LW);}
    if(cfg.extra)cfg.extra(shapes,P,tt,LW);}
  if(GP!=='body'&&cfg.fx){ctx.globalCompositeOperation='lighter';cfg.fx(shapes,P,tt,LW);}
  ctx.restore();}
const ANGEL_ROWS=(c)=>[
  {n:7,t0:.6,t1:1,a0:-80,a1:-22,l0:118,l1:158,w:15,b:.25,lay:0,c:c.p,tip:c.pt},
  {n:7,t0:.06,t1:.6,a0:-98,a1:-82,l0:96,l1:126,w:15,b:.1,lay:1,c:c.s,tip:c.st,sin:false},
  {n:10,t0:.05,t1:1,a0:-96,a1:-36,l0:52,l1:64,w:14,b:.1,lay:2,c:c.c,tip:c.ct},
  {n:11,t0:.03,t1:1,a0:-94,a1:-40,l0:26,l1:34,w:13,b:.05,lay:3,c:c.l,tip:c.lt}];
const ANGEL_B=[[0,0],[34,78],[128,104]];
function petal(x,y,r,rot,col){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,-r);ctx.bezierCurveTo(r*.9,-r*.6,r*.7,r*.6,0,r);ctx.bezierCurveTo(-r*.7,r*.6,-r*.9,-r*.6,0,-r);ctx.fill();ctx.restore();}
const CITY_WINGS={
  vikingwings:{n:'Valkyrie Raven Wings',d:'ปีกอีกาของวัลคิรี ขนดำอมน้ำเงิน ปลายขนเงิน ห่วงแขนทองสลักรูนที่โคนปีก STR +2 · VIT +1',b:{flee:8,str:2,vit:1},
    cfg:{phi:.4,pamp:.06,fs:2.2,ramp:.12,rot0:0,S:1.38,dy:-22,B:ANGEL_B,build:()=>themedShapes({B:ANGEL_B,rows:ANGEL_ROWS({p:'p',pt:'sil',s:'s',st:null,c:'c',ct:null,l:'l',lt:null})}),draw:drawThemed,
      pal:{p:['#14161e','#2a3040','#4a5468'],s:['#181a24','#30384a','#566078'],c:['#22283a','#3a4458','#64708a'],l:['#2a3246','#485470','#7a88a4']},tipc:{sil:'#b8c4d6'},vein:'rgba(6,8,14,.75)',shaft:'rgba(170,190,220,.35)',
      bone:['#0c0e16','#3a4258',4],boneDeco:(bp,P,tt,LW)=>{for(const k of [3,4]){const q=bp[k];ctx.fillStyle='#d8a838';ctx.beginPath();ctx.ellipse(q[0],q[1],5*LW,3*LW,0,0,TAU);ctx.fill();ctx.strokeStyle='#6a4a10';ctx.lineWidth=.8*LW;ctx.stroke();}
        const q=bp[12];ctx.strokeStyle='#8a6a2a';ctx.lineWidth=.9*LW;ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0]+2*LW,q[1]+22*LW);ctx.stroke();ctx.fillStyle='#d8a838';ctx.beginPath();ctx.arc(q[0]+2*LW,q[1]+24*LW,2.4*LW,0,TAU);ctx.fill();ctx.fillStyle='#e8e2d4';ctx.beginPath();ctx.moveTo(q[0]-1.5*LW,q[1]+26*LW);ctx.lineTo(q[0]+5.5*LW,q[1]+26*LW);ctx.lineTo(q[0]+2*LW,q[1]+36*LW);ctx.closePath();ctx.fill();},
      fx:(sh,P,tt,LW)=>{const k=.5+.5*Math.sin(tt*2);ctx.fillStyle=`rgba(120,170,255,${.12*k})`;for(const s of sh)if(s.lay===0){cpoly(s.pts);ctx.fill();}},
      outline:'rgba(6,8,14,.95)'}},
  greekwings:{n:'Olympian Laurel Wings',d:'ปีกเทพโอลิมปัส ขนขาวหินอ่อนปลายทอง แนวกระดูกทองลายคลื่น มีใบลอเรลประดับ INT +2 · LUK +1',b:{flee:10,int:2,luk:1},
    cfg:{phi:.42,pamp:.05,fs:2,ramp:.1,rot0:0,S:1.38,dy:-22,B:ANGEL_B,build:()=>themedShapes({B:ANGEL_B,rows:ANGEL_ROWS({p:'p',pt:'gold',s:'s',st:'gold',c:'c',ct:null,l:'l',lt:null})}),draw:drawThemed,
      pal:{p:['#c8c2b4','#ede8de','#ffffff'],s:['#cfc9bc','#f0ece2','#ffffff'],c:['#d8d2c4','#f4f0e8','#ffffff'],l:['#e0dacd','#f8f5ee','#ffffff']},tipc:{gold:'#e2b84a'},vein:'rgba(120,104,80,.6)',shaft:'rgba(200,170,110,.45)',
      bone:['#8a6418','#f0c858',5],boneDeco:(bp,P,tt,LW)=>{ctx.strokeStyle='#8a6418';ctx.lineWidth=.9*LW;for(let i=1;i<15;i+=2){const a=bp[i],b=bp[i+1];ctx.beginPath();ctx.moveTo(a[0],a[1]-1.5*LW);ctx.lineTo(a[0],a[1]+1.5*LW);ctx.lineTo(b[0],b[1]+1.5*LW);ctx.stroke();}
        for(let i=3;i<16;i+=3){const q=bp[i],n=bp[i+1]||bp[i],an=Math.atan2(n[1]-q[1],n[0]-q[0]);for(const sd of [-1,1]){ctx.fillStyle=sd>0?'#7a9a3a':'#a4bc56';ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(an+sd*.9);ctx.beginPath();ctx.ellipse(4.5*LW,0,4.5*LW,1.8*LW,0,0,TAU);ctx.fill();ctx.restore();}}},
      fx:(sh,P,tt,LW)=>{for(let i=0;i<6;i++){const s=sh[(i*3)%sh.length],k=.5+.5*Math.sin(tt*2.4+i*1.6);if(k>.6)star4(s.G1[0],s.G1[1],(1+1.3*k)*LW,`rgba(255,236,170,${k})`);}},
      outline:'rgba(110,86,40,.95)'}},
  egyptwings:{n:'Wings of Horus',d:'ปีกเทพอียิปต์ ขนตรงเรียงเป็นแถบสีลาพิส เทอร์คอยซ์ ทอง และแดง กางแผ่ออกด้านข้าง INT +1 · DEX +2',b:{flee:10,int:1,dex:2},
    cfg:{phi:.24,pamp:.04,fs:1.6,ramp:.06,rot0:.1,S:1.35,dy:-18,B:[[0,0],[60,30],[156,30]],build:()=>themedShapes({B:[[0,0],[60,30],[156,30]],rows:[
        {n:12,t0:.04,t1:1,a0:-92,a1:-88,l0:96,l1:128,w:9,lay:0,c:'lap',tip:'red',sin:false},
        {n:12,t0:.04,t1:1,a0:-92,a1:-88,l0:62,l1:84,w:9,lay:1,c:'tur',tip:'gold',sin:false},
        {n:12,t0:.04,t1:1,a0:-92,a1:-88,l0:34,l1:46,w:9,lay:2,c:'gold',tip:'lap',sin:false},
        {n:14,t0:.02,t1:1,a0:-92,a1:-88,l0:16,l1:20,w:7,lay:3,c:'red',tip:null,sin:false}]}),draw:drawThemed,
      pal:{lap:['#14286a','#23419e','#3a62c8'],tur:['#167a7a','#22a6a0','#58d0c4'],gold:['#a07418','#e2b43c','#fae08a'],red:['#8a1e16','#c23a26','#e8604a']},tipc:{red:'#c23a26',gold:'#e8bc48',lap:'#23419e'},vein:'rgba(30,20,6,.8)',shaft:null,
      bone:['#5a3e0c','#e8bc48',6],boneDeco:(bp,P,tt,LW)=>{for(let i=1;i<16;i+=3){const q=bp[i];ctx.fillStyle=i%2?'#22a6a0':'#23419e';ctx.beginPath();ctx.arc(q[0],q[1],2.6*LW,0,TAU);ctx.fill();}},
      fx:(sh,P,tt,LW)=>{const k=.5+.5*Math.sin(tt*1.7);for(const s of sh)if(s.c==='gold'){ctx.fillStyle=`rgba(255,220,120,${.18*k})`;cpoly(s.pts);ctx.fill();}},
      outline:'rgba(40,24,6,.95)'}},
  aztecwings:{n:'Quetzal Serpent Wings',d:'ปีกงูขนนกเควตซัล ขนยาวเขียวมรกตเหลือบ โคนขนลายแดง เทอร์คอยซ์ และทอง ประดับลูกปัดหยก AGI +2 · DEX +1',b:{flee:10,agi:2,dex:1},
    cfg:{phi:.38,pamp:.07,fs:2.4,ramp:.14,rot0:0,S:1.38,dy:-22,B:ANGEL_B,build:(t)=>themedShapes({B:ANGEL_B,rows:[
        {n:6,t0:.62,t1:1,a0:-84,a1:-26,l0:150,l1:196,w:12,b:.55+.06*Math.sin(t*3),lay:0,c:'q',tip:'qt'},
        {n:7,t0:.06,t1:.6,a0:-98,a1:-84,l0:100,l1:136,w:13,b:.3,lay:1,c:'q2',tip:'qt',sin:false},
        {n:10,t0:.05,t1:1,a0:-96,a1:-38,l0:50,l1:60,w:13,b:.1,lay:2,c:'tur',tip:'red'},
        {n:11,t0:.03,t1:1,a0:-94,a1:-40,l0:26,l1:32,w:12,b:.05,lay:3,c:'gold',tip:'red'}]}),draw:drawThemed,
      pal:{q:['#0c5a3a','#18a060','#8ae84a'],q2:['#0e6440','#1fae6a','#9af060'],tur:['#127a86','#20b0b4','#6ae0d8'],gold:['#a06c10','#e6b030','#fbe07a']},tipc:{qt:'#1a3a8a',red:'#c4282a'},vein:'rgba(6,30,18,.7)',shaft:'rgba(220,255,180,.4)',
      bone:['#5a2a08','#c4282a',5],boneDeco:(bp,P,tt,LW)=>{for(let i=1;i<16;i+=2){const q=bp[i];ctx.fillStyle=i%4===1?'#3ab878':'#e6b030';ctx.beginPath();ctx.arc(q[0],q[1],2.4*LW,0,TAU);ctx.fill();ctx.strokeStyle='rgba(20,30,10,.7)';ctx.lineWidth=.6*LW;ctx.stroke();}},
      fx:(sh,P,tt,LW)=>{for(const s of sh){if(s.lay)continue;const k=.5+.5*Math.sin(tt*3+s.G1[0]*.05);ctx.strokeStyle=`rgba(140,255,200,${.35*k})`;ctx.lineWidth=1.4*LW;cpoly(s.pts);ctx.stroke();}},
      outline:'rgba(8,30,18,.95)'}},
  japanwings:{n:'Sakura Crane Wings',d:'ปีกนกกระเรียนญี่ปุ่น ขนขาวปลายดำ โคนชาด มีกลีบซากุระร่วงโปรย LUK +2 · AGI +1',b:{flee:10,luk:2,agi:1},
    cfg:{phi:.4,pamp:.05,fs:1.9,ramp:.1,rot0:0,S:1.38,dy:-22,B:ANGEL_B,build:()=>themedShapes({B:ANGEL_B,rows:ANGEL_ROWS({p:'p',pt:'ink',s:'s',st:'ink',c:'c',ct:null,l:'l',lt:'ver'})}),draw:drawThemed,
      pal:{p:['#cfd2d8','#f2f3f6','#ffffff'],s:['#d4d6dc','#f4f5f8','#ffffff'],c:['#e2e2e6','#f8f8fa','#ffffff'],l:['#ece8ea','#fbf8f9','#ffffff']},tipc:{ink:'#1c1a22',ver:'#d43a2c'},vein:'rgba(60,60,72,.55)',shaft:'rgba(150,150,170,.4)',
      bone:['#3a1410','#d43a2c',4],boneDeco:(bp,P,tt,LW)=>{for(const k of [5,10,14]){const q=bp[k];for(let j=0;j<5;j++)petal(q[0]+Math.cos(j*1.256)*3*LW,q[1]+Math.sin(j*1.256)*3*LW,3*LW,j*1.256+Math.PI/2,'#f6b6c8');ctx.fillStyle='#e85a7a';ctx.beginPath();ctx.arc(q[0],q[1],1.4*LW,0,TAU);ctx.fill();}},
      fx:(sh,P,tt,LW)=>{ctx.globalCompositeOperation='source-over';for(let i=0;i<9;i++){const k=(tt*.25+i/9)%1,s=sh[(i*5)%sh.length];const x=s.G1[0]+Math.sin(tt*1.5+i)*14*LW,y=s.G0[1]+k*110*LW;petal(x,y,(2.6-1.2*k)*LW,tt*2+i,`rgba(248,170,196,${.85*(1-k)})`);}},
      outline:'rgba(30,26,34,.9)'}},
};
for(const k in CITY_WINGS){const W=CITY_WINGS[k];WING2[k]={g:(e,x,y,t,m)=>uvWingGeom(e,x,y,t,m,W.cfg),it:{n:W.n,d:W.d,b:W.b}};}
WING2.abyssflame={g:(e,x,y,t,m)=>{const R=rigFor(e,x,y,-10);return R?[{front:false,draw:tt=>drawFlameAura(R,tt)}]:null;},it:{n:'Sovereign Soulflame',d:'เปลวไฟวิญญาณสีขาวทองลุกโชนจากหลัง ALL +1',b:{flee:8,str:1,agi:1,vit:1,int:1,dex:1,luk:1}}};
/* ---------- Wing pack 4: 14 concept wings ---------- */
function srnd(s){s=Math.sin(s*127.1+311.7)*43758.5453;return s-Math.floor(s);}
function mkWing(e,x,y,t,moving,o,body){const R=rigFor(e,x,y,o.dy||-8);if(!R)return null;const fl=Math.sin(t*(moving?o.fs*1.8:o.fs));const W=[];
  for(const side of [-1,1]){const P=planeP(R,side,o.phi+(moving?o.amp*1.7:o.amp)*fl,o.tau||.12,o.S||1,(o.rot||0)+(moving?o.ramp*1.6:o.ramp||0)*fl,o.root||[10,0,-14]);
    const tip=P(o.tu||120,o.tv||60);W.push({front:tip[2]>R.body,draw:tt=>{ctx.save();ctx.lineJoin='round';ctx.lineCap='round';body(P,side,tt,SPR*3*(o.S||1),moving);ctx.restore();}});}
  W.outline=o.outline;W.crisp=o.crisp;return W;}
const scr=(P,u,v)=>{const p=P(u,v);return [p[0],p[1]];};
function glowDot(x,y,r,c,a){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${c},${a})`);g.addColorStop(1,`rgba(${c},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}
const FX=()=>GP!=='body',SOL=()=>GP!=='fx';
const WING4={
 /* 1 lava */
 lavawings:{n:'Molten Fissure Wings',d:'ปีกหินดำแตกระแหง รอยแยกลาวาเรืองส้ม ลาวาหยดลงพื้น STR +2',b:{flee:8,str:2},o:{phi:.36,amp:.05,fs:1.8,ramp:.08,S:1.6,dy:-14,outline:'rgba(20,8,4,1)',grade:false},
  body:(P,s,t,L)=>{const sh=[[-24,90,22],[-2,124,26],[20,140,26],[42,130,24],[62,104,22],[80,70,18],[-48,70,18]];
   for(const [ang,len,w] of sh){const a=ang*Math.PI/180+Math.PI/2*0,dx=Math.cos((90-ang)*Math.PI/180),dy=Math.sin((90-ang)*Math.PI/180);
     const q=[[0,0],[dx*len*.3+dy*w,dy*len*.3-dx*w],[dx*len,dy*len],[dx*len*.45-dy*w*.8,dy*len*.45+dx*w*.8]].map(([u,v])=>scr(P,u+10,v));
     if(SOL()){fillPoly(q,lgrad(q[0],q[2],['#1a1210','#3a2a24','#5a443a']));ctx.strokeStyle='#0a0604';ctx.lineWidth=.8*L;cpoly(q);ctx.stroke();}
     const cr=[0,.25,.5,.75,1].map(f=>scr(P,10+dx*len*f*.9+Math.sin(f*9+ang)*6,dy*len*f*.9+Math.cos(f*7+ang)*6));
     if(FX()){ctx.globalCompositeOperation='lighter';const k=.6+.4*Math.sin(t*2.5+ang);ctx.strokeStyle=`rgba(255,110,20,${.5*k})`;ctx.lineWidth=3.4*L;ctx.beginPath();cr.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();ctx.strokeStyle=`rgba(255,230,120,${.9*k})`;ctx.lineWidth=1*L;ctx.stroke();ctx.globalCompositeOperation='source-over';}}
   if(FX()){ctx.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const k=(t*.7+i/5)%1,[x0,y0]=scr(P,30+i*16,-10);glowDot(x0,y0+k*70*L,(3-2*k)*L*1.4,'255,120,30',.9*(1-k));}}}},
 /* 2 storm */
 stormwings:{n:'Tempest Vortex Wings',d:'ปีกลมพายุหมุนเกลียว ใบไม้กับเกล็ดหิมะปลิวตาม AGI +2',b:{flee:12,agi:2},o:{phi:.34,amp:.06,fs:2.4,ramp:.1,S:1.25,dy:-10},
  body:(P,s,t,L)=>{if(!FX())return;ctx.globalCompositeOperation='lighter';
   for(let k=0;k<7;k++){const r0=30+k*18,sp=t*(2.4-k*.15)*s;ctx.strokeStyle=`rgba(${200-k*10},${235-k*6},255,${.55-k*.05})`;ctx.lineWidth=(3.4-k*.3)*L;ctx.beginPath();
     for(let i=0;i<=24;i++){const a=sp+i/24*Math.PI*1.4,r=r0*(1-i/60);const p=scr(P,60+Math.cos(a)*r*1.25,60+Math.sin(a)*r);i?ctx.lineTo(...p):ctx.moveTo(...p);}ctx.stroke();}
   ctx.globalCompositeOperation='source-over';for(let i=0;i<9;i++){const a=t*(1.6+srnd(i))*s+i*.7,r=40+srnd(i+9)*80;const [x0,y0]=scr(P,60+Math.cos(a)*r*1.2,60+Math.sin(a)*r);
     if(i%3)star4(x0,y0,1.2*L,'rgba(240,250,255,.9)');else{ctx.fillStyle='#6ab04a';ctx.save();ctx.translate(x0,y0);ctx.rotate(a*3);ctx.beginPath();ctx.ellipse(0,0,3*L,1.3*L,0,0,TAU);ctx.fill();ctx.restore();}}}},
 /* 3 waterfall */
 waterwings:{n:'Cascade Waterfall Wings',d:'ปีกน้ำตกไหลไม่หยุด ปลายปีกแตกเป็นละอองรุ้ง INT +2',b:{flee:10,int:2},o:{phi:.38,amp:.05,fs:2,ramp:.08,S:1.15,dy:-10,outline:'rgba(20,70,140,.9)',crisp:true},
  body:(P,s,t,L)=>{const F=sleekShapes(t,{flick:1});for(const f of F){const q=f.uv.map(([u,v])=>scr(P,u,v)),a=scr(P,...f.g0),b=scr(P,...f.g1);
     if(SOL()){fillPoly(q,lgrad(a,b,['rgba(40,120,220,.85)','rgba(110,200,255,.8)','rgba(220,245,255,.9)']));}
     if(FX()){ctx.save();cpoly(q);ctx.clip();ctx.strokeStyle='rgba(235,250,255,.75)';ctx.lineWidth=1*L;ctx.setLineDash([6*L,10*L]);ctx.lineDashOffset=-t*60*L;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();ctx.setLineDash([]);ctx.restore();}}
   if(FX()){ctx.globalCompositeOperation='lighter';for(let i=0;i<10;i++){const f=F[i%F.length],k=(t*1.2+i/10)%1,b=scr(P,...f.g1);const hue=(i*36+t*80)%360;ctx.fillStyle=`hsla(${hue},90%,80%,${.7*(1-k)})`;ctx.beginPath();ctx.arc(b[0]+Math.sin(i)*8*L*k,b[1]+k*30*L,(1.6-k)*L*1.4,0,TAU);ctx.fill();}}}},
 /* 4 lightning */
 boltwings:{n:'Fractured Thunder Wings',d:'ปีกสายฟ้าแตกกิ่งล้วน แลบไม่ซ้ำทุกเฟรม DEX +2',b:{flee:10,dex:2},o:{phi:.36,amp:.04,fs:2,ramp:.06,S:1.25,dy:-10},
  body:(P,s,t,L)=>{if(!FX())return;ctx.globalCompositeOperation='lighter';const seed=Math.floor(t*14)+s*99;
   const bolt=(u0,v0,u1,v1,w,dep,sd)=>{const n=7,pts=[];for(let i=0;i<=n;i++){const f=i/n;pts.push([u0+(u1-u0)*f+(i&&i<n?(srnd(sd+i)-.5)*22:0),v0+(v1-v0)*f+(i&&i<n?(srnd(sd+i+50)-.5)*22:0)]);}
     const sp=pts.map(([u,v])=>scr(P,u,v));ctx.strokeStyle='rgba(120,170,255,.3)';ctx.lineWidth=w*2.2*L;ctx.beginPath();sp.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();ctx.strokeStyle='rgba(235,245,255,.95)';ctx.lineWidth=w*L;ctx.stroke();
     if(dep>0)for(let i=2;i<n;i+=2){const [u,v]=pts[i];bolt(u,v,u+(srnd(sd+i*7)-.2)*60,v+(srnd(sd+i*3)-.5)*60,w*.6,dep-1,sd+i*13);}};
   const tips=[[90,150],[140,130],[175,90],[180,40],[150,-10],[100,-40]];tips.forEach(([u,v],i)=>bolt(6,4,u,v,1.6,1,seed*7+i*31));
   const [rx,ry]=scr(P,6,4);glowDot(rx,ry,6*L,'160,200,255',.6);}},
 /* 5 clockwork */
 gearwings:{n:'Chronogear Wings',d:'ปีกเฟืองนาฬิกาทองเหลืองหมุนสวนกัน แกนเข็มนาฬิกา LUK +2',b:{flee:8,luk:2},o:{phi:.4,amp:.03,fs:1.4,ramp:.04,S:1.4,dy:-14,outline:'rgba(60,34,10,1)',crisp:true},
  body:(P,s,t,L)=>{const G=[[40,40,26,10,1],[86,74,34,12,-1],[64,124,22,9,1],[132,104,24,9,-1],[120,40,18,8,1],[30,100,16,7,-1],[160,60,14,7,1]];
   const gear=(u,v,r,n,dir,i)=>{const c=scr(P,u,v),R=r*SPR*1.2*1.2,a0=t*dir*(1.4*30/r);if(SOL()){ctx.fillStyle=i%2?'#c89a3a':'#b08030';ctx.beginPath();for(let k=0;k<n*2;k++){const a=a0+k*Math.PI/n,rr=k%2?R:R*1.18;ctx.lineTo(c[0]+Math.cos(a)*rr,c[1]+Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.strokeStyle='#4a2a0a';ctx.lineWidth=.8*L;ctx.stroke();
       ctx.fillStyle='#5a3a14';ctx.beginPath();ctx.arc(c[0],c[1],R*.62,0,TAU);ctx.fill();ctx.fillStyle=i%2?'#e8c060':'#d4a848';ctx.beginPath();ctx.arc(c[0],c[1],R*.5,0,TAU);ctx.fill();
       ctx.strokeStyle='#5a3a14';ctx.lineWidth=1.1*L;for(let k=0;k<4;k++){const a=a0+k*Math.PI/2;ctx.beginPath();ctx.moveTo(c[0],c[1]);ctx.lineTo(c[0]+Math.cos(a)*R*.5,c[1]+Math.sin(a)*R*.5);ctx.stroke();}ctx.fillStyle='#3a2208';ctx.beginPath();ctx.arc(c[0],c[1],R*.14,0,TAU);ctx.fill();}};
   if(SOL()){const h=[scr(P,4,4),scr(P,170,120)],m=[scr(P,4,4),scr(P,180,30)];ctx.strokeStyle='#3a2208';ctx.lineWidth=5*L;for(const [a,b] of [h,m]){ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();}ctx.strokeStyle='#e8c060';ctx.lineWidth=2.4*L;for(const [a,b] of [h,m]){ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();}
     for(const b of [h[1],m[1]]){ctx.fillStyle='#e8c060';ctx.beginPath();ctx.moveTo(b[0],b[1]-6*L);ctx.lineTo(b[0]+3*L,b[1]);ctx.lineTo(b[0],b[1]+6*L);ctx.lineTo(b[0]-3*L,b[1]);ctx.closePath();ctx.fill();}}
   G.forEach((g,i)=>gear(...g,i));if(FX()){ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const k=(t*.8+i/4)%1,[x0,y0]=scr(P,G[i][0],G[i][1]);glowDot(x0,y0-k*20*L,4*L,'255,210,120',.5*(1-k));}}}},
 /* 6 floating swords */
 swordwings:{n:'Thousand Blade Wings',d:'ดาบเรืองแสงลอยเรียงเป็นปีก หมุนวนรอบตัวเวลาโจมตี STR +2 · DEX +1',b:{flee:8,str:2,dex:1},o:{phi:.4,amp:.03,fs:1.6,ramp:.04,S:1.45,dy:-14,outline:'rgba(20,30,60,1)',crisp:true},
  body:(P,s,t,L,mv)=>{const N=8;for(let i=0;i<N;i++){const f=i/(N-1),a=(100-f*120)*Math.PI/180,r=60+f*70,bob=Math.sin(t*2.2+i)*5;
     const bu=20+Math.cos(a)*r*.6+f*40,bv=40+Math.sin(a)*r*.5+bob,len=110-f*30,ang=a+.2;
     const dx=Math.cos(ang),dy=Math.sin(ang),px=-dy,py=dx,Q=(l,w)=>scr(P,bu+dx*l+px*w,bv+dy*l+py*w);
     if(SOL()){fillPoly([Q(18,-5),Q(len-10,-5),Q(len,0),Q(len-10,5),Q(18,5)],lgrad(Q(18,-5),Q(18,5),['#7a8aa8','#f2f6ff','#8a9ab8']));ctx.strokeStyle='rgba(30,40,70,.6)';ctx.lineWidth=.6*L;ctx.beginPath();ctx.moveTo(...Q(20,0));ctx.lineTo(...Q(len-6,0));ctx.stroke();
       fillPoly([Q(14,-12),Q(18,-12),Q(18,12),Q(14,12)],'#d8b050');fillPoly([Q(-4,-2.6),Q(14,-2.6),Q(14,2.6),Q(-4,2.6)],'#2a2040');}
     if(FX()){ctx.globalCompositeOperation='lighter';const k=.6+.4*Math.sin(t*3+i);ctx.strokeStyle=`rgba(140,190,255,${.45*k})`;ctx.lineWidth=4*L;ctx.beginPath();ctx.moveTo(...Q(20,0));ctx.lineTo(...Q(len,0));ctx.stroke();ctx.globalCompositeOperation='source-over';}}}},
 /* 7 rune circles */
 runewings:{n:'Arcane Sigil Wings',d:'วงเวทรูนหลายวงซ้อนเป็นปีก หมุนช้า ๆ อักษรเรืองแสง INT +3',b:{flee:8,int:3},o:{phi:.4,amp:.03,fs:1.4,ramp:.04,S:1.4,dy:-14},
  body:(P,s,t,L)=>{if(!FX())return;ctx.globalCompositeOperation='lighter';const C=[[60,70,46,1],[120,110,34,-1],[130,30,28,1],[50,140,24,-1]];
   for(const [u,v,r,dir] of C){for(const [rr,a] of [[1,.85],[.78,.6]]){ctx.strokeStyle=`rgba(150,200,255,${a})`;ctx.lineWidth=2*L;ctx.beginPath();for(let i=0;i<=40;i++){const q=scr(P,u+Math.cos(i/40*TAU)*r*rr,v+Math.sin(i/40*TAU)*r*rr);i?ctx.lineTo(...q):ctx.moveTo(...q);}ctx.stroke();}
     const n=8;for(let k=0;k<n;k++){const a=t*.6*dir+k/n*TAU,q=scr(P,u+Math.cos(a)*r*.89,v+Math.sin(a)*r*.89);ctx.strokeStyle='rgba(220,240,255,.95)';ctx.lineWidth=1*L;ctx.beginPath();ctx.moveTo(q[0]-2*L,q[1]-2.4*L);ctx.lineTo(q[0],q[1]+2.4*L);ctx.lineTo(q[0]+2*L,q[1]-2.4*L);ctx.moveTo(q[0]-1*L,q[1]);ctx.lineTo(q[0]+1.5*L,q[1]);ctx.stroke();}
     const tri=[0,1,2].map(k=>{const a=-t*.4*dir+k/3*TAU;return scr(P,u+Math.cos(a)*r*.7,v+Math.sin(a)*r*.7);});ctx.strokeStyle='rgba(170,210,255,.7)';ctx.lineWidth=1*L;cpoly(tri);ctx.stroke();
     const c=scr(P,u,v);glowDot(c[0],c[1],r*SPR*1.2*1.3,'120,170,255',.25);}
   const r0=scr(P,6,6);ctx.strokeStyle='rgba(170,210,255,.6)';ctx.lineWidth=1.4*L;for(const [u,v] of C){ctx.beginPath();ctx.moveTo(...r0);ctx.lineTo(...scr(P,u,v));ctx.stroke();}}},
 /* 8 book pages */
 pagewings:{n:'Grimoire Page Wings',d:'หน้ากระดาษคัมภีร์ปลิวเรียงเป็นขนนก ตัวอักษรเรืองแสงทอง INT +2 · LUK +1',b:{flee:8,int:2,luk:1},o:{phi:.4,amp:.06,fs:2,ramp:.08,S:1.5,dy:-14,outline:'rgba(80,60,30,.95)',crisp:true},
  body:(P,s,t,L)=>{const N=11;for(let i=0;i<N;i++){const f=i/(N-1),a=(110-f*140)*Math.PI/180,len=60+Math.sin(f*Math.PI)*70,fl=Math.sin(t*4+i)*.06,an=a+fl;
     const dx=Math.cos(an),dy=Math.sin(an),px=-dy,py=dx,b=[8+f*20,10+f*10],Q=(l,w)=>scr(P,b[0]+dx*l+px*w,b[1]+dy*l+py*w);const q=[Q(10,-11),Q(len,-12),Q(len+4,10),Q(10,11)];
     if(SOL()){fillPoly(q,lgrad(q[0],q[2],['#e8dcc0','#fbf4e2','#efe2c4']));ctx.strokeStyle='rgba(120,90,50,.5)';ctx.lineWidth=.5*L;for(let k=1;k<5;k++){ctx.beginPath();ctx.moveTo(...Q(16,-9+k*4));ctx.lineTo(...Q(len-6,-9+k*4));ctx.stroke();}}
     if(FX()){const k=.5+.5*Math.sin(t*3+i*1.3);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,200,90,${.7*k})`;ctx.lineWidth=.9*L;ctx.beginPath();ctx.moveTo(...Q(18,-5));ctx.lineTo(...Q(18+(len-30)*k,-5));ctx.stroke();ctx.globalCompositeOperation='source-over';}}
   if(FX()){for(let i=0;i<3;i++){const k=(t*.35+i/3)%1,[x0,y0]=scr(P,60+i*30,80);ctx.save();ctx.translate(x0+Math.sin(t+i)*14*L,y0-k*60*L);ctx.rotate(t*2+i);ctx.globalAlpha*=1-k;ctx.fillStyle='#fbf4e2';ctx.fillRect(-4*L,-5*L,8*L,10*L);ctx.restore();}}}},
 /* 9 bone dragon */
 bonewings:{n:'Dracolich Bone Wings',d:'โครงกระดูกปีกมังกร ไฟวิญญาณสีเขียวลุกระหว่างกระดูก VIT +2 · INT +1',b:{flee:6,vit:2,int:1},o:{phi:.36,amp:.08,fs:2.6,ramp:.1,S:1.2,dy:-10,outline:'rgba(40,36,30,1)',crisp:true},
  body:(P,s,t,L)=>{const sh=[0,0],el=[46,58],wr=[92,84],F=[[168,74],[160,20],[130,-24],[92,-40]];
   if(FX()){ctx.globalCompositeOperation='lighter';for(let i=0;i<F.length-1;i++){const q=[scr(P,...wr),scr(P,...F[i]),scr(P,...F[i+1])];const k=.5+.5*Math.sin(t*5+i);ctx.fillStyle=`rgba(80,255,140,${.12+.08*k})`;cpoly(q);ctx.fill();}
     for(let i=0;i<10;i++){const k=(t*.9+i/10)%1,f=F[i%4],[x0,y0]=scr(P,wr[0]+(f[0]-wr[0])*srnd(i),wr[1]+(f[1]-wr[1])*srnd(i));glowDot(x0,y0-k*30*L,(5-3*k)*L,'90,255,150',.8*(1-k));}ctx.globalCompositeOperation='source-over';}
   if(SOL()){const bone=(a,b,w)=>{const p=scr(P,...a),q=scr(P,...b);ctx.strokeStyle='#3a342a';ctx.lineWidth=(w+1.6)*L;ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.stroke();ctx.strokeStyle='#e8e0cc';ctx.lineWidth=w*L;ctx.stroke();for(const e of [p,q]){ctx.fillStyle='#f2ecdc';ctx.beginPath();ctx.arc(e[0],e[1],w*.75*L,0,TAU);ctx.fill();}};
     bone(sh,el,4.4);bone(el,wr,4);for(const f of F)bone(wr,f,2.6);for(let k=0;k<4;k++){const a=[el[0]+(wr[0]-el[0])*k/4,el[1]+(wr[1]-el[1])*k/4];bone(a,[a[0]-8,a[1]-16],1.4);}
     for(const f of F){const p=scr(P,...f);ctx.fillStyle='#2a2620';ctx.beginPath();ctx.moveTo(p[0],p[1]-5*L);ctx.lineTo(p[0]+2*L,p[1]+2*L);ctx.lineTo(p[0]-2*L,p[1]+2*L);ctx.closePath();ctx.fill();}}}},
 /* 10 shadow mist */
 mistwings:{n:'Umbral Mist Wings',d:'ปีกหมอกเงาขอบสลายเป็นควัน มีดวงตาแดงลืมขึ้นเป็นระยะ LUK +1 · AGI +2',b:{flee:12,luk:1,agi:2},o:{phi:.38,amp:.05,fs:2,ramp:.08,S:1.2,dy:-10,outline:'rgba(10,6,16,.9)'},
  body:(P,s,t,L)=>{const F=sleekShapes(t,{flick:1});
   if(SOL()){for(const f of F){const q=f.uv.map(([u,v])=>scr(P,u,v));fillPoly(q,lgrad(scr(P,...f.g0),scr(P,...f.g1),['rgba(14,10,22,.95)','rgba(34,24,52,.85)','rgba(60,44,90,.25)']));}}
   if(FX()){for(let i=0;i<16;i++){const f=F[i%F.length],k=(t*.5+i/16)%1,b=scr(P,...f.g1);ctx.fillStyle=`rgba(40,26,64,${.45*(1-k)})`;ctx.beginPath();ctx.arc(b[0]+Math.sin(i+t)*10*L*k,b[1]-k*24*L,(4+9*k)*L,0,TAU);ctx.fill();}
     ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const ph=(t*.4+i*.33)%1,open=Math.max(0,Math.sin(ph*Math.PI));if(open<.05)continue;const [x0,y0]=scr(P,60+i*34,70+(i%2)*40);ctx.fillStyle=`rgba(255,40,40,${.9*open})`;ctx.beginPath();ctx.ellipse(x0,y0,4.4*L,1.8*L*open,0,0,TAU);ctx.fill();glowDot(x0,y0,9*L,'255,40,40',.5*open);}}}},
 /* 11 chains */
 chainwings:{n:'Shackled Chain Wings',d:'โซ่ตรวนห้อยเป็นรูปปีก ปลายตะขอเรืองแสงม่วง แกว่งตามจังหวะเดิน STR +2',b:{flee:6,str:2},o:{phi:.4,amp:.04,fs:1.8,ramp:.04,S:1.15,dy:-10,outline:'rgba(16,14,22,1)',crisp:true},
  body:(P,s,t,L,mv)=>{const anchors=[[30,110],[60,140],[96,150],[132,132],[164,100]];const bar=anchors.map(a=>scr(P,...a));
   if(SOL()){ctx.strokeStyle='#2a2a34';ctx.lineWidth=6*L;ctx.beginPath();ctx.moveTo(...scr(P,6,8));bar.forEach(p=>ctx.lineTo(...p));ctx.stroke();ctx.strokeStyle='#6a6a7a';ctx.lineWidth=3*L;ctx.stroke();}
   anchors.forEach(([u,v],i)=>{const len=90+i*14,sw=Math.sin(t*(mv?6:2)+i)*(mv?16:6);let prev=scr(P,u,v);const pts=[];for(let k=1;k<=9;k++){const f=k/9;pts.push(scr(P,u+sw*f*f,v-len*f));}
     if(SOL()){ctx.lineWidth=1.4*L;pts.forEach((p,k)=>{ctx.strokeStyle=k%2?'#8a8a9a':'#5a5a6a';ctx.beginPath();ctx.ellipse((prev[0]+p[0])/2,(prev[1]+p[1])/2,Math.hypot(p[0]-prev[0],p[1]-prev[1])/2+.6*L,(k%2?.8:1.8)*L,Math.atan2(p[1]-prev[1],p[0]-prev[0]),0,TAU);ctx.stroke();prev=p;});
       const e=pts[8];ctx.strokeStyle='#4a4a58';ctx.lineWidth=2.4*L;ctx.beginPath();ctx.arc(e[0]+3*L,e[1],4*L,Math.PI,Math.PI*2.6);ctx.stroke();}
     if(FX()){const e=pts[8];ctx.globalCompositeOperation='lighter';glowDot(e[0]+3*L,e[1],9*L,'190,90,255',.6+.3*Math.sin(t*4+i));ctx.globalCompositeOperation='source-over';}});}},
 /* 12 candy */
 candywings:{n:'Sugar Wafer Wings',d:'ปีกเวเฟอร์ราดครีมชมพู ประดับลูกกวาดและน้ำตาลระยิบ LUK +2',b:{flee:8,luk:2},o:{phi:.4,amp:.05,fs:2.4,ramp:.08,S:1.1,dy:-10,outline:'rgba(120,60,40,.95)',crisp:true},
  body:(P,s,t,L)=>{const F=sleekShapes(t,{W:1.2});for(const f of F){const q=f.uv.map(([u,v])=>scr(P,u,v)),a=scr(P,...f.g0),b=scr(P,...f.g1);
     if(SOL()){fillPoly(q,lgrad(a,b,['#d8a060','#f2cc8a','#f8dca4']));ctx.save();cpoly(q);ctx.clip();ctx.strokeStyle='rgba(170,110,50,.55)';ctx.lineWidth=.7*L;for(let k=-6;k<=6;k++){const o=k*5*L;ctx.beginPath();ctx.moveTo(a[0]+o-40*L,a[1]-40*L);ctx.lineTo(a[0]+o+60*L,a[1]+60*L);ctx.moveTo(a[0]+o+40*L,a[1]-40*L);ctx.lineTo(a[0]+o-60*L,a[1]+60*L);ctx.stroke();}
       const tp=f.uv.slice(6,14).map(([u,v])=>scr(P,u,v));fillPoly(tp,'#ff9ec4');ctx.restore();}}
   if(SOL()){const C=['#ff5a8a','#6ad0ff','#ffd04a','#8ae07a'];for(let i=0;i<6;i++){const f=F[(i*2)%F.length],b=scr(P,...f.g1);ctx.fillStyle=C[i%4];ctx.beginPath();ctx.arc(b[0],b[1],3*L,0,TAU);ctx.fill();ctx.fillStyle='rgba(255,255,255,.8)';ctx.beginPath();ctx.arc(b[0]-1*L,b[1]-1*L,1*L,0,TAU);ctx.fill();}}
   if(FX()){ctx.globalCompositeOperation='lighter';for(let i=0;i<8;i++){const f=F[i%F.length],k=.5+.5*Math.sin(t*4+i*2),m=scr(P,(f.g0[0]+f.g1[0])/2,(f.g0[1]+f.g1[1])/2);if(k>.6)star4(m[0],m[1],1.3*k*L,`rgba(255,255,255,${k})`);}}}},
 /* 13 bubbles */
 bubblewings:{n:'Prism Bubble Wings',d:'ฟองสบู่สีรุ้งเรียงเป็นปีก มีฟองลอยหลุดขึ้นไปแตก INT +1 · LUK +1',b:{flee:10,int:1,luk:1},o:{phi:.4,amp:.05,fs:2,ramp:.06,S:1.35,dy:-14},
  body:(P,s,t,L)=>{if(!FX())return;const B=[];for(let i=0;i<22;i++){const f=i/21,a=(110-f*150)*Math.PI/180,r=40+srnd(i)*110;B.push([20+Math.cos(a)*r,30+Math.sin(a)*r*.9,6+srnd(i+5)*12]);}
   const bub=(x0,y0,r,a)=>{const g=ctx.createRadialGradient(x0-r*.3,y0-r*.3,r*.1,x0,y0,r);g.addColorStop(0,`rgba(255,255,255,${.08*a})`);g.addColorStop(.7,`rgba(190,225,255,${.22*a})`);g.addColorStop(1,`rgba(255,255,255,${.85*a})`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x0,y0,r,0,TAU);ctx.fill();
     const hue=(x0+y0+t*60)%360;ctx.strokeStyle=`hsla(${hue},95%,72%,${.95*a})`;ctx.lineWidth=1.4*L;ctx.beginPath();ctx.arc(x0,y0,r*.92,Math.PI*.1,Math.PI*1.1);ctx.stroke();ctx.fillStyle=`rgba(255,255,255,${.9*a})`;ctx.beginPath();ctx.ellipse(x0-r*.35,y0-r*.4,r*.22,r*.12,-.6,0,TAU);ctx.fill();};
   B.forEach(([u,v,r],i)=>{const [x0,y0]=scr(P,u,v+Math.sin(t*2+i)*3);bub(x0,y0,r*SPR*1.15*1.2,1);});
   for(let i=0;i<5;i++){const k=(t*.3+i/5)%1,[x0,y0]=scr(P,B[i*4][0],B[i*4][1]);bub(x0+Math.sin(t+i)*10*L,y0-k*90*L,(3+3*(1-k))*L,k<.9?1:(1-k)*10);}}},
 /* 14 lanterns */
 lanternwings:{n:'Festival Lantern Wings',d:'โคมกระดาษเล็ก ๆ ร้อยเรียงเป็นปีก เรืองแสงอุ่นตอนกลางคืน LUK +1 · DEX +1',b:{flee:8,luk:1,dex:1},o:{phi:.4,amp:.04,fs:1.6,ramp:.05,S:1.3,dy:-14,outline:'rgba(60,16,10,.95)',crisp:true},
  body:(P,s,t,L)=>{const rows=[[[34,150],[84,176],[134,170],[180,138]],[[46,90],[100,108],[152,96],[196,62]],[[40,24],[94,26],[146,4]]];const night=typeof mapNight!=='undefined'&&mapNight;
   if(SOL()){ctx.strokeStyle='#5a3a24';ctx.lineWidth=1*L;for(const r of rows){ctx.beginPath();ctx.moveTo(...scr(P,6,6));r.forEach(p=>ctx.lineTo(...scr(P,p[0],p[1]+8)));ctx.stroke();}}
   rows.forEach((r,ri)=>r.forEach(([u,v],i)=>{const sw=Math.sin(t*2+i+ri)*.12,c=scr(P,u,v),w=7*L*(1.1-ri*.1),h=10*L*(1.1-ri*.1);ctx.save();ctx.translate(c[0],c[1]);ctx.rotate(sw);
     if(SOL()){ctx.fillStyle=(i+ri)%3?'#d8302a':'#f0a030';ctx.beginPath();ctx.ellipse(0,0,w,h,0,0,TAU);ctx.fill();ctx.strokeStyle='rgba(80,10,6,.6)';ctx.lineWidth=.6*L;for(const k of [-.5,0,.5]){ctx.beginPath();ctx.ellipse(0,0,w*Math.abs(k)*1.6+.1,h,0,0,TAU);ctx.stroke();}
       ctx.fillStyle='#2a1a10';ctx.fillRect(-w*.5,-h-1.4*L,w,1.8*L);ctx.fillRect(-w*.5,h-.4*L,w,1.8*L);ctx.strokeStyle='#e6b030';ctx.lineWidth=.8*L;ctx.beginPath();ctx.moveTo(0,h+1.4*L);ctx.lineTo(0,h+6*L);ctx.stroke();}
     if(FX()){ctx.globalCompositeOperation='lighter';glowDot(0,0,h*(night?2.4:1.5),'255,170,80',(night?.55:.3)*(.85+.15*Math.sin(t*6+i*3)));}ctx.restore();}));}},
};
for(const k in WING4){const W=WING4[k];WING2[k]={g:(e,x,y,t,m)=>mkWing(e,x,y,t,m,W.o,W.body),it:{n:W.n,d:W.d,b:W.b}};}
/* ---------- Wing pack 4 re-done in faceted crystal style ---------- */
const CRYS_PAL={
 lavawings:{lit:['#6a5a52','#4a3a34','#2e221e'],mid:['#2e221e','#1c1410'],shd:['#140c0a','#080404'],edge:'rgba(255,110,30,.95)',glow:'255,140,50',fx:1},
 stormwings:{lit:['#f4fffb','#ccf6ec','#9ee8d8'],mid:['#6cd2c2','#3eaa9a'],shd:['#2a8a80','#186660'],edge:'rgba(16,86,84,1)',glow:'200,255,240',fx:1},
 waterwings:{lit:['#f0fbff','#b4ecff','#7cd6fa'],mid:['#3ab0ec','#1a88d0'],shd:['#1068b0','#0a4a8a'],edge:'rgba(8,52,110,1)',glow:'140,220,255',fx:1},
 boltwings:{lit:['#fffdf0','#fff2a4','#ffe066'],mid:['#f0c43c','#d09a1c'],shd:['#9a6e0e','#664606'],edge:'rgba(90,60,6,1)',glow:'255,240,160',fx:0,zap:1},
 gearwings:{lit:['#fff4d4','#f6d488','#e2b04a'],mid:['#c8902c','#a06e18'],shd:['#7a4e0c','#4e3006'],edge:'rgba(70,40,6,1)',glow:'255,220,140',fx:0},
 swordwings:{lit:['#ffffff','#e4ecf8','#c4d0e4'],mid:['#9aa8c0','#7a88a4'],shd:['#56627c','#3a4458'],edge:'rgba(30,38,60,1)',glow:'200,225,255',fx:0},
 runewings:{lit:['#f4eeff','#d0c0ff','#a890f4'],mid:['#7a62e0','#5a44c4'],shd:['#3c2c96','#261a6a'],edge:'rgba(26,16,80,1)',glow:'180,160,255',fx:0,rune:1},
 pagewings:{lit:['#fffdf6','#f8f0dc','#ecdcb8'],mid:['#d8c49a','#bea67a'],shd:['#9a845a','#6e5c3c'],edge:'rgba(90,70,40,1)',glow:'255,230,170',fx:1},
 bonewings:{lit:['#eafff0','#b4f4c8','#7ae4a0'],mid:['#3ec478','#22a05a'],shd:['#147a42','#0a5a2e'],edge:'rgba(6,56,30,1)',glow:'120,255,170',fx:1},
 mistwings:{lit:['#d8c8f0','#9a80c8','#6a50a0'],mid:['#4a3478','#34225a'],shd:['#221640','#140c28'],edge:'rgba(10,4,24,1)',glow:'200,120,255',fx:1},
 chainwings:{lit:['#d8dae4','#9a9cac','#6e7084'],mid:['#4e5064','#383a4c'],shd:['#24263a','#141626'],edge:'rgba(150,80,255,.95)',glow:'190,110,255',fx:0},
 candywings:{lit:['#fff4f8','#ffd0e4','#ffa8cc'],mid:['#f47aac','#e05a92'],shd:['#c03c76','#9a2a5c'],edge:'rgba(120,30,70,1)',glow:'255,200,230',fx:1},
 bubblewings:{lit:['#ffffff','#d8f4ff','#ffd8f4'],mid:['#b4e4ff','#e4b8ff'],shd:['#8ac4f0','#c08ae8'],edge:'rgba(70,90,160,.9)',glow:'230,220,255',fx:0},
 lanternwings:{lit:['#fff0d8','#ffc080','#ff8a48'],mid:['#e8502a','#c8341c'],shd:['#901c14','#5e0e0a'],edge:'rgba(70,8,4,1)',glow:'255,170,80',fx:0},
};
const CRYS_SHAPE={swordwings:1,chainwings:1};
function shardSet(variant){if(!variant)return glacierShapes;return t=>{const S=[];const shard=(bu,bv,a,l,w,lay)=>{const A=a*Math.PI/180,dx=Math.cos(A),dy=Math.sin(A),px=-dy,py=dx;const P2=(f,k)=>[bu+dx*l*f+px*w*k,bv+dy*l*f+py*w*k];
    const b=P2(0,0),sL=P2(.32,1),sR=P2(.42,-.9),tip=P2(1,0),bL=P2(.06,.45),bR=P2(.08,-.4),r1=P2(.36,.1),hi0=P2(.3,.62),hi1=P2(.86,.12);
    S.push({uv:[bL,sL,tip,sR,bR],faces:[[bL,sL,tip,r1],[r1,tip,sR],[bR,r1,sR],[bL,b,bR,r1]],hl:[hi0,hi1],ridge:[r1,tip],g0:b,g1:tip,lay});};
  if(variant===1){ // long blade fan
    for(let i=0;i<9;i++){const k=i/8;shard(10+k*24,12+k*16,92-k*86,150+Math.sin(k*Math.PI)*50,12,i%2);}}
  else{ // jagged fan, short & wide, drooping tips
    [[8,10,86,140,26],[24,24,64,186,30],[44,30,40,190,30],[56,24,14,170,28],[54,10,-14,140,26],[42,-4,-40,110,22],[26,-10,-62,86,18]].forEach(([u,v,a,l,w],i)=>shard(u,v,a,l,w,i%2));
    [[16,10,70,90,16],[30,10,30,96,16],[30,0,-10,80,14]].forEach(([u,v,a,l,w])=>shard(u,v,a,l,w,2));}
  return S;};}
for(const k in WING4){const old=WING4[k],pal=CRYS_PAL[k];
  const cfg={phi:.34,pamp:.05,fs:1.8,ramp:.1,rot0:-.12,S:1.45,dy:-14,root:[30,0,-14],build:shardSet(CRYS_SHAPE[k]),crisp:true,outline:pal.edge.replace(/,[\d.]+\)$/,',1)'),...pal,
    draw:(shapes,P,tt,c)=>{drawCrystalSet(shapes,P,tt,c);if(GP!=='body'&&pal.zap&&Math.sin(tt*9)>.3){ctx.save();ctx.globalCompositeOperation='lighter';const sd=Math.floor(tt*12);for(let j=0;j<3;j++){const s0=shapes[(sd+j*5)%shapes.length],a=P(...s0.g0),b=P(...s0.g1);ctx.strokeStyle='rgba(255,250,210,.9)';ctx.lineWidth=SPR*3*.9;ctx.beginPath();ctx.moveTo(a[0],a[1]);for(let q=1;q<=5;q++){const f=q/5;ctx.lineTo(a[0]+(b[0]-a[0])*f+(srnd(sd+q+j*9)-.5)*10*SPR*3,a[1]+(b[1]-a[1])*f+(srnd(sd+q*3+j)-.5)*10*SPR*3);}ctx.stroke();}ctx.restore();}
      if(GP!=='body'&&pal.rune){ctx.save();ctx.globalCompositeOperation='lighter';for(const s0 of shapes){if(s0.lay)continue;const m=P((s0.g0[0]+s0.g1[0])/2,(s0.g0[1]+s0.g1[1])/2),L=SPR*3,k=.5+.5*Math.sin(tt*3+m[0]*.1);ctx.strokeStyle=`rgba(230,220,255,${.9*k})`;ctx.lineWidth=.9*L;ctx.beginPath();ctx.moveTo(m[0]-2*L,m[1]-2.6*L);ctx.lineTo(m[0],m[1]+2.6*L);ctx.lineTo(m[0]+2*L,m[1]-2.6*L);ctx.moveTo(m[0]-1*L,m[1]);ctx.lineTo(m[0]+1.4*L,m[1]);ctx.stroke();}ctx.restore();}
      if(GP!=='body'&&pal.fx){ctx.save();ctx.lineJoin='round';ctx.lineCap='round';old.body(P,1,tt,SPR*3*1.45,false);ctx.restore();}
      if(GP!=='body'){ctx.save();ctx.globalCompositeOperation='lighter';const k2=.7+.3*Math.sin(tt*2.4);for(const s of shapes)if(s.lay===0){const p=P(...s.g1);const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],10*SPR*3);g.addColorStop(0,`rgba(${pal.glow},${.25*k2})`);g.addColorStop(1,`rgba(${pal.glow},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(p[0],p[1],10*SPR*3,0,TAU);ctx.fill();}ctx.restore();}}};
  if(CRYS_SHAPE[k]===1){cfg.rot0=-.05;cfg.S=1.25;}
  WING2[k]={g:(e,x,y,t,m)=>uvWingGeom(e,x,y,t,m,cfg),it:{n:old.n.replace(' Wings',' Crystal Wings'),d:old.d.replace('ปีก','ปีกคริสตัล'),b:old.b}};}
for(const k of ['chainwings','swordwings','energywings'])delete WING2[k];
/* ---------- Stormcaller Rune Axe (weapon skin): dull steel double-bearded head, glowing cyan rune-cracks, lightning on swings ---------- */
const STORM_CRACK=[[[4,8],[10,20],[6,31],[14,44]],[[10,20],[20,26]],[[-10,12],[-18,26],[-12,38],[-20,48]],[[-18,26],[-30,30]],[[-30,34],[-40,42]]];
function drawStormAxe(e,x,y,t){
  const sd=srcDir(e.d),mir=isMir(e.d),tr=FASHION.axe[e.st]&&FASHION.axe[e.st][sd];if(!tr)return;const s=tr[Math.min(e.f,tr.length-1)];
  let [hx,hy,gx,gy]=s;if(mir){hx=SPR_META.cell.w-hx;gx=SPR_META.cell.w-gx;}
  let ux=hx-gx,uy=hy-gy;const ul=Math.hypot(ux,uy)||1;ux/=ul;uy/=ul;const nx=-uy,ny=ux;
  const cx=hx+ux*10,cy=hy+uy*10;const P=(a,b)=>c2s(cx+ux*a+nx*b,cy+uy*a+ny*b,x,y);
  const swing=e.st==='attack'||e.st==='buff';
  const bit=sg=>[[-6,3],[14,6],[22,13],[32,40],[16,52],[-6,57],[-28,53],[-46,42],[-40,25],[-24,12],[-12,5]].map(([a,b])=>P(a,b*sg));
  const edge=sg=>[[32,40],[16,52],[-6,57],[-28,53],[-46,42]].map(([a,b])=>P(a,b*sg));
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  if(GP!=='fx'){
    // handle: light ash wood with navy wraps
    const h0=c2s(gx-ux*46,gy-uy*46,x,y),h1=c2s(hx+ux*30,hy+uy*30,x,y);
    ctx.strokeStyle='#6a5032';ctx.lineWidth=7*SPR*1.5;ctx.beginPath();ctx.moveTo(h0[0],h0[1]);ctx.lineTo(h1[0],h1[1]);ctx.stroke();
    ctx.strokeStyle='#cdb084';ctx.lineWidth=4.6*SPR*1.5;ctx.stroke();
    for(let i=0;i<4;i++){const k=i*9-6,a=c2s(gx+ux*(k-3),gy+uy*(k-3),x,y),b=c2s(gx+ux*(k+3),gy+uy*(k+3),x,y);ctx.strokeStyle='#1c2848';ctx.lineWidth=8*SPR*1.5;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
    const pm=c2s(gx-ux*48,gy-uy*48,x,y);ctx.fillStyle='#8a929c';ctx.beginPath();ctx.arc(pm[0],pm[1],4.5*SPR*1.5,0,TAU);ctx.fill();
    // blade bits
    for(const sg of [1,-1]){const pts=bit(sg);fillPoly(pts,lgrad(P(0,0),P(-6,57*sg),['#3e4650','#6e7884','#a8b2bc']));
      const ed=edge(sg);ctx.strokeStyle='#e2e8ee';ctx.lineWidth=3*SPR*1.5;ctx.beginPath();ed.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();
      ctx.strokeStyle='#14303e';ctx.lineWidth=1.8*SPR*1.5;for(const L of STORM_CRACK){ctx.beginPath();L.forEach(([a,b],i)=>{const q=P(a,b*sg);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.stroke();}}
    // socket collar
    const c0=P(-14,-7),c1=P(16,-7),c2=P(16,7),c3=P(-14,7);fillPoly([c0,c1,c2,c3],lgrad(c0,c2,['#2a3038','#6a7480','#2a3038']));
    const r0=P(1,0);ctx.fillStyle='#7fe8ff';ctx.beginPath();ctx.arc(r0[0],r0[1],2.4*SPR*1.5,0,TAU);ctx.fill();}
  if(GP!=='body'){ctx.globalCompositeOperation='lighter';
    const fl=.55+.45*Math.sin(t*9)*Math.sin(t*3.7);
    for(const sg of [1,-1])for(const L of STORM_CRACK){ctx.beginPath();L.forEach(([a,b],i)=>{const q=P(a,b*sg);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});
      ctx.strokeStyle=`rgba(80,200,255,${.35*fl})`;ctx.lineWidth=4*SPR*1.5;ctx.stroke();ctx.strokeStyle=`rgba(210,250,255,${.8*fl})`;ctx.lineWidth=1.1*SPR*1.5;ctx.stroke();}
    const r0=P(1,0),g=ctx.createRadialGradient(r0[0],r0[1],0,r0[0],r0[1],14*SPR*1.5);g.addColorStop(0,`rgba(140,230,255,${.6*fl})`);g.addColorStop(1,'rgba(140,230,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(r0[0],r0[1],14*SPR*1.5,0,TAU);ctx.fill();
    if(swing||Math.sin(t*5.3)>.93){for(const sg of [1,-1]){const ed=edge(sg);ctx.strokeStyle='rgba(200,245,255,.9)';ctx.lineWidth=1.2*SPR*1.5;ctx.beginPath();
      for(let i=0;i<ed.length-1;i++){const a=ed[i],b=ed[i+1];if(i===0)ctx.moveTo(a[0],a[1]);for(let k=1;k<=3;k++){const f=k/3,j=(Math.random()-.5)*7*SPR*1.5;ctx.lineTo(a[0]+(b[0]-a[0])*f+j,a[1]+(b[1]-a[1])*f+j);}}ctx.stroke();
      ctx.strokeStyle='rgba(80,180,255,.35)';ctx.lineWidth=4*SPR*1.5;ctx.stroke();}
      if(swing)for(let i=0;i<3;i++){const q=edge(1)[Math.floor(Math.random()*5)];const L=(10+Math.random()*16)*SPR*1.5,an=Math.random()*TAU;ctx.strokeStyle='rgba(220,250,255,.85)';ctx.lineWidth=.9*SPR*1.5;ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(q[0]+Math.cos(an)*L*.5+(Math.random()-.5)*4,q[1]+Math.sin(an)*L*.5);ctx.lineTo(q[0]+Math.cos(an)*L,q[1]+Math.sin(an)*L);ctx.stroke();}}}
  ctx.restore();}

/* ---------- Capes (garment) + back accessories (new 'back' slot) ---------- */
function capeGeom(e,x,y,t,moving,cfg){const R=rigFor(e,x,y,-30);if(!R)return null;
  const NX=9,NY=8,L=cfg.len||170,top=(cfg.top||46)*1.3,bot=(cfg.bot||86)*1.25,G=[];
  for(let j=0;j<=NY;j++){const s=j/NY,row=[];for(let i=0;i<=NX;i++){const u=(i/NX-.5);
      const w=top+(bot-top)*Math.pow(s,.8),fold=Math.sin(i*Math.PI*1.0+.3)*3*s;
      const wave=Math.sin(t*(moving?7:2.2)-s*4+i*.6)*(moving?5:2.2)*s;
      const trail=(moving?44:16)*Math.pow(s,1.3);const wrap=(1-Math.cos(u*Math.PI))*(22-10*s);
      const edgeDrop=cfg.tatter&&j===NY?(i%2?10:-6)*Math.sin(i*2.1+1):0;
      row.push(R.proj(u*w*(1-.12*(1-Math.cos(u*Math.PI))*(1-s))+(cfg.sway?Math.sin(t*1.3)*3*s:0),-s*L-edgeDrop,-22-trail+wave+wrap+fold));}
    G.push(row);}
  const depth=G[NY>>1][NX>>1][2];
  return {G,front:depth>R.body,R,cfg};}
function drawCape(c,t){const {G,cfg}=c,NX=G[0].length-1,NY=G.length-1,LW=SPR*3;ctx.save();ctx.lineJoin='round';
  if(GP!=='fx'){
    for(let i=0;i<NX;i++){const strip=[...G.map(r=>r[i]),...G.slice().reverse().map(r=>r[i+1])];
      const lit=.5+.5*Math.cos(i/NX*Math.PI*2.0+.4);const col=cfg.col;
      fillPoly(strip,lgrad(G[0][i],G[NY][i],[mixC(col[0],col[1],lit),mixC(col[1],col[2],lit*.8),mixC(col[0],col[1],lit*.6)]));}
    if(cfg.trim){const rows=cfg.trimRows||1;for(let k=0;k<rows;k++){const j0=NY-1-k*0,poly=[...G[NY].slice(),...G[NY-1].slice().reverse()].map((q,idx,arr)=>{return q;});
      const a=G[NY],b=G[NY-1].map((q,i)=>[q[0]+(a[i][0]-q[0])*.62,q[1]+(a[i][1]-q[1])*.62]);fillPoly([...a,...b.reverse()],cfg.trim);}}
    if(cfg.fur){const a=G[NY];ctx.fillStyle=cfg.fur;ctx.beginPath();ctx.moveTo(a[0][0],a[0][1]);for(let i=0;i<NX;i++){const p=a[i],q=a[i+1];for(let k=1;k<=3;k++){const f=k/3,mx=p[0]+(q[0]-p[0])*(f-.17),my=p[1]+(q[1]-p[1])*(f-.17);ctx.lineTo(mx,my+8*LW);ctx.lineTo(p[0]+(q[0]-p[0])*f,p[1]+(q[1]-p[1])*f);}}
      const b=G[NY-1];for(let i=NX;i>=0;i--){const q=a[i],r=b[i];ctx.lineTo(q[0]+(r[0]-q[0])*.45,q[1]+(r[1]-q[1])*.45);}ctx.closePath();ctx.fill();}
    if(cfg.collar){const a=G[0],b=G[1];fillPoly([...a,...b.map((q,i)=>[a[i][0]+(q[0]-a[i][0])*.55,a[i][1]+(q[1]-a[i][1])*.55]).reverse()],cfg.collar);
      ctx.fillStyle='rgba(0,0,0,.18)';for(let i=1;i<NX;i++){const q=a[i];ctx.beginPath();ctx.arc(q[0],q[1]+4*LW,1.1*LW,0,TAU);ctx.fill();}}
    if(cfg.emblem&&!c.front){} else if(cfg.emblem){const m=G[3][NX>>1];cfg.emblem(m[0],m[1],LW,t);}
    ctx.strokeStyle=cfg.edge;ctx.lineWidth=.8*LW;for(let i=1;i<NX;i++){ctx.beginPath();G.slice(1).forEach((r,j)=>j?ctx.lineTo(r[i][0],r[i][1]):ctx.moveTo(r[i][0],r[i][1]));ctx.globalAlpha*=.5;ctx.stroke();ctx.globalAlpha/=.5;}
    const out=[...G.map(r=>r[0]),...G[NY],...G.slice().reverse().map(r=>r[NX])];ctx.lineWidth=1.1*LW;ctx.strokeStyle=cfg.edge;cpoly(out);ctx.stroke();}
  if(GP!=='body'&&cfg.fx)cfg.fx(G,t,LW);
  ctx.restore();}
function mixC(a,b,k){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);const r=((A>>16)&255)*(1-k)+((B>>16)&255)*k,g=((A>>8)&255)*(1-k)+((B>>8)&255)*k,bl=(A&255)*(1-k)+(B&255)*k;return `rgb(${r|0},${g|0},${bl|0})`;}
function capeClasp(e,x,y,cfg){if(!cfg.clasp)return null;const R=rigFor(e,x,y,-30);if(!R)return null;const L=R.proj(-18,2,14),Rt=R.proj(18,2,14),cn=R.proj(0,-2,20);
  return {front:cn[2]>R.body-30,draw:()=>{if(GP==='fx')return;const LW=SPR*3;ctx.strokeStyle=cfg.clasp[1];ctx.lineWidth=1.4*LW;ctx.beginPath();ctx.moveTo(L[0],L[1]);ctx.quadraticCurveTo(cn[0],cn[1]+3*LW,Rt[0],Rt[1]);ctx.stroke();
    ctx.fillStyle=cfg.clasp[0];ctx.beginPath();ctx.arc(cn[0],cn[1]+2*LW,2.8*LW,0,TAU);ctx.fill();ctx.strokeStyle='rgba(40,20,0,.7)';ctx.lineWidth=.6*LW;ctx.stroke();}};}
const CAPES={
  wolfcape:{n:'Wolfpelt Cape',d:'ผ้าคลุมหนังหมาป่าสีเทา ชายขนฟู มีปลอกคอขนหนา VIT +1 · DEF',b:{vit:1,flee:4},
    cfg:{len:168,top:50,bot:92,col:['#4a4e58','#8a909c','#c4c8d0'],fur:'#dcdfe4',collar:'#e8e4dc',edge:'rgba(20,22,28,.8)',clasp:['#c49a4a','#5a4a3a']}},
  royalcape:{n:'Royal Crimson Cape',d:'ผ้าคลุมกำมะหยี่แดงขลิบทอง ปกขนเออร์มีนขาว ตราสิงห์ทองกลางหลัง LUK +2',b:{luk:2,flee:4},
    cfg:{len:178,top:48,bot:96,col:['#5a0a12','#a8182a','#e04a50'],trim:'#e2b84a',collar:'#f4f0ea',edge:'rgba(40,4,8,.85)',clasp:['#f0c858','#8a6418'],
      emblem:(x,y,LW)=>{ctx.fillStyle='#e2b84a';ctx.beginPath();ctx.moveTo(x,y-9*LW);ctx.lineTo(x+7*LW,y-4*LW);ctx.lineTo(x+6*LW,y+5*LW);ctx.lineTo(x,y+10*LW);ctx.lineTo(x-6*LW,y+5*LW);ctx.lineTo(x-7*LW,y-4*LW);ctx.closePath();ctx.fill();ctx.fillStyle='#a8182a';ctx.beginPath();ctx.arc(x,y,3*LW,0,TAU);ctx.fill();}}},
  starcloak:{n:'Midnight Star Cloak',d:'เสื้อคลุมกรมท่าเข้มมีดาวระยิบในผ้า ขอบเงิน INT +2',b:{int:2,flee:4},
    cfg:{len:182,top:46,bot:100,col:['#0a0c24','#1c2252','#3a4290'],trim:'#b8c4dc',edge:'rgba(4,4,16,.9)',clasp:['#d8e2f4','#5a6680'],
      fx:(G,t,LW)=>{ctx.globalCompositeOperation='lighter';for(let i=0;i<14;i++){const r=G[1+(i*3)%(G.length-2)],q=r[1+(i*5)%(r.length-2)],k=.5+.5*Math.sin(t*2.6+i*1.9);if(k>.45)star4(q[0]+(i%3-1)*3*LW,q[1],(.6+1.2*k)*LW,`rgba(220,230,255,${k})`);}}}},
  rangercloak:{n:'Tattered Ranger Cloak',d:'เสื้อคลุมพรานป่าสีเขียวมอส ชายผ้าขาดรุ่ย DEX +2',b:{dex:2,flee:6},
    cfg:{len:172,top:46,bot:90,col:['#1e3018','#3e5a2c','#6e8a48'],tatter:1,collar:'#6a5434',edge:'rgba(10,18,6,.85)',clasp:['#a07a3a','#3a2a18'],sway:1}},
  frostmantle:{n:'Frost Mantle',d:'ผ้าคลุมน้ำแข็งไล่สีฟ้า ขอบเกล็ดหิมะ มีผลึกหิมะปักกลางหลัง INT +1 · AGI +1',b:{int:1,agi:1,flee:5},
    cfg:{len:176,top:48,bot:94,col:['#2a5a9a','#6aa8e0','#d4eeff'],fur:'#f4fbff',collar:'#e8f6ff',edge:'rgba(12,40,90,.85)',clasp:['#bfe9ff','#2a5a9a'],
      emblem:(x,y,LW)=>{ctx.strokeStyle='#f4fbff';ctx.lineWidth=1.3*LW;for(let k=0;k<6;k++){const a=k*Math.PI/3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*8*LW,y+Math.sin(a)*8*LW);ctx.stroke();}},
      fx:(G,t,LW)=>{ctx.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const k=(t*.4+i/6)%1,q=G[G.length-1][(i*2)%G[0].length];ctx.fillStyle=`rgba(220,245,255,${.7*(1-k)})`;ctx.beginPath();ctx.arc(q[0]+Math.sin(t+i)*4*LW,q[1]+k*30*LW,(1.4-k)*LW,0,TAU);ctx.fill();}}}},
};
/* ---- back accessories ---- */
function backGeom(e,x,y,t,moving,kind){const R=rigFor(e,x,y,-6);if(!R)return null;const P=(a,b,z=-26)=>R.proj(a,b,z),LW=SPR*3,bob=moving?Math.sin(t*14)*1.5:0;
  const parts=[];
  if(kind==='greatsword'){const A=[-40,84+bob],B=[34,-92+bob];const dx=B[0]-A[0],dy=B[1]-A[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy,ny=ux;
    const Q=(s,w)=>P(A[0]+ux*s+nx*w,A[1]+uy*s+ny*w);
    parts.push(()=>{fillPoly([Q(40,-9),Q(150,-9),Q(170,0),Q(150,9),Q(40,9)],lgrad(Q(40,-9),Q(40,9),['#7a8494','#e8eef6','#9aa4b4']));ctx.strokeStyle='rgba(30,34,44,.6)';ctx.lineWidth=.8*LW;ctx.beginPath();ctx.moveTo(...Q(44,0));ctx.lineTo(...Q(160,0));ctx.stroke();
      fillPoly([Q(30,-24),Q(38,-24),Q(38,24),Q(30,24)],'#c49a3a');fillPoly([Q(2,-4),Q(30,-4),Q(30,4),Q(2,4)],'#4a2a18');for(let k=6;k<30;k+=6){ctx.strokeStyle='#c49a3a';ctx.lineWidth=.8*LW;ctx.beginPath();ctx.moveTo(...Q(k,-4));ctx.lineTo(...Q(k+3,4));ctx.stroke();}
      const pm=Q(-2,0);ctx.fillStyle='#d8b050';ctx.beginPath();ctx.arc(pm[0],pm[1],3.6*LW,0,TAU);ctx.fill();ctx.fillStyle='#3a8ae0';ctx.beginPath();ctx.arc(pm[0],pm[1],1.6*LW,0,TAU);ctx.fill();
      const s1=Q(46,-10),s2=Q(46,10);ctx.strokeStyle='#5a3a20';ctx.lineWidth=2.4*LW;ctx.beginPath();ctx.moveTo(...P(-26,40,-14));ctx.lineTo(s1[0],s1[1]);ctx.moveTo(...P(26,-10,-14));ctx.lineTo(...Q(120,10));ctx.stroke();});}
  if(kind==='vikingshield'){const C=[0,0+bob],r=40;const ring=n=>{const o=[];for(let i=0;i<n;i++){const a=i/n*TAU;o.push(P(C[0]+Math.cos(a)*r,C[1]+Math.sin(a)*r,-30));}return o;};
    parts.push(()=>{const o=ring(32);const cols=['#b42a24','#e8dcc0'];for(let k=0;k<8;k++){const c0=P(C[0],C[1],-30);fillPoly([c0,...o.slice(k*4,k*4+5)],cols[k%2]);}
      ctx.strokeStyle='#4a2a14';ctx.lineWidth=.8*LW;for(let k=0;k<8;k++){const q=o[k*4],c0=P(C[0],C[1],-30);ctx.beginPath();ctx.moveTo(c0[0],c0[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}
      ctx.strokeStyle='#6a6e78';ctx.lineWidth=3*LW;cpoly(o);ctx.stroke();ctx.fillStyle='#b8bec8';for(let i=0;i<32;i+=4){ctx.beginPath();ctx.arc(o[i][0],o[i][1],1.2*LW,0,TAU);ctx.fill();}
      const bo=[];for(let i=0;i<12;i++){const a=i/12*TAU;bo.push(P(C[0]+Math.cos(a)*9,C[1]+Math.sin(a)*9,-33));}fillPoly(bo,lgrad(bo[7],bo[1],['#f0f2f6','#5a606c']));});}
  if(kind==='quiver'){const A=[-26,-50+bob],B=[22,62+bob];const dx=B[0]-A[0],dy=B[1]-A[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy,ny=ux;const Q=(s,w,z=-28)=>P(A[0]+ux*s+nx*w,A[1]+uy*s+ny*w,z);
    parts.push(()=>{for(let k=-2;k<=2;k++){const a=Q(l-6,k*4),b=Q(l+26+Math.abs(k)*2,k*5);ctx.strokeStyle='#8a6a3a';ctx.lineWidth=1.1*LW;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
        fillPoly([b,Q(l+18+Math.abs(k)*2,k*5-4),Q(l+12+Math.abs(k)*2,k*5),Q(l+18+Math.abs(k)*2,k*5+4)],k%2?'#e8e2d4':'#c43a2c');}
      fillPoly([Q(0,-11),Q(l,-13),Q(l,13),Q(0,11)],lgrad(Q(0,-11),Q(0,11),['#4a2a14','#8a5a2e','#5a3418']));
      for(const s of [14,l-10]){fillPoly([Q(s,-12),Q(s+5,-12.5),Q(s+5,12.5),Q(s,12)],'#c49a3a');}
      ctx.strokeStyle='rgba(30,14,4,.7)';ctx.lineWidth=.7*LW;for(let s=24;s<l-14;s+=10){ctx.beginPath();ctx.moveTo(...Q(s,-11));ctx.lineTo(...Q(s+5,11));ctx.stroke();}
      ctx.strokeStyle='#5a3a20';ctx.lineWidth=2.4*LW;ctx.beginPath();ctx.moveTo(...P(-24,46,-14));ctx.lineTo(...Q(l*.3,0));ctx.stroke();});}
  if(kind==='backpack'){const w=34,h=46,dz=22,cy=-4+bob;const F=(a,b)=>P(a,b+cy,-24),Bk=(a,b)=>P(a,b+cy,-24-dz);
    parts.push(()=>{const faces=[[Bk(-w,h),Bk(w,h),Bk(w,-h),Bk(-w,-h)],[F(-w,h),Bk(-w,h),Bk(-w,-h),F(-w,-h)],[F(w,h),Bk(w,h),Bk(w,-h),F(w,-h)],[F(-w,h),F(w,h),Bk(w,h),Bk(-w,h)],[F(-w,h),F(w,h),F(w,-h),F(-w,-h)]];
      const cols=['#6a4424','#7a5030','#7a5030','#946238','#8a5a32'];faces.map((f,i)=>({f,i,d:avgD(f)})).sort((a,b)=>a.d-b.d).forEach(o=>{fillPoly(o.f,cols[o.i]);ctx.strokeStyle='rgba(40,20,8,.6)';ctx.lineWidth=.7*LW;cpoly(o.f);ctx.stroke();});
      const fl=[Bk(-w+2,h),Bk(w-2,h),Bk(w-2,h*.2),Bk(-w+2,h*.2)];fillPoly(fl,'#a8743e');const bk=Bk(0,h*.25);ctx.fillStyle='#d8b050';ctx.fillRect(bk[0]-2.5*LW,bk[1]-2*LW,5*LW,4*LW);
      const r0=P(-w-4,h+12+cy,-34),r1=P(w+4,h+12+cy,-34);ctx.strokeStyle='#3a5a8a';ctx.lineWidth=12*LW;ctx.beginPath();ctx.moveTo(r0[0],r0[1]);ctx.lineTo(r1[0],r1[1]);ctx.stroke();ctx.strokeStyle='#5a7ab0';ctx.lineWidth=7*LW;ctx.stroke();
      for(const xx of [-w*.5,w*.5]){const a=P(xx-3,h+12+cy,-40),b=P(xx+3,h+12+cy,-40);ctx.strokeStyle='#4a2a14';ctx.lineWidth=2*LW;ctx.beginPath();ctx.moveTo(a[0],a[1]-7*LW);ctx.lineTo(a[0],a[1]+7*LW);ctx.stroke();}
      const pan=P(w+2,-h*.4+cy,-34);ctx.fillStyle='#3a3e46';ctx.beginPath();ctx.arc(pan[0],pan[1],7*LW,0,TAU);ctx.fill();ctx.strokeStyle='#8a909c';ctx.lineWidth=1*LW;ctx.stroke();});}
  {const SCL={royalscepter:1.45,twinblades:1.55,twinkatana:1.5,moonglaive:1.55,chainflail:1.4,ankhstaff:1.5,spearshield:1.45,macuahuitl:1.5,wagasa:1.3,runeaxes:1.5}[kind]||1,OY={royalscepter:20,twinblades:14,twinkatana:16,moonglaive:24,chainflail:10,ankhstaff:20,spearshield:10,macuahuitl:14,wagasa:10,runeaxes:14}[kind]||0;
   const P=(a,b,z=-26)=>R.proj(a*SCL,b*SCL+OY,z),LW=SPR*3*SCL;
  const line=(A,B,z=-28)=>{const dx=B[0]-A[0],dy=B[1]-A[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy,ny=ux;const Q=(s,w)=>P(A[0]+ux*s+nx*w,A[1]+uy*s+ny*w,z);Q.l=l;return Q;};
  const sword=(Q,col,guard,grip,gem,curve=0,len=null)=>{const L=len||Q.l;if(GP==='fx')return;
    const bl=[];for(let i=0;i<=8;i++){const s=40+(L-40)*i/8,c=curve*Math.sin(Math.PI*i/8);bl.push(Q(s,11-(i===8?11:0)+c));}for(let i=8;i>=0;i--){const s=40+(L-40)*i/8,c=curve*Math.sin(Math.PI*i/8);bl.push(Q(s,-11+(i===8?11:0)+c));}
    fillPoly(bl,lgrad(Q(40,-11),Q(40,11),col));ctx.strokeStyle='rgba(20,20,30,.55)';ctx.lineWidth=.7*LW;ctx.beginPath();for(let i=0;i<=8;i++){const s=44+(L-52)*i/8,c=curve*Math.sin(Math.PI*i/8);const q=Q(s,c);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();
    fillPoly([Q(28,-28),Q(31,-31),Q(39,-24),Q(39,24),Q(31,31),Q(28,28)],guard);fillPoly([Q(2,-4),Q(30,-4),Q(30,4),Q(2,4)],grip);
    const pm=Q(-2,0);ctx.fillStyle=guard;ctx.beginPath();ctx.arc(pm[0],pm[1],3.4*LW,0,TAU);ctx.fill();if(gem){ctx.fillStyle=gem;ctx.beginPath();ctx.arc(pm[0],pm[1],1.5*LW,0,TAU);ctx.fill();const gc=Q(34,0);ctx.beginPath();ctx.arc(gc[0],gc[1],2*LW,0,TAU);ctx.fill();}};
  if(kind==='royalscepter'){const Q=line([30,96+bob],[-30,-64+bob]);parts.push(()=>{if(GP==='fx'){const tp=Q(-6,0),k=.6+.4*Math.sin(t*3);const g=ctx.createRadialGradient(tp[0],tp[1],0,tp[0],tp[1],18*LW);g.addColorStop(0,`rgba(255,220,140,${.5*k})`);g.addColorStop(1,'rgba(255,220,140,0)');ctx.globalCompositeOperation='lighter';ctx.fillStyle=g;ctx.beginPath();ctx.arc(tp[0],tp[1],18*LW,0,TAU);ctx.fill();return;}
      fillPoly([Q(10,-3.5),Q(Q.l,-3),Q(Q.l,3),Q(10,3.5)],lgrad(Q(10,-3),Q(10,3),['#8a6418','#f4d070','#a07420']));for(const s of [26,60,100,Q.l-4]){fillPoly([Q(s-3,-5.5),Q(s+3,-5.5),Q(s+3,5.5),Q(s-3,5.5)],'#e2b84a');}
      const c=Q(-4,0);ctx.fillStyle='#b81e30';ctx.beginPath();ctx.arc(c[0],c[1],8*LW,0,TAU);ctx.fill();ctx.fillStyle='rgba(255,180,190,.8)';ctx.beginPath();ctx.arc(c[0]-2.5*LW,c[1]-2.5*LW,2.6*LW,0,TAU);ctx.fill();
      ctx.fillStyle='#e8bc48';ctx.strokeStyle='#7a5410';ctx.lineWidth=.7*LW;ctx.beginPath();ctx.moveTo(c[0]-11*LW,c[1]+2*LW);ctx.lineTo(c[0]-12*LW,c[1]-10*LW);ctx.lineTo(c[0]-6*LW,c[1]-4*LW);ctx.lineTo(c[0],c[1]-13*LW);ctx.lineTo(c[0]+6*LW,c[1]-4*LW);ctx.lineTo(c[0]+12*LW,c[1]-10*LW);ctx.lineTo(c[0]+11*LW,c[1]+2*LW);ctx.closePath();ctx.fill();ctx.stroke();
      for(const dx of [-12,0,12]){ctx.fillStyle='#fff3c0';ctx.beginPath();ctx.arc(c[0]+dx*LW,c[1]-(dx?10:13)*LW,1.6*LW,0,TAU);ctx.fill();}});}
  if(kind==='twinblades'){const Q1=line([-36,96+bob],[38,-74+bob]),Q2=line([36,96+bob],[-38,-74+bob],-30);
    parts.push(()=>{sword(Q2,['#1e3a8a','#6aa8f0','#2a4aa0'],'#d8b050','#2a2030','#3ac0ff');sword(Q1,['#7a0e18','#f0505a','#8a1420'],'#d8b050','#2a2030','#ff4a4a');});}
  if(kind==='twinkatana'){const Q1=line([-30,98+bob],[34,-84+bob]),Q2=line([34,96+bob],[-26,-86+bob],-30);
    parts.push(()=>{if(GP==='fx'){ctx.globalCompositeOperation='lighter';for(const Q of [Q1,Q2]){if(Math.sin(t*9+(Q===Q1?0:2))<.1)continue;ctx.strokeStyle='rgba(180,90,255,.85)';ctx.lineWidth=1.4*LW;ctx.beginPath();let q=Q(40,0);ctx.moveTo(q[0],q[1]);for(let s=56;s<Q.l;s+=16){q=Q(s,(Math.random()-.5)*26);ctx.lineTo(q[0],q[1]);}ctx.stroke();ctx.strokeStyle='rgba(120,40,220,.35)';ctx.lineWidth=5*LW;ctx.stroke();}return;}
      for(const [Q,c] of [[Q2,['#8a8e9a','#f4f6fa','#9aa0ac']],[Q1,['#8a8e9a','#f4f6fa','#9aa0ac']]]){
        fillPoly([Q(40,-7),Q(Q.l-12,-2),Q(Q.l,4),Q(Q.l-14,6),Q(40,6)],lgrad(Q(40,-7),Q(40,6),c));ctx.strokeStyle='rgba(30,30,40,.5)';ctx.lineWidth=.6*LW;ctx.beginPath();ctx.moveTo(...Q(42,2));ctx.lineTo(...Q(Q.l-14,2));ctx.stroke();
        const ts=[];for(let i=0;i<10;i++){const a=i/10*TAU;ts.push(Q(34+Math.cos(a)*4,Math.sin(a)*13));}fillPoly(ts,'#c49a3a');
        fillPoly([Q(0,-5),Q(30,-5),Q(30,5),Q(0,5)],'#1a1420');ctx.strokeStyle='#c8a050';ctx.lineWidth=.8*LW;for(let s=4;s<30;s+=6){ctx.beginPath();ctx.moveTo(...Q(s,-5));ctx.lineTo(...Q(s+3,5));ctx.moveTo(...Q(s+3,-5));ctx.lineTo(...Q(s,5));ctx.stroke();}}});}
  if(kind==='moonglaive'){const Q=line([26,100+bob],[-22,-92+bob]);parts.push(()=>{if(GP==='fx'){const c=Q(-14,0),k=.5+.5*Math.sin(t*2.4);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(c[0],c[1],0,c[0],c[1],26*LW);g.addColorStop(0,`rgba(230,230,255,${.35*k})`);g.addColorStop(1,'rgba(200,200,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(c[0],c[1],26*LW,0,TAU);ctx.fill();return;}
      fillPoly([Q(6,-3),Q(Q.l,-3),Q(Q.l,3),Q(6,3)],lgrad(Q(6,-3),Q(6,3),['#3a3a4e','#7a7a92','#3a3a4e']));for(const s of [40,80,120]){fillPoly([Q(s-2,-4.5),Q(s+2,-4.5),Q(s+2,4.5),Q(s-2,4.5)],'#c8b070');}
      const c=Q(-12,0),a0=Math.atan2(Q(0,0)[1]-Q(-10,0)[1],Q(0,0)[0]-Q(-10,0)[0]);ctx.save();ctx.translate(c[0],c[1]);ctx.rotate(a0+Math.PI/2);
      ctx.fillStyle='#f2f0fa';ctx.strokeStyle='#5a5470';ctx.lineWidth=.9*LW;ctx.beginPath();ctx.arc(0,0,13*LW,-Math.PI*.9,Math.PI*.9,false);ctx.arc(7*LW,0,11*LW,Math.PI*.7,-Math.PI*.7,true);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#e8bc48';ctx.beginPath();ctx.arc(-2*LW,0,2.4*LW,0,TAU);ctx.fill();ctx.restore();});}
  if(kind==='ankhstaff'){const Q=line([28,100+bob],[-26,-80+bob]);parts.push(()=>{if(GP==='fx'){const a=Q(-16,0),k=.5+.5*Math.sin(t*2);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(a[0],a[1],0,a[0],a[1],16*LW);g.addColorStop(0,`rgba(255,220,120,${.4*k})`);g.addColorStop(1,'rgba(255,200,80,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(a[0],a[1],16*LW,0,TAU);ctx.fill();return;}
      fillPoly([Q(6,-3),Q(Q.l,-3),Q(Q.l,3),Q(6,3)],lgrad(Q(6,-3),Q(6,3),['#8a6418','#f4d070','#8a6418']));for(const s of [30,70,110]){fillPoly([Q(s-3,-4.5),Q(s+3,-4.5),Q(s+3,4.5),Q(s-3,4.5)],'#23419e');}
      const c=Q(-2,0),an=Math.atan2(Q(0,0)[1]-Q(10,0)[1],Q(0,0)[0]-Q(10,0)[0]);ctx.save();ctx.translate(c[0],c[1]);ctx.rotate(an+Math.PI/2);ctx.strokeStyle='#7a5410';ctx.lineWidth=.8*LW;
      ctx.fillStyle='#f0c858';ctx.fillRect(-11*LW,-2.6*LW,22*LW,5.2*LW);ctx.strokeRect(-11*LW,-2.6*LW,22*LW,5.2*LW);
      ctx.lineWidth=4.2*LW;ctx.strokeStyle='#7a5410';ctx.beginPath();ctx.ellipse(0,-9*LW,6*LW,8*LW,0,0,TAU);ctx.stroke();ctx.lineWidth=3*LW;ctx.strokeStyle='#f0c858';ctx.stroke();ctx.restore();});}
  if(kind==='spearshield'){const Q=line([-30,120+bob],[34,-110+bob],-34);parts.push(()=>{if(GP==='fx')return;
      fillPoly([Q(10,-2.6),Q(Q.l,-2.6),Q(Q.l,2.6),Q(10,2.6)],'#7a4e2a');fillPoly([Q(-26,0),Q(-6,-6),Q(10,-4),Q(10,4),Q(-6,6)],lgrad(Q(-26,0),Q(10,0),['#f4e6c0','#c49a3a','#8a6418']));
      const C=[0,8+bob],r=36,o=[],o2=[];for(let i=0;i<28;i++){const a=i/28*TAU;o.push(P(C[0]+Math.cos(a)*r,C[1]+Math.sin(a)*r,-28));o2.push(P(C[0]+Math.cos(a)*(r-7),C[1]+Math.sin(a)*(r-7),-27));}
      fillPoly(o,'#a8742a');fillPoly(o2,lgrad(o2[18],o2[4],['#e8c060','#b88a30']));ctx.strokeStyle='#5a3a10';ctx.lineWidth=.8*LW;cpoly(o);ctx.stroke();
      const m=P(C[0],C[1],-26);ctx.save();ctx.translate(m[0],m[1]);ctx.fillStyle='#6a4410';ctx.beginPath();ctx.moveTo(0,-9*LW);ctx.lineTo(7*LW,6*LW);ctx.lineTo(-7*LW,6*LW);ctx.closePath();ctx.fill();ctx.fillStyle='#e8c060';ctx.beginPath();ctx.arc(0,1*LW,2.2*LW,0,TAU);ctx.fill();ctx.restore();});}
  if(kind==='macuahuitl'){const Q=line([-30,96+bob],[34,-78+bob]);parts.push(()=>{if(GP==='fx')return;
      fillPoly([Q(0,-4),Q(30,-4),Q(30,4),Q(0,4)],'#4a2a14');fillPoly([Q(30,-12),Q(Q.l,-14),Q(Q.l+8,0),Q(Q.l,14),Q(30,12)],lgrad(Q(30,-12),Q(30,12),['#6a4020','#a8743e','#6a4020']));
      for(let s=36;s<Q.l;s+=11)for(const sd of [-1,1]){fillPoly([Q(s,sd*12),Q(s+5,sd*21),Q(s+10,sd*13)],'#141018');ctx.strokeStyle='rgba(150,150,200,.6)';ctx.lineWidth=.5*LW;ctx.beginPath();ctx.moveTo(...Q(s+2,sd*14));ctx.lineTo(...Q(s+5,sd*19));ctx.stroke();}
      ctx.strokeStyle='#20b0b4';ctx.lineWidth=1.6*LW;for(let s=50;s<Q.l-10;s+=26){ctx.beginPath();ctx.moveTo(...Q(s,-6));ctx.lineTo(...Q(s+6,0));ctx.lineTo(...Q(s,6));ctx.stroke();}
      const pm=Q(-2,0);ctx.fillStyle='#c4282a';ctx.beginPath();ctx.arc(pm[0],pm[1],3*LW,0,TAU);ctx.fill();});}
  if(kind==='wagasa'){parts.push(()=>{if(GP==='fx')return;const C=[16,70+bob,-50],r=62,n=16,ring=[],hub=P(C[0]-4,C[1]+12,C[2]-8);
      for(let i=0;i<n;i++){const a=i/n*TAU;ring.push(P(C[0]+Math.cos(a)*r,C[1]+Math.sin(a)*r*.42-18,C[2]+Math.sin(a)*r*.75));}
      const h0=P(-4,-30,-24);ctx.strokeStyle='#3a2414';ctx.lineWidth=2.4*LW;ctx.beginPath();ctx.moveTo(h0[0],h0[1]);ctx.lineTo(hub[0],hub[1]);ctx.stroke();
      for(let i=0;i<n;i++){const a=ring[i],b=ring[(i+1)%n];fillPoly([hub,a,b],i%2?'#c42a2a':'#d83a34');}
      ctx.strokeStyle='rgba(60,10,10,.55)';ctx.lineWidth=.6*LW;for(const q of ring){ctx.beginPath();ctx.moveTo(hub[0],hub[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}
      ctx.strokeStyle='#f4ead8';ctx.lineWidth=2.2*LW;ctx.beginPath();for(let i=0;i<n;i++){const a=ring[i],b=ring[(i+1)%n];const f=.62;const pa=[hub[0]+(a[0]-hub[0])*f,hub[1]+(a[1]-hub[1])*f],pb=[hub[0]+(b[0]-hub[0])*f,hub[1]+(b[1]-hub[1])*f];i?ctx.lineTo(pa[0],pa[1]):ctx.moveTo(pa[0],pa[1]);ctx.lineTo(pb[0],pb[1]);}ctx.stroke();
      ctx.fillStyle='#2a1810';ctx.beginPath();ctx.arc(hub[0],hub[1],2.6*LW,0,TAU);ctx.fill();
      const ts=ring[4];ctx.strokeStyle='#e6b030';ctx.lineWidth=1*LW;ctx.beginPath();ctx.moveTo(ts[0],ts[1]);ctx.lineTo(ts[0]+Math.sin(t*2)*2*LW,ts[1]+10*LW);ctx.stroke();ctx.fillStyle='#e6b030';ctx.beginPath();ctx.arc(ts[0]+Math.sin(t*2)*2*LW,ts[1]+11*LW,1.8*LW,0,TAU);ctx.fill();});}
  if(kind==='runeaxes'){const Q1=line([-34,92+bob],[30,-64+bob]),Q2=line([34,92+bob],[-30,-64+bob],-30);
    const axe=(Q,sd)=>{fillPoly([Q(-4,-3.6),Q(Q.l,-3.6),Q(Q.l,3.6),Q(-4,3.6)],lgrad(Q(0,-3),Q(0,3),['#4a2a14','#8a5a2e','#4a2a14']));for(let s=Q.l*.55;s<Q.l;s+=8){ctx.strokeStyle='#c49a3a';ctx.lineWidth=.8*LW;ctx.beginPath();ctx.moveTo(...Q(s,-3.6));ctx.lineTo(...Q(s+3,3.6));ctx.stroke();}
      const b=[Q(4,sd*3),Q(2,sd*16),Q(-6,sd*30),Q(18,sd*34),Q(30,sd*24),Q(26,sd*3)];fillPoly(b,lgrad(b[0],b[3],['#5a606c','#c8ced8','#eef2f6']));ctx.strokeStyle='#2a2e36';ctx.lineWidth=.8*LW;cpoly(b);ctx.stroke();
      const rn=Q(14,sd*16);ctx.strokeStyle='#5ad8ff';ctx.lineWidth=.9*LW;ctx.beginPath();ctx.moveTo(rn[0]-2*LW,rn[1]-3*LW);ctx.lineTo(rn[0],rn[1]+3*LW);ctx.lineTo(rn[0]+2*LW,rn[1]-3*LW);ctx.moveTo(rn[0]-1*LW,rn[1]-1*LW);ctx.lineTo(rn[0]+1.6*LW,rn[1]);ctx.stroke();};
    parts.push(()=>{if(GP==='fx'){ctx.globalCompositeOperation='lighter';const k=.5+.5*Math.sin(t*3);for(const [Q,sd] of [[Q1,1],[Q2,-1]]){const rn=Q(14,sd*16);ctx.fillStyle=`rgba(90,216,255,${.35*k})`;ctx.beginPath();ctx.arc(rn[0],rn[1],5*LW,0,TAU);ctx.fill();}return;}axe(Q2,-1);axe(Q1,1);});}
  if(kind==='chainflail'){const Q=line([34,90+bob],[-20,-30+bob]);parts.push(()=>{if(GP==='fx')return;
      fillPoly([Q(0,-4.5),Q(Q.l,-4),Q(Q.l,4),Q(0,4.5)],lgrad(Q(0,-4),Q(0,4),['#3a2416','#7a4e2a','#3a2416']));fillPoly([Q(-6,-6),Q(4,-6),Q(4,6),Q(-6,6)],'#8a909c');
      const top=Q(-6,0),sw=Math.sin(t*(moving?8:2))*(moving?14:5);let px=top[0],py=top[1];const links=[];for(let i=1;i<=7;i++){const f=i/7;links.push([top[0]-28*LW*f+sw*LW*f*f,top[1]-4*LW*f+40*LW*f*f]);}
      ctx.strokeStyle='#5a606c';ctx.lineWidth=1.6*LW;for(const [lx,ly] of links){ctx.beginPath();ctx.ellipse((px+lx)/2,(py+ly)/2,Math.hypot(lx-px,ly-py)/2+.5*LW,1.6*LW,Math.atan2(ly-py,lx-px),0,TAU);ctx.stroke();px=lx;py=ly;}
      const [bx,by]=links[links.length-1];ctx.fillStyle='#4a4e58';for(let k=0;k<8;k++){const a=k/8*TAU;ctx.beginPath();ctx.moveTo(bx+Math.cos(a-.25)*6*LW,by+Math.sin(a-.25)*6*LW);ctx.lineTo(bx+Math.cos(a)*11*LW,by+Math.sin(a)*11*LW);ctx.lineTo(bx+Math.cos(a+.25)*6*LW,by+Math.sin(a+.25)*6*LW);ctx.fill();}
      const g=ctx.createRadialGradient(bx-2*LW,by-2*LW,0,bx,by,7.5*LW);g.addColorStop(0,'#c8ccd6');g.addColorStop(1,'#3a3e48');ctx.fillStyle=g;ctx.beginPath();ctx.arc(bx,by,7.5*LW,0,TAU);ctx.fill();
      const rb=Q(Q.l*.15,0);ctx.strokeStyle='#d8263a';ctx.lineWidth=3*LW;ctx.beginPath();ctx.moveTo(rb[0],rb[1]);ctx.bezierCurveTo(rb[0]+10*LW,rb[1]+10*LW+Math.sin(t*3)*4*LW,rb[0]+4*LW,rb[1]+24*LW,rb[0]+14*LW+Math.sin(t*2.4)*5*LW,rb[1]+36*LW);ctx.stroke();ctx.strokeStyle='#ff6a7a';ctx.lineWidth=1*LW;ctx.stroke();});}
  }
  const d=P(0,0)[2];return {front:d>R.body,draw:()=>{ctx.save();ctx.lineJoin='round';ctx.lineCap='round';for(const f of parts)f();ctx.restore();}};}
const BACKS={
  greatsword:{n:'Runebrand Greatsword (Back)',d:'ดาบใหญ่สะพายหลังแนวทแยง ด้ามพันหนังฝังพลอยฟ้า',b:{str:1}},
  vikingshield:{n:'Raider Round Shield (Back)',d:'โล่กลมไวกิ้งลายแฉกแดงขาว ขอบเหล็กหมุดย้ำ',b:{vit:1}},
  quiver:{n:'Hunter Quiver',d:'กระบอกลูกธนูหนังสะพายหลัง ขนนกแดงขาว',b:{dex:1}},
  royalscepter:{n:'Royal Crown Scepter',d:'คทามงกุฎทองฝังทับทิม สะพายเฉียงหลัง เรืองแสงทองที่ยอด',b:{int:2}},
  twinblades:{n:'Crimson & Azure Twin Blades',d:'ดาบคู่แดงกับฟ้าไขว้กันกลางหลัง',b:{str:1,agi:1}},
  twinkatana:{n:'Stormshade Twin Katana',d:'คาตานะคู่ไขว้หลัง มีสายฟ้าสีม่วงแลบรอบใบดาบ',b:{agi:2}},
  moonglaive:{n:'Crescent Moon Glaive',d:'ง้าวใบจันทร์เสี้ยวสีเงิน เรืองแสงจันทร์จาง ๆ',b:{luk:2}},
  chainflail:{n:'Spiked Chain Flail',d:'กระบองโซ่ลูกเหล็กหนาม แกว่งตามจังหวะเดิน มีริบบิ้นแดงพลิ้ว',b:{str:2}},
  ankhstaff:{n:'Ankh of Ra Staff',d:'คทาอังค์ทองคาดลาพิส เรืองแสงทองที่ยอด',b:{int:2}},
  spearshield:{n:'Hoplite Shield & Spear',d:'โล่ทองแดงกลมกับหอกยาวไขว้หลังแบบนักรบสปาร์ตา',b:{vit:2}},
  macuahuitl:{n:'Obsidian Macuahuitl',d:'กระบองไม้ใบมีดหินออบซิเดียนเรียงสองข้าง ลายเทอร์คอยซ์',b:{str:2}},
  wagasa:{n:'Red Wagasa Umbrella',d:'ร่มกระดาษญี่ปุ่นสีแดงกางพาดหลัง พู่ทองแกว่ง',b:{luk:2}},
  runeaxes:{n:'Twin Rune Bearded Axes',d:'ขวานจะงอยคู่ไขว้หลัง สลักรูนเรืองฟ้า',b:{str:1,vit:1}},
  backpack:{n:'Adventurer Pack',d:'เป้เดินทางหนัง มีม้วนผ้าห่มกับกระทะห้อยข้าง',b:{vit:1}},
};

function wingsFor(e,x,y,t,moving){const g=FEQ.garment;SER_S=1;SER_PAL=null;let W=null;
  if(g==='icewings')W=wingGeom(e,x,y,t,moving);else if(g==='seraphwings')W=seraphGeom(e,x,y,t,moving);else if(g==='featherwings')W=foldedGeom(e,x,y,t,moving);
  else if(g==='batwings')W=batGeom(e,x,y,t,moving);else if(CAPES[g]){const c=capeGeom(e,x,y,t,moving,CAPES[g].cfg);if(c){W=[{front:c.front,draw:tt=>drawCape(c,tt)}];const cl=capeClasp(e,x,y,CAPES[g].cfg);if(cl&&cl.front)W.push(cl);}}else if(WING2[g])W=WING2[g].g(e,x,y,t,moving);else if(g==='angelwings'){SER_S=.6;SER_PAL=WHITE_COL;W=seraphGeom(e,x,y,t,moving);SER_S=1;SER_PAL=null;}
  if(W)W.kind=g;return W;}
/* wing growth by Base Lv (NosTale-style stages) */
const WING_STAGES=[[1,.74],[20,.8],[40,.87],[60,.93],[80,1],[99,1.06]];
/* design evolution: inner layers first, outer layers grow in, final stage adds an extra crown tier */
function evoMap(o,fn){if(Array.isArray(o)){if(o.length===2&&typeof o[0]==='number'&&typeof o[1]==='number')return fn(o);return o.map(x=>evoMap(x,fn));}return o;}
function evolveShapes(S){const st=WGROW.pv!=null?WGROW.pv:wingStage();if(!S.length)return S;const maxL=Math.max(...S.map(s=>s.lay)),minL=Math.min(...S.map(s=>s.lay));
  const keepFrom=st===0?maxL:st===1?Math.max(minL+1,maxL-1):minL,shrink=st===2?.55:st===3?.8:1;
  const out=[];for(const s0 of S){if(s0.lay<keepFrom)continue;let s=s0;if(s.lay===minL&&shrink<1){const g=s.g0,f=q=>[g[0]+(q[0]-g[0])*shrink,g[1]+(q[1]-g[1])*shrink];s={...s};for(const k of ['uv','faces','hl','ridge','g1','spine','tipuv','facets'])if(s[k])s[k]=evoMap(s[k],f);}out.push(s);}
  if(st===5){const ext=[];for(const s0 of S){if(s0.lay!==minL)continue;const g=s0.g0,c=Math.cos(.32),sn=Math.sin(.32),f=q=>{const u=(q[0]-g[0])*1.12,v=(q[1]-g[1])*1.12;return [g[0]+u*c-v*sn+6,g[1]+u*sn+v*c-4];};const s={...s0};for(const k of ['uv','faces','hl','ridge','g0','g1','spine','tipuv','facets'])if(s[k])s[k]=k==='g0'?s[k]:evoMap(s[k],f);ext.push(s);}
    return [...ext,...out];}
  return out;}
function wingStage(){const lv=(typeof PS!=='undefined'&&PS.lv)||1;let i=0;for(let k=0;k<WING_STAGES.length;k++)if(lv>=WING_STAGES[k][0])i=k;return i;}
const WGROW={s:1,a:null,st:0,on:true};
function drawWingAny(W,w,t){const G=WGROW,sc=G.on&&G.a&&!(W.kind&&CAPES[W.kind]);if(sc){ctx.save();ctx.translate(G.a[0],G.a[1]);ctx.scale(G.s,G.s);ctx.translate(-G.a[0],-G.a[1]);}
  if(w.draw)w.draw(t);else (W.kind==='icewings'?drawWing:W.kind==='batwings'?drawBat:drawSeraph)(w,t);
  if(sc){if(G.st===5&&GP!=='body'&&w===W[W.length-1]){ctx.globalCompositeOperation='lighter';const L=SPR*3;for(let i=0;i<10;i++){const a=t*.8+i/10*TAU,r=(60+12*Math.sin(t*2+i))*L;const px=G.a[0]+Math.cos(a)*r,py=G.a[1]-30*L+Math.sin(a)*r*.55;star4(px,py,(1+.8*Math.sin(t*4+i))*L,'rgba(255,236,160,.9)');}}ctx.restore();}}
function drawGear(e,x,y,layer,moving){if(!window.FASHION||!e)return;const t=performance.now()/1000;{const R=rigFor(e,x,y,-8);WGROW.a=R?R.proj(0,0,-14):null;WGROW.st=WGROW.pv!=null?WGROW.pv:wingStage();WGROW.s=WING_STAGES[WGROW.st][1];}
  if(layer===0){_gearW=wingsFor(e,x,y,t,moving);_gearC=costumeParts(e,x,y,t).sort((a,b)=>a.d-b.d);_gearB=FEQ.back&&BACKS[FEQ.back]?backGeom(e,x,y,t,moving,FEQ.back):null;const W2=_gearW,C2=_gearC,BB=_gearB;
    if(BB&&!BB.front)harmonized(x,y,()=>BB.draw());
    const back=C2.filter(p=>p.d<-6),wb=W2&&W2.some(w=>!w.front),wo=W2&&W2.outline?{oc:W2.outline,grade:false,crisp:W2.crisp}:null;
    if(wb&&wo)harmonized(x,y,()=>{for(const w of W2)if(!w.front)drawWingAny(W2,w,t);},wo);
    if((wb&&!wo)||back.length)harmonized(x,y,()=>{if(W2&&!wo)for(const w of W2)if(!w.front)drawWingAny(W2,w,t);for(const p of back){ctx.save();p.f();ctx.restore();}});return;}
  const W2=_gearW,C2=_gearC||[],BB=_gearB;_gearW=null;_gearC=null;_gearB=null;const wo=W2&&W2.outline?{oc:W2.outline,grade:false,crisp:W2.crisp}:null;
  harmonized(x,y,()=>{drawFashion(e,x,y);for(const p of C2)if(p.d>=-6){ctx.save();p.f();ctx.restore();}if(FEQ.rhand==='iceaxe')drawGlacierAxe(e,x,y,t);else if(FEQ.rhand==='stormaxe')drawStormAxe(e,x,y,t);if(W2&&!wo)for(const w of W2)if(w.front)drawWingAny(W2,w,t);});
  if(wo&&W2.some(w=>w.front))harmonized(x,y,()=>{for(const w of W2)if(w.front)drawWingAny(W2,w,t);},wo);
  if(BB&&BB.front)harmonized(x,y,()=>BB.draw());}


/* ---------- costume items ---------- */
const COSTUME_ITEMS_DEF={halo:{n:'Angel Halo',slot:'top',kind:'Upper Headgear',def:1,w:10,b:{int:1},d:'วงแหวนเทวทูตลอยเหนือหัว INT +1'},devilhorns:{n:'Devil Horns',slot:'top',kind:'Upper Headgear',def:2,w:20,b:{str:1},d:'เขาปีศาจสีแดงเข้ม STR +1'},bunnyband:{n:'Bunny Band',slot:'top',kind:'Upper Headgear',def:1,w:10,b:{agi:1},d:'ที่คาดผมหูกระต่าย หูข้างหนึ่งพับ AGI +1'},crown:{n:'Royal Crown',slot:'top',kind:'Upper Headgear',def:3,w:40,b:{luk:2},d:'มงกุฎทองฝังอัญมณี LUK +2'},witchhat:{n:'Witch Hat',slot:'top',kind:'Upper Headgear',def:2,w:30,b:{int:2},d:'หมวกแม่มดทรงสูงปลายพับ INT +2'},bigribbon:{n:'Big Ribbon',slot:'top',kind:'Upper Headgear',def:1,w:10,b:{dex:1},d:'โบว์ใหญ่สีแดงผูกหลังศีรษะ DEX +1'},flowerpin:{n:'Flower Hairpin',slot:'mid',kind:'Middle Headgear',def:0,w:5,b:{luk:1},d:'กิ๊บดอกไม้สีแดงที่ข้างหู LUK +1'},shades:{n:'Sunglasses',slot:'mid',kind:'Middle Headgear',def:0,w:10,b:{hit:3},d:'แว่นกันแดดสีดำ HIT +3'},pipe:{n:'Smoking Pipe',slot:'low',kind:'Lower Headgear',def:0,w:10,b:{vit:1},d:'ไปป์ไม้มีควันลอยเบาๆ VIT +1'},batwings:{n:'Bat Wings',slot:'garment',kind:'Garment',def:2,mdef:3,w:30,b:{flee:8},d:'ปีกค้างคาวสีม่วงดำ กระพือเร็ว FLEE +8'},angelwings:{n:'Little Angel Wings',slot:'garment',kind:'Garment',def:2,mdef:3,w:30,b:{flee:6,int:1},d:'ปีกเทวดาสีขาวขนาดเล็ก FLEE +6 · INT +1'}};

const FITEMS={
 stormaxe:{n:'Stormcaller Rune Axe',slot:'rhand',two:1,kind:'Two-Handed Axe',atk:210,wlv:4,aspd:152,ref:7,cards:2,w:280,b:{dex:2,agi:1},d:'ขวานรูนเรียกพายุ ใบเหล็กหม่นมีรอยร้าวเรืองแสงฟ้า ฟ้าแลบตามคมขวานเวลาฟัน DEX +2 · AGI +1'},
 iceaxe:{n:'Glacier Greataxe',slot:'rhand',two:1,kind:'Two-Handed Axe',atk:200,wlv:4,aspd:150,ref:7,cards:2,w:300,b:{int:2},d:'ขวานคริสตัลน้ำแข็งสองคม เรืองแสงไอเย็นตลอดเวลา INT +2'},
 greataxe:{n:'Frostbite Greataxe',slot:'rhand',two:1,kind:'Two-Handed Axe',atk:180,wlv:4,aspd:150,ref:7,cards:2,w:300,b:{},d:'ขวานสองมือหลอมจากน้ำแข็งนิรันดร์ หนักแต่ฟันแรง'},
 cleaver:{n:'Wolfking Cleaver',slot:'rhand',two:1,kind:'Two-Handed Axe',atk:220,wlv:4,aspd:146,ref:4,cards:1,w:380,b:{str:3,agi:-2},d:'ขวานของราชาหมาป่า ATK สูงแต่ช้ากว่า'},
 hatchet:{n:'Rune Hatchet',slot:'rhand',kind:'One-Handed Axe',atk:145,wlv:3,aspd:156,ref:5,cards:3,w:120,b:{dex:2},d:'ขวานมือเดียวสลักรูน ใช้คู่กับโล่ได้'},
 buckler:{n:'Frost Buckler',slot:'lhand',kind:'Shield',def:4,mdef:1,ref:5,cards:1,w:60,b:{},aspdPen:5,d:'โล่เล็กเคลือบน้ำแข็ง (ASPD −5)'},
 wolfhelm:{n:'Wolf Ears Helm',slot:'top',kind:'Upper Headgear',def:3,ref:4,cards:1,w:40,b:{agi:1},d:'หมวกหูหมาป่า AGI +1'},
 vikinghelm:{n:'Horned War Helm',slot:'top',kind:'Upper Headgear',def:5,ref:0,cards:0,w:80,b:{str:2},d:'หมวกเขาสงคราม STR +2'},
 visor:{n:'Frost Visor',slot:'mid',kind:'Middle Headgear',def:0,w:10,b:{hit:5},d:'แว่นกันหิมะ HIT +5'},
 fangmask:{n:'Fang Mask',slot:'low',kind:'Lower Headgear',def:0,w:10,b:{str:1},d:'หน้ากากเขี้ยวหมาป่า STR +1'},
 mail:{n:'Wolfhide Mail',slot:'armor',kind:'Armor',def:8,mdef:2,ref:5,cards:1,w:200,b:{vit:1},d:'เกราะหนังหมาป่าขาว VIT +1'},
 ...COSTUME_ITEMS_DEF,...SET2_ITEMS,...ARMOR_ITEMS,...ABYSS_ITEMS,
 featherwings:{n:'Dawnfeather Wings',slot:'garment',kind:'Garment',def:3,mdef:4,ref:7,cards:1,w:30,b:{flee:8,agi:2},d:'ปีกขนนกสีครีมทองที่หุบอยู่ด้านหลัง ขยับเบาๆ เหมือนหายใจ FLEE +8 · AGI +2'},
 seraphwings:{n:'Seraph Wings',slot:'garment',kind:'Garment',def:3,mdef:5,ref:7,cards:1,w:30,b:{flee:10,luk:2},d:'ปีกขนนกสีทองแห่งเทวทูต กระพือช้าๆ อย่างสง่างาม FLEE +10 · LUK +2'},
 icewings:{n:'Glacial Wings',slot:'garment',kind:'Garment',def:3,mdef:4,ref:5,cards:1,w:30,b:{flee:12},d:'ปีกผลึกน้ำแข็งกระพือเบาๆ เปล่งประกายที่ปลายขน FLEE +12'},
 cape:{n:'Moonwolf Cape',slot:'garment',kind:'Garment',def:2,mdef:3,ref:5,cards:1,w:30,b:{flee:10},d:'ผ้าคลุมแสงจันทร์ FLEE +10'},
 boots:{n:'Snowstrider Boots',slot:'shoes',kind:'Shoes',def:2,ref:4,cards:1,w:40,b:{agi:1,hpPct:5},d:'รองเท้าลุยหิมะ AGI +1 · MaxHP +5%'},
 ringFury:{n:'Ring of Fury',slot:'acc',kind:'Accessory',w:10,b:{str:2},d:'แหวนแห่งความโกรธ STR +2'},
 ringSwift:{n:'Ring of Swiftness',slot:'acc',kind:'Accessory',w:10,b:{agi:2},d:'แหวนความเร็ว AGI +2'},
 ringPrec:{n:'Ring of Precision',slot:'acc',kind:'Accessory',w:10,b:{dex:3},d:'แหวนแม่นยำ DEX +3'},
 clipLuck:{n:'Clover Clip',slot:'acc',kind:'Accessory',cards:1,w:10,b:{luk:3,crit:3},d:'กิ๊บใบโคลเวอร์ LUK +3 · CRIT +3'}};
for(const k of ['cleaver','hatchet','buckler','boots','ringFury','ringSwift','ringPrec','clipLuck'])delete FITEMS[k];   /* plain gear, not costumes */
/* ---------- painted wings (one picture per view: S, SE, E, NE, N; W side = mirror) ---------- */
const PWING=window.PWING;
const PWIMG={};function pwImg(k,v){const key=k+v;let im=PWIMG[key];if(!im){im=new Image();im.src=PWING[k].dir+v+'.webp';PWIMG[key]=im;}return im.complete&&im.naturalWidth?im:null;}
function pwingGeom(k,e,x,y,t,moving){const C=PWING[k],sd=srcDir(e.d),mir=isMir(e.d),tr=FASHION.head[e.st]&&FASHION.head[e.st][sd];if(!tr)return null;
  const im=pwImg(k,sd);if(!im)return null;const hp=tr[Math.min(e.f,tr.length-1)],bo=BACK_OFF[sd]||[0,62];let ax=hp[0]+bo[0];if(mir)ax=SPR_META.cell.w-ax;const bk=sd==='N'||sd==='NE',ay=hp[1]+bo[1]+(bk?12:-10);
  const [sx,sy]=c2s(ax,ay,x,y),r=C.root[sd],side=sd==='E',w=(side?C.span*.42:sd==='S'?C.span:sd==='N'?C.span*.88:sd==='NE'?C.span*.78:C.span*.85)*SPR,h=w*im.naturalHeight/im.naturalWidth;
  const sp=moving?7:2.6,amp=moving?.16:.07,ph=Math.sin(t*sp),front=sd==='N'||sd==='NE';
  return [{front,draw:()=>{if(GP==='fx')return;ctx.save();ctx.translate(sx,sy);if(mir)ctx.scale(-1,1);const W=im.naturalWidth,H=im.naturalHeight,rx=r[0]*W,ry=r[1]*H,k=w/W;
    if(side){ctx.rotate(-ph*amp*1.4);ctx.drawImage(im,-rx*k,-ry*k,w,h);}
    else for(const sg of [-1,1]){ctx.save();ctx.rotate(sg*ph*amp);ctx.scale(1-.06*(ph*.5+.5)*(moving?1:.5),1);ctx.beginPath();if(sg<0)ctx.rect(-rx*k-2,-ry*k-2,rx*k+2.5,h+4);else ctx.rect(-.5,-ry*k-2,(W-rx)*k+2,h+4);ctx.clip();ctx.drawImage(im,-rx*k,-ry*k,w,h);ctx.restore();}
    ctx.restore();}}];}
for(const k in PWING)WING2[k]={g:(e,x,y,t,m)=>pwingGeom(k,e,x,y,t,m),it:PWING[k].it};
for(const k in CAPES)FITEMS[k]={slot:'garment',kind:'Garment',n:CAPES[k].n,d:CAPES[k].d,b:CAPES[k].b};
for(const k in BACKS)FITEMS[k]={slot:'back',kind:'Back Accessory',n:BACKS[k].n,d:BACKS[k].d,b:BACKS[k].b};
for(const k in WING2)FITEMS[k]={slot:'garment',kind:'Garment',...WING2[k].it};
const FEQ={top:null,mid:null,low:null,shoulder:null,armor:null,garment:null,back:null,rhand:null};
const FINV=Object.keys(FITEMS);   /* every costume unlocked for now (no drop / shop source yet) */
const FSAVE='af_fashion_'+(typeof CHAR!=='undefined'?CHAR:'wolf');
try{const sv=JSON.parse(localStorage.getItem(FSAVE)||'null');if(sv)for(const k in FEQ)if(sv[k]===null||FITEMS[sv[k]])FEQ[k]=sv[k];}catch(_){}
function fSave(){try{localStorage.setItem(FSAVE,JSON.stringify(FEQ));}catch(_){}}
function fEquip(id){const it=FITEMS[id];if(!it)return;FEQ[it.slot]=id;fSave();gearCalc();if(typeof buildEquip==='function')try{buildEquip();}catch(_){}}
function fUnequip(sl){FEQ[sl]=null;fSave();gearCalc();if(typeof buildEquip==='function')try{buildEquip();}catch(_){}}

/* ---------- sets ---------- */
/* ---------- Fashion sets: pieces that belong together + full-set bonus ---------- */
const FSETS=[
 {id:'egypt',n:'ชุดฟาโรห์',en:'Pharaoh of the Sun',pieces:{top:'nemes',low:'usekh',garment:'egyptwings',back:'ankhstaff'},fur:'#26232c',bonus:{int:3,dex:2},bd:'INT +3 · DEX +2'},
 {id:'greek',n:'ชุดวีรบุรุษโอลิมปัส',en:'Olympian Hero',pieces:{top:'laurel',low:'goldtorc',garment:'greekwings',back:'spearshield'},fur:'#e8c870',bonus:{str:2,luk:3},bd:'STR +2 · LUK +3'},
 {id:'aztec',n:'ชุดนักรบเควตซัล',en:'Quetzal Warrior',pieces:{top:'quetzalcrown',mid:'jademask',garment:'aztecwings',back:'macuahuitl'},fur:'#2a2226',bonus:{agi:3,str:2},bd:'AGI +3 · STR +2'},
 {id:'japan',n:'ชุดซามูไรจันทร์เสี้ยว',en:'Crescent Samurai',pieces:{top:'kabuto',mid:'kitsunemask',garment:'japanwings',back:'wagasa'},fur:'#f2f2f6',bonus:{agi:2,dex:3},bd:'AGI +2 · DEX +3'},
 {id:'viking',n:'ชุดวัลคิรี',en:'Valkyrie of Asgard',pieces:{top:'valkyriehelm',mid:'odinpatch',garment:'vikingwings',back:'runeaxes'},fur:'#e8c870',bonus:{str:3,vit:2},bd:'STR +3 · VIT +2'},
 {id:'a_viking',n:'เกราะจาร์ลไวกิ้ง',en:'Jarl Warplate',pieces:{top:'valkyriehelm',shoulder:'vikpauldron',garment:'wolfcape',back:'vikingshield',rhand:'stormaxe'},fur:'',bonus:{str:4,vit:3},bd:'STR +4 · VIT +3'},
 {id:'a_greek',n:'เกราะฮอปไลต์',en:'Hoplite Bronze',pieces:{top:'corinthhelm',shoulder:'greekpauldron',low:'goldtorc',garment:'royalcape',back:'spearshield'},fur:'',bonus:{str:3,vit:2,flee:5},bd:'STR +3 · VIT +2 · FLEE +5'},
 {id:'a_egypt',n:'เกราะศึกฟาโรห์',en:'Pharaoh Warlord',pieces:{top:'khepresh',shoulder:'egyptpauldron',low:'usekh',garment:'egyptwings',back:'ankhstaff'},fur:'',bonus:{int:4,dex:2},bd:'INT +4 · DEX +2'},
 {id:'a_aztec',n:'เกราะอัศวินจากัวร์',en:'Jaguar Knight',pieces:{top:'jaguarhelm',shoulder:'aztecpauldron',mid:'jademask',garment:'aztecwings',back:'macuahuitl'},fur:'',bonus:{agi:4,str:2},bd:'AGI +4 · STR +2'},
 {id:'a_japan',n:'เกราะโชกุน',en:'Shogun Armor',pieces:{top:'kabuto',shoulder:'japanpauldron',garment:'japanwings',back:'twinkatana'},fur:'',bonus:{dex:3,agi:3},bd:'DEX +3 · AGI +3'},
 {id:'abyss',n:'เกราะราชันย์แห่งห้วงลึก',en:'Abyss Sovereign',pieces:{top:'abysshelm',shoulder:'abysspauldron',armor:'abyssplate',garment:'abyssflame',rhand:'greataxe'},fur:'',bonus:{str:5,vit:4,int:2},bd:'STR +5 · VIT +4 · INT +2'}];
function setCount(S){let n=0,t=0;for(const sl in S.pieces){t++;if(FEQ[sl]===S.pieces[sl])n++;}return [n,t];}
function setsOf(id){return FSETS.filter(S=>Object.values(S.pieces).includes(id));}
function wearSet(S){for(const sl in S.pieces){const id=S.pieces[sl];if(FEQ[sl]===id)continue;if(FINV.indexOf(id)<0){for(const s2 in EQ)if(FEQ[s2]===id&&s2!==sl){FEQ[s2]=null;FINV.push(id);}}if(FINV.indexOf(id)>=0)fEquip(id);}
  if(S.fur&&typeof lookApply==='function'){lkDraft=S.fur;lookPrepare().then(()=>{lookApply(S.fur);lookSave();});}msg('สวมชุด '+S.n+' แล้ว');}



/* costume bonuses: each worn piece + full set, old keys (str/dex/luk…) mapped to the 8 stats */
(function(){const mapK=k=>(typeof OLD_KEY!=='undefined'&&OLD_KEY[k])||k;const _gc=gearCalc;
  gearCalc=function(){const r=_gc.apply(this,arguments);
    for(const sl in FEQ){const it=FITEMS[FEQ[sl]];if(it&&it.b)for(const k in it.b)BON[mapK(k)]=(BON[mapK(k)]||0)+it.b[k];}
    for(const S of FSETS){const [n,t]=setCount(S);if(n===t)for(const k in S.bonus)BON[mapK(k)]=(BON[mapK(k)]||0)+S.bonus[k];}
    return r;};
  if(!document.getElementById('lookw')){const d=document.createElement('div');d.id='lookw';d.className='ro';document.body.appendChild(d);}
  const st=document.createElement('style');st.textContent='#lookw{left:50%;top:50%;transform:translate(-50%,-50%);width:600px}\n.wg-info{font-size:11px;color:#2a3a5a;margin-bottom:5px;line-height:1.5}.wg-row{display:flex;gap:3px;align-items:center;flex-wrap:wrap}.wg-st{padding:0 7px!important;height:20px!important;font-size:11px!important}.wg-st.on{background:#ffb04a!important;color:#fff!important}\n.wr-sets{display:flex;flex-direction:column;gap:4px;max-height:262px;overflow:auto;padding-right:2px}.wr-set{border:1px solid #c8d2e4;border-radius:4px;background:#fff;padding:3px 5px}.wr-set.full{border-color:#ff9a2a;background:#fff8ec}\n.wr-sh{display:flex;align-items:center;gap:5px}.wr-sh small{color:#889}.wr-cnt{margin-left:auto;font-weight:bold;color:#5a6a8a}.wr-wear{padding:1px 6px!important;font-size:10px!important;height:auto!important}\n.wr-pcs{display:flex;flex-wrap:wrap;gap:2px 6px;margin:2px 0}.wr-pc{display:inline-flex;align-items:center;gap:2px;color:#99a;font-size:10px}.wr-pc.on{color:#2a3a5a;font-weight:bold}.wr-bonus{font-size:10px;color:#aab}.wr-bonus.on{color:#d07010;font-weight:bold}\n.wr-tabs{margin-bottom:6px}.wr-grid{display:grid;grid-template-columns:1fr 1fr;gap:3px;max-height:200px;overflow:auto;padding-right:2px}.wr-it{display:flex;align-items:center;gap:4px;height:28px;border:1px solid #c8d2e4;border-radius:3px;background:#fff;cursor:pointer;font:11px Tahoma,Sarabun,sans-serif;text-align:left;padding:0 4px;overflow:hidden;white-space:nowrap}.wr-it span{overflow:hidden;text-overflow:ellipsis}.wr-it:hover{background:#eef4ff}.wr-it.on{border-color:#ff9a2a;background:#fff4e4;box-shadow:inset 0 0 0 1px #ff9a2a}.wr-it b{width:22px;text-align:center;color:#889}\n.lk{display:flex;gap:8px}.lk-pv{display:flex;flex-direction:column;align-items:center;gap:4px}.lk-pv canvas{border:1px solid #9aa8c4;border-radius:4px}\n.lk-rows{flex:1;display:flex;flex-direction:column;gap:5px}.lk-row{display:flex;align-items:center;gap:6px}.lk-n{width:58px;font-weight:bold;color:#2a3a5a}\n.lk-sws{display:flex;flex-wrap:wrap;gap:3px;align-items:center}.lk-sw{width:20px;height:20px;border:1px solid #6a7894;border-radius:4px;cursor:pointer;padding:0}.lk-sw.on{outline:2px solid #ff9a2a;outline-offset:1px}\n.lk-link{width:auto;padding:0 4px;background:#eef2fa;font:bold 10px Tahoma}.lk-pick{width:26px;height:22px;border:none;padding:0;background:none;cursor:pointer}\n.lk-btns{display:flex;gap:4px;margin-top:6px}.lk-ok{margin-left:auto;font-weight:bold}.lk-wait{color:#888;font-style:italic}\n';document.head.appendChild(st);
  try{gearCalc();}catch(_){}
})();

/* ---------- wardrobe, fur and skin colour ---------- */
/* =========================================================
   FUR COLOUR — recolors only the wolf fur (hair, ears, tail) using a soft per-pixel weight mask
   (assets_fur.js). Shading is kept by mapping each pixel's lightness relative to the fur mean.
   ========================================================= */
const SKIN_DEF='';
const SKIN_SW=[['','ผิวเดิม'],['#7c6e6c','เทาอมน้ำตาล'],['#b4b6be','เทา'],['#cfd1d8','เทาอ่อน'],['#8e9098','เทาเข้ม'],['#e8e4ea','ขาวซีด'],['#d8a47a','แทน'],['#9a6a48','คล้ำ'],['#a8c4e0','ฟ้าซีด']];
const FUR_SW=[['','สีเดิม (ขาวชมพู)'],['#ffffff','ขาว'],['#ece6f2|#7a1e2a','ขาวม่วง เงาแดงเลือดหมู'],['#f4f2f6|#3a3442','ขาว เงาเทาเข้ม'],['#e8eef8|#2a4a8a','ขาว เงาน้ำเงิน'],['#f2f2f6','ขาวหิมะ'],['#a8adb8','เทาเงิน'],['#5a5c66','เทาเข้ม'],['#26232c','ดำ'],['#7a5236','น้ำตาล'],['#c8935a','น้ำตาลทอง'],['#e8c870','ทอง'],['#d8662e','ส้มจิ้งจอก'],['#b8323a','แดง'],['#7ab4e8','ฟ้าน้ำแข็ง'],['#3a5aa8','น้ำเงิน'],['#8a6ad0','ม่วง'],['#f29ac2','ชมพู']];
const LOOK={ready:false,data:{},mean:.8,cur:'',active:false};
function hex2hsl(h){const r=parseInt(h.substr(1,2),16)/255,g=parseInt(h.substr(3,2),16)/255,b=parseInt(h.substr(5,2),16)/255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;let H=0,S=0;
  if(d>0){S=d/(1-Math.abs(2*l-1));H=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;H*=60;if(H<0)H+=360;}return [H,S,l];}
function lookPrepare(){if(LOOK.prep)return LOOK.prep;
  LOOK.prep=Promise.all(Object.keys(SPR_ATLAS).map(st=>new Promise(res=>{const a=new Image(),m=new Image(),sk=new Image();let n=0;const done=()=>{if(++n<3)return;
      const c=document.createElement('canvas');c.width=a.width;c.height=a.height;const g=c.getContext('2d');g.drawImage(a,0,0);const px=g.getImageData(0,0,c.width,c.height);
      g.clearRect(0,0,c.width,c.height);g.drawImage(m,0,0);const md=g.getImageData(0,0,c.width,c.height).data,wt=new Float32Array(c.width*c.height);for(let i=0;i<wt.length;i++)wt[i]=md[i*4]/255;
      g.clearRect(0,0,c.width,c.height);g.drawImage(sk,0,0);const sd=g.getImageData(0,0,c.width,c.height).data,sw=new Float32Array(c.width*c.height);for(let i=0;i<sw.length;i++)sw[i]=sd[i*4]/255;
      LOOK.data[st]={w:c.width,h:c.height,px,wt,sw};res();};a.onload=done;m.onload=done;sk.onload=done;a.src=SPR_ATLAS[st];m.src=FUR_MASK[st];sk.src=SKIN_MASK[st];})))
    .then(()=>{const hist=new Float64Array(256);for(const st in LOOK.data){const {px,wt}=LOOK.data[st],d=px.data;for(let i=0;i<wt.length;i++){if(wt[i]<.85)continue;const j=i*4;hist[Math.round(.299*d[j]+.587*d[j+1]+.114*d[j+2])]++;}}
      const tot=hist.reduce((a,b)=>a+b,0),pc=q=>{let c=0;for(let k=0;k<256;k++){c+=hist[k];if(c>=tot*q)return k/255;}return 1;};LOOK.lo=pc(.03);LOOK.hi=pc(.985);LOOK.mean=pc(.5);
      let ss=0,sc=0;for(const st in LOOK.data){const {px,sw}=LOOK.data[st],d=px.data;for(let i=0;i<sw.length;i++){if(sw[i]<.8)continue;const j=i*4;ss+=(.299*d[j]+.587*d[j+1]+.114*d[j+2])/255;sc++;}}LOOK.smean=sc?ss/sc:.8;LOOK.ready=true;});
  return LOOK.prep;}
let SKIN_CUR=SKIN_DEF;
function lookApply(hex){if(!LOOK.ready)return;
  if(!hex&&!SKIN_CUR){for(const st in LOOK.data){const c=document.createElement('canvas');c.width=LOOK.data[st].w;c.height=LOOK.data[st].h;c.getContext('2d').putImageData(LOOK.data[st].px,0,0);SPRITE.img[st]=c;}}
  else{const duo=hex&&hex.includes('|'),hx0=hex?hex.split('|')[0]:'#000000',hx1=duo?hex.split('|')[1]:null,dr=duo?parseInt(hx1.substr(1,2),16):0,dg=duo?parseInt(hx1.substr(3,2),16):0,db=duo?parseInt(hx1.substr(5,2),16):0,tr=parseInt(hx0.substr(1,2),16),tg=parseInt(hx0.substr(3,2),16),tb=parseInt(hx0.substr(5,2),16),M=LOOK.mean,tl=(Math.max(tr,tg,tb)+Math.min(tr,tg,tb))/510;
    const lo=LOOK.lo,span=Math.max(.1,LOOK.hi-LOOK.lo),hiAmt=.18+.32*(1-tl);
    for(const st in LOOK.data){const {w,h,px,wt}=LOOK.data[st],src=px.data,out=new ImageData(w,h),o=out.data;o.set(src);
      if(hex)for(let i=0;i<wt.length;i++){const a=wt[i];if(a<=.004)continue;const j=i*4;const r=src[j],g=src[j+1],b=src[j+2];
        const Y=(.299*r+.587*g+.114*b)/255,t=Math.min(1.1,Math.max(0,(Y-lo)/span));const sh=1-(1-(.38+.82*t))*(1-.62*Math.pow(tl,2));let R=Math.min(255,tr*sh),G=Math.min(255,tg*sh),B=Math.min(255,tb*sh);if(duo){const m=Math.pow(Math.min(1,Math.max(0,(t-.08)/.8)),1.3);R=dr+(tr-dr)*m;G=dg+(tg-dg)*m;B=db+(tb-db)*m;}
        if(t>.8){const k=Math.min(1,(t-.8)/.25)*hiAmt;R+=(255-R)*k;G+=(255-G)*k;B+=(255-B)*k;}
        o[j]=r+(R-r)*a;o[j+1]=g+(G-g)*a;o[j+2]=b+(B-b)*a;}
      if(SKIN_CUR){const sr=parseInt(SKIN_CUR.substr(1,2),16),sg=parseInt(SKIN_CUR.substr(3,2),16),sb=parseInt(SKIN_CUR.substr(5,2),16),SM=LOOK.smean,sw=LOOK.data[st].sw;
        for(let i=0;i<sw.length;i++){const a=sw[i];if(a<=.004)continue;const j=i*4,r=src[j],g=src[j+1],b=src[j+2];const k=Math.min(1.25,((.299*r+.587*g+.114*b)/255)/SM);
          let R=sr*k,G=sg*k,B=sb*k;if(k>1){const h=(k-1)*1.2;R+=(255-R)*h*.5;G+=(255-G)*h*.5;B+=(255-B)*h*.5;}
          o[j]=r+(Math.min(255,R)-r)*a;o[j+1]=g+(Math.min(255,G)-g)*a;o[j+2]=b+(Math.min(255,B)-b)*a;}}
      const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').putImageData(out,0,0);SPRITE.img[st]=c;}}
  for(const k in tintCache)delete tintCache[k];LOOK.active=!!(hex||SKIN_CUR);LOOK.cur=hex||'';}
const lookKey=()=>'af_fur_'+CHAR;
function lookSave(){try{localStorage.setItem(lookKey(),LOOK.cur);localStorage.setItem('af_skin_'+CHAR,SKIN_CUR);}catch(e){}}
function skinLoad(){try{return localStorage.getItem('af_skin_'+CHAR)||SKIN_DEF;}catch(e){return SKIN_DEF;}}
function lookLoad(){try{return localStorage.getItem(lookKey())||'';}catch(e){return '';}}
let lkDir=0,lkDraft='',lkTab='sets';
const WR_TABS=[['sets','ชุดเซ็ต'],['fur','สีขน'],['top','หมวก'],['mid','หน้า'],['low','ปาก'],['shoulder','ไหล่'],['armor','เกราะ'],['garment','ปีก'],['back','ติดหลัง'],['rhand','อาวุธ']];
function wrItems(sl){const ids=new Set(FINV.filter(id=>FITEMS[id]&&FITEMS[id].slot===sl));if(FEQ[sl]&&FITEMS[FEQ[sl]])ids.add(FEQ[sl]);return [...ids];}
function buildLook(){const w=document.getElementById('lookw');if(!w)return;
  const tabs=WR_TABS.map(([k,n])=>`<button data-t="${k}" class="${lkTab===k?'on':''}">${n}</button>`).join('');
  let body='';
  if(lkTab==='sets'){body=`<div class="wr-sets">`+FSETS.map(S=>{const [n,t]=setCount(S),full=n===t;const ps=Object.entries(S.pieces).map(([sl,id])=>`<span class="wr-pc${FEQ[sl]===id?' on':''}" title="${FITEMS[id].d||''}">${itemIcon(FITEMS[id],16)}${FITEMS[id].n.replace(/ \(Back\)/,'')}</span>`).join('');
      return `<div class="wr-set${full?' full':''}"><div class="wr-sh"><b>${S.n}</b><small>${S.en}</small><span class="wr-cnt">${n}/${t}</span><button class="rob wr-wear" data-s="${S.id}">${full?'✔ ใส่ครบแล้ว':'ใส่ทั้งชุด'}</button></div><div class="wr-pcs">${ps}</div><div class="wr-bonus${full?' on':''}">โบนัสครบชุด: ${S.bd}</div></div>`;}).join('')+`</div>`;}
  else if(lkTab==='fur'){const sw=FUR_SW.map(([c,n])=>`<button class="lk-sw${(lkDraft||'')===c?' on':''}" data-c="${c}" title="${n}" style="background:${c?(c.includes('|')?`linear-gradient(135deg,${c.split('|')[0]} 55%,${c.split('|')[1]} 55%)`:c):'linear-gradient(135deg,#f6eef2 50%,#e8c8d6 50%)'}"></button>`).join('');
    const nm=(FUR_SW.find(x=>x[0]===lkDraft)||[0,lkDraft?'สีที่เลือกเอง':'สีเดิม'])[1];
    body=`<div class="lk-n" style="width:auto">สีขน (ผม · หู · หาง) — <span style="font-weight:normal">${nm}</span></div><div class="lk-sws">${sw}<input type="color" class="lk-pick" value="${(lkDraft||'#f2f2f6').split('|')[0]}" title="เลือกสีเอง"></div><div class="lk-n" style="width:auto;margin-top:8px">สีผิว (หน้า · มือ) — <span style="font-weight:normal">${(SKIN_SW.find(x=>x[0]===SKIN_CUR)||[0,SKIN_CUR?'สีที่เลือกเอง':'ผิวเดิม'])[1]}</span></div><div class="lk-sws">${SKIN_SW.map(([c,n])=>`<button class="lk-sw sk-sw${SKIN_CUR===c?' on':''}" data-k="${c}" title="${n}" style="background:${c||'#f6d2b8'}"></button>`).join('')}<input type="color" class="sk-pick" value="${SKIN_CUR||'#f6d2b8'}" title="เลือกสีเอง" style="width:26px;height:22px;border:none;padding:0;background:none"></div>${LOOK.ready?'':'<div class="lk-wait">กำลังเตรียมสไปรต์…</div>'}`;}
  else if(lkTab==='garment'){const ids=wrItems(lkTab),st=wingStage(),lv=PS.lv,nx=WING_STAGES[st+1];
    const stg=WING_STAGES.map((q,k)=>`<button class="rob wg-st${(WGROW.pv!=null?WGROW.pv:st)===k?' on':''}" data-k="${k}" title="Lv ${q[0]}+">${k+1}</button>`).join('');
    body=`<div class="wg-info"><b>ขนาดปีกตามเลเวล:</b> ขั้น ${st+1}/6 (Base Lv ${lv})${nx?` · ขั้นต่อไปที่ Lv ${nx[0]}`:' · ขั้นสูงสุด ✨'}<div class="wg-row">ดูตัวอย่างขั้น: ${stg}<button class="rob wg-st" data-k="-1">ตามเลเวล</button></div></div>`+
      `<div class="wr-grid"><button class="wr-it${FEQ[lkTab]?'':' on'}" data-id=""><b>✕</b><span>ไม่ใส่</span></button>`+ids.map(id=>{const it=FITEMS[id];return `<button class="wr-it${FEQ[lkTab]===id?' on':''}" data-id="${id}" title="${it.d||''}">${itemIcon(it,22)}<span>${it.n}</span></button>`;}).join('')+`</div>`;}
  else{const ids=wrItems(lkTab);
    body=`<div class="wr-grid"><button class="wr-it${FEQ[lkTab]?'':' on'}" data-id="">${lkTab==='rhand'?'<b>—</b><span>ไม่เปลี่ยน</span>':'<b>✕</b><span>ไม่ใส่</span>'}</button>`+ids.map(id=>{const it=FITEMS[id];return `<button class="wr-it${FEQ[lkTab]===id?' on':''}" data-id="${id}" title="${it.d||''}">${itemIcon(it,22)}<span>${it.n}</span></button>`;}).join('')+`</div>`;}
  roWin('lookw','แต่งตัว',`<div class="ro-tabs wr-tabs">${tabs}</div><div class="lk"><div class="lk-pv"><canvas id="lkcv" width="220" height="290"></canvas><div><button class="rob" id="lkrl">◀</button><button class="rob" id="lkrr">▶</button></div></div><div class="lk-rows">${body}
    <div class="lk-btns"><button class="rob" id="lkreset">รีเซ็ตสี</button><button class="rob lk-ok" id="lksave">✔ เสร็จ</button></div></div></div>`);
  w.querySelectorAll('.wr-tabs button').forEach(b=>b.onclick=()=>{lkTab=b.dataset.t;buildLook();});
  w.querySelectorAll('.lk-sw:not(.sk-sw)').forEach(b=>b.onclick=()=>{lkDraft=b.dataset.c;if(lkDraft.includes('|')&&!SKIN_CUR)SKIN_CUR='#7c6e6c';else if(lkDraft==='#ffffff'&&!SKIN_CUR)SKIN_CUR='#b4b6be';lookLive();});
  w.querySelectorAll('.sk-sw').forEach(b=>b.onclick=()=>{SKIN_CUR=b.dataset.k;lookLive();});
  const skp=w.querySelector('.sk-pick');if(skp)skp.oninput=e=>{SKIN_CUR=e.target.value;lookLive(true);};
  const pk=w.querySelector('.lk-pick');if(pk)pk.oninput=e=>{lkDraft=e.target.value;lookLive(true);};
  w.querySelectorAll('.wg-st').forEach(b=>b.onclick=()=>{const k=+b.dataset.k;WGROW.pv=k<0?null:k;buildLook();});
  w.querySelectorAll('.wr-wear').forEach(b=>b.onclick=()=>{const S=FSETS.find(x=>x.id===b.dataset.s);wearSet(S);setTimeout(buildLook,80);});
  w.querySelectorAll('.wr-it').forEach(b=>b.onclick=()=>{const id=b.dataset.id;if(!id){if(lkTab!=='rhand')fUnequip(lkTab);}else if(FEQ[lkTab]!==id)fEquip(id);buildLook();});
  w.querySelector('#lkrl').onclick=()=>{lkDir=(lkDir+1)%8;};w.querySelector('#lkrr').onclick=()=>{lkDir=(lkDir+7)%8;};
  w.querySelector('#lkreset').onclick=()=>{lkDraft='';SKIN_CUR=SKIN_DEF;lookLive();};
  w.querySelector('#lksave').onclick=()=>{WGROW.pv=null;lookApply(lkDraft);lookSave();lkSaved=true;w.classList.remove('open');msg('บันทึกการแต่งตัวแล้ว');};
  drawLookPreview();}
let _lkT=0,lkSaved=false;function lookLive(soft){clearTimeout(_lkT);_lkT=setTimeout(()=>{lookApply(lkDraft);buildLook();},soft?60:0);}
function drawLookPreview(){const cv=document.getElementById('lkcv');if(!cv)return;const g=cv.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);
  const bg=g.createLinearGradient(0,0,0,cv.height);bg.addColorStop(0,'#dfe8f6');bg.addColorStop(1,'#b8c6de');g.fillStyle=bg;g.fillRect(0,0,cv.width,cv.height);
  g.fillStyle='rgba(40,60,100,.2)';g.beginPath();g.ellipse(110,262,40,10,0,0,TAU);g.fill();
  const d=EQDIRS[lkDir],st=Math.floor(performance.now()/2600)%2?'walk':'idle',D2=durs(st,d),T=D2.reduce((a,b)=>a+b,0);let ms=performance.now()%T,f=0;while(f<D2.length-1&&ms>=D2[f]){ms-=D2[f];f++;}
  const old=ctx;ctx=g;g.setTransform(2.2,0,0,2.2,0,0);const X=110/2.2,Y=262/2.2;try{drawGear({st,d,f},X,Y,0,st==='walk');g.filter=armorFilter()||'none';drawFrame({st,d,f},X,Y,1);g.filter='none';drawGear({st,d,f},X,Y,1,st==='walk');}finally{ctx=old;}}
setInterval(()=>{const w=document.getElementById('lookw');if(w&&!w.classList.contains('open'))WGROW.pv=null;if(w&&w.classList.contains('open'))drawLookPreview();else if(w&&!lkSaved&&LOOK.ready&&(LOOK.cur!==lookLoad()||SKIN_CUR!==skinLoad())){SKIN_CUR=skinLoad();lookApply(lookLoad());}},80);
function openLook(){const w=document.getElementById('lookw');lkDraft=LOOK.cur;lkSaved=false;w.classList.add('open');w.style.zIndex=40;buildLook();lookPrepare().then(()=>{if(w.classList.contains('open'))buildLook();});}
(function(){const panel=document.getElementById('chsel');if(panel){const b=document.createElement('button');b.className='rob';b.id='lookbtn';b.textContent='👗 แต่งตัว (สีขน · แฟชั่น)';b.style.cssText='margin:6px 0 2px;width:100%';b.onclick=openLook;panel.after(b);}
  const saved=lookLoad();SKIN_CUR=skinLoad();if(saved||SKIN_CUR)lookPrepare().then(()=>lookApply(saved));
  addEventListener('keydown',e=>{if(e.altKey&&(e.key==='c'||e.key==='C')){e.preventDefault();const w=document.getElementById('lookw');w.classList.contains('open')?w.classList.remove('open'):openLook();}});})();
window.lookTest={openLook,lookApply,lookPrepare,get L(){return LOOK}};

