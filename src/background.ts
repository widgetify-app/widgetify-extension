import browser from 'webextension-polyfill'
import Analytics from './analytics'
import { setToStorage } from './common/storage'

browser.runtime.onInstalled.addListener(async (details) => {
	if (details.reason === 'install') {
		await setToStorage('showWelcomeModal', true)

		const manifest = browser.runtime.getManifest()

		Analytics.featureUsed('Installed', {
			version: manifest.version,
			installType: details.temporary ? 'Temporary' : 'Permanent',
		})
	} else if (details.reason === 'update') {
		// Track update event
		const manifest = browser.runtime.getManifest()
		const previousVersion = details.previousVersion || 'unknown'

		Analytics.featureUsed('Updated', {
			version: manifest.version,
			previousVersion,
		})
	}
})

browser.runtime.onStartup.addListener(() => {
	// Track extension startup
	Analytics.featureUsed('Startup')
})
