import { cleanupOutdatedCaches } from 'workbox-precaching'
import { setupCaching } from '../background/cache'
import { setupEventListeners } from '../background/events'

export default defineBackground(() => {
	setupCaching()
	setupEventListeners()

	cleanupOutdatedCaches()
})
