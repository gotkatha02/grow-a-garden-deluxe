/* =====================================================================
   AETHERFALL — HAND-DRAWN DAMAGE DIGITS (marker style: chunky white stroke, thick grey outline, slight wobble)
   Every glyph is a stroke skeleton (box: width w, height 1, y down) drawn with round caps, then cached per colour style.
   window.AFGlyph.draw(ctx, text, size, style) draws centred at (0,0). Unknown characters fall back to a font.
   ===================================================================== */
(function(){
const E=72;   // cache resolution (px per em)
const ell=(cx,cy,rx,ry,n=26,a0=-Math.PI/2)=>{const p=[];for(let i=0;i<=n;i++){const a=a0+i/n*Math.PI*2;p.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]);}return p;};
const G={
 '0':{w:.6,s:[ell(.3,.5,.25,.44)]},
 '1':{w:.42,s:[[[.08,.26],[.22,.12],[.3,.04],[.3,.96]]]},
 '2':{w:.62,s:[[[.07,.27],[.14,.12],[.31,.04],[.48,.1],[.55,.27],[.48,.46],[.3,.64],[.07,.92],[.3,.9],[.58,.9]]]},
 '3':{w:.6,s:[[[.07,.13],[.26,.04],[.45,.08],[.53,.24],[.44,.39],[.26,.46]],[[.26,.46],[.47,.53],[.56,.7],[.5,.87],[.3,.96],[.12,.93],[.04,.84]]]},
 '4':{w:.66,s:[[[.44,.96],[.44,.05],[.06,.66],[.64,.66]]]},
 '5':{w:.6,s:[[[.54,.06],[.15,.06],[.11,.44],[.3,.37],[.48,.43],[.56,.63],[.5,.85],[.3,.96],[.06,.88]]]},
 '6':{w:.6,s:[[[.5,.06],[.3,.15],[.13,.38],[.08,.64],[.16,.88],[.33,.96],[.5,.88],[.56,.7],[.48,.52],[.3,.47],[.14,.55],[.09,.66]]]},
 '7':{w:.6,s:[[[.04,.07],[.58,.06],[.42,.4],[.26,.96]]]},
 '8':{w:.6,s:[ell(.3,.27,.2,.22,22,Math.PI/2),ell(.3,.71,.25,.25,24,-Math.PI/2)]},
 '9':{w:.6,s:[ell(.3,.31,.24,.26,24,0),[[.54,.32],[.52,.62],[.42,.84],[.26,.96]]]},
 '+':{w:.6,s:[[[.06,.52],[.54,.52]],[[.3,.28],[.3,.76]]]},
 '-':{w:.48,s:[[[.08,.52],[.42,.52]]]},
 '!':{w:.3,s:[[[.15,.06],[.14,.62]],[[.14,.9],[.15,.91]]]},
 ',':{w:.24,s:[[[.13,.84],[.08,1.02]]]},
};
const STY={
 hit:{f:'#f8f8f4',o:'#6e6e6e',d:'#3a3a3a'},
 crit:{f:'#ffe45a',o:'#b8561a',d:'#5a2008'},
 magic:{f:'#d8f2ff',o:'#4a7cc8',d:'#16336a'},
 total:{f:'#ffffff',o:'#6a6a6a',d:'#303030'},
 mtotal:{f:'#d8f2ff',o:'#3f6fbf',d:'#12306a'},
 heal:{f:'#d6ffc8',o:'#4c9a48',d:'#1a4a1a'},
 taken:{f:'#ffd8d8',o:'#c0424e',d:'#5a0e18'},
 miss:{f:'#eef2fa',o:'#727a8a',d:'#2c3240'},
 lucky:{f:'#fff0b0',o:'#b88a2a',d:'#4a3006'},
};
let seed=1;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
/* Chaikin smoothing → soft marker curves; small seeded jitter → hand-drawn wobble */
function soft(pts,closed){let p=pts.map(([x,y])=>[x+(rnd()-.5)*.025,y+(rnd()-.5)*.02]);
  for(let k=0;k<2;k++){const n=[];if(!closed)n.push(p[0]);for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1];n.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75]);}if(!closed)n.push(p[p.length-1]);else n.push(n[0]);p=n;}return p;}
const cache=new Map();
function glyph(ch,sk){const key=ch+'|'+sk;let c=cache.get(key);if(c)return c;const g=G[ch],st=STY[sk]||STY.hit;if(!g)return null;
  seed=ch.charCodeAt(0)*977+7;const pad=.32,W=Math.ceil((g.w+pad*2)*E),H=Math.ceil((1+pad*2)*E);
  c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.lineCap='round';x.lineJoin='round';
  const paths=g.s.map(s=>{const closed=s.length>8&&Math.hypot(s[0][0]-s[s.length-1][0],s[0][1]-s[s.length-1][1])<.02;return soft(s,closed);});
  const path=(ox=0,oy=0)=>{x.beginPath();for(const p of paths){p.forEach(([px,py],i)=>{const X=(px+pad)*E+ox,Y=(py+pad)*E+oy;i?x.lineTo(X,Y):x.moveTo(X,Y);});}};
  // 1) dark rim (soft shadow edge) · 2) grey outline drawn twice slightly offset = rough marker edge · 3) white core · 4) grain
  path(0,E*.03);x.lineWidth=E*.42;x.strokeStyle=st.d;x.globalAlpha=.55;x.stroke();x.globalAlpha=1;
  path(-E*.008,0);x.lineWidth=E*.36;x.strokeStyle=st.o;x.stroke();path(E*.01,E*.006);x.lineWidth=E*.35;x.stroke();
  const core=document.createElement('canvas');core.width=W;core.height=H;const y=core.getContext('2d');y.lineCap='round';y.lineJoin='round';
  y.beginPath();for(const p of paths){p.forEach(([px,py],i)=>{const X=(px+pad)*E,Y=(py+pad)*E;i?y.lineTo(X,Y):y.moveTo(X,Y);});}y.lineWidth=E*.2;y.strokeStyle=st.f;y.stroke();
  y.globalCompositeOperation='source-atop';for(let i=0;i<70;i++){y.fillStyle=rnd()<.6?'rgba(0,0,0,.10)':'rgba(255,255,255,.35)';const r=E*(.006+rnd()*.016);y.beginPath();y.arc(rnd()*W,rnd()*H,r,0,7);y.fill();}
    y.fillStyle='rgba(0,0,0,.08)';y.fillRect(0,H*.62,W,H);   // slightly darker lower half, like a marker stroke
  x.drawImage(core,0,0);c.w=g.w;c.pad=pad;cache.set(key,c);return c;}
/* draw text centred at (0,0); returns false if it contains characters we can't draw */
function draw(ctx,text,S,sk){const s=String(text);for(const ch of s)if(!G[ch])return false;
  const adv=ch=>G[ch].w*S*.86;   /* tight, overlapping marker look */
  let total=0;for(const ch of s)total+=adv(ch);let x=-total/2;let i=0;
  for(const ch of s){const c=glyph(ch,sk);const h=(ch.charCodeAt(0)*31+i*17)%9-4,rot=h*.022,dy=((ch.charCodeAt(0)*7+i*5)%5-2)*S*.025,k=S/E;
    ctx.save();ctx.translate(x+adv(ch)/2,dy);ctx.rotate(rot);ctx.drawImage(c,-c.width*k/2,-c.height*k/2,c.width*k,c.height*k);ctx.restore();x+=adv(ch);i++;}
  return true;}
window.AFGlyph={draw,STY,glyph};
})();
