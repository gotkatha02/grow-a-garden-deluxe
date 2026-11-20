/* White Ronin Cat — vector art for the skill effects (owner 2026-11-20: "make the cat's skill effects with SVG and VFX,
   pretty and realistic, details matching each skill's concept").
   Every piece is an SVG drawn here (gradients + soft blur, no dark outlines: shapes are separated by value, see
   VFX_STYLE_REF_TH.md), rasterised ONCE to a canvas at 2x and then animated by cat_vfx.js.
   The concepts follow the cat's painted set in assets/fx/cat (sakura cuts, oni fire, kabuki mask, straw hat, wind mark,
   mountain dome, ki clouds) so each skill keeps the idea the owner approved.
   window.KTA.get(name) -> canvas (or null until the picture has loaded) · window.KTA.size(name) -> [w,h] in world px. */
(()=>{
if(typeof CHAR!=='undefined'&&CHAR!=='cat'&&!window.__KT_ART_PREVIEW)return;
const XL='xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
const S=(w,h,defs,body)=>({w,h,svg:`<svg ${XL} width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`});
const lg=(id,x1,y1,x2,y2,stops)=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('')}</linearGradient>`;
const rg=(id,cx,cy,r,stops,extra='')=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" ${extra}>${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('')}</radialGradient>`;
const blur=(id,sd,pad=40)=>`<filter id="${id}" x="-${pad}%" y="-${pad}%" width="${100+2*pad}%" height="${100+2*pad}%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const mirror=(d,w)=>d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g,(m,x,y)=>(w-parseFloat(x))+' '+y);   /* mirror "x y" pairs of a path about the vertical centre line */
const A={};

/* ---------- sakura ---------- */
/* a petal: teardrop with the notched tip of a cherry petal, deep rose at the stem, almost white at the tip */
const PET=['M20 50 C6 40 2 22 12 5 L20 12 L28 5 C38 22 34 40 20 50Z','M18 50 C4 38 4 18 16 4 L21 12 L30 7 C36 22 32 40 18 50Z','M20 50 C12 40 10 22 16 6 L20 12 L25 6 C30 22 28 40 20 50Z'];
PET.forEach((d,i)=>{A['petal'+i]=S(40,54,
  lg('g',0,1,0,0,[[0,'#f0387f'],[.45,'#ff8fb8'],[1,'#fff1f6']])+rg('s',.5,.95,.5,[[0,'#c81862',.55],[1,'#c81862',0]]),
  `<path d="${d}" fill="url(#g)"/><path d="${d}" fill="url(#s)"/><path d="M20 46 C19 34 19 24 20 14" stroke="#ffffff" stroke-opacity=".6" stroke-width="1.5" fill="none" stroke-linecap="round"/>`);});
/* white petal (steel / moonlight cuts) and a dark crimson one (oni) */
A.petalW=S(40,54,lg('g',0,1,0,0,[[0,'#ffb8d2'],[.5,'#fff0f6'],[1,'#ffffff']]),`<path d="${PET[0]}" fill="url(#g)"/><path d="M20 46 C19 34 19 24 20 14" stroke="#ff9cc2" stroke-opacity=".5" stroke-width="1.4" fill="none"/>`);
/* five-petal blossom seen from above */
{const p='M0 -9 C-25 -28 -33 -56 -14 -78 L0 -68 L14 -78 C33 -56 25 -28 0 -9Z';let ps='',st='';
 for(let k=0;k<5;k++)ps+=`<path d="${p}" fill="url(#g)" transform="rotate(${k*72})"/><path d="M0 -14 C-1 -34 -1 -50 0 -64" stroke="#fff" stroke-opacity=".55" stroke-width="2" fill="none" stroke-linecap="round" transform="rotate(${k*72})"/>`;
 for(let k=0;k<10;k++){const a=k*36+10,r=k%2?17:22;st+=`<line x1="0" y1="0" x2="${(Math.sin(a*Math.PI/180)*r).toFixed(1)}" y2="${(-Math.cos(a*Math.PI/180)*r).toFixed(1)}" stroke="#ffe08a" stroke-width="1.6" stroke-linecap="round"/><circle cx="${(Math.sin(a*Math.PI/180)*r).toFixed(1)}" cy="${(-Math.cos(a*Math.PI/180)*r).toFixed(1)}" r="2.3" fill="#fff3b8"/>`;}
 A.blossom=S(200,200,lg('g',0,1,0,0,[[0,'#ef2f7a'],[.4,'#ff86b4'],[1,'#fff0f6']])+rg('h',.5,.5,.5,[[0,'#ff7fb2',.55],[.6,'#ff7fb2',.22],[1,'#ff7fb2',0]])+blur('b',2),
  `<circle cx="100" cy="100" r="98" fill="url(#h)"/><g transform="translate(100 100)">${ps}<circle r="9" fill="#d81e6f"/>${st}</g>`);}

/* ---------- blade spirits ---------- */
/* a swallow flying to the right: swept wings, forked tail — white head, rose tail fading out (Swallow Cuts) */
A.swallow=S(200,120,lg('g',0,0,1,0,[[0,'#ff5c9a',0],[.22,'#ff6aa4',.85],[.62,'#ffc4da'],[1,'#ffffff']])+lg('e',0,0,1,0,[[0,'#b0125a',0],[.3,'#b0125a',.7],[1,'#b0125a',.55]])+blur('b',2.5),
  `<path d="M188 60 C176 54 162 53 150 54 C120 44 88 26 64 6 C80 30 98 46 112 54 L72 57 L4 40 L40 60 L4 80 L72 63 L112 66 C98 74 80 90 64 114 C88 94 120 76 150 66 C162 67 176 66 188 60Z" fill="url(#e)" filter="url(#b)" transform="translate(-3 2)"/>
   <path d="M188 60 C176 54 162 53 150 54 C120 44 88 26 64 6 C80 30 98 46 112 54 L72 57 L4 40 L40 60 L4 80 L72 63 L112 66 C98 74 80 90 64 114 C88 94 120 76 150 66 C162 67 176 66 188 60Z" fill="url(#g)"/>
   <path d="M186 60 C170 58 140 58 96 60" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none"/>`);
/* a paw print (Cat Step footprints, Paw-Blade finisher, Nine Lives) */
A.paw=S(100,100,rg('g',.5,.45,.6,[[0,'#ffffff'],[.6,'#fff0b8'],[1,'#ffd36a']])+rg('h',.5,.5,.5,[[0,'#ffd36a',.5],[1,'#ffd36a',0]]),
  `<circle cx="50" cy="52" r="48" fill="url(#h)"/><g fill="url(#g)"><path d="M50 46 C66 46 78 58 78 70 C78 82 66 88 50 88 C34 88 22 82 22 70 C22 58 34 46 50 46Z"/>
   <ellipse cx="21" cy="40" rx="9" ry="12" transform="rotate(-25 21 40)"/><ellipse cx="39" cy="24" rx="9" ry="13" transform="rotate(-8 39 24)"/><ellipse cx="61" cy="24" rx="9" ry="13" transform="rotate(8 61 24)"/><ellipse cx="79" cy="40" rx="9" ry="12" transform="rotate(25 79 40)"/></g>`);
/* a cat's eye, slit pupil (Feline Focus) */
A.eye=S(180,100,rg('g',.5,.5,.55,[[0,'#fffbd0'],[.35,'#ffd84a'],[.8,'#e0911a'],[1,'#8a4a08']])+rg('h',.5,.5,.5,[[0,'#ffcf4a',.6],[1,'#ffcf4a',0]])+lg('l',0,0,0,1,[[0,'#5a2c06',.75],[.5,'#5a2c06',0]]),
  `<ellipse cx="90" cy="50" rx="90" ry="50" fill="url(#h)"/><path d="M8 50 C42 10 138 10 172 50 C138 90 42 90 8 50Z" fill="url(#g)"/><path d="M8 50 C42 10 138 10 172 50 C138 90 42 90 8 50Z" fill="url(#l)"/>
   <ellipse cx="90" cy="50" rx="7" ry="33" fill="#241002"/><ellipse cx="103" cy="33" rx="9" ry="5" fill="#fff" fill-opacity=".9" transform="rotate(-20 103 33)"/>`);

/* ---------- the ronin's things ---------- */
/* the straw hat from above: woven rings, ribs, a dark rim and the red chin-cord knot (Kasa Throw) */
{let rings='',ribs='',st='';for(const r of [22,36,50,64,78])rings+=`<circle cx="100" cy="100" r="${r}" fill="none" stroke="#9a6a2a" stroke-opacity=".55" stroke-width="2"/><circle cx="100" cy="100" r="${r+3}" fill="none" stroke="#fff3c8" stroke-opacity=".3" stroke-width="1.5"/>`;
 for(let k=0;k<20;k++){const a=k/20*Math.PI*2;ribs+=`<line x1="${(100+Math.cos(a)*10).toFixed(1)}" y1="${(100+Math.sin(a)*10).toFixed(1)}" x2="${(100+Math.cos(a)*92).toFixed(1)}" y2="${(100+Math.sin(a)*92).toFixed(1)}" stroke="#7a4a1c" stroke-opacity=".4" stroke-width="1.3"/>`;}
 for(let k=0;k<8;k++){const a=k/8*Math.PI*2+.39;st+=`<circle cx="${(100+Math.cos(a)*89).toFixed(1)}" cy="${(100+Math.sin(a)*89).toFixed(1)}" r="3.2" fill="#d2303c"/>`;}
 A.kasa=S(200,200,rg('g',.42,.38,.7,[[0,'#fbe6ac'],[.45,'#e9bd72'],[.85,'#c58f3f'],[1,'#8f5c20']])+lg('s',0,0,1,1,[[0,'#fff',.28],[.45,'#fff',0],[.6,'#3a1c06',0],[1,'#3a1c06',.3]]),
  `<circle cx="100" cy="100" r="94" fill="url(#g)"/>${rings}${ribs}<circle cx="100" cy="100" r="94" fill="url(#s)"/><circle cx="100" cy="100" r="91.5" fill="none" stroke="#6e431a" stroke-width="5"/>${st}
   <g fill="#d2303c"><ellipse cx="100" cy="88" rx="7" ry="11"/><ellipse cx="100" cy="112" rx="7" ry="11"/><ellipse cx="88" cy="100" rx="11" ry="7"/><ellipse cx="112" cy="100" rx="11" ry="7"/></g><circle cx="100" cy="100" r="7" fill="#ff5a5a"/><circle cx="98" cy="98" r="2.5" fill="#ffd0c8"/>`);}
/* the kabuki oni mask (Ashura Mask): white face, red kumadori paint, gold horns, yellow eyes, fangs */
{const W=240,m=d=>mirror(d,W);
 const horn='M72 72 C54 56 40 32 40 6 C56 24 78 42 98 54 C90 62 80 68 72 72Z',brow='M58 114 C74 98 98 100 112 118 C98 110 78 110 62 124Z',eye='M66 126 C80 116 100 120 108 132 C96 140 78 140 66 126Z';
 const k1='M100 106 C90 90 84 74 92 60 C98 74 104 88 110 102Z',k2='M62 122 C50 110 46 94 52 80 C58 94 66 106 76 114Z',k3='M64 142 C70 160 82 178 98 190 C86 174 78 158 76 144Z',k4='M84 148 C88 162 96 174 108 182 C100 170 96 158 94 148Z';
 A.mask=S(W,250,
  rg('f',.5,.42,.62,[[0,'#fffdf8'],[.62,'#f7e7db'],[1,'#d2ab9a']])+lg('h',0,1,0,0,[[0,'#a8641a'],[.5,'#f0b93a'],[1,'#fff3b8']])+lg('k',0,0,0,1,[[0,'#ff5a3a'],[1,'#c4121c']])
  +rg('e',.5,.5,.5,[[0,'#fffbd0'],[.6,'#ffd21a'],[1,'#f09a0a']])+rg('g',.5,.5,.5,[[0,'#ff8a2a',.7],[1,'#ff8a2a',0]])+blur('b',5),
  `<path d="M120 46 C166 46 196 76 194 126 C192 170 168 216 120 234 C72 216 48 170 46 126 C44 76 74 46 120 46Z" fill="#7a2a1a" fill-opacity=".45" filter="url(#b)" transform="translate(0 4)"/>
   <path d="${horn}" fill="url(#h)"/><path d="${m(horn)}" fill="url(#h)"/><path d="M52 34 C60 44 72 54 84 60" stroke="#fff8d0" stroke-opacity=".7" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="${m('M52 34 C60 44 72 54 84 60')}" stroke="#fff8d0" stroke-opacity=".7" stroke-width="2.5" fill="none" stroke-linecap="round"/>
   <path d="M120 46 C166 46 196 76 194 126 C192 170 168 216 120 234 C72 216 48 170 46 126 C44 76 74 46 120 46Z" fill="url(#f)"/>
   <g fill="url(#k)"><path d="M120 114 C112 94 106 76 120 54 C134 76 128 94 120 114Z"/><path d="${k1}"/><path d="${m(k1)}"/><path d="${k2}"/><path d="${m(k2)}"/><path d="${k3}"/><path d="${m(k3)}"/><path d="${k4}"/><path d="${m(k4)}"/>
     <path d="M120 130 C116 140 114 148 120 154 C126 148 124 140 120 130Z"/><path d="M120 212 C116 218 116 224 120 230 C124 224 124 218 120 212Z"/></g>
   <ellipse cx="87" cy="128" rx="26" ry="14" fill="url(#g)"/><ellipse cx="153" cy="128" rx="26" ry="14" fill="url(#g)"/>
   <path d="${eye}" fill="url(#e)"/><path d="${m(eye)}" fill="url(#e)"/><ellipse cx="88" cy="129" rx="3.4" ry="5.5" fill="#3a0606"/><ellipse cx="152" cy="129" rx="3.4" ry="5.5" fill="#3a0606"/>
   <path d="${brow}" fill="#5a0a12"/><path d="${m(brow)}" fill="#5a0a12"/>
   <path d="M80 186 C98 174 142 174 160 186 C142 181 98 181 80 186Z" fill="#c8161f"/><path d="M82 187 C98 178 142 178 158 187 C150 208 90 208 82 187Z" fill="#4a070c"/>
   <g fill="#fffdf0"><path d="M92 183 L98 200 L104 183Z"/><path d="M136 183 L142 200 L148 183Z"/><path d="M107 182 h8 v8 h-8Z"/><path d="M116.500 182 h7 v8.500 h-7Z"/><path d="M125 182 h8 v8 h-8Z"/><path d="M106 205 L111 191 L116 205Z"/><path d="M124 205 L129 191 L134 205Z"/></g>`);
/* the roaring oni face (Oni Roar): the same face in oni red with the jaws wide open */
 const bigMouth='M78 180 C98 166 142 166 162 180 C158 220 82 220 78 180Z';
 const ONI_DEFS=rg('of',.5,.4,.62,[[0,'#ff7a4a'],[.55,'#e2301c'],[1,'#8a0d0a']])+lg('oh',0,1,0,0,[[0,'#a8641a'],[.5,'#f0b93a'],[1,'#fff3b8']])+rg('oe',.5,.5,.5,[[0,'#ffffff'],[.5,'#fff08a'],[1,'#ffb81a']])+rg('og',.5,.5,.5,[[0,'#ffd24a',.85],[1,'#ffd24a',0]])+rg('om',.5,.3,.7,[[0,'#ff9a2a'],[.5,'#a8140a'],[1,'#3a0404']]);
 const ONI_BODY=`<path d="${horn}" fill="url(#oh)"/><path d="${m(horn)}" fill="url(#oh)"/>
   <path d="M120 46 C166 46 196 76 194 126 C192 170 168 216 120 234 C72 216 48 170 46 126 C44 76 74 46 120 46Z" fill="url(#of)"/>
   <g fill="#5a0606" fill-opacity=".8"><path d="${k1}"/><path d="${m(k1)}"/><path d="M120 114 C112 94 106 76 120 54 C134 76 128 94 120 114Z"/><path d="${k3}"/><path d="${m(k3)}"/></g>
   <ellipse cx="87" cy="128" rx="30" ry="17" fill="url(#og)"/><ellipse cx="153" cy="128" rx="30" ry="17" fill="url(#og)"/>
   <path d="${eye}" fill="url(#oe)"/><path d="${m(eye)}" fill="url(#oe)"/><path d="${brow}" fill="#3a0404"/><path d="${m(brow)}" fill="#3a0404"/>
   <path d="${bigMouth}" fill="url(#om)"/>
   <g fill="#fffdf0"><path d="M88 176 L96 202 L104 176Z"/><path d="M136 176 L144 202 L152 176Z"/><path d="M106 174 h9 v9 h-9Z"/><path d="M116 174 h8 v10 h-8Z"/><path d="M125 174 h9 v9 h-9Z"/><path d="M98 216 L105 194 L112 214Z"/><path d="M128 214 L135 194 L142 216Z"/></g>`;
 A.oniFace=S(W,250,ONI_DEFS+blur('b',6),
  `<path d="M120 40 C172 40 204 76 200 130 C196 178 170 222 120 240 C70 222 44 178 40 130 C36 76 68 40 120 40Z" fill="#ff5a1a" fill-opacity=".5" filter="url(#b)"/>${ONI_BODY}`);
/* the red oni shadow that strikes along with Oni Executioner (Oni Impact): a horned giant made of fire, both arms raised,
   the great blade held overhead; the body burns away into flame tongues at the waist */
 {const M=d=>mirror(d,360);
  const torso='M180 196 C160 190 150 196 140 198 C110 198 84 204 66 226 C52 246 56 280 78 300 C82 330 88 352 96 378 L112 352 L126 384 L142 350 L160 388 L180 356 L200 388 L218 350 L234 384 L248 352 L264 378 C272 352 278 330 282 300 C304 280 308 246 294 226 C276 204 250 198 220 198 C210 196 200 190 180 196Z';
  const upper='M70 244 C44 226 24 192 28 156 C30 138 50 132 64 142 C68 170 84 196 110 212Z',fore='M32 166 C36 118 80 66 150 36 L178 52 L172 84 C122 102 88 134 64 174Z',pec='M110 234 C130 252 160 254 178 242 L178 266 C150 274 122 266 106 248Z';
  A.oniSpirit=S(360,510,ONI_DEFS
   +lg('sb',0,0,0,1,[[0,'#ff8a3a'],[.3,'#e8321a'],[.75,'#a8140c',.9],[1,'#7a0808',.0]])+lg('sa',0,1,0,0,[[0,'#d8281a'],[1,'#ff9a4a']])+lg('bl',0,1,1,0,[[0,'#ff7a1a'],[.25,'#ffd27a'],[1,'#ffffff']])
   +rg('au',.5,.55,.6,[[0,'#ff6a1a',.7],[.6,'#c8160c',.4],[1,'#7a0808',0]])+blur('s',9)+blur('t',3),
   `<g transform="translate(0 125)"><path d="M180 -40 C230 20 320 80 334 190 C346 290 300 370 180 384 C60 370 14 290 26 190 C40 80 130 20 180 -40Z" fill="url(#au)" filter="url(#s)"/>
    <path d="M160 60 C192 -10 248 -78 298 -120 C276 -58 242 2 210 48Z" fill="#ff5a1a" fill-opacity=".9" filter="url(#t)"/>
    <path d="${upper}" fill="url(#sa)"/><path d="${M(upper)}" fill="url(#sa)"/><path d="${torso}" fill="url(#sb)"/>
    <g fill="#6a0808" fill-opacity=".38"><path d="${pec}"/><path d="${M(pec)}"/><path d="M172 270 C174 300 174 326 172 350 L188 350 C186 326 186 300 188 270Z"/></g>
    <path d="M98 212 C120 204 150 204 172 212" stroke="#ffb86a" stroke-opacity=".7" stroke-width="4" fill="none" stroke-linecap="round"/><path d="${M('M98 212 C120 204 150 204 172 212')}" stroke="#ffb86a" stroke-opacity=".7" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g transform="translate(81.600 61) scale(.82)">${ONI_BODY}</g>
    <path d="${fore}" fill="url(#sa)"/><path d="${M(fore)}" fill="url(#sa)"/>
    <path d="M166 58 C196 -10 250 -76 296 -118 C272 -58 238 0 206 46Z" fill="url(#bl)"/>
    <path d="M146 42 C158 26 204 26 214 42 C220 60 208 78 180 80 C152 78 140 60 146 42Z" fill="#e0301a"/><path d="M152 46 C164 36 198 36 208 46" stroke="#ff9a5a" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="187" cy="50" rx="27" ry="8" fill="#ffd36a" transform="rotate(-24 187 50)"/></g>`);}}
/* a flame tongue, three shapes (Ashura aura, roar, charge) — hot yellow root, red tip that thins out */
[['M40 158 C8 132 10 88 30 60 C34 82 44 86 44 66 C44 40 52 20 46 2 C74 30 80 70 70 100 C78 92 82 80 80 68 C92 96 84 136 40 158Z','M40 150 C24 132 24 104 36 86 C38 100 46 98 46 84 C46 70 50 58 48 46 C62 66 64 92 58 110 C66 124 58 142 40 150Z'],
  ['M40 158 C4 140 6 96 22 70 C28 88 36 90 34 70 C30 44 40 22 56 4 C52 36 76 60 72 96 C80 90 82 82 82 74 C90 110 78 142 40 158Z','M40 150 C22 136 24 108 32 92 C36 104 42 102 42 90 C40 72 48 58 54 48 C54 70 64 86 60 108 C66 124 56 142 40 150Z'],
  ['M40 158 C10 136 14 100 28 78 C30 94 40 96 42 80 C44 56 34 36 36 12 C62 40 74 74 66 104 C74 98 78 90 78 82 C88 112 76 142 40 158Z','M40 150 C26 134 28 110 36 96 C38 108 44 106 46 94 C46 78 44 64 44 52 C58 74 62 96 56 114 C62 128 54 142 40 150Z']
].forEach(([body,core],i)=>{A['flame'+i]=S(88,162,lg('g',0,1,0,0,[[0,'#ffd24a'],[.3,'#ff7a1a'],[.7,'#e0261a'],[1,'#8a0c0a',.0]])+lg('c',0,1,0,0,[[0,'#fffbe0'],[.5,'#ffd84a'],[1,'#ff8a1a',0]])+blur('b',1.2),
  `<path d="${body}" fill="url(#g)" filter="url(#b)"/><path d="${core}" fill="url(#c)"/>`);});
/* a spirit flame (hitodama): the two tails of the nekomata, Nine Lives */
A.hitodama=S(64,100,rg('g',.5,.72,.5,[[0,'#ffffff'],[.35,'#c8f2ff'],[.75,'#5ab4ff'],[1,'#2a6cff',0]],'gradientTransform="translate(0 -.1) scale(1 1.25)"')+rg('h',.5,.7,.5,[[0,'#7fd0ff',.6],[1,'#7fd0ff',0]])+blur('b',1.5),
  `<ellipse cx="32" cy="70" rx="30" ry="30" fill="url(#h)"/><path d="M32 96 C12 96 6 78 12 64 C16 54 26 50 26 34 C26 22 30 12 40 2 C36 20 48 30 52 48 C56 64 56 96 32 96Z" fill="url(#g)" filter="url(#b)"/>
   <path d="M32 90 C22 90 18 80 22 70 C25 62 31 60 32 50 C38 62 44 68 43 78 C42 86 38 90 32 90Z" fill="#fff" fill-opacity=".9"/>`);
A.hitodamaG=S(64,100,rg('g',.5,.72,.5,[[0,'#ffffff'],[.35,'#fff3b8'],[.75,'#ffc23a'],[1,'#ff8a0a',0]],'gradientTransform="translate(0 -.1) scale(1 1.25)"')+rg('h',.5,.7,.5,[[0,'#ffd36a',.6],[1,'#ffd36a',0]])+blur('b',1.5),
  `<ellipse cx="32" cy="70" rx="30" ry="30" fill="url(#h)"/><path d="M32 96 C12 96 6 78 12 64 C16 54 26 50 26 34 C26 22 30 12 40 2 C36 20 48 30 52 48 C56 64 56 96 32 96Z" fill="url(#g)" filter="url(#b)"/>
   <path d="M32 90 C22 90 18 80 22 70 C25 62 31 60 32 50 C38 62 44 68 43 78 C42 86 38 90 32 90Z" fill="#fff" fill-opacity=".9"/>`);
/* the wind mark that Gale Lunge leaves on its target: a ring with four points and a curl of wind inside */
{let pts='';for(let k=0;k<4;k++)pts+=`<path d="M70 2 L78 18 L70 26 L62 18Z" transform="rotate(${k*90} 70 70)"/>`;
 A.windMark=S(140,140,lg('g',0,0,1,1,[[0,'#ffffff'],[.5,'#9fe6ff'],[1,'#3a9fe0']])+rg('h',.5,.5,.5,[[0,'#7fd8ff',.45],[1,'#7fd8ff',0]])+blur('b',2),
  `<circle cx="70" cy="70" r="68" fill="url(#h)"/><g fill="url(#g)">${pts}<path d="M70 22 A48 48 0 1 1 69.900 22Z M70 30 A40 40 0 1 0 70.100 30Z" fill-rule="evenodd"/>
   <path d="M44 62 C54 46 80 44 90 58 C98 70 88 84 76 80 C68 77 68 66 76 64 C70 58 56 60 52 70 C48 82 60 96 78 96 C94 96 104 84 104 72 C110 90 96 106 76 106 C52 106 36 84 44 62Z"/></g>`);}
/* Mountain Stance: the mountain that stands inside the guard dome — sunlit ridge, shadow side, snow cap, mist at the foot */
A.mountain=S(300,200,lg('l',0,0,0,1,[[0,'#ffe2b0'],[.5,'#f0903a'],[1,'#b8521c',0]])+lg('d',0,0,0,1,[[0,'#c8642a'],[.6,'#8a3a14'],[1,'#6a2a10',0]])+lg('f',0,0,0,1,[[0,'#e8a45a',.8],[1,'#c8642a',0]])+blur('b',6),
  `<path d="M20 200 L92 96 L122 128 L150 84 L186 132 L214 104 L282 200Z" fill="url(#f)"/>
   <path d="M60 200 L150 22 L176 62 L190 50 L246 200Z" fill="url(#d)"/><path d="M60 200 L150 22 L158 70 L142 110 L152 150 L128 200Z" fill="url(#l)"/>
   <path d="M150 22 L176 62 L166 70 L158 58 L150 74 L142 60 L132 72 L128 64Z" fill="#fffaf0"/>
   <ellipse cx="150" cy="192" rx="140" ry="16" fill="#fff0d8" fill-opacity=".55" filter="url(#b)"/>`);
/* a Japanese cloud curl (Ki Gather): flat mist with rolled ends */
A.kumo=S(160,70,lg('g',0,0,0,1,[[0,'#ffffff'],[.6,'#d8eeff'],[1,'#8fc0ee',.85]])+blur('b',1.2),
  `<g fill="url(#g)" filter="url(#b)"><path d="M8 50 C8 38 20 32 30 36 C32 22 52 16 62 28 C70 14 96 14 102 30 C114 22 132 28 132 42 C146 40 154 50 150 58 C120 64 40 64 12 60 C9 58 8 54 8 50Z"/></g>
   <path d="M30 46 C30 40 38 38 42 42 C44 46 40 50 36 48" stroke="#7fb0e0" stroke-opacity=".7" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M96 44 C96 36 108 34 112 40 C114 46 108 50 104 47" stroke="#7fb0e0" stroke-opacity=".7" stroke-width="2.4" fill="none" stroke-linecap="round"/>
   <path d="M62 40 C62 34 70 32 74 36" stroke="#7fb0e0" stroke-opacity=".6" stroke-width="2" fill="none" stroke-linecap="round"/>`);

/* ---------- loader: each SVG becomes a canvas at 2x ---------- */
const CV={},IM={};
for(const k in A){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=A[k].w*2;c.height=A[k].h*2;c.getContext('2d').drawImage(im,0,0,c.width,c.height);CV[k]=c;};
  im.onerror=()=>console.warn('cat art failed',k);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(A[k].svg);IM[k]=im;}
window.KTA={get:k=>CV[k]||null,size:k=>A[k]?[A[k].w,A[k].h]:[0,0],names:Object.keys(A),ready:()=>Object.keys(A).every(k=>CV[k])};
})();
