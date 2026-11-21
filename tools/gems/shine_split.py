"""Split the owner's glass shine (GEM_PAGE_ART_PROMPTS_TH.md 12, the 1254² picture on black) into a fixed highlight layer and a
rim + facet layer that turns per gem (totem_gems.js fcv).  python3 tools/gems/shine_split.py <shine.png> [out_dir/]
out: cshine_hl.webp, cshine_fc.webp — 512², circle (rim peak) radius 236 at the centre. CX, CY, R = the rim circle in the source
(measured: brightest ring of the radial profile); the highlight window A0…A1 / R0…R1 is the upper-left gloss + its dot and star."""
import sys,numpy as np
from PIL import Image
SRC=sys.argv[1] if len(sys.argv)>1 else 'shine_src.png';CX,CY,R=619.0,593.0,495.0
OUT=sys.argv[2] if len(sys.argv)>2 else 'assets/gems/page/'
A0,A1,FE=-166.0,-70.0,9.0      # highlight window (deg, image coords: atan2(dy,dx), y down) + feather
R0,R1,FR=.45,.955,.03          # radial window (× R) + feather
im=np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)/255
H,W,_=im.shape;ys,xs=np.mgrid[0:H,0:W].astype(np.float32)
dx,dy=xs-CX,ys-CY;rr=np.hypot(dx,dy)/R;ph=np.degrees(np.arctan2(dy,dx))
def ramp(x,a,b): return np.clip((x-a)/max(b-a,1e-6),0,1)
ma=ramp(ph,A0-FE,A0+FE)*(1-ramp(ph,A1-FE,A1+FE))
mr=ramp(rr,R0-FR,R0+FR)*(1-ramp(rr,R1-FR,R1+FR))
m=(ma*mr)[...,None]
def layer(img,gain=.88):
    a=img.max(-1);col=np.where(a[...,None]>1e-4,img/np.maximum(a[...,None],1e-4),0)
    rgba=np.dstack([np.clip(col,0,1),np.clip(a*gain,0,1)])
    return rgba
S=236/R;size=512
def place(rgba,name):
    pil=Image.fromarray((rgba*255).astype(np.uint8),'RGBA')
    w=int(round(W*S));pil=pil.resize((w,w),Image.LANCZOS)
    out=Image.new('RGBA',(size,size),(0,0,0,0))
    ox=int(round(256-CX*S));oy=int(round(256-CY*S))
    out.alpha_composite(pil,(ox,oy)) if ox>=0 and oy>=0 else out.paste(pil,(ox,oy),pil)
    out.save(OUT+name,quality=92,method=6);return out
FG=float(sys.argv[3]) if len(sys.argv)>3 else 1.6   # the facets are faint in the source: lift them so each gem's cut shows over bright icons
hl=place(layer(im*m),'cshine_hl.webp');fc=place(layer(im*(1-m),FG),'cshine_fc.webp')
print('ok',hl.size)
