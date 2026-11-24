"""Create-screen hero pictures (owner 2026-11-24): his full-body pictures, transparent PNG 1086 x 1448 (body alpha ~252)
   -> assets/heroes/<hero>/select.webp, 720 x 960, the whole canvas kept so every hero stands at the same scale.
   usage: python3 -I tools/select_cut.py assets/heroes hero=path [hero=path ...]
   then add the hero key to SELA in char_create.js (and bump ?v= there when a picture is replaced).
   alpha < 6 = noise -> 0, body alpha stretched to 255."""
import sys, os, numpy as np
from PIL import Image
out=sys.argv[1]
W,H=720,960
for arg in sys.argv[2:]:
    k,p=arg.split('=',1)
    im=Image.open(p).convert('RGBA')
    a=np.asarray(im).astype(np.float32)
    al=a[...,3]
    al=np.where(al<6,0,np.clip(al*255/252,0,255))
    a[...,3]=al
    im=Image.fromarray(a.astype(np.uint8),'RGBA')
    if im.size!=(1086,1448): im=im.resize((1086,1448),Image.LANCZOS) if abs(im.size[0]-1086)>2 else im.crop((0,0,1086,1448)) if im.size[0]>=1086 and im.size[1]>=1448 else im.resize((1086,1448),Image.LANCZOS)
    im=im.convert('RGBa').resize((W,H),Image.LANCZOS).convert('RGBA')
    A=np.asarray(im)[...,3]; ys,xs=np.where(A>40)
    d=os.path.join(out,k); os.makedirs(d,exist_ok=True)
    fn=os.path.join(d,'select.webp'); im.save(fn,'WEBP',quality=86,method=6)
    print(k, os.path.getsize(fn)//1024,'KB', 'bbox',xs.min(),ys.min(),xs.max(),ys.max(), 'cx',(xs.min()+xs.max())//2)
