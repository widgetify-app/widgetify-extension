import { motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { FiImage, FiUploadCloud, FiVideo } from 'react-icons/fi'
import type { Wallpaper } from '../../../../../common/wallpaper.interface'
import { useWallpaperUpload } from '../hooks/use-wallpaper-upload'
import { MediaPreview } from './media-preview.component'

interface UploadAreaProps {
	customWallpaper: Wallpaper | null
	onWallpaperChange: (newWallpaper: Wallpaper) => void
}

export function UploadArea({ customWallpaper, onWallpaperChange }: UploadAreaProps) {
	const [isDragging, setIsDragging] = useState(false)
	const [isExpanded, setIsExpanded] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { processFile } = useWallpaperUpload({ onWallpaperChange })

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
				className="relative overflow-hidden border rounded-lg backdrop-blur-sm bg-white/5 border-white/10"
			>
				<div className="flex items-center">
					<div className="relative flex-shrink-0 w-16 h-12 overflow-hidden">
						<MediaPreview customWallpaper={customWallpaper} />
						<div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30"></div>
					</div>
					<div className="flex-1 px-2">
						<p className="text-sm font-medium text-gray-200">
							{customWallpaper.type === 'IMAGE' ? 'تصویر' : 'ویدیو'} انتخاب شده
						</p>
						<p className="text-xs text-gray-400 truncate">
							{customWallpaper.name || 'بدون نام'}
						</p>
					</div>
					<div className="px-2">
						<button
							onClick={() => setIsExpanded(true)}
							className="px-2 py-1 text-sm text-gray-300 transition-colors rounded-lg bg-white/5 hover:bg-white/10"
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
			className={`relative transition-all duration-300 backdrop-blur-sm border-dashed rounded-lg ${
				isDragging
					? 'bg-blue-500/20 border-2 border-blue-400'
					: 'bg-white/5 border-2 border-white/20 hover:border-blue-400/50 hover:bg-white/10'
			}`}
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
							className="px-3 py-1.5 text-sm bg-gray-700/50 hover:bg-gray-700/80 rounded-lg text-gray-300 transition-colors"
						>
							نمایش فشرده
						</motion.button>
						<motion.button
							whileTap={{ scale: 0.95 }}
							onClick={handleFileSelect}
							className="px-3 py-1.5 text-sm bg-blue-500/30 hover:bg-blue-500/50 rounded-lg text-blue-300 transition-colors"
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
					<div className="p-3 mb-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
						<FiUploadCloud className="w-6 h-6 text-blue-400" />
					</div>
					<p className="mb-2 text-sm font-medium text-gray-300">
						فایل را بکشید و رها کنید
					</p>
					<div className="flex items-center gap-2 mb-2">
						<FiImage className="text-gray-400" size={14} />
						<FiVideo className="text-gray-400" size={14} />
						<p className="text-xs text-gray-400">یا انتخاب از سیستم</p>
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
