"""build.py WORK : page.html + WORK/heroes.json + WORK/bgs.json -> WORK/pub/index.html"""
import sys, os, json
WORK = sys.argv[1] if len(sys.argv) > 1 else '/tmp/size_tuner'
J = json.load(open(WORK + '/heroes.json')); J['bgs'] = json.load(open(WORK + '/bgs.json'))
data = json.dumps(J, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
s = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'page.html')).read()
assert '/*DATA*/null' in s
open(WORK + '/pub/index.html', 'w').write(s.replace('/*DATA*/null', data)); print('ok', len(data))
