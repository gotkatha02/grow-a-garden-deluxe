"""Builds every game sound (2026-11-25, owner 'ทำอีกได้ไหมแบบใช้ทั้งเกม สมจริงๆ') → assets/sfx/<name>_<n>.mp3 + assets/sfx/list.js.

  python3 -I tools/sfx/build_sfx.py [name,name,…] [sheet=/tmp/sfx_sheet.png] [wav=/tmp/sfxwav]

Recorded layers come from two CC0 Kenney packs (public domain, see assets/sfx/CREDITS.txt). Get them once into KENNEY
(default /home/claude/dl):
  git clone --depth 1 https://github.com/ismetcabbar9-oss/kenney-audio-assets.git $KENNEY/kaudio
  git clone --depth 1 https://github.com/Boyquotes/kenney-impact-sounds-for-godot.git $KENNEY/kimpact
Everything else is synthesised in sfxlib.py. Each recipe is r_<name>(r, i) → mono signal (or (signal, peak seconds) for
swings, or a stereo array for the ambience beds); SPEC[name] = (variants, loudness target dB, kind). The engine
(sfx.js) reads list.js: {name: [variants, peak seconds, seconds, loop]}."""
import os, sys, json, subprocess, zlib, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sfxlib import *
from voices import *   # monster voices mv_<family>_ag/at/hu + boss_roar / boss_step (2026-11-28)

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'assets', 'sfx')
KEN = os.environ.get('KENNEY', '/home/claude/dl')
KR = os.path.join(KEN, 'kaudio', 'Audio (295 files)', 'RPG sounds (50 sounds)')
KU = os.path.join(KEN, 'kaudio', 'Audio (295 files)', 'UI sounds (50 sounds)')
KI = os.path.join(KEN, 'kimpact', 'addons', 'kenney impact sounds')


def kr(n): return trim(load(os.path.join(KR, n + '.ogg')))
def ku(n): return trim(load(os.path.join(KU, n + '.ogg')))
def ki(n, i): return trim(load(os.path.join(KI, '%s_%03d.ogg' % (n, i % 5))))
def fit(x, d): return x[:int(d * SR)] if len(x) > d * SR else x


# ======================= weapons: swings =======================
def r_sw_heavy(r, i):   # greataxe, sword, mace: deep 'vwoom'
    x, pk = whoosh(r, .38 * r.uniform(.92, 1.08), 160, 850 * r.uniform(.9, 1.15), 280, .62, 1.25, .9, .22, 4200)
    return edge(x), pk
def r_sw_sharp(r, i):   # katana: fast with a thin edge whistle ('shing')
    x, pk = whoosh(r, .25 * r.uniform(.9, 1.1), 520, 2600 * r.uniform(.9, 1.12), 900, .58, 1.6, .25, .5, 9500, .32, (2600, 5400, 3600))
    return edge(x), pk
def r_sw_light(r, i):   # daggers, dodges
    x, pk = whoosh(r, .17 * r.uniform(.9, 1.1), 700, 3000 * r.uniform(.9, 1.1), 1200, .55, 1.5, .18, .45, 9500, .12, (3000, 5800, 4200))
    return edge(x), pk
def r_sw_thrust(r, i):  # spear thrust: quick push of air
    x, pk = whoosh(r, .2 * r.uniform(.92, 1.08), 300, 1600 * r.uniform(.9, 1.1), 650, .42, 1.2, .45, .32, 7000, shape=1.5)
    return edge(x), pk
def r_sw_staff(r, i):   # long pole: rounder, no edge
    x, pk = whoosh(r, .32 * r.uniform(.92, 1.08), 210, 1250 * r.uniform(.9, 1.1), 420, .6, 1.15, .65, .28, 5200)
    return edge(x), pk
def r_sw_chain(r, i):   # flail: whoosh + the chain links rattling with the swing
    x, pk = whoosh(r, .36, 190, 1050 * r.uniform(.9, 1.1), 360, .6, 1.25, .75, .25, 5200)
    n = len(x); t = np.arange(n) / n
    env = np.where(t < .6, (t / .6) ** 1.5, np.exp(-(t - .6) * 6))
    ch = grains(n / SR, lambda tt: 40 + 380 * np.interp(tt, np.arange(n) / SR, env), 2300, 7200, r, (.0015, .006), .45)
    return edge(x + ch * .35 * np.abs(x).max() / (np.abs(ch).max() + 1e-9)), pk
def r_sw_fist(r, i):    # punch: short 'fwip'
    x, pk = whoosh(r, .14 * r.uniform(.9, 1.1), 260, 1300 * r.uniform(.9, 1.1), 520, .6, 1.0, .65, .2, 5200, shape=1.8)
    return edge(x), pk
def r_sw_gauntlet(r, i):   # rhino: heavy iron fists
    x, pk = whoosh(r, .22 * r.uniform(.92, 1.08), 150, 800 * r.uniform(.9, 1.1), 260, .6, 1.0, 1.0, .15, 3800, shape=1.8)
    return edge(x), pk
def r_shot_xbow(r, i):  # crossbow: trigger click + string snap + bolt hiss leaving
    d = .42; n = int(d * SR); t = T(d)
    click = filt(nz(n, r), 'highpass', 2500) * np.exp(-t / .002) * .5
    s = pluck(r.uniform(150, 185), d, r, .985, .8) * np.exp(-t / .07)
    thw = thump(d, 260, 90, .01, .03, r) * .9
    fly, _ = whoosh(r, .3, 2400, 5200, 3000, .12, 2.0, .05, .6, 11000, shape=1.0)
    x = mix((1, click), (1.1, s, .004), (1, thw, .004), (.55, fly * np.exp(-np.arange(len(fly)) / SR / .12), .012))
    return edge(x), .006
def r_rings(r, i):      # the monkey's iron staff rings (layer on his swings)
    d = .32; return edge(grains(d, lambda t: 300 * np.exp(-t / .07) + 20, 1900, 5200, r, (.01, .05), 1.0, inharm=(2.32, 4.25)) * np.exp(-T(d) / .25))


# ======================= weapons: impacts =======================
def body(r, d=.4, hi=130, lo=46, tau=.1):
    return thump(d, hi * r.uniform(.92, 1.08), lo, .03, tau, r)
def r_hit_heavy(r, i):  # axe / greatsword into a body
    c = pitch(kr('chop'), r.uniform(.82, 1.02))
    d = .45; t = T(d); n = len(t)
    cr = filt(nz(n, r), 'bandpass', [350, 2600]) * np.exp(-t / .03)
    x = mix((1.0, c), (1.0, body(r, d, 140, 44, .1)), (.45, cr))
    return room(edge(sat(x, 1.8)), .08, .6, 4500, .25)
def r_hit_slash(r, i):  # katana / dagger cut
    k = fit(kr(['knifeSlice', 'knifeSlice2'][i % 2]), .32); k = pitch(k * np.exp(-np.arange(len(k)) / SR / .14), r.uniform(.92, 1.12))
    d = .3; t = T(d)
    x = mix((1.0, k), (.6, body(r, d, 150, 60, .06)), (.25, filt(nz(len(t), r), 'highpass', 3000) * np.exp(-t / .003)))
    return room(edge(x), .07, .5, 6000, .2)
def r_hit_pierce(r, i):  # spear / bolt: sharp entry + dull thunk
    d = .35; t = T(d); n = len(t)
    thk = modal([320 * r.uniform(.9, 1.1), 790, 1450], [1, .5, .25], [.03, .018, .01], d, r)
    slap = filt(nz(n, r), 'lowpass', 1800) * np.exp(-t / .03)
    tick = filt(nz(n, r), 'highpass', 3500) * np.exp(-t / .0025)
    x = mix((.8, thk), (.7, slap), (.5, tick), (.9, body(r, d, 120, 50, .07)))
    return room(edge(sat(x, 1.6)), .07, .5, 5000, .2)
def r_hit_blunt(r, i):   # mace / staff / flail ball
    k = fit(ki('impact_soft_heavy', i), .3); k = pitch(k * np.exp(-np.arange(len(k)) / SR / .12), r.uniform(.78, .95))
    d = .45; t = T(d); n = len(t)
    cr = filt(nz(n, r), 'bandpass', [300, 1500]) * np.exp(-t / .035)
    x = mix((1.0, k), (1.1, body(r, d, 120, 40, .12)), (.4, cr))
    return room(edge(sat(x, 2.0)), .08, .6, 4000, .25)
def r_hit_punch(r, i):
    k = pitch(ki('impact_punch_medium', i), r.uniform(.9, 1.06))
    return room(edge(mix((1, k), (.6, body(r, .3, 150, 60, .05)))), .06, .5, 5000, .2)
def r_hit_punch_heavy(r, i):
    k = pitch(ki('impact_punch_heavy', i), r.uniform(.82, .98))
    return room(edge(mix((1, k), (.9, body(r, .4, 120, 42, .1)))), .08, .6, 4500, .25)
def r_hit_crit(r, i):    # crit layer: bright metallic 'shing' + low boom
    d = .7; t = T(d); n = len(t)
    ring = modal([2380 * r.uniform(.95, 1.05), 5150, 7900, 3610], [1, .55, .3, .4], [.07, .045, .03, .055], d, r)
    boom = thump(d, 95, 34, .04, .16, r)
    snap = filt(nz(n, r), 'highpass', 1800) * np.exp(-t / .006)
    return room(edge(mix((.5, ring), (1.0, boom), (.6, snap))), .18, 1.0, 7000, .5)
def r_block(r, i):       # parry / guard: steel on steel
    k = ki('impact_metal_heavy', i)
    d = .8; ring = modal([880 * r.uniform(.93, 1.07), 2350, 4300, 6150], [1, .6, .35, .2], [.2, .13, .08, .05], d, r)
    return room(edge(mix((1, k), (.35, ring))), .15, .9, 7000, .35)


# ======================= elements =======================
def r_fire_cast(r, i):
    d = .7; t = T(d); n = len(t)
    fc = 200 + 2600 * np.exp(-((t - .12) / .12) ** 2) + 400 * np.exp(-t / .4)
    wh = svf(nz(n, r), fc, .9, 'lp') * att(t, .03) * np.exp(-t / .3)
    roar = filt(nz(n, r), 'bandpass', [250, 900]) * np.exp(-t / .35)
    x = mix((1.2, wh), (.35, roar), (.6, crackles(d, lambda tt: 50 * np.exp(-tt / .3) + 5, r, 1, 1500)), (.5, thump(d, 70, 38, .05, .2, r)))
    return room(edge(sat(x, 1.5)), .12, 1.0, 4500, .4)
def r_fire_hit(r, i):
    d = .6; t = T(d); n = len(t)
    burst = filt(nz(n, r), 'lowpass', 3200) * att(t, .004) * np.exp(-t / .07)
    x = mix((1.0, burst), (1.0, thump(d, 120, 40, .03, .1, r)), (.7, crackles(d, lambda tt: 60 * np.exp(-tt / .2) + 4, r, 1, 1400)),
            (.25, filt(nz(n, r), 'bandpass', [2500, 7000]) * np.exp(-t / .2)))
    return room(edge(sat(x, 1.8)), .1, .8, 4500, .3)
def r_ice_cast(r, i):
    d = .65; t = T(d); n = len(t)
    parts = []   # tinkles that climb in pitch while the crystal grows
    for k in range(26):
        t0 = r.uniform(0, .55); f = 1800 * 2.8 ** (t0 / .55) * r.uniform(.85, 1.2); ta = r.uniform(.01, .035); L = int(ta * 7 * SR); g = np.arange(L) / SR
        parts.append((t0 * SR, r.uniform(.3, 1) * (np.sin(2 * np.pi * f * g) + .4 * np.sin(2 * np.pi * f * 2.76 * g)) * np.exp(-g / ta)))
    up = place(n, parts)
    hiss = filt(nz(n, r), 'highpass', 4000) * (t / d) ** 1.5 * np.exp(-np.maximum(0, t - .5) / .05)
    wh, _ = whoosh(r, d, 400, 1800, 800, .7, 1.2, .3, .4, 8000)
    x = mix((.8, up), (.35, hiss), (.5, wh))
    return room(edge(x), .2, 1.0, 8000, .4)
def r_ice_hit(r, i):
    d = .75; t = T(d); n = len(t)
    crack = filt(nz(n, r), 'highpass', 1700) * np.exp(-t / .01)
    gate = np.repeat(r.uniform(0, 1, int(d * 400) + 1) ** 3, int(SR / 400) + 1)[:n]
    crumble = filt(nz(n, r), 'bandpass', [1100, 5200]) * gate * np.exp(-t / .08)
    tk = grains(d, lambda tt: 160 * np.exp(-tt / .14) + 6, 2300, 7800, r, (.012, .06), 1.0)
    x = mix((1.0, crack), (.55, crumble), (.9, tk), (.5, np.sin(2 * np.pi * 190 * t) * np.exp(-t / .045)))
    return room(edge(x), .22, 1.0, 7000, .5)
def r_bolt_cast(r, i):
    d = .42; t = T(d); n = len(t)
    gate = np.zeros(n); tt = 0.0
    while tt < d:
        on = r.uniform(.004, .025); gate[int(tt * SR):int((tt + on) * SR)] = r.uniform(.3, 1) * (tt / d) ** .7; tt += on + r.uniform(0, .02)
    gate = filt(gate, 'lowpass', 500, 1)
    fr = 110 + 40 * np.tanh(np.cumsum(nz(n, r)) / 900)
    buzz = filt(2 * ((np.cumsum(fr) / SR) % 1) - 1, 'highpass', 300) * gate
    x = mix((.7, buzz), (.4, filt(nz(n, r), 'highpass', 3500) * gate))
    return room(edge(x), .1, .8, 6000, .3)
def r_bolt_hit(r, i):
    d = 1.2; t = T(d); n = len(t)
    gate = np.zeros(n); tt = 0.0
    while tt < .3:
        on = r.uniform(.004, .025); gate[int(tt * SR):int((tt + on) * SR)] = r.uniform(.35, 1) * np.exp(-tt / .15); tt += on + r.uniform(0, .015)
    gate = filt(gate, 'lowpass', 500, 1)
    fr = 95 + 45 * np.tanh(np.cumsum(nz(n, r)) / 900)
    buzz = filt(2 * ((np.cumsum(fr) / SR) % 1) - 1, 'highpass', 280) * gate
    crack = filt(nz(n, r), 'highpass', 500) * np.exp(-t / .008)
    br = brown(n, r); br = filt(br, 'lowpass', 170, 2); br /= np.abs(br).max()
    tc = np.clip(t - .03, 0, None)
    rum = br * att(tc, .05) * np.exp(-tc / .4)
    x = mix((.55, buzz), (.3, filt(nz(n, r), 'highpass', 3600) * gate), (1.0, crack), (1.3, rum), (.7, thump(d, 80, 32, .04, .25, r)))
    return room(edge(sat(x, 1.8), r=.1), .15, 1.2, 3500, .5)
def r_water_cast(r, i):
    d = .65; t = T(d); n = len(t)
    surge = svf(nz(n, r), 300 + 1500 * (t / d) ** .7 * np.exp(-np.maximum(0, t - .4) / .1), .8, 'lp') * att(t, .05) * np.exp(-np.maximum(0, t - .35) / .12)
    bb = bubbles(d, lambda tt: 500 * np.exp(-((tt - .3) / .15) ** 2) + 40, .8, 5, r, 1.0)
    x = mix((1.0, surge), (.7, bb), (.4, thump(d, 90, 45, .06, .15, r)))
    return room(edge(x), .15, .9, 6000, .35)
def r_water_hit(r, i):
    d = .7; t = T(d); n = len(t)
    slap = filt(nz(n, r), 'lowpass', 2600) * np.exp(-t / .018)
    bb = bubbles(d, lambda tt: 1100 * np.exp(-tt / .1) + 25, .7, 7, r, 1.0)
    drops = bubbles(d, lambda tt: 70 * np.exp(-((tt - .25) / .12) ** 2), .6, 2.2, r, .6)
    x = mix((1.0, slap), (.9, bb), (.5, drops), (.6, thump(d, 110, 45, .03, .08, r)))
    return room(edge(x), .14, .8, 6500, .35)
def r_wind_cast(r, i):
    d = .7; t = T(d); n = len(t)
    fc = 450 * (2000 / 450) ** np.clip(t / .35, 0, 1) * np.where(t > .35, (600 / 2000) ** ((t - .35) / .35), 1)
    g = svf(pink(n, r), fc, .8, 'bp') * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5 * (1 + .25 * np.sin(2 * np.pi * 13 * t))
    return room(edge(g), .15, 1.0, 6000, .35)
def r_wind_hit(r, i):
    x, pk = whoosh(r, .3, 900, 3800, 1400, .35, 1.6, .2, .5, 10000, .18, (3000, 6000, 4000), 1.4)
    t = T(len(x) / SR)
    return room(edge(mix((1, x), (.5, thump(.3, 140, 60, .02, .04, r), pk))), .1, .7, 7000, .3)
def r_earth_cast(r, i):
    d = .8; t = T(d); n = len(t)
    br = filt(brown(n, r), 'lowpass', 140, 2)
    rum = br / np.abs(br).max() * att(t, .1) * np.exp(-np.maximum(0, t - .35) / .2)
    x = mix((1.2, rum), (.5, crackles(d, lambda tt: 70 * np.sin(np.pi * min(1, tt / d)) + 5, r, 1, 700, dur=(.002, .008))), (.6, thump(d, 70, 30, .08, .3, r)))
    return room(edge(sat(x, 1.6)), .12, 1.2, 3000, .4)
def r_earth_hit(r, i):
    k = pitch(fit(ki('impact_mining', i), .45), r.uniform(.75, .95))
    d = .8; t = T(d)
    deb = crackles(d, lambda tt: 90 * np.exp(-tt / .18) + 3, r, 1, 900, dur=(.002, .007))
    x = mix((1.0, k), (1.1, thump(d, 100, 32, .05, .22, r)), (.6, deb, .03))
    return room(edge(sat(x, 1.7)), .12, 1.0, 3500, .4)
def r_dark_cast(r, i):
    d = .75; t = T(d); n = len(t)
    sw = (t / d) ** 3 * np.exp(-np.maximum(0, t - .68) / .015)
    band = svf(nz(n, r), 300 + 600 * (t / d), 1.2, 'bp') * sw
    tone = sweep(42 + 14 * (t / d)) * sw * .8
    wh = sum(svf(nz(n, r), f, 7, 'bp') for f in (700, 1150, 2500)) * (.5 + .5 * np.sin(2 * np.pi * 7 * t)) * sw * .5
    x = mix((1.0, band), (1.0, tone), (.6, wh))
    return room(edge(x), .25, 1.3, 3000, .6)
def r_dark_hit(r, i):
    d = .7; t = T(d); n = len(t)
    x = mix((1.2, thump(d, 95, 30, .05, .16, r)), (.5, filt(nz(n, r), 'bandpass', [1800, 6000]) * np.exp(-t / .18)),
            (.5, filt(nz(n, r), 'lowpass', 600) * np.exp(-t / .05)))
    return room(edge(sat(x, 1.7)), .22, 1.2, 3000, .5)
def r_holy_cast(r, i):
    d = 1.0; n = int(d * SR)
    base = [1046.5, 1318.5, 1568.0][i % 3]
    parts = [(0, .5 * bell(base, .9, r)), (.09 * SR, .4 * bell(base * 1.5, .8, r))]
    sp = grains(d, lambda tt: 60 * np.exp(-((tt - .25) / .2) ** 2) + 4, 3000, 9000, r, (.006, .02), .25)
    wh, _ = whoosh(r, .5, 500, 2500, 1500, .7, 1.0, .1, .4, 9000)
    x = place(n, parts) + sp + .3 * np.concatenate([wh, np.zeros(n - len(wh))])
    return room(edge(x), .3, 1.3, 8000, .7)
def r_holy_hit(r, i):
    d = .7; t = T(d); n = len(t)
    ting = modal([2637 * r.uniform(.97, 1.03), 6150, 3950], [1, .4, .5], [.18, .08, .12], d, r)
    sp = grains(d, lambda tt: 120 * np.exp(-tt / .12) + 3, 3500, 9500, r, (.005, .02), .4)
    x = mix((.7, ting), (.6, sp), (.6, thump(d, 140, 60, .03, .06, r)))
    return room(edge(x), .25, 1.1, 8000, .5)
def r_blood_hit(r, i):   # wet slash: cut + squelch
    k = pitch(fit(kr(['knifeSlice', 'knifeSlice2'][i % 2]), .3), r.uniform(.85, 1.0))
    d = .3; t = T(d); n = len(t)
    sq = filt(nz(n, r), 'lowpass', 900) * (.5 + .5 * np.sin(2 * np.pi * 45 * t)) * np.exp(-t / .06)
    x = mix((1.0, k), (.7, sq, .01), (.7, body(r, d, 120, 50, .07)))
    return room(edge(x), .06, .5, 5000, .2)
def r_poison_hit(r, i):
    d = .6; t = T(d)
    bb = bubbles(d, lambda tt: 90 * np.exp(-tt / .3) + 10, 3, 12, r, 1.0)
    x = mix((1.0, bb), (.3, filt(nz(len(t), r), 'bandpass', [3000, 8000]) * np.exp(-t / .25)), (.4, thump(d, 90, 50, .04, .08, r)))
    return room(edge(x), .12, .8, 5000, .3)


def bell(f, d, r, bright=1.0, decay=1.0):
    t = T(d)
    parts = ((1, 1, .9), (2.0, .42 * bright, .55), (3.0, .22 * bright, .35), (4.16, .13 * bright, .22), (5.43, .07 * bright, .14))
    x = sum(a * np.sin(2 * np.pi * f * k * t + r.uniform(0, 6.28)) * np.exp(-t / (tau * decay)) for k, a, tau in parts)
    return fadeout(x * att(t, .002))


# ======================= skill extras =======================
def r_buff_up(r, i):
    d = 1.1; t = T(d); n = len(t)
    rise = svf(nz(n, r), 300 * 10 ** (1.0 * np.clip(t / .8, 0, 1)), 1.3, 'bp') * (t / .8).clip(0, 1) ** 2 * np.exp(-np.maximum(0, t - .8) / .08)
    sw = sweep(110 * 2 ** (t / .8).clip(0, 1)) * (t / .8).clip(0, 1) ** 2 * np.exp(-np.maximum(0, t - .8) / .1) * .5
    sp = grains(d, lambda tt: 80 * np.exp(-((tt - .85) / .1) ** 2) + 2, 3000, 9000, r, (.006, .02), .3)
    x = mix((1.0, rise), (1.0, sw), (.8, sp))
    return room(edge(x), .2, 1.2, 7000, .6)
def r_buff_war(r, i):    # war cry / howl type buffs: taiko hit + gong swell
    d = 1.6; t = T(d); n = len(t)
    f0 = 72 * r.uniform(.95, 1.05)
    drum = modal([f0, f0 * 1.59, f0 * 2.14, f0 * 2.3, f0 * 2.65], [1, .5, .35, .25, .2], [.35, .2, .14, .1, .08], d, r)
    skin = filt(nz(n, r), 'bandpass', [150, 1500]) * np.exp(-t / .02)
    gong = sum(a * np.sin(2 * np.pi * f * t + r.uniform(0, 6)) for f, a in ((220, 1), (331, .6), (467, .4), (612, .3))) * att(t, .25) * np.exp(-t / .8) * .3
    return room(edge(mix((1.3, drum), (.6, skin), (1, gong))), .3, 1.4, 4000, .9)
def r_heal(r, i):
    d = 1.4; n = int(d * SR); parts = []
    for k, f in enumerate((783.99, 1046.5, 1318.5, 1567.98)):
        tt = T(1.0); vib = 1 + .004 * np.sin(2 * np.pi * 5.5 * tt)
        parts.append((k * .1 * SR, .5 * fadeout((sweep(f * vib) + .25 * sweep(2 * f * vib)) * att(tt, .03) * np.exp(-tt / .4))))
    x = place(n, parts) + grains(d, lambda tt: 40 * np.exp(-((tt - .45) / .3) ** 2) + 2, 2500, 8000, r, (.006, .02), .2)
    return room(edge(x), .4, 1.4, 7000, 1.0)
def r_shield_up(r, i):
    d = 1.1; t = T(d)
    hum = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((220, 1), (221.6, .8), (330.5, .5), (441, .3))) * att(t, .15) * np.exp(-t / .5) * .4
    ting = modal([1760, 4400, 3080], [1, .4, .5], [.25, .1, .15], d, r) * .4
    sp = grains(d, lambda tt: 50 * np.exp(-tt / .3) + 2, 3000, 8000, r, (.006, .02), .25)
    return room(edge(mix((1, hum), (1, ting), (1, sp))), .3, 1.3, 7000, .8)
def r_ult_boom(r, i):
    d = 2.2; t = T(d); n = len(t)
    sub = thump(d, 75, 26, .15, .6, r)
    burst = filt(nz(n, r), 'lowpass', 1600) * att(t, .006) * np.exp(-t / .22)
    deb = crackles(d, lambda tt: 60 * np.exp(-tt / .5) + 2, r, 1, 900, dur=(.002, .008))
    x = mix((1.4, sub), (1.0, burst), (.5, deb, .05))
    return room(edge(sat(x, 1.9), r=.3), .35, 1.7, 2500, 1.4, .84)
def r_slam(r, i):        # leap landing / ground slam
    k = pitch(fit(ki('impact_mining', i + 2), .5), r.uniform(.6, .75))
    d = 1.0; t = T(d); n = len(t)
    deb = crackles(d, lambda tt: 110 * np.exp(-tt / .25) + 3, r, 1, 700, dur=(.002, .009))
    dust = filt(nz(n, r), 'bandpass', [400, 2500]) * att(t, .02) * np.exp(-t / .25) * .3
    x = mix((.8, k), (1.4, thump(d, 95, 30, .06, .25, r)), (.7, deb, .04), (1, dust))
    return room(edge(sat(x, 1.8)), .15, 1.2, 3000, .6)
def r_dash(r, i):
    x, pk = whoosh(r, .3 * r.uniform(.9, 1.1), 280, 1800, 520, .45, 1.1, .6, .35, 6500, shape=1.4)
    c = pitch(fit(kr('cloth%d' % (1 + i % 4)), .25), 1.2) * .25
    return edge(mix((1, x), (1, c))), pk
def r_summon(r, i):
    d = 1.4; t = T(d); n = len(t)
    sw = (t / .7).clip(0, 1) ** 3
    rev = svf(nz(n, r), 200 + 1800 * (t / .7).clip(0, 1), 1.0, 'bp') * sw * np.exp(-np.maximum(0, t - .7) / .03)
    hum = (np.sin(2 * np.pi * 55 * t) + .6 * np.sin(2 * np.pi * 82.4 * t)) * att(t, .4) * np.exp(-np.maximum(0, t - .7) / .35) * .5
    pop = place(n, [(.7 * SR, thump(d - .7, 160, 50, .03, .12, r))])
    sp = grains(d, lambda tt: 90 * np.exp(-((tt - .8) / .15) ** 2) + 2, 2500, 8000, r, (.006, .02), .3)
    return room(edge(mix((1, rev), (1, hum), (1, pop), (1, sp))), .3, 1.4, 5000, .9)


# ======================= monsters / player =======================
def r_mon_die(r, i):
    k = pitch(ki('impact_soft_heavy', i + 1), r.uniform(.68, .82))
    d = 1.2; t = T(d); n = len(t)
    dis = svf(nz(n, r), 1500 + 2500 * np.clip((t - .15) / .7, 0, 1), 1.4, 'bp') * np.clip((t - .12) / .3, 0, 1) * np.exp(-np.maximum(0, t - .42) / .25) * .35
    sp = grains(d, lambda tt: 70 * np.exp(-((tt - .45) / .2) ** 2) + 1, 2600, 7500, r, (.006, .02), .22)
    x = mix((1.0, k), (.9, thump(d, 90, 38, .05, .14, r)), (1, dis), (1, sp))
    return room(edge(x), .15, 1.0, 5000, .5)
def r_boss_die(r, i):
    d = 3.2; t = T(d); n = len(t)
    sub = thump(d, 70, 24, .2, .9, r)
    burst = filt(nz(n, r), 'lowpass', 1400) * att(t, .01) * np.exp(-t / .35)
    rum = filt(brown(n, r), 'lowpass', 120, 2); rum = rum / np.abs(rum).max() * att(t, .2) * np.exp(-t / 1.2)
    sp = grains(d, lambda tt: 120 * np.exp(-((tt - 1.0) / .5) ** 2) + 3, 2500, 9000, r, (.008, .03), .3)
    x = mix((1.4, sub), (1, burst), (1.2, rum), (1, sp))
    return room(edge(sat(x, 1.8), r=.4), .4, 1.8, 2500, 1.6, .85)
def r_hurt(r, i):        # a monster lands a hit on the hero
    k = pitch(ki('impact_punch_medium', i + 2), r.uniform(.78, .92))
    c = fit(kr('cloth%d' % (1 + i % 4)), .14) * .35
    return room(edge(mix((1, k), (.9, body(r, .35, 110, 45, .08)), (1, c))), .06, .5, 4500, .2)
def r_hurt_magic(r, i):
    d = .5; t = T(d); n = len(t)
    zap = filt(nz(n, r), 'bandpass', [1500, 6000]) * np.exp(-t / .09) * (.6 + .4 * np.sign(np.sin(2 * np.pi * 60 * t)))
    return room(edge(mix((.7, zap), (1, body(r, d, 120, 45, .09)))), .15, .9, 5000, .3)
def r_ko(r, i):          # KO stun: cartoon bonk + little bell trill
    d = .9; t = T(d)
    bonk = modal([780, 2030, 3400], [1, .5, .2], [.05, .03, .015], d, r)
    trill = place(int(d * SR), [(k * .07 * SR + .06 * SR, .35 * bell(2093 if k % 2 else 2637, .25, r)) for k in range(6)])
    return room(edge(mix((1, bonk), (1, trill))), .15, .9, 8000, .3)
def r_boss_warn(r, i):   # a boss telegraph appears: low pulsing horn + rising air
    d = 1.1; t = T(d); n = len(t)
    horn = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((73.4, 1), (110, .6), (146.8, .3))) * (.6 + .4 * np.sin(2 * np.pi * 6 * t)) * att(t, .08) * np.exp(-np.maximum(0, t - .6) / .2)
    air = svf(nz(n, r), 400 + 1500 * (t / d), 1.0, 'bp') * (t / d) ** 2 * .4
    return room(edge(mix((.8, sat(horn, 1.5)), (1, air))), .25, 1.4, 3000, .6)


# ======================= footsteps =======================
def r_step_snow(r, i): return edge(pitch(ki('footstep_snow', i), r.uniform(.94, 1.06)))
def r_step_grass(r, i): return edge(pitch(fit(ki('footstep_grass', i), .3), r.uniform(.94, 1.06)))
def r_step_stone(r, i): return edge(pitch(ki('footstep_concrete', i), r.uniform(.94, 1.06)))
def r_step_wood(r, i): return edge(pitch(ki('footstep_wood', i), r.uniform(.94, 1.06)))
def r_step_sand(r, i):   # dry sand: soft press + fine grains sliding
    d = .22; t = T(d); n = len(t)
    press = filt(nz(n, r), 'lowpass', 500) * att(t, .006) * np.exp(-t / .035)
    gr = crackles(d, lambda tt: 2500 * np.exp(-tt / .05) + 1, r, 1, 1800, dur=(.0004, .0012)) * np.exp(-t / .07)
    hiss = filt(nz(n, r), 'bandpass', [1500, 6000]) * att(t, .01) * np.exp(-t / .05) * .3
    return edge(mix((1, press), (.6, gr), (1, hiss), (.5, thump(d, 90, 50, .02, .04, r))))


# ======================= UI / systems =======================
def r_ui_click(r, i): return edge(ku(['click1', 'click3', 'click5'][i % 3]))
def r_ui_open(r, i): return edge(mix((1, kr('bookOpen')), (.5, fit(kr(['handleSmallLeather', 'handleSmallLeather2'][i % 2]), .25), .02)))
def r_ui_close(r, i): return edge(kr(['bookClose', 'bookPlace1'][i % 2]))
def r_ui_tab(r, i):     # page flip: the loud part of the recording only
    x = kr('bookFlip%d' % (1 + i % 3)); a = np.abs(x); p = int(np.argmax(filt(a, 'lowpass', 30)))
    return edge(x[max(0, p - int(.06 * SR)):p + int(.22 * SR)], .004, .03)
def r_ui_equip(r, i): return edge([lambda: fit(kr('cloth%d' % (1 + i % 4)), .35), lambda: kr('beltHandle1'), lambda: kr('metalClick'), lambda: kr('clothBelt')][i % 4]())
def r_ui_coin(r, i): return edge(fit(kr(['handleCoins', 'handleCoins2'][i % 2]), .6))
def r_ui_item(r, i):     # loot into the bag: soft pop + leather
    d = .35; t = T(d)
    pop = sweep(500 + 900 * (t / .06).clip(0, 1)) * np.exp(-t / .045) * att(t, .002)
    return edge(mix((.8, pop), (.5, fit(kr('handleSmallLeather'), .2), .02)))
def r_ui_rare(r, i):
    d = 1.2; n = int(d * SR)
    parts = [(k * .06 * SR, .4 * bell(f, .9, r)) for k, f in enumerate((1568, 2093, 2637, 3136))]
    return room(edge(place(n, parts) + grains(d, lambda tt: 70 * np.exp(-tt / .3) + 2, 3500, 9500, r, (.005, .02), .25)), .35, 1.2, 9000, .8)
def r_ui_error(r, i):
    d = .35; t = T(d)
    b = modal([200, 520], [1, .3], [.05, .03], d, r)
    return edge(place(int(d * SR), [(0, b), (.12 * SR, .8 * b)]))
def r_ui_quest(r, i):
    d = 1.6; n = int(d * SR)
    parts = [(0, .5 * bell(1046.5, 1.0, r)), (.14 * SR, .5 * bell(1318.5, 1.0, r)), (.28 * SR, .6 * bell(1568, 1.3, r, .8, 1.4))]
    return room(edge(place(n, parts)), .35, 1.3, 8000, .9)
def r_levelup(r, i):
    d = 2.4; n = int(d * SR); parts = []
    for k, f in enumerate((523.25, 659.25, 783.99, 1046.5)): parts.append((k * .085 * SR, .5 * bell(f, 1.5, r)))
    for f in (1046.5, 1318.51, 1567.98, 2093.0):
        tt = T(2.0); parts.append((.34 * SR, .3 * bell(f, 2.0, r, .7, 1.8) * (1 + .12 * np.sin(2 * np.pi * 6.5 * tt))))
    x = place(n, parts) + grains(d, lambda tt: 50 * np.exp(-max(0, tt - .34) / .5) * (tt > .34) + 1, 3000, 8500, r, (.006, .02), .25)
    return room(edge(x), .38, 1.3, 8000, 1.2)
def anvil(r, d=1.3, f0=1180):
    return modal([f0, f0 * 2.756, f0 * 5.404, f0 * 8.933], [1, .6, .35, .15], [1.0, .5, .25, .12], d, r)
def r_smith_hit(r, i):
    k = ki('impact_metal_heavy', i + 1)
    return room(edge(mix((1, k), (.4, anvil(r, 1.3, 1180 * r.uniform(.97, 1.03))))), .15, .9, 7000, .6)
def r_refine_ok(r, i):
    d = 2.0; n = int(d * SR)
    parts = [(0, .45 * anvil(r, 1.6, 1240))] + [(.12 * SR + k * .08 * SR, .4 * bell(f, 1.2, r)) for k, f in enumerate((1318.5, 1568, 2093, 2637))]
    return room(edge(place(n, parts) + grains(d, lambda tt: 60 * np.exp(-tt / .5) + 2, 3500, 9500, r, (.005, .02), .25)), .35, 1.3, 9000, 1.0)
def r_refine_fail(r, i):
    d = 1.0; t = T(d); n = len(t)
    k = pitch(ki('impact_plate_medium', 1), .7)
    fizz = filt(nz(n, r), 'bandpass', [1500, 6000]) * att(t, .1) * np.exp(-t / .3) * .2
    return room(edge(mix((1, k), (1, fizz, .1), (.7, thump(d, 90, 50, .03, .1, r)))), .15, .9, 4000, .5)
def r_refine_break(r, i):
    d = 1.4; t = T(d)
    tk = grains(d, lambda tt: 150 * np.exp(-tt / .2) + 3, 1800, 6500, r, (.01, .06), 1.0, inharm=(2.32, 4.25))
    return room(edge(mix((1, ki('impact_glass_heavy', 2)), (.8, ki('impact_metal_light', 3), .01), (.6, tk, .02), (.8, thump(d, 100, 40, .04, .15, r)))), .2, 1.1, 6000, .7)
def r_gem_socket(r, i):
    return room(edge(mix((1, ki('impact_glass_light', i)), (.35, bell(2637 if i else 3136, .6, r), .02))), .25, 1.0, 9000, .5)
def r_carve(r, i): return room(edge(pitch(fit(ki('impact_mining', i + 3), .5), r.uniform(.9, 1.05))), .1, .9, 4000, .3)
def r_extract(r, i):
    d = 1.4; n = int(d * SR)
    x = place(n, [(0, .5 * bell(1568, 1.2, r)), (.1 * SR, .4 * bell(2349, 1.0, r))]) + grains(d, lambda tt: 90 * np.exp(-tt / .25) + 2, 3000, 9000, r, (.005, .02), .3)
    return room(edge(mix((1, x), (.5, ki('impact_glass_light', 2)))), .35, 1.2, 9000, .8)
def r_skill_learn(r, i):
    d = .9; n = int(d * SR)
    return room(edge(place(n, [(k * .07 * SR, .5 * pluck(f, .6, r, .993, .6) * np.exp(-T(.6) / .25)) for k, f in enumerate((523.25, 659.25, 783.99))])), .25, 1.0, 7000, .5)
def r_hatch(r, i):
    d = .9; t = T(d); n = len(t)
    cr = place(n, [(s * SR, crackles(.06, 900, r, 1, 2500, dur=(.0005, .002))) for s in (0, .12, .3)])
    peep = sweep(2600 + 900 * np.sin(np.pi * np.clip((t - .5) / .12, 0, 1))) * np.exp(-((t - .56) / .05) ** 2) * .4
    return room(edge(mix((1, cr), (1, peep))), .15, .8, 9000, .3)
def r_tame(r, i):
    d = 1.0; n = int(d * SR)
    return room(edge(place(n, [(0, .4 * bell(1318.5, .8, r)), (.12 * SR, .45 * bell(1760, .9, r))])), .35, 1.2, 8000, .7)
def r_relic(r, i):       # relic power: deep gong + shimmer
    d = 2.6; t = T(d)
    gong = sum(a * np.sin(2 * np.pi * f * t + r.uniform(0, 6)) * np.exp(-t / tau) for f, a, tau in ((98, 1, 1.4), (151, .6, 1.0), (213, .5, .8), (287, .35, .6), (398, .25, .4)))
    gong *= att(t, .01)
    return room(edge(mix((1, gong), (1, thump(d, 80, 30, .05, .3, r)), (.6, grains(d, lambda tt: 50 * np.exp(-tt / .6) + 2, 2500, 8000, r, (.006, .02), .3)))), .35, 1.6, 4000, 1.4)
def r_warp(r, i):
    d = 1.3; t = T(d); n = len(t)
    up = svf(nz(n, r), 300 * 12 ** np.clip(t / .7, 0, 1), 2.0, 'bp') * np.clip(t / .7, 0, 1) ** 2 * np.exp(-np.maximum(0, t - .7) / .15)
    sp = grains(d, lambda tt: 100 * np.exp(-((tt - .7) / .2) ** 2) + 2, 2500, 9000, r, (.006, .02), .35)
    sw = sweep(130 * 2 ** np.clip(t / .7, 0, 1)) * np.clip(t / .7, 0, 1) * np.exp(-np.maximum(0, t - .7) / .15) * .4
    return room(edge(mix((1, up), (1, sp), (1, sw))), .35, 1.4, 8000, 1.0)
def r_door(r, i): return edge(fit(kr(['doorOpen_1', 'doorClose_1'][i % 2]), .8))
def r_potion(r, i):
    d = .9; t = T(d); n = len(t)
    gulps = place(n, [(s * SR, mix((1, bubble(r.uniform(9, 14), r, 1.0, .5)), (.4, filt(nz(int(.06 * SR), r), 'lowpass', 700) * np.exp(-T(.06) / .02)))) for s in (.0, .22, .44)])
    clink = modal([3100, 7600], [1, .4], [.06, .03], .3, r) * .3
    return room(edge(mix((1, gulps), (1, clink, .62))), .1, .7, 6000, .3)
def r_sit(r, i): return edge(fit(kr('cloth%d' % (2 + i % 3)), .5))


# ======================= ambience beds (stereo, ~20 s; the engine crossfades copies) =======================
AD = 20.0


def slow(n, r, f=.3):
    m = filt(nz(n, r), 'lowpass', f, 1); return (m - m.min()) / (np.ptp(m) + 1e-9)


def lr(fl, fr, w=.6):
    """two signals → stereo with some cross-feed"""
    return np.stack([fl + (1 - w) * fr, fr + (1 - w) * fl], 1)


def wind(n, r, lo=250, hi=900, q=1.0, gust=.35, howl=0.0, howl_f=(450, 950)):
    t = np.arange(n) / SR
    mod = filt(nz(n, r), 'lowpass', .15, 1); mod = (mod - mod.min()) / (np.ptp(mod) + 1e-9)
    g = filt(nz(n, r), 'lowpass', .5, 1); g = (g - g.min()) / (np.ptp(g) + 1e-9)
    fc = lo + (hi - lo) * mod
    x = svf(pink(n, r), fc, q, 'bp') * (1 - gust + gust * g)
    if howl:
        hw = filt(nz(n, r), 'lowpass', .08, 1); hw = (hw - hw.min()) / (np.ptp(hw) + 1e-9)
        x += howl * svf(nz(n, r), howl_f[0] + (howl_f[1] - howl_f[0]) * hw, 14, 'bp') * (.3 + .7 * g)
    return x


def bird_call(r, kind=None):
    k = kind or r.choice(['tweet', 'trill', 'whistle', 'chirps'])
    if k == 'tweet':
        d = .09; t = T(d); f = 6200 - 3000 * t / d
        s = sweep(f) * np.sin(np.pi * t / d) ** 2
    elif k == 'trill':
        d = r.uniform(.25, .5); t = T(d); f = r.uniform(3200, 4500) + 700 * np.sin(2 * np.pi * r.uniform(18, 30) * t)
        s = sweep(f) * np.sin(np.pi * t / d) ** .8
    elif k == 'whistle':
        d = r.uniform(.18, .35); t = T(d); f = r.uniform(2400, 3600) * (1 + .15 * t / d)
        s = (sweep(f) + .12 * sweep(2 * f)) * np.sin(np.pi * t / d) ** 1.5
    else:
        parts = []; tt = 0
        for j in range(r.integers(3, 7)):
            dd = r.uniform(.03, .06); t = T(dd); f = r.uniform(4000, 6500) * (1 + .3 * np.sin(np.pi * t / dd))
            parts.append((tt * SR, sweep(f) * np.sin(np.pi * t / dd) ** 2)); tt += dd + r.uniform(.03, .08)
        s = place(int((tt + .05) * SR), parts)
    return s


def birds(n, r, rate=.45, far=.5, kinds=None):
    L = np.zeros(n); Rr = np.zeros(n); t = r.uniform(0, 1)
    while t < n / SR - 1:
        c = bird_call(r, r.choice(kinds) if kinds else None) * r.uniform(.2, 1) * (1 - far * r.uniform(0, 1))
        if r.uniform() < .5: c = filt(c, 'lowpass', 5000)
        p = r.uniform(-1, 1); s = int(t * SR)
        L[s:s + len(c)] += c[:n - s] * (1 - p) / 2; Rr[s:s + len(c)] += c[:n - s] * (1 + p) / 2
        t += r.exponential(1 / rate)
    return L, Rr


def crickets(n, r, k=4):
    t = np.arange(n) / SR; L = np.zeros(n); Rr = np.zeros(n)
    for j in range(k):
        f = r.uniform(4100, 4900); per = r.uniform(.35, .6); ph = r.uniform(0, per)
        pul = np.zeros(n)
        for c in np.arange(ph, n / SR, per):
            for p in range(3):
                s = int((c + p * .028) * SR); m = int(.016 * SR)
                if s + m < n: pul[s:s + m] += np.hanning(m)
        sig = np.sin(2 * np.pi * f * t) * pul * r.uniform(.3, 1)
        pan = r.uniform(-1, 1); L += sig * (1 - pan) / 2; Rr += sig * (1 + pan) / 2
    return L, Rr


def cicadas(n, r):
    t = np.arange(n) / SR; out = []
    for side in range(2):
        sw = filt(nz(n, r), 'lowpass', .08, 1); sw = (sw - sw.min()) / (np.ptp(sw) + 1e-9)
        am = .5 + .5 * np.sign(np.sin(2 * np.pi * r.uniform(140, 180) * t))
        out.append(filt(nz(n, r), 'bandpass', [4200, 7200]) * am * (.2 + .8 * sw ** 2))
    return out


def r_amb_snow(r, i):
    n = int(AD * SR)
    a = wind(n, r, 220, 800, .9, .45, .35, (420, 900)); b = wind(n, r, 250, 900, .9, .45, .35, (480, 1000))
    hiss = [filt(nz(n, r), 'highpass', 3000) * .08 for _ in range(2)]
    return lr(a + hiss[0], b + hiss[1])
def r_amb_forest(r, i):
    n = int(AD * SR)
    a = wind(n, r, 300, 1200, .7, .5) * .5; b = wind(n, r, 300, 1200, .7, .5) * .5
    bl, br_ = birds(n, r, .55)
    leaves = [filt(nz(n, r), 'highpass', 2500) * .06 * (.3 + .7 * slow(n, r, .3)) for _ in range(2)]
    return lr(a + bl * 1.4 + leaves[0], b + br_ * 1.4 + leaves[1])
def r_amb_summer(r, i):   # Greek / Japanese fields by day: cicadas + birds + light breeze
    n = int(AD * SR)
    c = cicadas(n, r); bl, br_ = birds(n, r, .3)
    a = wind(n, r, 300, 1100, .7, .5) * .4; b = wind(n, r, 300, 1100, .7, .5) * .4
    return lr(a + c[0] * .35 + bl, b + c[1] * .35 + br_)
def r_amb_night(r, i):
    n = int(AD * SR)
    cl, cr = crickets(n, r, 6)
    a = wind(n, r, 200, 700, .8, .4) * .35; b = wind(n, r, 200, 700, .8, .4) * .35
    return lr(a + cl * .5, b + cr * .5)
def r_amb_desert(r, i):
    n = int(AD * SR)
    a = wind(n, r, 350, 1500, .6, .55); b = wind(n, r, 350, 1500, .6, .55)
    sand = [crackles(AD, 600, r, 1, 3000, dur=(.0003, .001)) * .12 * (.3 + .7 * slow(n, r, .2)) for _ in range(2)]
    return lr(a + sand[0], b + sand[1])
def r_amb_jungle(r, i):
    n = int(AD * SR)
    c = cicadas(n, r); cl, cr = crickets(n, r, 3)
    bl, br_ = birds(n, r, .5, kinds=['whistle', 'trill', 'whistle', 'chirps'])
    frogs = []
    for side in range(2):
        f = np.zeros(n); tt = r.uniform(0, 1)
        while tt < AD - .3:
            d = .05; t = T(d); s = sweep(r.uniform(2200, 2900) * (1 + .3 * t / d)) * np.sin(np.pi * t / d) ** 2
            st = int(tt * SR); f[st:st + len(s)] += s * r.uniform(.2, .6); tt += r.exponential(.25)
        frogs.append(f)
    a = wind(n, r, 300, 900, .7, .3) * .3; b = wind(n, r, 300, 900, .7, .3) * .3
    return lr(a + c[0] * .25 + cl * .3 + bl + frogs[0] * .4, b + c[1] * .25 + cr * .3 + br_ + frogs[1] * .4)
def r_amb_town(r, i):
    n = int(AD * SR)
    fl = [bubbles(AD, 260, .8, 4, r, .5) + filt(nz(n, r), 'highpass', 1200) * .05 for _ in range(2)]
    bl, br_ = birds(n, r, .3)
    tinks = np.zeros(n); tt = 2.0
    while tt < AD - 1:
        for k in range(r.integers(2, 4)):
            s = int((tt + k * .55) * SR); a = anvil(r, .8, 1300) * .12
            if s + len(a) < n: tinks[s:s + len(a)] += filt(a, 'lowpass', 3500)
        tt += r.uniform(5, 8)
    a = wind(n, r, 300, 900, .7, .4) * .3; b = wind(n, r, 300, 900, .7, .4) * .3
    return lr(a + fl[0] * .8 + bl * .7 + tinks * .8, b + fl[1] * .8 + br_ * .7 + tinks * .5)
def r_amb_cave(r, i):
    n = int(AD * SR)
    dr = np.zeros(n); tt = .5
    while tt < AD - 1.5:
        b = bubble(r.uniform(1.5, 4), r, 1.0, r.uniform(.15, .35)); s = int(tt * SR); dr[s:s + len(b)] += b * r.uniform(.3, 1); tt += r.exponential(1.4)
    dl = room(dr, .7, 2.2, 3000, 0, .88, side=0)[:n]; drr = room(dr, .7, 2.2, 3000, 0, .88, side=1)[:n]
    drone = [filt(brown(n, r), 'lowpass', 90, 2) * .25 for _ in range(2)]
    a = wind(n, r, 150, 500, 1.2, .3) * .3; b = wind(n, r, 150, 500, 1.2, .3) * .3
    return lr(a + drone[0] + dl * .6, b + drone[1] + drr * .6)
def r_amb_sea(r, i):
    n = int(AD * SR); out = []
    for side in range(2):
        x = np.zeros(n)
        for w0 in (r.uniform(.5, 1.5), r.uniform(7, 8.5), r.uniform(14, 15)):
            t = np.arange(n) / SR - w0
            sw = np.where(t < 0, 0, np.where(t < 1.6, (t / 1.6) ** 2, np.exp(-(t - 1.6) / 1.6)))
            fc = np.where(t < 1.6, 300 + 1800 * np.clip(t / 1.6, 0, 1) ** 2, 300 + 1800 * np.exp(-np.clip(t - 1.6, 0, None) / 1.2))
            x += svf(nz(n, r), fc, .7, 'lp') * sw
            fo = filt(nz(n, r), 'highpass', 2500) * np.where(t < 1.6, 0, np.exp(-np.clip(t - 1.6, 0, None) / 2.0)) * .25
            x += fo
        x += filt(brown(n, r), 'lowpass', 300) * .08
        out.append(x)
    gl, gr = np.zeros(n), np.zeros(n); tt = r.uniform(2, 5)
    while tt < AD - 1:
        d = .45; t = T(d); f0 = 1000 + 350 * np.sin(np.pi * t / d)
        call = sum(sweep(f0 * k) / k for k in (1, 2, 3, 4)) * np.sin(np.pi * t / d) ** 1.5
        call = filt(call, 'bandpass', [900, 4000]) * r.uniform(.05, .12)
        p = r.uniform(-1, 1); s = int(tt * SR); gl[s:s + len(call)] += call * (1 - p) / 2; gr[s:s + len(call)] += call * (1 + p) / 2
        tt += r.uniform(3, 7)
    return lr(out[0] + gl, out[1] + gr)
def r_amb_volcano(r, i):
    n = int(AD * SR)
    rum = [filt(brown(n, r), 'lowpass', 70, 2) * .6 for _ in range(2)]
    lava = []
    for side in range(2):
        x = np.zeros(n); tt = r.uniform(0, 1)
        while tt < AD - 1:
            b = bubble(r.uniform(15, 40), r, 1.0, r.uniform(.3, .6)); b = filt(b, 'lowpass', 600)
            s = int(tt * SR); x[s:s + len(b)] += b * r.uniform(.3, 1); tt += r.exponential(.7)
        lava.append(x)
    cr = [crackles(AD, 20, r, 1, 1500) * .3 for _ in range(2)]
    return lr(rum[0] + lava[0] + cr[0], rum[1] + lava[1] + cr[1])
def r_amb_mystic(r, i):
    n = int(AD * SR); t = np.arange(n) / SR
    pads = []
    for side in range(2):
        x = sum(np.sin(2 * np.pi * f * (1 + side * .002) * t + r.uniform(0, 6)) * (.5 + .5 * np.sin(2 * np.pi * r.uniform(.03, .08) * t + r.uniform(0, 6))) for f in (146.8, 220, 293.7, 440))
        x = x * .12 + svf(nz(n, r), 1200 + 800 * np.sin(2 * np.pi * .05 * t + side), 2.0, 'bp') * .15
        x += grains(AD, .8, 2500, 7000, r, (.03, .1), .2)
        pads.append(x)
    return lr(pads[0], pads[1])
def r_amb_crypt(r, i):
    n = int(AD * SR); t = np.arange(n) / SR
    drone = (np.sin(2 * np.pi * 55 * t) + .7 * np.sin(2 * np.pi * 58.3 * t)) * .15
    moan = [wind(n, r, 180, 600, 4.0, .5) * .5 for _ in range(2)]
    dr = np.zeros(n); tt = 1.0
    while tt < AD - 1.5:
        b = bubble(r.uniform(2, 4), r, 1.0); s = int(tt * SR); dr[s:s + len(b)] += b * r.uniform(.3, .8); tt += r.exponential(2.5)
    d0 = room(dr, .6, 2.0, 2500, 0, .86, side=0)[:n] * .4
    return lr(drone + moan[0] + d0, drone + moan[1] + d0)
def r_amb_forge(r, i):   # smithy / hall rooms: forge fire, bellows breathing, a hammer now and then, small room
    n = int(AD * SR); t = np.arange(n) / SR
    roar = filt(nz(n, r), 'bandpass', [120, 600]) * (.6 + .4 * slow(n, r, .25)) * .35
    cr = crackles(AD, lambda tt: 18 + 10 * np.sin(tt * .7), r, 1, 1300) * .5
    bel = np.zeros(n); tt = 1.0
    while tt < AD - 2:
        L = int(1.1 * SR); e = np.sin(np.pi * np.linspace(0, 1, L)) ** 2
        bel[int(tt * SR):int(tt * SR) + L] += filt(nz(L, r), 'bandpass', [200, 1400]) * e * .35; tt += r.uniform(4.5, 7)
    hm = np.zeros(n); tt = 2.5
    while tt < AD - 1:
        for k in range(r.integers(2, 4)):
            s0 = int((tt + k * .45) * SR); a = anvil(r, .9, 1180 * r.uniform(.97, 1.03)) * .18
            if s0 + len(a) < n: hm[s0:s0 + len(a)] += a
        tt += r.uniform(5, 8)
    dry = roar + cr + bel + hm
    return np.stack([room(dry, .3, .8, 4000, 0, .78, side=0)[:n], room(dry, .3, .8, 4000, 0, .78, side=1)[:n]], 1)
def r_amb_storm(r, i):
    n = int(AD * SR); out = []
    for side in range(2):
        rain = crackles(AD, 4000, r, 1, 2000, dur=(.0003, .0012)) * .25 + bubbles(AD, 300, .5, 2, r, .2)
        out.append(rain + wind(n, r, 300, 1200, .7, .6) * .6)
    th = np.zeros(n); s = int(r.uniform(6, 12) * SR); rr = filt(brown(int(4 * SR), r), 'lowpass', 120, 2)
    rr = rr / np.abs(rr).max() * att(T(4), .3) * np.exp(-T(4) / 1.2); th[s:s + len(rr)] += rr[:n - s] * .8
    return lr(out[0] + th, out[1] + th)


# ======================= table =======================
# name: (variants, loudness dB, kind)   kind: s = sound, w = swing (peak time used), a = ambience loop
SPEC = {
    'sw_heavy': (4, -16, 'w'), 'sw_sharp': (4, -17, 'w'), 'sw_light': (4, -18, 'w'), 'sw_thrust': (3, -17, 'w'), 'sw_staff': (3, -17, 'w'),
    'sw_chain': (3, -16, 'w'), 'sw_fist': (4, -18, 'w'), 'sw_gauntlet': (3, -16, 'w'), 'shot_xbow': (4, -15, 'w'), 'rings': (3, -21, 's'),
    'hit_heavy': (4, -11, 's'), 'hit_slash': (4, -12, 's'), 'hit_pierce': (4, -12, 's'), 'hit_blunt': (4, -11, 's'), 'hit_punch': (5, -12, 's'),
    'hit_punch_heavy': (4, -11, 's'), 'hit_crit': (3, -14, 's'), 'block': (3, -13, 's'),
    'fire_cast': (3, -14, 's'), 'fire_hit': (3, -13, 's'), 'ice_cast': (3, -15, 's'), 'ice_hit': (3, -13, 's'), 'bolt_cast': (2, -16, 's'),
    'bolt_hit': (3, -12, 's'), 'water_cast': (3, -15, 's'), 'water_hit': (3, -13, 's'), 'wind_cast': (3, -15, 's'), 'wind_hit': (3, -14, 's'),
    'earth_cast': (2, -14, 's'), 'earth_hit': (3, -12, 's'), 'dark_cast': (3, -15, 's'), 'dark_hit': (3, -13, 's'), 'holy_cast': (3, -16, 's'),
    'holy_hit': (3, -14, 's'), 'blood_hit': (3, -12, 's'), 'poison_hit': (2, -15, 's'),
    'buff_up': (2, -16, 's'), 'buff_war': (2, -14, 's'), 'heal': (2, -17, 's'), 'shield_up': (2, -16, 's'), 'ult_boom': (2, -11, 's'),
    'slam': (3, -12, 's'), 'dash': (3, -17, 'w'), 'summon': (2, -15, 's'),
    'mon_die': (4, -15, 's'), 'boss_die': (1, -11, 's'), 'hurt': (4, -13, 's'), 'hurt_magic': (2, -14, 's'), 'ko': (1, -16, 's'), 'boss_warn': (1, -15, 's'),
    'step_snow': (5, -21, 's'), 'step_grass': (5, -22, 's'), 'step_stone': (5, -22, 's'), 'step_wood': (5, -21, 's'), 'step_sand': (5, -23, 's'),
    'ui_click': (3, -24, 's'), 'ui_open': (2, -21, 's'), 'ui_close': (2, -22, 's'), 'ui_tab': (3, -23, 's'), 'ui_equip': (4, -20, 's'),
    'ui_coin': (2, -20, 's'), 'ui_item': (2, -21, 's'), 'ui_rare': (1, -18, 's'), 'ui_error': (1, -22, 's'), 'ui_quest': (1, -17, 's'),
    'levelup': (1, -15, 's'), 'smith_hit': (3, -15, 's'), 'refine_ok': (1, -15, 's'), 'refine_fail': (1, -16, 's'), 'refine_break': (1, -14, 's'),
    'gem_socket': (2, -18, 's'), 'carve': (2, -16, 's'), 'extract': (1, -17, 's'), 'skill_learn': (1, -18, 's'), 'hatch': (1, -18, 's'),
    'tame': (1, -18, 's'), 'relic': (1, -14, 's'), 'warp': (1, -16, 's'), 'door': (2, -19, 's'), 'potion': (1, -19, 's'), 'sit': (2, -23, 's'),
    'amb_snow': (1, -24, 'a'), 'amb_forest': (1, -25, 'a'), 'amb_summer': (1, -26, 'a'), 'amb_night': (1, -27, 'a'), 'amb_desert': (1, -25, 'a'),
    'amb_jungle': (1, -26, 'a'), 'amb_town': (1, -26, 'a'), 'amb_cave': (1, -26, 'a'), 'amb_sea': (1, -24, 'a'), 'amb_volcano': (1, -25, 'a'),
    'amb_mystic': (1, -27, 'a'), 'amb_crypt': (1, -26, 'a'), 'amb_storm': (1, -24, 'a'), 'amb_forge': (1, -26, 'a'),
    **VSPEC,
}


def render(name, i):
    fn = globals()['r_' + name]
    out = fn(R(zlib.crc32(('%s:%d' % (name, i)).encode())), i)
    pk = 0.0
    if isinstance(out, tuple): out, pk = out
    return np.asarray(out, dtype=float), pk


def encode(y, path, stereo=False):
    raw = (np.clip(y, -1, 1) * 32767).astype('<i2').tobytes()
    br = '96k' if stereo else '80k'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2' if stereo else '1', '-i', '-', '-c:a', 'libmp3lame', '-b:a', br, path], input=raw, check=True)


def main():
    args = [a for a in sys.argv[1:] if '=' not in a]; opt = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
    only = set(args[0].split(',')) if args else None
    os.makedirs(OUT, exist_ok=True)
    lp = os.path.join(OUT, 'list.js')
    LIST = {}
    if os.path.exists(lp):
        try: LIST = json.loads(open(lp).read().split('=', 1)[1].rstrip(';\n'))
        except Exception: LIST = {}
    sheet = []
    wavdir = opt.get('wav')
    if wavdir: os.makedirs(wavdir, exist_ok=True)
    for name, (nv, tgt, kind) in SPEC.items():
        if only and name not in only: continue
        pks = []; durs = []
        for i in range(nv):
            y, pk = render(name, i)
            if kind == 'a':
                y = y / (np.abs(y).max() + 1e-9)
                y = master(y, tgt, .7)
            else:
                if y.ndim == 2: y = y.mean(1)
                y = master(y, tgt, .89)
            encode(y, os.path.join(OUT, '%s_%d.mp3' % (name, i + 1)), stereo=(y.ndim == 2))
            if wavdir:
                import wave
                with wave.open(os.path.join(wavdir, '%s_%d.wav' % (name, i + 1)), 'wb') as w:
                    yy = y if y.ndim == 2 else np.stack([y, y], 1)
                    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(yy, -1, 1) * 32767).astype('<i2').tobytes())
            pks.append(pk); durs.append(len(y) / SR)
            if i == 0: sheet.append((name, y))
        LIST[name] = [nv, round(float(np.mean(pks)), 3), round(float(np.mean(durs)), 2), 1 if kind == 'a' else 0]
        print('%-16s ×%d  %.2fs  pk %.3f' % (name, nv, np.mean(durs), np.mean(pks)), flush=True)
    open(lp, 'w').write('window.SFX_LIST=' + json.dumps(LIST, separators=(',', ':')) + ';\n')
    if opt.get('sheet') and sheet: spec_sheet(opt['sheet'], sheet)


def spec_sheet(path, items):
    from PIL import Image, ImageDraw, ImageFont
    import scipy.signal as ss2
    f = ImageFont.truetype('/usr/share/fonts/opentype/tlwg/Loma-Bold.otf', 15)
    tiles = []
    for name, y in items:
        m = y.mean(1) if y.ndim == 2 else y
        fr, tt, S = ss2.spectrogram(m, SR, nperseg=1024, noverlap=768)
        S = 10 * np.log10(S + 1e-12); S = np.clip((S - S.max() + 70) / 70, 0, 1)
        ly = np.exp(np.linspace(np.log(40), np.log(16000), 150))
        S = np.stack([np.interp(ly, fr, S[:, j]) for j in range(S.shape[1])], 1)
        im = Image.fromarray((S[::-1] ** 1.2 * 255).astype('uint8')).resize((300, 150))
        im = Image.merge('RGB', (im, im.point(lambda v: int(v * .7)), im.point(lambda v: int(min(255, v * 1.4)))))
        wf = Image.new('RGB', (300, 50), (15, 15, 20)); d = ImageDraw.Draw(wf)
        env = np.abs(m); step = max(1, len(env) // 300)
        for k in range(300):
            v = env[k * step:(k + 1) * step].max() if k * step < len(env) else 0
            d.line([(k, 25 - v * 24), (k, 25 + v * 24)], fill=(120, 220, 160))
        tile = Image.new('RGB', (300, 222), (0, 0, 0)); tile.paste(im, (0, 22)); tile.paste(wf, (0, 172))
        ImageDraw.Draw(tile).text((5, 3), '%s %.2fs' % (name, len(m) / SR), fill=(255, 255, 255), font=f)
        tiles.append(tile)
    cols = 6; rows = (len(tiles) + cols - 1) // cols
    sh = Image.new('RGB', (cols * 304, rows * 226), (40, 40, 40))
    for k, tl in enumerate(tiles): sh.paste(tl, ((k % cols) * 304, (k // cols) * 226))
    sh.save(path)


if __name__ == '__main__':
    main()
