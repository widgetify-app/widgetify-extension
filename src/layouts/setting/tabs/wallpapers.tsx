import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { FiExternalLink } from 'react-icons/fi'
import { MdOutlineVideoSettings } from 'react-icons/md'
import { StoreKey } from '../../../common/constant/store.key'
import { getFromStorage } from '../../../common/storage'
import type { StoredWallpaper } from '../../../common/wallpaper.interface'
import { CustomCheckbox } from '../../../components/checkbox'
import { useGetWallpapers } from '../../../services/getMethodHooks/getWallpapers.hook'

const STORAGE = 'https://widgetify-ir.storage.c2.liara.space/wallpapers'

export function WallpaperSetting() {
	const [selectedBackground, setSelectedBackground] = useState<string>()
	const [isRetouchEnabled, setIsRetouchEnabled] = useState<boolean>(false)
	const { data: fetchedWallpaper } = useGetWallpapers()

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

	useEffect(() => {
		const selectedBg = fetchedWallpaper.wallpapers.find(
			(bg) => bg.id === selectedBackground,
		)

		if (!selectedBg) return

		const event = new CustomEvent('wallpaperChanged', {
			detail: {
				id: selectedBg.id,
				type: selectedBg?.type,
				src: `${STORAGE}/${selectedBg.fileKey}`,
				isRetouchEnabled: isRetouchEnabled,
			},
		})

		window.dispatchEvent(event)
	}, [selectedBackground, isRetouchEnabled])

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
				<div className="grid grid-cols-3 gap-4 p-2">
					{fetchedWallpaper.wallpapers.map((wallpaper) => (
						<motion.div
							key={wallpaper.fileKey}
							className={`relative aspect-video cursor-pointer rounded-xl overflow-hidden 
                ${selectedBackground === wallpaper.id ? 'ring-2 ring-blue-500' : ''}
                backdrop-blur-sm bg-black/20`}
							onClick={() => setSelectedBackground(wallpaper.id)}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							{wallpaper.type === 'IMAGE' ? (
								<img
									src={`${STORAGE}/${wallpaper.fileKey}`}
									alt={wallpaper.name}
									className="object-cover w-full h-full"
								/>
							) : (
								<>
									<video
										src={`${STORAGE}/${wallpaper.fileKey}`}
										className="object-cover w-full h-full"
										muted
										autoPlay
										loop
										playsInline
									/>
									{/* Add Video Badge */}
									<motion.div
										className="absolute px-2 py-1 rounded-md top-2 right-2 bg-black/50 backdrop-blur-sm"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
									>
										<div className="flex items-center gap-1">
											<MdOutlineVideoSettings size={14} className="text-white" />
											<span className="text-xs text-white font-[Vazir]">ویدیو</span>
										</div>
									</motion.div>
								</>
							)}
							<motion.div
								className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
							>
								<p className="absolute bottom-2 w-full text-sm text-center font-[Vazir] text-white">
									{wallpaper.name}
								</p>
							</motion.div>

							{/* Source Badge */}
							{wallpaper.source && (
								<motion.div
									className="absolute px-2 py-1 rounded-md top-2 left-2 bg-black/50 backdrop-blur-sm"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									onClick={(e) => {
										e.stopPropagation()
										window.open(wallpaper.source, '_blank')
									}}
								>
									<div className="flex items-center gap-1">
										<FiExternalLink size={14} className="text-white" />
										<span className="text-xs text-white font-[Vazir]">منبع</span>
									</div>
								</motion.div>
							)}
						</motion.div>
					))}
				</div>
			</div>

			<div className="flex items-start gap-3 p-4 mt-6 rounded-xl bg-white/5">
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
		</motion.div>
	)
}
