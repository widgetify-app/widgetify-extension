export interface Wallpaper {
	id: string
	name: string
	type: 'IMAGE' | 'VIDEO'
	src: string
	isCustom?: boolean
	source?: string
}

export interface StoredWallpaper {
	id: string
	type: 'IMAGE' | 'VIDEO'
	src: string
	isRetouchEnabled: boolean
}

export interface WallpaperResponse {
	wallpapers: Wallpaper[]
}

// New Category interface
export interface Category {
	id: string
	name: string
	slug: string
	createdAt: string
	updatedAt: string
}
