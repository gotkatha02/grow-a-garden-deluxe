"""Interim octagonal diamond for C gems (owner 2026-11-21 'make it like a diamond, this one is too round') until his painted
picture arrives (GEM_PAGE_ART_PROMPTS_TH.md 13–14). Draws the crown (frame with an empty octagonal table) in N cut variants and the
table shine, as SVG rendered by Chromium.   python3 tools/gems/oct_interim.py [out_dir/] [variants]
Geometry (512²): outer octagon apothem 232, table apothem 155 (flat top) — totem_gems.js .sgem.cg uses the same numbers."""
import sys,math,random,asyncio
from playwright.async_api import async_playwright
OUT=sys.argv[1] if len(sys.argv)>1 else 'assets/gems/page/';NV=int(sys.argv[2]) if len(sys.argv)>2 else 4
C=256.0;AO,AT=232.0,155.0;K=math.cos(math.radians(22.5))
def P(r,a): return (C+r*math.cos(math.radians(a)),C-r*math.sin(math.radians(a)))
def pts(L): return ' '.join(f'{x:.1f},{y:.1f}' for x,y in L)
def crown(seed):
    R=random.Random(seed);Ro,Rt=AO/K,AT/K
    O=[P(Ro,22.5+45*k) for k in range(8)];T=[P(Rt,22.5+45*k) for k in range(8)]
    M=[P(AO,45+45*k) for k in range(8)]
    S=[P(AT+(AO-AT)*R.uniform(.42,.62),45+45*k+R.uniform(-5,5)) for k in range(8)]
    L=(-.71,-.71)   # light from the upper left (screen coords)
    tones=['#5f8dbf','#86b5dc','#b7ddf5','#e4f6ff','#ffffff']
    def tone(poly,base):
        cx=sum(p[0] for p in poly)/len(poly)-C;cy=sum(p[1] for p in poly)/len(poly)-C;d=math.hypot(cx,cy) or 1
        v=(cx/d)*L[0]+(cy/d)*L[1]        # +1 faces the light
        i=int(round(2+1.6*v+base+R.uniform(-.55,.55)));return tones[max(0,min(4,i))]
    F=[]
    for k in range(8):
        F.append(([T[k],T[(k+1)%8],S[k]],.5))                       # star facet next to the table
        F.append(([T[k],S[k-1],O[k],S[k]],0))                        # kite round the corner
        F.append(([S[k],O[k],M[k]],-.4));F.append(([S[k],M[k],O[(k+1)%8]],-.4))   # girdle facets on the edge
    g=[]
    g.append(f'<polygon points="{pts(O)}" fill="#3a1f14" stroke="#3a1f14" stroke-width="14" stroke-linejoin="round"/>')
    for poly,b in F: g.append(f'<polygon points="{pts(poly)}" fill="{tone(poly,b)}" stroke="#f4fbff" stroke-opacity=".75" stroke-width="1.6" stroke-linejoin="round"/>')
    # rainbow glints on a few facet edges
    for _ in range(4):
        k=R.randrange(8);a,b=(S[k],O[k]) if R.random()<.5 else (T[k],S[k]);col=R.choice(['#ff9ad5','#fff08a','#8ff3ff','#c8a0ff'])
        g.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{col}" stroke-width="3.2" stroke-linecap="round" opacity=".9"/>')
    # gold edges: outer silhouette and round the table hole; dark rim of the hole
    Og=[P((AO-5)/K,22.5+45*k) for k in range(8)];Tg=[P((AT+4)/K,22.5+45*k) for k in range(8)]
    g.append(f'<polygon points="{pts(Og)}" fill="none" stroke="url(#gold)" stroke-width="8" stroke-linejoin="round"/>')
    g.append(f'<polygon points="{pts(Tg)}" fill="none" stroke="url(#gold)" stroke-width="7" stroke-linejoin="round"/>')
    g.append(f'<polygon points="{pts([P(AT/K,22.5+45*k) for k in range(8)])}" fill="#000" stroke="#3a1f14" stroke-width="3.5" stroke-linejoin="round"/>')
    # sparkles on facet corners (upper left mostly)
    for _ in range(3):
        k=R.choice([2,3,3,4,1,5]);x,y=O[k] if R.random()<.5 else S[k];s=R.uniform(10,17)
        g.append(f'<path d="M{x},{y-s} Q{x+s*.16},{y-s*.16} {x+s},{y} Q{x+s*.16},{y+s*.16} {x},{y+s} Q{x-s*.16},{y+s*.16} {x-s},{y} Q{x-s*.16},{y-s*.16} {x},{y-s}Z" fill="#fff" filter="url(#glow)"/>')
    return g
def tshine():
    """light on the flat octagonal table (box = the table: apothem 256 in this 512² picture)"""
    A=256.0;Rt=A/K;T=[P(Rt,22.5+45*k) for k in range(8)];g=[]
    g.append(f'<clipPath id="oc"><polygon points="{pts(T)}"/></clipPath>')
    g.append('<g clip-path="url(#oc)">')
    g.append('<polygon points="0,150 150,0 300,0 0,300" fill="url(#band)"/>')            # broad diagonal band, crisp lower edge
    g.append('<polygon points="0,330 330,0 352,0 0,352" fill="#fff" opacity=".16"/>')      # thin second band
    for k in range(8):
        x,y=T[k];g.append(f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{C+(x-C)*.62:.1f}" y2="{C+(y-C)*.62:.1f}" stroke="#fff" stroke-width="2.4" opacity=".22" stroke-linecap="round"/>')
    g.append('</g>')
    ul=[T[4],T[3],T[2]];lr=[T[0],T[7],T[6]]   # vertices round the upper-left / lower-right edges
    g.append(f'<polyline points="{pts([((T[5][0]+T[4][0])/2,(T[5][1]+T[4][1])/2)]+ul+[((T[2][0]+T[1][0])/2,(T[2][1]+T[1][1])/2)])}" fill="none" stroke="#fff" stroke-width="7" opacity=".85" stroke-linejoin="round" stroke-linecap="round" transform="translate({C} {C}) scale(.985) translate({-C} {-C})"/>')
    g.append(f'<polyline points="{pts([((T[1][0]+T[0][0])/2,(T[1][1]+T[0][1])/2)]+lr+[((T[6][0]+T[5][0])/2,(T[6][1]+T[5][1])/2)])}" fill="none" stroke="#e6f6ff" stroke-width="5" opacity=".45" stroke-linejoin="round" stroke-linecap="round" transform="translate({C} {C}) scale(.985) translate({-C} {-C})"/>')
    x,y,s=150,118,26
    g.append(f'<path d="M{x},{y-s} Q{x+s*.14},{y-s*.14} {x+s},{y} Q{x+s*.14},{y+s*.14} {x},{y+s} Q{x-s*.14},{y+s*.14} {x-s},{y} Q{x-s*.14},{y-s*.14} {x},{y-s}Z" fill="#fff" filter="url(#glow)"/>')
    g.append(f'<circle cx="{x-38}" cy="{y+30}" r="7" fill="#fff" filter="url(#glow)"/>')
    return g
DEFS='''<defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".45" stop-color="#f2c24e"/><stop offset="1" stop-color="#b87a1e"/></linearGradient>
<linearGradient id="band" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".7" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/></linearGradient>
<filter id="glow" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'''
async def main():
    from PIL import Image
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':512,'height':512},device_scale_factor=2)
        jobs=[(f'cgem_oct{i}.webp',crown(11+i*7)) for i in range(NV)]+[('cgem_tshine.webp',tshine())]
        for name,g in jobs:
            svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">{DEFS}{"".join(g)}</svg>'
            await pg.set_content(f'<html><body style="margin:0;background:transparent">{svg}</body></html>')
            await pg.screenshot(path='/tmp/_oct.png',omit_background=True,clip={'x':0,'y':0,'width':512,'height':512})
            im=Image.open('/tmp/_oct.png').convert('RGBA').resize((512,512),Image.LANCZOS)
            if name.startswith('cgem_oct'):   # the table hole is see-through (drawn black only to mark it)
                import numpy as np
                a=np.asarray(im).copy();ys,xs=np.mgrid[0:512,0:512];dx,dy=np.abs(xs-C+.5),np.abs(ys-C+.5)
                inside=(np.maximum(dx,dy)<=AT-1.5)&((dx+dy)<=(AT-1.5)*math.sqrt(2))
                a[...,3]=np.where(inside,0,a[...,3]);im=Image.fromarray(a,'RGBA')
            im.save(OUT+name,quality=92,method=6);print('wrote',OUT+name)
        await b.close()
asyncio.run(main())
