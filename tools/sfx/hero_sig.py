"""Hero signature sounds (2026-11-28, owner '3' = the hero group of 'ควรมีเสียงเอฟเฟคอะไรอีก'). Imported by build_sfx.py.

sig_<hero> = the hero's own call, played by sfx.js when one of the hero's ultimates starts (and the drake's dragon
transform). Each is the hero's animal voice + one object of its kit, so every hero is recognisable by ear:
wolf howl + axe ring · jaguar sawing roar + gold bells · rhino snort-bellow + stomp + ice crack · axolotl bubbly rising
chime + water swirl · croc low rumble + jaw snap · cat katana unsheathe + temple bell · owl hoot + wing beat · hippo bellow
+ splash · sheep lyre arpeggio + bleat · dragon thunder + roar · lion roar · kitsune fox cry + shrine bells · bastet
sistrum + meow · anubis gong + jackal howl · raven caw caw + wings · wukong monkey screech + staff rings · drake dragon
roar + fire. Pure synthesis; I cannot listen, the owner judges."""
import numpy as np
from sfxlib import *
from voices import vox, fin, env, src, fmt, breath


def U(r, a, b): return r.uniform(a, b)
def pad(x, n): return np.pad(x, (0, max(0, n - len(x))))[:n]
def at(n, parts): return place(n, [(s * SR, y) for s, y in parts])
def bell(f, d, r, tau=.9, br=1.0):     # bronze bell partials (hum, prime, tierce, quint, nominal)
    return modal([f * .5, f, f * 1.19, f * 1.5, f * 2.0, f * 2.52], [.5, 1, .55, .35, .45, .25 * br],
                 [tau * 1.6, tau, tau * .8, tau * .6, tau * .5, tau * .35], d, r)
def gong(f, d, r):
    fs = [f * k for k in (1, 1.52, 2.03, 2.61, 3.17, 3.9, 4.7)]
    y = modal(fs, [1, .8, .6, .5, .35, .3, .2], [d * .7, d * .5, d * .4, d * .3, d * .25, d * .2, d * .15], d, r, .004)
    return y * (1 + .25 * np.sin(2 * np.pi * 3.2 * T(d)[:len(y)]))
def metal_ring(f, d, r):              # a blade / ring held ringing
    return modal([f, f * 2.76, f * 5.4, f * 8.9], [1, .6, .35, .2], [d * .6, d * .4, d * .25, d * .15], d, r)
def roar(d, f0, r, F=(330, 720, 1900), rough=.9, sub=.55, hi=1.35):
    x = vox(d, [(0, f0), (d * .3, f0 * hi), (d, f0 * .7)], list(F), r, .08, d * .45, d * .25, 1.1, rough, 26, sub, .6, (250, 2600), q=4)
    return sat(x, 2.6)
def thunder(d, r):
    t = T(d); b = filt(brown(len(t), r), 'lowpass', 300)
    c = crackles(d, lambda tt: 900 * np.exp(-tt / .08) + 30 * np.exp(-tt / .6), r, 1.0, 1500)
    return mix((1, b * (np.minimum(1, t / .02) * np.exp(-t / (d * .4)) + .3 * np.exp(-np.abs(t - .35) / .15))), (.6, c))
def splash(d, r, big=1.0):
    t = T(d); s = filt(nz(len(t), r), 'bandpass', [400, 5000]) * np.exp(-t / (.12 * big)) * att(t, .004)
    return mix((1, s), (.8, bubbles(d, lambda tt: 120 * np.exp(-tt / .3) + 8, 2, 7, r)), (.7, thump(min(d, .3), 140, 60, .03, .08, r)))
def wings(d, r, k=3, rate=.16):
    out = np.zeros(int(d * SR))
    for j in range(k):
        w, _ = whoosh(r, .2, 250, 1000, 350, .45, 1.0, .8, .2, 3500, shape=1.6)
        s = int(j * rate * SR); out[s:s + len(w)] += w[:max(0, len(out) - s)] * (1 - .15 * j)
    return out
def fire_whoosh(d, r):
    t = T(d); body = svf(pink(len(t), r), expseg([(0, 200), (d * .3, 1600), (d, 500)], d), 1.1, 'bp')
    body *= np.minimum(1, t / .1) * np.exp(-np.maximum(0, t - d * .3) / (d * .3))
    return mix((1, body), (.8, filt(brown(len(t), r), 'lowpass', 200) * env(d, .1, d * .2, d * .3)),
               (.5, crackles(d, lambda tt: 140 * np.exp(-tt / .5) + 15, r, .8, 1200, dur=(.002, .006))))


def r_sig_wolf(r, i):       # long howl rising then falling + the greataxe rings once
    d = 2.0; n = int(d * SR); f = U(r, 380, 430)
    h = vox(1.7, [(0, f * .75), (.35, f * 1.05), (1.0, f * 1.12), (1.7, f * .7)], [700, 1300, 2700], r, .18, .9, .45, 1.05, .08, 6, .05, .25, (600, 4000), q=5, jit=.006)
    h *= 1 + .03 * np.sin(2 * np.pi * 5.2 * T(1.7))
    ax = metal_ring(U(r, 860, 940), 1.4, r)
    return fin(at(n, [(0, 1.1 * h), (.05, .35 * ax)]), .3, 1.3, .9, 6000), .5
def r_sig_jaguar(r, i):     # jaguar 'sawing' coughs (uh-uh-uh) then a gold bell chime
    d = 1.6; n = int(d * SR); parts = []
    for k in range(5):
        c = vox(.17, [(0, 120 * U(r, .95, 1.05)), (.05, 150), (.17, 95)], [450, 1000, 2400], r, .015, .04, .06, 1.1, .7, 32, .4, .9, (300, 2500), q=4)
        parts.append((.0 + k * .19, sat(c, 2.4) * (1 - .08 * k)))
    parts.append((.98, .45 * bell(U(r, 1300, 1450), .6, r, .35)))
    parts.append((1.08, .3 * bell(U(r, 1750, 1900), .5, r, .3)))
    return fin(at(n, parts), .16, 1.0, .5), .0
def r_sig_rhino(r, i):      # double stomp, a snorting bellow, ice cracking under the weight
    d = 1.8; n = int(d * SR)
    st = thump(.4, 120, 40, .03, .12, r)
    snort = filt(nz(int(.25 * SR), r), 'bandpass', [300, 2000]) * env(.25, .02, .05, .1)
    bel = roar(1.0, U(r, 62, 72), r, (300, 650, 1700), .7, .6, 1.3)
    ice = crackles(.6, lambda tt: 1500 * np.exp(-tt / .1) + 40, r, 1.0, 2200, dur=(.0008, .003))
    return fin(at(n, [(0, 1.2 * st), (.22, 1.1 * st), (.35, .8 * snort), (.55, bel), (.25, .7 * ice)]), .22, 1.2, .7, 3800), .0
def r_sig_axolotl(r, i):    # water swirl + rising bubbly chime run
    d = 1.6; n = int(d * SR); t = T(d)
    sw = svf(nz(len(t), r), expseg([(0, 300), (1.0, 1400), (1.6, 900)], d), 3, 'bp') * env(d, .3, .6, .4) * .6
    parts = [(0, sw), (.05, .9 * bubbles(1.2, lambda tt: 70 + 40 * tt, 2, 6, r))]
    notes = [784, 988, 1175, 1319, 1568, 1976]
    for k, f in enumerate(notes):
        parts.append((.25 + k * .1, .4 * modal([f, f * 2.01, f * 3.03], [1, .3, .1], [.4, .2, .1], .6, r)))
    return fin(at(n, parts), .28, 1.2, .8, 9000), .2
def r_sig_croc(r, i):       # deep belly rumble (infrasound-ish) + a crushing jaw snap
    d = 1.6; n = int(d * SR)
    rum = vox(1.1, [(0, 45), (.5, 55), (1.1, 38)], [180, 420, 1100], r, .2, .5, .3, 1.3, 1.0, 20, .8, .5, (100, 900), q=3)
    snap = mix((1.2, thump(.25, 260, 80, .02, .06, r)), (.9, filt(nz(int(.05 * SR), r), 'highpass', 1500) * np.exp(-T(.05) / .008)),
               (.5, modal([900, 1700], [1, .5], [.03, .02], .1, r)))
    return fin(at(n, [(0, sat(rum, 2.5)), (1.05, snap)]), .2, 1.1, .6, 3500), 1.05
def r_sig_cat(r, i):        # katana slides out of the sheath (shing) + one temple bell
    d = 2.0; n = int(d * SR); t = T(.55)
    slide = svf(nz(len(t), r), expseg([(0, 2500), (.5, 6500)], .55), 7, 'bp') * env(.55, .05, .35, .1) * .7
    shing = metal_ring(U(r, 1900, 2100), 1.2, r)
    return fin(at(n, [(0, slide), (.5, .8 * shing), (.62, .7 * bell(U(r, 440, 470), 1.4, r, 1.1))]), .3, 1.4, .9, 7000), .5
def r_sig_owl(r, i):        # two soft hoots + wing beats
    d = 1.6; n = int(d * SR); parts = []
    for k, (s, f, dd) in enumerate([(0, 330, .3), (.45, 300, .55)]):
        h = vox(dd, [(0, f * 1.05), (dd * .3, f), (dd, f * .9)], [f * 1.1, f * 2.2], r, .05, dd * .4, .1, 2.5, 0, 30, 0, .15, (300, 1500), q=6, jit=.004)
        parts.append((s, h))
    parts.append((.95, .6 * wings(.6, r, 3)))
    return fin(at(n, parts), .3, 1.3, .9, 5000), .45
def r_sig_hippo(r, i):      # huge bellowing grunt + a heavy splash
    d = 1.6; n = int(d * SR)
    b = roar(.9, U(r, 75, 85), r, (380, 800, 1900), 1.0, .6, 1.25)
    return fin(at(n, [(0, b), (.75, .9 * splash(.8, r, 1.5))]), .2, 1.1, .6, 4000), .75
def r_sig_sheep(r, i):      # lyre arpeggio (A major) + a little bleat on top
    d = 1.8; n = int(d * SR); parts = []
    for k, f in enumerate([440, 554, 659, 880, 1109]):
        parts.append((k * .09, .55 * pluck(f, 1.2, r, .9985, .4)))
    bl = vox(.5, [(0, 520), (.1, 600), (.5, 480)], [900, 1800, 3000], r, .03, .15, .15, .8, .5, 22, 0, .3, (900, 4000), q=4, jit=.02)
    parts.append((.6, .7 * bl))
    return fin(at(n, parts), .28, 1.2, .8, 8000), .0
def r_sig_dragon(r, i):     # thunder roll + a long serpent roar with a whistling top
    d = 2.2; n = int(d * SR)
    th = thunder(1.6, r)
    ro = roar(1.4, U(r, 110, 125), r, (500, 1100, 2600), .6, .3, 1.5)
    wh = vox(1.0, [(0, 900), (.5, 1300), (1.0, 800)], [1300, 2700], r, .1, .5, .3, 1.5, .1, 8, 0, .3, (900, 5000), q=6)
    return fin(at(n, [(0, th), (.25, ro), (.45, .3 * wh)]), .25, 1.3, .9, 5000), .3
def r_sig_lion(r, i):       # the big lion roar, then two grunts
    d = 2.0; n = int(d * SR)
    ro = roar(1.2, U(r, 85, 95), r, (350, 800, 2000), 1.0, .6, 1.45)
    g1 = roar(.25, 80, r, (380, 800, 1900), .8, .5, 1.2); g2 = roar(.22, 72, r, (380, 800, 1900), .8, .5, 1.2)
    return fin(at(n, [(0, ro), (1.3, .6 * g1), (1.6, .5 * g2)]), .22, 1.2, .8, 4000), .3
def r_sig_kitsune(r, i):    # fox's eerie high cry + shrine bell tree
    d = 1.9; n = int(d * SR)
    cry = vox(.7, [(0, 900), (.1, 1400), (.4, 1500), (.7, 900)], [1500, 3000], r, .02, .3, .2, .7, .2, 60, 0, .5, (1200, 6000), q=4, jit=.03)
    parts = [(0, cry)]
    for k in range(7):
        f = U(r, 2600, 4200); parts.append((.45 + k * .07, .25 * modal([f, f * 1.5, f * 2.7], [1, .4, .2], [.25, .15, .08], .4, r)))
    parts.append((.55, .4 * bell(U(r, 700, 760), 1.2, r, .9)))
    return fin(at(n, parts), .3, 1.3, .9, 9000), .15
def r_sig_bastet(r, i):     # sistrum shake (metal discs on rods) + a long meow
    d = 1.8; n = int(d * SR); parts = []
    for k in range(6):
        g = grains(.18, lambda tt: 400 * np.exp(-tt / .04), 3500, 9000, r, (.01, .05), .8, inharm=(1.6, 2.4))
        parts.append((k * .1, g * (1 - .08 * k)))
    mw = vox(.8, [(0, 500), (.15, 700), (.5, 650), (.8, 420)], [900, 1600, 3200], r, .05, .35, .3, .9, .05, 20, 0, .25, (700, 4000), q=5)
    parts.append((.65, .9 * mw))
    return fin(at(n, parts), .24, 1.1, .7, 8000), .0
def r_sig_anubis(r, i):     # temple gong + jackal howl over it
    d = 2.4; n = int(d * SR)
    g = gong(U(r, 120, 135), 2.2, r)
    h = vox(1.3, [(0, 470), (.3, 640), (.9, 660), (1.3, 420)], [800, 1500, 3000], r, .12, .6, .35, 1.0, .1, 7, 0, .3, (700, 4500), q=5, jit=.01)
    return fin(at(n, [(0, .9 * g), (.35, .9 * h)]), .3, 1.4, 1.0, 5000), .0
def r_sig_raven(r, i):      # three harsh caws + wing flap
    d = 1.4; n = int(d * SR); parts = []
    for k in range(3):
        f = U(r, 600, 720) * (1 - .05 * k)
        c = vox(.24, [(0, f), (.04, f * 1.15), (.24, f * .75)], [f * 1.4, f * 2.6, f * 4.2], r, .008, .07, .06, .5, .7, 110, .2, .8, (1000, 6000), q=3, jit=.04)
        parts.append((k * .3, sat(c, 2.0)))
    parts.append((.85, .6 * wings(.5, r, 2, .18)))
    return fin(at(n, parts), .22, 1.2, .7, 7000), .0
def r_sig_wukong(r, i):     # monkey screech-chatter + the iron rings of the staff shaken
    d = 1.6; n = int(d * SR); parts = []
    for k in range(5):
        f = U(r, 900, 1300) * (1.15 if k == 2 else 1)
        c = vox(.14, [(0, f), (.03, f * 1.3), (.14, f * .8)], [f * 1.2, f * 2.4], r, .005, .04, .05, .6, .3, 70, 0, .6, (1000, 6000), q=3, jit=.05)
        parts.append((k * .12, c))
    for k in range(4):
        parts.append((.65 + k * .06, .35 * metal_ring(U(r, 1500, 2300), .5, r)))
    return fin(at(n, parts), .2, 1.0, .6, 8000), .0
def r_sig_drake(r, i):      # dragon roar from deep in the chest + a burst of fire
    d = 2.0; n = int(d * SR)
    ro = roar(1.4, U(r, 60, 68), r, (300, 700, 1800), 1.0, .7, 1.5)
    return fin(at(n, [(0, ro), (.35, .8 * fire_whoosh(1.3, r))]), .22, 1.2, .8, 4000), .4


SIGSPEC = {'sig_' + h: (2, -16, 's') for h in ('wolf', 'jaguar', 'rhino', 'axolotl', 'croc', 'cat', 'owl', 'hippo', 'sheep',
                                                  'dragon', 'lion', 'kitsune', 'bastet', 'anubis', 'raven', 'wukong', 'drake')}
