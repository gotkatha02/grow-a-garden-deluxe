/* Axolotl Tide Priest — vector art for the skill effects (owner 2026-11-21: "make the axolotl's skill effects with VFX / SVG,
   following the concept and the skill descriptions"). Same method as the cat (cat_art.js) and the kitsune (kitsune_art.js):
   every piece is an SVG drawn here (gradients + soft blur, no dark outlines), rasterised ONCE to a canvas at 2x and then
   animated by axolotl_vfx.js. The motifs come from the axolotl's own painted skill icons (assets/skill-icons/axolotl) and
   the painted Miracle of Life lotus: clear turquoise water, glossy drops and bubbles, pink lotus, mint healing light and
   sprouts, the gold jade bracelets with their teal gem, pink feathery gills.
   Same registry as the cat / kitsune kit: window.KTA.get(name) -> canvas | null · window.KTA.size(name) -> [w,h] in world px. */
(()=>{
if(typeof CHAR!=='undefined'&&CHAR!=='axolotl'&&!window.__AX_ART_PREVIEW)return;
const XL='xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
const S=(w,h,defs,body)=>({w,h,svg:`<svg ${XL} width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`});
const stops=s=>s.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('');
const lg=(id,x1,y1,x2,y2,s,extra='')=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}>${stops(s)}</linearGradient>`;
const rg=(id,cx,cy,r,s,extra='')=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" ${extra}>${stops(s)}</radialGradient>`;
const blur=(id,sd,pad=40)=>`<filter id="${id}" x="-${pad}%" y="-${pad}%" width="${100+2*pad}%" height="${100+2*pad}%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const f1=v=>(+v).toFixed(1);
const A={};
/* water materials: [ink, deep, mid, lite, core] — same order as the palettes in axolotl_vfx.js */
const WAT=['#052c3c','#0c7c9a','#33cde0','#b8f6ff','#ffffff'],MNT=['#063a22','#17a865','#6ff0a8','#d8ffe6','#ffffff'],PRS=['#06203f','#1462b8','#3aa8f0','#bfe8ff','#ffffff'];

/* ---------- a drop of water (tip up). The dark lower-right rim is the water's own shadow, not an outline ---------- */
const DROP='M16 2 C18.6 11 30 20 30 29.5 C30 37.6 23.7 43 16 43 C8.3 43 2 37.6 2 29.5 C2 20 13.4 11 16 2Z';
const drop=p=>S(32,44,`<clipPath id="k"><path d="${DROP}"/></clipPath>`+lg('b',0,0,0,1,[[0,p[3]],[.5,p[2]],[1,p[2]]])+rg('c',.5,.5,.5,[[0,'#ffffff',.9],[.45,p[3],.55],[1,p[3],0]])+blur('f',.55),
  `<path d="${DROP}" fill="${p[1]}"/><g clip-path="url(#k)"><ellipse cx="14.2" cy="26.5" rx="14.6" ry="17.8" fill="url(#b)"/><ellipse cx="17.5" cy="35.5" rx="8.5" ry="5.6" fill="url(#c)"/></g>
   <g filter="url(#f)"><path d="M12.6 12.6 C8.8 18 6.2 23.6 6.5 29.6 C7.4 24.8 9.6 19.6 14 15Z" fill="#ffffff"/></g>
   <ellipse cx="21.6" cy="33" rx="3" ry="1.8" fill="#ffffff" opacity=".75" transform="rotate(-32 21.6 33)"/>`);
A.drop=drop(WAT);A.dropM=drop(MNT);A.dropP=drop(PRS);

/* ---------- a clear bubble: almost empty inside, the colour is in the rim; an iridescent pink-violet sheen low right ---------- */
const bubble=(rim,irid)=>S(64,64,rg('b',.5,.5,.5,[[0,'#effdff',.05],[.62,'#c8f6ff',.1],[.85,rim,.28],[.96,rim,.62],[1,rim,0]])+
  rg('i',.7,.76,.5,[[0,irid,0],[.72,irid,0],[.9,irid,.48],[1,irid,0]])+rg('g',.3,.26,.42,[[0,'#ffffff',.32],[1,'#ffffff',0]])+blur('f',.7),
  `<circle cx="32" cy="32" r="30.5" fill="url(#b)"/><circle cx="32" cy="32" r="30.5" fill="url(#i)"/><circle cx="32" cy="32" r="30.5" fill="url(#g)"/>
   <g filter="url(#f)"><path d="M9.6 27 A23.5 23.5 0 0 1 27 9.4" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" fill="none"/>
   <path d="M46.6 52.2 A23.5 23.5 0 0 0 55 40.2" stroke="#d8fbff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".9"/></g>
   <path d="M15.4 20.6 L21.6 14.2 L24.4 17 L18.2 23.4Z" fill="#ffffff" opacity=".55"/><ellipse cx="19.4" cy="14.6" rx="3.6" ry="2.1" fill="#ffffff" transform="rotate(-42 19.4 14.6)"/><circle cx="44.8" cy="45.4" r="1.8" fill="#ffffff" opacity=".85"/>`);
A.bubble=bubble('#46b8f0','#ff9ad0');A.bubbleM=bubble('#3ad69a','#ffc0e4');

/* ---------- lotus (seen 3/4 from the front, like the painted Miracle of Life): pink petals in three rows, gold jade pod ---------- */
const petal=(cx,cy,a,L,W,fill,op=1)=>`<path transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(a)})" d="M0 0 C${f1(-W*.62)} ${f1(-L*.24)} ${f1(-W*.56)} ${f1(-L*.8)} 0 ${f1(-L)} C${f1(W*.56)} ${f1(-L*.8)} ${f1(W*.62)} ${f1(-L*.24)} 0 0Z" fill="${fill}" opacity="${op}"/>`;
const PG=(id,b,m,t)=>lg(id,0,1,0,0,[[0,b],[.5,m],[1,t]]);
A.lotus=(()=>{let s='';const cx=70,cy=74;
  for(const a of [-100,100])s+=petal(cx+a*.06,cy+2,a,44,26,'url(#pb)');
  for(const a of [-66,-33,0,33,66])s+=petal(cx,cy-2,a,52,30,'url(#pb)');
  for(const a of [-48,-16,16,48])s+=petal(cx,cy,a,46,31,'url(#pm)');
  const front=[-32,0,32].map(a=>petal(cx,cy+6,a,41,27,'url(#pf)')).join('');
  return S(140,92,PG('pb','#c8326e','#f07ab0','#ffd8ea')+PG('pm','#e0508c','#ff9ccc','#ffeef6')+PG('pf','#ee6aa2','#ffb8da','#ffffff')+
    rg('h',.5,.62,.55,[[0,'#ffb3d6',.5],[1,'#ffb3d6',0]])+rg('g',.5,.5,.5,[[0,'#ffffff'],[.4,'#e8fff0'],[1,'#8affc8',0]])+lg('au',0,0,0,1,[[0,'#fff0b0'],[.5,'#ffc23a'],[1,'#a86418']])+
    lg('jd',0,0,1,1,[[0,'#e8fffa'],[.45,'#3fe0c8'],[1,'#0b6e66']])+blur('f',1.1),
    `<ellipse cx="70" cy="58" rx="70" ry="38" fill="url(#h)"/>${s}<circle cx="70" cy="44" r="20" fill="url(#g)"/>
     <path d="M70 46 C70 38 64 33 58 33 C60 39 64 43 70 46Z M70 46 C70 37 77 31 84 32 C82 39 77 44 70 46Z" fill="#7af0a8"/>
     <path d="M54 52 C56 60 84 60 86 52 C80 56 60 56 54 52Z" fill="url(#au)"/><path d="M70 55 L75 61 L70 68 L65 61Z" fill="url(#jd)"/><path d="M70 55 L72 61 L70 62 L67 60Z" fill="#ffffff" opacity=".7"/>
     ${front}<g filter="url(#f)"><path d="M58 70 C62 58 66 50 70 46" stroke="#ffffff" stroke-width="1.6" fill="none" opacity=".55"/></g>`);})();

/* ---------- petals and leaves that fall (same 40x54 frame as the cat's petals so the shared petal code can throw them) ---------- */
['M20 51 C7 42 4 24 20 3 C36 24 33 42 20 51Z','M18 51 C5 40 6 20 22 3 C34 22 31 42 18 51Z','M20 51 C11 40 10 22 20 4 C30 22 29 40 20 51Z'].forEach((d,i)=>{
  A['petal'+i]=S(40,54,lg('g',0,1,0,0,[[0,'#e0508c'],[.42,'#ff9ccc'],[1,'#fff1f7']]),`<path d="${d}" fill="url(#g)"/><path d="M20 48 C19 34 19 20 20 9" stroke="#ffffff" stroke-width="1.2" fill="none" opacity=".45"/>`);});
['M20 52 C7 40 6 22 20 3 C34 22 33 40 20 52Z','M18 52 C4 38 8 18 24 3 C32 22 30 42 18 52Z'].forEach((d,i)=>{
  A['leaf'+i]=S(40,54,lg('g',0,1,0,0,[[0,'#1f9e5a'],[.5,'#6fe39a'],[1,'#e0ffe8']]),`<path d="${d}" fill="url(#g)"/><path d="M20 50 C19.5 36 20 22 ${i?22:20} 8" stroke="#f0fff4" stroke-width="1.4" fill="none" opacity=".65"/>`);});

/* ---------- a mint seedling (Spring branch: life comes back) ---------- */
A.sprout=S(46,52,rg('h',.5,.55,.5,[[0,'#9fffc8',.55],[1,'#9fffc8',0]])+lg('l',0,1,1,0,[[0,'#1f9e5a'],[.55,'#6ff0a8'],[1,'#eafff0']])+lg('s',0,1,0,0,[[0,'#2a8a4e'],[1,'#8af0b0']]),
  `<ellipse cx="23" cy="30" rx="23" ry="22" fill="url(#h)"/><path d="M22 51 C21 42 22.5 33 23 25 L25 25 C24.6 33 23.4 42 24.6 51Z" fill="url(#s)"/>
   <path d="M23.4 27 C16 29 5 24 3 12 C13 9 21.5 15 23.4 27Z" fill="url(#l)"/><path d="M24 25 C29 27 42 22 44 8 C33 5 25 12 24 25Z" fill="url(#l)"/>
   <path d="M21 24 C15 22 9 18 7 13" stroke="#ffffff" stroke-width="1.2" fill="none" opacity=".6"/><path d="M26 22 C32 19 37 15 40 10" stroke="#ffffff" stroke-width="1.2" fill="none" opacity=".6"/>`);

/* ---------- the healer's plus, glowing mint ---------- */
A.cross=S(40,40,rg('h',.5,.5,.5,[[0,'#bfffd8',.6],[.6,'#6ff0a8',.25],[1,'#6ff0a8',0]])+rg('g',.5,.45,.55,[[0,'#ffffff'],[.5,'#d8ffe6'],[1,'#3fd68a']]),
  `<circle cx="20" cy="20" r="20" fill="url(#h)"/><rect x="14.5" y="5" width="11" height="30" rx="4.6" fill="url(#g)"/><rect x="5" y="14.5" width="30" height="11" rx="4.6" fill="url(#g)"/>
   <rect x="16.4" y="7" width="3.2" height="10" rx="1.6" fill="#ffffff" opacity=".85"/>`);

/* ---------- the tide sigil under a cast: gold jade-bracelet ring with four teal gems, a water band, drops and a lotus rosette.
   Drawn as seen from above; the effect code lays it flat on the ground. ---------- */
A.sigil=(()=>{const C=110;let gems='',beads='',drops='',ros='',wav='';
  for(let i=0;i<4;i++){const a=i*90;gems+=`<g transform="rotate(${a} ${C} ${C}) translate(${C} ${C-96})"><path d="M0 -11 L7.4 0 L0 11 L-7.4 0Z" fill="url(#jd)"/><path d="M0 -11 L3 -1 L0 2 L-5 -1Z" fill="#ffffff" opacity=".7"/></g>`;}
  for(let i=0;i<8;i++){const a=(i+.5)*45*Math.PI/180;beads+=`<circle cx="${f1(C+Math.cos(a)*96)}" cy="${f1(C+Math.sin(a)*96)}" r="3.4" fill="#fff0b0"/>`;}
  for(let i=0;i<8;i++){const a=i*45+22.5;drops+=`<g transform="rotate(${a} ${C} ${C}) translate(${C} ${C-50}) scale(.42) translate(-16 -24)"><path d="${DROP}" fill="url(#dw)"/></g>`;}
  for(let i=0;i<6;i++)ros+=petal(C,C,i*60,26,16,'url(#pp)',.9);
  for(let i=0;i<=96;i++){const a=i/96*Math.PI*2,r=74+2.6*Math.sin(a*12);wav+=(i?'L':'M')+f1(C+Math.cos(a)*r)+' '+f1(C+Math.sin(a)*r);}
  return S(220,220,rg('h',.5,.5,.5,[[.6,'#3fe0c8',0],[.86,'#3fe0c8',.28],[1,'#3fe0c8',0]])+lg('au',0,0,1,1,[[0,'#fff3c0'],[.45,'#ffc23a'],[1,'#a86418']])+
    lg('jd',0,0,1,1,[[0,'#e8fffa'],[.45,'#3fe0c8'],[1,'#0b6e66']])+rg('w',.5,.5,.5,[[.78,'#0e9488',.15],[.88,'#3fe0c8',.55],[1,'#0e9488',.35]])+lg('dw',0,0,0,1,[[0,'#c8fff2'],[1,'#1fb8b0']])+
    PG('pp','#e0508c','#ff9ccc','#fff1f7')+blur('f',1.4),
    `<circle cx="${C}" cy="${C}" r="110" fill="url(#h)"/>
     <path d="M${C-82} ${C} A82 82 0 1 0 ${C+82} ${C} A82 82 0 1 0 ${C-82} ${C}Z M${C-66} ${C} A66 66 0 1 1 ${C+66} ${C} A66 66 0 1 1 ${C-66} ${C}Z" fill="url(#w)" fill-rule="evenodd"/>
     <path d="${wav}Z" stroke="#e8fffb" stroke-width="1.8" fill="none" opacity=".75"/>
     <path d="M${C-101} ${C} A101 101 0 1 0 ${C+101} ${C} A101 101 0 1 0 ${C-101} ${C}Z M${C-91} ${C} A91 91 0 1 1 ${C+91} ${C} A91 91 0 1 1 ${C-91} ${C}Z" fill="url(#au)" fill-rule="evenodd"/>
     <circle cx="${C}" cy="${C}" r="86" stroke="#ffd36a" stroke-width="1.6" fill="none" opacity=".8"/>${beads}${gems}${drops}
     <g opacity=".85">${ros}</g><circle cx="${C}" cy="${C}" r="7" fill="url(#au)"/><g filter="url(#f)"><circle cx="${C}" cy="${C}" r="96" stroke="#fff6d0" stroke-width="1.2" fill="none" opacity=".6"/></g>`);})();

/* ---------- a hand of water: the axolotl's four round-tipped webbed fingers, pointing right, a stream trailing from the wrist ---------- */
A.hand=(()=>{const bx=58,by=50,F=[-44,-15,15,44];let web='',fing='',pads='',hl='';
  const at=(a,l)=>[bx+Math.cos(a*Math.PI/180)*l,by+Math.sin(a*Math.PI/180)*l];
  for(let i=0;i<3;i++){const p1=at(F[i],10),p2=at(F[i],34),p3=at(F[i+1],34),p4=at(F[i+1],10),m=at((F[i]+F[i+1])/2,27);web+=`<path d="M${f1(p1[0])} ${f1(p1[1])} L${f1(p2[0])} ${f1(p2[1])} Q${f1(m[0])} ${f1(m[1])} ${f1(p3[0])} ${f1(p3[1])} L${f1(p4[0])} ${f1(p4[1])}Z" fill="url(#wb)"/>`;}
  for(const a of F){fing+=`<path transform="translate(${bx} ${by}) rotate(${a})" d="M10 -10.5 C22 -10 32 -9 38 -8.4 A9 9 0 0 1 38 8.4 C32 9 22 10 10 10.5Z" fill="url(#w)"/>`;
    const t=at(a,40);pads+=`<ellipse cx="${f1(t[0])}" cy="${f1(t[1])}" rx="5.4" ry="5" fill="url(#pd)"/>`;
    hl+=`<path transform="translate(${bx} ${by}) rotate(${a})" d="M14 -6 C24 -6.4 32 -5.8 38 -4.8" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".8"/>`;}
  return S(136,100,lg('w',0,0,1,0,[[0,'#0c7c9a'],[.3,'#2fc4dc'],[.75,'#9ef0ff'],[1,'#e8fdff']])+lg('wb',0,0,1,0,[[0,'#2fc4dc',.55],[1,'#b8f6ff',.8]])+
    rg('pd',.4,.36,.6,[[0,'#ffffff'],[.6,'#d8fbff'],[1,'#8ae8f6']])+rg('pl',.42,.4,.62,[[0,'#e8fdff'],[.5,'#5fd8ec'],[1,'#0c7c9a']])+rg('gl',.5,.5,.5,[[0,'#ffffff',.55],[1,'#ffffff',0]])+blur('f',.7),
    `<path d="M2 50 C16 39 30 35 44 38 L46 64 C30 67 16 62 2 55Z" fill="url(#w)" opacity=".85"/>${web}${fing}<ellipse cx="${bx}" cy="${by}" rx="27" ry="26" fill="url(#pl)"/>${pads}
     <ellipse cx="${bx-3}" cy="${by-5}" rx="15" ry="13" fill="url(#gl)"/><g filter="url(#f)">${hl}<path d="M38 34 C45 28 54 26 63 27" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" fill="none" opacity=".85"/></g>
     <g fill="#ffffff" opacity=".9"><circle cx="9" cy="45.5" r="2.8"/><circle cx="17" cy="41.5" r="3.4"/><circle cx="26" cy="38.6" r="3"/><circle cx="35" cy="37.4" r="2.6"/><circle cx="13" cy="58" r="2.2"/><circle cx="27" cy="62" r="2.4"/></g>`);})();

/* ---------- the heart of the ocean (Ocean's Heartbeat): a heart of glowing water, worn inside the big water orb ---------- */
A.heart=S(96,86,rg('g',.42,.38,.7,[[0,'#ffffff'],[.28,'#c8fbff'],[.66,'#33cde0'],[1,'#0a5a7a']])+rg('p',.5,.62,.4,[[0,'#ffb3dc',.55],[1,'#ffb3dc',0]])+rg('h',.5,.5,.5,[[0,'#7fe6ff',.5],[1,'#7fe6ff',0]])+blur('f',.9),
  `<ellipse cx="48" cy="44" rx="48" ry="42" fill="url(#h)"/><path d="M48 80 C30 66 7 52 7 31 C7 16 17.6 7 29.4 7 C38 7 44.6 11.6 48 18.6 C51.4 11.6 58 7 66.6 7 C78.4 7 89 16 89 31 C89 52 66 66 48 80Z" fill="url(#g)"/>
   <path d="M48 70 C36 60 22 50 22 36 C22 28 28 24 34 24 C40 24 45 28 48 34 C51 28 56 24 62 24 C68 24 74 28 74 36 C74 50 60 60 48 70Z" fill="url(#p)"/>
   <g filter="url(#f)"><path d="M16 26 C18 17 25 13 32 13" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none"/></g><circle cx="66" cy="22" r="2.6" fill="#ffffff" opacity=".85"/>`);

/* ---------- a gill frond: pink feathery stalk, each axolotl has three a side ---------- */
A.gill=(()=>{let fil='';const pts=[[20,64],[19,54],[17,44],[14.6,34],[12,24],[9.4,15],[7.4,8]];
  for(let i=1;i<pts.length-1;i++){const [x,y]=pts[i],L=10-i*.8;fil+=`<path d="M${x} ${y} q${f1(-L*.9)} ${f1(-L*.25)} ${f1(-L*1.1)} ${f1(-L*.95)}" /><path d="M${x} ${y} q${f1(L*.9)} ${f1(-L*.45)} ${f1(L*1.15)} ${f1(-L*1.15)}" />`;}
  return S(40,70,lg('s',0,1,0,0,[[0,'#d2347c'],[1,'#ff8cc6']])+rg('h',.4,.45,.6,[[0,'#ff6ab0',.5],[1,'#ff6ab0',0]])+blur('f',.45),
    `<ellipse cx="17" cy="36" rx="17" ry="34" fill="url(#h)"/><g stroke="#f0589e" stroke-width="3.4" stroke-linecap="round" fill="none">${fil}</g><g filter="url(#f)"><g stroke="#ffc8e6" stroke-width="1.5" stroke-linecap="round" fill="none">${fil}</g></g>
     <path d="M20 66 C19 52 15 30 7 7" stroke="url(#s)" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M19 56 C17.6 44 15 30 9.6 14" stroke="#ffe6f3" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".8"/>`);})();

/* ---------- a crown splash (side view, flat base at the bottom): a ring of water thrown up into spikes, drops leaving the tips ---------- */
const crown=p=>{const T=[[17,50,-.5],[33,30,-.35],[51,17,-.2],[71,10,0],[91,17,.2],[109,30,.35],[125,50,.5]],V=[[25,66],[42,56],[61,50],[81,50],[100,56],[117,66]];
  let d='M12 90 C13 78 14 64 '+(T[0][0]-3)+' '+(T[0][1]+4)+` Q${T[0][0]} ${T[0][1]-5} ${T[0][0]+3} ${T[0][1]+3}`;
  for(let i=0;i<V.length;i++){const v=V[i],t=T[i+1];d+=` Q${v[0]-4} ${v[1]+2} ${v[0]} ${v[1]} Q${t[0]-7+t[2]*6} ${t[1]+12} ${t[0]-3} ${t[1]+3} Q${t[0]+t[2]*4} ${t[1]-6} ${t[0]+3} ${t[1]+3}`;}
  d+=' Q128 62 129 74 C130 80 130 86 130 90 C100 99 42 99 12 90Z';
  let dr='',hl='';T.forEach(([x,y,l],i)=>{const r=2.6+(i%3)*.9,dy=9+(i%2)*6;dr+=`<ellipse cx="${f1(x+l*8)}" cy="${y-dy}" rx="${f1(r*.85)}" ry="${f1(r*1.1)}"/>`;if(i<6)hl+=`M${x-1} ${y+6} Q${x-5} ${y+18} ${V[i][0]-2} ${V[i][1]-1} `;});
  return S(142,100,lg('b',0,0,0,1,[[0,p[4]],[.2,p[3]],[.55,p[2]],[1,p[1]]])+rg('i',.5,.5,.5,[[0,p[1],.45],[.8,p[2],.3],[1,p[2],0]])+rg('pl',.5,.5,.5,[[0,p[1],.5],[1,p[1],0]])+blur('f',.6),
    `<ellipse cx="71" cy="90" rx="66" ry="9" fill="url(#pl)"/><path d="${d}" fill="url(#b)"/><ellipse cx="71" cy="70" rx="47" ry="9" fill="url(#i)"/>
     <path d="M24 72 C46 81 96 81 118 72" stroke="#ffffff" stroke-width="2.2" fill="none" opacity=".75" stroke-linecap="round"/>
     <g filter="url(#f)"><path d="${hl}" stroke="#ffffff" stroke-width="1.8" fill="none" opacity=".8"/></g>
     <path d="M14 90 C42 97 100 97 128 90" stroke="#ffffff" stroke-width="2.6" fill="none" opacity=".8" stroke-linecap="round"/><g fill="${p[3]}">${dr}</g><g fill="#ffffff" opacity=".8">${dr.replace(/r([xy])="([\d.]+)"/g,(m,a,v)=>`r${a}="${f1(v*.4)}"`)}</g>`);};
A.crown=crown(WAT);A.crownM=crown(MNT);A.crownP=crown(PRS);

/* ---------- a breaking wave (side view, rolling to the right): Hydro Slap's front, Spring Renewal ---------- */
const wave=p=>S(160,100,lg('b',0,1,.7,0,[[0,p[1]],[.55,p[2]],[1,p[3]]])+lg('i',0,0,1,1,[[0,p[0],.0],[1,p[0],.45]])+blur('f',.8),
  `<path d="M0 98 C38 92 68 72 88 44 C100 26 116 10 136 10 C152 10 162 24 154 38 C148 30 138 28 131 34 C122 44 126 66 144 82 L152 98Z" fill="url(#b)"/>
   <path d="M131 34 C122 44 126 66 144 82 L152 98 L120 98 C114 80 112 56 131 34Z" fill="url(#i)"/>
   <g filter="url(#f)"><path d="M84 48 C98 26 114 14 134 13 C148 13 156 22 154 32" stroke="#ffffff" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
   <g fill="#ffffff"><circle cx="146" cy="16" r="5"/><circle cx="154" cy="25" r="4"/><circle cx="136" cy="12" r="4.4"/><circle cx="126" cy="13" r="3.4"/><circle cx="116" cy="17" r="3"/><circle cx="158" cy="32" r="2.6"/></g>
   <g fill="${p[3]}"><circle cx="150" cy="4" r="2.4"/><circle cx="141" cy="2.6" r="1.8"/><circle cx="158" cy="10" r="1.8"/></g>`);
A.wave=wave(WAT);A.waveM=wave(MNT);

/* ---------- Water Saw: a disc of seven water sickles round a clear hub (seen from above, laid flat by the code) ---------- */
A.disc=(()=>{let bl='',tt='';for(let i=0;i<7;i++){const a=i*360/7;bl+=`<path transform="translate(56 56) rotate(${f1(a)})" d="M15 -7 C30 -20 46 -23 55 -14 C47 -12 37 -6 31 7 C27 1 21 -3 15 -7Z" fill="url(#s)"/><path transform="translate(56 56) rotate(${f1(a)})" d="M22 -12 C34 -19 46 -20 53 -15" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/>`;
    const r=(a-8)*Math.PI/180;tt+=`<circle cx="${f1(56+Math.cos(r)*53)}" cy="${f1(56+Math.sin(r)*53)}" r="2.6"/>`;}
  return S(112,112,lg('s',0,1,1,0,[[0,'#1462b8'],[.5,'#3aa8f0'],[1,'#d8f4ff']])+rg('hb',.42,.4,.6,[[0,'#ffffff',.9],[.4,'#bfe8ff',.55],[1,'#3aa8f0',.5]])+rg('gl',.5,.5,.5,[[.55,'#7fd0ff',0],[.85,'#7fd0ff',.3],[1,'#7fd0ff',0]]),
    `<circle cx="56" cy="56" r="56" fill="url(#gl)"/>${bl}<circle cx="56" cy="56" r="17" fill="url(#hb)"/><path d="M46 49 A12 12 0 0 1 56 43" stroke="#ffffff" stroke-width="2.6" fill="none" stroke-linecap="round"/><g fill="#ffffff" opacity=".9">${tt}</g>`);})();

/* ---------- Water Drill: a screw of water, three frames of its turning (pointing right) ---------- */
const CONE='M8 6 C40 10 92 24 128 32 C92 40 40 54 8 58 C2 46 2 18 8 6Z';
for(let f=0;f<3;f++){let gr='';for(let k=-3;k<8;k++){const x=f*7+k*21;gr+=`<path d="M${x} 0 C${x+10} 18 ${x+18} 40 ${x+30} 64 L${x+40} 64 C${x+28} 40 ${x+20} 18 ${x+11} 0Z" fill="#d8fbff" opacity=".55"/><path d="M${x+11} 0 C${x+20} 18 ${x+28} 40 ${x+40} 64 L${x+45} 64 C${x+33} 40 ${x+25} 18 ${x+16} 0Z" fill="#064e6a" opacity=".3"/>`;}
  A['drill'+f]=S(132,64,`<clipPath id="k"><path d="${CONE}"/></clipPath>`+lg('b',0,0,1,0,[[0,'#0c7c9a',.85],[.55,'#33cde0',.85],[1,'#e8fdff']])+lg('v',0,0,0,1,[[0,'#ffffff',.4],[.42,'#ffffff',0],[1,'#052c3c',.32]]),
    `<path d="${CONE}" fill="url(#b)"/><g clip-path="url(#k)">${gr}<rect x="0" y="0" width="132" height="64" fill="url(#v)"/></g>
     <path d="M14 11 C46 15 92 26 120 31" stroke="#ffffff" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>
     <ellipse cx="7" cy="32" rx="5" ry="26" fill="#d8fbff" opacity=".55"/><g fill="#ffffff" opacity=".85"><circle cx="6" cy="9" r="3"/><circle cx="3" cy="22" r="2.6"/><circle cx="3" cy="40" r="2.8"/><circle cx="6" cy="54" r="3"/></g>`);}

/* ---------- Second Spring's water cocoon: a clear egg, pink life glowing inside, swirls of water round it ---------- */
const EGG='M56 6 C86 6 104 46 104 82 C104 114 82 134 56 134 C30 134 8 114 8 82 C8 46 26 6 56 6Z';
A.cocoon=S(112,140,rg('b',.5,.58,.56,[[0,'#effdff',.06],[.7,'#9fe8ff',.2],[.92,'#46c8e8',.55],[1,'#2fa8d0',.75]])+rg('p',.5,.66,.4,[[0,'#ff9ad0',.42],[1,'#ff9ad0',0]])+blur('f',.8),
  `<path d="${EGG}" fill="url(#b)"/><ellipse cx="56" cy="90" rx="44" ry="40" fill="url(#p)"/>
   <g filter="url(#f)"><g stroke="#ffffff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".6"><path d="M22 70 C40 52 74 52 92 66"/><path d="M16 97 C42 83 72 85 98 101"/><path d="M30 120 C46 110 66 110 84 121"/></g>
   <path d="M27 36 C35 21 47 14 59 13" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" fill="none"/></g><circle cx="80" cy="34" r="2.6" fill="#ffffff" opacity=".85"/>
   <g fill="#ffffff" opacity=".85"><ellipse cx="34" cy="131" rx="6" ry="3"/><ellipse cx="56" cy="135" rx="8" ry="3.4"/><ellipse cx="78" cy="131" rx="6" ry="3"/></g>`);

/* ---------- Emergency Float: a ring of water with four gold jade bands (the lifebuoy of the icon), seen from above ---------- */
A.buoy=(()=>{let b='';for(let i=0;i<4;i++){const a=45+i*90;b+=`<g transform="rotate(${a} 60 60)"><rect x="54.5" y="4" width="11" height="28" rx="3" fill="url(#au)"/><circle cx="60" cy="18" r="3.4" fill="url(#jd)"/></g>`;}
  return S(120,120,rg('r',.5,.5,.5,[[.48,'#2fb8d0',.62],[.7,'#c8fbff',.6],[.9,'#2fb8d0',.72],[1,'#2fb8d0',0]])+lg('au',0,0,1,0,[[0,'#a86418'],[.5,'#ffd86a'],[1,'#a86418']])+lg('jd',0,0,1,1,[[0,'#e8fffa'],[.5,'#3fe0c8'],[1,'#0b6e66']])+blur('f',.8),
    `<path d="M6 60 A54 54 0 1 0 114 60 A54 54 0 1 0 6 60Z M31 60 A29 29 0 1 1 89 60 A29 29 0 1 1 31 60Z" fill="url(#r)" fill-rule="evenodd"/>${b}
     <g filter="url(#f)"><path d="M14 44 A49 49 0 0 1 44 12" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M84 70 A27 27 0 0 1 70 85" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".8"/></g>`);})();

/* ---------- loader: each SVG becomes a canvas at 2x ---------- */
const CV={};
for(const k in A){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=A[k].w*2;c.height=A[k].h*2;c.getContext('2d').drawImage(im,0,0,c.width,c.height);CV[k]=c;};
  im.onerror=()=>console.warn('axolotl art failed',k);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(A[k].svg);}
window.KTA={get:k=>CV[k]||null,size:k=>A[k]?[A[k].w,A[k].h]:[0,0],names:Object.keys(A),ready:()=>Object.keys(A).every(k=>CV[k]),svg:k=>A[k]&&A[k].svg};
})();
