"""ChatGPT 5-row monster sheet (green bg) -> game atlas.
usage: monsheet.py IN.png OUT_BASE   -> OUT_BASE.webp + prints JSON meta
rows: idle 4, walk 4, attack 5, hurt 2, death 5 (counts enforced by merging/splitting segments)."""
import sys, json, numpy as np
from PIL import Image
from scipy import ndimage as nd
EXPECT=[('idle',4),('walk',4),('attack',5),('hurt',2),('death',5)]
src,out=sys.argv[1],sys.argv[2]
im=np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
H,W,_=im.shape
# key colour = median of the border
bd=np.concatenate([im[:6].reshape(-1,3),im[-6:].reshape(-1,3),im[:,:6].reshape(-1,3),im[:,-6:].reshape(-1,3)])
key=np.median(bd,0)
r,g,b=im[...,0],im[...,1],im[...,2]
MAG=key[1]<min(key[0],key[2])              # magenta background (for green monsters)
ex=(np.minimum(r,b)-g) if MAG else (g-np.maximum(r,b))   # how much a pixel looks like the key colour
kx=(min(key[0],key[2])-key[1]) if MAG else (key[1]-max(key[0],key[2]))
a=np.clip(1-(ex-25)/(kx-25),0,1)   # soft matte: translucent ghosts keep partial alpha
# un-mix the green out of semi-transparent pixels, then despill
safe=np.maximum(a,1e-3)[...,None]
col=(im-(1-a[...,None])*key)/safe
col=np.clip(col,0,255)
if MAG:   # despill magenta: red and blue may not both exceed green by much
    mn=np.minimum(col[...,0],col[...,2]);sp=mn>col[...,1]+18;lim=col[...,1]+18
    col[...,0]=np.where(sp,np.minimum(col[...,0],lim),col[...,0]);col[...,2]=np.where(sp,np.minimum(col[...,2],lim),col[...,2])
mx=np.maximum(col[...,0],col[...,2]);gr=(col[...,1]>mx+4)&(not MAG)
# green-tinted fade frames: turn the green cast into a neutral grey of the same brightness
lum=col.mean(-1);col[...,1]=np.where(gr,np.minimum(col[...,1],mx+4),col[...,1]);col[gr]=col[gr]*.55+lum[gr][:,None]*.45
a[a<.06]=0
# drop specks
lab,n=nd.label(a>.25)
if n:
    sz=nd.sum(a>.25,lab,range(1,n+1));keep=np.isin(lab,[i+1 for i,s in enumerate(sz) if s>60])
    a=np.where(nd.binary_dilation(keep,iterations=2),a,0)
A=a>.12
# ---- rows: cut at the emptiest line near each fifth of the height; every connected shape goes to the row of its centre
rowsum=A.sum(1);cuts=[0]
for k in range(1,5):
    c=int(H*k/5);w=rowsum[c-80:c+80].astype(float);m=w.min();idx=np.where(w==m)[0];cuts.append(c-80+int(idx[len(idx)//2]))
cuts.append(H)
LM=nd.binary_dilation(A,iterations=3)
for c in cuts[1:-1]:LM[c-1:c+2]=False      # shapes touching across a row line are split there
lab,n=nd.label(LM)
for c in cuts[1:-1]:
    for yy in (c-1,c,c+1):lab[yy]=np.where(A[yy],np.maximum(lab[yy-2] if yy<c else 0,lab[yy+2] if yy>=c else 0),0)
objs=nd.find_objects(lab);comps=[]
for k,sl in enumerate(objs,1):
    m=(lab[sl]==k)&A[sl]
    if m.sum()<30:continue
    ys,xs=np.where(m);cy=sl[0].start+ys.mean()
    ri=max(0,min(4,int(np.searchsorted(cuts,cy,side='right')-1)))
    comps.append(dict(k=k,ri=ri,x0=sl[1].start,x1=sl[1].stop,y0=sl[0].start,y1=sl[0].stop,sz=int(m.sum())))
# small pieces (breath puffs, sparks, smoke) join the row of the nearest big body, not the row their centre happens to fall in
big=[c for c in comps if c['sz']>=1500]
for c in comps:
    if c['sz']>=1500 or not big:continue
    cx,cy=(c['x0']+c['x1'])/2,(c['y0']+c['y1'])/2
    def dist(o):dx=max(o['x0']-cx,0,cx-o['x1']);dy=max(o['y0']-cy,0,cy-o['y1']);return dx*dx+dy*dy
    c['ri']=min(big,key=dist)['ri']
meta_rows={}
for ri,(name,cnt) in enumerate(EXPECT):
    C=sorted([c for c in comps if c['ri']==ri],key=lambda c:c['x0'])
    segs=[]
    for c in C:
        if segs and c['x0']<=segs[-1]['x1']+6:segs[-1]['x1']=max(segs[-1]['x1'],c['x1']);segs[-1]['cs'].append(c)
        else:segs.append(dict(x0=c['x0'],x1=c['x1'],cs=[c]))
    def merge(i,j):
        segs[i]=dict(x0=min(segs[i]['x0'],segs[j]['x0']),x1=max(segs[i]['x1'],segs[j]['x1']),cs=segs[i]['cs']+segs[j]['cs']);del segs[j]
    while True:
        sz=[sum(c['sz'] for c in sg['cs']) for sg in segs];med=np.median(sz)
        small=[i for i,v in enumerate(sz) if v<med*.25]
        if not small or len(segs)<=cnt:break
        i=small[0]
        if i==0:merge(0,1)
        elif i==len(segs)-1:merge(i-1,i)
        else:merge(i-1,i) if segs[i]['x0']-segs[i-1]['x1']<segs[i+1]['x0']-segs[i]['x1'] else merge(i,i+1)
    while len(segs)>cnt:
        w=[sg['x1']-sg['x0'] for sg in segs];med=np.median(w)
        comb=[(segs[i+1]['x1']-segs[i]['x0'],i) for i in range(len(segs)-1)]
        cw_,i=min(comb)
        if cw_<=med*1.35:merge(i,i+1)
        else:del segs[-1]          # an extra frame: drop the last (usually a repeat of the idle pose)
    # too few: split the widest multi-shape segment where its shapes leave the biggest gap (e.g. breath mist touching the next frame)
    while len(segs)<cnt:
        cand=[i for i,sg in enumerate(segs) if len(sg['cs'])>1]
        if not cand:break
        i=max(cand,key=lambda i:segs[i]['x1']-segs[i]['x0']);cs=sorted(segs[i]['cs'],key=lambda c:c['x0'])
        best=None
        for j in range(1,len(cs)):
            L,R=cs[:j],cs[j:];big_l=sum(c['sz'] for c in L);big_r=sum(c['sz'] for c in R)
            if min(big_l,big_r)<0.25*max(big_l,big_r):continue      # each side must hold a real body
            gap=min(c['x0'] for c in R)-max(c['x1'] for c in L)
            if best is None or gap>best[0]:best=(gap,j)
        if best is None:break
        j=best[1];L,R=cs[:j],cs[j:]
        segs[i:i+1]=[dict(x0=min(c['x0'] for c in L),x1=max(c['x1'] for c in L),cs=L),dict(x0=min(c['x0'] for c in R),x1=max(c['x1'] for c in R),cs=R)]
    if len(segs)<cnt:print('WARN',src,name,len(segs),'<',cnt,file=sys.stderr)
    base=max(c['y1'] for sg in segs for c in sg['cs'])
    lst=[]
    for sg in segs:
        y0=min(c['y0'] for c in sg['cs']);y1=max(c['y1'] for c in sg['cs']);x0,x1=sg['x0'],sg['x1']
        mk=np.isin(lab[y0:y1,x0:x1],[c['k'] for c in sg['cs']]);fa=a[y0:y1,x0:x1]*mk
        wcol=fa.sum(0);cx=float((wcol*np.arange(x1-x0)).sum()/max(wcol.sum(),1))
        lst.append(dict(x0=x0,x1=x1,y0=y0,y1=y1,cx=x0+cx,base=base,ks=[c['k'] for c in sg['cs']]))
    meta_rows[name]=lst
    print('  ',name,[(f['x0'],f['x1']) for f in lst],file=sys.stderr)
# pad counts by repeating last frame
for name,cnt in EXPECT:
    L=meta_rows[name]
    while len(L)<cnt:L.append(L[-1])
    meta_rows[name]=L[:cnt]
# common cell: max extent left/right of anchor and above baseline
left=max(f['cx']-f['x0'] for L in meta_rows.values() for f in L)
right=max(f['x1']-f['cx'] for L in meta_rows.values() for f in L)
up=max(f['base']-f['y0'] for L in meta_rows.values() for f in L)
cw=int(np.ceil(left+right))+4;ch=int(np.ceil(up))+4;px=int(np.ceil(left))+2;py=int(np.ceil(up))+2
cols=5;sheet=np.zeros((ch*5,cw*cols,4),np.uint8)
rgba=np.dstack([col,a*255]).clip(0,255).astype(np.uint8)
for ri,(name,cnt) in enumerate(EXPECT):
    for fi,f in enumerate(meta_rows[name]):
        piece=rgba[f['y0']:f['y1'],f['x0']:f['x1']].copy();piece[...,3]=piece[...,3]*np.isin(lab[f['y0']:f['y1'],f['x0']:f['x1']],f['ks'])
        dx=int(round(px-(f['cx']-f['x0'])));dy=int(round(py-(f['base']-f['y0'])))
        X=fi*cw+dx;Y=ri*ch+dy
        sheet[Y:Y+piece.shape[0],X:X+piece.shape[1]]=np.maximum(sheet[Y:Y+piece.shape[0],X:X+piece.shape[1]],piece) if False else piece
# reference height = idle frame 0 visible height
f0=meta_rows['idle'][0];fa=(a[f0['y0']:f0['y1'],f0['x0']:f0['x1']]>.2)&np.isin(lab[f0['y0']:f0['y1'],f0['x0']:f0['x1']],f0['ks']);ys=np.where(fa.any(1))[0];ref=int(f0['base']-(f0['y0']+ys.min()))
Image.fromarray(sheet).save(out+'.webp',quality=92,method=6,lossless=False)
Image.fromarray(sheet).save(out+'_preview.png')
print(json.dumps(dict(cw=cw,ch=ch,px=px,py=py,ref=ref,n=[c for _,c in EXPECT])))
