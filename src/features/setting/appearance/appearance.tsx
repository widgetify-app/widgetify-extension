import { useAuth } from '@/context/auth.context'
import { useGetUserInventory } from '@/services/hooks/market/get-user-inventory.hook'
import { BrowserTitleSelector } from './components/browser-title-selector'
import { FontSelector } from './components/font-selector'
import { ThemeSelector } from './components/theme-selector'

export function AppearanceSettingTab() {
	const { isAuthenticated } = useAuth()
	const { data } = useGetUserInventory(isAuthenticated)

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
