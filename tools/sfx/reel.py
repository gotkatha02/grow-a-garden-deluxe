"""Demo reel: every sound in turn with a Thai caption + its waveform and a moving playhead (square video for the phone).
python3 reel.py -> out/sfx_reel.mp4 (+ out/sfx_reel.mp3)"""
import numpy as np, subprocess, os
from PIL import Image, ImageDraw, ImageFont
import synth as S

SR = S.SR; FPS = 30; W = H = 720
OUT = os.path.join(os.environ.get('SFXOUT', '/home/claude/work/sfx'), 'out')
FB = '/usr/share/fonts/opentype/tlwg/Loma-Bold.otf'; FR = '/usr/share/fonts/opentype/tlwg/Loma.otf'
PLAN = [  # name, seeds, spacing (s), note
    ('whoosh', (1, 2, 3), .55, 'ทุกครั้งที่ฟัน เสียงต่างกันนิดๆ'),
    ('hit', (1, 2, 3), .5, 'ตุ้บหนัก + กรอบ + ห้องสะท้อนสั้นๆ'),
    ('clang', (1,), 0, 'โลหะชนโลหะ (กันได้ / ตีเกราะ)'),
    ('ice', (1,), 0, 'แตกกรอบ + เกล็ดน้ำแข็งกริ๊งๆ'),
    ('zap', (1,), 0, 'แปลบไฟฟ้า + ฟ้าร้องครืนตาม'),
    ('fire', (1,), 0, 'วูบ + ตูม + ไฟปะทุเปาะแปะ'),
    ('heal', (1,), 0, 'โน้ตไต่ขึ้น + ประกายวิ้งๆ'),
    ('coin', (1, 2, 3), .28, 'เก็บต่อกัน 3 เหรียญ'),
    ('levelup', (1,), 0, 'ระฆังไล่โน้ต + คอร์ดประกาย'),
    ('click', (1, 2, 3), .3, 'เบาๆ สั้นๆ ไม่รบกวน'),
]
GAP = .75


def seg_audio(name, seeds, sp):
    parts = [S.make(name, sd) for sd in seeds]
    n = int(sp * SR * (len(parts) - 1)) + max(len(p) for p in parts)
    y = np.zeros((n, 2))
    for i, p in enumerate(parts):
        s = int(i * sp * SR); y[s:s + len(p)] += p
    return y


def main():
    os.makedirs(OUT, exist_ok=True)
    fb = lambda z: ImageFont.truetype(FB, z); fr = lambda z: ImageFont.truetype(FR, z)
    segs = []; t = .6
    for i, (name, seeds, sp, note) in enumerate(PLAN):
        y = seg_audio(name, seeds, sp); dur = len(y) / SR
        # trim the silent reverb tail for the timeline (the sound keeps ringing into the gap)
        e = np.abs(y).max(1); last = np.nonzero(e > .004)[0][-1] / SR
        segs.append((i, name, y, t, min(dur, last + .05), note)); t += min(dur, last + .05) + GAP
    total = t + .4
    mix = np.zeros((int(total * SR) + SR, 2))
    for i, name, y, t0, d, note in segs:
        s = int(t0 * SR); L = min(len(y), len(mix) - s); mix[s:s + L] += y[:L]
    mix = mix[:int(total * SR)]
    pk = np.abs(mix).max(); print('mix peak %.2f total %.1fs' % (pk, total))
    mix *= .66 / pk   # AAC overshoots sharp transients by ~2.5 dB
    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
    wavp = os.path.join(OUT, 'sfx_reel.wav')
    import wave
    with wave.open(wavp, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wavp, '-c:a', 'libmp3lame', '-b:a', '192k', os.path.join(OUT, 'sfx_reel.mp3')], check=True)

    # one background per segment (caption + waveform), the playhead is drawn per frame
    bgs = []
    def base():
        im = Image.new('RGB', (W, H)); px = np.zeros((H, W, 3), 'uint8')
        g = np.linspace(0, 1, H)[:, None]
        px[..., 0] = (28 + 10 * g).astype('uint8'); px[..., 1] = (22 + 8 * g).astype('uint8'); px[..., 2] = (44 + 18 * g).astype('uint8')
        return Image.fromarray(px)
    WX0, WX1, WY, WH = 60, 660, 470, 150
    for i, name, y, t0, d, note in segs:
        im = base(); dr = ImageDraw.Draw(im)
        dr.text((W / 2, 46), 'เสียงเอฟเฟกต์ที่ทำด้วยโค้ดล้วน', font=fb(30), fill=(255, 214, 120), anchor='mm')
        dr.text((W / 2, 84), 'ไม่ได้อัดเสียง · ไม่ใช่ AI เสียง · ใส่หูฟังจะชัดสุด', font=fr(22), fill=(190, 180, 215), anchor='mm')
        dr.ellipse([W / 2 - 44, 150, W / 2 + 44, 238], fill=(214, 160, 60), outline=(255, 230, 160), width=4)
        dr.text((W / 2, 194), str(i + 1), font=fb(52), fill=(40, 24, 10), anchor='mm')
        th = S.MAKE[name][2]; en = S.MAKE[name][3]
        dr.text((W / 2, 300), th, font=fb(64), fill=(255, 255, 255), anchor='mm')
        dr.text((W / 2, 362), en, font=fr(28), fill=(170, 200, 255), anchor='mm')
        dr.text((W / 2, 410), note, font=fr(26), fill=(210, 210, 225), anchor='mm')
        m = np.abs(y[:int(d * SR)].mean(1)); n = WX1 - WX0; step = max(1, len(m) // n)
        mx = max(1e-6, m.max())
        dr.rounded_rectangle([WX0 - 14, WY - 12, WX1 + 14, WY + WH + 12], 16, fill=(18, 14, 30))
        for k in range(n):
            v = m[k * step:(k + 1) * step].max() / mx if k * step < len(m) else 0
            hh = max(1, v * WH / 2)
            dr.line([(WX0 + k, WY + WH / 2 - hh), (WX0 + k, WY + WH / 2 + hh)], fill=(110, 210, 160))
        # dots = which sound of the list
        for k in range(len(PLAN)):
            cx = W / 2 + (k - (len(PLAN) - 1) / 2) * 34
            dr.ellipse([cx - 8, 672 - 8, cx + 8, 672 + 8], fill=(255, 214, 120) if k == i else (80, 70, 110))
        bgs.append(im)
    first = base(); dr = ImageDraw.Draw(first)
    dr.text((W / 2, 300), 'เสียงเอฟเฟกต์ 10 แบบ', font=fb(60), fill=(255, 255, 255), anchor='mm')
    dr.text((W / 2, 370), 'ทำด้วยโค้ดล้วน (numpy / scipy)', font=fr(30), fill=(190, 180, 215), anchor='mm')

    vid = os.path.join(OUT, 'sfx_reel.mp4')
    p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H), '-r', str(FPS), '-i', '-',
                          '-i', wavp, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', vid], stdin=subprocess.PIPE)
    nf = int(total * FPS)
    for f in range(nf):
        tt = f / FPS
        cur = None
        for s in segs:
            if tt >= s[3] - .25: cur = s
        if cur is None:
            frame = first
        else:
            i, name, y, t0, d, note = cur
            frame = bgs[i].copy(); dr = ImageDraw.Draw(frame)
            u = (tt - t0) / d
            if 0 <= u <= 1:
                x = WX0 + u * (WX1 - WX0)
                dr.line([(x, WY - 6), (x, WY + WH + 6)], fill=(255, 240, 200), width=3)
        p.stdin.write(frame.tobytes())
    p.stdin.close(); p.wait()
    print('->', vid)


if __name__ == '__main__':
    main()
