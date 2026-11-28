#!/usr/bin/env python3
"""Totem Legend map music: composed by code, rendered with a real-instrument soundfont.

  python3 -I tools/music/compose.py [names…] [sf=SF2] [fs=FLUIDSYNTH] [out=assets/music] [keep=DIR]

Each style below is one loopable track (≈ 60–80 s). How a track is made:
  1. the style's sections (intro → A → B → bridge) are written as MIDI notes: pad / drone /
     bass / arpeggio or ostinato / chord comp / melody (motif-based: a 2-bar motif is
     repeated, moved to fit the chords and answered, chord tones on strong beats, phrase
     ends on long notes, the last phrase lands on the tonic) / counter-melody / percussion;
     wind melodies get scoops (pitch bend) and vibrato (CC1), long chords swell (CC11),
     every note gets a little timing and velocity humanisation (seeded → always the same).
  2. the whole loop is written THREE times and rendered by fluidsynth with GeneralUser GS
     (license: free for music creation and software projects; credit in assets/music/CREDITS.txt).
  3. a convolution hall (generated impulse, own decay per style) is added, the level is set
     to one loudness for every track and soft-limited.
  4. the middle copy + XF seconds of the third is cut out → the game plays copies every
     LOOP seconds with a linear crossfade over XF: both copies hold the same audio there,
     so the joint cannot be heard (the reverb tail of the end is already in the start).
  5. mp3 128 kbps → assets/music/<name>.mp3 and assets/music/list.js (window.MUS_L =
     {name: [loop seconds, xf seconds]}).
Needs: numpy, scipy, ffmpeg, a fluidsynth binary (raw output is enough), the .sf2.
"""
import sys, os, struct, subprocess, random, math, json, tempfile
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

ARGS = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
NAMES = [a for a in sys.argv[1:] if '=' not in a]
SF = ARGS.get('sf', '/home/claude/dl/gugs/GeneralUser-GS.sf2')
FS = ARGS.get('fs', '/home/claude/dl/fs/build/src/fluidsynth')
OUT = ARGS.get('out', 'assets/music')
KEEP = ARGS.get('keep')
SR = 44100
XF = 2.0
TPB = 480

# ----------------------------------------------------------------- MIDI writer
def vlq(n):
    b = [n & 0x7F]; n >>= 7
    while n: b.append(0x80 | (n & 0x7F)); n >>= 7
    return bytes(reversed(b))

class Song:
    def __init__(s, tempo, seed):
        s.tempo = tempo; s.us = int(60e6 / tempo); s.ev = {}; s.rng = random.Random(seed); s.prog = {}
    def program(s, ch, p): s.prog[ch] = p
    def _add(s, ch, beat, data): s.ev.setdefault(ch, []).append((max(0, int(round(beat * TPB))), data))
    def note(s, ch, beat, dur, pitch, vel, hum=True):
        if not (0 <= pitch <= 127): return
        r = s.rng
        if hum:
            beat += r.gauss(0, .012); vel = vel * (1 + r.gauss(0, .06))
        vel = int(max(1, min(127, vel)))
        s._add(ch, beat, bytes([0x90 | ch, pitch, vel]))
        s._add(ch, beat + max(.05, dur), bytes([0x80 | ch, pitch, 0]))
    def cc(s, ch, beat, c, v): s._add(ch, beat, bytes([0xB0 | ch, c, int(max(0, min(127, v)))]))
    def bend(s, ch, beat, v):
        v = int(max(-8192, min(8191, v))) + 8192
        s._add(ch, beat, bytes([0xE0 | ch, v & 0x7F, v >> 7]))
    def write(s, path, rev=18):
        trks = []
        t0 = bytes([0, 0xFF, 0x51, 3]) + struct.pack('>I', s.us)[1:] + bytes([0, 0xFF, 0x2F, 0])
        trks.append(t0)
        for ch in sorted(s.ev):
            ev = sorted(s.ev[ch], key=lambda e: (e[0], 0 if e[1][0] & 0xF0 == 0x80 else 1))
            pre = b''
            if ch != 9 and ch in s.prog: pre += bytes([0, 0xC0 | ch, s.prog[ch]])
            pre += bytes([0, 0xB0 | ch, 91, rev, 0, 0xB0 | ch, 93, 0, 0, 0xB0 | ch, 7, 110])
            if ch != 9: pre += bytes([0, 0xB0 | ch, 101, 0, 0, 0xB0 | ch, 100, 0, 0, 0xB0 | ch, 6, 2])  # bend range 2
            body = bytearray(pre); last = 0
            for t, d in ev:
                body += vlq(t - last) + d; last = t
            body += bytes([0, 0xFF, 0x2F, 0])
            trks.append(bytes(body))
        with open(path, 'wb') as f:
            f.write(b'MThd' + struct.pack('>IHHH', 6, 1, len(trks), TPB))
            for t in trks: f.write(b'MTrk' + struct.pack('>I', len(t)) + t)

# ----------------------------------------------------------------- scales
SC = {
    'major': [0, 2, 4, 5, 7, 9, 11], 'minor': [0, 2, 3, 5, 7, 8, 10], 'dorian': [0, 2, 3, 5, 7, 9, 10],
    'mixo': [0, 2, 4, 5, 7, 9, 10], 'lydian': [0, 2, 4, 6, 7, 9, 11], 'hmin': [0, 2, 3, 5, 7, 8, 11],
    'hijaz': [0, 1, 4, 5, 7, 8, 10], 'phryg': [0, 1, 3, 5, 7, 8, 10],
    'miyako': [0, 1, 5, 7, 8], 'yo': [0, 2, 5, 7, 9], 'pmin': [0, 3, 5, 7, 10], 'pmaj': [0, 2, 4, 7, 9],
}

class Key:
    def __init__(s, tonic, scale): s.t = tonic; s.s = SC[scale]; s.n = len(s.s)
    def p(s, d): return s.t + s.s[d % s.n] + 12 * (d // s.n)
    def chord(s, root, k=3, step=2): return [root + i * step for i in range(k)]
    def near(s, pitch, degs):  # absolute degree of the chord tone (any octave) nearest to pitch
        best = None
        for d in degs:
            for o in range(-4, 5):
                dd = d % s.n + o * s.n
                diff = abs(s.p(dd) - pitch)
                if best is None or diff < best[0]: best = (diff, dd)
        return best[1]
    def deg_of(s, pitch):  # nearest scale degree of a pitch
        best = None
        for dd in range(-30, 40):
            diff = abs(s.p(dd) - pitch)
            if best is None or diff < best[0]: best = (diff, dd)
        return best[1]

# ----------------------------------------------------------------- rhythm banks (sixteenths: (onset, length))
R4 = {
 'calm':   [[(0, 6), (6, 2), (8, 4), (12, 4)], [(0, 4), (4, 4), (8, 8)], [(0, 2), (2, 2), (4, 4), (8, 6), (14, 2)],
            [(0, 3), (3, 1), (4, 4), (8, 4), (12, 4)], [(0, 8), (8, 4), (12, 4)]],
 'lively': [[(0, 2), (2, 2), (4, 2), (6, 2), (8, 4), (12, 4)], [(0, 3), (3, 1), (4, 4), (8, 2), (10, 2), (12, 4)],
            [(0, 4), (4, 2), (6, 2), (8, 2), (10, 2), (12, 4)], [(0, 2), (2, 2), (4, 4), (8, 3), (11, 1), (12, 4)]],
 'boss':   [[(0, 3), (3, 3), (6, 2), (8, 4), (12, 4)], [(0, 2), (2, 2), (4, 2), (6, 2), (8, 6), (14, 2)],
            [(0, 6), (6, 2), (8, 2), (10, 2), (12, 4)]],
 'sparse': [[(0, 8), (8, 8)], [(0, 12), (12, 4)], [(4, 4), (8, 8)], [(0, 6), (6, 2), (8, 8)]],
}
R4END = [[(0, 4), (4, 12)], [(0, 16)], [(0, 2), (2, 2), (4, 12)], [(0, 6), (6, 10)]]
R3 = {
 'calm':   [[(0, 4), (4, 2), (6, 2), (8, 4)], [(0, 6), (6, 2), (8, 4)], [(0, 4), (4, 4), (8, 4)], [(0, 2), (2, 2), (4, 4), (8, 4)]],
 'lively': [[(0, 2), (2, 2), (4, 2), (6, 2), (8, 4)], [(0, 3), (3, 1), (4, 2), (6, 2), (8, 2), (10, 2)], [(0, 4), (4, 2), (6, 2), (8, 2), (10, 2)]],
}
R3END = [[(0, 4), (4, 8)], [(0, 12)], [(0, 2), (2, 2), (4, 8)]]

# ----------------------------------------------------------------- styles
# roles: inst = GM program (0-based); vel; oct = octave offset of the role
S = {}
S['capital'] = dict(tempo=84, key=(60, 'major'), seed=11, rt=2.4, feel='calm',
    prog=[0, 4, 5, 3, 0, 4, 3, 4], bprog=[5, 3, 0, 4],
    pad=dict(inst=48, vel=52, oct=0), bass=dict(inst=45, vel=70, pat=[(0, 'r', 3), (8, '5', 3), (12, 'o', 3)]),
    arp=dict(inst=46, vel=62, pat='up8'), comp=None,
    mel=dict(inst=73, vel=82, lo=72, hi=88, vib=1), mel2=dict(inst=71, vel=74, oct=0, harm=-2),
    glock=dict(inst=9, vel=46),
    perc=dict(A=[(0, 54, 34), (8, 54, 28), (4, 70, 22), (12, 70, 22)], B=[(0, 54, 40), (4, 70, 28), (8, 54, 34), (12, 70, 28), (14, 70, 20)]))
S['vik'] = dict(tempo=74, key=(62, 'minor'), seed=21, rt=3.0, feel='calm',
    prog=[0, 6, 5, 6, 0, 4, 5, 6], bprog=[5, 3, 0, 6],
    pad=dict(inst=52, vel=46, oct=0), drone=dict(inst=42, vel=58, oct=-2),
    bass=dict(inst=43, vel=74, oct=-2, pat=[(0, 'r', 6), (6, 'r', 2), (8, 'r', 6), (14, '5', 2)]),
    ost=dict(inst=42, vel=58, oct=-1, pat=[(0, 0, 2), (2, 0, 2), (4, 4, 2), (6, 0, 2), (8, 0, 2), (10, 0, 2), (12, 5, 2), (14, 4, 2)]),
    mel=dict(inst=60, vel=86, lo=55, hi=72, vib=1), mel2=dict(inst=110, vel=78, oct=1, harm=0),
    perc=dict(A=[(0, 41, 92), (6, 41, 64), (8, 43, 86), (12, 41, 58), (14, 41, 70)],
              B=[(0, 41, 100), (3, 41, 54), (6, 41, 70), (8, 43, 96), (10, 41, 54), (12, 41, 74), (14, 43, 80)]),
    taiko=dict(inst=116, vel=88, pat=[(0, 104), (8, 80)]), tymp=dict(inst=47, vel=70))
S['vik_town'] = dict(tempo=104, key=(62, 'dorian'), seed=23, rt=1.8, feel='lively', bar=12,
    prog=[0, 6, 0, 4, 0, 6, 3, 4], bprog=[3, 0, 6, 4],
    pad=dict(inst=48, vel=40, oct=0), bass=dict(inst=32, vel=72, pat=[(0, 'r', 4), (8, '5', 4)]),
    comp=dict(inst=25, vel=58, pat=[(0, 4), (4, 2), (6, 2), (8, 4)]),
    mel=dict(inst=110, vel=84, lo=62, hi=84, vib=0), mel2=dict(inst=72, vel=70, oct=1, harm=0),
    perc=dict(A=[(0, 41, 80), (6, 41, 52), (8, 41, 60)], B=[(0, 41, 88), (4, 54, 40), (6, 41, 60), (8, 41, 70), (10, 54, 36)]))
S['grk'] = dict(tempo=80, key=(57, 'dorian'), seed=31, rt=2.6, feel='calm',
    prog=[0, 3, 6, 0, 0, 3, 4, 4], bprog=[2, 3, 6, 4],
    pad=dict(inst=49, vel=46, oct=0), bass=dict(inst=42, vel=64, oct=-1, pat=[(0, 'r', 8), (8, '5', 8)]),
    arp=dict(inst=46, vel=66, pat='lyre'),
    mel=dict(inst=75, vel=84, lo=65, hi=84, vib=1, scoop=1), mel2=dict(inst=68, vel=72, oct=0, harm=-2),
    perc=dict(A=[(0, 60, 46), (6, 61, 34), (8, 60, 40), (12, 61, 30)], B=[(0, 60, 54), (4, 61, 34), (6, 61, 30), (8, 60, 50), (12, 61, 40), (14, 61, 28)]),
    tymp=dict(inst=47, vel=60))
S['grk_town'] = dict(tempo=100, key=(55, 'mixo'), seed=33, rt=1.7, feel='lively',
    prog=[0, 6, 3, 0, 0, 6, 4, 4], bprog=[3, 0, 6, 4],
    pad=dict(inst=48, vel=38, oct=0), bass=dict(inst=32, vel=70, pat=[(0, 'r', 3), (6, '5', 2), (8, 'r', 3), (12, '5', 3)]),
    comp=dict(inst=24, vel=56, pat=[(2, 2), (6, 2), (10, 2), (14, 2)], trem=1),
    mel=dict(inst=71, vel=84, lo=62, hi=81, vib=1), mel2=dict(inst=73, vel=70, oct=1, harm=0),
    arp=dict(inst=46, vel=50, pat='up8'),
    perc=dict(A=[(0, 60, 60), (4, 62, 40), (8, 60, 54), (10, 62, 38), (12, 63, 46)],
              B=[(0, 60, 66), (2, 62, 36), (4, 63, 50), (8, 60, 60), (10, 62, 40), (12, 63, 50), (14, 54, 34)]))
S['egy'] = dict(tempo=88, key=(62, 'hijaz'), seed=41, rt=2.6, feel='calm',
    prog=[0, 0, 6, 0, 3, 6, 1, 0], bprog=[3, 3, 1, 0],
    pad=dict(inst=49, vel=40, oct=0), drone=dict(inst=104, vel=50, oct=-1),
    bass=dict(inst=32, vel=70, pat=[(0, 'r', 3), (6, 'r', 2), (8, '5', 3), (12, 'r', 3)]),
    ost=dict(inst=24, vel=60, oct=0, pat=[(0, 0, 2), (3, 1, 1), (4, 2, 2), (6, 1, 2), (8, 0, 2), (10, 1, 2), (12, 0, 2), (14, -1, 2)]),
    mel=dict(inst=68, vel=82, lo=62, hi=81, vib=1, scoop=1, orn=1), mel2=dict(inst=73, vel=70, oct=0, harm=0),
    perc=dict(A=[(0, 64, 84), (6, 64, 60), (4, 63, 56), (10, 63, 50), (12, 63, 60), (14, 62, 34)],
              B=[(0, 64, 90), (2, 62, 30), (4, 63, 60), (6, 64, 70), (8, 62, 36), (10, 63, 56), (12, 63, 64), (14, 62, 40), (8, 54, 30)]))
S['egy_town'] = dict(tempo=100, key=(60, 'hijaz'), seed=43, rt=1.8, feel='lively',
    prog=[0, 6, 0, 3, 0, 6, 1, 0], bprog=[3, 1, 6, 0],
    pad=dict(inst=48, vel=36, oct=0), bass=dict(inst=32, vel=70, pat=[(0, 'r', 3), (6, 'r', 2), (8, '5', 3), (12, 'r', 3)]),
    arp=dict(inst=46, vel=58, pat='run'),
    mel=dict(inst=73, vel=82, lo=67, hi=86, vib=1, scoop=1, orn=1), mel2=dict(inst=104, vel=70, oct=0, harm=0),
    perc=dict(A=[(0, 64, 82), (4, 63, 56), (6, 64, 60), (10, 63, 52), (12, 63, 60)],
              B=[(0, 64, 88), (2, 62, 34), (4, 63, 60), (6, 64, 70), (8, 62, 40), (10, 63, 56), (12, 63, 64), (14, 54, 34)]))
S['jpn'] = dict(tempo=70, key=(62, 'miyako'), seed=51, rt=2.8, feel='sparse',
    prog=[0, 0, 3, 0, 1, 3, 4, 0], bprog=[3, 4, 1, 0], step=2,
    pad=dict(inst=49, vel=38, oct=0), drone=None,
    bass=dict(inst=42, vel=56, oct=-1, pat=[(0, 'r', 16)]),
    arp=dict(inst=107, vel=68, pat='koto'),
    mel=dict(inst=77, vel=86, lo=62, hi=79, vib=1, scoop=1), mel2=dict(inst=107, vel=60, oct=1, harm=0),
    perc=dict(A=[(0, 77, 30), (8, 76, 26)], B=[(0, 77, 36), (6, 76, 26), (8, 77, 32), (12, 76, 28)]),
    taiko=dict(inst=116, vel=78, pat=[(0, 90), (12, 60)]), chime=dict(inst=112, vel=40))
S['jpn_town'] = dict(tempo=96, key=(62, 'yo'), seed=53, rt=1.8, feel='lively', step=2,
    prog=[0, 3, 0, 4, 0, 3, 1, 0], bprog=[3, 4, 3, 0],
    pad=dict(inst=48, vel=34, oct=0), bass=dict(inst=32, vel=64, pat=[(0, 'r', 4), (8, '5', 4)]),
    comp=dict(inst=106, vel=64, pat=[(0, 2), (4, 2), (6, 2), (10, 2), (12, 2)], single=1),
    arp=dict(inst=107, vel=54, pat='koto'),
    mel=dict(inst=72, vel=78, lo=74, hi=91, vib=1, scoop=1), mel2=dict(inst=106, vel=62, oct=0, harm=0),
    perc=dict(A=[(0, 77, 50), (4, 76, 36), (8, 77, 46), (12, 76, 40)], B=[(0, 77, 56), (2, 76, 30), (4, 76, 40), (8, 77, 50), (10, 76, 34), (12, 76, 44)]),
    taiko=dict(inst=116, vel=74, pat=[(0, 84), (10, 54), (12, 64)]))
S['azt'] = dict(tempo=92, key=(57, 'pmin'), seed=61, rt=2.3, feel='lively', step=2,
    prog=[0, 0, 3, 4, 0, 0, 4, 3], bprog=[3, 4, 1, 0],
    pad=dict(inst=52, vel=38, oct=-1), bass=dict(inst=116, vel=60, oct=-1, pat=[(0, 'r', 4), (10, 'r', 2), (12, '5', 4)]),
    ost=dict(inst=12, vel=66, oct=0, pat=[(0, 0, 2), (2, 2, 2), (4, 1, 2), (6, 2, 2), (8, 0, 2), (10, 3, 2), (12, 2, 2), (14, 1, 2)]),
    mel=dict(inst=79, vel=82, lo=67, hi=84, vib=1, scoop=1), mel2=dict(inst=75, vel=70, oct=0, harm=0),
    perc=dict(A=[(0, 64, 72), (4, 70, 40), (6, 63, 54), (8, 64, 66), (10, 70, 36), (12, 63, 58), (14, 70, 36)],
              B=[(0, 64, 80), (2, 70, 40), (4, 63, 60), (6, 64, 60), (8, 70, 44), (10, 63, 60), (12, 64, 70), (14, 70, 44), (0, 69, 30), (8, 69, 30)]),
    taiko=dict(inst=117, vel=64, pat=[(0, 80), (6, 56), (12, 66)]))
S['azt_town'] = dict(tempo=104, key=(60, 'pmaj'), seed=63, rt=1.7, feel='lively', step=2,
    prog=[0, 3, 1, 0, 0, 3, 4, 0], bprog=[3, 1, 4, 0],
    pad=dict(inst=48, vel=34, oct=0), bass=dict(inst=32, vel=66, pat=[(0, 'r', 3), (6, 'r', 2), (8, '5', 3), (12, 'o', 2)]),
    ost=dict(inst=12, vel=62, oct=0, pat=[(0, 0, 2), (2, 1, 2), (4, 2, 2), (6, 1, 2), (8, 3, 2), (10, 2, 2), (12, 1, 2), (14, 2, 2)]),
    mel=dict(inst=75, vel=82, lo=67, hi=86, vib=1), mel2=dict(inst=79, vel=66, oct=0, harm=0),
    perc=dict(A=[(0, 60, 60), (4, 75, 46), (6, 61, 44), (8, 60, 54), (10, 75, 44), (12, 61, 48)],
              B=[(0, 60, 66), (2, 61, 38), (4, 75, 50), (6, 61, 46), (8, 60, 60), (10, 75, 48), (12, 61, 52), (14, 70, 34)]))
S['dungeon'] = dict(tempo=60, key=(57, 'minor'), seed=71, rt=4.2, feel='sparse',
    prog=[0, 0, 5, 5, 3, 3, 4, 4], bprog=[5, 3, 1, 4],
    pad=dict(inst=92, vel=48, oct=-1), drone=dict(inst=42, vel=56, oct=-1),
    bass=dict(inst=43, vel=50, oct=0, pat=[(0, 'r', 16)]),
    arp=dict(inst=8, vel=40, pat='drip'),
    mel=dict(inst=42, vel=66, lo=48, hi=65, vib=1), mel2=dict(inst=53, vel=50, oct=0, harm=0),
    perc=dict(A=[(0, 35, 54), (3, 35, 36)], B=[(0, 35, 60), (3, 35, 42), (8, 41, 30)]))
S['boss'] = dict(tempo=138, key=(64, 'hmin'), seed=81, rt=2.0, feel='boss',
    prog=[0, 0, 5, 4, 0, 0, 5, 6], bprog=[3, 5, 3, 4],
    pad=dict(inst=52, vel=60, oct=0),
    bass=dict(inst=43, vel=86, oct=-2, pat=[(0, 'r', 2), (2, 'r', 2), (4, 'r', 2), (6, 'r', 2), (8, 'r', 2), (10, 'r', 2), (12, '5', 2), (14, 'r', 2)]),
    ost=dict(inst=48, vel=72, oct=-1, short=1, pat=[(0, 0, 1), (1, 0, 1), (2, 2, 1), (3, 0, 1), (4, 0, 1), (5, 0, 1), (6, 3, 1), (7, 0, 1),
                                               (8, 0, 1), (9, 0, 1), (10, 4, 1), (11, 0, 1), (12, 3, 1), (13, 0, 1), (14, 2, 1), (15, 1, 1)]),
    comp=dict(inst=61, vel=86, pat=[(0, 3), (6, 2), (12, 4)]),
    mel=dict(inst=57, vel=96, lo=60, hi=78, vib=1), mel2=dict(inst=60, vel=84, oct=0, harm=-2),
    perc=dict(A=[(0, 36, 100), (4, 38, 84), (8, 36, 92), (10, 36, 70), (12, 38, 90), (14, 38, 56)],
              B=[(0, 36, 108), (2, 42, 50), (4, 38, 92), (6, 42, 46), (8, 36, 100), (10, 36, 80), (12, 38, 96), (13, 38, 60), (14, 38, 72), (15, 38, 80)]),
    taiko=dict(inst=116, vel=96, pat=[(0, 110), (3, 70), (8, 100), (11, 70), (14, 86)]), tymp=dict(inst=47, vel=84), crash=1)
S['sea'] = dict(tempo=76, key=(65, 'lydian'), seed=91, rt=2.6, feel='calm',
    prog=[0, 1, 0, 1, 5, 3, 4, 4], bprog=[3, 4, 5, 1],
    pad=dict(inst=89, vel=44, oct=-1), bass=dict(inst=32, vel=60, pat=[(0, 'r', 6), (6, '5', 2), (8, 'o', 8)]),
    arp=dict(inst=46, vel=60, pat='wave'),
    mel=dict(inst=73, vel=78, lo=69, hi=86, vib=1), mel2=dict(inst=114, vel=56, oct=0, harm=0),
    perc=dict(A=[(0, 70, 26), (4, 70, 20), (8, 70, 26), (12, 70, 20)], B=[(0, 70, 32), (2, 70, 18), (4, 70, 24), (6, 70, 18), (8, 70, 32), (12, 70, 26), (14, 54, 20)]))
S['mystic'] = dict(tempo=66, key=(62, 'lydian'), seed=101, rt=3.8, feel='sparse',
    prog=[0, 1, 0, 1, 5, 4, 1, 0], bprog=[3, 1, 5, 4],
    pad=dict(inst=91, vel=46, oct=-1), drone=dict(inst=95, vel=38, oct=-1),
    bass=dict(inst=48, vel=44, oct=-1, pat=[(0, 'r', 16)]),
    arp=dict(inst=8, vel=48, pat='up8'),
    mel=dict(inst=11, vel=62, lo=67, hi=86, vib=0), mel2=dict(inst=53, vel=50, oct=-1, harm=-2),
    perc=None)
S['night'] = dict(tempo=62, key=(58, 'major'), seed=111, rt=3.2, feel='sparse',
    prog=[0, 5, 3, 4, 0, 5, 1, 4], bprog=[3, 0, 1, 4],
    pad=dict(inst=49, vel=40, oct=0), bass=dict(inst=42, vel=46, oct=-1, pat=[(0, 'r', 16)]),
    arp=dict(inst=46, vel=50, pat='up8'),
    mel=dict(inst=0, vel=58, lo=62, hi=81, vib=0), mel2=dict(inst=73, vel=50, oct=0, harm=0),
    perc=None)


# ----------------------------------------------------------------- variants (2026-11-28: more tracks, one map group each)
# V(base, seed, **over): a copy of a style with a new seed (new motif / melody / humanisation) and overrides;
# a role given as a dict is MERGED into the base role (dict(inst=..) keeps its pattern), None removes the role.
import copy as _cp
def V(base, seed, **o):
    st = _cp.deepcopy(S[base]); st['seed'] = seed
    for k, v in o.items():
        if isinstance(v, dict) and isinstance(st.get(k), dict) and k not in ('perc',): st[k].update(v)
        else: st[k] = v
    return st
DRUM_TRIBE = dict(A=[(0, 41, 96), (4, 43, 60), (8, 41, 86), (11, 43, 54), (12, 41, 76)],
                  B=[(0, 41, 104), (2, 43, 50), (4, 41, 70), (6, 43, 60), (8, 41, 96), (10, 41, 56), (12, 43, 80), (14, 41, 74)])
DRUM_SOFT = dict(A=[(0, 35, 46), (8, 35, 34)], B=[(0, 35, 52), (6, 35, 34), (8, 35, 44), (12, 41, 30)])
# Viking: Frost Wind (F3–F4) · War March (F5–F6) · Barrow (dungeons) · Hall of Giants (H / E)
S['vik2'] = V('vik', 24, tempo=68, key=(64, 'dorian'), mel=dict(inst=73, lo=69, hi=88), mel2=dict(inst=110),
              prog=[0, 3, 6, 4, 0, 3, 5, 4], bprog=[6, 3, 4, 0], ost=dict(inst=46), taiko=None)
S['vik3'] = V('vik', 25, tempo=96, feel='lively', key=(62, 'minor'), mel=dict(inst=60, lo=57, hi=74), mel2=dict(inst=57),
              prog=[0, 0, 5, 6, 0, 0, 3, 4], bprog=[5, 6, 3, 4], perc=DRUM_TRIBE, taiko=dict(inst=116, vel=96, pat=[(0, 108), (6, 70), (8, 96), (14, 80)]))
S['vik_dun'] = V('dungeon', 26, key=(62, 'minor'), pad=dict(inst=52, vel=42), mel=dict(inst=71, vel=60, lo=55, hi=72),
                 mel2=dict(inst=42), drone=dict(inst=43))
S['vik_deep'] = V('vik', 27, tempo=84, key=(62, 'hmin'), rt=3.4, pad=dict(inst=52, vel=60), mel=dict(inst=48, vel=88, lo=62, hi=79),
                  mel2=dict(inst=60, vel=80), tymp=dict(inst=47, vel=86), taiko=dict(inst=116, vel=100, pat=[(0, 112), (8, 96), (12, 80)]))
# Greek: Olive Groves · Festival Road · Labyrinth · Olympus
S['grk2'] = V('grk', 34, tempo=72, key=(60, 'lydian'), mel=dict(inst=73, lo=72, hi=88), mel2=dict(inst=46), arp=dict(pat='wave'))
S['grk3'] = V('grk', 35, tempo=98, feel='lively', key=(62, 'mixo'), mel=dict(inst=75, lo=69, hi=88), arp=dict(pat='run'),
              perc=S['grk_town']['perc'])
S['grk_dun'] = V('dungeon', 36, key=(57, 'phryg'), arp=dict(inst=46, vel=46, pat='drip'), mel=dict(inst=68, vel=60, lo=57, hi=74),
                 pad=dict(inst=49))
S['grk_deep'] = V('grk', 37, tempo=90, key=(57, 'mixo'), rt=3.0, pad=dict(inst=52, vel=54), mel=dict(inst=60, vel=90, lo=60, hi=79, scoop=0),
                  mel2=dict(inst=61, vel=78), tymp=dict(inst=47, vel=82), perc=DRUM_TRIBE)
# Egypt: Oasis · Caravan · Tomb · Temple of the Sun
S['egy2'] = V('egy', 44, tempo=76, key=(64, 'phryg'), mel=dict(inst=71, lo=64, hi=83), ost=dict(inst=46), drone=dict(inst=49))
S['egy3'] = V('egy', 45, tempo=104, feel='lively', key=(62, 'hijaz'), mel=dict(inst=111, lo=64, hi=83), mel2=dict(inst=68))
S['egy_dun'] = V('dungeon', 46, key=(62, 'hijaz'), mel=dict(inst=68, vel=58, lo=55, hi=72, orn=1), drone=dict(inst=104, vel=46),
                 arp=dict(inst=24, vel=44, pat='drip'))
S['egy_deep'] = V('egy', 47, tempo=80, key=(60, 'hijaz'), rt=3.4, pad=dict(inst=52, vel=56), mel=dict(inst=61, vel=86, lo=60, hi=79),
                  mel2=dict(inst=52, vel=66), tymp=dict(inst=47, vel=80))
# Japan: Bamboo Path · Festival · Shrine Cave · Oni Mountain
S['jpn2'] = V('jpn', 54, tempo=78, key=(62, 'yo'), mel=dict(inst=107, vel=80, lo=67, hi=86, scoop=0), mel2=dict(inst=77), arp=dict(inst=46))
S['jpn3'] = V('jpn', 55, tempo=100, feel='lively', key=(64, 'miyako'), mel=dict(inst=106, lo=64, hi=83, scoop=0), mel2=dict(inst=72),
              perc=S['jpn_town']['perc'], taiko=dict(inst=116, vel=90, pat=[(0, 100), (6, 64), (8, 90), (12, 70)]))
S['jpn_dun'] = V('dungeon', 56, key=(62, 'miyako'), step=2, mel=dict(inst=77, vel=62, lo=57, hi=74, scoop=1), arp=dict(inst=112, vel=36, pat='drip'))
S['jpn_deep'] = V('jpn', 57, tempo=88, feel='boss', key=(62, 'miyako'), rt=3.0, pad=dict(inst=48, vel=52), mel=dict(inst=77, vel=92),
                  mel2=dict(inst=48, vel=70), taiko=dict(inst=116, vel=104, pat=[(0, 114), (3, 72), (8, 104), (11, 72), (14, 90)]), perc=DRUM_TRIBE)
# Aztec: Jungle Dawn · Drum Path · Sunken Cenote · Pyramid of the Sun
S['azt2'] = V('azt', 64, tempo=84, feel='calm', key=(60, 'pmaj'), mel=dict(inst=79, lo=72, hi=88), ost=dict(inst=11, vel=58))
S['azt3'] = V('azt', 65, tempo=108, key=(57, 'pmin'), mel=dict(inst=75, lo=69, hi=86), perc=DRUM_TRIBE,
              taiko=dict(inst=117, vel=80, pat=[(0, 96), (4, 60), (8, 86), (12, 70), (14, 60)]))
S['azt_dun'] = V('dungeon', 66, key=(57, 'phryg'), mel=dict(inst=79, vel=58, lo=60, hi=76), arp=dict(inst=12, vel=40, pat='drip'), perc=DRUM_SOFT)
S['azt_deep'] = V('azt', 67, tempo=96, feel='boss', key=(57, 'hmin'), step=2, pad=dict(inst=52, vel=56), mel=dict(inst=60, vel=90, lo=60, hi=79),
                  mel2=dict(inst=79, vel=70), tymp=dict(inst=47, vel=80))
# shared: capital ring fields · catacombs · the rift · world-boss arenas · a second boss theme
S['ring'] = V('capital', 12, tempo=88, key=(62, 'mixo'), mel=dict(inst=71, lo=69, hi=86), mel2=dict(inst=73), arp=dict(pat='wave'), glock=None)
S['crypt'] = V('dungeon', 72, tempo=56, key=(55, 'hmin'), pad=dict(inst=19, vel=40), mel=dict(inst=19, vel=58, lo=55, hi=72),
               mel2=dict(inst=52, vel=44), arp=dict(inst=14, vel=34, pat='drip'))
S['rift'] = V('mystic', 102, tempo=72, key=(61, 'phryg'), pad=dict(inst=94), drone=dict(inst=88), mel=dict(inst=98, lo=65, hi=84),
              arp=dict(inst=10, pat='wave'))
S['arena'] = V('boss', 82, tempo=124, key=(62, 'minor'), rt=2.6, mel=dict(inst=52, vel=96, lo=62, hi=79), mel2=dict(inst=60),
               comp=dict(inst=48))
S['boss2'] = V('boss', 83, tempo=146, key=(65, 'phryg'), mel=dict(inst=61, lo=62, hi=81), mel2=dict(inst=56), ost=dict(inst=45))


# 12 Tails-style (owner 2026-11-28 'เสียงดนตรีแนว12หาง'): bright storybook fantasy-MMO music — major keys,
# flute / ocarina / clarinet tunes, pizzicato strings, harp arpeggios, glockenspiel / celesta sparkle,
# light march or waltz drums. Used in the capital, its ring fields, night and as extra field tracks.
PZ = dict(inst=45, vel=72, oct=-1, pat=[(0, 'r', 2), (4, '5', 2), (8, 'r', 2), (12, 'o', 2)])
DRUM_MARCH = dict(A=[(0, 36, 60), (4, 38, 46), (8, 36, 54), (12, 38, 50), (14, 38, 30)],
                  B=[(0, 36, 66), (4, 38, 52), (6, 42, 30), (8, 36, 60), (10, 42, 30), (12, 38, 56), (14, 38, 40), (15, 38, 34)])
DRUM_TAMB = dict(A=[(0, 54, 40), (4, 54, 26), (8, 54, 36), (12, 54, 26)], B=[(0, 54, 46), (2, 54, 24), (4, 54, 34), (8, 54, 42), (10, 54, 24), (12, 54, 34), (14, 81, 22)])
S['t12_town'] = V('capital', 121, tempo=112, feel='lively', key=(65, 'major'), prog=[0, 3, 4, 0, 5, 3, 1, 4], bprog=[3, 4, 2, 5],
                  bass=PZ, arp=dict(inst=46, vel=56, pat='up8'), mel=dict(inst=73, vel=84, lo=72, hi=91), mel2=dict(inst=71, vel=66, oct=0, harm=-2),
                  glock=dict(inst=9, vel=52), perc=DRUM_TAMB)
S['t12_waltz'] = V('capital', 122, tempo=116, feel='lively', bar=12, key=(58, 'major'), prog=[0, 4, 5, 3, 0, 4, 1, 4], bprog=[3, 0, 1, 4],
                   pad=dict(inst=49, vel=44), bass=dict(inst=45, vel=70, oct=-1, pat=[(0, 'r', 4), (4, '5', 2), (8, '5', 2)]),
                   comp=dict(inst=45, vel=48, pat=[(4, 2), (8, 2)]), arp=None, mel=dict(inst=10, vel=80, lo=70, hi=89, vib=0),
                   mel2=dict(inst=73, vel=62, oct=0, harm=-2), glock=dict(inst=8, vel=44), perc=dict(A=[(0, 54, 30), (4, 54, 20), (8, 54, 20)], B=[(0, 54, 36), (4, 54, 24), (8, 54, 24)]))
S['t12_field'] = V('capital', 123, tempo=96, feel='calm', key=(67, 'major'), prog=[0, 5, 3, 4, 0, 5, 1, 4], bprog=[3, 4, 5, 4],
                   pad=dict(inst=49, vel=46), bass=PZ, arp=dict(inst=46, vel=60, pat='wave'), mel=dict(inst=79, vel=82, lo=67, hi=86),
                   mel2=dict(inst=68, vel=64, oct=0, harm=-2), glock=dict(inst=9, vel=40), perc=DRUM_TAMB)
S['t12_adv'] = V('capital', 124, tempo=120, feel='lively', key=(62, 'major'), prog=[0, 4, 5, 3, 0, 4, 3, 4], bprog=[5, 3, 1, 4],
                 pad=dict(inst=48, vel=58), bass=dict(inst=43, vel=70, oct=-2, pat=[(0, 'r', 3), (6, 'r', 2), (8, '5', 3), (12, 'o', 4)]),
                 comp=dict(inst=61, vel=62, pat=[(0, 3), (6, 2), (12, 4)]), arp=dict(inst=45, vel=56, pat='run'),
                 mel=dict(inst=56, vel=88, lo=65, hi=84), mel2=dict(inst=73, vel=70, oct=1, harm=0), glock=dict(inst=9, vel=46),
                 perc=DRUM_MARCH, tymp=dict(inst=47, vel=66))
S['t12_forest'] = V('capital', 125, tempo=88, feel='calm', key=(64, 'lydian'), prog=[0, 1, 5, 4, 0, 1, 3, 4], bprog=[3, 1, 5, 0],
                    pad=dict(inst=89, vel=40), bass=PZ, arp=dict(inst=12, vel=60, pat='wave'), mel=dict(inst=74, vel=80, lo=69, hi=88),
                    mel2=dict(inst=11, vel=56, oct=0, harm=0), glock=dict(inst=8, vel=40), perc=DRUM_TAMB)
S['t12_cozy'] = V('capital', 126, tempo=100, feel='lively', key=(60, 'major'), prog=[0, 5, 1, 4, 0, 5, 3, 4], bprog=[3, 2, 1, 4],
                  pad=dict(inst=21, vel=40), bass=PZ, comp=dict(inst=0, vel=48, pat=[(2, 2), (6, 2), (10, 2), (14, 2)]), arp=None,
                  mel=dict(inst=71, vel=82, lo=65, hi=84), mel2=dict(inst=21, vel=60, oct=0, harm=-2), glock=dict(inst=9, vel=40), perc=DRUM_TAMB)
S['t12_night'] = V('night', 127, tempo=72, key=(63, 'major'), prog=[0, 5, 3, 4, 0, 2, 5, 4], bprog=[3, 4, 5, 4],
                   arp=dict(inst=46, vel=52, pat='wave'), mel=dict(inst=8, vel=66, lo=70, hi=89), mel2=dict(inst=73, vel=48), glock=dict(inst=10, vel=34))
S['t12_hero'] = V('capital', 128, tempo=132, feel='boss', key=(60, 'major'), prog=[0, 5, 3, 4, 0, 5, 1, 4], bprog=[5, 3, 1, 4],
                  pad=dict(inst=48, vel=62), bass=dict(inst=43, vel=80, oct=-2, pat=[(0, 'r', 2), (2, 'r', 2), (4, 'r', 2), (6, 'r', 2), (8, 'r', 2), (10, 'r', 2), (12, '5', 2), (14, 'r', 2)]),
                  comp=dict(inst=61, vel=74, pat=[(0, 3), (6, 2), (12, 4)]), arp=dict(inst=45, vel=60, pat='run'),
                  mel=dict(inst=56, vel=94, lo=67, hi=86), mel2=dict(inst=48, vel=76, oct=0, harm=-2), glock=dict(inst=9, vel=50),
                  perc=DRUM_MARCH, tymp=dict(inst=47, vel=80), crash=1)

# arpeggio patterns: (16th, chord index, octave, length)
ARP = {
 'up8':  [(0, 0, 0, 4), (2, 1, 0, 4), (4, 2, 0, 4), (6, 0, 1, 4), (8, 1, 1, 4), (10, 2, 1, 4), (12, 0, 1, 2), (14, 2, 0, 2)],
 'lyre': [(0, 0, 0, 8), (4, 2, 0, 4), (6, 1, 1, 2), (8, 0, 1, 6), (12, 2, 0, 4)],
 'koto': [(0, 0, 0, 6), (6, 2, 0, 2), (8, 1, 1, 6), (14, 2, 0, 2)],
 'run':  [(0, 0, 0, 2), (2, 1, 0, 2), (4, 2, 0, 2), (6, 1, 0, 2), (8, 0, 1, 2), (10, 2, 0, 2), (12, 1, 0, 2), (14, 2, 0, 2)],
 'drip': [(0, 2, 1, 8), (11, 0, 2, 5)],
 'wave': [(0, 0, 0, 3), (3, 1, 0, 3), (6, 2, 0, 2), (8, 0, 1, 3), (11, 2, 0, 3), (14, 1, 0, 2)],
}

CH = dict(pad=0, drone=1, bass=2, arp=3, ost=4, comp=5, mel=6, mel2=7, glock=8, perc=9, taiko=10, tymp=11, chime=12)

# ----------------------------------------------------------------- composer
def compose(name, st):
    K = Key(*st['key']); song = Song(st['tempo'], st['seed']); rng = random.Random(st['seed'] * 7 + 3)
    bar16 = st.get('bar', 16); bb = bar16 / 4  # beats a bar
    step = st.get('step', 2)
    sections = [('intro', 4), ('A', 8), ('B', 8), ('bridge', 4)]
    for role, ch in CH.items():
        if role != 'perc' and st.get(role): song.program(ch, st[role]['inst'])
    prog = st['prog']; bprog = st['bprog']
    rbank = (R3 if bar16 == 12 else R4).get(st['feel']) or (R3 if bar16 == 12 else R4)['calm']
    rend = R3END if bar16 == 12 else R4END
    # one motif for the whole track: rhythm of its first bar + contour in scale steps
    mrh = rng.choice(rbank)
    contour = [0]
    for i in range(1, len(mrh)):
        contour.append(contour[-1] + rng.choice([-1, -1, 1, 1, 2, -2, 1, 0, 3]))
    m = dict(st['mel']); m['lo'] = K.deg_of(m['lo']); m['hi'] = K.deg_of(m['hi'])
    centre = (m['lo'] + m['hi']) // 2
    prev_pitch = [K.p(centre)]

    def chord_of(root): return K.chord(root, 3, step)
    def strong(o): return o == 0 or (bar16 == 16 and o == 8) or (bar16 == 12 and o in (0,))

    def chord_near(d, degs, avoid=None):
        c = []
        for x in degs:
            for o in range(-4, 5):
                dd = x % K.n + o * K.n
                if dd != avoid: c.append((abs(dd - d), dd))
        return min(c)[1]

    def melody_bar(bar_beat, rh, root, base_deg, vel, ch, ins, cad=None, add=True, inv=False):
        degs = chord_of(root); out = []
        pd = K.deg_of(prev_pitch[0])
        d = chord_near(pd, degs, avoid=pd) if cad is None else chord_near(pd, degs)
        for i, (o, l) in enumerate(rh):
            if i > 0:
                if i < len(contour):
                    st_ = contour[i] - contour[i - 1]
                    if inv: st_ = -st_
                else:
                    st_ = rng.choice([-1, 1, -1, 1, -2, 2])
                if st_ == 0: st_ = rng.choice([-1, 1])
                d = d + st_
                if strong(o): d = chord_near(d, degs, avoid=pd)
            if cad is not None and i == len(rh) - 1:
                d = min(((abs(x - d), x) for x in range(d - K.n, d + K.n + 1) if x % K.n == cad % K.n))[1]
            while d > ins['hi']: d -= K.n
            while d < ins['lo']: d += K.n
            if d == pd and not (cad is not None and i == len(rh) - 1):
                d += 1 if d < (ins['lo'] + ins['hi']) / 2 else -1
            p = K.p(d)
            out.append((bar_beat + o / 4, l / 4, p)); prev_pitch[0] = p; pd = d
        if add:
            for b, l, p in out: wind(song, ch, b, l, p, vel * (1.08 if b == bar_beat else 1), ins)
        return out

    def section_melody(t0, nbar, chords, vel, ch, ins, vary=0, harm=None):
        notes = []
        for ph in range(nbar // 2):
            b0 = t0 + ph * 2 * bb
            r1 = mrh if (ph % 2 == 0 or rng.random() < .35) and not (vary and ph == 2) else rng.choice(rbank)
            last = ph == nbar // 2 - 1
            notes += melody_bar(b0, r1, chords[ph * 2], None, vel, ch, ins)
            re = rng.choice(rend)
            cad = 0 if last else (chords[ph * 2 + 1] if ph % 2 == 0 else chords[ph * 2 + 1] + step)
            notes += melody_bar(b0 + bb, re, chords[ph * 2 + 1], None, vel, ch, ins, cad=cad, inv=ph % 2 == 1)
        return notes

    def wind(sg, ch, b, l, p, vel, ins):
        sg.note(ch, b, l * .96, p, vel)
        if ins.get('scoop') and l >= .5 and rng.random() < .45:
            sg.bend(ch, b - .01, -2600); sg.bend(ch, b + .06, -1200); sg.bend(ch, b + .13, 0)
        if ins.get('vib') and l >= 1:
            sg.cc(ch, b, 1, 0); sg.cc(ch, b + l * .4, 1, 34); sg.cc(ch, b + l * .8, 1, 52); sg.cc(ch, b + l, 1, 0)
        if ins.get('orn') and l >= 1 and rng.random() < .5:  # quick turn before the long note ends
            q = b + l * .55; sg.note(ch, q, .12, K.p(K.deg_of(p) + 1), vel * .7); sg.note(ch, q + .12, .12, p, vel * .7)

    t = 0.0
    total_bars = sum(n for _, n in sections)
    for si, (sec, nb) in enumerate(sections):
        chords = (bprog * 2)[:nb] if sec == 'bridge' else [prog[i % len(prog)] for i in range(nb)]
        dyn = {'intro': .92, 'A': 1.0, 'B': 1.08, 'bridge': .92}[sec]
        for bi in range(nb):
            bt = t + bi * bb; root = chords[bi]; degs = chord_of(root)
            # pad: held chord with a swell (expression)
            pd = st.get('pad')
            if pd:
                ch = CH['pad']; oc = pd.get('oct', 0) * K.n
                for j, dg in enumerate(degs + [root + K.n]):
                    song.note(ch, bt + j * .01, bb * .99, K.p(dg + oc), pd['vel'] * dyn * (1 if j else 1.06), hum=False)
                song.cc(ch, bt, 11, 70); song.cc(ch, bt + bb * .45, 11, 104); song.cc(ch, bt + bb * .9, 11, 84)
            dr = st.get('drone')
            if dr and bi % 2 == 0:
                ch = CH['drone']; oc = dr.get('oct', 0) * K.n
                for dg in (0, K.n if dr['inst'] == 104 else 4 if K.n == 7 else 3):
                    song.note(ch, bt, bb * 2 * .99, K.p(dg + oc), dr['vel'] * dyn, hum=False)
            bs = st.get('bass')
            if bs and sec != 'intro' or (bs and sec == 'intro' and bi >= 2):
                ch = CH['bass']; oc = (bs.get('oct', -1)) * K.n
                for o, w, l in bs['pat']:
                    if o >= bar16: continue
                    dg = root + (step * 2 if w == '5' else K.n if w == 'o' else 0) + oc
                    v = bs['vel'] * dyn * (1.1 if o == 0 else .9)
                    song.note(ch, bt + o / 4, l / 4 * .9, K.p(dg), v)
            ap = st.get('arp')
            if ap and not (sec == 'B' and st.get('comp') and rng.random() < .0):
                ch = CH['arp']
                for o, ci, oc, l in ARP[ap['pat']]:
                    if o >= bar16: continue
                    dg = degs[ci % 3] + oc * K.n
                    v = ap['vel'] * dyn * (1.12 if o == 0 else 1)
                    song.note(ch, bt + o / 4, l / 4, K.p(dg), v)
            os_ = st.get('ost')
            if os_ and (sec != 'intro' or bi >= 1):
                ch = CH['ost']; oc = os_.get('oct', 0) * K.n
                for o, dd, l in os_['pat']:
                    if o >= bar16: continue
                    dur = l / 4 * (.55 if os_.get('short') else .92)
                    v = os_['vel'] * dyn * (1.15 if o % 4 == 0 else .92)
                    song.note(ch, bt + o / 4, dur, K.p(root + dd + oc), v)
            cp = st.get('comp')
            if cp and sec in ('A', 'B'):
                ch = CH['comp']
                for o, l in cp['pat']:
                    if o >= bar16: continue
                    if cp.get('single'):
                        song.note(ch, bt + o / 4, l / 4 * .8, K.p(degs[(o // 2) % 3] + K.n), cp['vel'] * dyn); continue
                    for j, dg in enumerate(degs):
                        song.note(ch, bt + o / 4 + j * .018, l / 4 * .85, K.p(dg), cp['vel'] * dyn * (1 - j * .06))
                    if cp.get('trem'):
                        song.note(ch, bt + o / 4 + l / 8, l / 8, K.p(degs[2] + K.n), cp['vel'] * .7 * dyn)
            gl = st.get('glock')
            if gl and sec == 'B' and bi % 2 == 1:
                song.program(CH['glock'], gl['inst'])
                song.note(CH['glock'], bt, 1.5, K.p(degs[2] + 2 * K.n), gl['vel'])
            ck = st.get('chime')
            if ck and bi % 4 == 0:
                for j in range(5): song.note(CH['chime'], bt + 2 + j * .09, 1.2, K.p(degs[j % 3] + 2 * K.n + j // 3), ck['vel'] - j * 4)
            pc = st.get('perc')
            if pc and sec in ('A', 'B', 'bridge'):
                pat = pc['B' if sec == 'B' else 'A']
                k = .7 if sec == 'bridge' else 1
                for o, nt, v in pat:
                    if o >= bar16: continue
                    if sec == 'bridge' and o % 8: continue
                    song.note(9, bt + o / 4, .1, nt, v * k * dyn)
            tk = st.get('taiko')
            if tk and sec in ('A', 'B') or (tk and sec == 'bridge' and bi == nb - 1):
                for o, v in tk['pat']:
                    if o >= bar16: continue
                    song.note(CH['taiko'], bt + o / 4, .5, 48 if tk['inst'] == 116 else 45, v * dyn)
            if st.get('crash') and bi == 0 and sec in ('A', 'B'):
                song.note(9, bt, .5, 49, 96)
            ty = st.get('tymp')
            if ty and bi == nb - 1 and sec in ('intro', 'A', 'bridge'):  # roll into the next section
                ch = CH['tymp']
                n = 10
                for j in range(n):
                    song.note(ch, bt + bb - 1.2 + j * 1.2 / n, .2, K.p(-K.n * 2 + (0 if sec != 'bridge' else 0)), ty['vel'] * (.35 + .65 * j / n))
        # melodies
        if sec in ('A', 'B'):
            ins = dict(m); vel = m['vel'] * dyn
            notes = section_melody(t, nb, chords, vel, CH['mel'], ins, vary=sec == 'B')
            m2 = st.get('mel2')
            if sec == 'B' and m2:
                for b, l, p in notes:
                    d = K.deg_of(p) + m2.get('harm', 0) + m2.get('oct', 0) * K.n
                    wind(song, CH['mel2'], b + .005, l, K.p(d), m2['vel'] * dyn, dict(m2, lo=-99, hi=99))
        elif sec == 'bridge':
            m2 = st.get('mel2') or m
            ins = dict(m2, lo=m['lo'] - 2, hi=m['hi'] - 2)
            prev_pitch[0] = K.p(centre - 2)
            for ph in range(nb // 2):
                b0 = t + ph * 2 * bb
                melody_bar(b0 + bb * .5, [(0, 4), (4, 4), (8, 8)] if bar16 == 16 else [(0, 4), (4, 8)], chords[ph * 2], None,
                           m2['vel'] * .85, CH['mel2'], dict(ins, lo=m['lo'], hi=m['hi']), cad=None)
        t += nb * bb
    return song, t, total_bars

# ----------------------------------------------------------------- render + mix
def repeat_song(song, L):
    """the same loop three times, back to back (tempo map + programs once)."""
    for ch in list(song.ev):
        ev = song.ev[ch]; Lt = int(round(L * TPB))
        song.ev[ch] = ev + [(t + Lt, d) for t, d in ev] + [(t + 2 * Lt, d) for t, d in ev]

def impulse(rt, seed):
    r = np.random.default_rng(seed); n = int(SR * rt * 1.2); tt = np.arange(n) / SR
    env = np.exp(-6.9 * tt / rt)
    ir = np.zeros((n, 2))
    for c in range(2):
        x = r.standard_normal(n) * env
        # darker as it decays: blend a lowpassed copy in over time
        lp = sosfilt(butter(2, 3200, fs=SR, output='sos'), x)
        w = np.clip(tt / (rt * .6), 0, 1)
        ir[:, c] = x * (1 - w) + lp * w
    pre = int(SR * .018)
    ir = np.vstack([np.zeros((pre, 2)), ir])
    for k in range(6):  # a few early reflections
        d = int(SR * r.uniform(.006, .045)); ir[d, :] += r.uniform(.3, .7) * np.array([r.uniform(.6, 1), r.uniform(.6, 1)])
    return ir / np.sqrt((ir ** 2).sum(0, keepdims=True))

def render(name, st):
    song, L_beats, bars = compose(name, st)
    # fluidsynth applies MIDI events on 64-sample blocks: make the loop a whole number of blocks
    # (integer µs a beat, loop samples % 64 == 0) so all three copies render the same samples
    Lb = int(round(L_beats)); stp = 640000 // math.gcd(Lb, 640000)
    song.us = max(stp, int(round(60e6 / st['tempo'] / stp)) * stp)
    L = Lb * song.us / 1e6
    repeat_song(song, L_beats)
    tmp = KEEP or tempfile.mkdtemp()
    os.makedirs(tmp, exist_ok=True)
    mid = os.path.join(tmp, name + '.mid'); raw = os.path.join(tmp, name + '.raw')
    song.write(mid)
    subprocess.run([FS, '-ni', '-q', '-R', '1', '-C', '0', '-g', '0.5', '-r', str(SR), '-T', 'raw', '-O', 's16', '-F', raw, SF, mid],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    a = np.fromfile(raw, dtype='<i2').astype(np.float64).reshape(-1, 2) / 32768
    # gentle low cut, then the hall
    a = sosfilt(butter(2, 35, 'hp', fs=SR, output='sos'), a, axis=0)
    ir = impulse(st['rt'], st['seed'])
    wet = np.stack([fftconvolve(a[:, c], ir[:, c])[:len(a)] for c in range(2)], 1)
    wet = sosfilt(butter(1, 180, 'hp', fs=SR, output='sos'), wet, axis=0)
    mix = a * .82 + wet * (.30 if st['rt'] < 3 else .4)
    # loop slice: middle copy + XF seconds of the third
    s0 = int(round(L * SR)); s1 = int(round((2 * L + XF) * SR))
    seg = mix[s0:s1]
    # loudness: RMS of the loop body to -19 dBFS, then a soft knee limiter at -1.5 dBFS
    rms = np.sqrt((seg[:int(L * SR)] ** 2).mean())
    seg = seg * (10 ** (-19 / 20) / max(rms, 1e-6))
    lim = 10 ** (-1.5 / 20)
    seg = np.where(np.abs(seg) > lim * .7, np.sign(seg) * (lim * .7 + (lim * .3) * np.tanh((np.abs(seg) - lim * .7) / (lim * .3))), seg)
    os.makedirs(OUT, exist_ok=True)
    wav = os.path.join(tmp, name + '.wav')
    pcm = (np.clip(seg, -1, 1) * 32767).astype('<i2')
    import wave
    with wave.open(wav, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    mp3 = os.path.join(OUT, name + '.mp3')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-c:a', 'libmp3lame', '-b:a', '128k', mp3], check=True)
    peak = np.abs(seg).max()
    print(f'{name:10s} loop {L:5.1f}s  bars {bars}  peak {20*np.log10(peak):5.1f} dBFS  {os.path.getsize(mp3)//1024} KB')
    return round(L, 4)

def main():
    names = NAMES or list(S)
    lst = os.path.join(OUT, 'list.js'); meta = {}
    if os.path.exists(lst):
        try: meta = json.loads(open(lst).read().split('=', 1)[1].rstrip().rstrip(';'))
        except Exception: meta = {}
    for n in names: meta[n] = [render(n, S[n]), XF]
    with open(lst, 'w') as f: f.write('window.MUS_L=' + json.dumps(meta, separators=(',', ':')) + ';\n')

if __name__ == '__main__':
    main()
