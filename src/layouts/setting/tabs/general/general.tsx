import { SelectCity } from './components/select-city'
import { TimezoneSettings } from './components/timezone-settings'
import { WidgetModeSettings } from './components/widget-mode-settings'

export function GeneralSettingTab() {
	return (
		<div className="w-full max-w-xl mx-auto">
			<WidgetModeSettings />
			<SelectCity key={'selectCity'} />
			<TimezoneSettings key="timezone" />
		</div>
	)
}
