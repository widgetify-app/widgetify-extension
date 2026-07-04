import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
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

interface CategoryResponse {
	categories: Category[]
	totalPages: number
}

interface GetCategoriesQuery {
	page?: number
	limit?: number
}

export const useGetWallpaperCategoriesPaginated = (
	q: GetCategoriesQuery,
	enabled: boolean = true
) => {
	const queryParams = new URLSearchParams()

	if (q.page) {
		queryParams.append('page', String(q.page))
	}
	if (q.limit) {
		queryParams.append('limit', String(q.limit))
	}

	const endpoint = `/wallpapers/categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

	return useQuery<CategoryResponse>({
		queryKey: ['getWallpaperCategoriesPaginated', queryParams.toString()],
		queryFn: async () => {
			const client = getMainClient()
			const { data } = await client.get<CategoryResponse>(endpoint)
			return data
		},
		retry: 0,
		enabled: enabled,
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

async function getWallpaperCategories(): Promise<Category[]> {
	const client = getMainClient()
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
			const client = getMainClient()
			const { data } = await client.get<WallpaperResponse>(endpoint)
			return data
		},
		retry: 0,
		enabled: enabled,
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

export const useGetWallpapersInfiniteQuery = (q: GetWallpaperQuery, enabled: boolean) => {
	return useInfiniteQuery<WallpaperResponse>({
		queryKey: ['getWallpapers', q.limit, q.categoryId],
		queryFn: async ({ pageParam }) =>
			getWallpapersByCategoryId({ ...q, page: pageParam as number }),
		retry: 0,
		enabled: enabled,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const currentPage = allPages.length
			return currentPage < lastPage.totalPages ? currentPage + 1 : undefined
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

async function getWallpapersByCategoryId(
	params: GetWallpaperQuery
): Promise<WallpaperResponse> {
	const queryParams = new URLSearchParams()

	if (params?.page) queryParams.append('page', params.page.toString())
	if (params?.limit) queryParams.append('limit', params.limit.toString())
	if (params.categoryId) {
		queryParams.append('categoryId', params.categoryId)
	}
	if (params.market) {
		queryParams.append('market', String(params.market))
	}

	const client = getMainClient()
	const { data } = await client.get<WallpaperResponse>('/wallpapers', {
		params: queryParams,
	})
	return data
}

export async function getRandomWallpaper(): Promise<Wallpaper | null> {
	try {
		const client = getMainClient()
		const { data } = await client.get<WallpaperResponse>('/wallpapers?random=true')
		return data.wallpapers[0]
	} catch {
		return null
	}
}
