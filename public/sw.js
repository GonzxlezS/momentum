importScripts("./assetList.js");

const VERSION = "1.0";
const CACHE_NAME = `Momentum-${VERSION}`;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(ASSETS))
        .catch(err => console.error('Cache error:', err))
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        event.respondWith(fetch(event.request));
        return;
    }


    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request).then(response => {
                if (!response || response.status !== 200) {
                    return response;
                }

                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                .filter(name => name !== CACHE_NAME)
                .map(name => caches.delete(name))
            );
        })
    );
});