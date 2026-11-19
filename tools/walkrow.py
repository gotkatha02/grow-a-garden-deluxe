"""Replace one row of a processed monster sheet with a separately drawn row (e.g. a re-done WALK row).
usage: walkrow.py ROW_IMAGE SHEET.webp cw ch px py [row=1] [frames=4]
The new frames are keyed (green/magenta), split into `frames` pieces, scaled so their median height matches the
old frames of that row, anchored at the body's centre of mass and the row baseline, and written back into the sheet."""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as nd
src,sheet=sys.argv[1],sys.argv[2];cw,ch,px,py=map(int,sys.argv[3:7]);row=int(sys.argv[7]) if len(sys.argv)>7 else 1;cnt=int(sys.argv[8]) if len(sys.argv)>8 else 4
im=np.asarray(Image.open(src).convert('RGB')).astype(np.float32);H,W,_=im.shape
bd=np.concatenate([im[:6].reshape(-1,3),im[-6:].reshape(-1,3),im[:,:6].reshape(-1,3),im[:,-6:].reshape(-1,3)]);key=np.median(bd,0)
r,g,b=im[...,0],im[...,1],im[...,2];MAG=key[1]<min(key[0],key[2])
ex=(np.minimum(r,b)-g) if MAG else (g-np.maximum(r,b));kx=(min(key[0],key[2])-key[1]) if MAG else (key[1]-max(key[0],key[2]))
a=np.clip(1-(ex-25)/(kx-25),0,1);col=np.clip((im-(1-a[...,None])*key)/np.maximum(a,1e-3)[...,None],0,255)
if MAG:
    mn=np.minimum(col[...,0],col[...,2]);sp=mn>col[...,1]+18;lim=col[...,1]+18
    col[...,0]=np.where(sp,np.minimum(col[...,0],lim),col[...,0]);col[...,2]=np.where(sp,np.minimum(col[...,2],lim),col[...,2])
else:
    mx=np.maximum(col[...,0],col[...,2]);col[...,1]=np.minimum(col[...,1],mx+4)
a[a<.06]=0;A=a>.12
lab,n=nd.label(nd.binary_dilation(A,iterations=3));comps=[]
for k,sl in enumerate(nd.find_objects(lab),1):
    m=(lab[sl]==k)&A[sl]
    if m.sum()>=40:comps.append(dict(k=k,x0=sl[1].start,x1=sl[1].stop,y0=sl[0].start,y1=sl[0].stop,sz=int(m.sum())))
comps.sort(key=lambda c:c['x0']);segs=[]
for c in comps:
    if segs and c['x0']<=segs[-1]['x1']+6:segs[-1]['x1']=max(segs[-1]['x1'],c['x1']);segs[-1]['cs'].append(c)
    else:segs.append(dict(x0=c['x0'],x1=c['x1'],cs=[c]))
while len(segs)>cnt:   # fold small bits into neighbours
    sz=[sum(c['sz'] for c in s['cs']) for s in segs];i=int(np.argmin(sz));j=i-1 if i==len(segs)-1 or (i>0 and segs[i]['x0']-segs[i-1]['x1']<segs[i+1]['x0']-segs[i]['x1']) else i+1
    lo,hi=min(i,j),max(i,j);segs[lo]=dict(x0=min(segs[lo]['x0'],segs[hi]['x0']),x1=max(segs[lo]['x1'],segs[hi]['x1']),cs=segs[lo]['cs']+segs[hi]['cs']);del segs[hi]
assert len(segs)==cnt,len(segs)
rgba=np.dstack([col,a*255]).clip(0,255).astype(np.uint8)
S=np.asarray(Image.open(sheet).convert('RGBA')).copy()
def vis_h(cell):ys=np.where((cell[...,3]>50).any(1))[0];return ys.max()-ys.min() if len(ys) else 0
old_h=np.median([vis_h(S[row*ch:(row+1)*ch,i*cw:(i+1)*cw]) for i in range(cnt)])
base=max(c['y1'] for s in segs for c in s['cs'])
frames=[];hs=[]
for s in segs:
    y0=min(c['y0'] for c in s['cs']);x0,x1=s['x0'],s['x1']
    p=rgba[y0:base,x0:x1].copy();p[...,3]=p[...,3]*np.isin(lab[y0:base,x0:x1],[c['k'] for c in s['cs']])
    frames.append(p);hs.append(vis_h(p))
k=old_h/np.median(hs);print('scale',round(k,3),'old h',old_h,'new h',np.median(hs))
S[row*ch:(row+1)*ch,:cw*5]=0
for i,p in enumerate(frames):
    img=Image.fromarray(p);img=img.resize((max(1,round(img.width*k)),max(1,round(img.height*k))),Image.LANCZOS);q=np.asarray(img)
    w=q[...,3].astype(float).sum(0);cx=(w*np.arange(q.shape[1])).sum()/max(w.sum(),1)
    X=i*cw+int(round(px-cx));Y=row*ch+py-q.shape[0]
    # clip into the cell
    sx0=max(0,i*cw-X);sy0=max(0,row*ch-Y);sx1=min(q.shape[1],(i+1)*cw-X);sy1=min(q.shape[0],(row+1)*ch-Y)
    if sx0>0 or sx1<q.shape[1] or sy0>0:print(' frame',i+1,'clipped',sx0,q.shape[1]-sx1,sy0)
    S[Y+sy0:Y+sy1,X+sx0:X+sx1]=q[sy0:sy1,sx0:sx1]
Image.fromarray(S).save(sheet,quality=92,method=6);Image.fromarray(S).save(sheet.replace('.webp','_preview.png'))
print('ok')
