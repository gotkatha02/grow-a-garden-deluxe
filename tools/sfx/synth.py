"""Sound effects made only with code (numpy / scipy), no recordings, no AI audio model (2026-11-25 demo; the game has no sound system yet).
python3 tools/sfx/synth.py      -> $SFXOUT/wav/<name>.wav for every sound + $SFXOUT/spec.png (log-frequency spectrogram + waveform sheet: I cannot listen, so check shapes there)
python3 tools/sfx/reel.py       -> $SFXOUT/out/sfx_reel.mp4 / .mp3 (all sounds in turn, Thai captions, playhead)
python3 tools/sfx/gameclip.py   -> $SFXOUT/out/sfx_wolf_ingame.mp4 (the wolf in the test room, sounds laid on the real hit frames)
SFXOUT defaults to /home/claude/work/sfx. make(name, seed) = the sound at its loudness target (rough K-weighted loudest 200 ms); a new seed = a slightly different copy.
AAC overshoots sharp transients by ~2.5 dB: mixes are scaled to peak .66 before encoding.
Each maker takes a seed so the game can play a slightly different copy every time."""
import numpy as np, scipy.signal as ss, os, sys, wave

SR = 44100
OUT = os.path.join(os.environ.get('SFXOUT', '/home/claude/work/sfx'), 'wav')


def T(d): return np.arange(int(d * SR)) / SR
def R(seed): return np.random.default_rng(seed)
def nz(n, r): return r.standard_normal(n)


def filt(x, kind, f, order=2):
    return ss.sosfilt(ss.butter(order, f, btype=kind, fs=SR, output='sos'), x)


def svf(x, fc, q, mode='bp'):
    """time-varying state-variable filter (TPT form, stable at every cutoff); fc = array per sample"""
    fc = np.broadcast_to(np.clip(fc, 20, SR * .45), x.shape)
    g = np.tan(np.pi * fc / SR); k = 1.0 / q
    a1 = 1 / (1 + g * (g + k)); a2 = g * a1; a3 = g * a2
    y = np.empty_like(x); ic1 = ic2 = 0.0
    for i in range(len(x)):
        v3 = x[i] - ic2
        v1 = a1[i] * ic1 + a2[i] * v3
        v2 = ic2 + a2[i] * ic1 + a3[i] * v3
        ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2
        y[i] = v1 if mode == 'bp' else (v2 if mode == 'lp' else x[i] - k * v1 - v2)
    return y


def sweep(f, t0=0.0):
    """sine with a changing pitch (f = array of Hz)"""
    return np.sin(2 * np.pi * np.cumsum(f) / SR + t0)


def edge(x, a=.001, r=.02):
    """no clicks at the start / end"""
    n = len(x); x = x.copy()
    na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    x[:na] *= np.linspace(0, 1, na); x[-nr:] *= np.linspace(1, 0, nr)
    return x


def norm(x, peak=.89):
    m = np.abs(x).max()
    return x * (peak / m) if m > 0 else x


def fadeout(x, frac=.35):
    """smooth end of a piece that would otherwise stop while it still rings"""
    m = max(1, int(len(x) * frac)); x = x.copy()
    x[-m:] *= .5 + .5 * np.cos(np.linspace(0, np.pi, m))
    return x


def place(n, parts):
    """sum of (start sample, signal) pieces into n samples"""
    y = np.zeros(n)
    for s, p in parts:
        s = int(s)
        if s >= n: continue
        L = min(len(p), n - s); y[s:s + L] += p[:L]
    return y


# ---------- reverb (Schroeder: 4 combs + 2 allpasses, decorrelated L / R) ----------
def _comb(x, ms, g):
    D = int(ms * SR / 1000); a = np.zeros(D + 1); a[0] = 1; a[D] = -g
    return ss.lfilter([1.0], a, x)


def _ap(x, ms, g):
    D = int(ms * SR / 1000); b = np.zeros(D + 1); a = np.zeros(D + 1)
    b[0] = -g; b[D] = 1; a[0] = 1; a[D] = -g
    return ss.lfilter(b, a, x)


def verb(x, wet=.25, size=1.0, damp=5000, tail=1.2):
    """returns stereo (n, 2): dry in the middle + a small room / hall"""
    x = np.concatenate([x, np.zeros(int(tail * SR))])
    out = []
    for side, sh in ((0, 0.0), (1, 2.3)):
        pre = np.concatenate([np.zeros(int(.012 * SR)), x])[:len(x)]
        w = sum(_comb(pre, (d + sh) * size, g) for d, g in ((29.7, .80), (37.1, .79), (41.1, .78), (43.7, .77))) / 4
        w = _ap(_ap(w, 5.0 + sh * .3, .7), 1.7 + sh * .1, .7)
        w = filt(w, 'lowpass', damp, 1)
        out.append(x + wet * w)
    y = np.stack(out, 1)
    return y


def stereo(x): return np.stack([x, x], 1)


def loud_db(y, win=.2):
    m = y.mean(1) if y.ndim == 2 else y
    k = filt(m, 'highpass', 60) ; k = k + .58 * filt(k, 'highpass', 1500)
    w = max(1, int(win * SR)); ms = np.convolve(k * k, np.ones(w) / w, 'same')
    return 10 * np.log10(ms.max() + 1e-12)


def master(y, target):
    """loudest 200 ms at `target` dB (rough K-weighting), peaks soft-limited under 0.95"""
    y = y * 10 ** ((target - loud_db(y)) / 20)
    pk = np.abs(y).max()
    if pk > .9:
        y = np.where(np.abs(y) > .8, np.sign(y) * (.8 + .15 * np.tanh((np.abs(y) - .8) / .15)), y)
    return y


# ---------- the sounds ----------
def whoosh(seed=1, d=.40, f0=260, f1=1500, f2=420, peak=.64):
    """axe / sword swing: noise through a band that sweeps up while it gets louder, then cuts off"""
    r = R(seed); n = int(d * SR); t = np.arange(n) / n
    sc = r.uniform(.9, 1.12)
    fc = np.where(t < peak, f0 * (f1 / f0) ** (t / peak), f1 * (f2 / f1) ** ((t - peak) / (1 - peak))) * sc
    env = np.where(t < peak, (t / peak) ** 2.4, np.exp(-(t - peak) * d / .055))
    body = svf(nz(n, r), fc, 1.5, 'bp')
    air = svf(nz(n, r), fc * 2.7, 2.2, 'bp')
    low = svf(nz(n, r), fc * .45, 1.1, 'bp')
    x = filt((body + .35 * air + .45 * low) * env, 'lowpass', 6000)
    return stereo(edge(norm(x, .62)))


def hit(seed=1, pitch=1.0, heavy=1.0):
    """heavy weapon hit on a body: falling low thump + crunchy mid + click + short room"""
    r = R(seed); d = .42; t = T(d); n = len(t)
    pitch *= r.uniform(.94, 1.06)
    f = (46 + 100 * np.exp(-t / .032)) * pitch
    thump = sweep(f) * np.exp(-t / (.10 * heavy)) * (1 - np.exp(-t / .0015))
    crunch = filt(nz(n, r), 'bandpass', [380 * pitch, 2800 * pitch]) * np.exp(-t / .028)
    thwack = filt(nz(n, r), 'lowpass', 850 * pitch) * np.exp(-t / .055)
    click = filt(nz(n, r), 'highpass', 3200) * np.exp(-t / .0035)
    x = 1.15 * thump + .55 * crunch + .5 * thwack + .32 * click
    x = np.tanh(2.4 * x / np.abs(x).max()) / np.tanh(2.4)
    return verb(edge(norm(x, .9), r=.05), wet=.10, size=.6, tail=.35)


def clang(seed=1):
    """metal on metal (axe on armour / a block): inharmonic struck-plate partials + bright tick"""
    r = R(seed); d = 1.7; t = T(d); n = len(t); f0 = 560 * r.uniform(.96, 1.04)
    parts = ((1, 1, .42), (1.006, .6, .42), (2.32, .55, .30), (4.25, .40, .19), (4.27, .2, .19), (6.63, .25, .12), (9.38, .15, .07), (12.1, .08, .05))
    x = sum(a * np.sin(2 * np.pi * f0 * k * t + r.uniform(0, 6.28)) * np.exp(-t / tau) for k, a, tau in parts)
    x = x * (1 - np.exp(-t / .0008))
    x += .9 * filt(nz(n, r), 'highpass', 2600) * np.exp(-t / .006)
    x += .5 * sweep(60 + 90 * np.exp(-t / .02)) * np.exp(-t / .05)
    return verb(edge(norm(x, .8)), wet=.22, size=.9, tail=.8)


def ice(seed=1):
    """ice shatters: sharp crack + crumble + many glassy tinkles that thin out"""
    r = R(seed); d = 1.15; t = T(d); n = len(t)
    crack = filt(nz(n, r), 'highpass', 1700) * np.exp(-t / .011)
    gate = np.repeat(r.uniform(0, 1, int(d * 400) + 1) ** 3, int(SR / 400) + 1)[:n]
    crumble = filt(nz(n, r), 'bandpass', [1100, 5200]) * gate * np.exp(-t / .09)
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t / .045) * .55
    parts = []
    for k in range(52):
        t0 = min(r.exponential(.15), .9)
        f = np.exp(r.uniform(np.log(2300), np.log(7800)))
        tau = r.uniform(.012, .065); L = int(tau * 7 * SR); g = np.arange(L) / SR
        a = r.uniform(.12, .45) * np.exp(-t0 / .35)
        grain = (np.sin(2 * np.pi * f * g) + .45 * np.sin(2 * np.pi * f * 2.76 * g + 1.3) + .2 * np.sin(2 * np.pi * f * 5.4 * g)) * np.exp(-g / tau)
        parts.append((t0 * SR, a * grain))
    tink = place(n, parts)
    x = 1.0 * crack + .55 * crumble + body + .9 * tink
    snap = np.zeros(n)
    for k in range(6): snap[int(r.uniform(0, .018) * SR)] += r.uniform(.6, 1.0) * r.choice([-1, 1])
    x += filt(snap, 'highpass', 900) * 1.4
    return verb(edge(norm(x, .85)), wet=.28, size=1.1, damp=7000, tail=1.0)


def zap(seed=1):
    """lightning: crack + crackling electric buzz + rolling thunder"""
    r = R(seed); d = 1.9; t = T(d); n = len(t)
    gate = np.zeros(n); tt = 0.0
    while tt < .42:
        on = r.uniform(.004, .03); off = r.uniform(0, .018)
        gate[int(tt * SR):int((tt + on) * SR)] = r.uniform(.35, 1) * np.exp(-tt / .22); tt += on + off
    gate = filt(gate, 'lowpass', 500, 1)
    fr = 95 + 45 * np.tanh(np.cumsum(nz(n, r)) / 900)
    saw = 2 * ((np.cumsum(fr) / SR) % 1) - 1
    buzz = filt(saw + .6 * np.sign(np.sin(2 * np.pi * np.cumsum(fr * 2.01) / SR)), 'highpass', 280) * gate
    hiss = filt(nz(n, r), 'highpass', 3600) * gate
    crack = filt(nz(n, r), 'highpass', 500) * np.exp(-t / .009) * 1.6
    brown = filt(np.cumsum(nz(n, r)), 'highpass', 22)
    brown = filt(brown, 'lowpass', 170, 2); brown /= np.abs(brown).max()
    roll = 1 + .7 * filt(nz(n, r), 'lowpass', 6, 1) * 30
    tc = np.clip(t - .04, 0, None)
    rumble = brown * (1 - np.exp(-tc / .07)) * np.exp(-tc / .55) * np.clip(roll, .2, 2.2)
    boom = sweep(34 + 50 * np.exp(-t / .05)) * (1 - np.exp(-t / .004)) * np.exp(-t / .35)
    x = .55 * buzz + .3 * hiss + .8 * crack + 1.7 * rumble + .8 * boom
    x = np.tanh(1.8 * x / np.abs(x).max()) / np.tanh(1.8)
    return verb(edge(norm(x, .9), r=.15), wet=.2, size=1.3, damp=3500, tail=1.0)


def fire(seed=1):
    """fire burst: whoomph (low-pass sweep) + low boom + crackles in the tail"""
    r = R(seed); d = 1.35; t = T(d); n = len(t)
    fc = 180 + 2700 * np.exp(-((t - .085) / .11) ** 2) + 500 * np.exp(-t / .45)
    env = (1 - np.exp(-t / .022)) * np.exp(-t / .38)
    whoomph = svf(nz(n, r), fc, .9, 'lp') * env
    roar = filt(nz(n, r), 'bandpass', [260, 900]) * np.exp(-t / .5) * (1 + .5 * filt(nz(n, r), 'lowpass', 9, 1) * 25)
    boom = sweep(36 + 42 * np.exp(-t / .07)) * (1 - np.exp(-t / .006)) * np.exp(-t / .24)
    parts = []; tt = .04
    while tt < d - .05:
        tt += r.exponential(1 / (45 * np.exp(-tt / .45) + 6))
        L = int(r.uniform(.0015, .004) * SR)
        parts.append((tt * SR, nz(L, r) * np.hanning(L) * r.uniform(.1, .6) * np.exp(-tt / .5)))
    crack = filt(place(n, parts), 'highpass', 1500)
    x = 1.2 * whoomph + .35 * roar + .9 * boom + .8 * crack
    x = np.tanh(1.6 * x / np.abs(x).max()) / np.tanh(1.6)
    return verb(edge(norm(x, .88)), wet=.18, size=1.0, damp=4500, tail=.8)


def bell(f, d, r, bright=1.0, decay=1.0):
    t = T(d)
    parts = ((1, 1, .9), (2.0, .42 * bright, .55), (3.0, .22 * bright, .35), (4.16, .13 * bright, .22), (5.43, .07 * bright, .14))
    x = sum(a * np.sin(2 * np.pi * f * k * t + r.uniform(0, 6.28)) * np.exp(-t / (tau * decay)) for k, a, tau in parts)
    return fadeout(x * (1 - np.exp(-t / .002)))


def heal(seed=1):
    """healing: soft rising notes + sparkles that climb, in a bright hall"""
    r = R(seed); d = 1.5; n = int(d * SR)
    notes = (783.99, 1046.5, 1318.5, 1567.98)
    parts = []
    for i, f in enumerate(notes):
        tt = T(1.1); vib = 1 + .004 * np.sin(2 * np.pi * 5.5 * tt)
        tone = (sweep(f * vib) + .25 * sweep(2 * f * vib)) * (1 - np.exp(-tt / .035)) * np.exp(-tt / .42)
        parts.append((i * .11 * SR, .55 * fadeout(tone)))
    for k in range(34):
        t0 = r.uniform(.05, .95); f = 2000 * 3.2 ** (t0 / .95) * r.uniform(.9, 1.15)
        L = int(.08 * SR); g = np.arange(L) / SR
        parts.append((t0 * SR, r.uniform(.05, .16) * np.sin(2 * np.pi * f * g) * np.exp(-g / .02)))
    pad = sum(sweep(np.full(n, f * k)) for f in (1046.5, 1318.5) for k in (1, 1.004)) * np.sin(np.pi * np.clip(np.arange(n) / n * 1.2, 0, 1)) ** 2 * .07
    x = place(n, parts) + pad
    return verb(edge(norm(x, .7)), wet=.42, size=1.4, damp=7000, tail=1.3)


def coin(seed=1):
    """coin pickup: two quick bright notes (B5 -> E6) with a metal tick"""
    r = R(seed); d = .55; n = int(d * SR)
    def tone(f, L, tau):
        tt = T(L)
        sq = sum(np.sin(2 * np.pi * f * k * tt) / k for k in (1, 3, 5, 7) if f * k < 9000)
        return (.55 * np.sin(2 * np.pi * f * tt) + .45 * sq) * (1 - np.exp(-tt / .001)) * np.exp(-tt / tau)
    a = tone(987.77, .075, 1.0); a[-int(.004 * SR):] *= np.linspace(1, 0, int(.004 * SR))
    b = tone(1318.51, .48, .13)
    tt = T(.1); tick = np.sin(2 * np.pi * 1318.51 * 2.76 * tt) * np.exp(-tt / .012) * .3
    x = place(n, [(0, a), (.075 * SR, b), (.075 * SR, tick)])
    return verb(edge(norm(x, .55)), wet=.15, size=.7, tail=.4)


def levelup(seed=1):
    """level up: bell arpeggio C5 E5 G5 C6, then a shimmering chord with sparkles"""
    r = R(seed); d = 2.5; n = int(d * SR); parts = []
    for i, f in enumerate((523.25, 659.25, 783.99, 1046.5)):
        parts.append((i * .085 * SR, .5 * bell(f, 1.5, r)))
    t0 = .34
    for f in (1046.5, 1318.51, 1567.98, 2093.0):
        tt = T(2.1); trem = 1 + .12 * np.sin(2 * np.pi * 6.5 * tt)
        parts.append((t0 * SR, .3 * bell(f, 2.1, r, .7, 1.8) * trem))
    for k in range(40):
        ts = t0 + r.exponential(.3)
        if ts > 1.8: continue
        f = np.exp(r.uniform(np.log(3000), np.log(8500))); L = int(.07 * SR); g = np.arange(L) / SR
        parts.append((ts * SR, r.uniform(.04, .14) * np.sin(2 * np.pi * f * g) * np.exp(-g / .018)))
    m = int(.36 * SR); g = np.arange(m) / m
    rise = svf(R(seed + 9).standard_normal(m), 1800 * 4.5 ** g, 3.0, 'bp') * g ** 2 * .35
    parts.append((0, rise))
    x = place(n, parts)
    return verb(edge(norm(x, .75)), wet=.38, size=1.3, damp=8000, tail=1.2)


def click(seed=1):
    """UI button: short wooden tick"""
    r = R(seed); d = .09; t = T(d); n = len(t)
    f = 1350 * r.uniform(.97, 1.03)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / .009) + .5 * np.sin(2 * np.pi * 390 * t) * np.exp(-t / .016)
    x += .45 * filt(nz(n, r), 'highpass', 2500) * np.exp(-t / .0013)
    return verb(edge(norm(x, .45), r=.01), wet=.06, size=.4, tail=.12)


SOUNDS = [  # name, maker, thai, english, loudness target dB
    ('whoosh', whoosh, 'ฟันขวาน (วืด)', 'Axe swing', -17),
    ('hit', hit, 'ฟันโดนตัว', 'Heavy hit', -11),
    ('clang', clang, 'ขวานกระทบเกราะ', 'Metal clang', -14),
    ('ice', ice, 'น้ำแข็งแตก', 'Ice shatter', -13),
    ('zap', zap, 'สายฟ้าฟาด', 'Lightning', -11),
    ('fire', fire, 'ไฟระเบิด', 'Fire burst', -11),
    ('heal', heal, 'ฮีล / บัฟ', 'Heal', -16),
    ('coin', coin, 'เก็บเหรียญ', 'Coin pickup', -17),
    ('levelup', levelup, 'เลเวลอัพ', 'Level up', -15),
    ('click', click, 'กดปุ่มเมนู', 'UI click', -27),
]
MAKE = {s[0]: s for s in SOUNDS}


def make(name, seed=1):
    _, mk, _, _, tgt = MAKE[name]
    return master(mk(seed), tgt)


def wav(path, y):
    y = np.clip(y, -1, 1)
    if y.ndim == 1: y = stereo(y)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((y * 32767).astype('<i2').tobytes())


def spec_sheet(path, items):
    from PIL import Image, ImageDraw, ImageFont
    f = ImageFont.truetype('/usr/share/fonts/opentype/tlwg/Loma-Bold.otf', 16)
    tiles = []
    for name, y in items:
        m = y.mean(1)
        fr, tt, S = ss.spectrogram(m, SR, nperseg=2048, noverlap=1792)
        S = 10 * np.log10(S + 1e-12); S = np.clip((S - S.max() + 70) / 70, 0, 1)
        ly = np.exp(np.linspace(np.log(40), np.log(16000), 200))
        S = np.stack([np.interp(ly, fr, S[:, j]) for j in range(S.shape[1])], 1)
        im = Image.fromarray((S[::-1] ** 1.2 * 255).astype('uint8')).resize((420, 200))
        im = Image.merge('RGB', (im, im.point(lambda v: int(v * .7)), im.point(lambda v: int(min(255, v * 1.4)))))
        wf = Image.new('RGB', (420, 70), (15, 15, 20)); d = ImageDraw.Draw(wf)
        env = np.abs(m); step = max(1, len(env) // 420)
        for i in range(420):
            v = env[i * step:(i + 1) * step].max() if i * step < len(env) else 0
            d.line([(i, 35 - v * 33), (i, 35 + v * 33)], fill=(120, 220, 160))
        tile = Image.new('RGB', (420, 296), (0, 0, 0)); tile.paste(im, (0, 26)); tile.paste(wf, (0, 226))
        ImageDraw.Draw(tile).text((6, 3), '%s  %.2fs  peak %.2f' % (name, len(m) / SR, np.abs(y).max()), fill=(255, 255, 255), font=f)
        tiles.append(tile)
    cols = 3; rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * 424, rows * 300), (40, 40, 40))
    for i, tl in enumerate(tiles): sheet.paste(tl, ((i % cols) * 424, (i // cols) * 300))
    sheet.save(path)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    items = []
    for name, mk, th, en, tg in SOUNDS:
        y = make(name, 1); wav(os.path.join(OUT, name + '.wav'), y); items.append((name, y))
        print(name, '%.2fs' % (len(y) / SR), 'peak %.2f' % np.abs(y).max(), 'loud %.1f dB' % loud_db(y))
    spec_sheet(os.path.join(os.path.dirname(OUT), 'spec.png'), items)
