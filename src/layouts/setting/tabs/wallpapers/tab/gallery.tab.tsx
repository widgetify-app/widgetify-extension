import { useEffect, useState } from 'react'
import { FiFolder } from 'react-icons/fi'
import { preloadImages } from '@/common/utils/preloadImages'
import { SectionPanel } from '@/components/section-panel'
import { useAuth } from '@/context/auth.context'
import { FolderPath } from '@/layouts/bookmark/components/folder-path'
import { RetouchFilter } from '../components/retouch-filter.component'
import { UploadArea } from '../components/upload-area.component'
import { WallpaperGallery } from '../components/wallpaper-gallery.component'
import { useWallpaper } from '../hooks/use-wallpaper'
import { useWallpapersByCategory } from '../hooks/use-wallpapers-by-category'

export function GalleryTab() {
	const [isCategoryView, setIsCategoryView] = useState(true)
	const { isAuthenticated } = useAuth()
	const {
		categories,
		allWallpapers,
		isLoading,
		error,
		selectedCategoryId,
		changeCategory,
		getCategoryWallpapers,
		getSelectedCategory,
	} = useWallpapersByCategory()

	const {
		selectedBackground,
		isRetouchEnabled,
		customWallpaper,
		handleSelectBackground,
		toggleRetouch,
		handleCustomWallpaperChange,
	} = useWallpaper(allWallpapers, isAuthenticated)

	const currentCategoryWallpapers = selectedCategoryId
		? getCategoryWallpapers(selectedCategoryId)
		: []

	const handleCategorySelect = (categoryId: string) => {
		changeCategory(categoryId)
		setIsCategoryView(false)
	}

	const handleBackToCategories = () => {
		setIsCategoryView(true)
	}

	useEffect(() => {
		if (allWallpapers?.length) {
			const imageUrls = allWallpapers
				.filter((wp) => wp.type === 'IMAGE')
				.slice(0, 5)
				.map((wp) => wp.src)

			preloadImages(imageUrls)
		}
	}, [allWallpapers])

	const selectedCategory = getSelectedCategory()

	return (
		<>
			<SectionPanel title="گالری تصاویر" size="xs">
				<div className={'p-4 rounded-xl'}>
					{isCategoryView ? (
						<div key="category-view">
							<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
								{categories.map((category) => (
									<CategoryFolder
										key={category.id}
										id={category.id}
										handleCategorySelect={handleCategorySelect}
										name={category.name}
										previewImages={category.wallpapers || []}
									/>
								))}
							</div>
						</div>
					) : (
						<div key="wallpaper-view">
							<WallpaperGallery
								isLoading={isLoading}
								error={error}
								wallpapers={currentCategoryWallpapers}
								selectedBackground={selectedBackground}
								onSelectBackground={handleSelectBackground}
							/>
							<div className="flex justify-center mt-1">
								<FolderPath
									folderPath={[
										{
											id: 'subfolder',
											title: selectedCategory?.name || 'پوشه',
										},
									]}
									onNavigate={() => handleBackToCategories()}
								/>
							</div>
						</div>
					)}
				</div>
			</SectionPanel>

			<SectionPanel title="تصویر دلخواه" size="md">
				<UploadArea
					customWallpaper={customWallpaper}
					onWallpaperChange={handleCustomWallpaperChange}
				/>
			</SectionPanel>

			<SectionPanel title="تنظیمات تصویر" size="md">
				<RetouchFilter isEnabled={isRetouchEnabled} onToggle={toggleRetouch} />
			</SectionPanel>
		</>
	)
}

interface FolderProps {
	id: string
	name: string
	previewImages: any[]
	isAllCategory?: boolean
	handleCategorySelect: any
}
function CategoryFolder({ id, name, previewImages, handleCategorySelect }: FolderProps) {
	return (
		<div
			onClick={() => handleCategorySelect(id)}
			className={
				'cursor-pointer rounded-lg p-3 border bg-content border-content transition-all h-32 max-h-32 flex flex-col'
			}
		>
			<div className="flex items-center gap-2 mb-2">
				<FiFolder className="text-blue-500" size={18} />
				<p className={'font-medium text-muted'}>{name}</p>
			</div>

			<div className="flex-grow">
				{previewImages?.length > 0 ? (
					<div className="grid grid-cols-2 gap-1">
						{previewImages.map((image) => (
							<div
								key={image.id}
								className="overflow-hidden rounded aspect-video"
							>
								<img
									src={image.previewSrc}
									alt={image.name}
									className="object-cover w-full h-full"
									loading="lazy"
								/>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-full rounded">
						<FiFolder className="mb-2 text-content/40" size={32} />
						<p className="text-xs text-gray-400">بدون تصویر</p>
					</div>
				)}
			</div>
		</div>
	)
}
