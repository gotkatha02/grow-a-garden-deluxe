#!/usr/bin/env python3
"""Cut a totem-sprite sheet (FASHION_COMPANION_PROMPTS_TH.md format) into one picture per companion.

  python3 -I tools/companion_cut.py <sheet.png> <key1,key2,...> [out=assets/fashion/companion] [cols=3] [rows=2] [k=0.62] [bg=g|m]

Sheet: cols × rows creatures on flat green (#00FF00, or magenta with bg=m), keys in reading order.
Keying = alpha from how much greener than red / blue a pixel is + the green un-mixed from edge pixels
(same keyer as tools/hat_cut.py). Every connected piece goes to the grid cell its centre falls in, so a
feather tassel that crosses a cell line still belongs to its creature; specks under 40 px are dropped.
One scale k for the whole sheet (relative sizes stay as drawn). Output <out>/<key>.webp + a JSON line per
creature: crop box in sheet px, picture size, k — to turn sheet coordinates into picture fractions:
  fx = (sx − box.x0) / box.w ,  fy = (sy − box.y0) / box.h
"""
import sys,os,json
import numpy as np
from PIL import Image
from scipy import ndimage

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

def main():
    if len(sys.argv)<3: sys.exit(__doc__)
    sheet,keys=sys.argv[1],sys.argv[2].split(',')
    opt=dict(a.split('=',1) for a in sys.argv[3:] if '=' in a)
    out=opt.get('out','assets/fashion/companion');C=int(opt.get('cols',3));R=int(opt.get('rows',2));k=float(opt.get('k',.62));bg=opt.get('bg','g')
    rgba=key_bg(np.asarray(Image.open(sheet).convert('RGB')),bg)
    H,W=rgba.shape[:2];al=rgba[...,3]>24
    lab,n=ndimage.label(al,structure=np.ones((3,3)))
    boxes={}
    for i,sl in enumerate(ndimage.find_objects(lab),1):
        if sl is None: continue
        m=lab[sl]==i;area=int(m.sum())
        if area<40: rgba[sl][m]=0; continue
        cy,cx=ndimage.center_of_mass(m);cy+=sl[0].start;cx+=sl[1].start
        cell=min(R-1,int(cy/(H/R)))*C+min(C-1,int(cx/(W/C)))
        b=boxes.setdefault(cell,[W,H,0,0,[]]);b[0]=min(b[0],sl[1].start);b[1]=min(b[1],sl[0].start);b[2]=max(b[2],sl[1].stop);b[3]=max(b[3],sl[0].stop);b[4].append(i)
    os.makedirs(out,exist_ok=True)
    for cell,key in enumerate(keys):
        if cell not in boxes: print('missing cell',cell,key);continue
        x0,y0,x1,y1,ids=boxes[cell];p=4;x0=max(0,x0-p);y0=max(0,y0-p);x1=min(W,x1+p);y1=min(H,y1+p)
        crop=rgba[y0:y1,x0:x1].copy();keep=np.isin(lab[y0:y1,x0:x1],ids);crop[~keep]=0   # only this creature's pieces
        im=Image.fromarray(crop,'RGBA');w,h=round(im.width*k),round(im.height*k);im=im.resize((w,h),Image.LANCZOS)
        im.save(os.path.join(out,key+'.webp'),'WEBP',quality=92,method=6)
        print(json.dumps({'key':key,'box':[x0,y0,x1-x0,y1-y0],'size':[w,h],'k':k}))

if __name__=='__main__': main()
