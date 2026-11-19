"""Walk cycle from an AI walk-in-place video (solid green/magenta bg) -> a strip of N frames for monster-sprites.js.
usage: vidwalk.py VIDEO SHEET.webp cw ch px py OUT.webp [n=12]
Finds the loop length automatically, takes N evenly spaced frames from one loop, keys the background, keeps the
video's own positions (one fixed anchor for all frames = no jitter), and scales to the height of the sheet's old walk row."""
import sys,subprocess,tempfile,glob,os,numpy as np
from PIL import Image
video,sheet=sys.argv[1],sys.argv[2];cw,ch,px,py=map(int,sys.argv[3:7]);out=sys.argv[7];N=int(sys.argv[8]) if len(sys.argv)>8 else 12
tmp=tempfile.mkdtemp();subprocess.run(['ffmpeg','-v','error','-y','-i',video,tmp+'/f%04d.png'],check=True)
fs=sorted(glob.glob(tmp+'/f*.png'));ims=[np.asarray(Image.open(f).convert('RGB')).astype(np.float32) for f in fs]
key=np.median(np.concatenate([ims[0][:6].reshape(-1,3),ims[0][:,:6].reshape(-1,3),ims[0][:,-6:].reshape(-1,3)]),0)
MAG=key[1]<min(key[0],key[2])
from scipy import ndimage as nd
GLOW=float(os.environ.get('GLOW','1'))   # <1 = thin out semi-transparent glow halos
def matte(im):
    r,g,b=im[...,0],im[...,1],im[...,2];ex=(np.minimum(r,b)-g) if MAG else (g-np.maximum(r,b));kx=(min(key[0],key[2])-key[1]) if MAG else (key[1]-max(key[0],key[2]))
    a=np.clip(1-(ex-30)/(kx*GLOW-30),0,1);col=np.clip((im-(1-a[...,None])*key)/np.maximum(a,1e-3)[...,None],0,255)
    rim=nd.binary_dilation(a<.98,iterations=3)   # despill only near the background, keep real reds / purples inside
    if MAG:
        sp=rim&(np.minimum(col[...,0],col[...,2])>col[...,1]+10)
        for c in (0,2):col[...,c]=np.where(sp,np.minimum(col[...,c],col[...,1]+10),col[...,c])
    else:
        mx=np.maximum(col[...,0],col[...,2]);col[...,1]=np.where(rim|(a<1),np.minimum(col[...,1],mx+4),col[...,1])
    a[a<.08]=0
    lab,n=nd.label(a>.3)                          # drop stray specks
    if n>1:
        sz=nd.sum(np.ones_like(a),lab,range(1,n+1));small=np.isin(lab,np.where(sz<80)[0]+1);a[small]=0
    return np.dstack([col,a*255]).clip(0,255).astype(np.uint8)
masks=np.array([matte(i)[...,3]>60 for i in ims])
ys,xs=np.where(masks.any(0));y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
leg=masks[:,int(y0+(y1-y0)*.55):y1,x0:x1].reshape(len(fs),-1).astype(float)
best=min(range(10,len(fs)//2+1),key=lambda L:np.mean([np.abs(leg[i]-leg[i+L]).mean() for i in range(len(fs)-L)]))
# loop start: the frame whose +best partner matches best (cleanest seam)
st=min(range(len(fs)-best),key=lambda i:np.abs(leg[i]-leg[i+best]).mean())
print('loop',best,'frames, start',st)
pick=[st+round(i*best/N) for i in range(N)]
frames=[matte(ims[i])[y0:y1,x0:x1] for i in pick]
A=np.array([f[...,3] for f in frames]).astype(float).sum(0)
acx=(A.sum(0)*np.arange(x1-x0)).sum()/A.sum()         # one anchor for the whole loop
base=max(np.where((f[...,3]>60).any(1))[0].max() for f in frames)+1
S=np.asarray(Image.open(sheet).convert('RGBA'))
def vis_h(c):r=np.where((c[...,3]>50).any(1))[0];return r.max()-r.min() if len(r) else 0
old=np.median([vis_h(S[ch:2*ch,i*cw:(i+1)*cw]) for i in range(4)]);new=np.median([vis_h(f) for f in frames]);k=old/new
print('scale',round(k,3))
strip=np.zeros((ch,cw*N,4),np.uint8)
for i,f in enumerate(frames):
    img=Image.fromarray(f[:base]);img=img.resize((round(img.width*k),round(img.height*k)),Image.LANCZOS);q=np.asarray(img)
    X=i*cw+int(round(px-acx*k));Y=py-q.shape[0]
    sx0=max(0,i*cw-X);sy0=max(0,-Y);sx1=min(q.shape[1],(i+1)*cw-X)
    strip[Y+sy0:Y+q.shape[0],X+sx0:X+sx1]=q[sy0:,sx0:sx1]
Image.fromarray(strip).save(out,quality=92,method=6);print('ok',out,strip.shape)
