import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { preloadImages } from '@/common/utils/preloadImages'
import { SectionPanel } from '@/components/section-panel'
import { useGetWallpapers } from '@/services/getMethodHooks/getWallpapers.hook'
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
				.slice(0, 5)
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
			<div className="space-y-4">
				<SectionPanel title="تصویر زمینه" delay={0.1}>
					<UploadArea
						customWallpaper={customWallpaper}
						onWallpaperChange={handleCustomWallpaperChange}
					/>
				</SectionPanel>

				<SectionPanel title="گالری" delay={0.2}>
					<WallpaperGallery
						isLoading={isLoading}
						error={error}
						wallpapers={allWallpapers}
						selectedBackground={selectedBackground}
						onSelectBackground={handleSelectBackground}
					/>
				</SectionPanel>

				<SectionPanel title="تنظیمات" delay={0.3}>
					<RetouchFilter isEnabled={isRetouchEnabled} onToggle={toggleRetouch} />
				</SectionPanel>
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
