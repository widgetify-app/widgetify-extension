import { cleanupOutdatedCaches } from 'workbox-precaching'
import Analytics from '../src/analytics'
import { removeFromStorage, setToStorage } from '../src/common/storage'
import { preloadCriticalResources } from './utils'

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
}
