const CACHE = "a330-ipc-v2";
const SHELL = ["index.html","manifest.webmanifest","pako.min.js","ipc_index.json.gz","fin_list.json.gz","icon-180.png","icon-192.png","icon-512.png","icon-512-maskable.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()).catch(()=>self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks)=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== self.location.origin) return;
  e.respondWith(caches.match(e.request).then((c)=> c || fetch(e.request).then((res)=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{}); return res; }).catch(()=>c)));
});
