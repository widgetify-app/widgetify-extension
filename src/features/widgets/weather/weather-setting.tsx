import { SelectCity } from '@/components/select-city'
import { WidgetSettingWrapper } from '@/features/widgets/components/widget-settings-wrapper'

export function WeatherSetting() {
	return (
		<WidgetSettingWrapper>
			<SelectCity key="selectCity" />
		</WidgetSettingWrapper>
	)
}
