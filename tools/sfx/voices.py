"""Monster voices (2026-11-28, owner '1' = the monster group of 'ควรมีเสียงเอฟเฟคอะไรอีก'). Imported by build_sfx.py.

Every monster family gets three calls: mv_<fam>_ag (it notices the hero), mv_<fam>_at (it attacks), mv_<fam>_hu (it is hit;
also played lower when it dies) + boss_roar / boss_step. Source-filter voices: a glottal source (harmonics with a spectral
tilt, jitter, roughness = amplitude modulation + a subharmonic for growls) through formant band-passes, plus breath noise;
non-vocal families are physical (bone clacks = modal grains, insects = clicks + buzzing wings, slime = Minnaert bubbles +
a wet low resonance, golems = gravel grind + stone thumps). Pure synthesis, no recordings. The engine (sfx.js) picks the
family from the monster's name and plays it faster / slower by the monster's size."""
import numpy as np
from sfxlib import *


# ---------- voice pieces ----------
def src(f0, r, tilt=1.0, jit=.012, nh=48, rough=0.0, rf=30.0, sub=0.0):
    """glottal-ish source: f0 = Hz per sample. rough = AM depth at rf Hz (growl), sub = f0/2 subharmonic level"""
    n = len(f0)
    j = 1 + jit * filt(nz(n, r), 'lowpass', 40) / .25
    ph = 2 * np.pi * np.cumsum(f0 * j) / SR
    y = np.zeros(n)
    for k in range(1, nh + 1):
        m = (f0 * k < SR * .42)
        if not m.any(): break
        y += np.sin(k * ph + r.uniform(0, 6.283)) / k ** tilt * m
    if sub: y += sub * np.sin(ph * .5) * (1 + .5 * np.sin(ph * 1.5))
    if rough:
        am = 1 + rough * np.sin(2 * np.pi * np.cumsum(rf * (1 + .25 * filt(nz(n, r), 'lowpass', 8) / .25)) / SR)
        y *= np.abs(am)
    return y


def fmt(x, F, A=None, q=5.0):
    """parallel formant band-passes (static); F = Hz list, A = gains"""
    A = A or [1, .7, .4, .25][:len(F)]
    y = np.zeros(len(x))
    for f, a in zip(F, A):
        bw = max(60, f / q)
        y += a * filt(x, 'bandpass', [max(30, f - bw / 2), min(SR * .45, f + bw / 2)])
    return y


def env(d, a, hold, rel, shape=1.0):
    t = T(d); e = np.minimum(1, t / max(1e-4, a)) ** shape
    return e * np.where(t < a + hold, 1, np.exp(-(t - a - hold) / max(1e-4, rel)))


def breath(n, r, lo, hi):
    return filt(nz(n, r), 'bandpass', [lo, hi])


def vox(d, f0pts, F, r, a=.03, hold=.1, rel=.08, tilt=1.0, rough=0.0, rf=30, sub=0.0, br=.25, brb=(400, 3000), A=None, q=5.0, jit=.012):
    f0 = expseg(f0pts, d)
    x = fmt(src(f0, r, tilt, jit, rough=rough, rf=rf, sub=sub), F, A, q)
    x = x / (np.abs(x).max() + 1e-9) + br * breath(len(f0), r, *brb) / 3
    return fadeout(x * env(d, a, hold, rel), .3)


def fin(x, wet=.12, size=.8, tail=.35, damp=5000):
    return room(edge(fadeout(x, .3)), wet, size, damp, tail)


def U(r, a, b): return r.uniform(a, b)


# ---------- beast: wolves, hounds, jackals, foxes, small cats ----------
def r_mv_beast_ag(r, i):   # low growl rising into a snarl
    d = .9; x = vox(d, [(0, 95 * U(r, .9, 1.1)), (.5, 120), (.9, 85)], [420, 900, 2300], r, .12, .45, .2, 1.1, .8, 34, .35, .5, (500, 3500))
    return fin(sat(x, 2.2))
def r_mv_beast_at(r, i):   # bark / snap
    d = .32; f = U(r, 300, 380)
    x = vox(d, [(0, f * .8), (.05, f * 1.15), (.32, f * .6)], [650, 1250, 2800], r, .008, .03, .06, .9, .35, 45, .15, .45, (700, 4000))
    snap = filt(nz(int(.03 * SR), r), 'highpass', 2000) * np.exp(-T(.03) / .006)
    return fin(sat(mix((1, x), (.4, snap, .06)), 1.8), .1)
def r_mv_beast_hu(r, i):   # yelp
    d = .3; f = U(r, 650, 820)
    x = vox(d, [(0, f), (.06, f * 1.25), (.3, f * .55)], [800, 1600, 3100], r, .006, .05, .07, .8, 0, 30, 0, .3, (900, 5000))
    return fin(x, .1)


# ---------- big: bears, yetis, bulls, boars, rams, horses, giants, big cats ----------
def r_mv_big_ag(r, i):     # deep roar
    d = 1.2; x = vox(d, [(0, 70 * U(r, .9, 1.1)), (.35, 105), (1.2, 62)], [330, 720, 1900], r, .1, .55, .3, 1.15, .9, 26, .55, .6, (250, 2400), q=4)
    return fin(sat(x, 2.6), .16, 1.0, .5, 3800)
def r_mv_big_at(r, i):     # huff + grunt of effort
    d = .45; x = vox(d, [(0, 90), (.08, 125 * U(r, .9, 1.1)), (.45, 70)], [380, 820, 2000], r, .015, .06, .12, 1.1, .6, 30, .4, .9, (300, 2600), q=4)
    return fin(sat(x, 2.4), .12, .9, .3, 4000)
def r_mv_big_hu(r, i):     # pained bellow
    d = .5; x = vox(d, [(0, 150 * U(r, .9, 1.1)), (.1, 175), (.5, 95)], [450, 950, 2200], r, .01, .1, .15, 1.0, .5, 28, .3, .5, (400, 3000))
    return fin(sat(x, 2.0), .14, .9, .35, 4200)


# ---------- bird: hawks, crows, vultures, harpies, griffins, tengu ----------
def r_mv_bird_ag(r, i):    # screech: falling noisy cry
    d = .6; f = U(r, 1800, 2400)
    x = vox(d, [(0, f * 1.1), (.08, f * 1.25), (.6, f * .6)], [f * 1.2, f * 2.3], r, .01, .15, .2, .6, .35, 70, 0, .9, (1500, 7000), q=3, jit=.04)
    return fin(x, .14, .9, .4, 8000)
def r_mv_bird_at(r, i):    # short shriek + wing flap
    d = .38; f = U(r, 2000, 2600)
    x = vox(d, [(0, f), (.05, f * 1.2), (.25, f * .8)], [f * 1.2, f * 2.2], r, .006, .06, .07, .6, .3, 80, 0, .8, (1500, 7000), q=3, jit=.04)
    fl, _ = whoosh(r, .28, 300, 1200, 400, .45, 1.0, .8, .2, 4000, shape=1.6)
    return fin(mix((1, x), (.7, fl, .02)), .1)
def r_mv_bird_hu(r, i):    # squawk
    d = .2; f = U(r, 1100, 1500)
    x = vox(d, [(0, f), (.03, f * 1.4), (.2, f * .7)], [f * 1.3, f * 2.6], r, .004, .03, .05, .5, .5, 90, 0, .7, (1200, 6000), q=3, jit=.05)
    return fin(x, .08)


# ---------- bat ----------
def chirps(d, r, k, lo, hi, dur=(.012, .03)):
    n = int(d * SR); parts = []
    for j in range(k):
        L = U(r, *dur); t = T(L); f = np.linspace(U(r, hi * .9, hi), U(r, lo, lo * 1.2), len(t))
        parts.append((U(r, 0, d - L) * SR, sweep(f) * np.sin(np.pi * t / L) ** 2 * U(r, .5, 1)))
    return place(n, parts)
def r_mv_bat_ag(r, i): return fin(chirps(.45, r, 7, 3500, 7500) + .3 * filt(nz(int(.45 * SR), r), 'bandpass', [400, 1500]) * env(.45, .05, .2, .1), .08)
def r_mv_bat_at(r, i):
    fl, _ = whoosh(r, .25, 400, 1600, 500, .4, 1.0, .9, .2, 4500, shape=1.4)
    return fin(mix((1, chirps(.25, r, 4, 4000, 8000)), (.8, fl)), .06)
def r_mv_bat_hu(r, i): return fin(chirps(.18, r, 3, 2500, 5500, (.03, .05)), .06)


# ---------- insect: spiders, scorpions, beetles, scarabs, bees, worms, crabs ----------
def clicks(d, r, rate, hp=1800, amp=1.0):
    return crackles(d, rate, r, amp, hp, dur=(.0006, .0018))
def buzz(d, f, r, am=0.0):
    t = T(d); x = src(np.full(len(t), f) * (1 + .03 * np.sin(2 * np.pi * 7 * t)), r, .6, .02, 60)
    return fmt(x, [f * 4, f * 9], [1, .6], 3) * (1 + am * np.sin(2 * np.pi * 23 * t))
def r_mv_insect_ag(r, i):  # chittering mandibles
    d = .6; x = clicks(d, r, lambda t: 120 + 200 * np.sin(np.pi * t / d), 1600) * env(d, .05, .35, .15)
    return fin(x + .25 * buzz(d, 180, r, .5) * env(d, .1, .2, .2), .08)
def r_mv_insect_at(r, i):  # hiss-click lunge
    d = .35; t = T(d)
    hs = filt(nz(len(t), r), 'highpass', 3500) * env(d, .02, .08, .1) * .6
    return fin(mix((1, clicks(d, r, 400, 1400)), (1, hs), (.5, buzz(d, 210, r, .7) * env(d, .01, .1, .1))), .06)
def r_mv_insect_hu(r, i):  # crack of the shell + shrill squeal
    d = .25; t = T(d); f = U(r, 1600, 2200)
    sq = sweep(np.linspace(f, f * .7, len(t))) * env(d, .005, .05, .06) * .45
    sh = modal([1300, 2900, 4700], [1, .5, .3], [.015, .01, .006], d, r)
    return fin(mix((1, sh), (1, sq), (.6, clicks(d, r, 300))), .06)


# ---------- reptile: serpents, cobras, crocodiles, lizards, wyrms ----------
def hiss(d, r, lo=2500, hi=9000):
    return filt(nz(int(d * SR), r), 'bandpass', [lo, hi])
def r_mv_reptile_ag(r, i):  # long hiss with a rattle of breath
    d = .9; x = hiss(d, r) * env(d, .15, .4, .3) * (1 + .3 * np.sin(2 * np.pi * 9 * T(d)))
    return fin(x, .1, .8, .3, 9000)
def r_mv_reptile_at(r, i):  # sharp hiss + low throat rumble (crocs)
    d = .4; t = T(d)
    rum = vox(d, [(0, 55), (.4, 45)], [250, 600], r, .02, .1, .12, 1.3, .7, 18, .5, .2, (200, 900))
    return fin(mix((1, hiss(d, r, 2000, 8000) * env(d, .01, .1, .12)), (.6, rum)), .08)
def r_mv_reptile_hu(r, i):
    d = .28; return fin(hiss(d, r, 1800, 7000) * env(d, .004, .03, .08) + .5 * thump(d, 140, 60, .02, .06, r), .06)


# ---------- slime / frogs / toads / octopus / kappa: wet ----------
def r_mv_slime_ag(r, i):    # gurgle (frogs: a croak)
    d = .55; t = T(d)
    cr = vox(d, [(0, 120), (.55, 95)], [500, 1400], r, .02, .25, .1, .8, .9, 14, 0, .1, (400, 2000)) * .7
    return fin(mix((1, bubbles(d, 50, 3, 9, r)), (1, cr)), .1)
def r_mv_slime_at(r, i):    # squelch: low resonant sweep through wet noise
    d = .32; t = T(d); n = len(t)
    sq = svf(nz(n, r), 1400 * np.exp(-t / .08) + 220, 6, 'bp') * env(d, .01, .05, .1)
    return fin(mix((1, sq), (.6, bubbles(d, 80, 2, 6, r))), .08)
def r_mv_slime_hu(r, i):
    d = .28; t = T(d); n = len(t)
    sp = svf(nz(n, r), 700 + 1800 * t / d, 5, 'bp') * env(d, .004, .03, .08)
    return fin(mix((1, sp), (.8, bubbles(d, 120, 1.5, 5, r))), .06)


# ---------- critter: rats, hares, monkeys, pandas, axolotls, goats(small) ----------
def r_mv_critter_ag(r, i):  # chatter
    d = .5; n = int(d * SR); parts = []
    for j in range(5):
        f = U(r, 1500, 2300); L = .05
        parts.append((j * .085 * SR, vox(L, [(0, f), (.02, f * 1.2), (L, f * .9)], [f, f * 2], r, .003, .02, .015, .6, 0, 30, 0, .3, (1500, 6000), q=3)))
    return fin(place(n, parts), .06)
def r_mv_critter_at(r, i):
    d = .18; f = U(r, 1800, 2500)
    return fin(vox(d, [(0, f), (.03, f * 1.3), (d, f * .8)], [f, f * 2.2], r, .003, .03, .04, .6, .2, 60, 0, .4, (1500, 6000), q=3), .06)
def r_mv_critter_hu(r, i):  # squeal
    d = .25; f = U(r, 2200, 2800)
    return fin(vox(d, [(0, f), (.04, f * 1.2), (d, f * .65)], [f, f * 2], r, .003, .04, .06, .55, 0, 30, 0, .25, (2000, 7000), q=3), .06)


# ---------- undead: skeletons, draugr, mummies, rusted soldiers ----------
def bones(d, r, rate, amp=1.0):
    return grains(d, rate, 700, 2400, r, (.004, .012), amp, inharm=(2.1, 3.6))
def r_mv_undead_ag(r, i):   # rattle + hollow moan
    d = 1.0; t = T(d)
    moan = vox(d, [(0, 95), (.5, 110), (1.0, 80)], [380, 800, 2400], r, .2, .4, .3, 1.3, .3, 6, 0, 1.4, (250, 1800), q=4, jit=.03)
    return fin(mix((.8, moan), (.9, bones(d, r, lambda tt: 30 * np.exp(-tt / .4) + 6))), .25, 1.2, .6, 3500)
def r_mv_undead_at(r, i):   # clack + rasp exhale
    d = .4; t = T(d)
    rasp = breath(len(t), r, 600, 3200) * env(d, .02, .1, .12) * .5
    return fin(mix((1, bones(d, r, 90)), (1, rasp)), .15, 1.0, .35, 4000)
def r_mv_undead_hu(r, i):   # bones knocked loose
    d = .4; return fin(bones(d, r, lambda tt: 160 * np.exp(-tt / .08) + 4, 1.2) + .4 * thump(d, 200, 90, .02, .05, r), .15)


# ---------- ghost: ghosts, spirits, wraiths, yurei, sirens, djinn ----------
def r_mv_ghost_ag(r, i):    # rising-falling wail with slow vibrato
    d = 1.4; t = T(d); f0 = expseg([(0, 280), (.6, 520 * U(r, .9, 1.1)), (1.4, 300)], d) * (1 + .03 * np.sin(2 * np.pi * 5 * t))
    x = fmt(src(f0, r, 2.2, .005, 12), [600, 1100], [1, .4], 3) + .4 * breath(len(t), r, 800, 4000) / 3
    x = x / (np.abs(x).max() + 1e-9) * env(d, .35, .5, .4)
    return room(edge(x), .5, 1.6, 3500, 1.2, .84)
def r_mv_ghost_at(r, i):    # whoosh through + hiss whisper
    d = .5; t = T(d)
    w, _ = whoosh(r, d, 300, 2200, 600, .55, 1.6, .5, .5, 6000)
    wh = breath(len(t), r, 2500, 7000) * env(d, .05, .1, .2) * .3
    return room(edge(mix((1, w), (1, wh))), .4, 1.3, 4000, .8)
def r_mv_ghost_hu(r, i):    # shriek that breaks up
    d = .45; t = T(d); f0 = expseg([(0, 700), (.06, 900), (.45, 450)], d)
    x = fmt(src(f0, r, 1.6, .03, 20, rough=.5, rf=55), [900, 1800], [1, .5], 3)
    x = x / (np.abs(x).max() + 1e-9) * env(d, .01, .08, .12)
    return room(edge(x), .4, 1.3, 4000, .7)


# ---------- wisp: wisps, sprites, petals, olive / water sprites ----------
def r_mv_wisp_ag(r, i):     # twinkling chime rise
    d = .7; return room(edge(grains(d, lambda tt: 40 * np.sin(np.pi * tt / d) + 4, 2200, 7000, r, (.02, .06), 1.0)), .35, 1.2, 9000, .7)
def r_mv_wisp_at(r, i):
    d = .35; t = T(d); w = svf(nz(len(t), r), 1500 + 5000 * t / d, 4, 'bp') * env(d, .05, .1, .1)
    return room(edge(mix((.6, w), (1, grains(d, 60, 3000, 8000, r, (.01, .03))))), .3, 1.0, 9000, .5)
def r_mv_wisp_hu(r, i):
    d = .3; return room(edge(grains(d, lambda tt: 200 * np.exp(-tt / .05) + 2, 1500, 5000, r, (.01, .04))), .3, 1.0, 9000, .5)


# ---------- golem: golems, statues, constructs, traps, dolls ----------
def gravel(d, r, rate, amp=1.0):
    return crackles(d, rate, r, amp, 300, dur=(.002, .008))
def r_mv_golem_ag(r, i):    # stone grinding awake + deep hum
    d = 1.0; t = T(d); n = len(t)
    gr = filt(brown(n, r), 'lowpass', 400) * env(d, .2, .5, .3) * .6
    hum = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((55, 1), (82, .5), (110, .3))) * env(d, .3, .4, .3) * .5
    return fin(mix((1, gr), (1, gravel(d, r, lambda tt: 160 * np.sin(np.pi * tt / d) + 10)), (1, hum)), .15, 1.0, .4, 3000)
def r_mv_golem_at(r, i):    # heavy creak + clunk
    d = .5; t = T(d)
    cr = svf(nz(len(t), r), 300 + 600 * t / d, 8, 'bp') * env(d, .05, .15, .1) * .5
    return fin(mix((1, cr), (1, gravel(d, r, 90)), (1.1, thump(d, 120, 45, .03, .1, r), .25)), .12, .9, .35, 3500)
def r_mv_golem_hu(r, i):    # chip of stone breaking off
    d = .35; s = modal([620, 1500, 2700], [1, .5, .25], [.03, .015, .008], d, r)
    return fin(mix((1, s), (1, gravel(d, r, lambda tt: 300 * np.exp(-tt / .06) + 5, 1.2))), .1)


# ---------- humanoid: soldiers, priests, ninjas, warriors, pirates, satyrs, centaurs ----------
def r_mv_human_ag(r, i):    # 'Hah!' / shout
    d = .45; f = U(r, 140, 175)
    x = vox(d, [(0, f), (.08, f * 1.35), (.45, f * .9)], [720, 1200, 2600], r, .02, .15, .1, 1.0, .1, 30, 0, .4, (600, 3500), A=[1, .8, .3])
    return fin(sat(x, 1.6), .12)
def r_mv_human_at(r, i):    # effort grunt 'hup' + small swing
    d = .3; f = U(r, 130, 160)
    x = vox(d, [(0, f), (.05, f * 1.25), (.3, f * .8)], [550, 1000, 2500], r, .008, .05, .07, 1.0, .25, 35, 0, .6, (500, 3000))
    w, _ = whoosh(r, .24, 300, 1400, 500, .6, 1.2, .5, .25, 5000)
    return fin(mix((1, sat(x, 1.8)), (.5, w, .05)), .1)
def r_mv_human_hu(r, i):    # 'ugh'
    d = .3; f = U(r, 170, 210)
    x = vox(d, [(0, f * 1.2), (.04, f * 1.3), (.3, f * .75)], [600, 1050, 2500], r, .004, .05, .08, 1.0, .2, 30, 0, .5, (500, 3000))
    return fin(sat(x, 1.6), .1)


# ---------- bosses ----------
def r_boss_roar(r, i):      # big boss wakes up: long layered roar, two throats an octave apart
    d = 2.2; t = T(d)
    a = vox(d, [(0, 60), (.5, 88 * U(r, .92, 1.08)), (1.6, 70), (2.2, 48)], [300, 650, 1700], r, .2, 1.0, .5, 1.2, 1.0, 22, .7, .5, (200, 2000), q=4)
    b = vox(d, [(0, 120), (.5, 176), (1.6, 140), (2.2, 96)], [500, 1100, 2600], r, .25, .9, .5, 1.1, .7, 30, .3, .4, (400, 3500), q=4)
    sub = thump(d, 55, 30, .5, .9, r) * .5
    return room(edge(sat(mix((1, a), (.5, b), (1, sub)), 2.8), r=.3), .35, 1.8, 2500, 1.4, .84)
def r_boss_step(r, i):      # heavy footfall: sub thump + gravel + a little debris
    d = .7; return room(edge(mix((1.3, thump(d, 75, 32, .05, .18, r)), (.6, gravel(d, r, lambda tt: 200 * np.exp(-tt / .08) + 4)),
                                  (.4, filt(nz(int(d * SR), r), 'lowpass', 900) * np.exp(-T(d) / .05)))), .15, 1.2, 2500, .5)


FAMS = ['beast', 'big', 'bird', 'bat', 'insect', 'reptile', 'slime', 'critter', 'undead', 'ghost', 'wisp', 'golem', 'human']
VSPEC = {}
for _f in FAMS:
    VSPEC['mv_%s_ag' % _f] = (2, -17, 's'); VSPEC['mv_%s_at' % _f] = (3, -17, 's'); VSPEC['mv_%s_hu' % _f] = (3, -18, 's')
VSPEC['boss_roar'] = (2, -12, 's'); VSPEC['boss_step'] = (3, -14, 's')
