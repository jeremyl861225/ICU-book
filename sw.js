/* ICU Book — Service Worker
 * 與臨床工具箱同一套策略：stale-while-revalidate（先回快取、背景重抓）。
 * 與其他 PWA 共用 github.io origin 時，activate 只刪本前綴的快取。
 * 下拉更新（pull-to-refresh.js）送 REFRESH 訊息 → 強制重抓全部檔案後回 REFRESHED。 */
const CACHE_PREFIX = 'icu-book-';
const CACHE_VERSION = CACHE_PREFIX + 'v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './chapters.html',
  './manifest.webmanifest',
  './css/styles.css',
  './css/ui-sentence.css',
  './css/guide.css',
  './css/icu.css',
  './js/ui-mode.js',
  './js/common.js',
  './js/pull-to-refresh.js',
  './js/icu.js',
  './js/backlink.js',
  './js/sentence-nav.js',
  './data/facets.js',
  './js/shock.js',
  './sections/shock.html',
  './sections/monitoring.html',
  './sections/fluids.html',
  './sections/blood.html',
  './sections/cardiac.html',
  './sections/respdis.html',
  './sections/vent.html',
  './sections/acidbase.html',
  './sections/renallyte.html',
  './sections/abdomen.html',
  './sections/temp.html',
  './sections/neuro.html',
  './sections/nutrition.html',
  './sections/tox.html',
  './sections/appendix.html',
  './js/monitoring.js',
  './js/fluids.js',
  './js/blood.js',
  './js/cardiac.js',
  './js/respdis.js',
  './js/vent.js',
  './js/acidbase.js',
  './js/renallyte.js',
  './js/abdomen.js',
  './js/temp.js',
  './js/neuro.js',
  './js/nutrition.js',
  './js/tox.js',
  './js/appendix.js',
  './sections/practices.html',
  './js/practices.js',
  './sections/access.html',
  './js/access.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-192-dark.png',
  './icons/icon-512-dark.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE_VERSION).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE_VERSION).then((cache) => cache.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => hit);
      return hit || net;
    }))
  );
});

self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'REFRESH') return;
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => Promise.all(
      PRECACHE_URLS.map((u) => fetch(u, { cache: 'reload' }).then((r) => { if (r.ok) return cache.put(u, r); }).catch(() => {}))
    )).then(() => self.clients.matchAll()).then((clients) => {
      clients.forEach((c) => c.postMessage({ type: 'REFRESHED' }));
    })
  );
});
