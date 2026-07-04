import type { Wallpaper } from '@/common/wallpaper.interface'
import Analytics from '../../../../../analytics'
import { showToast } from '@/common/toast'

const MAX_SIZE = 3
const MAX_FILE_SIZE = MAX_SIZE * 1024 * 1024 // 3MB

interface UseWallpaperUploadProps {
	onWallpaperChange: (wallpaper: Wallpaper) => void
}

export function useWallpaperUpload({ onWallpaperChange }: UseWallpaperUploadProps) {
	const processFile = (file: File) => {
		const isImage = file.type.startsWith('image/')
		const isVideo = file.type.startsWith('video/')

		if (!isImage && !isVideo) {
			showToast('لطفا یک فایل تصویری یا ویدیویی انتخاب کنید', 'error')
			return
		}

		if (file.size > MAX_FILE_SIZE) {
			showToast(
				`حجم فایل نباید بیشتر از ${MAX_SIZE} مگابایت باشد. حجم فعلی: ${(file.size / (1024 * 1024)).toFixed(1)} مگابایت`,
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
