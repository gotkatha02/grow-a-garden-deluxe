#!/usr/bin/env python3
"""Contact sheet of FXLIB sprites (the kit's own + a hero's art file), each in a few palettes.

  python3 tools/fxlib/artsheet.py OUT.png [art=anubis_art.js] [names=anFlail,anAnkh,…|all] [pals=gold,duat] [scale=2] [rings=sun,duat,seal,ankh,life]  (rings come from HIPART when the hippo art is loaded, else ANUART, else HYART)
"""
import sys, os, base64, time, socket, subprocess
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
kv = dict(a.split('=', 1) for a in sys.argv[2:])
out = sys.argv[1]
JS = r"""
([names,pals,scale,rings,extraPal,CW,CH])=>{const F=window.FXLIB,k=F.k;Object.assign(F.PAL,extraPal);
 const all=Object.keys(k.sprites),L=names==='all'?all:names.split(',').filter(n=>k.sprites[n]);
 const cellW=CW,cellH=CH,cols=Math.max(1,Math.min(8,L.length)),rows=Math.ceil(L.length/cols)*pals.length,rh=rings.length?250:0;
 const c=document.createElement('canvas');c.width=Math.max(cellW*cols,rings.length*250*pals.length);c.height=rows*cellH+rh+4;const g=c.getContext('2d');
 for(let y=0;y<c.height;y+=20)for(let x=0;x<c.width;x+=20){g.fillStyle=((x+y)/20)%2?'#6f9a52':'#5f8a46';g.fillRect(x,y,20,20);}
 g.font='11px monospace';g.textBaseline='top';
 pals.forEach((pl,pi)=>L.forEach((n,i)=>{const d=k.sprites[n],x=(i%cols)*cellW,y=(Math.floor(i/cols)*pals.length+pi)*cellH;const vn=d.n||1;
   for(let v=0;v<Math.min(vn,5);v++){const im=k.spr(n,pl,v),s=Math.min(scale,(cellW-10)/d.w/(Math.min(vn,5)),(cellH-22)/d.h),w=d.w*s,h=d.h*s;g.drawImage(im,x+5+v*(w+4),y+18+(cellH-22-h)/2,w,h);}
   g.fillStyle='#fff';g.fillText(n+' '+pl,x+3,y+3);}));
 rings.forEach((r,i)=>pals.forEach((pl,pi)=>{const im=(window.HIPART&&HIPART.ring(r,pl))||(window.ANUART&&ANUART.ring(r,pl))||(window.HYART&&HYART.ring(r,pl,3));if(!im)return;const x=(i*pals.length+pi)*250,y=rows*cellH;g.save();g.translate(x+125,y+125);g.scale(1,.62);g.drawImage(im,-120,-120,240,240);g.restore();g.fillStyle='#fff';g.fillText(r+' '+pl,x+4,y+4);}));
 return c.toDataURL('image/png');}
"""
def serve():
    s = socket.socket()
    try: s.connect(('127.0.0.1', 8765)); s.close(); return None
    except OSError:
        p = subprocess.Popen([sys.executable, '-m', 'http.server', '8765'], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(.8); return p
srv = serve()
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('http://localhost:8765/tools/fxlib/blank.html')
        for f in ['fxlib.js'] + [x for x in kv.get('art', '').split(',') if x]:
            pg.add_script_tag(url='http://localhost:8765/%s?t=%d' % (f, time.time()))
        extra = {'sand': ['#3a2a14', '#a8874a', '#e8d3a0', '#fff6dc', '#ffffff'], 'duat': ['#120824', '#4a22a0', '#8f5cf0', '#d2bcff', '#f8f2ff'], 'sun': ['#3a1004', '#d8480c', '#ff9a2a', '#ffd98a', '#fff8e0'], 'linen': ['#3a3020', '#b8a682', '#f4ead2', '#fffaf0', '#ffffff'], 'life': ['#06301c', '#1f9a5a', '#8aff6a', '#e0ffc8', '#ffffff']}
        url = pg.evaluate(JS, [kv.get('names', 'all'), kv.get('pals', 'gold').split(','), float(kv.get('scale', 2)), [r for r in kv.get('rings', '').split(',') if r], extra, int(kv.get('cw', 150)), int(kv.get('ch', 150))])
        open(out, 'wb').write(base64.b64decode(url.split(',', 1)[1])); print(out)
        for e in errs: print('ERR', e[:300])
        b.close()
finally:
    if srv: srv.terminate()
