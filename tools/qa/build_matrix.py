"""Build matrix: every hero (two-way heroes per branch) x 7 stat builds (game presets STR AGI VIT DEX INT + LUK + INT/DEX) at Lv 60,
one page per (hero, branch), presets run one after another in that page. python3 tools/qa/build_matrix.py [RUNS] ; env ONLY=wolf,cat W=2 OUT=file
Since 2026-11-22 (evening) the bench restores the hero state at every reset (balance_bench.js benchSnap / benchRestore), so presets
run one after another in a page no longer drift (check: tools/qa/bench_drift.py). Results: BALANCE_BUILDS_TH.md.
Pure heroes with two same-stat branches (kitsune, bastet, anubis, sheep) are benched per branch too (their scales are per branch)."""
import asyncio,os,sys,json,threading,queue,subprocess
from playwright.async_api import async_playwright
RUNS=int(sys.argv[1]) if len(sys.argv)>1 else 4
BENCH=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','balance_bench.js')
GEN="(k=>{const s=SKILLS[k];return s&&s.br})"
H=[('wolf','A,B',GEN),('jaguar','A,B',GEN),('owl','A,B',GEN),('hippo','A,B',GEN),('dragon','A,B','dCol'),('lion','A,B','lCol'),('raven','A,B','vCol'),
   ('kitsune','A,B',GEN),('bastet','A,B',GEN),('anubis','A,B',GEN),('sheep','A,B',GEN),('croc','all',GEN),('cat','all',GEN),('rhino','all',GEN),('axolotl','all',GEN)]
only=os.environ.get('ONLY')
if only:H=[h for h in H if h[0] in only.split(',')]
BUILDS={'STR':None,'AGI':None,'VIT':None,'DEX':None,'INT':None,
        'LUK':{'str':45,'agi':20,'vit':1,'int':1,'dex':25,'luk':75},'INTDEX':{'str':1,'agi':1,'vit':10,'int':70,'dex':65,'luk':1}}
OUT=os.environ.get('OUT','/tmp/build_matrix.txt')
# SHARES=1: also record who dealt the damage — key 's|g' (single / group run) | coefficient branch hurt() used ('auto' = normal attack)
# | the skill's own branch — so coefficients can be solved for (/home/claude/work/fix4/tune.py style). Totals cover all RUNS.
SHARES=os.environ.get('SHARES')=='1'
SHARE_JS="""()=>{if(window.__shw)return;window.__shw=1;window.__SH={};const H0=hurt,stack=[];
 hurt=function(e,mult,o){o=o||{};const hp0=e&&!e.dead?e.hp:null,fr={e,sub:0};stack.push(fr);let r;try{r=H0.apply(this,arguments);}finally{stack.pop();}
  if(hp0!=null){const d=hp0-e.hp-fr.sub;if(d>0&&d<1e8){for(const f of stack)if(f.e===e)f.sub+=d;
   const key=o.skill||(o.owShot&&o.owShot.key)||window.SKCTX||(player.action&&player.action.skill)||null;
   const cbr=o.auto?'auto':(o.br||(player.action&&player.action.skill&&SKILLS[player.action.skill]?SKILLS[player.action.skill].br:'basic'));
   const sk=key&&SKILLS[key],sbr=o.auto?'auto':sk?(sk.br||'none'):'none';
   const k=(enemies.length>1?'g':'s')+'|'+cbr+'|'+sbr;__SH[k]=(__SH[k]||0)+d;}}
  return r;};}"""
lock=threading.Lock()
async def one(h,br,col):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader"]);pg=await b.new_page(viewport={'width':900,'height':600})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:160]))
        await pg.goto(f'http://localhost:8765/index.html?char={h}&map=snowpine&nosw=1');await pg.wait_for_timeout(4000)
        await pg.evaluate("[...document.querySelectorAll('button')].find(b=>/โหมดทดสอบ/.test(b.textContent))?.click()");await pg.wait_for_timeout(5000)
        await pg.add_script_tag(path=BENCH)
        await pg.evaluate("mapTest.enterMap(null,null)");await pg.wait_for_timeout(500)
        await pg.evaluate("(B)=>{for(const k in B)if(B[k])PRESETS[k]=B[k];}",BUILDS)
        if br!='all':
            other='B' if br=='A' else 'A'
            await pg.evaluate(f"window.__BENCH_SKIP=k=>{col}(k)==='{other}'")
        if SHARES:await pg.evaluate(SHARE_JS)
        res={}
        for name in BUILDS:
            await pg.evaluate("(p)=>{PS.lv=LV_CAP;PS._pre=p;Object.assign(PS,presetAt(p,LV_CAP));applyStats();player.hp=player.maxHp;player.mp=player.maxMp;}",name)
            st=await pg.evaluate("()=>Object.fromEntries(STATK.map(k=>[k,D.stat[k]]))")
            if SHARES:await pg.evaluate("()=>{window.__SH={};}")
            r=await pg.evaluate(f"balanceBench({RUNS})")
            res[name]=dict(score=r['score'],dps1=round(r['dps1']),dpsG=round(r['dpsG']),heal=round(r.get('healPS') or 0),taken=round(r.get('takenPS') or 0),hp=r.get('maxHp'),st=st)
            if SHARES:res[name]['sh']=await pg.evaluate("()=>Object.fromEntries(Object.entries(window.__SH).map(([k,v])=>[k,Math.round(v)]))")
        await b.close();return res,errs[:2]
jobs=queue.Queue()
for h,brs,col in H:
    for br in brs.split(','):jobs.put((h,br,col))
def work():
    while True:
        try:h,br,col=jobs.get_nowait()
        except queue.Empty:return
        try:res,errs=asyncio.run(one(h,br,col))
        except Exception as e:res,errs={},[str(e)[:200]]
        with lock:
            with open(OUT,'a') as f:f.write(json.dumps({'h':h,'br':br,'res':res,'errs':errs},ensure_ascii=False)+'\n')
ts=[threading.Thread(target=work) for _ in range(int(os.environ.get('W','2')))]
[t.start() for t in ts];[t.join() for t in ts]
with open(OUT,'a') as f:f.write('DONE\n')
