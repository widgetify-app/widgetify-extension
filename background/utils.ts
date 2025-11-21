import { getFromStorage, setToStorage } from '../src/common/storage'
import { getMainClient } from '../src/services/api'
export const BOOKMARK_ORDER_KEY = '__root__'
export async function preloadCriticalResources() {
	try {
		const cache = await caches.open('critical-resources-v1')

		const criticalUrls = ['/newtab.html'].filter(Boolean)

		if (criticalUrls.length > 0) {
			await cache.addAll(criticalUrls)
		}
	} catch (error) {
		console.error('Failed to preload critical resources:', error)
	}
}

export async function trySync() {
	const pending = await getFromStorage('pendingOrders')
	if (!pending) return
	console.log('Trying to sync pending bookmark orders...')
	for (const rawKey of Object.keys(pending)) {
		const folderId = denormalizeKey(rawKey)

		const body = { folderId, bookmarks: pending[rawKey].bookmarks }

		try {
			const client = await getMainClient()
			await client.put('/bookmarks/order', body)

			delete pending[rawKey]
			await setToStorage('pendingOrders', pending)
		} catch {
			return
		}
	}
}

export function normalizeKey(folderId: string | null): string {
	return folderId == null ? BOOKMARK_ORDER_KEY : folderId
}

export function denormalizeKey(key: string) {
	return key === BOOKMARK_ORDER_KEY ? null : key
}
