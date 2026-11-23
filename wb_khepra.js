/* =====================================================================
   WORLD BOSS — Sunday: KHEPRA, THE SUN SCARAB (WORLD_BOSS_WEEK_TH.md §3). Core: world_boss.js.
   • The sun rolls: every ~26 s the scarab kicks its sun along a red lane across the sundial (heat 0–100, +1 a second while it
     rolls). A blue ✓ BRACE circle sits on the lane: 3 + N/10 people inside when the sun arrives (adv +2) → it bounces back, the
     scarab flips on its back = the window (15 s). Too few → it runs the whole lane (×12 + down) and heat +15.
   • Noon sun: every 120 s or at heat 100 it lifts the sun (4 s gold bar): empty the KO gauge → the sun drops on its head
     (stunned 8 s, heat 0); else the glare hits everyone outside the obelisks' shadows (×14 + burn) — shadows point away from it.
   • Gem question 'fire feeds the sun, ice cools it': hits on the sun ◎ with a fire-gem skill heat +2, ice-gem −2 (spirit mages cool it).
   • Moves: horn toss 9 s (cone ×10 + up) · burrow 25 s (under the top dealer ×11) · sun flare when a sun turns (×6 + burn).
   • Enrage: a second sun rolls with the first · advanced: a rolling sun leaves a burning trail for 10 s.
   ===================================================================== */
(function(){
'use strict';
const WB=window.WBOSS,MB=window.MBK;if(!WB||!MB)return;
const T2=Math.PI*2,hyp=Math.hypot,rn=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>v<a?a:v>b?b:v;
const RAT={0:1114/1220,1:1159/1229},SUN={cx:.71,cy:.74,rx:.285,ry:.265};
const OBEL=[[769,70],[245,240],[1290,244],[200,622],[1332,622],[767,828]];
const FRONT=1.0;
let st=null;
const units=()=>WB.units();
function off(S,fx,fy){const H=S.W*RAT[S.adv?1:0];return [(fx-.5)*S.W,(fy-.94)*H/K];}

function setup(S){const B=S.B;st=S.st={heat:0,suns:[],flip:0,noonT:110,obel:OBEL.map(p=>{const [x,y]=WB.F2W(p[0],p[1]);return {x,y};}),shade:[],body:null};
  st.suns.push(mkSun(S,0));MB.cd(B,'kick',6);MB.cd(B,'horn',5);MB.cd(B,'burrow',16);}
function mkSun(S,i){const B=S.B,[dx,dy]=off(S,SUN.cx,.99);return {i,x:B.x+dx+(i?-30:0),y:B.y+dy+(i?30:0),hx:B.x+dx,hy:B.y+dy,state:'rest',rot:0,d:0,path:null,hit:new Set(),part:null,cd:i?8:0,trail:0};}
function build(S){st=S.st;const B=S.B;
  st.body=WB.body({dx:-80,dy:-6,r:118,h:130,name:'Khepra',ko:1});
  for(const s of st.suns)s.part=WB.part({x:s.x,y:s.y,name:'Sun Orb',th:'ลูกอาทิตย์',r:60,h:120,nohp:1,auto:0,noNear:1,job:'part',kind:'sun',data:{s},def:20,mdef:20,flee:0,tlv:()=>[st.heat,100]});}
const restXY=(S,s)=>{const B=S.B,[dx,dy]=off(S,SUN.cx,.99);return [B.x+dx+(s.i?-40:0),B.y+dy+(s.i?36:0)];};

/* ---------------- the sun ---------------- */
function kick(S,s){const B=S.B,us=units();let best=FRONT,bn=-1;for(let k=0;k<12;k++){const a=k/12*T2;let c=0;for(const u of us)if(Math.abs(angDiff(Math.atan2(u.y-s.y,u.x-s.x),a))<.35)c++;c+=Math.cos(a-FRONT)*.5;if(c>bn){bn=c;best=a;}}
  if(s.i)best+=Math.PI*.6;let len=0;for(let L=200;L<1500;L+=40){const x=s.x+Math.cos(best)*L,y=s.y+Math.sin(best)*L;if(mapBlockedW(x,y))break;len=L;}len=Math.max(360,len);
  const path={x0:s.x,y0:s.y,phi:best,len},dz=len*.55,need=3+Math.round(S.N/10)+(S.adv?2:0),zx=s.x+Math.cos(best)*dz,zy=s.y+Math.sin(best)*dz,tele=2.2,spd=300;
  s.state='tele';s.t=0;s.path=path;s.d=0;s.hit=new Set();s.dz=dz;s.spd=spd;s.tele=tele;
  s.warn=WB.strike({shape:{k:'rect',x:s.x,y:s.y,phi:best,len,w:128},T:tele+len/spd,k:0,noHit:1,col:'red',boom:0,keep:1});
  const z=WB.zone({shape:{k:'circle',x:zx,y:zy,r:96},need,life:tele+dz/spd,label:'ยันลูกอาทิตย์!',cancelOnWin:1,onEnd:(ok)=>{s.zoneOk=ok;if(ok)bounce(S,s);}});s.zone=z;WB.crew(z,WB.need(need));
  flare(S,s);}
function bounce(S,s){s.state='back';s.warn&&(s.warn.dead=1);MB.banner('✦ ยันไว้ได้! ลูกอาทิตย์เด้งกลับใส่ด้วง','gold',2);s.bounced=1;}
function flare(S,s){WB.strike({shape:{k:'circle',x:s.x,y:s.y,r:92},T:.8,k:6,dot:['mbBurn',4,.8],col:'red',boomCol:'#ffb050'});}
function sunTick(S,s,dt){const B=S.B;
  if(s.state==='rest'){const [x,y]=restXY(S,s);s.x+=(x-s.x)*Math.min(1,dt*6);s.y+=(y-s.y)*Math.min(1,dt*6);return;}
  if(s.state==='tele'){s.t+=dt;if(s.t>=s.tele){s.state='roll';}return;}
  if(s.state==='roll'){st.heat=Math.min(100,st.heat+dt);const v=s.spd*dt;s.d+=v;s.rot+=v/60;const p=s.path;s.x=p.x0+Math.cos(p.phi)*s.d;s.y=p.y0+Math.sin(p.phi)*s.d;
    for(const u of units()){if(s.hit.has(u))continue;if(hyp(u.x-s.x,u.y-s.y)<78){s.hit.add(u);WB.dmg(u,12,{cc:['stun',1],fx:s.x,fy:s.y,push:60});}}
    if(S.adv&&(s.trail+=dt)>.35){s.trail=0;WB.field({shape:{k:'circle',x:s.x,y:s.y,r:60},life:10,every:.6,k:3,dot:['mbBurn',3,.6],col:'#ff6a2a'});}
    if(s.d>=p.len){st.heat=Math.min(100,st.heat+15);s.warn&&(s.warn.dead=1);MB.banner('☀ ลูกอาทิตย์ทับทั้งเส้น! ความร้อน +15','red',1.8);flare(S,s);s.state='back';s.bounced=0;}
    return;}
  if(s.state==='back'){const [x,y]=restXY(S,s),dx=x-s.x,dy=y-s.y,L=hyp(dx,dy),v=(s.bounced?520:340)*dt;s.rot-=v/60;
    if(L<=v+2){s.x=x;s.y=y;s.state='rest';if(s.bounced&&!(S.win>0)){flipOver(S);}return;}s.x+=dx/L*v;s.y+=dy/L*v;}}
function flipOver(S){st.heat=Math.max(0,st.heat-10);WB.window(15,'ลูกอาทิตย์เด้งใส่! ด้วงหงายท้อง');WB.poseTo({sy:-.92,py:.6,lift:26,spd:9});try{shake(6);}catch(e){}}

/* ---------------- noon ---------------- */
function noon(S){const B=S.B;st.noonT=120;const sun=st.suns[0];
  st.shade=st.obel.map(o=>{const a=Math.atan2(o.y-B.y,o.x-B.x),x=o.x+Math.cos(a)*92,y=o.y+Math.sin(a)*92*.9;return WB.zone({shape:{k:'circle',x,y,r:72},need:0,life:4,label:'เงา',pts:0});});
  WB.act({name:'ตะวันเที่ยง — ขัดได้! (หรือหลบในเงาเสา)',T:4,brk:true,
    start(){WB.poseTo({lift:18,rot:-.06,spd:4});MB.banner('☀ ตะวันเที่ยง! ตีด้วงให้เกจ KO หมด หรือหลบในเงาเสาโอเบลิสก์','gold',2.4);},
    end(){WB.poseTo();const safe=u=>st.shade.some(z=>MB.inShape(z.shape,u.x,u.y,6));for(const u of units())if(!safe(u))WB.dmg(u,14,{sure:1,magic:1,dot:['mbBurn',5,1]});
      glare(S);for(const z of st.shade)z.dead=1;st.shade=[];st.heat=Math.max(0,st.heat-20);},
    broken(){for(const z of st.shade)z.dead=1;st.shade=[];st.heat=0;WB.poseTo();WB.window(8,'ลูกอาทิตย์หล่นใส่หัว! มึน');try{shake(5);}catch(e){}}});}

/* ---------------- moves ---------------- */
function horn(S){const B=S.B,o={x:B.x-20,y:B.y+10};let best=FRONT,bn=-1;for(let k=-3;k<=3;k++){const a=FRONT+k*.35;let c=0;for(const u of units())if(hyp(u.x-o.x,u.y-o.y)<330&&Math.abs(angDiff(Math.atan2(u.y-o.y,u.x-o.x),a))<.5)c++;if(c>bn){bn=c;best=a;}}
  WB.act({name:'เขาเกี่ยวโยน!',T:1.05,start(){WB.strike({shape:{k:'cone',x:o.x,y:o.y,phi:best,half:.55,r:320},T:1,k:10,cc:['air',.8],boomCol:'#ffd890'});WB.poseTo({dx:Math.cos(best)*14,dy:Math.sin(best)*14,sx:1.03});},end(){WB.poseTo();}});
  MB.cd(B,'horn',9);}
function burrow(S){const B=S.B,u=WB.topDealer();if(!u){MB.cd(B,'burrow',6);return;}const x=u.x,y=u.y;
  WB.strike({shape:{k:'circle',x,y,r:104},T:1.25,k:11,cc:['air',.6],boomCol:'#e8c890',onFire:()=>{try{dustPuff(x,y,10,'#d8b880',110,14);}catch(e){}}});MB.say(B,'มุดทราย!','#ffd8a0',18);MB.cd(B,'burrow',25);}
function think(S,dt){const B=S.B;if(st.heat>=100||st.noonT<=0){noon(S);return;}
  if(MB.ready(B,'horn')){horn(S);return;}if(MB.ready(B,'burrow')){burrow(S);return;}}
function tick(S,dt){st=S.st;const B=S.B;
  for(const s of st.suns){sunTick(S,s,dt);if(s.part&&!s.part.dead){s.part.x=s.x;s.part.y=s.y;s.part.fixed=null;}}
  if(S.state!=='fight')return;
  if(!(S.win>0)&&!B.mb.act){st.noonT-=dt;}
  if(S.win<=0&&!(B.mb.act&&B.mb.act.brk!=null)){for(const s of st.suns){if(s.state!=='rest')continue;s.cd-=dt*(S.enr?1.6:1);if(s.cd<=0){s.cd=30;kick(S,s);}}}
  if(S.enr&&st.suns.length<2){const s2=mkSun(S,1);st.suns.push(s2);s2.part=WB.part({x:s2.x,y:s2.y,name:'Sun Orb',th:'ลูกอาทิตย์ลูกที่ 2',r:60,h:120,nohp:1,auto:0,noNear:1,job:'part',kind:'sun',data:{s:s2},def:20,mdef:20,flee:0,tlv:()=>[st.heat,100]});
    MB.banner('☀☀ ลูกอาทิตย์แตกเป็น 2 ลูก!','red',2.2);}}
function onHit(S,p,d,u,o){if(p.pkind!=='sun')return;let h=0;if(u.pl){const m=WB.mutOf(o.sk);if(m==='fire')h=2;else if(m==='ice')h=-2;}else if(u.role==='mage')h=-1;
  if(h){st.heat=cl(st.heat+h,0,100);if(u.pl&&(!p._hT||gameTime-p._hT>.4)){p._hT=gameTime;WB.say(p.x,p.y,130,(h>0?'ร้อน +':'เย็น ')+h,h>0?'#ffb060':'#a8e8ff',14);}}}
function winEnd(S){WB.poseTo();}

/* ---------------- allies ---------------- */
function allyJob(a,S){const act=S.B.mb.act;
  if(act&&act.brk!=null&&st.shade.length&&!(a.role==='melee'||a.role==='crit')){let b=null,bd=1e9;for(const z of st.shade){const d=hyp(z.shape.x-a.x,z.shape.y-a.y);if(d<bd){bd=d;b=z;}}if(b)return {x:b.shape.x+Math.cos(a.slot)*24,y:b.shape.y+Math.sin(a.slot)*16,r:10};}
  if(a.role==='mage'&&st.heat>=45){const s=st.suns.find(q=>q.part&&!q.part.dead);if(s)return {tgt:s.part};}
  return null;}
const target=(a,S)=>st.body&&!st.body.dead?st.body:null;
const pickDefault=S=>st.body;

/* ---------------- drawing ---------------- */
const sunApart=S=>st.suns[0].state!=='rest'||st.suns.length>1||S.win>0||S.B.pose.sy<.6;
function clipBody(S,W,H){if(!sunApart(S))return;const po=S.B.pose,cx=-W*po.px+SUN.cx*W,cy=-H*po.py+SUN.cy*H;
  ctx.beginPath();ctx.rect(-W*po.px-4,-H*po.py-4,W+8,H+8);ctx.ellipse(cx,cy,SUN.rx*W,SUN.ry*H,0,0,T2);ctx.clip('evenodd');}
class SunFx{constructor(){this.layer='sorted';this.sy=0;this.t=0;}update(dt){this.t+=dt;const S=WB.S;if(!S||S.gone||S.key!=='khepra')return false;this.sy=Math.max(...st.suns.map(s=>s.y))+2;return true;}
  draw(){const S=WB.S,I=S.pic;if(!I.ok)return;const W=S.W,H=W*RAT[S.adv?1:0],img=I.img,iw=img.width,ih=img.height;
    for(const s of st.suns){if(s.i===0&&!sunApart(S))continue;const [x,y]=P(s.x,s.y,0),rx=SUN.rx*W,ry=SUN.ry*H;
      ctx.save();ctx.globalAlpha=.35;ctx.fillStyle='#2a1408';ctx.beginPath();ctx.ellipse(x,y,rx*.8,rx*.22,0,0,T2);ctx.fill();ctx.restore();
      ctx.save();ctx.translate(x,y-ry);ctx.rotate(s.rot);ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,T2);ctx.clip();
      ctx.drawImage(img,(SUN.cx-SUN.rx)*iw,(SUN.cy-SUN.ry)*ih,SUN.rx*2*iw,SUN.ry*2*ih,-rx,-ry,rx*2,ry*2);ctx.restore();
      const hk=st.heat/100;if(hk>.05){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y-ry,rx*.4,x,y-ry,rx*1.5);g.addColorStop(0,`rgba(255,180,60,${.35*hk})`);g.addColorStop(1,'rgba(255,90,20,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y-ry,rx*1.5,0,T2);ctx.fill();ctx.restore();}}}}
function drawOn(S){const s=st.suns[0];const ac=S.B.mb.act;
  if(ac&&ac.brk!=null){const q=WB.picAt(SUN.cx,.3);if(q){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(q[0],q[1],0,q[0],q[1],140);g.addColorStop(0,'rgba(255,250,200,.85)');g.addColorStop(1,'rgba(255,190,60,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q[0],q[1],140,0,T2);ctx.fill();ctx.restore();}}
  for(const q of st.suns){if(!q.part||q.part.dead)continue;const [x,y]=P(q.x,q.y,q.state==='rest'&&st.suns.length<2?S.W*RAT[S.adv?1:0]*.3:SUN.ry*S.W*RAT[S.adv?1:0]);
    ctx.save();ctx.font='700 13px Mitr,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#3a2408';ctx.strokeText('◎',x,y-SUN.ry*S.W*.9-6);ctx.fillStyle='#ffd23a';ctx.fillText('◎',x,y-SUN.ry*S.W*.9-6);ctx.restore();}}
function glare(S){addFx({layer:'top',t:0,update(dt){this.t+=dt;return this.t<.6;},draw(){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=.5*(1-this.t/.6);ctx.fillStyle='#fff6d0';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}});try{shake(3);}catch(e){}}
function hud(S){const s0=st.suns[0],ac=S.B.mb.act;const ph=S.win>0?'✦ ด้วงหงายท้อง! ตีท้องได้เต็มที่':ac&&ac.brk!=null?'☀ ตะวันเที่ยง! ตีด้วงให้เกจ KO หมด หรือหลบในเงาเสา':
    st.suns.some(s=>s.state==='tele'||s.state==='roll')?'ลูกอาทิตย์กำลังกลิ้ง — ไปยืนวงยันฟ้า ✓ ให้ครบ':'ตีด้วง · เจมไฟเติมความร้อน เจมน้ำแข็งดับ (ยิงลูกอาทิตย์ ◎)';
  return {main:{v:S.hp,m:S.hpMax,lab:'☀ เคปรา'},subs:[{v:st.heat,m:100,lab:`ความร้อน ${Math.floor(st.heat)} / 100 · ตะวันเที่ยงอีก ${Math.max(0,Math.ceil(st.noonT))} วิ`,col:'linear-gradient(#ffd070,#e8501a)'}],phase:ph};}
WB.def('khepra',{hp:N=>220000*N,solid:[112,58,-38,-72],shadow:[230,86],shOff:24,r:150,race:'Insect',el:'Fire 2',
  setup,build(S){build(S);addFx(new SunFx());},think,tick,onHit,winEnd,allyJob,target,pickDefault,clipBody,drawOn,hud,
  enrage(S){},finish(S,res){WB.poseTo({sy:res==='win'?.92:1,lift:0});},
  dbg:S=>({heat:Math.round(st.heat),suns:st.suns.map(s=>s.state+':'+Math.round(s.d)),noon:Math.round(st.noonT)})});
})();
