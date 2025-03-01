import { motion } from 'motion/react'
import React, { useState } from 'react'
import { FiExternalLink } from 'react-icons/fi'
import { MdOutlineVideoSettings } from 'react-icons/md'
import type { FetchedWallpaper } from '../../../../services/getMethodHooks/getWallpapers.hook'

interface WallpaperItemProps {
	wallpaper: FetchedWallpaper
	selectedBackground: string | null
	setSelectedBackground: (id: string) => void
}

export const WallpaperItem = React.memo(function WallpaperItem({
	wallpaper,
	selectedBackground,
	setSelectedBackground,
}: WallpaperItemProps) {
	const [isLoading, setIsLoading] = useState(true)
	const isSelected = selectedBackground === wallpaper.id

	return (
		<motion.div
			key={wallpaper.src}
			className={`relative aspect-video cursor-pointer rounded-xl overflow-hidden 
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                backdrop-blur-sm bg-black/20`}
			onClick={() => setSelectedBackground(wallpaper.id)}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/30">
					<div className="w-5 h-5 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
				</div>
			)}

			{wallpaper.type === 'IMAGE' ? (
				<img
					src={`${wallpaper.src}`}
					alt={wallpaper.name}
					className="object-cover w-full h-full"
					onLoad={() => setIsLoading(false)}
				/>
			) : (
				<>
					<video
						src={wallpaper.src}
						className="object-cover w-full h-full"
						muted
						autoPlay={isSelected}
						loop
						playsInline
						preload={isSelected ? 'auto' : 'metadata'}
						onLoadedData={() => setIsLoading(false)}
					/>
					{/* Add Video Badge */}
					<motion.div
						className="absolute px-2 py-1 rounded-md top-2 right-2 bg-black/50 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<div className="flex items-center gap-1">
							<MdOutlineVideoSettings size={14} className="text-white" />
							<span className="text-xs text-white  ">ویدیو</span>
						</div>
					</motion.div>
				</>
			)}
			<motion.div
				className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<p className="absolute bottom-2 w-full text-sm text-center   text-white">
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
						<span className="text-xs text-white  ">منبع</span>
					</div>
				</motion.div>
			)}
		</motion.div>
	)
})
