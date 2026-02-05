import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { NavigationRoute } from 'workbox-routing'
const allowedPaths = [
	'/extension/wigi-pad-data',
	'/date/events',
	'/news/rss',
	'/currencies',
	'/wallpapers',
	'/contents',
]

export function setupCaching() {
	if (typeof self !== 'undefined' && '__WB_MANIFEST' in self) {
		import('workbox-precaching').then(({ precacheAndRoute }) => {
			precacheAndRoute((self as any).__WB_MANIFEST)
		})
	}

	registerRoute(
		({ url, request }) => {
			if (request.method !== 'GET') return false
			if (url.origin !== 'https://api.widgetify.ir') return false

			return allowedPaths.some((path) => url.pathname.startsWith(path))
		},

		new StaleWhileRevalidate({
			cacheName: 'widgetify-public-api',
			plugins: [
				new CacheableResponsePlugin({
					statuses: [200],
				}),
				new ExpirationPlugin({
					maxEntries: 150,
					maxAgeSeconds: 60 * 60 * 5,
					purgeOnQuotaError: true,
				}),
			],
		})
	)

	const isDev = import.meta.env.DEV

	if (!isDev) {
		registerRoute(
			({ request }) =>
				request.destination === 'script' ||
				request.destination === 'style' ||
				request.destination === 'font',
			new CacheFirst({
				cacheName: 'static-assets-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 200,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
						purgeOnQuotaError: true,
					}),
					new CacheableResponsePlugin({
						statuses: [0, 200],
					}),
				],
			})
		)

		registerRoute(
			({ request }) => request.destination === 'image',
			new CacheFirst({
				cacheName: 'images-cache-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 300,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
						purgeOnQuotaError: true,
					}),
					new CacheableResponsePlugin({
						statuses: [0, 200],
					}),
				],
			})
		)

		registerRoute(
			({ request }) => request.destination === 'document',
			new NetworkFirst({
				cacheName: 'html-cache-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 50,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
						purgeOnQuotaError: true,
					}),
					new CacheableResponsePlugin({
						statuses: [0, 200],
					}),
				],
			})
		)

		registerRoute(
			({ url }) =>
				url.origin === 'https://cdn.jsdelivr.net' ||
				url.origin === 'https://unpkg.com' ||
				url.origin === 'https://cdnjs.cloudflare.com' ||
				url.hostname.includes('googleapis.com') ||
				url.hostname.includes('gstatic.com') ||
				url.hostname.includes('storage'),
			new StaleWhileRevalidate({
				cacheName: 'cdn-cache-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 100,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
						purgeOnQuotaError: true,
					}),
					new CacheableResponsePlugin({
						statuses: [0, 200],
					}),
				],
			})
		)

		const navigationRoute = new NavigationRoute(
			new NetworkFirst({
				cacheName: 'navigation-cache-v1',
				plugins: [
					new ExpirationPlugin({
						maxEntries: 30,
						maxAgeSeconds: 1 * 60 * 60, // 1 hours
					}),
				],
			})
		)
		registerRoute(navigationRoute)
	}
}
