#!/usr/bin/env python3
"""Cut a painted-hat sheet (FASHION_HAT_PROMPTS_TH.md format) into the 5 view pictures the game draws.

  python3 -I tools/hat_cut.py <sheet.png> <key> [mirror=SE,E,NE] [out=assets/fashion/hats] [C=512] [bg=g|m]

Sheet: one row of 5 views of the same hat on flat green (#00FF00, or magenta with bg=m),
left to right = S (front), SE (front 3/4 right), E (side right), NE (back 3/4 right), N (back).
ChatGPT sometimes turns the 3/4 and side views to the LEFT: list those in mirror= and they are flipped.

Output: <out>/<key>_<S|SE|E|NE|N>.webp, each a C×C square, the hat at 1:1 sheet scale with the
bottom-centre of its bounding box at (C/2, 0.80·C). Prints the band width of the front view
(row 8 % of the hat height above its bottom) so the game scale can be set:
  FASHION.items[key] = {size:C, scale:<atlas px per picture px>, off:{dir:[dx,dy]}, img:{dir:path}}
  (drawFashion draws the picture centred on the tracked head point + off; see fashion_hats.js PHAT).
Keying: alpha from how much greener than red / blue a pixel is, then the green is un-mixed from
the edge pixels (no green fringe), so dark outlines stay crisp.
"""
import sys,os
import numpy as np
from PIL import Image

def key_bg(rgb,bg='g'):
    a=rgb.astype(np.float32)
    r,g,b=a[...,0],a[...,1],a[...,2]
    if bg=='m': dom=np.minimum(r,b)-g; K=np.array([255,0,255],np.float32)
    else:       dom=g-np.maximum(r,b); K=np.array([0,255,0],np.float32)
    lo,hi=35.0,170.0
    al=np.clip((hi-dom)/(hi-lo),0,1)
    out=np.zeros(rgb.shape[:2]+(4,),np.float32)
    m=al>0
    A=al[m][:,None]
    F=(a[m]-(1-A)*K)/np.maximum(A,1e-3)
    if bg=='m': F[:,0]=np.minimum(F[:,0],np.maximum(F[:,1],F[:,2])+40); F[:,2]=np.minimum(F[:,2],np.maximum(F[:,0],F[:,1])+40)
    else:       F[:,1]=np.minimum(F[:,1],np.maximum(F[:,0],F[:,2])+18)
    out[m,:3]=np.clip(F,0,255);out[...,3]=al*255
    return out.astype(np.uint8)

def runs_of(cols,n):
    rs=[];on=False
    for x,v in enumerate(cols):
        if v and not on: s=x;on=True
        if not v and on: rs.append([s,x-1]);on=False
    if on: rs.append([s,len(cols)-1])
    while len(rs)>n:                       # merge across the smallest gap
        g=[rs[i+1][0]-rs[i][1] for i in range(len(rs)-1)];i=int(np.argmin(g))
        rs[i]=[rs[i][0],rs[i+1][1]];del rs[i+1]
    return rs

def main():
    if len(sys.argv)<3: sys.exit(__doc__)
    sheet,key=sys.argv[1],sys.argv[2]
    opt=dict(a.split('=',1) for a in sys.argv[3:] if '=' in a)
    out=opt.get('out','assets/fashion/hats');C=int(opt.get('C',512));bg=opt.get('bg','g')
    mir=set(x for x in opt.get('mirror','').split(',') if x)
    rgba=key_bg(np.asarray(Image.open(sheet).convert('RGB')),bg)
    al=rgba[...,3]>40
    rs=runs_of(al.sum(0)>2,5)
    if len(rs)!=5: sys.exit(f'found {len(rs)} views, expected 5')
    os.makedirs(out,exist_ok=True)
    D=['S','SE','E','NE','N'];info={}
    for d,(x0,x1) in zip(D,rs):
        sub=al[:,x0:x1+1];ys=np.where(sub.any(1))[0];y0,y1=ys.min(),ys.max()
        crop=Image.fromarray(rgba[y0:y1+1,x0:x1+1])
        if d in mir: crop=crop.transpose(Image.FLIP_LEFT_RIGHT)
        w,h=crop.size
        if w>C*.96 or h>C*.78: sys.exit(f'{d}: {w}x{h} does not fit C={C}; raise C')
        can=Image.new('RGBA',(C,C),(0,0,0,0));can.alpha_composite(crop,(C//2-w//2,int(C*.80)-h))
        p=os.path.join(out,f'{key}_{d}.webp');can.save(p,quality=92,method=6)
        A=np.asarray(crop)[...,3]>40;row=A[int(h*.92)];xs=np.where(row)[0]
        info[d]=dict(w=w,h=h,band=int(xs.max()-xs.min()+1) if len(xs) else 0)
        print(f'{d}: {w}x{h} band~{info[d]["band"]} -> {p}')
    print('front band width (picture px):',info['S']['band'],'→ scale = target band (atlas px) / this')

if __name__=='__main__': main()
