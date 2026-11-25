"""export.py OUT : idle strips (S + SE) of every hero at in-game scale -> OUT/pub/h/*.webp + OUT/heroes.json (see README.md)."""
import sys, os, io, json, base64, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
from common import load, SPR, REPO
WORK = sys.argv[1] if len(sys.argv) > 1 else '/tmp/size_tuner'
R = 3.2                      # strip px per world px
STD = 72.5                   # standard hero height (old wolf idle) in world px
OUT = WORK + '/pub/h/'; os.makedirs(OUT, exist_ok=True)
# key, Thai, English, land, source
HEROES = [
 ('wolf','หมาป่า','White Wolf','นอร์ส',('atlas','assets_wolf.js','WLF_',1)),
 ('rhino','แรด','Woolly Rhino','นอร์ส',('atlas','assets_rhino.js','RH_',.96)),
 ('owl','นกฮูก','Snowy Owl','นอร์ส',('atlas','assets_owl.js','OW_',.97)),
 ('raven','อีกา',"Odin's Raven",'นอร์ส',('atlas','assets.js','',1)),
 ('jaguar','จากัวร์','Black Jaguar','แอซเท็ก',('atlas','assets_jaguar.js','JAG_',1.57)),
 ('axolotl','แอคเซอลอท','Axolotl','แอซเท็ก',('atlas','assets_axolotl.js','AXL_',1.57)),
 ('croc','จระเข้','Crocodile','แอซเท็ก',('pic','assets/heroes/croc/select.webp',None)),
 ('cat','แมวโรนิน','Ronin Cat','ญี่ปุ่น',('atlas','assets_cat.js','CAT_',1.59)),
 ('dragon','มังกรฟ้า','Azure Dragon','ญี่ปุ่น',('atlas','assets_dragon.js','DRG_',1.64)),
 ('wukong','ลิงหิมะ','Snow Monkey','ญี่ปุ่น',('atlas','assets_wukong.js','WKG_',1.57)),
 ('kitsune','จิ้งจอก','Nine-Tail Miko','ญี่ปุ่น',('pic','assets/heroes/kitsune/select.webp',None)),
 ('hippo','ฮิปโป','Nile Hippo','อียิปต์',('atlas','assets_hippo.js','HIP_',1.57)),   # re-based 1.39 -> 1.57 (= standard height at size 1)
 ('bastet','บาสเต็ด','Bastet Priestess','อียิปต์',('atlas','assets_bastet.js','BST_',1.56)),
 ('anubis','อนูบิส','Anubis Jackal','อียิปต์',('pic','assets/heroes/anubis/view_S.webp','assets/heroes/anubis/view_SE.webp')),
 ('sheep','แกะทองคำ','Golden Sheep','กรีก',('atlas','assets_sheep.js','SHE_',1.57)),
 ('lion','สิงโต','Olympian Lion','กรีก',('pic','assets/heroes/lion/select.webp',None)),
 ('drake','มังกรไฟ','Forgeborn Drake','กรีก',('atlas','assets_drake.js','DRK_',1.55)),
]
# 'now' = what the game shows today, as a height relative to the standard = index.html HERO_SIZE (every CHAR_SCALE base draws the standard height)
import re as _re
_m = _re.search(r'const HERO_SIZE=\{([^}]*)\}', open(REPO + '/index.html', encoding='utf-8').read())
NOW = {k: float(v) for k, v in _re.findall(r'(\w+):([\d.]+)', _m.group(1))} if _m else {}
def key_green(im):
    a = np.array(im.convert('RGBA')).astype(np.float32)
    r,g,b = a[...,0],a[...,1],a[...,2]
    ex = g - np.maximum(r,b)
    al = np.clip(1 - (ex - 18)/55, 0, 1)
    edge = (al < 1) & (al > 0)
    g2 = np.where(ex > 0, np.maximum(r,b) + np.maximum(0, ex) * (1-np.clip((ex-6)/25,0,1)), g)
    a[...,1] = np.where(al < 1, np.minimum(g, g2), g)
    a[...,3] = a[...,3] * al
    return Image.fromarray(a.clip(0,255).astype(np.uint8))
def pack(frames, name):
    # frames: list of (RGBA image, left, top) in strip px relative to the feet
    boxes = []
    for im, l, t in frames:
        bb = im.getbbox() or (0,0,1,1); boxes.append((l+bb[0], t+bb[1], l+bb[2], t+bb[3]))
    x0 = math.floor(min(b[0] for b in boxes)) - 2; y0 = math.floor(min(b[1] for b in boxes)) - 2
    x1 = math.ceil(max(b[2] for b in boxes)) + 2; y1 = math.ceil(max(b[3] for b in boxes)) + 2
    cw, ch = x1 - x0, y1 - y0
    S = Image.new('RGBA', (cw*len(frames), ch), (0,0,0,0))
    for i,(im,l,t) in enumerate(frames):
        S.alpha_composite(im, (int(round(i*cw + l - x0)), int(round(t - y0))))
    S.save(OUT + name + '.webp', quality=78, method=6, alpha_quality=75)
    return dict(src='h/%s.webp' % name, n=len(frames), cw=cw, ch=ch, fx=-x0, fy=-y0)
def atlas_strip(js, pre, cs, d, hk):
    M, A = load(js, pre)
    sh = Image.open(io.BytesIO(base64.b64decode(A['idle'].split(',',1)[1]))).convert('RGBA')
    D = M['states']['idle']['dirs'][d]; pv = M['pivot']; fr = []
    for x,y,w,h,bx,by,bw,bh in D['f']:
        k = SPR*cs*R; dw, dh = max(1,round(bw*k)), max(1,round(bh*k))
        im = sh.crop((x,y,x+w,y+h)).resize((dw,dh), Image.LANCZOS)
        fr.append((im, (bx-pv['x'])*k, (by-pv['y'])*k))
    o = pack(fr, '%s_%s' % (hk, d)); o['dur'] = D.get('dur') or [200]*len(fr); return o
def pic_strip(path, hk, d):
    im = Image.open(REPO + path).convert('RGBA')
    if im.getpixel((2,2))[3] > 200: im = key_green(im)
    a = np.array(im)[...,3]; ys = np.where(a.max(1) > 40)[0]; xs = np.where(a.max(0) > 40)[0]
    im = im.crop((xs.min(), ys.min(), xs.max()+1, ys.max()+1)); a = np.array(im)[...,3]
    k = STD*R / im.height; im = im.resize((max(1,round(im.width*k)), round(im.height*k)), Image.LANCZOS)
    a = np.array(im)[...,3]; hh = a.shape[0]; low = a[int(hh*.93):]
    cols = np.where(low.max(0) > 60)[0]; fx = (cols.min()+cols.max())/2 if len(cols) else im.width/2
    o = pack([(im, -fx, -im.height)], '%s_%s' % (hk, d)); o['dur'] = [1000]; return o
out = []
for hk, th, en, land, src in HEROES:
    e = dict(k=hk, th=th, en=en, land=land, now=NOW.get(hk,1))
    if src[0] == 'atlas':
        e['kind'] = 'placeholder' if hk == 'raven' else 'sprite'
        for d in ('S','SE'): e[d] = atlas_strip(src[1], src[2], src[3], d, hk)
    else:
        e['kind'] = 'design'
        e['S'] = pic_strip(src[1], hk, 'S'); e['SE'] = pic_strip(src[2], hk, 'SE') if src[2] else e['S']
    if hk == 'raven': e['filter'] = 'grayscale(.6) brightness(.5) contrast(1.25) sepia(.3) hue-rotate(200deg) saturate(1.6)'
    out.append(e); print(hk, e['kind'], {d:(e[d]['n'],e[d]['cw'],e[d]['ch']) for d in ('S','SE')})
# head height (ht) and feet-to-edge widths (wl, wr) in world units at size 1, mean over the frames
for e in out:
    for d in ('S','SE'):
        s = e[d]; a = np.array(Image.open(WORK + '/pub/' + s['src']).convert('RGBA'))[...,3]; tops=[]; ls=[]; rs=[]
        for i in range(s['n']):
            c = a[:, i*s['cw']:(i+1)*s['cw']]; ys = np.where(c.max(1) > 60)[0]; xs = np.where(c.max(0) > 60)[0]
            tops.append(s['fy']-ys.min()); ls.append(s['fx']-xs.min()); rs.append(xs.max()+1-s['fx'])
        s['ht'] = round(float(np.mean(tops))/R, 2); s['wl'] = round(float(np.mean(ls))/R, 2); s['wr'] = round(float(np.mean(rs))/R, 2)
json.dump(dict(R=R, STD=STD, heroes=out), open(WORK + '/heroes.json','w'), ensure_ascii=False)
