import { motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { FiImage, FiUploadCloud, FiVideo } from 'react-icons/fi'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { useTheme } from '@/context/theme.context'
import { useWallpaperUpload } from '../hooks/use-wallpaper-upload'
import { MediaPreview } from './media-preview.component'

interface UploadAreaProps {
	customWallpaper: Wallpaper | null
	onWallpaperChange: (newWallpaper: Wallpaper) => void
}

export function UploadArea({ customWallpaper, onWallpaperChange }: UploadAreaProps) {
	const { theme, themeUtils } = useTheme()

	const [isDragging, setIsDragging] = useState(false)
	const [isExpanded, setIsExpanded] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { processFile } = useWallpaperUpload({ onWallpaperChange })

	const getPreviewContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/70 border-gray-300/30'
			case 'dark':
				return 'bg-gray-800/70 border-gray-700/30'
			default: // glass
				return 'bg-white/5 border-white/10'
		}
	}

	const getPreviewButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200/70 text-gray-700 hover:bg-gray-300/70'
			case 'dark':
				return 'bg-gray-700/70 text-gray-300 hover:bg-gray-600/70'
			default: // glass
				return 'bg-white/5 text-gray-300 hover:bg-white/10'
		}
	}

	const getDropZoneStyle = (dragging: boolean) => {
		if (dragging) {
			return 'bg-blue-500/20 border-2 border-blue-400'
		}

		switch (theme) {
			case 'light':
				return 'bg-gray-100/50 border-2 border-gray-300/50 hover:border-blue-400/50 hover:bg-gray-200/50'
			case 'dark':
				return 'bg-gray-800/50 border-2 border-gray-700/50 hover:border-blue-400/50 hover:bg-gray-700/50'
			default: // glass
				return 'bg-white/5 border-2 border-white/20 hover:border-blue-400/50 hover:bg-white/10'
		}
	}

	const getSecondaryButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200/70 hover:bg-gray-300/80 text-gray-700'
			case 'dark':
				return 'bg-gray-700/50 hover:bg-gray-700/80 text-gray-300'
			default: // glass
				return 'bg-gray-700/50 hover:bg-gray-700/80 text-gray-300'
		}
	}

	const getPrimaryButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-700'
			case 'dark':
				return 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-300'
			default: // glass
				return 'bg-blue-500/30 hover:bg-blue-500/50 text-blue-300'
		}
	}

	const getUploadIconStyle = () => {
		switch (theme) {
			case 'light':
				return 'from-blue-500/10 to-purple-500/10 text-blue-600'

			default:
				return 'from-blue-500/20 to-purple-500/20 text-blue-400'
		}
	}

	const handleFileSelect = useCallback(() => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}, [])

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (file) {
				processFile(file, 'file_selector')
				e.target.value = ''
			}
		},
		[processFile],
	)

	const handleDrag = useCallback((e: React.DragEvent, isDragging: boolean) => {
		e.preventDefault()
		setIsDragging(isDragging)
	}, [])

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(false)

			const file = e.dataTransfer.files?.[0]
			if (file) {
				processFile(file, 'drag_and_drop')
			}
		},
		[processFile],
	)

	if (customWallpaper && !isExpanded) {
		return (
			<motion.div
				layout
				className={`relative overflow-hidden border rounded-lg backdrop-blur-sm ${getPreviewContainerStyle()}`}
			>
				<div className="flex items-center">
					<div className="relative flex-shrink-0 w-16 h-12 overflow-hidden">
						<MediaPreview customWallpaper={customWallpaper} />
						<div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30"></div>
					</div>
					<div className="flex-1 px-2">
						<p className={`text-sm font-medium ${themeUtils.getTextColor()}`}>
							{customWallpaper.type === 'IMAGE' ? 'تصویر' : 'ویدیو'} انتخاب شده
						</p>
						<p className={`text-xs ${themeUtils.getDescriptionTextStyle()} truncate`}>
							{customWallpaper.name || 'بدون نام'}
						</p>
					</div>
					<div className="px-2">
						<button
							onClick={() => setIsExpanded(true)}
							className={`px-2 py-1 text-sm transition-colors rounded-lg ${getPreviewButtonStyle()}`}
						>
							تغییر
						</button>
					</div>
				</div>
			</motion.div>
		)
	}

	return (
		<motion.div
			layout
			onDragOver={(e) => handleDrag(e, true)}
			onDragLeave={(e) => handleDrag(e, false)}
			onDrop={handleDrop}
			className={`relative transition-all duration-300 backdrop-blur-sm border-dashed rounded-lg ${getDropZoneStyle(isDragging)}`}
		>
			{customWallpaper ? (
				<div className="p-3">
					<div className="relative w-full mb-3 overflow-hidden rounded-lg aspect-video">
						<MediaPreview customWallpaper={customWallpaper} />
						<div className="absolute top-2 right-2">
							<div className="px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">
								انتخاب شده
							</div>
						</div>
						<div className="absolute bottom-2 right-2">
							<div className="px-2 py-0.5 text-xs font-medium text-white rounded-full backdrop-blur-sm bg-blue-500/80">
								{customWallpaper.type === 'IMAGE' ? 'تصویر' : 'ویدیو'}
							</div>
						</div>
					</div>
					<div className="flex flex-wrap justify-end gap-2">
						<motion.button
							whileTap={{ scale: 0.95 }}
							onClick={() => setIsExpanded(false)}
							className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${getSecondaryButtonStyle()}`}
						>
							نمایش فشرده
						</motion.button>
						<motion.button
							whileTap={{ scale: 0.95 }}
							onClick={handleFileSelect}
							className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${getPrimaryButtonStyle()}`}
						>
							تغییر {customWallpaper.type === 'IMAGE' ? 'تصویر' : 'ویدیو'}
						</motion.button>
					</div>
				</div>
			) : (
				<div
					className="flex flex-col items-center justify-center p-6 cursor-pointer"
					onClick={handleFileSelect}
				>
					<div
						className={`p-3 mb-3 rounded-full bg-gradient-to-br ${getUploadIconStyle()}`}
					>
						<FiUploadCloud className="w-6 h-6" />
					</div>
					<p className={`mb-2 text-sm font-medium ${themeUtils.getTextColor()}`}>
						فایل را بکشید و رها کنید
					</p>
					<div className="flex items-center gap-2 mb-2">
						<FiImage className={themeUtils.getDescriptionTextStyle()} size={14} />
						<FiVideo className={themeUtils.getDescriptionTextStyle()} size={14} />
						<p className={`text-xs ${themeUtils.getDescriptionTextStyle()}`}>
							یا انتخاب از سیستم
						</p>
					</div>
					<p className="text-xs text-gray-500">JPG, PNG, MP4, WEBM (حداکثر 6MB)</p>
				</div>
			)}

			<input
				type="file"
				ref={fileInputRef}
				className="hidden"
				accept="image/*,video/*"
				onChange={handleFileChange}
			/>
		</motion.div>
	)
}
