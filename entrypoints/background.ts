import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import Analytics from '../src/analytics'
import { setToStorage } from '../src/common/storage'

export default defineBackground(() => {
	if (typeof self !== 'undefined' && '__WB_MANIFEST' in self) {
		precacheAndRoute((self as any).__WB_MANIFEST)
	}

	registerRoute(
		({ request }) => request.url.includes('api.widgetify.ir'),
		new NetworkFirst({
			cacheName: 'widgetify-api-cache-v1',
			plugins: [
				new ExpirationPlugin({
					maxEntries: 100,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
					purgeOnQuotaError: true,
				}),
				new CacheableResponsePlugin({
					statuses: [0, 200],
				}),
			],
		})
	)

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
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
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
					maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
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
					maxAgeSeconds: 12 * 60 * 60, // 12 hours
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
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
					purgeOnQuotaError: true,
				}),
				new CacheableResponsePlugin({
					statuses: [0, 200],
				}),
			],
		})
	)

	registerRoute(
		({ url, request }) =>
			url.origin !== self.location.origin &&
			!url.hostname.includes('widgetify.ir') &&
			request.method === 'GET',
		new StaleWhileRevalidate({
			cacheName: 'cross-origin-cache-v1',
			plugins: [
				new ExpirationPlugin({
					maxEntries: 50,
					maxAgeSeconds: 6 * 60 * 60, // 6 hours
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
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				}),
			],
		})
	)
	registerRoute(navigationRoute)

	browser.runtime.onInstalled.addListener(async (details) => {
		if (details.reason === 'install') {
			await setToStorage('showWelcomeModal', true)

			const manifest = browser.runtime.getManifest()

			Analytics.featureUsed('Installed', {
				version: manifest.version,
				offlineSupport: true,
			})

			await preloadCriticalResources()
		} else if (details.reason === 'update') {
			const manifest = browser.runtime.getManifest()
			const previousVersion = details.previousVersion || 'unknown'

			Analytics.featureUsed('Updated', {
				version: manifest.version,
				previousVersion,
				offlineSupport: true,
			})

			await cleanupOutdatedCaches()
			await preloadCriticalResources()
		}
	})

	browser.runtime.onStartup.addListener(async () => {
		Analytics.featureUsed('Startup')
	})

	cleanupOutdatedCaches()
})

async function preloadCriticalResources() {
	try {
		const cache = await caches.open('critical-resources-v1')

		const criticalUrls = ['/newtab.html'].filter(Boolean)

		if (criticalUrls.length > 0) {
			await cache.addAll(criticalUrls)
			console.log('Critical resources preloaded for offline use')
		}
	} catch (error) {
		console.error('Failed to preload critical resources:', error)
	}
}
