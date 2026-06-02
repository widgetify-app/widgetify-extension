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

export function normalizeKey(folderId: string | null): string {
	return folderId == null ? BOOKMARK_ORDER_KEY : folderId
}

export function denormalizeKey(key: string) {
	return key === BOOKMARK_ORDER_KEY ? null : key
}
