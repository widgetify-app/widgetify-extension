import { cleanupOutdatedCaches } from 'workbox-precaching'
import { setupCaching } from './cache'
import { setupEventListeners } from './events'

export default defineBackground(() => {
	setupCaching()
	setupEventListeners()

	cleanupOutdatedCaches()
})
