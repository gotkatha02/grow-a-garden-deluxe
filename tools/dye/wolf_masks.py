"""Wolf dye masks: FUR_MASK (hair, ears, braids, tail) and CLOTH_MASK (leather, fur mantle, boots, scarf, straps)
for the wardrobe / create-screen colours in fashion.js. The face, hands, eyes, bandages, the cream shirt, metal and the
axe are left out of both, so they keep their drawn colours (owner 2026-11-23).

usage (from the repo root):
  python3 -I tools/dye/wolf_masks.py [--fur-src FILE]      → rewrites assets_fur.js and assets_cloth.js
The input fur mask is the ORIGINAL loose one (it also held bandages, a back collar and hit bursts); by default it is read
from git (commit b2cd8b6, before this tool replaced it). Needs numpy, scipy, pillow.
Rules in short: the hair = fur-coloured pieces around the head point (FASHION.head) inside a head-sized area, plus thin
braid pieces; the tail = the biggest solid fur blob below the head (+ its other half when an arm cuts it), trimmed so rim
lines that run off it are dropped; anything leather-coloured never counts as fur; the outfit = leather / tan colours that
are not fur, not skin (skin-coloured hand pixels + the face), not near the axe line, not cream / metal / eyes / hit flashes.
"""
import sys,os,io,re,json,base64,subprocess,numpy as np
from PIL import Image
from scipy import ndimage as nd
R=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))+'/'
def _obj(s,start):
    d=0
    for j in range(start,len(s)):
        c=s[j]
        if c=='{':d+=1
        elif c=='}':
            d-=1
            if d==0:return s[start:j+1]
def b64img(u):return Image.open(io.BytesIO(base64.b64decode(u.split(',',1)[1])))
def tab_of(js):return json.loads(js.split('=',1)[1].strip().rstrip(';'))
src=None
if '--fur-src' in sys.argv:src=open(sys.argv[sys.argv.index('--fur-src')+1]).read()
else:src=subprocess.run(['git','-C',R,'show','b2cd8b6:assets_fur.js'],capture_output=True,text=True,check=True).stdout
s=open(R+'assets.js').read()
meta=json.loads(_obj(s,s.find('const SPR_META=')+len('const SPR_META=')))
i=s.find('const SPR_ATLAS=')+len('const SPR_ATLAS=')
atlas={k:np.array(b64img(v).convert('RGBA')) for k,v in json.loads(_obj(s,i)).items()}
fur={k:np.array(b64img(v).convert('RGBA'))[...,0]/255. for k,v in tab_of(src).items()}
skin={k:np.array(b64img(v).convert('RGBA'))[...,0]/255. for k,v in tab_of(open(R+'assets_skin.js').read()).items()}
FA=json.loads(open(R+'assets_fashion.js').read().split('window.FASHION=',1)[1].strip().rstrip(';'))
axe=FA['axe']
def hsv(a):
    r,g,b=a[...,0],a[...,1],a[...,2];mx=a.max(-1);mn=a.min(-1);d=mx-mn+1e-9
    h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60;s=np.where(mx>0,(mx-mn)/(mx+1e-9),0);return h,s,mx
def seg_dist(px,py,x0,y0,x1,y1):
    dx,dy=x1-x0,y1-y0;L=dx*dx+dy*dy+1e-9;t=np.clip(((px-x0)*dx+(py-y0)*dy)/L,0,1);return np.hypot(px-(x0+t*dx),py-(y0+t*dy))
TER=int(os.environ.get('TER','3'));TGD=int(os.environ.get('TGD','9'))
FUR={st:np.zeros_like(fur[st]) for st in fur};CLOTH={st:np.zeros_like(fur[st]) for st in fur}
for st,S in meta['states'].items():
    for d,D in S['dirs'].items():
        for f,fr in enumerate(D['f']):
            ax,ay,aw,ah,bx,by,bw,bh=fr;k=aw/bw
            hp=FA['head'][st][d][min(f,len(FA['head'][st][d])-1)];hx,hy=(hp[0]-bx)*k,(hp[1]-by)*k
            a=axe[st][d][min(f,len(axe[st][d])-1)];ex,ey,gx,gy=(a[0]-bx)*k,(a[1]-by)*k,(a[2]-bx)*k,(a[3]-by)*k
            im=atlas[st][ay:ay+ah,ax:ax+aw].astype(float)/255;al=im[...,3];fm=fur[st][ay:ay+ah,ax:ax+aw];sm=skin[st][ay:ay+ah,ax:ax+aw]
            yy,xx=np.mgrid[0:ah,0:aw]
            hh,ss_,vv=hsv(im[...,:3])
            # fur colour = pink / white-pink; brown, crimson and orange leather, gold beads and grey metal are not fur
            pink=(hh>=290)|(hh<=16)|(ss_<.12)|((vv>.82)&(ss_<.24)&(hh<34))
            leatherPx=((hh<40)&(ss_>=.46)&(vv<.78))|((hh>=290)&(ss_>=.5)&(vv<.55))|((hh>16)&(hh<290)&(ss_>=.12)&~((vv>.82)&(ss_<.24)&(hh<34)))   # near-white / warm-white highlights stay fur
            lab,n=nd.label((fm>.2)&~leatherPx,structure=np.ones((3,3)))   # pieces joined only through leather are separate
            keep=np.zeros(n+1,bool);sizes=nd.sum(np.ones_like(fm),lab,range(n+1))
            cys=nd.mean(yy,lab,range(n+1));cxs=nd.mean(xx,lab,range(n+1))
            head=(np.hypot(xx-hx,yy-hy)<30)
            for i in np.unique(lab[head&(lab>0)]):keep[i]=True
            def solid(m,q):      # thin rim lines (1-2 px) on boots / trousers vanish under an opening; the tail and braids do not
                return nd.binary_opening(m,structure=np.ones((3,3))).sum()>=q*m.sum()
            yb=np.nonzero(al>.5)[0].max()                     # the feet: rim lights along the boot soles are not tail
            tc=sorted([(sizes[i],i) for i in range(1,n+1) if not keep[i] and cys[i]-hy>=50 and sizes[i]>=110 and solid(lab==i,.55)
                       and float(np.median(ss_[lab==i]))>=.1],reverse=True)      # a white hit burst is not the tail
            tail=[]
            if tc:
                big=lab==tc[0][1];bigN=nd.binary_dilation(big,iterations=12);tail=[tc[0][1]]
                tail+=[i for s_,i in tc[1:] if s_>=.4*tc[0][0] and (bigN&(lab==i)).any()]   # the same tail cut in two by an arm or the axe
            for i in tail:keep[i]=True
            if tail:
                tm=np.isin(lab,tail);near=nd.binary_dilation(tm,iterations=12)
                for i in range(1,n+1):
                    if not keep[i] and cys[i]-hy>=62 and sizes[i]>=25 and cys[i]<yb-14 and (near&(lab==i)).any() and solid(lab==i,.6):
                        mm=lab==i;h_,s_,v_=hsv(im[...,:3])
                        if (((h_[mm]>=290)|(h_[mm]<=16)).mean()>=.8) and float(np.median(s_[mm]))<.44 and float(np.median(v_[mm]))>=.6:keep[i]=True
            # hands = skin pieces away from the face; the bandaged forearms sit next to them
            sl,sn=nd.label(sm>.4,structure=np.ones((3,3)))
            hands=np.zeros_like(fm,bool)
            if sn:
                ssz=nd.sum(np.ones_like(fm),sl,range(sn+1));scx=nd.mean(xx,sl,range(sn+1));scy=nd.mean(yy,sl,range(sn+1))
                for i in range(1,sn+1):   # not the face / chin (|dx|<=28, dy<=42 from the head point), not the inner ears (above it)
                    if ssz[i]>=6 and scy[i]>hy+8 and not (abs(scx[i]-hx)<=28 and scy[i]-hy<=42):hands|=sl==i
            handZ=nd.binary_dilation(hands,iterations=11)
            core=np.hypot(xx-hx,yy-hy)<=21
            # braid tips: pink pieces hanging just under the face (cut off from the hair by the hair tie), not by a hand
            def furlike(m):return (pink[m].mean()>=.8) and float(np.median(ss_[m]))<.44 and float(np.median(vv[m]))>=.6
            for i in range(1,n+1):      # small pieces touching the head disk must look like fur (the back collar did not)
                if keep[i] and sizes[i]<300 and not furlike(lab==i):keep[i]=False
            headK=np.zeros_like(fm,bool)
            for i in range(1,n+1):
                if keep[i]:headK|=lab==i
            nearHead=nd.binary_dilation(headK,iterations=12)
            for i in range(1,n+1):      # braid pieces under the hair tie (tuft at the shoulder)
                if keep[i] or sizes[i]<10:continue
                m=lab==i
                if abs(cxs[i]-hx)<=32 and 10<=cys[i]-hy<=62 and (nearHead&m).any() and furlike(m) and not (handZ&m).any() and solid(m,.35):keep[i]=True
            for i in range(1,n+1):     # tail / other pieces that touch a hand are forearm wraps
                if keep[i] and not (head&(lab==i)).any() and (handZ&(lab==i)).mean()>.25 if (lab==i).any() else False:keep[i]=False
            tailm=np.isin(lab,tail) if tail else np.zeros_like(fm,bool)
            km=keep[lab]
            if tail:      # rim-light lines that run off the tail along a boot or the tunic edge are not tail
                body=nd.binary_erosion(tailm,structure=np.ones((3,3)),iterations=TER);g=body.copy()
                for _ in range(TGD):g=nd.binary_dilation(g,structure=np.ones((3,3)))&tailm
                km&=~(tailm&~g);tailm=g
            # hair pieces reach only so far from the head: a bandaged chest or a hit burst that touches the hair is not hair
            dxh,dyh=xx-hx,yy-hy
            headReg=(np.hypot(dxh/46.,(dyh+2)/48.)<=1)&(dyh<=40)
            hp_=km&~tailm&~headReg
            if hp_.any():
                pl,pn=nd.label(hp_,structure=np.ones((3,3)))
                for i in range(1,pn+1):
                    m=pl==i;sz=int(m.sum());ys,xs=np.nonzero(m);wd=xs.max()-xs.min()+1
                    ht=ys.max()-ys.min()+1
                    braid=sz<=260 and wd<=16 and ht>=wd*.8 and abs(xs.mean()-hx)<=34 and ys.mean()-hy<=62 and furlike(m) and solid(m,.35)
                    if not braid:km&=~m
            km=nd.binary_dilation(km,iterations=2)&(headReg|nd.binary_dilation(km&~headReg,iterations=2)|tailm|nd.binary_dilation(tailm,iterations=2));tailD=nd.binary_dilation(tailm,iterations=2)
            # forearm of the weapon hand: from the grip 26 px toward the shoulder (raised arms lie over the hair)
            tx,ty=hx-gx,hy+30-gy;tl=max(1.,np.hypot(tx,ty));elx,ely=gx+tx/tl*26,gy+ty/tl*26
            fore=(seg_dist(xx,yy,gx,gy,elx,ely)<6.5)&(np.hypot(xx-hx,yy-hy)>17)
            fnew=fm*km*(~(handZ&~core&~tailD))*(~fore)*(~leatherPx)*(1-np.clip((sm-.3)*2.5,0,1))   # inner ears / face stay as drawn
            FUR[st][ay:ay+ah,ax:ax+aw]=fnew
            # outfit: leather / tan fur trims / scarf, not fur, not skin, not the axe, not eyes / metal / cream shirt
            h,s,v=hsv(im[...,:3])
            L=max(1.,np.hypot(gx-ex,gy-ey));ux,uy=(gx-ex)/L,(gy-ey)/L
            hx2,hy2=gx+ux*L*.06,gy+uy*L*.06      # the handle stops at the fist (a longer cap cut the forearm wraps)
            axd=np.minimum(seg_dist(xx,yy,ex,ey,hx2,hy2),np.hypot(xx-ex,yy-ey)-8)
            axem=axd<3.8
            # the old skin mask also caught bright bracer straps next to the hands: away from the face, only skin-coloured
            # pixels (light, not too saturated) and 2 px around them count as hand
            faceReg=(np.hypot(dxh/40.,(dyh-6)/44.)<=1)
            skinCore=(sm>.3)&(((ss_<.5)&(vv>.62)&((hh<=32)|(hh>=340)))|(vv<.3))
            scl,scn=nd.label(skinCore&~faceReg,structure=np.ones((3,3)))
            if scn:
                scs=nd.sum(np.ones_like(fm),scl,range(scn+1));skinCore&=~np.isin(scl,[i for i in range(1,scn+1) if scs[i]<8])   # lone light specks on a bracer are not a hand
            skD=nd.binary_dilation((sm>.3)&faceReg,iterations=1)|nd.binary_dilation(skinCore,iterations=2)
            oldPink=(fm>.3)&~leatherPx                               # the old fur mask held the hair, tail AND the pink bandages
            allow=(al>.5)&(fnew<.3)&(~oldPink)&(~skD)&(~axem)
            red=(h>=300)|(h<10)
            okc=(v>=.13)&(((s>=.2)|((v<.5)&(s>=.12))))
            nearPS=nd.binary_dilation((sm>.3)|oldPink|(fnew>.3),iterations=5)
            okc&=~(red&(v>=.78)&nearPS)                              # light pinks next to skin / fur: blush, fur highlights
            okc&=~((h>55)&(h<300))                                   # blue eyes, green patch, grey metal
            okc&=~((h>=38)&(v>.72)&(s>.35))                          # gold rings / buckles
            okc&=~((s<.2)&(v>.6))                                    # cream shirt
            okc&=~(red&(s>.7)&(v>.62))                               # hit bursts / blood splashes baked into a few frames (never leather)
            cl=allow&okc
            cl=(nd.binary_closing(cl,iterations=1)&allow)|cl
            holes=nd.binary_fill_holes(cl)&~cl&allow
            hl,hn=nd.label(holes)
            if hn:
                hs=nd.sum(np.ones_like(fm),hl,range(hn+1));cl|=np.isin(hl,[i for i in range(1,hn+1) if hs[i]<=24])
            cw=nd.gaussian_filter(cl.astype(float),.5)*al*(1-np.clip(fnew,0,1))*(~skD)
            CLOTH[st][ay:ay+ah,ax:ax+aw]=np.maximum(CLOTH[st][ay:ay+ah,ax:ax+aw],cw)

def tab(M,q=0):
    out={}
    for st,m in M.items():
        v=np.clip(m,0,1)
        if q:v=np.round(v*q)/q
        im=Image.fromarray((v*255).round().astype(np.uint8),'L');b=io.BytesIO();im.save(b,'PNG',optimize=True)
        out[st]='data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
    return out
open(R+'assets_fur.js','w').write('/* wolf fur mask (hair, ears, braids, tail) — made by tools/dye/wolf_masks.py; weight in the red channel */\nwindow.FUR_MASK='+json.dumps(tab(FUR))+';\n')
open(R+'assets_cloth.js','w').write('/* wolf outfit mask (leather, fur mantle, boots, scarf, straps) — made by tools/dye/wolf_masks.py; weight in the red channel */\nwindow.CLOTH_MASK='+json.dumps(tab(CLOTH,8))+';\n')
print('assets_fur.js',os.path.getsize(R+'assets_fur.js'),'assets_cloth.js',os.path.getsize(R+'assets_cloth.js'))
