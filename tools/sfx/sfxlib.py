"""Building blocks for the game's sound effects (2026-11-25). Physically modelled where it matters:
modal impacts (struck metal / wood / glass = damped inharmonic partials), Minnaert bubbles (water: a bubble rings at
~3.26 kHz / radius in mm and its pitch rises as it closes), granular textures (ice tinkles, crackles, rain, gravel),
filtered-noise air (whooshes, wind, fire roar) and Karplus-Strong strings (crossbow). Recorded CC0 foley (Kenney packs)
is loaded with load() and layered in build_sfx.py. I cannot listen: every sound is designed from how the real one is made
and checked on the spectrogram sheet build_sfx.py writes."""
import numpy as np, scipy.signal as ss, subprocess, os

SR = 44100


def T(d): return np.arange(max(1, int(d * SR))) / SR
def R(seed): return np.random.default_rng(seed)
def nz(n, r): return r.standard_normal(int(n))


def pink(n, r):
    """1/f noise (Paul Kellet's filter on white noise)"""
    w = r.standard_normal(int(n))
    b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
    a = [1, -2.494956002, 2.017265875, -0.522189400]
    y = ss.lfilter(b, a, w)
    return y / (np.std(y) + 1e-9)


def brown(n, r):
    y = np.cumsum(r.standard_normal(int(n)))
    y = filt(y, 'highpass', 18)
    return y / (np.std(y) + 1e-9)


def filt(x, kind, f, order=2):
    return ss.sosfilt(ss.butter(order, f, btype=kind, fs=SR, output='sos'), x)


def svf(x, fc, q, mode='bp'):
    """time-varying state-variable filter (TPT form); fc / q may be arrays (one value per sample)"""
    fc = np.broadcast_to(np.clip(fc, 20, SR * .45), x.shape).astype(float)
    q = np.broadcast_to(q, x.shape).astype(float)
    g = np.tan(np.pi * fc / SR); k = 1.0 / q
    a1 = 1 / (1 + g * (g + k)); a2 = g * a1; a3 = g * a2
    y = np.empty_like(x); ic1 = ic2 = 0.0
    hp = mode == 'hp'; lp = mode == 'lp'
    for i in range(len(x)):
        v3 = x[i] - ic2
        v1 = a1[i] * ic1 + a2[i] * v3
        v2 = ic2 + a2[i] * ic1 + a3[i] * v3
        ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2
        y[i] = v2 if lp else (x[i] - k[i] * v1 - v2 if hp else v1)
    return y


def sweep(f, ph=0.0):
    return np.sin(2 * np.pi * np.cumsum(f) / SR + ph)


def lin(a, b, n): return np.linspace(a, b, int(n))


def expseg(pts, d):
    """piecewise exponential curve through (time, value) points, length d seconds"""
    t = T(d); xs = [p[0] for p in pts]; ys = np.log([max(1e-6, p[1]) for p in pts])
    return np.exp(np.interp(t, xs, ys))


def linseg(pts, d):
    t = T(d); return np.interp(t, [p[0] for p in pts], [p[1] for p in pts])


def att(t, a):
    return 1 - np.exp(-t / max(1e-5, a))


def edge(x, a=.0008, r=.015):
    x = np.array(x, dtype=float)
    na = max(1, int(a * SR)); nr = max(1, min(len(x) // 2, int(r * SR)))
    x[:na] *= np.linspace(0, 1, na); x[-nr:] *= np.linspace(1, 0, nr) ** 1.5
    return x


def fadeout(x, frac=.35):
    m = max(1, int(len(x) * frac)); x = np.array(x, dtype=float)
    x[-m:] *= .5 + .5 * np.cos(np.linspace(0, np.pi, m))
    return x


def norm(x, peak=.9):
    m = np.abs(x).max(); return x * (peak / m) if m > 0 else x


def place(n, parts):
    y = np.zeros(int(n))
    for s, p in parts:
        s = int(s)
        if s >= len(y) or s < 0: continue
        L = min(len(p), len(y) - s); y[s:s + L] += p[:L]
    return y


def mix(*layers):
    """layers = (gain, signal[, start seconds]) → one signal as long as the longest"""
    n = max(int((l[2] if len(l) > 2 else 0) * SR) + len(l[1]) for l in layers)
    y = np.zeros(n)
    for l in layers:
        g, s = l[0], l[1]; st = int((l[2] if len(l) > 2 else 0) * SR)
        y[st:st + len(s)] += g * s
    return y


def sat(x, k=2.0):
    m = np.abs(x).max() + 1e-9
    return np.tanh(k * x / m) / np.tanh(k) * m


def pitch(x, k):
    """resample: k > 1 = higher and shorter"""
    if abs(k - 1) < 1e-3: return x
    n = int(len(x) / k)
    return np.interp(np.arange(n) * k, np.arange(len(x)), x)


# ---------- physical pieces ----------
def modal(freqs, amps, taus, d, r, att_s=.0006):
    t = T(d); y = np.zeros(len(t))
    for f, a, tau in zip(freqs, amps, taus):
        if f >= SR * .45: continue
        y += a * np.sin(2 * np.pi * f * t + r.uniform(0, 6.283)) * np.exp(-t / tau)
    return y * att(t, att_s)


def bubble(rad_mm, r, amp=1.0, rise=None):
    """Minnaert bubble: f0 ≈ 3260 / radius(mm) Hz, the pitch rises while it rings (van den Doel)"""
    f0 = 3260.0 / rad_mm; tau = .0005 + rad_mm * .0045 * r.uniform(.7, 1.3)
    d = tau * 6; t = T(d)
    xi = rise if rise is not None else r.uniform(.08, .22)
    f = f0 * (1 + xi * t / tau)
    return amp * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / tau) * att(t, .0004)


def bubbles(d, rate, rmin, rmax, r, amp=1.0, decay=None, skew=1.0):
    """random bubble field: rate per second (array or number), radii log-uniform"""
    n = int(d * SR); parts = []; t = 0.0
    while True:
        rr = rate(t) if callable(rate) else rate
        t += r.exponential(1 / max(.5, rr))
        if t >= d: break
        rad = np.exp(r.uniform(np.log(rmin), np.log(rmax))) ** skew
        a = amp * (rad / rmax) ** .6 * r.uniform(.4, 1) * (np.exp(-t / decay) if decay else 1)
        parts.append((t * SR, bubble(rad, r, a)))
    return place(n, parts)


def grains(d, rate, f_lo, f_hi, r, tau=(.004, .02), amp=1.0, decay=None, inharm=(2.76, 5.4)):
    """glassy / metallic tinkle grains (modal, 3 partials)"""
    n = int(d * SR); parts = []; t = 0.0
    while True:
        rr = rate(t) if callable(rate) else rate
        t += r.exponential(1 / max(.5, rr))
        if t >= d: break
        f = np.exp(r.uniform(np.log(f_lo), np.log(f_hi))); ta = r.uniform(*tau)
        L = int(ta * 7 * SR); g = np.arange(L) / SR
        s = (np.sin(2 * np.pi * f * g) + .45 * np.sin(2 * np.pi * f * inharm[0] * g + 1.3) + .2 * np.sin(2 * np.pi * f * inharm[1] * g + .4)) * np.exp(-g / ta)
        parts.append((t * SR, amp * r.uniform(.3, 1) * (np.exp(-t / decay) if decay else 1) * s))
    return place(n, parts)


def crackles(d, rate, r, amp=1.0, hp=1400, decay=None, dur=(.0012, .004)):
    n = int(d * SR); parts = []; t = 0.0
    while True:
        rr = rate(t) if callable(rate) else rate
        t += r.exponential(1 / max(.5, rr))
        if t >= d: break
        L = max(4, int(r.uniform(*dur) * SR))
        parts.append((t * SR, nz(L, r) * np.hanning(L) * r.uniform(.15, 1) * amp * (np.exp(-t / decay) if decay else 1)))
    return filt(place(n, parts), 'highpass', hp)


def pluck(f, d, r, damp=.996, bright=.5):
    """Karplus-Strong string"""
    n = int(d * SR); N = max(2, int(SR / f)); buf = r.uniform(-1, 1, N)
    buf = filt(buf, 'lowpass', 2000 + 8000 * bright, 1) if N > 12 else buf
    y = np.zeros(n); b = list(buf); i = 0
    for k in range(n):
        y[k] = b[i]; j = (i + 1) % N
        b[i] = damp * .5 * (b[i] + b[j]); i = j
    return y


def thump(d, f_hi, f_lo, k, tau, r=None, ph=0.0):
    t = T(d); f = f_lo + (f_hi - f_lo) * np.exp(-t / k)
    return sweep(f, ph) * np.exp(-t / tau) * att(t, .0012)


def whoosh(r, d, f0, f1, f2, peak=.62, q=1.4, low=.45, air=.35, lp=6500, whistle=0.0, wf=(2200, 4600, 3000), shape=2.3):
    """swing of a weapon / body: noise band that sweeps up while it swells, then falls off fast.
    returns (signal, seconds to the loudest moment)"""
    n = int(d * SR); t = np.arange(n) / n
    fc = np.where(t < peak, f0 * (f1 / f0) ** (t / peak), f1 * (f2 / f1) ** ((t - peak) / (1 - peak)))
    env = np.where(t < peak, (t / peak) ** shape, np.exp(-(t - peak) * d / (.05 + .1 * d)))
    x = svf(nz(n, r), fc, q, 'bp') + air * svf(nz(n, r), fc * 2.7, 2.2, 'bp') + low * svf(nz(n, r), fc * .45, 1.0, 'bp')
    if whistle:
        we = np.where(t < peak, wf[0] * (wf[1] / wf[0]) ** (t / peak), wf[1] * (wf[2] / wf[1]) ** ((t - peak) / (1 - peak)))
        x += whistle * 3 * svf(nz(n, r), we, 22, 'bp')
    x = filt(x * env, 'lowpass', lp)
    return x, peak * d


# ---------- space ----------
def _comb(x, ms, g):
    D = max(1, int(ms * SR / 1000)); a = np.zeros(D + 1); a[0] = 1; a[D] = -g
    return ss.lfilter([1.0], a, x)


def _ap(x, ms, g):
    D = max(1, int(ms * SR / 1000)); b = np.zeros(D + 1); a = np.zeros(D + 1)
    b[0] = -g; b[D] = 1; a[0] = 1; a[D] = -g
    return ss.lfilter(b, a, x)


def room(x, wet=.2, size=1.0, damp=5000, tail=.6, g=.79, pre=.010, side=0):
    """Schroeder reverb; side 0 / 1 = slightly different combs for left / right"""
    sh = 2.3 * side
    x = np.concatenate([x, np.zeros(int(tail * SR))])
    p = np.concatenate([np.zeros(int(pre * SR)), x])[:len(x)]
    w = sum(_comb(p, (dd + sh) * size, g - i * .01) for i, dd in enumerate((29.7, 37.1, 41.1, 43.7))) / 4
    w = _ap(_ap(w, 5.0 + sh * .3, .7), 1.7 + sh * .1, .7)
    w = filt(w, 'lowpass', damp, 1)
    return x + wet * w


def stereo_room(x, wet=.25, size=1.2, damp=6000, tail=1.2, g=.8):
    return np.stack([room(x, wet, size, damp, tail, g, side=0), room(x, wet, size, damp, tail, g, side=1)], 1)


# ---------- recorded CC0 foley ----------
_CACHE = {}


def load(path, mono=True):
    if path in _CACHE: return _CACHE[path].copy()
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1' if mono else '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    y = np.frombuffer(out, dtype=np.float32).astype(float)
    if not mono: y = y.reshape(-1, 2)
    _CACHE[path] = y
    return y.copy()


def trim(x, db=-48, pre=.002, post_db=-60):
    a = np.abs(x if x.ndim == 1 else x.mean(1)); m = a.max() + 1e-12
    on = np.nonzero(a > m * 10 ** (db / 20))[0]
    if not len(on): return x
    s = max(0, on[0] - int(pre * SR))
    off = np.nonzero(a > m * 10 ** (post_db / 20))[0][-1]
    return x[s:off + int(.01 * SR)]


# ---------- loudness ----------
def loud_db(y, win=.2):
    m = y.mean(1) if y.ndim == 2 else y
    k = filt(m, 'highpass', 60); k = k + .58 * filt(k, 'highpass', 1500)
    w = max(1, min(len(k), int(win * SR))); ms = np.convolve(k * k, np.ones(w) / w, 'same')
    return 10 * np.log10(ms.max() + 1e-12)


def master(y, target, ceil=.9):
    """loudest 200 ms at `target` dB (rough K-weighting), peaks soft-limited under `ceil`"""
    y = y * 10 ** ((target - loud_db(y)) / 20)
    knee = ceil * .85
    a = np.abs(y)
    return np.where(a > knee, np.sign(y) * (knee + (ceil - knee) * np.tanh((a - knee) / (ceil - knee))), y)
