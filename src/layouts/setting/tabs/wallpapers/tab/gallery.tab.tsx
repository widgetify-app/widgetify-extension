import { preloadImages } from '@/common/utils/preloadImages'
import { SectionPanel } from '@/components/section-panel'
import { useTheme } from '@/context/theme.context'
import { useEffect } from 'react'
import { RetouchFilter } from '../components/retouch-filter.component'
import { UploadArea } from '../components/upload-area.component'
import { WallpaperGallery } from '../components/wallpaper-gallery.component'
import { useWallpaper } from '../hooks/use-wallpaper'
import { useWallpapersByCategory } from '../hooks/use-wallpapers-by-category'

export function GalleryTab() {
	const { theme } = useTheme()

	const {
		categories,
		allWallpapers,
		isLoading,
		error,
		selectedCategoryId,
		changeCategory,
	} = useWallpapersByCategory()

	const {
		selectedBackground,
		isRetouchEnabled,
		customWallpaper,
		handleSelectBackground,
		toggleRetouch,
		handleCustomWallpaperChange,
	} = useWallpaper(allWallpapers)

	useEffect(() => {
		if (allWallpapers?.length) {
			const imageUrls = allWallpapers
				.filter((wp) => wp.type === 'IMAGE')
				.slice(0, 5)
				.map((wp) => wp.src)

			preloadImages(imageUrls)
		}
	}, [allWallpapers])

	function getGalleryContainerStyle() {
		switch (theme) {
			case 'light':
				return 'bg-gradient-to-r from-gray-100 to-gray-200'
			case 'dark':
				return 'bg-gradient-to-r from-gray-800 to-gray-900'
			default: // glass
				return 'bg-gradient-to-r from-white/5 to-white/10'
		}
	}

	function CategoryButton({ category }: { category: { id: string; name: string } }) {
		const isSelected = selectedCategoryId === category.id

		const getButtonStyle = () => {
			if (isSelected) {
				return 'bg-blue-500 text-white'
			}

			switch (theme) {
				case 'light':
					return 'bg-gray-100/70 text-gray-700 hover:bg-gray-200/50'
				case 'dark':
					return 'bg-gray-800/70 text-gray-200 hover:bg-gray-700/50'
				default: // glass
					return 'bg-white/5 text-gray-200 hover:bg-white/10'
			}
		}

		return (
			<button
				onClick={() => changeCategory(category.id)}
				className={`px-4 py-2 rounded-full cursor-pointer whitespace-nowrap transition-all ${getButtonStyle()}`}
			>
				{category.name}
			</button>
		)
	}

	return (
		<>
			<SectionPanel title="گالری تصاویر" delay={0.1}>
				{/* Category buttons */}
				<div className="pb-4 overflow-x-auto">
					<div className="flex gap-2 pb-2">
						<CategoryButton category={{ id: 'all', name: 'همه' }} />
						{categories.map((category) => (
							<CategoryButton key={category.id} category={category} />
						))}
					</div>
				</div>

				<div className={`p-4 shadow-sm rounded-xl ${getGalleryContainerStyle()}`}>
					<WallpaperGallery
						isLoading={isLoading}
						error={error}
						wallpapers={allWallpapers}
						selectedBackground={selectedBackground}
						onSelectBackground={handleSelectBackground}
					/>
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
