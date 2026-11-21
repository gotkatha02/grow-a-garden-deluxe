/* Olympian white lion (Zeus's heir, Greek pankration fighter) — vector art for the skill effects (owner 2026-11-21 "ทำของสิงโตต่อ":
   the same brief as the cat, kitsune, axolotl and dragon — every skill effect made with SVG + VFX, following its concept and description).
   Every piece is an SVG drawn here (gradients + soft blur, no dark outlines), rasterised ONCE to a canvas at 2x and animated by lion_vfx.js.
   Motifs from the lion's own painted icons and effects (assets/icons/lion, assets/fx/lion): gold cestus fists, the gold lion paw of the
   grab, laurel wreaths, white marble floor slabs and the Greek key (meander), Doric columns of the arena, sky-blue lightning with a gold
   javelin head, Zeus's double thunderbolt (keraunos), the golden eagle, the lion-head aegis, lightning-feather wings, slate storm clouds.
   Same registry as the other heroes: window.KTA.get(name) -> canvas | null · window.KTA.size(name) -> [w,h] in world px. */
(()=>{
if(typeof CHAR!=='undefined'&&CHAR!=='lion'&&!window.__LI_ART_PREVIEW)return;
const XL='xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
const S=(w,h,defs,body)=>({w,h,svg:`<svg ${XL} width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`});
const stops=s=>s.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('');
const lg=(id,x1,y1,x2,y2,s,extra='')=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}>${stops(s)}</linearGradient>`;
const rg=(id,cx,cy,r,s,extra='')=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" ${extra}>${stops(s)}</radialGradient>`;
const blur=(id,sd,pad=40)=>`<filter id="${id}" x="-${pad}%" y="-${pad}%" width="${100+2*pad}%" height="${100+2*pad}%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const f1=v=>(+v).toFixed(1);
const A={};
/* materials: [ink, deep, mid, lite, core] */
const GLD=['#3a2206','#b8741a','#ffc23a','#ffe89a','#ffffff'],BLT=['#06204a','#1f6fd8','#5ac8ff','#d8f4ff','#ffffff'],
  MRB=['#3a3630','#a89f8e','#e8e0d0','#faf6ee','#ffffff'],LAU=['#1e3a10','#4a8a2a','#9ad860','#e0f8c0','#ffffff'];
const GOLDV=id=>lg(id,0,0,0,1,[[0,'#fff3c0'],[.45,'#ffc23a'],[1,'#a8620e']]),GOLDH=id=>lg(id,0,0,1,0,[[0,'#a8620e'],[.5,'#ffd86a'],[1,'#a8620e']]);
const BOLT='M0 0 L6 -2 L4 3 L10 1 L3 10 L5 4 L-1 6Z';   /* a small lightning tick */

/* ---------- a pankration fist (pointing right): white fur wrapped in brown leather thongs (himantes), a gold plate over the knuckles,
   a gold cuff with Zeus's bolt; B = the same fist charged with lightning (blue light on the fur, sparks off the knuckles) ---------- */
const HAND='M26 12 C36 7 52 5 64 8 C74 10 79 18 79 28 C79 38 74 46 64 48 C52 51 36 49 26 44 Z';
const fist=(elec)=>S(84,56,lg('t',0,0,1,0,[[0,elec?'#5ac8ff':'#ffc23a',0],[.5,elec?'#5ac8ff':'#ffc23a',.7],[1,elec?'#e8f8ff':'#fff3c0',.95]])+
    rg('fur',.72,.32,.8,elec?[[0,'#ffffff'],[.45,'#e4f4ff'],[1,'#8ab8e0']]:[[0,'#ffffff'],[.5,'#f3e9d6'],[1,'#c9b18a']])+
    lg('lea',0,0,0,1,[[0,'#d8985a'],[.45,'#9a5a26'],[1,'#5a3214']])+GOLDV('g')+GOLDH('c')+blur('f',.9)+`<clipPath id="h"><path d="${HAND}"/></clipPath>`,
  `<path d="M1 28 C8 20 16 15 27 14 L27 42 C16 41 8 36 1 28Z" fill="url(#t)"/>
   <path d="${HAND}" fill="#2a1808" opacity=".55" transform="translate(1.6 2.4)"/>
   <path d="${HAND}" fill="url(#fur)"/>
   <g clip-path="url(#h)"><g fill="url(#lea)"><path d="M30 2 L40 2 L31 54 L21 54Z"/><path d="M44 2 L53 2 L45 54 L36 54Z"/></g>
     <g stroke="#f0c890" stroke-width="1" opacity=".55"><path d="M38.5 4 L30 52"/><path d="M51.5 4 L43.5 52"/></g>
     <path d="M57 5 L66 5.6 C67 20 67 36 65 51 L56 51 C58 36 58.6 20 57 5Z" fill="url(#g)"/><g fill="#fff3c0"><circle cx="61.6" cy="13" r="1.6"/><circle cx="62.2" cy="28" r="1.6"/><circle cx="61.6" cy="43" r="1.6"/></g></g>
   <g stroke="${elec?'#5a86b8':'#a8875e'}" stroke-width="1.5" stroke-linecap="round" fill="none"><path d="M68 18.5 C72 18 75.5 19 78 21.5"/><path d="M68.6 27.5 C72.6 27 76 28 78.6 30"/><path d="M68 36.5 C72 36.5 75 37.5 77 39.5"/></g>
   <path d="M40 37 C48 32 61 32 68 36.5 C70 39.6 66 42.6 59 43 C51 44 45 43 40 37Z" fill="url(#fur)"/><path d="M47 34.6 L52 33.6 L53.4 43.6 L48.4 43.6Z" fill="url(#lea)"/>
   <g filter="url(#f)"><path d="M34 11.5 C44 8.4 56 7.6 66 9.6" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".9"/></g>
   <rect x="18.5" y="11" width="9" height="34.5" rx="3" fill="url(#c)"/><path d="M18.5 15.5 H27.5 M18.5 41 H27.5" stroke="#fff3c0" stroke-width="1"/>
   <g transform="translate(19.4 22.6) scale(.7)" fill="${elec?'#ffffff':'#1f6fd8'}"><path d="${BOLT}"/></g>
   ${elec?`<g stroke="#e8f8ff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M76 7 L80 2.5 L79 9 L83.5 6"/><path d="M78 47 L82.5 52 L79.5 45.5 L84 48.5"/><path d="M48 4 L51 0 L52 6"/></g>
   <g stroke="#5ac8ff" stroke-width="1" fill="none" opacity=".9"><path d="M64 9 L70 14 L66 17 L73 22"/><path d="M60 46 L67 41 L69 45 L75 40"/></g>`:''}`);
A.fistG=fist(0);A.fistB=fist(1);
/* ---------- a reaching lion paw (pointing right): the pad, four toes fanned toward the target, claws out, gold spirit light ---------- */
A.grab=(()=>{const toe=(a,d,rx,ry)=>{const r=a*Math.PI/180,x=30+Math.cos(r)*d,y=30+Math.sin(r)*d,cx=x+Math.cos(r)*(rx+4.5),cy=y+Math.sin(r)*(rx+4.5);
    return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${rx}" ry="${ry}" fill="url(#p)" transform="rotate(${a} ${f1(x)} ${f1(y)})"/>
      <path transform="translate(${f1(cx)} ${f1(cy)}) rotate(${a})" d="M-3 -2.6 C2 -2.6 6 -1 9 2 C5 1.6 1 1.8 -3 2.6Z" fill="url(#cl)"/>
      <ellipse cx="${f1(x-1.4)}" cy="${f1(y-2)}" rx="2.4" ry="1.5" fill="#ffffff" opacity=".8" transform="rotate(${a} ${f1(x-1.4)} ${f1(y-2)})"/>`;};
  return S(76,60,lg('t',0,0,1,0,[[0,'#ffc23a',0],[.6,'#ffc23a',.55],[1,'#fff3c0',.9]])+rg('p',.42,.36,.7,[[0,'#fff8d8'],[.5,'#ffd23a'],[1,'#a8620e']])+lg('cl',0,0,1,0,[[0,'#ffffff'],[1,'#d8e8ff']])+rg('h',.45,.5,.55,[[0,'#ffd86a',.55],[1,'#ffd86a',0]]),
    `<ellipse cx="34" cy="30" rx="34" ry="28" fill="url(#h)"/><path d="M0 30 C6 22 14 19 22 19 L22 41 C14 41 6 38 0 30Z" fill="url(#t)"/>
     <g opacity=".5" fill="#3a2206" transform="translate(1.5 2.2)"><path d="M18 30 C18 20 26 16 33 19 C38 21 39 26 38 30 C39 34 38 39 33 41 C26 44 18 40 18 30Z"/></g>
     <path d="M18 30 C18 20 26 16 33 19 C38 21 39 26 38 30 C39 34 38 39 33 41 C26 44 18 40 18 30Z" fill="url(#p)"/>
     ${toe(-58,21,6,7.5)}${toe(-20,23,6.6,8)}${toe(20,23,6.6,8)}${toe(58,21,6,7.5)}
     <ellipse cx="25" cy="26" rx="5" ry="2.6" fill="#ffffff" opacity=".7" transform="rotate(-30 25 26)"/>`);})();
/* ---------- the grab: a gold lion paw in a half laurel wreath, the bolt below (front view) ---------- */
const leafPath=(cx,cy,a,L,W)=>`<path transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(a)})" d="M0 0 C${f1(-W)} ${f1(-L*.35)} ${f1(-W*.6)} ${f1(-L*.85)} 0 ${f1(-L)} C${f1(W*.6)} ${f1(-L*.85)} ${f1(W)} ${f1(-L*.35)} 0 0Z"/>`;
A.paw=(()=>{let lv='';for(const s of [-1,1])for(let i=0;i<5;i++){const a=(s<0?200:340)-s*(i*16),r=44,cx=50+Math.cos(a*Math.PI/180)*r,cy=58+Math.sin(a*Math.PI/180)*r*.85;lv+=leafPath(cx,cy,a+90+s*12,14,5);}
  const toe=(a,rx,ry)=>{const x=50+Math.sin(a*Math.PI/180)*31,y=60-Math.cos(a*Math.PI/180)*29;return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${rx}" ry="${ry}" fill="url(#p)" transform="rotate(${a*.6} ${f1(x)} ${f1(y)})"/><ellipse cx="${f1(x-2)}" cy="${f1(y-3)}" rx="2.6" ry="1.8" fill="#ffffff" opacity=".75"/>`;};
  return S(100,104,rg('p',.42,.36,.65,[[0,'#fff8d8'],[.5,'#ffd23a'],[1,'#a8620e']])+lg('lf',0,0,0,1,[[0,'#ffe89a'],[1,'#b8741a']])+rg('h',.5,.5,.5,[[0,'#ffd86a',.5],[1,'#ffd86a',0]]),
    `<circle cx="50" cy="54" r="50" fill="url(#h)"/><g fill="url(#lf)">${lv}</g>
     <path d="M50 46 C64 46 72 56 72 66 C72 76 62 80 56 76 C53 74 47 74 44 76 C38 80 28 76 28 66 C28 56 36 46 50 46Z" fill="url(#p)"/>
     ${toe(-62,8,10)}${toe(-22,8.5,11)}${toe(22,8.5,11)}${toe(62,8,10)}<ellipse cx="43" cy="55" rx="7" ry="3.4" fill="#ffffff" opacity=".7" transform="rotate(-25 43 55)"/>
     <circle cx="50" cy="93" r="9" fill="#1f4fae"/><circle cx="50" cy="93" r="9" fill="none" stroke="#ffd86a" stroke-width="2"/><g transform="translate(47 87.5) scale(.95)" fill="#ffe45a"><path d="${BOLT}"/></g>`);})();

/* ---------- laurel: an open wreath (front view, ribbon below), a small worn crown, a single leaf ---------- */
const wreath=(w,h,col1,col2,ribbon)=>{let lv='';const N=11;for(let side=-1;side<=1;side+=2)for(let i=0;i<N;i++){const t=i/(N-1),a=(110+t*150)*Math.PI/180,cx=w/2+side*Math.cos(a)*w*.42,cy=h*.55-Math.sin(a)*h*.42;
    lv+=leafPath(cx,cy,side*(t*150-60)+(side<0?0:0)+(i%2?12:-8)*side,h*.2,h*.07);}
  return S(w,h,lg('lf',0,0,0,1,[[0,col1],[1,col2]])+GOLDH('rb'),`<g fill="url(#lf)">${lv}</g>${ribbon?`<path d="M${w/2-10} ${h*.9} C${w/2-4} ${h*.84} ${w/2+4} ${h*.84} ${w/2+10} ${h*.9} L${w/2+14} ${h} L${w/2+5} ${h*.93} L${w/2} ${h*.97} L${w/2-5} ${h*.93} L${w/2-14} ${h}Z" fill="url(#rb)"/>`:''}`);};
A.laurel=wreath(110,96,'#ffe89a','#4a8a2a',1);A.laurelG=wreath(110,96,'#fff3c0','#c8861a',1);
A.crownL=(()=>{let lv='';for(let side=-1;side<=1;side+=2)for(let i=0;i<6;i++){const cx=32+side*(6+i*4.6),cy=22-Math.sin(i/5*Math.PI*.55)*6;lv+=leafPath(cx,cy,side*(55+i*6),11,4);}
  return S(64,32,lg('lf',0,0,0,1,[[0,'#fff3c0'],[.6,'#ffc23a'],[1,'#a8620e']]),`<path d="M6 24 C20 30 44 30 58 24" stroke="#c8861a" stroke-width="2.4" fill="none" stroke-linecap="round"/><g fill="url(#lf)">${lv}</g><circle cx="32" cy="26" r="3.6" fill="#1f6fd8"/><circle cx="32" cy="26" r="3.6" fill="none" stroke="#fff3c0" stroke-width="1.2"/>`);})();
A.leaf=S(14,30,lg('g',0,1,0,0,[[0,'#a8620e'],[.5,'#ffc23a'],[1,'#fff3c0']]),`<path d="M7 29 C1 20 1 9 7 1 C13 9 13 20 7 29Z" fill="url(#g)"/><path d="M7 27 L7 5" stroke="#fff8e0" stroke-width="1" opacity=".7"/>`);

/* ---------- the Greek key (meander) ring laid on the ground (top-down), plain or with Zeus's bolt in the middle ---------- */
const meander=(mid)=>{const R1=92,R2=78,N=28;let k='';for(let i=0;i<N;i++){const a0=i/N*360,a1=(i+1)/N*360,m=(a0+a1)/2;
    const p=(a,r)=>[100+Math.cos(a*Math.PI/180)*r,100+Math.sin(a*Math.PI/180)*r].map(f1).join(' ');
    k+=`<path d="M${p(a0+1,R2+2)} L${p(a0+1,R1-2)} L${p(a1-2,R1-2)} L${p(a1-2,R2+7)} L${p(m,R2+7)} L${p(m,R1-7)}" stroke="#7a4a0c" stroke-width="2.6" fill="none" stroke-linejoin="miter"/>`;}
  return S(200,200,rg('m',.5,.5,.5,[[0,'#ffffff',0],[.7,'#fff8e8',0],[.78,'#f4ecd8',.95],[.96,'#e2d4b6',.95],[1,'#e2d4b6',0]])+GOLDH('gr')+rg('z',.5,.5,.5,[[0,'#d8f4ff'],[.6,'#3a8ae8'],[1,'#1f4fae']]),
    `<circle cx="100" cy="100" r="96" fill="url(#m)"/><circle cx="100" cy="100" r="${R1+2}" fill="none" stroke="url(#gr)" stroke-width="3"/><circle cx="100" cy="100" r="${R2-1}" fill="none" stroke="url(#gr)" stroke-width="3"/><g>${k}</g>
     ${mid?`<circle cx="100" cy="100" r="30" fill="url(#z)"/><circle cx="100" cy="100" r="30" fill="none" stroke="#ffd86a" stroke-width="3.4"/><g transform="translate(86 82) scale(2.4)" fill="#fff3a0"><path d="${BOLT}"/></g>`:''}`);};
A.meander=meander(0);A.meanderZ=meander(1);

/* ---------- marble: three broken slabs, a cracked floor (top-down), a column ---------- */
const slab=(pts,vein)=>S(40,30,lg('s',0,0,1,1,[[0,'#ffffff'],[.5,'#ece4d2'],[1,'#b8ac94']]),`<path d="${pts}" fill="#8a8070"/><path d="${pts}" fill="url(#s)" transform="translate(-1.2 -1.6)"/><path d="${vein}" stroke="#a89f8e" stroke-width="1" fill="none" opacity=".7"/>`);
A.slab0=slab('M3 8 L30 3 L37 18 L12 27Z','M10 12 C16 14 20 11 27 15');A.slab1=slab('M6 4 L26 6 L34 24 L4 22Z','M9 18 C14 13 20 16 26 10');A.slab2=slab('M2 14 L16 3 L37 10 L29 26 L8 25Z','M12 8 C14 14 22 15 25 21');
A.crater=(()=>{let cr='',tl='';const N=9;for(let i=0;i<N;i++){const a=i/N*Math.PI*2+.2,L=70+(i%3)*14;let x=100,y=100,d=`M100 100`;for(let j=1;j<=4;j++){const r=L*j/4,an=a+(j%2?.12:-.1);x=100+Math.cos(an)*r;y=100+Math.sin(an)*r;d+=` L${f1(x)} ${f1(y)}`;}cr+=`<path d="${d}"/>`;}
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r=46+(i%2)*10,cx=100+Math.cos(a)*r,cy=100+Math.sin(a)*r;tl+=`<rect x="${f1(cx-9)}" y="${f1(cy-6)}" width="18" height="12" rx="1.5" transform="rotate(${f1(a*57.3+(i%3)*8)} ${f1(cx)} ${f1(cy)})"/>`;}
  return S(200,200,rg('d',.5,.5,.5,[[0,'#2a2620',.85],[.3,'#4a4236',.6],[.62,'#8a7e6a',.25],[1,'#8a7e6a',0]])+rg('l',.5,.5,.5,[[0,'#ffd86a',.5],[.25,'#ffd86a',0]]),
    `<circle cx="100" cy="100" r="98" fill="url(#d)"/><g fill="#e8e0d0" stroke="#6a6052" stroke-width="1.2" opacity=".9">${tl}</g><g stroke="#2a2418" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85">${cr}</g>
     <g stroke="#ffe08a" stroke-width="1" stroke-linecap="round" fill="none" opacity=".55">${cr}</g><circle cx="100" cy="100" r="98" fill="url(#l)"/>`);})();
A.column=S(36,120,lg('c',0,0,1,0,[[0,'#b8ac94'],[.3,'#ffffff'],[.65,'#ece4d2'],[1,'#a89f8e']])+GOLDV('g'),
  `<rect x="4" y="112" width="28" height="8" rx="1" fill="url(#c)"/><rect x="2" y="116" width="32" height="4" fill="#a89f8e"/>
   <rect x="7" y="14" width="22" height="98" fill="url(#c)"/><g stroke="#b8ac94" stroke-width="1.2" opacity=".8"><path d="M11 16 V110 M15 16 V110 M21 16 V110 M25 16 V110"/></g>
   <path d="M1 8 L35 8 L32 14 L4 14Z" fill="url(#g)"/><rect x="0" y="2" width="36" height="6" rx="2" fill="url(#g)"/><circle cx="4" cy="8" r="3.6" fill="url(#g)"/><circle cx="32" cy="8" r="3.6" fill="url(#g)"/>`);

/* ---------- B weapons: the lightning javelin (gold head) and Zeus's keraunos (both pointing right) ---------- */
A.javelin=S(150,40,lg('sh',0,0,1,0,[[0,'#5ac8ff',0],[.25,'#5ac8ff',.85],[.75,'#d8f4ff'],[1,'#ffffff']])+GOLDV('g')+blur('f',1.6),
  `<g filter="url(#f)"><path d="M8 20 L104 20" stroke="#5ac8ff" stroke-width="12" stroke-linecap="round" opacity=".6"/></g>
   <path d="M2 20 L14 15 L26 23 L40 14 L54 24 L68 15 L82 23 L96 16 L106 20 L96 24 L82 26 L68 19 L54 27 L40 18 L26 27 L14 22Z" fill="url(#sh)"/>
   <path d="M20 20 L104 20" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round"/>
   <rect x="96" y="14" width="10" height="12" rx="2.4" fill="url(#g)"/><path d="M105 20 C114 9 132 9 149 20 C132 31 114 31 105 20Z" fill="url(#g)"/><path d="M108 20 C118 14 132 14 145 20" stroke="#fff8d8" stroke-width="2" fill="none"/>
   <g fill="#e8f8ff"><path d="M58 6 L65 1 L62 8 L69 5Z"/><path d="M80 34 L87 39 L83 31 L90 35Z"/><path d="M34 4 L39 0 L37 6Z"/></g>`);
A.keraunos=(()=>{const prong=(dir)=>`<path d="M${100+dir*16} 30 L${100+dir*40} 22 L${100+dir*34} 30 L${100+dir*62} 24 L${100+dir*54} 32 L${100+dir*96} 30 L${100+dir*54} 38 L${100+dir*62} 46 L${100+dir*34} 40 L${100+dir*40} 48 L${100+dir*16} 40Z" fill="url(#b)"/>`;
  return S(200,60,lg('b',0,0,0,1,[[0,'#ffffff'],[.4,'#d8f4ff'],[.75,'#5ac8ff'],[1,'#1f6fd8']])+GOLDV('g')+blur('f',2),
    `<g filter="url(#f)"><ellipse cx="100" cy="35" rx="96" ry="16" fill="#5ac8ff" opacity=".55"/></g>${prong(1)}${prong(-1)}
     <path d="M100 30 L196 30" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><path d="M100 30 L4 30" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
     <rect x="86" y="24" width="28" height="22" rx="5" fill="url(#g)"/><g stroke="#a8620e" stroke-width="1.4" opacity=".7"><path d="M92 25 V45 M100 25 V45 M108 25 V45"/></g><circle cx="100" cy="35" r="5" fill="#1f6fd8" stroke="#fff3c0" stroke-width="1.4"/>`);})();

/* ---------- the golden eagle of Zeus (side view, looking right), wings up and down; lightning trails off its feathers ---------- */
const eagle=(up)=>{const wing=up?'M44 30 C38 14 30 4 14 0 C24 8 26 14 22 18 C30 18 34 22 36 30Z M40 30 C30 18 18 10 4 8 C14 16 16 22 12 26 C22 26 30 28 34 32Z':'M44 34 C36 44 26 52 10 56 C20 48 22 42 18 40 C28 38 34 36 38 32Z M42 32 C30 36 18 40 2 38 C12 34 14 30 10 26 C22 28 30 28 36 30Z';
  return S(100,60,lg('b',0,0,1,0,[[0,'#a8620e'],[.6,'#ffc23a'],[1,'#fff3c0']])+lg('w',0,up?1:0,0,up?0:1,[[0,'#ffe89a'],[.6,'#ffc23a'],[1,'#a8620e']])+blur('f',.8),
    `<g stroke="#5ac8ff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".9"><path d="M8 ${up?6:52} L2 ${up?2:58} L6 ${up?10:50} L0 ${up?8:54}"/><path d="M4 ${up?24:40} L-2 ${up?22:44}"/></g>
     <path d="${wing}" fill="url(#w)"/><path d="M30 34 C40 26 56 24 70 26 C78 24 86 26 90 30 C92 33 88 35 84 35 C78 38 64 42 50 42 C42 42 34 40 30 34Z" fill="url(#b)"/>
     <path d="M30 34 C24 34 18 38 12 44 C18 42 24 42 30 40Z" fill="url(#b)"/><path d="M84 28 C90 28 96 30 98 33 C94 33 90 34 88 35Z" fill="#ffb020"/>
     <circle cx="82" cy="29.5" r="2" fill="#2a1606"/><circle cx="82.5" cy="29" r=".7" fill="#ffffff"/><path d="M70 27 C76 25 82 25 88 28" stroke="#ffffff" stroke-width="1.4" fill="none" opacity=".8"/>
     <g filter="url(#f)"><path d="M40 30 C50 27 60 26 70 27" stroke="#ffffff" stroke-width="2" fill="none" opacity=".6"/></g>`);};
A.eagle0=eagle(1);A.eagle1=eagle(0);

/* ---------- the aegis: a round gold shield with the lion's head, a Greek-key rim and the bolt ---------- */
const lionFace=(cx,cy,s,mane)=>{let m='';for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=17*s;m+=`<ellipse cx="${f1(cx+Math.cos(a)*r)}" cy="${f1(cy+Math.sin(a)*r)}" rx="${f1(7*s)}" ry="${f1(9*s)}" transform="rotate(${f1(a*57.3+90)} ${f1(cx+Math.cos(a)*r)} ${f1(cy+Math.sin(a)*r)})" fill="${mane}"/>`;}
  return `${m}<circle cx="${cx}" cy="${cy}" r="${f1(15*s)}" fill="#fff8ec"/><path d="M${f1(cx-8*s)} ${f1(cy-4*s)} C${f1(cx-5*s)} ${f1(cy-8*s)} ${f1(cx-2*s)} ${f1(cy-6*s)} ${f1(cx-2*s)} ${f1(cy-4*s)}Z M${f1(cx+8*s)} ${f1(cy-4*s)} C${f1(cx+5*s)} ${f1(cy-8*s)} ${f1(cx+2*s)} ${f1(cy-6*s)} ${f1(cx+2*s)} ${f1(cy-4*s)}Z" fill="#5a3a10"/>
   <ellipse cx="${f1(cx-5*s)}" cy="${f1(cy-2*s)}" rx="${f1(2.4*s)}" ry="${f1(2*s)}" fill="#3a8ae8"/><ellipse cx="${f1(cx+5*s)}" cy="${f1(cy-2*s)}" rx="${f1(2.4*s)}" ry="${f1(2*s)}" fill="#3a8ae8"/>
   <path d="M${f1(cx-3*s)} ${f1(cy+2*s)} L${f1(cx+3*s)} ${f1(cy+2*s)} L${cx} ${f1(cy+5*s)}Z" fill="#6a4020"/><path d="M${f1(cx-7*s)} ${f1(cy+6*s)} C${f1(cx-3*s)} ${f1(cy+12*s)} ${f1(cx+3*s)} ${f1(cy+12*s)} ${f1(cx+7*s)} ${f1(cy+6*s)} C${f1(cx+3*s)} ${f1(cy+8*s)} ${f1(cx-3*s)} ${f1(cy+8*s)} ${f1(cx-7*s)} ${f1(cy+6*s)}Z" fill="#8a1810"/>`;};
A.aegisE=(()=>{let mn='',dots='';for(let i=0;i<16;i++){const a=i/16*Math.PI*2,r=21;mn+=`<path transform="translate(${f1(48+Math.cos(a)*r)} ${f1(47+Math.sin(a)*r)}) rotate(${f1(a*57.3+90)})" d="M-6 4 C-6 -4 -2 -10 0 -12 C2 -10 6 -4 6 4 C3 6 -3 6 -6 4Z" fill="url(#mn)"/>`;}
  for(let i=0;i<20;i++){const a=i/20*Math.PI*2;dots+=`<circle cx="${f1(48+Math.cos(a)*42.5)}" cy="${f1(48+Math.sin(a)*42.5)}" r="1.5"/>`;}
  return S(96,96,rg('d',.4,.34,.7,[[0,'#fff0b0'],[.45,'#f0b030'],[.85,'#b8741a'],[1,'#7a4a0c']])+rg('mn',.5,.3,.8,[[0,'#ffb84a'],[1,'#b8560e']])+rg('fc',.45,.35,.7,[[0,'#fff6d0'],[.6,'#ffd36a'],[1,'#d89430']]),
    `<circle cx="48" cy="48" r="47" fill="#0e2a6a"/><circle cx="48" cy="48" r="45.5" fill="#1f4fae"/><g fill="#ffe08a">${dots}</g><circle cx="48" cy="48" r="39" fill="url(#d)"/><circle cx="48" cy="48" r="39" fill="none" stroke="#7a4a0c" stroke-width="1.4" opacity=".6"/>
     <g>${mn}</g><path d="M48 31 C58 31 64 39 63 49 C62 58 56 64 48 64 C40 64 34 58 33 49 C32 39 38 31 48 31Z" fill="url(#fc)"/>
     <path d="M38 44 C41 41 45 41 46 44 C43 45 40 45 38 44Z M58 44 C55 41 51 41 50 44 C53 45 56 45 58 44Z" fill="#3a2206"/>
     <path d="M44 51 L52 51 L48 55.5Z" fill="#5a2a10"/><path d="M48 55.5 L48 58 M48 58 C45.5 60.5 42.5 60 41 58 M48 58 C50.5 60.5 53.5 60 55 58" stroke="#5a2a10" stroke-width="1.5" fill="none" stroke-linecap="round"/>
     <path d="M37 37 C40 33 44 32 47 32" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/><path d="M16 30 A35 35 0 0 1 36 13" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>`);})();
/* ---------- the roaring lion's head (front view) for King's Roar / Nemean Hide: white mane in gold-tipped curls ---------- */
A.lionHead=(()=>{let m='';for(let i=0;i<18;i++){const a=i/18*360,L=i%2?40:48;m+=`<g transform="rotate(${a} 70 66)"><path d="M70 66 C62 ${66-L*.55} 64 ${66-L*.9} 72 ${66-L-6} C74 ${66-L*.8} 80 ${66-L*.62} 78 ${66-L*.3} C77 ${66-L*.12} 72 66 70 66Z" fill="url(#mn)"/></g>`;}
  return S(140,132,`<radialGradient id="mn" gradientUnits="userSpaceOnUse" cx="70" cy="66" r="62">${stops([[0,'#ffffff'],[.62,'#f6ecd6'],[.85,'#ffd86a'],[1,'#c8861a']])}</radialGradient>`+rg('fc',.5,.42,.6,[[0,'#ffffff'],[1,'#ece0c8']])+blur('f',1),
    `${m}<circle cx="70" cy="66" r="34" fill="url(#mn)"/><path d="M70 36 C88 36 98 50 96 68 C94 86 84 98 70 98 C56 98 46 86 44 68 C42 50 52 36 70 36Z" fill="url(#fc)"/>
     <path d="M52 56 C56 48 64 48 66 54 L60 60Z M88 56 C84 48 76 48 74 54 L80 60Z" fill="#c8a87a"/><ellipse cx="59" cy="58" rx="3.6" ry="3" fill="#3a8ae8"/><ellipse cx="81" cy="58" rx="3.6" ry="3" fill="#3a8ae8"/>
     <path d="M63 68 C66 64 74 64 77 68 C74 71 66 71 63 68Z" fill="#7a4a2a"/><path d="M54 76 C58 94 82 94 86 76 C80 80 60 80 54 76Z" fill="#8a1810"/><path d="M56 77 L59 83 L62 78Z M84 77 L81 83 L78 78Z M60 90 L63 85 L66 90Z M80 90 L77 85 L74 90Z" fill="#ffffff"/>
     <g fill="url(#lr)"></g><g filter="url(#f)"><path d="M50 48 C54 40 62 37 70 37" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/></g>
     <g fill="#ffc23a">${[[-1,0],[1,0]].map(([s])=>[0,1,2,3].map(i=>leafPath(70+s*(10+i*7),34-i*1.2,s*(60+i*8),10,3.6)).join('')).join('')}</g>`);})();
/* ---------- a wing of lightning feathers (right wing, root at the lower left) for Olympian Ascension ---------- */
A.wing=(()=>{let fe='';for(let i=0;i<7;i++){const a=-70+i*13,L=60-i*4;fe+=`<g transform="translate(10 70) rotate(${a})"><path d="M0 0 C${L*.3} -8 ${L*.75} -9 ${L} -2 C${L*.75} 4 ${L*.3} 5 0 0Z" fill="url(#fe)"/><path d="M4 -1 L${L-6} -2" stroke="#fff8d8" stroke-width="1" opacity=".7"/></g>`;}
  return S(90,80,lg('fe',0,0,1,0,[[0,'#ffc23a'],[.65,'#fff3c0'],[1,'#bfefff']])+blur('f',1.2),
    `<g filter="url(#f)" opacity=".7"><path d="M10 70 C30 30 60 10 88 4 C70 24 56 46 46 72Z" fill="#5ac8ff"/></g>${fe}
     <g stroke="#d8f4ff" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M70 6 L76 2 L74 9 L82 5"/><path d="M64 34 L72 32 L68 38 L76 37"/><path d="M50 58 L56 60 L52 64 L60 66"/></g>`);})();
/* ---------- a storm cloud of Olympus (side view): slate puffs, gold-lit rims, a bolt inside ---------- */
A.storm=S(140,72,lg('c',0,0,0,1,[[0,'#8a9ac8'],[.5,'#4a5884'],[1,'#222a48']])+lg('r',0,0,1,0,[[0,'#ffd86a',0],[.5,'#ffe89a'],[1,'#ffd86a',0]])+blur('f',1.2),
  `<path d="M14 60 C2 60 2 44 14 42 C12 28 28 20 40 28 C44 10 70 4 80 20 C90 10 112 14 112 30 C126 30 132 46 122 56 C124 66 112 70 104 64 L22 66 C16 66 12 64 14 60Z" fill="url(#c)"/>
   <path d="M14 42 C12 28 28 20 40 28 C44 10 70 4 80 20 C90 10 112 14 112 30" stroke="url(#r)" stroke-width="2" fill="none" stroke-linecap="round"/>
   <g filter="url(#f)"><path d="M70 40 L62 54 L70 53 L64 66" stroke="#9adcff" stroke-width="5" fill="none" stroke-linejoin="round"/></g><path d="M70 40 L62 54 L70 53 L64 66" stroke="#ffffff" stroke-width="2" fill="none" stroke-linejoin="round"/>
   <g fill="#a8b8e8" opacity=".6"><ellipse cx="44" cy="40" rx="10" ry="5"/><ellipse cx="92" cy="36" rx="12" ry="5"/></g>`);
/* ---------- the bolt sigil (blue disc, gold rim) and a glory medal (gold laurel coin) ---------- */
A.zeus=S(48,48,rg('z',.45,.4,.6,[[0,'#d8f4ff'],[.55,'#3a8ae8'],[1,'#1f4fae']])+GOLDH('r'),`<circle cx="24" cy="24" r="21" fill="url(#z)"/><circle cx="24" cy="24" r="21" fill="none" stroke="url(#r)" stroke-width="3.4"/><g transform="translate(16 13) scale(1.7)" fill="#fff3a0"><path d="${BOLT}"/></g>`);
A.medal=(()=>{let lv='';for(let s=-1;s<=1;s+=2)for(let i=0;i<4;i++){const a=(200+i*30)*Math.PI/180;lv+=leafPath(16+s*Math.cos(a)*9,17+Math.sin(a)*-9*-1,s*(i*30-20),6,2.2);}
  return S(32,32,rg('g',.4,.35,.6,[[0,'#fff8d8'],[.5,'#ffd23a'],[1,'#a8620e']]),`<circle cx="16" cy="16" r="13" fill="url(#g)"/><circle cx="16" cy="16" r="10" fill="none" stroke="#fff3c0" stroke-width="1.2"/><g fill="#a8620e" opacity=".8">${lv}</g><path d="M16 9 L18 14 L23 14 L19 17 L20.5 22 L16 19 L11.5 22 L13 17 L9 14 L14 14Z" fill="#fff8e0"/>`);})();

/* ---------- loader: each SVG becomes a canvas at 2x ---------- */
const CV={};
for(const k in A){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=A[k].w*2;c.height=A[k].h*2;c.getContext('2d').drawImage(im,0,0,c.width,c.height);CV[k]=c;};
  im.onerror=()=>console.warn('lion art failed',k);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(A[k].svg);}
window.KTA={get:k=>CV[k]||null,size:k=>A[k]?[A[k].w,A[k].h]:[0,0],names:Object.keys(A),ready:()=>Object.keys(A).every(k=>CV[k]),svg:k=>A[k]&&A[k].svg};
})();
