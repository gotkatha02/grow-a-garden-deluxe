#!/usr/bin/env python3
"""Aetherfall city floor (maps/capital/cpCityFloor5.webp) — the painted floor of the capital, generated from the map's own textures.

  python3 tools/city_floor.py            (run from the repo root; needs numpy, scipy, Pillow)

Owner 2026-11-20: the capital was the least pretty map (blurry floor with ghosted street bands, flat, buildings pasted on).
This draws one crisp 3648x2816 picture for the walled city, laid 1:1 over map rect [576,672,4224,3488] by maps/capital-maps.js:
  - pale stone streets and the two royal avenues (greek/grMarble, tinted; tiled from map 0,0 so the gate floors the game lays
    with the same texture join without a seam)
  - cobbled terraces on the 8x8 block grid of capital-maps.js (CX / RY): a carved kerb lit from the upper left, a visible riser on
    the south side and a soft shadow on the street, so the blocks read as raised; halls that span two blocks get one terrace
  - kerbed lawns (LAWN) and flower beds (BEDS) — the game plants grass, flowers and trees on them at runtime
  - the round royal plaza where the avenues cross, the castle forecourt, a small court inside the north gate
No building shadows are baked in: the map's light model (cfg.lit in maps/fieldmap.js) draws those at runtime.
If the block grid, the lawns or the beds change here, change the same lists in maps/capital-maps.js (c.lawns).
"""
import numpy as np, sys
from PIL import Image
from scipy import ndimage as ndi
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T=os.path.join(ROOT,'maps','')
W,H=3648,2816;S=1254;fx=W/S;fy=H/S
CX=[[22,146],[159,279],[291,426],[438,549],[703,815],[827,962],[975,1095],[1109,1232]]
RY=[[22,132],[144,248],[259,366],[376,549],[696,876],[886,995],[1007,1109],[1121,1232]]
BX=[(round(a*fx),round(b*fx)) for a,b in CX];BY=[(round(a*fy),round(b*fy)) for a,b in RY]
LAWN={'2,1','5,1','5,6'}
BEDS={'0,2','7,2','2,2','5,2','0,3','0,5','7,5','5,5','0,6','7,6'}
# halls that stand across two blocks get ONE terrace (the lane between them is built over); 'brick' = the stall square
MERGE={(2,3):(3,3),(4,3):(5,3),(4,4):(5,4),(6,3):(7,3),(2,5):(3,5),(6,1):(7,1),(2,4):(3,4),(2,6):(3,6)}
SURF={(2,6):'brick'}
FORE={(3,0),(4,0),(3,1),(4,1)}
PCX,PCY=(BX[3][1]+BX[4][0])/2,(BY[3][1]+BY[4][0])/2;PRX,PRY=575.,430.
rng=np.random.default_rng(611)
def load(n,scale):
    im=Image.open(T+n+'.webp').convert('RGB');w,h=im.size
    im=im.resize((max(8,round(w*scale)),max(8,round(h*scale))),Image.LANCZOS);return np.asarray(im).astype(np.float32)/255
def tiled(tex,w,h,ox=0,oy=0):
    th,tw=tex.shape[:2];ys=(np.arange(h)+oy)%th;xs=(np.arange(w)+ox)%tw;return tex[ys][:,xs]
def tint(a,target):
    m=a.mean(axis=(0,1));return a*(np.array(target,np.float32)/255/m)
TEX={'cobble':load('japan/jpPave',.5),'slab':load('greek/grMarble',.5),'brick':load('capital/cpPave',.5),'plaza':load('capital/cpPlaza',.62),'grass':load('capital/cpGrass',.7)}
# palette (means the textures are pulled to)
STREET=(226,208,170);AVENUE=(234,219,184);COBBLE=(168,152,134);KERB=(214,198,166);FORECOURT=(242,231,204);GRASS=(112,160,62);SOIL=(92,132,56)
OX,OY=576,672                                  # where the picture sits on the map
canvas=tint(tiled(TEX['slab'],W,H,OX,OY),STREET)
YY,XX=np.mgrid[0:H,0:W].astype(np.float32)
def sd_rrect(X,Y,x0,y0,x1,y1,r):
    cx,cy=(x0+x1)/2,(y0+y1)/2;hx,hy=(x1-x0)/2-r,(y1-y0)/2-r
    qx=np.abs(X-cx)-hx;qy=np.abs(Y-cy)-hy
    return np.hypot(np.maximum(qx,0),np.maximum(qy,0))+np.minimum(np.maximum(qx,qy),0)-r
def sd_ell(X,Y,cx,cy,rx,ry):
    x=(X-cx);y=(Y-cy);f=np.sqrt((x/rx)**2+(y/ry)**2)+1e-6;g=np.sqrt((x/rx**2)**2+(y/ry**2)**2)/f+1e-9;return (f-1)/g
def cov(d):return np.clip(.5-d,0,1)          # anti-aliased coverage of {d<0}
LIGHT=np.array([-.55,-.83],np.float32)        # sun in the upper left
def bevel(d):
    gy,gx=np.gradient(d);n=np.hypot(gx,gy)+1e-6;return (gx/n)*LIGHT[0]+(gy/n)*LIGHT[1],gx/n,gy/n
# ---------- avenues (the royal cross) ----------
ax0,ax1=BX[3][1],BX[4][0];ay0,ay1=BY[3][1],BY[4][0]
av=np.zeros((H,W),np.float32);av[:,ax0:ax1]=1;av[ay0:ay1,:]=1
aven=tint(tiled(TEX['slab'],W,H,OX,OY),AVENUE)
# a worn, slightly lighter middle and a darker course along both edges
dx=np.minimum(np.abs(XX-ax0),np.abs(XX-ax1));dy=np.minimum(np.abs(YY-ay0),np.abs(YY-ay1))
edge=np.where(av>0,np.where((XX>ax0)&(XX<ax1)&((YY<ay0)|(YY>ay1)),dx,np.where((YY>ay0)&(YY<ay1)&((XX<ax0)|(XX>ax1)),dy,np.maximum(dx,dy))),0)
aven*=(0.97+0.05*np.clip(edge/150,0,1))[...,None]
canvas=np.where(av[...,None]>0,aven,canvas)
# ---------- castle forecourt (flush white marble with a border course) ----------
fx0,fy0,fx1,fy1=BX[3][0],-40,BX[4][1],BY[1][1]
d=sd_rrect(XX,YY,fx0,fy0,fx1,fy1,26)
fore=tint(tiled(TEX['slab'],W,H,40,200),FORECOURT)
m=cov(d)[...,None];canvas=canvas*(1-m)+fore*m
band=((d>-16)&(d<0)).astype(np.float32)[...,None];canvas=canvas*(1-band)+(canvas*np.array([.93,.9,.84],np.float32))*band
line=(np.abs(d+16)<1.2).astype(np.float32)[...,None];canvas*=1-.28*line
line=(np.abs(d)<1.4).astype(np.float32)[...,None];canvas*=1-.34*line
# ---------- raised terraces ----------
def terrace(x0,y0,x1,y1,kind='cobble',r=18,kw=10,hgt=8,cut=True,seed=0):
    global canvas
    pad=30;wx0,wy0,wx1,wy1=max(0,x0-pad),max(0,y0-pad),min(W,x1+pad),min(H,y1+pad+hgt)
    X=XX[wy0:wy1,wx0:wx1];Y=YY[wy0:wy1,wx0:wx1]
    d=sd_rrect(X,Y,x0,y0,x1,y1,r)
    if cut:
        hit=[c for c in CUTS if (c(X,Y)<0).any() and ((c(X,Y)<0)&(d<0)).any()]
        if hit:
            # cut by the plaza or a gate court: build the shape at 2x, drop slivers thinner than 2*t and round every corner (opening), then a true distance field
            ww,hh=X.shape[1],X.shape[0];X2=(np.arange(ww*2,dtype=np.float32)+.5)/2-.5+X[0,0];Y2=(np.arange(hh*2,dtype=np.float32)+.5)/2-.5+Y[0,0];X2,Y2=np.meshgrid(X2,Y2)
            m=(sd_rrect(X2,Y2,x0,y0,x1,y1,2)<0)
            for c in hit:m&=c(X2,Y2)>0
            t=r*2;er=ndi.distance_transform_edt(m)>t;op=ndi.distance_transform_edt(~er)<=t
            d2=(ndi.distance_transform_edt(~op)-ndi.distance_transform_edt(op)).astype(np.float32)
            d2=ndi.gaussian_filter(d2,1.6)/2;d=d2.reshape(hh,2,ww,2).mean(axis=(1,3))
    if not (d<0).any():return None
    win=canvas[wy0:wy1,wx0:wx1]
    dlow=np.empty_like(d);dlow[hgt:]=d[:-hgt];dlow[:hgt]=9                 # the silhouette pushed down by the riser height
    top=cov(d);sil=np.maximum(top,cov(dlow))
    # contact shadow on the street: the whole silhouette, pushed to the lower right, blurred
    sh=ndi.gaussian_filter(np.roll(np.roll(sil,4,axis=0),5,axis=1),4.2)
    win*=(1-.42*sh*(1-sil))[...,None]
    win*=(1-.22*ndi.gaussian_filter(sil,9)*(1-sil))[...,None]
    # riser (south face)
    ris=np.clip(sil-top,0,1);kc=np.array(KERB,np.float32)/255
    rcol=np.broadcast_to(kc*.56,win.shape).copy();j=(((X+seed*7)%36)<1.4);rcol[j]*=.72
    rcol*=(1-.18*np.clip((Y-(y1))/hgt,0,1))[...,None]
    win[:]=win*(1-ris[...,None])+rcol*ris[...,None]
    # top: kerb + surface
    s,nx,ny=bevel(d)
    if kind=='grass':surf=tint(tiled(TEX['grass'],wx1-wx0,wy1-wy0,wx0+seed*53,wy0+seed*31),GRASS)
    elif kind=='soil':surf=tint(tiled(TEX['grass'],wx1-wx0,wy1-wy0,wx0+seed*53,wy0+seed*31),SOIL)
    elif kind=='brick':surf=tint(tiled(TEX['brick'],wx1-wx0,wy1-wy0,wx0,wy0),(222,196,164))
    else:
        j1,j2=rng.random()-.5,rng.random()-.5
        surf=tint(tiled(TEX['cobble'],wx1-wx0,wy1-wy0,wx0+seed*97,wy0+seed*61),COBBLE)*np.array([1+j1*.06+j2*.05,1+j1*.06,1+j1*.06-j2*.06],np.float32)
    kerb=tint(tiled(TEX['slab'],wx1-wx0,wy1-wy0,wx0+11,wy0+7),KERB)
    kerb=kerb*.35+kc*.65                                            # dressed stone: mostly even, a little of the marble's grain
    horiz=np.abs(ny)>np.abs(nx);jt=np.where(horiz,((X+seed*13)%38)<1.3,((Y+seed*5)%38)<1.3)
    kerb=np.where(jt[...,None],kerb*.7,kerb)
    lit=np.clip(s,0,1);drk=np.clip(-s,0,1);outer=np.clip((d+3.2)/3.2,0,1)   # 0 inside → 1 at the very edge
    kerb=kerb*(1+.05*s)[...,None]
    kerb=kerb+(outer*lit*.22)[...,None];kerb=kerb*(1-(outer*drk*.36))[...,None]
    inner=cov(d+kw)                                                 # coverage of the surface inside the kerb
    if kind in('grass','soil'):
        # soil lies a little below the kerb: the kerb on the sun side shades it
        dsh=sd_rrect(X-7,Y-10,x0,y0,x1,y1,r)+kw
        shade=ndi.gaussian_filter(np.clip(dsh/5+.5,0,1),2.5);surf=surf*(1-.34*shade)[...,None]
    else:
        surf=surf*(1-.13*np.exp(-np.clip(-d-kw,0,None)/9))[...,None]  # ambient occlusion where the cobbles meet the kerb
    seam=np.clip(1-np.abs(d+kw)/1.3,0,1);surf_k=kerb*(1-inner[...,None])+surf*inner[...,None]
    surf_k=surf_k*(1-.42*seam)[...,None]
    surf_k=surf_k*(1-.30*np.clip(1-np.abs(d+.8)/1.3,0,1))[...,None]       # a thin drawn outline, like the sprites have
    win[:]=win*(1-top[...,None])+surf_k*top[...,None]
    return d
# things the terraces make room for: the royal plaza, and a small court inside the north gate (it opens on a narrow lane)
NGX=1405-OX
CUTS=[lambda X,Y:sd_ell(X,Y,PCX,PCY,PRX+26,PRY+26),lambda X,Y:sd_rrect(X,Y,NGX-112,-80,NGX+112,170,46)]
blocks=[]
k=0
PART=set(MERGE.values())
for j in range(8):
    for i in range(8):
        if (i,j) in FORE or (i,j) in PART:continue
        x0,x1=BX[i];y0,y1=BY[j];key=f'{i},{j}';k+=1
        if (i,j) in MERGE:x1=BX[MERGE[(i,j)][0]][1]
        terrace(x0,y0,x1,y1,'grass' if key in LAWN else SURF.get((i,j),'cobble'),seed=k)
        blocks.append((i,j,x0,y0,x1,y1,key))
# flower beds: a kerbed bed in the middle of a cobbled terrace
beds=[]
for (i,j,x0,y0,x1,y1,key) in blocks:
    if key not in BEDS:continue
    cx,cy=(x0+x1)/2,(y0+y1)/2;bw=min(190,(x1-x0)*.52);bh=min(104,(y1-y0)*.44)
    b=(round(cx-bw/2),round(cy-bh/2),round(cx+bw/2),round(cy+bh/2));terrace(*b,kind='soil',r=16,kw=8,hgt=5,cut=False,seed=i*8+j);beds.append((key,)+b)
# ---------- the royal plaza ----------
de=sd_ell(XX,YY,PCX,PCY,PRX,PRY)
pl=tiled(TEX['plaza'],W,H,int(PCX)%10+92,int(PCY)%10+40)
pl=pl*np.array([1.0,.975,.93],np.float32)*.985
rr=np.sqrt(((XX-PCX)/PRX)**2+((YY-PCY)/PRY)**2);pl=pl*(1.03-.07*np.clip(rr,0,1)**2)[...,None]
m=cov(de+44)[...,None];canvas=canvas*(1-m)+pl*m
ang=np.arctan2((YY-PCY)/PRY,(XX-PCX)/PRX);arc=ang*(PRX+PRY)/2
s,nx,ny=bevel(de)
# outer kerb ring (0..-16), ornament band (-16..-40), inner trim (-40..-44)
kc=np.array(KERB,np.float32)/255
ring=np.broadcast_to(kc,canvas.shape).copy();ring=np.where(((arc%40)<1.4)[...,None],ring*.7,ring)
outer=np.clip((de+3.2)/3.2,0,1);ring=ring+(outer*np.clip(s,0,1)*.2)[...,None];ring=ring*(1-outer*np.clip(-s,0,1)*.3)[...,None]
m=(cov(de)*(1-cov(de+16)))[...,None];canvas=canvas*(1-m)+ring*m
orn=np.where((((arc+20)//56)%2==0)[...,None],np.array([196,168,124],np.float32)/255,np.array([226,206,166],np.float32)/255)
orn=np.where((np.abs(((arc+20)%56)-28)>26.6)[...,None],orn*.74,orn)
m=(cov(de+16)*(1-cov(de+40)))[...,None];canvas=canvas*(1-m)+orn*m
trim=np.broadcast_to(np.array([214,170,86],np.float32)/255,canvas.shape)
m=(cov(de+40)*(1-cov(de+44)))[...,None];canvas=canvas*(1-m)+trim*m
for off in (0,16,40,44):canvas*=(1-.34*np.clip(1-np.abs(de+off)/1.2,0,1))[...,None]
# a soft shade on the plaza floor just inside the ring, so the ring reads as a low step
canvas*=(1-.10*np.clip(1-np.abs(de+52)/10,0,1)*(de<-44))[...,None]
# ---------- finishing: broad, barely visible light and tone variation so no area is one flat repeated tile ----------
n=ndi.gaussian_filter(rng.normal(0,1,(H//16+2,W//16+2)).astype(np.float32),9);n=(n-n.mean())/n.std()
n=np.asarray(Image.fromarray(n).resize((W,H),Image.BICUBIC))
canvas*=(1+.03*np.clip(n,-2,2))[...,None]
canvas=np.clip(canvas,0,1)
out=Image.fromarray((canvas*255+.5).astype(np.uint8))
dst=os.path.join(T,'capital','cpCityFloor5.webp')
out.save(dst,quality=86,method=6)
print('wrote',dst,round(os.path.getsize(dst)/1e6,2),'MB')
