import { SelectCity } from './components/select-city'
import { TimezoneSettings } from './components/timezone-settings'
import { VerticalTabsSettings } from './components/vertical-tabs-settings'

export function GeneralSettingTab() {
	return (
		<div className="w-full max-w-xl mx-auto">
			<VerticalTabsSettings key="verticalTabs" />
			<SelectCity key={'selectCity'} />
			<TimezoneSettings key="timezone" />
		</div>
	)
}
