import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { translateError } from '@/common/utils/translate-error'
import { useAppearanceSetting } from '@/context/appearance.context'
import { useAuth } from '@/context/auth.context'
import { useTheme } from '@/context/theme.context'
import { useWallpaperContext } from '@/context/wallpaper.context'
import { safeAwait } from '@/services/api'
import { useChangeBrowserTitle } from '@/services/extension/update-setting.hook'
import { useGetUserInventory } from '@/services/market/get-user-inventory.hook'
import type { UserInventoryResponse } from '@/services/market/market.interface'
import { APPEARANCE_INVENTORY_TYPES, DEFAULT_BROWSER_TITLE } from '../constants'
import type { StoreItem } from '../types'

export function useApplyItem(): (item: StoreItem) => Promise<boolean> {
	const { isAuthenticated } = useAuth()
	const { setTheme } = useTheme()
	const { setFontFamily } = useAppearanceSetting()
	const { handleSelectBackground } = useWallpaperContext()
	const { mutateAsync: changeBrowserTitle } = useChangeBrowserTitle()
	const { data: inventory, refetch: refetchInventory } = useGetUserInventory(
		isAuthenticated,
		{ type: APPEARANCE_INVENTORY_TYPES }
	)

	const browserTitleId = async (item: StoreItem): Promise<string> => {
		if (item.id === DEFAULT_BROWSER_TITLE.id) return item.id
		const known = ownedTitleId(inventory, item.value)
		if (known) return known
		const { data } = await refetchInventory()
		return ownedTitleId(data, item.value) ?? item.id
	}

	return async (item) => {
		switch (item.type) {
			case 'THEME':
				Analytics.event('theme_selected')
				setTheme(item.value)
				return true
			case 'FONT':
				setFontFamily(item.value)
				return true
			case 'BROWSER_TITLE': {
				Analytics.event('browser_title_selected')
				const id = isAuthenticated ? await browserTitleId(item) : item.id
				if (isAuthenticated) {
					const [error] = await safeAwait(
						changeBrowserTitle({ browserTitleId: id })
					)
					if (error) {
						showToast(translateError(error) as string, 'error')
						return false
					}
				}
				callEvent('browser_title_change', {
					id,
					name: item.name,
					template: item.value,
					sync: true,
				})
				return true
			}
			case 'WALLPAPER':
				return item.wallpaper ? handleSelectBackground(item.wallpaper) : false
			default:
				return false
		}
	}
}

function ownedTitleId(
	inventory: UserInventoryResponse | undefined,
	template: string
): string | undefined {
	return inventory?.browser_titles?.find((title) => title.value === template)?.id
}
