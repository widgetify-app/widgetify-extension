import { cleanupOutdatedCaches } from 'workbox-precaching'
import Analytics from '../src/analytics'
import { removeFromStorage, setToStorage } from '../src/common/storage'
import { preloadCriticalResources } from './utils'
import { type SwEvent, SwEventType } from '@/common/types/sw-events'

export function setupEventListeners() {
	if (!import.meta.env.FIREFOX) {
		browser.action.onClicked?.addListener(() => {
			browser.tabs.create({ url: browser.runtime.getURL('/newtab.html') })
			Analytics.event('IconClicked')
		})
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
			import.meta.env.DEV && (await preloadCriticalResources())
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

	browser.runtime.onMessage.addListener(async (message: SwEvent) => {
		switch (message.type) {
			case SwEventType.DeleteCache: {
				const cache = await caches.open(message.cacheName)
				const requests = await cache.keys()

				await Promise.all(
					requests
						.filter((request) => {
							const url = new URL(request.url)

							return (
								url.origin === 'https://api.widgetify.ir' &&
								url.pathname.startsWith(message.path)
							)
						})
						.map((request) => cache.delete(request))
				)

				break
			}
			case SwEventType.UpdateCache: {
				const cache = await caches.open(message.cacheName)

				const requests = await cache.keys()
				const existingRequest = requests.find((request) => {
					const url = new URL(request.url)
					return url.pathname === message.path
				})

				if (!existingRequest) break

				const response = new Response(JSON.stringify(message.data), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				})

				await cache.put(existingRequest, response)

				break
			}
		}
	})
}
