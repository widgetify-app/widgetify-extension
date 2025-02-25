import { useQuery } from '@tanstack/react-query'
import { type ApiResponse, getMainClient } from '../api'

export type FetchedWallpaper = {
	id: string
	name: string
	src: string
	type: 'IMAGE' | 'VIDEO'
	source: string
	category: string
}

export interface FetchedWallpaperResponse {
	wallpapers: FetchedWallpaper[]
	totalPages: number
}

export const useGetWallpapers = () => {
	return useQuery<FetchedWallpaperResponse>({
		queryKey: ['getWallpapers'],
		queryFn: async () => getWallpapers(),
		retry: 0,
		initialData: {
			wallpapers: [],
			totalPages: 0,
		},
	})
}

async function getWallpapers(): Promise<FetchedWallpaperResponse> {
	const client = await getMainClient()
	const { data } = await client.get<ApiResponse<FetchedWallpaperResponse>>('/wallpapers')
	return data.data
}
