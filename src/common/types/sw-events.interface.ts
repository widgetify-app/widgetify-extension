export enum SwEventType {
	DeleteCache = 'DELETE_CACHE',
	UpdateCache = 'UPDATE_CACHE',
	SetActiveWallpaper = 'SET_ACTIVE_WALLPAPER',
}

export enum CacheName {
	API = 'widgetify-public-api',
}

export const CACHE_PREFIX = 'wgf-'

export const CACHE_BASE = {
	api: 'api',
	wallpaper: 'wallpaper',
	fonts: 'fonts',
	cdn: 'cdn',
	cdnCss: 'cdn-css',
	catalogMedia: 'catalog-media',
} as const

export const PRECACHE_PREFIX = 'workbox-precache'
type DeleteCacheEvent = {
	type: SwEventType.DeleteCache
	cacheName: CacheName
	path: string
}

type UpdateCacheEvent = {
	type: SwEventType.UpdateCache
	cacheName: CacheName
	path: string
	data: any
}

type SetActiveWallpaperEvent = {
	type: SwEventType.SetActiveWallpaper
	src: string
	wallpaperType: 'IMAGE' | 'VIDEO'
}

export type SwEvent = DeleteCacheEvent | UpdateCacheEvent | SetActiveWallpaperEvent
