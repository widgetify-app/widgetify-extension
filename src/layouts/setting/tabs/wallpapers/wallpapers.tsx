import { motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { StoreKey } from '../../../../common/constant/store.key'
import { getFromStorage, setToStorage } from '../../../../common/storage'
import { preloadImages } from '../../../../common/utils/preloadImages'
import type { StoredWallpaper } from '../../../../common/wallpaper.interface'
import CustomCheckbox from '../../../../components/checkbox'
import { useGetWallpapers } from '../../../../services/getMethodHooks/getWallpapers.hook'
import { WallpaperItem } from './item.wallpaper'
import Analytics from '../../../../analytics'

export function WallpaperSetting() {
	const [selectedBackground, setSelectedBackground] = useState<string | null>(null)
	const [isRetouchEnabled, setIsRetouchEnabled] = useState<boolean>(false)
	const { data: fetchedWallpaper, isLoading, error } = useGetWallpapers()

	// Preload images when data is available
	useEffect(() => {
		if (fetchedWallpaper?.wallpapers) {
			const imageUrls = fetchedWallpaper.wallpapers
				.filter((wp) => wp.type === 'IMAGE')
				.map((wp) => wp.src)

			preloadImages(imageUrls)
		}
	}, [fetchedWallpaper])

	useEffect(() => {
		async function getWallpaper() {
			const wallpaper = await getFromStorage<StoredWallpaper>(StoreKey.Wallpaper)
			if (wallpaper) {
				setSelectedBackground(wallpaper.id)
				setIsRetouchEnabled(wallpaper.isRetouchEnabled)
			}
		}

		getWallpaper()
	}, [])

	const selectedWallpaper = useMemo(() => {
		return fetchedWallpaper?.wallpapers?.find((bg) => bg.id === selectedBackground)
	}, [fetchedWallpaper, selectedBackground])

	useEffect(() => {
		if (!selectedWallpaper) return

		const wallpaperData = {
			id: selectedWallpaper.id,
			type: selectedWallpaper?.type,
			src: selectedWallpaper.src,
			isRetouchEnabled: isRetouchEnabled,
		}

		// Save to storage
		setToStorage(StoreKey.Wallpaper, wallpaperData)

		const event = new CustomEvent('wallpaperChanged', {
			detail: wallpaperData,
		})

		window.dispatchEvent(event)
	}, [selectedWallpaper, isRetouchEnabled])

	const handleSelectBackground = useCallback(
		(id: string) => {
			setSelectedBackground(id)

			// Track wallpaper selection
			const selectedWp = fetchedWallpaper?.wallpapers?.find((wp) => wp.id === id)
			if (selectedWp) {
				Analytics.featureUsed('wallpaper_changed', {
					wallpaper_id: id,
					wallpaper_name: selectedWp.name || 'unnamed',
					wallpaper_type: selectedWp.type,
				})
			}
		},
		[fetchedWallpaper],
	)

	const toggleRetouch = useCallback(() => {
		setIsRetouchEnabled((prev) => !prev)

		// Track retouch filter toggle
		Analytics.featureUsed('wallpaper_retouch_toggled', {
			enabled: !isRetouchEnabled,
			wallpaper_id: selectedBackground || 'none',
		})
	}, [isRetouchEnabled, selectedBackground])

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div>
				<h2 className="mb-4 text-xl font-semibold text-gray-200 font-[Vazir]">
					تصویر زمینه
				</h2>
				<div className="h-64 pr-2 overflow-y-auto custom-scrollbar">
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<div className="w-8 h-8 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
						</div>
					) : error ? (
						<div className="p-4 text-center text-red-400 bg-red-500/10 rounded-xl">
							<p className="font-[Vazir]">خطا در بارگذاری تصاویر زمینه</p>
						</div>
					) : (
						<div className="grid grid-cols-3 gap-4 p-2">
							{fetchedWallpaper.wallpapers.map((wallpaper) => (
								<WallpaperItem
									wallpaper={wallpaper}
									key={wallpaper.id}
									selectedBackground={selectedBackground}
									setSelectedBackground={handleSelectBackground}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-4 mt-6">
				<div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
					<CustomCheckbox checked={isRetouchEnabled} onChange={setIsRetouchEnabled} />
					<div onClick={toggleRetouch} className="cursor-pointer">
						<p className="font-medium font-[Vazir] text-gray-200">فیلتر تصویر</p>
						<p className="text-sm font-[Vazir] text-gray-400">
							با فعال کردن این گزینه تصویر زمینه شما تاریک تر خواهد شد
						</p>
					</div>
				</div>
			</div>

			<style jsx>{`
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
