import type { Wallpaper } from '@/common/wallpaper.interface'
import Analytics from '../../../../../analytics'
import { showToast } from '@/common/toast'

interface UseWallpaperUploadProps {
	onWallpaperChange: (wallpaper: Wallpaper) => void
	max_size: number
	max_file_size: number
}

export function useWallpaperUpload({
	onWallpaperChange,
	max_file_size,
	max_size,
}: UseWallpaperUploadProps) {
	const processFile = (file: File) => {
		const isImage = file.type.startsWith('image/')
		// const isVideo = file.type.startsWith('video/')

		if (!isImage) {
			showToast('لطفا یک فایل تصویری انتخاب کنید', 'error')
			return
		}

		if (file.size > max_file_size) {
			showToast(
				`حجم فایل نباید بیشتر از ${max_size} مگابایت باشد. حجم فعلی: ${(file.size / (1024 * 1024)).toFixed(1)} مگابایت`,
				'error'
			)
			return
		}

		const reader = new FileReader()
		reader.onload = () => {
			const newCustomWallpaper: Wallpaper = {
				id: 'custom-wallpaper',
				type: isImage ? 'IMAGE' : 'VIDEO',
				previewSrc: '',
				src: reader.result as string,
				name: isImage ? 'تصویر سیستم' : 'ویدیو سیستم',
				isCustom: true,
			}

			onWallpaperChange(newCustomWallpaper)

			Analytics.event('custom_wallpaper_selected')
		}

		reader.readAsDataURL(file)
	}

	return { processFile }
}
