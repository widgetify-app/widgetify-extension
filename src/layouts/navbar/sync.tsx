import { useEffect, useRef } from 'react'
import { getMultipleFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import type { StoredWallpaper, Wallpaper } from '@/common/wallpaper.interface'
import { useAuth } from '@/context/auth.context'
import type { Theme } from '@/context/theme.context'
import { getMainClient } from '@/services/api'
import type { UserInventoryItem } from '@/services/hooks/market/market.interface'

export function SyncAccount() {
	const { isAuthenticated } = useAuth()
	const initialSyncDoneRef = useRef(false)

	useEffect(() => {
		async function initialSync() {
			if (!isAuthenticated || initialSyncDoneRef.current) {
				return
			}

			initialSyncDoneRef.current = true

			setTimeout(async () => {
				await getAll()
			}, 1000)
		}

		initialSync()
	}, [isAuthenticated])
}

async function getAll() {
	try {
		const client = await getMainClient()
		const response = await client.get<{
			wallpaper: Wallpaper
			theme: Theme | null
			browserTitle: UserInventoryItem
			font: string | null
			ui: string | null
		}>('/extension/@me/sync')

		const { wallpaper, theme, browserTitle, font, ui } = response.data
		const store = await getMultipleFromStorage([
			'wallpaper',
			'theme',
			'browserTitle',
			'appearance',
		])

		await Promise.all([
			processWallpaper(wallpaper, store?.wallpaper),
			processBrowserTitle(browserTitle, store?.browserTitle),
		])

		processFont(font, store?.appearance)
		processTheme(theme, store?.theme as any)
		processUI(ui, store?.appearance)
	} catch {}
}

async function processWallpaper(
	wallpaper: Wallpaper,
	wallpaperStore: StoredWallpaper | undefined
) {
	try {
		if (!wallpaper) return
		if (
			(wallpaper && wallpaperStore?.id !== wallpaper?.id) ||
			wallpaper?.src !== wallpaperStore?.src
		) {
			if (wallpaperStore?.id === 'custom-wallpaper') {
				return
			}

			await setToStorage('wallpaper', {
				...wallpaper,
			})
			callEvent('wallpaper_change', wallpaper)
		}
	} catch {}
}

async function processBrowserTitle(
	browserTitle: UserInventoryItem | null,
	browserTitleStore: { id: string; template: string; name: string } | undefined
) {
	try {
		if (!browserTitle) return
		if (browserTitleStore) {
			if (
				browserTitleStore.id !== browserTitle.id ||
				browserTitleStore.template !== browserTitle.value ||
				browserTitleStore.name !== browserTitle.name
			) {
				document.title = browserTitle.value
				await setToStorage('browserTitle', {
					id: browserTitle.id,
					name: browserTitle.name || 'بدون نام',
					template: browserTitle.value,
				})
			}
		} else {
			document.title = browserTitle.value
			await setToStorage('browserTitle', {
				id: browserTitle.id,
				name: browserTitle.name || 'بدون نام',
				template: browserTitle.value,
			})
		}
	} catch {}
}

function processTheme(theme: string | null, themeStore: string | undefined) {
	try {
		if (!theme) return
		if (theme !== themeStore) {
			callEvent('theme_change', {
				theme,
				sync: true,
			})
		}
	} catch {}
}
function processFont(font: string | null, appearanceStore?: Record<string, any>) {
	try {
		if (!font) return
		const fontStore = appearanceStore?.fontFamily as string | undefined
		if (font !== fontStore) {
			callEvent('font_change', {
				font,
				sync: true,
			})
		}
	} catch {}
}
function processUI(ui: string | null, appearanceStore?: Record<string, any>) {
	try {
		if (!ui) return
		const uiStore = appearanceStore?.ui as string | undefined
		if (ui !== uiStore) {
			callEvent('ui_change', ui)
		}
	} catch {}
}
