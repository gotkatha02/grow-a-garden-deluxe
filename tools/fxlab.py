"""Skill-effect lab: frame strips with HIT marks and smooth clips, for any hero (2026-11-21, made for the croc v3 effects).
It serves the repo itself on port 8765 when nothing is listening there (or start python3 -m http.server 8765 in the repo first).

  python3 tools/fxlab.py strip <hero> <tag> <key[,key…]> [dist=110] [frames=60] [every=3] [cols=6] [room=one] [skip=0] [w=560] [h=340] [dy=0] [q=]
      one PNG per key: every `every`-th frame (60 fps game time), 'HIT' on frames where the dummy took damage
  python3 tools/fxlab.py clip <hero> <name> <key[,key…]> [dist=110] [gap=0.6] [fps=30] [room=one] [w=640] [h=400] [q=]
      one mp4 with all keys one after another (frames stepped by hand → no stutter)
  python3 tools/fxlab.py hits <hero> <key[,key…]> [dist=110] [secs=3]
      prints the game time of every hit after the cast (to compare old / new effects: the numbers must not change)

  key 'basic' = one normal attack on the dummy. q= extra query string (e.g. q=vfx3=0 for the old look).
  Output: /home/claude/work/fx/<hero>_<tag>_<key>.png  /  /home/claude/work/fx/<hero>_<name>.mp4

How it works: requestAnimationFrame is stubbed before the game starts; once the test room is up the harness hands the
game one frame of 1/60 s at a time, so every frame of an effect can be photographed (a pending real frame is waited for
first, so the game never sees a negative dt)."""
import asyncio, sys, os, time, json, subprocess, shutil, socket, threading, functools, http.server
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

OUT = '/home/claude/work/fx'
STUB = r"""(()=>{const q=[];let manual=false,T=0;const raf0=window.requestAnimationFrame.bind(window);
window.requestAnimationFrame=function(cb){if(manual){q.push(cb);return q.length;}return raf0(t=>{if(!manual){T=t;cb(t);}else q.push(cb);});};
window.__fx={go(){manual=true;},ready(){return q.length>0;},step(ms){T+=ms;const c=q.splice(0);for(const f of c)f(T);},get T(){return T;}};})();"""

def opts(argv):
    o = {}
    for a in argv:
        if '=' in a:
            k, v = a.split('=', 1); o[k] = v
    return o

async def boot(p, hero, room='one', q='', vw=1000, vh=600):
    b = await p.chromium.launch(args=['--disable-gpu-vsync'])
    pg = await b.new_page(viewport={'width': vw, 'height': vh})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    await pg.add_init_script(STUB)
    url = 'http://localhost:8765/index.html?char=%s&map=vikF2&testroom=1&nosw=1&cb=%d%s' % (hero, time.time(), ('&' + q) if q else '')
    await pg.goto(url)
    for _ in range(160):   # the start dialog can reload the page once (test-mode button): wait until a page stays up
        await pg.wait_for_timeout(500)
        try:
            ok = await pg.evaluate("()=>typeof player!=='undefined'&&typeof enemies!=='undefined'&&enemies.some(e=>e._dummy)&&!!document.getElementById('trbar')")
            if not ok: continue
            await pg.evaluate("()=>{window.__fxmark=1;}")
            await pg.wait_for_timeout(2500)   # pictures
            if await pg.evaluate("()=>!!window.__fxmark"): break
        except Exception:
            continue
    if room != 'one':
        await pg.evaluate("(m)=>{const b=document.querySelector('[data-tr=\"'+m+'\"]');if(b)b.click();}", room)
        await pg.wait_for_timeout(400)
    await pg.add_style_tag(content='#trbar{display:none!important}')
    await pg.evaluate("()=>window.__fx.go()")
    for _ in range(40):
        if await pg.evaluate("()=>window.__fx.ready()"): break
        await pg.wait_for_timeout(50)
    await pg.evaluate("""()=>{if(!window.__hw){window.__hw=1;window.__HITS=[];const h0=hurt;hurt=function(e,m,o){const d=h0.apply(this,arguments);if(d>0&&!(o&&o.dot))window.__HITS.push(+gameTime.toFixed(4));return d;};}
      for(let i=0;i<30;i++)window.__fx.step(1000/60);}""")
    return b, pg, errs

PLACE = """([dist,dy])=>{try{if(player.action)endAction();}catch(x){}player.action=null;player.pending=null;player.attackTarget=null;player.queue=null;player.combo=null;
  for(const c in player.cd)player.cd[c]=0;player.mp=player.maxMp;player.hp=player.maxHp;
  for(const d of enemies)if(d._dummy){if(d._ox==null){d._ox=d.hx;d._oy=d.hy;}d.x=d.hx=d._ox;d.y=d.hy=d._oy;d.vx=d.vy=0;d.crAB=0;d.offB=0;d.offImm=0;if(d.st)for(const k in d.st)d.st[k]=0;d.crGrab=false;}try{if(window.CR&&CR.grab)CR.grab=null;if(window.CRX)CRX.fz=0;}catch(x){}
  const e=enemies.filter(e=>!e.dead&&e._dummy).sort((a,b)=>Math.abs(a.y-player.y)-Math.abs(b.y-player.y))[0];
  player.x=e.x-dist;player.y=e.y+dy;faceTo(Math.atan2(e.y-player.y,e.x-player.x));player.z=0;cam.x=player.x+dist*.4;cam.y=player.y;mouse.wx=e.x;mouse.wy=e.y;
  for(let i=0;i<20;i++)window.__fx.step(1000/60);cam.x=player.x+dist*.4;cam.y=player.y;window.__fx.step(1000/60);return [e.x,e.y];}"""
CAST = """(k)=>{const e=enemies.filter(e=>!e.dead&&e._dummy).sort((a,b)=>Math.abs(a.y-player.y)-Math.abs(b.y-player.y))[0];window.__HITS.length=0;window.__T0=gameTime;
  window.__NOAUTO=k!=='basics';if(k==='basic'||k==='basics'){command({kind:'attack',e});return k;}
  if(k.startsWith('then:')){const kk=k.slice(5);useSkill(kk);return 'then';}
  useSkill(k);if(typeof targeting!=='undefined'&&targeting){targeting=null;castSkill(k,{target:e,phi:Math.atan2(e.y-player.y,e.x-player.x),gx:e.x,gy:e.y});return 'aimed';}
  if(!player.action&&!player.casting&&!player.pending)return 'nothing';return 'key';}"""
STEP = """(n)=>{const h0=window.__HITS.length;for(let i=0;i<n;i++){const pv=enemies.filter(d=>d._dummy).map(d=>[d,d.x,d.y]);window.__fx.step(1000/60);if(window.__NOAUTO&&player.action)player.attackTarget=null;
    /* dummies keep what a skill did to them (knock-back, grab, drag) but never walk on their own */
    for(const [d,px,py] of pv){const mv=Math.hypot(d.x-px,d.y-py);if(d.crGrab||Math.hypot(d.vx||0,d.vy||0)>5||mv>6){d.hx=d.x;d.hy=d.y;}else{d.x=d.hx;d.y=d.hy;}}}
  const sx=(x,y,z)=>{const q=P(x,y,z||0);return [q[0]*Z+ox,q[1]*Z+oy];};return {t:+(gameTime-window.__T0).toFixed(3),hit:window.__HITS.length>h0,p:sx(player.x,player.y,0)};}"""

def label(im, txt, hit):
    d = ImageDraw.Draw(im)
    try:
        f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
    except Exception:
        f = ImageFont.load_default()
    d.rectangle([0, 0, 92, 20], fill=(0, 0, 0))
    d.text((4, 2), txt, fill=(255, 255, 255), font=f)
    if hit:
        d.rectangle([im.width - 46, 0, im.width, 20], fill=(220, 30, 30))
        d.text((im.width - 42, 2), 'HIT', fill=(255, 255, 255), font=f)
        d.rectangle([0, 0, im.width - 1, im.height - 1], outline=(255, 40, 40), width=3)

async def strip(hero, tag, keys, o):
    dist = float(o.get('dist', 110)); frames = int(o.get('frames', 60)); every = int(o.get('every', 3)); cols = int(o.get('cols', 6))
    W = int(o.get('w', 560)); H = int(o.get('h', 340)); skip = int(o.get('skip', 0)); dy = float(o.get('dy', 0)); sc = float(o.get('scale', 1))
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b, pg, errs = await boot(p, hero, o.get('room', 'one'), o.get('q', ''))
        for k in keys:
            if not k.startswith('then:'): await pg.evaluate(PLACE, [dist, dy])
            how = await pg.evaluate(CAST, k)
            cells = []; hitacc = False; tlast = 0
            for f in range(frames + skip):
                r = await pg.evaluate(STEP, 1)
                hitacc = hitacc or r['hit']
                if f < skip or (f - skip) % every: continue
                cx = r['p'][0] + dist * .45; cy = r['p'][1] - 50
                clip = {'x': max(0, cx - W / 2), 'y': max(0, cy - H / 2), 'width': W, 'height': H}
                png = await pg.screenshot(clip=clip)
                from io import BytesIO
                im = Image.open(BytesIO(png)).convert('RGB')
                if sc != 1: im = im.resize((int(W * sc), int(H * sc)), Image.LANCZOS)
                label(im, '%.2fs' % r['t'], hitacc); hitacc = False
                cells.append(im)
            hits = await pg.evaluate("()=>window.__HITS.map(t=>+(t-window.__T0).toFixed(3))")
            rows = (len(cells) + cols - 1) // cols
            cw, ch = cells[0].size
            sheet = Image.new('RGB', (cols * cw, rows * ch), (20, 20, 20))
            for i, c in enumerate(cells): sheet.paste(c, ((i % cols) * cw, (i // cols) * ch))
            fn = '%s/%s_%s_%s.png' % (OUT, hero, tag, k.replace(':', '_'))
            sheet.save(fn)
            print(k, how, 'hits', hits[:16], '->', fn)
        print('errors', errs[:5])
        await b.close()

async def clip(hero, name, keys, o):
    dist = float(o.get('dist', 110)); gap = float(o.get('gap', .6)); fps = int(o.get('fps', 30)); W = int(o.get('w', 640)); H = int(o.get('h', 400)); dy = float(o.get('dy', 0))
    tmp = '/tmp/fxclip_%d' % os.getpid(); shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp); os.makedirs(OUT, exist_ok=True)
    per = max(1, round(60 / fps)); n = 0
    async with async_playwright() as p:
        b, pg, errs = await boot(p, hero, o.get('room', 'one'), o.get('q', ''))
        for k in keys:
            kk, _, secs = k.partition('@'); secs = float(secs) if secs else 1.6
            if not kk.startswith('then:'): await pg.evaluate(PLACE, [dist, dy])
            await pg.evaluate(CAST, kk)
            for f in range(int((secs + gap) * 60 / per)):
                r = await pg.evaluate(STEP, per)
                cx = r['p'][0] + dist * .45; cy = r['p'][1] - 50
                await pg.screenshot(path='%s/%05d.png' % (tmp, n), clip={'x': max(0, cx - W / 2), 'y': max(0, cy - H / 2), 'width': W, 'height': H}); n += 1
        await b.close()
    fn = '%s/%s_%s.mp4' % (OUT, hero, name)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', tmp + '/%05d.png', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', fn], check=True)
    shutil.rmtree(tmp, ignore_errors=True)
    print('->', fn, n, 'frames', 'errors', errs[:5])

async def hits(hero, keys, o):
    dist = float(o.get('dist', 110)); secs = float(o.get('secs', 3)); dy = float(o.get('dy', 0))
    async with async_playwright() as p:
        b, pg, errs = await boot(p, hero, o.get('room', 'one'), o.get('q', ''))
        res = {}
        for k in keys:
            if not k.startswith('then:'): await pg.evaluate(PLACE, [dist, dy])
            how = await pg.evaluate(CAST, k)
            await pg.evaluate(STEP, int(secs * 60))
            res[k] = [how] + await pg.evaluate("()=>window.__HITS.map(t=>+(t-window.__T0).toFixed(3))")
        print(json.dumps(res))
        print('errors', errs[:5])
        await b.close()

def serve_if_needed(port=8765):
    """if nothing answers on the port, serve the repo from this process for as long as the command runs"""
    try:
        socket.create_connection(('localhost', port), timeout=.5).close(); return None
    except OSError:
        pass
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    srv = http.server.ThreadingHTTPServer(('localhost', port), functools.partial(Q, directory=root))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv

if __name__ == '__main__':
    serve_if_needed()
    a = sys.argv[1:]
    mode, hero = a[0], a[1]
    if mode == 'strip': asyncio.run(strip(hero, a[2], a[3].split(','), opts(a[4:])))
    elif mode == 'clip': asyncio.run(clip(hero, a[2], a[3].split(','), opts(a[4:])))
    elif mode == 'hits': asyncio.run(hits(hero, a[2].split(','), opts(a[3:])))
