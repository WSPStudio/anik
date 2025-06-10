const CACHE_VERSION = 'v2';
const CACHE_NAME = `site-cache-${CACHE_VERSION}`;
const ASSETS_TO_CACHE = [
	'/',
	'/index.html',
	'/assets/css/vendor.css',
	'/assets/css/style.css',
	'/assets/js/vendor.js',
	'/assets/js/script.js',
];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => cache.addAll(ASSETS_TO_CACHE))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames
					.filter(name => name !== CACHE_NAME)
					.map(name => caches.delete(name))
			);
		}).then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', event => {
	if (event.request.method !== 'GET') return;

	event.respondWith(
		caches.match(event.request).then(cachedResponse => {
			// Если есть в кеше - возвращаем
			if (cachedResponse) return cachedResponse;

			// Иначе делаем запрос и кешируем для будущих запросов
			return fetch(event.request).then(response => {
				// Клонируем ответ, так как он может быть использован только один раз
				const responseToCache = response.clone();

				// Кешируем только успешные ответы и только GET-запросы
				if (response.ok && event.request.url.startsWith(self.location.origin)) {
					caches.open(CACHE_NAME).then(cache => {
						cache.put(event.request, responseToCache);
					});
				}

				return response;
			}).catch(() => {
				// Если запрос не удался и это HTML - возвращаем запасную страницу
				if (event.request.headers.get('accept').includes('text/html')) {
					return caches.match('/index.html');
				}
			});
		})
	);
});
