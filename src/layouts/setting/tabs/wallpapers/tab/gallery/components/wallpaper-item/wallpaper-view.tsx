import { useEffect } from 'react'
import { preloadImages } from '@/common/utils/preloadImages'
import type { Category, Wallpaper } from '@/common/wallpaper.interface'
import { FolderPath } from '@/layouts/bookmark/components/folder-path'
import { useGetWallpapersInfiniteQuery } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'
import { useWallpaperContext } from '@/context/wallpaper.context'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { WallpaperItem } from './wallpaper-item'
import { usePreviewHandler } from '@/hooks/usePreviewHandler'
import { MarketItemType } from '@/services/hooks/market/market.interface'
import Analytics from '@/analytics'

interface WallpaperViewProps {
	selectedCategory: Category | null
	onBackToCategories: () => void
}

const WALLPAPERS_PER_PAGE = 12

export function WallpaperView({
	selectedCategory,
	onBackToCategories,
}: WallpaperViewProps) {
	const {
		selectedBackground,
		handleSelectBackground,

		syncWithFetchedWallpapers,
		currentStoredWallpaper,
	} = useWallpaperContext()

	const { previewHandler } = usePreviewHandler()

	const handlePreview = (wallpaper: Wallpaper) => {
		previewHandler(
			{
				id: wallpaper.id,
				name: wallpaper.name,
				type: MarketItemType.wallpapers,
				price: wallpaper.coin || 0,
				description: '',
				meta: {
					wallpaperType: wallpaper.type,
				},
				previewUrl: wallpaper.previewSrc,
				itemValue: wallpaper.src,
				isOwned: wallpaper.isOwned || false,
			},
			{
				theme: '',
				font: '',
				browserTitle: '',
				wallpaper: currentStoredWallpaper,
			}
		)

		Analytics.event('wallpaper_previewed')
	}

	const {
		data: wallpaperResponse,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetWallpapersInfiniteQuery(
		{
			categoryId: selectedCategory?.id,
			limit: WALLPAPERS_PER_PAGE,
		},
		!!selectedCategory
	)

	const { containerRef, loadMoreRef } = useInfiniteScroll({
		hasNextPage: hasNextPage ?? false,
		isFetchingNextPage,
		fetchNextPage,
		direction: 'vertical',
		threshold: 0.1,
	})

	const allWallpapers =
		wallpaperResponse?.pages.flatMap((page) => page.wallpapers) || []

	useEffect(() => {
		if (allWallpapers.length) {
			syncWithFetchedWallpapers(allWallpapers)
			const imageUrls = allWallpapers
				.filter((wp) => wp.type === 'IMAGE')
				.slice(0, 5)
				.map((wp) => wp.src)
			preloadImages(imageUrls)
		}
	}, [allWallpapers])

	if (!selectedCategory) return null

	return (
		<div
			className="relative flex flex-col justify-between gap-2 overflow-y-auto h-96"
			ref={containerRef}
		>
			<div className="absolute right-0 flex justify-center p-1 mt-1 -top-3 bg-content rounded-t-2xl">
				<FolderPath
					folderPath={[
						{
							id: 'subfolder',
							title: selectedCategory?.name || 'پوشه',
						},
					]}
					onNavigate={onBackToCategories}
				/>
			</div>
			<div className="p-2 mt-5 overflow-x-hidden bg-content rounded-b-xl rounded-l-xl">
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
					{allWallpapers.map((wallpaper) => (
						<div key={wallpaper.id} className="transform-gpu">
							<WallpaperItem
								wallpaper={wallpaper}
								selectedBackground={selectedBackground}
								setSelectedBackground={handleSelectBackground}
								onPreviewBackground={handlePreview}
							/>
						</div>
					))}
				</div>
				{hasNextPage && (
					<div ref={loadMoreRef} className="flex justify-center gap-3 p-1 mt-2">
						{MakeSkeleton(3)}
					</div>
				)}
			</div>
		</div>
	)
}

function MakeSkeleton(count: number) {
	return [...Array(count)].map((_, catIdx) => (
		<div
			key={`loading-${catIdx}`}
			className="w-full h-24 rounded-xl skeleton bg-base-content/5"
		></div>
	))
}
