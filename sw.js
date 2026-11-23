// AgroFlight: guarda só a tela de entrada, para o site abrir sem internet.
// (o aplicativo em si fica cifrado no IndexedDB do carregador)
const CACHE = "agroflight-entrada-v1";
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./"])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return; // só a página; o resto segue normal
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        if (r.ok) {
          const copia = r.clone();
          caches.open(CACHE).then((c) => c.put("./", copia));
        }
        return r;
      })
      .catch(() => caches.match("./")),
  );
});
