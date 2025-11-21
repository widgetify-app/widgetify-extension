import { cleanupOutdatedCaches } from 'workbox-precaching'
import { getFromStorage, setToStorage } from '../src/common/storage'
import { setupCaching } from '../background/cache'
import { setupEventListeners } from '../background/events'
import { normalizeKey, trySync } from '../background/utils'

let debounceTimer: any = null

export default defineBackground(() => {
	setupCaching()
	setupEventListeners()

	browser.runtime.onMessage.addListener(
		async (msg: {
			type: string
			folderId: string | null
			bookmarks: { id: string; order: number }[]
		}) => {
			if (msg.type !== 'REORDER') return

			let store = await getFromStorage('pendingOrders')
			let pendingOrders = store?.pendingOrders || {}

			const key = normalizeKey(msg.folderId)
			pendingOrders[key] = { bookmarks: msg.bookmarks }

			await setToStorage('pendingOrders', pendingOrders)

			clearTimeout(debounceTimer)
			debounceTimer = setTimeout(() => {
				trySync()
			}, 600)
		}
	)

	cleanupOutdatedCaches()
	trySync()
})
