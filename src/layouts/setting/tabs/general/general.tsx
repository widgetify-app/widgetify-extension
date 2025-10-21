import { SelectCity } from './components/select-city'
import { TimezoneSettings } from './components/timezone-settings'

export function GeneralSettingTab() {
	return (
		<div className="w-full max-w-xl mx-auto">
			<SelectCity key={'selectCity'} />
			<TimezoneSettings key="timezone" />
		</div>
	)
}
