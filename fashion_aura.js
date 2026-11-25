/* fashion_aura.js — fashion auras for EVERY hero (owner 2026-11-23: 'should auras be generated pictures?' → answer 'mostly
   code' → 'ได้ๆ' = make 2–3 code samples first, to judge whether code auras look good enough). FASHION_SYSTEM_TH.md §8.
     sakura · สายลมซากุระ     ember · วงเพลิงถ่าน     frost · ผลึกน้ำแข็ง
   Parts of one aura:
     · floor ring under the feet (ground layer, turns slowly; the hero's own soft shadow is drawn over it)
     · small pieces around the body, split into two depth pieces on the sorted layer (just behind / just in front of the
       hero) — what circles behind is hidden by the body, what comes round the front passes over it
     · a walk trail (petals that drift down and settle, burning footsteps, frost prints)
   No head points and no per-hero art are needed, so it works on all heroes at once. Every sprite is painted ONCE into a
   canvas at load (2–3 cel tones + a darker value edge instead of dark ink, so they read on snow and on dark ground — see
   VFX_STYLE_REF_TH.md) and only drawImage'd each frame. Calm on purpose (owner: busy buff looks were dizzying; a fashion
   aura is on all the time and must never hide skills or boss warnings): slow floor turn, few pieces, no round dots.
   Purely visual: no stats, no gameplay. Low quality (Q.p) thins the pieces and drops the trail.
   Pick: settings panel '✨ ออร่าแฟชั่น' or Alt+A → small wardrobe with a live preview (turn the hero, try grass / snow /
   night ground). Saved af_aura_<hero>. ?aura=<key> forces one (tests), ?aura=0 turns the file off, window.__AURA_OFF=1 hides.
   window.AURA {AU, T, cur, wear, open, drawAt} for tests. */
(function(){
if(typeof CHAR==='undefined'||/[?&]aura=0(&|$)/.test(location.search))return;
const TA=Math.PI*2,KEY='af_aura_'+CHAR,R=32,FS=84;   /* R = floor ring radius (world px at field scale), FS = floor texture size */
const rnd=(a,b)=>a+Math.random()*(b-a),hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);};
const QP=()=>{try{return Q.p;}catch(_){return 1;}};
function cv(w,h,sc,fn){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*sc));c.height=Math.max(1,Math.round(h*sc));
  const g=c.getContext('2d');g.scale(sc,sc);g.lineCap='round';g.lineJoin='round';fn(g,w,h);c.uw=w;c.uh=h;return c;}
const lin=(g,x0,y0,x1,y1,st)=>{const r=g.createLinearGradient(x0,y0,x1,y1);for(const [o,c] of st)r.addColorStop(o,c);return r;};
const rad=(g,x,y,r0,r1,st)=>{const r=g.createRadialGradient(x,y,r0,x,y,r1);for(const [o,c] of st)r.addColorStop(o,c);return r;};

/* ================================================================
   1. ART — painted once
   ================================================================ */
/* a cherry petal: rounded body, notched outer tip; base at (0,L/2), tip at (0,-L/2) */
function petalPath(g,L,W){const b=L*.5,t=-L*.5;g.beginPath();g.moveTo(0,b);
  g.bezierCurveTo(-W*.8,b-L*.2,-W*.76,t+L*.12,-W*.3,t+L*.02);g.quadraticCurveTo(-W*.12,t-L*.03,0,t+L*.16);
  g.quadraticCurveTo(W*.12,t-L*.03,W*.3,t+L*.02);g.bezierCurveTo(W*.76,t+L*.12,W*.8,b-L*.2,0,b);g.closePath();}
const PT_L=['#fff7fa','#ffc6da','#ff96bb','rgba(226,92,142,.3)','rgba(206,70,122,.78)'],
      PT_D=['#ffe6ef','#ffa2c2','#f2689a','rgba(190,50,106,.3)','rgba(170,38,92,.85)'];
function paintPetal(g,L,W,tn){petalPath(g,L,W);g.fillStyle=lin(g,0,L*.5,0,-L*.5,[[0,tn[0]],[.5,tn[1]],[1,tn[2]]]);g.fill();
  g.save();petalPath(g,L,W);g.clip();g.fillStyle=tn[3];g.beginPath();g.ellipse(W*.46,L*.04,W*.34,L*.72,0,0,TA);g.fill();g.restore();
  petalPath(g,L,W);g.strokeStyle=tn[4];g.lineWidth=L*.045;g.stroke();
  g.strokeStyle='rgba(255,255,255,.92)';g.lineWidth=L*.05;g.beginPath();g.moveTo(-W*.06,L*.36);g.quadraticCurveTo(-W*.44,L*.02,-W*.22,-L*.3);g.stroke();
  g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=L*.035;g.beginPath();g.moveTo(0,L*.42);g.lineTo(0,-L*.08);g.stroke();}
function paintBlossom(g,r){for(let i=0;i<5;i++){g.save();g.rotate(i*TA/5);g.translate(0,-r*.5);paintPetal(g,r,r*.82,PT_L);g.restore();}
  g.fillStyle=rad(g,0,0,0,r*.3,[[0,'#fff6cc'],[1,'#ffbf45']]);g.beginPath();g.arc(0,0,r*.27,0,TA);g.fill();
  g.strokeStyle='#e4507e';g.lineWidth=r*.05;for(let i=0;i<5;i++){const a=i*TA/5+TA/10;g.beginPath();g.moveTo(Math.cos(a)*r*.14,Math.sin(a)*r*.14);g.lineTo(Math.cos(a)*r*.4,Math.sin(a)*r*.4);g.stroke();}
  g.fillStyle='#ff6f9e';for(let i=0;i<5;i++){const a=i*TA/5+TA/10;g.beginPath();g.arc(Math.cos(a)*r*.42,Math.sin(a)*r*.42,r*.055,0,TA);g.fill();}}

/* cartoon flame, bottom centre at (0,0), height ~21 */
function flamePath(g){g.beginPath();g.moveTo(0,0);
  g.bezierCurveTo(-5.2,0,-5.7,-6.4,-3.4,-9.8);g.bezierCurveTo(-2.5,-11.4,-2.9,-13.2,-1.9,-15.4);g.bezierCurveTo(-1.3,-12.8,-.4,-12,.2,-12.4);
  g.bezierCurveTo(-.2,-15.8,1.6,-19,2.4,-21);g.bezierCurveTo(2.7,-17.2,5.7,-13.4,5.3,-8);g.bezierCurveTo(5.1,-2.8,3.4,0,0,0);g.closePath();}
function paintFlame(g){flamePath(g);g.fillStyle=lin(g,0,0,0,-21,[[0,'#ffb43a'],[.45,'#ff7a22'],[1,'#e5401b']]);g.fill();
  g.save();flamePath(g);g.clip();g.fillStyle='rgba(178,36,14,.32)';g.beginPath();g.ellipse(5,-8,3.2,12,-.15,0,TA);g.fill();g.restore();
  flamePath(g);g.strokeStyle='rgba(150,30,12,.55)';g.lineWidth=.5;g.stroke();
  g.save();g.scale(.62,.64);flamePath(g);g.fillStyle=lin(g,0,0,0,-21,[[0,'#fff2b0'],[1,'#ffb52c']]);g.fill();g.restore();
  g.save();g.scale(.32,.34);flamePath(g);g.fillStyle='#fffbea';g.fill();g.restore();}

/* faceted ice spike: base bx0..bx1 at by, tip (tx,ty) */
function spike(g,bx0,bx1,by,tx,ty,c){const mx=(bx0+bx1)/2+(tx-(bx0+bx1)/2)*.1;
  g.fillStyle=c[0];g.beginPath();g.moveTo(bx0,by);g.lineTo(tx,ty);g.lineTo(mx,by);g.closePath();g.fill();
  g.fillStyle=c[1];g.beginPath();g.moveTo(mx,by);g.lineTo(tx,ty);g.lineTo(bx1,by);g.closePath();g.fill();
  g.fillStyle=c[2];g.beginPath();g.moveTo(bx1,by);g.lineTo(tx+(bx1-tx)*.5,ty+(by-ty)*.5);g.lineTo(bx1-(bx1-mx)*.42,by);g.closePath();g.fill();
  g.strokeStyle='rgba(255,255,255,.95)';g.lineWidth=.45;g.beginPath();g.moveTo(tx,ty+.5);g.lineTo(tx+(mx-tx)*.7,ty+(by-ty)*.7);g.stroke();}
const ICE=['#f4fdff','#9ad8fb','#3f88d4'],ICEB=['#e4f6ff','#86c7f0','#3a7cc4'];
/* six-arm snowflake: dark-blue under-stroke + white top stroke */
function flake(g,r,wu,wt,cu,ct){for(const [w,c] of [[wu,cu],[wt,ct]]){g.strokeStyle=c;g.lineWidth=w;
  for(let i=0;i<6;i++){g.save();g.rotate(i*TA/6);g.beginPath();g.moveTo(0,-r*.16);g.lineTo(0,-r);
    for(const [p,l] of [[.42,.3],[.7,.22]]){g.moveTo(0,-r*p);g.lineTo(-r*l*.8,-r*(p+l*.6));g.moveTo(0,-r*p);g.lineTo(r*l*.8,-r*(p+l*.6));}g.stroke();g.restore();}}}
function hexPath(g,r,a0){g.beginPath();for(let i=0;i<6;i++){const a=i*TA/6+(a0||0);g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();}
function star4(g,r,th){g.beginPath();for(let i=0;i<8;i++){const a=i*TA/8-TA/4,q=i%2?r*th:r;g.lineTo(Math.cos(a)*q,Math.sin(a)*q);}g.closePath();}
/* a jagged line from radius r0 to r1 at angle a (seeded) */
function jag(g,a,r0,r1,seed){g.beginPath();const n=5;for(let i=0;i<=n;i++){const k=i/n,r=r0+(r1-r0)*k,o=(i&&i<n?(hash(seed+i)-.5)*.22:0);g.lineTo(Math.cos(a+o)*r,Math.sin(a+o)*r);}g.stroke();}

const T={};
function paintAll(){
  T.pet=cv(10,14,5,g=>{g.translate(5,7);paintPetal(g,13,9.6,PT_L);});
  T.petD=cv(10,14,5,g=>{g.translate(5,7);paintPetal(g,13,9.6,PT_D);});
  T.blossom=cv(18,18,5,g=>{g.translate(9,9);paintBlossom(g,8);});
  T.flame=cv(12,22,5,g=>{g.translate(6,21.6);paintFlame(g);});
  T.spark=cv(9,15,6,g=>{g.translate(4.5,7.5);g.fillStyle=rad(g,0,.6,0,4.4,[[0,'rgba(255,170,60,.55)'],[1,'rgba(255,120,40,0)']]);g.fillRect(-4.5,-7.5,9,15);
    const d=(k,c)=>{g.fillStyle=c;g.beginPath();g.moveTo(0,-6*k);g.lineTo(2.2*k,.8*k);g.lineTo(0,6*k);g.lineTo(-2.2*k,.8*k);g.closePath();g.fill();};
    d(1,'#ff6a22');d(.7,'#ffb43a');d(.4,'#fffbe6');});
  T.glow=cv(32,32,3,g=>{g.fillStyle=rad(g,16,16,0,16,[[0,'rgba(255,170,70,.6)'],[.5,'rgba(255,120,40,.22)'],[1,'rgba(255,90,30,0)']]);g.fillRect(0,0,32,32);});
  T.crys=cv(20,26,5,g=>{g.fillStyle='#eaf8ff';g.beginPath();g.ellipse(10,24.4,8.4,2.3,0,0,TA);g.fill();g.strokeStyle='rgba(52,112,186,.5)';g.lineWidth=.7;g.beginPath();g.ellipse(10,24.6,8.4,2.3,0,.15,Math.PI-.15);g.stroke();
    spike(g,11.6,16.2,24.6,17.9,11.2,ICEB);spike(g,3,8.6,24.6,2.2,9.6,ICEB);spike(g,6.4,13.6,24.8,10.4,1,ICE);spike(g,11.8,15.4,25,14.2,15.4,ICE);});
  T.flake=cv(14,14,6,g=>{g.translate(7,7);flake(g,6.2,1.7,.75,'rgba(36,98,184,.9)','#ffffff');g.fillStyle='#dff5ff';hexPath(g,1.5,TA/12);g.fill();g.strokeStyle='rgba(36,98,184,.9)';g.lineWidth=.45;g.stroke();});
  T.glint=cv(14,14,6,g=>{g.translate(7,7);g.fillStyle=rad(g,0,0,0,6,[[0,'rgba(170,226,255,.6)'],[1,'rgba(170,226,255,0)']]);g.fillRect(-7,-7,14,14);
    g.fillStyle='rgba(54,128,214,.6)';star4(g,6.6,.2);g.fill();g.fillStyle='#ffffff';star4(g,6,.15);g.fill();g.fillStyle='#e6f7ff';star4(g,2.4,.3);g.fill();});
  T.scorch=cv(18,14,4,g=>{g.translate(9,7);   /* a burnt footprint: soft irregular soot + two short glowing cracks + coal specks (no ring) */
    for(const [x,y,r,al] of [[-1.6,.3,5.4,.5],[2,-.6,4.4,.42],[.4,1.4,3.6,.38]]){g.fillStyle=rad(g,x,y,0,r,[[0,`rgba(52,16,6,${al})`],[1,'rgba(52,16,6,0)']]);g.fillRect(-9,-7,18,14);}
    for(const [m,c,bl] of [[1.6,'rgba(90,20,6,.55)',0],[.95,'#ff7a24',4],[.38,'#ffe08a',0]]){g.strokeStyle=c;g.lineWidth=m;g.shadowColor='rgba(255,110,30,.9)';g.shadowBlur=bl;
      g.beginPath();g.moveTo(-3.6,.8);g.lineTo(-1.4,-.4);g.lineTo(.2,.5);g.lineTo(2.4,-1.2);g.stroke();g.beginPath();g.moveTo(-.6,2.2);g.lineTo(.6,1);g.stroke();}
    g.shadowBlur=0;for(const [x,y,z] of [[3.6,1.2,.9],[-4.2,-1.6,.75],[1.4,-2.6,.6]]){g.fillStyle='#3a1a10';g.beginPath();g.moveTo(x-z,y);g.lineTo(x,y-z*.8);g.lineTo(x+z,y+.1);g.lineTo(x+.1,y+z*.8);g.closePath();g.fill();
      g.fillStyle='#ff9a3a';g.beginPath();g.moveTo(x,y-z*.8);g.lineTo(x+z,y+.1);g.lineTo(x+.2,y);g.closePath();g.fill();}});
  T.mist=cv(34,16,3,g=>{for(const [x,y,r,a] of [[9,9.5,6.5,.5],[17,7.5,8,.55],[25,9.8,6,.45],[13,11.5,5,.35],[22,12,5.5,.35]]){g.fillStyle=rad(g,x,y,0,r,[[0,`rgba(248,253,255,${a})`],[.6,`rgba(236,248,255,${a*.5})`],[1,'rgba(236,248,255,0)']]);g.fillRect(0,0,34,16);}});
  T.fprint=cv(14,14,5,g=>{g.translate(7,7);g.fillStyle=rad(g,0,0,0,6.8,[[0,'rgba(214,244,255,.55)'],[1,'rgba(190,232,255,0)']]);g.beginPath();g.arc(0,0,6.8,0,TA);g.fill();
    flake(g,5.6,1.3,.6,'rgba(44,108,190,.55)','rgba(250,254,255,.95)');});
  /* ---- floors (top-down circles; drawn squashed by K and turned on the ground) ---- */
  T.flSak=cv(FS,FS,3,g=>{g.translate(FS/2,FS/2);
    g.fillStyle=rad(g,0,0,0,R+6,[[0,'rgba(255,196,222,.44)'],[.62,'rgba(255,182,212,.26)'],[1,'rgba(255,170,205,0)']]);g.beginPath();g.arc(0,0,R+6,0,TA);g.fill();
    /* faint sakura crest under the feet */
    g.beginPath();for(let i=0;i<5;i++){const a=i*TA/5-TA/4,a2=a+TA/10,r=R*.42;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);g.quadraticCurveTo(Math.cos(a2)*r*.62,Math.sin(a2)*r*.62,Math.cos(a+TA/5)*r,Math.sin(a+TA/5)*r);}
    g.closePath();g.fillStyle='rgba(255,255,255,.14)';g.fill();g.strokeStyle='rgba(232,104,156,.4)';g.lineWidth=.8;g.stroke();
    for(let i=0;i<10;i++){g.save();g.rotate(i*TA/10+TA/20);g.translate(0,-R*.6);g.globalAlpha=.66;paintPetal(g,5.6,4.2,i%2?PT_D:PT_L);g.restore();}
    const A=i=>i*TA/5-TA/4,gp=.22;
    for(const [w,c] of [[2.6,'rgba(200,64,116,.4)'],[1.1,'#ffb3cd']]){g.strokeStyle=c;g.lineWidth=w;for(let i=0;i<5;i++){g.beginPath();g.arc(0,0,R-2,A(i)+gp,A(i+1)-gp);g.stroke();}}
    /* garland of fallen petals along the ring */
    for(let i=0;i<5;i++)for(let j=0;j<4;j++){const a=A(i)+gp+.07+(TA/5-2*gp-.14)*(j+.5)/4,rr=R-2+(j%2?1.1:-1.1);g.save();g.translate(Math.cos(a)*rr,Math.sin(a)*rr);
      g.rotate(a+(j%2?.45:-.45)+(j%2?Math.PI:0));paintPetal(g,7,5.2,(i+j)%3===1?PT_D:PT_L);g.restore();}
    for(let i=0;i<5;i++){const a=A(i);g.save();g.translate(Math.cos(a)*(R-2),Math.sin(a)*(R-2));g.rotate(a+TA/4);g.drawImage(T.blossom,-7.4,-7.4,14.8,14.8);g.restore();}});
  T.flEmb=cv(FS,FS,3,g=>{g.translate(FS/2,FS/2);
    g.fillStyle=rad(g,0,0,0,R+5,[[0,'rgba(54,14,6,.4)'],[.66,'rgba(70,20,8,.28)'],[1,'rgba(70,20,8,0)']]);g.beginPath();g.arc(0,0,R+5,0,TA);g.fill();
    g.fillStyle=rad(g,0,0,0,R*.74,[[0,'rgba(255,156,54,.3)'],[1,'rgba(255,120,40,0)']]);g.beginPath();g.arc(0,0,R*.74,0,TA);g.fill();
    /* a web of glowing cracks (dark rim → orange → yellow core, tapering outward), like a cooled lava floor */
    const crack=(pts,w0,w1)=>{for(const [m,c,bl] of [[1,'rgba(84,18,6,.62)',0],[.62,'#ff7420',5],[.26,'#ffe28a',0]]){g.strokeStyle=c;g.shadowColor='rgba(255,110,30,.9)';g.shadowBlur=bl;
        for(let i=1;i<pts.length;i++){const k=(i-1)/Math.max(1,pts.length-2);g.lineWidth=(w0+(w1-w0)*k)*m*2.1;g.beginPath();g.moveTo(pts[i-1][0],pts[i-1][1]);g.lineTo(pts[i][0],pts[i][1]);g.stroke();}}g.shadowBlur=0;};
    const walk=(x,y,a,len,n,sd,wan)=>{const p=[[x,y]];for(let i=0;i<n;i++){a+=(hash(sd+i*5)-.5)*wan;x+=Math.cos(a)*len/n;y+=Math.sin(a)*len/n;p.push([x,y]);}return p;};
    const M=[];for(let i=0;i<5;i++){const a=i*TA/5+(hash(i+3)-.5)*.5,r0=R*(.12+hash(i+7)*.08),pts=walk(Math.cos(a)*r0,Math.sin(a)*r0,a,R*(.56+hash(i+11)*.14),6,i*13+1,.55);M.push(pts);crack(pts,1.05,.3);
      const j=2+(i%2),bp=pts[j],ba=Math.atan2(bp[1],bp[0])+(i%2?.75:-.75);crack(walk(bp[0],bp[1],ba,R*.24,3,i*17+5,.5),.6,.2);}
    for(let i=0;i<5;i++){const A1=M[i][4],A2=M[(i+1)%5][3],mx=(A1[0]+A2[0])/2*1.06,my=(A1[1]+A2[1])/2*1.06;if(i%2===0)crack([A1,[mx+(hash(i+50)-.5)*3,my+(hash(i+51)-.5)*3],[A1[0]+(A2[0]-A1[0])*.82,A1[1]+(A2[1]-A1[1])*.82]],.55,.25);}
    /* molten broken ring */
    const arcs=[[.1,1.28],[1.62,2.78],[3.1,4.22],[4.56,5.86]];
    for(const [w,c,dr] of [[4.4,'rgba(104,24,8,.6)',0],[2.4,'#ff6a1c',0],[1.1,'#ffc65a',-.35]]){g.strokeStyle=c;g.lineWidth=w;for(const [a0,a1] of arcs){g.beginPath();g.arc(0,0,R-2+dr,a0,a1);g.stroke();}}
    /* coal chunks on the rim */
    for(let i=0;i<12;i++){const a=hash(i+60)*TA,rr=R-2+(hash(i+70)-.5)*5,sz=1.1+hash(i+80)*1.3;g.save();g.translate(Math.cos(a)*rr,Math.sin(a)*rr);g.rotate(hash(i+90)*TA);
      g.fillStyle='#3b1a12';g.beginPath();g.moveTo(-sz,-sz*.6);g.lineTo(sz*.3,-sz);g.lineTo(sz,-.1);g.lineTo(sz*.4,sz*.8);g.lineTo(-sz*.8,sz*.6);g.closePath();g.fill();
      g.fillStyle='#ff8a2c';g.beginPath();g.moveTo(sz*.3,-sz);g.lineTo(sz,-.1);g.lineTo(sz*.35,-.05);g.closePath();g.fill();g.restore();}});
  T.flIce=cv(FS,FS,3,g=>{g.translate(FS/2,FS/2);
    g.fillStyle=rad(g,0,0,0,R+5,[[0,'rgba(214,244,255,.42)'],[.66,'rgba(178,226,255,.24)'],[1,'rgba(160,215,255,0)']]);g.beginPath();g.arc(0,0,R+5,0,TA);g.fill();
    for(const [w,c] of [[2.5,'rgba(44,108,190,.42)'],[1.05,'rgba(242,252,255,.95)']]){g.strokeStyle=c;g.lineWidth=w;
      for(let i=0;i<6;i++){g.save();g.rotate(i*TA/6);g.beginPath();g.moveTo(0,-R*.22);g.lineTo(0,-R*.84);
        for(const [p,l] of [[.38,.2],[.6,.16]]){g.moveTo(0,-R*p);g.lineTo(-R*l*.75,-R*(p+l*.62));g.moveTo(0,-R*p);g.lineTo(R*l*.75,-R*(p+l*.62));}g.stroke();g.restore();}
      hexPath(g,R*.2,TA/12);g.stroke();}
    for(const [w,c] of [[3.2,'rgba(44,108,190,.48)'],[1.4,'#e8f8ff']]){g.strokeStyle=c;g.lineWidth=w;for(let i=0;i<6;i++){const a=i*TA/6-TA/4;g.beginPath();g.arc(0,0,R-2,a+.2,a+TA/6-.2);g.stroke();}}
    for(let i=0;i<6;i++){const a=i*TA/6-TA/4;g.save();g.translate(Math.cos(a)*(R-2),Math.sin(a)*(R-2));g.rotate(a+TA/4);
      g.fillStyle='rgba(44,108,190,.6)';g.beginPath();g.moveTo(0,-3.4);g.lineTo(1.8,0);g.lineTo(0,3.4);g.lineTo(-1.8,0);g.closePath();g.fill();
      g.fillStyle='#ffffff';g.beginPath();g.moveTo(0,-2.7);g.lineTo(1.25,0);g.lineTo(0,2.7);g.lineTo(-1.25,0);g.closePath();g.fill();g.restore();}});
}
paintAll();

/* ================================================================
   2. DRAWING HELPERS (any 2D context: the game canvas or the wardrobe preview)
   ================================================================ */
function spr(g,im,x,y,w,rot,fl,al){if(!(al>.01)||!(w>.2))return;const h=w*im.uh/im.uw;g.save();g.globalAlpha=al;g.translate(x,y);if(rot)g.rotate(rot);
  if(fl!==undefined&&fl!==1)g.scale((fl<0?-1:1)*Math.max(.2,Math.abs(fl)),1);g.drawImage(im,-w/2,-h/2,w,h);g.restore();}
/* bottom-anchored upright sprite (flames, crystals) */
function sprB(g,im,x,y,w,h,al,mir){if(!(al>.01)||!(h>.2))return;g.save();g.globalAlpha=al;g.translate(x,y);if(mir)g.scale(-1,1);g.drawImage(im,-w/2,-h,w,h);g.restore();}
const SIDE=sn=>sn<0?-1:1;
/* keep the face readable: a front piece crossing the middle of the body at face height turns see-through for that moment */
const FF=(side,th,h,s)=>side>0&&h>38*s?.55+.45*Math.min(1,Math.abs(Math.cos(th))*2.6):1;

/* ================================================================
   3. THE THREE AURAS
   body(g, x, y, z, s, t, side, A): (x,y) = the feet on screen, z = hero height off the ground, s = size scale,
   t = seconds, side −1 = only what is behind the hero / +1 = only what is in front, A = alpha
   ================================================================ */
const AU={
 sakura:{n:'Sakura Breeze',th:'สายลมซากุระ',col:'#ff8fb5',tex:'flSak',spin:.1,breath:1,step:30,
   d:'กลีบซากุระลอยหมุนเกลียวรอบตัวช้า ๆ มีกลีบร่วงลงมาพักบนพื้น ใต้เท้าเป็นวงดอกซากุระ เดินแล้วกลีบร่วงตามทาง',
   body(g,x,y,z,s,t,side,A){const n=Math.max(3,Math.round(8*QP()));
     for(let i=0;i<n;i++){const k=(t/4.2+i/n)%1,th=i*TA/n+k*TA*1.05+t*.3,sn=Math.sin(th);if(SIDE(sn)!==side)continue;
       const r=(31-k*10)*s,zz=(5+k*66)*s+z,al=Math.min(1,k/.14,Math.pow(Math.max(0,(1-k)/.3),1.6))*(side<0?.8:1)*A*FF(side,th,zz-z,s),px=x+Math.cos(th)*r,py=y+sn*r*K-zz,sh=1-.45*Math.max(0,(k-.7)/.3);
       if(i===0)spr(g,T.blossom,px,py,9.4*s*sh,t*.7,Math.cos(t*1.9)*.35+.65,al);
       else spr(g,i%2?T.petD:T.pet,px,py,(i%2?8.4:8.9)*s*sh,Math.sin(t*2.2+i*1.3)*.9+k*2.4,Math.cos(t*2.9+i*1.7),al);}
     for(let j=0;j<2;j++){const c=t/4.6+j*.5,cy=Math.floor(c),f=c-cy,th=j*2.6+cy*2.1,sn=Math.sin(th);if(SIDE(sn)!==side)continue;
       const r=(21+hash(cy*3+j)*11)*s,px=x+Math.cos(th)*r,py=y+sn*r*K,im=j?T.petD:T.pet;
       if(f<.62){const kk=f/.62;spr(g,im,px+Math.sin(t*3.1+j*2)*5*s*(1-kk),py-86*s*Math.pow(1-kk,1.1),8.5*s,t*2.6+j,Math.cos(t*4.2+j),Math.min(1,kk/.1)*A);}
       else{const w=8.5*s,h=w*im.uh/im.uw;g.save();g.globalAlpha=A*.95*Math.pow(1-(f-.62)/.38,.7);g.translate(px,py);g.scale(1,K);g.rotate(j*1.3+cy);g.drawImage(im,-w/2,-h/2,w,h);g.restore();}}},
   trail(x,y,ux,uy,sd){addFx(new TrPetal(x,y,ux,uy,sd));}},
 ember:{n:'Ember Ring',th:'วงเพลิงถ่าน',col:'#ff7a24',tex:'flEmb',spin:.1,breath:1,glow:.9,step:24,
   d:'วงถ่านแดงร้าวเรืองแสงใต้เท้า มีเปลวไฟเล็ก ๆ ลุกรอบวง ประกายไฟลอยขึ้นช้า ๆ เดินแล้วเหลือรอยเท้าไหม้',
   body(g,x,y,z,s,t,side,A){const gz=Math.max(0,1-z/70)*A,rr=(R-4)*s;
     if(gz>.01)for(let i=0;i<7;i++){const th=i*TA/7+t*.12,sn=Math.sin(th);if(SIDE(sn)!==side)continue;
       const h=(10.5+3.2*Math.sin(t*5.3+i*1.9)+1.6*Math.sin(t*8.9+i*.7))*s*(.82+.3*hash(i)),w=h*.56*(1+.07*Math.sin(t*6.3+i));
       sprB(g,T.flame,x+Math.cos(th)*rr,y+sn*rr*K+.5*s,w,h,gz*(side<0?.85:1),i%2);}
     const n=Math.max(3,Math.round(9*QP()));
     for(let i=0;i<n;i++){const c=t/2.1+i/n,cy=Math.floor(c),k=c-cy,th=hash(cy*7+i)*TA,sn=Math.sin(th);if(SIDE(sn)!==side)continue;
       const r=(R-6-k*7)*s,zz=(2+k*60)*s+z*.5,wob=Math.sin(t*3.3+i*2.1)*3.4*s*k;
       spr(g,T.spark,x+Math.cos(th)*r+wob,y+sn*r*K-zz,7.2*s*(1-.45*k),Math.sin(t*2+i)*.3,1,Math.min(1,k/.1)*Math.pow(1-k,.7)*A*FF(side,th,zz-z*.5,s));}
     for(let j=0;j<3;j++){const c=t/1.6+j/3,cy=Math.floor(c),k=c-cy,th=hash(cy*5+j+40)*TA,sn=Math.sin(th);if(SIDE(sn)!==side)continue;   /* a small flame breaks off the ring and rises */
       const r=(R-5)*s*(1-k*.25),h=(7.5*(1-k)+1.5)*s;sprB(g,T.flame,x+Math.cos(th)*r+Math.sin(t*4+j)*2*s*k,y+sn*r*K-(k*30*s+z*.5),h*.56,h,Math.min(1,k/.12)*Math.pow(1-k,.9)*A*(side<0?.85:1),j%2);}},
   trail(x,y,ux,uy,sd){addFx(new TrEmber(x,y,ux,uy,sd));}},
 frost:{n:'Frost Crystal',th:'ผลึกน้ำแข็ง',col:'#7cc8ff',tex:'flIce',spin:.08,mist:1,step:24,
   d:'ลายเกล็ดหิมะบนพื้นหมุนช้า ๆ มีผลึกน้ำแข็งงอกรอบวง เกล็ดหิมะลอยวนรอบตัวและแสงวิบวับ เดินแล้วเหลือรอยเท้าน้ำแข็ง',
   body(g,x,y,z,s,t,side,A){const gz=Math.max(0,1-z/70)*A,ang=t*.08;
     if(gz>.01)for(const [a0,hh] of [[TA*.07,15],[TA*.43,12],[TA*.75,17]]){const th=a0+ang,sn=Math.sin(th);if(SIDE(sn)!==side)continue;
       const rr=(R-3)*s;sprB(g,T.crys,x+Math.cos(th)*rr,y+sn*rr*K+.6*s,hh*.77*s,hh*s,gz*(side<0?.88:1),a0>TA*.3&&a0<TA*.6);}
     const n=Math.max(3,Math.round(6*QP()));
     for(let i=0;i<n;i++){const th=i*TA/n*2.5+t*.42,sn=Math.sin(th);if(SIDE(sn)!==side)continue;   /* one slow helix: even angles, stepped heights → never bunch up */
       const r=(25+3*Math.sin(i*2.1))*s,zz=(12+i*(56/n)+3*Math.sin(t*1.25+i))*s+z;
       spr(g,T.flake,x+Math.cos(th)*r,y+sn*r*K-zz,(7.4+1.8*hash(i+3))*s,t*.55+i,1,A*(side<0?.75:1)*FF(side,th,zz-z,s));}
     for(let j=0;j<3;j++){const c=t/1.7+j*.37,cy=Math.floor(c),f=c-cy;if(f>.42)continue;const th=hash(cy*13+j*7)*TA,sn=Math.sin(th);if(SIDE(sn)!==side)continue;
       const r=(10+hash(cy*5+j)*18)*s,zz=(12+hash(cy*11+j*3)*56)*s+z,p=Math.sin(f/.42*Math.PI);
       spr(g,T.glint,x+Math.cos(th)*r,y+sn*r*K-zz,9*s*(.45+.55*p),f*1.2,1,A*p);}},
   trail(x,y,ux,uy,sd){addFx(new TrFrost(x,y,ux,uy,sd));}},
};
function drawFloor(g,au,x,y,s,t,A){const tex=T[au.tex];if(!tex||!(A>.01))return;g.save();g.translate(x,y);g.scale(1,K);
  if(au.glow){g.save();g.globalCompositeOperation='lighter';g.globalAlpha=A*au.glow*(.72+.28*Math.sin(t*1.7));const w=R*2.7*s;g.drawImage(T.glow,-w/2,-w/2,w,w);g.restore();}
  g.rotate(t*au.spin);g.globalAlpha=A*(au.breath?(.88+.12*Math.sin(t*1.5)):1);const w=FS*s;g.drawImage(tex,-w/2,-w/2,w,w);g.restore();
  if(au.mist)for(let i=0;i<3;i++){const th=i*TA/3-t*.13,rr=(R-1)*s,mw=30*s*(1+.12*Math.sin(t*.9+i*2));g.save();g.globalAlpha=A*(.5+.2*Math.sin(t*.7+i*1.7));
    g.drawImage(T.mist,x+Math.cos(th)*rr-mw/2,y+Math.sin(th)*rr*K-mw*.32,mw,mw*16/34);g.restore();}}
/* the whole aura at one point (tests, wardrobe icons): floor, back pieces, [hero], front pieces */
function drawAt(g,key,x,y,s,t,hero){const au=AU[key];if(!au)return;drawFloor(g,au,x,y,s,t,1);au.body(g,x,y,0,s,t,-1,1);if(hero)hero();au.body(g,x,y,0,s,t,1,1);}

/* ================================================================
   4. IN THE WORLD
   ================================================================ */
let cur=null;try{cur=localStorage.getItem(KEY)||null;if(cur&&!AU[cur])cur=null;}catch(_){}
const FORCE=(location.search.match(/[?&]aura=([a-z]+)/)||[])[1];if(FORCE&&AU[FORCE])cur=FORCE;
const SC=()=>{const b=SPR_BASE*MAP_CHAR;return (typeof SPR==='number'&&SPR>0?SPR:b)/b;};   /* towns with charK draw heroes bigger: the aura follows */
const SCH=()=>SC()*(window.HERO_K||1);   /* in the world the aura also follows the hero's own size (HERO_SIZE, 2026-11-25); previews show the standard size */
const live=()=>!!(cur&&AU[cur]&&!window.__AURA_OFF);
function heroA(){if(!player||player.dead||player.hp<=0)return 0;let a=1;try{if(typeof JH==='function'&&JH('jgPlayerAlpha'))a=jgPlayerAlpha();}catch(_){}return Math.max(0,Math.min(1,a));}
class AuraGround{constructor(){this.layer='ground';this.__gt='-';}update(){return live();}
  draw(){const au=AU[cur],a=heroA();if(!au||a<=.01)return;const [x,y]=P(player.x,player.y,0);drawFloor(ctx,au,x,y,SCH(),gameTime,a*Math.max(0,1-(player.z||0)/80));}}
class AuraBody{constructor(side){this.layer='sorted';this.side=side;this.__gt='-';this.sy=player.y+side*.6;}
  update(){this.sy=player.y+this.side*.6;return live();}
  draw(){const au=AU[cur],a=heroA();if(!au||a<=.01)return;const [x,y]=P(player.x,player.y,0);au.body(ctx,x,y,player.z||0,SCH(),gameTime,this.side,a);}}
/* ---- walk trail ---- */
class TrPetal{constructor(x,y,ux,uy,sd){this.layer='sorted';this.__gt='-';this._aurT=1;const o=rnd(4,11);this.x=x-ux*6-uy*sd*o;this.y=y-uy*6+ux*sd*o;this.sy=this.y;this.t=0;
    this.z0=rnd(26,50);this.T1=rnd(.8,1.1);this.T2=1.25;this.r0=rnd(0,TA);this.vr=(Math.random()<.5?-1:1)*rnd(1.6,3.2);this.ph=rnd(0,TA);this.im=Math.random()<.35;}
  update(dt){this.t+=dt;if(this.t>=this.T1)this.layer='ground';return this.t<this.T1+this.T2&&live();}
  draw(){const s=SCH(),im=this.im?T.petD:T.pet;
    if(this.t<this.T1){const k=this.t/this.T1,[x,y]=P(this.x+Math.sin(this.t*3.4+this.ph)*5*s*(1-k*.6),this.y,this.z0*s*Math.pow(1-k,1.15));
      spr(ctx,im,x,y,8.5*s,this.r0+this.vr*this.t,Math.cos(this.t*4.6+this.ph),Math.min(1,this.t/.12));}
    else{const k=(this.t-this.T1)/this.T2,[x,y]=P(this.x+Math.sin(this.T1*3.4+this.ph)*5*s*.4,this.y,0),w=8.5*s,h=w*im.uh/im.uw;
      ctx.save();ctx.globalAlpha=.95*Math.pow(1-k,.8);ctx.translate(x,y);ctx.scale(1,K);ctx.rotate(this.r0+this.vr*this.T1);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();}}}
class TrEmber{constructor(x,y,ux,uy,sd){this.layer='ground';this.__gt='-';this._aurT=1;this.x=x-uy*sd*4.5;this.y=y+ux*sd*4.5;this.t=0;this.T=1.35;this.rot=Math.atan2(uy,ux);this.ph=rnd(0,TA);}
  update(dt){this.t+=dt;return this.t<this.T&&live();}
  draw(){const s=SCH(),k=this.t/this.T,[x,y]=P(this.x,this.y,0),w=14*s,hh=w*14/18;ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.rotate(this.rot);ctx.globalAlpha=Math.pow(1-k,.7)*Math.min(1,this.t/.08);ctx.drawImage(T.scorch,-w/2,-hh/2,w,hh);ctx.restore();
    const fk=1-this.t/1.05;if(fk>0)for(let i=0;i<2;i++){const h=(8-i*2.4)*s*Math.pow(fk,.8)*(1+.15*Math.sin(this.t*14+i*2+this.ph));sprB(ctx,T.flame,x+(i?3:-2.5)*s,y+(i?.8:-.6)*s,h*.56,h,Math.min(1,fk*1.6),i);}
    const ek=(this.t-.1)/1;if(ek>0&&ek<1)spr(ctx,T.spark,x+Math.sin(this.t*5+this.ph)*3*s,y-ek*34*s,5.4*s*(1-ek*.5),0,1,Math.pow(1-ek,.8));}}
class TrFrost{constructor(x,y,ux,uy,sd){this.layer='ground';this.__gt='-';this._aurT=1;this.x=x-uy*sd*4.5;this.y=y+ux*sd*4.5;this.t=0;this.T=1.9;this.rot=rnd(0,TA);}
  update(dt){this.t+=dt;return this.t<this.T&&live();}
  draw(){const s=SCH(),k=this.t/this.T,[x,y]=P(this.x,this.y,0),pop=Math.min(1,this.t/.14),sc=.55+.45*pop+.08*Math.sin(Math.min(1,this.t/.3)*Math.PI),w=12*s*sc;
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.rotate(this.rot);ctx.globalAlpha=Math.pow(1-k,.9)*pop;ctx.drawImage(T.fprint,-w/2,-w/2,w,w);ctx.restore();
    if(this.t<.4){const p=Math.sin(this.t/.4*Math.PI);spr(ctx,T.glint,x,y-3*s,7*s*p,0,1,p);}}}
let G=null,B0=null,B1=null,last=null,lastMap,stepSide=1;
function trail(){const au=AU[cur];if(!au.trail||!player||player.dead||(player.z||0)>2||QP()<.5){last=null;return;}
  const p={x:player.x,y:player.y};if(curMap!==lastMap){lastMap=curMap;last=p;return;}if(!last){last=p;return;}
  const dx=p.x-last.x,dy=p.y-last.y,d=Math.hypot(dx,dy);if(d>200){last=p;return;}if(d<au.step)return;
  last=p;stepSide=-stepSide;let n=0;for(const f of fx)if(f._aurT)n++;if(n>=18)return;au.trail(p.x,p.y,dx/d,dy/d,stepSide);}
class AuraKeeper{constructor(){this.layer='none';this.__gt='-';}
  update(){if(!live()||!player){last=null;return true;}
    if(!G||!fx.includes(G))G=addFx(new AuraGround());if(!B0||!fx.includes(B0))B0=addFx(new AuraBody(-1));if(!B1||!fx.includes(B1))B1=addFx(new AuraBody(1));
    trail();return true;}
  draw(){}}
addFx(new AuraKeeper());

/* ================================================================
   5. WARDROBE (small window, live preview)
   ================================================================ */
const css=document.createElement('style');css.textContent=`
#aurw{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(540px,95vw);max-height:94vh;overflow:auto;background:#f4ead6;border:3px solid #6a4a2a;border-radius:14px;padding:10px 12px;z-index:60;display:none;font:13px Sarabun,Tahoma,sans-serif;color:#3a2a1a;box-shadow:0 12px 32px rgba(0,0,0,.38)}
#aurw.open{display:block}#aurw h3{margin:0 0 7px;font-size:16px;display:flex;align-items:center;gap:8px}#aurw h3 small{font-weight:400;font-size:11.5px;color:#7a5a3a}
#aurw .au-row{display:flex;gap:10px;align-items:flex-start}#aurw .au-pvw{flex:none;display:flex;flex-direction:column;gap:5px;align-items:center}
#aurw canvas.au-pv{width:200px;height:222px;border-radius:11px;border:2px solid #b8986a;display:block}
#aurw .au-tb{display:flex;gap:4px;flex-wrap:wrap;justify-content:center}#aurw .au-tb button{padding:3px 8px;border-radius:7px;border:2px solid #b8986a;background:#fff8ea;cursor:pointer;font:inherit;font-size:12px}#aurw .au-tb button.au-on{border-color:#e07a1a;background:#ffe2b8}
#aurw .au-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;flex:1;align-content:start}
#aurw .au-it{border:2px solid #b8986a;border-radius:10px;background:#fff8ea;padding:5px 4px;cursor:pointer;text-align:center;font-size:12.5px;line-height:1.25}
#aurw .au-it.au-on{border-color:#e07a1a;background:#ffe2b8;box-shadow:0 0 0 2px rgba(224,122,26,.25)}#aurw .au-it.au-worn::after{content:'✔ สวมอยู่';display:block;font-size:10.5px;color:#2f7a3a}
#aurw .au-it canvas{width:86px;height:56px;display:block;margin:0 auto 3px}#aurw .au-it .au-en{font-size:10.5px;color:#8a6a4a}
#aurw .au-ds{margin-top:8px;min-height:36px;font-size:12.5px;line-height:1.4}#aurw .au-nt{font-size:11px;color:#8a6a4a;margin-top:3px}
#aurw .au-bar{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}#aurw button.au-b{padding:5px 14px;border-radius:8px;border:2px solid #6a4a2a;background:#ffd58a;cursor:pointer;font:inherit}
#aurw .au-tabs{display:flex;gap:6px;margin:0 0 8px}#aurw .au-tabs button{flex:1;padding:6px 4px;border-radius:9px;border:2px solid #b8986a;background:#fff8ea;font:inherit;font-weight:700;cursor:pointer;color:#5a3a1a}#aurw .au-tabs button.au-on{border-color:#e07a1a;background:#ffd58a}
#aurw .au-grid.au-g3{grid-template-columns:repeat(3,1fr)}#aurw .au-g3 .au-it canvas{width:64px;height:56px}#aurw .au-g3 .au-it{font-size:11.5px}
@media (max-height:560px){#aurw canvas.au-pv{width:150px;height:166px}#aurw .au-it canvas{width:64px;height:42px}#aurw .au-g3 .au-it canvas{width:46px;height:40px}#aurw .au-grid.au-g3{grid-template-columns:repeat(4,1fr);gap:5px}#aurw .au-g3 .au-it{padding:3px 2px;font-size:10.5px}#aurw .au-g3 .au-it .au-en{display:none}#aurw .au-ds{min-height:0;margin-top:5px}#aurw .au-tabs button{padding:3px 4px}#aurw h3 small{display:none}#aurw h3{margin-bottom:4px}#aurw .au-tabs{margin-bottom:5px}}
@media (max-width:460px){#aurw .au-row{flex-direction:column;align-items:stretch}#aurw .au-pvw{align-self:center}}`;
document.head.appendChild(css);
const win=document.createElement('div');win.id='aurw';document.body.appendChild(win);
win.addEventListener('pointerdown',e=>e.stopPropagation());
const DIRS=['S','SE','E','NE','N','NW','W','SW'],BGS=[['หญ้า',['#a9c98a','#86ad6c']],['หิมะ',['#f4f8fc','#d9e5ef']],['กลางคืน',['#2a3850','#151d2c']]];
let pv=null,pvC=null,tab='aura',dirI=1,bgI=0,pvT=null;   /* pv / pvC = what is being tried on (null = what is worn); tab 'aura' | 'comp' */
const CPX=()=>window.COMP||null;   /* fashion_companion.js: floating totem sprites, a 2nd tab in this window */
function heroDraw(g,X,Y,t){const d=DIRS[dirI],st='idle';let f=0;try{const D2=durs(st,d),Tt=D2.reduce((a,b)=>a+b,0);let ms=(t*1000)%Tt;while(f<D2.length-1&&ms>=D2[f]){ms-=D2[f];f++;}}catch(_){}
  const e={st,d,f},old=ctx;ctx=g;try{g.save();g.translate(X,Y);const PK=CHAR_SCALE/(window.HERO_K||1);g.scale(PK,PK);g.translate(-X,-Y);const FG=typeof drawGear==='function',pf=[typeof CHAR_FILTER!=='undefined'?CHAR_FILTER:'',FG&&typeof armorFilter==='function'?armorFilter():''].filter(Boolean).join(' ');
    if(FG)drawGear(e,X,Y,0,false);drawFrame(e,X,Y,1,null,pf?gradedFrame(e,pf):null);if(FG)drawGear(e,X,Y,1,false);g.restore();}catch(_){}finally{ctx=old;}}
function drawPv(){const c=win.querySelector('canvas.au-pv');if(!c||!win.classList.contains('open'))return;const dpr=Math.min(2,window.devicePixelRatio||1),cw=c.clientWidth||200,ch=c.clientHeight||222;
  if(c.width!==Math.round(cw*dpr)){c.width=Math.round(cw*dpr);c.height=Math.round(ch*dpr);}const g=c.getContext('2d');g.setTransform(1,0,0,1,0,0);
  const b=BGS[bgI][1];g.fillStyle=lin(g,0,0,0,c.height,[[0,b[0]],[1,b[1]]]);g.fillRect(0,0,c.width,c.height);
  const S=c.width/112,X=56,Y=ch/cw*112*.8,t=performance.now()/1000,s=SC();g.setTransform(S,0,0,S,0,0);
  g.save();g.translate(X,Y+1);g.scale(1,.33);g.fillStyle=rad(g,0,0,0,26,[[0,'rgba(16,12,22,.4)'],[1,'rgba(16,12,22,0)']]);g.beginPath();g.arc(0,0,26,0,TA);g.fill();g.restore();
  const k=pv===null?cur:pv,C=CPX(),kc=C?(pvC===null?C.cur:pvC):null,face=/W/.test(DIRS[dirI])?-1:1;
  const hero=()=>{if(C&&kc)C.drawAt(g,kc,X-face*36*s,Y-4*K,s,t,face);heroDraw(g,X,Y,t);};   /* the sprite floats beside the head, on the side away from the facing, a little behind */
  if(k)drawAt(g,k,X,Y,s,t,hero);else hero();}
function icon(c,k){const dpr=2,g=c.getContext('2d');c.width=86*dpr;c.height=56*dpr;g.setTransform(dpr,0,0,dpr,0,0);g.fillStyle=lin(g,0,0,0,56,[[0,'#eef3e6'],[1,'#d6e2c8']]);g.fillRect(0,0,86,56);
  if(k){g.save();g.translate(43,44);g.scale(.74,.74);drawAt(g,k,0,0,1,1.35);g.restore();}else{g.strokeStyle='#b8986a';g.lineWidth=2;g.setLineDash([4,4]);g.beginPath();g.ellipse(43,42,24,15,0,0,TA);g.stroke();}}
function iconC(c,k){const C=CPX(),dpr=2,g=c.getContext('2d');c.width=64*dpr;c.height=56*dpr;g.setTransform(dpr,0,0,dpr,0,0);g.fillStyle=lin(g,0,0,0,56,[[0,'#eef0fa'],[1,'#d8dcef']]);g.fillRect(0,0,64,56);
  if(k&&C){const cp=C.CP[k],im=C.img(k);if(!im){setTimeout(()=>{if(c.isConnected)iconC(c,k);},250);return;}C.paint(g,k,32,28,46/cp.h,.5,{fl:1});}
  else{g.strokeStyle='#b8986a';g.lineWidth=2;g.setLineDash([4,4]);g.beginPath();g.arc(32,28,17,0,TA);g.stroke();}}
function build(){const C=CPX(),isA=tab==='aura'||!C,selA=pv===null?cur:pv,curC=C?C.cur:null,selC=C?(pvC===null?curC:pvC):null;
  const keys=isA?['',...Object.keys(AU)]:['',...C.ORDER],sel=isA?selA:selC,worn=isA?cur:curC,name=k=>isA?AU[k].th:C.CP[k].th,en=k=>isA?AU[k].n:C.CP[k].land;
  const ds=isA?(selA&&AU[selA]?AU[selA].d:'ไม่ใส่ออร่า'):(selC&&C.CP[selC]?C.CP[selC].d:'ไม่มีภูตลอยตาม');
  win.innerHTML=`<h3>✨ แฟชั่นรอบตัว <small>ใส่ได้ทุกตัวละคร · แฟชั่นล้วน ไม่มีค่าสเตตัส</small></h3>
    ${C?`<div class="au-tabs"><button data-tab="aura" class="${isA?'au-on':''}">ออร่า</button><button data-tab="comp" class="${isA?'':'au-on'}">ภูตโทเท็ม (ลอยตาม)</button></div>`:''}
    <div class="au-row"><div class="au-pvw"><canvas class="au-pv"></canvas>
    <div class="au-tb"><button data-r="-1">⟲</button><button data-r="1">⟳</button>${BGS.map((q,i)=>`<button data-bg="${i}" class="${i===bgI?'au-on':''}">${q[0]}</button>`).join('')}</div></div>
    <div class="au-grid${isA?'':' au-g3'}">${keys.map(k=>`<div class="au-it${(k||null)===(sel||null)?' au-on':''}${(k||null)===(worn||null)?' au-worn':''}" data-k="${k}"><canvas></canvas><div>${k?name(k):'— ไม่ใส่ —'}</div>${k?`<div class="au-en">${en(k)}</div>`:''}</div>`).join('')}</div></div>
    <div class="au-ds">${ds}<div class="au-nt">${isA?'เดินแล้วจะมีรอยตามทาง':'ลอยข้างหัว ตามมาช้า ๆ หันตามทางที่เดิน · ภาพเดียวต่อตัว การเคลื่อนไหวและแสงทำด้วยโค้ด'}</div></div>
    <div class="au-bar"><button class="au-b" data-x="c">ยกเลิก</button><button class="au-b" data-x="w">สวมใส่</button></div>`;
  win.querySelectorAll('.au-it').forEach(el=>{const k=el.dataset.k;(isA?icon:iconC)(el.querySelector('canvas'),k);el.onclick=()=>{if(isA)pv=k||'';else pvC=k||'';build();};});
  win.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;build();});
  win.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{dirI=(dirI+8+(+b.dataset.r))%8;});
  win.querySelectorAll('[data-bg]').forEach(b=>b.onclick=()=>{bgI=+b.dataset.bg;build();});
  win.querySelector('[data-x="c"]').onclick=close;
  win.querySelector('[data-x="w"]').onclick=()=>{const k=pv===null?cur:(pv||null);wear(k);let kc=null;if(C){kc=pvC===null?C.cur:(pvC||null);C.wear(kc);}close();
    try{msg('แต่งตัวแล้ว · ออร่า: '+(k?AU[k].th:'ไม่ใส่')+(C?' · ภูต: '+(kc?C.CP[kc].th:'ไม่มี'):''));}catch(_){}};
  drawPv();}
function open(t){pv=null;pvC=null;if(typeof t==='string')tab=t;build();win.classList.add('open');clearInterval(pvT);pvT=setInterval(drawPv,40);}
function close(){win.classList.remove('open');clearInterval(pvT);pvT=null;pv=null;pvC=null;}
function wear(k){cur=k&&AU[k]?k:null;try{cur?localStorage.setItem(KEY,cur):localStorage.removeItem(KEY);}catch(_){}}
{const panel=document.getElementById('chsel');if(panel){const b=document.createElement('button');b.className='rob';b.id='aurabtn';b.textContent='✨ ออร่า · ภูตโทเท็ม (Alt+A)';b.style.cssText='margin:6px 0 2px;width:100%';b.onclick=open;panel.after(b);}}
addEventListener('keydown',e=>{if(e.altKey&&!e.ctrlKey&&!e.metaKey&&e.code==='KeyA'){e.preventDefault();win.classList.contains('open')?close():open();}});
window.AURA={AU,T,get cur(){return cur;},wear,open,close,drawAt,drawFloor};
})();
