"""Records the game with its real sound timeline (2026-11-25): the game is stepped 1/60 s at a time (fxlab's rAF stub), sfx.js logs
every sound it plays on that clock (?sfxlog=1), then this script mixes the same mp3 files at those times (same gain / pan / pitch /
distance rules as the engine, ambience crossfaded) and muxes them with the frames.

  python3 tools/sfx/demo.py OUT.mp4 [scenes=wolf_field,kitsune,owl,beach] [fps=30] [w=960] [h=600]

Scenes are in SCENES below (hero, map, seconds, setup js, Thai caption). Needs the game served on 8765 (it serves the repo itself
when nothing listens there)."""
import asyncio, os, sys, io, json, time, shutil, subprocess, random, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(REPO, 'tools')); import fxlab
from playwright.async_api import async_playwright

SR = 44100
NEAR = "(()=>{const L=enemies.filter(e=>!e.dead&&!e.boss&&e.vdef).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));const e=L[0];if(e){player.x=e.x-170;player.y=e.y+20;cam.x=player.x;cam.y=player.y;}toggleAuto();})();"
SCENES = {
    'wolf_field': ('wolf', 'vikF2', 12, NEAR, 'หมาป่า · ทุ่งหิมะ (ตีมอนจริงด้วย AUTO)', [(3.5, 'bloodCleave'), (6.5, 'blizzard'), (9.5, 'thunderFang')]),
    'kitsune': ('kitsune', 'jpnF1', 9, NEAR, 'จิ้งจอกเก้าหาง · หุบซากุระ (เวทไฟ)', [(2.5, 'kaOrb'), (5, 'kaPillar'), (7, 'kbBeam')]),
    'owl': ('owl', 'grkF1', 8, NEAR, 'นกฮูก · เนินมะกอก (หน้าไม้)', [(3, 'oaPierce'), (5.5, 'obFlurry')]),
    'anubis': ('anubis', 'egyF1', 8, NEAR, 'อนูบิส · โอเอซิส (ลูกตุ้มโซ่)', [(3, 'aaSweep'), (5.5, 'abHook')]),
    'beach': ('wolf', 'seaF1', 7, "player.moveT={x:player.x+900,y:player.y+150};", 'หาดเปลือกหอยทอง · เดินบนทราย คลื่น นกนางนวล', []),
    'town': ('wolf', 'capT', 7, "player.moveT={x:player.x+700,y:player.y-200};", 'เมืองหลวง · น้ำพุ นก เสียงตีเหล็กไกลๆ', []),
}
VOL = {'fx': 1, 'ui': .75, 'step': .7, 'amb': .5}


def cat(n):
    import re
    if n.startswith('amb_'): return 'amb'
    if n.startswith('step_'): return 'step'
    if re.match(r'^(ui_|levelup|refine_|smith_|gem_|carve|extract|skill_learn|hatch|tame|door|potion|sit)', n): return 'ui'
    return 'fx'


_DEC = {}
def dec(path):
    if path in _DEC: return _DEC[path]
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(out, dtype=np.float32).reshape(-1, 2).astype(float)
    i = 0; m = min(len(a), int(SR * .07))
    while i < m and abs(a[i, 0]) < 2e-4: i += 1
    _DEC[path] = a[i:]; return _DEC[path]


def mixdown(events, t0, dur, L):
    n = int(dur * SR); y = np.zeros((n, 2)); rnd = random.Random(7); ambs = []
    for e in events:
        nm = e['n']
        if nm.startswith('amb:'):
            ambs.append((e['t'] - t0, nm[4:])); continue
        if nm not in L: continue
        k = rnd.randint(1, L[nm][0]); a = dec(os.path.join(REPO, 'assets', 'sfx', '%s_%d.mp3' % (nm, k)))
        rate = (e.get('r') or 1) * (1 + rnd.uniform(-.05, .05))
        if abs(rate - 1) > 1e-3:
            m = int(len(a) / rate); idx = np.arange(m) * rate
            a = np.stack([np.interp(idx, np.arange(len(a)), a[:, 0]), np.interp(idx, np.arange(len(a)), a[:, 1])], 1)
        g = e.get('v', 1) * (1 + rnd.uniform(-.07, .07)) * VOL[cat(nm)]
        pan = 0
        if e.get('x') is not None:
            dx = e['x'] - e.get('px', 0); dy = (e['y'] - e.get('py', 0)) * 1.3; d = np.hypot(dx, dy)
            g *= 1 if d < 380 else max(.1, 1 - (d - 380) / 1000); pan = max(-.75, min(.75, dx / 520))
        gl, gr = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
        s = int((e['t'] - t0 + e.get('at', 0)) * SR)
        if s >= n or s + len(a) < 0: continue
        a0 = max(0, -s); s = max(0, s); L2 = min(len(a) - a0, n - s)
        y[s:s + L2, 0] += a[a0:a0 + L2, 0] * g * gl; y[s:s + L2, 1] += a[a0:a0 + L2, 1] * g * gr
    for i, (ta, nm) in enumerate(ambs):
        te = ambs[i + 1][0] if i + 1 < len(ambs) else dur
        if nm == '-' or nm + '' not in L: continue
        bed = dec(os.path.join(REPO, 'assets', 'sfx', '%s_1.mp3' % nm)); s = int(max(0, ta) * SR); e = int(min(dur, te + 1.5) * SR)
        seg = np.zeros((e - s, 2)); pos = 0; off = int(SR * 2)
        while pos < len(seg):
            take = min(len(bed) - off, len(seg) - pos); seg[pos:pos + take] += bed[off:off + take]; pos += take; off = int(SR * 1)
        fade = np.minimum(1, np.arange(len(seg)) / (SR * 1.5))[:, None]
        y[s:e] += seg * fade * VOL['amb']
    y *= .85
    y = np.tanh(y * 1.2) / 1.2
    pk = np.abs(y).max()
    return y * (.66 / pk) if pk > 0 else y


async def scene(p, key, tmp, fps, W, H, n0):
    hero, mp, secs, js, cap, cues = SCENES[key]; cues = list(cues)
    b = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required', '--disable-gpu-vsync'])
    pg = await b.new_page(viewport={'width': 1280, 'height': 760})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    await pg.add_init_script(fxlab.STUB)
    await pg.goto('http://localhost:8765/index.html?char=%s&map=%s&nosw=1&sfxlog=1&guide=0&cb=%d' % (hero, mp, time.time()))
    for _ in range(200):
        await pg.wait_for_timeout(500)
        try:
            await pg.evaluate("""()=>{const t=document.getElementById('cctest');if(t&&t.offsetParent){t.click();return;}
              const b=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/โหมดทดสอบ/.test(b.textContent));if(b)b.click();}""")
            ok = await pg.evaluate("(m)=>typeof player!=='undefined'&&typeof curMap!=='undefined'&&curMap===m&&!!window.SFX&&typeof mapHost==='function'&&mapHost()&&mapHost().ready", mp)
            if not ok: continue
            await pg.evaluate("()=>{window.__dm=1;}"); await pg.wait_for_timeout(2500)
            if await pg.evaluate("()=>!!window.__dm"): break
        except Exception:
            continue
    await pg.add_style_tag(content='#gdQ,#gdC,#chat,#chatbox{display:none!important}')
    await pg.keyboard.press('Shift')   # audio unlock
    await pg.evaluate("()=>window.__fx.go()")
    for _ in range(40):
        if await pg.evaluate("()=>window.__fx.ready()"): break
        await pg.wait_for_timeout(50)
    await pg.evaluate("()=>{for(let i=0;i<90;i++)window.__fx.step(1000/60);}")
    await pg.evaluate("(js)=>{SFX.log.length=0;try{(0,eval)(js);}catch(e){console.warn(e)}const id=curMap;if(window.SFX){const A=SFX.ambOf(id);SFX.amb.set(A&&A[0],A&&A[1]);}}", js)
    t0 = await pg.evaluate("()=>window.__fx.T/1000")
    font = ImageFont.truetype('/usr/share/fonts/opentype/tlwg/Loma-Bold.otf', 24)
    per = max(1, round(60 / fps)); n = n0
    for f in range(int(secs * fps)):
        if cues and f / fps >= cues[0][0]:
            await pg.evaluate("""(k)=>{if(!SKILLS[k]||!LV[k])return;player.cd[k]=0;player.mp=player.maxMp;const e=(window.TL&&TL.e)||enemies.filter(e=>!e.dead&&e.vdef).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];
              useSkill(k);if(typeof targeting!=='undefined'&&targeting&&e){targeting=null;castSkill(k,{target:e,phi:Math.atan2(e.y-player.y,e.x-player.x),gx:e.x,gy:e.y});}}""", cues.pop(0)[1])
        r = await pg.evaluate("""(n)=>{for(let i=0;i<n;i++)window.__fx.step(1000/60);const q=P(player.x,player.y,0);return [q[0]*Z+ox,q[1]*Z+oy];}""", per)
        cx = min(max(r[0], W / 2), 1280 - W / 2); cy = min(max(r[1] - 40, H / 2), 760 - H / 2)
        png = await pg.screenshot(clip={'x': cx - W / 2, 'y': cy - H / 2, 'width': W, 'height': H})
        im = Image.open(io.BytesIO(png)).convert('RGB'); d = ImageDraw.Draw(im)
        tw = d.textlength(cap, font=font); d.rounded_rectangle([10, 10, 30 + tw, 50], 10, fill=(20, 16, 30)); d.text((20, 30), cap, font=font, fill=(255, 222, 140), anchor='lm')
        im.save('%s/%05d.png' % (tmp, n)); n += 1
    ev = await pg.evaluate("()=>SFX.log.slice()")
    print(key, 'frames', n - n0, 'events', len(ev), 'errors', errs[:3], flush=True)
    await b.close()
    return n, ev, t0, secs


async def run(out, keys, fps, W, H):
    tmp = '/tmp/sfxdemo'; shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    L = json.loads(open(os.path.join(REPO, 'assets', 'sfx', 'list.js')).read().split('=', 1)[1].rstrip(';\n'))
    parts = []; n = 0
    async with async_playwright() as p:
        for k in keys:
            n1, ev, t0, secs = await scene(p, k, tmp, fps, W, H, n)
            parts.append(mixdown(ev, t0, secs, L)); n = n1
            json.dump(ev, open('%s/%s.json' % (tmp, k), 'w'))
    audio = np.concatenate(parts)
    with wave.open(tmp + '/a.wav', 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(audio, -1, 1) * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', tmp + '/%05d.png', '-i', tmp + '/a.wav', '-c:v', 'libx264', '-preset', 'veryfast',
                    '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
    print('->', out)


if __name__ == '__main__':
    fxlab.serve_if_needed()
    a = [x for x in sys.argv[1:] if '=' not in x]; o = dict(x.split('=', 1) for x in sys.argv[1:] if '=' in x)
    keys = o.get('scenes', 'wolf_field,kitsune,owl,beach').split(',')
    asyncio.run(run(a[0], keys, int(o.get('fps', 30)), int(o.get('w', 960)), int(o.get('h', 600))))
