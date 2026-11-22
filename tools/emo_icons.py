"""Painted UI icons that replace emoji (ui_emoji.js, prompts in UI_ICON_PROMPTS_TH.md).
usage:
  python3 tools/emo_icons.py cut <sheet 1-5> <sheet.png>   cut one ChatGPT sheet into assets/ui/emo/<key>.webp (128 px) and rebuild the list
  python3 tools/emo_icons.py list                           rebuild assets/ui/emo/list.js from the files there (+ bump its ?v= in index.html)
  python3 tools/emo_icons.py board [out.png]                reference board of icons already in the game (attach it in ChatGPT)
Sheets are read left -> right, top row first; the background (green or magenta) is found from the border by tools/iconsheet.py."""
import sys, os, re, json, subprocess, tempfile, shutil
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EMO=os.path.join(ROOT,'assets','ui','emo')
SHEETS={  # sheet -> (rows, keys) ; keys = the names in ui_emoji.js T table
 1:([4,4,4],'target sit compass gift star hint help tap books skip bell belloff'.split()),
 2:([4,4,4],'balance pick alembic cgem mutgem supgem gem dismantle pages relic rule build'.split()),
 3:([4,4,4],'poison bleed skull warn broken crown trophy party folder chart mailbox news'.split()),
 4:([4,4],'herb sprout turtle fashion paw blueprint wrench chat'.split()),
 5:([4,4],'grab key mute note dark blind web scorpion'.split()),
}
def rebuild():
    keys=sorted(f[:-5] for f in os.listdir(EMO) if f.endswith('.webp'))
    lj=os.path.join(EMO,'list.js');v=1
    if os.path.exists(lj):
        m=re.search(r'EMO_V=(\d+)',open(lj,encoding='utf-8').read());v=int(m.group(1))+1 if m else 1
    open(lj,'w',encoding='utf-8').write('/* painted UI icons that replace emoji — rebuilt by `python3 tools/emo_icons.py list` (keys = assets/ui/emo/<key>.webp) */\n'
        f'window.EMO_HAVE={json.dumps(keys)};\nwindow.EMO_V={v};\n')
    ih=os.path.join(ROOT,'index.html');s=open(ih,encoding='utf-8').read()
    s2=re.sub(r'assets/ui/emo/list\.js\?v=\d+',f'assets/ui/emo/list.js?v={v}',s)
    if s2!=s:open(ih,'w',encoding='utf-8').write(s2)
    print(len(keys),'icons:',' '.join(keys),'| EMO_V',v)
def cut(n,png):
    rows,keys=SHEETS[n];tmp=tempfile.mkdtemp()
    env=dict(os.environ,GLOBAL='1')
    subprocess.run([sys.executable,'-I',os.path.join(ROOT,'tools','iconsheet.py'),png,tmp,','.join(map(str,rows)),','.join(keys),'128'],check=True,env=env)
    os.makedirs(EMO,exist_ok=True)
    for k in keys:
        Image.open(os.path.join(tmp,k+'.png')).save(os.path.join(EMO,k+'.webp'),'WEBP',quality=90,method=6)
    shutil.rmtree(tmp);rebuild()
def board(out):
    names=['ui/inv_bag.webp','ui/inv_gold.webp','ui/inv_storage.webp','items/capscroll.png','items/manual.png','items/hp1.png',
           'items/wing.png','ui/npc_pin_red.webp','items/pliers.png','items/guard.png','items/sore.png','items/tess.png']
    cell=220;W=6;im=Image.new('RGB',(W*cell,2*cell),(244,236,220))
    for i,nm in enumerate(names):
        a=Image.open(os.path.join(ROOT,'assets',nm)).convert('RGBA');a.thumbnail((cell-40,cell-40),Image.LANCZOS)
        x=(i%W)*cell+(cell-a.width)//2;y=(i//W)*cell+(cell-a.height)//2;im.paste(a,(x,y),a)
    im.save(out);print('board ->',out)
if __name__=='__main__':
    a=sys.argv[1:]
    if not a:print(__doc__);sys.exit()
    if a[0]=='cut':cut(int(a[1]),a[2])
    elif a[0]=='list':rebuild()
    elif a[0]=='board':board(a[1] if len(a)>1 else 'ref_ui_icons.png')
    else:print(__doc__)
