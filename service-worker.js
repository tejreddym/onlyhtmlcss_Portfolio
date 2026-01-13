/**
 * Service Worker for tejreddym Portfolio
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'tejreddym-v2';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline access
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/projects.html',
  '/interests.html',
  '/contact.html',
  '/offline.html',
  '/css/style.css',
  '/css/proj-style.css',
  '/js/scripts.js',
  '/js/contact-form.js',
  '/js/fab-menu.js',
  '/images/project-1.webp',
  '/images/project-2.webp',
  '/images/project-3.webp'
];

// Install service worker and cache essential files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching files');
        return cache.addAll(FILES_TO_CACHE).catch((error) => {
          console.warn('[Service Worker] Some files failed to cache:', error);
          // Continue even if some files fail to cache
        });
      })
  );
  self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch strategy: Network first, fall back to cache, then offline page
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignore source map requests and chrome extensions
  if (url.pathname.endsWith('.map') || request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Only cache GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle navigation requests (page loads)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // No cache, show offline page
              return caches.match(OFFLINE_URL);
            });
        })
    );
  } else {
    // Handle other requests (CSS, JS, images, etc.) - cache first strategy
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Not in cache, fetch from network
          return fetch(request)
            .then((response) => {
              // Cache successful responses
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              console.log('[Service Worker] Fetch failed for:', request.url);
              return null;
            });
        })
    );
  }
});
