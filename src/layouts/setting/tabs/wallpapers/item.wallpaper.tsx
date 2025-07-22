import React, { useEffect, useRef, useState } from 'react'
import { FaUsers } from 'react-icons/fa'
import { FiCheck, FiHeart } from 'react-icons/fi'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { useLazyLoad } from './hooks/use-lazy-load'

interface WallpaperItemProps {
	wallpaper: Wallpaper
	selectedBackground: Wallpaper | null
	setSelectedBackground: (wallpaper: Wallpaper) => void
}

export const WallpaperItem = React.memo(
	function WallpaperItem({
		wallpaper,
		selectedBackground,
		setSelectedBackground,
	}: WallpaperItemProps) {
		const [loaded, setLoaded] = useState(false)
		const [error, setError] = useState(false)
		const imgRef = useRef<HTMLImageElement>(null)
		const videoRef = useRef<HTMLVideoElement>(null)
		const isSelected = selectedBackground?.id === wallpaper.id

		const loadContent = () => {
			if (wallpaper.type === 'IMAGE' && imgRef.current) {
				imgRef.current.src = wallpaper.previewSrc
			} else if (wallpaper.type === 'VIDEO' && videoRef.current) {
				videoRef.current.src = wallpaper.src
				videoRef.current.load()
			}
		}

		const elementRef = useLazyLoad(loadContent)

		const getItemOutlineStyle = () => {
			if (isSelected) {
				return 'ring-2 ring-blue-500 ring-offset-1 ring-offset-blue-100'
			}

			return 'ring-1 ring-gray-300/50 group-hover:ring-blue-300/70'
		}

		const getSelectionBadgeStyle = () => {
			return 'bg-primary text-white shadow-lg'
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
			setSelectedBackground(wallpaper)
		}

		return (
			<div
				ref={elementRef}
				className={`relative overflow-hidden rounded-lg cursor-pointer group aspect-video ${getItemOutlineStyle()}`}
				onClick={handleSelect}
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
							className={`absolute flex justify-between inset-x-0 bottom-0 p-2 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-black/0 items-center`}
						>
							{wallpaper.name && (
								<p className="text-xs font-medium text-white">
									{wallpaper.name}
								</p>
							)}
							{wallpaper.usageCount && (
								<div className="text-xs text-center text-content">
									<FaUsers />
									<span>{wallpaper.usageCount}</span>
								</div>
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
			</div>
		)
	},
	(prevProps, nextProps) =>
		prevProps.wallpaper.id === nextProps.wallpaper.id &&
		prevProps.selectedBackground?.id === nextProps.selectedBackground?.id
)
