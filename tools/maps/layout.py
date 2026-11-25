# Layout check of field maps: size, walkable share, warps at the edge + reachable both ways (arrival point in the main area), warp-to-warp walking time (s),
# layout time, and a top-down picture (walkable ground, trees, paths, warps).  python3 layout.py OUTDIR [ids=a,b] [port=8765]
import asyncio, sys, json, time, math, os
import numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import dijkstra, connected_components
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright
args = [a for a in sys.argv[1:] if '=' not in a]; kv = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
OUT = args[0]; PORT = int(kv.get('port', 8765)); IDS = kv.get('ids'); os.makedirs(OUT, exist_ok=True)
K = 0.62; SPD = 165.0
JS = r"""(()=>{const h=mapHosts[curMap];const W=h.W,H=h.H,S=24;const cols=Math.ceil(W/S),rows=Math.ceil(H/S);
 const isR=h.isReachable?((x,y)=>h.isReachable(x,y)):((x,y)=>!h.blocked(x,y));const isB=(x,y)=>h.blocked(x,y);
 let g='',b='';for(let j=0;j<rows;j++){let a='',c='';for(let i=0;i<cols;i++){a+=isR(i*S+S/2,j*S+S/2)?'1':'0';c+=isB(i*S+S/2,j*S+S/2)?'1':'0';}g+=a;b+=c;}
 const wp=(h.warps||[]).map(w=>({id:w.id||'',x:w.x|0,y:w.y|0,to:w.to||''}));
 const ob=(h._objs||[]).filter(o=>o.tree||o.big).map(o=>[o.x|0,o.y|0,(o.w||60)|0,o.tree?1:0]);
 const tr=(h._trails||[]).map(P=>P.filter((p,i)=>i%4==0).map(p=>[p[0]|0,p[1]|0,(p[4]||60)|0]));
 return {W,H,S,cols,rows,g,b,wp,ob,tr,mons:enemies.filter(e=>!e.dead).length};})()"""
OFF = [(1,0),(0,1),(1,1),(1,-1),(2,1),(1,2),(2,-1),(1,-2)]
def graph(walk, S):
    rows, cols = walk.shape; idx = -np.ones((rows, cols), dtype=np.int64); n = int(walk.sum()); idx[walk] = np.arange(n)
    R, C, Wt = [], [], []
    for di, dj in OFF:
        w = math.hypot(di * S, dj * S / K); r0, r1 = max(0, -dj), rows - max(0, dj); c0, c1 = max(0, -di), cols - max(0, di)
        src = walk[r0:r1, c0:c1] & walk[r0 + dj:r1 + dj, c0 + di:c1 + di]
        if abs(di) + abs(dj) > 1:
            src &= walk[r0:r1, c0 + int(np.sign(di)):c1 + int(np.sign(di))] & walk[r0 + int(np.sign(dj)):r1 + int(np.sign(dj)), c0:c1]
        ys, xs = np.nonzero(src); ys += r0; xs += c0
        R.append(idx[ys, xs]); C.append(idx[ys + dj, xs + di]); Wt.append(np.full(len(ys), w))
    R = np.concatenate(R); C = np.concatenate(C); Wt = np.concatenate(Wt)
    return idx, n, coo_matrix((np.concatenate([Wt, Wt]), (np.concatenate([R, C]), np.concatenate([C, R]))), shape=(n, n)).tocsr()
def snap(walk, idx, S, x, y):
    rows, cols = walk.shape; c, r = int(x // S), int(y // S); best = None
    for rad in range(0, 12):
        for rr in range(r - rad, r + rad + 1):
            for cc in range(c - rad, c + rad + 1):
                if 0 <= rr < rows and 0 <= cc < cols and walk[rr, cc]:
                    dd = (rr - r) ** 2 + (cc - c) ** 2
                    if best is None or dd < best[0]: best = (dd, idx[rr, cc], rad)
        if best: return best[1], best[2] * S
    return None, None
def solve(m, d):
    S, cols, rows = d['S'], d['cols'], d['rows']; W, H = d['W'], d['H']
    walk = np.frombuffer(d['g'].encode(), dtype=np.uint8).reshape(rows, cols) == 49
    blk = np.frombuffer(d['b'].encode(), dtype=np.uint8).reshape(rows, cols) == 49
    idx, n, G = graph(walk, S)
    ncomp, lab = connected_components(G, directed=False)
    res = {'W': W, 'H': H, 'mons': d['mons'], 'walk%': round(100 * n / (rows * cols), 1), 'open%': round(100 * (1 - blk.mean()), 1), 'warps': [], 'pairs': []}
    pts = []
    for w in d['wp']:
        ed = min(w['x'], w['y'], W - w['x'], H - w['y']); node, off = snap(walk, idx, S, w['x'], w['y'])
        # arrival point: 130 px toward the map centre
        dx, dy = W / 2 - w['x'], H / 2 - w['y']; l = math.hypot(dx, dy) or 1; ax, ay = w['x'] + dx / l * 130, w['y'] + dy / l * 130
        an, aoff = snap(walk, idx, S, ax, ay)
        ok = node is not None and an is not None and lab[node] == lab[an]
        res['warps'].append({'id': w['id'], 'to': w['to'], 'x': w['x'], 'y': w['y'], 'edge': ed, 'snapOff': off, 'arriveOk': bool(ok)})
        if node is not None: pts.append((w['id'], node))
    if pts:
        dist = dijkstra(G, indices=[p[1] for p in pts])
        for i in range(len(pts)):
            for j in range(i + 1, len(pts)):
                v = dist[i][pts[j][1]]; res['pairs'].append([pts[i][0], pts[j][0], round(v / SPD, 1) if np.isfinite(v) else None])
    # picture
    sc = 600 / W; img = Image.new('RGB', (600, int(H * sc)), (40, 40, 40)); px = img.load()
    for r in range(rows):
        for c in range(cols):
            col = (150, 190, 110) if walk[r, c] else ((60, 90, 60) if blk[r, c] else (110, 110, 110))
            x0, y0 = int(c * S * sc), int(r * S * sc)
            for yy in range(y0, min(img.size[1], int((r + 1) * S * sc) + 1)):
                for xx in range(x0, min(600, int((c + 1) * S * sc) + 1)): px[xx, yy] = col
    dr = ImageDraw.Draw(img)
    for P in d['tr']:
        for p in P: dr.ellipse([p[0] * sc - 2, p[1] * sc - 2, p[0] * sc + 2, p[1] * sc + 2], fill=(200, 150, 90))
    for o in d['ob']:
        r = max(1.5, o[2] * .3 * sc); dr.ellipse([o[0] * sc - r, o[1] * sc - r * 1.2, o[0] * sc + r, o[1] * sc], fill=(30, 70, 40) if o[3] else (120, 90, 70))
    for w in res['warps']:
        x, y = w['x'] * sc, w['y'] * sc; dr.ellipse([x - 6, y - 6, x + 6, y + 6], fill=(60, 190, 255) if w['arriveOk'] else (255, 40, 40), outline=(0, 0, 0)); dr.text((x + 7, y - 6), w['id'], fill=(255, 255, 255))
    img.save(os.path.join(OUT, m + '.png'))
    return res
async def main():
    out = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width': 1280, 'height': 720}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('http://localhost:%d/index.html?char=wolf&map=frostheim&nosw=1&guide=0&cb=%d' % (PORT, time.time())); await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()"); await pg.wait_for_timeout(7000)
        ids = IDS.split(',') if IDS else await pg.evaluate("Object.keys(window.VK_MAPS||{}).filter(k=>/^(vik|azt|grk|egy|jpn)(F\\d+|H\\d|E\\d)$/.test(k)||/^c(N|E|S|W|NE|SW)$/.test(k)).concat(['snowpine'])")
        for m in ids:
            try:
                t0 = time.time(); await pg.evaluate("id=>{enterMap(id);}", m)
                while time.time() - t0 < 60:
                    await pg.wait_for_timeout(300)
                    if await pg.evaluate("(()=>{const h=mapHosts[curMap];return !!(h&&h.ready);})()"): break
                lt = round(time.time() - t0, 1); await pg.wait_for_timeout(1500)
                d = await pg.evaluate(JS); r = solve(m, d); r['layout_s'] = lt; out[m] = r
                bad = [w['id'] for w in r['warps'] if not w['arriveOk']]; far = [w['id'] + ':' + str(w['edge']) for w in r['warps'] if w['edge'] > 260]
                print(m, r['W'], r['H'], 'walk', r['walk%'], 'mons', r['mons'], 'lay', lt, 'BAD' if bad else '', bad, 'inner', far,
                      'pairs', [x[2] for x in r['pairs']], flush=True)
            except Exception as e:
                print(m, 'ERR', str(e)[:200], flush=True)
        if errs: print('PAGEERR', errs[:5])
        await b.close()
    json.dump(out, open(os.path.join(OUT, 'eval.json'), 'w'), indent=1)
asyncio.run(main())
