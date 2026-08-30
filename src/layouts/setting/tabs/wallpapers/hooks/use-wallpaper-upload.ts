import type { Wallpaper } from '@/common/wallpaper.interface'
import Analytics from '../../../../../analytics'
import { showToast } from '@/common/toast'
import { useAuth } from '@/context/auth.context'
import { useUploadCustomWallpaper } from '@/services/hooks/wallpapers/upload-custom-wallpaper.hook'
import { useGetWallpaperConfig } from '@/services/hooks/wallpapers/get-wallpaper-config.hook'
import { safeAwait } from '@/services/api'
import { translateError } from '@/common/utils/translate-error'
import { callEvent } from '@/common/utils/call-event'
import { AxiosError } from 'axios'

const DEFAULT_FREE_MAX_SIZE = 2
const DEFAULT_VIP_MAX_SIZE = 40

interface UseWallpaperUploadProps {
	onWallpaperChange: (wallpaper: Wallpaper) => void
}

export function useWallpaperUpload({ onWallpaperChange }: UseWallpaperUploadProps) {
	const { isAuthenticated, isVip } = useAuth()
	const { data: config, isLoading: isLoadingConfig } = useGetWallpaperConfig()
	const { mutateAsync: uploadCustomWallpaper, isPending: isUploading } =
		useUploadCustomWallpaper()

	const freeMaxSize = config?.maxUploadSizeFree ?? DEFAULT_FREE_MAX_SIZE
	const vipMaxSize =
		config?.maxUploadSizeVip ?? config?.maxUploadSizeVip ?? DEFAULT_VIP_MAX_SIZE

	const processFile = async (file: File) => {
		const isImage = file.type.startsWith('image/')
		const isVideo = file.type.startsWith('video/')

		if (isAuthenticated && isVip) {
			if (!isImage && !isVideo) {
				showToast('لطفاً یه فایل عکس، گیف یا ویدیو انتخاب کن', 'error')
				return
			}

			if (file.size > vipMaxSize * 1024 * 1024) {
				showToast(`حجم فایل نباید بیشتر از ${vipMaxSize} مگابایت باشه`, 'error')
				return
			}

			const [error, uploadedWallpaper] = await safeAwait<AxiosError, Wallpaper>(
				uploadCustomWallpaper(file)
			)

			if (error) {
				showToast(translateError(error) as string, 'error')
				return
			}

			if (uploadedWallpaper) {
				onWallpaperChange(uploadedWallpaper)
				showToast(
					isVideo
						? 'ویدیو ذخیره شد و با اکانتت همگام‌سازی می‌شه'
						: 'عکس ذخیره شد و با اکانتت همگام‌سازی می‌شه',
					'success'
				)
				Analytics.event('custom_wallpaper_selected')
			}
			return
		}

		if (isVideo) {
			showToast('برای گذاشتن ویدیو به عنوان پس‌زمینه اشتراک پرو لازمه', 'info')
			callEvent('openSettings', 'vip')
			return
		}

		if (!isImage) {
			showToast('لطفاً یه عکس انتخاب کن', 'error')
			return
		}

		if (file.size > freeMaxSize * 1024 * 1024) {
			if (file.size <= vipMaxSize * 1024 * 1024) {
				showToast(
					`برای آپلود فایل تا ${vipMaxSize} مگابایت اشتراک پرو لازمه`,
					'info'
				)
				callEvent('openSettings', 'vip')
			} else {
				showToast(
					`حجم فایل نباید بیشتر از ${freeMaxSize} مگابایت باشه`,
					'error'
				)
			}
			return
		}

		const reader = new FileReader()
		reader.onload = () => {
			const newCustomWallpaper: Wallpaper = {
				id: 'custom-wallpaper',
				type: 'IMAGE',
				previewSrc: '',
				src: reader.result as string,
				name: 'عکس دلخواه',
				isCustom: true,
			}

			onWallpaperChange(newCustomWallpaper)
			Analytics.event('custom_wallpaper_selected')
		}

		reader.readAsDataURL(file)
	}

	return {
		processFile,
		isUploading,
		isLoadingConfig,
		isVip: Boolean(isAuthenticated && isVip),
		freeMaxSize,
		vipMaxSize,
		maxSize: isAuthenticated && isVip ? vipMaxSize : freeMaxSize,
	}
}
