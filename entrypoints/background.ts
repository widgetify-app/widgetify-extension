import { cleanupOutdatedCaches } from 'workbox-precaching'
import { setupCaching } from '../background/cache'
import { setupEventListeners } from '../background/events'
import { enforceCacheBudget, purgeStaleCaches } from '../background/utils'
import { initActiveWallpaper } from '../background/wallpaper-cache'

export default defineBackground(() => {
	setupCaching()
	setupEventListeners()

	cleanupOutdatedCaches()

	purgeStaleCaches()
		.then(() => enforceCacheBudget())
		.catch(() => {})
	initActiveWallpaper()

	if (!import.meta.env.FIREFOX && typeof self !== 'undefined') {
		self.addEventListener('activate', (event: any) => {
			event.waitUntil(purgeStaleCaches().then(() => enforceCacheBudget()))
		})
	}
})
