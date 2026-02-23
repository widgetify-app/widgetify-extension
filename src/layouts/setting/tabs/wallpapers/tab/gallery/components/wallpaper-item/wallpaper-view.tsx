import { useEffect } from 'react'
import { preloadImages } from '@/common/utils/preloadImages'
import type { Category } from '@/common/wallpaper.interface'
import { Pagination } from '@/components/pagination'
import { useAuth } from '@/context/auth.context'
import { FolderPath } from '@/layouts/bookmark/components/folder-path'
import { useGetWallpapers } from '@/services/hooks/wallpapers/getWallpaperCategories.hook'
import { WallpaperGallery } from '../../../../components/wallpaper-gallery.component'
import { useWallpaper } from '../../../../hooks/use-wallpaper'

interface WallpaperViewProps {
	selectedCategory: Category | null
	onBackToCategories: () => void
}
const WALLPAPERS_PER_PAGE = 9
export function WallpaperView({
	selectedCategory,
	onBackToCategories,
}: WallpaperViewProps) {
	const { isAuthenticated } = useAuth()
	const [currentPage, setCurrentPage] = useState(1)

	const {
		data: wallpaperResponse,
		isLoading,
		isFetching,
		error,
	} = useGetWallpapers(
		{
			categoryId: selectedCategory?.id || undefined,
			page: currentPage,
			limit: WALLPAPERS_PER_PAGE,
		},
		!!selectedCategory
	)

	const goToNextPage = () => {
		if (currentPage < (wallpaperResponse?.totalPages || 1)) {
			setCurrentPage(currentPage + 1)
		}
	}

	const goToPrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1)
		}
	}

	const { selectedBackground, handleSelectBackground, handlePreviewBackground } =
		useWallpaper(wallpaperResponse?.wallpapers || [], isAuthenticated)

	useEffect(() => {
		if (wallpaperResponse?.wallpapers?.length) {
			const imageUrls = wallpaperResponse.wallpapers
				.filter((wp) => wp.type === 'IMAGE')
				.slice(0, 5)
				.map((wp) => wp.src)

			preloadImages(imageUrls)
		}
	}, [wallpaperResponse?.wallpapers])

	if (!selectedCategory) return null

	return (
		<div className="relative flex flex-col justify-between gap-2 overflow-y-auto h-96">
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
			<div className="mt-5">
				<WallpaperGallery
					isLoading={isLoading}
					error={error}
					wallpapers={wallpaperResponse?.wallpapers || []}
					selectedBackground={selectedBackground}
					onSelectBackground={handleSelectBackground}
					onPreviewBackground={handlePreviewBackground}
				/>
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={wallpaperResponse?.totalPages || 1}
				onNextPage={goToNextPage}
				onPrevPage={goToPrevPage}
				isLoading={isFetching}
			/>
		</div>
	)
}
