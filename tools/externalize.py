#!/usr/bin/env python3
"""Move base64 pictures out of the big asset .js files into real files (assets/inl/<name>/NNN.webp).
The .js keeps the same variables; each data: URI becomes a path, so the browser no longer has to download and parse
megabytes of script before the game starts, pictures load in parallel only when they are used, and they can be cached.
Usage: python3 tools/externalize.py assets_skillbg.js assets_vfx.js ...   (safe to re-run: files without data URIs are skipped)"""
import re,sys,base64,os,hashlib
RX=re.compile(r'data:image/(webp|png|jpeg);base64,([A-Za-z0-9+/=]+)')
for f in sys.argv[1:]:
    s=open(f).read();name=os.path.splitext(os.path.basename(f))[0];d='assets/inl/'+name;n=[0]
    if not RX.search(s):print(f,'nothing to do');continue
    os.makedirs(d,exist_ok=True)
    def rep(m):
        b=base64.b64decode(m.group(2));ext={'jpeg':'jpg'}.get(m.group(1),m.group(1));p=f'{d}/{n[0]:03d}_{hashlib.md5(b).hexdigest()[:6]}.{ext}';n[0]+=1
        open(p,'wb').write(b);return p
    t=RX.sub(rep,s);open(f,'w').write(t);print(f,len(s)//1024,'KB ->',len(t)//1024,'KB,',n[0],'pictures')
