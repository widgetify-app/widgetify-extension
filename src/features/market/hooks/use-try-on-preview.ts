import { useRef } from 'react'
import Analytics from '@/analytics'
import { autoFormatErrorToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { useAppearanceSetting } from '@/context/appearance.context'
import { Theme, useTheme } from '@/context/theme.context'
import { safeAwait } from '@/services/api'
import { fetchWallpaperPreviewUrl } from '@/services/wallpapers/get-wallpaper-preview-url.hook'
import type { StoreItem } from '../types'

export function useTryOnPreview() {
	const { theme } = useTheme()
	const { fontFamily } = useAppearanceSetting()
	const valueBefore = useRef('')

	const start = async (item: StoreItem): Promise<boolean> => {
		switch (item.type) {
			case 'THEME':
				valueBefore.current = theme
				callEvent('theme_change', { theme: item.value, sync: false })
				return true
			case 'FONT':
				valueBefore.current = fontFamily
				callEvent('font_change', { font: item.value, sync: false })
				return true
			case 'BROWSER_TITLE':
				valueBefore.current = document.title
				callEvent('browser_title_change', {
					id: 'preview',
					name: 'preview',
					template: item.value,
					sync: false,
				})
				return true
			case 'WALLPAPER': {
				const [error, src] = await safeAwait<unknown, string>(
					fetchWallpaperPreviewUrl(item.id)
				)
				if (error || !src) {
					autoFormatErrorToast(error)
					return false
				}
				Analytics.event('wallpaper_previewed')
				callEvent('wallpaper_change', {
					id: `preview-${item.id}`,
					type: item.wallpaper?.type ?? 'IMAGE',
					src,
				})
				return true
			}
			default:
				return false
		}
	}

	const restore = (item: StoreItem) => {
		const before = valueBefore.current
		switch (item.type) {
			case 'THEME':
				callEvent('theme_change', { theme: before || Theme.Light, sync: false })
				break
			case 'FONT':
				callEvent('font_change', { font: before, sync: false })
				break
			case 'BROWSER_TITLE':
				callEvent('browser_title_change', {
					id: before,
					name: before,
					template: before,
					sync: false,
				})
				break
			case 'WALLPAPER':
				callEvent('resetWallpaper')
				break
		}
	}

	return { start, restore }
}
