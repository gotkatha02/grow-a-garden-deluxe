/* Mutation gems show on the real skill — step 2 (owner 2026-11-21 'ได้ ทำเอฟเฟคให้เห็นชัดๆสวยๆว่าเอฟเฟคได้รับการเปลี่ยนแล้ว').
   gem_fx.js paints a skill in its ELEMENT gem (fire / ice / volt). This file gives the other nine mutation gems their own look, each drawn at
   the moment its rule really works in totem_gems.js and sized by the real numbers:
     focus  รวมศูนย์   gold lock-on reticle on the FIRST enemy hit (R.first) + a piercing gold flare; the others only get a faint glance
     spread แผ่กว้าง   every hit sends an orange shock ring out to the real splash radius (80) + sparks flying to every enemy it reaches
     heavy  ทุ่มหนัก   the wind-up presses down (ring sinking into the feet, chevrons ⬇); each hit = a falling weight, cracked hot ground,
                        rocks, dust and a short screen shake
     rapid  รัวเร็ว    green speed chevrons ≫ + wind lines at the cast; quick thin green cross-cuts on each hit
     stack  สะสมแต้ม   crystal tokens orbit the hero = the charges really stored; a cast throws one, a refill makes one appear
     guard  ตั้งการ์ด   a glass shield bubble while the gem shield holds (GU.sh): cracks as it is drained, flashes when hit, shatters when broken
     rage   บ้าคลั่ง   a crimson spike burst at the cast; for the 3 s you take more damage: red sigil + flames round the hero, cracks when hit
     siphon ดูดพลัง    a blue mana crystal flies from every enemy that really gave SP back into the hero (+SP shown)
     totem  เสาร่ายแทน  the pillar is a carved totem pole that rises from the ground, its eyes flash and beams hit each enemy at every cast,
                        4 gold pips = casts left, a dashed gold circle = its real 150 reach, then it cracks and sinks
   Gameplay is untouched. Own pieces are never re-tinted by element gems (__gt '-'). ?gemfx=0 turns it off together with gem_fx.js. */
(function(){
'use strict';
if(/[?&]gemfx=0/.test(location.search)||!window.GEMFX||!GEMFX.k)return;
const {art,put,glow,star4,PJ,T,CX,ENS,FX,body,onScr,rnd,eOut,TAU,add:_add0}=GEMFX.k;
const PL=()=>{try{return player;}catch(e){return null;}};
const pz=()=>{const p=PL();return (p&&p.z)||0;};
const CH=36;   /* hero chest height (every hero is drawn ~72 tall) */
const KY=(()=>{try{const a=PJ(0,0,0),b=PJ(0,100,0);return (b[1]-a[1])/100||.62;}catch(e){return .62;}})();

/* ---- which skills carry which of the nine (follow-ups carry the hit side of their starter's gem) ---- */
const MUTS={focus:1,spread:1,heavy:1,rapid:1,stack:1,guard:1,rage:1,siphon:1,totem:1};
let ver=-1,MM={},ANY=false;
function mm(){const v=window.GEM_V||0;if(v!==ver){ver=v;MM={};ANY=false;
    try{const A=window.totemGems&&totemGems.act();for(const t in A){const m=(A[t].mut||[]).filter(x=>MUTS[x]);if(m.length){MM[t]={m:new Set(m),fol:!!A[t].fol};ANY=true;}}}catch(e){}}
  return MM;}
const mutsOf=k=>k?(mm()[k]||null):null;
const ST=()=>{try{return window.totemGems&&totemGems.fxs?totemGems.fxs():null;}catch(e){return null;}};

/* ---- pieces ---- */
const LIVE=new Set();
class Pc{constructor(layer,life){this.__gt='-';this._sk=null;this.layer=layer;this.t=0;this.life=life;}
  update(dt){this.t+=dt;if(this.tick)this.tick(dt);if(this.t<this.life)return true;LIVE.delete(this);return false;}}
function spawn(p){if(LIVE.size>80)return null;LIVE.add(p);return _add0(p);}
function rl(o,kind,gap){const t=T(),m=o._gm||(o._gm={});if(t-(m[kind]||-9)<gap)return false;m[kind]=t;return true;}
const RLG={};function rlG(kind,gap){const t=T();if(t-(RLG[kind]||-9)<gap)return false;RLG[kind]=t;return true;}

/* ---- drawing helpers (saturated bodies + dark rims so they read on snow, additive white cores — VFX_STYLE_REF_TH.md) ---- */
function ellS(c,x,y,r,w,col,a){if(a<=.01||r<=.5)return;c.globalAlpha=a;c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.ellipse(x,y,r,r*KY,0,0,TAU);c.stroke();}
function gRing(c,x,y,r,w,col,dark,a){if(a<=.01||r<=.5)return;c.save();ellS(c,x,y,r,w+3.2,dark,a*.42);ellS(c,x,y,r,w,col,a);
  c.globalCompositeOperation='lighter';ellS(c,x,y,r,Math.max(.8,w*.32),'#ffffff',a*.7);c.restore();}
function poly(c,pts){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);}
function line3(c,pts,w,col,dark,a){if(a<=.01)return;c.save();c.lineJoin='round';c.lineCap='round';poly(c,pts);
  c.globalAlpha=a*.5;c.strokeStyle=dark;c.lineWidth=w+2.6;c.stroke();c.globalAlpha=a;c.strokeStyle=col;c.lineWidth=w;c.stroke();
  c.globalCompositeOperation='lighter';c.globalAlpha=a*.8;c.strokeStyle='#ffffff';c.lineWidth=Math.max(.7,w*.33);c.stroke();c.restore();}
function gem(c,x,y,s,rot,col,dark,a){if(a<=.01)return;c.save();c.translate(x,y);c.rotate(rot);c.globalAlpha=a;
  c.fillStyle=dark;c.beginPath();c.moveTo(0,-s*1.75);c.lineTo(s*.8,0);c.lineTo(0,s*1.75);c.lineTo(-s*.8,0);c.closePath();c.fill();
  c.fillStyle=col;c.beginPath();c.moveTo(0,-s*1.42);c.lineTo(s*.58,0);c.lineTo(0,s*1.42);c.lineTo(-s*.58,0);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.78)';c.beginPath();c.moveTo(0,-s*1.42);c.lineTo(s*.58,0);c.lineTo(0,-s*.15);c.closePath();c.fill();c.restore();}
function puff(c,x,y,r,rgb,a){if(a<=.01||r<=.5)return;c.save();c.globalAlpha=a;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},.8)`);g.addColorStop(.6,`rgba(${rgb},.45)`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();}
function floorWash(c,x,y,r,rgbIn,rgbOut,a){if(a<=.01)return;c.save();c.translate(x,y);c.scale(1,KY);c.globalAlpha=a;const g=c.createRadialGradient(0,0,0,0,0,r);
  g.addColorStop(0,`rgba(${rgbIn},0)`);g.addColorStop(.7,`rgba(${rgbIn},.6)`);g.addColorStop(1,`rgba(${rgbOut},0)`);c.fillStyle=g;c.beginPath();c.arc(0,0,r,0,TAU);c.fill();c.restore();}
function tri(c,s){c.beginPath();c.moveTo(0,s*.9);c.lineTo(s*.8,-s*.6);c.lineTo(-s*.8,-s*.6);c.closePath();c.fill();}
const scr=a=>{const x=Math.cos(a),y=Math.sin(a)*KY,L=Math.hypot(x,y)||1;return [x/L,y/L];};
const phiTo=e=>{const p=PL();return p?Math.atan2(e.y-p.y,e.x-p.x):0;};

/* ---- SVG art (rasterised once). Objects (pole, token, bubble) get cartoon edges; energy stays edge-free ---- */
art('rflame',40,64,`<defs><linearGradient id="o" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7a0618"/><stop offset=".45" stop-color="#d82a48"/><stop offset="1" stop-color="#ff6a86" stop-opacity=".8"/></linearGradient>
  <linearGradient id="m" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff4a6a"/><stop offset="1" stop-color="#ffb0c2"/></linearGradient>
  <radialGradient id="c" cx=".5" cy=".78" r=".62"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#ffe0e8"/><stop offset="1" stop-color="#ffb0c2" stop-opacity="0"/></radialGradient></defs>
  <path d="M20 63C7 61 2 50 6 39C9 31 8 24 12 17C13 25 17 28 18 21C19 14 18 8 22 1C25 11 31 17 31 26C33 23 34 19 33 15C40 25 40 37 36 47C33 56 28 62 20 63Z" fill="url(#o)"/>
  <path d="M20 62C12 60 9 53 11 45C13 39 13 34 16 29C17 35 19 36 20 31C21 26 21 22 24 17C26 25 30 30 30 37C32 35 32 33 32 31C35 39 34 48 31 54C29 59 25 62 20 62Z" fill="url(#m)"/>
  <path d="M20 61C15 60 13 56 14 51C15 47 17 44 19 40C20 44 22 45 23 42C25 46 27 50 26 54C25 58 23 61 20 61Z" fill="url(#c)"/>`);
art('tok',20,24,`<defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.3"/></filter></defs>
  <path d="M10 1L19 6L19 18L10 23L1 18L1 6Z" fill="#8fd0ff" opacity=".6" filter="url(#b)"/>
  <path d="M10 2.2L17.8 6.6L17.8 17.4L10 21.8L2.2 17.4L2.2 6.6Z" fill="#1f5a9a"/>
  <path d="M10 3.4L3.3 7.2L10 11.2Z" fill="#f2fcff"/><path d="M10 3.4L16.7 7.2L10 11.2Z" fill="#bfe6ff"/>
  <path d="M3.3 7.2L3.3 16.8L10 20.6L10 11.2Z" fill="#8cccf6"/><path d="M16.7 7.2L16.7 16.8L10 20.6L10 11.2Z" fill="#4a9ad8"/>
  <path d="M10 11.2L10 20.6" stroke="#e8f8ff" stroke-width=".6" opacity=".65"/><path d="M5.6 8.6L7.2 7.7" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>`);

/* the gem shield bubble: floor centre (50,94) of a 100×122 box, rx 44, floor ry 27 (the ground's own squash), top 86 above the floor */
const DOME='M6 94A44 86 0 0 1 94 94A44 27 0 0 1 6 94Z';
const hexes=(()=>{let d='';const s=4.6,w=Math.sqrt(3)*s;for(let r=0;r<26;r++){const y=8+r*s*1.5;for(let i=-1;i<16;i++){const x=6+i*w+(r%2?w/2:0);
  const inTop=y<=94&&((x-50)/44)**2+((y-94)/86)**2<.97,inFl=y>94&&((x-50)/44)**2+((y-94)/27)**2<.92;if(!inTop&&!inFl)continue;
  d+=`M${(x).toFixed(1)} ${(y-s).toFixed(1)}L${(x+w/2).toFixed(1)} ${(y-s/2).toFixed(1)}L${(x+w/2).toFixed(1)} ${(y+s/2).toFixed(1)}L${x.toFixed(1)} ${(y+s).toFixed(1)}L${(x-w/2).toFixed(1)} ${(y+s/2).toFixed(1)}L${(x-w/2).toFixed(1)} ${(y-s/2).toFixed(1)}Z`;}}return d;})();
const DDEF=`<radialGradient id="mk" cx=".5" cy=".56" r=".58"><stop offset=".42" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient><mask id="m"><path d="${DOME}" fill="url(#mk)"/></mask>
  <filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.5"/></filter>`;
art('domeB',100,122,`<defs>${DDEF}<radialGradient id="f" cx=".5" cy=".6" r=".62"><stop offset="0" stop-color="#e4efff" stop-opacity=".08"/><stop offset=".62" stop-color="#b8cdf2" stop-opacity=".26"/><stop offset="1" stop-color="#7f9fe0" stop-opacity=".62"/></radialGradient></defs>
  <path d="${DOME}" fill="url(#f)"/><path d="${hexes}" fill="none" stroke="#3a5a9a" stroke-width="1.5" opacity=".35" mask="url(#m)"/><path d="${hexes}" fill="none" stroke="#f4f8ff" stroke-width=".8" opacity=".95" mask="url(#m)"/>
  <path d="M6 94A44 27 0 0 1 94 94" fill="none" stroke="#a9c6ff" stroke-width="5" opacity=".55" filter="url(#b)"/><path d="M6 94A44 27 0 0 1 94 94" fill="none" stroke="#f4f8ff" stroke-width="1.5"/>`);
art('domeF',100,122,`<defs>${DDEF}</defs>
  <path d="${hexes}" fill="none" stroke="#ffffff" stroke-width=".7" opacity=".42" mask="url(#m)"/>
  <path d="M6 94A44 86 0 0 1 94 94" fill="none" stroke="#24345a" stroke-width="4" opacity=".45"/>
  <path d="M6 94A44 86 0 0 1 94 94" fill="none" stroke="#a8c6ff" stroke-width="5" opacity=".75" filter="url(#b)"/><path d="M6 94A44 86 0 0 1 94 94" fill="none" stroke="#ffffff" stroke-width="1.9"/>
  <path d="M6 94A44 27 0 0 0 94 94" fill="none" stroke="#a9c6ff" stroke-width="6" opacity=".6" filter="url(#b)"/><path d="M6 94A44 27 0 0 0 94 94" fill="none" stroke="#ffffff" stroke-width="1.7"/>
  <path d="M15 62A37 76 0 0 1 37 17" fill="none" stroke="#ffffff" stroke-width="3" opacity=".55" filter="url(#b)" stroke-linecap="round"/>
  <path d="M73 24A30 60 0 0 1 84 44" fill="none" stroke="#ffffff" stroke-width="1.6" opacity=".45" stroke-linecap="round"/>`);
const CRK='M30 38L36 46L33 55L40 63M36 46L45 44L50 50M33 55L25 60L22 70M68 30L63 39L67 48L61 58M63 39L55 36M67 48L76 54L79 63M48 76L54 82L52 90M54 82L63 80M18 80L26 84L24 92M84 78L77 84L80 92M50 12L47 20L52 27';
art('domeX',100,122,`<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${CRK}" stroke="#1e3a6a" stroke-width="3.6" opacity=".5"/><path d="${CRK}" stroke="#bcd6ff" stroke-width="2.4" opacity=".8"/><path d="${CRK}" stroke="#ffffff" stroke-width="1.3"/></g>`);

/* the carved totem pole (80×150, foot on the mound at y 145): thunderbird on top, owl in the middle, bear below */
const PEYES=[[34.6,41.2],[45.4,41.2],[33,78],[47,78],[34,114],[46,114]];
art('tpole',80,150,`<defs><linearGradient id="w" x1="0" x2="1"><stop offset="0" stop-color="#c98a58"/><stop offset=".55" stop-color="#a8683e"/><stop offset="1" stop-color="#7a4528"/></linearGradient>
  <linearGradient id="r" x1="0" x2="1"><stop offset="0" stop-color="#e8624e"/><stop offset=".55" stop-color="#c9473a"/><stop offset="1" stop-color="#8f2a22"/></linearGradient>
  <linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#4fb3a2"/><stop offset=".55" stop-color="#2f8f80"/><stop offset="1" stop-color="#1f5f55"/></linearGradient>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#d0901e"/></linearGradient></defs>
  <ellipse cx="40" cy="145" rx="27" ry="5.6" fill="#4a2e1c"/><ellipse cx="40" cy="143.6" rx="23.5" ry="4.2" fill="#7a5236"/>
  <circle cx="17" cy="144" r="2.6" fill="#8a8072" stroke="#3a1f14" stroke-width="1"/><circle cx="63" cy="145" r="2.2" fill="#8a8072" stroke="#3a1f14" stroke-width="1"/>
  <g stroke="#3a1f14" stroke-width="1.6" stroke-linejoin="round">
   <path d="M28 43C20 35 10 29 2 29C5 34 4 38 6 41C3 43 3 47 6 50C4 53 6 57 10 58C14 60 22 58 28 56Z" fill="url(#r)"/>
   <path d="M52 43C60 35 70 29 78 29C75 34 76 38 74 41C77 43 77 47 74 50C76 53 74 57 70 58C66 60 58 58 52 56Z" fill="url(#r)"/>
   <path d="M40 28C37 20 36 12 38 4C42 10 43 19 40 28Z" fill="#f0c050"/><path d="M38 29C32 23 28 17 27 10C33 13 37 20 38 29Z" fill="#2f8f80"/><path d="M42 29C48 23 52 17 53 10C47 13 43 20 42 29Z" fill="#c9473a"/>
   <circle cx="26.5" cy="108" r="4.6" fill="#a8683e"/><circle cx="53.5" cy="108" r="4.6" fill="#a8683e"/></g>
  <g fill="none" stroke-linecap="round"><path d="M8 35C14 37 20 41 27 45" stroke="#f0c050" stroke-width="2.2"/><path d="M7 44C13 45 19 47 27 49" stroke="#2f8f80" stroke-width="2.2"/><path d="M10 53C15 53 21 53 27 53" stroke="#f0c050" stroke-width="2"/>
   <path d="M72 35C66 37 60 41 53 45" stroke="#f0c050" stroke-width="2.2"/><path d="M73 44C67 45 61 47 53 49" stroke="#2f8f80" stroke-width="2.2"/><path d="M70 53C65 53 59 53 53 53" stroke="#f0c050" stroke-width="2"/></g>
  <rect x="26" y="26" width="28" height="118" rx="4" fill="url(#w)"/>
  <path d="M26 63V30Q26 26 30 26H50Q54 26 54 30V63Z" fill="url(#r)"/>
  <ellipse cx="34" cy="41" rx="5" ry="4" fill="#f6e3c0" stroke="#3a1f14" stroke-width="1.2"/><ellipse cx="46" cy="41" rx="5" ry="4" fill="#f6e3c0" stroke="#3a1f14" stroke-width="1.2"/>
  <circle cx="34.6" cy="41.2" r="2.3" fill="#f0a020"/><circle cx="45.4" cy="41.2" r="2.3" fill="#f0a020"/><circle cx="34.6" cy="41.2" r="1" fill="#2a140a"/><circle cx="45.4" cy="41.2" r="1" fill="#2a140a"/>
  <path d="M28.5 35.5L38 37.5M51.5 35.5L42 37.5" stroke="#3a1f14" stroke-width="2" stroke-linecap="round"/>
  <path d="M36 46L44 46L42 56Q40 60 38 55Z" fill="url(#g)" stroke="#3a1f14" stroke-width="1.3" stroke-linejoin="round"/>
  <rect x="26" y="62" width="28" height="4" fill="#3a1f14"/><rect x="26" y="66" width="28" height="36" fill="url(#t)"/>
  <circle cx="33" cy="78" r="6.3" fill="#f6e3c0" stroke="#3a1f14" stroke-width="1.3"/><circle cx="47" cy="78" r="6.3" fill="#f6e3c0" stroke="#3a1f14" stroke-width="1.3"/>
  <circle cx="33" cy="78" r="3.4" fill="#f0a020"/><circle cx="47" cy="78" r="3.4" fill="#f0a020"/><circle cx="33" cy="78" r="1.5" fill="#2a140a"/><circle cx="47" cy="78" r="1.5" fill="#2a140a"/>
  <path d="M37.5 85L42.5 85L40 91Z" fill="url(#g)" stroke="#3a1f14" stroke-width="1.1" stroke-linejoin="round"/>
  <path d="M29 95L33 99L37 95L40 99L43 95L47 99L51 95" fill="none" stroke="#f0c050" stroke-width="1.6" stroke-linejoin="round"/>
  <rect x="26" y="102" width="28" height="4" fill="#3a1f14"/>
  <circle cx="34" cy="114" r="2.7" fill="#f0a020" stroke="#3a1f14" stroke-width="1"/><circle cx="46" cy="114" r="2.7" fill="#f0a020" stroke="#3a1f14" stroke-width="1"/>
  <ellipse cx="40" cy="124" rx="8.5" ry="6.5" fill="#e8c090" stroke="#3a1f14" stroke-width="1.2"/><ellipse cx="40" cy="121" rx="3.2" ry="2.2" fill="#2a140a"/>
  <path d="M36 127Q40 130 44 127" fill="none" stroke="#3a1f14" stroke-width="1.2" stroke-linecap="round"/><path d="M28 116L31 119M52 116L49 119" stroke="#c9473a" stroke-width="2" stroke-linecap="round"/>
  <rect x="26" y="134" width="28" height="3.4" fill="#c9473a"/>
  <rect x="46" y="27" width="7.6" height="116" fill="#000" opacity=".13"/><rect x="27.6" y="29" width="2.2" height="112" fill="#ffffff" opacity=".2"/>
  <rect x="26" y="26" width="28" height="118" rx="4" fill="none" stroke="#3a1f14" stroke-width="1.8"/>
  <path d="M26 64H54M26 104H54M26 134H54" stroke="#3a1f14" stroke-width="1"/>`);

/* =============================== one-shot pieces =============================== */
/* spread: the shock ring travels exactly to the splash radius, sparks fly to every enemy the splash reaches */
class SpreadWave extends Pc{constructor(e,r){super('ground',.56);this.x=e.x;this.y=e.y;this.r0=body(e).r*.7;this.r=r;this.sh=[];for(let i=0;i<8;i++)this.sh.push({a:i/8*TAU+rnd(-.25,.25),s:rnd(.75,1.15),d:rnd(.84,1)});}
  draw(){const c=CX();if(!c)return;const [x,y]=PJ(this.x,this.y,0);if(!onScr(x,y))return;const t=this.t,k=Math.min(1,t/.3),R=this.r0+(this.r-this.r0)*eOut(k),a=t<.3?1:Math.max(0,1-(t-.3)/.26);
    floorWash(c,x,y,R,'255,150,60','255,110,30',.34*a*(1-.4*k));gRing(c,x,y,R,2.6+6*(1-k),'#ff9a3a','#6a1f04',a);gRing(c,x,y,R*.72,1.4,'#ffc070','#6a1f04',a*.55*(1-k*.5));
    for(const s of this.sh){const d=R*s.d;gem(c,x+Math.cos(s.a)*d,y+Math.sin(s.a)*d*KY-2,2.3*s.s,s.a+Math.PI/2,'#ffc060','#7a2a08',a);}}}
class SpreadArc extends Pc{constructor(e,t2){super('top',.34);const b1=body(e),b2=body(t2);this.a={x:e.x,y:e.y,z:b1.zc};this.b={x:t2.x,y:t2.y,z:b2.zc,r:b2.r};}
  pos(u){const a=this.a,b=this.b;return PJ(a.x+(b.x-a.x)*u,a.y+(b.y-a.y)*u,a.z+(b.z-a.z)*u+Math.sin(Math.PI*u)*26);}
  draw(){const c=CX();if(!c)return;const t=this.t,h=eOut(Math.min(1,t/.17));
    if(t<.2){const u0=Math.max(0,h-.45),pts=[];for(let i=0;i<=8;i++)pts.push(this.pos(u0+(h-u0)*i/8));const n=pts.length;
      c.save();c.lineCap='round';for(let i=1;i<n;i++){c.globalAlpha=.5*i/n;c.strokeStyle='#6a1f04';c.lineWidth=3+3.6*i/n;c.beginPath();c.moveTo(pts[i-1][0],pts[i-1][1]);c.lineTo(pts[i][0],pts[i][1]);c.stroke();}
      c.globalCompositeOperation='lighter';for(let i=1;i<n;i++){c.globalAlpha=i/n;c.strokeStyle=i>n-3?'#fff0c0':'#ffa040';c.lineWidth=1+3*i/n;c.beginPath();c.moveTo(pts[i-1][0],pts[i-1][1]);c.lineTo(pts[i][0],pts[i][1]);c.stroke();}c.restore();
      const [hx,hy]=pts[n-1],[px,py]=pts[n-2];glow(hx,hy,11,'#ff9a3a',.85);gem(c,hx,hy,2.6,Math.atan2(hy-py,hx-px)+Math.PI/2,'#ffe2a8','#7a2a08',1);}
    if(t>=.15){const k=Math.min(1,(t-.15)/.19),[bx,by]=this.pos(1);glow(bx,by,this.b.r*1.5,'#ff9a3a',.65*(1-k));star4(bx,by,this.b.r*1.15*(1-.4*k),'#ffd890',1-k);}}}

/* focus: one gold lock-on reticle per skill on the enemy that takes the big hit */
const LOCK=new Map();
class FocusLock extends Pc{constructor(e,key){super('top',9);this.e=e;this.key=key;this.last=0;this.pu=-1;this.lk=1;}
  hit(){this.last=this.t;this.pu=this.t;}
  tick(){if(this.e.dead||this.t-this.last>.8)this.life=Math.min(this.life,this.t+.001);}
  draw(){const c=CX(),e=this.e;if(!c)return;const b=body(e),[x,y]=PJ(e.x,e.y,b.zc);if(!onScr(x,y))return;const t=this.t,k=eOut(Math.min(1,t/.15)),
      fade=Math.max(0,Math.min(1,(this.last+.8-t)/.3)),pu=this.pu>=0?Math.max(0,1-(t-this.pu)/.2):0,R=(b.r*1.15+9)*(1.9-.9*k)*(1+.12*pu),a=Math.min(1,t/.05)*fade,rot=t*1.5;
    c.save();c.translate(x,y);c.lineCap='round';
    for(let i=0;i<4;i++){const a0=rot+i*TAU/4+.3,a1=rot+(i+1)*TAU/4-.3;c.globalAlpha=a*.5;c.strokeStyle='#4a2c00';c.lineWidth=5.4;c.beginPath();c.arc(0,0,R,a0,a1);c.stroke();
      c.globalAlpha=a;c.strokeStyle='#ffd23a';c.lineWidth=2.6+1.4*pu;c.beginPath();c.arc(0,0,R,a0,a1);c.stroke();}
    c.globalCompositeOperation='lighter';c.globalAlpha=a*.9;c.strokeStyle='#fff6c8';c.lineWidth=1;for(let i=0;i<4;i++){c.beginPath();c.arc(0,0,R,rot+i*TAU/4+.3,rot+(i+1)*TAU/4-.3);c.stroke();}
    c.globalAlpha=a*.5;c.strokeStyle='#ffe58a';c.lineWidth=1.1;c.beginPath();c.arc(0,0,R*.55,0,TAU);c.stroke();c.globalCompositeOperation='source-over';
    for(let i=0;i<4;i++){const an=i*TAU/4-Math.PI/2,d=R+8-4*pu;c.save();c.translate(Math.cos(an)*d,Math.sin(an)*d);c.rotate(an+Math.PI/2);c.globalAlpha=a;c.fillStyle='#4a2c00';tri(c,7);c.fillStyle='#ffd23a';tri(c,5);c.restore();}
    c.restore();
    if(t<.26&&this.lk){const p=PL();if(p){const [hx,hy]=PJ(p.x,p.y,CH+pz()),u=1-t/.26;c.save();c.globalCompositeOperation='lighter';c.setLineDash([6,5]);c.lineDashOffset=-t*90;c.globalAlpha=.9*u;c.strokeStyle='#ffe27a';c.lineWidth=1.7;c.beginPath();c.moveTo(hx,hy);c.lineTo(x,y);c.stroke();c.setLineDash([]);c.restore();}}}}
class FocusFlare extends Pc{constructor(e){super('top',.3);this.e=e;}
  draw(){const c=CX(),e=this.e;if(!c)return;const b=body(e),[x,y]=PJ(e.x,e.y,b.zc),k=this.t/this.life;glow(x,y,b.r*2.6,'#ffc83a',.7*(1-k));star4(x,y,b.r*(2.5-.8*k),'#fff4c0',1-k);
    c.save();c.globalCompositeOperation='lighter';c.globalAlpha=(1-k)*.85;const h=b.r*3.2*(.55+.45*eOut(Math.min(1,this.t/.08))),g=c.createLinearGradient(x,y-h,x,y+h);g.addColorStop(0,'rgba(255,220,110,0)');g.addColorStop(.5,'rgba(255,252,230,1)');g.addColorStop(1,'rgba(255,220,110,0)');
    c.fillStyle=g;c.beginPath();c.ellipse(x,y,2.4*(1-k)+.8,h,0,0,TAU);c.fill();c.restore();}}
class FocusGlance extends Pc{constructor(e){super('top',.28);this.e=e;}
  draw(){const c=CX(),e=this.e;if(!c)return;const b=body(e),[x,y]=PJ(e.x,e.y,b.zc),k=this.t/this.life;c.save();c.globalAlpha=.55*(1-k);c.strokeStyle='#ece4c4';c.lineWidth=1.3;c.beginPath();c.arc(x,y,b.r*(.65+.5*k),0,TAU);c.stroke();c.restore();}}

/* heavy: the wind-up sinks into the feet; every hit is a dropped weight that cracks the ground */
class HeavyCast extends Pc{constructor(p){super('ground',.46);this.x=p.x;this.y=p.y;}
  draw(){const c=CX();if(!c)return;const [x,y]=PJ(this.x,this.y,0),t=this.t,k=Math.min(1,t/.34),R=68-50*eOut(k),a=t<.34?Math.min(1,t/.06):Math.max(0,1-(t-.34)/.12);
    c.save();c.translate(x,y);c.scale(1,KY);c.globalAlpha=.38*a*k;const g=c.createRadialGradient(0,0,0,0,0,36);g.addColorStop(0,'rgba(48,10,2,.95)');g.addColorStop(1,'rgba(48,10,2,0)');c.fillStyle=g;c.beginPath();c.arc(0,0,36,0,TAU);c.fill();c.restore();
    gRing(c,x,y,R,3.4+2*k,'#c9573a','#2a0602',a);gRing(c,x,y,R*.6,1.5,'#f09a6a','#2a0602',a*.65);}}
class HeavyChev extends Pc{constructor(p){super('top',.44);this.p=p;}
  draw(){const c=CX(),p=this.p;if(!c)return;for(let i=0;i<2;i++){const u=Math.min(1,Math.max(0,(this.t-i*.08)/.32));if(u<=0)continue;const [x,y]=PJ(p.x,p.y,116+i*13-52*eOut(u)),a=u<.25?u*4:Math.max(0,(1-u)/.75),s=10-i*1.5;
    line3(c,[[x-s,y-s*.55],[x,y+s*.45],[x+s,y-s*.55]],3.2,'#e0703e','#3a0a02',a);}}}
class HeavyCrack extends Pc{constructor(e,sm){super('ground',1.3);this.x=e.x;this.y=e.y;const r=body(e).r*(sm?.65:1);this.br=[];const n=sm?5:7;
    for(let i=0;i<n;i++){let a=i/n*TAU+rnd(-.3,.3);const L=r*rnd(1.4,2.6),pts=[[0,0]];for(let j=1;j<=3;j++){a+=rnd(-.38,.38);const d=L*j/3;pts.push([Math.cos(a)*d,Math.sin(a)*d*KY]);}this.br.push(pts);}}
  draw(){const c=CX();if(!c)return;const [x,y]=PJ(this.x,this.y,0);if(!onScr(x,y))return;const t=this.t,a=Math.min(1,(this.life-t)/.5),hot=Math.max(0,1-t/.55),gr=eOut(Math.min(1,t/.07));
    c.save();c.translate(x,y);c.lineJoin='round';c.lineCap='round';
    c.save();c.scale(1,KY);c.globalAlpha=.3*a;const g=c.createRadialGradient(0,0,0,0,0,30);g.addColorStop(0,'rgba(34,14,4,1)');g.addColorStop(1,'rgba(34,14,4,0)');c.fillStyle=g;c.beginPath();c.arc(0,0,30,0,TAU);c.fill();c.restore();
    const P=this.br.map(b=>b.map(([px,py])=>[px*gr,py*gr]));
    for(const p of P){poly(c,p);c.globalAlpha=.78*a;c.strokeStyle='#24100a';c.lineWidth=3.4;c.stroke();}
    if(hot>0){c.globalCompositeOperation='lighter';for(const p of P){poly(c,p);c.globalAlpha=hot;c.strokeStyle='#ff6a2a';c.lineWidth=1.6;c.stroke();}}
    c.restore();}}
class HeavySlam extends Pc{constructor(e,sm){super('top',.52);const b=body(e);this.x=e.x;this.y=e.y;this.zc=b.zc;this.r=b.r;this.s=sm?.6:1;this.rk=[];
    for(let i=0;i<(sm?3:6);i++){const a=rnd(0,TAU),v=rnd(50,125);this.rk.push({x:0,y:0,z:2,vx:Math.cos(a)*v,vy:Math.sin(a)*v,vz:rnd(100,210),r:rnd(0,TAU),vr:rnd(-10,10),s:rnd(.8,1.4)});}}
  tick(dt){if(this.t<.07)return;for(const d of this.rk){d.x+=d.vx*dt;d.y+=d.vy*dt;d.vz-=540*dt;d.z+=d.vz*dt;if(d.z<0){d.z=0;d.vz*=-.3;d.vx*=.5;d.vy*=.5;}d.r+=d.vr*dt;}}
  draw(){const c=CX();if(!c)return;const t=this.t,s=this.s,T0=.07;
    if(t<T0){const u=t/T0,[x,y]=PJ(this.x,this.y,this.zc+120*(1-u)),w=9*s,h=48*s;c.save();c.translate(x,y);
      c.globalAlpha=.55;c.fillStyle='#3a0a02';c.beginPath();c.moveTo(-w-2,-h-2);c.lineTo(w+2,-h-2);c.lineTo(0,5);c.closePath();c.fill();
      c.globalAlpha=1;const g=c.createLinearGradient(0,-h,0,0);g.addColorStop(0,'rgba(201,87,58,0)');g.addColorStop(.55,'#c9573a');g.addColorStop(1,'#ffd8b0');c.fillStyle=g;c.beginPath();c.moveTo(-w,-h);c.lineTo(w,-h);c.lineTo(0,2);c.closePath();c.fill();c.restore();return;}
    const u=(t-T0)/(this.life-T0),[x,y]=PJ(this.x,this.y,this.zc),[gx,gy]=PJ(this.x,this.y,0);
    glow(x,y,this.r*2.7*s,'#ff7a3a',.75*(1-u));glow(x,y,this.r*1.1*s,'#fff0d0',Math.max(0,.9-u*3));
    gRing(c,gx,gy,(this.r*.7+this.r*1.6*eOut(Math.min(1,u*1.8)))*s,6*(1-u)+1.4,'#9a3a24','#1e0602',1-u);   /* dark and short: the spread gem owns the wide orange ring */
    for(let i=0;i<5;i++){const a=i/5*TAU+.4,d=this.r*(.6+1.6*eOut(u))*s,[dx,dy]=PJ(this.x+Math.cos(a)*d,this.y+Math.sin(a)*d,6+12*u);puff(c,dx,dy,(8+11*u)*s,'150,122,96',.6*(1-u));}
    for(const d of this.rk){const [rx,ry]=PJ(this.x+d.x,this.y+d.y,d.z),q=d.s;c.save();c.translate(rx,ry);c.rotate(d.r);c.globalAlpha=Math.min(1,(1-u)*2.2);
      c.fillStyle='#4e3624';c.beginPath();c.moveTo(-3*q,-2*q);c.lineTo(2.6*q,-2.6*q);c.lineTo(3*q,1.8*q);c.lineTo(-1.6*q,2.6*q);c.closePath();c.fill();
      c.fillStyle='#a6845e';c.beginPath();c.moveTo(-3*q,-2*q);c.lineTo(2.6*q,-2.6*q);c.lineTo(.4*q,-.4*q);c.closePath();c.fill();c.restore();}}}

/* rapid: speed chevrons and wind lines at the cast, thin quick cuts on the hits */
class RapidCast extends Pc{constructor(p,phi){super('top',.44);this.x=p.x;this.y=p.y;this.z=pz();this.a=phi;}
  draw(){const c=CX();if(!c)return;const t=this.t,ux=Math.cos(this.a),uy=Math.sin(this.a),[fx,fy]=scr(this.a),nx=-fy,ny=fx;
    for(let i=0;i<3;i++){const u=Math.min(1,Math.max(0,(t-i*.055)/.3));if(u<=0||u>=1)continue;const d=18+125*eOut(u),[x,y]=PJ(this.x+ux*d,this.y+uy*d,CH-6+this.z),a=u<.2?u*5:(1-u)/.8,s=8.5;
      for(const o of [0,-8]){const cx=x+fx*o,cy=y+fy*o;line3(c,[[cx-fx*s+nx*s,cy-fy*s+ny*s],[cx,cy],[cx-fx*s-nx*s,cy-fy*s-ny*s]],2.8,'#7fe08a','#0f4a24',a);}}
    for(let i=0;i<6;i++){const u=Math.min(1,Math.max(0,(t-i*.03)/.3));if(u<=0||u>=1)continue;const side=(i%2?1:-1)*(10+i*3),z=12+i*9+this.z,bx=this.x-uy*side,by=this.y+ux*side,d0=24-95*u,d1=d0-28;
      const [x0,y0]=PJ(bx+ux*d0,by+uy*d0,z),[x1,y1]=PJ(bx+ux*d1,by+uy*d1,z);c.save();c.lineCap='round';c.globalAlpha=(1-u)*.8;c.strokeStyle='#14582c';c.lineWidth=3.2;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();
      c.globalCompositeOperation='lighter';c.globalAlpha=1-u;c.strokeStyle='#d8ffe0';c.lineWidth=1.3;c.stroke();c.restore();}}}
class RapidTick extends Pc{constructor(e,phi){super('top',.24);this.e=e;this.a=phi;this.lf=[0,1,2].map(()=>({a:rnd(0,TAU),v:rnd(60,115),r:rnd(0,TAU)}));}
  draw(){const c=CX(),e=this.e;if(!c)return;const b=body(e),[x,y]=PJ(e.x,e.y,b.zc),t=this.t,g=eOut(Math.min(1,t/.06)),a=t<.08?1:Math.max(0,1-(t-.08)/.16),L=b.r*1.45*g;
    for(const s of [-.75,.75]){const an=this.a+s,dx=Math.cos(an)*L,dy=Math.sin(an)*L*.8;line3(c,[[x-dx,y-dy],[x+dx,y+dy]],2,'#7fe08a','#0f4a24',a);}
    for(const l of this.lf){const d=l.v*t;c.save();c.translate(x+Math.cos(l.a)*d,y+Math.sin(l.a)*d*.7);c.rotate(l.r+t*9);c.globalAlpha=a;c.fillStyle='#14582c';c.beginPath();c.ellipse(0,0,4.4,2.1,0,0,TAU);c.fill();
      c.fillStyle='#a6f2ae';c.beginPath();c.ellipse(0,0,3.3,1.3,0,0,TAU);c.fill();c.restore();}}}

/* rage: crimson spikes (cast burst, hits, and cracks when the raging hero is hurt) */
class Spikes extends Pc{constructor(x,y,z,R,n,life,crack){super('top',life);this.x=x;this.y=y;this.z=z;this.R=R;this.cr=crack;this.sp=[];for(let i=0;i<n;i++)this.sp.push({a:i/n*TAU+rnd(-.16,.16),l:rnd(.72,1.2)});
    if(crack)this.zz=this.sp.map(s=>{const p=[[0,0]];let a=s.a;for(let j=1;j<=3;j++){a+=rnd(-.4,.4);p.push([Math.cos(a)*R*s.l*j/3,Math.sin(a)*R*s.l*j/3*.8]);}return p;});}
  draw(){const c=CX();if(!c)return;const t=this.t,[x,y]=PJ(this.x,this.y,this.z),g=eOut(Math.min(1,t/.11)),a=t<this.life*.4?1:Math.max(0,1-(t-this.life*.4)/(this.life*.6)),R=this.R;
    glow(x,y,R*1.05,'#e2435a',.6*a);glow(x,y,R*.4,'#ffe2e8',Math.max(0,.9-t*4.5));
    if(this.cr){for(const p of this.zz)line3(c,p.map(([px,py])=>[x+px*g,y+py*g]),1.8,'#ff4a6a','#3a0410',a);return;}
    for(const s of this.sp){const L=(R*.3+R*.7*g)*s.l,ca=Math.cos(s.a),sa=Math.sin(s.a)*.8,nx=-sa,ny=ca,w=R*.12*(1-.5*g)+1.2,b0=R*.14;
      const tip=[x+ca*L,y+sa*L],p0=[x+ca*b0+nx*w,y+sa*b0+ny*w],p1=[x+ca*b0-nx*w,y+sa*b0-ny*w];c.save();
      c.globalAlpha=a*.6;c.fillStyle='#3a0410';c.beginPath();c.moveTo(tip[0]+ca*2.2,tip[1]+sa*2.2);c.lineTo(p0[0]+nx*1.8,p0[1]+ny*1.8);c.lineTo(p1[0]-nx*1.8,p1[1]-ny*1.8);c.closePath();c.fill();
      c.globalAlpha=a;c.fillStyle='#e2435a';c.beginPath();c.moveTo(tip[0],tip[1]);c.lineTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.closePath();c.fill();
      c.globalCompositeOperation='lighter';c.fillStyle='#ffd0da';c.beginPath();c.moveTo(x+ca*L*.82,y+sa*L*.82);c.lineTo(x+ca*b0+nx*w*.35,y+sa*b0+ny*w*.35);c.lineTo(x+ca*b0-nx*w*.35,y+sa*b0-ny*w*.35);c.closePath();c.fill();c.restore();}}}
class GroundPulse extends Pc{constructor(x,y,r0,r1,life,col,dark,w){super('ground',life);this.x=x;this.y=y;this.r0=r0;this.r1=r1;this.col=col;this.dark=dark;this.w=w||4;}
  draw(){const c=CX();if(!c)return;const [x,y]=PJ(this.x,this.y,0),k=this.t/this.life;gRing(c,x,y,this.r0+(this.r1-this.r0)*eOut(k),this.w*(1-k)+1,this.col,this.dark,1-k*k);}}

/* siphon: one mana crystal per hit that really gave SP back, flying home along a curve */
const SIP={v:0,t:-9};
class SiphonOrb extends Pc{constructor(e,v){super('top',.64);const b=body(e);this.a={x:e.x,y:e.y,z:b.zc};this.v=v;this.side=rnd(-1,1)*44;this.tr=[];this.done=0;}
  pos(u){const p=PL(),a=this.a,bx=p.x,by=p.y,bz=CH+4+pz(),dx=bx-a.x,dy=by-a.y,L=Math.hypot(dx,dy)||1,cx=(a.x+bx)/2-dy/L*this.side,cy=(a.y+by)/2+dx/L*this.side,cz=(a.z+bz)/2+58,i=1-u;
    return [i*i*a.x+2*i*u*cx+u*u*bx,i*i*a.y+2*i*u*cy+u*u*by,i*i*a.z+2*i*u*cz+u*u*bz];}
  tick(){if(!PL())return;const u=Math.min(1,this.t/.5),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,[x,y,z]=this.pos(e);this.tr.unshift(PJ(x,y,z));if(this.tr.length>9)this.tr.pop();
    if(u>=1&&!this.done){this.done=1;SIP.v+=this.v;}}
  draw(){const c=CX();if(!c||!this.tr.length)return;const t=this.t,n=this.tr.length;
    if(t<.5){c.save();c.lineCap='round';for(let i=n-1;i>0;i--){const k=1-i/n;c.globalAlpha=.5*k;c.strokeStyle='#0a2f6a';c.lineWidth=2.6+4*k;c.beginPath();c.moveTo(this.tr[i][0],this.tr[i][1]);c.lineTo(this.tr[i-1][0],this.tr[i-1][1]);c.stroke();}
      c.globalCompositeOperation='lighter';for(let i=n-1;i>0;i--){const k=1-i/n;c.globalAlpha=k;c.strokeStyle='#72c4ff';c.lineWidth=1+3*k;c.beginPath();c.moveTo(this.tr[i][0],this.tr[i][1]);c.lineTo(this.tr[i-1][0],this.tr[i-1][1]);c.stroke();}c.restore();
      const [hx,hy]=this.tr[0];glow(hx,hy,16,'#4aa8ff',.9);gem(c,hx,hy,4.6,t*7,'#86ccff','#0a2a6a',1);}
    else{const p=PL();if(!p)return;const [x,y]=PJ(p.x,p.y,CH+4+pz()),k=Math.min(1,(t-.5)/.14);glow(x,y,24,'#4aa8ff',.75*(1-k));star4(x,y,15*(1-.3*k),'#dff2ff',1-k);}}}

/* stack: a token thrown at the cast, a token appearing at a refill */
class TokLaunch extends Pc{constructor(a,b){super('top',.36);this.a=a;this.b=b;}
  pos(u){const a=this.a,b=this.b;return PJ(a.x+(b.x-a.x)*u,a.y+(b.y-a.y)*u,a.z+(b.z-a.z)*u+Math.sin(Math.PI*u)*14);}
  draw(){const c=CX();if(!c)return;const t=this.t,h=eOut(Math.min(1,t/.2));
    if(t<.22){const pts=[];for(let i=0;i<=6;i++)pts.push(this.pos(Math.max(0,h-.4)+Math.min(h,.4)*i/6));c.save();c.lineCap='round';c.globalCompositeOperation='lighter';
      for(let i=1;i<pts.length;i++){c.globalAlpha=i/pts.length;c.strokeStyle='#9fd8ff';c.lineWidth=1+3.4*i/pts.length;c.beginPath();c.moveTo(pts[i-1][0],pts[i-1][1]);c.lineTo(pts[i][0],pts[i][1]);c.stroke();}c.restore();
      const [hx,hy]=pts[pts.length-1];glow(hx,hy,10,'#8fd0ff',.7);put('tok',hx,hy,12,{ay:.5,rot:t*14});}
    if(t>=.18){const k=Math.min(1,(t-.18)/.18),[bx,by]=this.pos(1);glow(bx,by,20,'#8fd0ff',.7*(1-k));c.save();c.globalAlpha=1-k;c.strokeStyle='#dff4ff';c.lineWidth=2*(1-k)+.6;c.beginPath();c.arc(bx,by,6+18*eOut(k),0,TAU);c.stroke();c.restore();star4(bx,by,13*(1-.4*k),'#ffffff',1-k);}}}
class TokPop extends Pc{constructor(w){super('top',.34);this.w=w;}
  draw(){const c=CX();if(!c)return;const [x,y]=PJ(this.w.x,this.w.y,this.w.z),k=this.t/this.life;glow(x,y,16,'#8fd0ff',.6*(1-k));c.save();c.globalAlpha=1-k;c.strokeStyle='#e8f8ff';c.lineWidth=1.6*(1-k)+.5;c.beginPath();c.arc(x,y,4+14*eOut(k),0,TAU);c.stroke();c.restore();star4(x,y,10*(1-k),'#ffffff',1-k);}}

/* guard: the bubble shatters into glass hexes when the shield breaks */
class DomeShatter extends Pc{constructor(p){super('top',.72);this.x=p.x;this.y=p.y;this.s=[];for(let i=0;i<18;i++){const a=rnd(0,TAU),v=rnd(60,150);this.s.push({x:Math.cos(a)*rnd(26,40),y:Math.sin(a)*rnd(16,28),z:rnd(10,80),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.8,vz:rnd(30,140),r:rnd(0,TAU),vr:rnd(-12,12),q:rnd(.8,1.3)});}}
  tick(dt){for(const d of this.s){d.x+=d.vx*dt;d.y+=d.vy*dt;d.vz-=420*dt;d.z+=d.vz*dt;if(d.z<0){d.z=0;d.vz*=-.25;d.vx*=.5;d.vy*=.5;}d.r+=d.vr*dt;}}
  draw(){const c=CX();if(!c)return;const k=this.t/this.life,[x,y]=PJ(this.x,this.y,CH);glow(x,y,60,'#cfe0ff',.6*Math.max(0,1-k*2.5));
    const [gx,gy]=PJ(this.x,this.y,0);gRing(c,gx,gy,20+60*eOut(Math.min(1,k*2)),3*(1-k)+.6,'#e8f0ff','#2e3e60',Math.max(0,1-k*1.6));
    for(const d of this.s){const [sx,sy]=PJ(this.x+d.x,this.y+d.y,d.z),q=3.6*d.q;c.save();c.translate(sx,sy);c.rotate(d.r);c.globalAlpha=Math.min(1,(1-k)*2);c.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU;c.lineTo(Math.cos(an)*q,Math.sin(an)*q*.7);}c.closePath();
      c.fillStyle='rgba(200,220,255,.55)';c.fill();c.strokeStyle='#2e3e60';c.lineWidth=1.6;c.stroke();c.strokeStyle='#ffffff';c.lineWidth=.8;c.stroke();c.restore();}}}

/* totem: beams from the pole's thunderbird eyes to every enemy the pillar hits */
class PoleBeam extends Pc{constructor(pe,e){super('top',.32);this.pe=pe;this.e=e;}
  draw(){const c=CX(),e=this.e;if(!c)return;const b=body(e),[x1,y1]=PJ(this.pe.x,this.pe.y,PH*.71),[x2,y2]=PJ(e.x,e.y,b.zc),k=this.t/this.life,a=1-k*k;
    c.save();c.lineCap='round';c.globalAlpha=.45*a;c.strokeStyle='#5a3a08';c.lineWidth=7;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
    c.globalCompositeOperation='lighter';c.globalAlpha=a;c.strokeStyle='#ffc84a';c.lineWidth=4.2*(1-k*.5);c.stroke();c.strokeStyle='#fffbe8';c.lineWidth=1.6;c.stroke();c.restore();
    glow(x2,y2,b.r*1.8,'#ffc84a',.7*a);star4(x2,y2,b.r*1.4*(1-.3*k),'#fff6d0',a);}}

/* =============================== lasting looks (one watcher + pieces that live while their state does) =============================== */
const DM={on:0,fading:0,t0:0,sh0:0,sh:0,hitT:-9,fadeT:0};          /* gem shield bubble */
const RG={on:0,k:0,w:[],nx:0,hp:-1,end:0};                          /* rage window */
const TKS={};                                                       /* stack tokens per skill: {ch, off, pop:[t per slot]} */
const POLES=new Map();                                              /* pillar object (totem_gems PIL entry) → {x,y,key,born,n,flT,sinkT,pc} */
const LAST={};                                                      /* last cast per skill: target + facing (where a thrown token goes) */
const PW=46,PH=PW*150/80;                                           /* pole size in world units */
const NEED={g:0,t:0,s:0};

function tokPos(k,i,mx,idx){const p=PL(),tk=TKS[k],an=T()*2.1+tk.off+i*TAU/Math.max(1,mx),R=28+idx*7;return {x:p.x+Math.cos(an)*R,y:p.y+Math.sin(an)*R,z:42+idx*6+3*Math.sin(T()*3.2+i*1.7)+pz(),back:Math.sin(an)<0};}
function drawTokens(back){const c=CX();if(!c)return;const t=T();let idx=0;
  for(const k in TKS){const tk=TKS[k],ia=.55+.45*Math.max(0,1-(t-(tk.act||0)-5)/1.5);   /* full and unused for a while: the tokens rest at half light */
    for(let i=0;i<tk.ch;i++){const w=tokPos(k,i,tk.mx,idx);if(w.back!==back)continue;const [x,y]=PJ(w.x,w.y,w.z),pa=tk.pop[i]!=null?Math.min(1,(t-tk.pop[i])/.25):1,s=pa<1?.3+.9*eOut(pa):1;
      glow(x,y,15,'#8fd0ff',.55*ia*(back?.7:1));put('tok',x,y,16*s,{ay:.5,a:ia*(back?.85:1)});}idx++;}}
function domeDraw(front){if(!DM.on&&!DM.fading)return;const c=CX(),p=PL();if(!c||!p)return;const t=T(),age=t-DM.t0;let a=1,sy=1;
  if(age<.32){const u=age/.32;sy=u<.6?.25+.9*eOut(u/.6):1.15-.15*((u-.6)/.4);a=Math.min(1,u*3.5);}
  if(DM.fading)a*=Math.max(0,1-(t-DM.fadeT)/.3);if(a<=.01)return;
  const [x,y]=PJ(p.x,p.y,0),W=92,o={ay:94/122,sy};
  if(!front){put('domeB',x,y,W,Object.assign({a:a*.95},o));const gd=ST();if(gd&&gd.GU.guardT>t)gRing(c,x,y,46,1.8,'#eef4ff','#2e3e60',.55*a);return;}
  glow(x,y-34,40,'#9cc0ff',.22*a);put('domeF',x,y,W,Object.assign({a},o));const dep=1-DM.sh/Math.max(1e-6,DM.sh0);if(dep>.04)put('domeX',x,y,W,Object.assign({a:a*Math.min(1,dep*1.5)},o));
  const fl=Math.max(0,1-(t-DM.hitT)/.26);if(fl>0){put('domeF',x,y,W,Object.assign({a:a*fl,add:1},o));glow(x,y-40,48,'#bcd4ff',.35*fl*a);}}
function rageGround(){if(!RG.on&&RG.k<=0)return;const c=CX(),p=PL();if(!c||!p)return;const t=T(),k=RG.k,[x,y]=PJ(p.x,p.y,0),pu=1+.07*Math.sin(t*13),n=12,R1=34*pu,R2=24*pu;
  c.save();c.translate(x,y);c.scale(1,KY);c.rotate(t*.7);c.beginPath();for(let i=0;i<n*2;i++){const r=i%2?R2:R1,an=i/(n*2)*TAU;c.lineTo(Math.cos(an)*r,Math.sin(an)*r);}c.closePath();
  c.globalAlpha=.34*k;const g=c.createRadialGradient(0,0,0,0,0,R1);g.addColorStop(0,'rgba(226,67,90,0)');g.addColorStop(.6,'rgba(226,67,90,.55)');g.addColorStop(1,'rgba(110,8,26,.85)');c.fillStyle=g;c.fill();
  c.globalAlpha=.8*k;c.strokeStyle='#5a0614';c.lineWidth=3.4;c.stroke();c.globalCompositeOperation='lighter';c.strokeStyle='#ff6a86';c.lineWidth=1.4;c.stroke();c.restore();
  for(let i=0;i<5;i++){const an=-Math.PI*(.04+.92*i/4),[fx,fy]=PJ(p.x+Math.cos(an)*22,p.y+Math.sin(an)*12,0),s=(i%4?46:36)*(1+.12*Math.sin(t*9+i*1.7))*k;put('rflame',fx,fy,s*.62,{ay:.92,a:.9*k,rot:Math.cos(an)*.25+Math.sin(t*6+i)*.1});}}   /* crimson flames framing the hero from behind */
function rageTop(){if(!RG.w.length)return;const c=CX();if(!c)return;for(const w of RG.w){const [x,y]=PJ(w.x,w.y,w.z),a=Math.min(1,(w.l-w.t)/.25)*Math.min(1,w.t/.08);put('rflame',x,y,w.s*.62,{ay:.85,a:a*.9});}}
function poleGround(){const c=CX();if(!c)return;const t=T();
  for(const [p,P] of POLES){const [x,y]=PJ(P.x,P.y,0);if(!onScr(x,y))continue;const life=P.sinkT?Math.max(0,1-Math.max(0,t-P.sinkT)/.45):Math.min(1,(t-P.born)/.35);
    c.save();c.setLineDash([10,8]);c.lineDashOffset=-t*20;ellS(c,x,y,150,1.6,'#ffd27a',.32*life);c.setLineDash([]);c.restore();   /* the pillar's real reach */
    const u=(t-P.flT)/.42;if(u>=0&&u<1){floorWash(c,x,y,150*eOut(u),'255,200,90','255,170,60',.22*(1-u));gRing(c,x,y,24+126*eOut(u),4*(1-u)+1,'#ffc84a','#5a3a08',1-u*u);}}}
class PolePiece{constructor(P){this.P=P;this.__gt='-';this._sk=null;this.layer='sorted';this.sy=P.y;this.dust=[];}
  update(dt){const P=this.P,t=T();if(P.sinkT&&t-P.sinkT>.5){POLES.delete(P.p);return false;}return true;}
  draw(){const c=CX(),P=this.P;if(!c)return;const t=T(),[x,y]=PJ(P.x,P.y,0);if(!onScr(x,y))return;
    const k=P.sinkT?1-Math.max(0,Math.min(1,(t-P.sinkT)/.45)):eOut(Math.min(1,(t-P.born)/.35)),dy=(1-k)*PH;
    c.save();c.globalAlpha=.32;c.fillStyle='#000';c.beginPath();c.ellipse(x,y,22,22*KY*.45,0,0,TAU);c.fill();c.restore();
    c.save();c.beginPath();c.rect(x-PW,y-PH*1.3,PW*2,PH*1.3+4);c.clip();put('tpole',x,y+dy,PW,{ay:145/150});
    const fu=(t-P.flT)/.45;if(fu>=0&&fu<1&&k>.9){const s=PW/80;for(const [ex,ey] of PEYES){const gx=x+(ex-40)*s,gy=y+(ey-145)*s;glow(gx,gy,6,'#ffe27a',1-fu);star4(gx,gy,5*(1-fu),'#ffffff',1-fu);}
      glow(x,y-PH*.72,26,'#ffc84a',.5*(1-fu));}
    c.restore();
    if(k>.95){const n=Math.max(0,P.n);for(let i=0;i<4;i++){const px=x+(i-1.5)*8,py=y-PH-6+Math.sin(t*3+i)*1.2,on=i<n;if(on)glow(px,py,6,'#ffd27a',.6);gem(c,px,py,2.2,0,on?'#ffd23a':'#5a4a3a',on?'#5a3a08':'#2a1e14',on?1:.7);}}
    if(k<1){const u=1-k;for(let i=0;i<5;i++){const a=i/5*TAU,[dx,dy2]=PJ(P.x+Math.cos(a)*18,P.y+Math.sin(a)*12,4+8*u);puff(c,dx,dy2,10+6*u,'140,112,86',.45*u);}}}}

function watch(dt){const S=ST(),p=PL();if(!S||!p)return;const t=T(),GU=S.GU;
  /* gem shield */
  const on=GU.sh>0&&GU.shT>t;
  if(on){if(!DM.on){DM.on=1;DM.fading=0;DM.t0=t;DM.sh0=GU.sh;DM.sh=GU.sh;}
    else{if(GU.sh>DM.sh+.01){DM.t0=t;DM.sh0=Math.max(DM.sh0,GU.sh);}else if(GU.sh<DM.sh-.01)DM.hitT=t;DM.sh=GU.sh;}}
  else if(DM.on){DM.on=0;if(GU.sh<=0&&GU.shT>t){spawn(new DomeShatter(p));DM.fading=0;}else{DM.fading=1;DM.fadeT=t;}}
  if(DM.fading&&t-DM.fadeT>.3)DM.fading=0;
  /* rage window */
  const rOn=GU.rageT>t;RG.on=rOn?1:0;RG.k=Math.max(0,Math.min(1,RG.k+(rOn?dt/.2:-dt/.3)));
  if(rOn){if(RG.hp>=0&&p.hp<RG.hp-.5&&rlG('rcrack',.25))spawn(new Spikes(p.x,p.y,CH+pz(),30,6,.34,1));
    if(t>=RG.nx){RG.nx=t+.07;RG.w.push({x:p.x+rnd(-15,15),y:p.y+rnd(2,9),z:rnd(2,26)+pz(),vz:rnd(30,60),t:0,l:rnd(.4,.7),s:rnd(11,17)});}}
  RG.hp=p.hp;for(let i=RG.w.length-1;i>=0;i--){const w=RG.w[i];w.t+=dt;w.z+=w.vz*dt;if(w.t>w.l)RG.w.splice(i,1);}
  /* stack tokens */
  let idx=0;for(const k in S.STK){const st=S.STK[k],mx=st.mx||2;let tk=TKS[k];if(!tk){tk=TKS[k]={ch:st.ch,mx,off:rnd(0,TAU),pop:[],act:t};}tk.mx=mx;
    if(st.ch<tk.ch){for(let i=st.ch;i<tk.ch;i++){const w=tokPos(k,i,mx,idx),L=LAST[k],tg=L&&t-L.t<.4&&L.tg&&!L.tg.dead?L.tg:null,a=L?L.phi:(p.phi||0),
        b=tg?{x:tg.x,y:tg.y,z:body(tg).zc}:{x:p.x+Math.cos(a)*120,y:p.y+Math.sin(a)*120,z:30+pz()};spawn(new TokLaunch(w,b));}}
    else if(st.ch>tk.ch){for(let i=tk.ch;i<st.ch;i++){tk.pop[i]=t;spawn(new TokPop(tokPos(k,i,mx,idx)));}}
    if(st.ch!==tk.ch||st.ch<mx)tk.act=t;tk.ch=st.ch;idx++;}
  for(const k in TKS)if(!S.STK[k])delete TKS[k];
  /* totem pillars */
  for(const q of S.PIL){let P=POLES.get(q);if(!P){P={p:q,x:q.x,y:q.y,key:q.key,born:t,n:q.n,flT:-9,sinkT:0};P.pc=new PolePiece(P);POLES.set(q,P);_add0(P.pc);spawn(new GroundPulse(q.x,q.y,10,60,.4,'#ffc84a','#5a3a08',5));}
    else if(q.n<P.n){P.n=q.n;P.flT=t;}
    if(P.pc&&!FX().includes(P.pc))_add0(P.pc);}
  for(const [q,P] of POLES)if(!S.PIL.includes(q)&&!P.sinkT){P.flT=t;P.sinkT=t+.4;P.n=0;}   /* the last cast removes the pillar in the same frame: flash, then sink */
  for(const [q,P] of POLES)if(P.sinkT&&t-P.sinkT>1)POLES.delete(q);
  /* the drawing pieces live only while something needs them (a 'top' piece makes the FX layer work every frame) */
  NEED.g=DM.on||DM.fading||RG.on||RG.k>0||Object.keys(TKS).length||POLES.size?1:0;NEED.s=DM.on||DM.fading||Object.keys(TKS).length?1:0;NEED.t=RG.w.length?1:0;
  ens(GND,NEED.g);ens(SRT,NEED.s);ens(TOPP,NEED.t);
  if(SIP.v>0&&t-SIP.t>.32){SIP.t=t;try{_add0(new DText({x:p.x,y:p.y,z:70+pz(),text:'+'+Math.round(SIP.v)+' SP',color:'#7cc8ff',size:12,life:.8}));}catch(e){}SIP.v=0;}}
function ens(P,need){if(!need)return;if(!P._in||!FX().includes(P)){P._in=1;_add0(P);}}
const GND={layer:'ground',__gt:'-',_sk:null,_in:0,update(){if(!NEED.g){this._in=0;return false;}return true;},draw(){poleGround();rageGround();domeDraw(false);drawTokens(true);}};
const SRT={layer:'sorted',__gt:'-',_sk:null,_in:0,sy:0,update(){const p=PL();this.sy=p?p.y+.5:0;if(!NEED.s){this._in=0;return false;}return true;},draw(){domeDraw(true);drawTokens(false);}};
const TOPP={layer:'top',__gt:'-',_sk:null,_in:0,update(){if(!NEED.t){this._in=0;return false;}return true;},draw(){rageTop();}};
const CORE={layer:'none',__gt:'-',_sk:null,_core:1,update(dt){try{watch(dt);}catch(e){}return true;},draw(){}};
function ensureCore(){const F=FX();if(!F.includes(CORE))_add0(CORE);}
setInterval(()=>{mm();if(ANY||POLES.size||DM.on)ensureCore();const F=FX();for(const p of LIVE)if(!F.includes(p))LIVE.delete(p);},250);

/* =============================== hooks =============================== */
function lockOn(e,k,pre){let L=LOCK.get(k);if(L&&L.e===e&&FX().includes(L)){L.hit();return;}if(L)L.life=Math.min(L.life,L.t+.15);L=new FocusLock(e,k);if(!pre)L.hit();LOCK.set(k,L);spawn(L);}
function onCast(key,M,c){const p=PL();if(!p)return;const b=M.m,phi=c&&typeof c.phi==='number'?c.phi:(p.phi||0);
  if(b.has('heavy')){spawn(new HeavyCast(p));spawn(new HeavyChev({x:p.x,y:p.y}));}
  if(b.has('rapid'))spawn(new RapidCast(p,phi));
  if(b.has('rage')){spawn(new Spikes(p.x,p.y,CH+pz(),62,11,.46));spawn(new GroundPulse(p.x,p.y,12,76,.42,'#e2435a','#3a0410',5));}
  if(b.has('focus')&&c&&c.target&&!c.target.dead)lockOn(c.target,key,1);}
function onHit(e,k,M,R0,sp0,auto){const S=ST(),R=S&&S.REC[k],b=M.m;
  if(b.has('focus')&&R){if(R.first===e){lockOn(e,k);if(rl(e,'gff',.1))spawn(new FocusFlare(e));}else if(rl(e,'gfg',.2))spawn(new FocusGlance(e));}
  if(b.has('spread')&&rl(e,'gsp',.2)){spawn(new SpreadWave(e,80));let nb=[];try{nb=enemiesInCircle(e.x,e.y,80).filter(o=>o!==e).slice(0,5);}catch(er){}for(const o of nb)spawn(new SpreadArc(e,o));}
  if(b.has('heavy')&&rl(e,'ghv',.25)){spawn(new HeavyCrack(e,auto));spawn(new HeavySlam(e,auto));if(!auto&&rlG('shake',.2))try{shake(1.2);}catch(er){}}
  if(b.has('rapid')&&rl(e,'grp',.12))spawn(new RapidTick(e,phiTo(e)));
  if(b.has('rage')&&rl(e,'grg',.15)){const bd=body(e);spawn(new Spikes(e.x,e.y,bd.zc,bd.r*1.9,7,.3));}
  if(b.has('siphon')&&R){const gain=R.sp-(R===R0?sp0:0);if(gain>0)spawn(new SiphonOrb(e,gain));}}
function onPoleHit(e,k){let best=null,bd=1e9;for(const P of POLES.values()){if(P.key!==k||P.sinkT)continue;const d=Math.hypot(P.x-e.x,P.y-e.y);if(d<bd){bd=d;best=P;}}if(best)spawn(new PoleBeam(best,e));}

const _cast=window.castSkillNow;
if(typeof _cast==='function')window.castSkillNow=castSkillNow=function(key,c){const r=_cast.apply(this,arguments);
  try{if(r){const M=mutsOf(key);if(M){const p=PL();LAST[key]={t:T(),tg:c&&c.target||null,phi:c&&typeof c.phi==='number'?c.phi:((p&&p.phi)||0)};ensureCore();if(!M.fol)onCast(key,M,c);}}}catch(e){}
  return r;};
const _hurt=window.hurt;
if(typeof _hurt==='function')window.hurt=hurt=function(e,m,o){const oo=o||{};let k=null,M=null,R0=null,sp0=0;
  try{mm();if(ANY&&e&&!oo.dot){const pa=PL();k=oo.auto?'@auto':(oo.skill||window.SKCTX||(pa&&pa.action&&pa.action.skill)||null);M=mutsOf(k);if(M){const S=ST();R0=S&&S.REC[k];sp0=R0?R0.sp:0;}}}catch(er){}
  const d=_hurt.apply(this,arguments);
  try{if(d>0&&e&&M){ensureCore();if(oo.label==='TOTEM')onPoleHit(e,k);else if(!oo._gem)onHit(e,k,M,R0,sp0,!!oo.auto);}}catch(er){}
  return d;};

GEMFX.mutOn=true;GEMFX.pole=true;   /* totem_gems.js: its plain rings and the old pillar are drawn here now */
GEMFX.mut={mutsOf,state:()=>({DM,RG,TKS,POLES,LIVE:LIVE.size,NEED})};
})();
