import { cleanupOutdatedCaches } from 'workbox-precaching'
import { setupCaching } from '../background/cache'
import { setupEventListeners } from '../background/events'
import { enforceCacheBudget, purgeStaleCaches } from '../background/utils'
import { initActiveWallpaper } from '../background/wallpaper-cache'

/**
 * Cache maintenance: drop precache leftovers, drop caches from older extension
 * versions, then evict until we are under budget. Ordered because each step
 * only makes sense once the previous one has freed what it can.
 */
async function runCacheMaintenance(): Promise<void> {
	try {
		await cleanupOutdatedCaches()
		await purgeStaleCaches()
		await enforceCacheBudget()
	} catch (error) {
		console.error('[widgetify] cache maintenance failed:', error)
	}
}

export default defineBackground(() => {
	setupCaching()
	setupEventListeners()
	initActiveWallpaper()

	if (!import.meta.env.FIREFOX && typeof self !== 'undefined') {
		// `activate` is the correct home for this: waitUntil keeps the worker
		// alive until maintenance finishes. A bare top-level call can be killed
		// mid-flight, which is how half-purged caches happen.
		self.addEventListener('activate', (event: any) => {
			event.waitUntil(runCacheMaintenance())
		})
	} else {
		// Firefox does not give us the activate event here, so fall back to
		// running it directly at worker start.
		runCacheMaintenance()
	}
})
