import Analytics from '@/analytics'
import { Pagination } from '@/components/pagination'
import { useAuth } from '@/context/auth.context'
import { useWallpaper } from '@/layouts/setting/tabs/wallpapers/hooks/use-wallpaper'
import { WallpaperItem } from '@/layouts/setting/tabs/wallpapers/tab/gallery/components/wallpaper-item/wallpaper-item'
import { useGetWallpapers } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'

export function MarketWallpaper() {
	const { isAuthenticated } = useAuth()
	const [currentPage, setCurrentPage] = useState(1)
	const { data } = useGetWallpapers(
		{
			market: true,
			page: currentPage,
			limit: 12,
		},
		true
	)
	const { selectedBackground, handleSelectBackground } = useWallpaper(
		data?.wallpapers,
		isAuthenticated
	)
	const onNextPage = () => {
		setCurrentPage(currentPage + 1)
		Analytics.event('market_wallpaper_next_page')
	}

	const onPrevPage = () => {
		setCurrentPage(currentPage - 1)
		Analytics.event('market_wallpaper_prev_page')
	}

	return (
		<>
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 sm:gap-3">
				{data?.wallpapers.map((wallpaper) => (
					<div key={wallpaper.id} className="transform-gpu">
						<WallpaperItem
							wallpaper={wallpaper}
							selectedBackground={selectedBackground}
							setSelectedBackground={handleSelectBackground}
							onPreviewBackground={() => {}}
						/>
					</div>
				))}
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={data?.totalPages || 1}
				onNextPage={onNextPage}
				onPrevPage={onPrevPage}
				className="!mt-8"
			/>
		</>
	)
}
