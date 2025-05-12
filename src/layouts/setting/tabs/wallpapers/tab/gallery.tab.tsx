import { preloadImages } from '@/common/utils/preloadImages'
import { SectionPanel } from '@/components/section-panel'
import { getBorderColor, getCardBackground, useTheme } from '@/context/theme.context'
import { useEffect, useState } from 'react'
import { FiArrowLeft, FiFolder } from 'react-icons/fi'
import { RetouchFilter } from '../components/retouch-filter.component'
import { UploadArea } from '../components/upload-area.component'
import { WallpaperGallery } from '../components/wallpaper-gallery.component'
import { useWallpaper } from '../hooks/use-wallpaper'
import { useWallpapersByCategory } from '../hooks/use-wallpapers-by-category'

export function GalleryTab() {
	const { theme } = useTheme()
	const [isCategoryView, setIsCategoryView] = useState(true)

	const {
		categories,
		allWallpapers,
		isLoading,
		error,
		selectedCategoryId,
		changeCategory,
		getCategoryWallpapers,
	} = useWallpapersByCategory()

	const {
		selectedBackground,
		isRetouchEnabled,
		customWallpaper,
		handleSelectBackground,
		toggleRetouch,
		handleCustomWallpaperChange,
	} = useWallpaper(allWallpapers)

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

	interface FolderProps {
		id: string
		name: string
		previewImages: any[]
		isAllCategory?: boolean
	}

	function CategoryFolder({ id, name, previewImages }: FolderProps) {
		return (
			<div
				onClick={() => handleCategorySelect(id)}
				className={`cursor-pointer rounded-lg p-3 border ${getBorderColor(theme)} ${getCardBackground(theme)} transition-all h-32 max-h-32 flex flex-col`}
			>
				<div className="flex items-center gap-2 mb-2">
					<FiFolder className="text-blue-500" size={18} />
					<p
						className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}
					>
						{name}
					</p>
				</div>

				<div className="flex-grow">
					{previewImages?.length > 0 ? (
						<div className="grid grid-cols-2 gap-1">
							{previewImages.map((image) => (
								<div key={image.id} className="overflow-hidden rounded aspect-video">
									<img
										src={image.src}
										alt={image.name}
										className="object-cover w-full h-full"
									/>
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center h-full rounded">
							<FiFolder className="mb-2 text-gray-500/40" size={32} />
							<p className="text-xs text-gray-400">بدون تصویر</p>
						</div>
					)}
				</div>
			</div>
		)
	}

	function BackButton() {
		const getButtonStyle = () => {
			switch (theme) {
				case 'light':
					return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
				case 'dark':
					return 'bg-gray-800 text-gray-200 hover:bg-gray-700'
				default:
					return 'bg-white/5 text-gray-200 hover:bg-white/10'
			}
		}

		return (
			<button
				onClick={handleBackToCategories}
				className={`px-4 py-2 cursor-pointer rounded-full flex items-center gap-2 ${getButtonStyle()} mb-3`}
			>
				<FiArrowLeft size={16} />
				<span>بازگشت به فولدرها</span>
			</button>
		)
	}

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
										name={category.name}
										previewImages={category.wallpapers || []}
									/>
								))}
							</div>
						</div>
					) : (
						<div key="wallpaper-view">
							<BackButton />
							<WallpaperGallery
								isLoading={isLoading}
								error={error}
								wallpapers={currentCategoryWallpapers}
								selectedBackground={selectedBackground}
								onSelectBackground={handleSelectBackground}
							/>
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
