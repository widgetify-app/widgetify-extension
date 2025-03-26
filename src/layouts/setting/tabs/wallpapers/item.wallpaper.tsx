import type { Wallpaper } from '@/common/wallpaper.interface'
import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { FiCheck, FiHeart } from 'react-icons/fi'
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
		const { theme } = useTheme()
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

		const getItemOutlineStyle = () => {
			if (isSelected) {
				return 'ring-2 ring-blue-500 ring-offset-1 ring-offset-blue-100'
			}

			switch (theme) {
				case 'light':
					return 'ring-1 ring-gray-300/50 group-hover:ring-blue-300/70'
				case 'dark':
					return 'ring-1 ring-gray-700/60 group-hover:ring-blue-700/50'
				default: // glass
					return 'ring-1 ring-white/10 group-hover:ring-white/30'
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
					return 'bg-white/90 text-gray-800 hover:bg-white shadow-sm hover:shadow'
				case 'dark':
					return 'bg-gray-800/90 text-blue-300 hover:bg-gray-700 shadow-sm'
				default: // glass
					return 'bg-black/50 backdrop-blur-sm text-white hover:bg-black/60 shadow-sm'
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

		return (
			<motion.div
				ref={elementRef}
				className={`relative overflow-hidden rounded-lg cursor-pointer group aspect-video ${getItemOutlineStyle()}`}
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
						<div
							className={`absolute inset-x-0 bottom-0 p-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${getInfoLayerStyle()}`}
						>
							{wallpaper.name && (
								<p className="text-xs font-medium text-white">{wallpaper.name}</p>
							)}

							{wallpaper.source && (
								<button
									onClick={handleSourceClick}
									className={`mt-1.5 cursor-pointer px-2.5 py-1 text-[10px] rounded-md transition flex items-center gap-1 ${getInfoButtonStyle()}`}
								>
									<FaExternalLinkAlt size={12} />
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
