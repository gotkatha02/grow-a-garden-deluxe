"""Long-term systems as built 2026-11-21 (GEAR_GEM_LONGTERM_TH.md · numbers in items.js REFINE_CHANCE / gem_data.js).
python3 tools/longterm_sim.py [refine|gems]   — pure Monte Carlo, no game code. Re-run after changing those tables."""
import sys
def refine_part():
    import random,statistics as st
    R=random.Random(5)
    def q(v,k): v=sorted(v);return v[min(len(v)-1,int(len(v)*k))]
    LO=[1,1,1,1,1,.9,.8,.65,.5,.4]
    def run(hi,start,goal,pity=.01,cap=.10):
        r=start;p=0;tries=0;brk=0;ore=0
        while r<goal:
            tries+=1
            if r>=10: ore+=r-9
            ch=LO[r] if r<10 else min(1,hi[r-10]+min(cap,pity*p))
            if R.random()<ch: r+=1;p=0
            else:
                p+=1
                if r>=5: brk+=1
                if 5<=r<10: r-=1          # +6..+10: fail = -1 and broken; +11..+15: fail = broken only
        return tries,brk,ore
    for hi in [[.20,.12,.08,.05,.03],[.20,.15,.10,.06,.04],[.25,.15,.10,.07,.05]]:
        T=[run(hi,10,15) for _ in range(20000)];t=[x[0] for x in T];b=[x[1] for x in T];o=[x[2] for x in T]
        print(hi,f"+10→+15: tries mean {st.mean(t):.0f} med {q(t,.5)} P90 {q(t,.9)} · breaks {st.mean(b):.0f} · star ore mean {st.mean(o):.0f} med {q(o,.5)} P90 {q(o,.9)}")
    T=[run([.2,.12,.08,.05,.03],0,10) for _ in range(20000)];t=[x[0] for x in T];b=[x[1] for x in T]
    print(f"+0→+10: tries mean {st.mean(t):.1f} med {q(t,.5)} P90 {q(t,.9)} · breaks mean {st.mean(b):.1f} P90 {q(b,.9)}")
    
def gems_part():
    import random,statistics as st
    R=random.Random(3)
    QP=[.70,.25,.05];LINES={0:1,1:2,2:3};PITY=20
    lvEss=lambda l:round(6+2.4*l);BRK={10:1,20:1,30:2,40:2};CAP=50
    RANK=[6,12,24,48]
    def q(v,k): v=sorted(v);return v[min(len(v)-1,int(len(v)*k))]
    def run():
        want=[(1,0),(2,0),(3,0),(4,0),(4,1)]          # (tier, which of its 3 gems)
        own={};pity=0;stones={1:0,2:0,3:0,4:0};frag={1:0,2:0,3:0,4:0};ess=0;day=0;done={}
        def roll():
            nonlocal pity
            pity+=1;x=R.random();qq=2 if x<.05 else 1 if x<.30 else 0
            if pity>=PITY: qq=2
            if qq==2: pity=0
            return qq
        def gain(key,qq):
            o=own.get(key)
            if not o: own[key]={'lv':1,'q':qq,'dup':0,'ranks':[R.choice([1,1,1,2,2,3]) for _ in range(LINES[qq])]};return
            if qq>o['q']: o['q']=qq;o['ranks']=[R.choice([1,1,1,2,2,3]) for _ in range(LINES[qq])];o['dup']+=1
            else: o['dup']+=1
        while len(done)<5 and day<720:
            day+=1
            stones[4]+=7+(1 if R.random()<.0 else 0)
            for t in (1,2,3): stones[t]+=3
            ess+=60+100
            for t in (1,2,3,4):
                while stones[t]>=3:
                    stones[t]-=3;g=R.randrange(3);gain((t,g),roll())
            # dismantle spares of gems we do not want, and spares beyond what breakthroughs need
            for key,o in own.items():
                need=0 if key not in want else sum(v for l,v in BRK.items() if l>=o['lv'])
                while o['dup']>need: o['dup']-=1;frag[key[0]]+=5;ess+=3
            # craft a wanted gem we still miss from shards
            for key in want:
                if key not in own and frag[key[0]]>=40: frag[key[0]]-=40;gain(key,roll())
            # spend essence: levels first (lowest first), then line ranks
            ch=True
            while ch:
                ch=False
                for key in sorted(want,key=lambda k:own.get(k,{'lv':99})['lv']):
                    o=own.get(key)
                    if not o or o['lv']>=CAP: continue
                    c=lvEss(o['lv']);b=BRK.get(o['lv'],0)
                    if ess>=c and o['dup']>=b: ess-=c;o['dup']-=b;o['lv']+=1;ch=True
                if all(own.get(k,{'lv':0})['lv']>=CAP for k in want):
                    for key in want:
                        o=own[key]
                        for i,r in enumerate(o['ranks']):
                            if r<5 and ess>=RANK[r-1]: ess-=RANK[r-1];o['ranks'][i]+=1;ch=True
            def mark(k,c):
                if c and k not in done: done[k]=day
            mark('board',all(k in own for k in want))
            mark('lv20',all(own.get(k,{'lv':0})['lv']>=20 for k in want))
            mark('lv50',all(own.get(k,{'lv':0})['lv']>=CAP for k in want))
            mark('legend',all(own.get(k,{'q':0})['q']==2 for k in want))
            mark('ranks',all(k in own and own[k]['q']==2 and all(r==5 for r in own[k]['ranks']) for k in want))
        return done
    runs=[run() for _ in range(400)]
    for k,nm in [('board','5 chosen gems owned'),('lv20','all five Lv 20'),('lv50','all five Lv 50 (cap)'),('legend','all five legend (3 lines)'),('ranks','legend + all 15 lines rank V')]:
        v=[r.get(k,720) for r in runs];print(f'  {nm:30s} median {q(v,.5):4d} days · unlucky (1 in 10) {q(v,.9):4d}')
    
a=sys.argv[1:] or ['refine','gems']
if 'refine' in a: print('REFINE v2 (−1 + break below +10 · break only above · pity +1 %/fail cap 10 % above +10 · Star Ore 1…5 per try)');refine_part()
if 'gems' in a: print('GEMS v2 (one hero, board of 5 chosen gems, 1.5 h a day at Lv 90+)');gems_part()
