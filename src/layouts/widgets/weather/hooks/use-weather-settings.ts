import { useEffect, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { DEFAULT_WEATHER_SETTINGS } from '../constants'
import type { WeatherSettings } from '../weather.interface'

export function useWeatherSettings() {
	const [settings, setSettings] = useState<WeatherSettings>({
		...DEFAULT_WEATHER_SETTINGS,
	})

	useEffect(() => {
		async function load() {
			const stored = await getFromStorage('weatherSettings')
			setSettings(stored || { ...DEFAULT_WEATHER_SETTINGS })
		}

		const unlisten = listenEvent('weatherSettingsChanged', setSettings)
		load()

		return unlisten
	}, [])

	return settings
}
