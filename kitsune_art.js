/* Nine-tailed Kitsune Miko — vector art for the skill effects (owner 2026-11-20: "next, the nine-tailed fox" — same brief as
   the cat: SVG + code VFX, pretty and realistic, each effect matching its skill's concept, timing in step with the hits).
   Every piece is an SVG drawn here (gradients + soft blur, no dark outlines), rasterised ONCE to a canvas at 2x and then
   animated by kitsune_vfx.js. The concepts follow the kitsune's painted set in assets/fx/kitsune (fox fire, ofuda, torii,
   lanterns, moon blade, Yata mirror, falling stars, fox sun) so each skill keeps the idea the owner approved.
   Same registry as the cat's: window.KTA.get(name) -> canvas | null · window.KTA.size(name) -> [w,h] in world px. */
(()=>{
if(typeof CHAR!=='undefined'&&CHAR!=='kitsune'&&!window.__KI_ART_PREVIEW)return;
const XL='xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
const S=(w,h,defs,body)=>({w,h,svg:`<svg ${XL} width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`});
const lg=(id,x1,y1,x2,y2,stops,extra='')=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}>${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('')}</linearGradient>`;
const rg=(id,cx,cy,r,stops,extra='')=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" ${extra}>${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('')}</radialGradient>`;
const blur=(id,sd,pad=40)=>`<filter id="${id}" x="-${pad}%" y="-${pad}%" width="${100+2*pad}%" height="${100+2*pad}%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const A={};

/* ---------- fox fire (kitsune-bi): a flame with a curled tip. P = the pink fire of branch A, B = the blue spirit fire ---------- */
const FIRE={P:['#8a1a5a','#e23c92','#ff86c2','#ffd9ee','#ffffff'],B:['#1a3a8a','#3a8fe0','#7ad8ff','#d8f6ff','#ffffff']};
const WISP=[['M30 94 C10 90 4 70 12 52 C18 38 30 30 28 6 C40 20 51 34 51 54 C53 74 46 90 30 94Z','M30 90 C16 86 12 70 18 56 C22 46 30 40 30 24 C38 36 44 46 44 58 C45 74 40 86 30 90Z','M30 86 C22 84 20 74 24 66 C26 60 30 56 30 48 C34 56 37 62 37 68 C38 78 35 84 30 86Z'],
  ['M30 94 C12 92 3 74 10 56 C15 42 23 34 35 5 C38 24 52 36 52 56 C54 76 46 92 30 94Z','M30 90 C17 88 11 73 17 58 C21 47 27 40 34 24 C37 38 45 46 45 59 C46 75 40 88 30 90Z','M30 86 C23 85 19 76 23 67 C25 61 29 57 32 48 C34 57 38 62 38 69 C39 79 35 85 30 86Z']];
for(const c of ['P','B'])WISP.forEach((w,i)=>{const p=FIRE[c];A['wisp'+c+i]=S(60,96,
  rg('h',.5,.66,.5,[[0,p[2],.55],[1,p[2],0]])+lg('a',0,1,0,0,[[0,p[2]],[.55,p[1]],[1,p[0]]])+lg('b',0,1,0,0,[[0,p[3]],[1,p[2]]])+blur('f',.7),
  `<ellipse cx="30" cy="62" rx="30" ry="34" fill="url(#h)"/><g filter="url(#f)"><path d="${w[0]}" fill="url(#a)"/><path d="${w[1]}" fill="url(#b)"/><path d="${w[2]}" fill="${p[4]}"/></g>`);});

/* ---------- shrine things ---------- */
/* ofuda: a paper talisman, red seal, brush marks */
A.ofuda=S(40,88,lg('g',0,0,1,1,[[0,'#fffdf2'],[.6,'#fbeccd'],[1,'#e2c79a']])+rg('s',.5,.5,.5,[[0,'#ff5a3c'],[1,'#c81e1e']]),
  `<path d="M6 4 H34 V78 L20 86 L6 78Z" fill="url(#g)"/><path d="M6 4 H34 V11 H6Z" fill="#d8322c"/><path d="M6 72 L20 80 L34 72 V78 L20 86 L6 78Z" fill="#d8322c" opacity=".85"/>
   <circle cx="20" cy="24" r="8" fill="url(#s)"/><path d="M20 18.5 L21.6 22.4 L25.8 22.6 L22.6 25.2 L23.7 29.3 L20 27 L16.3 29.3 L17.4 25.2 L14.2 22.6 L18.4 22.4Z" fill="#fff3d8"/>
   <g stroke="#3a2618" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M14 38 C20 36 24 40 26 38"/><path d="M20 38 V58"/><path d="M13 48 C18 52 24 44 27 50"/><path d="M14 62 C18 58 23 66 27 61"/><path d="M20 62 V70"/></g>`);
/* torii gate: black-capped kasagi, vermilion pillars, a rope with paper streamers */
A.torii=S(200,190,lg('r',0,0,1,0,[[0,'#ff8a5e'],[.35,'#e8442c'],[1,'#a01c14']])+lg('k',0,0,0,1,[[0,'#5a4640'],[.5,'#2a1a1a'],[1,'#140c0c']])+lg('s',0,0,0,1,[[0,'#c9c2b8'],[1,'#7d766e']])+lg('p',0,0,1,0,[[0,'#ff9a70'],[.4,'#e8442c'],[1,'#8f1810']]),
  `<path d="M52 56 L46 176 H68 L63 56Z" fill="url(#p)"/><path d="M137 56 L132 176 H154 L148 56Z" fill="url(#p)"/>
   <path d="M38 172 H76 V185 H38Z" fill="url(#s)"/><path d="M124 172 H162 V185 H124Z" fill="url(#s)"/>
   <path d="M32 80 H168 V93 H32Z" fill="url(#r)"/><path d="M92 54 H108 V82 H92Z" fill="#3a2618"/><path d="M95 58 H105 V78 H95Z" fill="#ffd36a"/>
   <path d="M20 42 H180 V56 H20Z" fill="url(#r)"/><path d="M6 36 C44 47 156 47 194 36 L190 19 C150 30 50 30 10 19Z" fill="url(#k)"/><path d="M12 22 C50 32 150 32 188 22" stroke="#8a756a" stroke-width="2" fill="none" opacity=".8"/>
   <path d="M44 100 C80 114 120 114 156 100" stroke="#ead9a4" stroke-width="5.5" fill="none" stroke-linecap="round"/><path d="M44 100 C80 114 120 114 156 100" stroke="#b89a58" stroke-width="1.4" fill="none" stroke-dasharray="3 5"/>
   <g fill="#ffffff"><path d="M70 109 l-5 9 h5 l-5 9 h5 l-4 8 l9 -11 h-5 l5 -8 h-5 l4 -7Z"/><path d="M100 112 l-5 9 h5 l-5 9 h5 l-4 8 l9 -11 h-5 l5 -8 h-5 l4 -7Z"/><path d="M130 109 l-5 9 h5 l-5 9 h5 l-4 8 l9 -11 h-5 l5 -8 h-5 l4 -7Z"/></g>`);
/* suzu: the shrine bell */
A.bell=S(70,84,rg('g',.36,.34,.75,[[0,'#fff6c8'],[.45,'#ffd04a'],[.85,'#c9861c'],[1,'#8a5a10']])+rg('h',.5,.5,.5,[[0,'#ffe48a',.6],[1,'#ffe48a',0]]),
  `<circle cx="35" cy="46" r="34" fill="url(#h)"/><path d="M27 10 C27 2 43 2 43 10 V20 H27Z" fill="#c9861c"/><path d="M31 11 C31 7 39 7 39 11 V18 H31Z" fill="#6a4410"/>
   <circle cx="35" cy="46" r="25" fill="url(#g)"/><path d="M11 50 H59" stroke="#5a3a0a" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="50" r="4.4" fill="#5a3a0a"/><circle cx="50" cy="50" r="4.4" fill="#5a3a0a"/>
   <path d="M19 34 C23 27 30 24 37 24" stroke="#fffbe0" stroke-width="3" stroke-linecap="round" fill="none" opacity=".9"/><path d="M12 22 L6 28 L12 30Z" fill="#e8442c"/><path d="M58 22 L64 28 L58 30Z" fill="#e8442c"/>`);
/* nine tails fanned out behind the fox: cream fur, the tips already alight */
A.tails=(()=>{let g='';const an=[-76,-57,-38,-19,0,19,38,57,76],L=[112,128,142,152,158,152,142,128,112];
  for(const i of [0,8,1,7,2,6,3,5,4]){const l=L[i];g+=`<g transform="translate(130 184) rotate(${an[i]})"><path d="M0 0 C-17 ${-l*.24} -22 ${-l*.62} -2 ${-l} C0 ${-l-6} 4 ${-l-2} 3 ${-l+4} C22 ${-l*.6} 16 ${-l*.22} 0 0Z" fill="url(#g${i})"/><path d="M0 -6 C-6 ${-l*.3} -8 ${-l*.6} -1 ${-l*.9}" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".55"/></g>`;}
  return S(260,196,an.map((a,i)=>lg('g'+i,0,0,0,-L[i],[[0,'#fff8ee'],[.5,'#ffe9d6'],[.78,'#ffb0d2'],[1,'#ff5fa8']],'gradientUnits="userSpaceOnUse"')).join('')+rg('h',.5,.75,.6,[[0,'#ff8ac4',.5],[1,'#ff8ac4',0]]),
    `<ellipse cx="130" cy="110" rx="128" ry="96" fill="url(#h)"/>${g}`);})();
/* a paper fox lantern */
A.lantern=S(64,100,rg('g',.5,.5,.6,[[0,'#fffbe6'],[.5,'#ffd9a0'],[1,'#f08a5a']])+rg('h',.5,.5,.5,[[0,'#ffc070',.65],[1,'#ffc070',0]]),
  `<circle cx="32" cy="52" r="32" fill="url(#h)"/><path d="M26 6 C26 0 38 0 38 6 V14 H26Z" fill="none" stroke="#3a2618" stroke-width="2.4"/><path d="M18 14 H46 V22 H18Z" fill="#2a1a1a"/>
   <path d="M18 22 C4 34 4 68 18 80 H46 C60 68 60 34 46 22Z" fill="url(#g)"/><g stroke="#d8733a" stroke-width="1.2" opacity=".55" fill="none"><path d="M11 34 H53"/><path d="M8 46 H56"/><path d="M8 58 H56"/><path d="M11 70 H53"/></g>
   <path d="M18 80 H46 V87 H18Z" fill="#2a1a1a"/><path d="M32 87 V98" stroke="#e8442c" stroke-width="3" stroke-linecap="round"/>
   <path d="M19 44 C23 40 27 42 28 46" stroke="#c8281e" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="M45 44 C41 40 37 42 36 46" stroke="#c8281e" stroke-width="2.6" stroke-linecap="round" fill="none"/>
   <path d="M29 56 L32 60 L35 56Z" fill="#3a2618"/><path d="M22 62 L14 60 M22 66 L14 68 M42 62 L50 60 M42 66 L50 68" stroke="#c8281e" stroke-width="1.6" stroke-linecap="round"/>`);
/* the leaf a fox changes shape with */
A.leaf=S(44,40,lg('g',0,0,1,1,[[0,'#c6f08a'],[.5,'#5fc04a'],[1,'#1f7a34']]),`<path d="M4 34 C2 16 16 2 40 4 C42 26 28 40 4 34Z" fill="url(#g)"/><path d="M6 32 C16 24 26 16 36 8" stroke="#e6ffc0" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"/>`);
/* sacred rice: a sheaf of golden ears tied with a red cord */
A.rice=(()=>{let g='';const st=[[-34,-8],[-18,-22],[0,-28],[18,-22],[34,-8]];st.forEach(([dx,dy],i)=>{const x1=60+dx*1.25,y1=40+dy*.5+Math.abs(dx)*.5;g+=`<path d="M60 116 C${60+dx*.3} 90 ${60+dx*.9} 70 ${x1} ${y1}" stroke="#d8a428" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    for(let k=0;k<6;k++){const u=k/5,gx=x1-dx*.36*u+(k%2?4.5:-4.5),gy=y1+u*30-Math.abs(dx)*.1*u;g+=`<ellipse cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" rx="3.6" ry="6.4" transform="rotate(${(dx*.7+(k%2?24:-24)).toFixed(0)} ${gx.toFixed(1)} ${gy.toFixed(1)})" fill="url(#g)"/>`;}});
  return S(120,124,rg('g',.35,.3,.8,[[0,'#fff6c0'],[.6,'#ffd04a'],[1,'#c9861c']])+rg('h',.5,.45,.5,[[0,'#ffe48a',.5],[1,'#ffe48a',0]]),
    `<ellipse cx="60" cy="56" rx="58" ry="54" fill="url(#h)"/>${g}<path d="M52 98 H68 V108 H52Z" fill="#e8442c"/><path d="M52 103 L44 114 M68 103 L76 114" stroke="#e8442c" stroke-width="3" stroke-linecap="round"/>`);})();
/* the white fox mask */
A.mask=S(110,112,lg('g',0,0,0,1,[[0,'#ffffff'],[.7,'#f6efe6'],[1,'#d9cdc0']])+rg('h',.5,.5,.5,[[0,'#ff8ac4',.5],[1,'#ff8ac4',0]]),
  `<circle cx="55" cy="58" r="54" fill="url(#h)"/><path d="M18 8 L38 34 L20 46Z" fill="url(#g)"/><path d="M92 8 L72 34 L90 46Z" fill="url(#g)"/><path d="M22 16 L34 33 L24 39Z" fill="#e8442c"/><path d="M88 16 L76 33 L86 39Z" fill="#e8442c"/>
   <path d="M20 40 C22 26 88 26 90 40 C96 62 76 92 55 106 C34 92 14 62 20 40Z" fill="url(#g)"/>
   <path d="M49 32 L55 46 L61 32 C58 29 52 29 49 32Z" fill="#e8442c"/><path d="M28 56 C34 48 44 50 48 58 C42 60 34 60 28 56Z" fill="#2a1a1a"/><path d="M82 56 C76 48 66 50 62 58 C68 60 76 60 82 56Z" fill="#2a1a1a"/>
   <path d="M33 55 C37 52 42 53 45 57" stroke="#ffc23a" stroke-width="1.8" fill="none"/><path d="M77 55 C73 52 68 53 65 57" stroke="#ffc23a" stroke-width="1.8" fill="none"/>
   <path d="M25 66 C30 70 36 71 40 70 M24 74 C30 77 35 77 39 76 M85 66 C80 70 74 71 70 70 M86 74 C80 77 75 77 71 76" stroke="#e8442c" stroke-width="2.4" stroke-linecap="round" fill="none"/>
   <path d="M50 88 L55 96 L60 88 C57 86 53 86 50 88Z" fill="#2a1a1a"/>`);

/* ---------- the moon ---------- */
const MOON=rg('g',.4,.36,.75,[[0,'#ffffff'],[.55,'#eef2ff'],[.9,'#c4ccff'],[1,'#9a98ec']])+rg('h',.5,.5,.5,[[0,'#c8d4ff',.6],[.6,'#b8a8ff',.25],[1,'#b8a8ff',0]]);
/* crescent blade */
A.moonC=S(120,120,MOON+`<mask id="m"><rect width="120" height="120" fill="#fff"/><circle cx="80" cy="52" r="45" fill="#000"/></mask><mask id="m2"><rect width="120" height="120" fill="#fff"/><circle cx="75" cy="55" r="47" fill="#000"/></mask>`+blur('b',5),
  `<circle cx="52" cy="62" r="54" fill="#b8a8ff" opacity=".4" mask="url(#m)" filter="url(#b)"/><circle cx="60" cy="60" r="52" fill="url(#g)" mask="url(#m)"/><circle cx="60" cy="60" r="52" fill="#ffffff" mask="url(#m2)"/>`);
/* full moon */
A.moonF=S(150,150,MOON+rg('c',.5,.5,.5,[[0,'#a8a4e8',.5],[1,'#a8a4e8',0]]),
  `<circle cx="75" cy="75" r="75" fill="url(#h)"/><circle cx="75" cy="75" r="56" fill="url(#g)"/><ellipse cx="94" cy="60" rx="15" ry="12" fill="url(#c)"/><ellipse cx="60" cy="96" rx="18" ry="13" fill="url(#c)"/><ellipse cx="98" cy="98" rx="9" ry="7" fill="url(#c)"/><ellipse cx="52" cy="58" rx="8" ry="6" fill="url(#c)"/>
   <path d="M34 50 C44 32 62 24 80 24" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".9"/>`);
/* Yata no Kagami: the eight-lobed bronze mirror */
A.mirror=(()=>{let l='';for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8;l+=`<circle cx="${(55+Math.cos(a)*41).toFixed(1)}" cy="${(54+Math.sin(a)*41).toFixed(1)}" r="13" fill="url(#z)"/>`;}
  return S(110,132,rg('z',.38,.34,.8,[[0,'#ffe9a8'],[.5,'#d89a3a'],[1,'#7a4a12']])+rg('g',.4,.36,.75,[[0,'#ffffff'],[.6,'#e6f0ff'],[1,'#9db8f0']])+rg('h',.5,.5,.5,[[0,'#c8d4ff',.55],[1,'#c8d4ff',0]]),
    `<circle cx="55" cy="54" r="55" fill="url(#h)"/>${l}<circle cx="55" cy="54" r="42" fill="url(#z)"/><circle cx="55" cy="54" r="33" fill="#6a4410"/><circle cx="55" cy="54" r="30" fill="url(#g)"/>
     <path d="M36 44 L62 30 L68 36 L40 52Z" fill="#ffffff" opacity=".85"/><path d="M52 66 L70 56 L73 60 L55 70Z" fill="#ffffff" opacity=".6"/><path d="M55 96 V118" stroke="#e8442c" stroke-width="3.4" stroke-linecap="round"/><path d="M49 116 H61 L58 130 H52Z" fill="#e8442c"/>`);})();
/* Tsukuyomi: a robed figure holding a mirror, standing in the full moon */
A.moonGod=S(300,330,MOON+lg('r',0,0,0,1,[[0,'#5a58b8'],[.55,'#34307a'],[1,'#1c1a4a',0]])+lg('e',0,0,1,0,[[0,'#c8d4ff',.9],[.5,'#c8d4ff',0]])+rg('m',.5,.5,.5,[[0,'#ffffff'],[.6,'#eaf2ff'],[1,'#b8ccff',0]]),
  `<circle cx="150" cy="140" r="140" fill="url(#h)"/><circle cx="150" cy="140" r="108" fill="url(#g)"/>
   <path d="M150 74 C136 74 130 86 132 98 C118 104 100 118 88 150 C74 186 60 250 52 322 H248 C240 250 226 186 212 150 C200 118 182 104 168 98 C170 86 164 74 150 74Z" fill="url(#r)"/>
   <path d="M142 74 L150 44 L158 74Z" fill="#34307a"/><path d="M88 150 C74 186 60 250 52 322 H76 C82 250 94 190 108 150Z" fill="url(#e)"/>
   <path d="M132 112 C140 122 160 122 168 112 L176 170 C160 178 140 178 124 170Z" fill="#7a78d8" opacity=".7"/><circle cx="150" cy="176" r="30" fill="url(#m)"/><circle cx="150" cy="176" r="15" fill="#ffffff"/>`);
/* Tamamo's sun: a sun of fox fire with a fox's eyes */
A.sun=(()=>{let r='';for(let i=0;i<9;i++)r+=`<path transform="rotate(${i*40} 120 120)" d="M106 62 C100 40 112 26 120 6 C128 26 140 40 134 62Z" fill="url(#f)"/>`;
  return S(240,240,rg('g',.42,.4,.7,[[0,'#ffffff'],[.4,'#fff0a8'],[.8,'#ffa64a'],[1,'#ff6a8a']])+lg('f',0,1,0,0,[[0,'#ffb04a'],[.6,'#ff6a9a'],[1,'#d83a8c']])+rg('h',.5,.5,.5,[[0,'#ff9a6a',.6],[.7,'#ff7ab8',.25],[1,'#ff7ab8',0]])+blur('b',.8),
    `<circle cx="120" cy="120" r="120" fill="url(#h)"/><g filter="url(#b)">${r}</g><circle cx="120" cy="120" r="64" fill="url(#g)"/>
     <path d="M88 112 C96 102 108 104 112 114 C104 117 94 117 88 112Z" fill="#c8361a"/><path d="M152 112 C144 102 132 104 128 114 C136 117 146 117 152 112Z" fill="#c8361a"/><path d="M116 136 L120 142 L124 136Z" fill="#c8361a"/>
     <path d="M84 128 C90 133 97 134 102 133 M156 128 C150 133 143 134 138 133" stroke="#e8623a" stroke-width="2.6" stroke-linecap="round" fill="none"/>`);})();

/* ---------- petals (Burning Petals; same shapes as the cat's so the shared petal code can use them) ---------- */
['M20 50 C6 40 2 22 12 5 L20 12 L28 5 C38 22 34 40 20 50Z','M18 50 C4 38 4 18 16 4 L21 12 L30 7 C36 22 32 40 18 50Z','M20 50 C12 40 10 22 16 6 L20 12 L25 6 C30 22 28 40 20 50Z'].forEach((d,i)=>{
  A['petal'+i]=S(40,54,lg('g',0,1,0,0,[[0,'#f0387f'],[.45,'#ff8fb8'],[1,'#fff1f6']]),`<path d="${d}" fill="url(#g)"/>`);});

/* ---------- loader: each SVG becomes a canvas at 2x ---------- */
const CV={};
for(const k in A){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=A[k].w*2;c.height=A[k].h*2;c.getContext('2d').drawImage(im,0,0,c.width,c.height);CV[k]=c;};
  im.onerror=()=>console.warn('kitsune art failed',k);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(A[k].svg);}
window.KTA={get:k=>CV[k]||null,size:k=>A[k]?[A[k].w,A[k].h]:[0,0],names:Object.keys(A),ready:()=>Object.keys(A).every(k=>CV[k])};
})();
