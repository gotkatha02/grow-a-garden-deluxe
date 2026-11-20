/* =====================================================================
   AETHERFALL — "ป่าสนหิมะใหญ่" (Great Snow-Pine Forest)
   A large field map assembled at load time from separate painted pieces
   (maps/snowpine/*.webp): tiling snow + dirt textures, 9 trees, 16 props, 4 landmarks.

   Map units = map pixels (MS 1.0 in MAPDEF, so map px == world px on x, world y = map y / K).
   Host interface is the same as the forest host: drawBase / drawSorted / foreground,
   blocked / clear / route / nearest, spawn, exitHit, update, setPlayer.

   Everything is laid out from a fixed seed, so the map is identical on every load.
   Tune the layout in LAYOUT below; tune sizes in ART.
   ===================================================================== */
(function(){'use strict';
window.createSnowPineHost=function(base){
const F=2/3,W=4800,H=3600,CH=512,CELL=12,COLS=Math.ceil(W/CELL),ROWS=Math.ceil(H/CELL);

/* ---------- art: file, draw scale, anchor (foot point in the image, 0..1), collision ---------- */
const ART={
  pineA:{s:0.533,a:[.5,.975],r:.085},pineB:{s:0.533,a:[.5,.975],r:.085},pineC:{s:0.533,a:[.5,.975],r:.085},pineD:{s:0.533,a:[.5,.975],r:.08},
  pineS:{s:0.533,a:[.5,.97],r:.07},pineXS:{s:0.533,a:[.5,.97],r:.06},deadPine:{s:0.533,a:[.5,.975],r:.07},twinPine:{s:0.533,a:[.45,.975],r:.1},bareTree:{s:0.533,a:[.5,.975],r:.06},
  rockL:{s:0.341,a:[.5,.86],r:.36},boulder:{s:0.341,a:[.5,.86],r:.36},rockS:{s:0.31,a:[.5,.8]},rockM:{s:0.341,a:[.5,.84],r:.34},
  berryS:{s:0.341,a:[.5,.95],r:.18},berryL:{s:0.341,a:[.5,.95],r:.18},bush:{s:0.341,a:[.5,.86],r:.3},log:{s:0.341,a:[.5,.8],log:1},stump:{s:0.341,a:[.5,.82],r:.28},
  grassS:{s:0.279,a:[.5,.95]},grassL:{s:0.26,a:[.5,.95]},cones:{s:0.26,a:[.5,.9]},mound:{s:0.31,a:[.5,.8]},puddle:{s:0.31,a:[.5,.6]},branch:{s:0.26,a:[.5,.7]},shrooms:{s:0.236,a:[.5,.92]},
  pond:{s:0.589,a:[.5,.55]},camp:{s:0.558,a:[.5,.72]},shrine:{s:0.558,a:[.5,.86]},bridge:{s:0.589,a:[.456,.51]},
  snow:{},dirt:{}};
const SPX={tex:new Image(),bk:[],pat:new WeakMap()};const spxRe=()=>{try{chunks.clear();}catch(e){}};SPX.tex.onload=spxRe;SPX.tex.src=base+'texStream.webp';for(let i=0;i<8;i++){const im=new Image();im.onload=spxRe;im.src=base+'bkS'+i+'.webp';SPX.bk.push(im);}
const IMG={};let loaded=0,ready=false,failed=false;const NAMES=Object.keys(ART);

/* warps to the neighbouring Viking maps (ids match maps/viking-maps.js) */
/* level text comes from maps/level-zones.js (MAP_ZONE) when the label is read */
const zl=(name,id,fb)=>({get label(){const z=window.MAP_ZONE&&MAP_ZONE[id];return name+' Lv '+(z?z[0]+'–'+z[1]:fb);}});
const warps=[{id:'toT',x:4330,y:560,to:'frostheim',at:'toF1',label:'ฟรอสต์เฮล์ม'},Object.assign(zl('หมู่บ้านไวกิ้งร้าง','vikF5','18–26'),{id:'toF5',x:420,y:3420,to:'vikF5',at:'toF1'}),Object.assign(zl('ทุ่งหินรูน','vikF3','10–18'),{id:'toF3',x:1300,y:560,to:'vikF3',at:'toF1'})];
for(const n of NAMES){const im=new Image();im.onload=()=>{if(++loaded===NAMES.length)build();};im.onerror=()=>{failed=true;};im.src=base+n+'.webp';IMG[n]=im;}

/* ---------- deterministic helpers ---------- */
let seed=0x5eed1234;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const R=(a,b)=>a+(b-a)*rnd(),pick=a=>a[Math.floor(rnd()*a.length)];
function hash(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296;}
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
const fbm=(x,y)=>vnoise(x,y)*.65+vnoise(x*2.1+7,y*2.1+3)*.35;
function spline(pts,step){const out=[];for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
    const L=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]),n=Math.max(2,Math.ceil(L/step));
    for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;out.push([.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
      .5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)]);}}
  out.push(pts[pts.length-1].slice());
  for(let i=0;i<out.length;i++){const a=out[Math.max(0,i-1)],b=out[Math.min(out.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;out[i].push(-dy/l,dx/l);}return out;}
function segDist(px,py,pts){let best=1e9,bi=0;for(let i=0;i<pts.length;i+=2){const d=(pts[i][0]-px)**2+(pts[i][1]-py)**2;if(d<best){best=d;bi=i;}}return [Math.sqrt(best),bi];}

/* ---------- LAYOUT (map px) ---------- */
const B=[2650*F,3950*F];                       // bridge crossing: path runs (1,-.59) through it, the stream (1,.57)
const PD=[1,-.59],SD=[1,.57];const nd=v=>{const l=Math.hypot(v[0],v[1]);return [v[0]/l,v[1]/l];};const pd=nd(PD),sd=nd(SD);
const f=(x,y)=>[x*F,y*F],near=(dir,d,sg)=>[B[0]+sg*dir[0]*d*F,B[1]+sg*dir[1]*d*F];
const LAYOUT={
  spawn:f(1000,4600),
  path:[f(420,5400),f(640,5080),f(1000,4600),f(1400,4420),f(1950,4300),near(pd,330,-1),B,near(pd,330,1),f(3450,3330),f(3950,3080),f(4450,2980),f(5000,2560),f(5550,1960),f(6150,1300),f(6560,760)],
  branches:[
    [f(3950,3080),f(3700,2650),f(3150,2200),f(2650,1780),f(2250,1560)],          // to the runestone shrine
    [f(5000,2560),f(5450,2980),f(5800,3400),f(6050,3760)],                      // to the hunters' camp
    [f(1400,4420),f(1250,3900),f(1150,3350),f(1300,3050)]],                     // up to the frozen pond
  stream:[f(1500,2730),f(1800,3250),f(2150,3600),near(sd,300,-1),B,near(sd,300,1),f(3300,4500),f(3420,4950),f(3460,5400)],
  clearings:[[1000,4600,430],[1950,4300,520],[1500,2650,620],[2250,1500,520],[4300,3000,640],[6050,3780,560],[5550,1960,600],[6450,820,380],[3200,4700,380],[4700,4300,520],[5300,900,420],[900,1300,520]].map(c=>[c[0]*F,c[1]*F,c[2]*F*1.15]),
  pond:f(1500,2620),camp:f(6060,3760),shrine:f(2250,1430)};

/* ---------- built data ---------- */
const patC=new WeakMap();function pats(q){let p=patC.get(q);if(!p){p={snow:q.createPattern(IMG.snow,'repeat'),dirt:q.createPattern(IMG.dirt,'repeat')};patC.set(q,p);}return p;}
const grassB=new Map();let dirt=[],drifts=[],prints=[],path=[],branches=[],stream=[],lips=[],banks=[],cracks=[],tints=[],objs=[],decals=[],ground=[],spawns=[];
const grid=new Uint8Array(COLS*ROWS);const buckets=new Map();const chunks=new Map();let minimap=null,snowPat=null,dirtPat=null;
const edgeBand=(x,y)=>270+fbm(x/500,y/500)*130;
function edgeDist(x,y){return Math.min(x,y,W-x,H-y);}
function nearPath(x,y,m){for(const P of [path,...branches]){const [d,i]=segDist(x,y,P);if(d<P[i][4]/2+m)return true;}return false;}
function nearStream(x,y,m){const [d]=segDist(x,y,stream);return d<44+m;}
function inClearing(x,y,pad){for(const c of LAYOUT.clearings)if(Math.hypot(x-c[0],y-c[1])<c[2]+pad)return c;return null;}
function inLandmark(x,y,pad){for(const g of ground){if(Math.abs(x-g.x)<g.w*.5+pad&&y>g.y-g.h*.5-pad&&y<g.y+g.h*.5+pad*2.2)return true;}for(const o of objs)if(o.land&&Math.hypot(x-o.x,y-o.y)<o.w*.45+pad)return true;return false;}

/* natural trails: the spline wanders (two noise octaves), width swells and pinches, stretches get buried under drifts.
   Displacement fades out at the bridge and at the trail's first points so joins stay exact. */
function wander(s,amp,sd,fix){for(let i=0;i<s.length;i++){const p=s[i];let k=Math.min(1,i/25);for(const f of fix)k=Math.min(k,Math.max(0,(Math.hypot(p[0]-f[0],p[1]-f[1])-110)/240));
    const d=((vnoise(i*.011+sd,3.1)-.5)*amp+(vnoise(i*.05+sd,7.7)-.5)*amp*.22)*k;p[0]+=p[2]*d;p[1]+=p[3]*d;}
  for(let i=0;i<s.length;i++){const a=s[Math.max(0,i-1)],b=s[Math.min(s.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;s[i][2]=-dy/l;s[i][3]=dx/l;}return s;}
/* RO-style fields: worn dirt only where people gather (entrance, bridge, crossroads, landmarks);
   between them the trail is snowed over and only a line of footprints remains. */
function mkPath(pts,w0,sd,coverT,anchors){const s=wander(spline(pts,10),150,sd,[B]);
  s.forEach((p,i)=>{const nb=Math.hypot(p[0]-B[0],p[1]-B[1])<260;const w=Math.max(40,Math.min(w0*1.4,w0*(.55+.85*vnoise(i*.017+sd,11.3))));
    let near=0;for(const a of anchors){const d=Math.hypot(p[0]-a[0],p[1]-a[1]);near=Math.max(near,1-(d-a[2])/240);}near=Math.max(0,Math.min(1,near));
    const patchy=Math.max(0,Math.min(1,(vnoise(i*.03+sd,23.9)-coverT)/.2));const c=nb?0:Math.max(patchy,1-near);p.push(nb?Math.max(w,96):w,c);});return s;}
function build(){try{
  
  const AN=[[...LAYOUT.path[0],330],[...LAYOUT.path[LAYOUT.path.length-1],200],[...B,300],[...LAYOUT.spawn,260],...LAYOUT.branches.map(b=>[...b[0],140]),...LAYOUT.branches.map(b=>[...b[b.length-1],200])];
  path=mkPath(LAYOUT.path,104,0,.8,AN);
  branches=LAYOUT.branches.map((b,bi)=>{const st=b[0];let best=path[0],bd=1e9;for(const p of path){const d=Math.hypot(p[0]-st[0],p[1]-st[1]);if(d<bd){bd=d;best=p;}}return mkPath([[best[0],best[1]],...b.slice(1)],74,40+bi*17,.74,[...AN,[best[0],best[1],140]]);});
  stream=wander(spline(LAYOUT.stream,10),110,90,[B]);stream.forEach((p,i)=>{const nb=Math.hypot(p[0]-B[0],p[1]-B[1])<230;p.push(nb?86:Math.max(56,Math.min(112,84*(.65+.7*vnoise(i*.02,9.1)))));});
  /* dirt = union of jittered discs (ragged natural edge); drifts = snow tongues lying across the trail; prints = footprints where it is snowed over */
  for(const P of [path,...branches])for(let i=0;i<P.length;i++){const p=P[i],w=p[4],c=p[5];
    if(c<.85){const n=c<.15?2:rnd()<.6?1:0;for(let k=0;k<n;k++){const o=R(-.3,.3)*w*(1-c*.6);dirt.push([p[0]+p[2]*o+R(-5,5),p[1]+p[3]*o+R(-5,5),w*R(.32,.5)*(1-c*.85)]);}}
    if(c<.2&&rnd()<.006){const o=(rnd()<.5?-1:1)*R(.3,.5)*w,x=p[0]+p[2]*o,y=p[1]+p[3]*o,L=R(18,34)+c*20,a=Math.atan2(p[3],p[2])+Math.PI/2;for(let k=0;k<3;k++)drifts.push([x+Math.cos(a)*(k-1)*L*.55+R(-4,4),y+Math.sin(a)*(k-1)*L*.55+R(-3,3),L*R(.45,.7),R(5,9)+c*5,a+R(-.3,.3)]);}
    if(i%2===0){const sd=(i/2)%2?1:-1,off=(vnoise(i*.02+7,3)-.5)*w*.5;prints.push([p[0]+p[2]*(sd*7+off),p[1]+p[3]*(sd*7+off),Math.atan2(p[3],p[2])+Math.PI/2]);}
    if(c>.6&&rnd()<.04){const o=R(-.3,.3)*w;dirt.push([p[0]+p[2]*o,p[1]+p[3]*o,R(5,10)]);}}
  for(let i=0;i<stream.length;i++){const p=stream[i];if(Math.hypot(p[0]-B[0],p[1]-B[1])<200)continue;if(rnd()<.06)drifts.push([p[0]+p[2]*R(-25,25),p[1]+p[3]*R(-25,25),R(16,34),R(9,16),R(-.5,.5),1]);}
  /* snow lips along both path edges (scalloped snow rim over the dirt) */
  for(const P of [path,...branches])for(let i=0;i<P.length;i+=1){const p=P[i];if(p[5]>.5||rnd()<.86)continue;for(const sd of [-1,1]){if(rnd()<.45)continue;const o=p[4]*R(.4,.52);const n=rnd()<.4?3:1;for(let k=0;k<n;k++)lips.push([p[0]+p[2]*o*sd+p[3]*k*9,p[1]+p[3]*o*sd-p[2]*k*9,R(5,10),R(3,5.5)]);}}
  for(let i=0;i<stream.length;i++){const p=stream[i];if(Math.hypot(p[0]-B[0],p[1]-B[1])<150)continue;for(const sd of [-1,1]){if(rnd()<.35)continue;const o=p[4]*R(.42,.56);const big=rnd()<.2;banks.push([p[0]+p[2]*o*sd,p[1]+p[3]*o*sd,big?R(13,22):R(6,12),big?R(8,12):R(4,8)]);}}
  for(let i=0;i<stream.length-6;i+=3){if(rnd()<.55)continue;const p=stream[i];let x=p[0]+p[2]*R(-24,24),y=p[1]+p[3]*R(-24,24);const c=[[x,y]];for(let k=0;k<3;k++){x+=R(6,18)*(rnd()<.5?1:-1);y+=R(6,15);c.push([x,y]);}cracks.push(c);}
  for(let i=0;i<150;i++)tints.push([R(0,W),R(0,H),R(260,700),rnd()<.55?'255,236,220':'176,180,226',R(.07,.14)]);
  /* landmarks */
  const L=(n,x,y,o={})=>{const A=ART[n],im=IMG[n],w=im.naturalWidth*A.s,h=im.naturalHeight*A.s;return Object.assign({n,x,y,w,h,img:im,ax:A.a[0],ay:A.a[1]},o);};
  ground.push(L('pond',LAYOUT.pond[0],LAYOUT.pond[1]));ground.push(L('bridge',B[0],B[1]));
  objs.push(L('camp',LAYOUT.camp[0],LAYOUT.camp[1],{land:1,cast:1,smolder:.09}));objs.push(L('shrine',LAYOUT.shrine[0],LAYOUT.shrine[1],{land:1,cast:1}));
  for(const g of ground){g.x0=g.x-g.ax*g.w;g.y0=g.y-g.ay*g.h;}
  /* trees: jittered grid + density field (thick border, groves, open meadows), min spacing */
  const occ=new Map(),key=(x,y)=>((x/64)|0)+','+((y/64)|0);
  const far=(x,y,d)=>{const cx=(x/64)|0,cy=(y/64)|0;for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){const a=occ.get((cx+i)+','+(cy+j));if(a)for(const o of a)if(Math.hypot(o.x-x,o.y-y)<d)return false;}return true;};
  const put=(o)=>{const k=key(o.x,o.y);(occ.get(k)||occ.set(k,[]).get(k)).push(o);objs.push(o);};
  const add=(n,x,y,o={})=>{const A=ART[n],im=IMG[n],v=o.v||1,w=im.naturalWidth*A.s*v,h=im.naturalHeight*A.s*v;const ob=Object.assign({n,x,y,w,h,img:im,ax:A.a[0],ay:A.a[1],cast:1,flip:rnd()<.5&&!o.noflip},o);
    ob.ph=rnd()*6.28;ob.sway=/^pine|twin/.test(n)?.55:n==='deadPine'?.25:n==='bareTree'?.4:/berry|bush/.test(n)?1.1:0;
    if(A.r)ob.solid=[[x,y-2,A.r*w]];if(A.log)ob.solid=[[x-w*.22,y-h*.08,w*.13],[x+w*.2,y-h*.12,w*.13]];return ob;};
  for(let gy=40;gy<H;gy+=44)for(let gx=40;gx<W;gx+=44){const x=gx+R(-19,19),y=gy+R(-19,19);if(x<20||y<20||x>W-20||y>H-20)continue;
    const de=edgeDist(x,y),band=edgeBand(x,y),n=fbm(x/760,y/760);let D,sp;
    if(de<band){D=1;sp=58;}else if(n>.508){D=1;sp=54;}else{D=.018;sp=150;}
    if(de>=band-40){if(nearPath(x,y,40)||nearStream(x,y,40))continue;const c=inClearing(x,y,0);if(c)continue;if(n<=.508&&inClearing(x,y,150))D*=.35;if(inLandmark(x,y,60))continue;}
    else if(nearPath(x,y,28))continue;
    if(rnd()>D||!far(x,y,sp))continue;
    const deep=de<band*.6||n>.68,r=rnd();let t;
    if(deep)t=r<.1?'twinPine':r<.4?'pineA':r<.7?'pineB':'pineC';else t=r<.06?'deadPine':r<.12?'bareTree':r<.3?'pineD':r<.45?'pineS':r<.52?'pineXS':r<.7?'pineA':r<.85?'pineB':'pineC';
    put(add(t,x,y,{v:R(.9,1.12),tree:1}));}
  /* saplings and props on grove edges and in the open */
  const propsOpen=['rockM','rockL','boulder','berryS','berryL','bush','stump','log'];
  for(let gy=70;gy<H;gy+=104)for(let gx=70;gx<W;gx+=104){const x=gx+R(-42,42),y=gy+R(-42,42),de=edgeDist(x,y);if(de<edgeBand(x,y)-20)continue;
    if(nearPath(x,y,22)||nearStream(x,y,28)||inLandmark(x,y,50))continue;const n=fbm(x/760,y/760),edge=n>.4&&n<.56,c=inClearing(x,y,0);
    if(rnd()>(edge?.26:c?.03:.05)||!far(x,y,edge?66:120))continue;const t=edge&&rnd()<.35?pick(['pineS','pineXS','pineD']):pick(propsOpen);put(add(t,x,y,{v:R(.85,1.15),tree:t.startsWith('pine')}));}
  /* rocks along the stream banks */
  for(let i=8;i<stream.length-4;i+=6){if(rnd()<.45)continue;const p=stream[i];if(Math.hypot(p[0]-B[0],p[1]-B[1])<190)continue;const sd=rnd()<.5?-1:1,o=p[4]/2+R(14,34),x=p[0]+p[2]*o*sd,y=p[1]+p[3]*o*sd;
    if(nearPath(x,y,20))continue;if(rnd()<.6)decals.push(add('rockS',x,y,{v:R(.7,1.1),cast:0}));else if(far(x,y,50))put(add(pick(['rockM','bush']),x,y,{v:R(.7,.9)}));}
  /* flat ground details (baked into the ground) */
  for(let gy=30;gy<H;gy+=60)for(let gx=30;gx<W;gx+=60){const x=gx+R(-26,26),y=gy+R(-26,26),de=edgeDist(x,y);if(de<edgeBand(x,y)-140)continue;
    if(nearStream(x,y,18)||inLandmark(x,y,20))continue;const onP=nearPath(x,y,-10);if(onP)continue;const n=fbm(x/760,y/760);
    if(rnd()>(n>.5?.2:.1))continue;const r=rnd();
    const t=n>.55?(r<.25?'cones':r<.33?'shrooms':r<.45?'branch':r<.8?'grassS':'rockS'):(r<.4?'grassS':r<.6?'grassL':r<.8?'mound':r<.88?'rockS':r<.92?'puddle':r<.97?'branch':'cones');
    const dd=add(t,x,y,{v:R(.75,1.1),cast:0});if(t==='grassS'||t==='grassL'){dd.sway=1.6;dd.ph=rnd()*6.28;const k=((x/CH)|0)+','+((y/CH)|0);(grassB.get(k)||grassB.set(k,[]).get(k)).push(dd);}else decals.push(dd);}
  decals.sort((a,b)=>a.y-b.y);
  /* buckets for fast culling */
  for(const o of objs){const k=((o.x/CH)|0)+','+((o.y/CH)|0);(buckets.get(k)||buckets.set(k,[]).get(k)).push(o);}
  buildGrid();
  /* no sealed pockets (same rule as the other field maps): join every open area to the main one with a gap through the trees */
  {const N=COLS*ROWS,reach=new Uint8Array(N);const flood=()=>{reach.fill(0);const sp=LAYOUT.spawn,s0=((sp[1]/CELL)|0)*COLS+((sp[0]/CELL)|0),q=[s0];reach[s0]=1;
      for(let k=0;k<q.length;k++){const i=q[k],x=i%COLS,y=(i/COLS)|0;for(const j of [x>0?i-1:-1,x<COLS-1?i+1:-1,y>0?i-COLS:-1,y<ROWS-1?i+COLS:-1])if(j>=0&&!grid[j]&&!reach[j]){reach[j]=1;q.push(j);}}};
    const open0=(x,y,r)=>{const c0=Math.max(0,((x-r)/CELL)|0),c1=Math.min(COLS-1,((x+r)/CELL)|0),r0=Math.max(0,((y-r)/CELL)|0),r1=Math.min(ROWS-1,((y+r)/CELL)|0);for(let j=r0;j<=r1;j++)for(let i=c0;i<=c1;i++){const cx=i*CELL+6,cy=j*CELL+6;if((cx-x)**2+(cy-y)**2<=r*r)grid[j*COLS+i]=0;}};
    for(let pass=0;pass<6;pass++){flood();const lab=new Int32Array(N).fill(-1),regs=[];
      for(let s0=0;s0<N;s0++){if(grid[s0]||reach[s0]||lab[s0]>=0)continue;const q=[s0];lab[s0]=regs.length;for(let k=0;k<q.length;k++){const i=q[k],x=i%COLS,y=(i/COLS)|0;for(const j of [x>0?i-1:-1,x<COLS-1?i+1:-1,y>0?i-COLS:-1,y<ROWS-1?i+COLS:-1])if(j>=0&&!grid[j]&&!reach[j]&&lab[j]<0){lab[j]=regs.length;q.push(j);}}regs.push(q);}
      if(!regs.length)break;let carved=false;
      for(const q of regs){if(q.length<70){for(const i of q)grid[i]=1;continue;}let sx=0,sy=0;for(const i of q){sx+=i%COLS;sy+=(i/COLS)|0;}sx/=q.length;sy/=q.length;let c=q[0],cd=1e9;for(const i of q){const d=(i%COLS-sx)**2+(((i/COLS)|0)-sy)**2;if(d<cd){cd=d;c=i;}}
        const cx=c%COLS,cy=(c/COLS)|0;let best=-1,bd=1e18;for(let i=0;i<N;i++)if(reach[i]){const d=(i%COLS-cx)**2+(((i/COLS)|0)-cy)**2;if(d<bd){bd=d;best=i;}}if(best<0)continue;
        const ax=cx*CELL+6,ay=cy*CELL+6,bx=(best%COLS)*CELL+6,by=((best/COLS)|0)*CELL+6,L=Math.hypot(bx-ax,by-ay)||1,n=Math.ceil(L/10);
        const segD=(x,y)=>{const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(L*L)));return Math.hypot(x-ax-dx*t,y-ay-dy*t);};
        for(let k=0;k<=n;k++){const t=k/n,wob=(vnoise(k*.08,cx*.1)-.5)*40;open0(ax+(bx-ax)*t+(ay-by)/L*wob,ay+(by-ay)*t+(bx-ax)/L*wob,42);}
        for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(!o.land&&segD(o.x,o.y)<70)objs.splice(i,1);}carved=true;}
      if(!carved)break;for(const o of objs)if(o.solid)for(const s2 of o.solid)stamp(s2[0],s2[1],s2[2]);}
    buckets.clear();for(const o of objs){const k=((o.x/CH)|0)+','+((o.y/CH)|0);(buckets.get(k)||buckets.set(k,[]).get(k)).push(o);}}
  /* monster spawn points: open snow away from the entrance, not on the path */
  for(let i=0;i<6000&&spawns.length<60;i++){const x=R(350,W-350),y=R(300,H-300);if(blocked(x,y)||nearPath(x,y,20)||Math.hypot(x-LAYOUT.spawn[0],y-LAYOUT.spawn[1])<600)continue;if(spawns.some(s=>Math.hypot(s.x-x,s.y-y)<240))continue;spawns.push({x,y});}
  for(const w of warps){const n=nearest({x:w.x,y:w.y});if(n){w.x=n.x;w.y=n.y;}w.ph=rnd()*6.28;}
  makeMinimap();ready=true;}catch(e){console.error(e);failed=true;}}

/* ---------- collision grid ---------- */
function stamp(x,y,r){const c0=Math.max(0,((x-r)/CELL)|0),c1=Math.min(COLS-1,((x+r)/CELL)|0),r0=Math.max(0,((y-r)/CELL)|0),r1=Math.min(ROWS-1,((y+r)/CELL)|0);
  for(let j=r0;j<=r1;j++)for(let i=c0;i<=c1;i++){const cx=i*CELL+6,cy=j*CELL+6;if((cx-x)**2+(cy-y)**2<=r*r)grid[j*COLS+i]=1;}}
function onBridge(x,y){const dx=x-B[0],dy=y-B[1],u=dx*pd[0]+dy*pd[1],v=-dx*pd[1]+dy*pd[0];return Math.abs(u)<140&&Math.abs(v)<40;}
function buildGrid(){for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const x=i*CELL+6,y=j*CELL+6;if(edgeDist(x,y)<edgeBand(x,y)-22||(fbm(x/760,y/760)>.53&&!inClearing(x,y,0)&&!inLandmark(x,y,0)))grid[j*COLS+i]=1;}
  /* the path stays walkable where it runs through the forest border (entrance / far end) */
  for(const P of [path,...branches])for(const p of P){const r=p[4]/2+26,c0=Math.max(0,((p[0]-r)/CELL)|0),c1=Math.min(COLS-1,((p[0]+r)/CELL)|0),r0=Math.max(0,((p[1]-r)/CELL)|0),r1=Math.min(ROWS-1,((p[1]+r)/CELL)|0);
    for(let j=r0;j<=r1;j++)for(let i=c0;i<=c1;i++){const cx=i*CELL+6,cy=j*CELL+6;if((cx-p[0])**2+(cy-p[1])**2<=r*r)grid[j*COLS+i]=0;}}
  for(const p of stream)stamp(p[0],p[1],p[4]/2+4);
  {const pond=ground[0],rx=pond.w*.34,ry=pond.h*.3,cx=pond.x,cy=pond.y-pond.h*.06;for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const x=i*CELL+6,y=j*CELL+6;if(((x-cx)/rx)**2+((y-cy)/ry)**2<1)grid[j*COLS+i]=1;}}
  for(const o of objs)if(o.solid)for(const s of o.solid)stamp(s[0],s[1],s[2]);
  for(const o of objs)if(o.n==='camp'){stamp(o.x+o.w*.04,o.y-o.h*.18,o.w*.12);stamp(o.x-o.w*.02,o.y-o.h*.42,o.w*.1);}
  for(const o of objs)if(o.n==='shrine'){stamp(o.x,o.y-o.h*.22,o.w*.2);stamp(o.x-o.w*.27,o.y-o.h*.18,o.w*.08);stamp(o.x+o.w*.27,o.y-o.h*.18,o.w*.08);}
  for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){const x=i*CELL+6,y=j*CELL+6;if(onBridge(x,y))grid[j*COLS+i]=0;}
  const s=LAYOUT.spawn;for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++){const c=(((s[1]/CELL)|0)+j)*COLS+((s[0]/CELL)|0)+i;grid[c]=0;}}
function blocked(x,y){if(x<0||y<0||x>=W||y>=H)return true;return grid[((y/CELL)|0)*COLS+((x/CELL)|0)]===1;}
function clear(a,b){const dx=b.x-a.x,dy=b.y-a.y,n=Math.ceil(Math.hypot(dx,dy)/5);for(let i=0;i<=n;i++){const t=n?i/n:0;if(blocked(a.x+dx*t,a.y+dy*t))return false;}return true;}
function nearest(p){if(!blocked(p.x,p.y))return {x:p.x,y:p.y};for(let r=CELL;r<900;r+=CELL)for(let k=0;k<24;k++){const a=k/24*Math.PI*2,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;if(!blocked(x,y))return {x,y};}return null;}
/* A* on the 12px walk grid: typed-array binary heap, closed set, buffers reused between calls */
const N=COLS*ROWS,gS=new Float32Array(N),fS=new Float32Array(N),prev=new Int32Array(N),closed=new Uint8Array(N),stampA=new Uint32Array(N),hp=new Int32Array(N*2);let gen=0;
function astar(a,b){if(blocked(b.x,b.y)){const n=nearest(b);if(!n)return [];b=n;}if(clear(a,b))return [{x:b.x,y:b.y}];
  const s=((a.y/CELL)|0)*COLS+((a.x/CELL)|0),g=((b.y/CELL)|0)*COLS+((b.x/CELL)|0),gx=g%COLS,gy=(g/COLS)|0;gen++;let hn=0;
  const H=i=>{const dx=Math.abs(i%COLS-gx),dy=Math.abs(((i/COLS)|0)-gy);return 1.15*(dx+dy-.586*Math.min(dx,dy));};
  const seen=i=>stampA[i]===gen,touch=i=>{if(stampA[i]!==gen){stampA[i]=gen;gS[i]=1e30;closed[i]=0;prev[i]=-1;}};
  const push=i=>{let k=hn++;hp[k]=i;while(k>0){const p=(k-1)>>1;if(fS[hp[p]]<=fS[hp[k]])break;const t=hp[p];hp[p]=hp[k];hp[k]=t;k=p;}};
  const pop=()=>{const top=hp[0];hn--;if(hn>0){hp[0]=hp[hn];let k=0;for(;;){const l=2*k+1,r=l+1;let m=k;if(l<hn&&fS[hp[l]]<fS[hp[m]])m=l;if(r<hn&&fS[hp[r]]<fS[hp[m]])m=r;if(m===k)break;const t=hp[m];hp[m]=hp[k];hp[k]=t;k=m;}}return top;};
  touch(s);gS[s]=0;fS[s]=H(s);push(s);let found=false;
  while(hn>0&&hn<hp.length-8){const i=pop();if(closed[i])continue;closed[i]=1;if(i===g){found=true;break;}const x=i%COLS,y=(i/COLS)|0,gi=gS[i];
    for(let d=0;d<8;d++){const dx=d<4?(d===0?1:d===1?-1:0):(d&1?-1:1),dy=d<4?(d===2?1:d===3?-1:0):(d<6?1:-1),nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=COLS||ny>=ROWS)continue;
      const j=ny*COLS+nx;if(grid[j])continue;if(dx&&dy&&(grid[y*COLS+nx]||grid[ny*COLS+x]))continue;touch(j);if(closed[j])continue;const c=gi+(dx&&dy?1.414:1);
      if(c<gS[j]){gS[j]=c;prev[j]=i;fS[j]=c+H(j);push(j);}}}
  if(!found)return [];const raw=[];for(let i=g;i>=0&&i!==s;i=prev[i])raw.push({x:(i%COLS)*CELL+6,y:((i/COLS)|0)*CELL+6});raw.reverse();raw.push({x:b.x,y:b.y});
  const out=[];let from=a,i=0;while(i<raw.length){let j=i;while(j+1<raw.length&&clear(from,raw[j+1]))j++;out.push(raw[j]);from=raw[j];i=j+1;}return out;}
const route=astar;
/* ---------- ground chunks (baked lazily, LRU) ---------- */
/* trampled snow instead of dirt: a soft, slightly shaded track that fades in and out, with footprints */
function trample(q,Ps,inR){const vis=[];for(const P of Ps)for(let i=0;i<P.length;i+=2){const p=P[i];if(inR(p[0],p[1],p[4]))vis.push([p[0],p[1],p[4]*.4*(1-(p[5]||0)*.55)]);}if(!vis.length)return;
  q.save();q.filter='blur(7px)';q.fillStyle='rgba(118,108,178,.17)';q.beginPath();for(const d of vis){q.moveTo(d[0]+d[2],d[1]);q.arc(d[0],d[1],d[2],0,7);}q.fill();
  q.filter='blur(4px)';q.fillStyle='rgba(255,250,245,.22)';q.beginPath();for(const d of vis){q.moveTo(d[0]+d[2]*.5,d[1]-d[2]*.25);q.arc(d[0],d[1]-d[2]*.25,d[2]*.5,0,7);}q.fill();q.restore();}
let bakesThisFrame=0;
function lump(q,x,y,rx,ry,top,shade){q.fillStyle=shade;q.beginPath();q.ellipse(x,y+2.5,rx,ry,0,0,7);q.fill();q.fillStyle=top;q.beginPath();q.ellipse(x,y,rx,ry,0,0,7);q.fill();}
function bake(ci,cj){const c=document.createElement('canvas');c.width=c.height=CH;const q=c.getContext('2d'),x0=ci*CH,y0=cj*CH,x1=x0+CH,y1=y0+CH,inR=(x,y,m)=>x>x0-m&&x<x1+m&&y>y0-m&&y<y1+m;
  const pt=pats(q);q.translate(-x0,-y0);q.fillStyle=pt.snow;q.fillRect(x0,y0,CH,CH);
  for(const t of tints){if(!inR(t[0],t[1],t[2]))continue;const g=q.createRadialGradient(t[0],t[1],0,t[0],t[1],t[2]);g.addColorStop(0,`rgba(${t[3]},${t[4]})`);g.addColorStop(1,`rgba(${t[3]},0)`);q.fillStyle=g;q.fillRect(x0,y0,CH,CH);}
  trample(q,[path,...branches],inR);
  {const vis=[];if(vis.length){q.fillStyle='#8a5a40';q.beginPath();for(const d of vis){q.moveTo(d[0]+d[2]+2,d[1]+1.5);q.arc(d[0],d[1]+1.5,d[2]+2,0,7);}q.fill();
    q.fillStyle=pt.dirt;q.beginPath();for(const d of vis){q.moveTo(d[0]+d[2],d[1]);q.arc(d[0],d[1],d[2],0,7);}q.fill();}}
  for(const f of prints)if(inR(f[0],f[1],6)){q.fillStyle='rgba(140,132,196,.6)';q.beginPath();q.ellipse(f[0],f[1]+.8,3.4,2.1,f[2],0,7);q.fill();q.fillStyle='rgba(255,250,250,.7)';q.beginPath();q.ellipse(f[0]-.6,f[1]-1.2,2.6,1.2,f[2],0,7);q.fill();}
  {const vis=stream.filter(p=>inR(p[0],p[1],p[4]));if(vis.length){const jit=(p,k)=>{const h=hash((p[0]|0)+k,(p[1]|0)-k);return (h-.5)*p[4]*.22;};q.fillStyle='#4f7fae';q.beginPath();for(const p of vis){const j=jit(p,1);q.moveTo(p[0]+p[4]/2+3,p[1]+j);q.arc(p[0]+p[2]*j,p[1]+p[3]*j,p[4]/2+3,0,7);}q.fill();
    q.fillStyle=(SPX.tex.naturalWidth&&(SPX.pat.get(q)||SPX.pat.set(q,q.createPattern(SPX.tex,'repeat')).get(q)))||'#6cade0';q.beginPath();for(const p of vis){const j=jit(p,1);q.moveTo(p[0]+p[4]/2,p[1]+j);q.arc(p[0]+p[2]*j,p[1]+p[3]*j,p[4]/2,0,7);}q.fill();
    q.fillStyle='#8cc6ec';for(const p of []){q.beginPath();q.ellipse(p[0]-p[2]*10,p[1]-p[3]*10-4,p[4]*.3,p[4]*.12,Math.atan2(p[3],-p[2])+Math.PI/2,0,7);q.fill();}
    q.strokeStyle='rgba(235,248,255,.75)';q.lineWidth=1.6;for(const c of []){if(!inR(c[0][0],c[0][1],120))continue;q.beginPath();c.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke();}}}
  for(const l of banks){if(!inR(l[0],l[1],70))continue;const h=hash(l[0]|0,l[1]|0);if(h>.4)continue;const im=SPX.bk[((h*20)|0)%8];if(!im.naturalWidth){lump(q,l[0],l[1],l[2],l[3],'#eef0fa','#b9c0e2');continue;}const k=.65+h*.9,w=70*k,hh=w*im.naturalHeight/im.naturalWidth;q.drawImage(im,l[0]-w/2,l[1]-hh*.72,w,hh);}
  if(0)for(const l of lips)if(inR(l[0],l[1],20))lump(q,l[0],l[1],l[2],l[3],'#eceaf4','#c2bede');
  for(const d of drifts)if(inR(d[0],d[1],50)){q.fillStyle=d[5]?'#a9b6dc':'#b5aed6';q.beginPath();q.ellipse(d[0],d[1]+3,d[2],d[3],d[4],0,7);q.fill();
    q.fillStyle=pt.snow;q.beginPath();q.ellipse(d[0],d[1],d[2],d[3],d[4],0,7);q.fill();q.fillStyle='rgba(255,250,246,.5)';q.beginPath();q.ellipse(d[0]-d[2]*.2,d[1]-d[3]*.3,d[2]*.5,d[3]*.35,d[4],0,7);q.fill();}
  for(const g of ground)if(inR(g.x,g.y,Math.max(g.w,g.h)))q.drawImage(g.img,g.x0,g.y0,g.w,g.h);
  for(const d of decals)if(inR(d.x,d.y,120))drawObj(q,d);
  /* cast shadows: sprite silhouettes sheared to the bottom-right (light from the top-left) */
  q.globalAlpha=.42;const sh=[];for(let j=cj-1;j<=cj+1;j++)for(let i=ci-1;i<=ci+1;i++){const b=buckets.get(i+','+j);if(b)sh.push(...b);}sh.sort((a,b)=>a.y-b.y);for(const o of sh){if(!o.cast||!inR(o.x,o.y,o.h*1.1))continue;q.save();q.translate(o.x,o.y+o.h*(1-o.ay)-2);q.transform(1,0,-.5,.34,0,0);if(o.flip)q.scale(-1,1);q.drawImage(sil(o.img),-o.ax*o.w,-o.h,o.w,o.h);q.restore();}
  q.globalAlpha=1;
  /* contact shadow at the painted foot (same as the field maps), so trees and rocks stand in the snow instead of on it */
  for(const o of sh){if(!o.cast||!inR(o.x,o.y,o.w))continue;const base=o.y+o.h*(1-o.ay),rx=o.w*(o.tree?.24:.4),ry=Math.max(7,rx*.26);
    q.save();q.translate(o.x,base-ry*.45);q.scale(1,ry/rx);const g=q.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,'rgba(70,64,120,.45)');g.addColorStop(.6,'rgba(70,64,120,.26)');g.addColorStop(1,'rgba(70,64,120,0)');q.fillStyle=g;q.fillRect(-rx,-rx,2*rx,2*rx);q.restore();}
  return c;}
const silCache=new Map();function sil(img){let s=silCache.get(img);if(s)return s;s=document.createElement('canvas');s.width=img.naturalWidth;s.height=img.naturalHeight;const q=s.getContext('2d');q.drawImage(img,0,0);q.globalCompositeOperation='source-in';q.fillStyle='#8c86c4';q.fillRect(0,0,s.width,s.height);silCache.set(img,s);return s;}
function chunk(ci,cj){const k=ci+','+cj;let c=chunks.get(k);if(c){chunks.delete(k);chunks.set(k,c);return c;}if(bakesThisFrame>=4)return null;bakesThisFrame++;c=bake(ci,cj);chunks.set(k,c);
  if(chunks.size>70)chunks.delete(chunks.keys().next().value);return c;}
/* ---------- wind: a slow global breeze + gusts that roll across the map from the west ---------- */
let NOW=0;const breeze=t=>.35+.65*Math.pow(Math.max(0,Math.sin(t*.00042)),2);
function wind(x,y,t){const g=Math.max(0,Math.sin(x*.0016+y*.0006-t*.0011));return breeze(t)*.6+g*g*g*.9;}
function swayOf(o,t){const w=wind(o.x,o.y,t),flick=Math.sin(t*.004+o.ph)*.35+Math.sin(t*.0093+o.ph*2)*.15;let s=(w*.7+flick*(.4+w))*o.sway;
  if(o.hit){const a=(t-o.hit)/1000;if(a<1.2)s+=Math.sin(a*22)*(1.2-a)*1.4*o.sway;else o.hit=0;}return s*.08;}
function drawSway(q,o,t){const sh=swayOf(o,t);q.save();q.translate(o.x,o.y);q.transform(1,0,-sh,1,0,0);if(o.flip)q.scale(-1,1);q.drawImage(o.img,-o.ax*o.w,-o.ay*o.h,o.w,o.h);q.restore();}
function drawObj(q,o){if(o.sway&&NOW){drawSway(q,o,NOW);return;}if(o.flip){q.save();q.translate(o.x,o.y);q.scale(-1,1);q.drawImage(o.img,-o.ax*o.w,-o.ay*o.h,o.w,o.h);q.restore();}else q.drawImage(o.img,o.x-o.ax*o.w,o.y-o.ay*o.h,o.w,o.h);}
function viewRect(g){const m=g.getTransform(),inv=m.inverse(),cw=g.canvas.width,ch=g.canvas.height;const pts=[[0,0],[cw,0],[0,ch],[cw,ch]].map(([x,y])=>[inv.a*x+inv.c*y+inv.e,inv.b*x+inv.d*y+inv.f]);
  return {x0:Math.min(...pts.map(p=>p[0])),y0:Math.min(...pts.map(p=>p[1])),x1:Math.max(...pts.map(p=>p[0])),y1:Math.max(...pts.map(p=>p[1])),sc:Math.hypot(m.a,m.b)};}
function makeMinimap(){const s=384/W,c=document.createElement('canvas');c.width=384;c.height=Math.round(H*s);const q=c.getContext('2d');q.scale(s,s);
  q.fillStyle='#d6d9ee';q.fillRect(0,0,W,H);q.fillStyle='#c6a083';for(const P of [path,...branches])for(const p of P){q.beginPath();q.arc(p[0],p[1],p[4]*.8,0,7);q.fill();}
  q.fillStyle='#78b2df';for(const p of stream){q.beginPath();q.arc(p[0],p[1],p[4]*.7,0,7);q.fill();}q.beginPath();q.ellipse(LAYOUT.pond[0],LAYOUT.pond[1]-20,170,95,0,0,7);q.fill();
  q.fillStyle='#3f6f55';for(const o of objs)if(o.tree){q.beginPath();q.arc(o.x,o.y-o.h*.3,o.w*.42,0,7);q.fill();}minimap=c;}

/* ---------- atmosphere (screen space): warm grade, sun rays, drifting snow ---------- */
const flakes=[];for(let i=0;i<120;i++)flakes.push({x:Math.random(),y:Math.random(),z:.4+Math.random()*.6,p:Math.random()*6.28});let lastT=0;
/* gusts knock powder off the trees near the camera: small white puffs drifting east */
const puffs=[];function treePuffs(g,t,dt){const v=viewRect(g);if(breeze(t)>.6&&Math.random()<dt*6){const b=[];for(let j=Math.floor(v.y0/CH);j<=Math.floor(v.y1/CH);j++)for(let i=Math.floor(v.x0/CH);i<=Math.floor(v.x1/CH);i++){const k=buckets.get(i+','+j);if(k)for(const o of k)if(o.tree&&o.x>v.x0&&o.x<v.x1&&o.y>v.y0&&o.y<v.y1+o.h)b.push(o);}
    if(b.length){const o=b[(Math.random()*b.length)|0];for(let n=0;n<6;n++)puffs.push({x:o.x+(Math.random()-.5)*o.w*.5,y:o.y-o.h*(.45+Math.random()*.4),vx:30+Math.random()*40,vy:8+Math.random()*16,l:0,L:1.4+Math.random(),r:2+Math.random()*2.5});}}
  for(let i=puffs.length-1;i>=0;i--){const p=puffs[i];p.l+=dt;if(p.l>p.L){puffs.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;const a=Math.sin(p.l/p.L*Math.PI)*.8;g.fillStyle=`rgba(255,255,255,${a})`;g.beginPath();g.arc(p.x,p.y,p.r*(1+p.l*.6),0,7);g.fill();}}
function atmosphere(g,t,night){const cw=g.canvas.width,chh=g.canvas.height,u=Math.max(cw,chh)/1280,dt=Math.min(.05,Math.max(0,(t-lastT)/1000));lastT=t;
  g.save();g.setTransform(1,0,0,1,0,0);
  if(night){g.globalCompositeOperation='multiply';g.fillStyle='rgb(120,120,170)';g.fillRect(0,0,cw,chh);g.globalCompositeOperation='source-over';}
  else{const gr=g.createLinearGradient(0,0,cw*.75,chh);gr.addColorStop(0,'rgba(255,196,128,.30)');gr.addColorStop(.55,'rgba(255,214,170,.08)');gr.addColorStop(1,'rgba(150,150,220,.10)');
    g.globalCompositeOperation='soft-light';g.fillStyle=gr;g.fillRect(0,0,cw,chh);
    g.globalCompositeOperation='screen';const ang=.62,ca=Math.cos(ang),sa=Math.sin(ang),Lr=Math.hypot(cw,chh)*1.1;
    for(let k=0;k<5;k++){const off=(k*.19-.12)*cw+Math.sin(t*.00013+k*1.7)*30*u,w=(60+k*37%90)*u,a=(.10+.05*Math.sin(t*.0004+k*2.1))*(k%2?.8:1);
      const sx=off,sy=-40*u,lg=g.createLinearGradient(sx,sy,sx+ca*Lr*.7,sy+sa*Lr*.7);lg.addColorStop(0,`rgba(255,226,170,${a})`);lg.addColorStop(1,'rgba(255,226,170,0)');
      g.fillStyle=lg;g.beginPath();g.moveTo(sx-w*sa,sy+w*ca*.0);g.lineTo(sx+w*sa,sy);g.lineTo(sx+w*sa+ca*Lr,sy+sa*Lr);g.lineTo(sx-w*sa+ca*Lr,sy+sa*Lr);g.closePath();g.fill();}
    g.globalCompositeOperation='source-over';}
  const bz=breeze(t);for(const f of flakes){f.y+=dt*.035*f.z;f.x+=dt*(.012+.01*Math.sin(t*.0007+f.p)+.09*bz*bz)*f.z;if(f.y>1.02){f.y=-.02;f.x=Math.random();}if(f.x>1.02)f.x=-.02;
    const s=Math.max(1,Math.round((1.4+f.z*1.8)*u)),tw=.55+.45*Math.sin(t*.003+f.p*3);g.fillStyle=`rgba(255,255,255,${(.45+.4*f.z)*tw})`;g.fillRect(Math.round(f.x*cw),Math.round(f.y*chh),s,s);}
  g.restore();}

/* ---------- host interface ---------- */
let ply={x:LAYOUT.spawn[0],y:LAYOUT.spawn[1]},debug=false;
function drawBase(g,t,night){if(!ready)return false;bakesThisFrame=0;const v=viewRect(g);
  if(v.sc<.2){if(minimap)g.drawImage(minimap,0,0,W,H);return true;}
  g.fillStyle=pats(g).snow;g.fillRect(Math.max(0,v.x0),Math.max(0,v.y0),Math.min(W,v.x1)-Math.max(0,v.x0),Math.min(H,v.y1)-Math.max(0,v.y0));
  const i0=Math.max(0,Math.floor(v.x0/CH)),i1=Math.min(Math.ceil(W/CH)-1,Math.floor(v.x1/CH)),j0=Math.max(0,Math.floor(v.y0/CH)),j1=Math.min(Math.ceil(H/CH)-1,Math.floor(v.y1/CH));
  const cx=(v.x0+v.x1)/2,cy=(v.y0+v.y1)/2,list=[];for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)list.push([i,j,(i*CH+CH/2-cx)**2+(j*CH+CH/2-cy)**2]);list.sort((a,b)=>a[2]-b[2]);
  for(const [i,j] of list){const c=chunk(i,j);if(c)g.drawImage(c,i*CH,j*CH);}
  {const k=spLife();if(k){const dtw=Math.min(.05,Math.max(0,(t-spW)/1000));spW=t;k.waterFx(g,t,dtw,v);}}
  if(window.drawCodeWarp)for(const w of warps)window.drawCodeWarp(g,w.x,w.y,t,w.ph);
  NOW=t;for(let j=j0;j<=j1+1;j++)for(let i=i0;i<=i1;i++){const b=grassB.get(i+','+j);if(!b)continue;for(const o of b){if(o.x<v.x0-40||o.x>v.x1+40||o.y<v.y0-10||o.y>v.y1+60)continue;if(!o.hit&&Math.abs(ply.x-o.x)<18&&Math.abs(ply.y-o.y)<14)o.hit=t;drawSway(g,o,t);}}
  return true;}
function drawSorted(g,t,night,items,cam){if(!ready)return false;NOW=t;const v=viewRect(g),all=items.slice();
  const i0=Math.floor((v.x0-300)/CH),i1=Math.floor((v.x1+300)/CH),j0=Math.floor((v.y0-50)/CH),j1=Math.floor((v.y1+500)/CH);
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const b=buckets.get(i+','+j);if(!b)continue;for(const o of b){if(o.x+o.w<v.x0||o.x-o.w>v.x1||o.y-o.h>v.y1||o.y+20<v.y0)continue;if(o.sway>.8&&!o.hit&&Math.abs(ply.x-o.x)<o.w*.4&&Math.abs(ply.y-o.y)<22)o.hit=t;all.push({depth:o.y,draw:()=>drawObj(g,o)});}}
  all.sort((a,b)=>a.depth-b.depth);for(const it of all)it.draw();
  if(debug){g.save();g.fillStyle='rgba(220,40,40,.28)';for(let j=Math.max(0,(v.y0/CELL)|0);j<Math.min(ROWS,(v.y1/CELL)+1);j++)for(let i=Math.max(0,(v.x0/CELL)|0);i<Math.min(COLS,(v.x1/CELL)+1);i++)if(grid[j*COLS+i])g.fillRect(i*CELL,j*CELL,CELL,CELL);g.restore();}
  return true;}
let spLK=null,spW=0;const spLife=()=>spLK||(window.mkFieldLife&&ready?(spLK=window.mkFieldLife({getPly:()=>ply,CAVE:false,MOOD:'cold',THEME:'snow',SNOWTH:true,WINDK:1,LAKETEX:'texSeaIce',SEA:null,cfg:{lakes:[1]},WALLS:null,objs,stream,isSea:()=>false,inCanal:()=>false,inLake:(x,y)=>{const g=ground.find(o=>o.n==='pond');return !!g&&((x-g.x)/(g.w*.4))**2+((y-(g.y-g.h*.04))/(g.h*.36))**2<1;},segDist,hash,breeze,viewRect,blocked,wallAt:()=>false})):null);
let lastP=0;function foreground(g,t,night){if(!ready)return;for(const w of warps){g.save();g.globalCompositeOperation='lighter';for(let k=0;k<7;k++){const u=((t*.0005+k/7+w.ph)%1),a=Math.sin(u*Math.PI);g.fillStyle=`rgba(150,230,255,${.55*a})`;g.fillRect(w.x+Math.sin(k*2.3+w.ph)*40-1.5,w.y-u*90-4,3,8);}g.restore();g.save();g.font='700 15px sans-serif';g.textAlign='center';g.lineWidth=4;g.strokeStyle='rgba(20,30,50,.75)';g.fillStyle='#e8f8ff';{const L=window.warpName?window.warpName(w.label):w.label;g.strokeText(L,w.x,w.y-96);g.fillText(L,w.x,w.y-96);}g.restore();}const dt=Math.min(.05,Math.max(0,(t-lastP)/1000));lastP=t;treePuffs(g,t,dt);{const k=spLife();if(k)k.life(g,t,dt,night);}atmosphere(g,t,night);}
const EXIT=[120,460];
return {W,H,get ready(){return ready},get failed(){return failed},nav:{nearest,blocked},
  setPlayer(x,y){ply.x=x;ply.y=y},update(){},drawBase,drawSorted,foreground,
  clear,route,blocked,set debug(v){debug=v},
  spawn:{start:{x:LAYOUT.spawn[0],y:LAYOUT.spawn[1]},fromVillage:{x:LAYOUT.spawn[0],y:LAYOUT.spawn[1]}},
  get spawns(){return spawns},_bake:(i,j)=>bake(i,j),CH,
  randomSpawn(px,py,minD=700){const s=spawns.filter(p=>Math.hypot(p.x-px,p.y-py)>minD);const p=(s.length?s:spawns)[Math.floor(Math.random()*(s.length||spawns.length))];return p?{x:p.x+(Math.random()-.5)*120,y:p.y+(Math.random()-.5)*120}:null;},
  landmarks:{entrance:{x:LAYOUT.spawn[0],y:LAYOUT.spawn[1],name:'ทางเข้า'},pond:{x:LAYOUT.pond[0],y:LAYOUT.pond[1],name:'บึงน้ำแข็ง'},bridge:{x:B[0],y:B[1],name:'สะพานลำธาร'},shrine:{x:LAYOUT.shrine[0],y:LAYOUT.shrine[1],name:'ศาลหินรูน'},camp:{x:LAYOUT.camp[0],y:LAYOUT.camp[1],name:'แคมป์นายพราน'}},
  get warps(){return warps},warpAt(p){for(const w of warps)if(Math.hypot(p.x-w.x,(p.y-w.y)*1.4)<46)return w;return null;},warpById(id){return warps.find(w=>w.id===id)||null;},
  exitHit(){return false;}};
};
})();
