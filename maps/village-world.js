/* Snowbound: a compact settlement around a shared square, not an empty forest clearing. */
(function(root){
const buildings=[];
function building(id,name,kind,x,base,w,h,extra={}){let front=[[x+w*.08,base-w*.20],[x+w*.30,base-w*.04],[x+w*.94,base-w*.14]];let foot=[...front,[x+w*.68,base-w*.43]];buildings.push({id,name,kind,x,y:base-h,w,h,baseY:base,front,foot,entry:{x:x+w*.62,y:base+32},...extra})}
building('hall','หอประชุม','hall',1040,650,720,480,{windows:[[.112,.60,.021,.056],[.178,.67,.016,.046],[.333,.683,.023,.06],[.884,.592,.02,.057],[.512,.587,.01,.022],[.768,.55,.01,.022]]});
building('family','บ้านครอบครัว','familyNew',410,920,360,350,{smoke:[.416,.06],windows:[[.571,.674,.062,.085],[.68,.348,.028,.045],[.356,.675,.013,.05],[.87,.598,.018,.035]]});
building('warrior','บ้านนักรบ','warriorNew',2000,900,375,313,{windows:[[.567,.412,.023,.025],[.647,.408,.023,.025],[.124,.655,.023,.07],[.587,.692,.055,.065],[.339,.554,.018,.03]]});
building('hunter','บ้านนายพราน','hunter',280,1310,330,300);
building('fisher','บ้านชาวประมง','fisher',570,1620,380,300);
building('elder','บ้านผู้อาวุโส','elder',2210,1320,330,300,{smoke:[.23,.06]});
building('weaver','บ้านช่างทอผ้า','weaver',1890,1620,360,300);
building('market','ร้านค้าประจำหมู่บ้าน','market',950,1130,280,220);
building('smith','โรงตีเหล็ก','smith',1630,1155,370,270,{smoke:[.68,.09],windows:[[.55,.62,.09,.09]]});
const extraWindows={"hunter": [[0.525, 0.677, 0.067, 0.08], [0.91, 0.69, 0.024, 0.04]], "fisher": [[0.422, 0.352, 0.027, 0.055], [0.652, 0.34, 0.027, 0.055], [0.489, 0.674, 0.11, 0.08], [0.905, 0.625, 0.025, 0.04]], "elder": [[0.285, 0.682, 0.12, 0.1], [0.838, 0.626, 0.026, 0.05]], "weaver": [[0.523, 0.675, 0.07, 0.08], [0.717, 0.545, 0.026, 0.035], [0.89, 0.685, 0.02, 0.04]], "market": [[0.135, 0.557, 0.045, 0.09], [0.836, 0.55, 0.045, 0.09]], "smith": [[0.343, 0.687, 0.11, 0.1], [0.205, 0.538, 0.03, 0.06]]};for(let b of buildings)if(extraWindows[b.id])b.windows=extraWindows[b.id];
let seed=533;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const trees=[];function pine(x,base,k,h){const ratios=[315/680,565/600,375/525,260/355,500/680];trees.push({id:'pine'+trees.length,kind:'tree'+k,x:x-h*ratios[k]/2,y:base-h,w:h*ratios[k],h,base,solid:{x,y:base-7,r:14+h*.018}})}
// Forest lives outside the residential streets. Staggered pockets leave the entrance open.
for(let row=0;row<2;row++)for(let x=15;x<2800;x+=140+rand()*85){let xx=x+(rand()-.5)*75;pine(xx,50+row*125+rand()*85,Math.floor(rand()*5),230+rand()*105)}
for(let side of [0,1])for(let y=390;y<1850;y+=155+rand()*95){let x=side?2690+rand()*100:40+rand()*95;pine(x,y,Math.floor(rand()*5),250+rand()*100);if(rand()>.45)pine(side?2810:0,y+65,Math.floor(rand()*5),230+rand()*100)}
for(let side of [0,1])for(let x=40;x<1050;x+=150+rand()*80)pine(side?1750+x:x,1860+rand()*90,Math.floor(rand()*5),240+rand()*110);
for(let a of [[790,430,0,220],[845,475,3,130],[1840,430,4,240],[250,650,2,180],[2530,750,0,210],[170,1450,3,150],[2585,1520,2,190],[1030,1740,3,140],[1770,1740,0,200]])pine(...a);
const props=[];function prop(id,kind,x,y,w,h,r=0){props.push({id,kind,x,y,w,h,base:y+h,...(r?{solid:{x:x+w*.5,y:y+h-12,r}}:{})})}
prop('well','well',1370,825,150,178,41);props[props.length-1].entry={x:1450,y:1045};
prop('fire','fire',1300,1162,190,122,45);
prop('bench1','bench',1200,1320,140,86,36);prop('bench2','bench',1495,1235,130,80,33);
prop('familyWood','wood',375,890,92,79,28);prop('familyBarrels','barrels',725,890,72,71,23);
prop('hunterLogs','wood',225,1250,86,74,25);prop('hunterSled','sled',510,1335,115,77,32);
prop('fisherFish','fish',930,1507,108,87,25);prop('fisherBarrels','barrels',518,1560,75,74,24);
prop('elderSeat','bench',2470,1320,110,67,28);prop('elderWood','wood',2180,1290,80,69,23);
prop('weaverCrates','crates',2215,1555,86,78,25);prop('weaverBasket','basket',1845,1580,66,65,20);
prop('marketGoods','crates',865,1080,95,86,26);prop('marketBarrels','barrels',1230,1063,74,73,24);
prop('smithWood','wood',1980,1100,90,78,27);prop('smithCrates','crates',1900,1163,78,71,22);
// Low yard corners face the streets; their open ends keep the approach to each door clear.
for(let [x,y,w,h]of [[285,815,180,95],[730,925,160,84],[170,1170,155,82],[620,1285,155,82],[465,1555,150,79],[2020,915,145,76],[2430,1280,150,79],[1795,1510,150,79]])prop('fence'+props.length,'yardFence',x,y,w,h,w*.20);
prop('communalWood','wood',500,365,150,130,40);props[props.length-1].entry={x:680,y:535};prop('woodBaskets','basket',660,447,62,61,20);prop('woodReserve','crates',425,440,82,74,24);
const dressing=[];function dress(kind,x,base,w,layer='front'){let ratios={shrub:.5,youngPine:.6,snowBank:115/485,grass:185/410,twig:220/300,rocks:.3};let h=w*ratios[kind];let o={id:'dress'+dressing.length,kind,x,y:base-h,w,h,base,layer};if(kind==='shrub'||kind==='youngPine')o.solid={x:x+w*.5,y:base-7,r:w*.17};dressing.push(o)}
for(let b of buildings){dress('snowBank',b.x+b.w*.02,b.baseY-b.w*.12,b.w*.25);dress('snowBank',b.x+b.w*.79,b.baseY-b.w*.08,b.w*.22);dress('shrub',b.x-32,b.baseY+24,82);dress('grass',b.x+b.w*.86,b.baseY+38,68,'ground');dress('twig',b.x+b.w*.98,b.baseY+32,35)}
for(let [k,x,y,w]of [['shrub',1010,1420,98],['youngPine',1650,1420,100],['rocks',1140,1400,85],['grass',1510,1350,62],['shrub',250,1360,92],['shrub',2540,1390,85],['youngPine',1010,715,85],['shrub',1750,720,100],['shrub',970,1650,85],['youngPine',2200,1670,85],['rocks',750,1015,74],['grass',2120,1000,66],['shrub',825,1160,100],['grass',2040,1200,65]])dress(k,x,y,w);
for(let [i,t]of trees.entries())if(i%4===0&&t.base>200)dress(i%3?'grass':'snowBank',t.solid.x-35,t.base+4,70,'ground');
const flags=[{id:'flagHall',kind:'flag',x:1745,y:540,w:50,h:145,base:685,phase:.4,solid:{x:1769,y:676,r:11}},{id:'flagSquare',kind:'flag',x:1545,y:1370,w:45,h:125,base:1495,phase:2.7,solid:{x:1567,y:1486,r:10}}];
const points=[{x:1400,y:1780},...buildings.map(b=>b.entry),props.find(o=>o.id==='well').entry,props.find(o=>o.id==='communalWood').entry,{x:1410,y:1410}];
root.VILLAGE={width:2800,height:1900,buildings,trees,props,dressing,flags,points};
})(typeof window==='undefined'?globalThis:window);
