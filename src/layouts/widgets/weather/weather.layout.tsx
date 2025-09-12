import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { useGeneralSetting } from '@/context/general-setting.context'
import type {
	FetchedWeather,
	WeatherSettings,
} from '@/layouts/widgets/weather/weather.interface'
import { useGetForecastWeatherByLatLon } from '@/services/hooks/weather/getForecastWeatherByLatLon'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/getWeatherByLatLon'
import { WidgetContainer } from '../widget-container'
import { CurrentWeatherBox } from './current/current-box.weather'
import { Forecast } from './forecast/forecast'

export function WeatherLayout() {
	const { selectedCity } = useGeneralSetting()
	const [cityWeather, setCityWeather] = useState<FetchedWeather | null>(null)
	const [forecast, setForecast] = useState<FetchedWeather['forecast'] | null>([])
	const [weatherSettings, setWeatherSettings] = useState<WeatherSettings | null>(null)

	const { data, dataUpdatedAt } = useGetWeatherByLatLon(
		selectedCity.lat,
		selectedCity.lon,
		{
			refetchInterval: 0,
			units: weatherSettings?.temperatureUnit,
			useAI: weatherSettings?.useAI,
			enabled: !!weatherSettings,
		}
	)

	const { data: forecastData, dataUpdatedAt: forecastUpdatedAt } =
		useGetForecastWeatherByLatLon(selectedCity.lat, selectedCity.lon, {
			count: weatherSettings?.forecastCount,
			units: weatherSettings?.temperatureUnit,
			enabled: !!weatherSettings,
			refetchInterval: 0,
		})

	useEffect(() => {
		async function load() {
			const weatherSettingFromStorage = await getFromStorage('weatherSettings')
			if (weatherSettingFromStorage) {
				setWeatherSettings(weatherSettingFromStorage)
			} else {
				setWeatherSettings({
					useAI: true,
					forecastCount: 4,
					temperatureUnit: 'metric',
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
		if (forecastData) {
			setForecast([...forecastData])
			setToStorage('forecastWeather', forecastData)
		}
	}, [forecastUpdatedAt])

	useEffect(() => {
		if (data) {
			setCityWeather(data)
			setToStorage('currentWeather', data)
		}
	}, [dataUpdatedAt])

	if (selectedCity === null || !weatherSettings) return null

	return (
		<WidgetContainer>
			{cityWeather ? (
				<CurrentWeatherBox
					weather={cityWeather.weather}
					temperatureUnit={weatherSettings.temperatureUnit}
				/>
			) : null}

			{weatherSettings && (
				<div className="mt-2 overflow-hidden">
					<Forecast
						forecast={forecast}
						temperatureUnit={weatherSettings.temperatureUnit}
					/>
				</div>
			)}
		</WidgetContainer>
	)
}
