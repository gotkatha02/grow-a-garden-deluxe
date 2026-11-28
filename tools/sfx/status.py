"""Combat status sounds (2026-11-28, owner '2' = the status group of 'ควรมีเสียงเอฟเฟคอะไรอีก'). Imported by build_sfx.py.

st_miss (our hit missed) · st_dodge (we dodged) · st_stun (bonk + spinning chimes) · st_freeze (ice crust forming) ·
st_burn (fire catches) · st_poison (bubbling gurgle) · st_bleed (wet cut + drips) · st_slow (sinking wobble) ·
st_root (wood creak + snap shut) · st_armor (armour plate cracks) · st_curse (dark sinking two-note: weaken / SP drain) ·
st_shield (a shield shatters like glass) · st_interrupt (a cast is cut off) · st_heart (lub-dub, low HP).
Pure synthesis on sfxlib pieces; sfx.js decides when each plays."""
import numpy as np
from sfxlib import *
from voices import env


def U(r, a, b): return r.uniform(a, b)
def fx(x, wet=.12, size=.8, tail=.35, damp=6000): return room(edge(fadeout(x, .3)), wet, size, damp, tail)
def tone(d, f, tau, r, h=(1, .35, .15), att_s=.002):
    t = T(d); ff = expseg(f, d) if isinstance(f, list) else np.full(len(t), float(f))
    ph = 2 * np.pi * np.cumsum(ff) / SR
    y = sum(a * np.sin((k + 1) * ph + r.uniform(0, 6.28)) for k, a in enumerate(h))
    return y * np.exp(-t / tau) * att(t, att_s)


def r_st_miss(r, i):        # thin fast swish through empty air, no contact
    w, pk = whoosh(r, .24 * U(r, .9, 1.1), 1200, 3800 * U(r, .9, 1.1), 2000, peak=.5, q=2.0, low=.08, air=.7, lp=9000)
    return fx(w * .9, .08), pk
def r_st_dodge(r, i):       # two quick body swishes + a cloth flap + a light foot scuff
    d = .42; n = int(d * SR)
    a, _ = whoosh(r, .2, 500, 1700, 900, peak=.55, q=1.2, low=.5, air=.3)
    b, _ = whoosh(r, .18, 700, 2400, 1200, peak=.5, q=1.4, low=.3, air=.5)
    flap = filt(nz(int(.06 * SR), r), 'bandpass', [900, 4000]) * np.exp(-T(.06) / .015)
    scuff = filt(nz(int(.1 * SR), r), 'bandpass', [1500, 6000]) * np.exp(-T(.1) / .03)
    return fx(place(n, [(0, a), (.12 * SR, .8 * b), (.05 * SR, .4 * flap), (.25 * SR, .35 * scuff)]), .1), .08
def r_st_stun(r, i):        # bonk, then little chimes circling the head
    d = 1.1; n = int(d * SR)
    bonk = thump(.25, 520, 170, .03, .07, r) + .4 * modal([780, 1490, 2300], [1, .4, .2], [.05, .03, .02], .25, r)
    notes = [1568, 2093, 1760, 2349, 1568, 2093] if i % 2 == 0 else [1760, 2349, 1976, 2637, 1760, 2349]
    parts = [(0, 1.1 * bonk)]
    for k, f in enumerate(notes):
        t0 = .12 + k * .13; c = tone(.35, f * U(r, .99, 1.01), .09, r, (1, .25, .1))
        parts.append((t0 * SR, (.55 - .05 * k) * c))
    y = place(n, parts)
    y *= 1 + .35 * np.sin(2 * np.pi * 7 * T(d)[:n])      # wobble = going round the head
    return fx(y, .2, .9, .5), .0
def r_st_freeze(r, i):      # cold air puff, then the ice crust creaks and crackles into place
    d = .8; t = T(d)
    puff = filt(pink(len(t), r), 'bandpass', [300, 2500]) * np.exp(-t / .12) * att(t, .01)
    crk = crackles(d, lambda tt: 900 * np.exp(-tt / .25) + 40, r, 1.0, 2500, dur=(.0008, .003))
    gl = grains(d, lambda tt: 90 * np.exp(-tt / .3) + 6, 2500, 7500, r, (.006, .03), .6)
    groan = tone(d, [(0, 1100), (.6, 700)], .2, r, (1, .5, .3)) * .12
    return fx(mix((.7, puff), (1, crk), (.8, gl), (1, groan)), .22, 1.0, .6, 9000), .02
def r_st_burn(r, i):        # 'fwoomph' as it catches fire + a few pops
    d = .75; t = T(d)
    body = svf(pink(len(t), r), expseg([(0, 250), (.15, 1400), (.75, 600)], d), 1.2, 'bp')
    body *= np.minimum(1, t / .06) * np.exp(-np.maximum(0, t - .08) / .2)
    low = filt(brown(len(t), r), 'lowpass', 220) * np.exp(-t / .2) * att(t, .02)
    pops = crackles(d, lambda tt: 160 * np.exp(-tt / .3) + 10, r, .9, 1200, dur=(.002, .006))
    return fx(sat(mix((1, body), (.8, low), (.7, pops)), 1.6), .12), .08
def r_st_poison(r, i):      # thick bubbling + a sour hiss
    d = .75; t = T(d)
    bub = bubbles(d, lambda tt: 60 * np.exp(-tt / .35) + 6, 3, 9, r, 1.0)
    gl = svf(nz(len(t), r), expseg([(0, 180), (.3, 420), (.75, 220)], d), 5, 'bp') * np.exp(-t / .25) * att(t, .03)
    hiss = filt(nz(len(t), r), 'highpass', 3500) * np.exp(-np.maximum(0, t - .1) / .2) * att(t, .08) * .25
    return fx(mix((1, bub), (.8, gl), (1, hiss)), .1), .05
def r_st_bleed(r, i):       # wet cut + a couple of drops falling
    d = .8; n = int(d * SR)
    sq = filt(nz(int(.09 * SR), r), 'bandpass', [600, 2600]) * np.exp(-T(.09) / .025)
    sq2 = svf(nz(int(.12 * SR), r), expseg([(0, 1800), (.12, 500)], .12), 4, 'bp') * np.exp(-T(.12) / .04)
    parts = [(0, sq), (.01 * SR, .8 * sq2)]
    for k in range(2 + i % 2):
        parts.append(((.28 + .18 * k + U(r, 0, .05)) * SR, .7 * bubble(U(r, 3.5, 6), r, 1, .3)))
    return fx(place(n, parts), .12), .02
def r_st_slow(r, i):        # soft sinking 'bwoww' that wobbles like moving through syrup
    d = .8; t = T(d)
    f = expseg([(0, 520), (.8, 150)], d) * (1 + .04 * np.sin(2 * np.pi * 9 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = (np.sin(ph) + .4 * np.sin(2 * ph) + .2 * np.sin(3 * ph)) * env(d, .03, .2, .3)
    goo = svf(nz(len(t), r), f * 2, 6, 'bp') * env(d, .05, .2, .25) * .5
    return fx(mix((1, y), (1, goo)), .2, 1, .5), .05
def r_st_root(r, i):        # roots / chains grab: woody creak rising, then it snaps shut
    d = .6; n = int(d * SR)
    creak = grains(.4, lambda tt: 120 + 300 * tt, 150, 600, r, (.004, .012), 1.0, inharm=(2.1, 3.3))
    creak = filt(creak, 'bandpass', [150, 2500])
    snap = thump(.2, 300, 90, .02, .06, r) + filt(nz(int(.2 * SR), r), 'bandpass', [800, 3500]) * np.exp(-T(.2) / .02) * .6
    return fx(place(n, [(0, .8 * creak), (.36 * SR, 1.1 * snap)]), .12), .36
def r_st_armor(r, i):       # a metal plate cracks: clank + splitting crackle + falling ring
    d = .7
    clank = modal([420, 1130, 1870, 2950, 4100], [1, .7, .5, .35, .2], [.12, .08, .06, .04, .03], d, r)
    crk = crackles(.3, lambda tt: 700 * np.exp(-tt / .06), r, 1.0, 2000, dur=(.001, .004))
    fall = tone(d, [(0, 1500), (.7, 900)], .18, r, (1, .5, .2)) * .25
    return fx(mix((1, clank), (.8, np.pad(crk, (0, int(d * SR) - len(crk)))), (1, fall)), .15, .9), .0
def r_st_curse(r, i):       # dark two-note sink (minor second) through a breath of shadow
    d = .9; t = T(d)
    a = tone(d, [(0, 330), (.9, 300)], .35, r, (1, .5, .3, .2)) * env(d, .02, .05, .4)
    b = np.pad(tone(.65, [(0, 311), (.65, 262)], .3, r, (1, .5, .3, .2)), (int(.2 * SR), 0))[:len(t)]
    br = filt(nz(len(t), r), 'bandpass', [200, 1200]) * env(d, .15, .2, .3) * .35
    return fx(mix((.8, a), (1, b), (1, br)), .3, 1.1, .7, 3500), .02
def r_st_shield(r, i):      # a shield breaks like glass: thud + burst of shards + tinkles settling
    d = 1.0; t = T(d)
    thd = thump(.3, 180, 70, .03, .09, r)
    burst = grains(d, lambda tt: 1400 * np.exp(-tt / .05) + 25 * np.exp(-tt / .4), 2200, 9000, r, (.004, .03), 1.0)
    crk = crackles(.2, lambda tt: 2500 * np.exp(-tt / .03), r, 1.2, 2500)
    return fx(mix((1, np.pad(thd, (0, len(t) - len(thd)))), (1, burst), (.8, np.pad(crk, (0, len(t) - len(crk))))), .2, 1.0, .5, 10000), .0
def r_st_interrupt(r, i):   # a spell cut off: rising hum chopped by a downward zip + click
    d = .45; n = int(d * SR)
    hum = tone(.2, [(0, 500), (.2, 900)], 1, r, (1, .5, .3)) * env(.2, .03, .17, .01)
    zip_ = tone(.15, [(0, 1800), (.15, 220)], .06, r, (1, .4))
    clk = modal([2600, 4300], [1, .5], [.008, .005], .05, r)
    return fx(place(n, [(0, .7 * hum), (.19 * SR, zip_), (.19 * SR, .6 * clk)]), .1), .19
def r_st_heart(r, i):       # lub-dub
    d = .55; n = int(d * SR)
    lub = thump(.3, 70, 42, .03, .06, r); dub = thump(.3, 80, 48, .03, .05, r)
    y = place(n, [(0, lub), (.2 * SR, .75 * dub)])
    return edge(fadeout(filt(y, 'lowpass', 400), .5), r=.05), .0


STSPEC = {'st_miss': (3, -22, 's'), 'st_dodge': (2, -21, 's'), 'st_stun': (2, -20, 's'), 'st_freeze': (2, -20, 's'),
          'st_burn': (2, -20, 's'), 'st_poison': (2, -21, 's'), 'st_bleed': (2, -21, 's'), 'st_slow': (2, -23, 's'),
          'st_root': (2, -21, 's'), 'st_armor': (2, -20, 's'), 'st_curse': (2, -20, 's'), 'st_shield': (2, -17, 's'),
          'st_interrupt': (2, -20, 's'), 'st_heart': (2, -20, 's')}
