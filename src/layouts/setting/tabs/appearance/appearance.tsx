import { useAppearanceSetting } from '@/context/appearance.context'
import { BrowserTitleSelector } from './components/browserTitle-selector'
import { ContentAlignmentSettings } from './components/content-alignment-settings'
import { FontSelector } from './components/font-selector'
import { ThemeSelector } from './components/theme-selector'
export function AppearanceSettingTab() {
	const { contentAlignment, setContentAlignment, fontFamily, setFontFamily } =
		useAppearanceSetting()

	return (
		<div className="w-full max-w-xl mx-auto" dir="rtl">
			<BrowserTitleSelector />
			<ThemeSelector />
			<ContentAlignmentSettings
				contentAlignment={contentAlignment}
				setContentAlignment={setContentAlignment}
			/>
			<FontSelector fontFamily={fontFamily} setFontFamily={setFontFamily} />
		</div>
	)
}
