export interface Wallpaper {
	id: string
	name: string
	type: 'IMAGE' | 'VIDEO'
	src: string
	isCustom?: boolean
	source?: string
	category?: string
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
