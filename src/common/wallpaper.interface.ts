export interface StoredWallpaper {
	id: string
	type: 'IMAGE' | 'VIDEO'
	src: string
	isRetouchEnabled: boolean
}
