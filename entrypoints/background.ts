import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import Analytics from '../src/analytics'
import { removeFromStorage, setToStorage } from '../src/common/storage'

function generateSidePanel() {
	if (browser.sidePanel && !import.meta.env.FIREFOX) {
		browser.permissions
			.contains({ permissions: ['sidePanel'] })
			.then((granted) => {
				if (granted && browser.sidePanel) {
					browser.sidePanel
						.setPanelBehavior({ openPanelOnActionClick: false })
						.catch((error: Error) =>
							console.error('Error setting panel behavior:', error)
						)
				}
			})
			.catch((error) =>
				console.error('Error checking sidePanel permission:', error)
			)
	}
}
export default defineBackground(() => {
	const isDev = import.meta.env.DEV
	if (typeof self !== 'undefined' && '__WB_MANIFEST' in self) {
		precacheAndRoute((self as any).__WB_MANIFEST)
	}

	if (!import.meta.env.FIREFOX) {
		browser.action.onClicked?.addListener(() => {
			browser.tabs.create({ url: browser.runtime.getURL('/newtab.html') })
			generateSidePanel()
			Analytics.event('IconClicked')
		})
	}

	// Initialize side panel for vertical tabs (only if permission is granted)

	generateSidePanel()

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

	browser.runtime.onInstalled.addListener(async (details) => {
		if (details.reason === 'install') {
			browser.tabs.create({ url: browser.runtime.getURL('/newtab.html') })
			await removeFromStorage('showWelcomeModal')
			await setToStorage('showWelcomeModal', true)

			const manifest = browser.runtime.getManifest()
			if (import.meta.env.FIREFOX) {
				Analytics.event('Installed', {
					version: manifest.version,
					offlineSupport: true,
				})
			}
			isDev && (await preloadCriticalResources())
		} else if (details.reason === 'update') {
			const manifest = browser.runtime.getManifest()
			const previousVersion = details.previousVersion || 'unknown'

			Analytics.event('Updated', {
				version: manifest.version,
				previousVersion,
				offlineSupport: true,
			})

			await cleanupOutdatedCaches()
			await preloadCriticalResources()
		}
	})

	browser.runtime.onStartup.addListener(async () => {
		Analytics.event('Startup')
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
