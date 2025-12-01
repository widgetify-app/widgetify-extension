import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { useGeneralSetting } from '@/context/general-setting.context'
import type {
	FetchedForecast,
	FetchedWeather,
	WeatherSettings,
} from '@/layouts/widgets/weather/weather.interface'
import { useGetForecastWeatherByLatLon } from '@/services/hooks/weather/getForecastWeatherByLatLon'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/getWeatherByLatLon'
import { WidgetContainer } from '../widget-container'
import { Forecast } from './forecast/forecast'
import { CurrentWeatherBox } from './current/current-box.weather'

export function WeatherLayout() {
	const { selectedCity } = useGeneralSetting()
	const [weatherSettings, setWeatherSettings] = useState<WeatherSettings | null>(null)
	const [weatherState, setWeather] = useState<FetchedWeather | null>(null)
	const [forecastWeather, setForecastWeather] = useState<FetchedForecast[] | null>(null)
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

	const { data: forecastData, dataUpdatedAt: forecastDataUpdatedAt } =
		useGetForecastWeatherByLatLon(selectedCity.lat, selectedCity.lon, {
			count: 6,
			units: weatherSettings?.temperatureUnit,
			enabled: !!weatherSettings,
			refetchInterval: 0,
		})

	useEffect(() => {
		async function load() {
			const [
				weatherSettingFromStorage,
				currentWeatherFromStorage,
				forecastWeatherFromStorage,
			] = await Promise.all([
				getFromStorage('weatherSettings'),
				getFromStorage('currentWeather'),
				getFromStorage('forecastWeather'),
			])

			if (currentWeatherFromStorage) {
				setWeather(currentWeatherFromStorage)
			}
			if (forecastWeatherFromStorage) {
				setForecastWeather(forecastWeatherFromStorage)
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

	useEffect(() => {
		if (forecastData) {
			setToStorage('forecastWeather', forecastData)
			setForecastWeather(forecastData)
		}
	}, [forecastDataUpdatedAt])

	if (selectedCity === null || !weatherSettings) return null

	return (
		<WidgetContainer>
			<div className="flex flex-col w-full h-full gap-2 py-1">
				<CurrentWeatherBox
					enabledShowName={weatherSettings.enableShowName}
					selectedCityName={selectedCity.name}
					fetchedWeather={weatherState?.weather || null}
					temperatureUnit={weatherSettings.temperatureUnit}
				/>

				<div className="flex justify-between gap-0.5 px-1  rounded-2xl bg-base-200/40">
					<Forecast
						temperatureUnit={weatherSettings.temperatureUnit}
						forecast={forecastWeather}
					/>
				</div>
			</div>
		</WidgetContainer>
	)
}
