const STATIC_CACHE = 'static-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';
const STATIC_FILES = [
    '/',
    '/index.html',
    '/app.js',
    '/styles.css',
    '/offline.html'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            return cache.addAll(STATIC_FILES);
        })
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Ignore requests with the scheme 'chrome-extension'
    if (requestUrl.protocol === 'chrome-extension:') {
        return;
    }

    // Handle static assets with cache-first strategy
    if (STATIC_FILES.includes(requestUrl.pathname)) {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
    }
    // Handle API requests with network-first strategy
    else if (requestUrl.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(event.request).then(networkResponse => {
                return caches.open(DYNAMIC_CACHE).then(cache => {
                    cache.put(event.request.url, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                return caches.match(event.request);
            })
        );
    }
    // Handle other requests with stale-while-revalidate strategy
    else {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(event.request.url, networkResponse.clone());
                        return networkResponse;
                    });
                });
                return cachedResponse || fetchPromise;
            })
        );
    }
});

// Background Sync
self.addEventListener('sync', event => {
    if (event.tag === 'sync-form') {
        event.waitUntil(
            sendFormData().then(() => {
                console.log('Form data synced successfully!');
            })
        );
    }
});

function sendFormData() {
    const dbRequest = indexedDB.open('form-data', 1);

    return new Promise((resolve, reject) => {
        dbRequest.onsuccess = event => {
            const db = event.target.result;
            const transaction = db.transaction('posts', 'readonly');
            const store = transaction.objectStore('posts');
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => {
                const posts = getAllRequest.result;
                const sendPromises = posts.map(post => {
                    return fetch('/api/form', {
                        method: 'POST',
                        body: JSON.stringify(post),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(() => {
                        const deleteTransaction = db.transaction('posts', 'readwrite');
                        const deleteStore = deleteTransaction.objectStore('posts');
                        deleteStore.delete(post.id);
                    });
                });

                Promise.all(sendPromises).then(resolve).catch(reject);
            };

            getAllRequest.onerror = reject;
        };

        dbRequest.onerror = reject;
    });
}

// Push Notifications
self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: 'icon.png',
        badge: 'badge.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
