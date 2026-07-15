import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheNames } from './cache-names'
import {
	CACHEABLE_API_PATHS,
	CDN_NO_CACHE_PREFIXES,
	NEVER_CACHE_API_PATHS,
} from './cache-config'
import { activeWallpaperUrls } from './wallpaper-cache'

const API_ORIGIN = 'https://api.widgetify.ir'
const CDN_ORIGIN = 'https://cdn.widgetify.ir'

function isCacheableApiRequest(url: URL, request: Request): boolean {
	if (request.method !== 'GET') return false
	if (url.origin !== API_ORIGIN) return false
	if (NEVER_CACHE_API_PATHS.some((path) => url.pathname.includes(path))) return false
	return CACHEABLE_API_PATHS.some((path) => url.pathname.startsWith(path))
}

const DAY = 24 * 60 * 60

export function setupCaching() {
	try {
		if (typeof self !== 'undefined' && '__WB_MANIFEST' in self) {
			import('workbox-precaching').then(({ precacheAndRoute }) => {
				precacheAndRoute((self as any).__WB_MANIFEST)
			})
		}

		registerRoute(
			({ url, request }) => isCacheableApiRequest(url, request),
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
			({ url, request }) =>
				request.destination === 'font' && url.protocol === 'https:',
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
