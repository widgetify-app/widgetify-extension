import { useRef, useState } from 'react'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { useWallpaperUpload } from '../hooks/use-wallpaper-upload'
import { useRemoveCustomWallpaper } from '@/services/hooks/wallpapers/upload-custom-wallpaper.hook'
import { safeAwait } from '@/services/api'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { UploadLoading } from './upload/upload-loading.component'
import { UploadEmpty } from './upload/upload-empty.component'
import { UploadActive } from './upload/upload-active.component'

interface UploadAreaProps {
	customWallpaper: Wallpaper | null
	onWallpaperChange: (newWallpaper: Wallpaper) => void
	onWallpaperRemove?: () => void | Promise<void>
}

export function UploadArea({
	customWallpaper,
	onWallpaperChange,
	onWallpaperRemove,
}: UploadAreaProps) {
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { mutateAsync: removeCustomWallpaper, isPending: isRemoving } =
		useRemoveCustomWallpaper()

	const { processFile, isUploading, isLoadingConfig, isVip, vipMaxSize, freeMaxSize } =
		useWallpaperUpload({
			onWallpaperChange,
		})

	const handleFileSelect = () => {
		if (isUploading || isRemoving || isLoadingConfig) return
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			processFile(file)
			e.target.value = ''
		}
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (!isDragging) setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
		const file = e.dataTransfer.files?.[0]
		if (file) {
			processFile(file)
		}
	}

	const handleRemove = async () => {
		if (isUploading || isRemoving) return
		if (isVip && customWallpaper?.src?.startsWith('http')) {
			const [error] = await safeAwait(removeCustomWallpaper())
			if (error) {
				showToast(translateError(error) as string, 'error')
				return
			}
		}
		if (onWallpaperRemove) {
			await onWallpaperRemove()
		}
		showToast('تصویر زمینه حذف شد', 'info')
	}

	return (
		<>
			{isLoadingConfig ? (
				<UploadLoading />
			) : !customWallpaper ? (
				<UploadEmpty
					isDragging={isDragging}
					isUploading={isUploading}
					isVip={isVip}
					vipMaxSize={vipMaxSize}
					freeMaxSize={freeMaxSize}
					onFileSelect={handleFileSelect}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				/>
			) : (
				<UploadActive
					customWallpaper={customWallpaper}
					isUploading={isUploading}
					isRemoving={isRemoving}
					onFileSelect={handleFileSelect}
					onRemove={handleRemove}
				/>
			)}

			<input
				type="file"
				ref={fileInputRef}
				className="hidden"
				accept={isVip ? 'image/*,video/mp4,video/webm' : 'image/*'}
				onChange={handleFileChange}
			/>
		</>
	)
}
