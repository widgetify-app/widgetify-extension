import { useCallback, useEffect, useMemo, useState } from 'react'
import { StoreKey } from '../../../../../common/constant/store.key'
import { getFromStorage, setToStorage } from '../../../../../common/storage'
import Analytics from '../../../../../analytics'
import type {
	StoredWallpaper,
	Wallpaper,
} from '../../../../../common/wallpaper.interface'

export function useWallpaper(fetchedWallpapers: Wallpaper[] | undefined) {
	const [selectedBackground, setSelectedBackground] = useState<string | null>(null)
	const [isRetouchEnabled, setIsRetouchEnabled] = useState<boolean>(false)
	const [customWallpaper, setCustomWallpaper] = useState<Wallpaper | null>(null)

	useEffect(() => {
		async function getWallpaper() {
			const wallpaper = await getFromStorage<StoredWallpaper>(StoreKey.Wallpaper)
			if (wallpaper) {
				setSelectedBackground(wallpaper.id)
				setIsRetouchEnabled(wallpaper.isRetouchEnabled)

				if (wallpaper.id === 'custom-wallpaper') {
					const customWp = await getFromStorage<Wallpaper>(StoreKey.Custom_Wallpaper)
					if (customWp) {
						setCustomWallpaper(customWp)
					}
				}
			}
		}

		getWallpaper()
	}, [])

	const allWallpapers = useMemo(() => {
		if (!fetchedWallpapers) return []

		if (customWallpaper) {
			return [...fetchedWallpapers, customWallpaper]
		}

		return fetchedWallpapers
	}, [fetchedWallpapers, customWallpaper])

	const selectedWallpaper = useMemo(() => {
		if (selectedBackground === 'custom-wallpaper' && customWallpaper) {
			return customWallpaper
		}
		return allWallpapers.find((bg) => bg.id === selectedBackground) || null
	}, [allWallpapers, selectedBackground, customWallpaper])

	useEffect(() => {
		if (!selectedWallpaper) return

		const wallpaperData = {
			id: selectedWallpaper.id,
			type: selectedWallpaper.type,
			src: selectedWallpaper.src,
			isRetouchEnabled: isRetouchEnabled,
		}

		setToStorage(StoreKey.Wallpaper, wallpaperData)

		if (selectedWallpaper.id === 'custom-wallpaper') {
			setToStorage(StoreKey.Custom_Wallpaper, selectedWallpaper)
		}

		const event = new CustomEvent('wallpaperChanged', {
			detail: wallpaperData,
		})

		window.dispatchEvent(event)
	}, [selectedWallpaper, isRetouchEnabled])

	const handleSelectBackground = useCallback(
		(id: string) => {
			setSelectedBackground(id)

			const selectedWp = allWallpapers.find((wp) => wp.id === id)
			if (selectedWp) {
				Analytics.featureUsed('wallpaper_changed', {
					wallpaper_id: id,
					wallpaper_name: selectedWp.name || 'unnamed',
					wallpaper_type: selectedWp.type,
				})
			}
		},
		[allWallpapers],
	)

	const toggleRetouch = useCallback(() => {
		setIsRetouchEnabled((prev) => !prev)

		Analytics.featureUsed('wallpaper_retouch_toggled', {
			enabled: !isRetouchEnabled,
			wallpaper_id: selectedBackground || 'none',
		})
	}, [isRetouchEnabled, selectedBackground])

	const handleCustomWallpaperChange = useCallback((newWallpaper: Wallpaper) => {
		setCustomWallpaper(newWallpaper)
		setSelectedBackground('custom-wallpaper')
	}, [])

	return {
		selectedBackground,
		isRetouchEnabled,
		customWallpaper,
		allWallpapers,
		selectedWallpaper,
		handleSelectBackground,
		toggleRetouch,
		handleCustomWallpaperChange,
	}
}
