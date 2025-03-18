import { motion } from 'framer-motion'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FiCheck, FiHeart, FiInfo } from 'react-icons/fi'
import { wallpaperCategoryTranslations } from '@/common/constant/translations'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useLazyLoad } from './hooks/use-lazy-load'

interface WallpaperItemProps {
	wallpaper: Wallpaper
	selectedBackground: string | null
	setSelectedBackground: (id: string) => void
}

export const WallpaperItem = React.memo(
	function WallpaperItem({
		wallpaper,
		selectedBackground,
		setSelectedBackground,
	}: WallpaperItemProps) {
		const { theme } = useGeneralSetting()
		const [loaded, setLoaded] = useState(false)
		const [error, setError] = useState(false)
		const imgRef = useRef<HTMLImageElement>(null)
		const videoRef = useRef<HTMLVideoElement>(null)
		const isSelected = selectedBackground === wallpaper.id

		const loadContent = useCallback(() => {
			if (wallpaper.type === 'IMAGE' && imgRef.current) {
				imgRef.current.src = wallpaper.src
			} else if (wallpaper.type === 'VIDEO' && videoRef.current) {
				videoRef.current.src = wallpaper.src
				videoRef.current.load()
			}
		}, [wallpaper])

		const elementRef = useLazyLoad(loadContent)

		const handleSourceClick = (e: React.MouseEvent) => {
			e.stopPropagation()
			window.open(wallpaper.source, '_blank')
		}

		const getItemBorderStyle = () => {
			if (isSelected) {
				return 'border-blue-500'
			}

			switch (theme) {
				case 'light':
					return 'border-gray-300/40 group-hover:border-gray-400/70'
				case 'dark':
					return 'border-gray-700/60 group-hover:border-gray-600/80'
				default: // glass
					return 'border-white/10 group-hover:border-white/30'
			}
		}

		const getSelectionBadgeStyle = () => {
			switch (theme) {
				case 'light':
					return 'bg-blue-500 text-white shadow-lg'

				default:
					return 'bg-blue-500 text-white shadow-lg'
			}
		}

		const getInfoLayerStyle = () => {
			switch (theme) {
				case 'light':
					return 'bg-gradient-to-t from-black/70 to-black/0'
				default:
					return 'bg-gradient-to-t from-black/70 to-black/0'
			}
		}

		const getInfoButtonStyle = () => {
			switch (theme) {
				case 'light':
					return 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/90'
				case 'dark':
					return 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/90'
				default: // glass
					return 'bg-black/40 backdrop-blur-sm text-white hover:bg-black/50'
			}
		}

		const getCategoryStyle = () => {
			switch (theme) {
				case 'light':
					return 'bg-black/40 text-white'
				default:
					return 'bg-black/40 text-white'
			}
		}

		useEffect(() => {
			if (loaded && videoRef.current && isSelected) {
				videoRef.current.play().catch(() => {})
			}
		}, [loaded, isSelected])

		const handleLoad = () => {
			setLoaded(true)
			setError(false)
		}

		const handleError = () => {
			setLoaded(true)
			setError(true)
		}

		const handleSelect = () => {
			if (!loaded || error) return
			setSelectedBackground(wallpaper.id)
		}

		const categoryName = wallpaper.category
			? wallpaperCategoryTranslations[wallpaper.category] || wallpaper.category
			: null

		return (
			<motion.div
				ref={elementRef}
				className={`relative overflow-hidden border-2 rounded-lg cursor-pointer group aspect-video ${getItemBorderStyle()}`}
				onClick={handleSelect}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				transition={{ type: 'spring', stiffness: 400, damping: 17 }}
			>
				{!loaded && (
					<div className="flex items-center justify-center w-full h-full bg-gray-900/60">
						<div className="w-5 h-5 border-2 rounded-full border-blue-500/30 border-t-blue-500 animate-spin"></div>
					</div>
				)}

				{error && (
					<div className="flex flex-col items-center justify-center w-full h-full bg-red-500/10">
						<FiHeart className="text-red-400" />
						<p className="mt-2 text-xs text-gray-400">خطا در بارگذاری</p>
					</div>
				)}

				{wallpaper.type === 'IMAGE' ? (
					<img
						ref={imgRef}
						className="object-cover w-full h-full transition-opacity"
						style={{ opacity: loaded && !error ? 1 : 0 }}
						alt={wallpaper.name || 'Wallpaper'}
						onLoad={handleLoad}
						onError={handleError}
					/>
				) : (
					<video
						ref={videoRef}
						className="object-cover w-full h-full transition-opacity"
						style={{ opacity: loaded && !error ? 1 : 0 }}
						loop
						muted
						playsInline
						onLoadedData={handleLoad}
						onError={handleError}
					/>
				)}

				{loaded && !error && (
					<>
						{categoryName && (
							<div
								className={`absolute top-2 right-2 px-2 py-1 text-[10px] rounded-md opacity-80 ${getCategoryStyle()}`}
							>
								{categoryName}
							</div>
						)}

						<div
							className={`absolute inset-x-0 bottom-0 p-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${getInfoLayerStyle()}`}
						>
							{wallpaper.name && (
								<p className="text-xs font-medium text-white">{wallpaper.name}</p>
							)}

							{wallpaper.source && (
								<button
									onClick={handleSourceClick}
									className={`mt-1 px-2 py-0.5 text-[10px] rounded-md transition ${getInfoButtonStyle()}`}
								>
									منبع
								</button>
							)}
						</div>

						{isSelected && (
							<div
								className={`absolute top-2 left-2 p-1 rounded-full shadow-sm ${getSelectionBadgeStyle()}`}
							>
								<FiCheck size={12} />
							</div>
						)}

						<div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100 bg-black/10"></div>
					</>
				)}
			</motion.div>
		)
	},
	(prevProps, nextProps) =>
		prevProps.wallpaper.id === nextProps.wallpaper.id &&
		prevProps.selectedBackground === nextProps.selectedBackground,
)
