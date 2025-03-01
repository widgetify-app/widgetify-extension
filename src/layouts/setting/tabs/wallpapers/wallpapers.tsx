import { motion } from 'motion/react'
import { useEffect } from 'react'
import { preloadImages } from '../../../../common/utils/preloadImages'
import { useGetWallpapers } from '../../../../services/getMethodHooks/getWallpapers.hook'
import { RetouchFilter } from './components/retouch-filter.component'
import { UploadArea } from './components/upload-area.component'
import { WallpaperGallery } from './components/wallpaper-gallery.component'
import { useWallpaper } from './hooks/use-wallpaper'

export function WallpaperSetting() {
	const { data: fetchedWallpaper, isLoading, error } = useGetWallpapers()

	const {
		selectedBackground,
		isRetouchEnabled,
		customWallpaper,
		allWallpapers,
		handleSelectBackground,
		toggleRetouch,
		handleCustomWallpaperChange,
	} = useWallpaper(fetchedWallpaper?.wallpapers)

	useEffect(() => {
		if (fetchedWallpaper?.wallpapers) {
			const imageUrls = fetchedWallpaper.wallpapers
				.filter((wp) => wp.type === 'IMAGE')
				.map((wp) => wp.src)

			preloadImages(imageUrls)
		}
	}, [fetchedWallpaper])

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div>
				<h2 className="mb-4 text-xl font-semibold text-gray-200">تصویر زمینه</h2>

				<div className="mb-6">
					<UploadArea
						customWallpaper={customWallpaper}
						onWallpaperChange={handleCustomWallpaperChange}
					/>
				</div>

				<h3 className="mb-3 font-medium text-gray-300 text-md">گالری</h3>
				<div className="h-64 pr-2 overflow-y-auto custom-scrollbar">
					<WallpaperGallery
						isLoading={isLoading}
						error={error}
						wallpapers={allWallpapers}
						selectedBackground={selectedBackground}
						onSelectBackground={handleSelectBackground}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-4 mt-6">
				<RetouchFilter isEnabled={isRetouchEnabled} onToggle={toggleRetouch} />
			</div>

			<style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
		</motion.div>
	)
}
