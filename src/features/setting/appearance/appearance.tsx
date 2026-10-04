import { useAuth } from '@/context/auth.context'
import { useGetUserInventory } from '@/services/market/get-user-inventory.hook'
import { MarketItemType } from '@/services/market/market.interface'
import { BrowserTitleSelector } from './components/browser-title-selector'
import { FontSelector } from './components/font-selector'
import { ThemeSelector } from './components/theme-selector'

const APPEARANCE_ITEM_TYPES = [
	MarketItemType.THEME,
	MarketItemType.FONT,
	MarketItemType.BROWSER_TITLE,
].join(',')

export function AppearanceSettingTab() {
	const { isAuthenticated } = useAuth()
	const { data } = useGetUserInventory(isAuthenticated, {
		type: APPEARANCE_ITEM_TYPES,
	})

	return (
		<div className="w-full max-w-xl mx-auto" dir="rtl">
			<ThemeSelector fetched_themes={data?.themes || []} />
			<FontSelector fetched_fonts={data?.fonts || []} />
			<BrowserTitleSelector
				fetched_browserTitles={data?.browser_titles || []}
				isAuthenticated={isAuthenticated}
			/>
		</div>
	)
}
