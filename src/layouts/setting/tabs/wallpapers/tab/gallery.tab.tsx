import { preloadImages } from '@/common/utils/preloadImages'
import { SectionPanel } from '@/components/section-panel'
import { useTheme } from '@/context/theme.context'
import { AnimatePresence, motion } from 'framer-motion'
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

	function CategoryFolder({
		id,
		name,
		previewImages,
		isAllCategory = false,
	}: FolderProps) {
		const getFolderStyle = () => {
			if (isAllCategory) {
				switch (theme) {
					case 'light':
						return 'bg-blue-500/10 border border-blue-200 hover:bg-blue-500/20'
					case 'dark':
						return 'bg-blue-500/20 border border-blue-700/70 hover:bg-blue-500/30'
					default:
						return 'bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20'
				}
			}

			switch (theme) {
				case 'light':
					return 'bg-gray-100/70 border border-gray-200 hover:bg-gray-200/50'
				case 'dark':
					return 'bg-gray-800/70 border border-gray-700 hover:bg-gray-700/50'
				default:
					return 'bg-white/5 border border-white/10 hover:bg-white/10'
			}
		}

		return (
			<motion.div
				whileHover={{ scale: 1.03 }}
				whileTap={{ scale: 0.97 }}
				onClick={() => handleCategorySelect(id)}
				className={`cursor-pointer rounded-lg p-3 ${getFolderStyle()} transition-all h-32 max-h-32 flex flex-col`}
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
			</motion.div>
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
			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={handleBackToCategories}
				className={`px-4 py-2 cursor-pointer rounded-full flex items-center gap-2 ${getButtonStyle()} mb-3`}
			>
				<FiArrowLeft size={16} />
				<span>بازگشت به فولدرها</span>
			</motion.button>
		)
	}

	return (
		<>
			<SectionPanel title="گالری تصاویر">
				<div className={'p-4 rounded-xl'}>
					<AnimatePresence mode="wait">
						{isCategoryView ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								key="category-view"
							>
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
							</motion.div>
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								key="wallpaper-view"
							>
								<BackButton />
								<WallpaperGallery
									isLoading={isLoading}
									error={error}
									wallpapers={currentCategoryWallpapers}
									selectedBackground={selectedBackground}
									onSelectBackground={handleSelectBackground}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</SectionPanel>

			<SectionPanel title="تصویر دلخواه" delay={0.3}>
				<UploadArea
					customWallpaper={customWallpaper}
					onWallpaperChange={handleCustomWallpaperChange}
				/>
			</SectionPanel>

			<SectionPanel title="تنظیمات تصویر" delay={0.4}>
				<RetouchFilter isEnabled={isRetouchEnabled} onToggle={toggleRetouch} />
			</SectionPanel>
		</>
	)
}
