import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheNames } from './cache-names'
import { activeWallpaperUrls } from './wallpaper-cache'

const allowedPaths = [
	'/extension/wigi-pad-data',
	'/date/events',
	'/news/rss',
	'/currencies',
	'/contents',
	'/extension/notifications',
	'/extension/searchbox',
	'/searchbox',
	'/weather',
]

const API_ORIGIN = 'https://api.widgetify.ir'
const CDN_ORIGIN = 'https://cdn.widgetify.ir'
const CDN_NO_CACHE_PREFIXES = ['/wallpapers/', '/avatars/']

const DAY = 24 * 60 * 60

export function setupCaching() {
	try {
		if (typeof self !== 'undefined' && '__WB_MANIFEST' in self) {
			import('workbox-precaching').then(({ precacheAndRoute }) => {
				precacheAndRoute((self as any).__WB_MANIFEST)
			})
		}

		registerRoute(
			({ url, request }) => {
				if (request.method !== 'GET') return false
				if (url.origin !== API_ORIGIN) return false
				return allowedPaths.some((path) => url.pathname.startsWith(path))
			},
			new NetworkFirst({
				cacheName: CacheNames.api,
				networkTimeoutSeconds: 3,
				plugins: [
					new CacheableResponsePlugin({ statuses: [200] }),
					new ExpirationPlugin({
						maxEntries: 50,
						maxAgeSeconds: 2 * DAY,
						purgeOnQuotaError: true,
					}),
				],
			})
		)

		registerRoute(
			({ url }) => activeWallpaperUrls.has(url.href),
			new CacheFirst({
				cacheName: CacheNames.wallpaper,
				plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
			})
		)

		const isDev = import.meta.env.DEV
		if (isDev) return

		registerRoute(
			({ url }) => url.origin === CDN_ORIGIN && url.pathname.endsWith('.css'),
			new StaleWhileRevalidate({
				cacheName: CacheNames.cdn,
				plugins: [
					new CacheableResponsePlugin({ statuses: [0, 200] }),
					new ExpirationPlugin({
						maxEntries: 20,
						maxAgeSeconds: 30 * DAY,
						purgeOnQuotaError: true,
					}),
				],
			})
		)

		registerRoute(
			({ request }) => request.destination === 'font',
			new CacheFirst({
				cacheName: CacheNames.fonts,
				plugins: [
					new CacheableResponsePlugin({ statuses: [0, 200] }),
					new ExpirationPlugin({
						maxEntries: 30,
						maxAgeSeconds: 60 * DAY,
						purgeOnQuotaError: true,
					}),
				],
			})
		)

		registerRoute(
			({ url }) =>
				url.origin === CDN_ORIGIN &&
				!CDN_NO_CACHE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix)),
			new CacheFirst({
				cacheName: CacheNames.cdn,
				plugins: [
					new CacheableResponsePlugin({ statuses: [0, 200] }),
					new ExpirationPlugin({
						maxEntries: 150,
						maxAgeSeconds: 30 * DAY,
						purgeOnQuotaError: true,
					}),
				],
			})
		)
	} catch {}
}
