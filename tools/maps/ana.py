# map audit: run from anywhere with the game served on 8765 (python3 -m http.server 8765 in the repo)
"""Map openness + monster spread audit.
python3 ana.py OUT_DIR map1 map2 ... [port=8765]
For every map: size, walkable share, trees, monsters, how evenly the monsters cover the map (screen windows),
clumping (Clark-Evans), free straight walk before hitting something, and an overview PNG."""
import asyncio, sys, time, json, math, random, os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw

args = [a for a in sys.argv[1:] if '=' not in a]
kv = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
OUT = args[0]; MAPS = args[1:]; PORT = int(kv.get('port', 8765))
os.makedirs(OUT, exist_ok=True)

JS = r"""(()=>{const h=mapHosts[curMap];const W=h.W,H=h.H,S=24;const cols=Math.ceil(W/S),rows=Math.ceil(H/S);
 const isR=h.isReachable?((x,y)=>h.isReachable(x,y)):((x,y)=>!h.blocked(x,y));
 let reach='',blk='';for(let j=0;j<rows;j++){let a='',b='';for(let i=0;i<cols;i++){const x=i*S+S/2,y=j*S+S/2;a+=isR(x,y)?'1':'0';b+=h.blocked(x,y)?'1':'0';}reach+=a;blk+=b;}
 const objs=h._objs||[];const trees=objs.filter(o=>o.tree).map(o=>[o.x|0,o.y|0,(o.w|0)]);const props=objs.filter(o=>!o.tree&&o.cast&&o.solid&&o.solid.length).map(o=>[o.x|0,o.y|0]);
 const mons=enemies.filter(e=>!e.dead).map(e=>{const p=W2M(e.x,e.y);return [p.x|0,p.y|0,(e.vdef&&e.vdef.name)||(e.m&&e.m.name)||'',e.boss?1:0];});
 const sp=(h.spawns||[]).map(p=>[p.x|0,p.y|0]);const wp=(h.warps||[]).map(w=>[w.x|0,w.y|0]);
 /* free straight walk: from random walkable points, 16 directions, distance to the first blocked point */
 const pts=[];let tries=0;while(pts.length<260&&tries<40000){tries++;const x=Math.random()*W,y=Math.random()*H;if(isR(x,y))pts.push([x,y]);}
 const walk=[];for(const [x,y] of pts)for(let k=0;k<16;k++){const a=k/16*6.2832,dx=Math.cos(a),dy=Math.sin(a);let d=0;for(;d<1500;d+=8){const px=x+dx*d,py=y+dy*d;if(px<0||py<0||px>W||py>H||h.blocked(px,py))break;}walk.push(d);}
 return {W,H,S,cols,rows,reach,blk,trees,props,mons,sp,wp,walk,start:[h.spawn.start.x|0,h.spawn.start.y|0],cfg:{spawnN:h.cfg&&h.cfg.spawnN,gap:h.cfg&&h.cfg.spawnGap,grp:h.spawnGroup,thr:h.cfg&&h.cfg.groves&&h.cfg.groves.thr,open:h.cfg&&h.cfg.openTrees}};})()"""

def metrics(d):
    W, H, S, cols, rows = d['W'], d['H'], d['S'], d['cols'], d['rows']
    reach = d['reach']; blk = d['blk']
    nR = reach.count('1'); nB = blk.count('1'); N = cols * rows
    A = nR * S * S  # walkable area px^2
    mons = [m for m in d['mons'] if not m[3]]
    n = len(mons)
    # Clark-Evans clumping
    if n > 2:
        tot = 0
        for i, a in enumerate(mons):
            best = 1e18
            for j, b in enumerate(mons):
                if i != j:
                    dd = (a[0]-b[0])**2 + (a[1]-b[1])**2
                    if dd < best: best = dd
            tot += math.sqrt(best)
        mnn = tot / n; exp = 0.5 / math.sqrt(n / A); ce = mnn / exp
    else:
        mnn = ce = 0
    # screen windows
    out = {}
    for tag, (vw, vh) in {'phone': (804, 371), 'pc': (1024, 576)}.items():
        stx, sty = vw // 2, vh // 2; wins = []
        for y0 in range(0, H - vh + 1, sty):
            for x0 in range(0, W - vw + 1, stx):
                # reachable share
                i0, i1, j0, j1 = x0 // S, (x0 + vw) // S, y0 // S, (y0 + vh) // S
                tot = 0; r = 0
                for j in range(j0, min(rows, j1)):
                    row = reach[j*cols+i0:j*cols+min(cols, i1)]
                    tot += len(row); r += row.count('1')
                if tot and r / tot >= .5:
                    c = sum(1 for m in mons if x0 <= m[0] < x0+vw and y0 <= m[1] < y0+vh)
                    wins.append(c)
        if wins:
            out[tag] = dict(win=len(wins), empty=sum(1 for c in wins if c == 0)/len(wins), mean=sum(wins)/len(wins),
                            ge3=sum(1 for c in wins if c >= 3)/len(wins), med=sorted(wins)[len(wins)//2])
    w = sorted(d['walk']); L = len(w)
    return dict(W=W, H=H, reach=nR/N, blocked=nB/N, areaM=A/1e6, trees=len(d['trees']), props=len(d['props']), mons=n,
                dens=n/(A/1e6) if A else 0, ce=ce, mnn=mnn, walk_med=w[L//2], walk_lt200=sum(1 for x in w if x < 200)/L,
                walk_lt400=sum(1 for x in w if x < 400)/L, win=out, spawns=len(d['sp']), cfg=d['cfg'])

def draw(d, path):
    W, H, S, cols, rows = d['W'], d['H'], d['S'], d['cols'], d['rows']
    k = 900 / max(W, H); im = Image.new('RGB', (int(W*k)+1, int(H*k)+1), (30, 30, 34)); g = ImageDraw.Draw(im)
    reach = d['reach']; blk = d['blk']
    for j in range(rows):
        for i in range(cols):
            c = reach[j*cols+i]; b = blk[j*cols+i]
            col = (214, 206, 180) if c == '1' else ((52, 74, 46) if b == '1' else (120, 110, 96))
            g.rectangle([i*S*k, j*S*k, (i+1)*S*k, (j+1)*S*k], fill=col)
    for t in d['trees']:
        g.point((t[0]*k, t[1]*k), fill=(20, 110, 40))
    for p in d['sp']:
        g.ellipse([p[0]*k-3, p[1]*k-3, p[0]*k+3, p[1]*k+3], outline=(40, 90, 220))
    for m in d['mons']:
        col = (250, 200, 0) if m[3] else (220, 30, 30)
        g.ellipse([m[0]*k-1.6, m[1]*k-1.6, m[0]*k+1.6, m[1]*k+1.6], fill=col)
    for w in d['wp']:
        g.rectangle([w[0]*k-4, w[1]*k-4, w[0]*k+4, w[1]*k+4], fill=(40, 160, 255))
    s = d['start']; g.ellipse([s[0]*k-5, s[1]*k-5, s[0]*k+5, s[1]*k+5], outline=(255, 255, 255), width=2)
    # phone view box for scale
    g.rectangle([10, 10, 10+804*k, 10+371*k], outline=(255, 255, 255))
    im.save(path)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); ctx = await b.new_context(viewport={'width': 1280, 'height': 720}); pg = await ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.goto('http://localhost:%d/index.html?char=wolf&map=frostheim&nosw=1&guide=0&cb=%d' % (PORT, time.time())); await pg.wait_for_timeout(6000)
        await pg.evaluate("(()=>{const b=document.querySelector('[data-m=test]');if(b)b.click();})()"); await pg.wait_for_timeout(7000)
        res = {}
        for m in MAPS:
            await pg.evaluate("id=>{enterMap(id);}", m); t0 = time.time()
            while time.time() - t0 < 30:
                await pg.wait_for_timeout(400)
                if await pg.evaluate("(()=>{const h=mapHosts[curMap];return !!(h&&(h.ready||h.failed));})()"): break
            await pg.wait_for_timeout(2500)
            d = await pg.evaluate(JS)
            r = metrics(d); res[m] = r; draw(d, os.path.join(OUT, m + '.png'))
            json.dump(d, open(os.path.join(OUT, m + '.json'), 'w'))
            wp = r['win'].get('phone', {}); wc = r['win'].get('pc', {})
            print(f"{m:9s} {r['W']}x{r['H']} walk {r['reach']*100:4.0f}% trees {r['trees']:5d} props {r['props']:4d} mons {r['mons']:4d} dens {r['dens']:5.1f}/Mpx CE {r['ce']:.2f} "
                  f"| phone empty {wp.get('empty',0)*100:3.0f}% mean {wp.get('mean',0):4.1f} | pc empty {wc.get('empty',0)*100:3.0f}% mean {wc.get('mean',0):4.1f} "
                  f"| walk med {r['walk_med']} <200 {r['walk_lt200']*100:3.0f}% <400 {r['walk_lt400']*100:3.0f}% | sp {r['spawns']} cfg {r['cfg']}", flush=True)
        json.dump(res, open(os.path.join(OUT, 'summary.json'), 'w'), indent=1)
        if errs: print('ERRORS', errs[:5])
        await b.close()

asyncio.run(main())
