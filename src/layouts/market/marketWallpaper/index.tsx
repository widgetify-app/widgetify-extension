import { useState } from 'react'
import Analytics from '@/analytics'
import { Pagination } from '@/components/pagination'
import { WallpaperItem } from '@/layouts/setting/tabs/wallpapers/tab/gallery/components/wallpaper-item/wallpaper-item'
import { useGetWallpapers } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'
import { useWallpaperContext } from '@/context/wallpaper.context'
import { usePreviewHandler } from '@/hooks/usePreviewHandler'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { MarketItemType } from '@/services/hooks/market/market.interface'

export function MarketWallpaper() {
	const [currentPage, setCurrentPage] = useState(1)
	const { data } = useGetWallpapers(
		{
			market: true,
			page: currentPage,
			limit: 12,
		},
		true
	)

	const { selectedBackground, handleSelectBackground, currentStoredWallpaper } =
		useWallpaperContext()

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

	return (
		<>
			<div className="grid grid-cols-2 gap-3 p-2 sm:grid-cols-3 md:grid-cols-4">
				{data?.wallpapers.map((wallpaper) => (
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

			<Pagination
				currentPage={currentPage}
				totalPages={data?.totalPages || 1}
				onNextPage={() => {
					setCurrentPage(currentPage + 1)
					Analytics.event('market_wallpaper_next_page')
				}}
				onPrevPage={() => {
					setCurrentPage(currentPage - 1)
					Analytics.event('market_wallpaper_prev_page')
				}}
				className="mt-8!"
			/>
		</>
	)
}
