"""Long-term systems as built 2026-11-21 (GEAR_GEM_LONGTERM_TH.md · numbers in items.js REFINE_CHANCE / gem_data.js).
python3 tools/longterm_sim.py [refine|gems|carve]   — pure Monte Carlo, no game code. Re-run after changing those tables."""
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
    
def carve_part():
    """Carving the totem holes (gem_data.js CARVE, owner 2026-11-21). Keep this table in step with gem_data.js.
    Time per hole = max(materials hours, zeny hours): drops come in while farming the hole's level band
    (KPH kills an hour, matA .20 · matB .05 · essence .015 × 2 · zeny 10 + 3·Lv a kill) and the stones / shards /
    star ore are bought at the market price with that zeny (they also drop, which only makes it faster)."""
    KPH=700
    PRICE={'tstone1':2000,'tstone2':6000,'tstone3':15000,'tstone4':40000,'tfrag3':6000,'tfrag4':16000,'sore':50000}
    S=[None,(8000,[('ma',30),('mb',6),('tstone1',2),('tess',8)]),(25000,[('ma',45),('mb',10),('tstone2',2),('tess',15)]),
       (50000,[('ma',60),('mb',14),('tstone2',3),('tess',24)]),(90000,[('ma',80),('mb',18),('tstone2',4),('tess',35)])]
    U=[(2000,[('ma',15),('mb',3),('tess',3)]),(5000,[('ma',20),('mb',5),('tess',5)]),(12000,[('ma',30),('mb',7),('tstone2',1),('tess',8)]),
       (25000,[('ma',40),('mb',9),('tstone2',1),('tess',12)]),(45000,[('ma',50),('mb',12),('tstone2',2),('tess',16)])]
    P=[(150000,[('ma',100),('mb',25),('tstone3',3),('tess',50)]),(250000,[('ma',120),('mb',30),('tstone3',4),('tess',70),('sore',1)]),
       (400000,[('ma',140),('mb',35),('tstone3',5),('tess',90),('sore',2)]),(600000,[('ma',160),('mb',40),('tstone4',3),('tess',120),('sore',3)]),
       (900000,[('ma',180),('mb',45),('tstone4',5),('tess',150),('sore',4)])]
    Q=[(50000,[('ma',40),('mb',10),('tfrag3',8),('tess',20)]),(80000,[('ma',50),('mb',12),('tfrag3',12),('tess',28)]),
       (120000,[('ma',60),('mb',15),('tfrag3',16),('tess',36),('sore',1)]),(180000,[('ma',70),('mb',18),('tfrag4',10),('tess',45),('sore',1)]),
       (250000,[('ma',80),('mb',20),('tfrag4',14),('tess',55),('sore',2)])]
    SSLV=[10,20,30,40,50];PLV=[60,70,80,90,99]
    tot={'tess':0,'z':0,'h':0}
    def row(name,lv,c,n=1):
        if not c: print(f'  {name:34s} Lv {lv:2d}  free');return
        z,it=c;d=dict(it);buy=sum(PRICE.get(k,0)*v for k,v in it)
        mat_h=max(d.get('ma',0)/(.20*KPH),d.get('mb',0)/(.05*KPH),d.get('tess',0)/(.03*KPH))
        z_h=(z+buy)/((10+3*lv)*KPH);h=max(mat_h,z_h)
        tot['tess']+=d.get('tess',0)*n;tot['z']+=z*n;tot['h']+=h*n
        print(f'  {name:34s} Lv {lv:2d}  essence {d.get("tess",0):3d} · {z:7,d}z + market {buy:7,d}z  → ~{h*60:4.0f} min{" (×2 holes)" if n>1 else ""}')
    print(f'CARVING THE TOTEM HOLES (farming {KPH} kills an hour in the hole\'s level band; stones / shards / star ore bought with the zeny)')
    for i in range(5):
        row(f'skill hole {i+1} (+ gold hole)',SSLV[i],S[i]);row(f'  its teal support hole',SSLV[i],U[i],2)
    for i,nm in enumerate(['bear','owl','wolf','eagle','thunderbird']):
        row(f'pole tier {i+1} {nm} (+ inner mutation)',PLV[i],P[i]);row('  its outer support hole',PLV[i],Q[i],2)
    print(f'  all 29 carvings: essence {tot["tess"]:,} · zeny {tot["z"]:,} (without market buys) · ~{tot["h"]:.0f} h of farming in total')

a=sys.argv[1:] or ['refine','gems']
if 'carve' in a: carve_part()
if 'refine' in a: print('REFINE v2 (−1 + break below +10 · break only above · pity +1 %/fail cap 10 % above +10 · Star Ore 1…5 per try)');refine_part()
if 'gems' in a: print('GEMS v2 (one hero, board of 5 chosen gems, 1.5 h a day at Lv 90+)');gems_part()
