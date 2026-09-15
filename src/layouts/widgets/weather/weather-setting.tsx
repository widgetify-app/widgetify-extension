import { SelectCity } from '@/layouts/setting/tabs/general/components/select-city'
import { WidgetSettingWrapper } from '@/layouts/widgets-settings/widget-settings-wrapper'

export function WeatherSetting() {
	return (
		<WidgetSettingWrapper>
			<SelectCity key="selectCity" />
		</WidgetSettingWrapper>
	)
}
