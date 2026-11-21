/* Golden Fleece Sheep "Chrysie" — vector art for the skill effects v3 (owner 2026-11-21: "ทำของแกะขนทองให้หน่อย" = the same brief
   as the croc: every skill made with SVG + code VFX, matching its concept and what it really does).
   Every piece is an SVG drawn here (gradients + soft blur, no dark outlines: shapes are told apart by value, VFX_STYLE_REF_TH.md),
   rasterised ONCE to a canvas at 2x and then animated by sheep_vfx.js.
   Themes: golden wool (tufts, wool balls, the woolly cloud) · Greek light (Apollo's sun, the Greek-key ring, Ionic marble columns,
           laurel, Athena's Aegis, Hermes' wings, the Rod of Asclepius, the lyre, the overflowing cup)
           · Medea's sorcery (golden needle + thread, lullaby notes, sleep Zs, the hex sigil and curse eye, the sleeping Colchian
             dragon, the sirens, the bronze cauldron, the dream bubble) · the Golden Fleece of Colchis, the golden ram, the sun wheel.
   Same registry as the cat's / croc's: window.KTA.get(name) -> canvas | null · window.KTA.size(name) -> [w,h] in world px. */
(()=>{
if(typeof CHAR!=='undefined'&&CHAR!=='sheep'&&!window.__SH_ART_PREVIEW)return;
const XL='xmlns="http://www.w3.org/2000/svg"';
const S=(w,h,defs,body)=>({w,h,svg:`<svg ${XL} width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`});
const stops=a=>a.map(([o,c,op])=>`<stop offset="${o}" stop-color="${c}"${op!=null?` stop-opacity="${op}"`:''}/>`).join('');
const lg=(id,x1,y1,x2,y2,a,ex='')=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${ex}>${stops(a)}</linearGradient>`;
const rg=(id,cx,cy,r,a,ex='')=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" ${ex}>${stops(a)}</radialGradient>`;
const blur=(id,sd,pad=40)=>`<filter id="${id}" x="-${pad}%" y="-${pad}%" width="${100+2*pad}%" height="${100+2*pad}%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const f1=v=>(+v).toFixed(1),TAU=Math.PI*2,D2R=Math.PI/180;
const poly=pts=>pts.map((p,i)=>(i?'L':'M')+f1(p[0])+' '+f1(p[1])).join(' ')+'Z';
const pl=(x,y,r,a)=>[x+Math.cos(a)*r,y+Math.sin(a)*r];
const A={};

/* =====================================================================
   1. WOOL — every curl is its own lit ball (light top-left) with a darker swirl: reads as fleece, never as a dot
   ===================================================================== */
const WC={cream:[[0,'#ffffff'],[.4,'#fff4d6'],[.78,'#f1d79c'],[1,'#c99c52']],gold:[[0,'#fffbe6'],[.35,'#ffe48a'],[.75,'#ffbd3c'],[1,'#c27618']]};
const SW={cream:'#d4ae68',gold:'#c4801c'};
const curl=(x,y,r,id,sw)=>`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="url(#${id})"/><path d="M${f1(x-r*.5)} ${f1(y+r*.12)} a${f1(r*.42)} ${f1(r*.42)} 0 1 1 ${f1(r*.62)} ${f1(r*.34)}" stroke="${sw}" stroke-width="${f1(Math.max(.7,r*.17))}" fill="none" stroke-linecap="round" opacity=".55"/>`;
const curls=(cs,id,sw)=>cs.slice().sort((a,b)=>a[1]-b[1]).map(c=>curl(c[0],c[1],c[2],id,sw)).join('');
[[[5,11,4],[8,9,6],[15,8,6.5],[19,12,4.6],[11,13,5]],[[6,10,5.5],[13,7,6],[18,11,5],[10,13,4.6],[16,14,3.6]],[[7,8,5],[14,10,6.4],[6,13,4],[19,9,4.2],[12,14,4]]].forEach((cs,i)=>{
  A['wool'+i]=S(24,18,rg('w',.38,.32,.75,WC.cream),curls(cs,'w',SW.cream));
  A['woolG'+i]=S(24,18,rg('w',.38,.32,.75,WC.gold),curls(cs,'w',SW.gold));});
{const cs=[[17,17,5.4]];for(let i=0;i<7;i++){const a=i/7*TAU+.3;cs.push([17+Math.cos(a)*9.4,17+Math.sin(a)*9.4,4.6]);}
 A.woolBall=S(34,34,rg('b',.36,.32,.72,[[0,'#fff6c8'],[.4,'#ffd560'],[.85,'#e69a24'],[1,'#a85e12']])+rg('w',.38,.32,.75,WC.gold)+blur('h',1.6),
  `<circle cx="17" cy="17" r="15.6" fill="url(#b)"/>${curls(cs,'w',SW.gold)}<ellipse cx="11" cy="10" rx="5.4" ry="3.2" fill="#ffffff" opacity=".6" transform="rotate(-35 11 10)" filter="url(#h)"/>`);}
/* the woolly cloud (Woolly Cloud): curls heaped into a cloud, warm gold light under it */
{const cs=[[30,64,19],[58,57,25],[92,54,29],[126,58,25],[148,67,17],[70,36,21],[104,31,23],[48,45,17],[131,43,17],[86,66,22],[116,70,18],[44,70,16]];
 A.cloud=S(172,96,rg('w',.38,.3,.78,WC.cream)+rg('u',.5,.85,.6,[[0,'#ffd36a',.7],[.6,'#ffbd3c',.25],[1,'#ffbd3c',0]])+blur('b',4),
  `<ellipse cx="88" cy="76" rx="76" ry="16" fill="url(#u)" filter="url(#b)"/><ellipse cx="88" cy="70" rx="68" ry="13" fill="#f3dfae"/>${curls(cs,'w',SW.cream)}
   <path d="M22 78 C60 88 120 88 158 76" stroke="#ffcf5a" stroke-width="4" fill="none" opacity=".55" filter="url(#b)"/>`);}

/* =====================================================================
   2. GREEK LIGHT
   ===================================================================== */
/* golden feather (tip up) and a golden wing (root bottom-left, feathers fan up and to the right) */
A.feather=S(14,42,lg('g',0,0,0,1,[[0,'#ffffff'],[.3,'#fff0b8'],[.75,'#ffc84a'],[1,'#c88a2a']]),
  `<path d="M7 1 C11.5 7 13 19 10.5 31 C9.6 35 8.4 38 7 41 C5.6 38 4.4 35 3.5 31 C1 19 2.5 7 7 1Z" fill="url(#g)"/>
   <g stroke="#d9a040" stroke-width=".7" opacity=".55"><path d="M7 14 L10.6 10"/><path d="M7 20 L11.4 16"/><path d="M7 26 L11 22.6"/><path d="M7 16 L3.4 12"/><path d="M7 22 L2.8 18.4"/><path d="M7 28 L3.2 25"/></g>
   <path d="M7 40 L7 4" stroke="#fffaf0" stroke-width=".9"/>`);
{const fea=(L,w,a,id,o=8,q=50)=>`<path transform="translate(${o} ${q}) rotate(${a})" d="M0 ${-w*.5} C${L*.35} ${-w*.8} ${L*.75} ${-w*.55} ${L} 0 C${L*.75} ${w*.45} ${L*.35} ${w*.6} 0 ${w*.5}Z" fill="url(#${id})"/>`;
 const rach=(L,a)=>`<path transform="translate(8 50) rotate(${a})" d="M2 0 L${L*.9} 0" stroke="#fffaf0" stroke-width=".8" opacity=".75"/>`;
 let pr='',se='',cv='';[[76,11,-22],[72,11,-34],[66,11,-46],[58,10,-58],[48,10,-70]].forEach(([L,w,a])=>pr+=fea(L,w,a,'p')+rach(L,a));
 [[48,10,-28],[45,10,-40],[41,9,-52],[35,9,-64]].forEach(([L,w,a])=>se+=fea(L,w,a,'s')+rach(L,a));
 [[26,10,-18],[25,10,-32],[24,10,-46],[22,9,-60],[19,9,-74],[16,8,-88]].forEach(([L,w,a])=>cv+=fea(L,w,a,'c'));
 [[15,9,-26],[14,9,-44],[13,8,-62],[11,8,-80]].forEach(([L,w,a])=>cv+=fea(L,w,a,'c2'));
 A.wing=S(86,58,lg('p',0,0,1,0,[[0,'#c8862a'],[.45,'#ffc84a'],[.82,'#fff0b8'],[1,'#ffffff']])+lg('s',0,0,1,0,[[0,'#e0a040'],[.5,'#ffe08a'],[1,'#fffaf0']])
   +lg('c',0,0,1,0,[[0,'#ffd36a'],[.6,'#fff2c0'],[1,'#ffffff']])+lg('c2',0,0,1,0,[[0,'#ffe9a0'],[1,'#ffffff']])+blur('b',2.5),
  `<ellipse cx="44" cy="30" rx="40" ry="20" fill="#ffd36a" opacity=".3" filter="url(#b)" transform="rotate(-40 44 30)"/>${pr}${se}${cv}<circle cx="9" cy="50" r="4.4" fill="#ffe9a0"/>`);}
/* Apollo's sun: white-hot disk, alternating flame rays and short rays, soft glow */
{let rays='';for(let i=0;i<16;i++){const a=i/16*TAU-Math.PI/2;
   if(i%2===0){const b1=pl(80,80,38,a-.13),b2=pl(80,80,38,a+.13),c1=pl(80,80,60,a+.16),c2=pl(80,80,58,a+.02),tp=pl(80,80,77,a+.07);
     rays+=`<path d="M${f1(b1[0])} ${f1(b1[1])} Q${f1(c1[0])} ${f1(c1[1])} ${f1(tp[0])} ${f1(tp[1])} Q${f1(c2[0])} ${f1(c2[1])} ${f1(b2[0])} ${f1(b2[1])}Z" fill="url(#r)"/>`;}
   else{const b1=pl(80,80,38,a-.08),b2=pl(80,80,38,a+.08),tp=pl(80,80,60,a);rays+=`<path d="${poly([b1,tp,b2])}" fill="url(#r)" opacity=".9"/>`;}}
 A.sun=S(160,160,rg('g',.5,.5,.5,[[0,'#ffd36a',.6],[.55,'#ffb02a',.25],[1,'#ff9a1a',0]])+`<radialGradient id="r" gradientUnits="userSpaceOnUse" cx="80" cy="80" r="78">${stops([[.45,'#fff4c0'],[.72,'#ffb534'],[1,'#ff7a1a']])}</radialGradient>`
   +rg('d',.5,.45,.55,[[0,'#ffffff'],[.45,'#fff6c8'],[.82,'#ffd04a'],[1,'#f0a02a']]),
  `<circle cx="80" cy="80" r="79" fill="url(#g)"/>${rays}<circle cx="80" cy="80" r="40" fill="url(#d)"/><circle cx="80" cy="80" r="33" fill="none" stroke="#fff6d0" stroke-width="1.6" opacity=".8"/>
   <circle cx="80" cy="80" r="25" fill="#ffffff" opacity=".55"/>`);}
/* Greek key (meander) ring — flat on the ground */
{const C=120,rO=111,rI=95,N=28,uW=4;let d='';const P2=(u,v)=>{const a=u/(N*uW)*TAU,r=rO-v/4*(rO-rI);return [C+Math.cos(a)*r,C+Math.sin(a)*r];};
 const seg=(u0,v0,u1,v1)=>{const n=Math.max(1,Math.round(Math.abs(u1-u0)*3));let s='';for(let i=1;i<=n;i++){const p=P2(u0+(u1-u0)*i/n,v0+(v1-v0)*i/n);s+=` L${f1(p[0])} ${f1(p[1])}`;}return s;};
 for(let k=0;k<N;k++){const o=k*uW,pts=[[0,4],[0,0],[3,0],[3,3],[1.5,3],[1.5,1.5]];const p0=P2(o+pts[0][0],pts[0][1]);d+=`M${f1(p0[0])} ${f1(p0[1])}`;for(let i=1;i<pts.length;i++)d+=seg(o+pts[i-1][0],pts[i-1][1],o+pts[i][0],pts[i][1]);}
 A.meander=S(240,240,blur('b',2.6)+rg('f',.5,.5,.5,[[0,'#ffd36a',0],[.76,'#ffd36a',0],[.86,'#ffd36a',.22],[.95,'#ffd36a',.1],[1,'#ffd36a',0]]),
  `<circle cx="120" cy="120" r="119" fill="url(#f)"/>
   <g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${d}" stroke="#ff9a1a" stroke-width="5" opacity=".55" filter="url(#b)"/>
   <circle cx="120" cy="120" r="${rI}" stroke="#ff9a1a" stroke-width="5" opacity=".5" filter="url(#b)"/><circle cx="120" cy="120" r="114.5" stroke="#ff9a1a" stroke-width="4" opacity=".45" filter="url(#b)"/>
   <path d="${d}" stroke="#ffe9a0" stroke-width="2.2"/><circle cx="120" cy="120" r="${rI}" stroke="#fff2c0" stroke-width="2.6"/><circle cx="120" cy="120" r="114.5" stroke="#ffe9a0" stroke-width="1.8"/></g>`);}
/* Ionic marble column (stands on its base: anchor at the bottom) */
{let fl='';for(const x of [14,18.5,23,27.5,32])fl+=`<path d="M${x} 28 L${x+(x-22)*.04} 112" stroke="#aeb7cc" stroke-width="1.1" opacity=".75"/><path d="M${x+1.2} 28 L${x+1.2+(x-22)*.04} 112" stroke="#ffffff" stroke-width=".8" opacity=".7"/>`;
 const vol=x=>`<circle cx="${x}" cy="17" r="5.6" fill="url(#m)"/><path d="M${x} 17 m-3.4 0 a3.4 3.4 0 1 1 3.4 3.4 a2 2 0 1 1 -2 -2" stroke="#a9b2c8" stroke-width="1.2" fill="none"/><circle cx="${x}" cy="17" r="1.3" fill="#ffcf5a"/>`;
 A.column=S(44,132,lg('s',0,0,1,0,[[0,'#aab3c8'],[.3,'#ffffff'],[.62,'#eef1f7'],[1,'#9aa4bc']])+rg('m',.35,.3,.8,[[0,'#ffffff'],[.6,'#eef1f7'],[1,'#b8c0d4']])+lg('g',0,0,0,1,[[0,'#fff2b8'],[.5,'#ffc84a'],[1,'#c88a2a']]),
  `<path d="M10 26 L34 26 L35.6 114 L8.4 114Z" fill="url(#s)"/>${fl}
   <rect x="9" y="22.5" width="26" height="3.6" rx="1" fill="url(#g)"/><path d="M7 14 L37 14 L35 22.5 L9 22.5Z" fill="url(#s)"/><rect x="2" y="9.5" width="40" height="5" rx="1.6" fill="url(#s)"/>${vol(6.5)}${vol(37.5)}
   <ellipse cx="22" cy="116" rx="16" ry="3.4" fill="url(#s)"/><rect x="3" y="118" width="38" height="13" rx="1.6" fill="url(#s)"/><rect x="3" y="118" width="38" height="2.4" fill="url(#g)" opacity=".9"/>`);}
/* Rod of Asclepius: golden staff, a green serpent winding up it */
{const sp='M22 140 C40 132 40 116 24 110 C8 104 8 88 24 82 C40 76 40 60 24 54 C10 48 12 34 26 28 C33 25 37 21 39 15';
 A.rod=S(50,150,lg('s',0,0,1,0,[[0,'#7a4a14'],[.35,'#d89a3a'],[.6,'#ffe6a0'],[1,'#a86a1c']])+lg('n',0,1,0,0,[[0,'#16683a'],[.5,'#2fb868'],[1,'#7ae6a0']])+blur('b',2.4)+rg('k',.35,.3,.8,[[0,'#ffffff'],[.5,'#fff0b0'],[1,'#d89a3a']]),
  `<path d="${sp}" stroke="#7affb0" stroke-width="12" fill="none" opacity=".45" filter="url(#b)"/>
   <path d="M21.4 10 C22.4 40 20.6 70 22 100 C22.6 118 21.4 132 22.4 148 L26.6 148 C27.6 132 26.4 118 27 100 C28.4 70 26.6 40 27.6 10Z" fill="url(#s)"/><circle cx="24.5" cy="9" r="4.4" fill="url(#k)"/>
   <path d="${sp}" stroke="url(#n)" stroke-width="6.6" fill="none" stroke-linecap="round"/><path d="${sp}" stroke="#d8ffe0" stroke-width="1.6" fill="none" stroke-dasharray="2.2 3" opacity=".7"/>
   <ellipse cx="41.5" cy="12.6" rx="6.4" ry="4.2" fill="#2fb868" transform="rotate(-24 41.5 12.6)"/><ellipse cx="42.6" cy="11.4" rx="3.6" ry="1.8" fill="#9af0c0" opacity=".8" transform="rotate(-24 42.6 11.4)"/>
   <circle cx="42.4" cy="11" r="1.2" fill="#ffd34a"/><path d="M47 10 L49.6 8.6 M47 10 L49.4 11.4" stroke="#ff6a6a" stroke-width=".8"/>`);}
/* laurel leaves (green for heals, gold for the crown) and the laurel crown */
for(const [k,c] of [['laurel',['#1f6a2c','#57b84a','#c8f4a0']],['laurelG',['#a8641a','#ffc23a','#fff4c8']]])
  A[k]=S(12,26,lg('g',0,1,0,0,[[0,c[0]],[.55,c[1]],[1,c[2]]]),`<path d="M6 1 C11 7 11.4 18 6 25 C.6 18 1 7 6 1Z" fill="url(#g)"/><path d="M6 24 L6 4" stroke="#ffffff" stroke-width=".8" opacity=".55"/>`);
{let L='';const cx=60,cy=34,rx=50,ry=22,leaf=(x,y,a,s,id)=>`<path transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${f1(s)})" d="M0 0 C4 -3 12 -3.4 16 0 C12 3.4 4 3 0 0Z" fill="url(#${id})"/>`;
 const items=[];for(const side of [-1,1])for(let i=0;i<10;i++){const th=.25+i*.27,x=cx+rx*Math.sin(th)*side,y=cy-ry*Math.cos(th),tx=Math.cos(th)*rx*side,ty=Math.sin(th)*ry,ta=Math.atan2(ty,tx)/D2R,s=.72+.42*(1-Math.cos(th))/2;
   items.push([y,leaf(x,y,ta-38,s,'g')+leaf(x,y,ta+38,s,'g')]);}
 items.sort((a,b)=>a[0]-b[0]);for(const it of items)L+=it[1];
 A.wreath=S(120,64,lg('g',0,0,1,0,[[0,'#c27618'],[.5,'#ffd04a'],[1,'#fff6d0']])+blur('b',2.2),
  `<ellipse cx="60" cy="34" rx="50" ry="22" fill="none" stroke="#ffcf5a" stroke-width="5" opacity=".4" filter="url(#b)"/>
   <path d="M${cx-4} ${cy+ry-1} C10 56 10 12 60 12 C110 12 110 56 ${cx+4} ${cy+ry-1}" stroke="#d89a3a" stroke-width="1.6" fill="none"/>${L}
   <path d="M55 56 L49 63 M65 56 L71 63" stroke="#ff7ab8" stroke-width="2.4" stroke-linecap="round"/><circle cx="60" cy="55.6" r="2.6" fill="#ffe08a"/>`);}
/* Aegis of Athena: round golden shield, a gorgoneion with snake hair in the middle */
{let sn='';for(let i=0;i<10;i++){const a=i/10*TAU-Math.PI/2,[x0,y0]=pl(55,55,15,a),[x1,y1]=pl(55,55,26,a+.18),[cx,cy]=pl(55,55,21,a-.22);sn+=`<path d="M${f1(x0)} ${f1(y0)} Q${f1(cx)} ${f1(cy)} ${f1(x1)} ${f1(y1)}" stroke="url(#n)" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="${f1(x1)}" cy="${f1(y1)}" r="2" fill="#4ac078"/>`;}
 A.aegis=S(110,110,`<radialGradient id="rim" cx=".5" cy=".5" r=".5">${stops([[.84,'#7a4a1a'],[.9,'#e0a040'],[.95,'#fff0b0'],[1,'#a86a1c']])}</radialGradient>`
   +rg('f',.4,.35,.7,[[0,'#fff6c8'],[.5,'#ffd04a'],[1,'#c8841c']])+rg('fc',.42,.38,.7,[[0,'#ffffff'],[.6,'#ffe9b0'],[1,'#e0a040']])+lg('n',0,0,1,1,[[0,'#2a9a5a'],[1,'#a8f0b8']])+blur('b',2),
  `<circle cx="55" cy="55" r="53" fill="url(#rim)"/><circle cx="55" cy="55" r="44.6" fill="url(#f)"/><circle cx="55" cy="55" r="37" fill="none" stroke="#fff0b0" stroke-width="1.6" opacity=".8"/><circle cx="55" cy="55" r="33.6" fill="none" stroke="#c8841c" stroke-width="1.2" opacity=".6"/>
   ${sn}<circle cx="55" cy="55" r="15" fill="url(#fc)"/><ellipse cx="49.6" cy="52.4" rx="2.4" ry="3" fill="#3a2410"/><ellipse cx="60.4" cy="52.4" rx="2.4" ry="3" fill="#3a2410"/><circle cx="50.2" cy="51.4" r=".9" fill="#fff"/><circle cx="61" cy="51.4" r=".9" fill="#fff"/>
   <path d="M49 60 Q55 64.6 61 60 Q55 62 49 60Z" fill="#a8301a"/>
   <path d="M20 34 A40 40 0 0 1 48 13" stroke="#ffffff" stroke-width="5" fill="none" opacity=".55" stroke-linecap="round" filter="url(#b)"/>`);}
/* the overflowing cup (golden kylix, light pours over its rim) */
A.cup=S(72,44,lg('g',0,0,1,0,[[0,'#a8641a'],[.3,'#ffd04a'],[.5,'#fff2b8'],[.75,'#e8a838'],[1,'#8a5014']])+rg('l',.5,.4,.6,[[0,'#ffffff'],[.6,'#fff6c8'],[1,'#ffd36a']])+blur('b',2),
  `<ellipse cx="36" cy="10" rx="30" ry="9" fill="#fff2b8" opacity=".55" filter="url(#b)"/><path d="M8 12 C10 24 24 29 36 29 C48 29 62 24 64 12Z" fill="url(#g)"/>
   <path d="M8 14 C2 12 1 20 8 21" stroke="url(#g)" stroke-width="2.6" fill="none"/><path d="M64 14 C70 12 71 20 64 21" stroke="url(#g)" stroke-width="2.6" fill="none"/>
   <ellipse cx="36" cy="12" rx="28" ry="5.4" fill="url(#l)"/><path d="M33 29 L33 36 L39 36 L39 29Z" fill="url(#g)"/><ellipse cx="36" cy="38.6" rx="12" ry="3.4" fill="url(#g)"/>
   <path d="M14 14 C13 18 14 21 15.6 23 C16.6 20 16 17 14 14Z" fill="#fff6c8" opacity=".9"/><path d="M58 14 C59.6 18 59 22 57 24 C56.2 21 56.6 17 58 14Z" fill="#fff6c8" opacity=".9"/>`);
/* the golden lyre (Healing Hymn, War Song) */
A.lyre=S(60,72,lg('g',0,0,1,0,[[0,'#b8741a'],[.4,'#ffd04a'],[.6,'#fff2b8'],[1,'#c88a2a']])+lg('b',0,0,0,1,[[0,'#ffd36a'],[1,'#a8641a']])+blur('h',2),
  `<ellipse cx="30" cy="40" rx="27" ry="30" fill="#ffd36a" opacity=".28" filter="url(#h)"/>
   <path d="M18 62 C8 52 4 36 10 22 C13 15 9 9 4 8 C10 4 18 8 18 16 C18 30 16 46 24 58Z" fill="url(#g)"/><path d="M42 62 C52 52 56 36 50 22 C47 15 51 9 56 8 C50 4 42 8 42 16 C42 30 44 46 36 58Z" fill="url(#g)"/>
   <rect x="11" y="15" width="38" height="4.4" rx="2" fill="url(#g)"/><g stroke="#fffaf0" stroke-width=".9" opacity=".95"><path d="M24 19 L24 58"/><path d="M27 19 L27 59"/><path d="M30 19 L30 59"/><path d="M33 19 L33 59"/><path d="M36 19 L36 58"/></g>
   <path d="M15 58 C20 70 40 70 45 58Z" fill="url(#b)"/><ellipse cx="30" cy="60.6" rx="12" ry="2.6" fill="#fff2b8" opacity=".7"/>`);
/* music notes in three colours: G = healing (green-gold), P = enchant (pink), V = siren (violet) */
for(const [s,c] of [['G',['#ffffff','#d8ffb8','#5ad88a','#1f8a4a']],['P',['#ffffff','#ffd0ef','#ff5cc0','#a81a72']],['V',['#ffffff','#e8d8ff','#a06aff','#5a1ab0']]]){
  const gr=lg('g',0,0,1,1,[[0,c[1]],[.55,c[2]],[1,c[3]]])+blur('b',1.4);
  A['noteA'+s]=S(20,30,gr,`<g opacity=".55" filter="url(#b)"><ellipse cx="8" cy="24" rx="6.6" ry="5" fill="${c[2]}" transform="rotate(-22 8 24)"/><path d="M13.6 24 L13.6 3" stroke="${c[2]}" stroke-width="3.4"/></g>
    <ellipse cx="8" cy="24" rx="6" ry="4.4" fill="url(#g)" transform="rotate(-22 8 24)"/><path d="M13.4 23 L13.4 3.4" stroke="url(#g)" stroke-width="2.2"/><path d="M13.4 3 C14.6 8 19.6 9 18.4 15.6 C17.8 12 15.6 10.6 13.4 10.4Z" fill="url(#g)"/><ellipse cx="6.2" cy="22.4" rx="2" ry="1.1" fill="${c[0]}" opacity=".85" transform="rotate(-22 6.2 22.4)"/>`);
  A['noteB'+s]=S(28,30,gr,`<g opacity=".55" filter="url(#b)"><ellipse cx="6.6" cy="25" rx="6" ry="4.6" fill="${c[2]}"/><ellipse cx="21" cy="21.4" rx="6" ry="4.6" fill="${c[2]}"/></g>
    <ellipse cx="6.6" cy="25" rx="5.4" ry="4" fill="url(#g)" transform="rotate(-22 6.6 25)"/><ellipse cx="21" cy="21.4" rx="5.4" ry="4" fill="url(#g)" transform="rotate(-22 21 21.4)"/>
    <path d="M11.4 24.4 L11.4 6.4 M25.8 20.6 L25.8 2.6" stroke="url(#g)" stroke-width="2.2"/><path d="M10.3 6.8 L26.9 2.2 L26.9 6.6 L10.3 11.2Z" fill="url(#g)"/><ellipse cx="5" cy="23.6" rx="1.8" ry="1" fill="${c[0]}" opacity=".85"/><ellipse cx="19.4" cy="20" rx="1.8" ry="1" fill="${c[0]}" opacity=".85"/>`);}
/* sleep Z (lavender) */
A.zzz=S(20,22,lg('g',0,0,1,1,[[0,'#ffffff'],[.5,'#dfe6ff'],[1,'#8a9ae8']])+blur('b',1.4),
  `<path d="M3.4 4 H16.6 L4.4 18 H17.4" stroke="#7a8ae0" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round" opacity=".55" filter="url(#b)"/><path d="M3.4 4 H16.6 L4.4 18 H17.4" stroke="url(#g)" stroke-width="3.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`);
/* golden rain drop (falls point up), Hermes' sandal print, enchant rune, prism shard */
A.dropG=S(10,22,lg('g',0,0,0,1,[[0,'#fffaf0'],[.45,'#ffe08a'],[1,'#e8901a']]),`<path d="M5 1 C7 7 9.6 11 9.6 15 C9.6 18.6 7.6 21 5 21 C2.4 21 .4 18.6 .4 15 C.4 11 3 7 5 1Z" fill="url(#g)"/><ellipse cx="3.5" cy="14.6" rx="1.4" ry="2.6" fill="#fff" opacity=".85"/>`);
A.print=S(30,18,rg('g',.45,.5,.6,[[0,'#fffbe0'],[.55,'#ffd04a'],[1,'#e8901a',.6]])+blur('b',1.6),
  `<path d="M2 9 C2 4 7 2.6 11 3.4 C14 4 15 5.6 18 5.4 C21.6 5.2 24 6.6 24 9 C24 11.4 21.6 12.8 18 12.6 C15 12.4 14 14 11 14.6 C7 15.4 2 14 2 9Z" fill="#ffb02a" opacity=".5" filter="url(#b)"/>
   <path d="M3 9 C3 5 7 3.6 11 4.4 C14 5 15 6.4 18 6.2 C21 6 23 7.2 23 9 C23 10.8 21 12 18 11.8 C15 11.6 14 13 11 13.6 C7 14.4 3 13 3 9Z" fill="url(#g)"/>
   <path d="M20 4 C23 1 27 1 29 2 C26 3.4 24 4.6 22 6Z M21 13.6 C24 16 27.4 16.4 29 15.6 C26 14.4 24 13.4 22.4 12Z" fill="#fff2b8"/>`);
A.rune=S(12,16,lg('g',0,0,1,1,[[0,'#ffffff'],[.4,'#ffc4ec'],[1,'#e0309a']]),`<path d="M6 .6 L11.4 8 L6 15.4 L.6 8Z" fill="url(#g)"/><path d="M6 3 L6 13 M3.4 8 L8.6 8" stroke="#ffffff" stroke-width=".9" opacity=".85"/>`);
A.prism=S(22,22,lg('g',0,0,1,1,[[0,'#ffffff'],[.3,'#bff4ff'],[.6,'#ffc4f0'],[1,'#fff2a0']])+blur('b',1.6),
  `<path d="M11 1.6 L20 19 L2 19Z" fill="#fff2b8" opacity=".5" filter="url(#b)"/><path d="M11 2.6 L19.4 18.4 L2.6 18.4Z" fill="url(#g)"/><path d="M11 2.6 L11 18.4 M11 10 L19.4 18.4" stroke="#ffffff" stroke-width=".9" opacity=".8"/>`);

/* =====================================================================
   3. MEDEA'S SORCERY
   ===================================================================== */
A.needle=S(44,8,lg('g',0,0,0,1,[[0,'#fff6d0'],[.45,'#ffd04a'],[1,'#b8741a']]),
  `<path d="M1 4 C1 2 3 1.6 7 2 L34 3 C38 3.2 41 3.6 43.6 4 C41 4.4 38 4.8 34 5 L7 6 C3 6.4 1 6 1 4Z" fill="url(#g)"/><ellipse cx="5.6" cy="4" rx="2.6" ry=".9" fill="#5a2a08" opacity=".8"/><path d="M9 3.2 L40 3.8" stroke="#ffffff" stroke-width=".7" opacity=".85"/>`);
/* the hex sigil (flat): Greek letters in a band, a hexagram, a crescent and an eye */
{const GL=['M1 12 L5 0 L9 12 M2.6 7.4 H7.4','M5 0 L10 12 H0Z','M1 0 H9 M2 6 H8 M1 12 H9','M1 12 V0 H9 V12','M9 0 H1 L6 6 L1 12 H9','M5 0 V12 M1.6 6 A3.4 3.6 0 1 0 8.4 6 A3.4 3.6 0 1 0 1.6 6','M1 1 C1 8 9 8 9 1 M5 0 V12','M1 12 H4 C0 9 0 2 5 1 C10 2 10 9 6 12 H9','M0 12 L5 0 L10 12','M5 0 A5 6 0 1 0 5.01 0 M1 6 H9'];
 let gl='';for(let i=0;i<10;i++){const a=i/10*TAU,[x,y]=pl(100,100,84,a);gl+=`<path transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a/D2R+90)}) translate(-5 -6)" d="${GL[i]}"/>`;}
 const tri=o=>poly([0,1,2].map(i=>pl(100,100,66,o+i*TAU/3)));
 A.hexSig=S(200,200,blur('b',3)+rg('e',.5,.5,.5,[[0,'#ffffff'],[.6,'#f6e8ff'],[1,'#d8b8ff']])+rg('i',.5,.5,.5,[[0,'#ffb0e8'],[.6,'#ff3aa8'],[1,'#7a0a5a']]),
  `<g fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="100" cy="100" r="96" stroke="#8a3aff" stroke-width="8" opacity=".5" filter="url(#b)"/><circle cx="100" cy="100" r="72" stroke="#8a3aff" stroke-width="6" opacity=".4" filter="url(#b)"/>
   <circle cx="100" cy="100" r="96" stroke="#ead8ff" stroke-width="2.6"/><circle cx="100" cy="100" r="72" stroke="#c49aff" stroke-width="1.6"/>
   <g stroke="#f0e0ff" stroke-width="1.7">${gl}</g><path d="${tri(-Math.PI/2)} ${tri(Math.PI/2)}" stroke="#b07aff" stroke-width="1.6" opacity=".85"/></g>
   <path d="M76 100 C86 86 114 86 124 100 C114 114 86 114 76 100Z" fill="url(#e)"/><circle cx="100" cy="100" r="9" fill="url(#i)"/><ellipse cx="100" cy="100" rx="2" ry="7" fill="#1a0420"/><circle cx="97" cy="97" r="1.8" fill="#fff"/>
   <path d="M88 76 A14 14 0 1 0 112 76 A11 11 0 1 1 88 76Z" fill="#ffd8f4" opacity=".9"/>`);}
/* the curse eye over a hexed enemy */
A.eye=S(32,20,rg('i',.5,.5,.5,[[0,'#ffb0e8'],[.6,'#ff3aa8'],[1,'#7a0a5a']])+lg('l',0,0,0,1,[[0,'#ffffff'],[1,'#e8d0ff']])+blur('b',1.6),
  `<path d="M1 10 C7 1 25 1 31 10 C25 19 7 19 1 10Z" fill="#9a4aff" opacity=".6" filter="url(#b)"/><path d="M3 10 C8 3.4 24 3.4 29 10 C24 16.6 8 16.6 3 10Z" fill="url(#l)"/>
   <circle cx="16" cy="10" r="5.2" fill="url(#i)"/><ellipse cx="16" cy="10" rx="1.3" ry="4.2" fill="#1a0420"/><circle cx="14.2" cy="8.2" r="1.2" fill="#fff"/><path d="M3 9.4 C8 2.6 24 2.6 29 9.4 C24 5.6 8 5.6 3 9.4Z" fill="#6a2ab8"/>`);
/* the golden ram spirit (side view, galloping to the right) */
{const leg=(x0,y0,x1,y1)=>`<path d="M${x0} ${y0} L${x1} ${y1}" stroke="url(#lg)" stroke-width="7" stroke-linecap="round"/><ellipse cx="${x1}" cy="${y1}" rx="4.4" ry="3" fill="#b8741a"/>`;
 const body=[[38,50,10],[50,40,11],[64,36,12],[78,37,12],[90,42,11],[44,62,10],[58,64,11],[72,64,11],[86,60,10],[96,52,10],[30,54,8],[66,50,13],[52,52,12],[82,50,12]];
 A.ram=S(154,104,rg('w',.38,.3,.78,WC.gold)+lg('lg',0,0,1,1,[[0,'#ffe08a'],[1,'#c8841c']])+lg('h',0,0,1,1,[[0,'#fff6d8'],[.6,'#ffd36a'],[1,'#e09a2a']])+lg('hr',0,0,1,1,[[0,'#fff4c8'],[.45,'#ffc84a'],[1,'#b8641a']])+blur('b',6)+blur('r',1.6),
  `<ellipse cx="78" cy="54" rx="70" ry="38" fill="#ffc84a" opacity=".38" filter="url(#b)"/>
   ${leg(44,62,20,88)}${leg(54,66,40,96)}${leg(92,62,124,84)}${leg(86,64,114,94)}
   ${curls([[18,46,6],[13,52,5]],'w',SW.gold)}${curls(body,'w',SW.gold)}${curls([[100,40,9],[94,48,9]],'w',SW.gold)}
   <path d="M98 30 C106 20 122 20 130 28 C138 34 145 44 143 50 C141 56 133 58 125 54 C117 50 107 48 100 44 C96 40 96 34 98 30Z" fill="url(#h)"/>
   <path d="M104 34 C100 36 97 42 99 46 C103 44 106 40 106 36Z" fill="#ffe7b0"/><path d="M137 48 C139 47 141 48 141 50" stroke="#c8841c" stroke-width="1.2" fill="none"/>
   <path d="M124 31 C127 28 132 29 133 32 C130 34 126 34 124 31Z" fill="#ffffff"/><circle cx="129" cy="31.6" r="1.4" fill="#fffbe0"/>
   <path d="M111 28 C103 12 82 14 84 31 C85 43 101 45 103 35 C104 29 96 27 94 33" stroke="url(#hr)" stroke-width="8" fill="none" stroke-linecap="round"/>
   <path d="M111 28 C103 12 82 14 84 31 C85 43 101 45 103 35" stroke="#fff6d8" stroke-width="1.4" fill="none" stroke-dasharray="1.6 3.2" opacity=".8"/>
   <path d="M40 30 C60 20 90 20 104 28" stroke="#ffffff" stroke-width="3" fill="none" opacity=".5" filter="url(#r)"/>`);}
/* the sleeping Colchian dragon (stands on its coils: anchor at the bottom), dreamy lavender */
A.dragon=S(222,124,lg('t',0,0,0,1,[[0,'#c8d4ff'],[.45,'#7a8ae0'],[1,'#343a8a']])+lg('hd',0,0,1,1,[[0,'#e4ecff'],[.5,'#9aa8f0'],[1,'#4a52a8']])+blur('b',6)+blur('s',1.2),
  `<ellipse cx="112" cy="90" rx="104" ry="32" fill="#8a9aff" opacity=".35" filter="url(#b)"/>
   <path d="M18 104 C40 72 92 72 112 98 C132 120 172 120 194 96 C204 86 212 80 216 82" stroke="url(#t)" stroke-width="22" fill="none" stroke-linecap="round"/>
   <path d="M60 94 C80 62 140 60 162 86" stroke="url(#t)" stroke-width="20" fill="none" stroke-linecap="round"/>
   <path d="M60 89 C80 58 140 56 162 81 M18 98 C40 66 92 66 112 92 C132 114 172 114 194 90" stroke="#e4ecff" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>
   <path d="M66 98 C82 72 138 70 156 92" stroke="#ffffff" stroke-width="2" fill="none" stroke-dasharray="3 4" opacity=".45"/>
   <g fill="#b8c4ff">${[[84,64],[100,58],[116,57],[132,61],[146,68]].map(([x,y])=>`<path d="M${x-5} ${y+4} L${x} ${y-7} L${x+5} ${y+4}Z"/>`).join('')}</g>
   <path d="M100 62 C94 48 78 44 64 48 C52 51 40 56 32 64 C28 68 30 74 38 76 C52 79 72 80 88 78 C98 76 102 70 100 62Z" fill="url(#hd)"/>
   <path d="M34 70 C50 74 72 75 92 72" stroke="#4a52a8" stroke-width="1.4" fill="none" opacity=".6"/><circle cx="38" cy="65" r="1.6" fill="#3a3f8a"/>
   <path d="M66 57 C70 61 76 61 80 57" stroke="#2a2f70" stroke-width="1.8" fill="none" stroke-linecap="round"/>
   <path d="M86 50 C94 40 102 36 112 34 C104 40 98 46 92 52Z M80 49 C84 38 90 30 98 26 C93 34 90 42 87 49Z" fill="#dfe6ff"/>
   <path d="M90 66 C98 70 104 76 106 84 C100 80 94 76 88 74Z" fill="#a8b8f0" opacity=".9"/>
   <path d="M40 52 C56 44 80 42 96 50" stroke="#ffffff" stroke-width="2.4" fill="none" opacity=".55" filter="url(#s)"/>`);
/* a siren: a bird-woman with wings for arms, long hair, a feathered tail */
{const wf=(x,y,a,L,w)=>`<path transform="translate(${x} ${y}) rotate(${a})" d="M0 ${-w*.5} C${L*.4} ${-w*.8} ${L*.8} ${-w*.4} ${L} 0 C${L*.8} ${w*.4} ${L*.4} ${w*.6} 0 ${w*.5}Z" fill="url(#w)"/>`;
 let wg='';for(const s of [-1,1])for(const [L,a] of [[34,-30],[30,-48],[24,-64],[22,-14]])wg+=wf(33+s*4,36,s>0?a:180-a,L,7);
 A.siren=S(66,98,lg('w',0,0,1,0,[[0,'#5a1ab0'],[.5,'#a06aff'],[1,'#f0e0ff']])+lg('b',0,0,0,1,[[0,'#e8d8ff'],[.5,'#a87aff'],[1,'#5a1ab0']])+lg('h',0,0,0,1,[[0,'#ff8ad8'],[1,'#7a2ac8']])+blur('g',4)+blur('s',1),
  `<ellipse cx="33" cy="48" rx="31" ry="42" fill="#b07aff" opacity=".35" filter="url(#g)"/>${wg}
   <path d="M26 18 C22 30 18 42 20 54 C24 46 26 38 28 30Z M40 18 C44 30 48 42 46 54 C42 46 40 38 38 30Z" fill="url(#h)"/>
   <path d="M27 32 C27 30 39 30 39 32 C40 42 38 52 36 58 L30 58 C28 52 26 42 27 32Z" fill="url(#b)"/>
   <path d="M30 58 C26 66 22 78 24 92 C28 84 31 76 33 66 C35 76 38 84 42 92 C44 78 40 66 36 58Z" fill="url(#w)"/>
   <path d="M30 60 L28 70 M36 60 L38 70" stroke="#ffb0f0" stroke-width="1.2" opacity=".7"/>
   <circle cx="33" cy="22" r="8.4" fill="#f0e6ff"/><path d="M24.6 22 C24 12 30 9 33 9 C38 9 42.6 12 41.4 22 C39 16 36 14.6 33 14.6 C30 14.6 27 16 24.6 22Z" fill="url(#h)"/>
   <path d="M29 22 Q30.4 23.6 31.8 22 M34.2 22 Q35.6 23.6 37 22" stroke="#7a2ac8" stroke-width="1" fill="none"/><ellipse cx="33" cy="26.4" rx="1.4" ry="1.8" fill="#ff5cc0"/>
   <path d="M28 16 C30 13 36 13 38 16" stroke="#ffffff" stroke-width="1.2" fill="none" opacity=".6" filter="url(#s)"/>`);}
/* Medea's bronze cauldron with a green brew (violet glints) */
A.cauldron=S(66,62,lg('b',0,0,1,0,[[0,'#3a200e'],[.28,'#c8823a'],[.42,'#ffd08a'],[.7,'#a8642a'],[1,'#4a2810']])+lg('r',0,0,0,1,[[0,'#ffe0a0'],[1,'#8a5420']])+rg('w',.5,.45,.6,[[0,'#f4ffe8'],[.45,'#8aff6a'],[1,'#2a9a3a']])+blur('g',3.4),
  `<ellipse cx="33" cy="18" rx="24" ry="9" fill="#7aff6a" opacity=".5" filter="url(#g)"/>
   <path d="M15 50 L13 60 L19 60 L20 52Z M51 50 L53 60 L47 60 L46 52Z M31 54 L30 62 L36 62 L35 54Z" fill="#5a3416"/>
   <path d="M8 27 C8 50 20 57 33 57 C46 57 58 50 58 27Z" fill="url(#b)"/>
   <ellipse cx="7" cy="31" rx="3.6" ry="4.4" fill="none" stroke="#c8823a" stroke-width="2.2"/><ellipse cx="59" cy="31" rx="3.6" ry="4.4" fill="none" stroke="#a8642a" stroke-width="2.2"/>
   <ellipse cx="33" cy="26" rx="26" ry="6.6" fill="url(#r)"/><ellipse cx="33" cy="26" rx="21.6" ry="4.6" fill="url(#w)"/>
   <circle cx="26" cy="25" r="2.6" fill="#c8ffb0"/><circle cx="25.2" cy="24.2" r=".9" fill="#fff"/><circle cx="39" cy="26" r="2" fill="#d8a8ff"/><circle cx="33" cy="24" r="1.4" fill="#e8ffd8"/>
   <path d="M18 29 C18 33 19 35 20.4 35 C21.6 35 22 33 21.6 29Z M45 29.6 C45 32 45.6 34 46.8 34 C48 34 48.4 32 48 29.6Z" fill="#6adf5a"/>
   <path d="M16 36 C18 46 24 52 30 54" stroke="#ffe8b8" stroke-width="2" fill="none" opacity=".55"/>`);
for(const [k,c] of [['bubG',['#e8ffd8','#7aff6a','#1f8a3a']],['bubV',['#f4e8ff','#b07aff','#5a1ab0']]])
  A[k]=S(14,14,rg('g',.5,.5,.5,[[0,c[0],.15],[.7,c[1],.55],[1,c[2],.95]]),`<circle cx="7" cy="7" r="6.4" fill="url(#g)"/><ellipse cx="4.8" cy="4.6" rx="1.8" ry="1.2" fill="#ffffff" opacity=".9" transform="rotate(-35 4.8 4.6)"/>`);
/* the dream bubble (Dream Shatter): iridescent, pops into glass */
A.bubble=S(64,64,rg('g',.5,.5,.5,[[0,'#ffd8f4',.05],[.72,'#ffc4ec',.18],[.92,'#ff8ad8',.55],[1,'#c86aff',.85]])+blur('b',1.2),
  `<circle cx="32" cy="32" r="30" fill="url(#g)"/><path d="M8 42 A26 26 0 0 1 10 18" stroke="#7affea" stroke-width="2.6" fill="none" opacity=".6"/><path d="M44 8 A26 26 0 0 1 58 26" stroke="#ffe27a" stroke-width="2.4" fill="none" opacity=".6"/>
   <path d="M50 52 A26 26 0 0 1 30 58" stroke="#9ad8ff" stroke-width="2" fill="none" opacity=".5"/><ellipse cx="20" cy="17" rx="8" ry="4.4" fill="#ffffff" opacity=".85" transform="rotate(-38 20 17)" filter="url(#b)"/><circle cx="27" cy="11" r="1.6" fill="#fff"/>`);
/* the charm heart */
A.heart=S(30,28,lg('g',0,0,0,1,[[0,'#ffb8e4'],[.5,'#ff4aa8'],[1,'#c0186a']])+blur('b',1.6),
  `<path d="M15 26 C6 19 1 14 1 8.6 C1 4.4 4.4 1.6 8.2 1.6 C11 1.6 13.4 3.2 15 5.6 C16.6 3.2 19 1.6 21.8 1.6 C25.6 1.6 29 4.4 29 8.6 C29 14 24 19 15 26Z" fill="url(#g)"/>
   <ellipse cx="8.6" cy="7.4" rx="4" ry="2.4" fill="#ffffff" opacity=".8" transform="rotate(-30 8.6 7.4)" filter="url(#b)"/>`);

/* =====================================================================
   4. THE GOLDEN FLEECE OF COLCHIS, THE SUN WHEEL
   ===================================================================== */
{const PELT='M40 30 C52 24 66 27 75 31 C84 27 98 24 110 30 C116 34 122 38 128 41 C136 46 142 50 147 57 C140 59 131 57 122 55 C119 64 119 73 122 82 C128 88 134 96 139 105 C129 105 118 99 110 93 C100 97 89 99 80 99 C78 103 77 107 75 111 C73 107 72 103 70 99 C61 99 50 97 40 93 C32 99 21 105 11 105 C16 96 22 88 28 82 C31 73 31 64 28 55 C19 57 10 59 3 57 C8 50 14 46 22 41 C28 38 34 34 40 30Z';
 const cs=[];for(let r=0;r<8;r++)for(let c=0;c<12;c++){const x=4+c*12.4+(r%2?6.2:0),y=30+r*10.4;cs.push([x,y,6.6-(r%3)*.5]);}
 A.fleece=S(150,112,rg('w',.38,.3,.78,WC.gold)+lg('p',0,0,0,1,[[0,'#fff0b0'],[.5,'#ffc23a'],[1,'#b8641a']])+lg('hr',0,0,1,1,[[0,'#fff4c8'],[.5,'#ffbd3c'],[1,'#a8581a']])+rg('f',.5,.4,.6,[[0,'#fff6d8'],[1,'#ffc84a']])+blur('b',7)+blur('r',1.6)
   +`<clipPath id="k"><path d="${PELT}"/></clipPath>`+lg('sh',0,0,0,1,[[0,'#ffffff',0],[.6,'#ffffff',0],[1,'#8a4a10',.45]]),
  `<path d="${PELT}" fill="#ffc84a" opacity=".55" filter="url(#b)" transform="translate(75 68) scale(1.06) translate(-75 -68)"/><path d="${PELT}" fill="url(#p)"/>
   <g clip-path="url(#k)">${curls(cs,'w',SW.gold)}<rect x="0" y="0" width="150" height="112" fill="url(#sh)"/></g>
   <path d="M40 31 C52 25 66 28 75 32 C84 28 98 25 110 31" stroke="#ffffff" stroke-width="3" fill="none" opacity=".6" filter="url(#r)"/>
   <path d="M64 25 C64 15 86 15 86 25 C86 31 80 35 75 35 C70 35 64 31 64 25Z" fill="url(#f)"/><path d="M71 30 Q75 32 79 30" stroke="#c8841c" stroke-width="1.2" fill="none"/>
   <path d="M66 19 C58 9 44 13 46 23 C47 31 58 31 58 25" stroke="url(#hr)" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M84 19 C92 9 106 13 104 23 C103 31 92 31 92 25" stroke="url(#hr)" stroke-width="5.4" fill="none" stroke-linecap="round"/>`);}
{let fl='',sp='';for(let i=0;i<14;i++){const a=i/14*TAU,b1=pl(50,50,40,a-.15),b2=pl(50,50,40,a+.15),c=pl(50,50,47,a+.12),tp=pl(50,50,(i%2?54:50),a+.05);fl+=`<path d="M${f1(b1[0])} ${f1(b1[1])} Q${f1(c[0])} ${f1(c[1])} ${f1(tp[0])} ${f1(tp[1])} L${f1(b2[0])} ${f1(b2[1])}Z" fill="url(#fl)"/>`;}
 for(let i=0;i<8;i++){const a=i/8*TAU,[x0,y0]=pl(50,50,9,a),[x1,y1]=pl(50,50,34,a);sp+=`<path d="M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}" stroke="url(#g)" stroke-width="3.6" stroke-linecap="round"/>`;}
 A.sunWheel=S(100,100,`<radialGradient id="fl" gradientUnits="userSpaceOnUse" cx="50" cy="50" r="54">${stops([[.7,'#fff2b0'],[.85,'#ffa62e'],[1,'#ff6a1a',.6]])}</radialGradient>`+lg('g',0,0,1,1,[[0,'#fff6d0'],[.5,'#ffc84a'],[1,'#c07a1a']])+rg('h',.4,.35,.7,[[0,'#ffffff'],[.6,'#fff2b8'],[1,'#ffc84a']]),
  `${fl}<circle cx="50" cy="50" r="38" fill="none" stroke="url(#g)" stroke-width="6.4"/><circle cx="50" cy="50" r="32.6" fill="none" stroke="#fff2b8" stroke-width="1.4" opacity=".8"/>${sp}<circle cx="50" cy="50" r="10" fill="url(#h)"/>`);}

/* ---------- loader: each SVG becomes a canvas at 2x ---------- */
const CV={},IM={};
for(const k in A){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=A[k].w*2;c.height=A[k].h*2;c.getContext('2d').drawImage(im,0,0,c.width,c.height);CV[k]=c;};
  im.onerror=()=>console.warn('sheep art failed',k);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(A[k].svg);IM[k]=im;}
window.KTA={get:k=>CV[k]||null,size:k=>A[k]?[A[k].w,A[k].h]:[0,0],names:Object.keys(A),ready:()=>Object.keys(A).every(k=>CV[k])};
})();
