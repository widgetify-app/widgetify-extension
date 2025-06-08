import { useGeneralSetting } from '@/context/general-setting.context'
import { PrivacySettings } from './components/privacy-settings'
import { SelectCity } from './components/select-city'
import { TimezoneSettings } from './components/timezone-settings'

export function GeneralSettingTab() {
	const { analyticsEnabled, setAnalyticsEnabled } = useGeneralSetting()

	return (
		<div className="w-full max-w-xl mx-auto">
			<SelectCity key={'selectCity'} />
			<TimezoneSettings key="timezone" />
			<PrivacySettings
				key="privacy"
				analyticsEnabled={analyticsEnabled}
				setAnalyticsEnabled={setAnalyticsEnabled}
			/>
		</div>
	)
}
