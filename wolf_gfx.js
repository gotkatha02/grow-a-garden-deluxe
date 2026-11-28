/* =====================================================================
   WOLF — Godot-rendered skill effects (owner 2026-11-27 'ทำเอฟเฟคสกิลใหม่โดยใช้ godot … เริ่มที่หมาป่าก่อน ทำให้มันเข้ากับเกม'
   → pilot 'เริ่มนำร่องเลย' (basic, Blood Cleave, Frost Fang) → 'ทำต่อทั้งหมด' = every skill wolf_vfx5.js draws).
   The pictures are made offline in Godot (tools/godot_fx: shaders + drawn pieces rendered frame by frame, packed by pack.py into
   assets/fx/wolf_gd/<name>.webp + meta.js = window.WGX_META). This file only PLAYS them, on the game's own timing and places:
     · swings  — every crescent v5 draws (VSlash = the engine's real swing from the sprite's axe head, and VArc = the leap
                 spirals / spin slams / dance spins) gets the Godot strip slash_<element> bent onto its own geometry every frame
                 (same plane, start, end and reveal → it still ends on the contact frame). Streaks (dashes, thrusts) get the same
                 strip laid along the streak.
     · hits    — the hit mark of each skill (ST[key].hit in v5) is a Godot flipbook: steel blood ice armor claw rush vamp gold
                 shatter volt rune fury fen; v5's own hit pieces for that hit are not shown (its heal orbs still fly).
     · ground  — ice spikes (FXLIB Spike: Ice Break, Frozen Descent, Ravenous Leap, Fenrir's Spirit, shatter) → ice_spike;
                 Frost Fang's wave crystals → ice_fangs clusters; round cracks → crack_hot / crack_ice / crack_volt; waves →
                 blood_wave / gold_wave / steel_wave (drawn top-down, laid on the ground along the facing); bolts from the sky →
                 volt_strike; Fenrir's summoning column → ice_pillar.
   Not replaced (still v5 / the owner's own work): rune marks and rings, rune glyphs flying out, dust, bits, live dash bolts,
   Iron Counter's wall, the owner's painted pictures and video clips (War Howl, Executioner, Valhalla, Rune Guard, War Banner,
   Axe Cyclone, Wolf Finale, Ice Prison, Shatter Pulse, Blizzard, Tempest Field, Ragnarok's Judgment).
   Damage, timing and status are untouched.   ?wgx=0 = v5.   Loaded after wolf_vfx5.js; outermost wrappers of addFx / hurt.
   ===================================================================== */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='wolf'||!window.WV5||!window.WGX_META||/[?&]wgx=0/.test(location.search))return;
const M=window.WGX_META,KT=window.FXLIB&&window.FXLIB.k,ST=window.WV5.ST;if(!KT||!ST)return;
const cl=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,eO=t=>1-Math.pow(1-t,3),eI=t=>t*t*t,R=(a,b)=>a+Math.random()*(b-a);
const WARNED={},warn=(w,e)=>{if(!WARNED[w]){WARNED[w]=1;try{console.warn('wolf_gfx: '+w,e);}catch(_){}}};
const IMG={};for(const n in M){const im=new Image();im.src='assets/fx/wolf_gd/'+n+'.webp?v=2';IMG[n]=im;}
const ok=n=>{const im=IMG[n];return !!(im&&im.complete&&im.naturalWidth>0);};
const frameRect=(n,i)=>{const m=M[n];i=cl(i|0,0,m.n-1);return [(i%m.cols)*m.w,Math.floor(i/m.cols)*m.h,m.w,m.h];};
const ctxKey=()=>window.SKCTX||window.__W5||(window.__ACTEV&&player.action&&player.action.key)||null;
const scrAng=KT.h&&KT.h.scrAng?KT.h.scrAng:(ph=>Math.atan2(Math.sin(ph)*K,Math.cos(ph)));
/* element → swing strip · hit kind → picture (k = size, turn = rotate to the hit direction) · element → crack / wave */
const STRIP={wS:'slash_steel',wI:'slash_steel',steel:'slash_steel',wA:'slash_blood',wV:'slash_vamp',wR:'slash_ice',ice:'slash_ice',wG:'slash_gold',wT:'slash_volt',wF:'slash_fury'};
const HITS={steel:{n:'hit_steel',turn:1},blood:{n:'hit_blood',turn:1},ice:{n:'hit_ice'},armor:{n:'hit_armor',turn:1,crack:['crack_hot',36]},claw:{n:'hit_claw',turn:1,perp:1},
  rush:{n:'hit_blood',turn:1,k:1.4,along:1},vamp:{n:'hit_vamp',turn:1},gold:{n:'hit_gold',turn:1,crack:['crack_hot',44]},shatter:{n:'hit_ice',k:1.5,spikes:5},
  volt:{n:'hit_volt'},rune:{n:'hit_rune'},fury:{n:'hit_fury',turn:1},fen:{n:'hit_claw_ice',turn:1,perp:1}};
const CRACK=el=>el==='ice'||el==='wR'?'crack_ice':el==='wT'||el==='volt'?'crack_volt':'crack_hot';
const WAVE={wA:'blood_wave',wG:'gold_wave',wS:'steel_wave'};

/* ---------- swings and streaks: the Godot strip on the real geometry ---------- */
const STRIP_OUT=.25,STRIP_IN=1.25;      // strip height = 1.5 W: from R + .25 W (light outside the blade path) to R − 1.25 W
function stripPaint(){const n=this._gx;if(!ok(n))return this._p0.call(this);
  const m=M[n],im=IMG[n],t=this.t,sw=this.swing,L=this.life;if(t<0)return;
  const h=(this.ease||eO)(cl(t/sw,0,1)),tl=eI(cl((t-sw*.5)/(L-sw*.5),0,1)),th0=lerp(this.a0,this.a1,tl*.94),th1=lerp(this.a0,this.a1,h);if(Math.abs(th1-th0)<.04)return;
  const W=this.w*this.size*1.15,Rr=this.R*this.size,ro=Rr+W*STRIP_OUT,ri=Rr-W*STRIP_IN,N=Math.max(10,Math.ceil(Math.abs(th1-th0)*11));
  const [sx,sy,fw,fh]=frameRect(n,Math.floor(cl(t/L,0,.999)*m.n)),sp=(th,r)=>{const q=this.w3(th,r);return P(q[0],q[1],q[2]);};
  ctx.save();ctx.globalAlpha*=cl((L-t)/(L*.12),0,1);
  for(let i=0;i<N;i++){const s0=i/N,s1=(i+1)/N,ta=lerp(th0,th1,s0),tb=lerp(th0,th1,s1),O0=sp(ta,ro),O1=sp(tb,ro),I0=sp(ta,ri),uw=(s1-s0)*fw,cw=Math.min(uw+1,fw-s0*fw);
    ctx.save();ctx.transform((O1[0]-O0[0])/uw,(O1[1]-O0[1])/uw,(I0[0]-O0[0])/fh,(I0[1]-O0[1])/fh,O0[0],O0[1]);ctx.drawImage(im,sx+s0*fw,sy,cw,fh,0,0,cw,fh);ctx.restore();}
  ctx.restore();}
function streakPaint(){const n=this._gx;if(!ok(n))return this._p0.call(this);
  const m=M[n],k=this.t/this.life,hk=eO(cl(k/this.go,0,1)),tk=eI(cl((k-this.go*.5)/(1-this.go*.5),0,1));if(hk-tk<.01)return;
  const a=P(lerp(this.x,this.x2,tk),lerp(this.y,this.y2,tk),lerp(this.z,this.z2,tk)),b=P(lerp(this.x,this.x2,hk),lerp(this.y,this.y2,hk),lerp(this.z,this.z2,hk)),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,w=this.w*this.size*1.7;
  const [sx,sy,fw,fh]=frameRect(n,Math.floor(cl(k,0,.999)*m.n*.85));
  ctx.save();ctx.globalAlpha*=cl((1-k)/.25,0,1);ctx.translate(a[0],a[1]);ctx.rotate(Math.atan2(dy,dx));ctx.drawImage(IMG[n],sx,sy,fw,fh,0,-w*.75,L,w*1.5);ctx.restore();}

/* ---------- flipbook pieces ---------- */
class GPiece{constructor(o){Object.assign(this,{t:0,delay:0,layer:'top',k:1},o);this.t=-this.delay;this._v5=1;this._gx=1;}
  update(dt){this.t+=dt;return this.t<this.life;}
  fi(){const m=M[this.n];return this.life?cl(this.t/this.life,0,.999)*m.n:this.t*(m.fps||24);}}
/* a billboard centred on a world point (hits) */
class GHit extends GPiece{constructor(o){super(o);const m=M[this.n];this.life=m.n/(m.fps||24);}
  draw(){if(this.t<0||!ok(this.n))return;const m=M[this.n],[sx,sy,fw,fh]=frameRect(this.n,this.t*(m.fps||24)),[X,Y]=P(this.x,this.y,this.z),k=this.k*.5;
    ctx.save();ctx.translate(X,Y);if(this.rot)ctx.rotate(this.rot);if(this.flip)ctx.scale(1,-1);ctx.drawImage(IMG[this.n],sx,sy,fw,fh,-m.ax*k,-m.ay*k,fw*k,fh*k);ctx.restore();}}
/* something standing on the ground (fangs, spikes, the strike, the pillar), depth-sorted with the characters;
   n with seg {rise, hold, break}: rise · hold (loops) · break at the end of its life (or when shattered) */
class GStand extends GPiece{constructor(o){super(Object.assign({layer:'sorted'},o));const m=M[this.n],f=m.fps||24,S=m.seg;
    if(S){this.dR=(S.rise[1]-S.rise[0])/f;this.dB=(S.break[1]-S.break[0])/f;const need=this.dR+this.dB;if(this.life<need){const q=this.life/need;this.dR*=q;this.dB*=q;}this.brk=this.life-this.dB;}
    else if(!this.life)this.life=m.n/f;}
  get sy(){return this.y+(this.sortOff||0);}
  shatter(){if(this.brk!=null&&this.t<this.brk){this.brk=Math.max(this.t,this.dR*.6);this.life=this.brk+this.dB;}}
  draw(){if(this.t<0||!ok(this.n))return;const m=M[this.n],S=m.seg,f=m.fps||24,t=this.t;let i;
    if(!S)i=t*f;else if(t<this.dR)i=S.rise[0]+Math.floor(t/this.dR*(S.rise[1]-S.rise[0]));
    else if(t<this.brk)i=S.hold[0]+Math.floor((t-this.dR)*f)%(S.hold[1]-S.hold[0]);
    else i=S.break[0]+Math.floor(cl((t-this.brk)/this.dB,0,.999)*(S.break[1]-S.break[0]));
    const [sx,sy,fw,fh]=frameRect(this.n,i),[X,Y]=P(this.x,this.y,0),k=this.h/m.refH;
    ctx.save();ctx.translate(X,Y);if(this.flip)ctx.scale(-1,1);ctx.drawImage(IMG[this.n],sx,sy,fw,fh,-m.ax*k,-m.ay*k,fw*k,fh*k);ctx.restore();}}
/* laid flat on the ground, drawn top-down: waves (rotated to the facing) and cracks (scaled to the radius, played over its life) */
class GFlat extends GPiece{constructor(o){super(Object.assign({layer:'ground',phi:0},o));const m=M[this.n];if(!this.life)this.life=m.n/(m.fps||24);}
  draw(){if(this.t<0||!ok(this.n))return;const m=M[this.n],[sx,sy,fw,fh]=frameRect(this.n,this.fi()),[X,Y]=P(this.x,this.y,0),k=this.k;
    ctx.save();ctx.translate(X,Y);ctx.scale(1,K);if(this.phi)ctx.rotate(this.phi);ctx.drawImage(IMG[this.n],sx,sy,fw,fh,-m.ax*k,-m.ay*k,fw*k,fh*k);ctx.restore();}}
const ADD=g=>{A0.call(window,g);return g;};
function spike(x,y,h,life,delay,lean){if(!ok('ice_spike'))return null;return ADD(new GStand({n:'ice_spike',x,y,h:h*1.06,life:Math.max(.3,life),delay:delay||0,flip:(lean||0)<0}));}

/* ---------- hits ---------- */
function hitFx(e,key,o,mult){const st=ST[key],hk=st&&st.hit&&HITS[o&&o.label==='RUPTURE'?'blood':st.hit];if(!hk||!ok(hk.n))return;
  const now=gameTime,big=!!(o&&o.big)||mult>=2.4||(o&&o.label==='RUPTURE');if(now-(e._gxh||-9)<.06&&!big)return;e._gxh=now;
  const ph=Math.atan2(e.y-player.y,e.x-player.x),k=(e.boss?1.35:1)*(big?1.3:1)*(hk.k||1),z=(e.boss?42:26)+R(-4,6);
  const rot=hk.along?scrAng(player.phi):hk.turn?scrAng(ph)+(hk.perp?Math.PI*.5+(Math.random()<.5?-.5:.5):R(-.35,.35)):R(-.3,.3);
  const g=ADD(new GHit({n:hk.n,x:e.x,y:e.y+1,z,k,rot,flip:Math.random()<.5}));g.t=.03;                 // already lit while hit-stop holds the frame
  if(hk.crack&&ok(hk.crack[0]))ADD(new GFlat({n:hk.crack[0],x:e.x,y:e.y,k:hk.crack[1]*k/(M[hk.crack[0]].rRef||110),life:1.2}));
  if(hk.spikes)for(let i=0;i<hk.spikes;i++){const a=ph+(i-2)*.55+R(-.15,.15),d=R(20,34)*k;spike(e.x+Math.cos(a)*d,e.y+Math.sin(a)*d*.8,R(30,52)*k,R(.42,.6),.02+i*.012,Math.cos(a));}}

/* ---------- hooks ---------- */
let HIT=null;                    // set while v5 draws the hit of one of our skills: its pieces are replaced by ours
const A0=window.addFx;
window.addFx=addFx=function(f){
  try{
    if(f&&!f._gx){const key=HIT||ctxKey(),n=f.constructor&&f.constructor.name;
      if(key&&ST[key]){
        if(HIT&&KT.Part&&f instanceof KT.Part&&n!=='Proj')return f;                                       // v5's hit pieces (not the heal orbs)
        if((n==='VSlash'||n==='VArc')&&typeof f.w3==='function'&&STRIP[f.el]&&ok(STRIP[f.el])){f._gx=STRIP[f.el];f._p0=f.paint;f.paint=stripPaint;}
        else if(n==='Streak'&&STRIP[f.el]&&ok(STRIP[f.el])){f._gx=STRIP[f.el];f._p0=f.paint;f.paint=streakPaint;}
        else if(key==='frostFang'&&n==='Crystal'&&ok('ice_fangs')){                                        // the damaging wave's crystal → a fang cluster
          const h=cl((f.h||20)*1.9+8,22,86),L=Math.max(.32,Math.min(f.life||.4,2.6)+.22),g=ADD(new GStand({n:'ice_fangs',x:f.x,y:f.y,h,life:L,delay:Math.max(0,f.delay||0),flip:Math.random()<.5}));
          const s0=f.shatter;if(s0)f.shatter=function(){try{g.shatter();}catch(e){}return s0.apply(this,arguments);};return f;}
        else if(n==='Spike'&&(f.el==='ice'||f.el==='wR')&&ok('ice_spike')){const g=spike(f.x,f.y,f.h,f.life,f.delay,f.lean);if(g){const k0=f.kill;f.kill=function(){try{g.shatter();}catch(e){}return k0.apply(this,arguments);};return f;}}
        else if(n==='Wave'&&WAVE[f.el]&&ok(WAVE[f.el])){ADD(new GFlat({n:WAVE[f.el],x:f.x,y:f.y,phi:f.phi==null?player.phi:f.phi,delay:f.delay||0}));return f;}
        else if(n==='Crack'&&!f.line&&f.r&&ok(CRACK(f.el))){const c=CRACK(f.el);ADD(new GFlat({n:c,x:f.x,y:f.y,k:f.r/(M[c].rRef||110),life:Math.max(.6,f.life||1.2),delay:f.delay||0}));return f;}
        else if(n==='Bolt'&&(f.z||0)>=250&&(f.z2||0)<=8&&ok('volt_strike')){ADD(new GStand({n:'volt_strike',x:f.x2,y:f.y2,h:f.z,delay:f.delay||0}));return f;}
        else if(n==='Pillar'&&(f.el==='wR'||f.el==='ice')&&ok('ice_pillar')){ADD(new GStand({n:'ice_pillar',x:f.x,y:f.y,h:f.h||300,sortOff:2,delay:f.delay||0}));return f;}
      }}
  }catch(e){warn('addFx',e);}
  return A0.apply(this,arguments);};
const H0=window.hurt;
window.hurt=hurt=function(e,mult,o){const dead0=e&&e.dead;let key=null;
  try{key=(o&&o.skill)||(o&&o.auto?'basic':null)||ctxKey();const st=key&&ST[key];if(!(st&&st.hit&&HITS[st.hit]&&ok(HITS[st.hit].n)))key=null;}catch(_){key=null;}
  const p=HIT;if(key&&!(o&&o.dot))HIT=key;let r;try{r=H0.apply(this,arguments);}finally{HIT=p;}
  try{if(key&&e&&!dead0&&r&&!(o&&o.dot))hitFx(e,key,o||{},mult||1);}catch(x){warn('hit',x);}
  return r;};
if(H0&&H0._wfx)window.hurt._wfx=1;
window.WGX={on:1,STRIP,HITS,M,IMG};
})();
