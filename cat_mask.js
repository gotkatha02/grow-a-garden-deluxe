/* Cat · Ashura Mask worn on the face (owner 2026-11-21).
   Cut from the owner's sheet of the cat WEARING the mask (diff against the plain sheet, hat removed) (assets/fx/cat/mask8_<S|SE|E|NE|N>.webp, W side mirrored).
   OFF[view] = [dx, dy, width] of the mask in units of the hat width, measured on his character sheet.
   HAT[state][dir][frame] = hat centre in sprite-cell px, tracked on every frame of the cat atlas
   (frames where the sword hides the hat are interpolated), HW = idle hat width per dir.
   The mask is drawn after the cat, then the hat is cut out of it, so it sits UNDER the hat brim. */
(function(){if(typeof CHAR==='undefined'||CHAR!=='cat'||/[?&]vfx3=0/.test(location.search))return;
const OFF={"S":[-0.0,0.413,0.861],"SE":[0.006,0.486,0.887],"E":[-0.047,0.42,1.094],"NE":[-0.113,0.462,1.133],"N":[0.024,0.23,0.7]},HW={"S": 81.8, "SE": 75.0, "E": 65.0, "NE": 58.3, "N": 98.2},HAT={"idle":{"S":[[359.8,290.1],[359.8,289.8],[360.1,288.8],[359.8,287.7],[359.3,286.2],[359.4,285.1],[359.2,284.2],[358.8,283.5],[359.1,283.4],[358.9,283.4],[358.6,283.7],[358.7,284.2]],"SE":[[359.1,286.8],[359.5,286.8],[360.1,287.3],[360.2,287.5],[360.7,287.6],[361.2,287.9],[361.5,287.9],[361.7,288.0],[362.0,288.1],[362.0,288.0],[362.3,288.0],[361.8,287.8]],"E":[[360.3,290.2],[360.3,290.2],[362.8,291.4],[366.3,293.0],[365.0,292.2],[361.5,290.5],[360.6,290.1],[360.5,290.1],[360.6,290.2],[360.4,290.2],[360.5,290.2],[360.3,290.1]],"NE":[[370.9,293.4],[368.8,292.7],[366.4,291.7],[365.1,290.5],[365.2,290.2],[366.3,290.4],[368.8,290.7],[370.4,291.2],[370.3,291.3],[370.4,291.4],[370.2,291.7],[370.6,292.3]],"N":[[358.7,294.0],[358.8,293.7],[358.7,293.9],[358.3,295.4],[358.6,298.1],[358.9,299.5],[358.6,299.9],[358.4,299.0],[359.0,297.7],[358.4,296.5],[359.0,295.4],[358.6,294.5]]},"walk":{"S":[[352.0,286.5],[352.8,286.3],[359.9,285.9],[366.3,286.1],[370.3,286.3],[371.9,286.4],[368.3,285.7],[360.9,285.4]],"SE":[[359.0,291.2],[358.9,290.5],[358.9,287.4],[358.8,288.2],[359.1,291.2],[358.8,290.5],[358.9,286.6],[358.8,288.1]],"E":[[360.3,294.5],[360.2,291.0],[360.3,291.5],[360.4,295.2],[360.2,294.0],[360.3,291.4],[360.4,290.8],[360.6,294.9]],"NE":[[370.2,290.9],[370.4,294.4],[370.5,299.1],[370.4,295.1],[370.1,290.8],[370.5,293.9],[370.4,299.0],[370.4,295.5]],"N":[[357.1,296.1],[358.0,294.8],[359.0,299.4],[359.8,299.0],[359.2,295.7],[358.5,294.7],[357.2,298.0],[356.8,298.7]]},"attack":{"S":[[361.5,288.2],[368.8,295.0],[364.3,297.6],[359.1,300.8],[358.9,300.4],[348.5,296.6],[351.4,297.5],[354.3,298.3],[357.1,299.1],[360.0,300.0],[362.9,300.9],[365.8,301.7],[365.8,301.7],[365.8,300.9]],"SE":[[359.4,290.4],[349.1,296.4],[347.7,298.4],[348.0,299.6],[348.3,300.8],[348.6,301.3],[348.4,301.2],[348.7,301.3],[348.6,301.5],[348.8,302.0],[350.2,302.5],[352.8,299.3],[357.6,292.9],[359.3,289.1]],"E":[[360.3,290.1],[360.6,291.0],[360.6,292.7],[360.2,294.8],[359.6,297.3],[358.9,300.9],[358.5,302.5],[358.0,304.1],[358.4,300.9],[358.9,297.8],[359.2,294.3],[359.9,292.0],[360.2,290.7],[360.1,290.3]],"NE":[[370.1,292.1],[370.6,292.9],[369.8,295.6],[368.5,297.2],[371.8,291.3],[373.2,296.5],[372.9,302.7],[372.2,306.8],[371.9,307.0],[372.6,302.4],[372.1,293.7],[370.8,291.8],[370.1,291.2],[370.4,291.2]],"N":[[358.4,294.5],[359.6,296.4],[364.4,302.2],[374.2,302.1],[373.8,301.1],[373.5,300.1],[373.1,299.1],[372.8,298.0],[372.4,297.0],[372.1,296.0],[371.7,295.0],[368.2,295.1],[362.7,294.8],[360.1,294.6]]},"buff":{"S":[[360.0,285.4],[360.1,285.4],[363.8,285.8],[368.0,290.0],[367.2,307.4],[361.8,330.9],[362.2,339.6],[361.1,287.2],[360.2,285.2],[359.5,285.4],[359.8,285.4],[359.8,285.4]],"SE":[[358.7,286.3],[358.8,286.2],[358.7,286.6],[368.1,296.1],[379.6,322.7],[381.8,334.7],[381.9,337.3],[381.2,336.4],[379.7,324.0],[369.0,298.6],[360.8,288.5],[358.4,286.3]],"E":[[360.2,290.1],[360.4,290.1],[362.7,290.7],[372.0,296.1],[381.4,307.2],[387.2,316.3],[390.4,323.0],[383.8,308.7],[375.4,298.0],[367.9,293.2],[362.9,291.0],[360.3,290.3]],"NE":[[370.1,291.5],[370.2,291.5],[370.2,291.6],[374.5,294.4],[380.2,301.5],[385.0,312.7],[388.0,329.0],[370.4,291.6],[370.4,291.6],[370.3,291.6],[370.2,291.6],[370.1,291.6]],"N":[[358.7,294.3],[358.2,294.9],[359.0,295.5],[363.1,298.9],[362.8,298.9],[362.6,299.1],[362.0,310.1],[362.4,312.0],[362.5,304.5],[362.6,300.8],[362.8,299.1],[362.2,298.5]]},"hurt":{"S":[[359.8,288.1],[359.8,287.1],[359.9,288.1],[359.9,288.0],[359.6,289.1],[359.9,290.1],[359.6,290.1]],"SE":[[336.1,286.8],[321.1,288.7],[328.3,287.6],[340.1,286.5],[347.7,287.0],[354.8,286.9],[359.3,286.7]],"E":[[336.7,291.0],[321.2,292.8],[329.4,291.8],[340.8,290.8],[348.9,290.4],[356.1,290.2],[360.3,290.1]],"NE":[[348.3,294.3],[334.1,295.2],[341.1,294.7],[352.4,294.2],[359.3,293.2],[366.7,293.3],[370.9,293.4]],"N":[[358.7,296.0],[358.7,297.1],[358.8,296.1],[358.8,296.0],[358.6,295.0],[358.9,294.0],[358.6,294.1]]}};
window.CAT_HAT={HAT,HW};const IM={};for(const v in OFF){const im=new Image();im.src='assets/fx/cat/mask8_'+v+'.webp?v=2';IM[v]=im;}
const CR=new Image();CR.src='assets/fx/cat/mask_white_crack.webp';
const HC={},PAD=70;
function straw(r,g,b){return r>170&&g>120&&b<150&&r-b>60&&r>=g&&g-b>30;}
function hatCut(st,d,f,r){const k=st+'|'+d+'|'+f;if(HC[k]!==undefined)return HC[k];const src=SPRITE.img[st];if(!src||!src.complete||!src.naturalWidth)return null;
  const [ax,ay,aw,ah]=r,c=document.createElement('canvas');c.width=aw;c.height=ah;const g=c.getContext('2d');g.drawImage(src,ax,ay,aw,ah,0,0,aw,ah);
  let D;try{D=g.getImageData(0,0,aw,ah);}catch(e){return HC[k]=null;}const p=D.data;let top=ah,bot=0;
  for(let y=0;y<ah;y++)for(let x=0;x<aw;x++)if(p[(y*aw+x)*4+3]>128){if(y<top)top=y;if(y>bot)bot=y;}
  const lim=top+.4*(bot-top),m=new Uint8Array(aw*ah);
  for(let y=0;y<Math.min(ah,lim);y++)for(let x=0;x<aw;x++){const i=(y*aw+x)*4;if(p[i+3]>128&&straw(p[i],p[i+1],p[i+2]))m[y*aw+x]=1;}
  const o=g.createImageData(aw,ah),q=o.data,R=2;   // dilate 2 px so the hat's outline cuts too
  for(let y=0;y<ah;y++)for(let x=0;x<aw;x++){let on=0;for(let j=-R;j<=R&&!on;j++)for(let i=-R;i<=R;i++){const X=x+i,Y=y+j;if(X>=0&&Y>=0&&X<aw&&Y<ah&&m[Y*aw+X]){on=1;break;}}
    if(on&&p[(y*aw+x)*4+3]>40){q[(y*aw+x)*4+3]=255;}}
  g.clearRect(0,0,aw,ah);g.putImageData(o,0,0);return HC[k]=c;}
const T=document.createElement('canvas'),TG=T.getContext('2d');
const KMW=window.KMW={on:0,a:0,crack:-1,oniT:-1};
function face(){const fr=playerFrame(),r=frameRect(fr.st,fr.d,fr.f);if(!r)return null;const mir=isMir(fr.d),sd=(SPR_META.mirror&&SPR_META.mirror[fr.d])||fr.d,o=OFF[sd],L=HAT[fr.st]&&HAT[fr.st][sd];if(!o||!L)return null;
  const h=L[Math.min(fr.f,L.length-1)],hw=HW[sd],cx=h[0]+o[0]*hw,cy=h[1]+o[1]*hw,[x,y]=P(player.x,player.y,player.z||0),k=SPR*CHAR_SCALE;
  return {x:x+((mir?SPR_META.cell.w-cx:cx)-SPR_META.pivot.x)*k,y:y+(cy-SPR_META.pivot.y)*k,w:OFF.S[2]*HW.S*k};}
/* Ashura oni (owner's video 2026-11-21): a fire-spirit oni rises behind the cat and lowers the fox mask onto its face.
   ashura_oni.webp = the oni (luminance-keyed, frames 1-105 every 2nd, 53 frames 233x288, 8 cols, 24 fps), drawn on the ground layer;
   ashura_oni_mask.webp = the same frames with only the mask, drawn in front of the cat. CEN[i] = mask centre / width in a frame.
   The clip is anchored so the mask of the last frame lands on the cat's face; then the worn mask takes over. */
const CEN=[[164.2,104.3,38.4],[164.5,104.4,38.4],[162.4,99.8,38.4],[162.4,100.0,38.4],[162.6,100.2,38.4],[162.6,100.5,39.0],[162.8,101.1,39.0],[163.3,101.8,37.8],[163.7,102.9,38.4],[164.5,104.2,37.8],[165.5,105.9,38.4],[166.7,108.2,38.4],[167.9,110.7,37.8],[172.2,120.0,37.2],[170.9,117.4,39.0],[172.3,121.4,39.0],[173.8,125.5,39.6],[170.0,129.2,55.2],[178.7,141.1,37.8],[173.0,137.9,54.6],[174.3,141.8,54.6],[178.1,147.4,39.0],[178.8,152.3,40.2],[179.3,156.9,40.2],[178.4,160.8,45.0],[180.0,166.3,40.2],[179.7,170.5,40.2],[180.0,175.0,40.2],[179.9,179.1,40.2],[179.7,182.2,40.8],[179.6,186.1,40.8],[179.5,189.6,40.2],[182.5,203.8,37.8],[182.3,207.0,37.8],[178.9,198.8,40.8],[181.8,212.7,37.8],[178.2,203.9,40.8],[178.0,206.3,40.2],[177.8,207.9,40.2],[180.7,220.9,38.4],[180.6,222.7,39.0],[177.4,212.4,40.8],[177.2,213.4,40.8],[177.2,214.6,40.2],[177.1,215.5,40.2],[180.0,227.6,37.8],[180.0,228.0,38.4],[179.7,228.2,37.8],[179.6,228.4,37.8],[179.7,228.5,37.8],[179.5,228.6,38.4],[176.7,217.1,40.8],[179.8,229.0,38.4]],NF=CEN.length,FPS=24,ONI=new Image(),ONM=new Image();ONI.src='assets/fx/cat/ashura_oni.webp?v=1';ONM.src='assets/fx/cat/ashura_oni_mask.webp?v=1';
function oniDraw(im){const t=KMW.oniT;if(t<0||!im.complete||!im.naturalWidth)return;const f=face();if(!f)return;const i=Math.min(NF-1,Math.floor(t*FPS)),fw=im.naturalWidth/8,fh=Math.round(im.naturalHeight/Math.ceil(NF/8)),
    c=CEN[NF-1],s=f.w/c[2],mir=KMW.oniMir,al=Math.min(1,t/.25)*(t>NF/FPS?Math.max(0,1-(t-NF/FPS)/.3):1);if(al<=0)return;
  ctx.save();ctx.globalAlpha*=al;ctx.translate(f.x,f.y);if(mir)ctx.scale(-1,1);ctx.drawImage(im,(i%8)*fw,Math.floor(i/8)*fh,fw,fh,-c[0]*s,-c[1]*s,fw*s,fh*s);ctx.restore();}
class KAshuraOni{constructor(){this.layer='ground';}update(dt){return KMW.oniT>=0;}draw(){oniDraw(ONI);}}
function draw(){if(KMW.oniT>=0&&KMW.oniT<NF/FPS)oniDraw(ONM);if(!KMW.on&&KMW.crack<0)return;const fr=playerFrame(),r=frameRect(fr.st,fr.d,fr.f);if(!r)return;
  const mir=isMir(fr.d),sd=(SPR_META.mirror&&SPR_META.mirror[fr.d])||fr.d,o=OFF[sd],L=HAT[fr.st]&&HAT[fr.st][sd];if(!o||!L)return;
  const h=L[Math.min(fr.f,L.length-1)],hw=HW[sd],[ax,ay,aw,ah,bx,by]=r;
  let im=IM[sd],w=o[2]*hw,cx=h[0]+o[0]*hw,cy=h[1]+o[1]*hw,al=KMW.a,sh=0,s=1;
  if(KMW.crack>=0){const t=KMW.crack;if(/S/.test(fr.d)&&CR.complete&&CR.naturalWidth)im=CR;sh=t<.18?Math.sin(t*90)*1.5:0;s=1+.22*Math.min(1,t/.42);al=Math.max(0,1-Math.max(0,t-.2)/.22);}
  if(!im||!im.complete||!im.naturalWidth||al<=.01)return;
  const ih=w*im.naturalHeight/im.naturalWidth,W=aw+PAD*2,H=ah+PAD*2;if(T.width!==W||T.height!==H){T.width=W;T.height=H;}else TG.clearRect(0,0,W,H);
  TG.globalCompositeOperation='source-over';TG.drawImage(im,cx-bx+PAD-w*s/2+sh,cy-by+PAD-ih*s/2,w*s,ih*s);
  const hc=hatCut(fr.st,sd,fr.f,r);if(hc&&KMW.crack<0){TG.globalCompositeOperation='destination-out';TG.drawImage(hc,PAD,PAD);TG.globalCompositeOperation='source-over';}
  const [x,y]=P(player.x,player.y,player.z||0),k=SPR*CHAR_SCALE;ctx.save();ctx.globalAlpha*=al;
  const dy=y+(by-PAD-SPR_META.pivot.y)*k;
  if(mir){const bxm=SPR_META.cell.w-(bx+aw);ctx.translate(x+(bxm-PAD-SPR_META.pivot.x)*k+W*k,dy);ctx.scale(-1,1);ctx.drawImage(T,0,0,W*k,H*k);}
  else ctx.drawImage(T,x+(bx-PAD-SPR_META.pivot.x)*k,dy,W*k,H*k);ctx.restore();}
const D0=window.drawPlayer;window.drawPlayer=function(){D0.apply(this,arguments);try{draw();}catch(e){}};
let last=0;function tick(){const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;
  if(KMW.oniT>=0){const was=KMW.oniT<NF/FPS;KMW.oniT+=dt;if(was&&KMW.oniT>=NF/FPS){KMW.wear();if(KMW.pendOn&&window.KTV&&KTV._ashuraOn0){KMW.pendOn=0;KTV._ashuraOn0();}}if(KMW.oniT>NF/FPS+.35)KMW.oniT=-1;}
  if(KMW.crack>=0){KMW.crack+=dt;if(KMW.crack>.45)KMW.crack=-1;}
  else if(KMW.on){KMW.a=Math.min(1,KMW.a+dt*12);if(!hasBuff('kbAshura')&&(KMW.t=(KMW.t||0)+dt)>1.5){KMW.on=0;}}
  requestAnimationFrame(tick);}requestAnimationFrame(t=>{last=t;tick();});
window.KMW.wear=function(){KMW.on=1;KMW.a=1;KMW.t=0;KMW.crack=-1;};
window.KMW.off=function(){KMW.on=0;KMW.crack=0;KMW.oniT=-1;};
if(window.KTV){const S0=KTV.ashuraStart,O0=KTV.ashuraOn;KTV._ashuraOn0=O0;
  KTV.ashuraStart=function(tW){if(!ONI.complete||!ONI.naturalWidth)return S0&&S0.apply(this,arguments);KMW.on=0;KMW.crack=-1;KMW.oniT=0;KMW.oniMir=Math.cos(player.phi||0)<0;KMW.pendOn=0;addFx(new KAshuraOni());};
  KTV.ashuraOn=function(){if(KMW.oniT>=0&&KMW.oniT<NF/FPS){KMW.pendOn=1;return;}return O0&&O0.apply(this,arguments);};}
})();
