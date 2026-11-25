/* =====================================================================
   FXLIB presets 1/2 — COMBAT
   melee (slash.*) · hits on a body (hit.*) · shots (shot.*) · explosions and areas (boom.*) · lasting zones (zone.*) · casting (cast.*)
   Every effect takes an element (o.el): the shapes stay, colours and debris change. Kit: fxlib.js · catalogue: FXLIB_TH.md · gallery: fxlib.html
   What to pass (meta.kind):  melee = x,y,phi of the attacker · hit = x,y of the body · shot = x,y → to (unit) or x2,y2 · area = x,y on the ground
                              line = x,y,phi · unit = follow (a unit with x,y[,z])            common: el · size · dur (lasting ones) · r (areas)
   ===================================================================== */
(()=>{
'use strict';
const F=window.FXLIB;if(!F)return;
const K_=F.k,{TAU,cl,lerp,eO,eO2,eI,back,R,pick,sg,KY,qn,rgba,SH,pal,tex,spr,sprF,glowAt,coreAt,starAt,drawSpr,sys,bits,sparks,puffs,glints,A,after,Emit,Fn,Arc,Cut,Streak,Ring,Disc,Flash,Burst,Bolt,Beam,Pillar,Gush,Cone,Sigil,Proj,Wave,Crack,Spike,Flames,Tornado,Spr,Tele,BIT}=K_;
const def=(id,cat,th,kind,el,fn,x)=>F.define(id,Object.assign({cat,th,kind,el},x||{}),(o,h)=>{if(!o.el)o.el=el;fn(o,o.size,h);});

const {fwd,scrAng,aim,dustP,SMK,smokeOf,lite,dark,ring,flash,burst,dust,spark,impact,blast,strike,rays,floaters}=K_.h;
/* what falls from the sky per element (boom.rain, boom.meteor) and how wide its picture is drawn */
const HEAD={steel:'arrow',gold:'arrow',ice:'shard',star:'star5',holy:'sword',fire:'orb',ember:'orb',water:'drop',nature:'leaf',dark:'shard',moon:'moon',earth:'rock',sakura:'petal',poison:'drop',arcane:'orb',blood:'drop',wind:'feather',soul:'wisp',volt:'orb',thunder:'orb'};
const HW={arrow:3.6,sword:.95,leaf:1.4,feather:1.6,bullet:1.3,wing:2.2};
const SOLID={ice:1,earth:1,steel:1,nature:1,gold:1,moon:1,star:1};      /* elements whose walls / spikes are crystals rather than flames */
Object.assign(K_.h,{HEAD,HW,SOLID,def});

/* a little debris along a swinging arc (not for plain steel: a sword swing stays clean) */
function arcBits(a,el,s,n){if(el==='steel'||el==='gold')return;const S=sys('top');A(new Emit({life:a.swing+.03,every:.022,fn(){const h=a.head();bits(S,el,h[0],h[1],h[2],n||1,{size:s*.7,sp:.3,up:.35});}}));}
const arc=(o,s,x)=>{const a=A(new Arc(Object.assign({el:o.el,x:o.x,y:o.y,z:(o.z||0)+30*s,phi:o.phi,R:(o.reach||62)*s,w:22*s,swing:o.swing||.1,life:.3},x)));arcBits(a,o.el,s);return a;};

/* =====================================================================
   SLASH — melee swings (x,y = the attacker, phi = facing, reach = how far the blade edge is)
   ===================================================================== */
def('slash.arc','slash','ฟันโค้ง','melee','steel',(o,s)=>{const d=o.dir||1;arc(o,s,{a0:-1.5*d,a1:1.5*d,tilt:o.tilt==null?R(-.22,.22):o.tilt});});
def('slash.up','slash','ฟันเสยขึ้น','melee','steel',(o,s)=>{arc(o,s,{z:(o.z||0)+46*s,R:(o.reach||56)*s,a0:-1.3,a1:1.35,tilt:1.25*(o.dir||1)});});
def('slash.down','slash','ฟันผ่าลง','melee','steel',(o,s)=>{const RR=(o.reach||56)*s;arc(o,s,{z:(o.z||0)+48*s,R:RR,a0:1.4,a1:-1.25,tilt:1.3*(o.dir||1)});
  after(.09,()=>{const p=fwd(o,RR*.95);dust(o,p.x,p.y,18*s,4,22*s);ring(o.el,p.x,p.y,30*s,{w0:4*s,life:.26});});});
def('slash.x','slash','ฟันกากบาท','melee','steel',(o,s)=>{const z=(o.z||0)+40*s,RR=(o.reach||60)*s;arc(o,s,{z,R:RR,w:20*s,a0:-1.3,a1:1.3,tilt:.85,swing:.09});
  after(.1,()=>arc(o,s,{z,R:RR,w:20*s,a0:1.3,a1:-1.3,tilt:-.85,swing:.09}));after(.19,()=>{const p=fwd(o,RR);flash(o.el,p.x,p.y,z,1.25*s);bits(sys('top'),o.el,p.x,p.y,z,6,{size:s*.8});});});
def('slash.spin','slash','หมุนฟันรอบตัว','melee','steel',(o,s)=>{const d=o.dir||1,RR=(o.reach||70)*s;arc(o,s,{z:(o.z||0)+26*s,R:RR,w:24*s,a0:-Math.PI*d,a1:Math.PI*d,tilt:0,swing:.17,life:.4});
  ring(o.el,o.x,o.y,RR*1.2,{w0:7*s,life:.4});lite(o.el,o.x,o.y,RR*1.2,.4,.35);dust(o,o.x,o.y,RR*.45,7,24*s);});
def('slash.double','slash','ฟันสองดาบ','melee','steel',(o,s)=>{arc(o,s,{a0:-1.45,a1:1.45,tilt:.32});after(.12,()=>arc(Object.assign({},o,{el:o.el2||o.el}),s,{a0:1.45,a1:-1.45,tilt:-.32}));});
def('slash.flurry','slash','รัวฟัน','melee','steel',(o,s)=>{const n=o.n||7,S=sys('top');for(let i=0;i<n;i++)after(i*.055,()=>{const d=sg(),sp=R(.9,1.3);arc(o,s,{R:R(50,66)*s,w:13*s,a0:-sp*d,a1:sp*d,tilt:R(-1.2,1.2),swing:.06,life:.2,z:(o.z||0)+R(26,40)*s,glint:0});
    const p=fwd(o,R(46,64)*s,R(-14,14)*s);A(new Cut({el:o.el,x:p.x,y:p.y,z:R(16,40)*s,L:R(40,60)*s,w:6*s,life:.16}));if(i%2)bits(S,o.el,p.x,p.y,26*s,2,{size:s*.7});});
  after(n*.055+.02,()=>{const p=fwd(o,56*s);flash(o.el,p.x,p.y,28*s,1.1*s);});});
def('slash.thrust','slash','แทง','melee','steel',(o,s)=>{const z=(o.z||0)+28*s,a=fwd(o,10*s),b=fwd(o,(o.reach||120)*s);A(new Streak({el:o.el,x:a.x,y:a.y,x2:b.x,y2:b.y,z,w:13*s,life:.24}));
  after(.07,()=>{flash(o.el,b.x,b.y,z,.9*s);bits(sys('top'),o.el,b.x,b.y,z,6,{dir:o.phi,spread:.5,size:s*.8});});});
def('slash.thrusts','slash','แทงรัว','melee','steel',(o,s)=>{const n=o.n||6,S=sys('top');for(let i=0;i<n;i++)after(i*.06,()=>{const sd=R(-15,15)*s,z=(o.z||0)+R(14,44)*s,a=fwd(o,8*s,sd*.4),b=fwd(o,(o.reach||110)*s*R(.85,1.05),sd);
    A(new Streak({el:o.el,x:a.x,y:a.y,x2:b.x,y2:b.y,z,w:8*s,life:.18}));bits(S,o.el,b.x,b.y,z,2,{dir:o.phi,spread:.5,size:s*.7});});
  after(n*.06,()=>{const b=fwd(o,(o.reach||110)*s);flash(o.el,b.x,b.y,28*s,1.1*s);});});
def('slash.cleave','slash','ฟันผ่าหนัก (พื้นแตก)','melee','steel',(o,s)=>{const RR=(o.reach||64)*s;arc(o,s,{z:(o.z||0)+52*s,R:RR,w:30*s,a0:1.45,a1:-1.25,tilt:1.35,swing:.12,life:.34});
  after(.11,()=>{const p=fwd(o,RR*.95),S=sys('top');A(new Crack({el:o.el,x:p.x,y:p.y,line:120*s,phi:o.phi,life:1.5,w:3.4}));ring(o.el,p.x,p.y,66*s);lite(o.el,p.x,p.y,72*s,.4);dust(o,p.x,p.y,30*s,7,34*s);
    bits(S,'earth',p.x,p.y,4,7,{size:s});bits(S,o.el,p.x,p.y,8,6,{size:s});SH(3);});});
def('slash.iai','slash','ชักดาบ (เส้นแสง)','melee','steel',(o,s)=>{const z=(o.z||0)+30*s,a=fwd(o,-20*s),b=fwd(o,(o.reach||170)*s),m=fwd(o,(o.reach||170)*s*.45);
  A(new Streak({el:o.el,x:a.x,y:a.y,x2:b.x,y2:b.y,z,w:5*s,life:.16,go:.3,head:0}));
  after(.1,()=>{A(new Cut({el:o.el,x:m.x,y:m.y,z,L:(o.reach||170)*1.25*s,w:7*s,ang:scrAng(o.phi),life:.32}));flash(o.el,m.x,m.y,z,.9*s);bits(sys('top'),o.el,m.x,m.y,z,8,{size:s*.8});});});
def('slash.claw','slash','กรงเล็บ','melee','steel',(o,s)=>{const d=o.dir||1;for(let i=0;i<3;i++)arc(o,s,{z:(o.z||0)+46*s,R:((o.reach||58)-11+i*11)*s,w:9*s,a0:1.2*d,a1:-1.1*d,tilt:1.02,swing:.08,life:.26,delay:i*.012,glint:i===2?1:0});});
def('slash.wave','slash','คลื่นดาบ','melee','steel',(o,s)=>{const d=o.dir||1;arc(o,s,{a0:-1.5*d,a1:1.5*d,tilt:0});
  after(.08,()=>{const w=A(new Wave({el:o.el,x:o.x,y:o.y,phi:o.phi,dist:(o.dist||250)*s,r:46*s,w:17*s,z:(o.z||0)+22*s,life:.5})),S=sys('top');A(new Emit({life:.44,every:.03,fn(){const f=w.front();bits(S,o.el,f[0],f[1],18*s,1,{size:s*.7,sp:.4});}}));});});
def('slash.moon','slash','จันทร์เสี้ยวยักษ์','melee','moon',(o,s)=>{const d=o.dir||1,z=(o.z||0)+34*s,RR=(o.reach||104)*s;lite(o.el,o.x,o.y,RR*1.1,.5,.35);arc(o,s,{z,R:RR,w:40*s,a0:-1.7*d,a1:1.7*d,tilt:o.tilt==null?.18:o.tilt,swing:.15,life:.46});
  after(.1,()=>{const p=fwd(o,RR*.95);glints(sys('top'),pal(o.el)[3],p.x,p.y,z,10,70*s,.7);});});
def('slash.scythe','slash','เคียวเกี่ยววิญญาณ','melee','dark',(o,s)=>{const d=o.dir||1,RR=(o.reach||84)*s;arc(o,s,{z:(o.z||0)+30*s,R:RR,w:26*s,a0:-2.5*d,a1:1.1*d,tilt:.12,swing:.16,life:.42});
  after(.14,()=>{const p=fwd(o,RR*.8),S=sys('top');bits(S,'soul',p.x,p.y,20*s,6,{size:s,up:1.2,sp:.6});});});
function fist(o,s,a,b,z,w,T){const an=scrAng(Math.atan2(b.y-a.y,b.x-a.x));A(new Streak({el:o.el,x:a.x,y:a.y,x2:b.x,y2:b.y,z,w:w*.7,life:T+.12,go:.45,head:0}));
  A(new Spr({im:spr('fist',o.el),x:a.x,y:a.y,z,w,life:T+.1,fi:.02,fo:.08,vx:(b.x-a.x)/T,vy:(b.y-a.y)/T,mt:T,rot:an+Math.PI/2,layer:'top'}));}
def('slash.punch','slash','หมัดตรง','melee','steel',(o,s)=>{const z=(o.z||0)+30*s,a=fwd(o,14*s),b=fwd(o,(o.reach||64)*s);fist(o,s,a,b,z,30*s,.08);
  after(.08,()=>{burst(o.el,b.x,b.y,z,1.1*s,{n:8});flash(o.el,b.x,b.y,z,s);ring(o.el,b.x,b.y,34*s,{w0:4*s,life:.26});bits(sys('top'),o.el,b.x,b.y,z,5,{dir:o.phi,spread:.8,size:s*.8});});});
def('slash.punches','slash','หมัดรัว','melee','steel',(o,s)=>{const n=o.n||7,S=sys('top');for(let i=0;i<n;i++)after(i*.06,()=>{const sd=R(-16,16)*s,z=(o.z||0)+R(16,44)*s,a=fwd(o,12*s,sd*.5),b=fwd(o,(o.reach||62)*s*R(.9,1.1),sd);fist(o,s,a,b,z,22*s,.05);
    after(.05,()=>{burst(o.el,b.x,b.y,z,.7*s,{n:7,life:.18});if(i%2)bits(S,o.el,b.x,b.y,z,2,{size:s*.7});});});
  after(n*.06+.04,()=>{const b=fwd(o,(o.reach||62)*s);burst(o.el,b.x,b.y,30*s,1.4*s,{n:10});flash(o.el,b.x,b.y,30*s,1.3*s);ring(o.el,b.x,b.y,44*s,{life:.3});});});
def('slash.upper','slash','อัปเปอร์คัต','melee','steel',(o,s)=>{const p=fwd(o,(o.reach||46)*s);A(new Streak({el:o.el,x:p.x,y:p.y,x2:p.x,y2:p.y,z:6*s,z2:96*s,w:18*s,life:.26,go:.4}));
  A(new Spr({im:spr('fist',o.el),x:p.x,y:p.y,z:8*s,w:30*s,life:.22,fi:.02,fo:.1,vz:820*s,mt:.1,layer:'top'}));dust(o,p.x,p.y,18*s,5,22*s);
  after(.1,()=>{burst(o.el,p.x,p.y,92*s,1.15*s);flash(o.el,p.x,p.y,92*s,1.1*s);bits(sys('top'),o.el,p.x,p.y,90*s,6,{size:s*.8,up:1.3});});});

/* =====================================================================
   HIT — marks on the body that was hit (x,y = the body; z = height of the hit, default mid-body)
   ===================================================================== */
const hz=(o,s)=>(o.z||0)+26*s;
def('hit.cut','hit','โดนฟัน','hit','steel',(o,s)=>{const z=hz(o,s);A(new Cut({el:o.el,x:o.x,y:o.y,z,L:58*s,w:9*s,ang:o.ang==null?R(-1,1):o.ang,life:.2}));bits(sys('top'),o.el,o.x,o.y,z,5,{size:s*.75});});
def('hit.cross','hit','โดนฟันกากบาท','hit','steel',(o,s)=>{const z=hz(o,s);A(new Cut({el:o.el,x:o.x,y:o.y,z,L:62*s,w:9*s,ang:.78,life:.22}));A(new Cut({el:o.el,x:o.x,y:o.y,z,L:62*s,w:9*s,ang:-.78,life:.22,delay:.05}));
  after(.05,()=>{flash(o.el,o.x,o.y,z,.9*s);bits(sys('top'),o.el,o.x,o.y,z,7,{size:s*.8});});});
def('hit.blunt','hit','โดนทุบ','hit','steel',(o,s)=>{const z=hz(o,s);burst(o.el,o.x,o.y,z,1.05*s,{n:7,inner:.55});flash(o.el,o.x,o.y,z,.9*s);ring(o.el,o.x,o.y,36*s,{w0:5*s,life:.26});
  bits(sys('top'),o.el,o.x,o.y,z,5,{size:s*.8});puffs(sys('sorted',o.y+2),dustP(o),o.x,o.y,4,3,20*s,50,10,.5);});
def('hit.pierce','hit','โดนแทงทะลุ','hit','steel',(o,s)=>{const z=hz(o,s),a=fwd(o,-28*s),b=fwd(o,44*s);A(new Streak({el:o.el,x:a.x,y:a.y,x2:b.x,y2:b.y,z,w:8*s,life:.17}));
  after(.04,()=>{flash(o.el,b.x,b.y,z,.7*s);bits(sys('top'),o.el,b.x,b.y,z,6,{dir:o.phi,spread:.45,size:s*.8,sp:1.3});});});
def('hit.crit','hit','คริติคอล','hit','gold',(o,s)=>{const z=hz(o,s),S=sys('top');A(new Burst({el:o.el,x:o.x,y:o.y,z,r:46*s,n:12,life:.3,inner:.4}));A(new Flash({el:o.el,x:o.x,y:o.y,z,s0:20*s,s1:96*s,life:.22}));
  ring(o.el,o.x,o.y,56*s,{life:.32});ring(o.el,o.x,o.y,34*s,{delay:.05,w0:4*s,life:.26});bits(S,o.el,o.x,o.y,z,14,{size:s,sp:1.3});sparks(S,pal(o.el)[3],o.x,o.y,z,8,300,150,.4);SH(2);});
def('hit.magic','hit','โดนเวทธาตุ','hit','arcane',(o,s)=>{const z=hz(o,s);flash(o.el,o.x,o.y,z,1.05*s);lite(o.el,o.x,o.y,44*s,.35,.5);ring(o.el,o.x,o.y,38*s,{w0:5*s,life:.3});bits(sys('top'),o.el,o.x,o.y,z,10,{size:s*.95});});
def('hit.block','hit','ป้องกันได้','hit','steel',(o,s)=>{const z=hz(o,s),S=sys('top');A(new Spr({im:spr('shield',o.el),x:o.x,y:o.y,z:z+4*s,w:34*s,life:.42,pop:.12,s0:.4,s1:1,fo:.2,layer:'top'}));
  ring(o.el,o.x,o.y,34*s,{w0:4*s,life:.26});sparks(S,pal(o.el)[3],o.x,o.y,z,9,260,120,.35);flash(o.el,o.x,o.y,z,.7*s);});
def('hit.kill','hit','ปิดฉาก (วิญญาณลอย)','hit','soul',(o,s)=>{const z=hz(o,s),S=sys('top');burst(o.el,o.x,o.y,z,1.1*s);flash(o.el,o.x,o.y,z,1.1*s);puffs(sys('sorted',o.y+2),'shadow',o.x,o.y,10,5,34*s,40,26,.7);
  A(new Spr({im:spr('skull',o.el),x:o.x,y:o.y,z:z+6*s,w:26*s,life:.9,pop:.14,s0:.3,s1:1,vz:46*s,fo:.4,glow:pal(o.el)[2],layer:'top'}));bits(S,o.el,o.x,o.y,z,7,{size:s,up:1.3,sp:.6});});
def('hit.shatter','hit','แตกกระจาย','hit','ice',(o,s)=>{const z=hz(o,s),S=sys('top');flash(o.el,o.x,o.y,z,1.2*s);burst(o.el,o.x,o.y,z,1.1*s,{n:9});bits(S,o.el,o.x,o.y,z,18,{only:0,size:s,sp:1.4,up:1.1});
  ring(o.el,o.x,o.y,48*s,{life:.32});glints(S,pal(o.el)[3],o.x,o.y,z,6,30*s,.5);puffs(sys('sorted',o.y+2),smokeOf(o.el),o.x,o.y,8,3,30*s,40,14,.6);});

/* =====================================================================
   SHOT — things that fly from x,y to a target (to = a unit that may move, or x2,y2)
   ===================================================================== */
const proj=(o,s,x)=>A(new Proj(Object.assign({el:o.el,x:o.x,y:o.y,z:(o.z||0)+28*s,to:o.to||null,x2:o.x2,y2:o.y2,z2:o.to?null:24*s},x)));
const trailBits=(S,el,s,ev,o2)=>p=>{p._n=(p._n||0)+1;if(p._n%(ev||2)===0)bits(S,el,p.cx,p.cy,p.cz,1,Object.assign({size:s*.6,sp:.25,up:.3},o2));};
def('shot.bolt','shot','ลูกเวท','shot','arcane',(o,s)=>{aim(o);const S=sys('top');flash(o.el,o.x,o.y,(o.z||0)+28*s,.6*s,{life:.12});
  proj(o,s,{head:'orb',r:8*s,speed:o.speed||620,trail:.14,emit:trailBits(S,o.el,s,2),onHit(x,y,z){spark(o.el,x,y,z,1.1*s,8);ring(o.el,x,y,34*s,{w0:4*s,life:.28});lite(o.el,x,y,40*s,.3,.5);}});});
def('shot.orb','shot','ลูกพลังใหญ่','shot','arcane',(o,s)=>{aim(o);const S=sys('top');flash(o.el,o.x,o.y,(o.z||0)+28*s,.9*s,{life:.14});
  proj(o,s,{head:'orb',r:15*s,speed:o.speed||300,trail:.24,tw:1.05,emit:trailBits(S,o.el,s*1.2,2),onHit(x,y,z){impact(o.el,x,y,z,1.5*s,14);ring(o.el,x,y,64*s);lite(o.el,x,y,70*s,.4,.6);SH(1.5);}});});
def('shot.arrow','shot','ลูกธนู','shot','steel',(o,s)=>{aim(o);proj(o,s,{head:'arrow',hw:HW.arrow,r:5.5*s,speed:o.speed||900,trail:.07,tw:.6,glow:o.el==='steel'?0:.7,nostar:1,onHit(x,y,z){A(new Cut({el:o.el,x,y,z,L:34*s,w:6*s,life:.16}));bits(sys('top'),o.el,x,y,z,4,{size:s*.7});}});});
def('shot.volley','shot','ยิงกระจายหลายดอก','shot','steel',(o,s)=>{const t=aim(o),n=o.n||5,d=Math.hypot(t.x-o.x,t.y-o.y),S=sys('top');for(let i=0;i<n;i++){const a=o.phi+(i-(n-1)/2)*(o.spread||.16);
    A(new Proj({el:o.el,x:o.x,y:o.y,z:(o.z||0)+28*s,x2:o.x+Math.cos(a)*d,y2:o.y+Math.sin(a)*d,z2:24*s,delay:i*.025,head:'arrow',hw:HW.arrow,r:5.5*s,speed:900,trail:.07,tw:.6,glow:o.el==='steel'?0:.7,nostar:1,onHit(x,y,z){A(new Cut({el:o.el,x,y,z,L:30*s,w:5*s,life:.15}));bits(S,o.el,x,y,z,3,{size:s*.7});}}));}});
def('shot.bullet','shot','กระสุนปืน','shot','gold',(o,s)=>{const t=aim(o),z=(o.z||0)+30*s,m=fwd(o,18*s);flash(o.el,m.x,m.y,z,.9*s,{life:.1});burst(o.el,m.x,m.y,z,.55*s,{n:6,life:.12});puffs(sys('top'),'smoke',m.x,m.y,z,2,16*s,30,20,.45);
  A(new Streak({el:o.el,x:m.x,y:m.y,x2:t.x,y2:t.y,z,z2:24*s,w:4.5*s,life:.14,go:.5,head:0}));after(.04,()=>{spark(o.el,t.x,t.y,24*s,.9*s,5);});});
def('shot.shotgun','shot','ลูกซอง','shot','gold',(o,s)=>{const z=(o.z||0)+30*s,m=fwd(o,18*s),S=sys('top'),rg=(o.range||170)*s;flash(o.el,m.x,m.y,z,1.5*s,{life:.12});burst(o.el,m.x,m.y,z,.95*s,{n:9,life:.16});puffs(S,'smoke',m.x,m.y,z,4,24*s,50,22,.6);SH(2);
  for(let i=0;i<8;i++){const a=o.phi+R(-.3,.3),d=rg*R(.75,1),x2=o.x+Math.cos(a)*d,y2=o.y+Math.sin(a)*d;A(new Streak({el:o.el,x:m.x,y:m.y,x2,y2,z,z2:R(10,36)*s,w:3.6*s,life:.15,go:.5,head:0}));after(.05,()=>bits(S,o.el,x2,y2,22*s,2,{size:s*.7}));}});
def('shot.spear','shot','หอกพลัง','shot','steel',(o,s)=>{aim(o);const S=sys('top');
  proj(o,s,{r:9*s,speed:o.speed||780,trail:.13,tw:1.15,emit:trailBits(S,o.el,s,3),head(p,x,y,r,an){const q=pal(o.el),L=52*s,w=7*s;ctx.save();ctx.translate(x,y);ctx.rotate(an);const bl=(ws,c,ex)=>{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-L*.75-ex,0);ctx.lineTo(L*.05,-w*ws);ctx.lineTo(L*.4+ex,0);ctx.lineTo(L*.05,w*ws);ctx.closePath();ctx.fill();};
      bl(1.35,rgba(q[0],.45),2);bl(1,q[2],0);bl(.6,q[3],0);bl(.28,q[4],0);ctx.restore();},
    onHit(x,y,z){const b={x:x+Math.cos(o.phi)*46*s,y:y+Math.sin(o.phi)*46*s};A(new Streak({el:o.el,x,y,x2:b.x,y2:b.y,z,w:9*s,life:.18}));impact(o.el,x,y,z,1.1*s,8);ring(o.el,x,y,44*s,{life:.3});SH(1.5);}});});
def('shot.shuriken','shot','ดาวกระจาย','shot','steel',(o,s)=>{aim(o);proj(o,s,{head:'shuriken',r:8*s,spin:30,curve:R(18,30)*sg()*s,speed:o.speed||560,trail:.1,tw:.6,glow:o.el==='steel'?0:.7,nostar:1,onHit(x,y,z){A(new Cut({el:o.el,x,y,z,L:36*s,w:6*s,life:.16}));sparks(sys('top'),pal(o.el)[3],x,y,z,6,220,110,.3);}});});
def('shot.boomerang','shot','เคียวบูมเมอแรง','shot','dark',(o,s)=>{const t=aim(o),S=sys('top'),c=R(34,50)*sg()*s,mk=x=>Object.assign({el:o.el,head:'scythe',r:13*s,spin:22,trail:.14,tw:.8,emit:trailBits(S,o.el,s,3),z:(o.z||0)+28*s,z2:26*s},x);
  A(new Proj(mk({x:o.x,y:o.y,x2:t.x,y2:t.y,curve:c,T:.38,ease:eO2,onHit(x,y,z){A(new Cut({el:o.el,x,y,z,L:48*s,w:8*s,life:.2}));bits(S,o.el,x,y,z,6,{size:s*.8});
    A(new Proj(mk({x,y,to:o.follow||null,tz:26*s,x2:o.x,y2:o.y,curve:c,T:.38,ease:eI,onHit(x2,y2,z2){flash(o.el,x2,y2,z2,.6*s,{life:.12});}})));}})));});
def('shot.lob','shot','โยนระเบิด','shot','fire',(o,s)=>{const t=aim(o);A(new Proj({el:o.el,x:o.x,y:o.y,z:(o.z||0)+30*s,x2:t.x,y2:t.y,z2:0,head:'bomb',r:10*s,lob:(o.lob||110)*s,speed:o.speed||330,spin:9,trail:.1,tw:.35,pal:'smoke',glow:0,onHit(x,y){blast(o.el,x,y,s);}}));});
def('shot.beam','shot','ลำแสง','shot','arcane',(o,s)=>{const t=aim(o),T=o.dur||.6,z=(o.z||0)+28*s,S=sys('top');A(new Beam({el:o.el,x:o.x,y:o.y,z,follow:o.follow||null,to:o.to||null,x2:t.x,y2:t.y,z2:24*s,w:13*s,life:T}));flash(o.el,o.x,o.y,z,s,{life:.14});
  A(new Emit({life:T-.1,every:.04,fn(){const e=o.to||t;bits(S,o.el,e.x,e.y,24*s,2,{size:s*.8});}}));lite(o.el,t.x,t.y,46*s,T,.5,{follow:o.to||null,r0:46*s,fi:.08,fo:.2});});
def('shot.chain','shot','สายฟ้าชิ่ง','shot','volt',(o,s)=>{const t=aim(o),pts=[{x:o.x,y:o.y,z:(o.z||0)+28*s},{x:t.x,y:t.y,z:24*s}],S=sys('top');
  for(const c of (o.chain||[{x:t.x+R(40,80)*s,y:t.y+R(-60,-20)*s},{x:t.x+R(60,120)*s,y:t.y+R(20,70)*s}]))pts.push({x:c.x,y:c.y,z:24*s});
  for(let i=0;i<pts.length-1;i++)after(i*.07,()=>{const a=pts[i],b=pts[i+1];A(new Bolt({el:o.el,x:a.x,y:a.y,z:a.z,x2:b.x,y2:b.y,z2:b.z,w:4.5*s,life:.22,jag:10,branch:1}));flash(o.el,b.x,b.y,b.z,.8*s);bits(S,o.el,b.x,b.y,b.z,5,{size:s*.8});});});
def('shot.missiles','shot','ขีปนาวุธเวทนำวิถี','shot','arcane',(o,s)=>{aim(o);const n=o.n||5,S=sys('top');for(let i=0;i<n;i++)proj(o,s,{delay:i*.07,head:'orb',r:6*s,curve:R(30,70)*(i%2?1:-1)*s,lob:R(10,50)*s,speed:430,trail:.2,tw:.9,emit:trailBits(S,o.el,s,3),onHit(x,y,z){spark(o.el,x,y,z,.9*s,5);}});});
def('shot.wisp','shot','ภูตพุ่งชน','shot','soul',(o,s)=>{aim(o);const S=sys('top');proj(o,s,{head:'wisp',upright:1,r:11*s,curve:R(22,36)*sg()*s,speed:o.speed||380,trail:.2,tw:.8,emit:trailBits(S,o.el,s,3,{only:1}),onHit(x,y,z){spark(o.el,x,y,z,s,7);ring(o.el,x,y,32*s,{w0:4*s,life:.28});}});});
def('shot.note','shot','โน้ตเพลง','shot','ember',(o,s)=>{aim(o);const S=sys('top');for(let i=0;i<3;i++)proj(o,s,{delay:i*.11,head:'note',hv:i,upright:1,r:9*s,curve:(i%2?1:-1)*20*s,speed:o.speed||360,trail:.12,tw:.5,nostar:1,
    onHit(x,y,z){ring(o.el,x,y,26*s,{w0:3*s,life:.26});flash(o.el,x,y,z,.6*s);floaters(S,[spr('note',o.el,0),spr('note',o.el,1)],x,y,10*s,2,{s:11*s,p:{z}});}});});
def('shot.snipe','shot','ซุ่มยิง (เล็งก่อนยิง)','shot','gold',(o,s)=>{const t=aim(o),z=(o.z||0)+30*s,d=Math.hypot(t.x-o.x,t.y-o.y),T=o.aim==null?.45:o.aim;if(T>0)A(new Tele({el:'red',x:o.x,y:o.y,phi:o.phi,shape:'line',len:d,w:7*s,life:T}));
  after(T,()=>{const m=fwd(o,18*s);flash(o.el,m.x,m.y,z,1.3*s,{life:.12});A(new Streak({el:o.el,x:m.x,y:m.y,x2:t.x,y2:t.y,z,z2:24*s,w:9*s,life:.2,go:.4,head:0}));
    after(.05,()=>{const S=impact(o.el,t.x,t.y,24*s,1.4*s,12);sparks(S,pal(o.el)[3],t.x,t.y,24*s,8,300,140,.4);ring(o.el,t.x,t.y,52*s,{life:.3});SH(2);});});});
def('shot.fan','shot','พัดมีดบิน','shot','steel',(o,s)=>{const t=aim(o),n=o.n||5,d=Math.hypot(t.x-o.x,t.y-o.y),S=sys('top');for(let i=0;i<n;i++){const a=o.phi+(i-(n-1)/2)*(o.spread||.2);
    A(new Proj({el:o.el,x:o.x,y:o.y,z:(o.z||0)+28*s,x2:o.x+Math.cos(a)*d,y2:o.y+Math.sin(a)*d,z2:24*s,head:'sword',hw:.75,r:6*s,speed:720,trail:.08,tw:.7,glow:o.el==='steel'?0:.7,nostar:1,onHit(x,y,z){A(new Cut({el:o.el,x,y,z,L:30*s,w:5*s,life:.15}));bits(S,o.el,x,y,z,2,{size:s*.7});}}));}});
def('shot.breath','shot','พ่นลมหายใจ (กรวย)','line','fire',(o,s)=>{const T=o.dur||.9,L=(o.len||190)*s,z=(o.z||0)+30*s,m=fwd(o,16*s),S=sys('top'),md=fwd(o,L*.55);lite(o.el,md.x,md.y,L*.5,T+.2,.45,{r0:L*.42,fi:.12,fo:.3});
  A(new Cone({el:o.el,x:m.x,y:m.y,z,phi:o.phi,len:L,half:o.half||.3,life:T}));flash(o.el,m.x,m.y,z,.8*s,{life:T,s0:12*s,s1:20*s,star:0});
  A(new Emit({life:T-.15,every:.03,fn(){const d=R(.2,1)*L,p=fwd(o,d,R(-1,1)*d*.26);bits(S,o.el,p.x,p.y,z+R(-6,10),1,{dir:o.phi,spread:.4,sp:1.4,up:.5,size:1.1*s});}}));
  if(SMK[o.el])A(new Emit({life:T-.1,delay:.2,every:.1,fn(){const p=fwd(o,R(.6,1.05)*L,R(-.3,.3)*L);puffs(S,SMK[o.el],p.x,p.y,z,1,34*s,26,34,.7);}}));});
def('shot.star','shot','ดาวตกยิงตรง','shot','star',(o,s)=>{aim(o);const S=sys('top'),c=pal(o.el)[2];proj(o,s,{head:'star5',spin:14,r:10*s,speed:o.speed||640,trail:.26,tw:.9,emit(p){p._n=(p._n||0)+1;if(p._n%2===0)glints(S,c,p.cx,p.cy,p.cz,1,8*s,.4);},
    onHit(x,y,z){A(new Burst({el:o.el,x,y,z,r:34*s,n:5,life:.26,inner:.4}));flash(o.el,x,y,z,1.1*s);glints(S,c,x,y,z,8,34*s,.6);ring(o.el,x,y,40*s,{life:.3});bits(S,o.el,x,y,z,6,{only:0,size:s*.8});}});});
def('shot.drain','shot','ดูดพลังกลับ (เป้า → ผู้ใช้)','shot','blood',(o,s)=>{const t=aim(o),n=o.n||5,z=24*s;flash(o.el,t.x,t.y,z,.8*s);
  for(let i=0;i<n;i++)A(new Proj({el:o.el,x:t.x+R(-8,8),y:t.y+R(-6,6),z:z+R(-8,10),to:o.follow||null,tz:28*s,x2:o.x,y2:o.y,z2:28*s,delay:i*.07,head:'orb',r:5*s,curve:R(20,60)*(i%2?1:-1)*s,speed:360,ease:eI,trail:.2,tw:.9,
    onHit(x,y,z2){flash(o.el,x,y,z2,.5*s,{life:.12});if(i===n-1)ring(o.el,x,y,30*s,{w0:4*s,life:.3});}}));});
def('shot.dive','shot','เหยี่ยวโฉบ','shot','wind',(o,s)=>{const t=aim(o),S=sys('top'),im=spr('wing',o.el);
  A(new Proj({el:o.el,x:t.x-Math.cos(o.phi)*190*s,y:t.y-Math.sin(o.phi)*190*s,z:230*s,x2:t.x,y2:t.y,z2:24*s,r:10*s,speed:860,trail:.15,tw:1.2,nostar:1,
    head(p,x,y,r,an){ctx.save();ctx.translate(x,y);ctx.rotate(an);const w=34*s,h=w*im.height/im.width,f=.75+.25*Math.sin(p.t*40);ctx.rotate(Math.PI);ctx.drawImage(im,-w*.1,-h*f,w,h*f);ctx.scale(1,-1);ctx.drawImage(im,-w*.1,-h*f,w,h*f);ctx.restore();},
    onHit(x,y,z){A(new Cut({el:o.el,x,y,z,L:60*s,w:9*s,ang:.7,life:.2}));A(new Cut({el:o.el,x,y,z,L:60*s,w:9*s,ang:-.7,life:.2}));flash(o.el,x,y,z,s);ring(o.el,x,y,40*s,{life:.3});
      for(let i=0;i<qn(6);i++)S.add({im:spr('feather','holy'),x,y,z,vx:R(-90,90),vy:R(-60,60),vz:R(40,140),g:90,dr:2,s0:R(14,20)*s,life:R(.7,1.2),rot:R(0,TAU),vr:R(-3,3),wob:8,fo:.4});}}));});

/* =====================================================================
   BOOM — explosions and strikes on a ground point (x,y)
   ===================================================================== */
def('boom.blast','boom','ระเบิด','area','fire',(o,s)=>blast(o.el,o.x,o.y,s,o));
def('boom.nova','boom','คลื่นพลังรอบตัว (โนวา)','area','arcane',(o,s)=>{const r=(o.r||130)*s,S=sys('top');ring(o.el,o.x,o.y,r,{w0:16*s,life:.45});ring(o.el,o.x,o.y,r*.7,{delay:.08,w0:8*s,life:.4});lite(o.el,o.x,o.y,r,.5,.6);
  A(new Flash({el:o.el,x:o.x,y:o.y,z:26*s,s0:24*s,s1:90*s,life:.2}));bits(S,o.el,o.x,o.y,8*s,20,{sp:1.7,up:.5,size:s});});
def('boom.quake','boom','แผ่นดินแตก','area','earth',(o,s)=>{const r=(o.r||95)*s,S=sys('top');A(new Crack({el:o.el,x:o.x,y:o.y,r,n:7,life:1.8,w:3.6}));dark(o.x,o.y,r*.5,1.5,.28);ring(o.el,o.x,o.y,r*1.05,{w0:10*s});lite(o.el,o.x,o.y,r,.4,.4);
  bits(S,'earth',o.x,o.y,4,14,{up:1.2,size:1.1*s});if(o.el!=='earth')bits(S,o.el,o.x,o.y,8,8,{size:s});dust(o,o.x,o.y,r*.45,9,40*s,20);SH(4);});
def('boom.spikes','boom','หนามผุดเป็นวง','area','ice',(o,s)=>{const r=(o.r||70)*s,n=o.n||8,S=sys('top');lite(o.el,o.x,o.y,r*1.3,.6,.5);ring(o.el,o.x,o.y,r*1.3,{w0:8*s});dark(o.x,o.y,r*.9,1.2,.2);
  for(let i=0;i<n;i++){const a=i/n*TAU+R(-.15,.15),x=o.x+Math.cos(a)*r*.8,y=o.y+Math.sin(a)*r*.8;A(new Spike({el:o.el,x,y,h:R(46,66)*s,w:R(16,22)*s,lean:Math.cos(a)*.45,delay:.02*i,life:o.dur||1.1}));after(.02*i,()=>bits(S,o.el,x,y,10*s,2,{size:s*.7}));}
  A(new Spike({el:o.el,x:o.x,y:o.y+2,h:92*s,w:28*s,lean:R(-.1,.1),delay:.07,life:(o.dur||1.1)+.05}));after(.07,()=>{bits(S,o.el,o.x,o.y,20*s,8,{size:s});SH(2);});});
def('boom.spikeline','boom','หนามผุดแนวตรง','line','ice',(o,s)=>{const n=o.n||6,S=sys('top'),p0=fwd(o,18*s);A(new Crack({el:o.el,x:p0.x,y:p0.y,line:(n*34+10)*s,phi:o.phi,life:1.3,w:2.6,hot:.8}));
  for(let i=0;i<n;i++)after(i*.05,()=>{const p=fwd(o,(34+i*34)*s,(i%2?7:-7)*s);A(new Spike({el:o.el,x:p.x,y:p.y,h:(42+i*7)*s,w:(16+i*1.6)*s,lean:Math.cos(o.phi)*.35+R(-.1,.1),life:o.dur||.95}));bits(S,o.el,p.x,p.y,12*s,3,{size:s*.75});lite(o.el,p.x,p.y,30*s,.3,.4);if(i===n-1)SH(2);});});
const FLAMY={fire:1,ember:1,soul:1,dark:1,holy:1,arcane:1,volt:1,thunder:1,star:1,moon:1,wind:1};
def('boom.geyser','boom','ธาตุพุ่งจากพื้น (น้ำพุ / ลาวา)','area','water',(o,s)=>{const S=sys('top'),H=(o.h||150)*s;A(new Gush({el:o.el,x:o.x,y:o.y,w:40*s,h:H,life:o.dur||.85,tip:FLAMY[o.el]?'flame':'foam'}));dark(o.x,o.y,34*s,1.2,.25);ring(o.el,o.x,o.y,62*s);lite(o.el,o.x,o.y,66*s,.6,.5);
  bits(S,o.el,o.x,o.y,H*.3,12,{up:1.9,sp:.7,size:s});after(.12,()=>bits(S,o.el,o.x,o.y,H*.9,12,{up:.9,sp:1,size:s}));dust(o,o.x,o.y,22*s,5,24*s);SH(1.5);});
def('boom.pillar','boom','เสาแสงลงทัณฑ์','area','holy',(o,s)=>{const S=sys('top');A(new Sigil({el:o.el,x:o.x,y:o.y,r:50*s,n:4,life:1.15,spin:1.2}));
  after(.16,()=>{A(new Pillar({el:o.el,x:o.x,y:o.y,w:54*s,h:300*s,life:.8}));ring(o.el,o.x,o.y,84*s,{w0:10*s});lite(o.el,o.x,o.y,96*s,.6,.7);glints(S,pal(o.el)[3],o.x,o.y,20,10,44*s,.8);bits(S,o.el,o.x,o.y,10*s,10,{size:s,up:1.4});SH(2);});});
def('boom.strike','boom','ฟ้าผ่า','area','volt',(o,s)=>strike(o.el,o.x,o.y,s,o));
const METEOR={ice:'shard',star:'star5',moon:'moon',holy:'orb',arcane:'orb',soul:'orb',water:'orb',volt:'orb',thunder:'orb',wind:'orb',poison:'orb',nature:'rock',sakura:'orb'};
function meteor(o,s,x,y,k,done){const el=o.el,hd=METEOR[el]||'rock',S=sys('top'),sd=o.side||1;
  A(new Proj({el,x:x+150*s*sd,y:y-6,z:430*s,x2:x,y2:y,z2:0,head:hd,hpal:hd==='rock'?'earth':el,r:15*s*k,spin:hd==='rock'||hd==='star5'?7:0,speed:780,trail:.22,tw:1.25,
    emit(p){p._n=(p._n||0)+1;bits(S,el,p.cx,p.cy,p.cz,1,{size:s*k*.8,sp:.3,up:.2});if(p._n%4===0)puffs(S,smokeOf(el),p.cx,p.cy,p.cz,1,22*s*k,10,10,.5);},
    onHit(){blast(el,x,y,1.3*s*k,{shake:3+k});A(new Crack({el,x,y,r:66*s*k,n:6,life:1.6}));if(done)done();}}));}
def('boom.meteor','boom','อุกกาบาตตก','area','fire',(o,s)=>{const T=o.warn||0;if(T)A(new Tele({el:'red',x:o.x,y:o.y,r:80*s,life:T+.5}));after(T,()=>meteor(o,s,o.x,o.y,1));});
def('boom.rain','boom','ฝนห่าตก (ธนู / ดาว / น้ำแข็ง)','area','steel',(o,s)=>{const r=(o.r||85)*s,n=o.n||14,T=o.dur||.9,el=o.el,hd=o.head||HEAD[el]||'orb',S=sys('top'),stick=hd==='arrow'||hd==='sword'||hd==='shard';lite(el,o.x,o.y,r*1.1,T+.6,.3,{r0:r*1.1,fi:.2,fo:.4});
  for(let i=0;i<n;i++){const a=R(0,TAU),d=Math.sqrt(Math.random())*r,x=o.x+Math.cos(a)*d,y=o.y+Math.sin(a)*d;
    A(new Proj({el,x:x+70*s,y,z:400*s,x2:x,y2:y,z2:0,delay:i/n*T,head:hd,hw:HW[hd]||1,r:(hd==='arrow'?5.5:8)*s,spin:hd==='rock'||hd==='star5'?9:0,speed:1050,trail:.08,tw:.7,glow:el==='steel'?0:.8,nostar:1,
      onHit(){flash(el,x,y,4,.6*s,{life:.14});ring(el,x,y,22*s,{w0:3*s,life:.22});bits(S,el,x,y,4,3,{size:s*.7});
        if(stick){const im=spr(hd,el,i),k=P(x+70*s,y,400*s),g=P(x,y,0);A(new Spr({im,x,y,z:0,w:(hd==='arrow'?40:hd==='sword'?12:16)*s,rot:Math.atan2(g[1]-k[1],g[0]-k[0])-sprF(hd),ax:hd==='arrow'?.9:.5,ay:hd==='arrow'?.5:hd==='sword'?.92:.1,life:.7,fi:.01,fo:.3,layer:'sorted'}));}}}));}});
def('boom.storm','boom','เมฆพายุฟ้าคะนอง','area','volt',(o,s)=>{const r=(o.r||95)*s,T=o.dur||3,S=sys('top');dark(o.x,o.y,r,T,.26,{fi:.3,fo:.5});
  for(let i=0;i<3;i++)A(new Spr({im:spr('cloud','storm',i),x:o.x+(i-1)*r*.55,y:o.y+(i===1?-8:6),z:(190+(i===1?14:0))*s,w:(190-(i===1?0:30))*s,life:T,fi:.35,fo:.45,bob:4,bf:1.3+i*.3,layer:'top'}));
  A(new Emit({life:T-.3,delay:.35,every:o.every||.24,fn(){const a=R(0,TAU),d=Math.sqrt(Math.random())*r;strike(o.el,o.x+Math.cos(a)*d,o.y+Math.sin(a)*d,s*.8,{h:190,w:5,quiet:1});}}));
  A(new Emit({life:T-.3,delay:.3,every:.03,fn(){const a=R(0,TAU),d=Math.sqrt(Math.random())*r;S.add({im:spr('spark','water'),x:o.x+Math.cos(a)*d+26,y:o.y+Math.sin(a)*d,z:180*s,vx:-110,vz:-760,life:.23,s0:9,str:1.1,a0:.7,fi:.02,fo:.2});}}));});
def('boom.tornado','boom','พายุหมุน','area','wind',(o,s)=>{const T=o.dur||2.4,S=sys('sorted',o.y+2),B=BIT[o.el]||BIT.wind,tp={el:o.el,x:o.x,y:o.y,r0:13*s,r1:(o.r||54)*s,h:(o.h||150)*s,life:T};A(new Tornado(Object.assign({half:-1},tp)));A(new Tornado(Object.assign({half:1},tp)));
  A(new Ring({el:o.el,x:o.x,y:o.y,r0:26*s,r1:34*s,w0:5*s,w1:5*s,life:T,style:'dash',hold:1,spin:5}));dark(o.x,o.y,40*s,T,.25,{fo:.3});
  A(new Emit({life:T-.3,every:.05,fn(){const b=B[Math.random()<.35?1:0];S.add({im:spr(b[0],o.el,Math.random()*3|0),orb:1,cx:o.x,cy:o.y,ang:R(0,TAU),va:R(6,9),r:R(8,20)*s,vr2:R(20,44)*s,z:R(0,10),vz:R(80,150)*s,s0:R(9,15)*s,life:R(.7,1.1),rot:R(0,TAU),vr:R(-8,8),fo:.4});}}));
  A(new Emit({life:T-.2,every:.14,fn(){puffs(sys('sorted',o.y+1),dustP(o),o.x+R(-20,20)*s,o.y+R(-10,10)*s,2,1,30*s,60,12,.6);}}));});
def('boom.vortex','boom','หลุมดูด','area','dark',(o,s)=>{const r=(o.r||100)*s,T=o.dur||1.6,S=sys('top'),B=BIT[o.el]||BIT.dark;dark(o.x,o.y,r*.8,T+.2,.5,{fi:.2,fo:.3});A(new Sigil({el:o.el,x:o.x,y:o.y,r:r*.6,n:5,spin:-3.2,life:T+.1}));
  A(new Emit({life:T-.25,every:.2,fn(){A(new Ring({el:o.el,x:o.x,y:o.y,r0:r,r1:8*s,w0:2*s,w1:8*s,life:.5,ease:0,a:.9}));}}));
  A(new Emit({life:T-.3,every:.035,fn(){const b=B[Math.random()<.4?1:0],L=R(.4,.6),r0=r*R(.7,1.05);S.add({im:spr(b[0],o.el,Math.random()*3|0),orb:1,cx:o.x,cy:o.y,ang:R(0,TAU),va:R(5,8),r:r0,vr2:-r0/L,z:R(4,30)*s,vz:R(-10,30),s0:R(9,15)*s,s1:4*s,lin:1,life:L,rot:R(0,TAU),vr:R(-6,6),fi:.08,fo:.2});}}));
  after(T,()=>{A(new Flash({el:o.el,x:o.x,y:o.y,z:20*s,s0:20*s,s1:100*s,life:.22}));ring(o.el,o.x,o.y,r*.9,{w0:12*s,life:.4});burst(o.el,o.x,o.y,20*s,1.5*s);bits(S,o.el,o.x,o.y,16*s,14,{size:s,sp:1.4});SH(3);});});
def('boom.trap','boom','กับดักงับ','area','nature',(o,s)=>{const n=8,r=30*s,S=sys('top');ring(o.el,o.x,o.y,r*1.6,{w0:5*s,life:.3});dust(o,o.x,o.y,r*.5,5,22*s);
  for(let i=0;i<n;i++){const a=i/n*TAU;A(new Spike({el:o.el,x:o.x+Math.cos(a)*r,y:o.y+Math.sin(a)*r*.9,h:R(34,44)*s,w:11*s,lean:-Math.cos(a)*.6,life:o.dur||1.2,rise:.07}));}
  after(.07,()=>{flash(o.el,o.x,o.y,22*s,.9*s);bits(S,o.el,o.x,o.y,14*s,8,{size:s*.8});SH(1.5);});});
def('boom.swords','boom','ดาบแสงตกปัก','area','holy',(o,s)=>{const n=o.n||6,r=(o.r||60)*s,S=sys('top'),pts=[[0,0,.3]];for(let i=0;i<n;i++){const a=i/n*TAU+.3;pts.push([Math.cos(a)*r,Math.sin(a)*r,i*.045]);}
  lite(o.el,o.x,o.y,r*1.5,.9,.4,{fi:.1,fo:.4});A(new Sigil({el:o.el,x:o.x,y:o.y,r:r*1.15,n:6,life:1.3,spin:.5}));
  for(const [dx,dy,dl] of pts){const big=!dx&&!dy,x=o.x+dx,y=o.y+dy;A(new Spr({im:spr('sword',o.el),x,y,z:330*s,vz:-1700*s,gz:1,w:(big?30:18)*s,ay:.96,delay:dl,life:1.05,fi:.02,fo:.3,glow:pal(o.el)[2],gk:1.6,layer:'sorted',
      onLand(){flash(o.el,x,y,6,(big?1.5:.8)*s);ring(o.el,x,y,(big?70:30)*s,{w0:(big?8:4)*s,life:.3});bits(S,o.el,x,y,6,big?10:3,{size:s*.8});if(big){SH(2.5);A(new Crack({el:o.el,x,y,r:50*s,n:5,life:1.2}));}}}));}});
def('boom.cross','boom','กางเขนพิพากษา','area','holy',(o,s)=>{const S=sys('top'),c=pal(o.el);A(new Sigil({el:o.el,x:o.x,y:o.y,r:56*s,n:4,life:1.3,spin:.8}));
  after(.14,()=>{A(new Pillar({el:o.el,x:o.x,y:o.y,w:40*s,h:240*s,life:.75}));A(new Spr({im:spr('cross',o.el),x:o.x,y:o.y,z:60*s,vz:50*s,w:58*s,life:1,pop:.16,s0:.3,s1:1,fo:.4,glow:c[2],gk:1.5,layer:'top'}));
    ring(o.el,o.x,o.y,90*s,{w0:10*s});ring(o.el,o.x,o.y,60*s,{delay:.08,w0:5*s});lite(o.el,o.x,o.y,96*s,.7,.7);glints(S,c[3],o.x,o.y,30,12,50*s,.9);bits(S,o.el,o.x,o.y,20*s,8,{only:1,size:s,up:1.2});SH(2);});});
def('boom.wave','boom','คลื่นกระแทกวิ่งตามพื้น','line','earth',(o,s)=>{const D=(o.dist||230)*s,S=sys('top'),w=A(new Wave({el:o.el,x:o.x,y:o.y,phi:o.phi,dist:D,r:52*s,w:18*s,z:4,life:.5,layer:'ground'})),p0=fwd(o,20*s);
  A(new Crack({el:o.el,x:p0.x,y:p0.y,line:D*.9,phi:o.phi,life:1.3,w:2.6}));A(new Emit({life:.46,every:.035,fn(){const f=w.front();bits(S,'earth',f[0],f[1],4,1,{size:s*.8,up:.8});bits(S,o.el,f[0],f[1],8,1,{size:s*.7});puffs(sys('sorted',f[1]+1),dustP(o),f[0],f[1],3,1,26*s,20,16,.5);}}));SH(2);});
def('boom.shatter','boom','ผลึกแตกระเบิด','area','ice',(o,s)=>{const S=sys('top');A(new Flash({el:o.el,x:o.x,y:o.y,z:22*s,s0:24*s,s1:104*s,life:.2}));A(new Burst({el:o.el,x:o.x,y:o.y,z:22*s,r:46*s,n:10,life:.26}));bits(S,o.el,o.x,o.y,18*s,26,{only:0,size:1.1*s,sp:1.6,up:1.2});
  ring(o.el,o.x,o.y,80*s,{w0:9*s});lite(o.el,o.x,o.y,84*s,.45,.6);glints(S,pal(o.el)[3],o.x,o.y,10,10,60*s,.7);puffs(sys('sorted',o.y+1),smokeOf(o.el),o.x,o.y,8,5,44*s,60,16,.8);SH(2);});
def('boom.petal','boom','กลีบดอกไม้บานสะพรั่ง','area','sakura',(o,s)=>{const r=(o.r||90)*s,S=sys('top'),B=BIT[o.el]||BIT.sakura;ring(o.el,o.x,o.y,r,{w0:8*s,life:.45});lite(o.el,o.x,o.y,r,.6,.5);flash(o.el,o.x,o.y,22*s,1.1*s);
  for(let i=0;i<qn(26);i++)S.add({im:spr(B[0][0],o.el,i),orb:1,cx:o.x,cy:o.y,ang:R(0,TAU),va:R(3,5.5),r:R(6,16)*s,vr2:r*R(.9,1.5),z:R(6,30)*s,vz:R(20,70),s0:R(9,14)*s,life:R(.7,1.15),rot:R(0,TAU),vr:R(-6,6),fo:.45,delay:R(0,.12)});
  glints(S,pal(o.el)[3],o.x,o.y,14,8,r*.6,.7);});

/* =====================================================================
   ZONE — things that stay on the ground for a while (x,y, r, dur)
   ===================================================================== */
const inR=(o,r)=>{const a=R(0,TAU),d=Math.sqrt(Math.random())*r;return {x:o.x+Math.cos(a)*d,y:o.y+Math.sin(a)*d*.94};};
const rim=(el,x,y,r,T,o)=>A(new Ring(Object.assign({el,x,y,r0:r,r1:r,w0:3,w1:3,life:T,style:'dash',hold:1,spin:.5,a:.85},o)));
def('zone.fire','zone','ทะเลเพลิง','area','fire',(o,s)=>{const r=(o.r||80)*s,T=o.dur||3,S=sys('top');dark(o.x,o.y,r*.92,T,.36,{fi:.2,fo:.5});lite(o.el,o.x,o.y,r*1.15,T,.42,{r0:r*1.15,fi:.3,fo:.5});rim(o.el,o.x,o.y,r,T);
  A(new Emit({life:T-.5,every:.085,fn(){const p=inR(o,r*.86);A(new Flames({el:o.el,x:p.x,y:p.y,h:R(26,48)*s,w:R(16,26)*s,n:pick([2,3,3]),life:R(.7,1.1)}));if(Math.random()<.5)bits(S,o.el,p.x,p.y,10,1,{size:s*.7,only:1,up:.6,sp:.3});}}));});
def('zone.poison','zone','บึงพิษ','area','poison',(o,s)=>{const r=(o.r||80)*s,T=o.dur||3,c=pal(o.el),S=sys('sorted',o.y+r);A(new Disc({x:o.x,y:o.y,r0:r*.5,r1:r,life:T,kind:'pool',add:0,a:.5,col:c[1],fi:.3,fo:.5}));lite(o.el,o.x,o.y,r*.9,T,.25,{r0:r*.9,fi:.3,fo:.5});rim(o.el,o.x,o.y,r,T);
  A(new Emit({life:T-.5,every:.07,fn(){const p=inR(o,r*.85);S.add({im:spr('bubble',o.el),x:p.x,y:p.y,z:1,vz:R(16,40),s0:4*s,s1:R(9,16)*s,life:R(.5,.9),fi:.1,fo:.12,wob:2});}}));
  A(new Emit({life:T-.6,every:.22,fn(){const p=inR(o,r*.7);puffs(sys('sorted',p.y+1),o.el,p.x,p.y,6,1,70*s,14,18,1.2,'mist');}}));
  A(new Emit({life:T-.9,delay:.4,every:1.1,fn(){const p=inR(o,r*.5);A(new Spr({im:spr('skull',o.el),x:p.x,y:p.y,z:14*s,vz:26*s,w:20*s,life:1,fi:.25,fo:.5,a:.7,layer:'top'}));}}));});
def('zone.frost','zone','ลานน้ำแข็ง','area','ice',(o,s)=>{const r=(o.r||80)*s,T=o.dur||3,c=pal(o.el),S=sys('top');A(new Disc({x:o.x,y:o.y,r0:r*.4,r1:r,life:T,kind:'pool',add:0,a:.42,col:c[3],fi:.25,fo:.5}));A(new Sigil({el:o.el,x:o.x,y:o.y,r:r*.86,n:6,spin:.12,life:T,a:.85,fi:.3,fo:.5}));
  for(let i=0;i<9;i++){const a=i/9*TAU+R(-.2,.2);A(new Spike({el:o.el,x:o.x+Math.cos(a)*r*.92,y:o.y+Math.sin(a)*r*.9,h:R(16,30)*s,w:R(9,14)*s,lean:Math.cos(a)*.4,delay:.1+i*.03,life:T-.2-i*.03}));}
  A(new Emit({life:T-.5,every:.09,fn(){const p=inR(o,r*.9);bits(S,o.el,p.x,p.y,R(4,40),1,{only:1,size:s*.9});}}));
  A(new Emit({life:T-.6,every:.3,fn(){const p=inR(o,r*.7);puffs(sys('sorted',p.y+1),o.el,p.x,p.y,4,1,80*s,12,8,1.2,'mist');}}));});
def('zone.holy','zone','เขตศักดิ์สิทธิ์','area','holy',(o,s)=>{const r=(o.r||80)*s,T=o.dur||3,c=pal(o.el),S=sys('top');lite(o.el,o.x,o.y,r*1.15,T,.4,{r0:r*1.15,fi:.3,fo:.5});A(new Sigil({el:o.el,x:o.x,y:o.y,r:r*.92,n:4,spin:.3,life:T,fi:.3,fo:.5}));rays(o.el,o.x,o.y,r*.85,T,8);
  A(new Emit({life:T-.5,every:.12,fn(){const p=inR(o,r*.85);glints(S,c[3],p.x,p.y,R(6,50),1,6,.7);}}));
  A(new Emit({life:T-.9,delay:.3,every:.5,fn(){const p=inR(o,r*.7);S.add({im:spr('feather',o.el),x:p.x,y:p.y,z:R(70,110),vz:-34,vx:R(-14,14),s0:R(16,22)*s,life:1.6,rot:R(-.6,.6),wr:.5,wf:3,wob:12,fi:.2,fo:.4});}}));});
def('zone.dark','zone','เขตเงามืด','area','dark',(o,s)=>{const r=(o.r||80)*s,T=o.dur||3,S=sys('top');dark(o.x,o.y,r,T,.55,{fi:.3,fo:.5});A(new Sigil({el:o.el,x:o.x,y:o.y,r:r*.9,n:5,spin:-.4,life:T,fi:.3,fo:.5}));
  A(new Emit({life:T-.5,every:.07,fn(){const p=inR(o,r*.85);bits(S,o.el,p.x,p.y,2,1,{only:1,size:s});}}));
  A(new Emit({life:T-1,delay:.3,every:.42,fn(){const p=inR(o,r*.7);A(new Spr({im:spr('eye',o.el),x:p.x,y:p.y,z:R(10,26)*s,w:R(20,28)*s,life:.9,pop:.14,s0:.2,s1:1,fo:.3,layer:'top'}));}}));
  A(new Emit({life:T-.6,every:.3,fn(){const p=inR(o,r*.7);puffs(sys('sorted',p.y+1),o.el,p.x,p.y,4,1,80*s,12,14,1.2,'mist');}}));});
def('zone.heal','zone','เขตฟื้นฟู','area','nature',(o,s)=>{const r=(o.r||80)*s,T=o.dur||3,c=pal(o.el),S=sys('top');lite(o.el,o.x,o.y,r*1.1,T,.38,{r0:r*1.1,fi:.3,fo:.5});A(new Sigil({el:o.el,x:o.x,y:o.y,r:r*.9,n:6,spin:.25,life:T,fi:.3,fo:.5}));
  A(new Emit({life:T-.6,every:.11,fn(){floaters(S,spr('plus',o.el),o.x,o.y,r*.82,1,{s:11*s});if(Math.random()<.4){const p=inR(o,r*.8);bits(S,o.el,p.x,p.y,4,1,{only:0,size:s*.7,up:.6,sp:.3});}}}));
  A(new Emit({life:T-.5,every:.8,fn(){A(new Ring({el:o.el,x:o.x,y:o.y,r0:r*.2,r1:r,w0:5*s,w1:1,life:.7,a:.7}));}}));});
const SIGN={fire:3,ember:3,ice:6,water:6,volt:5,thunder:5,wind:6,earth:4,nature:6,poison:5,holy:4,dark:5,arcane:6,blood:5,steel:4,moon:8,star:5,soul:8,sakura:5,gold:4};
def('zone.circle','zone','วงเวทบนพื้น','area','arcane',(o,s)=>{const r=(o.r||80)*s,T=o.dur||3,S=sys('top');lite(o.el,o.x,o.y,r*1.1,T,.35,{r0:r*1.1,fi:.3,fo:.5});A(new Sigil({el:o.el,x:o.x,y:o.y,r:r*.92,n:o.n||SIGN[o.el]||6,spin:o.spin==null?.5:o.spin,life:T,fi:.3,fo:.5}));
  A(new Emit({life:T-.5,every:.07,fn(){const p=inR(o,r*.85);bits(S,o.el,p.x,p.y,2,1,{size:s*.8,up:.7,sp:.25});}}));
  A(new Emit({life:T-.5,every:.9,fn(){A(new Ring({el:o.el,x:o.x,y:o.y,r0:r*.2,r1:r,w0:5*s,w1:1,life:.7,a:.7}));}}));});
def('zone.blizzard','zone','พายุหิมะ','area','ice',(o,s)=>{const r=(o.r||90)*s,T=o.dur||3,c=pal(o.el),S=sys('top');A(new Disc({x:o.x,y:o.y,r0:r*.4,r1:r,life:T,kind:'pool',add:0,a:.34,col:c[3],fi:.25,fo:.5}));rim(o.el,o.x,o.y,r,T,{spin:2.5});
  A(new Emit({life:T-.5,every:.03,fn(){const g=Math.random()<.4;S.add({im:spr(g?'gust':'snow',g?'white':o.el),orb:1,cx:o.x,cy:o.y,ang:R(0,TAU),va:R(2.6,4.4),r:r*R(.25,1),z:R(6,80)*s,vz:R(-8,20),s0:(g?R(22,34):R(8,13))*s,life:R(.6,1),face:g?1:0,rot:R(0,TAU),vr:g?0:R(-4,4),fi:.15,fo:.3,a0:g?.75:1});}}));
  A(new Emit({life:T-.6,every:.22,fn(){const p=inR(o,r*.8);puffs(sys('sorted',p.y+1),'cloud',p.x,p.y,6,2,90*s,40,8,1.1,'mist');}}));
  A(new Emit({life:T-.6,delay:.2,every:.45,fn(){const p=inR(o,r*.8);A(new Spike({el:o.el,x:p.x,y:p.y,h:R(18,34)*s,w:R(9,14)*s,life:.8}));}}));});
def('zone.song','zone','บทเพลงรอบกองไฟ','area','ember',(o,s)=>{const r=(o.r||85)*s,T=o.dur||3,S=sys('top'),ims=[spr('note',o.el,0),spr('note',o.el,1)];lite(o.el,o.x,o.y,r*1.1,T,.34,{r0:r*1.1,fi:.3,fo:.5});rim(o.el,o.x,o.y,r,T);
  A(new Emit({life:T-.5,every:.55,fn(){A(new Ring({el:o.el,x:o.x,y:o.y,r0:r*.12,r1:r,w0:4*s,w1:1,life:.8,a:.75}));}}));
  A(new Emit({life:T-.7,every:.13,fn(){floaters(S,ims,o.x,o.y,r*.8,1,{s:13*s,wob:7,wr:.25,p:{wf:5}});}}));});
def('zone.light','zone','แสงตะเกียงนำทาง','area','ember',(o,s)=>{const r=(o.r||85)*s,T=o.dur||3,c=pal(o.el),S=sys('top');lite(o.el,o.x,o.y,r*1.2,T,.5,{r0:r*1.2,fi:.3,fo:.5});rim(o.el,o.x,o.y,r,T,{a:.6});
  A(new Spr({im:spr('lantern',o.el),x:o.x,y:o.y,z:46*s,w:24*s,life:T,pop:.25,s0:.3,s1:1,fo:.4,bob:4,bf:2,wr:.12,wf:2,glow:c[2],gk:2.4,layer:'sorted'}));
  A(new Emit({life:T-.6,every:.1,fn(){const p=inR(o,r*.9);S.add({im:tex('core',c[2]),x:p.x,y:p.y,z:R(8,60),vx:R(-12,12),vy:R(-8,8),vz:R(-4,10),s0:R(5,9),s1:3,life:R(1,1.7),fi:.3,fo:.5,add:1,wob:9,wf:R(2,4)});}}));});
def('zone.thunder','zone','สนามไฟฟ้าสถิต','area','volt',(o,s)=>{const r=(o.r||80)*s,T=o.dur||3,S=sys('top');lite(o.el,o.x,o.y,r*1.1,T,.3,{r0:r*1.1,fi:.2,fo:.4});rim(o.el,o.x,o.y,r,T,{spin:3});
  A(new Emit({life:T-.4,every:.05,fn(){const p=inR(o,r*.9);bits(S,o.el,p.x,p.y,R(2,26),1,{only:0,size:s});}}));
  A(new Emit({life:T-.4,every:.17,fn(){const a=inR(o,r*.9),b=inR(o,r*.9);A(new Bolt({el:o.el,x:a.x,y:a.y,z:4,x2:b.x,y2:b.y,z2:4,w:3*s,life:.16,jag:9,branch:1,layer:'ground'}));if(Math.random()<.4)flash(o.el,b.x,b.y,6,.6*s);}}));});
def('zone.thorns','zone','ดงหนาม','area','nature',(o,s)=>{const r=(o.r||80)*s,T=o.dur||3,c=pal(o.el),S=sys('top');A(new Disc({x:o.x,y:o.y,r0:r*.5,r1:r,life:T,kind:'pool',add:0,a:.3,col:c[0],fi:.3,fo:.5}));rim(o.el,o.x,o.y,r,T);
  for(let i=0;i<14;i++){const p=i<9?{x:o.x+Math.cos(i/9*TAU)*r*.88,y:o.y+Math.sin(i/9*TAU)*r*.84}:inR(o,r*.6),dl=.05+i*.03;A(new Spr({im:spr('thorn',o.el),x:p.x,y:p.y,w:R(34,46)*s,ay:.92,flipX:Math.random()<.5,delay:dl,life:T-dl,pop:.2,s0:.1,s1:1,fo:.3,wr:.05,wf:2,layer:'sorted'}));}
  A(new Emit({life:T-.6,every:.16,fn(){const p=inR(o,r*.8);bits(S,o.el,p.x,p.y,8,1,{only:0,size:s*.7,up:.5,sp:.3});}}));});
def('zone.wall','zone','กำแพงธาตุ','line','fire',(o,s)=>{const L=(o.len||170)*s,T=o.dur||3,n=Math.max(3,Math.round(L/(22*s))),S=sys('top'),c=fwd(o,(o.dist==null?70:o.dist)*s),solid=SOLID[o.el];
  for(let i=0;i<n;i++){const u=(i/(n-1)-.5)*L,x=c.x-Math.sin(o.phi)*u,y=c.y+Math.cos(o.phi)*u,dl=Math.abs(i-(n-1)/2)*.03;lite(o.el,x,y,32*s,T,.3,{r0:32*s,delay:dl,fi:.2,fo:.4});
    if(solid)A(new Spike({el:o.el,x,y,h:R(44,62)*s,w:R(18,24)*s,lean:R(-.12,.12),delay:dl,life:T-dl}));else A(new Flames({el:o.el,x,y,h:R(48,62)*s,w:26*s,n:3,delay:dl,life:T-dl}));}
  A(new Emit({life:T-.5,every:.07,fn(){const u=R(-.5,.5)*L;bits(S,o.el,c.x-Math.sin(o.phi)*u,c.y+Math.cos(o.phi)*u,R(8,40),1,{size:s*.8,up:.7,sp:.3});}}));});

/* =====================================================================
   CAST — while a skill is being cast (follow = the caster, or x,y)
   ===================================================================== */
const at=o=>o.follow||{x:o.x,y:o.y,z:0};
def('cast.gather','cast','รวบพลังเข้ามือ','unit','arcane',(o,s)=>{const T=o.dur||.5,u=at(o),zz=(o.z||0)+34*s,S=sys('top'),c=pal(o.el),B=BIT[o.el]||BIT.arcane;
  A(new Emit({life:T-.12,every:.028,fn(){const a=R(0,TAU),e=R(-.3,1),d=R(46,70)*s,b=B[Math.random()<.5?1:0];S.add({im:spr(b[0],o.el,Math.random()*3|0),x:u.x+Math.cos(a)*d,y:u.y+Math.sin(a)*d*.6,z:(u.z||0)+zz+e*d*.6,to:u,tz:zz,s0:R(9,14)*s,s1:3*s,lin:1,life:R(.2,.3),rot:R(0,TAU),vr:R(-6,6),fi:.05,fo:.1});}}));
  A(new Fn({layer:'top',follow:o.follow||null,x:o.x,y:o.y,z:zz,life:T,fi:.08,fo:.06,d(q,k){const p=q.pos(),m=P(p[0],p[1],p[2]),r=(8+20*k)*s*(1+.08*Math.sin(q.t*40));glowAt(m[0],m[1],r*2.2,c[2],.7*q.fade());coreAt(m[0],m[1],r,c[2],q.fade());}}));
  after(T,()=>{flash(o.el,u.x,u.y,(u.z||0)+zz,1.1*s);});});
def('cast.circle','cast','วงเวทขณะร่าย','unit','arcane',(o,s)=>{const T=o.dur||1,u=at(o),S=sys('top'),c=pal(o.el),r=(o.r||46)*s;A(new Sigil({el:o.el,follow:o.follow||null,x:o.x,y:o.y,r,n:o.n||SIGN[o.el]||6,spin:1.4,life:T,fi:.2,fo:.2}));
  A(new Ring({el:o.el,follow:o.follow||null,x:o.x,y:o.y,r0:r*1.6,r1:r*.9,w0:2,w1:5,life:.35,ease:1}));
  A(new Emit({life:T-.2,every:.06,fn(){const a=R(0,TAU);glints(S,c[3],u.x+Math.cos(a)*r*.8,u.y+Math.sin(a)*r*.75,R(4,30),1,3,.6);}}));});
def('cast.release','cast','ปล่อยพลัง','unit','arcane',(o,s)=>{const u=at(o),z=(u.z||0)+(o.z||0)+34*s;A(new Flash({el:o.el,x:u.x,y:u.y,z,s0:18*s,s1:84*s,life:.2}));ring(o.el,u.x,u.y,60*s,{w0:7*s,life:.3});
  bits(sys('top'),o.el,u.x,u.y,z,10,{dir:o.phi,spread:.7,sp:1.4,size:s*.9});});
def('cast.charge','cast','ชาร์จพลัง','unit','arcane',(o,s)=>{const T=o.dur||.9,u=at(o),S=sys('top'),c=pal(o.el),z=(o.z||0)+30*s;
  A(new Emit({life:T-.3,every:.24,fn(){A(new Ring({el:o.el,follow:o.follow||null,x:o.x,y:o.y,r0:74*s,r1:10*s,w0:1.5,w1:6*s,life:.36,ease:0}));}}));
  A(new Emit({life:T-.15,every:.03,fn(){const a=R(0,TAU),d=R(50,76)*s;S.add({im:tex('core',c[2]),x:u.x+Math.cos(a)*d,y:u.y+Math.sin(a)*d,z:(u.z||0)+R(0,20),to:u,tz:z,s0:R(6,9)*s,s1:2,lin:1,life:R(.2,.3),add:1,str:1.4,fi:.04,fo:.1});}}));
  A(new Fn({layer:'top',follow:o.follow||null,x:o.x,y:o.y,z,life:T,fi:.1,fo:.06,d(q,k){const p=q.pos(),m=P(p[0],p[1],p[2]),r=(6+26*k*k)*s*(1+.1*Math.sin(q.t*46));glowAt(m[0],m[1],r*2.4,c[2],.7*q.fade());coreAt(m[0],m[1],r,c[2],q.fade());starAt(m[0],m[1],r*1.6,c[3],k*q.fade(),q.t*2);}}));
  after(T,()=>{burst(o.el,u.x,u.y,(u.z||0)+z,1.3*s);flash(o.el,u.x,u.y,(u.z||0)+z,1.5*s);ring(o.el,u.x,u.y,70*s);});});
def('cast.chant','cast','อักขระโคจรรอบตัว','unit','arcane',(o,s)=>{const T=o.dur||1.3,ims=[0,1,2,3,4].map(i=>spr('rune',o.el,i+(Math.random()*3|0)));
  A(new Sigil({el:o.el,follow:o.follow||null,x:o.x,y:o.y,r:40*s,n:o.n||SIGN[o.el]||6,spin:-1,life:T,fi:.2,fo:.2,a:.9}));K_.orbit({im:ims,n:5,r:34*s,z:(o.z||0)+30*s,spin:2.6,w:15*s,bob:4,follow:o.follow||null,x:o.x,y:o.y,life:T,glow:pal(o.el)[2]});});
})();
