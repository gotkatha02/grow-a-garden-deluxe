# Cut Monster_Catalog atlases (2x) into 1x clip strips for monster-catalog.js.
# usage: python3 tools/moncatalog.py "<Monster Catalog folder>" <name->id map.json> <out dir> <meta out.json>
import json,sys,os
from PIL import Image
root,mapf,outd,metaf=sys.argv[1:5]
cat={m['id']:m for m in json.load(open(os.path.join(root,'catalog.json')))['monsters']}
ids=sorted(set(json.load(open(mapf)).values()))
os.makedirs(outd,exist_ok=True);META={};tot=0
for cid in ids:
  c=cat[cid];d=os.path.join(root,c['sprite']);a=json.load(open(os.path.join(d,cid+'.atlas.json')))
  s=a['scales']['2x'];cw,ch=s['cell'];px,py=s['pivot'];pages=[Image.open(os.path.join(d,p['file'])).convert('RGBA') for p in s['pages']]
  acts=a['animations'];info=a['actions'];out={'side':a.get('drawnSide','left'),'facing':a.get('facing','side')}
  # union bbox over all frames (cell coords at 2x)
  x0,y0,x1,y1=cw,ch,0,0
  for act,dirs in acts.items():
    for fk in list(dirs.values())[0]:
      f=a['frames'][fk]['2x'];x0=min(x0,f['ox']);y0=min(y0,f['oy']);x1=max(x1,f['ox']+f['w']);y1=max(y1,f['oy']+f['h'])
  x0-=x0%2;y0-=y0%2;W=(x1-x0+1)//2;H=(y1-y0+1)//2
  for act,dirs in acts.items():
    fr=list(dirs.values())[0];n=len(fr);strip=Image.new('RGBA',(W*n,H),(0,0,0,0))
    for i,fk in enumerate(fr):
      f=a['frames'][fk]['2x'];im=pages[f['p']].crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h']))
      cell=Image.new('RGBA',((x1-x0)+2,(y1-y0)+2),(0,0,0,0));cell.paste(im,(f['ox']-x0,f['oy']-y0))
      cell=cell.resize((cell.width//2,cell.height//2),Image.NEAREST).crop((0,0,W,H));strip.paste(cell,(i*W,0))
    fn=f"{cid}_{act}";p=os.path.join(outd,fn+'.webp');strip.save(p,'WEBP',lossless=True,method=6);tot+=os.path.getsize(p)
    ai=info.get(act,{});o={'f':'cat/'+fn,'cw':W,'ch':H,'px':(px-x0)//2,'py':(py-y0)//2,'n':n,'cols':n,'fps':round(1000/ai.get('delayMs',120),1),'loop':1 if ai.get('loop',act!='attack') else 0}
    if 'hitFrame' in ai:o['hit']=ai['hitFrame']
    out[act]=o
  out['ref']=(py-y0)//2;out['hw']=c['heightWorld'];out['kind']=c['kind']
  META[cid]=out
json.dump(META,open(metaf,'w'))
print(len(META),'monsters',tot//1024,'KB')
