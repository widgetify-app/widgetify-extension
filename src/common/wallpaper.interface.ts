export interface Wallpaper {
	id: string
	name: string
	type: 'IMAGE' | 'VIDEO' | 'GRADIENT'
	src: string
	previewSrc: string
	isCustom?: boolean
	source?: string
	gradient?: GradientColors
	categoryId?: string
	coin?: number
	isOwned?: boolean
}

export interface GradientColors {
	from: string
	to: string
	direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl'
}

export interface StoredWallpaper {
	id: string
	type: 'IMAGE' | 'VIDEO' | 'GRADIENT'
	src: string
	gradient?: GradientColors
}

export interface WallpaperResponse {
	wallpapers: Wallpaper[]
	totalPages: number
}

// New Category interface
export interface Category {
	id: string
	name: string
	slug: string
	createdAt: string
	updatedAt: string
	wallpapers?: Wallpaper[] // just last 4 wallpapers for preview (images only)
}
