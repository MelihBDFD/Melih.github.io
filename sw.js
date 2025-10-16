// MELİH TO-DO Service Worker
// Yapımcı: Melih Can Çiğdem

const CACHE_NAME = 'melih-todo-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache dosyaları
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - cache'den servis et veya ağdan al
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache'de varsa cache'den döndür
        if (response) {
          return response;
        }

        // Yoksa ağdan al ve cache'e kaydet
        return fetch(event.request).then(
          function(response) {
            // Geçersiz yanıtları cache etme
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Yanıtı klonla çünkü hem cache'e hem de tarayıcıya göndereceğiz
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event - eski cache'leri temizle
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync için (ileride offline görev ekleme için)
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Offline iken eklenen görevleri senkronize et
  return Promise.resolve();
}

// Push notification için (ileride hatırlatıcılar için)
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'Yeni hatırlatıcı!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    actions: [
      {
        action: 'open',
        title: 'Aç',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Kapat'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MELİH TO-DO', options)
  );
});

// Notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
