"""Item icon sheet (solid green / magenta bg) -> one transparent PNG per item.
usage: iconsheet.py SHEET OUTDIR rows key1,key2,... [size=128]
rows = items per row, e.g. 5,5,5,5 ; keys in reading order (left->right, top->bottom)."""
import sys, os, numpy as np
from PIL import Image
from scipy import ndimage as nd
src,outdir,rows,keys=sys.argv[1],sys.argv[2],[int(x) for x in sys.argv[3].split(',')],sys.argv[4].split(',')
SZ=int(sys.argv[5]) if len(sys.argv)>5 else 128
assert sum(rows)==len(keys),(sum(rows),len(keys))
im=np.asarray(Image.open(src).convert('RGB')).astype(np.float32);H,W,_=im.shape
bd=np.concatenate([im[:4].reshape(-1,3),im[-4:].reshape(-1,3),im[:,:4].reshape(-1,3),im[:,-4:].reshape(-1,3)]);key=np.median(bd,0)
r,g,b=im[...,0],im[...,1],im[...,2];MAG=key[1]<min(key[0],key[2])
ex=(np.minimum(r,b)-g) if MAG else (g-np.maximum(r,b));kx=(min(key[0],key[2])-key[1]) if MAG else (key[1]-max(key[0],key[2]))
soft=np.clip(1-(ex-40)/(kx*.75-40),0,1)
# background = key-ish pixels connected to the border, plus near-exact key pockets (holes); everything else is opaque
dist=np.abs(im-key).max(-1)
cand=(soft<.5)&(dist<float(os.environ.get("STRICT","999")))
lab0,_=nd.label(cand);edge=np.unique(np.concatenate([lab0[0],lab0[-1],lab0[:,0],lab0[:,-1]]));edge=edge[edge>0]
pk,_=nd.label(dist<38);ps=np.bincount(pk.ravel());big_pk=np.isin(pk,np.where(ps>int(os.environ.get("POCKET","400")))[0][1:]) if len(ps)>1 else np.zeros_like(pk,bool)
bg=np.isin(lab0,edge)|big_pk
band=nd.binary_dilation(bg,iterations=2)&~bg
a=np.where(bg,0.0,np.where(band,soft,1.0))
col=np.where((a<1)[...,None],np.clip((im-(1-a[...,None])*key)/np.maximum(a,1e-3)[...,None],0,255),im)
rim=nd.binary_dilation(a<.98,iterations=3)          # despill only near the background, keep real purples / pinks inside
if MAG:
    sp=rim&(np.minimum(col[...,0],col[...,2])>col[...,1]+40)
    col[...,0]=np.where(sp,np.minimum(col[...,0],col[...,1]+40),col[...,0]);col[...,2]=np.where(sp,np.minimum(col[...,2],col[...,1]+40),col[...,2])
else:
    mx=np.maximum(col[...,0],col[...,2]);col[...,1]=np.where(rim,np.minimum(col[...,1],mx+6),col[...,1])
a[a<.05]=0;A=a>.3
lab,n=nd.label((nd.binary_dilation(A,iterations=int(os.environ.get("DIL","1"))) if int(os.environ.get("DIL","1")) else A))
def getcomps():
    cs=[]
    for k,sl in enumerate(nd.find_objects(lab),1):
        if sl is None:continue
        m=(lab[sl]==k)&A[sl];s=int(m.sum())
        if s<25:continue
        cs.append(dict(k=[k],y0=sl[0].start,y1=sl[0].stop,x0=sl[1].start,x1=sl[1].stop,sz=s))
    cs.sort(key=lambda c:-c['sz']);return cs
need=len(keys);comps=getcomps()
for _ in range(6):   # touching items: split the widest blob at its thinnest column
    top=comps[:need];med=np.median([c['sz'] for c in top]);real=[c for c in comps if c['sz']>.15*med]
    ew=lambda c:W/(max(rows)+.5) if (c['y0']+c['y1'])/2>H*.45 else W/(min(rows)+.5)
    eh=H/len(rows);ov=lambda c:max((c['x1']-c['x0'])/ew(c)/1.7,(c['y1']-c['y0'])/eh/1.4)
    wide=[c for c in real if ov(c)>1]
    if len(real)>=need and not wide:break
    c=max(real,key=ov) if wide else max(real,key=lambda c:(c['x1']-c['x0'])/ew(c));k=c['k'][0]
    m=(lab==k);sl=(slice(c['y0'],c['y1']),slice(c['x0'],c['x1']));mm=m[sl];done=False
    for it in range(1,60):   # erode until the blob falls into two big seeds, then grow the seeds back over the blob
        e=nd.binary_erosion(mm,iterations=it);sl2,ns=nd.label(e)
        if ns<2:continue
        sz=np.bincount(sl2.ravel())[1:];o=np.argsort(-sz)
        if sz[o[1]]<.12*sz[o[0]]:continue
        seeds=np.zeros_like(sl2);seeds[sl2==o[0]+1]=1;seeds[sl2==o[1]+1]=2
        _,(iy,ix)=nd.distance_transform_edt(seeds==0,return_indices=True);own=seeds[iy,ix]
        for a_,b_ in ((1,2),(2,1)):   # stray pieces cut off from their own seed go to the other part
            pl,pn=nd.label(mm&(own==a_))
            for q in range(1,pn+1):
                if not (seeds[pl==q]==a_).any():own[pl==q]=b_
        nk=lab.max()+1;sub=lab[sl];sub[mm&(own==2)]=nk;lab[sl]=sub;done=True
        print('split blob by erosion',it,file=sys.stderr);break
    if not done:
        cs=m.sum(0).astype(float);a0=c['x0']+int((c['x1']-c['x0'])*.25);a1=c['x0']+int((c['x1']-c['x0'])*.75)
        cut=a0+int(np.argmin(cs[a0:a1]));nk=lab.max()+1;xx=np.arange(W)[None,:];lab[m&(xx>=cut)]=nk;print('split blob at x',cut,file=sys.stderr)
    comps=getcomps()
big=comps[:need];small=comps[need:]
for s in small:   # sparkles etc. join the nearest big item
    cx,cy=(s['x0']+s['x1'])/2,(s['y0']+s['y1'])/2
    t=min(big,key=lambda c:max(c['x0']-cx,0,cx-c['x1'])**2+max(c['y0']-cy,0,cy-c['y1'])**2)
    y0,y1,x0,x1=max(s['y0']-16,0),s['y1']+16,max(s['x0']-16,0),s['x1']+16   # prefer the item whose pixels it actually touches
    ring=nd.binary_dilation(np.isin(lab[y0:y1,x0:x1],s['k']),iterations=14);hits=[(np.isin(lab[y0:y1,x0:x1],c['k'])&ring).sum() for c in big]
    if max(hits)>0:t=big[int(np.argmax(hits))]
    if max(t['x0']-cx,0,cx-t['x1'])**2+max(t['y0']-cy,0,cy-t['y1'])**2<90**2:
        t['k']+=s['k'];t['x0']=min(t['x0'],s['x0']);t['x1']=max(t['x1'],s['x1']);t['y0']=min(t['y0'],s['y0']);t['y1']=max(t['y1'],s['y1'])
assert len(big)==need,(len(big),need)
# rows: sort by vertical centre, cut into the row counts
big.sort(key=lambda c:(c['y0']+c['y1'])/2);order=[];i=0
for n_ in rows:
    rr=sorted(big[i:i+n_],key=lambda c:(c['x0']+c['x1'])/2);order+=rr;i+=n_
rgba=np.dstack([col,a*255]).clip(0,255).astype(np.uint8)
os.makedirs(outdir,exist_ok=True)
for c,kname in zip(order,keys):
    p=rgba[c['y0']:c['y1'],c['x0']:c['x1']].copy();p[...,3]=p[...,3]*np.isin(lab[c['y0']:c['y1'],c['x0']:c['x1']],c['k'])
    # close small holes inside the item (glow pixels that matched the key)
    m=p[...,3]>128;fh=nd.binary_fill_holes(nd.binary_closing(m,iterations=3));hole=fh&~m
    hl,_=nd.label(hole);hs=np.bincount(hl.ravel())
    fill=np.zeros_like(m)
    for i_,v in enumerate(hs[1:],1):
        if v<m.sum()*.06 and (dist[c['y0']:c['y1'],c['x0']:c['x1']][hl==i_]<38).mean()<.5:fill|=hl==i_   # real gaps (pure key colour) stay open
    if fill.any():   # paint holes with the nearest opaque colour
        idx=nd.distance_transform_edt(~m,return_distances=False,return_indices=True)
        p[fill,:3]=p[idx[0][fill],idx[1][fill],:3];p[fill,3]=255
    h,w=p.shape[:2];s=max(h,w);pad=int(s*.04);S=s+2*pad
    can=np.zeros((S,S,4),np.uint8);can[pad+(s-h)//2:pad+(s-h)//2+h,pad+(s-w)//2:pad+(s-w)//2+w]=p
    Image.fromarray(can).resize((SZ,SZ),Image.LANCZOS).save(f'{outdir}/{kname}.png',optimize=True)
print(os.path.basename(src),'->',len(order),'icons')
