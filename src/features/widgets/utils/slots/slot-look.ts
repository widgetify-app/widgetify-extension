import { getMultipleFromStorage } from '@/common/storage'
import type { StoredWallpaper } from '@/common/types/wallpaper.interface'
import { callEvent } from '@/common/utils/call-event'
import { Theme } from '@/context/theme.context'
import type { SlotLook } from '../../types'

export async function readCurrentLook(liveFontFamily: string): Promise<SlotLook> {
	const { theme, appearance, browserTitle, wallpaper } = await getMultipleFromStorage([
		'theme',
		'appearance',
		'browserTitle',
		'wallpaper',
	])

	return {
		theme: theme || Theme.Light,
		fontFamily: appearance?.fontFamily || liveFontFamily,
		browserTitle: browserTitle
			? {
					id: browserTitle.id,
					name: browserTitle.name,
					template: browserTitle.template,
				}
			: { id: 'default', name: '', template: document.title },
		wallpaper: wallpaper ?? null,
	}
}

export function applyLook(
	changes: Partial<SlotLook>,
	applyWallpaper: (wallpaper: StoredWallpaper) => void
) {
	if (changes.theme) callEvent('theme_change', { theme: changes.theme, sync: true })
	if (changes.fontFamily) {
		callEvent('font_change', { font: changes.fontFamily, sync: true })
	}
	if (changes.browserTitle) {
		callEvent('browser_title_change', { ...changes.browserTitle, sync: true })
	}
	if (changes.wallpaper) applyWallpaper(changes.wallpaper)
}
