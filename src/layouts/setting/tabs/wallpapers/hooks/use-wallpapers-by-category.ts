import type { Category, Wallpaper } from '@/common/wallpaper.interface'
import { getMainClient } from '@/services/api'
import { useGetWallpaperCategories } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

interface CategoryWallpapers {
	category: Category
	wallpapers: Wallpaper[]
}

interface WallpaperResponse {
	wallpapers: Wallpaper[]
	totalPages: number
}

export function useWallpapersByCategory() {
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

	const wallpaperCacheRef = useRef<Record<string, Wallpaper[]>>({})
	const {
		data: categories = [],
		isLoading: categoriesLoading,
		error: categoriesError,
	} = useGetWallpaperCategories()

	const shouldFetchWallpapers = !wallpaperCacheRef.current[selectedCategoryId || '']
	const {
		data: fetchedWallpapers,
		isLoading: wallpapersLoading,
		error: wallpapersError,
	} = useQuery<Wallpaper[]>({
		queryKey: ['getWallpapers', selectedCategoryId],
		queryFn: async () => {
			if (selectedCategoryId === null) {
				return wallpaperCacheRef.current[''] || []
			}

			const client = await getMainClient()
			const endpoint =
				selectedCategoryId === null
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
			wallpaperCacheRef.current[selectedCategoryId || ''] = fetchedWallpapers
		}
	}, [fetchedWallpapers, selectedCategoryId])

	const changeCategory = (categoryId: string) => {
		setSelectedCategoryId(categoryId)
	}

	const wallpapers =
		wallpaperCacheRef.current[selectedCategoryId || ''] || fetchedWallpapers || []

	const getCategoryWallpapers = (categoryId: string) => {
		if (categoryId === null) {
			return wallpaperCacheRef.current[''] || fetchedWallpapers || []
		}

		const allWallpapers = wallpaperCacheRef.current[''] || fetchedWallpapers || []
		return allWallpapers.filter((wallpaper) => wallpaper.categoryId === categoryId)
	}

	const wallpapersByCategory = () => {
		if (!wallpapers || selectedCategoryId === null) return []

		const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)
		if (!selectedCategory) return []

		return [
			{
				category: selectedCategory,
				wallpapers: wallpapers,
			},
		] as CategoryWallpapers[]
	}

	const allWallpapers = wallpapers || []

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
		getCategoryWallpapers,
	}
}
