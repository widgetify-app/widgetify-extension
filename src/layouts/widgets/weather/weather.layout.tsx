import { getFromStorage, setToStorage } from '@/common/storage'
import { useWeatherStore } from '@/context/weather.context'
import { useGetForecastWeatherByLatLon } from '@/services/hooks/weather/getForecastWeatherByLatLon'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/getWeatherByLatLon'
import type { FetchedWeather } from '@/services/hooks/weather/weather.interface'
import { useEffect, useState } from 'react'
import { WidgetContainer } from '../widget-container'
import { CurrentWeatherBox } from './current/current-box.weather'
import { Forecast } from './forecast/forecast'

export function WeatherLayout() {
	const { selectedCity, weatherSettings } = useWeatherStore()
	const [cityWeather, setCityWeather] = useState<FetchedWeather | null>(null)
	const [forecast, setForecast] = useState<FetchedWeather['forecast'] | null>([])

	if (selectedCity === null) return null

	const { data, dataUpdatedAt } = useGetWeatherByLatLon(
		selectedCity.lat,
		selectedCity.lon,
		{
			refetchInterval: 0,
			units: weatherSettings.temperatureUnit,
			useAI: weatherSettings.useAI,
		},
	)

	const { data: forecastData, dataUpdatedAt: forecastUpdatedAt } =
		useGetForecastWeatherByLatLon(selectedCity.lat, selectedCity.lon, {
			count: weatherSettings.forecastCount,
			units: weatherSettings.temperatureUnit,
			refetchInterval: 0,
		})

	useEffect(() => {
		async function load() {
			const data = await getFromStorage('currentWeather')
			if (data) {
				setCityWeather(data)
			}
			const forecast = await getFromStorage('forecastWeather')
			if (forecast) {
				setForecast(forecast)
			}
		}

		load()
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

	return (
		<>
			<WidgetContainer>
				{cityWeather ? <CurrentWeatherBox weather={cityWeather.weather} /> : null}

				<div className="relative flex-1 px-3 overflow-hidden lg:pb-0">
					<Forecast
						forecast={forecast}
						temperatureUnit={weatherSettings.temperatureUnit}
					/>
				</div>
			</WidgetContainer>
		</>
	)
}
