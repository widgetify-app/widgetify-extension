import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import type { StoredWallpaper, Wallpaper } from '@/common/wallpaper.interface'
import { safeAwait } from '@/services/api'
import { useChangeWallpaper } from '@/services/hooks/extension/updateSetting.hook'
import { translateError } from '@/utils/translate-error'
import Analytics from '../../../../../analytics'
import { showToast } from '@/common/toast'
import { useQueryClient } from '@tanstack/react-query'
import { playAlarm } from '@/common/playAlarm'
import { useAuth } from '@/context/auth.context'

export function useWallpaper(fetchedWallpapers: Wallpaper[] | undefined) {
	const queryClient = useQueryClient()
	const { isAuthenticated } = useAuth()
	const [selectedBackground, setSelectedBackground] = useState<Wallpaper | null>(null)
	const { mutateAsync } = useChangeWallpaper()
	const [customWallpaper, setCustomWallpaper] = useState<Wallpaper | null>(null)

	useEffect(() => {
		async function getWallpaper() {
			const wallpaper: StoredWallpaper | null = await getFromStorage('wallpaper')
			if (wallpaper) {
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

		getWallpaper()
	}, [])

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
	}, [selectedBackground])

	const handleSelectBackground = async (wallpaper: Wallpaper) => {
		if (wallpaper.isCustom) {
			setToBackground(wallpaper)
			return
		}
		if (wallpaper.coin && !isAuthenticated) {
			return showToast(
				'برای انتخاب این تصویر تصویر زمینه باید وارد حساب کاربری شوید.',
				'error'
			)
		}
		let isSet = false
		if (!wallpaper.coin || wallpaper.isOwned) {
			setToBackground(wallpaper)
			isSet = true
		}

		if (isAuthenticated) {
			const wallpaperId =
				wallpaper.type === 'GRADIENT' ? 'custom-wallpaper' : wallpaper.id

			const [error, responseWallpaper] = await safeAwait<AxiosError, Wallpaper>(
				mutateAsync({ wallpaperId })
			)
			if (error) {
				showToast(translateError(error) as string, 'error')
				return
			}

			if (wallpaper.coin && !wallpaper.isOwned) {
				showToast('هووورا! تصویر زمینه فعال شد 🎉', 'success')
				queryClient.invalidateQueries({ queryKey: ['userProfile'] })
				playAlarm('market')
			}

			if (!isSet) setToBackground(responseWallpaper)
		}

		Analytics.event('wallpaper_changed')
	}

	const handlePreviewBackground = (wallpaper: Wallpaper) => {
		setSelectedBackground(wallpaper)
		Analytics.event('wallpaper_previewed')
	}

	const setToBackground = (wallpaper: Wallpaper) => {
		setSelectedBackground(wallpaper)
	}

	const handleCustomWallpaperChange = (newWallpaper: Wallpaper) => {
		setCustomWallpaper(newWallpaper)
		handleSelectBackground(newWallpaper)
	}

	return {
		selectedBackground,
		customWallpaper,
		allWallpapers,
		handleSelectBackground,
		handlePreviewBackground,
		handleCustomWallpaperChange,
	}
}
