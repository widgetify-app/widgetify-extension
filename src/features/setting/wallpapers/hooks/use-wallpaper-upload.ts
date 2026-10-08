import { t } from '@/common/i18n'
import type { Wallpaper } from '@/common/types/wallpaper.interface'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { useAuth } from '@/context/auth.context'
import { useUploadCustomWallpaper } from '@/services/wallpapers/upload-custom-wallpaper.hook'
import { useGetWallpaperConfig } from '@/services/wallpapers/get-wallpaper-config.hook'
import { type ApiError, safeAwait } from '@/services/api'
import { translateError } from '@/common/utils/translate-error'
import { callEvent } from '@/common/utils/call-event'

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
				showToast(t('setting.wallpaperUpload.pickMediaFile'), 'error')
				return
			}

			if (file.size > vipMaxSize * 1024 * 1024) {
				showToast(
					t('setting.wallpaperUpload.fileTooLarge', { p0: vipMaxSize }),
					'error'
				)
				return
			}

			const [error, uploadedWallpaper] = await safeAwait<ApiError, Wallpaper>(
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
						? t('setting.wallpaperUpload.videoSyncedToast')
						: t('setting.wallpaperUpload.photoSyncedToast'),
					'success'
				)
				Analytics.event('custom_wallpaper_selected')
			}
			return
		}

		if (isVideo) {
			showToast(t('setting.wallpaperUpload.videoRequiresPro'), 'info')
			callEvent('openSettings', 'vip')
			return
		}

		if (!isImage) {
			showToast(t('setting.wallpaperUpload.pickPhoto'), 'error')
			return
		}

		if (file.size > freeMaxSize * 1024 * 1024) {
			if (file.size <= vipMaxSize * 1024 * 1024) {
				showToast(
					t('setting.wallpaperUpload.largeUploadRequiresPro', {
						p0: vipMaxSize,
					}),
					'info'
				)
				callEvent('openSettings', 'vip')
			} else {
				showToast(
					t('setting.wallpaperUpload.fileTooLarge', { p0: freeMaxSize }),
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
				name: t('setting.wallpaperUpload.customPhotoLabel'),
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
