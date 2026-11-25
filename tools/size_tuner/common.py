"""Shared helpers for the hero size tuner (see README.md)."""
import os, re, json
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')) + '/'
SPR = 0.22 * 0.92          # index.html SPR_BASE * MAP_CHAR (field maps)
def obj(s, name):
    m = re.search(r'(?<![A-Za-z0-9_])' + re.escape(name) + r'\s*=', s); i = m.end()
    while s[i] != '{': i += 1
    d = 0
    for j in range(i, len(s)):
        c = s[j]
        if c == '{': d += 1
        elif c == '}':
            d -= 1
            if not d: return json.loads(s[i:j + 1])
def load(js, pre):
    s = open(REPO + js).read(); return obj(s, pre + 'SPR_META'), obj(s, pre + 'SPR_ATLAS')
