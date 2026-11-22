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
    """C gems on the pole (5 chosen) + skill gems on the base (5 chosen), owner 2026-11-21: 5 rarities, special-stat slots that open with the
    gem's level, numbers that grow with level. Keep QP / SLOTS / PITY / costs in step with gem_data.js (QUAL, COST, SGEM, SLOT_LV)."""
    import random,statistics as st
    R=random.Random(3)
    QP=[.50,.30,.14,.05,.01];BASE=[1,1,2,2,3];PE,PL=20,50
    lvEss=lambda l:round(6+2.4*l);sEss=lambda l:round(3+1.2*l);BRK={10:1,20:1,30:2,40:2};CAP=50
    def q(v,k): v=sorted(v);return v[min(len(v)-1,int(len(v)*k))]
    def run():
        want=[(1,0),(2,0),(3,0),(4,0),(4,1)]          # (tier, which of its 3 gems)
        own={};pity=[0,0];stones={1:0,2:0,3:0,4:0};frag={1:0,2:0,3:0,4:0};ess=0;day=0;done={}
        sk=[{'lv':1,'q':None} for _ in range(5)]          # the 5 skill gems: extracted on day 1 (first free), then re-extracted below epic
        def roll():
            pity[0]+=1;pity[1]+=1;x=R.random();qq=0
            for i in (4,3,2,1,0):
                x-=QP[i]
                if x<0: qq=i;break
            if pity[1]>=PL: qq=4
            elif pity[0]>=PE and qq<3: qq=3
            if qq>=3: pity[0]=0
            if qq==4: pity[1]=0
            return qq
        def gain(key,qq):
            o=own.get(key)
            if not o: own[key]={'lv':1,'q':qq,'dup':0};return
            o['dup']+=1
            if qq>o['q']: o['q']=qq                    # the better roll is kept (the old one is the spare)
        while len(done)<7 and day<720:
            day+=1
            stones[4]+=7
            for t in (1,2,3): stones[t]+=3
            ess+=160
            for g in sk:
                if g['q'] is None: g['q']=roll()
            # re-extract a skill gem below มหากาพย์ first (2 tier-2 stones + 20 essence a try, top band), the rest of the stones carve C gems
            for g in sk:
                while g['q']<3 and stones[2]>=2 and ess>=20: stones[2]-=2;ess-=20;g['q']=max(g['q'],roll())
            for t in (1,2,3,4):
                while stones[t]>=3:
                    stones[t]-=3;g=R.randrange(3);gain((t,g),roll())
            for key,o in own.items():
                need=0 if key not in want else sum(v for l,v in BRK.items() if l>=o['lv'])
                while o['dup']>need: o['dup']-=1;frag[key[0]]+=5;ess+=3
            for key in want:
                if key not in own and frag[key[0]]>=40: frag[key[0]]-=40;gain(key,roll())
            ch=True
            while ch:
                ch=False
                for key in sorted(want,key=lambda k:own.get(k,{'lv':99})['lv']):
                    o=own.get(key)
                    if not o or o['lv']>=CAP: continue
                    c=lvEss(o['lv']);b=BRK.get(o['lv'],0)
                    if ess>=c and o['dup']>=b: ess-=c;o['dup']-=b;o['lv']+=1;ch=True
                for g in sorted(sk,key=lambda g:g['lv']):      # skill gems: half the essence, stones at the breakthroughs (plenty at Lv 90+)
                    if g['lv']<CAP and ess>=sEss(g['lv']): ess-=sEss(g['lv']);g['lv']+=1;ch=True
            def mark(k,c):
                if c and k not in done: done[k]=day
            mark('board',all(k in own for k in want))
            mark('lv20',all(own.get(k,{'lv':0})['lv']>=20 for k in want))
            mark('epic',all(own.get(k,{'q':0})['q']>=3 for k in want))
            mark('legend',all(own.get(k,{'q':0})['q']==4 for k in want))
            mark('lv50',all(own.get(k,{'lv':0})['lv']>=CAP for k in want))
            mark('sepic',all(g['q']>=3 for g in sk))
            mark('slv50',all(g['lv']>=CAP for g in sk))
        return done
    runs=[run() for _ in range(300)]
    for k,nm in [('board','5 chosen C gems owned'),('lv20','C gems all Lv 20'),('epic','C gems all มหากาพย์+'),('legend','C gems all ตำนาน'),
                 ('lv50','C gems all Lv 50'),('sepic','skill gems all มหากาพย์+'),('slv50','skill gems all Lv 50')]:
        v=[r.get(k,720) for r in runs];print(f'  {nm:28s} median {q(v,.5):4d} days · unlucky (1 in 10) {q(v,.9):4d}')
    # rolls needed with the two pity counters
    def need(target):
        c=[]
        for _ in range(20000):
            p=[0,0];n=0
            while True:
                n+=1;p[0]+=1;p[1]+=1;x=R.random();qq=0
                for i in (4,3,2,1,0):
                    x-=QP[i]
                    if x<0: qq=i;break
                if p[1]>=PL: qq=4
                elif p[0]>=PE and qq<3: qq=3
                if qq>=3: p[0]=0
                if qq==4: p[1]=0
                if qq>=target: break
            c.append(n)
        return st.mean(c),q(c,.9)
    for t,nm in [(2,'หายาก+'),(3,'มหากาพย์+'),(4,'ตำนาน')]:
        m,p9=need(t);print(f'  rolls to a {nm:9s} mean {m:5.1f} · unlucky (1 in 10) {p9}')

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
    SSLV=[10,20,30,40,50];PLV=[60,70,80,90,99]   # DESIGN levels of the holes: their goods / zeny bands. Since the Lv 60 cap the pole tiers open at game Lv 52/54/56/58/60 (level_cap.js) but still take these bands
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
    # skill gems (gem_data.js EXTRACT): one extraction per skill before it can sit in a skill hole; the first one is free
    EXT=[(9,1500,[('tstone1',1),('tess',3)]),(19,4000,[('tstone1',1),('tess',6)]),(29,9000,[('tstone1',2),('tess',10)]),(39,16000,[('tstone2',1),('tess',14)]),(99,28000,[('tstone2',2),('tess',20)])]
    print('SKILL GEMS (extract a learned skill once before it goes on the base; first one free) — by the level the skill is learned at')
    lo=1
    for hi,z,it in EXT:
        d=dict(it);buy=sum(PRICE.get(k,0)*v for k,v in it);lv=max(10,min(hi,50))
        h=max(d.get('tess',0)/(.03*KPH),(z+buy)/((10+3*lv)*KPH))
        print(f'  skill learned Lv {lo:2d}–{min(hi,99):2d}: {" + ".join(f"{k} ×{v}" for k,v in it)} + {z:,}z  → ~{h*60:3.0f} min');lo=hi+1

a=sys.argv[1:] or ['refine','gems']
if 'carve' in a: carve_part()
if 'refine' in a: print('REFINE v2 (−1 + break below +10 · break only above · pity +1 %/fail cap 10 % above +10 · Star Ore 1…5 per try)');refine_part()
if 'gems' in a: print('GEMS v3 (one hero, 5 chosen C gems + 5 skill gems, 1.5 h a day at Lv 90+; 5 rarities, pity 20 / 50)');gems_part()
