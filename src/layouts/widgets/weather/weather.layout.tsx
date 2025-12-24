import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import type {
	FetchedForecast,
	FetchedWeather,
	WeatherSettings,
} from '@/layouts/widgets/weather/weather.interface'
import { WidgetContainer } from '../widget-container'
import { Forecast } from './forecast/forecast'
import { CurrentWeatherBox } from './current/current-box.weather'
import { useAuth } from '@/context/auth.context'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/getWeatherByLatLon'
import { useGetForecastWeatherByLatLon } from '@/services/hooks/weather/getForecastWeatherByLatLon'

export function WeatherLayout() {
	const { user } = useAuth()
	const [weatherSettings, setWeatherSettings] = useState<WeatherSettings | null>(null)
	const [weatherState, setWeather] = useState<FetchedWeather | null>(null)
	const [forecastWeather, setForecastWeather] = useState<FetchedForecast[] | null>(null)
	const {
		data,
		dataUpdatedAt,
		refetch: refetchWeather,
	} = useGetWeatherByLatLon({
		refetchInterval: 0,
		units: weatherSettings?.temperatureUnit,
		useAI: weatherSettings?.useAI,
		lat: user?.city?.id ? undefined : 35.696111,
		lon: user?.city?.id ? undefined : 51.423056,
		enabled: true,
	})

	const {
		data: forecastData,
		dataUpdatedAt: forecastDataUpdatedAt,
		refetch: refetchForecast,
	} = useGetForecastWeatherByLatLon({
		count: 6,
		units: weatherSettings?.temperatureUnit,
		enabled: true,
		refetchInterval: 0,
		lat: user?.city?.id ? undefined : 35.696111,
		lon: user?.city?.id ? undefined : 51.423056,
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

	useEffect(() => {
		if (user?.city?.id) {
			refetchWeather()
			refetchForecast()
		}
	}, [user?.city?.id, refetchWeather, refetchForecast])

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
						forecast={forecastWeather}
					/>
				</div>
			</div>
		</WidgetContainer>
	)
}
