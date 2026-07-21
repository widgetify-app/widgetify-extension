import { getFromStorage } from '@/common/storage'
import { CacheNames } from './cache-names'

export const activeWallpaperUrls = new Set<string>()

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
	} catch {}
}

export async function setActiveWallpaper(src: string): Promise<void> {
	try {
		activeWallpaperUrls.clear()
		if (!isCacheable(src)) return
		activeWallpaperUrls.add(src)

		const cache = await caches.open(CacheNames.wallpaper)

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
		if (!already || isOpaque) {
			// Fetch with CORS (cdn.widgetify.ir sends ACAO) so we store a real
			// response instead of an opaque one.
			const response = await fetch(src, { mode: 'cors' })
			if (response.ok) {
				await cache.put(src, response)
			}
		}
	} catch {}
}
