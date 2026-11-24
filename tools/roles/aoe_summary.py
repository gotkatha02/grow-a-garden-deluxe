"""Summarise OUT/<hero>.json (from aoe_audit.py): shape, reach, hits per target, time span.
OUT=/tmp/roles python3 tools/roles/aoe_summary.py hero [hero…]"""
import json, math, os, sys, statistics as st
HERE=os.environ.get('OUT','/tmp/roles')
def fit(v):
    hit=v['hit']
    if v['type']=='ground': return {'k':'aim','r':v['radius']}
    if not hit: return {'k':'none'}
    if len(hit)<=3: return {'k':'target'}
    far=[(x,y) for x,y in hit if math.hypot(x,y)>30] or hit
    d=[math.hypot(x,y) for x,y in hit]; R=max(d)
    ang=[abs(math.atan2(y,x)) for x,y in far]
    if max(ang)>2.4: return {'k':'self','r':round(R)}
    xs=[x for x,y in hit]; ys=[abs(y) for x,y in hit]
    if min(xs)>-25 and max(ys)<=max(45,.32*max(xs)): return {'k':'line','len':round(max(xs)),'w':round(2*max(ys)+20)}
    return {'k':'cone','r':round(R),'h':round(min(math.pi,max(ang)+.08),2)}
def row(k,v):
    s=fit(v); L=v.get('log') or {}
    n=[len(x) for x in L.values()]; nd=[len([h for h in x if not h[2]]) for x in L.values()]
    ts=[h[0] for x in L.values() for h in x if not h[2]]
    span=(max(ts)-min(ts)) if ts else 0
    shp={'aim':lambda s:f"ground r{s['r']}",'self':lambda s:f"round r{s['r']}",'cone':lambda s:f"cone r{s['r']} {round(math.degrees(s['h'])*2)}°",
         'line':lambda s:f"line {s['len']}x{s['w']}",'target':lambda s:'single','none':lambda s:'-'}[s['k']](s)
    return dict(k=k,name=v.get('name',''),br=v.get('br',''),ult=v.get('ult'),shape=shp,kind=s['k'],tg=len(L),hits=max(nd) if nd else 0,span=round(span,2),r=s.get('r',s.get('len',0)))
if __name__=='__main__':
    for h in sys.argv[1:]:
        d=json.load(open(os.path.join(HERE,h+'.json')))
        print('==',h)
        for k,v in d.items():
            r=row(k,v)
            print(f"{'U' if r['ult'] else ' '} {r['br']:5} {r['name'][:26]:26} {r['shape']:16} targets {r['tg']:3}  hits/target {r['hits']:2}  over {r['span']}s")
