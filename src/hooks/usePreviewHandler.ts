import { useState, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'
import { callEvent } from '@/common/utils/call-event'
import { sleep } from '@/common/utils/timeout'
import { Theme } from '@/context/theme.context'
import { MarketItemType, type MarketItem } from '@/services/hooks/market/market.interface'
import { autoFormatErrorToast, showPreviewToast } from '@/common/toast'
import type { StoredWallpaper } from '@/common/wallpaper.interface'
import { fetchWallpaperPreviewUrl } from '@/services/hooks/wallpapers/getWallpaperPreviewUrl.hook'

export interface PreviewState {
	toastId: string
	type: MarketItemType
	oldValue: string
}

export interface CurrentValues {
	theme: string
	font: string
	browserTitle: string
	wallpaper?: StoredWallpaper | null
}

export function usePreviewHandler() {
	const [currentPreviewState, setCurrentPreview] = useState<PreviewState | null>(null)
	const currentPreviewRef = useRef<PreviewState | null>(null)

	const restorePreview = useCallback((state: PreviewState) => {
		switch (state.type) {
			case MarketItemType.THEME:
				callEvent('theme_change', {
					sync: false,
					theme: state.oldValue || Theme.Light,
				})
				break
			case MarketItemType.FONT:
				callEvent('font_change', { font: state.oldValue, sync: false })
				break
			case MarketItemType.BROWSER_TITLE:
				callEvent('browser_title_change', {
					id: state.oldValue || '',
					name: state.oldValue || '',
					template: state.oldValue,
					sync: false,
				})
				break
			case MarketItemType.wallpapers: {
				callEvent('resetWallpaper')
				break
			}
		}
	}, [])

	const cancelPreview = useCallback(async () => {
		const state = currentPreviewRef.current
		if (!state) return console.log('not found state')
		toast.remove(state.toastId)
		restorePreview(state)
		currentPreviewRef.current = null
		setCurrentPreview(null)
	}, [restorePreview])

	const previewHandler = useCallback(
		async (item: MarketItem, currentValues: CurrentValues) => {
			if (currentPreviewRef.current?.toastId) {
				toast.remove(currentPreviewRef.current.toastId)
				restorePreview(currentPreviewRef.current)
				await sleep(150)
			}

			let oldValue = ''
			switch (item.type) {
				case MarketItemType.THEME:
					oldValue = currentValues.theme
					break
				case MarketItemType.FONT:
					oldValue = currentValues.font
					break
				case MarketItemType.BROWSER_TITLE:
					oldValue = currentValues.browserTitle
					break
			}

			const toastId = showPreviewToast(item.name, cancelPreview)

			switch (item.type) {
				case MarketItemType.THEME:
					callEvent('theme_change', {
						sync: false,
						theme: (item.itemValue as any) || Theme.Light,
					})
					break
				case MarketItemType.BROWSER_TITLE:
					callEvent('browser_title_change', {
						id: 'preview',
						name: 'preview',
						template: item.itemValue as string,
						sync: false,
					})
					break
				case MarketItemType.FONT:
					callEvent('font_change', {
						font: item.itemValue as string,
						sync: false,
					})
					break
				case MarketItemType.wallpapers: {
					try {
						const previewUrl = await fetchWallpaperPreviewUrl(item.id)
						const tempWallpaper: StoredWallpaper = {
							id: `preview-${item.id}`,
							type: item.meta.wallpaperType,
							src: previewUrl as string,
						}
						callEvent('wallpaper_change', tempWallpaper)
					} catch (error: any) {
						toast.remove(toastId)
						autoFormatErrorToast(error)
						return
					}
					break
				}
			}

			const newState: PreviewState = {
				oldValue,
				type: item.type,
				toastId,
			}
			currentPreviewRef.current = newState
			setCurrentPreview(newState)
		},
		[cancelPreview, restorePreview]
	)

	return { previewHandler, cancelPreview, currentPreviewState }
}
