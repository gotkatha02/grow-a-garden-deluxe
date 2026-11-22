"""Special-drop yields (drop_table.js) — what a map gives per 1,000 kills and the best map for every stone / orb in every tier.
python3 tools/drop_yield.py [md]   (needs the game served on :8765, or it serves the repo itself; md = Markdown tables for DROP_TABLE_TH.md)
Spawn share per monster = its m.w (critter 3 · normal / swift 2 · brute 1, maps/monster-roster.js); a monster's level is spread evenly over
its range, so a range that crosses a tier boundary (Lv 18/19, 36/37, 54/55) drops both tiers in proportion."""
import asyncio,json,sys,os,time,subprocess,socket,collections
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def up(port):
    s=socket.socket();s.settimeout(.5)
    try:s.connect(('127.0.0.1',port));return True
    except OSError:return False
    finally:s.close()
async def grab():
    srv=None
    if not up(8765):srv=subprocess.Popen([sys.executable,'-m','http.server','8765'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch();pg=await b.new_page()
            await pg.goto('http://localhost:8765/index.html?char=wolf&map=vikF2&nosw=1&cb=%d'%time.time());await pg.wait_for_timeout(9000)
            d=await pg.evaluate("""()=>{const out=[];const Z=window.MAP_ZONE||{},M=window.VK_MAPS||{},D=DROPTAB;
              for(const id in VK_MONS)for(const m of VK_MONS[id])out.push({map:id,mapTh:(M[id]&&(M[id].th||M[id].name))||id,name:m.name,th:m.th,role:m.role,w:m.w??2,lv:m.lv,code:D.code(m.name),rate:D.rate(D.code(m.name),m.role)});
              return {mons:out,rate:D.RATE,mul:D.ROLE_MUL};}""")
            await b.close();return d
    finally:
        if srv:srv.terminate()
def tier(L):return 1 if L<=18 else 2 if L<=36 else 3 if L<=54 else 4
def tiers(lv):
    a,b=lv;n=b-a+1;c=collections.Counter(tier(L) for L in range(a,b+1));return {t:k/n for t,k in c.items()}
LAB={'w':'หินตีบวกอาวุธ','a':'หินตีบวกชุดเกราะ'}
STAT={'str':'STR','agi':'AGI','vit':'VIT','int':'INT','dex':'DEX','luk':'LUK','def':'DEF'}
def lab(c):return LAB.get(c) or 'หินออฟ '+STAT[c[2:]]
def main():
    D=asyncio.run(grab());M=D['mons'];md='md' in sys.argv[1:]
    by=collections.defaultdict(list)
    for m in M:by[m['map']].append(m)
    per={}   # map → {(code,tier): per 1,000 kills}
    for mp,L in by.items():
        W=sum(m['w'] for m in L) or 1;y=collections.Counter()
        for m in L:
            if not m['code']:continue
            for t,f in tiers(m['lv']).items():y[(m['code'],t)]+=1000*m['w']/W*m['rate']*f
        per[mp]=y
    best=collections.defaultdict(list)
    for mp,y in per.items():
        for k,v in y.items():best[k].append((v,mp))
    import re
    name={m['map']:(re.sub(r"\s+[A-Z][A-Za-z' ]+$",'',m['mapTh']).strip() or m['map']) for m in M}   # Thai name only
    codes=['w','a']+['o:'+s for s in STAT]
    if md:
        print('| ของ | ขั้น 1 (Lv 1–18) | ขั้น 2 (Lv 19–36) | ขั้น 3 (Lv 37–54) | ขั้น 4 (Lv 55–60) |\n|---|---|---|---|---|')
        for c in codes:
            row=[lab(c)]
            for t in (1,2,3,4):
                L=sorted(best.get((c,t),[]),reverse=True)[:2]
                row.append(' · '.join(f'{name[mp]} ({mp}) {v:.0f}' for v,mp in L) or '–')
            print('| '+' | '.join(row)+' |')
    else:
        for c in codes:
            print(lab(c))
            for t in (1,2,3,4):
                L=sorted(best.get((c,t),[]),reverse=True)[:3]
                print(f'  T{t}: '+(' · '.join(f'{mp} {v:.0f}' for v,mp in L) or '-'))
    # average over all maps (kills spread evenly over the maps of a tier)
    tot=collections.Counter();n=collections.Counter()
    for mp,L in by.items():
        for t in {tier(L2) for m in L for L2 in range(m['lv'][0],m['lv'][1]+1)}:n[t]+=1
        for k,v in per[mp].items():tot[k]+=v
    print('\nper 1,000 kills, all maps of the tier averaged (stones / orbs of any stat):')
    for t in (1,2,3,4):
        w=tot[('w',t)]/max(1,n[t]);a=tot[('a',t)]/max(1,n[t]);o=sum(v for k,v in tot.items() if k[0].startswith('o:') and k[1]==t)/max(1,n[t])
        print(f'  T{t}: weapon {w:.1f} · armour {a:.1f} · orbs {o:.1f}  ({n[t]} maps)')
main()
