import { CacheNames, EXPECTED_CACHES, LEGACY_CACHES } from './cache-names'

export const BOOKMARK_ORDER_KEY = '__root__'

const MAX_CACHE_BYTES = 100 * 1024 * 1024

export async function purgeStaleCaches(): Promise<void> {
	try {
		const names = await caches.keys()
		await Promise.all(
			names.map((name) => {
				const isOurs = name.startsWith('wgf-')
				const isStaleVersion = isOurs && !EXPECTED_CACHES.has(name)
				const isLegacy = LEGACY_CACHES.includes(name)
				return isStaleVersion || isLegacy
					? caches.delete(name)
					: Promise.resolve(false)
			})
		)
	} catch (error) {
		console.error('Failed to purge stale caches:', error)
	}
}

export async function enforceCacheBudget(): Promise<void> {
	try {
		if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return

		const overBudget = async () => {
			const { usage = 0 } = await navigator.storage.estimate()
			return usage > MAX_CACHE_BYTES
		}

		if (!(await overBudget())) return

		const trimOrder = [
			CacheNames.cdnCss,
			CacheNames.cdn,
			CacheNames.api,
			CacheNames.fonts,
		]
		for (const name of trimOrder) {
			const cache = await caches.open(name)
			const keys = await cache.keys()

			let deletions = 0
			for (const request of keys) {
				await cache.delete(request)
				if (++deletions % 10 === 0 && !(await overBudget())) return
			}

			if (!(await overBudget())) return
		}
	} catch {}
}

export function normalizeKey(folderId: string | null): string {
	return folderId == null ? BOOKMARK_ORDER_KEY : folderId
}

export function denormalizeKey(key: string) {
	return key === BOOKMARK_ORDER_KEY ? null : key
}
