import { useAuth } from '@/context/auth.context'
import { useGetUserInventory } from '@/services/hooks/market/getUserInventory.hook'
import { BrowserTitleSelector } from './components/browserTitle-selector'
import { ContentAlignmentSettings } from './components/content-alignment-settings'
import { FontSelector } from './components/font-selector'
import { ThemeSelector } from './components/theme-selector'
import { UISelector } from './components/ui-selector'
export function AppearanceSettingTab() {
	const { isAuthenticated } = useAuth()
	const { data } = useGetUserInventory(isAuthenticated)

	return (
		<div className="w-full max-w-xl mx-auto" dir="rtl">
			<UISelector />
			<BrowserTitleSelector
				fetched_browserTitles={data?.browser_titles || []}
				isAuthenticated={isAuthenticated}
			/>
			<ThemeSelector fetched_themes={data?.themes || []} />
			<ContentAlignmentSettings />
			<FontSelector fetched_fonts={data?.fonts || []} />
		</div>
	)
}
