"""bgcut.py WORK : crop the chosen captures (WORK/bg/<name>_<i>.png from bg.py) -> WORK/pub/bg/*.webp + WORK/bgs.json"""
import sys, json
import numpy as np
from PIL import Image
WORK = sys.argv[1] if len(sys.argv) > 1 else '/tmp/size_tuner'
TOP = 60   # the canvas-drawn map name sits in the top 40 CSS px
# key, Thai label, capture name, index, row line as a fraction of the capture height (None = the row bg.py aimed at)
PICK = [('snow','หิมะ','vikF2',1,None), ('grass','ทุ่งหญ้า','grkF1',0,None), ('sand','ทะเลทราย','egyF1',1,None), ('town','เมืองหลวง','capTc',1,.585)]
out = []
for k, th, name, i, frac in PICK:
    J = json.load(open('%s/bg/%s.json' % (WORK, name))); inf = J['info']; sp = J['spots'][i]
    assert abs(sp['pl'][1] - (sp['wy'] + 600)) < 1, ('player was moved; camera not where bg.py aimed', k)
    im = Image.open('%s/bg/%s_%d.png' % (WORK, name, i)).convert('RGB'); im = im.crop((0, TOP, im.width, im.height))
    im.save('%s/pub/bg/%s.webp' % (WORK, k), quality=72, method=6)
    dpr = inf['DPR']
    rowY = frac * inf['VH'] * dpr - TOP if frac else (sp['row'][1] - sp['cam'][1] * inf['K']) * inf['Z'] * dpr + inf['VH'] * dpr / 2 - TOP
    a = np.array(im).astype(float); col = lambda p: '#%02x%02x%02x' % tuple(int(v) for v in p.mean((0, 1)))
    out.append(dict(k=k, th=th, map=inf['map'], src='bg/%s.webp' % k, w=im.width, h=im.height, z=inf['Z'] * dpr, rowY=round(rowY, 1), charK=inf['charK'], cf=inf['cf'], ct=col(a[:40]), cb=col(a[-40:])))
    print(k, im.size, round(rowY, 1), inf['charK'])
json.dump(out, open(WORK + '/bgs.json', 'w'), ensure_ascii=False)
