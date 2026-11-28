#!/usr/bin/env python3
"""Frame strips of FXLIB effects, drawn by the gallery page's own stage (fxlib.html → GAL.sheet).

  python3 tools/fxlib/sheet.py OUT.png IDS [ground=grass|snow|night|sand] [el=fire] [cols=8] [cw=300] [ch=220]
                                           [phi=0] [size=1] [zoom=1] [pow=1.35] [max=5] [times=.05,.1,…] [rows=12]
                                           [page=fxlib.html]   (page=hyena_fx.html = the hyena's own gallery, same hooks)

IDS = comma list of ids and / or prefixes ending in '*'  (slash.*  ·  boom.blast,boom.nova  ·  all)
One row per effect, `cols` frames from its start to its end (early frames closer together). More than `rows` effects
are split into OUT_1.png, OUT_2.png …  Needs the repo served on 8765 (the script starts a server when nothing listens).
"""
import sys, os, base64, json, socket, subprocess, time
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def serve():
    s = socket.socket()
    try:
        s.connect(('127.0.0.1', 8765)); s.close(); return None
    except OSError:
        p = subprocess.Popen([sys.executable, '-m', 'http.server', '8765'], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(.8); return p

def main():
    out, ids = sys.argv[1], sys.argv[2]
    kv = dict(a.split('=', 1) for a in sys.argv[3:])
    opt = {}
    for k in ('cols', 'cw', 'ch'):
        if k in kv: opt[k] = int(kv[k])
    for k in ('phi', 'size', 'zoom', 'pow', 'max'):
        if k in kv: opt[k] = float(kv[k])
    for k in ('ground', 'el'):
        if k in kv: opt[k] = kv[k]
    if 'times' in kv: opt['times'] = [float(x) for x in kv['times'].split(',')]; opt['cols'] = len(opt['times'])
    if 'opt' in kv: opt['opt'] = json.loads(kv['opt'])
    rows = int(kv.get('rows', 12))
    srv = serve()
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1200, 'height': 800})
            errs = []
            pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto('http://localhost:8765/%s?t=%d' % (kv.get('page', 'fxlib.html'), time.time())); pg.wait_for_function('window.GAL&&window.FXLIB&&(!GAL.ready||GAL.ready())')
            allids = pg.evaluate('GAL.ids()')
            want = []
            for tok in ids.split(','):
                if tok == 'all': want += allids
                elif tok.endswith('*'): want += [i for i in allids if i.startswith(tok[:-1])]
                else: want.append(tok)
            chunks = [want[i:i + rows] for i in range(0, len(want), rows)] or [[]]
            for n, ch in enumerate(chunks):
                url = pg.evaluate('([ids,o])=>GAL.sheet(ids,o)', [ch, opt])
                f = out if len(chunks) == 1 else out.replace('.png', '_%d.png' % (n + 1))
                open(f, 'wb').write(base64.b64decode(url.split(',', 1)[1])); print(f, len(ch), 'effects')
            for e in errs[:30]: print('ERR', e[:300])
            b.close()
    finally:
        if srv: srv.terminate()

main()
