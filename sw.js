// SkapLab Service Worker v1.0
const CACHE = 'skaplab-v1';
const STATISK = [
  '/',
  '/skaplab.html',
  '/matte_hub.html',
  '/naturfag_hub.html',
  '/spill_hub.html',
  '/elev_portal.html',
  '/manifest.json',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(STATISK.map(function(url) {
        return new Request(url, { cache: 'reload' });
      })).catch(function() {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co')) return; // Aldri cache Supabase-kall
  if (e.request.url.includes('fonts.googleapis')) return;

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      var nettverkKall = fetch(e.request).then(function(resp) {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          var kopi = resp.clone();
          caches.open(CACHE).then(function(cache) { cache.put(e.request, kopi); });
        }
        return resp;
      }).catch(function() { return cached; });
      return cached || nettverkKall;
    })
  );
});
