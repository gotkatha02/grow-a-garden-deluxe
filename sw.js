/* Totem Legend — offline cache (2026-11-20, owner: the game loads slowly from the play link).
   Pictures / fonts: answered from the cache at once; a copy older than 6 h is re-checked in the background, so a changed
   picture shows on the next visit. Code and pages (.html .js .css .json): always asked from the network first (so an update is seen
   straight away); the cached copy is only used when the network fails. Bump V to throw the whole cache away. */
const V='tl-v1',IMG=/\.(webp|png|jpg|jpeg|gif|svg|woff2?|ttf|otf|mp3|ogg)$/i,AGE=6*3600e3;
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
const put=(c,req,res)=>{if(res&&res.ok&&res.type==='basic')c.put(req,res.clone()).catch(()=>{});return res;};
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin||r.headers.has('range'))return;
  if(IMG.test(u.pathname))e.respondWith(caches.open(V).then(c=>c.match(r).then(hit=>{
      if(!hit)return fetch(r).then(res=>put(c,r,res));
      const d=Date.parse(hit.headers.get('date')||'')||0;if(Date.now()-d>AGE)e.waitUntil(fetch(r).then(res=>put(c,r,res)).catch(()=>{}));
      return hit;})));
  else e.respondWith(fetch(r).then(res=>caches.open(V).then(c=>put(c,r,res))).catch(()=>caches.match(r).then(h=>h||Response.error())));});
