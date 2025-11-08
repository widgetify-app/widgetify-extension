import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import type { StoredWallpaper, Wallpaper } from '@/common/wallpaper.interface'
import { safeAwait } from '@/services/api'
import { useChangeWallpaper } from '@/services/hooks/extension/updateSetting.hook'
import { translateError } from '@/utils/translate-error'
import Analytics from '../../../../../analytics'

export function useWallpaper(
	fetchedWallpapers: Wallpaper[] | undefined,
	isAuthenticated: boolean
) {
	const [selectedBackground, setSelectedBackground] = useState<Wallpaper | null>(null)
	const [isRetouchEnabled, setIsRetouchEnabled] = useState<boolean>(false)
	const { mutateAsync } = useChangeWallpaper()
	const [customWallpaper, setCustomWallpaper] = useState<Wallpaper | null>(null)

	useEffect(() => {
		async function getWallpaper() {
			const wallpaper: StoredWallpaper | null = await getFromStorage('wallpaper')
			if (wallpaper) {
				setIsRetouchEnabled(wallpaper.isRetouchEnabled)

				if (wallpaper.id === 'custom-wallpaper') {
					const customWp = await getFromStorage('customWallpaper')
					if (customWp) {
						setCustomWallpaper(customWp)
						setSelectedBackground(customWp)
					}
				} else if (wallpaper.type === 'GRADIENT' && wallpaper.gradient) {
					const gradientWallpaper: Wallpaper = {
						id: wallpaper.id,
						name: wallpaper.id.includes('custom')
							? 'گرادیان سفارشی'
							: 'گرادیان',
						type: 'GRADIENT',
						src: '',
						previewSrc: '',
						gradient: wallpaper.gradient,
					}
					setSelectedBackground(gradientWallpaper)
				} else {
					if (fetchedWallpapers) {
						const foundWallpaper = fetchedWallpapers.find(
							(wp) => wp.id === wallpaper.id
						)
						if (foundWallpaper) {
							setSelectedBackground(foundWallpaper)
						}
					}
				}
			}
		}

		if (fetchedWallpapers) {
			getWallpaper()
		}
	}, [fetchedWallpapers])

	const allWallpapers = () => {
		if (!fetchedWallpapers) return []

		if (customWallpaper) {
			return [...fetchedWallpapers, customWallpaper]
		}

		return fetchedWallpapers
	}

	useEffect(() => {
		if (!selectedBackground) return

		const wallpaperData: StoredWallpaper = {
			id: selectedBackground.id,
			type: selectedBackground.type,
			src: selectedBackground.src,
			isRetouchEnabled: isRetouchEnabled,
		}

		// Add gradient data if this is a gradient wallpaper
		if (selectedBackground.type === 'GRADIENT' && selectedBackground.gradient) {
			wallpaperData.gradient = selectedBackground.gradient
		}

		setToStorage('wallpaper', wallpaperData)

		if (selectedBackground.id === 'custom-wallpaper') {
			setToStorage('customWallpaper', selectedBackground)
		}

		callEvent('wallpaperChanged', wallpaperData)
	}, [selectedBackground, isRetouchEnabled])

	const handleSelectBackground = async (wallpaper: Wallpaper) => {
		if (wallpaper.coin && !isAuthenticated) {
			return toast.error(
				'برای انتخاب این تصویر تصویر زمینه باید وارد حساب کاربری شوی.'
			)
		}

		if (!wallpaper.coin || wallpaper.isOwned) setSelectedBackground(wallpaper)

		if (isAuthenticated) {
			const wallpaperId =
				wallpaper.type === 'GRADIENT' ? 'custom-wallpaper' : wallpaper.id

			const [error] = await safeAwait<AxiosError, any>(mutateAsync({ wallpaperId }))
			if (error) {
				toast.error(translateError(error) as string, {
					duration: 8000,
					style: { maxWidth: '400px', fontFamily: 'inherit' },
					className: '!bg-error !text-error-content !font-bold',
				})
				return
			}

			setSelectedBackground(wallpaper)

			if (wallpaper.coin && !wallpaper.isOwned) {
				toast.success('هووورا! تصویر زمینه فعال شد 🎉', {
					duration: 5000,
					style: { maxWidth: '400px', fontFamily: 'inherit' },
					className: '!bg-success !text-success-content !font-bold',
				})
			}
		}

		Analytics.event('wallpaper_changed')
	}

	const handlePreviewBackground = (wallpaper: Wallpaper) => {
		setSelectedBackground(wallpaper)

		Analytics.event('wallpaper_previewed')
	}

	const toggleRetouch = () => {
		setIsRetouchEnabled((prev) => !prev)

		Analytics.event('wallpaper_retouch_toggled')
	}

	const handleCustomWallpaperChange = (newWallpaper: Wallpaper) => {
		setCustomWallpaper(newWallpaper)
		handleSelectBackground(newWallpaper)
	}

	return {
		selectedBackground,
		isRetouchEnabled,
		customWallpaper,
		allWallpapers,
		handleSelectBackground,
		handlePreviewBackground,
		toggleRetouch,
		handleCustomWallpaperChange,
	}
}
