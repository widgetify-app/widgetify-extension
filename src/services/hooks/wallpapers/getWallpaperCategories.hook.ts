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

interface GetWallpaperQuery {
	market?: boolean
	page?: number
	limit?: number
	categoryId?: string
}
export const useGetWallpapers = (q: GetWallpaperQuery, enabled: boolean) => {
	const queryParams = new URLSearchParams()

	if (q.categoryId) {
		queryParams.append('categoryId', q.categoryId)
	}
	if (q.market) {
		queryParams.append('market', String(q.market))
	}
	if (q.page) {
		queryParams.append('page', String(q.page))
	}
	if (q.limit) {
		queryParams.append('limit', String(q.limit))
	}

	const endpoint = `/wallpapers?${queryParams.toString()}`

	return useQuery<WallpaperResponse>({
		queryKey: ['getWallpapers', queryParams.toString()],
		queryFn: async () => {
			const client = await getMainClient()
			const { data } = await client.get<WallpaperResponse>(endpoint)
			return data
		},
		retry: 0,
		enabled: enabled,
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
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
