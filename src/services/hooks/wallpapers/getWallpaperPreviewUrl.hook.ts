import { getMainClient } from '@/services/api'

interface WallpaperPreviewResponse {
	previewUrl: string
}

export async function fetchWallpaperPreviewUrl(wallpaperId: string): Promise<string> {
	const client = await getMainClient()
	const { data } = await client.get<{ data: WallpaperPreviewResponse }>(
		`/wallpapers/${wallpaperId}/preview`
	)
	return data.data.previewUrl
}
