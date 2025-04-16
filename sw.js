self.addEventListener('install', event => {
    self.skipWaiting();
});
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open('demo-cache').then(cache =>
            cache.match(event.request).then(response =>
                response || fetch(event.request)
            )
        )
    );
});
