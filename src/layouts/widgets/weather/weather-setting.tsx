import { useRef, useState, useEffect } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { SelectCity } from '@/layouts/setting/tabs/general/components/select-city'
import { WidgetSettingWrapper } from '@/layouts/widgets-settings/widget-settings-wrapper'
import type { WeatherSettings } from './weather.interface'

export function WeatherSetting() {
	const [setting, setSetting] = useState<WeatherSettings>({
		useAI: true,
		forecastCount: 4,
		temperatureUnit: 'metric',
		enableShowName: true,
	})
	const isInitialLoad = useRef(true)

	useEffect(() => {
		async function load() {
			const settingFromStorage = await getFromStorage('weatherSettings')
			if (settingFromStorage) {
				setSetting({ ...settingFromStorage })
			}

			isInitialLoad.current = false
		}
		load()
	}, [])

	useEffect(() => {
		if (isInitialLoad.current) return
		callEvent('weatherSettingsChanged', setting)
		setToStorage('weatherSettings', setting)
	}, [setting])

	return (
		<WidgetSettingWrapper>
			<SelectCity key={'selectCity'} />
		</WidgetSettingWrapper>
	)
}
