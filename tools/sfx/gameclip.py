"""The wolf in the test room with the code-made sounds laid on the real hit frames.
python3 gameclip.py -> out/sfx_wolf_ingame.mp4
Frames come from tools/fxlab.py's harness (game stepped 1/60 s at a time); every frame remembers whether the dummy
took a hit in it, and the sounds are placed on those frames afterwards."""
import asyncio, os, sys, io, subprocess, shutil, wave
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import fxlab
from playwright.async_api import async_playwright
import synth as S

OUT = os.path.join(os.environ.get('SFXOUT', '/home/claude/work/sfx'), 'out')
FPS = 30; PER = 2; W, H = 720, 450; DIST = 120
FB = '/usr/share/fonts/opentype/tlwg/Loma-Bold.otf'
# key@seconds, Thai label, extra sound on the first hit
PLAN = [('basics@2.6', 'ตีธรรมดา', None, .45), ('bloodCleave@1.3', 'Blood Cleave', None, .45), ('frostFang@.62', 'Frost Fang', 'ice', 0),
        ('then:frostFang@1.3', 'Frost Fang + Ice Break (คอมโบ)', 'ice', .45), ('thunderFang@1.7', 'Thunder Fang', 'zap', .45)]


async def record(tmp):
    marks = []; n = 0
    font = ImageFont.truetype(FB, 26)
    async with async_playwright() as p:
        b, pg, errs = await fxlab.boot(p, 'wolf', 'one', '', 1600, 1000)
        for key, label, extra, GAP in PLAN:
            kk, _, secs = key.partition('@'); secs = float(secs)
            if not kk.startswith('then:'): await pg.evaluate(fxlab.PLACE, [DIST, 0])
            how = await pg.evaluate(fxlab.CAST, kk)
            seg = {'key': kk, 'label': label, 'extra': extra, 'f0': n, 'hits': [], 'how': how}
            for f in range(int((secs + GAP) * FPS)):
                r = await pg.evaluate(fxlab.STEP, PER)
                if r['hit']: seg['hits'].append(n)
                cx = r['p'][0] + DIST * .45; cy = r['p'][1] - 60
                png = await pg.screenshot(clip={'x': max(0, cx - W / 2), 'y': max(0, cy - H / 2), 'width': W, 'height': H})
                im = Image.open(io.BytesIO(png)).convert('RGB'); d = ImageDraw.Draw(im)
                d.rounded_rectangle([12, 12, 26 + d.textlength(label, font=font), 52], 10, fill=(20, 16, 30))
                d.text((19, 32), label, font=font, fill=(255, 222, 140), anchor='lm')
                im.save('%s/%05d.png' % (tmp, n)); n += 1
            marks.append(seg); print(kk, how, 'hits at frames', seg['hits'])
        print('errors', errs[:4]); await b.close()
    return marks, n


def mixdown(marks, nframes, path):
    SR = S.SR; L = int(nframes / FPS * SR) + SR
    y = np.zeros((L, 2)); seed = 10
    def put(t, snd, g=1.0):
        s = int(t * SR)
        if s < 0: snd = snd[-s:]; s = 0
        m = min(len(snd), L - s); y[s:s + m] += g * snd[:m]
    for seg in marks:
        hits = seg['hits']
        if not hits: continue
        # melee hits closer than 0.12 s belong to one swing: one whoosh before the first, one hit sound each
        swings = [hits[0]]
        for h in hits[1:]:
            if h - swings[-1] > .12 * FPS * 2: swings.append(h)
        for h in swings:
            seed += 1; w = S.make('whoosh', seed)
            put(h / FPS - .40 * .64 - .025, w, .9)
        last = -99
        for h in hits:
            if h - last < 2: continue
            seed += 1; put(h / FPS, S.make('hit', seed), .95); last = h
        if seg['extra']:   # element sound on every separate strike of the skill
            lastx = -99
            for h in hits:
                if h - lastx < 10: continue
                seed += 1; put(h / FPS + .01, S.make(seg['extra'], seed), .85); lastx = h
    pk = np.abs(y).max()
    y *= .66 / pk   # AAC overshoots sharp transients by ~2.5 dB
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y, -1, 1) * 32767).astype('<i2').tobytes())


def main():
    fxlab.serve_if_needed()
    os.makedirs(OUT, exist_ok=True)
    tmp = '/tmp/sfxclip'; shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    marks, n = asyncio.run(record(tmp))
    wavp = os.path.join(tmp, 'a.wav'); mixdown(marks, n, wavp)
    vid = os.path.join(OUT, 'sfx_wolf_ingame.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', tmp + '/%05d.png', '-i', wavp,
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', vid], check=True)
    print('->', vid, n, 'frames')


if __name__ == '__main__':
    main()
