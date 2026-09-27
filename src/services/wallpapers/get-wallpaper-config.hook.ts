import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { wallpapersKeys } from '@/services/wallpapers/wallpapers.keys'

interface WallpaperConfig {
	maxUploadSizeFree: number
	maxUploadSizeVip: number
}

async function getWallpaperConfig(): Promise<WallpaperConfig> {
	const client = getMainClient()
	const response = await client.get<{ data: WallpaperConfig }>('/wallpapers/config')
	return response.data.data
}

export const useGetWallpaperConfig = () => {
	return useQuery<WallpaperConfig>({
		queryKey: wallpapersKeys.config,
		queryFn: getWallpaperConfig,
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60 * 24,
	})
}
