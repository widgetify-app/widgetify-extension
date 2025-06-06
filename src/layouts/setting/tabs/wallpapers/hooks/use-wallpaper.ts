import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import type { StoredWallpaper, Wallpaper } from '@/common/wallpaper.interface'
import { setUserWallpaperApi } from '@/services/hooks/user/userService.hook'
import { useEffect, useState } from 'react'
import Analytics from '../../../../../analytics'

export function useWallpaper(
	fetchedWallpapers: Wallpaper[] | undefined,
	isAuthenticated: boolean
) {
	const [selectedBackground, setSelectedBackground] = useState<Wallpaper | null>(null)
	const [isRetouchEnabled, setIsRetouchEnabled] = useState<boolean>(false)
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
		setSelectedBackground(wallpaper)
		Analytics.featureUsed(
			'wallpaper_changed',
			{
				wallpaper_id: wallpaper.id,
				wallpaper_name: wallpaper.name || 'unnamed',
				wallpaper_type: wallpaper.type,
			},
			'click'
		)

		if (isAuthenticated) {
			const wallpaperId =
				wallpaper.type === 'GRADIENT' ? 'custom-wallpaper' : wallpaper.id

			await setUserWallpaperApi(wallpaperId).catch()
		}
	}

	const toggleRetouch = () => {
		setIsRetouchEnabled((prev) => !prev)

		Analytics.featureUsed('wallpaper_retouch_toggled', {
			enabled: !isRetouchEnabled,
			wallpaper_id: selectedBackground?.id || 'none',
		})
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
		toggleRetouch,
		handleCustomWallpaperChange,
	}
}
