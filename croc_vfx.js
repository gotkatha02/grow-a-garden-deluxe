/* =========================================================================
   CROCODILE — SVG VFX pass (Aztec reach fighter: obsidian spear, fangs, tail, mud)
   Palette: obsidian black, bronze, gold, bone, amber, jade, river water, mud.
   Every skill gets its own SIGNATURE element (read from its name / concept) so no two
   skills look alike. Families keep a colour identity:
     Lancer (spear)  → bronze / gold / obsidian
     Predator (maw)  → jade / amber / obsidian jaws
     River (lunge, ambush, roll) → teal water + mud
   Loaded after svg_vfx.js / vfx_rework.js. Inert for the other characters.
   ========================================================================= */
(function(){
if(typeof CHAR==='undefined'||CHAR!=='croc'||!window.svgRegister||!/[?&]vfx3=0/.test(location.search))return;   /* 2026-11-21: only for the old look (?vfx3=0); croc_vfx3.js + croc_art.js are the default */
const XL=window.SVG_XL,deg=Math.PI/180;
const pt=(cx,cy,r,a)=>[(cx+Math.cos(a*deg)*r).toFixed(1),(cy+Math.sin(a*deg)*r).toFixed(1)];
const scr=phi=>Math.atan2(Math.sin(phi)*K,Math.cos(phi));
const AK=()=>player.action&&player.action.key||'';
const ez=e=>(e.boss?40:26);

/* =================== ART =================== */

/* ---- Aztec glyph crocodile jaws (Cipactli style) in three palettes ----
   jade = default bite · amber = savage / finishing bites · obsidian = crushing bites.  Hinge at (24,64), bite centre x≈140. */
const JAWPAL={jade:{t:'#5ad0a0',b:'#1f6a4c',o:'#e8b44a',ta:.62,ba:.5},amber:{t:'#ffd27a',b:'#c8862e',o:'#fff0c8',ta:.7,ba:.6},obsidian:{t:'#5a5248',b:'#0e0c0a',o:'#e8b44a',ta:.9,ba:.85}};
const jawDefs=p=>`<defs>
  <linearGradient id="jd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.t}" stop-opacity="${p.ta}"/><stop offset="1" stop-color="${p.b}" stop-opacity="${p.ba}"/></linearGradient>
  <linearGradient id="jl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.b}" stop-opacity="${p.ba}"/><stop offset="1" stop-color="${p.t}" stop-opacity="${p.ta}"/></linearGradient>
  <linearGradient id="tt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f0e2c0"/></linearGradient>
  <filter id="gl" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="3"/></filter></defs>`;
for(const v in JAWPAL){const p=JAWPAL[v];
  svgRegister('jaw_up_'+v,{w:256,h:128,svg:()=>{
    const body='M24 64 L24 42 L40 32 L72 26 L104 28 L112 34 L150 36 L156 42 L196 46 L222 52 L238 58 L240 64Z';
    let teeth='';for(let x=56;x<=222;x+=15){const h=x>200?10:x<80?9:13;teeth+=`<path d="M${x} 63 L${x+5.5} ${63+h} L${x+11} 63Z"/>`;}
    let scute='';for(const [x,y] of [[60,27],[88,26],[126,33],[170,41],[206,48]])scute+=`<path d="M${x-5} ${y} L${x} ${y-6} L${x+5} ${y} L${x} ${y+3}Z"/>`;
    return `<svg ${XL} width="256" height="128" viewBox="0 0 256 128">${jawDefs(p)}
    <path d="${body}" fill="#ffb030" opacity=".35" filter="url(#gl)"/>
    <g fill="url(#tt)" stroke="#2a1e10" stroke-width="1.4" stroke-linejoin="round">${teeth}</g>
    <path d="${body}" fill="url(#jd)" stroke="#1a1208" stroke-width="5" stroke-linejoin="round"/>
    <path d="${body}" fill="none" stroke="${p.o}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M30 60 L238 60" stroke="#1a1612" stroke-opacity=".65" stroke-width="4"/>
    <path d="M44 40 L96 33 M116 40 L190 50" stroke="#fff4d8" stroke-opacity=".55" stroke-width="1.5" stroke-linecap="round"/>
    <g fill="#e8b44a" stroke="#5a3a10" stroke-width=".8">${scute}</g>
    <circle cx="58" cy="44" r="9.5" fill="#1a1612" stroke="${p.o}" stroke-width="2.4"/><circle cx="60" cy="44" r="3.6" fill="#ffb030"/>
    <path d="M46 52 Q58 58 70 52" fill="none" stroke="${p.o}" stroke-width="1.6"/></svg>`;}});
  svgRegister('jaw_low_'+v,{w:256,h:128,svg:()=>{
    const body='M24 64 L24 84 L44 92 L96 94 L104 88 L160 86 L166 80 L214 74 L234 68 L236 64Z';
    let teeth='';for(let x=62;x<=214;x+=15){const h=x>196?8:11;teeth+=`<path d="M${x} 65 L${x+5.5} ${65-h} L${x+11} 65Z"/>`;}
    return `<svg ${XL} width="256" height="128" viewBox="0 0 256 128">${jawDefs(p)}
    <path d="${body}" fill="#ffb030" opacity=".3" filter="url(#gl)"/>
    <g fill="url(#tt)" stroke="#2a1e10" stroke-width="1.4" stroke-linejoin="round">${teeth}</g>
    <path d="${body}" fill="url(#jl)" stroke="#1a1208" stroke-width="5" stroke-linejoin="round"/>
    <path d="${body}" fill="none" stroke="${p.o}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M30 68 L232 68" stroke="#1a1612" stroke-opacity=".6" stroke-width="4"/>
    <path d="M48 86 L98 88 M110 83 L186 77" stroke="#fff4d8" stroke-opacity=".4" stroke-width="1.4" stroke-linecap="round"/></svg>`;}});}

/* ---- obsidian shards flying along +x from the hit point (origin x=24) — basic spear hits ---- */
svgRegister('obsidian_burst',{w:160,h:128,svg:()=>{
  const S=[[-30,40,9],[-14,70,13],[0,104,15],[12,62,10],[26,92,12],[38,48,8],[-40,86,10],[6,34,7],[20,128,8]];let sh='',jd='',sp='';
  S.forEach(([a,r,s],i)=>{const [x,y]=pt(24,64,r,a),rot=a+(i%2?25:-20),p=[[s*1.3,0],[-s*.4,-s*.55],[-s*.9,s*.1],[-s*.2,s*.6]].map(([u,v])=>{const c=Math.cos(rot*deg),n=Math.sin(rot*deg);return `${(+x+u*c-v*n).toFixed(1)},${(+y+u*n+v*c).toFixed(1)}`;}).join(' ');
    const [ex,ey]=p.split(' ')[0].split(','),[fx,fy]=p.split(' ')[1].split(',');
    (i===2||i===6?(jd+=`<polygon points="${p}"/>`):(sh+=`<polygon points="${p}"/>`));sh+=`<path d="M${ex} ${ey} L${fx} ${fy}" stroke="#fff4d8" stroke-opacity=".7" stroke-width=".9" fill="none"/>`;});
  for(const [a,r0,r1] of [[-22,20,58],[8,24,74],[30,18,52],[-6,30,90]]){const [x0,y0]=pt(24,64,r0,a),[x1,y1]=pt(24,64,r1,a);sp+=`<path d="M${x0} ${y0} L${x1} ${y1}"/>`;}
  return `<svg ${XL} width="160" height="128" viewBox="0 0 160 128"><defs>
  <linearGradient id="o" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a423a"/><stop offset=".5" stop-color="#1a1612"/><stop offset="1" stop-color="#0a0806"/></linearGradient>
  <linearGradient id="j" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5aa888"/><stop offset="1" stop-color="#1a2a22"/></linearGradient>
  <linearGradient id="s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd27a" stop-opacity="0"/><stop offset="1" stop-color="#ffe6a8" stop-opacity=".9"/></linearGradient>
  <radialGradient id="h" cx=".15" cy=".5" r=".35"><stop offset="0" stop-color="#ffd8a0" stop-opacity=".5"/><stop offset="1" stop-color="#ffd8a0" stop-opacity="0"/></radialGradient></defs>
  <rect width="160" height="128" fill="url(#h)"/>
  <g stroke="url(#s)" stroke-width="1.6" stroke-linecap="round" fill="none">${sp}</g>
  <g fill="url(#o)" stroke="#c8862e" stroke-width="1.1" stroke-linejoin="round">${sh}</g>
  <g fill="url(#j)" stroke="#e8b44a" stroke-width="1" stroke-linejoin="round">${jd}</g></svg>`;}});

/* ---- pierce streaks: bronze-gold (spear) and jade (lunge) ---- */
const streak=(c0,c1,c2,glow)=>()=>`<svg ${XL} width="192" height="40" viewBox="0 0 192 40"><defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c0}" stop-opacity="0"/><stop offset=".55" stop-color="${c1}" stop-opacity=".75"/><stop offset="1" stop-color="${c2}" stop-opacity=".95"/></linearGradient>
  <filter id="b"><feGaussianBlur stdDeviation="2"/></filter></defs>
  <path d="M0 18 L150 13 L188 20 L150 27 L0 22Z" fill="${glow}" opacity=".35" filter="url(#b)"/>
  <path d="M0 18.6 L150 15 L186 20 L150 25 L0 21.4Z" fill="url(#g)"/>
  <path d="M40 20 L170 20" stroke="#1a1612" stroke-opacity=".55" stroke-width="1.2"/>
  <path d="M176 13 L181 20 L176 27 L171 20Z" fill="#ffffff" stroke="${c1}" stroke-width="1"/></svg>`;
svgRegister('spear_streak',{w:192,h:40,svg:streak('#c8862e','#e8b44a','#fff4d8','#ffb030')});
svgRegister('jade_streak',{w:192,h:40,svg:streak('#1f6a4c','#3ac890','#e8fff4','#3ac890')});

/* ---- SERPENT THRUST: a jade serpent striking along the thrust (head at the right) ---- */
svgRegister('serpent_wave',{w:192,h:64,svg:()=>{const path='M6 32 C30 10 48 54 76 32 S122 10 150 32 L176 32';
  return `<svg ${XL} width="192" height="64" viewBox="0 0 192 64"><defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3ac890" stop-opacity="0"/><stop offset=".4" stop-color="#3ac890" stop-opacity=".8"/><stop offset="1" stop-color="#9ff0c8"/></linearGradient>
  <filter id="b"><feGaussianBlur stdDeviation="2.2"/></filter></defs>
  <path d="${path}" fill="none" stroke="#3ac890" stroke-opacity=".4" stroke-width="12" filter="url(#b)" stroke-linecap="round"/>
  <path d="${path}" fill="none" stroke="#123a2a" stroke-width="9" stroke-linecap="round"/>
  <path d="${path}" fill="none" stroke="url(#g)" stroke-width="6" stroke-linecap="round"/>
  <path d="${path}" fill="none" stroke="#e8b44a" stroke-width="2" stroke-dasharray="2.5 6" stroke-linecap="round"/>
  <path d="M168 24 L190 32 L168 40 L172 32Z" fill="#9ff0c8" stroke="#123a2a" stroke-width="1.6" stroke-linejoin="round"/>
  <circle cx="176" cy="30" r="1.8" fill="#ffb030"/></svg>`;}});

/* ---- PIERCING FINISH: small Aztec sun disc flaring behind the target ---- */
svgRegister('sun_burst',{w:128,h:128,svg:()=>{let rays='';for(let i=0;i<16;i++){const a=i*22.5,L=i%2?46:60,[x,y]=pt(64,64,L,a),[l1,l2]=pt(64,64,30,a-6),[r1,r2]=pt(64,64,30,a+6);rays+=`<polygon points="${l1},${l2} ${x},${y} ${r1},${r2}"/>`;}
  let step='';for(let i=0;i<8;i++){const a=i*45+22.5,[x,y]=pt(64,64,24,a);step+=`<rect x="${(+x-3).toFixed(1)}" y="${(+y-3).toFixed(1)}" width="6" height="6" transform="rotate(${a} ${x} ${y})"/>`;}
  return `<svg ${XL} width="128" height="128" viewBox="0 0 128 128"><defs>
  <radialGradient id="r"><stop offset=".3" stop-color="#fff0c8" stop-opacity=".9"/><stop offset="1" stop-color="#e8b44a" stop-opacity=".25"/></radialGradient></defs>
  <g fill="url(#r)" stroke="#8a5a14" stroke-opacity=".6" stroke-width="1">${rays}</g>
  <circle cx="64" cy="64" r="28" fill="#c8862e" fill-opacity=".55" stroke="#ffe6a8" stroke-width="2.2"/>
  <g fill="#1a1612" fill-opacity=".6">${step}</g>
  <circle cx="64" cy="64" r="13" fill="#ffd27a" stroke="#8a5a14" stroke-width="1.6"/><circle cx="64" cy="64" r="5" fill="#fff4d8"/></svg>`;}});

/* ---- SPEAR HOOK: bronze hook — the barb sits on the target, the shaft points back to the croc (+x) ---- */
svgRegister('hook_arc',{w:160,h:128,svg:()=>{const p='M152 34 L64 34 Q26 34 26 64 Q26 96 58 96 L74 96';
  return `<svg ${XL} width="160" height="128" viewBox="0 0 160 128"><defs>
  <linearGradient id="g" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#c8862e" stop-opacity="0"/><stop offset=".4" stop-color="#c8862e"/><stop offset="1" stop-color="#ffe6a8"/></linearGradient></defs>
  <path d="${p}" fill="none" stroke="#2a1a0c" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".8"/>
  <path d="${p}" fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M70 86 L92 96 L70 106 Z" fill="#1a1612" stroke="#e8b44a" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M40 46 Q32 60 36 76" fill="none" stroke="#fff4d8" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/></svg>`;}});

/* ---- RIPPING BITE: three tearing claw streaks (amber core, jade edge) ---- */
svgRegister('claw_tear',{w:128,h:128,svg:()=>{let s='';for(let i=0;i<3;i++){const o=(i-1)*20;s+=`<path d="M${30+o} ${22-o*.2} Q${60+o} ${60} ${94+o} ${106+o*.2} Q${66+o} ${62} ${30+o} ${22-o*.2}Z"/>`;}
  return `<svg ${XL} width="128" height="128" viewBox="0 0 128 128"><defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3ac890" stop-opacity=".2"/><stop offset=".5" stop-color="#ffd27a"/><stop offset="1" stop-color="#3ac890" stop-opacity=".1"/></linearGradient>
  <filter id="b"><feGaussianBlur stdDeviation="1.8"/></filter></defs>
  <g fill="#ffb030" opacity=".45" filter="url(#b)">${s}</g><g fill="url(#g)" stroke="#2a1e10" stroke-opacity=".7" stroke-width="1.2">${s}</g></svg>`;}});

/* ---- JAW LOCK: stepped Aztec lock glyph clamped around the target ---- */
svgRegister('lock_glyph',{w:128,h:128,svg:()=>{const step=(r)=>{let p='';const pts=[];for(let s=0;s<4;s++){const a=s*90;for(const [u,v] of [[-r,-r],[-r*.4,-r],[-r*.4,-r*1.12],[r*.4,-r*1.12],[r*.4,-r]]){const c=Math.cos(a*deg),n=Math.sin(a*deg);pts.push(`${(64+u*c-v*n).toFixed(1)},${(64+u*n+v*c).toFixed(1)}`);}}return pts.join(' ');};
  return `<svg ${XL} width="128" height="128" viewBox="0 0 128 128">
  <polygon points="${step(46)}" fill="none" stroke="#1a1208" stroke-width="7" stroke-linejoin="round"/>
  <polygon points="${step(46)}" fill="none" stroke="#e8b44a" stroke-width="3.4" stroke-linejoin="round"/>
  <polygon points="${step(30)}" fill="none" stroke="#3ac890" stroke-opacity=".8" stroke-width="2.4" stroke-linejoin="round"/>
  <g fill="#e8b44a" stroke="#1a1208" stroke-width="1"><rect x="60" y="8" width="8" height="10"/><rect x="60" y="110" width="8" height="10"/><rect x="8" y="60" width="10" height="8"/><rect x="110" y="60" width="10" height="8"/></g></svg>`;}});

/* ---- FRACTURE POINT: a round Aztec shield glyph (chimalli) on the target, splitting with black cracks ---- */
svgRegister('fracture_glyph',{w:128,h:128,svg:()=>`<svg ${XL} width="128" height="128" viewBox="0 0 128 128"><defs>
  <radialGradient id="g"><stop offset="0" stop-color="#5ad0a0" stop-opacity=".55"/><stop offset="1" stop-color="#1f6a4c" stop-opacity=".45"/></radialGradient></defs>
  <circle cx="64" cy="64" r="44" fill="url(#g)" stroke="#1a1208" stroke-width="6"/><circle cx="64" cy="64" r="44" fill="none" stroke="#e8b44a" stroke-width="3"/>
  <path d="M64 22 V106 M22 64 H106" stroke="#e8b44a" stroke-opacity=".7" stroke-width="2"/>
  <g fill="#e8b44a" stroke="#1a1208" stroke-width=".8"><circle cx="44" cy="44" r="4"/><circle cx="84" cy="44" r="4"/><circle cx="44" cy="84" r="4"/><circle cx="84" cy="84" r="4"/></g>
  <path d="M60 30 L70 48 L58 60 L72 74 L62 92 L70 108 M70 48 L88 40 M58 60 L36 62 M72 74 L94 82" fill="none" stroke="#120e0a" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M60 30 L70 48 L58 60 L72 74 L62 92" fill="none" stroke="#ffb030" stroke-width="1" stroke-linejoin="round"/></svg>`});

/* ---- TEMPLE EXECUTION: a stepped temple glyph that drops onto the target ---- */
svgRegister('temple_glyph',{w:128,h:128,svg:()=>`<svg ${XL} width="128" height="128" viewBox="0 0 128 128"><defs>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3530" stop-opacity=".85"/><stop offset="1" stop-color="#0e0c0a" stop-opacity=".75"/></linearGradient></defs>
  <path d="M14 112 H114 V98 H104 V84 H92 V70 H80 V56 H48 V70 H36 V84 H24 V98 H14Z" fill="url(#g)" stroke="#1a1208" stroke-width="5" stroke-linejoin="round"/>
  <path d="M14 112 H114 V98 H104 V84 H92 V70 H80 V56 H48 V70 H36 V84 H24 V98 H14Z" fill="none" stroke="#e8b44a" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M52 56 V36 H76 V56" fill="#c8862e" fill-opacity=".7" stroke="#e8b44a" stroke-width="2.2"/><path d="M48 36 L64 22 L80 36Z" fill="#e8b44a" stroke="#1a1208" stroke-width="1.6"/>
  <path d="M58 112 V96 H70 V112" fill="#1a1612" stroke="#e8b44a" stroke-width="1.6"/><path d="M28 104 H100" stroke="#ffe6a8" stroke-opacity=".5" stroke-width="1.4"/></svg>`});

/* ---- OBSIDIAN EDGE: a black-glass blade edge with bronze rim (shows on the spear while the buff starts) ---- */
svgRegister('obsidian_cut',{w:192,h:96,svg:()=>`<svg ${XL} width="192" height="96" viewBox="0 0 192 96"><defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a423a" stop-opacity="0"/><stop offset=".5" stop-color="#2a2420"/><stop offset="1" stop-color="#0a0806"/></linearGradient></defs>
  <path d="M8 60 Q96 6 184 44 Q100 30 8 60Z" fill="url(#g)" stroke="#c8862e" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M40 46 Q110 22 170 42" fill="none" stroke="#3ac890" stroke-opacity=".7" stroke-width="1.6"/>
  <path d="M60 40 Q120 22 176 42" fill="none" stroke="#ffffff" stroke-opacity=".75" stroke-width="1.2"/></svg>`});

/* ---- scaly tail arc on the ground plane (upper arc, -160°..-20°) ---- */
svgRegister('tail_sweep',{w:256,h:256,svg:()=>{
  const [sx,sy]=pt(128,128,96,-160),[ex,ey]=pt(128,128,96,-20);let sc='',dots='';
  for(let a=-150;a<=-34;a+=9){const t=(a+160)/140,h=3+t*3.5,[x1,y1]=pt(128,128,96+5*t,a-2),[x2,y2]=pt(128,128,96+5*t+h,a),[x3,y3]=pt(128,128,96+5*t,a+2.5);sc+=`<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}"/>`;}
  for(let i=0;i<7;i++){const [x,y]=pt(128,128,112+(i%3)*6,-24+i*3.5);dots+=`<circle cx="${x}" cy="${y}" r="${(2.6-(i%3)*.6).toFixed(1)}"/>`;}
  return `<svg ${XL} width="256" height="256" viewBox="0 0 256 256"><defs>
  <linearGradient id="t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a6a3a" stop-opacity="0"/><stop offset=".35" stop-color="#5a6a3a" stop-opacity=".85"/><stop offset="1" stop-color="#7a8a4a"/></linearGradient>
  <linearGradient id="u" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".35"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>
  <path d="M${sx} ${sy} A96 96 0 0 1 ${ex} ${ey} A120 120 0 0 0 ${sx} ${sy}Z" fill="rgba(40,30,18,.35)" transform="translate(2 5)"/>
  <path d="M${sx} ${sy} A96 96 0 0 1 ${ex} ${ey} A120 120 0 0 0 ${sx} ${sy}Z" fill="url(#t)" stroke="#1a1610" stroke-opacity=".8" stroke-width="1.6"/>
  <path d="M${sx} ${sy} A100 100 0 0 1 ${ex} ${ey}" fill="none" stroke="url(#u)" stroke-width="3"/>
  <g fill="#c8962e" fill-opacity=".7" stroke="#3a2a10" stroke-opacity=".6" stroke-width=".7">${sc}</g>
  <g fill="#6b4a2a" stroke="#3a2a18" stroke-width=".6">${dots}</g></svg>`;}});

/* ---- splash crowns: mud (heavy body) and river water (lunge / ambush / drag) ---- */
const crown=(pA,pB,pC,base,drop,glint)=>()=>{let pet='',drops='';const n=7;
  for(let i=0;i<n;i++){const a=-90+(i-(n-1)/2)*22,L=i%2?38:52,w=5.5,[tx,ty]=pt(80,96,L,a),[lx,ly]=pt(80,96,w,a-90),[rx,ry]=pt(80,96,w,a+90),[cx1,cy1]=pt(80,96,L*.55,a-5),[cx2,cy2]=pt(80,96,L*.55,a+5);
    pet+=`<path d="M${lx} ${ly} Q${cx1} ${cy1} ${tx} ${ty} Q${cx2} ${cy2} ${rx} ${ry}Z"/>`;const [dx,dy]=pt(80,96,L+9+(i%3)*4,a+(i%2?4:-4));drops+=`<circle cx="${dx}" cy="${dy}" r="${(2.8-(i%3)*.5).toFixed(1)}"/>`;}
  return `<svg ${XL} width="160" height="112" viewBox="0 0 160 112"><defs>
  <linearGradient id="p" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${pA}"/><stop offset=".6" stop-color="${pB}"/><stop offset="1" stop-color="${pC}" stop-opacity=".8"/></linearGradient>
  <radialGradient id="m"><stop offset="0" stop-color="${base}" stop-opacity=".75"/><stop offset="1" stop-color="${base}" stop-opacity="0"/></radialGradient></defs>
  <ellipse cx="80" cy="96" rx="44" ry="13" fill="url(#m)"/>
  <g fill="url(#p)" stroke="#2a1e10" stroke-opacity=".8" stroke-width=".9">${pet}</g>
  <g fill="${drop}" stroke="#2a1e10" stroke-opacity=".6" stroke-width=".6">${drops}</g>
  <g fill="${glint}" opacity=".9"><circle cx="70" cy="70" r="1.6"/><circle cx="92" cy="62" r="1.3"/><circle cx="80" cy="80" r="1.1"/></g></svg>`;};
svgRegister('mud_crown',{w:160,h:112,svg:crown('#4a3a24','#8a6a44','#a8c8b0','#6b4a2a','#6b4a2a','#cfeee0')});
svgRegister('water_crown',{w:160,h:112,svg:crown('#1f5a5a','#4ab0a0','#e8fff8','#2a7a74','#7fd8c8','#ffffff')});

/* ---- DEATH ROLL: three mud/water comma strokes spinning around the body (not a ring) ---- */
svgRegister('roll_swirl',{w:192,h:192,svg:()=>{let s='';for(let i=0;i<3;i++){const a0=i*120,[x0,y0]=pt(96,96,40,a0),[x1,y1]=pt(96,96,86,a0+80),[cx,cy]=pt(96,96,88,a0+20);s+=`<path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}"/>`;}
  return `<svg ${XL} width="192" height="192" viewBox="0 0 192 192">
  <g fill="none" stroke-linecap="round"><g stroke="#3a2a18" stroke-opacity=".55" stroke-width="13">${s}</g><g stroke="#8a6a44" stroke-opacity=".85" stroke-width="7">${s}</g><g stroke="#cfeee0" stroke-opacity=".75" stroke-width="2">${s}</g></g></svg>`;}});

/* =================== EFFECTS =================== */

/* ---- bites: Aztec glyph jaws, palette by skill ---- */
const JAW_OF={cbJaw:'amber',cbFrenzy:'amber',cbRoll:'amber',cbSnap:'obsidian',ccAwaken:'amber'};
const _JS=JawSnap;
JawSnap=class extends _JS{
  constructor(o){super(o);this.ak=this.key||AK();this.pal=JAW_OF[this.ak]||'jade';}
  draw(){const up=svgImg('jaw_up_'+this.pal),lo=svgImg('jaw_low_'+this.pal);if(!up||!lo)return;
    const e=this.e,[cx,cy]=P(e.x,e.y,ez(e)),S=(e.r+14)*.95*Math.min(1.3,this.sc),
      k=Math.min(1,this.t/this.close),after=Math.max(0,this.t-this.close),hold=.1,rest=Math.max(.06,this.life-this.close-hold),
      fade=after<hold?0:Math.min(1,(after-hold)/rest),
      ang=.62*(1-eIn(k))-.05*Math.sin(Math.min(1,after/.1)*Math.PI)+.18*eIn(fade),
      a=(this.t<.04?this.t/.04:1)*(1-fade),sc=S*3.3/256*(1+.06*Math.sin(Math.min(1,after/.12)*Math.PI));
    if(a<=0)return;
    ctx.save();ctx.translate(cx,cy);ctx.scale(this.side*sc,sc);ctx.translate(-140,0);ctx.globalAlpha=a;
    ctx.save();ctx.translate(24,0);ctx.rotate(ang);ctx.drawImage(lo,-24,-64);ctx.restore();
    ctx.save();ctx.translate(24,0);ctx.rotate(-ang);ctx.drawImage(up,-24,-64);ctx.restore();
    if(this.hit&&after<.1){const f=1-after/.1;ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(150,0,0,150,0,70);g.addColorStop(0,`rgba(255,236,190,${.65*f})`);g.addColorStop(1,'rgba(255,176,48,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(150,0,90,26,0,0,TAU);ctx.fill();}
    ctx.restore();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    if(this.hit&&!this.sig){this.sig=true;this.signature(e);}}
  /* per-skill extra at the moment the jaws close */
  signature(e){const z=ez(e),side=this.side;
    for(let i=0;i<qn(4);i++)emit({type:'shard',x:e.x,y:e.y,z,vx:rnd(-90,90),vy:rnd(-30,30),vz:rnd(60,140),g:520,drag:1.4,life:rnd(.35,.6),size:rnd(1.6,2.6),color:Math.random()<.7?CRC.obs:CRC.bronze,vr:rnd(-12,12)});
    if(this.ak==='cbRip')svgFx('claw_tear',{x:e.x,y:e.y,z:z+4,s:.42,flip:side,life:.5,grow:[.5,1.05],growT:.08,fadeOut:.6});
    if(this.ak==='cbLock')svgFx('lock_glyph',{follow:e,z,s:.42,life:1.3,grow:[1.4,1],growT:.14,spin:.6,fadeOut:.35,squash:.8});
    if(this.ak==='cbSnap')svgFx('fracture_glyph',{x:e.x,y:e.y,z,s:.36,life:.6,grow:[.6,1.05],growT:.08,fadeOut:.5});}
  marks(){}};

/* ---- spear hits: signature per skill ---- */
const _bh=bronzeHit;bronzeHit=function(e,phi,big){_bh(e,phi,big);const z=ez(e),k=AK(),r=scr(phi);
  if(k==='caSerpent'){svgFx('serpent_wave',{x:e.x,y:e.y,z,s:.5,ax:.95,rot:r,life:.36,grow:[.5,1],growT:.1,fadeOut:.55});if(big)svgFx('obsidian_burst',{x:e.x,y:e.y,z,s:.4,ax:.15,rot:r,life:.4,grow:[.45,1.05],growT:.12,fadeOut:.55});return;}
  if(k==='caLongFang'){svgFx('spear_streak',{x:e.x,y:e.y,z,s:.95,ax:.7,rot:r,life:.32,grow:[.7,1.1],growT:.08,fadeOut:.6});svgFx('obsidian_burst',{x:e.x,y:e.y,z,s:.28,ax:.15,rot:r,life:.35});return;}
  svgFx('obsidian_burst',{x:e.x,y:e.y,z,s:big?.5:.36,ax:.15,rot:r,life:big?.5:.4,grow:[.45,1.05],growT:.12,fadeIn:.02,fadeOut:.55});
  if(big)svgFx('spear_streak',{x:e.x,y:e.y,z,s:.62,rot:r,life:.3,grow:[.6,1.1],growT:.08,fadeOut:.6});
  if(k==='caFinish')svgFx('sun_burst',{x:e.x,y:e.y,z:z+6,s:.62,life:.55,grow:[.3,1],growT:.14,spin:.8,fadeOut:.5});};

/* ---- skills that do not go through bronzeHit / JawSnap: hook their action at contact ---- */
const hook=(k,f)=>{const sk=SKILLS[k];if(!sk||!sk.make)return;const mk=sk.make;sk.make=function(c){const a=mk(c);if(a){a.events=a.events||[];try{f(a,c||{});}catch(err){}}return a;};};
const at=(a,t,f)=>a.events.push({t:Math.max(.005,t),f});
const firstHit=(a,c)=>(a.hitList||[]).find(e=>!e.dead)||(c.target&&!c.target.dead?c.target:null);
hook('caHook',(a,c)=>at(a,(a.windup||0)+.01,()=>{const e=firstHit(a,c);if(!e)return;svgFx('hook_arc',{follow:e,z:ez(e),s:.46,ax:.2,rot:scr(Math.atan2(player.y-e.y,player.x-e.x)),life:.5,grow:[.6,1],growT:.1,fadeOut:.5});}));
hook('caImpale',(a,c)=>at(a,(a.windup||0)+.01,()=>{const e=firstHit(a,c);if(!e)return;const phi=angTo(e);
  svgFx('spear_streak',{x:e.x,y:e.y,z:ez(e),s:1.05,ax:.35,rot:scr(phi),life:.36,grow:[.5,1.1],growT:.08,fadeOut:.6});
  svgFx('obsidian_burst',{x:e.x+Math.cos(phi)*20,y:e.y+Math.sin(phi)*20,z:ez(e),s:.62,ax:.12,rot:scr(phi),life:.5,grow:[.4,1.1],growT:.12,fadeOut:.55});}));
hook('caExecution',(a,c)=>{const e=c.target&&!c.target.dead?c.target:null;const tw=a.windup||.3;
  at(a,Math.max(.02,tw-.26),()=>{const t=firstHit(a,c)||e;if(!t)return;svgFx('temple_glyph',{follow:t,z:ez(t)+70,drift:64,s:.5,life:.3,grow:[.8,1],growT:.1,fadeIn:.06,fadeOut:.08});});
  at(a,tw+.01,()=>{const t=firstHit(a,c)||e;if(!t)return;svgFx('temple_glyph',{x:t.x,y:t.y,z:ez(t)+6,s:.5,life:.45,grow:[1,1.12],growT:.3,fadeIn:.01,fadeOut:.7});svgFx('sun_burst',{x:t.x,y:t.y,z:ez(t)+4,s:.5,life:.45,grow:[.4,1],growT:.12,fadeOut:.5});});});
hook('caFracture',(a,c)=>at(a,(a.windup||0)+.02,()=>{const e=firstHit(a,c);if(!e)return;svgFx('fracture_glyph',{follow:e,z:ez(e),s:.4,life:.8,grow:[.7,1],growT:.1,fadeOut:.4});}));
hook('caCrescent',(a,c)=>at(a,Math.max(.01,(a.windup||0)-.04),()=>{if(typeof TexArc==='function')addFx(new TexArc({x:player.x,y:player.y,z:24,R:CR_BAL.spear*.9,mid:player.phi,dir:1,pal:'bronze',life:.45,sweep:.1,squash:.55}));}));
hook('caEdge',(a)=>at(a,Math.max(.02,(a.windup||.2)),()=>svgFx('obsidian_cut',{follow:player,z:30*(typeof CHAR_SCALE==='number'?CHAR_SCALE:1),s:.42,ax:.3,rot:scr(player.phi),flip:1,life:.6,grow:[.6,1],growT:.12,fadeOut:.5})));
for(const k of ['cbLunge','cbAmbush'])hook(k,(a,c)=>{const t0=a.windup||.24;
  at(a,Math.max(.01,t0-.02),()=>svgFx('jade_streak',{x:player.x,y:player.y,z:18,s:.7,ax:.95,rot:scr(player.phi),life:.3,grow:[.6,1],growT:.06,fadeOut:.7}));
  at(a,t0+.02,()=>{const e=firstHit(a,c);const x=e?e.x:player.x,y=e?e.y:player.y;svgFx('water_crown',{x,y,z:0,s:k==='cbAmbush'?.46:.38,ay:.86,layer:'sorted',sortOff:3,life:.6,grow:[.3,1],growT:.12,fadeOut:.55});});});
hook('cbDrag',(a,c)=>at(a,(a.windup||0)+.04,()=>{const e=firstHit(a,c);if(!e)return;svgFx('water_crown',{x:e.x,y:e.y,z:0,s:.34,ay:.86,layer:'sorted',sortOff:3,life:.55,grow:[.3,1],growT:.1,fadeOut:.55});}));
hook('cbTailBreaker',(a)=>at(a,(a.windup||.3)+.02,()=>{const an=player.phi+Math.PI;svgFx('mud_crown',{x:player.x+Math.cos(an)*70,y:player.y+Math.sin(an)*70,z:0,s:.46,ay:.86,layer:'sorted',sortOff:3,life:.6,grow:[.3,1],growT:.1,fadeOut:.55});}));

/* ---- tail swipe: scaly olive tail arc ---- */
const _TA=TailArc;
TailArc=class extends _TA{
  draw(){const im=svgImg('tail_sweep');if(!im)return;const k=Math.min(1,this.t/(this.life*.6)),a=(this.t>this.life*.6?1-(this.t-this.life*.6)/(this.life*.4):Math.min(1,this.t/.05))*.95,
      dir=Math.sign(this.to-this.from)||1,mid=this.base+(this.from+this.to)/2,sweep=Math.abs(this.to-this.from),W=256*this.R/96*(.9+.1*eOut(k)),[x,y]=P(player.x,player.y,4);
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.rotate(mid+Math.PI/2-dir*(1-eOut(k))*sweep*.35);if(dir<0)ctx.scale(-1,1);ctx.scale(Math.max(.8,sweep/(140*deg)),1);
    ctx.globalAlpha=Math.max(0,a);ctx.drawImage(im,-W/2,-W/2,W,W);ctx.restore();ctx.globalAlpha=1;}};

/* ---- death roll: spinning mud/water commas instead of a flat ground ring ---- */
const _RR=RollRing;
RollRing=class extends _RR{
  draw(){const im=svgImg('roll_swirl');if(!im)return;const a=Math.min(1,this.t/.15)*(this.t>this.life-.3?Math.max(0,(this.life-this.t)/.3):1),[x,y]=P(this.x,this.y),W=this.R*2.6;
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);ctx.rotate(-this.t*9);ctx.globalAlpha=a*.9;ctx.drawImage(im,-W/2,-W/2,W,W);ctx.restore();ctx.globalAlpha=1;}};

/* ---- big mud splashes get a mud crown ---- */
let lastCrown=0;
const _ms=mudSplash;mudSplash=function(x,y,n=10,sp=160){_ms(x,y,n,sp);if(n>=8&&gameTime-lastCrown>.12){lastCrown=gameTime;svgFx('mud_crown',{x,y,z:0,s:Math.min(.48,.24+n*.012),ay:.86,layer:'sorted',sortOff:3,life:.55,grow:[.3,1],growT:.1,fadeOut:.55,flip:Math.random()<.5?-1:1});}};
})();
