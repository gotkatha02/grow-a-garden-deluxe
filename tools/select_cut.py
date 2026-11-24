"""Create-screen hero pictures (owner 2026-11-24): his full-body pictures, transparent PNG 1086 x 1448 (body alpha ~252)
   -> assets/heroes/<hero>/select.webp, 720 x 960, the whole canvas kept so every hero stands at the same scale.
   usage: python3 -I tools/select_cut.py assets/heroes hero=path [hero=path ...]
   then add the hero key to SELA in char_create.js (and bump ?v= there when a picture is replaced).
   alpha < 6 = noise -> 0, body alpha stretched to 255.
   2026-11-24 (hippo): a picture that is NOT a transparent 3:4 canvas — ChatGPT's 2:3 portrait, a square view, or an opaque
   picture on flat green / magenta (keyed here, colour un-mixed + spill removed) — is not stretched any more: its figure is
   fitted into the frame the way the owner's pictures stand (at most 690 wide / 935 tall of 720 x 960, feet at 945, centred).
   The owner's transparent 3:4 pictures take the old path unchanged."""
import sys, os, numpy as np
from PIL import Image
out=sys.argv[1]
W,H=720,960
FIT_W,FIT_H,FOOT=1041,1410,1425          # in the 1086 x 1448 frame = 690 / 935 / 945 of the 720 x 960 output

def key_bg(im):
    """Opaque picture on flat green or magenta -> RGBA (soft matte, colour un-mixed, spill removed); None if the border is neither."""
    rgb=np.asarray(im.convert('RGB')).astype(np.float32)
    bord=np.concatenate([rgb[:6].reshape(-1,3),rgb[-6:].reshape(-1,3),rgb[:,:6].reshape(-1,3),rgb[:,-6:].reshape(-1,3)])
    k=np.median(bord,0)
    if k[1]-max(k[0],k[2])>60: ex=rgb[...,1]-np.maximum(rgb[...,0],rgb[...,2]); kx=k[1]-max(k[0],k[2]); green=True
    elif min(k[0],k[2])-k[1]>60: ex=np.minimum(rgb[...,0],rgb[...,2])-rgb[...,1]; kx=min(k[0],k[2])-k[1]; green=False
    else: return None
    a=np.clip(1-(ex-20)/(kx-20),0,1)
    col=np.clip((rgb-(1-a[...,None])*k)/np.maximum(a,1e-3)[...,None],0,255)
    if green: col[...,1]=np.where(a<1,np.minimum(col[...,1],np.maximum(col[...,0],col[...,2])+4),col[...,1])
    else:
        e2=np.where(a<1,np.maximum(np.minimum(col[...,0],col[...,2])-col[...,1]-6,0),0); col[...,0]-=e2; col[...,2]-=e2
    a[a<.06]=0
    return Image.fromarray(np.dstack([np.clip(col,0,255),a*255]).astype(np.uint8),'RGBA')

for arg in sys.argv[2:]:
    k,p=arg.split('=',1)
    src=Image.open(p); im=src.convert('RGBA'); keyed=False
    if 'A' not in src.getbands() or np.asarray(im)[...,3].min()>250:
        kim=key_bg(im)
        if kim is not None: im=kim; keyed=True
        else: print(k,'WARNING: no transparency and no flat green / magenta background — cut it first')
    a=np.asarray(im).astype(np.float32)
    al=a[...,3]
    al=np.where(al<6,0,np.clip(al*255/252,0,255))
    a[...,3]=al
    im=Image.fromarray(a.astype(np.uint8),'RGBA')
    if keyed or abs(im.size[0]/im.size[1]-1086/1448)>.01:
        A=np.asarray(im)[...,3]; ys,xs=np.where(A>40)
        fig=im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1)); s=min(FIT_W/fig.width,FIT_H/fig.height)
        fig=fig.resize((round(fig.width*s),round(fig.height*s)),Image.LANCZOS)
        can=Image.new('RGBA',(1086,1448),(0,0,0,0)); can.alpha_composite(fig,(543-fig.width//2,FOOT-fig.height)); im=can
        print(k,'fitted:', 'keyed' if keyed else 'aspect %.3f'%(src.size[0]/src.size[1]), 'figure scale %.3f'%s)
    elif im.size!=(1086,1448): im=im.resize((1086,1448),Image.LANCZOS) if abs(im.size[0]-1086)>2 else im.crop((0,0,1086,1448)) if im.size[0]>=1086 and im.size[1]>=1448 else im.resize((1086,1448),Image.LANCZOS)
    im=im.convert('RGBa').resize((W,H),Image.LANCZOS).convert('RGBA')
    A=np.asarray(im)[...,3]; ys,xs=np.where(A>40)
    d=os.path.join(out,k); os.makedirs(d,exist_ok=True)
    fn=os.path.join(d,'select.webp'); im.save(fn,'WEBP',quality=86,method=6)
    print(k, os.path.getsize(fn)//1024,'KB', 'bbox',xs.min(),ys.min(),xs.max(),ys.max(), 'cx',(xs.min()+xs.max())//2)
