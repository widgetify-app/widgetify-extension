import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { StoreKey } from '../../../../common/constant/store.key'
import { getFromStorage, setToStorage } from '../../../../common/storage'
import type { StoredWallpaper } from '../../../../common/wallpaper.interface'
import { CustomCheckbox } from '../../../../components/checkbox'
import { useGetWallpapers } from '../../../../services/getMethodHooks/getWallpapers.hook'
import { WallpaperItem } from './item.wallpaper'

export function WallpaperSetting() {
	const [selectedBackground, setSelectedBackground] = useState<string | null>(null)
	const [isRetouchEnabled, setIsRetouchEnabled] = useState<boolean>(false)
	const [blurAmount, setBlurAmount] = useState<number>(1)
	const { data: fetchedWallpaper } = useGetWallpapers()

	useEffect(() => {
		async function getWallpaper() {
			const wallpaper = await getFromStorage<StoredWallpaper>(StoreKey.Wallpaper)
			if (wallpaper) {
				setSelectedBackground(wallpaper.id)
				setIsRetouchEnabled(wallpaper.isRetouchEnabled)
				setBlurAmount(wallpaper.blurAmount !== undefined ? wallpaper.blurAmount : 0)
			}
		}

		getWallpaper()
	}, [])

	useEffect(() => {
		const selectedBg = fetchedWallpaper.wallpapers.find(
			(bg) => bg.id === selectedBackground,
		)

		if (!selectedBg) return

		const wallpaperData = {
			id: selectedBg.id,
			type: selectedBg?.type,
			src: selectedBg.src,
			isRetouchEnabled: isRetouchEnabled,
			blurAmount: blurAmount,
		}

		// Save to storage
		setToStorage(StoreKey.Wallpaper, wallpaperData)

		const event = new CustomEvent('wallpaperChanged', {
			detail: wallpaperData,
		})

		window.dispatchEvent(event)
	}, [selectedBackground, isRetouchEnabled, blurAmount])

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
					<div className="grid grid-cols-3 gap-4 p-2">
						{fetchedWallpaper.wallpapers.map((wallpaper) => (
							<WallpaperItem
								wallpaper={wallpaper}
								key={wallpaper.id}
								selectedBackground={selectedBackground}
								setSelectedBackground={setSelectedBackground}
							/>
						))}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4 mt-6">
				<div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
					<CustomCheckbox checked={isRetouchEnabled} onChange={setIsRetouchEnabled} />
					<div
						onClick={() => setIsRetouchEnabled(!isRetouchEnabled)}
						className="cursor-pointer"
					>
						<p className="font-medium font-[Vazir] text-gray-200">فیلتر تصویر</p>
						<p className="text-sm font-[Vazir] text-gray-400">
							با فعال کردن این گزینه تصویر زمینه شما تاریک تر خواهد شد
						</p>
					</div>
				</div>

				<div className="p-4 rounded-xl bg-white/5">
					<p className="mb-2 font-medium font-[Vazir] text-gray-200">میزان تاری (Blur)</p>
					<div className="flex items-center gap-4">
						<input
							type="range"
							min="1"
							max="20"
							value={blurAmount}
							onChange={(e) => setBlurAmount(Number.parseInt(e.target.value))}
							className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
						/>
						<span className="text-center text-gray-300 min-w-8">{blurAmount}</span>
					</div>
					<p className="mt-2 text-sm font-[Vazir] text-gray-400">
						با افزایش مقدار، تصویر زمینه تار‌تر خواهد شد
					</p>
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
