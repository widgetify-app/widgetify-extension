export interface StoredWallpaper {
	id: string
	type: 'IMAGE' | 'VIDEO'
	src: string
	blurAmount?: number
	isRetouchEnabled: boolean
}
