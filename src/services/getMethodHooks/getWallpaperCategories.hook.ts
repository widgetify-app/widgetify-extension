import type { Category } from '@/common/wallpaper.interface'
import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../api'

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
