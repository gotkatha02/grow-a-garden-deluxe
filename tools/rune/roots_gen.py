#!/usr/bin/env python3
"""Totem Roots (รากโทเท็ม) = the 'normal rune' web that holds Class C — PROPOSAL, nothing in the game yet.

Owner 2026-11-22:
  12:34 'แยกเป็นโหนดเยอะๆ แบบ ROM · อัปได้เลเวลน้อยอยู่ตื้น อัปยากอยู่ลึก · เพิ่มอันเล็กๆ บวกสเตตัส ไม่เอา HP
         แต่ให้มีเยอะๆ · ผู้เล่นรู้สึกว่าได้เลือก · กว่าจะได้สกิล C อันนึงต้องฟาร์ม'
  12:38 'ต้องอัปโหนดย่อยเยอะๆ ก่อนถึงจะอัปสาย C ได้ซักสกิล'
  12:47 'มันติดกันไปไหม ดูของ ROM สกิลโหดๆ มันไม่ติดกันนะ' + 'อยากได้ผังแนวๆ นี้' (ROM's sprawling rune map)

v3 = ROM-style sprawling web seen from above: the heart (under the totem) in the middle, roots spreading out in every
direction. Depth = distance from the heart: band 1 Lv 31+ (cheap, near the heart) · band 2 Lv 41+ · band 3 Lv 51+
(C tier 1–2) · band 4 Lv 54+ (C tier 3–4, the rim). The 12 C skills sit in knots far apart from each other
(A on the left, B on the right, Basic top / bottom), every knot / cluster in between is joined by chains of small
+1 stat nodes. Clusters: hexagon knots (6 small round a centre: C skill, +3 notable or branch bonus) and stars
(a small hub with 5 small spokes), placed by Poisson-disk sampling and joined by a planar spanning tree + loops.

A C skill needs: a lit path to its knot + 3 of the knot's 6 ring nodes + enough nodes lit in all (25 / 40 / 55 / 70)
+ the hero level (51 / 52 / 54 / 56) + its old tree requirement + the farmed goods.

  python3 tools/rune/roots_gen.py js    → tools/mock_rune/roots_web.js (window.ROOTS_WEB) for tools/mock_rune/roots.html
  python3 tools/rune/roots_gen.py sim   → node counts, point budget, distances, farming hours (RUNE_SYSTEM_TH.md §2)
"""
import json, math, sys, os, heapq, random

SEED = 11
RX, RY = 1500, 1150                         # half-size of the web (an ellipse), heart at (0, 0)
BANDS = [(.30, 1), (.52, 2), (.76, 3), (9, 4)]  # normalised radius ρ → band
BAND_LV = {1: 31, 2: 41, 3: 51, 4: 54}
C_LV = {1: 51, 2: 52, 3: 54, 4: 56}          # CTIER_LV under the Lv 60 cap (unchanged)
C_NEED = {1: 25, 2: 40, 3: 55, 4: 70}        # nodes lit in all before a C skill of this tier
PTS = lambda lv: 0 if lv < 31 else 4 * (min(lv, 60) - 30)   # rune points: 4 a level from Lv 31 → 120 at Lv 60
RING, RING_C, STAR, HEART_R = 44, 72, 54, 54
GAP = 150                                     # free room between two clusters (for a chain of small nodes)
MAXL = 470                                    # longest chain between two clusters (edge to edge)
MIN_C_SEP = 16                                # small nodes at least between two C knots (owner 12:47)
MIN_H_C = 20                                  # … and between the heart and any C knot

# where the 12 C knots sit: (angle°, ρ) — screen angles, 0 = right, 90 = down. Far apart on purpose (owner 12:47).
CSITE = {('B', 1): (0, .56), ('basic', 1): (60, .58), ('basic', 2): (120, .58), ('A', 1): (180, .56), ('A', 2): (240, .58),
         ('B', 2): (300, .58),                                   # inner ring (tiers 1–2, band 3) every 60°
         ('B', 3): (30, .97), ('basic', 3): (90, .97), ('A', 3): (150, .97), ('A', 4): (210, .97),
         ('basic', 4): (270, .97), ('B', 4): (330, .97)}         # outer ring (tiers 3–4, band 4), in between
BSITE = {('A', 2): (165, .36), ('A', 3): (215, .40), ('B', 2): (15, .36), ('B', 3): (325, .40),
         ('basic', 2): (90, .36), ('basic', 3): (270, .38)}
# wolf, as the mockup hero (in the game: from each hero's 12 C skills, CSK col / tier)
CSK = {('basic', 1): ('endlessChain', 'Endless Chain'), ('A', 1): ('savageEcho', 'Savage Echo'), ('B', 1): ('hoarfrostEdge', 'Hoarfrost Edge'),
       ('basic', 2): ('warBanner', 'War Banner'), ('A', 2): ('ravenousLeap', 'Ravenous Leap'), ('B', 2): ('glacialPath', 'Glacial Path'),
       ('basic', 3): ('echoStep', 'Echo Step'), ('A', 3): ('valhallaAssault', 'Valhalla Assault'), ('B', 3): ('stormChain', 'Storm Chain'),
       ('basic', 4): ('fenrirsSpirit', "Fenrir's Spirit"), ('A', 4): ('einherjarsCall', "Einherjar's Call"), ('B', 4): ('worldstorm', 'Worldstorm')}
# stat flavour of each region (the nearest C knot's root): 8 stats, never HP / SP; the main stat comes most often
FLAV = {'A': ['atk', 'agi', 'atk', 'lck', 'vit', 'atk', 'def', 'agi'],
        'basic': ['vit', 'def', 'cha', 'vit', 'int', 'def', 'cha', 'lck'],
        'B': ['tal', 'int', 'tal', 'cha', 'agi', 'tal', 'int', 'def']}
MAIN = {'A': 'atk', 'basic': 'vit', 'B': 'tal'}
SIDE = {'A': ['lck', 'agi', 'def', 'cha'], 'basic': ['def', 'cha', 'int', 'lck'], 'B': ['int', 'cha', 'agi', 'vit']}
BRANCH = {('A', 2): 'สาย A · ใช้สกิลครั้งที่ 4 ไม่ใช้ SP', ('A', 3): 'สาย A · คูลดาวน์ −0.5 วิ',
          ('basic', 2): 'สายพื้นฐาน · บัฟ +2 วิ', ('basic', 3): 'สายพื้นฐาน · SP −2',
          ('B', 2): 'สาย B · สถานะติดนาน +0.4 วิ', ('B', 3): 'สาย B · คูลดาวน์ −0.5 วิ'}

# ---------------------------------------------------------------- prices by band (draft — tuned with `sim`)
# goods: pt rune points · sap ยางวิญญาณ · ma / mb monster mats of the band (common / rare) · medal เหรียญโทเท็มทอง
#        core แก่นผู้พิทักษ์ · z zeny
COST = {
    ('m', 1): dict(pt=1, sap=6, z=1500),
    ('n', 1): dict(pt=2, sap=20, ma=4, z=4000),
    ('m', 2): dict(pt=1, sap=10, ma=2, z=3000),
    ('n', 2): dict(pt=2, sap=30, ma=8, mb=2, medal=1, z=9000),
    ('m', 3): dict(pt=1, sap=16, ma=3, z=6000),
    ('n', 3): dict(pt=2, sap=45, ma=10, mb=3, medal=1, z=15000),
    ('m', 4): dict(pt=1, sap=24, ma=5, mb=1, z=10000),
    ('n', 4): dict(pt=2, sap=60, ma=12, mb=4, medal=2, z=22000),
    ('c', 1): dict(pt=3, sap=120, mb=8, medal=3, core=1, z=40000),
    ('c', 2): dict(pt=3, sap=150, mb=10, medal=4, core=1, z=55000),
    ('c', 3): dict(pt=3, sap=220, mb=14, medal=5, core=2, z=90000),
    ('c', 4): dict(pt=3, sap=280, mb=18, medal=6, core=3, z=130000),
}
CORE_CRAFT = dict(medal=15, mb=6, z=30000)    # แก่นผู้พิทักษ์ at the shaman (MVP / main bosses also drop it)


def rho(x, y):
    return math.hypot(x / RX, y / RY)


def band_of(x, y):
    r = rho(x, y)
    for lim, b in BANDS:
        if r < lim:
            return b
    return 4


def seg_hit(p1, p2, p3, p4):
    """Proper crossing of segments p1-p2 and p3-p4."""
    def o(a, b, c):
        return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    d1, d2, d3, d4 = o(p3, p4, p1), o(p3, p4, p2), o(p1, p2, p3), o(p1, p2, p4)
    return (d1 > 0) != (d2 > 0) and (d3 > 0) != (d4 > 0)


def seg_dist(p, a, b):
    ax, ay, bx, by = a[0], a[1], b[0], b[1]
    dx, dy = bx - ax, by - ay
    t = max(0, min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy or 1)))
    return math.hypot(p[0] - ax - t * dx, p[1] - ay - t * dy)


def build_once(seed=SEED):
    R = random.Random(seed)
    N, E = {}, []
    EC = {}                                   # edge → join index (to find the loops on a short way)

    def node(i, x, y, k, **kw):
        N[i] = dict(id=i, x=round(x, 1), y=round(y, 1), k=k, band=band_of(x, y), **kw)
        return i

    def edge(a, b, t='root', ci=None):
        E.append([a, b, t])
        if ci is not None:
            EC[(a, b)] = EC[(b, a)] = ci

    # ---- cluster sites
    sites = [dict(id='H', x=0, y=0, kind='h', r=HEART_R)]
    for (col, t), (ang, f) in CSITE.items():
        a = math.radians(ang)
        sites.append(dict(id=f'C{col}{t}', x=math.cos(a) * RX * f, y=math.sin(a) * RY * f, kind='c', col=col, tier=t, r=RING_C))
    for (col, j), (ang, f) in BSITE.items():
        a = math.radians(ang)
        sites.append(dict(id=f'B{col}{j}', x=math.cos(a) * RX * f, y=math.sin(a) * RY * f, kind='b', col=col, key=(col, j), r=RING))
    for _ in range(9000):
        x, y = (R.random() * 2 - 1) * RX, (R.random() * 2 - 1) * RY
        r = rho(x, y)
        if r > 1.0 or r < .2:
            continue
        kind = 'n' if R.random() < .28 else 's'
        rr = RING if kind == 'n' else STAR
        if all(math.hypot(x - s['x'], y - s['y']) >= rr + s['r'] + GAP for s in sites):
            sites.append(dict(id=f'S{len(sites)}', x=x, y=y, kind=kind, r=rr))
    for s in sites:
        s['col'] = s.get('col') or min(((math.hypot(s['x'] - c['x'], s['y'] - c['y']), c['col']) for c in sites if c['kind'] == 'c'))[1]

    # ---- cluster nodes + ports
    cnt = {}

    def minor(i, x, y, col):
        cnt[col] = cnt.get(col, 0) + 1
        return node(i, x, y, 'm', col=col, st=FLAV[col][(cnt[col] * 3 + len(i)) % 8], v=1)

    for s in sites:
        sid, x0, y0, col = s['id'], s['x'], s['y'], s['col']
        ports = []
        if s['kind'] == 's':
            hub = minor(f'{sid}h', x0, y0, col)
            rot = R.random() * 72
            for k in range(5):
                a = math.radians(rot + k * 72)
                sp = minor(f'{sid}s{k}', x0 + STAR * math.cos(a), y0 + STAR * math.sin(a), col)
                edge(hub, sp)
                ports.append([sp, math.degrees(a) % 360, 0])
        else:
            rr = s['r']
            ring = []
            for k in range(6):
                a = math.radians(270 + k * 60)
                rid = minor(f'{sid}r{k}', x0 + rr * math.cos(a), y0 + rr * math.sin(a), col)
                ring.append(rid)
                ports.append([rid, (270 + k * 60) % 360, 0])
            for k in range(6):
                edge(ring[k], ring[(k + 1) % 6], 'ring')
            if s['kind'] == 'h':
                node('H', x0, y0, 'h', col='all')
                for k in range(6):
                    edge('H', ring[k], 'root')
            else:
                if s['kind'] == 'c':
                    sk, nm = CSK[(col, s['tier'])]
                    node(sid, x0, y0, 'c', col=col, sk=sk, nm=nm, tier=s['tier'], lv=C_LV[s['tier']], need=C_NEED[s['tier']], knot=ring)
                elif s['kind'] == 'b':
                    node(sid, x0, y0, 'b', col=col, txt=BRANCH[s['key']], knot=ring)
                else:
                    j = len([1 for t in sites if t['kind'] == 'n' and t['id'] < sid])
                    st = MAIN[col] if j % 2 == 0 else SIDE[col][(j // 2) % 4]
                    node(sid, x0, y0, 'n', col=col, st=st, v=3, knot=ring)
                for k in range(6):
                    edge(sid, ring[k], 'spoke')
        s['ports'] = ports

    # ---- joins between clusters: relative neighbourhood graph (planar mesh with loops, like ROM's web — the way
    #      along it grows with the distance on the map, so depth on the map = depth in nodes)
    D = lambda a, b: math.hypot(a['x'] - b['x'], a['y'] - b['y'])
    chosen, tree = [], set()
    n_s = len(sites)
    for i in range(n_s):
        for j in range(i + 1, n_s):
            a, b = sites[i], sites[j]
            if (a['kind'] == 'c' and b['kind'] == 'c') or {a['kind'], b['kind']} == {'h', 'c'}:
                continue
            dij = D(a, b)
            if dij - a['r'] - b['r'] > MAXL:
                continue
            if any(max(D(a, c), D(b, c)) < dij for k, c in enumerate(sites) if k not in (i, j)):
                continue
            chosen.append((i, j))
    # C knots: at most 3 ways in (the shortest)
    for i, s0 in enumerate(sites):
        if s0['kind'] != 'c':
            continue
        mine = sorted([e for e in chosen if i in e], key=lambda e: D(sites[e[0]], sites[e[1]]))
        for e in mine[3:]:
            chosen.remove(e)
    # still one piece? (dropping C–C / heart–C joins can split it) — add the shortest missing joins
    par = list(range(n_s))

    def find(x):
        while par[x] != x:
            par[x] = par[par[x]]
            x = par[x]
        return x
    for i, j in chosen:
        par[find(i)] = find(j)
    extra = sorted(((D(sites[i], sites[j]), i, j) for i in range(n_s) for j in range(i + 1, n_s)
                    if not (sites[i]['kind'] == 'c' and sites[j]['kind'] == 'c') and {sites[i]['kind'], sites[j]['kind']} != {'h', 'c'}))
    for d, i, j in extra:
        if find(i) != find(j):
            par[find(i)] = find(j)
            chosen.append((i, j))

    def port(s, ang):
        best = min(s['ports'], key=lambda p: (p[2] > (0 if s['kind'] == 's' else 1), abs((p[1] - ang + 180) % 360 - 180)))
        best[2] += 1
        return best[0]

    for ci, (i, j) in enumerate(chosen):
        a, b = sites[i], sites[j]
        ang = math.degrees(math.atan2(b['y'] - a['y'], b['x'] - a['x'])) % 360
        p, q = port(a, ang), port(b, (ang + 180) % 360)
        px, py, qx, qy = N[p]['x'], N[p]['y'], N[q]['x'], N[q]['y']
        d = math.hypot(qx - px, qy - py)
        n = max(0, round(d / 64) - 1)
        off = (R.random() - .5) * .28 * d
        mx, my = (px + qx) / 2 - (qy - py) / (d or 1) * off, (py + qy) / 2 + (qx - px) / (d or 1) * off
        prev = p
        for k in range(n):
            t = (k + 1) / (n + 1)
            x = (1 - t) ** 2 * px + 2 * (1 - t) * t * mx + t * t * qx
            y = (1 - t) ** 2 * py + 2 * (1 - t) * t * my + t * t * qy
            cid = minor(f'L{ci}_{k}', x, y, a['col'] if t < .5 else b['col'])
            edge(prev, cid, ci=(i, j))
            prev = cid
        edge(prev, q, ci=(i, j))

    # prices + level gates
    for n in N.values():
        if n['k'] == 'h':
            n['cost'] = {}
            continue
        key = ('c', n['tier']) if n['k'] == 'c' else (('n' if n['k'] in ('n', 'b') else 'm'), n['band'])
        n['cost'] = dict(COST[key])
        n.setdefault('lv', BAND_LV[n['band']])
    return N, E, EC, tree


def build(seed=SEED):
    N, E, EC, tree = build_once(seed)
    return N, E


def adj_map(N, E):
    """Who opens whom. Spokes are one-way: a lit ring node opens its knot's centre, a lit centre opens nothing
    (so the centres are side picks and the way on always goes round the small nodes)."""
    A = {i: set() for i in N}
    for a, b, t in E:
        if t == 'spoke':
            A[b].add(a)
            continue
        A[a].add(b)
        A[b].add(a)
    return A


def add_cost(tot, c, mul=1):
    for k, v in c.items():
        tot[k] = tot.get(k, 0) + v * mul


def path_to(N, A, lit, goal_ids):
    """Cheapest (rune points) chain of unlit nodes from the lit set to any goal (never through a knot centre)."""
    dist, prev, pq = {}, {}, []
    for i in lit:
        dist[i] = 0
        heapq.heappush(pq, (0, i))
    while pq:
        d, i = heapq.heappop(pq)
        if d > dist.get(i, 1e9):
            continue
        if i in goal_ids and i not in lit:
            out = []
            while i not in lit:
                out.append(i)
                i = prev[i]
            return out[::-1]
        if 'knot' in N[i] and i not in lit:
            continue
        for j in A[i]:
            if N[j]['k'] == 'h' or ('knot' in N[j] and j not in goal_ids):
                continue
            nd = d + N[j]['cost'].get('pt', 1)
            if nd < dist.get(j, 1e9):
                dist[j] = nd
                prev[j] = i
                heapq.heappush(pq, (nd, j))
    return None


def plan_c(N, A, lit, cid):
    """Nodes to light (in order) to get C node cid: path to its knot, 3 ring nodes, the total count, then the C."""
    n = N[cid]
    order = []
    ring = n['knot']
    if not any(j in lit for j in ring):
        order += path_to(N, A, lit, set(ring))
    opened = lambda j: any((k in lit or k in order) and 'knot' not in N[k] for k in A[j])
    while sum(1 for j in ring if j in lit or j in order) < 3:
        order.append([j for j in ring if j not in lit and j not in order and opened(j)][0])
    while len(lit) - 1 + len(order) < n['need']:
        cand = [j for j in N if j not in lit and j not in order and N[j]['k'] == 'm' and opened(j)]
        cand.sort(key=lambda j: (N[j]['band'], math.hypot(N[j]['x'] - N[cid]['x'], N[j]['y'] - N[cid]['y'])))
        order.append(cand[0])
    order.append(cid)
    return order


def hours(goods, lvd, bag=None):
    """Farming hours for a bag of goods at design level lvd (KPH 700, rates as tools/longterm_sim.py)."""
    KPH = 700
    need = dict(goods)
    core = need.pop('core', 0)
    for k, v in CORE_CRAFT.items():
        need[k] = need.get(k, 0) + v * core
    if bag:
        for k, v in bag.items():
            need[k] = max(0, need.get(k, 0) - v)
    rate = dict(sap=.25, ma=.20, mb=.05, medal=.004, z=10 + 3 * lvd)
    return max((need.get(k, 0) / (r * KPH) for k, r in rate.items()), default=0), need


def sim():
    N, E = build()
    A = adj_map(N, E)
    kinds = {}
    for n in N.values():
        kinds[n['k']] = kinds.get(n['k'], 0) + 1
    tot = {}
    for n in N.values():
        add_cost(tot, n['cost'])
    print(f"TOTEM ROOTS v3: {len(N) - 1} nodes + heart — small +1 stat {kinds['m']} · notable +3 {kinds['n']} · "
          f"branch bonus {kinds['b']} · C skills {kinds['c']}")
    bands = {}
    for n in N.values():
        if n['k'] == 'm':
            bands[n['band']] = bands.get(n['band'], 0) + 1
    print('  small nodes by band:', ' · '.join(f'band {b} (Lv {BAND_LV[b]}+) {c}' for b, c in sorted(bands.items())))
    print(f"  whole web costs {tot['pt']} rune points · sap {tot['sap']:,} · medals {tot['medal']} · cores {tot['core']} · {tot['z']:,}z")
    print(f"  rune points: 4 a level from Lv 31 → Lv 51 {PTS(51)} · Lv 55 {PTS(55)} · Lv 60 {PTS(60)} → {PTS(60) / tot['pt']:.0%} of the web at Lv 60")
    cs = [i for i in N if N[i]['k'] == 'c']
    dmin = []
    for a in cs:
        best = None
        for b in cs:
            if a == b:
                continue
            p = path_to(N, A, set(N[a]['knot']), set(N[b]['knot']))
            if p and (best is None or len(p) < best[0]):
                best = (len(p), b)
        dmin.append((best[0], a, best[1]))
    dmin.sort()
    print(f"  C knots apart (small nodes between two knots): closest {dmin[0][0]} ({N[dmin[0][1]]['nm']} – {N[dmin[0][2]]['nm']})"
          f" · median {sorted(x[0] for x in dmin)[len(dmin) // 2]}")
    hp = []
    for c in cs:
        p = path_to(N, A, {'H'}, set(N[c]['knot']))
        hp.append((N[c]['tier'], N[c]['col'], len(p)))
    for t in range(1, 5):
        print(f"  heart → C tier {t} knot: " + ' · '.join(f"{col} {n}" for tt, col, n in sorted(hp) if tt == t) + ' small nodes')
    kills = sum(21 + 77 * (L - 1) / 59 for L in range(31, 51))
    bag = dict(sap=.25 * kills, ma=.20 * kills, mb=.05 * kills, medal=.004 * kills, z=kills * (10 + 3 * 70))
    print(f"  levelling Lv 31→51 ≈ {kills:.0f} kills → bag: sap {bag['sap']:.0f} · medals {bag['medal']:.1f}")
    for plan_name, plan in [('root A tiers 1→4', ['CA1', 'CA2', 'CA3', 'CA4']), ('A 1–3 + Basic 1', ['CA1', 'CA2', 'CA3', 'Cbasic1']),
                            ('A 1–2 + B 1–2', ['CA1', 'CA2', 'CB1', 'CB2']),
                            ('5 C: A 1–4 + Basic 1', ['CA1', 'CA2', 'CA3', 'CA4', 'Cbasic1'])]:
        lit = {'H'}
        run = {}
        print('PLAN', plan_name)
        for k, cid in enumerate(plan):
            order = plan_c(N, A, lit, cid)
            g = {}
            for j in order:
                add_cost(g, N[j]['cost'])
            lvd = [88, 88, 96, 98][N[cid]['tier'] - 1]
            h2, _ = hours(g, lvd)
            extra = ''
            if k == 0:
                h1, _ = hours(g, lvd, bag)
                extra = f' (with the levelling bag ~{h1:.0f} h)'
            lit |= set(order)
            add_cost(run, g)
            used = sum(N[j]['cost'].get('pt', 0) for j in lit)
            smalls = sum(1 for j in order if N[j]['k'] == 'm')
            print(f"  + {N[cid]['nm']:17s} (C tier {N[cid]['tier']}): +{len(order):2d} nodes ({smalls} small) · points used {used:3d} · "
                  f"sap {g['sap']:4d} · medals {g.get('medal', 0):2d} · cores {g.get('core', 0)} · {g['z']:,}z → ~{h2:.0f} h{extra}")
        ht, _ = hours(run, 94)
        used = sum(N[j]['cost'].get('pt', 0) for j in lit)
        print(f"  = {len(lit) - 1} nodes · {used} points (Lv 60 has {PTS(60)}) · ~{ht:.0f} h of farming in all")


def mock_state(N, A):
    """Lit nodes of the mockup: a Lv 55 wolf who walked from the heart to Savage Echo's knot (3 of 6 ring nodes lit,
    25 nodes lit in all) but has not lit the C skill yet (goods missing), plus a few nodes toward Endless Chain."""
    lit = {'H'}
    order = plan_c(N, A, lit, 'CA1')
    lit |= set(order[:-1])
    p = path_to(N, A, lit, set(N['Cbasic1']['knot']))
    lit |= set(p[:6])
    return lit


if __name__ == '__main__':
    args = sys.argv[1:] or ['sim']
    if 'sim' in args:
        sim()
    if 'js' in args:
        N, E = build()
        A = adj_map(N, E)
        lit = mock_state(N, A)
        out = os.path.join(os.path.dirname(__file__), '..', 'mock_rune', 'roots_web.js')
        data = dict(N=list(N.values()), E=E, lit=sorted(lit), bandLv=BAND_LV, bands=[b[0] for b in BANDS[:3]], RX=RX, RY=RY,
                    pts=sum(N[j]['cost'].get('pt', 0) for j in lit))
        open(out, 'w', encoding='utf-8').write('window.ROOTS_WEB=' + json.dumps(data, ensure_ascii=False) + ';\n')
        print('wrote', os.path.normpath(out), len(N), 'nodes,', len(lit), 'lit, points used', data['pts'])
