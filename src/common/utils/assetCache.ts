import browser from 'webextension-polyfill'

export interface AssetCacheOptions {
	preload?: boolean
	fallbackUrl?: string
	priority?: 'high' | 'normal' | 'low'
}

interface CacheResponse {
	success?: boolean
	cached?: boolean
	totalSize?: number
	totalItems?: number
}

export class AssetCacheUtil {
	private static instance: AssetCacheUtil
	private cachePromises = new Map<string, Promise<boolean>>()

	static getInstance(): AssetCacheUtil {
		if (!AssetCacheUtil.instance) {
			AssetCacheUtil.instance = new AssetCacheUtil()
		}
		return AssetCacheUtil.instance
	}

	/**
	 * Load an asset with offline caching support
	 * @param url The URL of the asset to load
	 * @param options Caching options
	 * @returns Promise that resolves to the asset URL (original or fallback)
	 */
	async loadAssetWithCache(url: string, options: AssetCacheOptions = {}): Promise<string> {
		if (!url) return options.fallbackUrl || ''

		try {
			// Check if asset is already cached
			const isCached = await this.isAssetCached(url)
			
			if (!isCached && navigator.onLine) {
				// Preload and cache the asset if online
				await this.cacheAsset(url)
			}

			// For images, we can try to load and see if it works
			if (this.isImageUrl(url)) {
				return await this.loadImageWithFallback(url, options.fallbackUrl)
			}

			return url
		} catch (error) {
			console.warn('Failed to load asset with cache:', url, error)
			return options.fallbackUrl || url
		}
	}

	/**
	 * Preload and cache multiple assets
	 * @param urls Array of asset URLs to cache
	 * @param options Caching options
	 */
	async preloadAssets(urls: string[], _options: AssetCacheOptions = {}): Promise<void> {
		if (!navigator.onLine) return

		const cachePromises = urls.map(url => this.cacheAsset(url))
		
		try {
			await Promise.allSettled(cachePromises)
		} catch (error) {
			console.warn('Failed to preload some assets:', error)
		}
	}

	/**
	 * Cache a single asset
	 * @param url The URL of the asset to cache
	 */
	async cacheAsset(url: string): Promise<boolean> {
		if (!url) return false

		// Prevent duplicate caching requests
		if (this.cachePromises.has(url)) {
			return await this.cachePromises.get(url)!
		}

		const cachePromise = this.performCaching(url)
		this.cachePromises.set(url, cachePromise)

		try {
			const result = await cachePromise
			return result
		} finally {
			this.cachePromises.delete(url)
		}
	}

	private async performCaching(url: string): Promise<boolean> {
		try {
			const response = await browser.runtime.sendMessage({
				type: 'CACHE_ASSET',
				url
			}) as CacheResponse
			return response?.success || false
		} catch (error) {
			console.warn('Failed to cache asset:', url, error)
			return false
		}
	}

	/**
	 * Check if an asset is cached
	 * @param url The URL to check
	 */
	async isAssetCached(url: string): Promise<boolean> {
		if (!url) return false

		try {
			const response = await browser.runtime.sendMessage({
				type: 'GET_CACHE_STATUS',
				url
			}) as CacheResponse
			return response?.cached || false
		} catch (error) {
			console.warn('Failed to check cache status:', url, error)
			return false
		}
	}

	/**
	 * Clear all cached assets
	 */
	async clearCache(): Promise<boolean> {
		try {
			const response = await browser.runtime.sendMessage({
				type: 'CLEAR_CACHE'
			}) as CacheResponse
			return response?.success || false
		} catch (error) {
			console.warn('Failed to clear cache:', error)
			return false
		}
	}

	/**
	 * Load image with fallback support
	 */
	private loadImageWithFallback(url: string, fallbackUrl?: string): Promise<string> {
		return new Promise((resolve) => {
			const img = new Image()
			
			img.onload = () => {
				resolve(url)
			}
			
			img.onerror = () => {
				if (fallbackUrl) {
					resolve(fallbackUrl)
				} else {
					// Return a data URL for a transparent 1x1 pixel
					resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
				}
			}
			
			img.src = url
		})
	}

	/**
	 * Check if URL is for an image
	 */
	private isImageUrl(url: string): boolean {
		return /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url) ||
			   url.includes('image') ||
			   url.includes('photo') ||
			   url.includes('wallpaper')
	}

	/**
	 * Get cache statistics
	 */
	async getCacheStats(): Promise<{ totalSize: number; totalItems: number }> {
		try {
			// Send message to background script to get cache stats
			const response = await browser.runtime.sendMessage({
				type: 'GET_CACHE_STATS'
			}) as CacheResponse
			
			if (response && typeof response.totalSize === 'number' && typeof response.totalItems === 'number') {
				return { totalSize: response.totalSize, totalItems: response.totalItems }
			}
			return { totalSize: 0, totalItems: 0 }
		} catch (error) {
			console.warn('Failed to get cache stats:', error)
			return { totalSize: 0, totalItems: 0 }
		}
	}

	/**
	 * Clear asset cache
	 */
	async clearAssetCache(): Promise<void> {
		try {
			// Send message to background script to clear cache
			await browser.runtime.sendMessage({
				type: 'CLEAR_ASSET_CACHE'
			})
		} catch (error) {
			console.error('Failed to clear asset cache:', error)
			throw error
		}
	}
}

// Export singleton instance
export const assetCache = AssetCacheUtil.getInstance()

// Convenience functions
export const loadAssetWithCache = (url: string, options?: AssetCacheOptions) =>
	assetCache.loadAssetWithCache(url, options)

export const preloadAssets = (urls: string[], options?: AssetCacheOptions) =>
	assetCache.preloadAssets(urls, options)

export const cacheAsset = (url: string) =>
	assetCache.cacheAsset(url)

export const isAssetCached = (url: string) =>
	assetCache.isAssetCached(url)

export const clearAssetCache = () =>
	assetCache.clearCache()
