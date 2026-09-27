import { SelectCity } from '@/features/setting/general/components/select-city'
import { WidgetSettingWrapper } from '@/features/widgets/components/widget-settings-wrapper'

export function WeatherSetting() {
	return (
		<WidgetSettingWrapper>
			<SelectCity key="selectCity" />
		</WidgetSettingWrapper>
	)
}
