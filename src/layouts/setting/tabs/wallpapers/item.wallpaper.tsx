import React, { useCallback, useRef, useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import type { Wallpaper } from '../../../../common/wallpaper.interface'
import { useLazyLoad } from './hooks/use-lazy-load'

interface WallpaperItemProps {
	wallpaper: Wallpaper
	selectedBackground: string | null
	setSelectedBackground: (id: string) => void
}

// Define Persian translations for wallpaper categories
const categoryTranslations: Record<string, string> = {
	Tehran: 'تهران',
	Dubai: 'دبی',
	Desert: 'کویر',
	Sea: 'دریا',
	Forest: 'جنگل',
	Mountain: 'کوهستان',
	Sky: 'آسمان',
	Space: 'فضا',
	Abstract: 'انتزاعی',
	City: 'شهر',
	Other: 'سایر',
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

		return (
			<div
				ref={elementRef}
				className={`relative overflow-hidden rounded-lg cursor-pointer transform-gpu ${
					isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-white/20'
				}`}
				onClick={() => setSelectedBackground(wallpaper.id)}
				style={{ aspectRatio: '16/9' }}
			>
				{!loaded && !error && (
					<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800/80 to-gray-900/80">
						<div className="w-5 h-5 border-2 rounded-full border-t-blue-500 border-blue-500/20 animate-spin"></div>
					</div>
				)}

				{error && (
					<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800/80 to-gray-900/80">
						<div className="flex flex-col items-center p-2 text-center">
							<svg
								className="w-5 h-5 mb-1 text-gray-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<span className="text-xs text-gray-500">خطا</span>
						</div>
					</div>
				)}

				{wallpaper.type === 'IMAGE' ? (
					<img
						ref={imgRef}
						alt={wallpaper.name || 'تصویر زمینه'}
						className={`w-full h-full object-cover transition-opacity duration-300 ${
							loaded ? 'opacity-100' : 'opacity-0'
						}`}
						onLoad={() => setLoaded(true)}
						onError={() => {
							setError(true)
							setLoaded(true)
						}}
					/>
				) : (
					<div className="relative h-full">
						<video
							ref={videoRef}
							className={`w-full h-full object-cover transition-opacity duration-300 ${
								loaded ? 'opacity-100' : 'opacity-0'
							}`}
							muted
							loop
							playsInline
							preload="metadata"
							onLoadedData={() => setLoaded(true)}
							onError={() => {
								setError(true)
								setLoaded(true)
							}}
						/>
						{loaded && !error && (
							<>
								<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
								<FiPlayCircle
									className="absolute transform -translate-x-1/2 -translate-y-1/2 text-white/90 top-1/2 left-1/2"
									size={24}
								/>
							</>
						)}
					</div>
				)}

				{isSelected && loaded && !error && (
					<div className="absolute flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full top-2 right-2">
						<svg
							className="w-3 h-3 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={3}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
				)}

				{wallpaper.category && loaded && !error && (
					<div className="absolute top-2 left-2 px-2 py-0.5 text-xs bg-black/30 backdrop-blur-sm text-white/90 rounded-full">
						{categoryTranslations[wallpaper.category] || wallpaper.category}
					</div>
				)}

				{wallpaper.name && loaded && !error && (
					<div className="absolute bottom-0 left-0 right-0 p-1 px-2 text-xs font-medium text-gray-200 truncate bg-gradient-to-t from-black/80 to-transparent">
						{wallpaper.name}
					</div>
				)}
			</div>
		)
	},
	(prevProps, nextProps) => {
		return (
			prevProps.wallpaper.id === nextProps.wallpaper.id &&
			prevProps.selectedBackground === nextProps.selectedBackground
		)
	},
)
