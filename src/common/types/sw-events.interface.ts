export enum SwEventType {
	DeleteCache = 'DELETE_CACHE',
	UpdateCache = 'UPDATE_CACHE',
	SetActiveWallpaper = 'SET_ACTIVE_WALLPAPER',
}

export enum CacheName {
	API = 'widgetify-public-api',
}
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
