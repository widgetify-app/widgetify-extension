import { useCallback, useRef, useState } from 'react'
import { MdOutlineImage, MdOutlineVideoCameraBack } from 'react-icons/md'
import type { Wallpaper } from '../../../../../common/wallpaper.interface'
import { useWallpaperUpload } from '../hooks/use-wallpaper-upload'
import { MediaPreview } from './media-preview.component'

interface UploadAreaProps {
	customWallpaper: Wallpaper | null
	onWallpaperChange: (newWallpaper: Wallpaper) => void
}

export function UploadArea({ customWallpaper, onWallpaperChange }: UploadAreaProps) {
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const dropZoneRef = useRef<HTMLDivElement>(null)

	const { processFile } = useWallpaperUpload({ onWallpaperChange })

	const handleFileSelect = useCallback(() => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}, [])

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (!file) return

			processFile(file, 'file_selector')
			e.target.value = ''
		},
		[processFile],
	)

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}, [])

	const handleDragLeave = useCallback(() => {
		setIsDragging(false)
	}, [])

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(false)

			const file = e.dataTransfer.files?.[0]
			if (!file) return

			processFile(file, 'drag_and_drop')
		},
		[processFile],
	)

	return (
		<div
			ref={dropZoneRef}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={`relative flex flex-col items-center justify-center p-6 transition-all duration-300 border-2 border-dashed rounded-xl ${
				isDragging
					? 'bg-blue-500/20 border-blue-400'
					: customWallpaper
						? 'bg-green-500/10 border-green-400/50'
						: 'bg-white/5 border-gray-600/50 hover:border-blue-400/50 hover:bg-white/10'
			}`}
		>
			{customWallpaper ? (
				<>
					<div className="relative w-full mb-3 overflow-hidden rounded-lg aspect-video">
						<MediaPreview customWallpaper={customWallpaper} />
						<div className="absolute top-2 right-2">
							<div className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
								انتخاب شده
							</div>
						</div>
						<div className="absolute bottom-2 right-2">
							<div className="px-2 py-1 text-xs font-medium text-white rounded-full bg-blue-500/80 backdrop-blur-sm">
								{customWallpaper.type === 'IMAGE' ? 'تصویر' : 'ویدیو'}
							</div>
						</div>
					</div>
					<button
						onClick={handleFileSelect}
						className="px-4 py-2 mt-2 text-sm font-medium text-blue-300 transition-colors rounded-lg bg-blue-500/20 hover:bg-blue-500/30"
					>
						تغییر {customWallpaper.type === 'IMAGE' ? 'تصویر' : 'ویدیو'}
					</button>
				</>
			) : (
				<div
					className="flex flex-col items-center justify-center"
					onClick={handleFileSelect}
				>
					<div className="flex items-center gap-3 p-3 mb-3 rounded-full bg-white/10">
						<MdOutlineVideoCameraBack className="w-8 h-8 text-gray-300" />
						<MdOutlineImage className="w-8 h-8 text-gray-300" />
					</div>
					<p className="mb-2 text-sm font-medium text-gray-300">
						فایل را بکشید و رها کنید
					</p>
					<p className="mb-2 text-xs text-gray-400">یا</p>
					<button
						onClick={handleFileSelect}
						className="px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-blue-600/70 hover:bg-blue-600"
					>
						انتخاب تصویر یا ویدیو از سیستم
					</button>
					<p className="mt-2 text-xs text-gray-500">JPG, PNG, MP4, WEBM (حداکثر 6MB)</p>
				</div>
			)}

			<input
				type="file"
				ref={fileInputRef}
				className="hidden"
				accept="image/*,video/*"
				onChange={handleFileChange}
			/>
		</div>
	)
}
