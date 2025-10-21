import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import Analytics from '../src/analytics'
import { getFromStorage, removeFromStorage, setToStorage } from '../src/common/storage'

async function setupSidePanel() {
	try {
		const verticalTabsSettings = await getFromStorage('verticalTabsSettings')
		if (!verticalTabsSettings?.enabled) return

		if (browser.sidePanel && !import.meta.env.FIREFOX) {
			const granted = await browser.permissions.contains({
				permissions: ['sidePanel'],
			})

			if (granted && browser.sidePanel) {
				browser.sidePanel
					.setPanelBehavior({ openPanelOnActionClick: true })
					.catch((error: Error) =>
						console.error('Error setting panel behavior:', error)
					)
			}
		}
	} catch {}
}
export default defineBackground(() => {
	const isDev = import.meta.env.DEV
	if (typeof self !== 'undefined' && '__WB_MANIFEST' in self) {
		precacheAndRoute((self as any).__WB_MANIFEST)
	}

	if (!import.meta.env.FIREFOX) {
		browser.action.onClicked?.addListener(() => {
			browser.tabs.create({ url: browser.runtime.getURL('/newtab.html') })
			Analytics.event('IconClicked')
		})
	}

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

	browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
		if (message.type === 'VERTICAL_TABS_SETTINGS_UPDATED') {
			setupSidePanel()
				.then(() => {
					sendResponse({ success: true })
				})
				.catch((error) => {
					console.error('Error in setupSidePanel:', error)
					sendResponse({ success: false, error: error.message })
				})
			return true
		}

		return false
	})

	cleanupOutdatedCaches()
	setupSidePanel()
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
