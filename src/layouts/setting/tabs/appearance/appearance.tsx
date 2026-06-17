import { useAuth } from '@/context/auth.context'
import { useGetUserInventory } from '@/services/hooks/market/getUserInventory.hook'
import { BrowserTitleSelector } from './components/browserTitle-selector'
import { FontSelector } from './components/font-selector'
import { ThemeSelector } from './components/theme-selector'
import { UISelector } from './components/ui-selector'
import { ContentAlignmentSettings } from './components/content-alignment-settings'
export function AppearanceSettingTab() {
	const { isAuthenticated } = useAuth()
	const { data } = useGetUserInventory(isAuthenticated)

	return (
		<div className="w-full max-w-xl mx-auto" dir="rtl">
			<UISelector />
			<ThemeSelector fetched_themes={data?.themes || []} />
			<FontSelector fetched_fonts={data?.fonts || []} />
			<BrowserTitleSelector
				fetched_browserTitles={data?.browser_titles || []}
				isAuthenticated={isAuthenticated}
			/>
			<ContentAlignmentSettings />
		</div>
	)
}
