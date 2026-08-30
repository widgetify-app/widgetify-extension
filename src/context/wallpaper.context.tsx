import type { AxiosError } from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper, Wallpaper } from '@/common/wallpaper.interface'
import { safeAwait } from '@/services/api'
import { useChangeWallpaper } from '@/services/hooks/extension/update-setting.hook'
import { translateError } from '@/common/utils/translate-error'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { useQueryClient } from '@tanstack/react-query'
import { playAlarm } from '@/common/play-alarm'
import { useAuth } from '@/context/auth.context'

import { getRandomWallpaper } from '@/services/hooks/wallpapers/get-wallpaper-categories.hook'

interface WallpaperContextValue {
	selectedBackground: Wallpaper | null
	customWallpaper: Wallpaper | null
	currentStoredWallpaper: StoredWallpaper | null
	allWallpapers: (fetchedWallpapers?: Wallpaper[]) => Wallpaper[]
	handleSelectBackground: (wallpaper: Wallpaper) => Promise<void>
	handleCustomWallpaperChange: (wallpaper: Wallpaper) => void
	handleRemoveCustomWallpaper: () => Promise<void>
	syncWithFetchedWallpapers: (wallpapers: Wallpaper[]) => void
}

const WallpaperContext = createContext<WallpaperContextValue | null>(null)

export function WallpaperProvider({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient()
	const { isAuthenticated } = useAuth()
	const { mutateAsync } = useChangeWallpaper()

	const [selectedBackground, setSelectedBackground] = useState<Wallpaper | null>(null)
	const [customWallpaper, setCustomWallpaper] = useState<Wallpaper | null>(null)
	const [currentStoredWallpaper, setCurrentStoredWallpaper] =
		useState<StoredWallpaper | null>(null)

	useEffect(() => {
		async function loadInitialWallpaper() {
			const wallpaper: StoredWallpaper | null = await getFromStorage('wallpaper')
			if (!wallpaper) return

			setCurrentStoredWallpaper(wallpaper)

			if (wallpaper.id === 'custom-wallpaper') {
				const customWp = await getFromStorage('customWallpaper')
				if (customWp) {
					setCustomWallpaper(customWp)
					setSelectedBackground(customWp)
				}
			} else if (wallpaper.type === 'GRADIENT' && wallpaper.gradient) {
				setSelectedBackground({
					id: wallpaper.id,
					name: wallpaper.id.includes('custom') ? 'گرادیان سفارشی' : 'گرادیان',
					type: 'GRADIENT',
					src: '',
					previewSrc: '',
					gradient: wallpaper.gradient,
				})
			}
		}

		loadInitialWallpaper()

		const event = listenEvent('resetWallpaper', async () => {
			const wallpaper: StoredWallpaper | null = await getFromStorage('wallpaper')
			if (wallpaper) callEvent('wallpaper_change', wallpaper)
		})

		return () => {
			event()
		}
	}, [])

	const syncWithFetchedWallpapers = (wallpapers: Wallpaper[]) => {
		if (selectedBackground || !currentStoredWallpaper) return
		if (currentStoredWallpaper.type !== 'IMAGE') return

		const found = wallpapers.find((wp) => wp.id === currentStoredWallpaper.id)
		if (found) setSelectedBackground(found)
	}

	useEffect(() => {
		if (!selectedBackground) return

		if (selectedBackground.id.startsWith('preview-')) return

		const wallpaperData: StoredWallpaper = {
			id: selectedBackground.id,
			type: selectedBackground.type,
			src: selectedBackground.src,
		}
		if (selectedBackground.type === 'GRADIENT' && selectedBackground.gradient) {
			wallpaperData.gradient = selectedBackground.gradient
		}

		setToStorage('wallpaper', wallpaperData)
		if (selectedBackground.id === 'custom-wallpaper') {
			setToStorage('customWallpaper', selectedBackground)
		}

		callEvent('wallpaper_change', wallpaperData)
	}, [selectedBackground])

	const handleSelectBackground = async (wallpaper: Wallpaper) => {
		if (wallpaper.isCustom) {
			setSelectedBackground(wallpaper)
			return
		}
		if (wallpaper.coin && !isAuthenticated) {
			showToast('برای انتخاب این تصویر زمینه باید وارد حساب کاربری شوید.', 'error')
			return
		}

		const previousWallpaper: Wallpaper =
			selectedBackground ??
			(currentStoredWallpaper
				? {
						id: currentStoredWallpaper.id,
						name: '',
						type: currentStoredWallpaper.type,
						src: currentStoredWallpaper.src,
						previewSrc: '',
						gradient: currentStoredWallpaper.gradient,
					}
				: {
						id: 'gradient-a1c4fd-c2e9fb',
						name: 'گرادیان',
						type: 'GRADIENT',
						src: '',
						previewSrc: '',
						gradient: {
							from: '#a1c4fd',
							to: '#c2e9fb',
							direction: 'to-r',
						},
					})

		let isSet = false
		if (!wallpaper.coin || wallpaper.isOwned) {
			setSelectedBackground(wallpaper)
			isSet = true
		}

		if (isAuthenticated) {
			const wallpaperId =
				wallpaper.type === 'GRADIENT' ? 'custom-wallpaper' : wallpaper.id
			const [error, responseWallpaper] = await safeAwait<AxiosError, Wallpaper>(
				mutateAsync({ wallpaperId })
			)

			if (error) {
				if (isSet) {
					setSelectedBackground(previousWallpaper)
				}
				showToast(translateError(error) as string, 'error')
				return
			}

			if (wallpaper.coin && !wallpaper.isOwned) {
				showToast('هووورا! تصویر زمینه فعال شد 🎉', 'success')
				queryClient.invalidateQueries({ queryKey: ['userProfile'] })
				playAlarm('market')
			}

			if (!isSet) setSelectedBackground(responseWallpaper)
		}

		Analytics.event('wallpaper_changed')
	}

	const handleCustomWallpaperChange = (newWallpaper: Wallpaper) => {
		setCustomWallpaper(newWallpaper)
		handleSelectBackground(newWallpaper)
	}

	const handleRemoveCustomWallpaper = async () => {
		setCustomWallpaper(null)
		await setToStorage('customWallpaper', null as any)
		if (selectedBackground?.id === 'custom-wallpaper') {
			const [error, randomWallpaper] = await safeAwait<any, Wallpaper>(
				getRandomWallpaper()
			)
			if (randomWallpaper) {
				handleSelectBackground(randomWallpaper)
			} else {
				handleSelectBackground({
					id: 'gradient-a1c4fd-c2e9fb',
					name: 'گرادیان',
					type: 'GRADIENT',
					src: '',
					previewSrc: '',
					gradient: {
						from: '#a1c4fd',
						to: '#c2e9fb',
						direction: 'to-r',
					},
				})
			}
		}
	}

	const allWallpapers = (fetchedWallpapers: Wallpaper[] = []) => {
		if (customWallpaper) return [...fetchedWallpapers, customWallpaper]
		return fetchedWallpapers
	}

	return (
		<WallpaperContext.Provider
			value={{
				selectedBackground,
				customWallpaper,
				currentStoredWallpaper,
				allWallpapers,
				handleSelectBackground,
				handleCustomWallpaperChange,
				handleRemoveCustomWallpaper,
				syncWithFetchedWallpapers,
			}}
		>
			{children}
		</WallpaperContext.Provider>
	)
}

export function useWallpaperContext() {
	const ctx = useContext(WallpaperContext)
	if (!ctx)
		throw new Error('useWallpaperContext must be used inside <WallpaperProvider>')
	return ctx
}
