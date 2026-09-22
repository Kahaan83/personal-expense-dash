// Ledger service worker
// Scope: the app shell only (this HTML file, its manifest, its icons).
// Nothing about your data is ever cached here — every request to Supabase,
// Gemini, or CoinDCX is cross-origin and this worker never touches it, so
// numbers on screen always come from the network, never from a stale cache.

const CACHE_NAME = 'ledger-shell-v1';
const SHELL_URLS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Only ever intervene for same-origin GETs (the shell). Everything else —
  // any cross-origin call, any non-GET — is left completely alone so it
  // hits the network exactly as if this worker didn't exist.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Page navigations: try the network first so you always get the latest
  // shell when online, falling back to the cached copy when you're not.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', res.clone()));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Everything else in the shell (icons, manifest): cache-first, network fallback.
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
      return res;
    }))
  );
});
