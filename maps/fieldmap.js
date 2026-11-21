/* =====================================================================
   AETHERFALL — generic painted field map (Viking zone and later regions)
   createFieldHost(base, cfg) builds a map from a small config (maps/viking-maps.js)
   and the sprite catalog (maps/viking-catalog.js, window.VK_CAT).

   Same host interface as the Snow-Pine host: drawBase / drawSorted / foreground,
   blocked / clear / route / nearest, spawn, warps, warpAt, update, setPlayer.
   Map units = map pixels (MS 1.0). Everything is placed from cfg.seed, so a map is identical on every load.

   cfg fields (all optional except W,H):
     seed, W, H, ground:'snow'|'texTundra'|..., patches:[{tex,scale,thr}],
     trails:[[pts..]] (first = main; 'B' marks the bridge), trailKind:'snow'|'dirt'|'cobble', trailW,
     stream:[pts..] (may contain 'B'), bridge:[x,y],
     sea:{side:'N'|'E'|'S'|'W', d, amp}, lakes:[{x,y,rx,ry}],
     border:{set:[names], band}, groves:{set:[names], thr, dens}, open:[names] (props), edge:[names] (grove-edge props),
     decals:[names] (flat, baked), grass:[names] (flat, swaying), seaSet:[names],
     land:[{n,x,y,flip}] (placed pieces), clusters:[{x,y,r,set:[names],n}],
     clearings:[[x,y,r]], warps:[{x,y,to,at,label}], mood:'sun'|'cold'|'storm'|'dark'|'glacier'|'cave'|'town'|'mine'
   ===================================================================== */
(function(){'use strict';
/* Low picture quality (chosen by the player or stepped down automatically): no light shafts / drifting glows and no cloud shadows — the map's colour mood stays */
const LITE=()=>typeof Q!=='undefined'&&typeof QUALITY!=='undefined'&&Q===QUALITY.low;
/* warp portal drawn in code: glowing ground ring, a soft light column and three rings of light spinning upward */
window.warpName=l=>String(l).replace(/\s*Lv\.?\s*\d+\s*[–-]\s*\d+\s*$/,'').trim();
window.drawCodeWarp=function(g,x,y,t,ph){ph=ph||0;const p=.8+.2*Math.sin(t*.003+ph);g.save();
  let gr=g.createRadialGradient(x,y,4,x,y,78);gr.addColorStop(0,'rgba(210,245,255,.85)');gr.addColorStop(.35,'rgba(110,200,255,.55)');gr.addColorStop(1,'rgba(60,140,255,0)');g.fillStyle=gr;g.beginPath();g.ellipse(x,y,78,32,0,0,7);g.fill();
  g.globalCompositeOperation='lighter';
  gr=g.createLinearGradient(0,y-120,0,y);gr.addColorStop(0,'rgba(120,210,255,0)');gr.addColorStop(1,`rgba(150,225,255,${.5*p})`);g.fillStyle=gr;g.beginPath();g.ellipse(x,y-64,40,70,0,0,7);g.fill();
  for(let k=0;k<3;k++){const u=((t*.00045+k/3+ph*.1)%1),yy=y-u*86,r=46*(1-u*.45),a=Math.sin(u*Math.PI)*.9*p,rot=t*.004*(k%2?1:-1)+k;
    g.strokeStyle=`rgba(170,235,255,${a})`;g.lineWidth=4.5-u*2;g.beginPath();g.ellipse(x,yy,r,r*.38,0,rot,rot+4.4);g.stroke();
    g.strokeStyle=`rgba(255,255,255,${a*.8})`;g.lineWidth=1.2;g.beginPath();g.ellipse(x,yy,r,r*.38,0,rot+.4,rot+1.8);g.stroke();}
  g.strokeStyle=`rgba(190,240,255,${.75*p})`;g.lineWidth=3.2;g.beginPath();g.ellipse(x,y,60,23,0,0,7);g.stroke();g.strokeStyle=`rgba(120,200,255,${.5*p})`;g.lineWidth=7;g.beginPath();g.ellipse(x,y,64,25,0,0,7);g.stroke();
  for(let k=0;k<6;k++){const a=t*.0016+k*1.047+ph;g.fillStyle=`rgba(230,250,255,${.8*p})`;g.beginPath();g.arc(x+Math.cos(a)*60,y+Math.sin(a)*23,3,0,7);g.fill();}
  g.restore();};
/* shared ambient life (field maps and the hand-made Snow Pine use the same code) */
window.mkFieldLife=function(E){const {CAVE,MOOD,THEME,SNOWTH,WINDK,LAKETEX,SEA,cfg,WALLS,objs,stream,isSea,inCanal,inLake,segDist,hash,breeze,viewRect,blocked,wallAt}=E,coast=E.coast||[],getPly=E.getPly||(()=>null),seaDepth=E.seaDepth||(()=>-1e9);
const OUTDOOR=!CAVE,LIQUID=!/SeaIce|Ice/.test(LAKETEX),JUNGLY=THEME==='jungle'||MOOD==='jungle'||MOOD==='cloud'||MOOD==='gold';
const LEAFY=JUNGLY||MOOD==='dark'||(!SNOWTH&&OUTDOOR);
const FIRE=/torch|Torch|razier|bonfire|lamp|Lamp|lantern|Lantern|AltarFire|forge|Forge|Andon|Campfire|ctCandle/,FALLS=/Falls$|MiniFall|frozenFalls|LavaFall|vcLavaFall/,VENT=/vcVent|vcVents2|vcSulfur|vcLavaPool|vcLavaMound|vcLavaSpire|azCenote|jpOnsen|oniRocks/;
const PUFF={};function puff(c){let s=PUFF[c];if(!s){s=document.createElement('canvas');s.width=s.height=64;const q=s.getContext('2d'),gr=q.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,`rgba(${c},1)`);gr.addColorStop(.5,`rgba(${c},.55)`);gr.addColorStop(1,`rgba(${c},0)`);q.fillStyle=gr;q.fillRect(0,0,64,64);PUFF[c]=s;}return s;}
let lakeRim=null;const foot=[],crit=[];let critT=1;
/* painted animal sprites (maps/life); k = on-screen width per source pixel. Returns false until the image has loaded */
const SPR={},SIL={};function spr(n){let i=SPR[n];if(!i){i=SPR[n]=new Image();i.src='maps/life/'+n+'.webp';}return i.naturalWidth?i:null;}
function dspr(g,n,x,y,k,flip,rot,mid,shadow){let i=spr(n);if(!i)return false;const w=i.naturalWidth*2*k,h=i.naturalHeight*2*k;
  if(shadow){let c=SIL[n];if(!c){c=SIL[n]=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;const q=c.getContext('2d');q.drawImage(i,0,0);q.globalCompositeOperation='source-in';q.fillStyle='#141a30';q.fillRect(0,0,c.width,c.height);}i=c;}
  g.save();g.translate(x,y);if(rot)g.rotate(rot);if(flip)g.scale(-1,1);g.drawImage(i,-w/2,mid?-h/2:-h,w,h);g.restore();return true;}
/* small animals: snow hares, little birds. They potter about, and bolt (or fly off) when the player comes close */
function critters(g,t,dt,v){if(!OUTDOOR||MOOD==='volcano'||MOOD==='storm'||MOOD==='sandstorm'||MOOD==='oni'||MOOD==='dragon'||MOOD==='spirit')return;const P=getPly(),DES=THEME==='desert'||THEME==='necro',GRK=THEME==='greek',JPN=THEME==='japan',CPT=THEME==='capital',hare=SNOWTH||DES||GRK||JPN||CPT,vw=v.x1-v.x0,vh=v.y1-v.y0;critT-=dt;
  if(critT<=0&&crit.length<(cfg.city?9:5)){critT=cfg.city?.7:1.2;for(let k=0;k<5;k++){const x=v.x0+Math.random()*vw,y=v.y0+Math.random()*vh;if(blocked(x,y)||isLiquid(x,y)||(P&&Math.hypot(x-P.x,y-P.y)<280))continue;
      crit.push({x,y,st:0,tm:1+Math.random()*3,a:0,dir:Math.random()<.5?1:-1,hop:0,mx:0,my:0,z:0,c:['#d84a3a','#3a8ad8','#e8c040','#48b060'][(Math.random()*4)|0],ph:Math.random()*6});break;}}
  for(let i=crit.length-1;i>=0;i--){const c=crit[i];if(c.x<v.x0-350||c.x>v.x1+350||c.y<v.y0-350||c.y>v.y1+350){crit.splice(i,1);continue;}
    if(c.st<2){c.a=Math.min(1,c.a+dt*1.5);if(P){const dx=c.x-P.x,dy=c.y-P.y,d=Math.hypot(dx,dy)||1;if(d<125){c.st=2;c.tm=0;c.mx=dx/d;c.my=dy/d;c.dir=dx>0?1:-1;}}}
    if(c.st===0){c.tm-=dt;if(c.tm<=0){const a=Math.random()*6.28,nx=c.x+Math.cos(a)*16,ny=c.y+Math.sin(a)*10;if(!blocked(nx,ny)&&!isLiquid(nx,ny)){c.st=1;c.hop=0;c.mx=Math.cos(a)*16;c.my=Math.sin(a)*10;c.dir=c.mx>0?1:-1;}c.tm=.6+Math.random()*3;}}
    else if(c.st===1){c.hop+=dt/.28;const k=Math.min(1,c.hop);c.x+=c.mx*dt/.28;c.y+=c.my*dt/.28;c.z=Math.sin(k*Math.PI)*5;if(k>=1){c.st=0;c.z=0;}}
    else{c.tm+=dt;if(hare){const sp=250;if(!blocked(c.x+c.mx*18,c.y+c.my*18)){c.x+=c.mx*sp*dt;c.y+=c.my*sp*.7*dt;}else c.tm+=dt*2;c.z=Math.abs(Math.sin(c.tm*16))*7;c.a=Math.max(0,1-(c.tm-.9)/.6);}
      else{c.x+=(c.mx*150+c.dir*40)*dt;c.y+=c.my*70*dt;c.z+=170*dt;c.a=Math.max(0,1-(c.tm-.7)/.7);}if(c.a<=0){crit.splice(i,1);continue;}}
    const X=c.x,Y=c.y-c.z,d=c.dir;g.globalAlpha=c.a*.22;g.fillStyle='#1c2030';g.beginPath();g.ellipse(c.x+c.z*.3,c.y+1,6,2.4,0,0,7);g.fill();g.globalAlpha=c.a;g.lineWidth=1;g.strokeStyle='rgba(70,50,40,.85)';
    const fr=hare?(CPT?(cfg.city?'cat':'rabbit'):JPN?((cfg.lakes||cfg.sea||cfg.stream)&&c.ph<2.2?'frog':'tanuki'):GRK?(cfg.sea&&seaDepth(c.x,c.y)>-260?'crab':'goat'):DES?'lizard':'hare')+(c.st===2?(Math.sin(c.tm*16)>0?2:3):c.st===1?2:(Math.sin(t*.0011+c.ph)>.55?1:0)):(CPT?'pigeon':JPN?'suzu':GRK?'owl':DES?'ibis':JUNGLY?'jbird':'spar')+(c.st===2?(Math.sin(t*.05+c.ph)>0?2:3):(Math.sin(t*.006+c.ph)>.75?1:0));
    if(dspr(g,fr,X,Y+1,hare?(DES?.13:.15):(DES?.15:.13),d<0)){g.globalAlpha=1;continue;}
    if(hare){g.fillStyle='#fbfbff';g.beginPath();g.ellipse(X,Y-5,7,5.2,0,0,7);g.fill();g.stroke();g.beginPath();g.ellipse(X+d*2.6,Y-13,1.6,4.4,d*.25,0,7);g.fill();g.stroke();g.beginPath();g.ellipse(X+d*5.4,Y-12.4,1.6,4.2,d*.5,0,7);g.fill();g.stroke();
      g.beginPath();g.arc(X+d*5,Y-8,3.8,0,7);g.fill();g.stroke();g.beginPath();g.arc(X-d*6.6,Y-5,2,0,7);g.fill();g.fillStyle='#2a2020';g.fillRect(X+d*6.2-.7,Y-9,1.5,1.5);}
    else{const fly=c.st===2,peck=!fly&&Math.sin(t*.006+c.ph)>.75?2:0;g.fillStyle=JUNGLY?c.c:'#9a7650';g.beginPath();g.ellipse(X,Y-4+peck*.4,5,3.6,-d*.2,0,7);g.fill();g.stroke();g.beginPath();g.arc(X+d*4.4,Y-7+peck,2.6,0,7);g.fill();g.stroke();
      g.fillStyle='#e8a030';g.beginPath();g.moveTo(X+d*6.6,Y-7.6+peck);g.lineTo(X+d*9.6,Y-6.6+peck*1.6);g.lineTo(X+d*6.6,Y-5.8+peck);g.fill();g.fillStyle='#201818';g.fillRect(X+d*4.8-.6,Y-8+peck,1.3,1.3);
      if(fly){const f=Math.sin(t*.05+c.ph)*6;g.fillStyle=JUNGLY?c.c:'#9a7650';for(const s2 of [-1,1]){g.beginPath();g.moveTo(X,Y-5);g.lineTo(X-d*3+s2*2,Y-5-f*s2-4);g.lineTo(X-d*6,Y-4);g.fill();g.stroke();}}
      else{g.fillStyle='#5a4030';g.beginPath();g.moveTo(X-d*4,Y-4);g.lineTo(X-d*9,Y-2.4);g.lineTo(X-d*4,Y-2);g.fill();}}
    g.globalAlpha=1;}}
let lifeL=null,vigC=null;const glints=[],rings=[],leaves=[],flies=[],smoke=[],birds=[],gusts=[],drips=[];const bats=[];let birdT=4,lifeLast=0,cloudSpr=null;
function lifeLists(){lifeL={fires:objs.filter(o=>(FIRE.test(o.n)&&!/Hall|house/i.test(o.n))||o.smolder),falls:objs.filter(o=>FALLS.test(o.n)),vents:objs.filter(o=>VENT.test(o.n)),founts:objs.filter(o=>/^cpFountain|Fountain$/.test(o.n)),
  leafy:objs.filter(o=>o.tree&&!/pine|Pine|spire|Spire|cliff|dead|Dead|bare|Bare|ice|Ice|crystal|vc|Burnt|bamboo|Bamboo/.test(o.n))};
  for(const o of lifeL.fires){const n=o.n;if(o.ph==null)o.ph=Math.random()*6.28;if(o.smolder){o.fy=o.smolder;o.smk=true;o.cold=true;continue;}o.fy=/torch|Torch|lamp|Lamp|lantern|Lantern/.test(n)?.86:/bonfire/.test(n)?.42:/AltarFire/.test(n)?.55:/forge|Forge/.test(n)?.9:.74;o.smk=/bonfire|razier|AltarFire|forge|Forge/.test(n);}}
const isLiquid=(x,y)=>(SEA&&isSea(x,y))||inCanal(x,y)||(LIQUID&&cfg.lakes&&inLake(x,y));
const isIce=(x,y)=>(!LIQUID&&cfg.lakes&&inLake(x,y));
function onStream(x,y){if(!stream.length)return false;const [d,i]=segDist(x,y,stream);return d<stream[i][4]*.42;}
/* ground level: drawn right after the baked ground, under every object */
function waterFx(g,t,dt,v){if(!lifeL)lifeLists();const vw=v.x1-v.x0,vh=v.y1-v.y0;
  /* sparkles */
  for(let k=0;k<5&&glints.length<70;k++){const x=v.x0+Math.random()*vw,y=v.y0+Math.random()*vh;const liq=isLiquid(x,y)||onStream(x,y),ice=!liq&&isIce(x,y);if(liq||ice)glints.push({x,y,l:0,L:.6+Math.random()*.9,ice,s:liq?1:.8});}
  g.save();g.globalCompositeOperation='lighter';
  for(let i=glints.length-1;i>=0;i--){const p=glints[i];p.l+=dt;if(p.l>p.L||p.x<v.x0-50||p.x>v.x1+50||p.y<v.y0-50||p.y>v.y1+50){glints.splice(i,1);continue;}const a=Math.sin(p.l/p.L*Math.PI);
    if(p.ice){g.strokeStyle=`rgba(235,250,255,${.8*a})`;g.lineWidth=1.3;g.beginPath();g.moveTo(p.x-4*a,p.y);g.lineTo(p.x+4*a,p.y);g.moveTo(p.x,p.y-4*a);g.lineTo(p.x,p.y+4*a);g.stroke();}
    else{g.fillStyle=`rgba(255,255,255,${.55*a})`;g.fillRect(p.x-5*p.s,p.y,10*p.s,1.6);g.fillRect(p.x-2,p.y-1.2,4,1);}}
  /* stream flow: light streaks slide downstream along the bed */
  if(stream.length){g.lineCap='round';for(let i=0;i<stream.length-2;i+=2){const p=stream[i];if(p[0]<v.x0-60||p[0]>v.x1+60||p[1]<v.y0-60||p[1]>v.y1+60)continue;
      const q=stream[i+2],dx=q[0]-p[0],dy=q[1]-p[1];for(let k=0;k<2;k++){const h=hash(i*7+k,13),u=((t*.00055*(.8+h*.5)+h)%1),off=(hash(i,k+5)-.5)*p[4]*.6;
        const x=p[0]+dx*u+p[2]*off,y=p[1]+dy*u+p[3]*off,a=Math.sin(u*Math.PI)*.45;g.strokeStyle=`rgba(235,250,255,${a})`;g.lineWidth=1.8;g.beginPath();g.moveTo(x,y);g.lineTo(x+dx*.35,y+dy*.35);g.stroke();}}}
  g.restore();
  /* sea: foam lines roll in to the shore and fade */
  if(SEA&&coast.length){const sd=SEA.side,ox=sd==='E'?1:sd==='W'?-1:0,oy=sd==='S'?1:sd==='N'?-1:0;g.lineCap='round';g.lineJoin='round';
    for(let k=0;k<3;k++){let px=0,py=0,pa=-1;for(let i=0;i<coast.length;i++){const p=coast[i];if(p[0]<v.x0-80||p[0]>v.x1+80||p[1]<v.y0-80||p[1]>v.y1+80){pa=-1;continue;}
        const u=((t*.00016+k/3+Math.sin(i*.021+k*2.1)*.22+Math.sin(i*.0063)*.3)%1+1)%1,d=4+58*(1-u)*(1-u)+Math.sin(i*.13+k)*3,a=Math.sin(Math.min(1,u*1.1)*Math.PI)*(.25+.3*u),x=p[0]+ox*d,y=p[1]+oy*d;
        if(pa>=0&&(a+pa)>.06){g.strokeStyle=`rgba(255,255,255,${(a+pa)/2})`;g.lineWidth=1.6+2.4*u;g.beginPath();g.moveTo(px,py);g.lineTo(x,y);g.stroke();}px=x;py=y;pa=a;}}}
  /* lakes: a thin line of light laps in and out along the bank */
  if(LIQUID&&cfg.lakes&&cfg.lakes[0]&&cfg.lakes[0].rx){if(!lakeRim){lakeRim=cfg.lakes.map(l=>{const pts=[];for(let k=0;k<96;k++){const a=k/96*6.2832,cx=Math.cos(a),cy=Math.sin(a);let lo=0,hi=Math.max(l.rx,l.ry)*1.8;for(let n=0;n<14;n++){const m=(lo+hi)/2;inLake(l.x+cx*m,l.y+cy*m)?lo=m:hi=m;}pts.push([cx,cy,lo]);}return pts;});}
    cfg.lakes.forEach((l,li)=>{if(l.x+l.rx*1.6<v.x0||l.x-l.rx*1.6>v.x1||l.y+l.ry*1.6<v.y0||l.y-l.ry*1.6>v.y1)return;const R=lakeRim[li];
      for(let k=0;k<2;k++){const u=((t*.00028+k*.5+li*.37)%1),d=5+16*u;g.strokeStyle=`rgba(240,255,255,${Math.sin(u*Math.PI)*.42})`;g.lineWidth=2.2-u;g.beginPath();
        for(let i=0;i<=96;i++){const q=R[i%96],r=Math.max(0,q[2]-d-3*Math.sin(i*.9+li));const x=l.x+q[0]*r,y=l.y+q[1]*r;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}});}
  /* the player's own tracks in the snow */
  {const P=getPly();if(P&&SNOWTH&&OUTDOOR){if(!foot.last)foot.last={x:P.x,y:P.y,s:1};const dx=P.x-foot.last.x,dy=P.y-foot.last.y,dd=Math.hypot(dx,dy);
      if(dd>400)foot.last={x:P.x,y:P.y,s:1};else if(dd>17){const s2=foot.last.s=-foot.last.s,nx=-dy/dd,ny=dx/dd;if(!isLiquid(P.x,P.y)&&!isIce(P.x,P.y))foot.push({x:P.x+nx*5*s2,y:P.y+ny*3*s2+2,a:Math.atan2(dy,dx),l:0});foot.last.x=P.x;foot.last.y=P.y;if(foot.length>70)foot.shift();}}
    for(let i=foot.length-1;i>=0;i--){const f=foot[i];f.l+=dt;if(f.l>11){foot.splice(i,1);continue;}const a=Math.min(1,(11-f.l)/4);g.fillStyle=`rgba(120,116,180,${.5*a})`;g.beginPath();g.ellipse(f.x,f.y+.8,4,2.3,f.a,0,7);g.fill();g.fillStyle=`rgba(255,252,250,${.55*a})`;g.beginPath();g.ellipse(f.x-.6,f.y-1.3,3,1.2,f.a,0,7);g.fill();}}
  critters(g,t,dt,v);
  /* rings on still water */
  if(Math.random()<dt*2.2&&rings.length<8){for(let k=0;k<4;k++){const x=v.x0+Math.random()*vw,y=v.y0+Math.random()*vh;if((LIQUID&&cfg.lakes&&inLake(x,y,-30))||inCanal(x,y)){rings.push({x,y,l:0});break;}}}
  for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.l+=dt;if(r.l>2.2){rings.splice(i,1);continue;}const u=r.l/2.2;g.strokeStyle=`rgba(230,250,255,${.5*(1-u)})`;g.lineWidth=1.4;
    for(const k of [1,.6]){g.beginPath();g.ellipse(r.x,r.y,4+u*30*k,(4+u*30*k)*.42,0,0,7);g.stroke();}}
  /* cave drips: a drop falls by the wall and leaves a small ring */
  if(WALLS&&Math.random()<dt*1.4&&drips.length<6){for(let k=0;k<6;k++){const x=v.x0+Math.random()*vw,y=v.y0+Math.random()*vh;if(!blocked(x,y)&&wallAt(x,y-40)){drips.push({x,y,l:0});break;}}}
  for(let i=drips.length-1;i>=0;i--){const d=drips[i];d.l+=dt;if(d.l>1.4){drips.splice(i,1);continue;}if(d.l<.35){const z=(1-d.l/.35)*70;g.fillStyle='rgba(200,230,255,.8)';g.fillRect(d.x-1,d.y-z-4,2,5);}
    else{const u=(d.l-.35)/1.05;g.strokeStyle=`rgba(200,230,255,${.55*(1-u)})`;g.lineWidth=1.2;g.beginPath();g.ellipse(d.x,d.y,3+u*14,(3+u*14)*.4,0,0,7);g.stroke();}}}
/* above everything (world space), before the screen-space mood */
function life(g,t,dt,night){if(!lifeL)lifeLists();const v=viewRect(g),vw=v.x1-v.x0,vh=v.y1-v.y0,inV=(x,y,m)=>x>v.x0-m&&x<v.x1+m&&y>v.y0-m&&y<v.y1+m;const wk=breeze(t)*WINDK;
  /* fire: flicker glow, light pool on the ground, smoke, sparks */
  g.save();g.globalCompositeOperation='lighter';
  for(const o of lifeL.fires){if(!inV(o.x,o.y,200))continue;const fx=o.x+(o.smx||0)*o.w*(o.flip?-1:1),fy=o.y-o.h*o.fy,f=.75+.15*Math.sin(t*.013+o.ph)+.1*Math.sin(t*.031+o.ph*3);
    if(!CAVE&&!o.cold){const r=(night?95:62)*f,gr=g.createRadialGradient(fx,fy,0,fx,fy,r);gr.addColorStop(0,`rgba(255,190,90,${(night?.42:.24)*f})`);gr.addColorStop(1,'rgba(255,120,40,0)');g.fillStyle=gr;g.fillRect(fx-r,fy-r,2*r,2*r);
      const pr=(night?120:70)*f,pg=g.createRadialGradient(o.x,o.y,0,o.x,o.y,pr);pg.addColorStop(0,`rgba(255,170,80,${night?.22:.09})`);pg.addColorStop(1,'rgba(255,170,80,0)');g.fillStyle=pg;g.save();g.translate(o.x,o.y);g.scale(1,.45);g.translate(-o.x,-o.y);g.fillRect(o.x-pr,o.y-pr,2*pr,2*pr);g.restore();}
    if(o.smk&&Math.random()<dt*(o.cold?1.6:/bonfire|orge/.test(o.n)?5:2.5)&&smoke.length<70)smoke.push({x:fx+(Math.random()-.5)*8,y:fy-6,vx:8+wk*24,vy:-26-Math.random()*14,l:0,L:2.4+Math.random()*1.4,r:o.smx!=null?6.5:o.cold?3.5:5,k:o.smx!=null?'c':'s'});
    if(/bonfire|razier/.test(o.n)&&Math.random()<dt*3&&smoke.length<70)smoke.push({x:fx+(Math.random()-.5)*10,y:fy,vx:(Math.random()-.5)*20+wk*14,vy:-60-Math.random()*40,l:0,L:.8+Math.random()*.6,r:1.4,k:'e'});}
  /* lava and vents: pulsing glow, steam */
  for(const o of lifeL.vents){if(!inV(o.x,o.y,220))continue;const lava=/Lava|vcVent|vcVents/.test(o.n),p=.7+.3*Math.sin(t*.002+o.ph);
    if(lava){const r=o.w*.6,gr=g.createRadialGradient(o.x,o.y-o.h*.3,0,o.x,o.y-o.h*.3,r);gr.addColorStop(0,`rgba(255,110,30,${.22*p})`);gr.addColorStop(1,'rgba(255,60,10,0)');g.fillStyle=gr;g.fillRect(o.x-r,o.y-o.h*.3-r,2*r,2*r);}
    if(Math.random()<dt*2&&smoke.length<70)smoke.push({x:o.x+(Math.random()-.5)*o.w*.3,y:o.y-o.h*.45,vx:6+wk*20,vy:-22-Math.random()*12,l:0,L:3+Math.random(),r:8,k:/Cenote/.test(o.n)?'m':lava?'s':'y'});}
  g.restore();
  /* hot springs: steam drifting off the water */
  if(cfg.hot&&cfg.lakes)for(const l of cfg.lakes){if(!inV(l.x,l.y,l.rx+100))continue;if(Math.random()<dt*l.rx/40&&smoke.length<90){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*.8;smoke.push({x:l.x+Math.cos(a)*l.rx*r,y:l.y+Math.sin(a)*l.ry*r,vx:6+wk*16,vy:-18-Math.random()*10,l:0,L:2.2+Math.random()*1.4,r:9,k:'m'});}}
  /* waterfalls: mist rolling off the foot */
  for(const o of lifeL.falls){if(!inV(o.x,o.y,200))continue;const lava=/Lava/.test(o.n),frozen=/frozen/.test(o.n);if(frozen)continue;
    /* the falling sheet: bright streaks sliding down the water */
    g.save();g.globalCompositeOperation='lighter';const top=o.y-o.h*.86,bot=o.y-o.h*.22,hw=o.w*.16;for(let k=0;k<9;k++){const h=hash(k,o.x|0),u=((t*.0009*(1+h*.4)+h)%1),x=o.x+(h-.5)*2*hw,y=top+(bot-top)*u,a=Math.sin(u*Math.PI)*.4;
      g.strokeStyle=lava?`rgba(255,180,80,${a})`:`rgba(255,255,255,${a})`;g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(x,y+18);g.stroke();}g.restore();
    if(Math.random()<dt*7&&smoke.length<90)smoke.push({x:o.x+(Math.random()-.5)*o.w*.35,y:o.y-o.h*.12,vx:(Math.random()-.5)*30+wk*10,vy:-10-Math.random()*16,l:0,L:1.6+Math.random(),r:7,k:lava?'e':'m'});}
  /* fountains: droplets thrown up from the spouts arc back into the basin, with a little mist and glints on the water */
  for(const o of lifeL.founts){if(!inV(o.x,o.y,220))continue;const sm=o.w<300,top=o.y-o.h*(sm?.62:.6),bas=o.y-o.h*(sm?.3:.28);if(!o.drops)o.drops=[];
    if(o.drops.length<(sm?22:46))for(let k=0;k<(sm?2:3);k++){const a=(Math.random()-.5)*Math.PI*1.2;o.drops.push({x:o.x+(Math.random()-.5)*o.w*.06,y:top,vx:Math.sin(a)*(sm?26:44),vy:-(sm?34:52)-Math.random()*22,l:0});}
    g.save();g.globalCompositeOperation='lighter';for(let i=o.drops.length-1;i>=0;i--){const d=o.drops[i];d.l+=dt;d.vy+=190*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;if(d.y>bas+Math.abs(d.x-o.x)*.15||d.l>2){o.drops.splice(i,1);if(Math.random()<.25&&smoke.length<90)smoke.push({x:d.x,y:bas,vx:wk*8,vy:-8-Math.random()*6,l:0,L:1+Math.random()*.6,r:4,k:'m'});continue;}
      g.fillStyle=`rgba(225,245,255,${.75*Math.min(1,(2-d.l))})`;g.fillRect(d.x-1.1,d.y-1.6,2.2,3.2);}g.restore();}
  for(let i=smoke.length-1;i>=0;i--){const p=smoke[i];p.l+=dt;if(p.l>p.L){smoke.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.k==='e')p.vy+=30*dt;const u=p.l/p.L,a=Math.sin(u*Math.PI);
    if(p.k==='e'){g.fillStyle=`rgba(255,${160+60*(1-u)|0},60,${.9*a})`;g.fillRect(p.x-1,p.y-1,2.2,2.2);continue;}
    const r=p.r*(1+u*2.6)*1.6,c=p.k==='m'?'235,245,250':p.k==='y'?'230,220,150':p.k==='c'?'226,224,232':'130,125,132';g.globalAlpha=(p.k==='m'?.45:p.k==='c'?.5:.32)*a;g.drawImage(puff(c),p.x-r,p.y-r,2*r,2*r);g.globalAlpha=1;}
  /* falling leaves from broadleaf canopies */
  if(LEAFY&&lifeL.leafy.length&&leaves.length<46){const n=dt*(4+wk*8);for(let k=0;k<3&&Math.random()<n;k++){const o=lifeL.leafy[(Math.random()*lifeL.leafy.length)|0];if(!inV(o.x,o.y,40))continue;
      const pal=MOOD==='dark'?['#7a5a2a','#5a4a2a','#8a6a3a']:JUNGLY?['#6aa83a','#a8c840','#d8b040','#4a8a3a']:['#c88a30','#d8a840','#a85a2a'];
      leaves.push({x:o.x+(Math.random()-.5)*o.w*.6,y:o.y+Math.random()*30-6,z:o.h*(.45+Math.random()*.35),vz:22+Math.random()*16,ph:Math.random()*6.28,rot:Math.random()*6.28,c:pal[(Math.random()*pal.length)|0],l:0,rest:0});}}
  for(let i=leaves.length-1;i>=0;i--){const f=leaves[i];f.l+=dt;if(f.z>0){f.z-=f.vz*dt;f.x+=(Math.sin(t*.003+f.ph)*22+10+wk*34)*dt;f.rot+=dt*(2+Math.sin(f.ph)*2);if(f.z<=0){f.z=0;f.rest=f.l;}}
    const fade=f.z>0?1:Math.max(0,1-(f.l-f.rest)/2.5);if(fade<=0||f.l>14){leaves.splice(i,1);continue;}
    if(f.z>0){g.fillStyle=`rgba(30,40,20,${.18*fade})`;g.beginPath();g.ellipse(f.x+f.z*.25,f.y,2.6,1.2,0,0,7);g.fill();}
    g.save();g.translate(f.x,f.y-f.z);g.rotate(f.rot);g.scale(1,Math.abs(Math.cos(t*.006+f.ph))*.7+.3);g.globalAlpha=fade;g.fillStyle=f.c;g.beginPath();g.ellipse(0,0,5.6,2.8,0,0,7);g.fill();g.strokeStyle='rgba(60,40,20,.55)';g.lineWidth=.8;g.stroke();g.restore();}
  /* butterflies by day, fireflies by night or in the dark wood */
  const DESF=(THEME==='desert'&&MOOD!=='sandstorm')||(THEME==='greek'&&MOOD==='greek')||(THEME==='japan'&&(MOOD==='japan'||MOOD==='sakura'))||(THEME==='capital'&&MOOD==='capital');const want=OUTDOOR&&THEME!=='necro'?(DESF&&!night?4:night||MOOD==='dark'?(JUNGLY||MOOD==='dark'||MOOD==='sun'||MOOD==='town'?16:0):(JUNGLY||MOOD==='sun'||MOOD==='town'?5:0)):0;
  while(flies.length<want){const x=v.x0+Math.random()*vw,y=v.y0+Math.random()*vh;if(blocked(x,y)&&Math.random()<.7)continue;flies.push({x,y,h:12+Math.random()*30,a:Math.random()*6.28,s:20+Math.random()*25,ph:Math.random()*6.28,c:['#ffd84a','#ff9a3a','#7ac8ff','#ffffff','#ff7ab0'][(Math.random()*5)|0],glow:night||MOOD==='dark'});}
  if(flies.length>want)flies.length=want;
  for(const b of flies){b.a+=(Math.sin(t*.0013+b.ph)*1.6)*dt;b.x+=Math.cos(b.a)*b.s*dt;b.y+=Math.sin(b.a)*b.s*.6*dt;if(!inV(b.x,b.y,80)){b.x=v.x0+Math.random()*vw;b.y=v.y0+Math.random()*vh;}
    const hy=b.y-b.h-Math.sin(t*.004+b.ph)*6;if(b.glow){const p=.5+.5*Math.sin(t*.004+b.ph*3);g.save();g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(b.x,hy,0,b.x,hy,10);gr.addColorStop(0,`rgba(230,255,140,${.75*p})`);gr.addColorStop(1,'rgba(230,255,140,0)');g.fillStyle=gr;g.fillRect(b.x-10,hy-10,20,20);g.restore();}
    else{const fl=Math.abs(Math.sin(t*.025+b.ph));g.fillStyle='rgba(30,40,20,.15)';g.beginPath();g.ellipse(b.x,b.y,3,1.2,0,0,7);g.fill();if(dspr(g,THEME==='capital'?(fl>.45?'wbfly0':'wbfly1'):THEME==='japan'?(fl>.45?'pbfly0':'pbfly1'):THEME==='greek'?(fl>.45?'cicada1':'cicada0'):THEME==='desert'?(fl>.45?'dfly0':'dfly1'):(fl>.45?'bfly0':'bfly1'),b.x,hy,THEME==='desert'||THEME==='greek'||THEME==='japan'||THEME==='capital'?.1:.11,Math.cos(b.a)<0,0,true))continue;g.fillStyle=b.c;g.strokeStyle='rgba(50,30,20,.7)';g.lineWidth=.7;
      for(const s of [-1,1]){g.beginPath();g.ellipse(b.x+s*4.4*fl,hy,4.6*fl+.5,3.6,0,0,7);g.fill();g.stroke();}g.fillStyle='#3a2a1a';g.fillRect(b.x-.6,hy-2,1.2,4);}}
  /* caves: a few bats flitting about under the roof */
  if(CAVE){while(bats.length<4)bats.push({x:v.x0+Math.random()*vw,y:v.y0+Math.random()*vh,a:Math.random()*6.28,s:70+Math.random()*50,ph:Math.random()*6.28,h:50+Math.random()*40});
    for(const b of bats){b.a+=(Math.sin(t*.0017+b.ph)*2.4+Math.sin(t*.0041+b.ph*2))*dt;b.x+=Math.cos(b.a)*b.s*dt;b.y+=Math.sin(b.a)*b.s*.6*dt;if(!inV(b.x,b.y,120)){b.x=v.x0+Math.random()*vw;b.y=v.y0+Math.random()*vh;}
      const hy=b.y-b.h,f=Math.sin(t*.03+b.ph);g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(b.x,b.y,7,2.6,0,0,7);g.fill();if(dspr(g,['bat0','bat1','bat2','bat1'][((t*.014+b.ph*3)|0)%4],b.x,hy,.16,false,0,true))continue;g.fillStyle='#2a2030';g.strokeStyle='rgba(10,8,14,.8)';g.lineWidth=.8;
      for(const s2 of [-1,1]){g.beginPath();g.moveTo(b.x,hy);g.quadraticCurveTo(b.x+s2*5,hy-6-f*5,b.x+s2*11,hy-f*6);g.lineTo(b.x+s2*7,hy+1.5-f*2);g.lineTo(b.x+s2*4,hy+3);g.closePath();g.fill();g.stroke();}g.beginPath();g.ellipse(b.x,hy,2.6,3.4,0,0,7);g.fill();}}
  /* a bird flock now and then, with shadows sliding over the ground */
  if(OUTDOOR&&!night&&MOOD!=='sandstorm'&&MOOD!=='oni'&&MOOD!=='dragon'&&MOOD!=='spirit'){birdT-=dt;if(birdT<=0&&!birds.length){birdT=11+Math.random()*16;const fromL=Math.random()<.5,y0=v.y0+vh*(.15+Math.random()*.5),sp=150+Math.random()*60;
      for(let k=0;k<3+((Math.random()*4)|0);k++)birds.push({x:(fromL?v.x0-120:v.x1+120)-(fromL?1:-1)*k*38,y:y0+((k%2)?1:-1)*k*14,vx:(fromL?1:-1)*sp,vy:-sp*.12,ph:Math.random()*6});}}
  for(let i=birds.length-1;i>=0;i--){const b=birds[i];b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<v.x0-400||b.x>v.x1+400){birds.splice(i,1);continue;}const fl=Math.sin(t*.018+b.ph);
    {const gn=THEME==='capital'?(Math.sin(t*.009+b.ph)>-.3?'hawk0':'hawk1'):THEME==='japan'?(Math.sin(t*.009+b.ph)>-.3?'crane0':'crane1'):THEME==='greek'?(Math.sin(t*.009+b.ph)>-.3?'sgull0':'sgull1'):(THEME==='desert'||THEME==='necro')?(Math.sin(t*.009+b.ph)>-.3?'vult0':'vult1'):Math.sin(t*.009+b.ph)>-.3?'gull0':'gull1',rt=Math.atan2(b.vy,b.vx)+Math.PI/2;g.globalAlpha=.2;const ok=dspr(g,gn,b.x+80,b.y+170,.17,false,rt,true,true);g.globalAlpha=1;if(ok&&dspr(g,gn,b.x,b.y,.17,false,rt,true))continue;}
    {const sx=b.x+80,sy=b.y+170;g.strokeStyle='rgba(20,25,45,.2)';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(sx-17,sy-fl*8);g.quadraticCurveTo(sx-6,sy-3,sx,sy);g.quadraticCurveTo(sx+6,sy-3,sx+17,sy-fl*8);g.stroke();g.fillStyle='rgba(20,25,45,.2)';g.beginPath();g.ellipse(sx,sy+1,3.5,5,0,0,7);g.fill();}
    g.strokeStyle='rgba(40,40,55,.85)';g.lineWidth=1.8;g.lineCap='round';g.beginPath();g.moveTo(b.x-8,b.y-fl*5);g.quadraticCurveTo(b.x-3,b.y-2,b.x,b.y);g.quadraticCurveTo(b.x+3,b.y-2,b.x+8,b.y-fl*5);g.stroke();}
  /* blowing snow along the ground when the wind picks up */
  if(SNOWTH&&OUTDOOR){if(wk>.45&&Math.random()<dt*10*wk&&gusts.length<40)gusts.push({x:v.x0-40+Math.random()*vw*.6,y:v.y0+Math.random()*vh,l:0,L:1.4+Math.random(),len:30+Math.random()*50,sp:180+Math.random()*120});
    for(let i=gusts.length-1;i>=0;i--){const d=gusts[i];d.l+=dt;if(d.l>d.L){gusts.splice(i,1);continue;}d.x+=d.sp*dt;const a=Math.sin(d.l/d.L*Math.PI)*.4;const gr=g.createLinearGradient(d.x-d.len,0,d.x,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,`rgba(255,255,255,${a})`);g.fillStyle=gr;g.fillRect(d.x-d.len,d.y,d.len,1.6);}}
  /* cloud shadows drifting over everything */
  if(OUTDOOR&&MOOD!=='storm'&&MOOD!=='volcano'&&!LITE()){if(!cloudSpr){cloudSpr=document.createElement('canvas');cloudSpr.width=cloudSpr.height=256;const q=cloudSpr.getContext('2d');for(let k=0;k<9;k++){const x=60+Math.random()*136,y=70+Math.random()*116,r=50+Math.random()*50,gr=q.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(20,30,60,.5)');gr.addColorStop(1,'rgba(20,30,60,0)');q.fillStyle=gr;q.fillRect(0,0,256,256);}}
    const S=1500,ox=t*.016,oy=t*.005,i0=Math.floor((v.x0-ox)/S)-1,i1=Math.floor((v.x1-ox)/S)+1,j0=Math.floor((v.y0-oy)/S)-1,j1=Math.floor((v.y1-oy)/S)+1;g.save();g.imageSmoothingQuality='low';g.globalAlpha=night?.12:.3;
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const h=hash(i,j+77);if(h<.35)continue;const sz=700+hash(i+3,j)*600,x=i*S+ox+hash(i,j+5)*S*.6,y=j*S+oy+hash(i+9,j)*S*.6;if(x+sz<v.x0||x>v.x1||y+sz*.6<v.y0||y>v.y1)continue;g.drawImage(cloudSpr,x,y,sz,sz*.62);}g.restore();}
  /* soft vignette: the eye settles on the middle of the screen */
  if(OUTDOOR){const cw=g.canvas.width,ch=g.canvas.height;   /* painted once into a small canvas (a full-screen gradient fill every frame was slow) */
    if(!vigC||vigC._w!==cw||vigC._h!==ch){vigC=document.createElement('canvas');const w=vigC.width=Math.ceil(cw/4),h=vigC.height=Math.ceil(ch/4);vigC._w=cw;vigC._h=ch;const q=vigC.getContext('2d');q.setTransform(w/cw,0,0,h/ch,0,0);
      const vg=q.createRadialGradient(cw/2,ch/2,Math.min(cw,ch)*.42,cw/2,ch/2,Math.hypot(cw,ch)*.6);vg.addColorStop(0,'rgba(24,18,40,0)');vg.addColorStop(1,'rgba(24,18,40,.3)');q.fillStyle=vg;q.fillRect(0,0,cw,ch);}
    g.save();g.setTransform(1,0,0,1,0,0);g.imageSmoothingQuality='low';g.drawImage(vigC,0,0,cw,ch);g.restore();}}
return {waterFx,life};};
/* owner 2026-11-19: "maps are small for a Ragnarok-style game and it's mostly trees" —
   outdoor fields are laid out 1.5x larger (all hand-placed coordinates scaled), with fewer grove masses,
   more props in the open and a few extra landmarks in their own clearings. Towns and walled caves keep their size. */
const WAYKIT={
  vik:{way:['signpostOld','fence1','fence2','lanternPole','runestoneW','runestoneS','torch1','stoneLantern','barrel','hayBale','woodpile','totem','brokenCart','berryS'],center:['bonfire'],around:['woodpile','barrels','barrel','shieldRack','axeRack','cargoCart','hayBale','chest','fishRack']},
  azt:{way:['azTorch','azStele','azTotem','azSign','azBrazier','azPots','azClayPots','azShrine','azMaizeBasket','azBanner','azHibRed','azFlowWhite'],center:['azBrazier'],around:['azStallFruit','azClayPots','azCacaoSack','azMaizeBasket','azDrum','azCart','azBench','azPots']},
  egy:{way:['egTorch','egStele','egSign','egObeliskBroken','egColBroken','egJars','egPots','egBrazier','egCatStatue','egJackalStatue','egPalmSprout'],center:['egBrazier'],around:['egSacks','egJars','egCart','egStallSpice','egStallPot','egBench','egPots']},
  grk:{way:['grHerm','grSign','grColBroken','grBrazier','grAmphorae','grAltar','grBench','grOwlStatue','grVineStake','grLemonPot','grLavender','grPoppy'],center:['grBrazier'],around:['grAmphoraStack','grCart','grStallOil','grBench','grNetRack','grAmphorae']},
  jpn:{way:['jpLantern','jpLanternPole','jpJizo','jpMarker','jpSign','jpToriiS','jpFoxL','jpBasin','jpNobori','jpRailing','jpAzalea','jpHydrangea'],center:['jpBenchUmb'],around:['jpStallDango','jpRiceBales','jpSake','jpRickshaw','jpLantern','jpNotice']},
  cNE:null};
const CAPKIT={way:['cpMilestone','cpLampWood','cpWayShrine','cpSignWood','cpFence','cpScarecrow','cpCratesRoad','cpHayBale','cpKnightS','cpRose','cpSunflower'],center:['cpCampfire'],around:['cpTent','cpCrates','cpCartBroken','cpRack','cpBarricade','cpStumpAxe']};
/* owner 2026-11-20: levelling maps were cramped, cluttered and nearly empty of monsters -> every field is laid out x2 (dungeons x1.4, mazes x1.25),
   ground clutter is gone (rocks, logs, stumps, bushes, flowers, crates, statues, wayside markers, camps, flat ground details, loose grass tufts);
   only trees + small trees stay, and far more monsters spawn (see spawnN / spawnGroup). */
function scaleField(c0){if(c0._scaled||c0.mons===false||c0.mood==='town'||c0.townish||c0.city)return c0;const DG=!!(c0.walls||c0.maze),S=c0.fieldScale??(DG?(c0.maze?1.25:1.4):2);
  const c=JSON.parse(JSON.stringify(c0));c._scaled=1;const pt=p=>Array.isArray(p)?p.map((v,i)=>typeof v==='number'&&i<2?v*S:v):p;
  c.W=Math.round(c.W*S);c.H=Math.round(c.H*S);if(c.bridge)c.bridge=pt(c.bridge);if(c.stream)c.stream=c.stream.map(pt);
  if(c.trails)c.trails=c.trails.map(T=>T.map(pt));for(const r of c.roads||[])if(r.pts)r.pts=r.pts.map(pt);
  for(const o of [...(c.land||[]),...(c.warps||[]),...(c.squares||[]),...(c.clusters||[]),...(c.lakes||[])]){if(o.x!=null)o.x*=S;if(o.y!=null)o.y*=S;if(o.rx)o.rx*=S;if(o.ry)o.ry*=S;if(o.r&&c.clusters&&c.clusters.includes(o))o.r*=S;}
  if(c.clearings)c.clearings=c.clearings.map(q=>[q[0]*S,q[1]*S,q[2]*S]);
  if(c.rows)for(const k of ['x0','x1','y0','y1'])c.rows[k]*=S;
  if(c.paddies){const P=c.paddies;P.x*=S;P.y*=S;P.cols=Math.round(P.cols*S);P.ny=Math.round(P.ny*S);if(P.skip)P.skip=P.skip.map(q=>[q[0]*S,q[1]*S,q[2]*S]);}
  if(c.sea){if(c.sea.d)c.sea.d*=S;if(c.sea.x!=null)c.sea.x*=S;if(c.sea.y!=null)c.sea.y*=S;}
  if(c.start)c.start=Array.isArray(c.start)?pt(c.start):Object.assign(c.start,{x:c.start.x*S,y:c.start.y*S});
  /* fewer solid groves, more things to look at between them */
  c.clean=1;c.decals=[];c.spawnGroup=[3,5];
  if(DG){/* caves and tombs have no trees: a few props stay so the rooms are not bare */c.propDens=(c.propDens??1)*.3;c.spawnN=Math.round((c.spawnN||24)*S*S);c.spawnGroup=[2,4];return c;}
  const CT=window.VK_CAT||{},tree=n=>CT[n]&&CT[n].t==='tree';for(const k of ['open','edge','under','bankSet'])if(c[k]){c[k]=c[k].filter(tree);if(!c[k].length&&k!=='open'&&k!=='edge')delete c[k];}
  /* fewer solid groves = more room to walk */
  if(c.groves)c.groves.thr=(c.groves.thr??.52)+.085;c.openTrees=(c.openTrees??.06)*.6;
  c.spawnN=Math.round((c.spawnN||32)*S*S*.9);c.spawnGap=(c.spawnGap||320)*.85;
  return c;}
window.createFieldHost=function(base,cfg){if(!cfg._id&&window.VK_MAPS)for(const k in VK_MAPS)if(VK_MAPS[k]===cfg){cfg._id=k;break;}cfg=scaleField(cfg);
const W=cfg.W,H=cfg.H,CH=512,CELL=12,COLS=Math.ceil(W/CELL),ROWS=Math.ceil(H/CELL),CAT=window.VK_CAT;
const MOOD=cfg.mood||'sun',CAVE=MOOD==='cave'||MOOD==='mine'||MOOD==='rift';
/* region theme: water textures, trail tint, shadow colour, floating particles */
const THEME=cfg.theme||'snow',SNOWTH=THEME==='snow';
const LAKETEX=cfg.lakeTex||'texSeaIce',SEATEX=cfg.seaTex||'texSea',COBTEX=cfg.cobbleTex||'texCobble',DIRTTEX=cfg.dirtTex||'dirt';
const TH={snow:{tr:['rgba(118,108,178,.17)','rgba(255,250,245,.22)'],lakeRim:'#5d7fb0',st:['#4f7fae','#6cade0','#8cc6ec'],sh:'#8c86c4'},
  jungle:{tr:['rgba(96,64,20,.2)','rgba(225,205,140,.13)'],lakeRim:'#3f7a5c',st:['#2d8a8a','#3fb7b0','#7ee0d0'],sh:'#2c4a1c'},
  volcano:{tr:['rgba(20,8,6,.25)','rgba(255,150,80,.06)'],lakeRim:'#5a1a10',st:['#a8320a','#f0701a','#ffc040'],sh:'#140a0a'},
  desert:{tr:['rgba(150,90,30,.16)','rgba(255,240,200,.16)'],lakeRim:'#8a6a3a',st:['#1f8a8a','#3fb7b0','#7ee0d0'],sh:'#6a4420'},
  necro:{tr:['rgba(30,10,40,.2)','rgba(200,170,220,.08)'],lakeRim:'#3a2a40',st:['#2a5a6a','#3a8a8a','#7ec0c0'],sh:'#1a1020'},
  capital:{tr:['rgba(120,85,40,.16)','rgba(255,245,220,.16)'],lakeRim:'#5a7a4a',st:['#1f6ab0','#3f98d8','#8ad0f0'],sh:'#2a4a2a'},
  japan:{tr:['rgba(110,80,40,.16)','rgba(255,245,225,.16)'],lakeRim:'#5a7a4a',st:['#1f6a8a','#3f98b8','#8ad0e0'],sh:'#2a4a2a'},
  greek:{tr:['rgba(120,90,40,.16)','rgba(255,245,215,.16)'],lakeRim:'#6a8a5a',st:['#1f7ab0','#3fa8d8','#8ad8f0'],sh:'#4a5a2a'},
  temple:{tr:['rgba(60,40,10,.2)','rgba(255,230,160,.12)'],lakeRim:'#3f7a5c',st:['#2d8a8a','#3fb7b0','#7ee0d0'],sh:'#2a1e10'}}[THEME]||{};

/* ---------- assets: only what this map uses ---------- */
const need=new Set([cfg.ground||'snow',DIRTTEX,cfg.trailKind==='cobble'?COBTEX:DIRTTEX]);
const addAll=a=>{if(a)for(const n of a)need.add(n);};
addAll(cfg.border&&cfg.border.set);addAll(cfg.groves&&cfg.groves.set);addAll(cfg.open);addAll(cfg.edge);addAll(cfg.decals);addAll(cfg.grass);addAll(cfg.seaSet);addAll(cfg.bankSet);
if(cfg.patches)for(const p of cfg.patches)need.add(p.tex);if(cfg.land)for(const l of cfg.land)need.add(l.n);if(cfg.wayKit)for(const k in cfg.wayKit)for(const n of cfg.wayKit[k])if(CAT[n])need.add(n);if(cfg.clusters)for(const c of cfg.clusters)addAll(c.set);
if(cfg.walls){need.add(cfg.walls.face);need.add(cfg.walls.top);}
/* small ground details that every outdoor map of a region gets (flowers, cones, pebbles...) */
const seq=(p,a,b)=>{const o=[];for(let i=a;i<=b;i++)o.push(p+String(i).padStart(2,'0'));return o;};
const DESERT=THEME==='desert'||THEME==='necro',GREEK=THEME==='greek',JAPAN=THEME==='japan',CAPT=THEME==='capital';
const AUTO_G=CAVE||cfg.noDetails?[]:SNOWTH?seq('snD',0,11):THEME==='jungle'?[...seq('jgD',0,11),...seq('jgD',21,23)]:THEME==='desert'&&cfg.green?seq('egD',0,11):GREEK&&!cfg.dark?seq('grD',0,11):JAPAN&&!cfg.dark?seq('jpD',0,11).filter(n=>cfg.lily||n!=='jpD07'):CAPT?seq('cpD',0,11):[];
/* lawns (raised garden beds with a stone kerb) get their own grass tufts and flowers */
if(cfg.stepTex)need.add(cfg.stepTex);if(cfg.pathTex)need.add(cfg.pathTex);
const LAWN_G=CAPT?seq('cpD',0,11):[],LAWN_F=CAPT?['cpD12','cpD13','cpD14','cpD15','cpD16','cpD17','cpD20']:[];if(cfg.lawns){addAll(LAWN_G);addAll(LAWN_F);for(const l of cfg.lawns)need.add(l.tex||cfg.ground||'cpGrass');}
const AUTO_D=CAVE||cfg.noDetails||cfg.clean?[]:SNOWTH?seq('snD',12,23):THEME==='jungle'?seq('jgD',12,20):DESERT?seq('egD',12,23):CAPT&&!cfg.city?seq('cpD',12,23).filter(n=>(cfg.farm||!/cpD(18|19)/.test(n))&&(cfg.ruinBits||!/cpD(21|22|23)/.test(n))):JAPAN&&!cfg.dark?seq('jpD',12,23).filter(n=>(cfg.ruinBits||!/jpD(22|23)/.test(n))&&(cfg.sakura||n!=='jpD13')&&(cfg.maple||n!=='jpD14')):GREEK&&!cfg.dark?seq('grD',12,23).filter(n=>((cfg.sea&&!cfg.noShells)||!/grD1[45]/.test(n))&&(cfg.ruinBits||!/grD(17|18|21|22)/.test(n))):[];
addAll(AUTO_G);addAll(AUTO_D);
const BANKS=SNOWTH?'bkS':DESERT?'egBank':GREEK?'grBank':JAPAN?'jpBank':CAPT?'cpBank':'bkJ',STREAMTEX=cfg.streamTex||(SNOWTH?'texStream':LAKETEX);if(cfg.stream){need.add(STREAMTEX);for(let i=0;i<8;i++)need.add(BANKS+i);}
for(const p of [...(cfg.paves||[]),...(cfg.roads||[]),...(cfg.squares||[])])need.add(p.tex||COBTEX);for(const G of [cfg.groundImg,...(cfg.groundImgs||[])])if(G)need.add(G.n);if(cfg.canals||cfg.paddies){need.add(LAKETEX);need.add(COBTEX);need.add(DIRTTEX);if(cfg.paddies)need.add(cfg.paddies.tex||'jpRice');}
if(cfg.sea&&GREEK)for(const n of ['grBoulder1','grBoulder2','grBoulders1','grBoulders5'])need.add(n);
if(cfg.sea&&JAPAN)for(const n of ['jpBoulder1','jpBoulder2','jpBoulders1','jpBoulders3'])need.add(n);
if(cfg.sea){need.add(SEATEX);need.add('texStream');for(let i=0;i<8;i++)need.add((GREEK?'grBank':JAPAN?'jpBank':'bkS')+i);for(const n of ['shoreRock1','shoreRock2','sealRock1','icicleRock1','rock4'])need.add(n);}if(cfg.lakes)need.add(LAKETEX);addAll(cfg.lakeSet);if(cfg.bridge)need.add(cfg.bridgeImg||'bridgeSP');
const IMG={};let loaded=0,ready=false,failed=false;const NAMES=[...need].filter(n=>CAT[n]);
const srcOf=n=>{const c=CAT[n];return base+(c.d||'viking')+'/'+(c.f||n)+'.webp';};
for(const n of NAMES){const im=new Image();im.onload=()=>{if(++loaded===NAMES.length)build();};im.onerror=()=>{console.warn('map art missing',n);if(++loaded===NAMES.length)build();};im.src=srcOf(n);IMG[n]=im;}

/* ---------- deterministic helpers ---------- */
let seed=(cfg.seed||1)*2654435761>>>0;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const R=(a,b)=>a+(b-a)*rnd(),pick0=a=>a[Math.floor(rnd()*a.length)];let pickAt=null;
/* repetition limits for everything that is not a tree:
   common (rocks, bushes, grass, stalagmites...) — any number, but the same piece never within 220px;
   semi (barrels, fences, runestones, crystals, ground patches...) — at most 5 per map, 500px apart;
   unique (anchor, cauldron, frozen warrior, boat, skull...) — at most 2 per map, 1100px apart. */
const COMMON=/^(?!iceSpireV(08|09|14|16|24)$)(rock|rockPile|bush|berry|stump|log|grass|mound|cones|branch|puddle|icicleRock|crackRock|icyBush|thorn|mossRock|stalagmite|caveRock|shoreRock|pine|darkPine|deadTree|twinPine|deadPine|bareTree|iceSpire|cliff|spire|caveWall(V?\d)|cavePillar|floe|seaFloe|wave|iceBlock$|iceBlockCr|crystalS|crystalM|rail)/;
const SEMI=/^(iceSpireV(08|09|14|16|24)$|barrel|fence|palisade|runestone|hayBale|blueCrystal|crystalL|glowShroom|darkStump|torch|goldOre|blueOre|skullPile|bonePile|pGrass|pMud|pIce|pGravel|lanternPole|frostRune|minecart|rockArch|islet|icebergL|icebergT|plank|sealRock|driftLog|web)/;
const MID=/^(icicleRock|iceBlock|icyBush|crystalS|crystalM|mossRock|thorn|cavePillar|rock6|rockPile|caveRockV|rock2|rock5)/;
const USE=new Map();function capOf(n){const k=CAT[n]&&CAT[n].cap;if(k)return k==='common'?[1e9,220]:k==='mid'?[14,300]:k==='semi'?[5,500]:[2,1100];return MID.test(n)?[14,300]:COMMON.test(n)?[1e9,220]:SEMI.test(n)?[5,500]:[2,1100];}
function allowed(n,x,y){const u=USE.get(n);if(!u)return true;const [mx,dist]=capOf(n);if(u.length>=mx)return false;for(const p of u)if(Math.hypot(p[0]-x,p[1]-y)<dist)return false;return true;}
function note(n,x,y){(USE.get(n)||USE.set(n,[]).get(n)).push([x,y]);}
/* pick a piece for (x,y) that is still allowed; null if every candidate is used up here */
function pickCap(a,x,y){if(!a||!a.length)return null;for(let k=0;k<8;k++){const n=a[Math.floor(rnd()*a.length)];if(allowed(n,x,y)){note(n,x,y);return n;}}return null;}
/* forest fill: any allowed piece, else a common one (trees) */
function pickFill(a,x,y){const n=pickCap(a,x,y);if(n)return n;const c=a.filter(k=>COMMON.test(k)&&!MID.test(k));return c.length?c[Math.floor(rnd()*c.length)]:null;}
const pick=a=>{let n=pick0(a);if(pickAt&&a.length>1)for(let k=0;k<4&&pickAt(n);k++)n=pick0(a);return n;};
const SO=(cfg.seed||1)*7.31;
function hash(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296;}
function vnoise(x,y){x+=SO;y-=SO*.7;const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
const fbm=(x,y)=>vnoise(x,y)*.65+vnoise(x*2.1+7,y*2.1+3)*.35;
function spline(pts,step){const out=[];for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
    const L=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]),n=Math.max(2,Math.ceil(L/step));
    for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;out.push([.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
      .5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)]);}}
  out.push(pts[pts.length-1].slice());
  for(let i=0;i<out.length;i++){const a=out[Math.max(0,i-1)],b=out[Math.min(out.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;out[i].push(-dy/l,dx/l);}return out;}
function segDist(px,py,pts){let best=1e9,bi=0;for(let i=0;i<pts.length;i+=2){const d=(pts[i][0]-px)**2+(pts[i][1]-py)**2;if(d<best){best=d;bi=i;}}return [Math.sqrt(best),bi];}

/* ---------- bridge geometry (the painted bridge has a fixed angle: deck (1,-.59), stream (1,.57)) ---------- */
const B=cfg.bridge||null,nd=v=>{const l=Math.hypot(v[0],v[1]);return [v[0]/l,v[1]/l];},pd=nd([1,-.59]),sd=nd([1,.57]);
function expand(pts,dir){const out=[];for(const p of pts){if(p==='B'&&B){out.push([B[0]-dir[0]*220,B[1]-dir[1]*220],B.slice(),[B[0]+dir[0]*220,B[1]+dir[1]*220]);}else out.push(p.slice());}return out;}
function onBridge(x,y){if(!B)return false;const dx=x-B[0],dy=y-B[1],u=dx*pd[0]+dy*pd[1],v=-dx*pd[1]+dy*pd[0];return Math.abs(u)<140&&Math.abs(v)<40;}

/* ---------- sea: one side of the map, ragged coastline ---------- */
const SEA=cfg.sea||null;
function seaDepth(x,y){if(!SEA)return -1e9;const s=SEA.side,a=SEA.amp||220,along=s==='N'||s==='S'?x:y,inn=s==='N'?y:s==='S'?H-y:s==='W'?x:W-x;
  const line=SEA.d+(fbm(along/1500,3.3)-.5)*a*3.4+(fbm(along/520,7.1)-.5)*a*1.3+(vnoise(along/150,8.8)-.5)*a*.35;return line-inn;}
const isSea=(x,y)=>seaDepth(x,y)>0;
const inLake=(x,y,pad=0)=>{if(!cfg.lakes)return false;for(const l of cfg.lakes){const n=(vnoise(x/120,y/120)-.5)*.25+(vnoise(x/330+l.x*.01,y/330)-.5)*.75;if(((x-l.x)/(l.rx+pad))**2+((y-l.y)/(l.ry+pad))**2<1+n)return true;}return false;};

/* ---------- built data ---------- */
/* texture scale (cfg.texScale {name:k}): the tile is resampled once, high quality, so a brick or cobble reads at a believable size */
/* default: paving stones at a believable size on every map (the painted tiles are ~2x too big for a street); a map can override */
const TEXS=Object.assign({grMarble:.55,jpPave:.5,cpPave:.5,cpPlaza:.65,egCity:.6,azPlaza:.6,texCobble:.65},cfg.texScale||{}),TEXC={};function texSrc(n){const s=TEXS[n],im=IMG[n];if(!s||s===1||!im||!im.naturalWidth)return im;let c=TEXC[n];if(c)return c;c=document.createElement('canvas');c.width=Math.max(8,Math.round(im.naturalWidth*s));c.height=Math.max(8,Math.round(im.naturalHeight*s));const g=c.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(im,0,0,c.width,c.height);return TEXC[n]=c;}
const patC=new WeakMap();function pat(q,n){let p=patC.get(q);if(!p){p={};patC.set(q,p);}if(!p[n]&&IMG[n])p[n]=q.createPattern(texSrc(n),'repeat');return p[n];}
const grassB=new Map();let dirt=[],drifts=[],prints=[],trails=[],stream=[],lips=[],banks=[],cracks=[],tints=[],objs=[],decals=[],ground=[],spawns=[],seaObjs=[],coast=[],warps=[],seaPath=null,clearings=[];
const docks=[],aprons=[];const grid=new Uint8Array(COLS*ROWS);
/* ---- continuous walls (temples, caves): footprint WF on the collision grid; what is drawn and blocked is the footprint
   plus its top, lifted FH px (3/4 view). Clearing a spot sweeps FH downward so a lifted top never covers it. ---- */
const WALLS=cfg.walls||null,WBLK=WALLS&&WALLS.block?48:0,FHC=WALLS?Math.round((WALLS.fh||150)/CELL):0;
const WF=WALLS?new Uint8Array(COLS*ROWS):null,WV=WALLS?new Uint8Array(COLS*ROWS):null,WD=WALLS?new Uint8Array(COLS*ROWS):null;
function wallClear(cx,cy,rx,ry){if(!WALLS)return;const B0=WBLK/CELL;for(let k=0;k<=FHC;k++){const yy=cy+k*CELL,c0=Math.max(0,((cx-rx)/CELL)|0),c1=Math.min(COLS-1,((cx+rx)/CELL)|0),r0=Math.max(0,((yy-ry)/CELL)|0),r1=Math.min(ROWS-1,((yy+ry)/CELL)|0);
  for(let j=r0;j<=r1;j++)for(let i=c0;i<=c1;i++){const x=i*CELL+6,y=j*CELL+6;if(((x-cx)/rx)**2+((y-yy)/ry)**2>1)continue;
    if(B0){const bi=Math.floor(i/B0)*B0,bj=Math.floor(j/B0)*B0;for(let b=bj;b<Math.min(ROWS,bj+B0);b++)for(let a=bi;a<Math.min(COLS,bi+B0);a++)WF[b*COLS+a]=0;}else WF[j*COLS+i]=0;}}}
function wallFinish(){/* drop slivers thinner than 2 cells vertically, then lift tops */
  for(let i=0;i<COLS;i++){let run=0;for(let j=0;j<=ROWS;j++){const v=j<ROWS&&WF[j*COLS+i];if(v)run++;else{if(run>0&&run<3)for(let k=j-run;k<j;k++)WF[k*COLS+i]=0;run=0;}}}
  for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const k=j*COLS+i;WV[k]=WF[k]||(j+FHC<ROWS&&WF[k+FHC*COLS])?1:0;}
  /* depth inside the wall mass (0..4) for the dark interior */
  for(let k=0;k<WV.length;k++)WD[k]=WV[k]?4:0;
  for(let pass=0;pass<4;pass++)for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const k=j*COLS+i;if(!WD[k])continue;let m=4;
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=i+a,y=j+b;m=Math.min(m,(x<0||y<0||x>=COLS||y>=ROWS)?4:WD[y*COLS+x]+1);}WD[k]=Math.min(WD[k],m);}}
function wallAt(x,y){if(!WALLS)return false;const i=(x/CELL)|0,j=(y/CELL)|0;return i>=0&&j>=0&&i<COLS&&j<ROWS&&WV[j*COLS+i]===1;}const buckets=new Map();const chunks=new Map();let minimap=null;
const band0=cfg.border?cfg.border.band||270:0;
/* border depth wanders: deep bulges and shallow bays, so the map edge is never a straight frame */
const CALM=cfg.border&&cfg.border.calm;
const edgeBand=(x,y)=>!band0?0:CALM?band0*(.8+.45*fbm(x/700+13.1,y/700+5.7))+(fbm(x/230,y/230)-.5)*60:band0*Math.max(.25,(-1.2+4.6*fbm(x/1000+13.1,y/1000+5.7)))+(fbm(x/230,y/230)-.5)*110;
function edgeDist(x,y){return Math.min(x,y,W-x,H-y);}
function nearTrail(x,y,m){for(const P of trails){const [d,i]=segDist(x,y,P);if(d<P[i][4]/2+m)return true;}return false;}
function nearStream(x,y,m){if(!stream.length)return false;const [d]=segDist(x,y,stream);return d<44+m;}
function inClearing(x,y,pad){for(const c of clearings)if(Math.hypot(x-c[0],y-c[1])<c[2]+pad)return c;return null;}
const landB=[];
/* inLand is asked for every candidate spot while a map is laid out. Only the few 'big' pieces matter, so they are kept in their own
   list instead of walking every object each time (2026-11-21: this loop alone was ~2 s of a field's loading time). Same answers as before. */
const bigL=[];let bigDirty=false;
objs.push=function(){for(let i=0;i<arguments.length;i++){const a=arguments[i];if(a&&a.big)bigL.push(a);}return Array.prototype.push.apply(this,arguments);};
objs.splice=function(){bigDirty=true;return Array.prototype.splice.apply(this,arguments);};
function inLand(x,y,pad){for(const b of landB){if(Math.abs(x-b[0])<b[2]+pad&&y>b[1]-b[3]-pad*.5&&y<b[1]+pad*1.6+20)return true;}for(const g of ground){if(Math.abs(x-g.x)<g.w*.5+pad&&y>g.y-g.h*g.ay-pad&&y<g.y+g.h*(1-g.ay)+pad*1.5)return true;}
  if(bigDirty){bigL.length=0;for(const o of objs)if(o.big)bigL.push(o);bigDirty=false;}
  for(const o of bigL)if(Math.abs(x-o.x)<o.w*.5+pad&&y>o.y-o.h*.35-pad&&y<o.y+pad*1.4)return true;for(const w of warps)if(Math.hypot(x-w.x,y-w.y)<110+pad)return true;return false;}
/* planned towns: straight paved streets / plazas (walkable) and stone-lined canals (blocked) */
const PAVES=(cfg.paves||[]).map(p=>{const o=Object.assign({},p);if(o.e)o.r=[o.e[0]-o.e[2],o.e[1]-o.e[3],o.e[0]+o.e[2],o.e[1]+o.e[3]];return o;}),CANALS=(cfg.canals||[]).map(r=>r.slice());
/* rice paddies: a grid of flooded plots (blocked) with earth dikes between them (walkable), bent a little so it isn't a chessboard */
if(cfg.paddies){const P=cfg.paddies;let y=P.y;for(let j=0;j<P.ny;j++){const h=P.h*(.75+.5*hash(j,91)),bend=Math.sin(j*.9+1.3)*P.shift;let x=P.x+bend+(hash(j,7)-.5)*P.w*.6;
    /* terraces: each row is a run of plots of uneven width that follows the slope sideways */
    while(x<P.x+P.cols*P.w){const w=P.w*(.6+.9*hash(x|0,j*13));if(!(P.skip&&P.skip.some(k=>Math.abs(k[0]-(x+w/2))<k[2]&&Math.abs(k[1]-(y+h/2))<k[2]))&&hash(x|0,j)>.08)CANALS.push([x|0,y|0,(x+w)|0,(y+h)|0,P.tex||'jpRice',1]);x+=w+P.gap;}
    y+=h+P.gap;}}
/* organic streets: a smoothed centre line with a wavering width; squares: lumpy ovals */
const ROADS=[],SQUARES=[];let PM0=null,PM1=null;
function roadPoly(pts,w,sd){const s=spline(pts,14),L=[],Rr=[];s.forEach((p,i)=>{const end=Math.min(1,i/3,(s.length-1-i)/3),ww=w*(.82+.36*vnoise(i*.05+sd,sd*.7))*(.75+.25*end)/2,
    e1=(vnoise(i*.31+sd,4.1)-.5)*7,e2=(vnoise(i*.31+sd,9.3)-.5)*7;L.push([p[0]+p[2]*(ww+e1),p[1]+p[3]*(ww+e1)]);Rr.push([p[0]-p[2]*(ww+e2),p[1]-p[3]*(ww+e2)]);});
  /* rounded, slightly ragged ends instead of a square cut */
  const cap=(i,dir)=>{const p=s[i],r=Math.hypot(L[i][0]-Rr[i][0],L[i][1]-Rr[i][1])/2,cx=(L[i][0]+Rr[i][0])/2,cy=(L[i][1]+Rr[i][1])/2,tx=p[3]*dir,ty=-p[2]*dir,out=[];
    for(let k=1;k<12;k++){const t=k/12*Math.PI,rr=r*(1+(vnoise(k*.7+sd,i*.01)-.5)*.3);out.push([cx+p[2]*Math.cos(t)*rr*dir+tx*Math.sin(t)*rr*1.1,cy+p[3]*Math.cos(t)*rr*dir+ty*Math.sin(t)*rr*1.1]);}return out;};
  const n1=s.length-1,poly=L.concat(cap(n1,1),Rr.slice().reverse(),cap(0,-1));let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const q of poly){x0=Math.min(x0,q[0]);y0=Math.min(y0,q[1]);x1=Math.max(x1,q[0]);y1=Math.max(y1,q[1]);}return {poly,bb:[x0,y0,x1,y1],s,w};}
function blobPoly(x,y,rx,ry,sd){const poly=[];for(let k=0;k<48;k++){const a=k/48*6.2832,f=.82+.3*vnoise(Math.cos(a)*1.3+sd,Math.sin(a)*1.3+sd)+(vnoise(k*.9,sd)-.5)*.05;poly.push([x+Math.cos(a)*rx*f,y+Math.sin(a)*ry*f]);}return {poly,bb:[x-rx*1.3,y-ry*1.3,x+rx*1.3,y+ry*1.3]};}
function inPoly(x,y,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
function paveMasks(){(cfg.roads||[]).forEach((r,i)=>ROADS.push(Object.assign(roadPoly(r.pts,r.w||110,i*3.7+1.3),{tex:r.tex,kc:r.kc,shade:r.shade})));(cfg.squares||[]).forEach((q,i)=>SQUARES.push(Object.assign(blobPoly(q.x,q.y,q.rx,q.ry,i*5.1+2.2),{tex:q.tex,kc:q.kc,shade:q.shade})));
  PM0=new Uint8Array(COLS*ROWS);for(const A of [ROADS,SQUARES])for(const o of A){const b=o.bb;for(let j=Math.max(0,(b[1]/CELL)|0);j<=Math.min(ROWS-1,(b[3]/CELL)|0);j++)for(let i=Math.max(0,(b[0]/CELL)|0);i<=Math.min(COLS-1,(b[2]/CELL)|0);i++)if(inPoly(i*CELL+6,j*CELL+6,o.poly))PM0[j*COLS+i]=1;}
  PM1=PM0.slice();for(let k=0;k<4;k++){const t=PM1.slice();for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const q=j*COLS+i;if(t[q])continue;if((i>0&&t[q-1])||(i<COLS-1&&t[q+1])||(j>0&&t[q-COLS])||(j<ROWS-1&&t[q+COLS]))PM1[q]=1;}}}
function inPave(x,y,pad){if(PM0){const i=(x/CELL)|0,j=(y/CELL)|0;if(i>=0&&j>=0&&i<COLS&&j<ROWS&&(pad>10?PM1:PM0)[j*COLS+i])return true;}for(const p of PAVES){const r=p.r;if(p.e){const a=p.e[2]+pad,b=p.e[3]+pad;if(a>0&&b>0&&((x-p.e[0])/a)**2+((y-p.e[1])/b)**2<1)return true;continue;}if(x>r[0]-pad&&x<r[2]+pad&&y>r[1]-pad&&y<r[3]+pad)return true;}for(const r of CANALS)if(x>r[0]-pad&&x<r[2]+pad&&y>r[1]-pad&&y<r[3]+pad)return true;return false;}
/* inside a paved block (rect or round plaza) — a stone floor where no grass should grow */
function inRP(x,y){for(const p of PAVES){if(p.e){if(((x-p.e[0])/p.e[2])**2+((y-p.e[1])/p.e[3])**2<1)return true;continue;}const r=p.r;if(x>r[0]&&x<r[2]&&y>r[1]&&y<r[3])return true;}return false;}
function inCanal(x,y){for(const r of CANALS)if(x>=r[0]&&x<r[2]&&y>=r[1]&&y<r[3])return true;return false;}
function laneD(x,y){let best=1e9;for(const w of warps){const dx=W/2-w.x,dy=H/2-w.y,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,t=Math.max(0,Math.min(520,(x-w.x)*ux+(y-w.y)*uy));best=Math.min(best,Math.hypot(x-w.x-ux*t,y-w.y-uy*t));}return best;}
const water=(x,y,m=0)=>isSea(x,y)||seaDepth(x,y)>-m||inLake(x,y,m);

function wander(s,amp,sdv,fix){for(let i=0;i<s.length;i++){const p=s[i];let k=Math.min(1,i/25,(s.length-1-i)/25);for(const f of fix)k=Math.min(k,Math.max(0,(Math.hypot(p[0]-f[0],p[1]-f[1])-110)/240));
    const d=((vnoise(i*.011+sdv,3.1)-.5)*amp+(vnoise(i*.05+sdv,7.7)-.5)*amp*.22)*k;p[0]+=p[2]*d;p[1]+=p[3]*d;}
  for(let i=0;i<s.length;i++){const a=s[Math.max(0,i-1)],b=s[Math.min(s.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;s[i][2]=-dy/l;s[i][3]=dx/l;}return s;}
const KIND=cfg.trailKind||'snow',TRAMP=KIND==='snow'||KIND==='trample';
function mkTrail(pts,w0,sdv,anchors){const fix=B?[B]:[];const s=wander(spline(pts,10),KIND==='cobble'?70:150,sdv,fix);
  s.forEach((p,i)=>{const nb=B&&Math.hypot(p[0]-B[0],p[1]-B[1])<260;const w=Math.max(40,Math.min(w0*1.4,w0*(.6+.8*vnoise(i*.017+sdv,11.3))));
    let c=0;if(TRAMP){let near=0;for(const a of anchors){const d=Math.hypot(p[0]-a[0],p[1]-a[1]);near=Math.max(near,1-(d-a[2])/240);}near=Math.max(0,Math.min(1,near));
      const patchy=Math.max(0,Math.min(1,(vnoise(i*.035+sdv,23.9)-.7)/.1));c=nb||near>.6?0:patchy;}
    p.push(nb?Math.max(w,96):KIND==='cobble'?w0*(.85+.3*vnoise(i*.02+sdv,4.4)):w,c);});return s;}

/* ---------- sprite object factory ---------- */
const SWAY=n=>/^(ice|crystal|frozen|frost|rune|spire|cliff|rock|stalag|cave|wall|mine|shore|boulder|beast|bone|skull)/i.test(n)?0:/^dark|^pine|^twin/.test(n)?.5:/dead|bare/i.test(n)?.3:/berry|bush|thorn|icyBush|shroom|grass|banner/i.test(n)?1.1:0;
/* anti-repetition: every tree/prop gets one of 3 colour versions (made once per image) and a slightly different width/height */
/* every canvas we prepare is turned into an ImageBitmap in the background and drawn from that: Chrome keeps bitmaps on the GPU,
   while small canvases (grass tufts, flowers, pebbles) stay in main memory and were re-uploaded on every draw — the lag on busy maps */
const BM=new WeakMap();function bm(c){if(!c||c.tagName!=='CANVAS'||BM.has(c)||typeof createImageBitmap!=='function')return c;BM.set(c,null);createImageBitmap(c).then(b=>BM.set(c,b)).catch(()=>{});return c;}
const IMB=c=>(c&&BM.get(c))||c;
const VARC=new Map();function variant(n,k){const im=IMG[n];if(!k||!im)return im;const key=n+k;let c=VARC.get(key);if(c)return c;c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');
  g.drawImage(im,0,0);g.globalCompositeOperation='source-atop';g.fillStyle=k===1?'rgba(40,30,80,.16)':k===2?'rgba(255,215,160,.14)':'rgba(120,170,200,.12)';g.fillRect(0,0,c.width,c.height);VARC.set(key,c);return bm(c);}
/* the foot of every object darkens and picks up the ground colour (occlusion + bounce light), made once per image */
const AOC=new Map();function baseAO(im,c){if(!im||cfg.baseAO===0)return im;let r=AOC.get(im);if(r)return r;const w=im.naturalWidth||im.width,h=im.naturalHeight||im.height;r=document.createElement('canvas');r.width=w;r.height=h;const g=r.getContext('2d');g.drawImage(im,0,0);
  g.globalCompositeOperation='source-atop';const tall=c.t==='tree'?.3:.2,y0=h*(1-tall),gr=g.createLinearGradient(0,y0,0,h);gr.addColorStop(0,'rgba(30,26,22,0)');gr.addColorStop(.7,`rgba(30,26,22,${CAVE?.3:.26})`);gr.addColorStop(1,`rgba(26,22,18,${CAVE?.5:.46})`);g.fillStyle=gr;g.fillRect(0,y0,w,h-y0);
  const gb=g.createLinearGradient(0,h*.9,0,h);gb.addColorStop(0,'rgba(0,0,0,0)');gb.addColorStop(1,cfg.bounce||(SNOWTH?'rgba(200,210,240,.18)':'rgba(70,95,40,.16)'));g.fillStyle=gb;g.fillRect(0,h*.9,w,h*.1);AOC.set(im,r);return bm(r);}
function mk(n,x,y,o={}){if(!n)return null;const c=CAT[n],im0=IMG[n];if(!c||!im0||!im0.naturalWidth)return null;const v=o.v||1,str=o.land?1:R(.9,1.1),w=c.w*v*str,h=c.h*v/Math.sqrt(str);
  const vk=o.land||c.t==='water'?0:Math.floor(rnd()*4),im=c.t==='flat'||c.t==='water'||o.cast===0?variant(n,vk===3?0:vk):baseAO(variant(n,vk===3?0:vk),c);
  const ob=Object.assign({n,x,y,w,h,img:im,base:im0,ax:c.ax??.5,ay:c.ay,cast:c.t!=='flat'&&c.t!=='water'?1:0,flip:(fc=>o.noflip?false:(LR[n]>1.06?false:LR[n]<.94?true:fc))(rnd()<.5),tree:c.t==='tree',big:c.t==='big'},o);
  ob.ph=rnd()*6.28;ob.sway=o.sway??(c.sw??SWAY(n));
  const k=c.c;ob.solid=[];ob.ell=null;
  if(typeof k==='number')ob.solid.push([x,y-k*w*.5,k*w*.9]);
  else if(Array.isArray(k))ob.ell=[x,y-k[1]*w,k[0]*w,k[1]*w];
  else if(k==='log')ob.solid.push([x-w*.22,y-h*.08,w*.13],[x+w*.2,y-h*.12,w*.13]);
  else if(k==='gate'||k==='posts'){const dx=k==='gate'?.36:.4;ob.solid.push([x-w*dx,y-w*.04,w*.1],[x+w*dx,y-w*.04,w*.1]);}
  else if(k==='cave'||k==='arch')ob.ell=[x,y-.17*w,.44*w,.17*w];
  else if(k==='dock')ob.ell=[x,y-.12*w,.36*w,.1*w];
  return ob;}

/* ---------- art pass (once per map load): every sprite is cleaned and matched to this region before anything uses it ----------
   1 edge cleanup: light matte halos left by background removal are darkened, faint dust pixels at the rim are dropped
   2 colour match: brightness pulled a little toward the ground's, saturation calmed, a touch of the ground's hue mixed in,
     so pieces generated at different times sit in one light instead of looking cut out of different pictures
   3 light side: which half of the sprite is lit (most art is lit from the left) — used so random flips never put the light on the wrong side */
const LR={};let CHARF='';
function artPass(){if(cfg.colorMatch===0)return;const gi=IMG[GROUND];let gr=128,gg=128,gb=128;
  /* cfg.artRef: the colour the pieces really stand on (a stone city on a grass map) */
  if(cfg.artRef)[gr,gg,gb]=cfg.artRef;else if(gi&&gi.naturalWidth){const c=document.createElement('canvas');c.width=c.height=32;const q=c.getContext('2d');q.drawImage(gi,0,0,32,32);const d=q.getImageData(0,0,32,32).data;let r=0,g=0,b=0;for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];}const n=d.length/4;gr=r/n;gg=g/n;gb=b/n;}
  const gL=gr*.3+gg*.59+gb*.11,KS=cfg.artSat??.92,KT=cfg.artTint??.07,KB=cfg.artPull??.18;
  /* the same calming applied live to characters (hero, townsfolk, monsters) so they stand in this map's light too */
  {const kc=Math.max(.86,Math.min(1.07,1+KB*.8*(gL/140-1))),warm=(gr-gb)/255;CHARF=`saturate(${(KS*.96).toFixed(2)}) brightness(${kc.toFixed(2)})`+(warm>.12?` sepia(${Math.min(.12,warm*.25).toFixed(2)})`:'');}
  for(const n of NAMES){const c=CAT[n],im=IMG[n];if(!c||c.t==='tex'||!im||!im.naturalWidth)continue;const w=im.naturalWidth,h=im.naturalHeight;
    const cv=document.createElement('canvas');cv.width=w;cv.height=h;const q=cv.getContext('2d',{willReadFrequently:true});q.drawImage(im,0,0);let id;try{id=q.getImageData(0,0,w,h);}catch(e){continue;}const d=id.data;
    let sl=0,nl=0,sr=0,nr=0,sum=0,cnt=0;for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){const i=(y*w+x)*4;if(d[i+3]<250)continue;const L=d[i]*.3+d[i+1]*.59+d[i+2]*.11;sum+=L;cnt++;if(x<w/2){sl+=L;nl++;}else{sr+=L;nr++;}}
    LR[n]=nl&&nr?(sl/nl)/(sr/nr):1;const sL=cnt?sum/cnt:gL,kb=Math.max(.88,Math.min(1.12,1+KB*(gL/Math.max(30,sL)-1)));
    for(let i=0;i<d.length;i+=4){const a=d[i+3];if(!a)continue;let r=d[i],g=d[i+1],b=d[i+2];const L=r*.3+g*.59+b*.11;
      if(a<200&&L>185){const k=.62;r*=k;g*=k;b*=k;}if(a<22){d[i+3]=0;continue;}
      r=L+(r-L)*KS;g=L+(g-L)*KS;b=L+(b-L)*KS;const t=L/Math.max(1,gL);r=r*(1-KT)+gr*t*KT;g=g*(1-KT)+gg*t*KT;b=b*(1-KT)+gb*t*KT;
      d[i]=Math.min(255,r*kb);d[i+1]=Math.min(255,g*kb);d[i+2]=Math.min(255,b*kb);}
    q.putImageData(id,0,0);
    /* hand the result over in a fresh, normal canvas: the pixel-edit canvas above is CPU-backed (willReadFrequently), and drawing
       from it every frame made Chrome re-upload every visible sprite to the GPU each frame — the main cause of lag on busy maps */
    const out=document.createElement('canvas');out.width=w;out.height=h;out.getContext('2d').drawImage(cv,0,0);out.naturalWidth=w;out.naturalHeight=h;IMG[n]=bm(out);}}
/* ---------- build ---------- */
function build(){try{
  artPass();
  paveMasks();
  clearings=(cfg.clearings||[]).map(c=>c.slice());
  for(const w of cfg.warps||[])warps.push(Object.assign({},w));
  /* trails */
  const AN=[...warps.map(w=>[w.x,w.y,260]),...(cfg.land||[]).map(l=>[l.x,l.y,200]),...clearings.map(c=>[c[0],c[1],c[2]*.6])];if(B)AN.push([...B,300]);
  const T=cfg.trails||[];T.forEach((pts,ti)=>{let p=expand(pts,pd);if(ti>0){const st=p[0];let best=null,bd=1e9;for(const Q of trails)for(const q of Q){const d=Math.hypot(q[0]-st[0],q[1]-st[1]);if(d<bd){bd=d;best=q;}}if(best&&bd<300){p[0]=[best[0],best[1]];AN.push([best[0],best[1],160]);}}
    trails.push(mkTrail(p,ti?(cfg.trailW||104)*.74:(cfg.trailW||104),ti*17+(cfg.seed||1),AN));});
  if(cfg.stream){stream=wander(spline(expand(cfg.stream,sd),10),110,90,B?[B]:[]);stream.forEach((p,i)=>{const nb=B&&Math.hypot(p[0]-B[0],p[1]-B[1])<230;p.push(nb?86:Math.max(56,Math.min(112,84*(.65+.7*vnoise(i*.02,9.1)))));});}
  for(const P of trails)for(let i=0;i<P.length;i++){const p=P[i],w=p[4],c=p[5];
    if(KIND==='cobble'){if(i%2===0)dirt.push([p[0]+R(-4,4),p[1]+R(-4,4),w*R(.44,.54)]);continue;}
    if(c<.85){const n=c<.15?2:rnd()<.6?1:0;for(let k=0;k<n;k++){const o=R(-.3,.3)*w*(1-c*.6);dirt.push([p[0]+p[2]*o+R(-5,5),p[1]+p[3]*o+R(-5,5),w*R(.32,.5)*(1-c*.85)]);}}
    if(TRAMP&&SNOWTH&&i%2===0){const s=(i/2)%2?1:-1,off=(vnoise(i*.02+7,3)-.5)*w*.5;prints.push([p[0]+p[2]*(s*7+off),p[1]+p[3]*(s*7+off),Math.atan2(p[3],p[2])+Math.PI/2]);}
    if(c>.6&&rnd()<.04){const o=R(-.3,.3)*w;dirt.push([p[0]+p[2]*o,p[1]+p[3]*o,R(5,10)]);}
    if(KIND!=='cobble'&&p[5]<.5&&rnd()<.14)for(const s2 of [-1,1]){if(rnd()<.45)continue;const o=p[4]*R(.4,.52);lips.push([p[0]+p[2]*o*s2,p[1]+p[3]*o*s2,R(5,10),R(3,5.5)]);}}
  for(let i=0;i<stream.length;i++){const p=stream[i];if(B&&Math.hypot(p[0]-B[0],p[1]-B[1])<150)continue;for(const s2 of [-1,1]){if(rnd()<.35)continue;const o=p[4]*R(.42,.56);const big=rnd()<.2;banks.push([p[0]+p[2]*o*s2,p[1]+p[3]*o*s2,big?R(13,22):R(6,12),big?R(8,12):R(4,8)]);}}
  for(let i=0;i<stream.length-6;i+=3){if(rnd()<.55)continue;const p=stream[i];let x=p[0]+p[2]*R(-24,24),y=p[1]+p[3]*R(-24,24);const c=[[x,y]];for(let k=0;k<3;k++){x+=R(6,18)*(rnd()<.5?1:-1);y+=R(6,15);c.push([x,y]);}cracks.push(c);}
  const TINT=THEME==='jungle'?['255,230,140','40,90,40']:THEME==='volcano'?['255,120,40','20,10,10']:THEME==='temple'?['255,220,120','60,40,20']:MOOD==='dark'?['60,90,70','30,40,60']:MOOD==='glacier'?['170,240,255','120,150,230']:CAVE?['90,80,120','40,40,70']:['255,236,220','176,180,226'];
  for(let i=0;i<W*H/150000;i++)tints.push([R(0,W),R(0,H),R(260,700),rnd()<.55?TINT[0]:TINT[1],R(.07,.14)]);
  /* coastline samples (for foam/ice edge) and sea clip path */
  if(SEA){const s=SEA.side,L=s==='N'||s==='S'?W:H,pts=[];for(let a=-40;a<=L+40;a+=14){let lo=0,hi=Math.max(W,H);for(let k=0;k<22;k++){const m=(lo+hi)/2,[x,y]=s==='N'?[a,m]:s==='S'?[a,H-m]:s==='W'?[m,a]:[W-m,a];if(isSea(x,y))lo=m;else hi=m;}
      const [x,y]=s==='N'?[a,lo]:s==='S'?[a,H-lo]:s==='W'?[lo,a]:[W-lo,a];pts.push([x,y]);}
    coast=pts;seaPath=new Path2D();const off=s==='N'?[0,-26]:s==='S'?[0,26]:s==='W'?[-26,0]:[26,0];seaPath.moveTo(pts[0][0]+off[0],pts[0][1]+off[1]);for(const p of pts)seaPath.lineTo(p[0]+off[0],p[1]+off[1]);
    const c=s==='N'?[[W+50,-50],[-50,-50]]:s==='S'?[[W+50,H+50],[-50,H+50]]:s==='W'?[[-50,H+50],[-50,-50]]:[[W+50,H+50],[W+50,-50]];seaPath.lineTo(...c[0]);seaPath.lineTo(...c[1]);seaPath.closePath();}
  /* town plazas: cobble discs */
  for(const z of cfg.plazas||[]){clearings.push([z[0],z[1],z[2]+60]);for(let a=0;a<z[2];a+=26)for(let k=0;k<Math.max(1,a*6.283/30);k++){const t=k/Math.max(1,a*6.283/30)*6.283+R(-.1,.1);dirt.push([z[0]+Math.cos(t)*a+R(-6,6),z[1]+Math.sin(t)*a*.8+R(-6,6),R(26,40)]);}}
  /* rocks and ice along the shore, on the land side */
  if(SEA)for(let k=0;k<coast.length;k+=3){if(rnd()>(GREEK||JAPAN?.12:.4))continue;const p=coast[k],sd2=SEA.side,ox=sd2==='E'?-1:sd2==='W'?1:0,oy=sd2==='S'?-1:sd2==='N'?1:0,o=R(18,55),x=p[0]+ox*o,y=p[1]+oy*o;
    if(x<60||y<60||x>W-60||y>H-60||inPave(x,y,30))continue;const o2=mk(pickCap((GREEK?['grBoulder1','grBoulder2','grBoulders1','grBoulders5']:JAPAN?['jpBoulder1','jpBoulder2','jpBoulders1','jpBoulders3']:['shoreRock1','shoreRock2','sealRock1','icicleRock1','rock4']).filter(n=>IMG[n]),x,y),x,y,{v:GREEK||JAPAN?R(.45,.7):R(.7,1)});if(o2){o2.coastal=1;objs.push(o2);}}
  /* placed landmarks */
  const coastAt=(x,y,inset)=>{const s=SEA.side;let a=0;for(;a<Math.max(W,H);a+=6){const [px,py]=s==='E'?[W-a,y]:s==='W'?[a,y]:s==='N'?[x,a]:[x,H-a];if(!isSea(px,py))break;}
    return s==='E'?[W-a-inset,y]:s==='W'?[a+inset,y]:s==='N'?[x,a+inset]:[x,H-a-inset];};
  for(const l0 of cfg.land||[])note(l0.n,l0.x,l0.y);
  for(const l0 of cfg.land||[]){const c=CAT[l0.n];if(!c)continue;const l=Object.assign({},l0);
    if(/Dock/.test(l.n)&&cfg.lakes&&c.t==='flat'){let L0=null,bd=1e9;for(const k of cfg.lakes){const d=Math.hypot(l.x-k.x,l.y-k.y);if(d<bd){bd=d;L0=k;}}const ux=(l.x-L0.x)/(bd||1),uy=(l.y-L0.y)/(bd||1);let lo=0,hi=Math.max(L0.rx,L0.ry)*1.8;for(let n=0;n<16;n++){const m=(lo+hi)/2;inLake(L0.x+ux*m,L0.y+uy*m)?lo=m:hi=m;}l.x=L0.x+ux*(lo-c.w*.2);l.y=L0.y+uy*(lo-c.w*.2)+c.h*.3;l.flip=ux<0;docks.push([l.x,l.y-c.h*.3,c.w*.42,c.h*.3]);}if(l.coast!=null&&SEA)[l.x,l.y]=coastAt(l.x,l.y,l.coast);const o=mk(l.n,l.x,l.y,{noflip:!l.flip,flip:!!l.flip,v:l.v||1,land:1,sway:l.sway??undefined,walk:l.walk,smolder:l.smolder,smx:l.smx,nowc:l.nowc});if(!o)continue;
    if(c.t==='flat'){o.x0=o.x-o.ax*o.w;o.y0=o.y-o.ay*o.h;ground.push(o);}else{objs.push(o);landB.push([o.x,o.y,o.w*.5,o.h*Math.min(.55,o.ay)]);}if(l.r)clearings.push([l.x,l.y-(o.h*.3),l.r]);}
  /* shore rocks never pile into a placed building */
  for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(!o.coastal)continue;if(objs.some(b=>b.land&&b.w>140&&Math.abs(b.x-o.x)<b.w*.5+20&&o.y>b.y-b.h*.5&&o.y<b.y+50))objs.splice(i,1);}
  if(B){const o=mk(cfg.bridgeImg||'bridgeSP',B[0],B[1]+(cfg.bridgeDy||0),{noflip:true});if(o){o.x0=o.x-o.ax*o.w;o.y0=o.y-o.ay*o.h;ground.push(o);}}
  /* spacing helpers */
  const occ=new Map(),key=(x,y)=>((x/64)|0)+','+((y/64)|0);
  const far=(x,y,d)=>{const cx=(x/64)|0,cy=(y/64)|0;for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){const a=occ.get((cx+i)+','+(cy+j));if(a)for(const o of a)if(Math.hypot(o.x-x,o.y-y)<d)return false;}return true;};
  const put=o=>{if(!o)return;const k=key(o.x,o.y);(occ.get(k)||occ.set(k,[]).get(k)).push(o);objs.push(o);};
  let PX=0,PY=0;const sameNear=n=>{const cx=(PX/64)|0,cy=(PY/64)|0;for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){const a=occ.get((cx+i)+','+(cy+j));if(a)for(const o of a)if(o.n===n&&Math.hypot(o.x-PX,o.y-PY)<220)return true;}return false;};pickAt=sameNear;
  for(const o of objs){const k=key(o.x,o.y);(occ.get(k)||occ.set(k,[]).get(k)).push(o);}
  /* clusters (ruined camps, market corners...) */
  /* planted rows (vineyards): a regular grid, gently curved with the terrain, skipping tracks, clearings and placed pieces */
  if(cfg.rows){const r=cfg.rows;for(let y=r.y0;y<=r.y1;y+=r.dy)for(let x=r.x0;x<=r.x1;x+=r.dx){const yy=y+Math.sin(x/600+y/900)*40;if(rnd()>(r.keep??1))continue;
      if(edgeDist(x,yy)<edgeBand(x,yy)+60||nearTrail(x,yy,60)||inClearing(x,yy,30)||inLand(x,yy,40)||water(x,yy,30))continue;const o=mk(r.n,x+R(-8,8),yy,{v:R(.92,1.06),noflip:true});if(o)put(o);}}
  for(const c of cfg.clusters||[])for(let i=0;i<(c.n||6)*4&&i<200;i++){const a=rnd()*6.283,r=Math.sqrt(rnd())*c.r,x=c.x+Math.cos(a)*r,y=c.y+Math.sin(a)*r*.8;
    if(water(x,y,30)||nearTrail(x,y,12)||inLand(x,y,20)||inPave(x,y,c.onPave?-30:20)||!far(x,y,c.sp||70))continue;put(mk(pickCap(c.set,x,y),x,y,{v:R(.9,1.08)}));if(objs.filter(o=>Math.hypot(o.x-c.x,o.y-c.y)<c.r+5).length>=(c.n||6))break;}
  for(const n of cfg.onTrail||[]){const P=trails[Math.floor(rnd()*trails.length)];if(!P||P.length<40)continue;const p=P[Math.floor(R(.2,.8)*P.length)];const o=mk(n,p[0],p[1]+4,{v:R(.9,1.05)});if(o){o.solid=[];o.ell=null;put(o);}}
  /* wayside life: something every 230–340 px on alternating sides of every road, and a little camp beside the main road every ~1600 px */
  if(cfg.wayKit){const WK=cfg.wayKit,ok=n=>CAT[n]&&IMG[n]&&IMG[n].naturalWidth,WAY=WK.way.filter(ok),CEN=WK.center.filter(ok),ARO=WK.around.filter(ok),nearW=(x,y,d)=>warps.some(w=>Math.hypot(w.x-x,w.y-y)<d);
    const spot=(x,y,d)=>x>140&&y>140&&x<W-140&&y<H-140&&!water(x,y,40)&&!inLand(x,y,40)&&!nearW(x,y,260)&&far(x,y,d)&&edgeDist(x,y)>edgeBand(x,y)+40;
    trails.forEach((P,ti)=>{let acc=0,next=R(120,260),side=rnd()<.5?1:-1,campNext=ti?1e9:R(700,1100);
      for(let i=2;i<P.length-2;i++){const a=P[i-1],b=P[i+1],p=P[i];acc+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);const tx=b[0]-a[0],ty=b[1]-a[1],tl=Math.hypot(tx,ty)||1,nx=-ty/tl,ny=tx/tl,hw=(p[4]||90)/2;
        if(WAY.length&&acc>=next){next=acc+R(230,340);side=-side;const o=hw+R(38,70),x=p[0]+nx*o*side,y=p[1]+ny*o*side;
          if(spot(x,y,70)&&!nearTrail(x,y,18)){PX=x;PY=y;put(mk(pickCap(WAY,x,y),x,y,{v:R(.85,1.05)}));}}
        if(CEN.length&&acc>=campNext){campNext=acc+R(1400,1900);const sd=rnd()<.5?1:-1,o=hw+R(170,220),cx=p[0]+nx*o*sd,cy=p[1]+ny*o*sd;
          if(spot(cx,cy,170)&&!nearTrail(cx,cy,110)){PX=cx;PY=cy;put(mk(CEN[0],cx,cy,{v:1}));clearings.push([cx,cy,190]);
            const n=3+(rnd()<.5?1:0);for(let k=0;k<n&&ARO.length;k++){const an=k/n*6.283+R(-.3,.3),r=R(80,120),x=cx+Math.cos(an)*r,y=cy+Math.sin(an)*r*.6;
              if(!water(x,y,20)&&far(x,y,46)&&!nearTrail(x,y,12)){PX=x;PY=y;put(mk(ARO[Math.floor(rnd()*ARO.length)],x,y,{v:R(.85,1)}));}}}}}});}
  /* border + groves */
  const BS=cfg.border&&cfg.border.set,GS=cfg.groves&&cfg.groves.set,gthr=cfg.groves?cfg.groves.thr??.52:9,gd=cfg.groves?cfg.groves.dens??.85:0,openD=cfg.openTrees??.06;
  const BSP=cfg.border&&cfg.border.sp||58;
  for(let gy=40;gy<H;gy+=44)for(let gx=40;gx<W;gx+=44){const x=gx+R(-19,19),y=gy+R(-19,19);if(x<20||y<20||x>W-20||y>H-20)continue;
    if(WALLS)break;if(water(x,y,40))continue;const de=edgeDist(x,y),band=edgeBand(x,y),n=fbm(x/760,y/760);let D,sp,set;
    /* RO-style: a grove is a solid mass (blocked, packed with trees); outside it only a rare lone tree */
    if(BS&&de<band){D=1;sp=BSP;set=BS;}else if(!GS)continue;else if(n>gthr-.012){D=1;sp=54;set=GS;}else if(n>gthr-.05){D=.32*(1-(gthr-.012-n)/.038);sp=78;set=GS;}else{D=openD*.2;sp=150;set=GS;}
    let fringe=!(BS&&de<band)&&(n>gthr-.05&&n<=gthr-.012);if(BS&&de>=band&&de<band+150){D=Math.max(D,.3*(1-(de-band)/150));sp=Math.min(sp,80);set=BS;fringe=true;}
    if(de>=band-40){if(nearTrail(x,y,40)||nearStream(x,y,40))continue;if(inClearing(x,y,0))continue;if(n<=gthr-.012&&inClearing(x,y,150))D*=.35;if(inLand(x,y,60))continue;}
    else if(nearTrail(x,y,28)||inLand(x,y,30))continue;
    if(warps.some(w=>Math.abs(x-w.x)<190&&y>w.y-90&&y<w.y+300)||laneD(x,y)<70)continue;
    if(inPave(x,y,de<band?20:50))continue;
    if(rnd()>D||!far(x,y,sp))continue;PX=x;PY=y;const big=rnd(),tv=big<.18?R(1.15,1.32):big<.4?R(.72,.86):R(.9,1.1);put(mk(pickFill(set,x,y),x,y,{v:fringe?R(.62,.88):tv}));
    /* understory: a bush, rock or sapling at some trunks so groves are not a wall of identical trees */
    if(cfg.under&&de>=band&&rnd()<.22){const a=rnd()*6.28,ux=x+Math.cos(a)*R(40,70),uy=y+Math.abs(Math.sin(a))*R(18,40)+8;if(!nearTrail(ux,uy,10)&&!water(ux,uy,10)&&far(ux,uy,34)){PX=ux;PY=uy;put(mk(pickCap(cfg.under,ux,uy),ux,uy,{v:R(.75,1)}));}}}
  /* props in the open and at grove edges */
  const OP=cfg.open||[],ED=cfg.edge||OP,pd0=cfg.propDens??1;
  for(let gy=70;gy<H;gy+=104)for(let gx=70;gx<W;gx+=104){const x=gx+R(-42,42),y=gy+R(-42,42),de=edgeDist(x,y);if(de<edgeBand(x,y)-20)continue;
    if(water(x,y,30)||nearTrail(x,y,22)||nearStream(x,y,28)||inLand(x,y,50))continue;if(WALLS&&wallFoot(x,y,60))continue;if(inPave(x,y,40))continue;const n=fbm(x/760,y/760),edge=n>gthr-.12&&n<gthr+.04,c=inClearing(x,y,0);
    /* clumped, not sprinkled: a slow noise field decides where things gather; each find brings one or two smaller companions */
    const cl=cfg.clump===0?1:Math.max(0,Math.min(1,(vnoise(x/520+41.3,y/520+7.7)-.38)/.3)),pr=(edge?.26:c?.03:.05)*pd0*(cfg.clump===0?1:.35+1.1*cl);
    if(rnd()>pr||!far(x,y,edge?66:120))continue;const set=edge?ED:OP;PX=x;PY=y;if(set.length){const p0=mk(pickCap(set,x,y),x,y,{v:R(.8,1.2)});put(p0);
      if(p0&&cfg.clump!==0&&!edge&&rnd()<.55)for(let k=0;k<1+(rnd()<.4?1:0);k++){const a=rnd()*6.28,dd=R(42,80),cx=x+Math.cos(a)*dd,cy=y+Math.sin(a)*dd*.6;if(water(cx,cy,20)||nearTrail(cx,cy,16)||inLand(cx,cy,30)||inPave(cx,cy,30)||(WALLS&&wallFoot(cx,cy,40))||!far(cx,cy,36))continue;
        PX=cx;PY=cy;const cn=pickCap(set.filter(s=>!CAT[s]||CAT[s].t!=='big'),cx,cy);if(cn)put(mk(cn,cx,cy,{v:R(.6,.85)}));}}}
  /* stream-bank props */
  for(let i=8;i<stream.length-4;i+=6){if(rnd()<.45)continue;const p=stream[i];if(B&&Math.hypot(p[0]-B[0],p[1]-B[1])<190)continue;const s2=rnd()<.5?-1:1,o=p[4]/2+R(14,34),x=p[0]+p[2]*o*s2,y=p[1]+p[3]*o*s2;
    if(nearTrail(x,y,20)||!far(x,y,50))continue;const set=cfg.bankSet||OP;if(set.length)put(mk(pickCap(set,x,y),x,y,{v:R(.7,.9)}));}
  /* lake decorations (lilies, reeds, canoes...) */
  if(cfg.lakes&&cfg.lakeSet)for(const l of cfg.lakes)for(let i=0;i<l.rx*l.ry/9000;i++){const a=rnd()*6.283,r=Math.sqrt(rnd())*.85,x=l.x+Math.cos(a)*l.rx*r,y=l.y+Math.sin(a)*l.ry*r;if(!inLake(x,y))continue;
    const n=pickCap(cfg.lakeSet,x,y);const o=mk(n,x,y,{v:R(.85,1.15)});if(o){o.cast=0;o.bob=CAT[n].t==='water'?1:0;o.solid=[];o.ell=null;seaObjs.push(o);}}
  /* sea objects */
  if(SEA&&cfg.seaSet)for(let i=0;i<W*H/90000;i++){const x=R(60,W-60),y=R(60,H-60),dd=seaDepth(x,y);if(dd<70)continue;if(seaObjs.some(o=>Math.hypot(o.x-x,o.y-y)<150))continue;
    const n=dd<240&&rnd()<.5?pickCap(cfg.seaSet.filter(s=>/floe|wave|plank|Barrel|islet/i.test(s)),x,y):pickCap(cfg.seaSet,x,y);if(!n)continue;const o=mk(n,x,y,{v:R(.85,1.15)});if(o){o.bob=1;o.cast=0;seaObjs.push(o);}}
  /* flat ground details + swaying grass */
  const DC=(cfg.decals||[]).concat(AUTO_D),GR=(cfg.grass||[]).concat(AUTO_G,AUTO_G);
  for(let gy=30;gy<H;gy+=60)for(let gx=30;gx<W;gx+=60){const x=gx+R(-26,26),y=gy+R(-26,26),de=edgeDist(x,y);if(de<edgeBand(x,y)-140)continue;
    if(water(x,y,10)||nearStream(x,y,18)||inLand(x,y,20)||nearTrail(x,y,-10))continue;if(WALLS&&wallFoot(x,y,30))continue;if(inPave(x,y,8))continue;const n=fbm(x/760,y/760);
    const gcl=cfg.clump===0?1:.3+1.4*Math.max(0,Math.min(1,(vnoise(x/300+13.7,y/300+29.1)-.35)/.32));
    if(cfg.clean)continue;
    if(rnd()>(n>.5?.13:.075)*(cfg.decalDens??1)*(AUTO_G.length?1.7:DESERT?.35:1)*gcl)continue;const useG=GR.length&&(!DC.length||rnd()<.55);const t=useG?pick(GR):DC.length?pickCap(DC,x,y):null;if(!t)continue;
    const dd=mk(t,x,y,{v:R(.75,1.1),cast:0});if(!dd)continue;if(useG||dd.sway>.8){dd.sway=1.6;const k=((x/CH)|0)+','+((y/CH)|0);(grassB.get(k)||grassB.set(k,[]).get(k)).push(dd);}else decals.push(dd);}
  /* buildings that really stand on the ground: a stone doorstep in front of the door, a short walk to the street below it,
     and weeds growing along the foot of the walls (never in front of the door) */
  if(cfg.doorRe){const re=new RegExp(cfg.doorRe),KP=PAVES.filter(p=>(p.kerb??8)>0);for(const o of objs){if(!o.land||!re.test(o.n))continue;const dw=Math.max(54,o.w*.24),dx=(o.doorX||0)*o.w*(o.flip?-1:1);
      const by=o.y+o.h*(1-o.ay)-6;let to=null;for(const p of KP){const r=p.r;if(o.x+dx>r[0]&&o.x+dx<r[2]&&r[1]>=by-14&&r[1]-by<230&&(!to||r[1]<to))to=r[1];}
      /* no paved block below: walk down to the nearest organic street and lay a short worn path to it */
      if(to==null&&!inPave(o.x+dx,by+4,0)){for(let y=by+8;y<by+260;y+=6)if(inPave(o.x+dx,y,0)){if(y-by>20)ROADS.push(Object.assign(roadPoly([[o.x+dx,by+2],[o.x+dx+R(-6,6),(by+y)/2],[o.x+dx,y+18]],Math.max(48,dw*.85),o.x*.01+3.1),{tex:cfg.pathTex||cfg.stepTex||COBTEX}));break;}}
      if(!cfg.noApron&&!(to!=null&&to-by<18))aprons.push({x:o.x+dx,y:by+6,w:dw,to});
      const WG=LAWN_G.length?LAWN_G:AUTO_G;if(WG.length)for(let k=0;k<7;k++){const u=R(-.44,.44);if(Math.abs(u*o.w-dx)<dw*.75)continue;const px=o.x+u*o.w,py=by+R(2,8);if(inRP(px,py))continue;const dd=mk(pick(WG),px,py,{v:R(.45,.7),cast:0});if(!dd)continue;dd.sway=1.2;const kk=((px/CH)|0)+','+((py/CH)|0);(grassB.get(kk)||grassB.set(kk,[]).get(kk)).push(dd);}}}
  /* grass creeping over the edges of organic streets and squares: the line between stone and ground is never clean */
  if(AUTO_G.length&&!CAVE){const edgeTuft=(x,y)=>{if(water(x,y,4)||inLand(x,y,6)||inRP(x,y))return;const dd=mk(pick(AUTO_G),x,y,{v:R(.5,.85),cast:0});if(!dd)return;dd.sway=1.4;const k=((x/CH)|0)+','+((y/CH)|0);(grassB.get(k)||grassB.set(k,[]).get(k)).push(dd);};
    for(const r of ROADS){if(/Maize/.test(r.tex||''))continue;for(let i=2;i<r.s.length-2;i+=2){const p=r.s[i];for(const sd of [-1,1]){if(rnd()>.42)continue;const o=r.w*.5*R(.78,1.02)*sd;edgeTuft(p[0]+p[2]*o+R(-6,6),p[1]+p[3]*o+R(-4,4));}}}
    for(const s of SQUARES){if(/Maize|Wheat/.test(s.tex||''))continue;for(let i=0;i<s.poly.length;i++){if(rnd()>.55)continue;const p=s.poly[i],c=[(s.bb[0]+s.bb[2])/2,(s.bb[1]+s.bb[3])/2],dx=p[0]-c[0],dy=p[1]-c[1],l=Math.hypot(dx,dy)||1,o=R(-14,6);edgeTuft(p[0]+dx/l*o,p[1]+dy/l*o);}}}
  /* lawns: grass tufts that sway, a sprinkle of flowers, kept off the kerb and away from trunks */
  /* per lawn: m = margin from the kerb, step = spacing, keep = share of spots planted, g = which tufts / flowers (flower beds use only flowers) */
  for(const L of cfg.lawns||[]){const r=L.r,m=L.m??26,st=L.step??40,LG=L.g||LAWN_G,jk=st/40;for(let y=r[1]+m;y<r[3]-m*.6;y+=st)for(let x=r[0]+m;x<r[2]-m;x+=st){const px=x+R(-15,15)*jk,py=y+R(-12,12)*jk;
      if(objs.some(o=>!o.tree?false:Math.abs(o.x-px)<o.w*.16&&Math.abs(o.y-py)<16))continue;const LF=L.f||LAWN_F,fl=LF.length&&rnd()<(L.flowers??.16);if(!fl&&rnd()>(L.keep??.42))continue;
      const t=fl?pick(LF):pick(LG);const dd=mk(t,px,py,{v:R(.7,1),cast:0});if(!dd)continue;if(!fl){dd.sway=1.6;const k=((px/CH)|0)+','+((py/CH)|0);(grassB.get(k)||grassB.set(k,[]).get(k)).push(dd);}else decals.push(dd);}}
  /* ground cover IN FRONT of every object's foot: tufts depth-sorted just below the painted base, so they overlap the bottom edge
     and the object looks rooted in the ground instead of standing on it */
  if(AUTO_G.length&&!CAVE&&cfg.footGrass!==0){const re=cfg.doorRe?new RegExp(cfg.doorRe):null,town=!!cfg.doorRe||!!cfg.city,add=[];
    for(const o of objs){if(!o.cast||o.coastal)continue;const c=CAT[o.n]||{};if(c.t==='flat'||c.t==='water')continue;if(o.tree&&!o.land&&!town&&rnd()>.35)continue;
      const base=o.y+o.h*(1-o.ay),wide=o.big||(re&&re.test(o.n)),n=wide?Math.max(4,Math.min(12,Math.round(o.w/38))):o.tree?3:2,spread=wide?.46:o.tree?.22:.42;
      for(let k=0;k<n;k++){const u=R(-spread,spread);if(re&&re.test(o.n)&&Math.abs(u)<.13)continue;const px=o.x+u*o.w,py=base+R(-3,5);if(water(px,py,2)||inPave(px,py,-14)||inRP(px,py))continue;
        const t=mk(pick(AUTO_G),px,py,{v:R(.5,.85),cast:0});if(!t)continue;t.sway=1.3;t.solid=[];t.ell=null;add.push(t);}}
    for(const t of add)objs.push(t);}
  decals.sort((a,b)=>a.y-b.y);
  for(const o of objs.concat(seaObjs)){const k=((o.x/CH)|0)+','+((o.y/CH)|0);(buckets.get(k)||buckets.set(k,[]).get(k)).push(o);}
  buildGrid();
  /* weeds and moss in the corner where a wall meets the street */
  if(WALLS&&cfg.doorRe&&LAWN_G.length)for(let i=0;i<COLS;i+=2)for(let j=0;j<ROWS-1;j++){const k=j*COLS+i;if(!WF[k]||WF[k+COLS])continue;if(rnd()>.3)continue;
    const px=i*CELL+R(0,24),py=(j+1)*CELL+R(3,9);if(blocked(px,py+4)||inRP(px,py))continue;const dd=mk(pick(LAWN_G),px,py,{v:R(.4,.65),cast:0});if(!dd)continue;dd.sway=1;const kk=((px/CH)|0)+','+((py/CH)|0);(grassB.get(kk)||grassB.set(kk,[]).get(kk)).push(dd);}
  /* warps: snap to walkable ground */
  for(const w of warps){const n=nearest({x:w.x,y:w.y});if(n){w.x=n.x;w.y=n.y;}w.ph=rnd()*6.28;}
  const st=warps.length?warps[0]:{x:W/2,y:H/2};spawnPt=(cfg.start&&nearest({x:cfg.start[0],y:cfg.start[1]}))||nearest({x:st.x+(W/2-st.x)*.06,y:st.y+(H/2-st.y)*.06})||st;
  /* reachable cells from the arrival point (flood fill) — monsters only spawn where the player can walk */
  reach=new Uint8Array(N);{const q=new Int32Array(N);let h=0,t=0;const s0=((spawnPt.y/CELL)|0)*COLS+((spawnPt.x/CELL)|0);if(!grid[s0]){q[t++]=s0;reach[s0]=1;}
    while(h<t){const i=q[h++],x=i%COLS,y=(i/COLS)|0;if(x>0&&!grid[i-1]&&!reach[i-1]){reach[i-1]=1;q[t++]=i-1;}if(x<COLS-1&&!grid[i+1]&&!reach[i+1]){reach[i+1]=1;q[t++]=i+1;}if(y>0&&!grid[i-COLS]&&!reach[i-COLS]){reach[i-COLS]=1;q[t++]=i-COLS;}if(y<ROWS-1&&!grid[i+COLS]&&!reach[i+COLS]){reach[i+COLS]=1;q[t++]=i+COLS;}}}
  /* no sealed pockets: every open area the player can see is joined to the rest by a natural gap through the trees;
     tiny pockets are filled in */
  for(let pass=0;pass<6;pass++){const lab=new Int32Array(N).fill(-1),regs=[];
    for(let s0=0;s0<N;s0++){if(grid[s0]||reach[s0]||lab[s0]>=0)continue;const q=[s0];lab[s0]=regs.length;for(let k=0;k<q.length;k++){const i=q[k],x=i%COLS,y=(i/COLS)|0;
        for(const j of [x>0?i-1:-1,x<COLS-1?i+1:-1,y>0?i-COLS:-1,y<ROWS-1?i+COLS:-1])if(j>=0&&!grid[j]&&!reach[j]&&lab[j]<0){lab[j]=regs.length;q.push(j);}}regs.push(q);}
    if(!regs.length)break;let carved=false;
    for(const q of regs){if(q.length<70){for(const i of q)grid[i]=1;continue;}
      let sx=0,sy=0;for(const i of q){sx+=i%COLS;sy+=(i/COLS)|0;}sx/=q.length;sy/=q.length;let c=q[0],cd=1e9;for(const i of q){const d=(i%COLS-sx)**2+(((i/COLS)|0)-sy)**2;if(d<cd){cd=d;c=i;}}
      const cx=c%COLS,cy=(c/COLS)|0;let best=-1,bd=1e18;for(let i=0;i<N;i++)if(reach[i]){const d=(i%COLS-cx)**2+(((i/COLS)|0)-cy)**2;if(d<bd){bd=d;best=i;}}if(best<0)continue;
      const ax=cx*CELL+6,ay=cy*CELL+6,bx=(best%COLS)*CELL+6,by=((best/COLS)|0)*CELL+6,L=Math.hypot(bx-ax,by-ay),n=Math.ceil(L/10);
      const segD=(x,y)=>{const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(L*L||1)));return Math.hypot(x-ax-dx*t,y-ay-dy*t);};
      for(let k=0;k<=n;k++){const t=k/n,wob=(vnoise(k*.08,cx*.1)-.5)*40,x=ax+(bx-ax)*t+(ay-by)/(L||1)*wob,y=ay+(by-ay)*t+(bx-ax)/(L||1)*wob;stampE(x,y,44,38,0);wallClear(x,y,44,38);}
      for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(!o.land&&segD(o.x,o.y)<(o.big?o.w*.5:70)){objs.splice(i,1);}}carved=true;}
    if(!carved)break;
    /* re-stamp remaining solids, then refresh reachability */
    if(WALLS){const old=WV.slice();wallFinish();for(let k=0;k<grid.length;k++)if(old[k]&&!WV[k])grid[k]=0;}
    for(const o of objs){for(const s of o.solid)stamp(s[0],s[1],s[2]);if(o.ell)stampE(...o.ell,1,4);}for(const o of objs)if(o.walk)for(const w of o.walk)stampE(o.x+w[0]*(o.flip?-1:1),o.y+w[1],w[2],w[3],0,4);
    reach.fill(0);{const q=new Int32Array(N);let h=0,t=0;const s0=((spawnPt.y/CELL)|0)*COLS+((spawnPt.x/CELL)|0);if(!grid[s0]){q[t++]=s0;reach[s0]=1;}
      while(h<t){const i=q[h++],x=i%COLS,y=(i/COLS)|0;for(const j of [x>0?i-1:-1,x<COLS-1?i+1:-1,y>0?i-COLS:-1,y<ROWS-1?i+COLS:-1])if(j>=0&&!grid[j]&&!reach[j]){reach[j]=1;q[t++]=j;}}}}
  buckets.clear();for(const o of objs.concat(seaObjs)){const k=((o.x/CH)|0)+','+((o.y/CH)|0);(buckets.get(k)||buckets.set(k,[]).get(k)).push(o);}
  const reachable=(x,y)=>reach[((y/CELL)|0)*COLS+((x/CELL)|0)]===1;
  if(cfg.mons!==false)for(let i=0;i<8000&&spawns.length<Math.round((cfg.spawnN||32)*1.5);i++){const x=R(250,W-250),y=R(220,H-220);if(!reachable(x,y)||nearTrail(x,y,20)||warps.some(w=>Math.hypot(x-w.x,y-w.y)<520))continue;if(spawns.some(s=>Math.hypot(s.x-x,s.y-y)<(cfg.spawnGap||320)*.78))continue;spawns.push({x,y});}
  makeMinimap();ready=true;}catch(e){console.error(e);failed=true;}}
let spawnPt={x:W/2,y:H/2},reach=null;

/* ---------- collision grid ---------- */
function stamp(x,y,r){const c0=Math.max(0,((x-r)/CELL)|0),c1=Math.min(COLS-1,((x+r)/CELL)|0),r0=Math.max(0,((y-r)/CELL)|0),r1=Math.min(ROWS-1,((y+r)/CELL)|0);
  for(let j=r0;j<=r1;j++)for(let i=c0;i<=c1;i++){const cx=i*CELL+6,cy=j*CELL+6;if((cx-x)**2+(cy-y)**2<=r*r)grid[j*COLS+i]=1;}}
function stampE(cx,cy,rx,ry,v=1,pw=2){const c0=Math.max(0,((cx-rx)/CELL)|0),c1=Math.min(COLS-1,((cx+rx)/CELL)|0),r0=Math.max(0,((cy-ry)/CELL)|0),r1=Math.min(ROWS-1,((cy+ry)/CELL)|0);
  for(let j=r0;j<=r1;j++)for(let i=c0;i<=c1;i++){const x=i*CELL+6,y=j*CELL+6;if(Math.abs((x-cx)/rx)**pw+Math.abs((y-cy)/ry)**pw<=1)grid[j*COLS+i]=v;}}
const GROVES=!!(cfg.groves&&(cfg.groves.set||cfg.walls)),GTHR=cfg.groves?cfg.groves.thr??.52:9;
/* temple floors: rectangular halls joined by straight corridors (spanning tree + a couple of loops) */
let ROOMS=null;function rooms(){if(ROOMS)return ROOMS;if(cfg.rooms)return ROOMS=cfg.rooms;if(cfg.maze)return ROOMS=maze();const S=v=>Math.round(v/WBLK)*WBLK,rs=[],cr=[];const r2=(x,y,w,h)=>rs.push([S(x-w/2),S(y-h/2),S(x+w/2),S(y+h/2)]);
  const nx=W>3000?3:2,ny=2,mx=300,my=280;
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){if(rnd()<.15&&!(i===1&&j===1))continue;const cx=mx+(W-2*mx)*(i+.5)/nx+R(-120,120),cy=my+(H-2*my)*(j+.5)/ny+R(-90,90);r2(cx,cy,R(.62,.88)*(W-2*mx)/nx,R(.6,.86)*(H-2*my)/ny);}
  for(const w of warps)r2(w.x,w.y-40,430,330);for(const c of clearings)r2(c[0],c[1],c[2]*1.9,c[2]*1.5);for(const l of cfg.land||[])if(CAT[l.n])r2(l.x,l.y-60,CAT[l.n].w+300,CAT[l.n].h+240);
  const C=rs.map(r=>[(r[0]+r[2])/2,(r[1]+r[3])/2]),inT=[0],E=[];const d=(a,b)=>Math.abs(C[a][0]-C[b][0])+Math.abs(C[a][1]-C[b][1]);
  while(inT.length<C.length){let best=null;for(const a of inT)for(let b=0;b<C.length;b++)if(!inT.includes(b)&&(!best||d(a,b)<best[2]))best=[a,b,d(a,b)];inT.push(best[1]);E.push(best);}
  for(let k=0;k<2;k++){const a=Math.floor(rnd()*C.length),b=Math.floor(rnd()*C.length);if(a!==b)E.push([a,b]);}
  const hw=WBLK*2.5;for(const [a,b] of E){const [ax,ay]=C[a],[bx,by]=C[b];const hx=rnd()<.5;
    if(hx){cr.push([S(Math.min(ax,bx))-hw,S(ay)-hw,S(Math.max(ax,bx))+hw,S(ay)+hw],[S(bx)-hw,S(Math.min(ay,by))-hw,S(bx)+hw,S(Math.max(ay,by))+hw]);}
    else{cr.push([S(ax)-hw,S(Math.min(ay,by))-hw,S(ax)+hw,S(Math.max(ay,by))+hw],[S(Math.min(ax,bx))-hw,S(by)-hw,S(Math.max(ax,bx))+hw,S(by)+hw]);}}
  return ROOMS=rs.concat(cr);}
/* labyrinth: a perfect maze on a coarse grid (DFS), a few loops knocked through, corridors 2.5 blocks wide, small halls at the warps */
function maze(){const C=WBLK*9,nx=Math.floor((W-2*WBLK*2)/C),ny=Math.floor((H-2*WBLK*2)/C),ox=(W-nx*C)/2,oy=(H-ny*C)/2,vis=new Uint8Array(nx*ny),out=[],hw=WBLK*1.25;
  const cen=(i,j)=>[ox+(i+.5)*C,oy+(j+.5)*C],sn=v=>Math.round(v/WBLK)*WBLK,link=(a,b)=>{const [ax,ay]=cen(a%nx,(a/nx)|0),[bx,by]=cen(b%nx,(b/nx)|0);out.push([sn(Math.min(ax,bx)-hw),sn(Math.min(ay,by)-hw),sn(Math.max(ax,bx)+hw),sn(Math.max(ay,by)+hw)]);};
  const st=[0];vis[0]=1;while(st.length){const c=st[st.length-1],i=c%nx,j=(c/nx)|0,nb=[];if(i>0&&!vis[c-1])nb.push(c-1);if(i<nx-1&&!vis[c+1])nb.push(c+1);if(j>0&&!vis[c-nx])nb.push(c-nx);if(j<ny-1&&!vis[c+nx])nb.push(c+nx);
    if(!nb.length){st.pop();continue;}const n=nb[Math.floor(rnd()*nb.length)];vis[n]=1;link(c,n);st.push(n);}
  for(let k=0;k<Math.max(2,(nx*ny/10)|0);k++){const c=Math.floor(rnd()*nx*ny),i=c%nx;if(i<nx-1&&rnd()<.5)link(c,c+1);else if(c+nx<nx*ny)link(c,c+nx);}
  for(const w of warps)out.push([sn(w.x-170),sn(w.y-200),sn(w.x+170),sn(Math.min(H-WBLK*2,w.y+100+(WALLS.fh||160)))]);for(const cl of clearings)out.push([sn(cl[0]-cl[2]),sn(cl[1]-cl[2]*.7),sn(cl[0]+cl[2]),sn(cl[1]+cl[2]*.7)]);
  for(const w of warps){let best=null,bd=1e9;for(let c=0;c<nx*ny;c++){const [x,y]=cen(c%nx,(c/nx)|0),d=Math.hypot(x-w.x,y-w.y);if(d<bd){bd=d;best=[x,y];}}out.push([sn(Math.min(w.x,best[0])-hw),sn(w.y-hw),sn(Math.max(w.x,best[0])+hw),sn(w.y+hw)],[sn(best[0]-hw),sn(Math.min(w.y,best[1])-hw),sn(best[0]+hw),sn(Math.max(w.y,best[1])+hw)]);}
  return out;}
function footRaw(x,y){if(WBLK){if(!WALLS.noEdge&&edgeDist(x,y)<WBLK*2)return true;for(const r of rooms())if(x>=r[0]&&x<r[2]&&y>=r[1]&&y<r[3])return false;return true;}return (band0&&edgeDist(x,y)<edgeBand(x,y)-22)||(GROVES&&fbm(x/760,y/760)>GTHR+.01&&!inClearing(x,y,0)&&!inLand(x,y,0))||edgeDist(x,y)<40;}
/* near a wall mass: the footprint itself, or the lifted top just above it */
function wallFoot(x,y,m){const fh=(WALLS.fh||150);for(const [dx,dy] of [[0,0],[m,0],[-m,0],[0,m],[0,fh],[m,fh],[-m,fh],[0,fh+m]])if(footRaw(x+dx,y+dy))return true;return false;}
function buildGrid(){if(WALLS){for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const x=i*CELL+6,y=j*CELL+6;WF[j*COLS+i]=footRaw(x,y)?1:0;if(isSea(x,y)||inLake(x,y))grid[j*COLS+i]=1;}
    for(const P of trails)for(const p of P){const r=p[4]/2+26;wallClear(p[0],p[1],r,r);}
    if(!WBLK){for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const x=i*CELL+6,y=j*CELL+6;if(laneD(x,y)<46&&!isSea(x,y))wallClear(x,y,8,8);}
    for(const w of warps)wallClear(w.x,w.y,90,70);}
    /* hand-placed pieces always stand in the open */
    for(const o of objs)if(o.land&&!o.nowc&&!/cpGate|cpTower/.test(o.n))wallClear(o.x,o.y-20,Math.max(70,o.w*.55),60);
    wallFinish();for(let k=0;k<grid.length;k++)if(WV[k])grid[k]=1;}
  for(let j=0;j<ROWS&&!WALLS;j++)for(let i=0;i<COLS;i++){const x=i*CELL+6,y=j*CELL+6;if((band0&&edgeDist(x,y)<edgeBand(x,y)-22)||(GROVES&&fbm(x/760,y/760)>GTHR+.01&&!inClearing(x,y,0)&&!inLand(x,y,0))||edgeDist(x,y)<40||isSea(x,y)||inLake(x,y))grid[j*COLS+i]=1;}
  for(const P of trails)for(const p of P){if(isSea(p[0],p[1]))continue;const r=p[4]/2+26;stampE(p[0],p[1],r,r,0);}
  for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const x=i*CELL+6,y=j*CELL+6;if(!PAVES.length&&!CANALS.length&&!ROADS.length&&!SQUARES.length)break;if(inCanal(x,y))grid[j*COLS+i]=1;else if(inPave(x,y,-2)&&!(WALLS&&WV[j*COLS+i]))grid[j*COLS+i]=0;}
  for(const p of stream)stamp(p[0],p[1],p[4]/2+4);
  for(const o of objs){for(const s of o.solid)stamp(s[0],s[1],s[2]);if(o.ell)stampE(...o.ell,1,4);}for(const o of objs)if(o.walk)for(const w of o.walk)stampE(o.x+w[0]*(o.flip?-1:1),o.y+w[1],w[2],w[3],0,4);
  if(B)for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const x=i*CELL+6,y=j*CELL+6;if(onBridge(x,y))grid[j*COLS+i]=0;}
  for(const d of docks)stampE(d[0],d[1],d[2],d[3],0,4);
  for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const x=i*CELL+6,y=j*CELL+6;if(!WALLS&&laneD(x,y)<46&&!isSea(x,y))grid[j*COLS+i]=0;}
  for(const w of warps){const n0=grid[((w.y/CELL)|0)*COLS+((w.x/CELL)|0)];if(n0){/* make sure the warp spot itself is open */stampE(w.x,w.y,46,30,0);}}}
function blocked(x,y){if(x<0||y<0||x>=W||y>=H)return true;return grid[((y/CELL)|0)*COLS+((x/CELL)|0)]===1;}
function clear(a,b){const dx=b.x-a.x,dy=b.y-a.y,n=Math.ceil(Math.hypot(dx,dy)/5);for(let i=0;i<=n;i++){const t=n?i/n:0;if(blocked(a.x+dx*t,a.y+dy*t))return false;}return true;}
function nearest(p){if(!blocked(p.x,p.y))return {x:p.x,y:p.y};for(let r=CELL;r<1400;r+=CELL)for(let k=0;k<32;k++){const a=k/32*Math.PI*2,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;if(!blocked(x,y))return {x,y};}return null;}
const N=COLS*ROWS,gS=new Float32Array(N),fS=new Float32Array(N),prev=new Int32Array(N),closed=new Uint8Array(N),stampA=new Uint32Array(N),hp=new Int32Array(N*2);let gen=0;
function route(a,b){if(blocked(b.x,b.y)){const n=nearest(b);if(!n)return [];b=n;}if(clear(a,b))return [{x:b.x,y:b.y}];
  if(blocked(a.x,a.y)){const n=nearest(a);if(n)a=n;}
  const s=((a.y/CELL)|0)*COLS+((a.x/CELL)|0),g=((b.y/CELL)|0)*COLS+((b.x/CELL)|0),gx=g%COLS,gy=(g/COLS)|0;gen++;let hn=0;
  const Hh=i=>{const dx=Math.abs(i%COLS-gx),dy=Math.abs(((i/COLS)|0)-gy);return 1.15*(dx+dy-.586*Math.min(dx,dy));};
  const touch=i=>{if(stampA[i]!==gen){stampA[i]=gen;gS[i]=1e30;closed[i]=0;prev[i]=-1;}};
  const push=i=>{let k=hn++;hp[k]=i;while(k>0){const p=(k-1)>>1;if(fS[hp[p]]<=fS[hp[k]])break;const t=hp[p];hp[p]=hp[k];hp[k]=t;k=p;}};
  const pop=()=>{const top=hp[0];hn--;if(hn>0){hp[0]=hp[hn];let k=0;for(;;){const l=2*k+1,r=l+1;let m=k;if(l<hn&&fS[hp[l]]<fS[hp[m]])m=l;if(r<hn&&fS[hp[r]]<fS[hp[m]])m=r;if(m===k)break;const t=hp[m];hp[m]=hp[k];hp[k]=t;k=m;}}return top;};
  touch(s);gS[s]=0;fS[s]=Hh(s);push(s);let found=false;
  while(hn>0&&hn<hp.length-8){const i=pop();if(closed[i])continue;closed[i]=1;if(i===g){found=true;break;}const x=i%COLS,y=(i/COLS)|0,gi=gS[i];
    for(let d=0;d<8;d++){const dx=d<4?(d===0?1:d===1?-1:0):(d&1?-1:1),dy=d<4?(d===2?1:d===3?-1:0):(d<6?1:-1),nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=COLS||ny>=ROWS)continue;
      const j=ny*COLS+nx;if(grid[j])continue;if(dx&&dy&&(grid[y*COLS+nx]||grid[ny*COLS+x]))continue;touch(j);if(closed[j])continue;const c=gi+(dx&&dy?1.414:1);
      if(c<gS[j]){gS[j]=c;prev[j]=i;fS[j]=c+Hh(j);push(j);}}}
  if(!found)return [];const raw=[];for(let i=g;i>=0&&i!==s;i=prev[i])raw.push({x:(i%COLS)*CELL+6,y:((i/COLS)|0)*CELL+6});raw.reverse();raw.push({x:b.x,y:b.y});
  const out=[];let from=a,i=0;while(i<raw.length){let j=i;while(j+1<raw.length&&clear(from,raw[j+1]))j++;out.push(raw[j]);from=raw[j];i=j+1;}return out;}

/* ---------- ground chunks (baked lazily, LRU) ---------- */
/* trampled snow instead of dirt: a soft, slightly shaded track that fades in and out, with footprints */
function trample(q,Ps,inR){const vis=[];for(const P of Ps)for(let i=0;i<P.length;i+=2){const p=P[i];if(inR(p[0],p[1],p[4]))vis.push([p[0],p[1],p[4]*.4*(1-(p[5]||0)*.55)]);}if(!vis.length)return;
  q.save();q.filter='blur(7px)';q.fillStyle=TH.tr[0];q.beginPath();for(const d of vis){q.moveTo(d[0]+d[2],d[1]);q.arc(d[0],d[1],d[2],0,7);}q.fill();
  q.filter='blur(4px)';q.fillStyle=TH.tr[1];q.beginPath();for(const d of vis){q.moveTo(d[0]+d[2]*.5,d[1]-d[2]*.25);q.arc(d[0],d[1]-d[2]*.25,d[2]*.5,0,7);}q.fill();q.restore();}
let bakesThisFrame=0;
const PADC={};function padC(k){let t=PADC[k];if(!t){const c=document.createElement('canvas');c.width=c.height=CH+120;t=PADC[k]={c,g:c.getContext('2d')};}return t;}
const TMP={};function tmpC(k){let t=TMP[k];if(!t){const c=document.createElement('canvas');c.width=c.height=CH;t=TMP[k]={c,g:c.getContext('2d')};t.g.imageSmoothingEnabled=true;}return t;}
const MR=128,maskC=document.createElement('canvas');maskC.width=maskC.height=MR;const maskG=maskC.getContext('2d');
function patchMask(P,x0,y0){const s=P.scale||700,st=CH/MR,img=maskG.createImageData(MR,MR),d=img.data;let any=false;
  for(let j=0;j<MR;j++)for(let i=0;i<MR;i++){const x=x0+i*st,y=y0+j*st;let v=fbm(x/s+(P.o||0),y/s)+(vnoise(x/70+3,y/70+9)-.5)*.05;
    const a=Math.max(0,Math.min(1,(v-P.thr)/.012));if(a>0)any=true;const k=(j*MR+i)*4;d[k]=d[k+1]=d[k+2]=255;d[k+3]=a*255;}
  if(!any)return null;maskG.putImageData(img,0,0);return maskC;}
function lump(q,x,y,rx,ry,top,shade){q.fillStyle=shade;q.beginPath();q.ellipse(x,y+2.5,rx,ry,0,0,7);q.fill();q.fillStyle=top;q.beginPath();q.ellipse(x,y,rx,ry,0,0,7);q.fill();}
const GROUND=cfg.ground||'snow',SNOWY=/snow|Tundra|RockSnow|Glacier|SeaIce/.test(GROUND);
const LIP=CAPT?['#b8b0a0','#7a7060']:JAPAN?['#b8b0a0','#7a7060']:GREEK?['#e8e0cc','#a89a80']:DESERT?['#d8b07a','#9a7040']:!SNOWTH&&!CAVE?(THEME==='volcano'?['#4a3430','#241616']:['#a9a57c','#6a6a44']):CAVE?['#6d6788','#3e3a52']:GROUND==='texMud'?['#e6e2ee','#8f86a8']:['#eceaf4','#c2bede'];
/* wear on paving: soft blotches of grime and of sun-bleached stone, so a large street never reads as one flat repeated tile */
function grime(q,x0,y0,a){for(const [o,col,k] of [[5.1,'70,52,34',1],[9.7,'255,246,226',.75],[2.3,'90,110,60',.5]]){const m=patchMask({scale:o===2.3?140:260,thr:o===2.3?.62:.55,o},x0,y0);if(!m)continue;
    const t=tmpC(6);t.g.globalCompositeOperation='copy';t.g.drawImage(m,0,0,CH,CH);t.g.globalCompositeOperation='source-in';t.g.fillStyle=`rgb(${col})`;t.g.fillRect(0,0,CH,CH);q.globalAlpha=a*k;q.drawImage(t.c,x0,y0);q.globalAlpha=1;}}
/* raised lawn: drop shadow, kerb side face (3/4 view), kerb top with joints and a lit lip, grass with tonal variation, inner shade under the top kerb */
function lawn(q,L,x0,y0){const r=L.r,k=L.kerb??12,hgt=L.h??9,rad=L.rad??28,w=r[2]-r[0],h=r[3]-r[1];
  q.save();q.filter='blur(7px)';q.fillStyle='rgba(30,24,12,.38)';q.beginPath();q.roundRect(r[0]-k+4,r[1]-k+hgt+6,w+2*k,h+2*k,rad+k);q.fill();q.restore();
  q.fillStyle=L.side||'#8a7a62';q.beginPath();q.roundRect(r[0]-k,r[1]-k+hgt,w+2*k,h+2*k,rad+k);q.fill();
  q.fillStyle='rgba(40,30,18,.35)';q.beginPath();q.roundRect(r[0]-k,r[1]-k+hgt,w+2*k,h+2*k,rad+k);q.fill();
  q.fillStyle=L.kc||'#d9ceb4';q.beginPath();q.roundRect(r[0]-k,r[1]-k,w+2*k,h+2*k,rad+k);q.fill();
  q.save();q.beginPath();q.roundRect(r[0]-k,r[1]-k,w+2*k,h+2*k,rad+k);q.clip();q.strokeStyle='rgba(90,72,50,.45)';q.lineWidth=1.4;
  for(let x=r[0]-k+20;x<r[2]+k;x+=38){q.beginPath();q.moveTo(x,r[1]-k);q.lineTo(x,r[1]);q.moveTo(x+19,r[3]);q.lineTo(x+19,r[3]+k);q.stroke();}
  for(let y=r[1]+20;y<r[3];y+=38){q.beginPath();q.moveTo(r[0]-k,y);q.lineTo(r[0],y);q.moveTo(r[2],y+19);q.lineTo(r[2]+k,y+19);q.stroke();}
  q.fillStyle='rgba(255,250,232,.55)';q.fillRect(r[0]-k,r[1]-k,w+2*k,2.5);q.restore();
  q.strokeStyle='rgba(60,45,28,.6)';q.lineWidth=1.5;q.beginPath();q.roundRect(r[0]-k,r[1]-k,w+2*k,h+2*k+hgt,rad+k);q.stroke();
  q.save();q.beginPath();q.roundRect(r[0],r[1],w,h,rad);q.clip();q.fillStyle=pat(q,L.tex||GROUND)||'#6a9a40';q.fillRect(r[0],r[1],w,h);
  for(let i=0;i<4;i++){const cx=r[0]+w*hash(i+(r[0]|0),r[1]|0),cy=r[1]+h*hash(r[1]|0,i+(r[2]|0)),rr=Math.max(w,h)*(.25+.25*hash(i,7)),gr=q.createRadialGradient(cx,cy,0,cx,cy,rr),c=i%2?'255,240,170':'30,70,20';gr.addColorStop(0,`rgba(${c},.14)`);gr.addColorStop(1,`rgba(${c},0)`);q.fillStyle=gr;q.fillRect(r[0],r[1],w,h);}
  let g=q.createLinearGradient(0,r[1],0,r[1]+26);g.addColorStop(0,'rgba(20,35,10,.42)');g.addColorStop(1,'rgba(20,35,10,0)');q.fillStyle=g;q.fillRect(r[0],r[1],w,26);
  g=q.createLinearGradient(r[0],0,r[0]+16,0);g.addColorStop(0,'rgba(20,35,10,.25)');g.addColorStop(1,'rgba(20,35,10,0)');q.fillStyle=g;q.fillRect(r[0],r[1],16,h);q.restore();}
/* chunks are baked with a BP-pixel margin and the centre is cut out: blurred shapes that cross a chunk edge then blur the same way on both sides (no seam lines) */
const BP=32;let bakeOut=null;
function bake(ci,cj){const c0=bakeRaw(ci,cj),c=document.createElement('canvas');c.width=c.height=CH;const g=c.getContext('2d');g.drawImage(c0,BP,BP,CH,CH,0,0,CH,CH);return c;}
function bakeRaw(ci,cj){if(!bakeOut){bakeOut=document.createElement('canvas');bakeOut.width=bakeOut.height=CH+2*BP;}const c=bakeOut;const q=c.getContext('2d');q.setTransform(1,0,0,1,0,0);q.globalAlpha=1;q.globalCompositeOperation='source-over';q.filter='none';q.clearRect(0,0,c.width,c.height);const x0=ci*CH,y0=cj*CH,x1=x0+CH,y1=y0+CH,inR=(x,y,m)=>x>x0-m-BP&&x<x1+m+BP&&y>y0-m-BP&&y<y1+m+BP;
  q.imageSmoothingQuality='high';q.translate(-x0+BP,-y0+BP);q.fillStyle=pat(q,GROUND);q.fillRect(x0-BP,y0-BP,CH+2*BP,CH+2*BP);
  /* texture patches: union of jittered discs where the noise field crosses the threshold */
  /* texture patches: a soft noise mask (low-res, smoothed) with a ragged fine edge, filled with the texture */
  for(const P of cfg.patches||[]){const tp=pat(q,P.tex);if(!tp)continue;const m=patchMask(P,x0,y0);if(!m)continue;
    if(P.rim!==false){const r=tmpC(1);r.g.globalCompositeOperation='copy';r.g.drawImage(m,0,0,CH,CH);r.g.globalCompositeOperation='source-in';r.g.fillStyle=P.rim||'rgba(60,40,50,.4)';r.g.fillRect(0,0,CH,CH);q.globalAlpha=P.a??1;q.drawImage(r.c,x0,y0+3);q.globalAlpha=1;}
    const t=tmpC(2);t.g.globalCompositeOperation='copy';t.g.drawImage(m,0,0,CH,CH);t.g.globalCompositeOperation='source-in';t.g.save();t.g.translate(-x0,-y0);t.g.fillStyle=pat(t.g,P.tex);t.g.fillRect(x0,y0,CH,CH);t.g.restore();q.globalAlpha=P.a??1;q.drawImage(t.c,x0,y0);q.globalAlpha=1;}
  for(const t of tints){if(!inR(t[0],t[1],t[2]))continue;const xa=Math.max(x0,Math.floor(t[0]-t[2])),ya=Math.max(y0,Math.floor(t[1]-t[2])),xb=Math.min(x1,Math.ceil(t[0]+t[2])),yb=Math.min(y1,Math.ceil(t[1]+t[2]));if(xb<=xa||yb<=ya)continue;   /* only the part of the chunk the tint reaches (it is transparent beyond its radius) */
    const g=q.createRadialGradient(t[0],t[1],0,t[0],t[1],t[2]);g.addColorStop(0,`rgba(${t[3]},${t[4]})`);g.addColorStop(1,`rgba(${t[3]},0)`);q.fillStyle=g;q.fillRect(xa,ya,xb-xa,yb-ya);}
  /* planned cities: the plain stone floor (kerb-less paved blocks) goes down first, so organic streets and plazas lie on top of it */
  if(cfg.paveMerge)for(const p of PAVES){if(p.kerb??8)continue;const r=p.r;if(r[2]<x0-24||r[0]>x1+24||r[3]<y0-24||r[1]>y1+24)continue;q.fillStyle=pat(q,p.tex||COBTEX);q.fillRect(r[0],r[1],r[2]-r[0],r[3]-r[1]);if(p.mul){q.globalCompositeOperation='multiply';q.fillStyle=p.mul;q.fillRect(r[0],r[1],r[2]-r[0],r[3]-r[1]);q.globalCompositeOperation='source-over';}
    q.save();q.beginPath();q.rect(r[0],r[1],r[2]-r[0],r[3]-r[1]);q.clip();grime(q,x0,y0,p.grime??.13);q.restore();}
  /* a hand-painted floor picture laid over a rect (planned cities): the whole layout in one image, relief baked in */
  for(const G of [cfg.groundImg,...(cfg.groundImgs||[])])if(G&&IMG[G.n]&&IMG[G.n].naturalWidth){const r=G.r,im=IMG[G.n];if(!(r[2]<x0-BP||r[0]>x1+BP||r[3]<y0-BP||r[1]>y1+BP)){q.drawImage(im,r[0],r[1],r[2]-r[0],r[3]-r[1]);
    const tp=G.detail&&pat(q,G.detail);if(tp){q.save();q.beginPath();q.rect(r[0],r[1],r[2]-r[0],r[3]-r[1]);q.clip();q.globalCompositeOperation='soft-light';q.globalAlpha=G.detailA??.35;q.fillStyle=tp;q.fillRect(x0,y0,CH,CH);q.restore();}}}
  /* organic streets, blended in: a soft worn-earth fringe, then the stones through a feathered mask with worn holes, no hard outline */
  {const vis=[...SQUARES,...ROADS].filter(o=>{const b=o.bb;return !(b[2]<x0-60||b[0]>x1+60||b[3]<y0-60||b[1]>y1+60);});
   if(vis.length){const path=o=>{const P=new Path2D();o.poly.forEach((p,i)=>i?P.lineTo(p[0],p[1]):P.moveTo(p[0],p[1]));P.closePath();return P;};
    const a=padC(3),g=a.g;g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.clearRect(0,0,CH+120,CH+120);g.translate(-x0+60,-y0+60);
    /* 1 · worn earth fringe */
    g.filter='blur(7px)';g.strokeStyle='#000';g.lineJoin='round';g.lineWidth=22;g.fillStyle='#000';for(const o of vis){const P=path(o);g.stroke(P);g.fill(P);}g.filter='none';
    g.globalCompositeOperation='source-in';g.fillStyle=pat(g,DIRTTEX)||'#8a6a48';g.fillRect(x0-60,y0-60,CH+120,CH+120);g.setTransform(1,0,0,1,0,0);
    q.globalAlpha=SNOWY?.3:(cfg.fringe??.4);q.drawImage(a.c,60,60,CH,CH,x0,y0,CH,CH);q.globalAlpha=1;
    /* 2 · stones: feathered mask minus worn patches, one layer per surface (stone, maize...) */
    const groups=new Map();for(const o of vis){const k=o.tex||COBTEX;(groups.get(k)||groups.set(k,[]).get(k)).push(o);}
    for(const [tex,os] of groups){const pb=padC(4),pg=pb.g;pg.setTransform(1,0,0,1,0,0);pg.clearRect(0,0,CH+120,CH+120);pg.translate(-x0+60,-y0+60);pg.filter='blur(5px)';pg.fillStyle='#000';for(const o of os)pg.fill(path(o));pg.filter='none';pg.setTransform(1,0,0,1,0,0);
      const b=tmpC(4),h=b.g;h.setTransform(1,0,0,1,0,0);h.globalCompositeOperation='copy';h.drawImage(pb.c,60,60,CH,CH,0,0,CH,CH);h.globalCompositeOperation='source-over';
      const crop=/Maize/.test(tex);if(!crop){const m=patchMask({scale:150,thr:cfg.roadWear??.6,o:3.3},x0,y0);if(m){h.globalCompositeOperation='destination-out';h.globalAlpha=.85;h.drawImage(m,0,0,CH,CH);h.globalAlpha=1;}}
      h.globalCompositeOperation='source-in';h.translate(-x0,-y0);h.fillStyle=pat(h,tex)||'#999';h.fillRect(x0,y0,CH,CH);h.setTransform(1,0,0,1,0,0);
      h.globalCompositeOperation='source-atop';const sh=os[0].shade||cfg.roadShade;h.fillStyle=sh?sh:SNOWY?'rgba(235,240,255,.3)':'rgba(120,150,60,.13)';h.fillRect(0,0,CH,CH);
      /* the stones sit a little into the ground: a soft dark rim just under their lower edge instead of a pale sticker halo */
      if(!crop){const d=tmpC(7);d.g.globalCompositeOperation='copy';d.g.drawImage(b.c,0,0);d.g.globalCompositeOperation='source-in';d.g.fillStyle='rgb(46,34,22)';d.g.fillRect(0,0,CH,CH);q.globalAlpha=.38;q.drawImage(d.c,x0,y0+3);q.globalAlpha=.18;q.drawImage(d.c,x0+2,y0+6);q.globalAlpha=1;}
      q.drawImage(b.c,x0,y0);
      /* wear and grime on the stones so the tile never repeats visibly */
      if(!crop){const P=new Path2D();for(const o of os)P.addPath(path(o));q.save();q.clip(P);grime(q,x0,y0,.12);q.restore();}}}}
  /* paved streets and plazas: kerb, stones, a light lip on the top edge and a soft shade under the bottom edge */
  /* merged mode (planned cities): every kerb first, then every surface, so crossing streets join without a kerb line across them */
  if(cfg.paveMerge){const vis=PAVES.filter(p=>{const r=p.r;return !(r[2]<x0-24||r[0]>x1+24||r[3]<y0-24||r[1]>y1+24);});
    /* shape of a paved area grown by k: a rectangle, or an ellipse for round plazas */
    const shp=(P,p,k,dy)=>{dy=dy||0;if(p.e)P.ellipse(p.e[0],p.e[1]+dy,p.e[2]+k,p.e[3]+k,0,0,6.2832);else{const r=p.r;P.rect(r[0]-k,r[1]-k+dy,r[2]-r[0]+2*k,r[3]-r[1]+2*k);}};
    const fill=p=>{q.beginPath();shp(q,p,0);q.fillStyle=pat(q,p.tex||COBTEX);q.fill();if(p.shade){q.fillStyle=p.shade;q.fill();}};
    for(const p of vis){const k=p.kerb??8;if(!k)continue;q.beginPath();shp(q,p,k,5);q.fillStyle='rgba(40,28,14,.3)';q.fill();}
    for(const p of vis){const k=p.kerb??8;if(!k)continue;q.beginPath();shp(q,p,k);q.fillStyle=p.kc||'#8a6a48';q.fill();
      q.save();q.clip();q.strokeStyle='rgba(70,52,30,.45)';q.lineWidth=1.3;q.beginPath();
      if(p.e){const [cx,cy,rx,ry]=p.e,n=Math.round((rx+ry)*3.14/30);for(let i=0;i<n;i++){const a=i/n*6.2832,c=Math.cos(a),s=Math.sin(a);q.moveTo(cx+c*rx,cy+s*ry);q.lineTo(cx+c*(rx+k),cy+s*(ry+k));}q.stroke();
        q.strokeStyle='rgba(255,240,205,.45)';q.lineWidth=2.5;q.beginPath();q.ellipse(cx,cy,rx+k-1,ry+k-1,0,3.4,6.02);q.stroke();q.strokeStyle='rgba(40,26,12,.3)';q.beginPath();q.ellipse(cx,cy,rx+k-1,ry+k-1,0,.25,2.9);q.stroke();}
      else{const r=p.r;for(let x=r[0]-k;x<r[2]+k;x+=30){q.moveTo(x,r[1]-k);q.lineTo(x,r[1]);q.moveTo(x+15,r[3]);q.lineTo(x+15,r[3]+k);}for(let y=r[1]-k;y<r[3]+k;y+=30){q.moveTo(r[0]-k,y);q.lineTo(r[0],y);q.moveTo(r[2],y+15);q.lineTo(r[2]+k,y+15);}q.stroke();
        q.fillStyle='rgba(255,240,205,.4)';q.fillRect(r[0]-k,r[1]-k,r[2]-r[0]+2*k,2.5);q.fillStyle='rgba(40,26,12,.28)';q.fillRect(r[0]-k,r[3]+k-2.5,r[2]-r[0]+2*k,2.5);}
      q.restore();}
    for(const p of vis)if(p.kerb??8)fill(p);
    /* rings of darker stone inlaid in a round plaza */
    for(const p of vis)if(p.e&&p.rings)for(const f of p.rings){const [cx,cy,rx,ry]=p.e;q.strokeStyle=p.ringC||'rgba(150,120,70,.55)';q.lineWidth=6;q.beginPath();q.ellipse(cx,cy,rx*f,ry*f,0,0,6.2832);q.stroke();q.strokeStyle='rgba(255,246,220,.35)';q.lineWidth=1.5;q.beginPath();q.ellipse(cx,cy-2,rx*f,ry*f,0,0,6.2832);q.stroke();}
    const kv=vis.filter(p=>p.kerb??8);if(kv.length){q.save();q.beginPath();for(const p of kv)shp(q,p,0);q.clip();grime(q,x0,y0,Math.max(...vis.map(p=>p.grime??.13)));q.restore();}}
  else for(const p of PAVES){const r=p.r;if(r[2]<x0-20||r[0]>x1+20||r[3]<y0-20||r[1]>y1+20)continue;const k=p.kerb??8;
    q.fillStyle='rgba(40,28,14,.35)';q.fillRect(r[0]-k,r[1]-k+5,r[2]-r[0]+2*k,r[3]-r[1]+2*k);
    if(k){q.fillStyle=p.kc||'#8a6a48';q.fillRect(r[0]-k,r[1]-k,r[2]-r[0]+2*k,r[3]-r[1]+2*k);q.fillStyle='rgba(255,236,190,.35)';q.fillRect(r[0]-k,r[1]-k,r[2]-r[0]+2*k,3);
      q.strokeStyle='rgba(50,32,16,.55)';q.lineWidth=1.5;for(let x=r[0]-k;x<r[2]+k;x+=34){q.beginPath();q.moveTo(x,r[1]-k);q.lineTo(x,r[1]);q.moveTo(x+17,r[3]);q.lineTo(x+17,r[3]+k);q.stroke();}
      q.strokeStyle='rgba(40,26,12,.7)';q.lineWidth=2;q.strokeRect(r[0]-k,r[1]-k,r[2]-r[0]+2*k,r[3]-r[1]+2*k);}
    q.fillStyle=pat(q,p.tex||COBTEX);q.fillRect(r[0],r[1],r[2]-r[0],r[3]-r[1]);if(p.shade){q.fillStyle=p.shade;q.fillRect(r[0],r[1],r[2]-r[0],r[3]-r[1]);}
    if(p.grime!==0){q.save();q.beginPath();q.rect(r[0],r[1],r[2]-r[0],r[3]-r[1]);q.clip();grime(q,x0,y0,p.grime??.13);q.restore();}
    if(k){q.fillStyle='rgba(40,26,12,.22)';q.fillRect(r[0],r[1],r[2]-r[0],6);}}
  for(const L of cfg.lawns||[]){const r=L.r;if(L.pre||r[2]<x0-60||r[0]>x1+60||r[3]<y0-60||r[1]>y1+60)continue;lawn(q,L,x0,y0);}
  /* doorsteps: a worn path from the door down to the street kerb, then a raised stone step with a lit edge and a shadowed riser */
  for(const a of aprons){if(!inR(a.x,a.y,a.w+260))continue;const w=a.w,x=a.x-w/2,st=pat(q,cfg.stepTex||COBTEX);
    /* trodden earth spreading out from the step, darker and patchy, as where people really walk */
    if(!SNOWTH){q.save();q.filter='blur(8px)';q.globalAlpha=.32;q.fillStyle=pat(q,DIRTTEX)||'rgba(110,85,55,1)';q.beginPath();q.ellipse(a.x,a.y+22,w*.95,22,0,0,6.2832);q.fill();q.globalAlpha=.18;q.fillStyle='rgb(60,44,28)';q.beginPath();q.ellipse(a.x+w*.1,a.y+18,w*.55,12,0,0,6.2832);q.fill();q.restore();}
    if(a.to&&a.to>a.y+26){q.save();q.filter='blur(4px)';q.fillStyle='rgba(60,44,26,.35)';q.fillRect(x+4,a.y+10,w-8,a.to-a.y-6);q.filter='none';q.fillStyle=st;q.fillRect(x+8,a.y+10,w-16,a.to-a.y-8);q.fillStyle='rgba(255,246,226,.12)';q.fillRect(x+8,a.y+10,w-16,a.to-a.y-8);q.restore();}
    q.save();q.filter='blur(5px)';q.fillStyle='rgba(30,22,14,.45)';q.beginPath();q.roundRect(x-2,a.y-6,w+4,34,6);q.fill();q.restore();
    q.fillStyle='#7d6c55';q.beginPath();q.roundRect(x,a.y-10,w,30,5);q.fill();
    q.fillStyle=st;q.beginPath();q.roundRect(x,a.y-12,w,24,5);q.fill();q.fillStyle='rgba(255,244,220,.28)';q.beginPath();q.roundRect(x,a.y-12,w,24,5);q.fill();
    q.fillStyle='rgba(255,250,236,.6)';q.fillRect(x+4,a.y-12,w-8,2);q.strokeStyle='rgba(70,52,32,.5)';q.lineWidth=1;q.beginPath();q.moveTo(x+w/2,a.y-11);q.lineTo(x+w/2,a.y+11);q.stroke();
    const g=q.createLinearGradient(0,a.y+12,0,a.y+20);g.addColorStop(0,'rgba(40,28,16,.55)');g.addColorStop(1,'rgba(40,28,16,0)');q.fillStyle=g;q.fillRect(x,a.y+12,w,8);}
  for(const r of CANALS){if(r[2]<x0-30||r[0]>x1+30||r[3]<y0-30||r[1]>y1+30)continue;
    if(r[5]){/* paddy: muddy dike edge, flooded rice inside, a soft shade under the top dike */const w=r[2]-r[0],h=r[3]-r[1];q.fillStyle='rgba(60,45,25,.55)';q.beginPath();q.roundRect(r[0]-9,r[1]-9,w+18,h+18,16);q.fill();
      q.fillStyle=pat(q,DIRTTEX)||'#8a6a48';q.beginPath();q.roundRect(r[0]-6,r[1]-6,w+12,h+12,14);q.fill();q.fillStyle='#3a2a14';q.beginPath();q.roundRect(r[0]-1,r[1]-1,w+2,h+2,10);q.fill();
      q.fillStyle=pat(q,r[4]);q.beginPath();q.roundRect(r[0],r[1],w,h,9);q.fill();const g2=q.createLinearGradient(0,r[1],0,r[1]+22);g2.addColorStop(0,'rgba(20,30,20,.45)');g2.addColorStop(1,'rgba(20,30,20,0)');q.fillStyle=g2;q.fillRect(r[0],r[1],w,22);continue;}
    const k=14;
    q.fillStyle='#2a1a0e';q.fillRect(r[0]-k-2,r[1]-k-2,r[2]-r[0]+2*k+4,r[3]-r[1]+2*k+4);q.fillStyle=pat(q,COBTEX);q.fillRect(r[0]-k,r[1]-k,r[2]-r[0]+2*k,r[3]-r[1]+2*k);
    q.fillStyle='rgba(255,236,190,.3)';q.fillRect(r[0]-k,r[1]-k,r[2]-r[0]+2*k,3);q.fillStyle='#3a2614';q.fillRect(r[0]-2,r[1]-2,r[2]-r[0]+4,r[3]-r[1]+4);
    q.fillStyle=pat(q,r[4]||LAKETEX);q.fillRect(r[0],r[1],r[2]-r[0],r[3]-r[1]);const g=q.createLinearGradient(0,r[1],0,r[1]+26);g.addColorStop(0,'rgba(10,30,30,.55)');g.addColorStop(1,'rgba(10,30,30,0)');q.fillStyle=g;q.fillRect(r[0],r[1],r[2]-r[0],26);
    q.fillStyle='rgba(10,30,30,.35)';q.fillRect(r[0],r[1],8,r[3]-r[1]);}
  /* lakes (frozen) */
  if(cfg.lakes&&IMG[LAKETEX]){const cells=[];for(let y=y0-30;y<y1+30;y+=8)for(let x=x0-30;x<x1+30;x+=8)if(inLake(x,y))cells.push([x,y]);
    if(cells.length){/* soft-edged water: union of discs, feathered, then a darker bank peeking out underneath */
      const pb=padC(5),m=pb.g;m.setTransform(1,0,0,1,0,0);m.globalCompositeOperation='source-over';m.clearRect(0,0,CH+120,CH+120);m.translate(-x0+60,-y0+60);m.filter='blur(2.5px)';m.fillStyle='#000';m.beginPath();for(const d of cells){m.moveTo(d[0]+7,d[1]);m.arc(d[0],d[1],7,0,7);}m.fill();m.filter='none';
      const r=tmpC(1);r.g.globalCompositeOperation='copy';r.g.drawImage(pb.c,60,60,CH,CH,0,0,CH,CH);r.g.globalCompositeOperation='source-in';r.g.fillStyle=TH.lakeRim||'#3f7a5c';r.g.fillRect(0,0,CH,CH);
      q.drawImage(r.c,x0,y0+5);q.globalAlpha=.6;q.drawImage(r.c,x0+3,y0+2);q.globalAlpha=1;
      const w=tmpC(2);w.g.setTransform(1,0,0,1,0,0);w.g.globalCompositeOperation='copy';w.g.drawImage(pb.c,60,60,CH,CH,0,0,CH,CH);w.g.globalCompositeOperation='source-in';w.g.translate(-x0,-y0);w.g.fillStyle=pat(w.g,LAKETEX);w.g.fillRect(x0,y0,CH,CH);w.g.setTransform(1,0,0,1,0,0);
      q.drawImage(w.c,x0,y0);}}
  /* sea */
  if(SEA){/* soft shore in layers: a pale ice shelf on the snow, clear shallows, then the deep sea fading in */
    const cells=[];let any=false;for(let y=y0-60;y<y1+60;y+=9)for(let x=x0-60;x<x1+60;x+=9){const d=seaDepth(x,y);if(d>-26){cells.push([x,y,d]);any=true;}}
    if(any){const layer=(min,blur,fill,alpha,texn)=>{const pb=padC(6),m=pb.g;m.setTransform(1,0,0,1,0,0);m.globalCompositeOperation='source-over';m.clearRect(0,0,CH+120,CH+120);m.translate(-x0+60,-y0+60);m.filter=`blur(${blur}px)`;m.fillStyle='#000';m.beginPath();for(const d of cells)if(d[2]>min){m.moveTo(d[0]+8,d[1]);m.arc(d[0],d[1],8,0,7);}m.fill();m.filter='none';
        const t=tmpC(5),g2=t.g;g2.setTransform(1,0,0,1,0,0);g2.globalCompositeOperation='copy';g2.drawImage(pb.c,60,60,CH,CH,0,0,CH,CH);g2.globalCompositeOperation='source-in';g2.translate(-x0,-y0);g2.fillStyle=texn?(pat(g2,texn)||fill):fill;g2.fillRect(x0,y0,CH,CH);g2.setTransform(1,0,0,1,0,0);q.globalAlpha=alpha;q.drawImage(t.c,x0,y0);q.globalAlpha=1;};
      if(GREEK){layer(-30,9,'#f0dca8',.9);layer(-14,5,'#e8d4a0',1,'grBeach');}else if(JAPAN){layer(-28,9,'#a8a090',.8);layer(-14,5,'#9a9484',.95,'jpPave');}else{layer(-24,7,'#a9c4e6',.55);layer(-12,4,'#e6f2fb',1);}layer(2,3,'#6fb4e0',1,SNOWTH?'texStream':GREEK?'grSea':JAPAN?'jpWater':SEATEX);layer(60,26,'#1d3f6a',1,SEATEX);layer(170,24,'rgb(20,40,70)',.28);}
    /* a few stones and ice blocks sitting on the shelf */
    const sd2=SEA.side,ox=sd2==='E'?1:sd2==='W'?-1:0,oy=sd2==='S'?1:sd2==='N'?-1:0;for(const p of coast){if(!inR(p[0],p[1],70))continue;const h=hash(p[0]|0,p[1]|0);if(h>.09)continue;const n=(GREEK?'grBank':JAPAN?'jpBank':'bkS')+(JAPAN?[0,1,5,1,5,0,1,5][((h*90)|0)%8]:(((h*90)|0)%8)),im=IMG[n],c=CAT[n];if(!im||!im.naturalWidth)continue;const k=.7+h*6,w=c.w*k,hh=c.h*k;q.drawImage(im,p[0]-ox*10-w/2,p[1]-oy*10-hh*.7,w,hh);}}
  /* trails */
  if(TRAMP)trample(q,trails,inR);
  {const vis=TRAMP?[]:dirt.filter(d=>inR(d[0],d[1],d[2]+4));if(vis.length){const cob=KIND==='cobble';q.fillStyle=cob?'#5a4048':'#8a5a40';q.beginPath();for(const d of vis){q.moveTo(d[0]+d[2]+2,d[1]+1.5);q.arc(d[0],d[1]+1.5,d[2]+2,0,7);}q.fill();
    q.fillStyle=pat(q,cob?COBTEX:DIRTTEX);q.beginPath();for(const d of vis){q.moveTo(d[0]+d[2],d[1]);q.arc(d[0],d[1],d[2],0,7);}q.fill();
    if(CAVE){q.fillStyle='rgba(30,18,40,.5)';q.fill();}}}
  if(cfg.rails)for(const P of trails){const vis=P.filter(p=>inR(p[0],p[1],30));if(vis.length<2)continue;
    q.strokeStyle='#4a3020';q.lineWidth=5;for(let i=0;i<P.length;i+=2){const p=P[i];if(!inR(p[0],p[1],30))continue;q.beginPath();q.moveTo(p[0]+p[2]*16,p[1]+p[3]*16);q.lineTo(p[0]-p[2]*16,p[1]-p[3]*16);q.stroke();}
    for(const sd of [-10,10]){q.strokeStyle='#2a2630';q.lineWidth=3.2;q.beginPath();let st=false;for(const p of P){if(!inR(p[0],p[1],40)){st=false;continue;}const x=p[0]+p[2]*sd,y=p[1]+p[3]*sd;st?q.lineTo(x,y):q.moveTo(x,y);st=true;}q.stroke();
      q.strokeStyle='rgba(200,205,220,.75)';q.lineWidth=1.2;q.beginPath();st=false;for(const p of P){if(!inR(p[0],p[1],40)){st=false;continue;}const x=p[0]+p[2]*sd,y=p[1]+p[3]*sd-1;st?q.lineTo(x,y):q.moveTo(x,y);st=true;}q.stroke();}}
  for(const f of prints)if(inR(f[0],f[1],6)){q.fillStyle='rgba(140,132,196,.6)';q.beginPath();q.ellipse(f[0],f[1]+.8,3.4,2.1,f[2],0,7);q.fill();q.fillStyle='rgba(255,250,250,.7)';q.beginPath();q.ellipse(f[0]-.6,f[1]-1.2,2.6,1.2,f[2],0,7);q.fill();}
  {const vis=stream.filter(p=>inR(p[0],p[1],p[4]));if(vis.length){const jit=p=>{const h=hash((p[0]|0)+1,(p[1]|0)-1);return (h-.5)*p[4]*.22;};q.fillStyle=TH.st[0];q.beginPath();for(const p of vis){const j=jit(p);q.moveTo(p[0]+p[4]/2+3,p[1]+j);q.arc(p[0]+p[2]*j,p[1]+p[3]*j,p[4]/2+3,0,7);}q.fill();
    q.fillStyle=pat(q,STREAMTEX)||TH.st[1];q.beginPath();for(const p of vis){const j=jit(p);q.moveTo(p[0]+p[4]/2,p[1]+j);q.arc(p[0]+p[2]*j,p[1]+p[3]*j,p[4]/2,0,7);}q.fill();
    q.fillStyle=TH.st[2];for(const p of []){q.beginPath();q.ellipse(p[0]-p[2]*10,p[1]-p[3]*10-4,p[4]*.3,p[4]*.12,Math.atan2(p[3],-p[2])+Math.PI/2,0,7);q.fill();}
    q.strokeStyle='rgba(235,248,255,.75)';q.lineWidth=1.6;if(false)for(const c of cracks){if(!inR(c[0][0],c[0][1],120))continue;q.beginPath();c.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke();}}}
  for(const l of banks){if(!inR(l[0],l[1],70))continue;const h=hash(l[0]|0,l[1]|0);if(h>.4)continue;const n=BANKS+(CAPT?[0,1,2,3,4,0,1,7][((h*20)|0)%8]:JAPAN?[0,1,2,3,4,5,1,5][((h*20)|0)%8]:(((h*20)|0)%8)),im=IMG[n],c=CAT[n];if(!im||!im.naturalWidth){lump(q,l[0],l[1],l[2],l[3],LIP[0],LIP[1]);continue;}const k=.65+h*.9,w=c.w*k,hh=c.h*k;q.drawImage(im,l[0]-w/2,l[1]-hh*.72,w,hh);}
  if(SNOWY&&KIND!=='snow')for(const l of lips)if(inR(l[0],l[1],20))lump(q,l[0],l[1],l[2],l[3],LIP[0],LIP[1]);
  for(const g of ground)if(inR(g.x,g.y,Math.max(g.w,g.h)))q.drawImage(g.img,g.x0,g.y0,g.w,g.h);
  for(const d of decals)if(inR(d.x,d.y,120)&&!wallAt(d.x,d.y))drawObj(q,d,0);
  const sh=[];for(let j=cj-1;j<=cj+2;j++)for(let i=ci-1;i<=ci+1;i++){const b=buckets.get(i+','+j);if(b)sh.push(...b);}sh.sort((a,b)=>a.y-b.y);
  /* ---- light and shadow on maps with cfg.lit (owner 2026-11-20: objects must sit IN the map and read as 3D, never as stickers) ----
     the sun stands in the upper left, so everything throws its shadow onto the ground to its lower right. A shadow is the
     object's silhouette LAID DOWN on the ground: its height runs along the sun direction, its width becomes ground depth —
       · buildings and stalls (pieces with a footprint): as deep as the footprint, starting at the east wall
       · trees, posts, statues: as deep as the piece is round, starting at the foot
       · walls: the footprint swept along the sun direction by the wall's height
     Everything goes into one layer that is laid down in a single multiply pass: overlapping shadows merge (no black stacks)
     and the paving stays visible inside the shadow. */
  if(LIT){const L=padC(8),g=L.g;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.filter='none';g.clearRect(0,0,CH+120,CH+120);g.translate(-x0+60,-y0+60);let any=false;const r=SUN.sy/SUN.sx;
    for(const o of sh){if(!o.cast)continue;const fp=o.ell,
        /* a building's sprite height is wall height + roof depth: what throws the shadow is the height above its footprint */
        ext=fp?Math.max(18,Math.min(o.w>700?SUN.max*1.6:SUN.max,(o.h-2*fp[3])*SUN.sx*SUN.big)):Math.max(18,Math.min(SUN.max,o.h*SUN.sx*(o.tree?.9:1)));if(!inR(o.x+ext*.5,o.y,o.w+ext+90))continue;
      const foot=o.h*(1-o.ay),D=fp?2*fp[3]:Math.min(o.w*SUN.kd,o.tree?90:60),yc=fp?fp[1]:o.y-(o.tree?0:D*.25),xs=fp?o.x+fp[2]*.92:o.x,k=ext/o.h;
      g.save();g.transform(0,D/o.w,-k,-r*k,xs+k*foot,yc+r*k*foot);if(o.flip)g.scale(-1,1);g.drawImage(shSil(o.base||o.img),-o.ax*o.w,-o.ay*o.h,o.w,o.h);g.restore();any=true;}
    if(WALLS){const Lw=(WALLS.fh||150)*SUN.sx,dy=Lw*r,i0=Math.max(0,((x0-BP-Lw)/CELL|0)-1),i1=Math.min(COLS-1,((x1+BP)/CELL|0)+1),j0=Math.max(0,((y0-BP-dy)/CELL|0)-1),j1=Math.min(ROWS-1,((y1+BP)/CELL|0)+1),P=new Path2D();let n=0;
      for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const kk=j*COLS+i;if(!WF[kk])continue;const xa=i*CELL,xb=xa+CELL,ya=j*CELL,yb=ya+CELL;
        if(i+1<COLS&&!WF[kk+1]){P.moveTo(xb-1,ya-.5);P.lineTo(xb+Lw,ya+dy-.5);P.lineTo(xb+Lw,yb+dy+.5);P.lineTo(xb-1,yb+.5);P.closePath();n++;}
        if(j+1<ROWS&&!WF[kk+COLS]){P.moveTo(xa-.5,yb-1);P.lineTo(xb+.5,yb-1);P.lineTo(xb+Lw+.5,yb+dy);P.lineTo(xa+Lw-.5,yb+dy);P.closePath();n++;}}
      if(n){g.fillStyle=`rgba(${SHRGB.join(',')},.85)`;g.fill(P,'nonzero');any=true;}}
    g.setTransform(1,0,0,1,0,0);
    if(any){q.save();q.globalCompositeOperation='multiply';q.globalAlpha=CAVE?SUN.a*.7:SUN.a;q.filter='blur(3.5px)';q.drawImage(L.c,x0-60,y0-60);q.restore();}}
  /* every other map: the earlier, lighter shadow pass (unchanged) */
  /* 2026-11-21: the shadows of a chunk are laid (unblurred) on one scratch canvas and blurred together in ONE draw. Blurring each
     silhouette by itself (~100 filtered draws per chunk) was 9/10 of the time a new piece of ground took → the stutter while walking. Same picture. */
  else{const L=padC(7),g=L.g;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.clearRect(0,0,CH+120,CH+120);g.translate(-x0+60,-y0+60);g.globalAlpha=CAVE?.3:.42;let any=false;
  for(const o of sh){if(!o.cast||!inR(o.x,o.y,o.h*1.1))continue;g.save();g.translate(o.x,o.y+o.h*(1-o.ay)-2);g.transform(1,0,-.5,.34,0,0);if(o.flip)g.scale(-1,1);g.drawImage(sil(o.base||o.img),-o.ax*o.w,-o.h,o.w,o.h);g.restore();any=true;}
  g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;
  if(any){q.save();q.globalAlpha=1;q.filter='blur(3px)';q.drawImage(L.c,x0-60,y0-60);q.restore();}
  q.filter='none';q.globalAlpha=1;}
  /* contact shadow that follows the real outline of each object's foot: the lowest slice of its silhouette, pushed a few pixels
     toward the shadow side and blurred. The sprite itself hides most of it; what sticks out is a dark seam exactly where the
     painted base meets the ground — the thing that makes a sprite read as standing there. (Trees keep the round pool below.) */
  if(LIT&&cfg.contact!==0){const L=padC(8),g=L.g;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.clearRect(0,0,CH+120,CH+120);g.translate(-x0+60,-y0+60);let any=false;
    for(const o of sh){if(!o.cast||o.tree||!inR(o.x,o.y,o.w))continue;const im=sil(o.base||o.img),iw=im.width,ih=im.height,band=Math.max(12,Math.min(60,o.h*.22)),f=band/o.h;
      g.save();g.translate(o.x+3,o.y+o.h*(1-o.ay)+4);if(o.flip)g.scale(-1,1);g.drawImage(im,0,ih*(1-f),iw,ih*f,-o.ax*o.w,-band,o.w,band);g.restore();any=true;}
    g.setTransform(1,0,0,1,0,0);
    if(any){g.globalCompositeOperation='source-in';g.fillStyle=SHD;g.fillRect(0,0,CH+120,CH+120);g.globalCompositeOperation='source-over';
      q.save();q.globalCompositeOperation='multiply';q.globalAlpha=(cfg.contact??1)*.8;q.filter='blur(4px)';q.drawImage(L.c,x0-60,y0-60);q.restore();}}
  /* contact shadow: a soft dark pool right where each object meets the ground (ambient occlusion), so nothing looks pasted on */
  /* it sits where the PAINTED bottom of the sprite is (the anchor is ~7% of the height above it), and it reaches a little past that
     edge so a dark seam shows under the object — that seam is what makes a sprite read as standing on the ground */
  if(cfg.contact!==0){const ca=(cfg.contact??1)*(CAVE?.55:.5);for(const o of sh){if(!o.cast||!inR(o.x,o.y,o.w))continue;const base=o.y+o.h*(1-o.ay),rx=o.w*(o.tree?.24:o.big?.47:.4),ry=Math.max(7,rx*(o.big?.2:.28)),cy=base-ry*.45;
    q.save();q.translate(o.x,cy);q.scale(1,ry/rx);const g=q.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(16,12,20,${ca})`);g.addColorStop(.6,`rgba(16,12,20,${ca*.6})`);g.addColorStop(1,'rgba(16,12,20,0)');q.fillStyle=g;q.fillRect(-rx,-rx,2*rx,2*rx);q.restore();
    /* tight occlusion line hugging the foot */
    const lx=o.w*(o.tree?.13:o.big?.42:.3),ly=Math.max(3,lx*.12);q.save();q.translate(o.x,base-1);q.scale(1,ly/lx);const g2=q.createRadialGradient(0,0,0,0,0,lx);g2.addColorStop(0,`rgba(12,8,14,${ca*1.1})`);g2.addColorStop(.7,`rgba(12,8,14,${ca*.7})`);g2.addColorStop(1,'rgba(12,8,14,0)');q.fillStyle=g2;q.fillRect(-lx,-lx,2*lx,2*lx);q.restore();}}if(WALLS)drawWalls(q,ci,cj);return c;}
function drawWalls(q,ci,cj){const x0=ci*CH,y0=cj*CH,i0=Math.max(0,(x0/CELL|0)-2),i1=Math.min(COLS-1,((x0+CH)/CELL|0)+2),j0=Math.max(0,(y0/CELL|0)-2),j1=Math.min(ROWS-1,((y0+CH)/CELL|0)+FHC+2);
  const blk=!!WBLK,cell=(path,i,j,g)=>{const x=i*CELL,y=j*CELL;if(blk)path.rect(x-g,y-g,CELL+2*g,CELL+2*g);else{const h=hash(i,j);path.moveTo(x+6+7+g+h*2,y+6);path.arc(x+6,y+6,7+g+h*2,0,7);}};
  /* top mass: outline, texture, darkening toward the inside */
  const top=new Path2D(),rim=new Path2D(),deep=[new Path2D(),new Path2D(),new Path2D()];
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const k=j*COLS+i;if(!WV[k])continue;cell(top,i,j,0);cell(rim,i,j,blk?2:3);const d=WD[k];if(d>=2)cell(deep[0],i,j,blk?0:2);if(d>=3)cell(deep[1],i,j,blk?0:3);if(d>=4)cell(deep[2],i,j,blk?0:4);}
  q.fillStyle=WALLS.rim||'#2a1a0e';q.fill(rim);q.fillStyle=pat(q,WALLS.top)||'#5a4430';q.fill(top);q.fillStyle=WALLS.tint||'rgba(30,18,10,.45)';q.fill(top);
  const dk=WALLS.dark||'14,9,6',dm=WALLS.deep??1;q.fillStyle=`rgba(${dk},${.35*dm})`;q.fill(deep[0]);q.fillStyle=`rgba(${dk},${.45*dm})`;q.fill(deep[1]);q.fillStyle=`rgba(${dk},${.7*dm})`;q.fill(deep[2]);
  /* rampart walk (city walls): a crenellated parapet along the outer edges of the wall top — merlons two cells long with a gap between,
     each with a lit top and a darker front face so the wall reads as a wall and not as a brick road */
  if(WALLS.parapet){const top2=new Path2D(),front=new Path2D(),gap=new Path2D(),line=new Path2D(),sh=new Path2D();let any=false;for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const k=j*COLS+i;if(!WV[k])continue;
      const out=(a,b)=>a<0||b<0||a>=COLS||b>=ROWS||!WV[b*COLS+a],x=i*CELL,y=j*CELL;
      if(out(i-1,j)||out(i+1,j)||out(i,j-1)||out(i,j+1)){any=true;if(out(i,j+1)&&!out(i,j-1))continue;   /* the front edge: the painted face below brings its own merlons */
        const along=out(i,j-1)&&!out(i-1,j)&&!out(i+1,j)?i:j;
        if(along%3===2)gap.rect(x,y+3,CELL,CELL-3);else{top2.rect(x,y-4,CELL,CELL-1);front.rect(x,y+CELL-5,CELL,5);line.rect(x,y+CELL,CELL,1.5);}}
      else if(out(i-2,j)||out(i+2,j)||out(i,j-2)||out(i,j+2))sh.rect(x,y,CELL,CELL);}
    if(any){q.fillStyle='rgba(60,45,30,.22)';q.fill(sh);q.fillStyle='rgba(186,170,140,.95)';q.fill(gap);q.fillStyle='rgba(60,45,30,.45)';q.fill(line);q.fillStyle='rgb(158,140,112)';q.fill(front);q.fillStyle=WALLS.parapet;q.fill(top2);}}
  /* faces: one slice per column, hung from the top edge down to the footprint's bottom */
  const im=IMG[WALLS.face];if(!im||!im.naturalWidth)return;const FH=FHC*CELL,sw=im.naturalWidth*FH/im.naturalHeight,ky=im.naturalHeight/FH,kx=im.naturalWidth/sw;
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const k=j*COLS+i;if(!WF[k]||j>=ROWS-3||(j+1<ROWS&&WF[k+COLS]))continue;
    let yb=(j+1)*CELL;if(!blk){/* caves: average the edge over neighbouring columns so it slopes instead of stepping */let sum=0,n=0;for(let d=-2;d<=2;d++){const c=i+d;if(c<0||c>=COLS)continue;for(let e=-3;e<=3;e++){const r=j+e;if(r<0||r+1>=ROWS)continue;const kk=r*COLS+c;if(WF[kk]&&!WF[kk+COLS]){sum+=(r+1)*CELL;n++;break;}}}if(n)yb=sum/n+(hash(i,7)-.5)*3;}
    const yt=yb-FH,x=i*CELL;if(yb<y0-4||yt>y0+CH+4||x>x0+CH+4||x+CELL<x0-4)continue;
    if(WALLS.parapet){/* between the face's own merlons you look onto the rampart walk, not the ground behind the wall */q.fillStyle=pat(q,WALLS.top)||'#5a4430';q.fillRect(x,yt-1,CELL+.6,FH*.11);q.fillStyle='rgba(70,56,40,.38)';q.fillRect(x,yt-1,CELL+.6,FH*.11);}
    const u=((x%sw)+sw)%sw,sx=u*kx,sW=CELL*kx;q.drawImage(im,sx,0,Math.min(sW,im.naturalWidth-sx),im.naturalHeight,x,yt,Math.min(CELL,(im.naturalWidth-sx)/kx)+.6,FH);
    if(sx+sW>im.naturalWidth){const rest=(sx+sW-im.naturalWidth)/kx;q.drawImage(im,0,0,rest*kx,im.naturalHeight,x+CELL-rest,yt,rest+.6,FH);}
    /* contact shadow on the floor */
    const g=q.createLinearGradient(0,yb,0,yb+22);g.addColorStop(0,'rgba(20,12,6,.45)');g.addColorStop(1,'rgba(20,12,6,0)');q.fillStyle=g;q.fillRect(x,yb,CELL,22);}}
const silCache=new Map();const SHC=cfg.shadowCol||(CAVE?'#1c1828':GROUND==='texMud'?'#2a2030':TH.sh);
/* light model of maps with cfg.lit (the capital so far; index.html castShadow reads host.sun so characters match):
   sx, sy = how far right / down a point's shadow lands per unit of height; kd = ground depth per unit of width; big = shorter for buildings */
const LIT=!!cfg.lit,SUN={sx:.5,sy:.2,kd:.42,max:150,big:.85,a:.72};
const SHRGB=(c=>{const m=/^#([0-9a-f]{6})$/i.exec(c);if(m){const n=parseInt(m[1],16);return [n>>16,(n>>8)&255,n&255];}const r=/(\d+)\D+(\d+)\D+(\d+)/.exec(c);return r?[+r[1],+r[2],+r[3]]:[40,40,60];})(SHC),SHD=`rgb(${SHRGB.map(v=>Math.round(v*.5)).join(',')})`;
const shCache=new Map();function shSil(img){let s=shCache.get(img);if(s)return s;const w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;s=document.createElement('canvas');s.width=w;s.height=h;const q=s.getContext('2d');q.drawImage(img,0,0);q.globalCompositeOperation='source-in';
  const g=q.createLinearGradient(0,0,0,h),c=SHRGB.join(',');g.addColorStop(0,`rgba(${c},.55)`);g.addColorStop(.6,`rgba(${c},.9)`);g.addColorStop(1,`rgba(${c},1)`);q.fillStyle=g;q.fillRect(0,0,w,h);shCache.set(img,s);return s;}
function sil(img){let s=silCache.get(img);if(s)return s;s=document.createElement('canvas');s.width=img.naturalWidth;s.height=img.naturalHeight;const q=s.getContext('2d');q.drawImage(img,0,0);q.globalCompositeOperation='source-in';q.fillStyle=SHC;q.fillRect(0,0,s.width,s.height);silCache.set(img,s);return s;}
/* baking budget: at most ~6 ms of baking per frame (always one chunk if one on screen is missing), so walking never freezes the game */
let bakeT0=0;function chunk(ci,cj,pre){const k=ci+','+cj;let c=chunks.get(k);if(c){chunks.delete(k);chunks.set(k,c);return c;}
  if(bakesThisFrame>0&&(performance.now()-bakeT0>6||pre))return null;if(!bakesThisFrame)bakeT0=performance.now();bakesThisFrame++;c=bake(ci,cj);chunks.set(k,c);
  if(chunks.size>90)chunks.delete(chunks.keys().next().value);return c;}

/* ---------- wind ---------- */
const WINDK=MOOD==='storm'||MOOD==='sandstorm'?1.7:CAVE?0:MOOD==='town'?.7:1;
const breeze=t=>.35+.65*Math.pow(Math.max(0,Math.sin(t*.00042)),2);
function wind(x,y,t){const g=Math.max(0,Math.sin(x*.0016+y*.0006-t*.0011));return (breeze(t)*.6+g*g*g*.9)*WINDK;}
function swayOf(o,t){const w=wind(o.x,o.y,t),flick=(Math.sin(t*.004+o.ph)*.35+Math.sin(t*.0093+o.ph*2)*.15)*Math.min(1,WINDK+.2);let s=(w*.7+flick*(.4+w))*o.sway;
  if(o.hit){const a=(t-o.hit)/1000;if(a<1.2)s+=Math.sin(a*22)*(1.2-a)*1.4*o.sway;else o.hit=0;}return s*.08;}
function drawObj(q,o,t){const by=o.bob&&t?Math.sin(t*.0016+o.ph)*2.2:0,im=IMB(o.img);if(o.sway&&t){const sh=swayOf(o,t);q.save();q.translate(o.x,o.y);q.transform(1,0,-sh,1,0,0);if(o.flip)q.scale(-1,1);q.drawImage(im,-o.ax*o.w,-o.ay*o.h,o.w,o.h);q.restore();return;}
  if(o.flip){q.save();q.translate(o.x,o.y+by);q.scale(-1,1);q.drawImage(im,-o.ax*o.w,-o.ay*o.h,o.w,o.h);q.restore();}else q.drawImage(im,o.x-o.ax*o.w,o.y+by-o.ay*o.h,o.w,o.h);}
function viewRect(g){const m=g.getTransform(),inv=m.inverse(),cw=g.canvas.width,ch=g.canvas.height;const pts=[[0,0],[cw,0],[0,ch],[cw,ch]].map(([x,y])=>[inv.a*x+inv.c*y+inv.e,inv.b*x+inv.d*y+inv.f]);
  return {x0:Math.min(...pts.map(p=>p[0])),y0:Math.min(...pts.map(p=>p[1])),x1:Math.max(...pts.map(p=>p[0])),y1:Math.max(...pts.map(p=>p[1])),sc:Math.hypot(m.a,m.b),m};}
const MMC={azGrass:'#7fb44a',azSoil:'#7a4a2a',azPlaza:'#c9a070',azVolcanic:'#3a2a2a',azCaveFloor:'#a89070',azGold:'#d9a830',snow:'#d6d9ee',texTundra:'#d8cfc0',texRockSnow:'#cfc4c8',texMud:'#8e7480',texGlacier:'#8fd2ef',texSeaIce:'#bcd2ee',texCave:'#4d4a62',texCobble:'#cdb8bd',cpGrass:'#78ae48',cpPave:'#dccdb6',cpPlaza:'#ece2cc',cpDirt:'#b98a5a',jpPave:'#a8a39a',grMarble:'#ebe4d6',cpWater:'#4f9ad8'};
function makeMinimap(){const s=384/W,c=document.createElement('canvas');c.width=384;c.height=Math.round(H*s);const q=c.getContext('2d');q.scale(s,s);
  q.fillStyle=MMC[GROUND]||'#d6d9ee';q.fillRect(0,0,W,H);
  if(SEA&&seaPath){q.fillStyle='#3d6c98';q.fill(seaPath);}
  q.fillStyle='#b8a084';for(const A of [SQUARES,ROADS])for(const o of A){q.fillStyle=MMC[o.tex]||'#b8a084';q.beginPath();o.poly.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.fill();}for(const p of PAVES){const r=p.r;q.fillStyle=MMC[p.tex]||'#b8a084';if(p.e){q.beginPath();q.ellipse(p.e[0],p.e[1],p.e[2],p.e[3],0,0,7);q.fill();}else q.fillRect(r[0],r[1],r[2]-r[0],r[3]-r[1]);}
  for(const G of [cfg.groundImg,...(cfg.groundImgs||[])])if(G&&IMG[G.n]&&IMG[G.n].naturalWidth){const r=G.r;q.imageSmoothingQuality='high';q.drawImage(IMG[G.n],r[0],r[1],r[2]-r[0],r[3]-r[1]);}
  q.fillStyle='#6fa848';for(const L of cfg.lawns||[]){if(L.pre)continue;const r=L.r;q.beginPath();q.roundRect(r[0],r[1],r[2]-r[0],r[3]-r[1],L.rad??28);q.fill();}q.fillStyle='#4aa8a0';for(const r of CANALS)if(!r[5])q.fillRect(r[0],r[1],r[2]-r[0],r[3]-r[1]);
  if(WALLS){q.fillStyle=CAVE?'#16121c':'#1e160e';for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++)if(WV[j*COLS+i])q.fillRect(i*CELL,j*CELL,CELL+1,CELL+1);}
  q.fillStyle=KIND==='cobble'?'#9c8288':'#c6a083';for(const P of trails)for(const p of P){if(p[5]>.7&&TRAMP)continue;q.beginPath();q.arc(p[0],p[1],p[4]*.8,0,7);q.fill();}
  q.fillStyle='#78b2df';for(const p of stream){q.beginPath();q.arc(p[0],p[1],p[4]*.7,0,7);q.fill();}
  if(cfg.lakes)for(const l of cfg.lakes){q.beginPath();q.ellipse(l.x,l.y,l.rx,l.ry,0,0,7);q.fill();}
  for(const o of objs){q.fillStyle=o.tree?(CAVE?'#25222f':'#3f6f55'):o.big?'#7a6050':'#8a8070';if(!o.tree&&!o.big)continue;q.beginPath();q.arc(o.x,o.y-o.h*.3,Math.max(o.w*.42,o.big?60:0),0,7);q.fill();}
  q.fillStyle='#4fc3ff';for(const w of warps){q.beginPath();q.arc(w.x,w.y,60,0,7);q.fill();}minimap=c;}

/* ---------- warps ---------- */
function drawWarps(g,t){for(const w of warps)window.drawCodeWarp(g,w.x,w.y,t,w.ph);}
function warpFx(g,t){for(const w of warps){g.save();g.globalCompositeOperation='lighter';for(let k=0;k<7;k++){const u=((t*.0005+k/7+w.ph)%1),a=Math.sin(u*Math.PI);const x=w.x+Math.sin(k*2.3+w.ph)*40,y=w.y-u*90;g.fillStyle=`rgba(150,230,255,${.55*a})`;g.fillRect(x-1.5,y-4,3,8);}
  g.restore();if(w.label){const L=window.warpName(w.label);g.save();g.font='700 15px sans-serif';g.textAlign='center';g.lineWidth=4;g.strokeStyle='rgba(20,30,50,.75)';g.fillStyle='#e8f8ff';g.strokeText(L,w.x,w.y-96);g.fillText(L,w.x,w.y-96);g.restore();}}}

/* ---------- atmosphere (screen space) ---------- */
const flakes=[];const NFL=THEME==='jungle'?(CAVE?30:55):THEME==='volcano'?110:THEME==='temple'?40:CAVE?40:MOOD==='storm'?260:MOOD==='sandstorm'?320:MOOD==='rift'?90:MOOD==='dragon'?240:MOOD==='sakura'?110:MOOD==='oni'?110:MOOD==='dark'?70:MOOD==='glacier'?90:120;for(let i=0;i<NFL;i++)flakes.push({x:Math.random(),y:Math.random(),z:.4+Math.random()*.6,p:Math.random()*6.28});
const puffs=[];let lastT=0;
function treePuffs(g,t,dt){if(!SNOWY||CAVE)return;const v=viewRect(g);if(breeze(t)*WINDK>.6&&Math.random()<dt*6){const b=[];for(let j=Math.floor(v.y0/CH);j<=Math.floor(v.y1/CH);j++)for(let i=Math.floor(v.x0/CH);i<=Math.floor(v.x1/CH);i++){const k=buckets.get(i+','+j);if(k)for(const o of k)if(o.tree&&o.sway&&o.x>v.x0&&o.x<v.x1&&o.y>v.y0&&o.y<v.y1+o.h)b.push(o);}
    if(b.length){const o=b[(Math.random()*b.length)|0];for(let n=0;n<6;n++)puffs.push({x:o.x+(Math.random()-.5)*o.w*.5,y:o.y-o.h*(.45+Math.random()*.4),vx:30+Math.random()*40,vy:8+Math.random()*16,l:0,L:1.4+Math.random(),r:2+Math.random()*2.5});}}
  for(let i=puffs.length-1;i>=0;i--){const p=puffs[i];p.l+=dt;if(p.l>p.L){puffs.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;const a=Math.sin(p.l/p.L*Math.PI)*.8;g.fillStyle=`rgba(255,255,255,${a})`;g.beginPath();g.arc(p.x,p.y,p.r*(1+p.l*.6),0,7);g.fill();}}
const LIGHT=/razier|Fire|Lava|lava|Fall$|Sulfur|torch|Torch|lantern|lamp|bonfire|Forge|forge|crystal|Crystal|Ore|altar|Altar|warp/;let lightObjs=null,dark=null;const RAYC={};
let LLc=null;
function atmosphere(g,t,night){const cw=g.canvas.width,chh=g.canvas.height,u=Math.max(cw,chh)/1280,dt=Math.min(.05,Math.max(0,(t-lastT)/1000));lastT=t;const m=g.getTransform();
  g.save();g.setTransform(1,0,0,1,0,0);
  const grade=(stops,op)=>{const gr=g.createLinearGradient(0,0,cw*.75,chh);stops.forEach((s,i)=>gr.addColorStop(i/(stops.length-1),s));g.globalCompositeOperation=op||'soft-light';g.fillStyle=gr;g.fillRect(0,0,cw,chh);g.globalCompositeOperation='source-over';};
  /* light layer (2026-11-21): every 'screen' pass of a frame (light shafts, drifting glows) is drawn into ONE small black canvas (1/4 size)
     and blended once. Screen-blending them one by one at full size gives the same picture, but cost 5–7 big blends a frame. */
  const SCR=draw=>{if(LITE())return;if(!LLc)LLc=document.createElement('canvas');const w=Math.ceil(cw/4),h=Math.ceil(chh/4);if(LLc.width!==w||LLc.height!==h){LLc.width=w;LLc.height=h;}
    const q=LLc.getContext('2d');q.setTransform(1,0,0,1,0,0);q.globalAlpha=1;q.globalCompositeOperation='source-over';q.fillStyle='#000';q.fillRect(0,0,w,h);q.setTransform(w/cw,0,0,h/chh,0,0);q.globalCompositeOperation='screen';
    draw(q);q.globalAlpha=1;const sq=g.imageSmoothingQuality;g.imageSmoothingQuality='low';g.globalCompositeOperation='screen';g.globalAlpha=1;g.drawImage(LLc,0,0,cw,chh);g.globalCompositeOperation='source-over';g.imageSmoothingQuality=sq;};
  /* light shafts: a pre-made soft beam (feathered sides, fading tail) so no shaft ever has a hard edge */
  const rays=(col,k,more)=>{let spr=RAYC[col];if(!spr){spr=document.createElement('canvas');spr.width=64;spr.height=256;const q=spr.getContext('2d'),im=q.createImageData(64,256),d=im.data;const c=col.split(',').map(Number);
      for(let y=0;y<256;y++)for(let x=0;x<64;x++){const e=Math.sin(Math.PI*(x+.5)/64)**2.2,f=Math.min(1,y/30)*(1-y/256)**1.4,o=(y*64+x)*4;d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255*e*f;}q.putImageData(im,0,0);RAYC[col]=spr;}
    SCR(g=>{const ang=.62,Lr=Math.hypot(cw,chh)*1.1;
    for(let i=0;i<5;i++){const off=(i*.19-.12)*cw+Math.sin(t*.00013+i*1.7)*30*u,w=(80+i*37%90)*u,a=(.16+.07*Math.sin(t*.0004+i*2.1))*(i%2?.8:1)*k;
      g.save();g.translate(off,-40*u);g.rotate(ang-Math.PI/2);g.globalAlpha=Math.min(1,a*1.6);g.drawImage(spr,-w,0,2*w,Lr);g.restore();}
    g.globalAlpha=1;if(more)more(g);});};
  if(night&&!CAVE){g.globalCompositeOperation='multiply';g.fillStyle='rgb(120,120,170)';g.fillRect(0,0,cw,chh);g.globalCompositeOperation='source-over';}
  else if(MOOD==='sun'||MOOD==='town'){grade(['rgba(255,196,128,.30)','rgba(255,214,170,.08)','rgba(150,150,220,.10)']);rays('255,226,170',1);}
  else if(MOOD==='cold'){grade(['rgba(200,225,255,.30)','rgba(160,180,240,.12)','rgba(120,130,200,.18)']);rays('225,240,255',.6);}
  else if(MOOD==='storm'){grade(['rgba(170,185,215,.45)','rgba(150,160,200,.3)','rgba(110,120,170,.35)']);g.fillStyle='rgba(225,232,248,.10)';g.fillRect(0,0,cw,chh);}
  else if(MOOD==='dark'){g.globalCompositeOperation='multiply';g.fillStyle='rgb(150,160,175)';g.fillRect(0,0,cw,chh);g.globalCompositeOperation='source-over';grade(['rgba(70,110,110,.35)','rgba(40,60,80,.25)','rgba(30,30,60,.35)']);
    SCR(g=>{for(let i=0;i<4;i++){const x=((t*.00002*(i+1)+i*.27)%1.4-.2)*cw,y=(.25+i*.2)*chh;const gr=g.createRadialGradient(x,y,0,x,y,320*u);gr.addColorStop(0,'rgba(150,170,190,.12)');gr.addColorStop(1,'rgba(150,170,190,0)');g.fillStyle=gr;g.fillRect(0,0,cw,chh);}});}
  else if(MOOD==='jungle'){grade(['rgba(255,214,120,.30)','rgba(200,230,120,.08)','rgba(40,90,60,.18)']);rays('255,232,160',1.1);}
  else if(MOOD==='cloud'){grade(['rgba(220,240,230,.35)','rgba(170,210,190,.18)','rgba(90,130,120,.25)']);SCR(g=>{for(let i=0;i<6;i++){const x=((t*.000025*(i%3+1)+i*.21)%1.5-.25)*cw,y=(.12+i*.16)*chh;const gr=g.createRadialGradient(x,y,0,x,y,380*u);gr.addColorStop(0,'rgba(235,245,240,.22)');gr.addColorStop(1,'rgba(235,245,240,0)');g.fillStyle=gr;g.fillRect(0,0,cw,chh);}});}
  else if(MOOD==='volcano'){g.globalCompositeOperation='multiply';g.fillStyle='rgb(205,170,160)';g.fillRect(0,0,cw,chh);g.globalCompositeOperation='source-over';grade(['rgba(255,110,40,.32)','rgba(180,60,30,.18)','rgba(60,20,30,.3)']);
    const gl=g.createLinearGradient(0,chh,0,chh*.4);gl.addColorStop(0,'rgba(255,90,20,.16)');gl.addColorStop(1,'rgba(255,90,20,0)');SCR(g=>{g.fillStyle=gl;g.fillRect(0,0,cw,chh);});}
  else if(MOOD==='desert'){grade(['rgba(255,200,120,.32)','rgba(255,225,170,.10)','rgba(170,120,200,.10)']);rays('255,232,180',1.1);
    /* heat shimmer: faint wavering bands low on the screen */
    g.save();g.globalAlpha=.05;for(let i=0;i<6;i++){const y=chh*(.55+i*.075)+Math.sin(t*.002+i)*6*u;g.fillStyle=i%2?'#fff3d0':'#c89040';g.fillRect(0,y,cw,3*u);}g.restore();}
  else if(MOOD==='sandstorm'){g.globalCompositeOperation='multiply';g.fillStyle='rgb(225,190,160)';g.fillRect(0,0,cw,chh);g.globalCompositeOperation='source-over';g.fillStyle='rgba(205,140,70,.34)';g.fillRect(0,0,cw,chh);
    /* rolling dust clouds sweep across, thick enough to hide the far side of the screen */
    for(let i=0;i<7;i++){const x=(((t*.00011*(1+i*.17)+i*.31)%1.6)-.3)*cw,y=(.08+i*.14)*chh+Math.sin(t*.0007+i)*30*u,r=(260+i*40)*u,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(215,155,85,.38)');gr.addColorStop(1,'rgba(215,155,85,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);}
    {const vg=g.createRadialGradient(cw/2,chh/2,Math.min(cw,chh)*.25,cw/2,chh/2,Math.hypot(cw,chh)*.55);vg.addColorStop(0,'rgba(190,130,70,0)');vg.addColorStop(1,'rgba(160,100,50,.55)');g.fillStyle=vg;g.fillRect(0,0,cw,chh);}
    SCR(g=>{for(let i=0;i<5;i++){const y=((t*.00009*(1+i*.3)+i*.23)%1)*chh,gr=g.createLinearGradient(0,y-80*u,0,y+80*u);gr.addColorStop(0,'rgba(255,200,120,0)');gr.addColorStop(.5,'rgba(255,200,120,.12)');gr.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gr;g.fillRect(0,y-80*u,cw,160*u);}});}
  else if(MOOD==='capital'){grade(['rgba(255,225,170,.22)','rgba(255,245,220,.05)','rgba(130,170,230,.12)']);rays('255,240,205',1);}
  else if(MOOD==='rift'){grade(['rgba(90,220,255,.10)','rgba(180,90,255,.08)','rgba(20,10,50,.18)']);
    SCR(g=>{for(let i=0;i<5;i++){const x=((t*.00002*(i+1)+i*.27)%1.4-.2)*cw,y=(.2+i*.17)*chh,r=280*u,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,i%2?'rgba(255,110,230,.08)':'rgba(90,220,255,.08)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);}});}
  else if(MOOD==='japan'||MOOD==='sakura'){grade(['rgba(255,220,200,.22)','rgba(255,240,235,.06)','rgba(140,170,220,.12)']);rays('255,235,220',1);}
  else if(MOOD==='spirit'){g.globalCompositeOperation='multiply';g.fillStyle='rgb(125,145,165)';g.fillRect(0,0,cw,chh);g.globalCompositeOperation='source-over';grade(['rgba(120,170,255,.16)','rgba(70,90,140,.2)','rgba(20,30,50,.38)']);
    SCR(g=>{for(let i=0;i<5;i++){const x=((t*.000018*(i+1)+i*.29)%1.4-.2)*cw,y=(.15+i*.18)*chh,r=(280+i*30)*u,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(200,220,255,.07)');gr.addColorStop(1,'rgba(200,220,255,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);}});}
  else if(MOOD==='oni'){g.globalCompositeOperation='multiply';g.fillStyle='rgb(175,140,135)';g.fillRect(0,0,cw,chh);g.globalCompositeOperation='source-over';grade(['rgba(255,90,40,.18)','rgba(120,30,30,.2)','rgba(40,10,10,.35)']);}
  else if(MOOD==='dragon'){g.globalCompositeOperation='multiply';g.fillStyle='rgb(150,160,180)';g.fillRect(0,0,cw,chh);g.globalCompositeOperation='source-over';grade(['rgba(140,180,255,.16)','rgba(90,110,160,.2)','rgba(30,40,70,.32)']);
    /* lightning: a rare white flash */
    const lt=(t*.001)%9;if(lt<.12||(lt>.22&&lt<.3)){g.fillStyle=`rgba(230,240,255,${lt<.12?.32:.18})`;g.fillRect(0,0,cw,chh);}}
  else if(MOOD==='greek'){grade(['rgba(255,214,150,.26)','rgba(255,240,200,.06)','rgba(120,170,230,.12)']);rays('255,240,200',1);}
  else if(MOOD==='moon'){g.globalCompositeOperation='multiply';g.fillStyle='rgb(120,130,175)';g.fillRect(0,0,cw,chh);g.globalCompositeOperation='source-over';grade(['rgba(150,170,255,.18)','rgba(90,80,160,.18)','rgba(30,20,60,.35)']);rays('200,215,255',.8);}
  else if(MOOD==='hades'){g.globalCompositeOperation='multiply';g.fillStyle='rgb(140,150,165)';g.fillRect(0,0,cw,chh);g.globalCompositeOperation='source-over';grade(['rgba(60,200,180,.14)','rgba(40,80,110,.2)','rgba(10,20,40,.4)']);
    SCR(g=>{for(let i=0;i<5;i++){const x=((t*.00002*(i+1)+i*.27)%1.4-.2)*cw,y=(.2+i*.17)*chh;const gr=g.createRadialGradient(x,y,0,x,y,300*u);gr.addColorStop(0,'rgba(80,200,180,.08)');gr.addColorStop(1,'rgba(80,200,180,0)');g.fillStyle=gr;g.fillRect(x-300*u,y-300*u,600*u,600*u);}});}
  else if(MOOD==='olympus'){grade(['rgba(255,230,160,.34)','rgba(255,245,220,.14)','rgba(200,190,240,.12)']);rays('255,240,190',1.4,g=>{for(let i=0;i<6;i++){const x=((t*.000022*(i%3+1)+i*.21)%1.4-.2)*cw,y=(.12+i*.15)*chh,r=(240+i*30)*u,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.14)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);}});}
  else if(MOOD==='necro'){grade(['rgba(120,80,170,.34)','rgba(80,60,120,.22)','rgba(40,20,60,.34)']);g.fillStyle='rgba(30,10,40,.12)';g.fillRect(0,0,cw,chh);}
  else if(MOOD==='gold'){grade(['rgba(255,220,120,.38)','rgba(255,200,90,.12)','rgba(120,90,40,.15)']);rays('255,225,140',1.2);}
  else if(MOOD==='glacier'){grade(['rgba(150,235,255,.35)','rgba(140,200,255,.12)','rgba(120,120,230,.2)']);rays('190,240,255',.9);}
  if(CAVE){/* darkness with light pools (torches, crystals, forges, the player) */
    if(!dark)dark=document.createElement('canvas');if(dark.width!==cw||dark.height!==chh){dark.width=cw;dark.height=chh;}const d=dark.getContext('2d');d.globalCompositeOperation='source-over';d.clearRect(0,0,cw,chh);
    d.fillStyle=MOOD==='rift'?'rgba(20,8,40,.34)':MOOD==='mine'?'rgba(14,10,22,.66)':'rgba(8,10,24,.72)';d.fillRect(0,0,cw,chh);d.globalCompositeOperation='destination-out';
    if(!lightObjs)lightObjs=objs.filter(o=>LIGHT.test(o.n));const sc=Math.hypot(m.a,m.b);
    const hole=(x,y,r,a)=>{const X=m.a*x+m.c*y+m.e,Y=m.b*x+m.d*y+m.f,rr=r*sc;if(X<-rr||Y<-rr||X>cw+rr||Y>chh+rr)return;const gr=d.createRadialGradient(X,Y,0,X,Y,rr);gr.addColorStop(0,`rgba(0,0,0,${a})`);gr.addColorStop(1,'rgba(0,0,0,0)');d.fillStyle=gr;d.fillRect(X-rr,Y-rr,rr*2,rr*2);};
    hole(ply.x,ply.y-20,330,.95);for(const o of lightObjs)hole(o.x,o.y-o.h*.5,(/torch|lamp|lantern/i.test(o.n)?190:240)*(1+.06*Math.sin(t*.008+o.ph)),.9);for(const w of warps)hole(w.x,w.y,200,.9);
    g.drawImage(dark,0,0);g.globalCompositeOperation='lighter';for(const o of lightObjs){const X=m.a*o.x+m.c*(o.y-o.h*.5)+m.e,Y=m.b*o.x+m.d*(o.y-o.h*.5)+m.f,rr=120*sc;if(X<-rr||Y<-rr||X>cw+rr||Y>chh+rr)continue;
      const fire=/torch|lamp|lantern|bonfire|orge/i.test(o.n),gr=g.createRadialGradient(X,Y,0,X,Y,rr);gr.addColorStop(0,fire?`rgba(255,160,70,${.22+.05*Math.sin(t*.011+o.ph)})`:'rgba(90,180,255,.2)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(X-rr,Y-rr,rr*2,rr*2);}
    g.globalCompositeOperation='source-over';}
  /* snow / dust motes */
  const bz=breeze(t)*WINDK;for(const f of flakes){if(THEME==='volcano'||MOOD==='oni'){f.y-=dt*.05*f.z;f.x+=dt*(.01*Math.sin(t*.001+f.p*5));if(f.y<-.02){f.y=1.02;f.x=Math.random();}}
    else if(MOOD==='dragon'){f.y+=dt*(.9+.5*f.z);f.x+=dt*.12;if(f.y>1.02){f.y=-.02;f.x=Math.random();}if(f.x>1.02)f.x=-.02;}
    else if(MOOD==='sakura'){f.y+=dt*(.03+.02*f.z);f.x+=dt*(.03+.025*Math.sin(t*.0009+f.p*3)+.06*bz)*f.z;f.r=(f.r||f.p*6)+dt*(1.5+f.z);if(f.y>1.02){f.y=-.02;f.x=Math.random();}if(f.x>1.02)f.x=-.02;}
    else if(MOOD==='sandstorm'){f.x+=dt*(.35+.25*f.z)*(1+bz);f.y+=dt*.03*Math.sin(t*.002+f.p*4);if(f.x>1.02){f.x=-.02;f.y=Math.random();}}
    else if(!SNOWTH&&!CAVE){f.y+=dt*.006*Math.sin(t*.0006+f.p);f.x+=dt*(.008+.006*Math.sin(t*.0004+f.p))*f.z;if(f.x>1.02)f.x=-.02;if(f.y>1.02)f.y=-.02;if(f.y<-.02)f.y=1.02;}
    else if(CAVE){f.y-=dt*.006*f.z;f.x+=dt*.004*Math.sin(t*.0005+f.p);if(f.y<-.02){f.y=1.02;f.x=Math.random();}}
    else{f.y+=dt*(MOOD==='storm'?.09:.035)*f.z;f.x+=dt*(.012+.01*Math.sin(t*.0007+f.p)+(MOOD==='storm'?.22:.09)*bz*bz)*f.z;if(f.y>1.02){f.y=-.02;f.x=Math.random();}if(f.x>1.02)f.x=-.02;}
    const s=Math.max(1,Math.round((1.4+f.z*1.8)*u)),tw=.55+.45*Math.sin(t*.003+f.p*3);if(MOOD==='dragon'){g.strokeStyle=`rgba(200,215,255,${.25+.3*f.z})`;g.lineWidth=Math.max(1,u);g.beginPath();const X=f.x*cw,Y=f.y*chh;g.moveTo(X,Y);g.lineTo(X-3*u,Y-(10+12*f.z)*u);g.stroke();continue;}
    if(MOOD==='sakura'){const X=f.x*cw,Y=f.y*chh,r=(2.4+2*f.z)*u;g.save();g.translate(X,Y);g.rotate(f.r);g.scale(1,Math.abs(Math.cos(f.r*1.3))*.7+.3);g.fillStyle=`rgba(255,${185+30*f.z|0},${205+20*f.z|0},${.75+.2*f.z})`;g.beginPath();g.ellipse(0,0,r,r*.6,0,0,7);g.fill();g.restore();continue;}
    if(MOOD==='sandstorm'){g.fillStyle=`rgba(${200+40*f.z|0},${150+30*f.z|0},90,${(.35+.4*f.z)*tw})`;g.fillRect(Math.round(f.x*cw),Math.round(f.y*chh),s*3,s);continue;}g.fillStyle=MOOD==='rift'?(f.p>3?`rgba(120,235,255,${(.4+.5*f.z)*tw})`:`rgba(255,130,235,${(.4+.5*f.z)*tw})`):MOOD==='oni'?`rgba(255,${100+80*f.z|0},40,${(.5+.4*f.z)*tw})`:MOOD==='spirit'?`rgba(150,200,255,${(.3+.45*f.z)*tw})`:MOOD==='moon'?`rgba(200,220,255,${(.3+.4*f.z)*tw})`:MOOD==='hades'?`rgba(120,255,220,${(.25+.4*f.z)*tw})`:MOOD==='necro'?`rgba(200,140,255,${(.25+.4*f.z)*tw})`:THEME==='volcano'?`rgba(255,${120+80*f.z|0},40,${(.5+.4*f.z)*tw})`:!SNOWTH&&!CAVE?`rgba(255,240,150,${(.25+.45*f.z)*tw*tw})`:CAVE?`rgba(255,210,150,${.35*f.z*tw})`:MOOD==='glacier'?`rgba(210,250,255,${(.45+.4*f.z)*tw})`:`rgba(255,255,255,${(.45+.4*f.z)*tw})`;g.fillRect(Math.round(f.x*cw),Math.round(f.y*chh),s,s);}
  g.restore();}

/* ---------- life: things that move on their own (all bounded, all cheap) ----------
   water: sparkles on sea/lakes/canals/ice, rings on still water, flow streaks on streams
   air:   falling leaves from broadleaf trees, butterflies by day, fireflies at night, bird flocks with ground shadows,
          drifting cloud shadows, blowing snow along the ground
   fire:  flicker glow + light pool, smoke and sparks from fires, mist at waterfalls, steam at vents, drips in caves */
let LK=null;const lifeKit=()=>LK||(LK=window.mkFieldLife({coast,seaDepth,getPly:()=>ply,CAVE,MOOD,THEME,SNOWTH,WINDK,LAKETEX,SEA,cfg,WALLS,objs,stream,isSea,inCanal,inLake,segDist,hash,breeze,viewRect,blocked,wallAt}));
/* ---------- host interface ---------- */
let ply={x:W/2,y:H/2},debug=false;
function drawBase(g,t,night){if(!ready)return false;bakesThisFrame=0;const v=viewRect(g);
  if(v.sc<.2){if(minimap)g.drawImage(minimap,0,0,W,H);return true;}
  const i0=Math.max(0,Math.floor(v.x0/CH)),i1=Math.min(Math.ceil(W/CH)-1,Math.floor(v.x1/CH)),j0=Math.max(0,Math.floor(v.y0/CH)),j1=Math.min(Math.ceil(H/CH)-1,Math.floor(v.y1/CH));
  const cx=(v.x0+v.x1)/2,cy=(v.y0+v.y1)/2,list=[];for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)list.push([i,j,(i*CH+CH/2-cx)**2+(j*CH+CH/2-cy)**2]);list.sort((a,b)=>a[2]-b[2]);
  /* the plain ground pattern only fills the tiles whose baked chunk is not ready yet (painting the whole screen twice was the biggest cost) */
  for(const [i,j] of list)if(!chunks.has(i+','+j)){g.fillStyle=pat(g,GROUND);g.fillRect(i*CH,j*CH,Math.min(CH,W-i*CH),Math.min(CH,H-j*CH));}
  /* each chunk is drawn 1 px larger so the next one overlaps it: no hairline gaps at fractional zoom */
  {const sq=g.imageSmoothingQuality;g.imageSmoothingQuality='low';   /* big ground tiles drawn near their own size: plain bilinear (the 'high' filter cost a lot on every frame and looks the same here) */
  for(const [i,j] of list){const c=chunk(i,j);if(!c)continue;const cw=Math.min(CH,W-i*CH),chh=Math.min(CH,H-j*CH),ex=cw===CH?1:0,ey=chh===CH?1:0;g.drawImage(c,0,0,cw,chh,i*CH,j*CH,cw+ex,chh+ey);}
  g.imageSmoothingQuality=sq;}
  /* nothing missing on screen: bake one chunk just outside the view so walking finds it ready */
  if(!bakesThisFrame){const pi0=Math.max(0,i0-1),pi1=Math.min(Math.ceil(W/CH)-1,i1+1),pj0=Math.max(0,j0-1),pj1=Math.min(Math.ceil(H/CH)-1,j1+1);
    outer:for(let j=pj0;j<=pj1;j++)for(let i=pi0;i<=pi1;i++)if(!chunks.has(i+','+j)){chunk(i,j);break outer;}}
  /* moving water: the sea texture drifts slowly over itself */

  if(LIFE){const dtw=Math.min(.05,Math.max(0,(t-lastW)/1000));lastW=t;lifeKit().waterFx(g,t,dtw,v);}
  drawWarps(g,t);
  for(let j=j0;j<=j1+1;j++)for(let i=i0;i<=i1;i++){const b=grassB.get(i+','+j);if(!b)continue;for(const o of b){if(o.x<v.x0-40||o.x>v.x1+40||o.y<v.y0-10||o.y>v.y1+60)continue;if(!o.hit&&Math.abs(ply.x-o.x)<18&&Math.abs(ply.y-o.y)<14)o.hit=t;drawObj(g,o,t);}}
  return true;}
function drawSorted(g,t,night,items,cam){if(!ready)return false;const v=viewRect(g),all=items.slice();
  const i0=Math.floor((v.x0-300)/CH),i1=Math.floor((v.x1+300)/CH),j0=Math.floor((v.y0-50)/CH),j1=Math.floor((v.y1+700)/CH);
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const b=buckets.get(i+','+j);if(!b)continue;for(const o of b){if(o.x+o.w<v.x0||o.x-o.w>v.x1||o.y-o.h>v.y1||o.y+20<v.y0)continue;if(o.sway>.8&&!o.hit&&Math.abs(ply.x-o.x)<o.w*.4&&Math.abs(ply.y-o.y)<22)o.hit=t;all.push({depth:o.y,draw:()=>drawObj(g,o,t)});}}
  /* grass in front of a character's feet is drawn again after the character, so feet sink into the grass instead of floating on it */
  for(const it of items){if(it.x==null)continue;const d=it.depth,ci=Math.floor(it.x/CH),cj=Math.floor(d/CH);for(let j=cj;j<=cj+1;j++)for(let i=ci-1;i<=ci+1;i++){const b=grassB.get(i+','+j);if(!b)continue;
      for(const o of b)if(Math.abs(o.x-it.x)<30&&o.y>d-2&&o.y<d+22)all.push({depth:o.y+.01,draw:()=>drawObj(g,o,t)});}}
  all.sort((a,b)=>a.depth-b.depth);for(const it of all)it.draw();
  if(debug){g.save();g.fillStyle='rgba(220,40,40,.28)';for(let j=Math.max(0,(v.y0/CELL)|0);j<Math.min(ROWS,(v.y1/CELL)+1);j++)for(let i=Math.max(0,(v.x0/CELL)|0);i<Math.min(COLS,(v.x1/CELL)+1);i++)if(grid[j*COLS+i])g.fillRect(i*CELL,j*CELL,CELL,CELL);g.restore();}
  return true;}
let lastP=0;function foreground(g,t,night){if(!ready)return;const dt=Math.min(.05,Math.max(0,(t-lastP)/1000));lastP=t;warpFx(g,t);treePuffs(g,t,dt);if(LIFE)lifeKit().life(g,t,dt,night);atmosphere(g,t,night);}
let LIFE=true,lastW=0;
return {W,H,get ready(){return ready},get failed(){return failed},get loadP(){return NAMES.length?loaded/NAMES.length:1},nav:{nearest,blocked},cfg,
  setPlayer(x,y){ply.x=x;ply.y=y},update(){},drawBase,drawSorted,foreground,clear,route,blocked,set debug(v){debug=v},
  /* 2026-11-21 memory: called when the player leaves this map — the painted ground (up to 90 MB a map) and the scratch canvases are given back;
     the layout stays, so coming back only repaints the ground around the player */
  release(){const z=c=>{try{c.width=c.height=0;}catch(e){}};for(const c of chunks.values())z(c);chunks.clear();for(const k in PADC){z(PADC[k].c);delete PADC[k];}if(bakeOut){z(bakeOut);bakeOut=null;}
    for(const c of silCache.values())z(c);silCache.clear();for(const c of shCache.values())z(c);shCache.clear();if(LLc){z(LLc);LLc=null;}},
  get spawn(){return {start:spawnPt}},isReachable:(x,y)=>!!reach&&reach[((y/CELL)|0)*COLS+((x/CELL)|0)]===1,get spawns(){return spawns},get spawnGroup(){return cfg.spawnGroup||null},get sun(){return LIT?SUN:null},get warps(){return warps},get _objs(){return objs},get _trails(){return trails},_bake:(i,j)=>bake(i,j),CH,set life(v){LIFE=!!v},
  _audit(){const out=[],T=o=>CAT[o.n]||{},isW=o=>T(o).t==='water',town=/stall|Stall|bench|Bench|^azCart|cargoCart|notice|Notice|sign|Sign|lamp|lantern|Lantern|banner|Banner|planter|Planter|well$|fountain|Fountain|loom|Loom|dummy|target/;
    const land=new Set();for(const o of objs)if(o.land)land.add(o);
    for(const o of objs){const nm=o.n,inW=water(o.x,o.y,0)||inCanal(o.x,o.y);
      if(!isW(o)&&inW&&!/dock|Dock|Mangrove|Reeds|Heron|bridge|Stakes|Drift|floe|islet|iceberg|plank|wave|seal/i.test(nm))out.push(['onWater',nm,o.x|0,o.y|0]);
      if(!o.land&&inPave(o.x,o.y,-8))out.push(['onRoad',nm,o.x|0,o.y|0]);
      if(WALLS&&wallAt(o.x,o.y-4))out.push(['inWall',nm,o.x|0,o.y|0]);
      if(!o.land&&town.test(nm)&&MOOD!=='town'&&!cfg.townish)out.push(['townPropInWild',nm,o.x|0,o.y|0]);}
    for(const o of seaObjs){if(!water(o.x,o.y,0))out.push(['waterPropOnLand',o.n,o.x|0,o.y|0]);}
    /* overlaps: footprints (an ellipse at the foot) of solid things */
    const inner=o=>edgeDist(o.x,o.y)>edgeBand(o.x,o.y)+40;const S=objs.filter(o=>!o.tree&&inner(o)&&(o.big||o.land||T(o).t==='prop'));
    for(let a=0;a<S.length;a++)for(let b=a+1;b<S.length;b++){const A=S[a],B=S[b];const dx=Math.abs(A.x-B.x),dy=Math.abs(A.y-B.y);if(dx<(A.w+B.w)*.36&&dy<26+(A.big||B.big?20:0))out.push(['overlap',A.n,B.n,A.x|0,A.y|0,B.x|0,B.y|0]);}
    /* trees standing on a building's footprint or right in front of its door */
    const Bg=objs.filter(o=>inner(o)&&(o.big||(o.land&&o.w>150)));for(const t of objs){if(!t.tree||!inner(t))continue;for(const b of Bg){if(Math.abs(t.x-b.x)<b.w*.42&&t.y>b.y-b.h*.35&&t.y<b.y+50)out.push(['treeOnBuilding',t.n,b.n,t.x|0,t.y|0]);}}
    for(const w of warps)for(const o of objs)if(!o.tree&&Math.hypot(o.x-w.x,o.y-w.y)<70)out.push(['onWarp',o.n,w.id]);
    return out;},_pockets(){let f=0,r=0;for(let i=0;i<N;i++)if(!grid[i]){f++;if(reach[i])r++;}return [f,r];},get _objs(){return objs.concat(decals,seaObjs)},
  get charFilter(){return CHARF},
  /* is a character at map point (x,y) actually hidden behind a tall object (a house, a tree) standing in front of it? */
  occluded(x,y,hgt){hgt=hgt||60;const ci=Math.floor(x/CH),cj=Math.floor(y/CH);for(let j=cj;j<=cj+2;j++)for(let i=ci-1;i<=ci+1;i++){const b=buckets.get(i+','+j);if(!b)continue;
      for(const o of b){if(!o.cast||o.h<70||o.y<=y+4)continue;const top=o.y-o.h*o.ay;if(Math.abs(x-o.x)<o.w*.42&&y-hgt*.5>top)return true;}}return false;},
  /* what the ground is at a point, for footstep dust: a colour stem, or null where nothing should puff up (grass, water) */
  surface(x,y){if(water(x,y,0)||inCanal(x,y))return null;for(const L of cfg.lawns||[])if(x>L.r[0]&&x<L.r[2]&&y>L.r[1]&&y<L.r[3])return null;   /* no stone dust on a lawn */
    if(inRP(x,y)||inPave(x,y,0))return SNOWY?'240,244,255':'200,190,170';
    if(/snow|Tundra|Glacier|SeaIce/.test(GROUND))return '242,246,255';if(/Sand|egCity|Beach|Dirt|Soil|Mud|Volcanic|Cave|Floor|Rift|Cracked|Necro|Tomb/.test(GROUND))return CAVE?'150,140,150':'200,175,140';return null;},
  warpAt(p){for(const w of warps)if(Math.hypot(p.x-w.x,(p.y-w.y)*1.4)<46)return w;return null;},
  warpById(id){return warps.find(w=>w.id===id)||null;},
  randomSpawn(px,py,minD=700){const s=spawns.filter(p=>Math.hypot(p.x-px,p.y-py)>minD);const p=(s.length?s:spawns)[Math.floor(Math.random()*(s.length||spawns.length))];return p?{x:p.x+(Math.random()-.5)*120,y:p.y+(Math.random()-.5)*120}:null;},
  exitHit(){return false;}};
};
})();
