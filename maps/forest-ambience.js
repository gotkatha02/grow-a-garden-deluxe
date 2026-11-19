(function(root){'use strict';
// All motion is driven by one pausable clock. No changes to terrain collision.
root.createForestAmbience=function({image,trees,strength=()=>1.25,treeOffsets=()=>({x:0,y:0})}){
const make=(w,h)=>{let c=document.createElement('canvas');c.width=w;c.height=h;return c};
const runeAreas=[[134,754,48,67],[194,655,72,128],[299,713,43,63]],runes=runeAreas.map(([x,y,w,h])=>{let c=make(w,h),q=c.getContext('2d');q.drawImage(image,x,y,w,h,0,0,w,h);let a=q.getImageData(0,0,w,h);for(let i=0;i<a.data.length;i+=4){let r=a.data[i],g=a.data[i+1],b=a.data[i+2],yes=g-r>12&&b-r>15&&r>65;a.data[i]=112;a.data[i+1]=225;a.data[i+2]=255;a.data[i+3]=yes?190:0}q.putImageData(a,0,0);return {x,y,w,h,image:c}});
const puff=make(64,64),pq=puff.getContext('2d'),pr=pq.createRadialGradient(32,32,0,32,32,32);pr.addColorStop(0,'#eff8ffff');pr.addColorStop(.3,'#eff8ff99');pr.addColorStop(1,'#eff8ff00');pq.fillStyle=pr;pq.fillRect(0,0,64,64);
const mist=[{x:1280,y:203,w:36,h:15},{x:1050,y:579,w:32,h:14},{x:946,y:810,w:32,h:13},{x:867,y:933,w:28,h:12},{x:1373,y:96,w:23,h:11}];
const sources=[]; // Tree snow now comes from the same travelling gust as the branches.
const drips=[[1363,289],[1390,281],[1428,298],[1274,167],[1054,550],[958,785],[877,910]];
let cachedTime=-1;const power=()=>Math.max(.5,Math.min(1.6,strength()));
function ground(g,t,night){cachedTime=t;g.save();g.globalCompositeOperation='screen';for(let i=0;i<runes.length;i++){const r=runes[i];g.globalAlpha=(night?.52:.29)*(.65+.35*Math.sin(t*.0012+i*.9));g.drawImage(r.image,r.x,r.y)}g.restore();
 // Low, brief drifting powder crosses open snow rather than a full-screen fog.
 for(let k=0;k<6;k++){const period=8+k*1.9,v=((t/1000+k*4.3)%period)/period;if(v>.48)continue;let u=v/.48,x=140+u*1180,y=[315,440,560,685,805,910][k],a=Math.sin(u*Math.PI)**2;g.save();g.globalAlpha=a*(night?.09:.15)*(.65+.35*Math.max(0,root.forestWind(x,y,t).force));g.drawImage(puff,x-100,y-14,195,28);g.drawImage(puff,x-45,y-5,150,20);g.restore();for(let j=0;j<25;j++){let xx=x-115+j*9,yy=y+Math.sin(j*3.7+u*8)*4;g.save();g.globalAlpha=a*.34*power();g.fillStyle='#eef7ff';g.beginPath();g.ellipse(xx,yy,1+j%3*.25,.5,0,0,7);g.fill();g.restore()}}
 // Sparse short snow glints, with unrelated phases instead of flashing rows.
 for(let i=0;i<21;i++){let phase=(t/1000+i*1.91)%7;if(phase>.9)continue;let x=280+(i*137)%630,y=240+(i*113)%530,a=Math.sin(phase/.9*Math.PI);g.save();g.globalAlpha=a*(night?.15:.32);g.strokeStyle='#f8ffff';g.lineWidth=.8;g.beginPath();g.moveTo(x-2,y);g.lineTo(x+2,y);g.moveTo(x,y-2);g.lineTo(x,y+2);g.stroke();g.restore()}
}
function foreground(g,t,night,objectsVisible=true){const sec=t/1000;
 for(let k=0;k<mist.length;k++){let f=mist[k];for(let i=0;i<8;i++){let v=(sec*.34+i/8+k*.13)%1,alpha=Math.sin(v*Math.PI)*.13*power();g.save();g.globalAlpha=alpha;g.drawImage(puff,f.x-f.w*.5+Math.sin(v*3+k)*6-v*5,f.y-v*26,f.w*(1.5+v),f.h*(1.6+v*1.2));g.restore()}}
 for(let k=0;k<sources.length;k++){if(!objectsVisible)continue;let s=sources[k],age=(sec+s.phase)%s.period;if(age>2.8)continue;for(let i=0;i<37;i++){let life=age-i*.031;if(life<0||life>1.8)continue;let offset=k<trees.length?treeOffsets(k,t):{x:0,y:0};let x=s.x+offset.x*.5+Math.sin(i*2.8)*12+life*(16+Math.sin(sec*.8)*8)*power(),y=s.y+life*life*31+i%3;g.save();g.globalAlpha=Math.sin(life/1.8*Math.PI)*.55;g.fillStyle='#f0f7ff';g.beginPath();g.arc(x,y,.65+i%3*.3,0,7);g.fill();g.restore()}}
 for(let i=0;i<drips.length;i++){let age=(sec+i*.71)%(1.7+i*.23);if(age>.85)continue;const [x,y]=drips[i];g.save();g.globalAlpha=Math.sin(age/.85*Math.PI)*.42;g.fillStyle='#c2efff';g.beginPath();g.ellipse(x+Math.sin(i)*.5,y+age*age*36,.8,1.9,0,0,7);g.fill();g.restore()}
 // Passing eddies of wind lift powder in the open clearings.
 for(let k=0;k<3;k++){const age=(sec+k*5.7)%(13+k*3);if(age>3.6)continue;let u=age/3.6,cx=[440,820,1210][k]+u*95,cy=[490,650,540][k],a=Math.sin(u*Math.PI);for(let i=0;i<22;i++){let v=(u+i/22)%1,angle=v*9+sec*2.2,x=cx+Math.cos(angle)*(8+v*22),y=cy-v*46+Math.sin(angle)*4;g.save();g.globalAlpha=a*(1-v)*.34*power();g.fillStyle='#edf7ff';g.beginPath();g.arc(x,y,.8+i%3*.35,0,7);g.fill();g.restore()}}
 for(let k=0;k<mist.length;k++){const f=mist[k];for(let i=0;i<9;i++){let v=(sec*.83+i/9+k*.19)%1,dx=Math.sin(i*2.5)*v*20,dy=-Math.sin(v*Math.PI)*11+v*7;g.save();g.globalAlpha=Math.sin(v*Math.PI)*.38;g.fillStyle='#c8efff';g.beginPath();g.ellipse(f.x+dx,f.y+dy,.9,1.4,0,0,7);g.fill();g.restore()}}
 g.save();g.fillStyle=night?'#d9e9fa':'#fff';for(let i=0;i<148;i++){const depth=.55+(i%4)*.22,wind=Math.sin(sec*.35+i*.3),x=((i*137.3+sec*13*depth+wind*17)%1536+1536)%1536,y=(i*83.7+sec*23*depth)%1024;g.globalAlpha=(.17+(i%3)*.085)*power();g.beginPath();g.arc(x,y,(.8+i%3*.46)*depth,0,7);g.fill()}g.restore()
}
return {ground,foreground,get clock(){return cachedTime},counts:{mist:mist.length,snowSources:sources.length,runes:runes.length,drips:drips.length}};
};
})(typeof window==='undefined'?globalThis:window);
