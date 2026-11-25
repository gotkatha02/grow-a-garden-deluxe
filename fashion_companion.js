/* fashion_companion.js — floating companions 'ภูตโทเท็ม' (owner 2026-11-23 14:01 sent the 6-sprite sheet made from
   FASHION_COMPANION_PROMPTS_TH.md). FASHION_SYSTEM_TH.md §9.
   One picture per sprite (assets/fashion/companion/<key>.webp, cut by tools/companion_cut.py), drawn facing right;
   the code does all the motion: it floats at head height beside the hero (the side away from where the hero faces)
   with a soft spring follow, bobs, leans into its motion, turns round like a paper card when it changes side,
   lies a faint shadow on the ground, and adds small code lights per sprite (the scarab's sun glows, the acorn's
   runes pulse, the totem's gem shines, the pegasus drops gold dust, the crane beats its wings and glides, the
   serpent sways) + a glint on the totem charm they all carry. Every hero, cosmetic only (no stats).
   Picked in the ✨ window (fashion_aura.js, tab 'ภูตโทเท็ม'); saved af_comp_<hero>; ?comp=<key> forces one,
   ?comp=0 turns the file off, window.__COMP_OFF=1 hides. window.COMP {CP, ORDER, cur, wear, drawAt, img}. */
(function(){
if(typeof CHAR==='undefined'||/[?&]comp=0(&|$)/.test(location.search))return;
const TA=Math.PI*2,KEY='af_comp_'+CHAR,DIR='assets/fashion/companion/';
/* h = height in world px at field scale (the hero is ~72) · P = points on the picture as fractions (measured on the cut) */
const CP={
 totem:{n:'Little Totem',th:'โทเท็มจิ๋ว',land:'ทุกดินแดน',h:30,fx:'gem',ph:0,P:{gem:[.513,.477],charm:[.723,.774]},
   d:'เสาโทเท็มไม้แกะจิ๋ว หน้าหมีกับนกอินทรี หินเทอร์ควอยซ์บนหน้าผากหมีส่องแสงเป็นจังหวะ ลอยตามเจ้าของได้ทุกดินแดน'},
 squirrel:{n:'Ratatoskr Sprite',th:'ภูตกระรอกรัตทาทอสก์',land:'ไวกิ้ง',h:31,fx:'rune',ph:1.1,P:{acorn:[.538,.836],charm:[.808,.546]},
   d:'กระรอกผู้วิ่งขึ้นลงต้นอิกดราซิล นั่งบนลูกโอ๊กสลักรูน รูนสีฟ้าเรืองแสงเป็นจังหวะ'},
 pegasus:{n:'Pegasus Foal',th:'ลูกม้าเพกาซัส',land:'กรีก',h:29,fx:'dust',ph:2.3,P:{wing:[.236,.409],charm:[.655,.619]},
   d:'ลูกม้าปีกทองจากโอลิมปัส ปีกโปรยฝุ่นทองระยิบระยับตลอดทาง'},
 scarab:{n:'Golden Scarab',th:'สคารับทอง',land:'อียิปต์',h:31,fx:'sun',ph:3.4,P:{sun:[.533,.135],charm:[.552,.743]},
   d:'ด้วงสคารับทองชูดวงอาทิตย์จิ๋ว ดวงอาทิตย์เรืองแสงอุ่น ๆ ส่องประกายเป็นระยะ'},
 crane:{n:'Paper Crane',th:'กระเรียนกระดาษ',land:'ญี่ปุ่น',h:27,fx:'paper',ph:4.2,P:{charm:[.558,.756]},
   d:'นกกระเรียนพับกระดาษที่มีชีวิต กระพือปีกสองที แล้วร่อนตามลมเงียบ ๆ'},
 serpent:{n:'Baby Feathered Serpent',th:'ลูกงูขนนก',land:'แอซเท็ก',h:31,fx:'sway',ph:5.0,P:{charm:[.745,.613]},
   d:'ลูกงูขนนกเกล็ดเทอร์ควอยซ์ ขดตัวเป็นรูป S แล้วโบกตัวไปมาอย่างร่าเริง'},
};
const ORDER=['totem','squirrel','pegasus','scarab','crane','serpent'];
const IMG={};function img(k){let im=IMG[k];if(!im){im=new Image();im.src=DIR+k+'.webp?v=1';IMG[k]=im;}return im.complete&&im.naturalWidth?im:null;}
for(const k of ORDER)img(k);

/* ---- small code sprites (painted once) ---- */
function cv(w,h,sc,fn){const c=document.createElement('canvas');c.width=Math.round(w*sc);c.height=Math.round(h*sc);const g=c.getContext('2d');g.scale(sc,sc);fn(g);c.uw=w;c.uh=h;return c;}
const rad=(g,x,y,r,st)=>{const q=g.createRadialGradient(x,y,0,x,y,r);for(const [o,c] of st)q.addColorStop(o,c);return q;};
function star4(g,r,th){g.beginPath();for(let i=0;i<8;i++){const a=i*TA/8-TA/4,q=i%2?r*th:r;g.lineTo(Math.cos(a)*q,Math.sin(a)*q);}g.closePath();}
const star=(rim,mid)=>cv(12,12,6,g=>{g.translate(6,6);g.fillStyle=rad(g,0,0,5.6,[[0,mid.replace('1)','.55)')],[1,mid.replace('1)','0)')]]);g.fillRect(-6,-6,12,12);
  g.fillStyle=rim;star4(g,5.8,.2);g.fill();g.fillStyle='#ffffff';star4(g,5,.15);g.fill();});
const SP={gold:star('rgba(196,120,20,.75)','rgba(255,214,110,1)'),cyan:star('rgba(30,140,170,.75)','rgba(140,240,255,1)'),white:star('rgba(120,150,190,.6)','rgba(230,245,255,1)')};
const GL={warm:cv(32,32,3,g=>{g.fillStyle=rad(g,16,16,16,[[0,'rgba(255,200,90,.85)'],[.45,'rgba(255,150,40,.32)'],[1,'rgba(255,120,30,0)']]);g.fillRect(0,0,32,32);}),
          cyan:cv(32,32,3,g=>{g.fillStyle=rad(g,16,16,16,[[0,'rgba(150,245,255,.9)'],[.45,'rgba(70,200,230,.32)'],[1,'rgba(40,170,220,0)']]);g.fillRect(0,0,32,32);})};
const SHD=cv(32,32,2,g=>{g.fillStyle=rad(g,16,16,16,[[0,'rgba(16,12,22,.9)'],[.6,'rgba(16,12,22,.35)'],[1,'rgba(16,12,22,0)']]);g.fillRect(0,0,32,32);});

/* ---- one companion at a screen point (x,y = centre of the picture) ---- */
function paint(g,k,x,y,s,t,o){const cp=CP[k],im=img(k);if(!cp||!im)return;o=o||{};const A=o.A==null?1:o.A;if(!(A>.01))return;
  const h=cp.h*s,w=h*im.naturalWidth/im.naturalHeight,fl=o.fl==null?1:o.fl,FL=(fl<0?-1:1)*Math.max(.12,Math.abs(fl));
  let rot=(o.rot||0)+Math.sin(t*1.3+cp.ph)*.035,sx=o.sx||1,sy=o.sy||1,skew=0;
  if(cp.fx==='paper'){const f=(t*.55+cp.ph)%1;if(f<.26){const q=Math.sin(f/.26*TA*2);sy*=1-.075*Math.max(0,q);sx*=1+.03*Math.max(0,q);}}   /* two quick wing beats, then a long glide */
  if(cp.fx==='sway')skew=Math.sin(t*2.1+cp.ph)*.1;
  const pt=(f)=>{const lx=(f[0]-.5)*w,ly=(f[1]-.5)*h;let ax=(lx+skew*ly)*FL*sx,ay=ly*sy;const c=Math.cos(rot),sn=Math.sin(rot);return [x+ax*c-ay*sn,y+ax*sn+ay*c];};
  const add=(im2,p,r,al)=>{if(!(al>.01))return;g.save();g.globalCompositeOperation='lighter';g.globalAlpha=A*al;g.drawImage(im2,p[0]-r,p[1]-r,r*2,r*2);g.restore();};
  const spark=(im2,p,sz,al,a0)=>{if(!(al>.01)||!(sz>.3))return;g.save();g.globalAlpha=A*al;g.translate(p[0],p[1]);g.rotate(a0||0);g.drawImage(im2,-sz/2,-sz/2,sz,sz);g.restore();};
  const blink=(T,off)=>{const f=((t+off)/T)%1;return f<.2?Math.sin(f/.2*Math.PI):0;};
  if(cp.fx==='sun')add(GL.warm,pt(cp.P.sun),h*.32*(1+.06*Math.sin(t*2.2)),.55+.2*Math.sin(t*2.2));   /* the sun glows behind its disc */
  g.save();g.globalAlpha=A;g.translate(x,y);g.rotate(rot);g.scale(FL*sx,sy);if(skew)g.transform(1,0,skew,1,0,0);g.drawImage(im,-w/2,-h/2,w,h);g.restore();
  if(cp.fx==='rune')add(GL.cyan,pt(cp.P.acorn),h*.24,.24+.18*Math.sin(t*2.6));
  if(cp.fx==='gem'){add(GL.cyan,pt(cp.P.gem),h*.13,.3+.22*Math.sin(t*2.4));const b=blink(2.7,.4);spark(SP.cyan,pt(cp.P.gem),h*.3*b,b,t*.6);}
  if(cp.fx==='sun'){const b=blink(2.3,1.1);const p=pt(cp.P.sun);spark(SP.gold,[p[0]+h*.07,p[1]-h*.06],h*.34*b,b,.3);}
  if(cp.fx==='rune')for(let j=0;j<2;j++){const c2=(t*.55+j*.5)%1,p=pt(cp.P.acorn),q=Math.sin(c2*Math.PI);spark(SP.cyan,[p[0]+(j?1:-1)*h*.12,p[1]-c2*h*.42],h*.2*q,q*.9,c2);}   /* rune motes rise from the acorn */
  if(cp.fx==='dust')for(let j=0;j<4;j++){const c2=(t*.7+j*.25)%1,p=pt(cp.P.wing),q=Math.sin(c2*Math.PI);spark(SP.gold,[p[0]-FL*c2*h*.32,p[1]+c2*h*.55],h*.17*q,q*.95,c2*2);}   /* gold dust from the wing */
  {const b=blink(3.4,cp.ph);spark(SP.white,pt(cp.P.charm),h*.26*b,b*.95,.2);}   /* the totem charm every sprite carries */
}
/* the whole sprite as a preview / icon: x,y = the spot on the ground under it, z = float height */
function drawAt(g,k,x,y,s,t,face,z){const cp=CP[k];if(!cp)return;z=z==null?52:z;const zz=(z+4*Math.sin(t*1.6+cp.ph))*s;
  g.save();g.globalAlpha=.2;g.drawImage(SHD,x-11*s,y-4*s,22*s,8*s);g.restore();paint(g,k,x,y-zz,s,t,{fl:face||1});}

/* ================================================================ in the world */
let cur=null;try{cur=localStorage.getItem(KEY)||null;if(cur&&!CP[cur])cur=null;}catch(_){}
const FORCE=(location.search.match(/[?&]comp=([a-z]+)/)||[])[1];if(FORCE&&CP[FORCE])cur=FORCE;
const live=()=>!!(cur&&CP[cur]&&!window.__COMP_OFF);
const SC=()=>{const b=SPR_BASE*MAP_CHAR;return (typeof SPR==='number'&&SPR>0?SPR:b)/b;};
function heroA(){if(!player||player.dead||player.hp<=0)return 0;let a=1;try{if(typeof JH==='function'&&JH('jgPlayerAlpha'))a=jgPlayerAlpha();}catch(_){}return Math.max(0,Math.min(1,a));}
const hf=()=>Math.cos(player.phi||0)>=0?1:-1;
const HK=()=>window.HERO_K||1;   /* hero size (HERO_SIZE, 2026-11-25): it floats beside the shoulder of a big or small hero; its own size stays */
class CompFx{constructor(k){this.k=k;this.layer='sorted';this.__gt='-';this.t=Math.random()*9;this.vx=this.vy=0;this.fl=hf();this.face=this.fl;this.rot=0;this.kx=this.ky=1;this.z=52*HK();this.hvx=this.hvy=0;this.px=player.x;this.py=player.y;this.place();}   /* kx / ky = squash; sy = the sorted layer's depth key */
  target(){const s=SC();return [player.x-hf()*38*s*HK(),player.y-5];}
  place(){const [tx,ty]=this.target();this.x=tx;this.y=ty;this.sy=ty;this.vx=this.vy=0;}
  update(dt){if(this.gone||!live()||this.k!==cur)return false;dt=Math.min(dt,.05);this.t+=dt;
    /* the hero's own speed (smoothed, capped) leads the target a little, so a walking hero does not leave it far behind */
    if(dt>0){let hx=(player.x-this.px)/dt,hy=(player.y-this.py)/dt;const hs=Math.hypot(hx,hy);if(hs>600){hx=hy=0;}else if(hs>260){hx*=260/hs;hy*=260/hs;}
      this.hvx+=(hx-this.hvx)*Math.min(1,dt*9);this.hvy+=(hy-this.hvy)*Math.min(1,dt*9);}this.px=player.x;this.py=player.y;
    let [tx,ty]=this.target();tx+=this.hvx*.2;ty+=this.hvy*.2;const dx=tx-this.x,dy=ty-this.y;if(Math.hypot(dx,dy)>420){this.place();}
    else{const k=38,c=12;this.vx+=(dx*k-this.vx*c)*dt;this.vy+=(dy*k-this.vy*c)*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;}
    const sp=Math.hypot(this.vx,this.vy);if(Math.abs(this.vx)>40)this.face=this.vx>0?1:-1;else if(sp<12)this.face=hf();
    this.fl+=Math.sign(this.face-this.fl)*Math.min(Math.abs(this.face-this.fl),dt*6.5);   /* turns round like a card */
    this.rot+=((Math.max(-.26,Math.min(.26,this.vx/340)))-this.rot)*Math.min(1,dt*6);   /* leans into its motion */
    const st=Math.min(.07,sp/2600);this.kx+=(1+st-this.kx)*Math.min(1,dt*8);this.ky+=(1-st-this.ky)*Math.min(1,dt*8);
    const zt=(player.sitting?38:52)*HK();this.z+=(zt-this.z)*Math.min(1,dt*2.5);
    this.sy=this.y;return true;}
  draw(){const a=heroA();if(a<=.01)return;const cp=CP[this.k],s=SC(),zz=(this.z+4*Math.sin(this.t*1.6+cp.ph))*s,[gx,gy]=P(this.x,this.y,0);
    ctx.save();ctx.globalAlpha=.2*a;ctx.drawImage(SHD,gx-11*s,gy-4*s,22*s,8*s);ctx.restore();
    paint(ctx,this.k,gx,gy-zz,s,this.t,{fl:this.fl,rot:this.rot,sx:this.kx,sy:this.ky,A:a});}}
let F=null;
class CompKeeper{constructor(){this.layer='none';this.__gt='-';}
  update(){if(!live()||!player)return true;if(!F||F.gone||F.k!==cur||!fx.includes(F)){if(F)F.gone=1;F=addFx(new CompFx(cur));}return true;}
  draw(){}}
addFx(new CompKeeper());
function wear(k){cur=k&&CP[k]?k:null;try{cur?localStorage.setItem(KEY,cur):localStorage.removeItem(KEY);}catch(_){}if(F&&F.k!==cur){F.gone=1;F=null;}}
window.COMP={CP,ORDER,get cur(){return cur;},wear,drawAt,paint,img,get fx(){return F;}};
})();
