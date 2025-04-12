import type { Wallpaper } from '@/common/wallpaper.interface'
import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { FiEdit, FiUploadCloud } from 'react-icons/fi'
import { useWallpaperUpload } from '../hooks/use-wallpaper-upload'
import { MediaPreview } from './media-preview.component'

interface UploadAreaProps {
	customWallpaper: Wallpaper | null
	onWallpaperChange: (newWallpaper: Wallpaper) => void
}

export function UploadArea({ customWallpaper, onWallpaperChange }: UploadAreaProps) {
	const { theme, themeUtils } = useTheme()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { processFile } = useWallpaperUpload({ onWallpaperChange })

	const getPreviewContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/70 border-gray-300/30'
			case 'dark':
				return 'bg-gray-800/70 border-gray-700/30'
			default: // glass
				return 'bg-white/10 border-white/20'
		}
	}

	const getPrimaryButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-700'
			case 'dark':
				return 'bg-blue-500/30 hover:bg-blue-500/50 text-blue-300'
			default: // glass
				return 'bg-blue-500/40 hover:bg-blue-500/60 text-blue-200 shadow-sm shadow-blue-500/30'
		}
	}

	const getUploadButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/70 border border-gray-300/50 hover:bg-gray-200/70'
			case 'dark':
				return 'bg-gray-800/70 border border-gray-700/50 hover:bg-gray-700/70'
			default: // glass
				return 'bg-white/10 border border-white/20 hover:bg-white/15'
		}
	}

	const handleFileSelect = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			processFile(file, 'file_selector')
			e.target.value = ''
		}
	}

	if (!customWallpaper) {
		return (
			<motion.div
				layout
				className={`relative rounded-lg overflow-hidden ${getUploadButtonStyle()}`}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, ease: 'easeOut' }}
			>
				<button
					className="flex items-center justify-center w-full gap-2 p-4 cursor-pointer"
					onClick={handleFileSelect}
				>
					<FiUploadCloud size={18} className={themeUtils.getTextColor()} />
					<p className={`text-sm font-medium ${themeUtils.getTextColor()}`}>
						برای آپلود از سیستم کلیک کنید
					</p>
				</button>
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

	return (
		<motion.div
			layout
			className={`relative overflow-hidden border rounded-lg backdrop-blur-sm shadow-sm ${getPreviewContainerStyle()}`}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
		>
			<div className="flex items-center p-2.5">
				<div className="relative flex-shrink-0 w-16 h-12 overflow-hidden rounded-md shadow-sm">
					<MediaPreview customWallpaper={customWallpaper} />
					<div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30"></div>

					<div className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-medium text-white rounded-sm backdrop-blur-md bg-blue-500/80">
						{customWallpaper.type === 'IMAGE' ? 'تصویر' : 'ویدیو'}
					</div>
				</div>

				<div className="flex-1 mx-3">
					<p className={`text-sm font-medium ${themeUtils.getTextColor()}`}>
						پس‌زمینه فعال
					</p>
					<p
						className={`text-xs ${themeUtils.getDescriptionTextStyle()} truncate max-w-[200px]`}
					>
						{customWallpaper.name || 'بدون نام'}
					</p>
				</div>

				<div className="flex gap-2">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleFileSelect}
						className={`px-3 py-1.5 text-sm transition-all duration-200 rounded-lg ${getPrimaryButtonStyle()} flex items-center gap-1.5`}
					>
						<FiEdit size={14} />
						<span>تغییر</span>
					</motion.button>
				</div>
			</div>
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
