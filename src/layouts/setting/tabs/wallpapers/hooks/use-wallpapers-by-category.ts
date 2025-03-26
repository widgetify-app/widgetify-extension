import type { Category, Wallpaper } from '@/common/wallpaper.interface'
import { getMainClient } from '@/services/api'
import { useGetWallpaperCategories } from '@/services/getMethodHooks/getWallpaperCategories.hook'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface CategoryWallpapers {
	category: Category
	wallpapers: Wallpaper[]
}

interface WallpaperResponse {
	wallpapers: Wallpaper[]
	totalPages: number
}

export function useWallpapersByCategory() {
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('all')

	const wallpaperCacheRef = useRef<Record<string, Wallpaper[]>>({})

	const {
		data: categories = [],
		isLoading: categoriesLoading,
		error: categoriesError,
	} = useGetWallpaperCategories()

	const shouldFetchWallpapers = !wallpaperCacheRef.current[selectedCategoryId || 'all']

	const {
		data: fetchedWallpapers,
		isLoading: wallpapersLoading,
		error: wallpapersError,
	} = useQuery<Wallpaper[]>({
		queryKey: ['getWallpapers', selectedCategoryId],
		queryFn: async () => {
			const client = await getMainClient()
			const endpoint =
				selectedCategoryId === 'all'
					? '/wallpapers'
					: `/wallpapers?categoryId=${selectedCategoryId}`

			const { data } = await client.get<WallpaperResponse>(endpoint)
			return data.wallpapers || []
		},
		retry: 0,
		enabled: shouldFetchWallpapers,
	})

	useEffect(() => {
		if (fetchedWallpapers && fetchedWallpapers.length > 0) {
			wallpaperCacheRef.current[selectedCategoryId || 'all'] = fetchedWallpapers
		}
	}, [fetchedWallpapers, selectedCategoryId])

	const changeCategory = useCallback((categoryId: string) => {
		setSelectedCategoryId(categoryId)
	}, [])

	const wallpapers = useMemo(() => {
		return (
			wallpaperCacheRef.current[selectedCategoryId || 'all'] || fetchedWallpapers || []
		)
	}, [fetchedWallpapers, selectedCategoryId])

	const wallpapersByCategory = useMemo(() => {
		if (!wallpapers || selectedCategoryId === 'all') return []

		const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)
		if (!selectedCategory) return []

		return [
			{
				category: selectedCategory,
				wallpapers: wallpapers,
			},
		] as CategoryWallpapers[]
	}, [categories, wallpapers, selectedCategoryId])

	const allWallpapers = useMemo(() => {
		return wallpapers || []
	}, [wallpapers])

	const isLoading = categoriesLoading || (wallpapersLoading && shouldFetchWallpapers)
	const error = categoriesError || wallpapersError

	return {
		categories,
		wallpapersByCategory,
		allWallpapers,
		isLoading,
		error,
		selectedCategoryId,
		changeCategory,
	}
}
