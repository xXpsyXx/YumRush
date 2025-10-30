// Service Worker for YumRush
const CACHE_NAME = "yumrush-cache-v1";
const RUNTIME_CACHE = "yumrush-runtime";

// Resources to cache immediately
const PRECACHE_URLS = ["/", "/index.html", "/manifest.json", "/vite.svg"];

// Install event - precache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
          )
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Fetch event - network-first strategy for API calls, cache-first for static assets
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Handle API requests (network-first)
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before caching
          const clonedResponse = response.clone();
          caches
            .open(RUNTIME_CACHE)
            .then((cache) => cache.put(event.request, clonedResponse));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Handle static assets (cache-first)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response.ok) return response;

        // Clone the response before caching
        const clonedResponse = response.clone();
        caches
          .open(RUNTIME_CACHE)
          .then((cache) => cache.put(event.request, clonedResponse));
        return response;
      });
    })
  );
});
