"""Boss reference boards for the relic icon prompts (BOSS_RELIC_ICON_PROMPTS_TH.md): one picture per land, bosses numbered 1-6 in the prompt's order.
usage: python3 tools/relic_boards.py [outdir=/tmp]  -> boss_ref_<land>.jpg (the owner attaches one per sheet in ChatGPT; not kept in the repo).
Viking design sheets -> front view + head / weapon close-ups. Green / grey backgrounds keyed to white."""
import numpy as np, sys
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as nd
import os
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/';B=R+'assets/bosses/'
F=ImageFont.truetype(R+'assets/fonts/Prompt-Medium.ttf',30)
def key(im):
    a=np.asarray(im.convert('RGB')).astype(int)
    bd=np.concatenate([a[:3].reshape(-1,3),a[-3:].reshape(-1,3),a[:,:3].reshape(-1,3),a[:,-3:].reshape(-1,3)]);k=np.median(bd,0)
    if k[1]>200 and k[0]<80:   # green screen
        g=(a[...,1]-np.maximum(a[...,0],a[...,2]))
        rgba=np.dstack([a,np.clip((90-g)*255/50,0,255)]).astype('uint8')   # every green-screen pixel goes, also pockets inside the figure
        return Image.fromarray(rgba,'RGBA')
    else:                       # flat grey
        bg=np.abs(a-k).max(-1)<14
    lab,_=nd.label(bg);edge=np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]]));edge=edge[edge>0]
    m=np.isin(lab,edge);rgba=np.dstack([a,np.where(m,0,255)]).astype('uint8')
    return Image.fromarray(rgba,'RGBA')
def boxes(im):
    a=np.asarray(im)[...,3]>0;a=nd.binary_closing(a,iterations=6)
    lab,_=nd.label(nd.binary_dilation(a,iterations=8))
    o=[s for s in nd.find_objects(lab) if (lab[s]>0).sum()>4000]
    return sorted(o,key=lambda s:(s[0].start//200,s[1].start))
def fit(im,w,h):
    bb=im.getbbox();im=im.crop(bb) if bb else im
    r=min(w/im.width,h/im.height);return im.resize((max(1,int(im.width*r)),max(1,int(im.height*r))),Image.LANCZOS)
def sheetcell(path,W,H,v=0):
    im=key(Image.open(path));o=boxes(im)
    front=im.crop((o[v][1].start,o[v][0].start,o[v][1].stop,o[v][0].stop))
    c1=im.crop((o[4][1].start,o[4][0].start,o[4][1].stop,o[4][0].stop));c2=im.crop((o[5][1].start,o[5][0].start,o[5][1].stop,o[5][0].stop))
    cell=Image.new('RGBA',(W,H),(0,0,0,0))
    f=fit(front,int(W*.46),H-10);cell.alpha_composite(f,((int(W*.46)-f.width)//2,(H-f.height)//2))
    for i,c in enumerate((c1,c2)):
        t=fit(c,int(W*.52),H//2-10);cell.alpha_composite(t,(int(W*.47)+(int(W*.52)-t.width)//2,i*H//2+(H//2-t.height)//2))
    return cell
def picell(src,W,H):
    im=src if isinstance(src,Image.Image) else key(Image.open(src))
    t=fit(im,W-16,H-16);cell=Image.new('RGBA',(W,H),(0,0,0,0));cell.alpha_composite(t,((W-t.width)//2,(H-t.height)//2));return cell
fen=Image.open(R+'assets/monsters/fenrirBoss.webp').convert('RGBA')
LANDS={
 'viking':[('DRAUGR FORGEMASTER',('s3',B+'viking/draugr_sheet.png')),('HULDRA',('s',B+'viking/huldra_sheet.png')),('JOTUN BRUTE',('s',B+'viking/jotun_sheet.png')),('FENRIR',('p',fen)),('NIDHOGG',('s',B+'viking/nidhogg_sheet.png')),('YMIR',('s',B+'viking/ymir_sheet.png'))],
 'greek':[(n,('p',B+'greek/'+f)) for n,f in [('POLYPHEMUS','polyphemus.png'),('HECATE','hecate.png'),('TROJAN COLOSSUS','trojan_colossus.png'),('MINOTAUR','minotaur.png'),('CERBERUS','cerberus.png'),('TYPHON','typhon.png')]],
 'egypt':[(n,('p',B+'egypt/'+f)) for n,f in [('MUMMY VIZIER','mummy_vizier.png'),('SPHINX GUARDIAN','sphinx_guardian.png'),('SALT SCORPION KING','salt_scorpion_king.png'),('PHARAOH UNDYING','pharaoh_undying.png'),('SET','set.png'),('APEP','apep.png')]],
 'japan':[(n,('p',B+'japan/'+f)) for n,f in [('JONIN SHADOW (TANUKI)','jonin_shadow.png'),('JOROGUMO','jorogumo.png'),('GASHADOKURO','gashadokuro.png'),('GHOST SHOGUN','ghost_shogun.png'),('SHUTEN-DOJI','shuten_doji.png'),('YAMATA NO OROCHI','yamata_no_orochi.png')]],
 'aztec':[(n,('p',B+'aztec/'+f)) for n,f in [('CAMAZOTZ','camazotz.png'),('AHUIZOTL','ahuizotl.png'),('EAGLE WARLORD','eagle_warlord.png'),('TZITZIMITL','tzitzimitl.png'),('MICTLANTECUHTLI','mictlantecuhtli.png'),('QUETZALCOATL','quetzalcoatl.png')]]}
CW,CH,TOP,GAP=520,520,46,10
out=sys.argv[1] if len(sys.argv)>1 else '/tmp';os.makedirs(out,exist_ok=True)
for land,L in LANDS.items():
    sh=Image.new('RGB',(CW*3+GAP*2,(CH+TOP)*2+GAP),(255,255,255));d=ImageDraw.Draw(sh)
    for i,(name,(kind,src)) in enumerate(L):
        x0=(i%3)*(CW+GAP);y0=(i//3)*(CH+TOP+GAP)
        cell=sheetcell(src,CW,CH,int(kind[1:] or 0)) if kind[0]=='s' else picell(src,CW,CH)
        sh.paste(cell,(x0,y0+TOP),cell)
        d.rectangle([x0,y0,x0+CW-1,y0+TOP-4],fill=(40,28,20));d.text((x0+12,y0+5),f'{i+1}) {name}',fill=(255,226,150),font=F)
    sh.save(f'{out}/boss_ref_{land}.jpg',quality=88);print(land,sh.size)
