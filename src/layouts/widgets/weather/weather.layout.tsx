import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type {
	FetchedWeather,
	WeatherSettings,
} from '@/layouts/widgets/weather/weather.interface'
import { WidgetContainer } from '../widget-container'
import { Forecast } from './forecast/forecast'
import { CurrentWeatherBox } from './current/current-box.weather'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/getWeatherByLatLon'

export function WeatherLayout() {
	const [weatherSettings, setWeatherSettings] = useState<WeatherSettings | null>(null)
	const [weatherState, setWeather] = useState<FetchedWeather | null>(null)
	const { data, dataUpdatedAt } = useGetWeatherByLatLon()

	useEffect(() => {
		async function load() {
			const [weatherSettingFromStorage, currentWeatherFromStorage] =
				await Promise.all([
					getFromStorage('weatherSettings'),
					getFromStorage('currentWeather'),
				])

			if (currentWeatherFromStorage) {
				setWeather(currentWeatherFromStorage)
			}

			if (weatherSettingFromStorage) {
				setWeatherSettings(weatherSettingFromStorage)
			} else {
				setWeatherSettings({
					useAI: true,
					forecastCount: 4,
					temperatureUnit: 'metric',
					enableShowName: true,
				})
			}
		}

		const event = listenEvent('weatherSettingsChanged', (data) => {
			setWeatherSettings(data)
		})

		load()

		return () => {
			event()
		}
	}, [])

	useEffect(() => {
		if (data) {
			setToStorage('currentWeather', data)
			setWeather(data)
		}
	}, [data, dataUpdatedAt])

	if (!weatherSettings) return null

	return (
		<WidgetContainer>
			<div className="flex flex-col w-full h-full gap-2 py-1">
				<CurrentWeatherBox
					fetchedWeather={weatherState || null}
					temperatureUnit={weatherSettings.temperatureUnit}
				/>

				<div className="flex justify-between gap-0.5 px-1  rounded-2xl bg-base-200/40">
					<Forecast
						temperatureUnit={weatherSettings.temperatureUnit}
						forecast={weatherState?.forecast || []}
					/>
				</div>
			</div>
		</WidgetContainer>
	)
}
