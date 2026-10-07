import { useEffect, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { useAppearanceSetting } from '@/context/appearance.context'
import { useTheme } from '@/context/theme.context'
import { useWallpaperContext } from '@/context/wallpaper.context'
import { DEFAULT_BROWSER_TITLE } from '../constants'
import type { StoreItemType } from '../types'

export function useActiveValues(): Partial<Record<StoreItemType, string>> {
	const { theme } = useTheme()
	const { fontFamily } = useAppearanceSetting()
	const { selectedBackground, currentStoredWallpaper } = useWallpaperContext()
	const [browserTitle, setBrowserTitle] = useState<string>()

	useEffect(() => {
		let heard = false
		const stopListening = listenEvent(
			'browser_title_change',
			({ template, sync }) => {
				if (!sync) return
				heard = true
				setBrowserTitle(template)
			}
		)
		getFromStorage('browserTitle').then((stored) => {
			if (!heard) setBrowserTitle(stored?.template ?? DEFAULT_BROWSER_TITLE.value)
		})
		return stopListening
	}, [])

	return {
		THEME: theme,
		FONT: fontFamily,
		BROWSER_TITLE: browserTitle,
		WALLPAPER: selectedBackground?.id ?? currentStoredWallpaper?.id,
	}
}
