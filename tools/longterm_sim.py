"""First-pass numbers for the long-term plan (refine v2 + gem farming). Pure Monte Carlo, no game code."""
import random,statistics as st
R=random.Random(7)
BASE=[1,1,1,1,1,.9,.8,.65,.5,.4,.35,.30,.25,.20,.15]     # chance to go r -> r+1
def refine(start,goal,pity=.05,drop=True):
    r=start;best=start;p=0;tries=0;rep=0
    while r<goal:
        tries+=1;ch=min(1,BASE[r]+pity*p)
        if R.random()<ch:
            r+=1
            if r>best: best=r;p=0
        else:
            p+=1;rep+=1
            if drop and r>5: r-=1
    return tries,rep
def q(v,k): v=sorted(v);return v[min(len(v)-1,int(len(v)*k))]
print('REFINE (fail = -1 and cracked, +5% per fail until a new record)')
for a,b in [(5,10),(10,12),(10,15),(5,15)]:
    T=[refine(a,b) for _ in range(20000)];t=[x[0] for x in T];r=[x[1] for x in T]
    print(f'  +{a} -> +{b}: tries mean {st.mean(t):6.1f} median {q(t,.5):4d} P90 {q(t,.9):4d} · repairs mean {st.mean(r):5.1f} P90 {q(r,.9):3d}')
print('  no pity, same rule:')
for a,b in [(5,10),(10,15)]:
    T=[refine(a,b,pity=0) for _ in range(4000)];t=[x[0] for x in T]
    print(f'  +{a} -> +{b}: tries mean {st.mean(t):8.1f} median {q(t,.5):6d} P90 {q(t,.9):6d}')
# ---------------- gems
RATE={1:8,2:5,3:2,4:.7}                 # raw stones a day (1.5 h of play at Lv 90+)
BOARD=[1,2,3,3,4]                       # tiers of the five main gems on the board
CORE={1:1,2:2,3:4,4:8}                  # cores from grinding one raw stone
LV5=[5,10,20,40];STAR_D=[1,1,2,2,3];STAR_C=[100,150,220,300,400];LINE_UP=[6,12,24,48]
def gem_run():
    stones={t:0. for t in RATE};cores=0;day=0
    g=[dict(t=t,have=False,q=0,pity=0,dupe=0,lv=1,lines=[]) for t in BOARD];done={}
    def carve(x):
        x['pity']+=1;r=R.random();ql=3 if (r<.05 or x['pity']>=20) else 2 if r<.30 else 1
        if ql==3: x['pity']=0
        return ql
    while len(done)<6 and day<1500:
        day+=1
        for t in RATE:
            n=RATE[t];k=int(n)+(1 if R.random()<n-int(n) else 0);stones[t]+=k
        def one(x):
            stones[x['t']]-=3;ql=carve(x)
            if not x['have']: x['have']=True;x['q']=ql;x['lines']=[1]*ql
            elif ql>x['q']: x['dupe']+=1;x['q']=ql;x['lines']=[1]*ql      # old one becomes a duplicate
            else: x['dupe']+=1
        for x in g:                                   # 1) a gem for every socket first
            if not x['have'] and stones[x['t']]>=3: one(x)
        go=True
        while go:                                     # 2) then chase legend / duplicates, taking turns
            go=False
            for x in sorted(g,key=lambda x:(x['q'],x['dupe'])):
                if x['have'] and stones[x['t']]>=3 and (x['q']<3 or x['dupe']<sum(STAR_D)) and all(y['have'] or y['t']!=x['t'] for y in g): one(x);go=True
        # tiers with nothing left to carve: grind the stones
        for t in RATE:
            if all(x['q']==3 and x['dupe']>=sum(STAR_D) for x in g if x['t']==t) or t not in BOARD:
                cores+=stones[t]*CORE[t];stones[t]=0
        # spend cores: levels 1-5, then line ranks, then stars
        ch=True
        while ch:
            ch=False
            for x in g:
                if x['have'] and x['lv']<5 and cores>=LV5[x['lv']-1]: cores-=LV5[x['lv']-1];x['lv']+=1;ch=True
            if all(x['lv']>=5 for x in g):
                for x in g:
                    for i,l in enumerate(x['lines']):
                        if l<5 and cores>=LINE_UP[l-1]: cores-=LINE_UP[l-1];x['lines'][i]+=1;ch=True
                if all(all(l==5 for l in x['lines']) for x in g if x['q']==3) and all(x['q']==3 for x in g):
                    for x in g:
                        if 5<=x['lv']<10:
                            s=x['lv']-5
                            if x['dupe']>=STAR_D[s] and cores>=STAR_C[s]: x['dupe']-=STAR_D[s];cores-=STAR_C[s];x['lv']+=1;ch=True
        def mark(k,c):
            if c and k not in done: done[k]=day
        mark('board',all(x['have'] for x in g));mark('lv5',all(x['lv']>=5 for x in g));mark('legend',all(x['q']==3 for x in g))
        mark('lines',all(x['q']==3 and all(l==5 for l in x['lines']) for x in g));mark('lv10',all(x['lv']>=10 for x in g))
        mark('one10',any(x['lv']>=10 for x in g))
    return done
runs=[gem_run() for _ in range(600)]
print('GEMS (days of play, 1.5 h a day, stones a day',RATE,')')
for k,nm in [('board','5 main gems carved'),('lv5','all five at Lv 5'),('legend','all five legend (3 lines)'),('lines','all 15 lines at rank V'),('one10','first gem at Lv 10'),('lv10','all five at Lv 10')]:
    v=[r.get(k,1500) for r in runs];print(f'  {nm:28s} median {q(v,.5):4d} · unlucky (P90) {q(v,.9):4d}')
c=[0]*4
