/* Stratus Radio service worker: keeps the app itself available offline.
   Radio streams and live station lookups always go straight to the network. */
var CACHE = 'stratus-v7';
// Station logos live in their own cache so app updates don't throw them away.
var LOGOS = 'stratus-logos';
var SHELL = [
  './',
  'index.html',
  'app.css',
  'app.js',
  'stations.js',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png',
  'logo.png',
  'favicon-32.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE && k !== LOGOS; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // Google Fonts: cache first.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
          return res;
        });
      })
    );
    return;
  }

  // Everything else from other sites (streams, NBC song lookup, hls.js): leave alone.
  if (url.origin !== self.location.origin) return;
  // Range requests are media; don't touch them.
  if (req.headers.has('range')) return;
  // Live song lookups (worker.js) must never come from the cache.
  if (url.pathname.indexOf('/api/') === 0) return;

  // Station logos: once loaded, always shown from the phone's copy. Their addresses carry a
  // version (logos/<id>.webp?v=N), so a replaced logo has a new address and is fetched fresh.
  if (url.pathname.indexOf('/logos/') === 0) {
    e.respondWith(
      caches.open(LOGOS).then(function (c) {
        return c.match(req).then(function (hit) {
          return hit || fetch(req).then(function (res) {
            if (res && res.ok && (res.headers.get('content-type') || '').indexOf('image/') === 0) c.put(req, res.clone());
            return res;
          });
        });
      })
    );
    return;
  }

  // The app's own files: use the network when possible so updates arrive, fall back to the cache.
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) { return hit || caches.match('index.html'); });
    })
  );
});
