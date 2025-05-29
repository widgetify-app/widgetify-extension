import { loadAssetWithCache } from './assetCache'

export const getFaviconFromUrl = (url: string): string => {
	try {
		if (!url.trim()) {
			return ''
		}

		let processedUrl = url
		if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
			processedUrl = `https://${processedUrl}`
		}

		const urlObj = new URL(processedUrl)
		return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`
	} catch {
		return ''
	}
}

/**
 * Get favicon with offline caching support
 * @param url The URL to get favicon for
 * @returns Promise that resolves to the favicon URL (cached or fallback)
 */
export const getCachedFaviconFromUrl = async (url: string): Promise<string> => {
	const faviconUrl = getFaviconFromUrl(url)
	if (!faviconUrl) {
		return getDefaultFavicon()
	}

	try {
		const cachedIconUrl = await loadAssetWithCache(faviconUrl, {
			fallbackUrl: getDefaultFavicon()
		})
		return cachedIconUrl
	} catch (error) {
		console.warn('Failed to load cached favicon:', error)
		return getDefaultFavicon()
	}
}

/**
 * Get a default favicon as fallback
 * @returns Data URL for a default icon
 */
export const getDefaultFavicon = (): string => {
	// Return a simple website icon as base64
	return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iMyIgZmlsbD0iIzMzNzNkYyIvPgo8cGF0aCBkPSJNOCA0QzYuODk1IDQgNiA0Ljg5NSA2IDZWMTBDNiAxMS4xMDUgNi44OTUgMTIgOCAxMkM5LjEwNSAxMiAxMCAxMS4xMDUgMTAgMTBWNkMxMCA0Ljg5NSA5LjEwNSA0IDggNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo='
}
