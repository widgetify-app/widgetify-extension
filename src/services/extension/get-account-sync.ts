import type { Wallpaper } from '@/common/types/wallpaper.interface'
import type { Theme } from '@/context/theme.context'
import { getMainClient } from '@/services/api'
import type { UserInventoryItem } from '@/services/market/market.interface'

interface AccountSync {
	wallpaper: Wallpaper
	theme: Theme | null
	browserTitle: UserInventoryItem
	font: string | null
	ui: string | null
}

export async function getAccountSync(): Promise<AccountSync> {
	const response = await getMainClient().get<AccountSync>('/extension/@me/sync')
	return response.data
}
