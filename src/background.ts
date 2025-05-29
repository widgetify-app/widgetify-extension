import browser from 'webextension-polyfill'
import Analytics from './analytics'
import { setToStorage } from './common/storage'

// Add FetchEvent declaration for service worker context
declare global {
	interface FetchEvent extends Event {
		request: Request
		respondWith(response: Promise<Response> | Response): void
	}
}

// Cache configuration
const CACHE_NAME = 'widgetify-assets-v1'
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const MAX_CACHE_SIZE = 50 * 1024 * 1024 // 50MB

// Asset types to cache
const CACHEABLE_ASSETS = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'image/svg+xml',
	'image/x-icon',
	'image/vnd.microsoft.icon'
]

interface CacheMetadata {
	url: string
	timestamp: number
	size: number
	contentType: string
}

class AssetCacheManager {
	private cache: Cache | null = null

	async init() {
		if ('caches' in self) {
			this.cache = await caches.open(CACHE_NAME)
		}
	}

	async cacheAsset(url: string, response: Response): Promise<boolean> {
		if (!this.cache || !this.shouldCache(response)) {
			return false
		}

		try {
			// Check cache size before adding
			const cacheSize = await this.getCacheSize()
			const contentLength = parseInt(response.headers.get('content-length') || '0')
			
			if (cacheSize + contentLength > MAX_CACHE_SIZE) {
				await this.cleanupCache()
			}

			// Clone response before caching
			const responseClone = response.clone()
			await this.cache.put(url, responseClone)

			// Store metadata
			const metadata: CacheMetadata = {
				url,
				timestamp: Date.now(),
				size: contentLength,
				contentType: response.headers.get('content-type') || ''
			}
			
			await this.storeCacheMetadata(url, metadata)
			return true
		} catch (error) {
			console.error('Failed to cache asset:', error)
			return false
		}
	}

	async getCachedAsset(url: string): Promise<Response | null> {
		if (!this.cache) return null

		try {
			const cachedResponse = await this.cache.match(url)
			if (!cachedResponse) return null

			// Check if cache entry is expired
			const metadata = await this.getCacheMetadata(url)
			if (metadata && Date.now() - metadata.timestamp > CACHE_EXPIRY_MS) {
				await this.removeCachedAsset(url)
				return null
			}

			return cachedResponse
		} catch (error) {
			console.error('Failed to get cached asset:', error)
			return null
		}
	}

	async removeCachedAsset(url: string) {
		if (!this.cache) return

		try {
			await this.cache.delete(url)
			await this.removeCacheMetadata(url)
		} catch (error) {
			console.error('Failed to remove cached asset:', error)
		}
	}

	private shouldCache(response: Response): boolean {
		const contentType = response.headers.get('content-type') || ''
		return response.ok && CACHEABLE_ASSETS.some(type => contentType.includes(type))
	}

	private async getCacheSize(): Promise<number> {
		const metadataList = await this.getAllCacheMetadata()
		return metadataList.reduce((total, metadata) => total + metadata.size, 0)
	}

	private async cleanupCache() {
		const metadataList = await this.getAllCacheMetadata()
		// Sort by timestamp (oldest first)
		metadataList.sort((a, b) => a.timestamp - b.timestamp)
		
		// Remove oldest 25% of cached items
		const itemsToRemove = Math.ceil(metadataList.length * 0.25)
		for (let i = 0; i < itemsToRemove; i++) {
			await this.removeCachedAsset(metadataList[i].url)
		}
	}

	private async storeCacheMetadata(url: string, metadata: CacheMetadata) {
		const key = `cache_metadata_${btoa(url)}`
		await browser.storage.local.set({ [key]: metadata })
	}

	private async getCacheMetadata(url: string): Promise<CacheMetadata | null> {
		const key = `cache_metadata_${btoa(url)}`
		const result = await browser.storage.local.get([key])
		const data = result[key]
		return data && typeof data === 'object' && 'url' in data ? data as CacheMetadata : null
	}

	private async removeCacheMetadata(url: string) {
		const key = `cache_metadata_${btoa(url)}`
		try {
			await browser.storage.local.remove([key])
		} catch (error) {
			console.error('Failed to remove cache metadata:', error)
		}
	}

	private async getAllCacheMetadata(): Promise<CacheMetadata[]> {
		const storage = await browser.storage.local.get()
		const metadataList: CacheMetadata[] = []
		
		for (const [key, value] of Object.entries(storage)) {
			if (key.startsWith('cache_metadata_')) {
				metadataList.push(value as CacheMetadata)
			}
		}
		
		return metadataList
	}

	async clearExpiredCache() {
		const metadataList = await this.getAllCacheMetadata()
		const now = Date.now()
		
		for (const metadata of metadataList) {
			if (now - metadata.timestamp > CACHE_EXPIRY_MS) {
				await this.removeCachedAsset(metadata.url)
			}
		}
	}

	async getCacheStats(): Promise<{ size: number; itemCount: number }> {
		const metadataList = await this.getAllCacheMetadata()
		const size = metadataList.reduce((total, metadata) => total + metadata.size, 0)
		return {
			size,
			itemCount: metadataList.length
		}
	}

	async clearCache(): Promise<boolean> {
		try {
			if (this.cache) {
				const keys = await this.cache.keys()
				await Promise.all(keys.map(request => this.cache!.delete(request)))
			}
			
			// Clear all cache metadata
			const storage = await browser.storage.local.get()
			const keysToRemove = Object.keys(storage).filter(key => 
				key.startsWith('cache_metadata_')
			)
			if (keysToRemove.length > 0) {
				await browser.storage.local.remove(keysToRemove)
			}
			
			return true
		} catch (error) {
			console.error('Failed to clear cache:', error)
			return false
		}
	}
}

// Initialize cache manager
const cacheManager = new AssetCacheManager()

browser.runtime.onInstalled.addListener(async (details) => {
	await cacheManager.init()
	
	if (details.reason === 'install') {
		await setToStorage('showWelcomeModal', true)

		const manifest = browser.runtime.getManifest()

		Analytics.featureUsed('Installed', {
			version: manifest.version,
			installType: details.temporary ? 'Temporary' : 'Permanent',
		})
	} else if (details.reason === 'update') {
		// Track update event
		const manifest = browser.runtime.getManifest()
		const previousVersion = details.previousVersion || 'unknown'

		Analytics.featureUsed('Updated', {
			version: manifest.version,
			previousVersion,
		})

		// Clear expired cache on update
		await cacheManager.clearExpiredCache()
	}
})

browser.runtime.onStartup.addListener(async () => {
	await cacheManager.init()
	// Track extension startup
	Analytics.featureUsed('Startup')
	
	// Clear expired cache on startup
	await cacheManager.clearExpiredCache()
})

// Handle fetch events for asset caching
if ('fetch' in self && 'addEventListener' in self) {
	(self as any).addEventListener('fetch', async (event: any) => {
		const request = event.request
		const url = request.url

		// Only handle GET requests for cacheable assets
		if (request.method !== 'GET') return

		// Check if this is a request for a cacheable asset
		const isCacheableAsset = CACHEABLE_ASSETS.some(type => 
			request.headers.get('accept')?.includes(type) ||
			url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i)
		)

		if (!isCacheableAsset) return

		event.respondWith(
			(async () => {
				// Try to get from cache first
				const cachedResponse = await cacheManager.getCachedAsset(url)
				if (cachedResponse) {
					return cachedResponse
				}

				// If not in cache or offline, try to fetch
				try {
					const response = await fetch(request)
					if (response.ok) {
						// Cache the response for future use
						await cacheManager.cacheAsset(url, response)
						return response
					}
					throw new Error('Network response was not ok')
				} catch (error) {
					// If fetch fails and we don't have cache, return a placeholder or error response
					console.warn('Failed to fetch asset:', url, error)
					
					// Return a transparent 1x1 pixel image as fallback for images
					if (url.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
						const fallbackImage = new Response(
							new Uint8Array([
								0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
								0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
								0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
								0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
								0x89, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x44, 0x41,
								0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
								0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
								0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
								0x42, 0x60, 0x82
							]),
							{
								headers: {
									'Content-Type': 'image/png',
									'Cache-Control': 'no-cache'
								}
							}
						)
						return fallbackImage
					}
					
					throw error
				}
			})()
		)
	})
}

// Message handler for cache operations
browser.runtime.onMessage.addListener((message: any) => {
	return new Promise((resolve) => {
		if (message.type === 'CACHE_ASSET') {
			(async () => {
				try {
					const response = await fetch(message.url)
					const success = await cacheManager.cacheAsset(message.url, response)
					resolve({ success })
				} catch (error: any) {
					resolve({ success: false, error: error.message })
				}
			})()
			return
		}
		
		if (message.type === 'GET_CACHE_STATUS') {
			(async () => {
				try {
					const cachedAsset = await cacheManager.getCachedAsset(message.url)
					resolve({ cached: !!cachedAsset })
				} catch (error: any) {
					resolve({ cached: false, error: error.message })
				}
			})()
			return
		}
		
		if (message.type === 'GET_CACHE_STATS') {
			(async () => {
				try {
					const stats = await cacheManager.getCacheStats()
					resolve({ success: true, stats })
				} catch (error: any) {
					resolve({ success: false, error: error.message })
				}
			})()
			return
		}
		
		if (message.type === 'CLEAR_ASSET_CACHE') {
			(async () => {
				try {
					const success = await cacheManager.clearCache()
					resolve({ success })
				} catch (error: any) {
					resolve({ success: false, error: error.message })
				}
			})()
			return
		}
		
		if (message.type === 'CLEAR_CACHE') {
			(async () => {
				try {
					if ('caches' in self) {
						await caches.delete(CACHE_NAME)
						// Clear metadata
						const storage = await browser.storage.local.get()
						const keysToRemove = Object.keys(storage).filter(key => 
							key.startsWith('cache_metadata_')
						)
						if (keysToRemove.length > 0) {
							await browser.storage.local.remove(keysToRemove)
						}
					}
					resolve({ success: true })
				} catch (error: any) {
					resolve({ success: false, error: error.message })
				}
			})()
			return
		}
		
		resolve(undefined) // Don't handle unknown messages
	})
})
