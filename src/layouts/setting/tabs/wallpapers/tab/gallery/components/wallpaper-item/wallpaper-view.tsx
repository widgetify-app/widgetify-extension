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
		<div>
			<div className="flex justify-center mt-1">
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
			<WallpaperGallery
				isLoading={isLoading}
				error={error}
				wallpapers={wallpaperResponse?.wallpapers || []}
				selectedBackground={selectedBackground}
				onSelectBackground={handleSelectBackground}
				onPreviewBackground={handlePreviewBackground}
			/>

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
