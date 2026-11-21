"""Monster sprite sheet from ANY ChatGPT row layout (green bg) -> game atlas (same output as monsheet.py).
usage: monsheet2.py IN.png OUT_BASE [layout=auto|A|B|C]
Finds every frame (body + its loose bits: '!' marks, dizzy stars, dust, slam rocks) and groups them in rows, then picks
idle 4 · walk 4 · attack 5 · hurt 2 · death 5:
  A = the prompt's own layout (rows 4 / 4 / 5 / 2 / 5)
  B = ChatGPT's 5-wide layout: idle · walk · [hurt!, swirl, leap, slam, idle] · [dizzy, …] · death  (4-row variant: dizzy + death share row 4)
  C = idle · walk · attack · [hurt!, …] · [dizzy, death…]
Prints JSON meta (cw ch px py ref) for monster-sprites.js and writes OUT_BASE.webp + OUT_BASE_preview.png."""
import sys, json, numpy as np
from PIL import Image
from scipy import ndimage as nd
src,out=sys.argv[1],sys.argv[2];LAY=sys.argv[3] if len(sys.argv)>3 else 'auto'
im=np.asarray(Image.open(src).convert('RGB')).astype(np.float32);H,W,_=im.shape
bd=np.concatenate([im[:6].reshape(-1,3),im[-6:].reshape(-1,3),im[:,:6].reshape(-1,3),im[:,-6:].reshape(-1,3)]);key=np.median(bd,0)
r,g,b=im[...,0],im[...,1],im[...,2]
ex=g-np.maximum(r,b);kx=key[1]-max(key[0],key[2])
a=np.clip(1-(ex-25)/(kx-25),0,1)
col=np.clip((im-(1-a[...,None])*key)/np.maximum(a,1e-3)[...,None],0,255)
mx=np.maximum(col[...,0],col[...,2]);gr=col[...,1]>mx+4
lum=col.mean(-1);col[...,1]=np.where(gr,np.minimum(col[...,1],mx+4),col[...,1]);col[gr]=col[gr]*.55+lum[gr][:,None]*.45
a[a<.06]=0
A=a>.12
# drop specks
lab0,n0=nd.label(A)
if n0:
    sz=nd.sum(A,lab0,range(1,n0+1));A&=np.isin(lab0,[i+1 for i,v in enumerate(sz) if v>=40])
a=np.where(A|(a>.3),a,0)*(nd.binary_dilation(A,iterations=2))
# ---- rows: empty horizontal bands; frames: empty vertical gaps inside each row
def runs(mask):
    r_=[];st=None
    for i_,v in enumerate(list(mask)+[False]):
        if v and st is None:st=i_
        if not v and st is not None:r_.append((st,i_));st=None
    return r_
rs=A.sum(1)
bands=[(y0,y1) for y0,y1 in runs(rs>2) if A[y0:y1].sum()>3000]
# merge bands split by thin gaps (a floating frame above its row) and split bands that are too tall
mh=np.median([y1-y0 for y0,y1 in bands])
while True:   # a thin band ('!' marks, a leaping frame's lifted part) joins its nearest neighbour
    sm=[i for i,(y0,y1) in enumerate(bands) if y1-y0<.45*mh]
    if not sm or len(bands)<2:break
    i=sm[0];j=i-1 if i>0 and (i==len(bands)-1 or bands[i][0]-bands[i-1][1]<bands[i+1][0]-bands[i][1]) else i+1
    lo,hi=min(i,j),max(i,j);bands[lo:hi+1]=[(bands[lo][0],bands[hi][1])]
Hr=H/5;B=[]
for y0,y1 in bands:   # two rows touching (a shadow on the next row's heads): split at the emptiest lines
    q=int(round((y1-y0)/Hr))
    if (y1-y0)>1.5*Hr and q>=2:
        cuts=[y0]
        for t in range(1,q):
            c=int(y0+(y1-y0)*t/q);lo,hi=int(c-.25*Hr),int(c+.25*Hr);cuts.append(lo+int(np.argmin(rs[lo:hi])))
        cuts.append(y1);B+=[(cuts[i],cuts[i+1]) for i in range(q)]
    else:B.append((y0,y1))
bands=B
if len(bands) not in (4,5):   # fall back to even cuts at the emptiest line near each fifth
    NR=5;cuts=[0]
    for k in range(1,NR):
        c=int(H*k/NR);w=rs[c-90:c+90].astype(float);cuts.append(c-90+int(np.argmin(w)))
    cuts.append(H);bands=[(cuts[i],cuts[i+1]) for i in range(NR)]
rows=[]
def bandsegs(y0,y1):
    cs=A[y0:y1].sum(0);M=[]
    for sg in [[x0,x1] for x0,x1 in runs(cs>1)]:   # join segments separated by < 10 px
        if M and sg[0]-M[-1][1]<10:M[-1][1]=sg[1]
        else:M.append(sg)
    return M,cs
allw=[]
for y0,y1 in bands:
    M,_=bandsegs(y0,y1);mass=[A[y0:y1,x0:x1].sum() for x0,x1 in M];md=np.median(mass)
    allw+=[x1-x0 for (x0,x1),m in zip(M,mass) if m>.4*md]
Wm=float(np.median(allw))
rows=[]
for y0,y1 in bands:
    M,cs=bandsegs(y0,y1);M2=[]
    for x0,x1 in M:   # frames bridged by effects: split at the emptiest columns near even divisions
        k=int(round((x1-x0)/Wm))
        if (x1-x0)>1.6*Wm and k>=2:
            cuts=[x0]
            for q in range(1,k):
                c=int(x0+(x1-x0)*q/k);lo,hi=max(x0+1,int(c-.28*Wm)),min(x1-1,int(c+.28*Wm));cuts.append(lo+int(np.argmin(cs[lo:hi])))
            cuts.append(x1);M2+=[[cuts[i],cuts[i+1]] for i in range(k)]
        else:M2.append([x0,x1])
    M=M2
    mass=[A[y0:y1,x0:x1].sum() for x0,x1 in M];med=np.median(mass)
    keep=[]
    for (x0,x1),m in zip(M,mass):
        if m<.18*med and keep:   # dust puff / spark: joins the neighbour it is closest to (decided below)
            keep.append([x0,x1,1])
        else:keep.append([x0,x1,0])
    F=[k for k in keep if not k[2]]
    for k in keep:
        if k[2] and F:t=min(F,key=lambda f:min(abs(f[0]-k[1]),abs(k[0]-f[1])));t[0]=min(t[0],k[0]);t[1]=max(t[1],k[1])
    R_=[]
    for x0,x1,_ in F:
        sub=A[y0:y1,x0:x1];l_,n_=nd.label(sub);sz=nd.sum(sub,l_,range(1,n_+1));bk=int(np.argmax(sz))+1;body=l_==bk
        ys,xs=np.where(body);w=a[y0:y1,x0:x1]*body;wc=w.sum(0)
        R_.append(dict(m=int(A[y0:y1,x0:x1].sum()),x0=x0,x1=x1,y0=y0,y1=y1,by0=y0+ys.min(),by1=y0+ys.max()+1,cx=x0+float((wc*np.arange(len(wc))).sum()/max(wc.sum(),1))))
    rows.append(R_)
cnt=[len(R) for R in rows];print('rows',cnt,file=sys.stderr)
def spread(R,n):
    if len(R)<=n:return R+[R[-1]]*(n-len(R))
    return [R[int(round(i*(len(R)-1)/(n-1)))] for i in range(n)] if n>1 else R[:1]
if LAY=='auto':
    if len(rows)==5 and cnt[3]==2:LAY='A'
    elif len(rows)==4:LAY='B4'
    elif cnt[2]==5 and len(rows)==5 and cnt[3]>=5:LAY='B'
    else:LAY='C'
def squeeze(Rw,n):   # too many pieces in a row: the lightest piece joins its nearest neighbour
    while len(Rw)>n:
        i=min(range(len(Rw)),key=lambda i:Rw[i]['m'])
        j=i-1 if i==len(Rw)-1 or (i>0 and Rw[i]['x0']-Rw[i-1]['x1']<Rw[i+1]['x0']-Rw[i]['x1']) else i+1
        a_,b_=(Rw[j],Rw[i]);a_['x0']=min(a_['x0'],b_['x0']);a_['x1']=max(a_['x1'],b_['x1']);a_['m']+=b_['m'];del Rw[i]
    return Rw
if LAY=='A':rows=[squeeze(r_,n) for r_,n in zip(rows,[4,4,5,2,5])]
ATT=sys.argv[4] if len(sys.argv)>4 else ''
R=rows
if LAY=='A':P=dict(idle=spread(R[0],4),walk=spread(R[1],4),attack=spread(R[2],5),hurt=R[3][:2],death=R[4][-5:])
elif LAY=='B':P=dict(idle=R[0][:4],walk=spread(R[1],4),attack=[R[2][4],R[2][1],R[2][2],R[2][3],R[2][4]],hurt=[R[2][0],R[3][0]],death=R[4][-5:])
elif LAY=='B4':
    a2=R[2];P=dict(idle=R[0][:4],walk=spread(R[1],4),attack=[a2[-1],a2[1],a2[2],a2[3],a2[-1]],hurt=[a2[0],R[3][0]],death=R[3][1:6] if len(R[3])>=6 else R[3][-5:])
else:P=dict(idle=R[0][:4],walk=spread(R[1],4),attack=spread(R[2],5),hurt=[R[3][0],R[4][0]],death=R[4][-5:] if len(R[4])>=5 else [R[4][0]]+R[4][1:])
def slam(r2):
    c=r2[3:-1] or r2[2:3];return max(c,key=lambda q:q['m'])
if LAY in('B','B4'):P['attack']=[R[2][-1],R[2][1],R[2][2],slam(R[2]),R[2][-1]]
if ATT=='r3':P['attack']=[R[0][0]]+R[3][1:5]
print('layout',LAY,file=sys.stderr)
rowof={id(c):ri for ri,RR in enumerate(R) for c in RR}
base={ri:float(np.median([c['by1'] for c in RR])) for ri,RR in enumerate(R)}
EXP=[('idle',4),('walk',4),('attack',5),('hurt',2),('death',5)]
F={}
for nm,k_ in EXP:
    L=P[nm];L=(L+[L[-1]]*k_)[:k_];F[nm]=[dict(c=c,cx=c['cx'],base=base[rowof[id(c)]]) for c in L]
left=max(f['cx']-f['c']['x0'] for L in F.values() for f in L);right=max(f['c']['x1']-f['cx'] for L in F.values() for f in L)
up=max(f['base']-f['c']['y0'] for L in F.values() for f in L);down=max(max(0,f['c']['y1']-f['base']) for L in F.values() for f in L)
cw=int(np.ceil(left+right))+4;chh=int(np.ceil(up+down))+4;px=int(np.ceil(left))+2;py=int(np.ceil(up))+2
sheet=np.zeros((chh*5,cw*5,4),np.uint8);rgba=np.dstack([col,a*255]).clip(0,255).astype(np.uint8)
for ri,(nm,k_) in enumerate(EXP):
    for fi,f in enumerate(F[nm]):
        c=f['c'];piece=rgba[c['y0']:c['y1'],c['x0']:c['x1']]
        X=fi*cw+int(round(px-(f['cx']-c['x0'])));Y=ri*chh+int(round(py-(f['base']-c['y0'])))
        X0,Y0=max(X,fi*cw),max(Y,ri*chh);X1,Y1=min(X+piece.shape[1],(fi+1)*cw),min(Y+piece.shape[0],(ri+1)*chh)
        sheet[Y0:Y1,X0:X1]=np.maximum(sheet[Y0:Y1,X0:X1],piece[Y0-Y:Y1-Y,X0-X:X1-X])
f0=F['idle'][0];ref=int(round(f0['base']-f0['c']['by0']))
Image.fromarray(sheet).save(out+'.webp',quality=92,method=6);Image.fromarray(sheet).save(out+'_preview.png')
print(json.dumps(dict(cw=cw,ch=chh,px=px,py=py,ref=ref,layout=LAY,rows=cnt)))
