// ─── sw.js (Service Worker) ──────────────────────────────────────
// Caches all app files for full offline use.
// Bump CACHE_VERSION when you update any file — old cache auto-clears.

const CACHE_VERSION = "calcspeed-v3";

const STATIC_FILES = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/utils.js",
  "./js/storage.js",
  "./js/xp.js",
  "./js/engine.js",
  "./js/badges.js",
  "./js/daily.js",
  "./js/stats.js",
  "./js/tricks.js",
  "./js/chapters.js",
  "./js/chapter-quiz.js",
  "./js/data/chapters/_helpers.js",
  "./js/data/chapters/time-speed-distance.js",
  "./js/data/chapters/time-work.js",
  "./js/data/chapters/ratio-proportion.js",
  "./js/data/chapters/average.js",
  "./js/data/chapters/mixture-alligation.js",
  "./js/data/chapters/algebra.js",
  "./js/data/chapters/geometry.js",
  "./js/data/chapters/data-interpretation.js",
  "./js/ui.js",
  "./manifest.json",
  // Google Fonts are cached on first load
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap",
];

// ── Install: cache everything ─────────────────────────────────────
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: delete old caches ───────────────────────────────────
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first strategy ───────────────────────────────────
self.addEventListener("fetch", event => {
  // Skip non-GET and chrome-extension requests
  if (event.request.method !== "GET") return;
  if (event.request.url.startsWith("chrome-extension://")) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache valid responses (fonts, etc.)
        if (response && response.status === 200 && response.type !== "opaque") {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Fallback: return index.html for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
