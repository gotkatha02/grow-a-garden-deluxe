"""Blade sounds (2026-11-28, owner 'อยากได้เสียงพวก อาวุธฟันดาบ'): sword / axe / dagger swings that carry a steel edge,
cuts that bite (edge tick + slice + body + a short ring of the blade), the sword draw and blade clashes.
Pure synthesis (sfxlib). A thin steel blade rings like a free bar: partials ~1 : 2.76 : 5.40 : 8.93, kHz range, decaying
in .1–.4 s with a slow beat between two close copies of the base partial."""
import numpy as np
from sfxlib import *


def steel(r, f0, d, tau=.18, amp=(1, .5, .28, .14), beat=1.7):
    """ringing blade: bar partials + a detuned twin of the base for the shimmer"""
    fs = [f0, f0 * 2.76, f0 * 5.40, f0 * 8.93]
    x = modal(fs, amp, [tau, tau * .6, tau * .38, tau * .25], d, r)
    x += .55 * modal([f0 + beat * r.uniform(.7, 1.3)], [1], [tau * 1.1], d, r)
    return x


def scrape(r, d, f0, f1, q=9, rough=.6):
    """steel sliding on steel / leather: noise through narrow swept bands + tiny catches"""
    n = int(d * SR); t = np.arange(n) / n
    fc = f0 * (f1 / f0) ** t
    x = svf(nz(n, r), fc, q, 'bp') + .6 * svf(nz(n, r), fc * 1.93, q, 'bp') + .35 * svf(nz(n, r), fc * 3.1, q * .8, 'bp')
    x += rough * crackles(d, 220, r, .8, 2500) * np.abs(x).max()
    return x


def tick(r, d=.04, hp=3500, tau=.0018):
    t = T(d); return filt(nz(len(t), r), 'highpass', hp) * np.exp(-t / tau)


def slice_(r, d, f0, f1, tau):
    """flesh / cloth parting under the edge: a band of noise sliding down, wet top"""
    n = int(d * SR); t = np.arange(n) / SR
    fc = f1 + (f0 - f1) * np.exp(-t / (d * .35))
    return svf(nz(n, r), fc, 1.6, 'bp') * np.exp(-t / tau) * att(t, .001)


def bladeswing(r, d, f0, f1, f2, peak, low, air, wh, ringf, ringv, lp=10000, q=1.5, shape=2.1, wf=None):
    x, pk = whoosh(r, d, f0, f1, f2, peak, q, low, air, lp, wh, wf or (f1 * 1.2, f1 * 2.4, f1 * 1.5), shape)
    m = np.abs(x).max() + 1e-9
    if ringv:   # the edge sings faintly right after the fastest part of the swing
        s = steel(r, ringf * r.uniform(.94, 1.06), d * .9, .09)
        x = mix((1, x), (ringv * m / (np.abs(s).max() + 1e-9), s, pk * .85))
    return edge(x), pk


# ---------- swings ----------
def r_sw_katana(r, i):   # katana: very fast thin whoosh + whistle + a faint 'tsing' of the edge
    return bladeswing(r, .22 * r.uniform(.9, 1.1), 650, 3100 * r.uniform(.92, 1.1), 1300, .55, .18, .55, .62, 3300, .18, lp=12000, q=1.8, shape=2.4)
def r_sw_great(r, i):    # greatsword / greataxe: big heavy air + a dark edge hum
    return bladeswing(r, .42 * r.uniform(.92, 1.08), 170, 1250 * r.uniform(.9, 1.12), 380, .62, .95, .4, .35, 1500, .12, lp=8000, q=1.3, shape=2.0,
                      wf=(900, 2100, 1200))
def r_sw_dagger(r, i):   # small blade: short flick with a bright edge
    return bladeswing(r, .15 * r.uniform(.9, 1.1), 900, 3600 * r.uniform(.92, 1.1), 1600, .55, .12, .5, .5, 4200, .14, lp=12500, q=1.7, shape=2.2)


# ---------- cuts ----------
def r_hit_blade(r, i):   # sword / dagger cut: edge tick → slice → body → short ring
    d = .5
    x = mix((.8, tick(r)),
            (1.0, slice_(r, .22, 5200 * r.uniform(.9, 1.1), 900, .06)),
            (.75, thump(.3, 170 * r.uniform(.9, 1.1), 60, .025, .05, r)),
            (.35, filt(nz(int(.08 * SR), r), 'bandpass', [400, 2200]) * np.exp(-T(.08) / .018)),
            (.22, steel(r, 2900 * r.uniform(.92, 1.08), d, .12), .004))
    return room(edge(sat(x, 1.5)), .09, .55, 7500, .25)
def r_hit_blade_heavy(r, i):   # greatsword / axe cleave: thick bite, bone crunch, deep body, low ring
    d = .7; t = T(.12)
    crunch = crackles(.12, 900, r, 1.0, 900, .04, (.0008, .003))
    x = mix((.7, tick(r, .05, 2500, .003)),
            (1.0, slice_(r, .3, 3600 * r.uniform(.9, 1.1), 500, .09)),
            (1.15, thump(.5, 140 * r.uniform(.9, 1.1), 40, .035, .11, r)),
            (.6, crunch, .006),
            (.3, filt(nz(len(t), r), 'bandpass', [250, 1600]) * np.exp(-t / .03)),
            (.2, steel(r, 1350 * r.uniform(.92, 1.08), d, .22), .006))
    return room(edge(sat(x, 1.9)), .12, .75, 6000, .35)


# ---------- draw / clash / sheathe ----------
def r_blade_draw(r, i):   # sword leaving the sheath: rising scrape → bright ring 'shiiing'
    d = .9; ds = .26 * r.uniform(.9, 1.1)
    sc = scrape(r, ds, 1800, 4800 * r.uniform(.9, 1.1), 10, .4) * linseg([(0, .15), (ds * .7, 1), (ds, .6)], ds)
    rg = steel(r, 2700 * r.uniform(.95, 1.05), d - ds, .32)
    x = mix((1, sc), (.9 * np.abs(sc).max() / (np.abs(rg).max() + 1e-9), rg, ds - .01))
    return room(edge(x), .18, .9, 9000, .6), ds
def r_blade_sheathe(r, i):   # back into the sheath: falling scrape + wood 'tock'
    ds = .2 * r.uniform(.9, 1.1)
    sc = scrape(r, ds, 4200, 1600, 9, .3) * linseg([(0, .3), (ds * .5, 1), (ds, .4)], ds)
    tok = modal([880 * r.uniform(.95, 1.05), 1950, 3300], [1, .4, .2], [.03, .015, .008], .15, r)
    x = mix((1, sc), (.9 * np.abs(sc).max() / np.abs(tok).max(), tok, ds - .005))
    return room(edge(x), .1, .6, 8000, .3), ds
def r_blade_clash(r, i):  # steel on steel: hard hit + bright ring + short grind
    d = 1.0
    hitn = filt(nz(int(.03 * SR), r), 'highpass', 1500) * np.exp(-T(.03) / .004)
    rg = steel(r, 1900 * r.uniform(.92, 1.08), d, .3, (1, .7, .45, .25)) + .6 * steel(r, 3100 * r.uniform(.92, 1.08), d, .2)
    gr = scrape(r, .14, 3600, 2200, 8, .5) * np.exp(-T(.14) / .05)
    x = mix((1, hitn), (.55 * 1 / (np.abs(rg).max() + 1e-9), rg), (.35 / (np.abs(gr).max() + 1e-9), gr, .01))
    return room(edge(x), .2, 1.0, 9000, .6)
def r_blade_ring(r, i):   # crit / finisher layer for blade heroes: a long clear 'tiiing'
    d = 1.1; x = steel(r, 3300 * r.uniform(.95, 1.05), d, .45, (1, .4, .22, .1), 2.4)
    x = mix((.4, tick(r, .03, 4000, .0015)), (1 / (np.abs(x).max() + 1e-9), x))
    return room(edge(x), .25, 1.1, 10000, .8)


BLSPEC = {'sw_katana': (6, -17, 'w'), 'sw_great': (5, -16, 'w'), 'sw_dagger': (6, -18, 'w'),
          'hit_blade': (6, -12, 's'), 'hit_blade_heavy': (5, -11, 's'),
          'blade_draw': (3, -15, 'w'), 'blade_sheathe': (2, -18, 'w'), 'blade_clash': (4, -13, 's'), 'blade_ring': (3, -17, 's')}
