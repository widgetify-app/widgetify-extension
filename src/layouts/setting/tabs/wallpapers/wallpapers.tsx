import { preloadImages } from '@/common/utils/preloadImages'
import { SectionPanel } from '@/components/section-panel'
import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { RetouchFilter } from './components/retouch-filter.component'
import { UploadArea } from './components/upload-area.component'
import { WallpaperGallery } from './components/wallpaper-gallery.component'
import { useWallpaper } from './hooks/use-wallpaper'
import { useWallpapersByCategory } from './hooks/use-wallpapers-by-category'

export function WallpaperSetting() {
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
				className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${getButtonStyle()}`}
			>
				{category.name}
			</button>
		)
	}

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="flex flex-col gap-4">
				<SectionPanel title="ویجی گالری" delay={0.1}>
					<div className="pb-2 overflow-x-auto">
						<div className="flex gap-2">
							<CategoryButton category={{ id: 'all', name: 'همه' }} />

							{categories.map((category) => (
								<CategoryButton key={category.id} category={category} />
							))}
						</div>
					</div>

					<div className="p-4 shadow-sm rounded-xl dark:border-gray-800">
						<WallpaperGallery
							isLoading={isLoading}
							error={error}
							wallpapers={allWallpapers}
							selectedBackground={selectedBackground}
							onSelectBackground={handleSelectBackground}
						/>
					</div>
				</SectionPanel>

				<SectionPanel title="تصویر زمینه دلخواه" delay={0.3}>
					<UploadArea
						customWallpaper={customWallpaper}
						onWallpaperChange={handleCustomWallpaperChange}
					/>
				</SectionPanel>

				<SectionPanel title="تنظیمات" delay={0.4}>
					<RetouchFilter isEnabled={isRetouchEnabled} onToggle={toggleRetouch} />
				</SectionPanel>
			</div>
		</motion.div>
	)
}
