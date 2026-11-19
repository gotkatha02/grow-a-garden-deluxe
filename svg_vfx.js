/* =========================================================================
   SVG VFX — vector-painted skill effects (gradients + soft blur), rendered once to
   images and animated on the canvas (scale / fade / spin / follow).
   Restrained light: normal blending except a few small additive cores.
   Owl  : white / silver / pale ice — feathers, moonlight, snow.
   Rhino: steel blue-grey / bronze / ember — weight, metal, fury.
   Usage: svgFx(key,{x,y,z,s,rot,life,follow,...})  — returns the fx object.
   ========================================================================= */
(function(){
const XL='xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
const deg=Math.PI/180;
const pt=(cx,cy,r,a)=>[(cx+Math.cos(a*deg)*r).toFixed(1),(cy+Math.sin(a*deg)*r).toFixed(1)];

/* ---------------- art ---------------- */
const ART={};

/* OWL · Flurry Bolts — six-arm snowflake with branch ticks, ice glow underneath */
ART.frost_flake={w:128,h:128,svg:()=>{
  const arm='M64 64 V16 M64 40 L54 30 M64 40 L74 30 M64 27 L57 20 M64 27 L71 20';
  let arms='';for(let i=0;i<6;i++)arms+=`<use xlink:href="#a" transform="rotate(${i*60} 64 64)"/>`;
  return `<svg ${XL} width="128" height="128" viewBox="0 0 128 128"><defs>
  <radialGradient id="h"><stop offset="0" stop-color="#dff4ff" stop-opacity=".5"/><stop offset="1" stop-color="#dff4ff" stop-opacity="0"/></radialGradient>
  <filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4"/></filter>
  <path id="a" d="${arm}"/></defs>
  <circle cx="64" cy="64" r="46" fill="url(#h)"/>
  <g stroke="#9fd8f5" stroke-width="5.5" stroke-linecap="round" fill="none" filter="url(#b)" opacity=".85">${arms}</g>
  <g stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none">${arms}</g>
  <polygon points="64,56 71,60 71,68 64,72 57,68 57,60" fill="#ffffff" stroke="#bfe8ff" stroke-width="1.2"/></svg>`;}};

/* OWL · Ricochet Bolt — silver bounce: incoming streak from the left, outgoing streak up-right (-35°), star at the vertex */
ART.rico_glint={w:128,h:128,svg:()=>`<svg ${XL} width="128" height="128" viewBox="0 0 128 128"><defs>
  <linearGradient id="i" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e6eeff" stop-opacity="0"/><stop offset="1" stop-color="#ffffff" stop-opacity=".9"/></linearGradient>
  <linearGradient id="o" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#b8c8ff" stop-opacity="0"/></linearGradient>
  <radialGradient id="g"><stop offset="0" stop-color="#e6eeff" stop-opacity=".55"/><stop offset="1" stop-color="#e6eeff" stop-opacity="0"/></radialGradient>
  <filter id="b"><feGaussianBlur stdDeviation="2"/></filter></defs>
  <circle cx="64" cy="64" r="26" fill="url(#g)"/>
  <polygon points="64,62.2 10,64 64,65.8" fill="url(#i)"/>
  <polygon points="62.8,62.4 112,30 65.2,65.6" fill="url(#o)"/>
  <path d="M64 46 Q65.6 62.4 82 64 Q65.6 65.6 64 82 Q62.4 65.6 46 64 Q62.4 62.4 64 46Z" fill="#cfdcff" filter="url(#b)"/>
  <path d="M64 48 Q65.2 62.8 80 64 Q65.2 65.2 64 80 Q62.8 65.2 48 64 Q62.8 62.8 64 48Z" fill="#ffffff"/></svg>`};

/* OWL · Skyfall Volley — snow crown splash where a bolt lands (soft puff base, tapered snow petals, flung droplets) */
ART.snow_crown={w:160,h:112,svg:()=>{
  let pet='',drops='';const n=7;
  for(let i=0;i<n;i++){const a=-90+(i-(n-1)/2)*22,L=i%2?42:56,w=5.5,[tx,ty]=pt(80,96,L,a),[lx,ly]=pt(80,96,w,a-90),[rx,ry]=pt(80,96,w,a+90),[cx1,cy1]=pt(80,96,L*.55,a-5),[cx2,cy2]=pt(80,96,L*.55,a+5);
    pet+=`<path d="M${lx} ${ly} Q${cx1} ${cy1} ${tx} ${ty} Q${cx2} ${cy2} ${rx} ${ry}Z"/>`;
    const [dx,dy]=pt(80,96,L+9+(i%3)*4,a+(i%2?4:-4));drops+=`<circle cx="${dx}" cy="${dy}" r="${(2.6-(i%3)*.5).toFixed(1)}"/>`;}
  return `<svg ${XL} width="160" height="112" viewBox="0 0 160 112"><defs>
  <linearGradient id="p" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#dfeaf4"/><stop offset=".55" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity=".6"/></linearGradient>
  <radialGradient id="m" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset=".7" stop-color="#eef4fa" stop-opacity=".45"/><stop offset="1" stop-color="#eef4fa" stop-opacity="0"/></radialGradient>
  <filter id="b"><feGaussianBlur stdDeviation="1.6"/></filter></defs>
  <ellipse cx="80" cy="96" rx="44" ry="13" fill="url(#m)"/>
  <g fill="#c4dcef" filter="url(#b)" opacity=".7">${pet}</g>
  <g fill="url(#p)" stroke="#b8cfe2" stroke-width=".8">${pet}</g>
  <g fill="#ffffff" stroke="#c4dcef" stroke-width=".6">${drops}</g>
  <ellipse cx="80" cy="95" rx="20" ry="6" fill="#ffffff" opacity=".9"/></svg>`;}};

/* OWL · Circling Hunt — feathered wind crescent (upper arc, head at the right), wraps the hunted target */
ART.hunt_arc={w:256,h:256,svg:()=>{
  const [sx,sy]=pt(128,128,104,-150),[ex,ey]=pt(128,128,104,-30);let barbs='';
  for(let a=-138;a<=-42;a+=10){const [x1,y1]=pt(128,128,103,a),[x2,y2]=pt(128,128,116,a-7);barbs+=`<path d="M${x1} ${y1} L${x2} ${y2}"/>`;}
  const [hx,hy]=pt(128,128,103,-32);
  return `<svg ${XL} width="256" height="256" viewBox="0 0 256 256"><defs>
  <linearGradient id="c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".55" stop-color="#e6eeff" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity=".95"/></linearGradient>
  <linearGradient id="f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#ffffff" stop-opacity=".7"/></linearGradient>
  <filter id="b"><feGaussianBlur stdDeviation="2.4"/></filter></defs>
  <path d="M${sx} ${sy} A104 104 0 0 1 ${ex} ${ey} A118 118 0 0 0 ${sx} ${sy}Z" fill="#cfe4ff" opacity=".45" filter="url(#b)"/>
  <path d="M${sx} ${sy} A104 104 0 0 1 ${ex} ${ey} A118 118 0 0 0 ${sx} ${sy}Z" fill="url(#c)"/>
  <g stroke="url(#f)" stroke-width="1.6" stroke-linecap="round" fill="none">${barbs}</g>
  <circle cx="${hx}" cy="${hy}" r="3.2" fill="#ffffff"/></svg>`;}};

/* OWL · Snow Lantern — warm lantern light: soft halo, six thin rays, a few drifting flakes */
ART.lantern_glow={w:128,h:128,svg:()=>{
  let rays='';for(let i=0;i<6;i++)rays+=`<ellipse cx="64" cy="64" rx="3" ry="46" transform="rotate(${i*30+15} 64 64)"/>`;
  return `<svg ${XL} width="128" height="128" viewBox="0 0 128 128"><defs>
  <radialGradient id="h"><stop offset="0" stop-color="#fff2d8" stop-opacity=".9"/><stop offset=".3" stop-color="#ffd8a0" stop-opacity=".45"/><stop offset="1" stop-color="#ffd8a0" stop-opacity="0"/></radialGradient>
  <radialGradient id="r"><stop offset="0" stop-color="#fff2d8" stop-opacity=".55"/><stop offset="1" stop-color="#ffd8a0" stop-opacity="0"/></radialGradient>
  <filter id="b"><feGaussianBlur stdDeviation="1.8"/></filter></defs>
  <circle cx="64" cy="64" r="60" fill="url(#h)"/>
  <g fill="url(#r)" filter="url(#b)">${rays}</g>
  <circle cx="64" cy="64" r="7" fill="#fffaf0"/>
  <g fill="#ffffff" opacity=".8"><circle cx="38" cy="40" r="1.6"/><circle cx="92" cy="50" r="1.3"/><circle cx="80" cy="92" r="1.5"/><circle cx="44" cy="86" r="1.1"/></g></svg>`;}};

/* RHINO · Iron Skin — honeycomb steel plates clamping over the body, cool sheen band, soft-edged mask */
ART.steel_plates={w:160,h:208,svg:()=>{
  let hex='';const R=17,dx=R*Math.sqrt(3),dy=R*1.5;
  for(let r=0;r<8;r++)for(let c=0;c<6;c++){const x=10+c*dx+(r%2?dx/2:0),y=14+r*dy;let p='';for(let k=0;k<6;k++){const a=(60*k-30)*deg;p+=`${(x+Math.cos(a)*(R-1.6)).toFixed(1)},${(y+Math.sin(a)*(R-1.6)).toFixed(1)} `;}hex+=`<polygon points="${p}"/>`;}
  return `<svg ${XL} width="160" height="208" viewBox="0 0 160 208"><defs>
  <radialGradient id="mk" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
  <mask id="m"><ellipse cx="80" cy="104" rx="70" ry="98" fill="url(#mk)"/></mask>
  <linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6dce4" stop-opacity=".35"/><stop offset="1" stop-color="#8fa4c4" stop-opacity=".12"/></linearGradient>
  <linearGradient id="s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".75"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>
  <g mask="url(#m)"><g fill="url(#f)" stroke="#e8eef6" stroke-opacity=".85" stroke-width="1.5">${hex}</g>
  <rect x="40" y="-30" width="34" height="270" fill="url(#s)" transform="rotate(24 80 104)"/></g></svg>`;}};

/* RHINO · Titan's Fury — three ember flame tongues rising behind the shoulders (blurred body + hot thin core) */
ART.fury_flames={w:128,h:192,svg:()=>{
  const fl=(cx,base,top,w)=>`M${cx} ${base} C${cx-w} ${base-40} ${cx-w*.6} ${top+50} ${cx} ${top} C${cx+w*.6} ${top+50} ${cx+w} ${base-40} ${cx} ${base}Z`;
  const body=fl(64,186,18,34)+fl(30,186,70,22)+fl(98,186,62,22),core=fl(64,180,58,13)+fl(31,180,100,8)+fl(97,180,94,8);
  return `<svg ${XL} width="128" height="192" viewBox="0 0 128 192"><defs>
  <linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff6a3a" stop-opacity=".75"/><stop offset=".5" stop-color="#ffb35a" stop-opacity=".5"/><stop offset="1" stop-color="#fff0d8" stop-opacity="0"/></linearGradient>
  <linearGradient id="c" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff0d8" stop-opacity=".8"/><stop offset="1" stop-color="#ffd08a" stop-opacity="0"/></linearGradient>
  <filter id="b" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="3.2"/></filter></defs>
  <path d="${body}" fill="url(#g)" filter="url(#b)"/><path d="${core}" fill="url(#c)"/></svg>`;}};

/* ---------------- loader ---------------- */
const IMG={};
const load=k=>{const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(ART[k].svg());IMG[k]=im;};
for(const k in ART)load(k);
window.svgImg=k=>{const im=IMG[k];return im&&im.complete&&im.naturalWidth?im:null;};
/* other files add their own art: svgRegister('key',{w,h,svg:()=>'<svg ...>'}) */
window.svgRegister=(k,a)=>{ART[k]=a;load(k);};
window.SVG_XL=XL;

/* ---------------- generic animated SVG effect ----------------
   s: size multiplier (1 = art pixel size in world px) · ax/ay pivot · rot (screen radians) · spin (rad/s)
   grow: [from,to] scale over growT · pop: quick overshoot · squash: vertical scale (iso) · flip: mirror
   follow: entity to stick to · blend: 'lighter' for small cores only */
class SvgFx{constructor(o){Object.assign(this,{t:0,life:.4,layer:'top',z:0,s:1,ax:.5,ay:.5,rot:0,spin:0,alpha:1,grow:[.6,1],growT:.12,fadeIn:.04,fadeOut:.5,squash:1,flip:1,blend:null,drift:0},o);
    if(this.layer==='sorted')this.sy0=(this.follow?this.follow.y:this.y)+(this.sortOff||2);}
  get sy(){return this.follow?this.follow.y+(this.sortOff||2):this.sy0;}
  update(dt){this.t+=dt;if(this.follow&&this.follow.dead)return false;return this.t<this.life;}
  draw(){const im=window.svgImg(this.key);if(!im)return;const A=ART[this.key],t=this.t,k=t/this.life,
      g=this.grow[0]+(this.grow[1]-this.grow[0])*eOut(Math.min(1,t/this.growT)),
      a=this.alpha*Math.min(1,t/Math.max(.001,this.fadeIn))*(k>1-this.fadeOut?Math.max(0,(1-k)/this.fadeOut):1);if(a<=.003)return;
      const e=this.follow||this,[x,y]=P(e.x,e.y,this.z+(this.follow&&this.follow.z||0)-this.drift*k),W=A.w*this.s*g,H=A.h*this.s*g;
    ctx.save();ctx.translate(x,y);if(this.squash!==1)ctx.scale(1,this.squash);ctx.rotate(this.rot+this.spin*t);if(this.flip<0)ctx.scale(-1,1);
    ctx.globalAlpha=Math.min(1,a);if(this.blend)ctx.globalCompositeOperation=this.blend;ctx.drawImage(im,-W*this.ax,-H*this.ay,W,H);ctx.restore();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}}
window.SvgFx=SvgFx;
window.svgFx=(key,o)=>addFx(new SvgFx(Object.assign({key},o)));
})();
