export enum SwEventType {
	DeleteCache = 'DELETE_CACHE',
	UpdateCache = 'UPDATE_CACHE',
}

export enum CacheName {
	API = 'widgetify-public-api',
}
export type DeleteCacheEvent = {
	type: SwEventType.DeleteCache
	cacheName: CacheName
	path: string
}

export type UpdateCacheEvent = {
	type: SwEventType.UpdateCache
	cacheName: CacheName
	path: string
	data: any
}

export type SwEvent = DeleteCacheEvent | UpdateCacheEvent
