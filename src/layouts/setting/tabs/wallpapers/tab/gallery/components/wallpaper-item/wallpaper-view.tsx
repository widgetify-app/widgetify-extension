import { useEffect, useMemo } from 'react'
import { preloadImages } from '@/common/utils/preload-images'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { useGetWallpapersInfiniteQuery } from '@/services/hooks/wallpapers/get-wallpaper-categories.hook'
import { useWallpaperContext } from '@/context/wallpaper.context'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { WallpaperItem } from './wallpaper-item'
import { usePreviewHandler } from '@/hooks/use-preview-handler'
import { MarketItemType } from '@/services/hooks/market/market.interface'
import Analytics from '@/analytics'
import { Icon } from '@/src/icons'

interface WallpaperViewProps {
	selectedCategoryId: string | null
	typeFilter: 'all' | 'image' | 'video'
	accessFilter: 'all' | 'free' | 'coin'
}

const WALLPAPERS_PER_PAGE = 18

export function WallpaperView({
	selectedCategoryId,
	typeFilter,
	accessFilter,
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
		isLoading,
	} = useGetWallpapersInfiniteQuery(
		{
			categoryId: selectedCategoryId || undefined,
			limit: WALLPAPERS_PER_PAGE,
		},
		true
	)

	const { containerRef, loadMoreRef } = useInfiniteScroll({
		hasNextPage: hasNextPage ?? false,
		isFetchingNextPage,
		fetchNextPage,
		direction: 'vertical',
		threshold: 0.1,
	})

	const allWallpapers = useMemo(() => {
		return wallpaperResponse?.pages.flatMap((page) => page.wallpapers) || []
	}, [wallpaperResponse])

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

	const filteredWallpapers = useMemo(() => {
		return allWallpapers.filter((wp) => {
			if (typeFilter === 'image' && wp.type !== 'IMAGE') return false
			if (
				typeFilter === 'video' &&
				wp.type !== 'VIDEO' &&
				!wp.src?.endsWith('.gif') &&
				!wp.previewSrc?.endsWith('.gif')
			)
				return false

			if (accessFilter === 'free' && wp.coin && !wp.isOwned) return false
			if (accessFilter === 'coin' && (!wp.coin || wp.isOwned)) return false

			return true
		})
	}, [allWallpapers, typeFilter, accessFilter])

	return (
		<div
			className="relative flex flex-col flex-1 h-full px-1 pt-1 overflow-y-auto"
			ref={containerRef}
		>
			{isLoading ? (
				<div className="grid grid-cols-3 gap-3">{MakeSkeleton(6)}</div>
			) : filteredWallpapers.length === 0 ? (
				<div className="flex flex-col items-center justify-center flex-1 py-16 text-muted">
					<Icon name="image" size={32} className="mb-2 opacity-40" />
					<p className="text-sm font-medium">تصویر زمینه‌ای یافت نشد</p>
					<p className="text-xs opacity-70 mt-0.5">
						فیلترهای انتخابی را تغییر دهید
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-3 gap-3">
						{filteredWallpapers.map((wallpaper) => (
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
						<div ref={loadMoreRef} className="grid grid-cols-3 gap-3 py-2">
							{MakeSkeleton(3)}
						</div>
					)}

					<div className="flex items-center justify-between py-2 text-xs border-t text-muted border-base-content/10">
						<span>
							نمایش {filteredWallpapers.length.toLocaleString('fa-IR')}{' '}
							تصویر زمینه
						</span>
					</div>
				</div>
			)}
		</div>
	)
}

function MakeSkeleton(count: number) {
	return [...Array(count)].map((_, idx) => (
		<div
			key={`loading-${idx}`}
			className="w-full border aspect-video rounded-xl skeleton bg-base-300 border-base-content/5"
		/>
	))
}
