import { CACHE_PREFIX, CacheNames, EXPECTED_CACHES, LEGACY_CACHES } from './cache-names'

const MAX_CACHE_BYTES = 100 * 1024 * 1024

/** How many entries to delete before re-checking the storage estimate. */
const TRIM_BATCH_SIZE = 20

export async function purgeStaleCaches(): Promise<void> {
	try {
		const names = await caches.keys()
		await Promise.all(
			names.map((name) => {
				const isOurs = name.startsWith(CACHE_PREFIX)
				const isStaleVersion = isOurs && !EXPECTED_CACHES.has(name)
				const isLegacy = LEGACY_CACHES.includes(name)
				return isStaleVersion || isLegacy
					? caches.delete(name)
					: Promise.resolve(false)
			})
		)
	} catch (error) {
		console.error('[widgetify] failed to purge stale caches:', error)
	}
}

/**
 * Keep total cache usage under budget by evicting from cheapest-to-refetch to
 * most expensive.
 *
 * Order matters. The wallpaper cache is FIRST because it holds a single entry
 * that can be a multi-megabyte video — by far the most likely thing to blow the
 * budget on its own. It was previously omitted entirely, which meant an
 * oversized wallpaper caused every other cache to be wiped (destroying offline
 * support and forcing refetches) while the actual offender stayed put, often
 * still over budget afterwards.
 *
 * Fonts come last: they are small, immutable, and their absence is immediately
 * visible as a font swap.
 */
const TRIM_ORDER = [
	CacheNames.wallpaper,
	CacheNames.cdnCss,
	CacheNames.cdn,
	CacheNames.api,
	CacheNames.fonts,
] as const

export async function enforceCacheBudget(): Promise<void> {
	try {
		if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return

		const overBudget = async () => {
			const { usage = 0 } = await navigator.storage.estimate()
			return usage > MAX_CACHE_BYTES
		}

		if (!(await overBudget())) return

		for (const name of TRIM_ORDER) {
			const cache = await caches.open(name)
			const keys = await cache.keys()
			if (keys.length === 0) continue

			// Delete in parallel batches rather than one awaited call per entry.
			// A cache holding hundreds of entries previously meant hundreds of
			// sequential round-trips, and `storage.estimate()` — which is not
			// cheap — was being re-run every 10 of them.
			for (let i = 0; i < keys.length; i += TRIM_BATCH_SIZE) {
				const batch = keys.slice(i, i + TRIM_BATCH_SIZE)
				await Promise.all(batch.map((request) => cache.delete(request)))

				if (!(await overBudget())) return
			}
		}
	} catch (error) {
		console.error('[widgetify] failed to enforce cache budget:', error)
	}
}
