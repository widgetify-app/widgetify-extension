import { useQuery } from '@tanstack/react-query'
import type { Category, Wallpaper, WallpaperResponse } from '@/common/wallpaper.interface'
import { getMainClient } from '@/services/api'

export const useGetWallpaperCategories = () => {
	return useQuery<Category[]>({
		queryKey: ['getWallpaperCategories'],
		queryFn: async () => getWallpaperCategories(),
		retry: 0,
		initialData: [],
	})
}

async function getWallpaperCategories(): Promise<Category[]> {
	const client = await getMainClient()
	const { data } = await client.get<Category[]>('/wallpapers/categories')
	return data
}

export async function getRandomWallpaper(): Promise<Wallpaper | null> {
	try {
		const client = await getMainClient()
		const { data } = await client.get<WallpaperResponse>('/wallpapers?random=true')
		return data.wallpapers[0]
	} catch {
		return null
	}
}
