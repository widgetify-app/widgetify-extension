import { createContext, useContext, useEffect, useState } from 'react'
import { getFromStorage, removeFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper, Wallpaper } from '@/common/types/wallpaper.interface'
import { DEFAULT_WALLPAPER } from '@/common/constants/default-wallpaper'
import { type ApiError, safeAwait } from '@/services/api'
import { useChangeWallpaper } from '@/services/extension/update-setting.hook'
import { translateError } from '@/common/utils/translate-error'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { t } from '@/common/i18n'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/auth.context'

import { getRandomWallpaper } from '@/services/wallpapers/get-wallpaper-categories.hook'
import { userKeys } from '@/services/user/user.keys'
import { wallpapersKeys } from '@/services/wallpapers/wallpapers.keys'

interface WallpaperContextValue {
	selectedBackground: Wallpaper | null
	customWallpaper: Wallpaper | null
	currentStoredWallpaper: StoredWallpaper | null
	allWallpapers: (fetchedWallpapers?: Wallpaper[]) => Wallpaper[]
	handleSelectBackground: (wallpaper: Wallpaper) => Promise<boolean>
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
			const customWp: Wallpaper | null = await getFromStorage('customWallpaper')
			if (customWp) {
				setCustomWallpaper(customWp)
			}

			const wallpaper: StoredWallpaper | null = await getFromStorage('wallpaper')
			if (!wallpaper) return

			setCurrentStoredWallpaper(wallpaper)

			if (
				wallpaper.id === 'custom-wallpaper' ||
				(wallpaper as Wallpaper).isCustom
			) {
				const wp = customWp || (wallpaper as Wallpaper)
				setCustomWallpaper(wp)
				setSelectedBackground(wp)
			} else if (wallpaper.type === 'GRADIENT' && wallpaper.gradient) {
				setSelectedBackground({
					id: wallpaper.id,
					name: wallpaper.id.includes('custom')
						? t('context.wallpaper.customGradient')
						: t('context.wallpaper.gradient'),
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

		const customSyncEvent = listenEvent('custom_wallpaper_sync', (wp) => {
			if (wp) {
				setCustomWallpaper(wp)
				setSelectedBackground(wp)
			} else {
				setCustomWallpaper(null)
			}
		})

		return () => {
			event()
			customSyncEvent()
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
		} else {
			removeFromStorage('customWallpaper')
		}

		callEvent('wallpaper_change', wallpaperData)
	}, [selectedBackground])

	const handleSelectBackground = async (wallpaper: Wallpaper): Promise<boolean> => {
		if (wallpaper.isCustom) {
			setSelectedBackground(wallpaper)
			return true
		}

		setCustomWallpaper(null)
		removeFromStorage('customWallpaper')

		if (wallpaper.coin && !isAuthenticated) {
			showToast(t('context.wallpaper.loginRequired'), 'error')
			return false
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
				: DEFAULT_WALLPAPER)

		let isSet = false
		if (!wallpaper.coin || wallpaper.isOwned) {
			setSelectedBackground(wallpaper)
			isSet = true
		}

		if (isAuthenticated) {
			const wallpaperId =
				wallpaper.type === 'GRADIENT' ? 'custom-wallpaper' : wallpaper.id
			const [error, responseWallpaper] = await safeAwait<ApiError, Wallpaper>(
				mutateAsync({ wallpaperId })
			)

			if (error) {
				if (isSet) {
					setSelectedBackground(previousWallpaper)
				}
				showToast(translateError(error) as string, 'error')
				return false
			}

			if (wallpaper.coin && !wallpaper.isOwned) {
				showToast(t('context.wallpaper.activated'), 'success')
				queryClient.invalidateQueries({ queryKey: userKeys.profile })
				queryClient.invalidateQueries({
					queryKey: wallpapersKeys.all,
					refetchType: 'all',
				})
			}

			if (!isSet) setSelectedBackground(responseWallpaper)
		}

		Analytics.event('wallpaper_changed')
		return true
	}

	const handleCustomWallpaperChange = (newWallpaper: Wallpaper) => {
		setCustomWallpaper(newWallpaper)
		handleSelectBackground(newWallpaper)
	}

	const handleRemoveCustomWallpaper = async () => {
		setCustomWallpaper(null)
		await setToStorage('customWallpaper', null as any)
		if (selectedBackground?.id === 'custom-wallpaper') {
			const [, randomWallpaper] = await safeAwait<any, Wallpaper>(
				getRandomWallpaper()
			)
			if (randomWallpaper) {
				handleSelectBackground(randomWallpaper)
			} else {
				handleSelectBackground(DEFAULT_WALLPAPER)
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
