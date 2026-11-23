"""Kin boards for the mini-boss prompts (MINI_BOSS_TH.md, miniboss_prompts/*.txt): one picture per land showing the
monster each mini-boss leads (first idle frame of its painted sheet), labelled with the mini-boss's #number in that file.
usage: python3 tools/miniboss_boards.py [outdir=/tmp]  -> miniboss_kin_<land>.jpg  (the owner attaches it in ChatGPT; not kept in the repo)
Kin without a painted sheet yet are left out (the prompt file then says nothing about a kin picture for that number)."""
import os, re, sys, importlib.util
from PIL import Image, ImageDraw, ImageFont
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
F = ImageFont.truetype(R + 'assets/fonts/Prompt-Medium.ttf', 24)

def sheets():
    """kin name -> (file, cell w, cell h) for every monster with a painted sheet in monster-sprites.js"""
    src = open(R + 'monster-sprites.js', encoding='utf-8').read()
    return {m[2]: (m[3], int(m[4]), int(m[5])) for m in re.finditer(r"""(['"])([^'"]+)\1\s*:\s*S\('([^']+)',(\d+),(\d+)""", src)}

def lands():
    spec = importlib.util.spec_from_file_location('mb', R + 'tools/miniboss_prompts.py'); mb = importlib.util.module_from_spec(spec); spec.loader.exec_module(mb)
    return mb.LANDS

def frame(file, cw, ch):
    im = Image.open(R + 'assets/monsters/' + file + '.webp').convert('RGBA').crop((0, 0, cw, ch))
    bb = im.getbbox(); return im.crop(bb) if bb else im

CW, CH, TOP, GAP = 340, 300, 38, 10
def board(land, items, have, path):
    cells = [(i + 1, kin, have[kin]) for i, e in enumerate(items) for kin in [e[5]] if kin in have]
    if not cells: return None
    cols = 3 if len(cells) <= 9 else 4; rows = (len(cells) + cols - 1) // cols
    sh = Image.new('RGB', (CW * cols + GAP * (cols - 1), (CH + TOP) * rows + GAP * (rows - 1)), (255, 255, 255)); d = ImageDraw.Draw(sh)
    for j, (n, kin, (f, cw, ch)) in enumerate(cells):
        x0 = (j % cols) * (CW + GAP); y0 = (j // cols) * (CH + TOP + GAP)
        im = frame(f, cw, ch); r = min((CW - 20) / im.width, (CH - 16) / im.height, 1.35)
        im = im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
        sh.paste(im, (x0 + (CW - im.width) // 2, y0 + TOP + (CH - im.height) // 2), im)
        d.rectangle([x0, y0, x0 + CW - 1, y0 + TOP - 4], fill=(40, 28, 20)); d.text((x0 + 10, y0 + 4), f'#{n} {kin.upper()}', fill=(255, 226, 150), font=F)
    sh.save(path, quality=88); print(os.path.basename(path), sh.size, len(cells), 'kin'); return path

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '/tmp'; os.makedirs(out, exist_ok=True); have = sheets()
    for fn, land, land_th, where, items in lands():
        board(land, items, have, os.path.join(out, 'miniboss_kin_' + fn.split('_', 1)[1] + '.jpg'))
