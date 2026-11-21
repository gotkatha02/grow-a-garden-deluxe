/* Aztec crocodile (Cipactli lancer) — vector art for the skill effects v3 (owner 2026-11-21: "ทำสกิลจระเข้ด้วย vfx svg
   ตามคอนเซปสกิลและตามความสามารถสกิล" = make the croc's skills with VFX + SVG, matching each skill's concept and what it does).
   Every piece is an SVG drawn here (gradients + soft blur, no dark outlines: shapes are told apart by value, VFX_STYLE_REF_TH.md),
   rasterised ONCE to a canvas at 2x and then animated by croc_vfx3.js.
   Themes: river (water, mud, reeds) · temple lancer (obsidian blade, gold, jade, sun stone, stepped fret) · predator (jaws, blood)
           · Cipactli, the ancient earth crocodile (amber spirit head with quetzal plumes).
   Same registry as the cat's / kitsune's: window.KTA.get(name) -> canvas | null · window.KTA.size(name) -> [w,h] in world px. */
(()=>{
if(typeof CHAR!=='undefined'&&CHAR!=='croc'&&!window.__CR_ART_PREVIEW)return;
const XL='xmlns="http://www.w3.org/2000/svg"';
const S=(w,h,defs,body)=>({w,h,svg:`<svg ${XL} width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`});
const stops=a=>a.map(([o,c,op])=>`<stop offset="${o}" stop-color="${c}"${op!=null?` stop-opacity="${op}"`:''}/>`).join('');
const lg=(id,x1,y1,x2,y2,a,ex='')=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${ex}>${stops(a)}</linearGradient>`;
const rg=(id,cx,cy,r,a,ex='')=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" ${ex}>${stops(a)}</radialGradient>`;
const blur=(id,sd,pad=40)=>`<filter id="${id}" x="-${pad}%" y="-${pad}%" width="${100+2*pad}%" height="${100+2*pad}%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const f1=v=>(+v).toFixed(1),TAU=Math.PI*2;
const poly=pts=>pts.map((p,i)=>(i?'L':'M')+f1(p[0])+' '+f1(p[1])).join(' ')+'Z';
const A={};

/* =====================================================================
   1. JAWS — side view facing right, hinge on the left. Upper jaw pivots at (24,64) of its 220x84 box, lower jaw at (24,8) of
      its 220x56 box: the code rotates each round its hinge to open / snap. Three skins:
      n = the river crocodile · g = golden spirit (Ancient Maw) · i = iron jaws (bronze-bound snout, steel teeth)
   ===================================================================== */
const JP={
  n:{b:['#2c5222','#4c7b30','#86ad4f','#d2d08a'],l:['#557d33','#87a64c','#d9d08f','#f5eec8'],t:['#d9c79a','#fffaf0'],eye:['#fff3a0','#f0a020','#8a4606'],hi:'#e4f7b0',sp:'#28461c',orn:1,gum:'#cf9f86'},
  g:{b:['#7a3406','#cf7414','#ffbf45','#fff1c4'],l:['#a24c08','#e08a1c','#ffd06a','#fff6d8'],t:['#ffd98a','#ffffff'],eye:['#ffffff','#fff0a0','#ff9a1a'],hi:'#fffbe6',sp:'#a8520a',orn:2,gum:'#ffe0a0'},
  i:{b:['#1f3a1c','#365f2c','#6f9046','#bdbc7c'],l:['#46682c','#71904a','#c8c086','#ece4bc'],t:['#7c8a9c','#ffffff'],eye:['#fff3a0','#f0a020','#8a4606'],hi:'#d8f0a8',sp:'#1c3216',orn:1,gum:'#b88a76',band:1}};
const UPATH='M24 66 C16 60 12 48 16 38 C20 28 30 22 40 20 C44 12 56 8 64 14 C70 18 74 22 84 24 C110 28 140 32 168 36 C180 37 186 34 192 31 C200 28 208 32 212 38 C218 44 218 54 212 58 L204 60 C196 62 190 58 182 60 C170 62 160 58 148 60 C130 62 110 60 92 62 C70 64 50 64 36 66 Z';
const LPATH='M24 6 L36 7 C60 8 90 8 120 9 C150 10 176 10 196 11 C206 12 212 13 214 16 C214 22 208 26 198 27 C176 30 150 34 120 38 C90 41 60 42 40 38 C28 35 18 24 18 14 C18 10 20 7 24 6 Z';
const ujy=x=>x<36?66:x<92?66-(x-36)/56*4:x<148?61:x<182?59.5:59.5;   /* roughly where the upper teeth hang from */
function jawUp(k){const p=JP[k];let teeth='';
  const T=[[40,7],[51,7],[62,8],[73,8],[84,9],[96,9],[108,10],[120,12],[132,9],[144,9],[156,10],[167,9],[178,11],[188,14],[198,9],[206,8]];
  for(const [x,L] of T){const y=ujy(x)-1.2,w=L>11?7:5.6,tx=x+w*.32;teeth+=`<path d="M${x} ${f1(y)} Q${f1(x+w*.12)} ${f1(y+L*.72)} ${f1(tx)} ${f1(y+L)} Q${f1(x+w*.86)} ${f1(y+L*.5)} ${f1(x+w)} ${f1(y)}Z"/>`;}
  const blot=[[96,44,12,4],[128,47,10,3.4],[156,50,9,3],[74,40,9,3.6],[182,50,7,2.6]].map(([x,y,rx,ry])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${8} ${x} ${y})"/>`).join('');
  let pits='';for(let x=96;x<=204;x+=9)pits+=`<circle cx="${x}" cy="${f1(ujy(x)-5.5-(x%2))}" r=".9"/>`;
  const band=p.band?[[100,27,46,15],[136,31,51,14],[170,35,55,12]].map(([x,y0,y1,w])=>`<path d="M${x} ${y0} L${x+w} ${y0+3} L${x+w} ${y1+2} L${x} ${y1} Z" fill="url(#bd)"/><path d="M${x+2} ${y0+2} L${x+w-2} ${y0+4.6}" stroke="#fff6d0" stroke-opacity=".8" stroke-width="1.3"/>`).join(''):'';
  return S(220,84,lg('b',0,0,0,1,[[0,p.b[0]],[.36,p.b[1]],[.72,p.b[2]],[1,p.b[3]]])+lg('t',0,0,0,1,[[0,p.t[0]],[1,p.t[1]]])+rg('e',.45,.42,.6,[[0,p.eye[0]],[.55,p.eye[1]],[1,p.eye[2]]])+
    rg('d',.06,.62,.32,[[0,p.sp,.55],[1,p.sp,0]])+rg('o',.4,.35,.6,[[0,'#fff6c0'],[.5,'#f0b030'],[1,'#8a5210']])+rg('j',.4,.35,.6,[[0,'#d8fff0'],[.6,'#2fd3a0'],[1,'#0f6b55']])+
    lg('bd',0,0,0,1,[[0,'#fff0b0'],[.45,'#e8a83a'],[1,'#7a4610']])+blur('s',1.1),
   `<g fill="url(#t)">${teeth}</g>
    <path d="${UPATH}" fill="url(#b)"/>
    <path d="${UPATH}" fill="url(#d)"/>
    <g fill="${p.sp}" opacity=".32">${blot}</g>
    ${band}
    <g fill="${p.sp}" opacity=".45">${pits}</g>
    <path d="M206 60 C196 62 190 58 182 60 C170 62 160 58 148 60 C130 62 110 60 92 62 C70 64 50 64 36 66" stroke="${p.gum}" stroke-width="2.2" fill="none" opacity=".9"/>
    <path d="M70 21 C100 26 140 31 168 35 C180 36 186 33 192 30" stroke="${p.hi}" stroke-opacity=".62" stroke-width="2.4" fill="none" stroke-linecap="round" filter="url(#s)"/>
    <path d="M196 30 C203 28 208 31 211 37" stroke="${p.hi}" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round"/>
    <g fill="${p.b[1]}"><ellipse cx="22" cy="36" rx="4.6" ry="3.4"/><ellipse cx="27" cy="28" rx="4.2" ry="3.2"/><ellipse cx="35" cy="23" rx="4" ry="3"/></g>
    <g fill="${p.hi}" opacity=".5"><ellipse cx="21" cy="34.6" rx="2.6" ry="1.2"/><ellipse cx="26.4" cy="26.8" rx="2.4" ry="1.1"/><ellipse cx="34.4" cy="21.8" rx="2.2" ry="1"/></g>
    <path d="M44 16 C50 8 62 8 68 16 C60 13 52 13 44 16Z" fill="${p.sp}" opacity=".75"/>
    <ellipse cx="56" cy="19.5" rx="7.4" ry="4.8" transform="rotate(-8 56 19.5)" fill="url(#e)"/>
    <ellipse cx="56.6" cy="19.6" rx="1.5" ry="4.3" fill="#140c04"/><circle cx="53.6" cy="17.6" r="1.3" fill="#fff"/>
    <ellipse cx="204" cy="31.5" rx="2.6" ry="1.5" fill="${p.sp}"/>
    ${p.orn?`<circle cx="33" cy="54" r="6.6" fill="url(#o)"/><circle cx="33" cy="54" r="3.1" fill="url(#j)"/><circle cx="31.6" cy="52.4" r="1" fill="#fff" opacity=".9"/>`:''}`);}
function jawLow(k){const p=JP[k];let teeth='';
  const T=[[42,6],[54,7],[66,7],[78,8],[90,8],[102,8],[114,9],[126,9],[138,9],[150,9],[162,9],[174,9],[186,12],[196,8],[205,7]];
  for(const [x,L] of T){const y=8+(x-24)/190*4+1.2,w=L>11?7:5.6;teeth+=`<path d="M${x} ${f1(y)} Q${f1(x+w*.18)} ${f1(y-L*.7)} ${f1(x+w*.62)} ${f1(y-L)} Q${f1(x+w*.9)} ${f1(y-L*.45)} ${f1(x+w)} ${f1(y)}Z"/>`;}
  let tick='';for(let x=48;x<=190;x+=11){const yb=x<120?38+(x-48)/72*3:41-(x-120)/70*13;tick+=`<path d="M${x} ${f1(yb-7)} L${x+1} ${f1(yb-1.5)}"/>`;}
  return S(220,56,lg('b',0,0,0,1,[[0,p.l[0]],[.35,p.l[1]],[.72,p.l[2]],[1,p.l[3]]])+lg('t',0,1,0,0,[[0,p.t[0]],[1,p.t[1]]])+rg('d',.05,.2,.3,[[0,p.sp,.5],[1,p.sp,0]]),
   `<g fill="url(#t)">${teeth}</g>
    <path d="${LPATH}" fill="url(#b)"/><path d="${LPATH}" fill="url(#d)"/>
    <g stroke="${p.l[2]}" stroke-width="1.1" stroke-opacity=".7" fill="none">${tick}</g>
    <path d="M36 9 C60 10 90 10 120 11 C150 12 176 12 196 13" stroke="${p.gum}" stroke-width="2" fill="none" opacity=".85"/>
    <path d="M40 15 C80 16 140 17 200 16" stroke="${p.hi}" stroke-opacity=".4" stroke-width="1.6" fill="none"/>`);}
for(const k in JP){A['jawU'+k]=jawUp(k);A['jawL'+k]=jawLow(k);}

/* =====================================================================
   2. OBSIDIAN — the spear blade (pointing right, knapped leaf of volcanic glass bound with gold and jade), chips, armour-break plates
   ===================================================================== */
{const top=[],bot=[];const hw=u=>11.2*(u<.36?Math.sin(u/.36*Math.PI/2):Math.pow(Math.cos((u-.36)/.64*Math.PI/2),.9));
 for(let x=17;x<=79;x+=1.5){const u=(x-17)/62,sc=1+.075*Math.sin(x*1.15);top.push([x,14-hw(u)*sc]);bot.push([x,14+hw(u)*(1+.075*Math.sin(x*1.15+2))]);}
 const blade='M17 14 '+top.map(p=>'L'+f1(p[0])+' '+f1(p[1])).join(' ')+' L79 14 '+bot.reverse().map(p=>'L'+f1(p[0])+' '+f1(p[1])).join(' ')+'Z';
 const lower='M17 14.6 L79 14 '+bot.map(p=>'L'+f1(p[0])+' '+f1(p[1])).join(' ')+'Z';
 let scars='';for(let x=22;x<74;x+=7){const u=(x-17)/62,h=hw(u);scars+=`<path d="M${x} ${f1(14-h*.92)} Q${x+3} ${f1(14-h*.45)} ${x+6} ${f1(14-h*.9)}"/>`;}
 A.spear=S(80,28,lg('ob',0,0,0,1,[[0,'#5d6c67'],[.42,'#26302e'],[.56,'#0a0e0f'],[1,'#171e1f']])+rg('sh',.58,.32,.34,[[0,'#8ff4dc',.75],[1,'#8ff4dc',0]])+
   lg('gd',0,0,0,1,[[0,'#fff1b4'],[.5,'#e2a032'],[1,'#7a4a10']])+rg('jd',.38,.35,.6,[[0,'#d8fff0'],[.6,'#2fd3a0'],[1,'#0f6b55']])+lg('fe',1,0,0,0,[[0,'#ff9a5a'],[1,'#c8202a',.2]]),
  `<path d="M7 14 L0 9.5 L2.5 14 L0 18.5Z" fill="url(#fe)"/>
   <path d="${blade}" fill="url(#ob)"/><path d="${lower}" fill="#05080a" opacity=".55"/>
   <path d="${blade}" fill="url(#sh)"/>
   <g stroke="#bff6ea" stroke-opacity=".28" stroke-width=".8" fill="none">${scars}</g>
   <path d="M19 13.6 L78 13.9" stroke="#e6fffa" stroke-opacity=".75" stroke-width=".9"/>
   <path d="M44 9 L60 11" stroke="#ffffff" stroke-opacity=".55" stroke-width="1.1" stroke-linecap="round"/>
   <rect x="8" y="9.6" width="10" height="8.8" rx="2.2" fill="url(#gd)"/>
   <path d="M11 9.8 L11 18.2 M14.4 9.8 L14.4 18.2" stroke="#7a4a10" stroke-opacity=".55" stroke-width=".9"/>
   <circle cx="6.4" cy="14" r="3" fill="url(#jd)"/>`);}
/* chips of obsidian (debris): dark glass, one facet catching the light */
[[[3,12],[10,2],[21,7],[17,20],[7,22]],[[2,8],[14,2],[22,14],[11,22]],[[4,4],[20,6],[18,18],[9,21],[2,14]],[[6,2],[22,10],[12,22],[3,16]]].forEach((pt,i)=>{
  const c=[pt.reduce((s,p)=>s+p[0],0)/pt.length,pt.reduce((s,p)=>s+p[1],0)/pt.length];
  A['ob'+i]=S(24,24,lg('l',0,0,1,1,[[0,'#9cf0dc'],[.5,'#4b6a64'],[1,'#22302e']]),
   `<path d="${poly(pt)}" fill="#0b1011"/><path d="${poly([pt[0],pt[1],c])}" fill="url(#l)"/><path d="${poly([pt[1],pt[2],c])}" fill="#2a3634"/>
    <path d="M${f1(pt[0][0])} ${f1(pt[0][1])} L${f1(pt[1][0])} ${f1(pt[1][1])}" stroke="#ffffff" stroke-opacity=".8" stroke-width=".9"/>`);});
/* armour-break plate (gauge above a target): an obsidian shield with a gold crack; G = glowing (5+ stacks, Shattered Guard) */
for(const g of [0,1])A[g?'abG':'ab']=S(16,20,lg('o',0,0,1,1,g?[[0,'#ffe9a0'],[.5,'#c87a1a'],[1,'#4a2206']]:[[0,'#6a7a76'],[.5,'#1e2626'],[1,'#07090a']])+blur('b',.8),
  `${g?'<path d="M8 1 L15 4 L14 12 C13 16 10 18 8 19 C6 18 3 16 2 12 L1 4 Z" fill="#ffb030" opacity=".8" filter="url(#b)"/>':''}
   <path d="M8 1.6 L14.4 4.4 L13.4 12 C12.6 15.4 10.2 17.4 8 18.4 C5.8 17.4 3.4 15.4 2.6 12 L1.6 4.4 Z" fill="url(#o)"/>
   <path d="M8 2.4 L13.6 4.8" stroke="${g?'#fff':'#bff6ea'}" stroke-opacity=".7" stroke-width=".8"/>
   <path d="M7.4 3 L9.4 7 L6.6 9.6 L9.2 12.6 L7.6 16.6" stroke="${g?'#fff6d8':'#ffc23a'}" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
   <path d="M7.4 3 L9.4 7 L6.6 9.6 L9.2 12.6 L7.6 16.6" stroke="#ffffff" stroke-width=".55" fill="none" stroke-linejoin="round"/>`);

/* =====================================================================
   3. SCALES — a crocodile scute (osteoderm) with its keel; G = gold (Ancient Scales)
   ===================================================================== */
for(const g of [0,1]){const c=g?['#fff3c4','#f0b23a','#9a5a0e','#5a3006']:['#bfe08a','#6f9a45','#3a6428','#1d3814'];
  A[g?'scuteG':'scute']=S(36,32,lg('a',0,0,1,1,[[0,c[0]],[.45,c[1]],[1,c[2]]])+lg('k',0,0,0,1,[[0,'#ffffff',.9],[1,'#ffffff',.1]]),
   `<path d="M18 2 C26 3 33 8 34 16 C34 24 27 30 18 30 C9 30 2 24 2 16 C3 8 10 3 18 2Z" fill="url(#a)"/>
    <path d="M18 2.6 C26 3.6 33 8.6 33.4 16 C33.4 24 27 29.4 18 29.6 L18 2.6Z" fill="${c[3]}" opacity=".34"/>
    <path d="M18 4 L18.6 28" stroke="url(#k)" stroke-width="2.4" stroke-linecap="round"/>
    <g fill="${c[3]}" opacity=".5"><circle cx="11" cy="12" r="1.3"/><circle cx="10" cy="20" r="1.2"/><circle cx="25" cy="13" r="1.1"/><circle cx="26" cy="21" r="1.2"/></g>
    <path d="M7 9 C10 5 14 4 17 4" stroke="#ffffff" stroke-opacity=".6" stroke-width="1.3" fill="none" stroke-linecap="round"/>`);}

/* =====================================================================
   4. TEMPLE — the sun stone (Sunpiercer), the stepped-fret ring (boundary / execution ground), the Cipactli seal (armour cash-in)
   ===================================================================== */
{const C=120;let rays='',studs='',notch='';
 for(let i=0;i<16;i++){const a=i/16*TAU-Math.PI/2,L=i%2?100:117,w=i%2?.1:.13,r0=70;const p=(r,an)=>[C+Math.cos(an)*r,C+Math.sin(an)*r];
   const A0=p(r0,a-w),A1=p(r0,a+w),T=p(L,a),M=p(r0,a);rays+=`<path d="${poly([A0,T,M])}" fill="url(#rl)"/><path d="${poly([M,T,A1])}" fill="url(#rd)"/>`;}
 for(let i=0;i<20;i++){const a=i/20*TAU,x=C+Math.cos(a)*66,y=C+Math.sin(a)*66;studs+=`<rect x="${f1(x-2.6)}" y="${f1(y-2.6)}" width="5.2" height="5.2" rx="1" transform="rotate(${f1(a*180/Math.PI+45)} ${f1(x)} ${f1(y)})"/>`;}
 for(let i=0;i<8;i++){const a=i/8*TAU+Math.PI/8,x=C+Math.cos(a)*49,y=C+Math.sin(a)*49;notch+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="3.2"/>`;}
 const lobe=(an)=>{const c=Math.cos(an),s=Math.sin(an),q=(u,v)=>[C+c*u-s*v,C+s*u+c*v];return `<path d="M${q(8,-9).map(f1).join(' ')} C${q(26,-16).map(f1).join(' ')} ${q(36,-6).map(f1).join(' ')} ${q(34,0).map(f1).join(' ')} C${q(36,6).map(f1).join(' ')} ${q(26,16).map(f1).join(' ')} ${q(8,9).map(f1).join(' ')}Z"/>`;};
 A.sun=S(240,240,rg('h',.5,.5,.5,[[0,'#ffe9a0',.9],[.45,'#ffb43a',.45],[.8,'#ff8a1a',.12],[1,'#ff8a1a',0]])+lg('rl',0,0,1,1,[[0,'#fff6c8'],[1,'#ffb43a']])+lg('rd',0,0,1,1,[[0,'#f0a02a'],[1,'#c0620e']])+
   rg('ring',.5,.5,.5,[[.55,'#ffd25a'],[.62,'#e8902a'],[.66,'#ffe7a0'],[1,'#c06a10']])+rg('core',.5,.5,.5,[[0,'#ffffff'],[.4,'#fff2b8'],[1,'#ffb43a']])+rg('jd',.45,.4,.7,[[0,'#cfffee'],[.6,'#2fd3a0'],[1,'#0f6b55']]),
  `<circle cx="${C}" cy="${C}" r="119" fill="url(#h)"/>${rays}
   <circle cx="${C}" cy="${C}" r="73" fill="url(#ring)"/><circle cx="${C}" cy="${C}" r="60" fill="#c8741a"/><circle cx="${C}" cy="${C}" r="57" fill="#ffd06a"/>
   <g fill="url(#jd)">${studs}</g><circle cx="${C}" cy="${C}" r="44" fill="#e88a22"/><g fill="#fff0b0">${notch}</g>
   <g fill="url(#jd)">${lobe(Math.PI/4)}${lobe(3*Math.PI/4)}${lobe(5*Math.PI/4)}${lobe(7*Math.PI/4)}</g>
   <circle cx="${C}" cy="${C}" r="15" fill="url(#core)"/>`);}
/* stepped fret (xicalcoliuhqui) ring, gold, lies flat on the ground */
{const C=120,r0=90,r1=112,N=14,seg=TAU/N;let d='';
 const M=[[0,0],[0,.62],[.3,.62],[.3,.32],[.55,.32],[.55,1],[.85,1],[.85,.18],[1,.18],[1,0]];   /* one step-spiral, u along the ring, v outward */
 for(let i=0;i<N;i++){const a0=i*seg,pts=[];for(let j=0;j<M.length;j++){const [u0,v0]=M[j],[u1,v1]=M[(j+1)%M.length];const n=Math.max(1,Math.round(Math.abs(u1-u0)*8));for(let s=0;s<n;s++){const u=u0+(u1-u0)*s/n,v=v0+(v1-v0)*s/n,an=a0+u*seg*.92,r=r0+v*(r1-r0);pts.push([C+Math.cos(an)*r,C+Math.sin(an)*r]);}}d+=poly(pts);}
 let dots='';for(let i=0;i<N;i++){const an=(i+.96)*seg,x=C+Math.cos(an)*(r0-7),y=C+Math.sin(an)*(r0-7);dots+=`<rect x="${f1(x-2)}" y="${f1(y-2)}" width="4" height="4" transform="rotate(45 ${f1(x)} ${f1(y)})"/>`;}
 A.fret=S(240,240,lg('g',0,0,0,1,[[0,'#fff3c0'],[.5,'#ffbe3e'],[1,'#c8761a']])+blur('b',2.2),
  `<g filter="url(#b)" opacity=".75"><path d="${d}" fill="#ffae2a"/><circle cx="${C}" cy="${C}" r="${r1+5}" fill="none" stroke="#ffae2a" stroke-width="3"/></g>
   <circle cx="${C}" cy="${C}" r="${r0-12}" fill="none" stroke="url(#g)" stroke-width="2.2"/><circle cx="${C}" cy="${C}" r="${r1+5}" fill="none" stroke="url(#g)" stroke-width="2.6"/>
   <path d="${d}" fill="url(#g)"/><g fill="#3ad8a8">${dots}</g>`);}
/* the Cipactli day-sign as a temple seal: a crocodile head glyph in a gold ring, on dark obsidian */
{let studs='';for(let i=0;i<12;i++){const a=i/12*TAU,x=60+Math.cos(a)*51,y=60+Math.sin(a)*51;studs+=`<rect x="${f1(x-3)}" y="${f1(y-3)}" width="6" height="6" rx="1.2" transform="rotate(${f1(a*180/Math.PI+45)} ${f1(x)} ${f1(y)})"/>`;}
 A.seal=S(120,120,rg('bg',.5,.45,.6,[[0,'#3a2a1a'],[1,'#0c0806']])+lg('g',0,0,0,1,[[0,'#fff3c0'],[.5,'#ffbe3e'],[1,'#b8661a']])+rg('jd',.4,.35,.6,[[0,'#d8fff0'],[.6,'#2fd3a0'],[1,'#0f6b55']]),
  `<circle cx="60" cy="60" r="57" fill="url(#g)"/><circle cx="60" cy="60" r="46" fill="url(#bg)"/><g fill="#7a3e0c" opacity=".6">${studs}</g>
   <path d="M24 66 C22 52 30 40 44 36 C52 26 64 24 72 30 C82 32 92 38 98 46 L98 52 C88 52 80 50 72 52 L72 58 C82 58 92 60 98 64 C96 72 88 78 76 78 C60 80 40 78 30 74 Z" fill="url(#g)"/>
   <path d="M72 52 L76 57 L80 52 L84 57 L88 52 L92 57 L96 53" fill="none" stroke="#fffbe8" stroke-width="2.2" stroke-linejoin="round"/>
   <path d="M44 36 C40 26 42 18 50 14 C50 22 52 28 56 31 Z M54 30 C54 20 60 14 68 12 C66 20 66 26 68 30 Z" fill="url(#jd)"/>
   <circle cx="56" cy="44" r="7.5" fill="#fffbe8"/><circle cx="57" cy="44" r="4" fill="#1a1208"/><circle cx="55.6" cy="42.6" r="1.4" fill="#fff"/>
   <path d="M32 66 C44 70 58 70 70 66" stroke="#7a3e0c" stroke-width="2" fill="none" stroke-linecap="round"/>`);}

/* =====================================================================
   5. CIPACTLI — the ancient earth crocodile, a golden spirit with quetzal plumes (Ancient Maw Awakening, Maw Finisher).
      cipU = head + upper jaw (300x170, hinge 66,130) · cipL = lower jaw (270x80, hinge 40,10)
   ===================================================================== */
{let teeth='';for(let x=86;x<=282;x+=13){const y=128-(x-86)/200*8,L=(x>250&&x<270)?19:x%3?12:14,w=8.5;teeth+=`<path d="M${x} ${f1(y)} Q${f1(x+1)} ${f1(y+L*.7)} ${f1(x+w*.3)} ${f1(y+L)} Q${f1(x+w*.85)} ${f1(y+L*.5)} ${f1(x+w)} ${f1(y)}Z"/>`;}
 const head='M66 132 C46 126 36 108 38 90 C40 70 52 56 70 50 C84 44 96 40 108 42 C116 30 134 26 146 36 C152 42 158 46 172 48 C212 54 250 66 278 80 C288 84 294 88 296 96 C300 104 298 114 290 118 L280 120 C270 124 262 118 252 122 C236 126 222 120 206 124 C180 128 150 124 126 128 C100 132 80 134 66 132 Z';
 let ridge='';for(let i=0;i<9;i++){const x=56+i*12.5,y=i<3?58-i*5:44+(i-3)*1.2,h=i<3?11:8-(i-3)*.6;ridge+=`<path d="M${f1(x-5)} ${f1(y+3)} L${f1(x+1)} ${f1(y-h)} L${f1(x+6)} ${f1(y+3)}Z"/>`;}
 let scutes='';for(let x=176;x<=264;x+=12){const y=51+(x-172)/106*30;scutes+=`<ellipse cx="${x}" cy="${f1(y)}" rx="5" ry="3.2" transform="rotate(16 ${x} ${f1(y)})"/>`;}
 let studs='';for(let x=150;x<=270;x+=20){const y=104+(x-150)/120*4;studs+=`<circle cx="${x}" cy="${f1(y)}" r="2.6"/>`;}
 const plume=(x0,y0,x1,y1,w)=>{const dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy),nx=-dy/l,ny=dx/l,mx=x0+dx*.55,my=y0+dy*.55,c1=[mx+nx*w*1.6,my+ny*w*1.6],c2=[mx-nx*w,my-ny*w];
   return `<path d="M${x0} ${y0} Q${f1(c1[0])} ${f1(c1[1])} ${x1} ${y1} Q${f1(c2[0])} ${f1(c2[1])} ${x0} ${y0}Z" fill="url(#pl)"/><path d="M${x0} ${y0} Q${f1(mx+nx*w*.3)} ${f1(my+ny*w*.3)} ${x1} ${y1}" stroke="#eafff8" stroke-width="1.3" fill="none" opacity=".85"/>`;};
 A.cipU=S(300,170,lg('b',0,0,0,1,[[0,'#fff4c8'],[.28,'#ffc848'],[.62,'#ee8a1e'],[.88,'#b85a0c'],[1,'#8a3a06']])+lg('t',0,0,0,1,[[0,'#ffe2a0'],[1,'#ffffff']])+lg('pl',1,1,0,0,[[0,'#137a5a'],[.45,'#2fe0a8'],[.8,'#7ad8ff'],[1,'#e8fdff']])+
   rg('e',.5,.5,.5,[[0,'#ffffff'],[.4,'#fff4b0'],[.75,'#ffb020'],[1,'#c05a00']])+rg('eh',.5,.5,.5,[[0,'#fff6c0',.9],[1,'#fff6c0',0]])+blur('g',4)+blur('s',1.4)+lg('bd',0,0,0,1,[[0,'#d8fff0'],[.5,'#2fd3a0'],[1,'#0f6b55']])+lg('gd',0,0,0,1,[[0,'#fff6d0'],[.5,'#ffc23a'],[1,'#9a5a0e']]),
  `${plume(66,62,8,8,11)}${plume(74,56,38,1,10)}${plume(60,72,3,36,10)}${plume(60,84,8,66,8)}
   <g fill="url(#t)">${teeth}</g>
   <path d="${head}" fill="#ffb030" opacity=".6" filter="url(#g)"/>
   <path d="${head}" fill="url(#b)"/>
   <g fill="#ffe2a0">${ridge}</g><g fill="#fff8e0" opacity=".55" filter="url(#s)">${ridge}</g>
   <g fill="#ffd77a" opacity=".85">${scutes}</g><g fill="#fffbe8" opacity=".6">${scutes.replace(/rx="5" ry="3.2"/g,'rx="2.6" ry="1.4"')}</g>
   <path d="M126 128 C150 124 180 128 206 124 C222 120 236 126 252 122 C262 118 270 124 280 120 L282 112 C250 116 200 118 150 118 C120 118 96 122 80 126Z" fill="#a8480a" opacity=".55"/>
   <g fill="url(#bd)">${studs}</g>
   <path d="M84 56 L104 48 L112 66 L92 76 Z" fill="url(#gd)"/><path d="M90 60 L104 54 L108 66 L94 72 Z" fill="url(#bd)"/>
   <circle cx="98" cy="92" r="10" fill="url(#gd)"/><circle cx="98" cy="92" r="5" fill="url(#bd)"/><circle cx="96" cy="90" r="1.6" fill="#fff"/>
   <path d="M118 40 C126 26 146 26 154 38 C144 33 128 33 118 40Z" fill="#9a4a08" opacity=".85"/>
   <ellipse cx="137" cy="44" rx="17" ry="12" fill="url(#eh)"/>
   <ellipse cx="137" cy="44" rx="10.5" ry="6.8" transform="rotate(-8 137 44)" fill="url(#e)"/><ellipse cx="138" cy="44" rx="2.1" ry="5.8" fill="#6a2200"/><circle cx="133.6" cy="41.4" r="2" fill="#fff"/>
   <path d="M172 50 C214 56 252 68 278 82" stroke="#fffbe6" stroke-width="3.4" stroke-linecap="round" fill="none" opacity=".8" filter="url(#s)"/>
   <path d="M108 44 C120 34 134 30 146 36" stroke="#fffbe6" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".7"/>
   <ellipse cx="287" cy="92" rx="3.6" ry="2.2" fill="#8a3a06"/><path d="M282 86 C286 82 292 84 294 88" stroke="#fff6d0" stroke-width="1.6" fill="none" opacity=".8"/>
   <path d="M280 120 C270 124 262 118 252 122 C236 126 222 120 206 124 C180 128 150 124 126 128 C100 132 80 134 66 132" stroke="#fff4c8" stroke-width="2.2" fill="none" opacity=".8"/>`);}
{let teeth='';for(let x=60;x<=250;x+=13){const y=12+(x-40)/220*5,L=(x>200&&x<215)?17:11,w=8.5;teeth+=`<path d="M${x} ${f1(y)} Q${f1(x+1.6)} ${f1(y-L*.7)} ${f1(x+w*.62)} ${f1(y-L)} Q${f1(x+w*.92)} ${f1(y-L*.45)} ${f1(x+w)} ${f1(y)}Z"/>`;}
 const jaw='M40 8 L60 10 C110 13 170 15 230 17 C246 18 258 20 262 25 C262 33 252 37 238 38 C200 43 140 49 90 51 C66 52 46 45 38 33 C34 25 34 15 40 8 Z';
 let belly='';for(let x=70;x<=232;x+=12){const yb=x<150?48-(x-70)/80*3:45-(x-150)/82*8;belly+=`<path d="M${x} ${f1(yb-9)} L${x+1} ${f1(yb-2)}"/>`;}
 A.cipL=S(270,80,lg('b',0,0,0,1,[[0,'#ffcf5a'],[.4,'#f29a2c'],[.8,'#c8640e'],[1,'#ffe2a0']])+lg('t',0,1,0,0,[[0,'#ffe2a0'],[1,'#ffffff']])+blur('g',4),
  `<g fill="url(#t)">${teeth}</g><path d="${jaw}" fill="#ffb030" opacity=".6" filter="url(#g)"/><path d="${jaw}" fill="url(#b)"/>
   <g stroke="#ffe8b0" stroke-width="1.3" opacity=".7">${belly}</g>
   <path d="M60 12 C110 15 170 17 230 19" stroke="#fff4c8" stroke-width="2.2" fill="none" opacity=".85"/>
   <path d="M70 44 C120 42 180 36 236 34" stroke="#fff0c0" stroke-width="2" fill="none" opacity=".55"/>`);}

/* =====================================================================
   6. RIVER — splash crowns (water / mud / blood-water), drops (head to the right: they are stretched along their flight),
      foam, mud clods, a reptile eye (ambush, awakening), a quetzal feather (Obsidian Edge), blood pips (Blood Frenzy gauge)
   ===================================================================== */
const SPL='M10 80 C14 70 16 60 18 52 L22 40 C24 50 26 58 30 62 C32 48 34 30 36 18 C40 34 42 48 46 58 C48 40 52 22 54 8 C58 26 60 44 62 56 C64 40 68 20 72 6 C74 26 76 44 78 58 C82 46 86 30 90 18 C92 34 94 48 96 60 C98 52 100 46 104 40 L106 50 C108 60 110 70 112 80 Z';
const SPI='M24 80 C28 70 30 64 34 58 C38 66 42 70 46 72 C50 60 54 50 58 44 C62 54 64 62 68 66 C72 56 76 50 80 44 C84 54 88 62 92 70 C96 72 98 76 100 80 Z';
for(const [k,c] of [['splash',['#0f5a86','#2f9fd6','#9fe6ff','#ffffff','#ffffff']],['splashM',['#2e1e10','#6a4a2a','#a8865a','#e8d4a8','#fff4dc']],['splashR',['#5a0a10','#b8202a','#ff6a6a','#ffd0c8','#ffffff']]]){
  A[k]=S(120,84,lg('g',0,1,0,0,[[0,c[0],.95],[.35,c[1],.95],[.75,c[2]],[1,c[3]]])+blur('b',1.2),
   `<path d="${SPL}" fill="url(#g)"/><path d="${SPI}" fill="${c[0]}" opacity=".45" filter="url(#b)"/>
    <g fill="${c[4]}" opacity=".95"><path d="M33 22 C34 16 36 14 37 12 C38 16 38 20 35 23Z"/><path d="M51 12 C52 6 54 4 55 2 C56 6 56 10 53 13Z"/><path d="M69 10 C70 4 72 2 73 1 C74 4 74 8 71 11Z"/><path d="M87 22 C88 16 90 14 91 12 C92 16 92 20 89 23Z"/></g>
    <g fill="${c[3]}"><circle cx="26" cy="30" r="2"/><circle cx="44" cy="17" r="2.5"/><circle cx="64" cy="14" r="2.2"/><circle cx="83" cy="12" r="2.5"/><circle cx="101" cy="30" r="2"/></g>
    <ellipse cx="60" cy="79" rx="52" ry="4.6" fill="${c[4]}" opacity=".8"/>`);}
for(const [k,c] of [['dropW',['#0f6aa0','#4fc6f0','#d8f8ff']],['dropB',['#6a0a0e','#d0202a','#ff9a8a']],['dropM',['#2a1a0c','#6a4a2a','#c8a878']]])
  A[k]=S(24,12,lg('g',0,0,1,0,[[0,c[0],0],[.35,c[0],.7],[.75,c[1]],[1,c[2]]]),`<path d="M1 6 C8 3 14 1.2 18 1.4 C21.6 1.6 23.4 3.6 23.4 6 C23.4 8.4 21.6 10.4 18 10.6 C14 10.8 8 9 1 6Z" fill="url(#g)"/><ellipse cx="19.4" cy="4.4" rx="2" ry="1.2" fill="#fff" opacity=".85"/>`);
A.pip=S(14,18,lg('g',0,0,1,1,[[0,'#ff9a8a'],[.5,'#e0262c'],[1,'#7a0a10']]),`<path d="M7 1 C9 5 13 9 13 12 C13 15.4 10.4 17.4 7 17.4 C3.6 17.4 1 15.4 1 12 C1 9 5 5 7 1Z" fill="url(#g)"/><ellipse cx="4.8" cy="11.4" rx="1.4" ry="2.4" fill="#fff" opacity=".75"/>`);
A.foam=S(16,12,'',`<g fill="#ffffff"><circle cx="5" cy="7" r="3.4" opacity=".9"/><circle cx="10.4" cy="5.4" r="2.6" opacity=".85"/><circle cx="12" cy="9" r="1.8" opacity=".8"/></g><g fill="#9fe6ff" opacity=".6"><circle cx="4" cy="8" r="1.4"/><circle cx="9.6" cy="6.2" r="1"/></g>`);
[[[2,9],[6,3],[13,2],[18,6],[17,12],[9,14]],[[1,7],[8,2],[17,4],[19,10],[11,14],[4,13]],[[3,5],[12,2],[18,8],[14,14],[5,13]]].forEach((pt,i)=>{
  A['mud'+i]=S(20,16,lg('g',0,0,0,1,[[0,'#9a7a52'],[.45,'#5a3e22'],[1,'#2a1a0c']]),`<path d="${poly(pt)}" fill="url(#g)"/><ellipse cx="${f1(pt[1][0]+2)}" cy="${f1(pt[1][1]+2.4)}" rx="2.4" ry="1.2" fill="#e8d8b8" opacity=".7"/>`);});
for(const [k,c] of [['eyeA',['#fff6b0','#f0a020','#8a4606']],['eyeR',['#ffd8c8','#ff3a2a','#7a0808']]])
  A[k]=S(30,18,rg('i',.45,.45,.55,[[0,c[0]],[.55,c[1]],[1,c[2]]])+blur('b',1.4),
   `<ellipse cx="15" cy="10" rx="13" ry="7" fill="${c[1]}" opacity=".55" filter="url(#b)"/><path d="M3 10 C8 3 22 3 27 10 C22 15 8 15 3 10Z" fill="url(#i)"/>
    <ellipse cx="15.4" cy="10" rx="1.8" ry="5.2" fill="#120804"/><circle cx="12.2" cy="7.6" r="1.6" fill="#fff"/><path d="M3 9 C8 2 22 2 27 9 C22 5 8 5 3 9Z" fill="#1e3a16" opacity=".8"/>`);
A.quetz=S(18,62,lg('v',0,1,0,0,[[0,'#d8302a'],[.16,'#1f9a5a'],[.55,'#2fe0a8'],[.85,'#3aa8e8'],[1,'#d8faff']])+lg('s',0,0,1,0,[[0,'#ffffff',.0],[.5,'#ffffff',.55],[1,'#ffffff',0]]),
  `<path d="M9 61 C5 48 2 32 4 18 C5 10 8 4 12 1 C13 8 16 16 16 26 C16 40 13 52 9 61Z" fill="url(#v)"/><path d="M9 60 C9 40 10 20 12 2" stroke="#e8fff6" stroke-width="1" fill="none" opacity=".8"/>
   <path d="M6 30 C8 22 10 14 12 6" stroke="url(#s)" stroke-width="3" fill="none"/>`);

/* ---------- loader: each SVG becomes a canvas at 2x ---------- */
const CV={},IM={};
for(const k in A){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=A[k].w*2;c.height=A[k].h*2;c.getContext('2d').drawImage(im,0,0,c.width,c.height);CV[k]=c;};
  im.onerror=()=>console.warn('croc art failed',k);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(A[k].svg);IM[k]=im;}
window.KTA={get:k=>CV[k]||null,size:k=>A[k]?[A[k].w,A[k].h]:[0,0],names:Object.keys(A),ready:()=>Object.keys(A).every(k=>CV[k])};
})();
