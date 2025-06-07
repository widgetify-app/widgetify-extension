import type { Wallpaper } from '@/common/wallpaper.interface'
import Analytics from '../../../../../analytics'

const MAX_FILE_SIZE = 6 * 1024 * 1024 // 6MB

interface UseWallpaperUploadProps {
	onWallpaperChange: (wallpaper: Wallpaper) => void
}

export function useWallpaperUpload({ onWallpaperChange }: UseWallpaperUploadProps) {
	const processFile = (file: File, uploadMethod: string) => {
		const isImage = file.type.startsWith('image/')
		const isVideo = file.type.startsWith('video/')

		if (!isImage && !isVideo) {
			alert('لطفا یک فایل تصویری یا ویدیویی انتخاب کنید')
			return
		}

		if (file.size > MAX_FILE_SIZE) {
			alert(
				`حجم فایل نباید بیشتر از 6 مگابایت باشد. حجم فعلی: ${(file.size / (1024 * 1024)).toFixed(1)} مگابایت`
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

			Analytics.featureUsed('custom_wallpaper_selected', {
				file_type: file.type,
				file_size: file.size,
				media_type: isImage ? 'image' : 'video',
				method: uploadMethod,
			})
		}

		reader.readAsDataURL(file)
	}

	return { processFile }
}
