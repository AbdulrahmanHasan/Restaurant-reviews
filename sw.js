/**
 * Cache details
 */
const cacheName = 'restaurant_reviews_1';

const filesToCache = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/src/css/styles.css',
  '/src/css/responsive.css',
  '/src/js/dbhelper.js',
  '/src/js/main.js',
  '/src/js/restaurant_info.js',
];

/**
 * Create cache when SW installs
 */
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    }),
  );
});

/**
 *  Purge previous cache after activating the next cache
 */
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
});

/**
 * Respond with cached content if they are matched
 */
self.addEventListener('fetch', event => {
  // Handle query string on /restaurant url
  const request = event.request.url.includes('/restaurant.html')
    ? new Request('/restaurant.html')
    : event.request;

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        // console.log("[ServiceWorker] Found in cache ", event.request.url);
        return response;
      }
      return fetch(event.request);
    }),
  );
});
