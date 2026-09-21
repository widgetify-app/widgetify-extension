import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { RangeRequestsPlugin } from 'workbox-range-requests'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheNames } from './cache-names'
import {
	CDN_NO_CACHE_PREFIXES,
	NETWORK_FIRST_API_PATHS,
	NEVER_CACHE_API_PATHS,
	SWR_API_PATHS,
} from './cache-config'
import { activeWallpaperUrls } from './wallpaper-cache'

const API_ORIGIN = 'https://api.widgetify.ir'
const CDN_ORIGIN = 'https://cdn.widgetify.ir'

function matchesApiPaths(url: URL, request: Request, paths: string[]): boolean {
	if (request.method !== 'GET') return false
	if (url.origin !== API_ORIGIN) return false
	if (NEVER_CACHE_API_PATHS.some((path) => url.pathname.includes(path))) return false
	return paths.some((path) => url.pathname.startsWith(path))
}

// Browser-initiated requests for CDN assets (<img>, <link>, ...) default to
// no-cors, which yields opaque responses. Opaque responses can't be validated
// and get a large, misleading padding added to storage estimates. Since the CDN
// sends `Access-Control-Allow-Origin: *`, upgrade the fetch to CORS so we store
// a real, unpadded response instead.
const upgradeCdnToCorsPlugin = {
	requestWillFetch: async ({ request }: { request: Request }) => {
		if (request.mode === 'no-cors' && new URL(request.url).origin === CDN_ORIGIN) {
			return new Request(request.url, { mode: 'cors', credentials: 'omit' })
		}
		return request
	},
}

const DAY = 24 * 60 * 60

export function setupCaching() {
	try {
		if (typeof self !== 'undefined' && '__WB_MANIFEST' in self) {
			import('workbox-precaching').then(({ precacheAndRoute }) => {
				precacheAndRoute((self as any).__WB_MANIFEST)
			})
		}

		const apiCachePlugins = () => [
			new CacheableResponsePlugin({ statuses: [200] }),
			new ExpirationPlugin({
				maxEntries: 50,
				maxAgeSeconds: 2 * DAY,
				purgeOnQuotaError: true,
			}),
		]

		registerRoute(
			({ url, request }) => matchesApiPaths(url, request, SWR_API_PATHS),
			new StaleWhileRevalidate({
				cacheName: CacheNames.api,
				plugins: apiCachePlugins(),
			})
		)

		registerRoute(
			({ url, request }) => matchesApiPaths(url, request, NETWORK_FIRST_API_PATHS),
			new NetworkFirst({
				cacheName: CacheNames.api,
				networkTimeoutSeconds: 3,
				plugins: apiCachePlugins(),
			})
		)

		registerRoute(
			({ url }) => activeWallpaperUrls.has(url.href),
			new CacheFirst({
				cacheName: CacheNames.wallpaper,
				plugins: [
					new CacheableResponsePlugin({ statuses: [200] }),
					// Video wallpapers issue Range requests; serve proper 206 slices
					// from the cached full 200 instead of relying on browser leniency.
					new RangeRequestsPlugin(),
				],
			})
		)

		registerRoute(
			({ url }) => url.origin === CDN_ORIGIN && url.pathname.endsWith('.css'),
			new StaleWhileRevalidate({
				// Separate cache from the general CDN route: two ExpirationPlugins
				// sharing one cache name fight over ownership and thrash IndexedDB.
				cacheName: CacheNames.cdnCss,
				plugins: [
					upgradeCdnToCorsPlugin,
					new CacheableResponsePlugin({ statuses: [200] }),
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
					upgradeCdnToCorsPlugin,
					new CacheableResponsePlugin({ statuses: [200] }),
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
