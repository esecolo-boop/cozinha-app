// Guarda o app no aparelho para abrir sem internet.
const CACHE = "cozinha-v1";
const ARQUIVOS = [
  "./", "./index.html", "./manifest.webmanifest", "./fonts/fonts.css",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png", "./icons/apple-touch-icon.png",
  "./fonts/BricolageGrotesque-600-latin.woff2", "./fonts/BricolageGrotesque-800-latin.woff2",
  "./fonts/Figtree-400-latin.woff2", "./fonts/Figtree-500-latin.woff2", "./fonts/Figtree-600-latin.woff2", "./fonts/Figtree-700-latin.woff2"
];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // Rede primeiro para a página (pega atualizações), cache primeiro para o resto.
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return r; }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok && new URL(e.request.url).origin === location.origin) { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return res; })));
});
