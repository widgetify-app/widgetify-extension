import { getFromStorage } from '@/common/storage'
import { CacheNames } from './cache-names'

export const activeWallpaperUrls = new Set<string>()

/**
 * Ceiling for a cached wallpaper.
 *
 * Video wallpapers can be tens of megabytes. Caching one that large eats most
 * of the 100MB budget by itself and then forces enforceCacheBudget to evict
 * everything else — so a too-large wallpaper is deliberately streamed from the
 * network each time instead of being pinned for offline use.
 */
const MAX_WALLPAPER_BYTES = 25 * 1024 * 1024

function isCacheable(src: string | null | undefined): src is string {
	return typeof src === 'string' && /^https?:\/\//.test(src)
}

export async function initActiveWallpaper(): Promise<void> {
	try {
		const wallpaper = await getFromStorage('wallpaper')
		activeWallpaperUrls.clear()
		if (wallpaper && isCacheable(wallpaper.src)) {
			activeWallpaperUrls.add(wallpaper.src)
		}
	} catch (error) {
		console.error('[widgetify] failed to read active wallpaper:', error)
	}
}

export async function setActiveWallpaper(src: string): Promise<void> {
	try {
		activeWallpaperUrls.clear()
		if (!isCacheable(src)) return
		activeWallpaperUrls.add(src)

		const cache = await caches.open(CacheNames.wallpaper)

		// Only one wallpaper is ever pinned — drop whatever the previous one was.
		const keys = await cache.keys()
		await Promise.all(
			keys
				.filter((request) => request.url !== src)
				.map((request) => cache.delete(request))
		)

		const already = await cache.match(src)
		// Replace any previously stored opaque response (status 0 / type opaque):
		// opaque entries get a large, misleading padding added to storage estimates.
		const isOpaque = !!already && (already.type === 'opaque' || already.status === 0)
		if (already && !isOpaque) return

		// Fetch with CORS (cdn.widgetify.ir sends ACAO) so we store a real
		// response instead of an opaque one.
		const response = await fetch(src, { mode: 'cors' })
		if (!response.ok) return

		if (await exceedsSizeLimit(response)) return

		await cache.put(src, response)
	} catch (error) {
		console.error('[widgetify] failed to cache wallpaper:', error)
	}
}

/**
 * Checks Content-Length before committing the body to the cache.
 *
 * Only consumes a clone when the header is missing, so the common case costs
 * nothing. Note this reads the whole body into memory for that fallback path,
 * which is acceptable because it only happens for a single wallpaper.
 */
async function exceedsSizeLimit(response: Response): Promise<boolean> {
	const declared = Number(response.headers.get('content-length'))
	if (Number.isFinite(declared) && declared > 0) {
		return declared > MAX_WALLPAPER_BYTES
	}

	try {
		const blob = await response.clone().blob()
		return blob.size > MAX_WALLPAPER_BYTES
	} catch {
		// Cannot determine the size — cache it rather than losing offline
		// support; enforceCacheBudget will evict it first if it turns out big.
		return false
	}
}
