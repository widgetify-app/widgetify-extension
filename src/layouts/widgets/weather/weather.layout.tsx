import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import type {
	FetchedForecast,
	FetchedWeather,
	WeatherSettings,
} from '@/layouts/widgets/weather/weather.interface'
import { WidgetContainer } from '../widget-container'
import { Forecast } from './forecast/forecast'
import { CurrentWeatherBox } from './current/current-box.weather'
import { useAuth } from '@/context/auth.context'
import { RequireAuth } from '@/components/auth/require-auth'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/getWeatherByLatLon'
import { useGetForecastWeatherByLatLon } from '@/services/hooks/weather/getForecastWeatherByLatLon'
import { Button } from '@/components/button/button'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import Analytics from '@/analytics'

export function WeatherLayout() {
	const { isAuthenticated, user } = useAuth()
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
		enabled: isAuthenticated && user?.city?.id != null,
	})

	const {
		data: forecastData,
		dataUpdatedAt: forecastDataUpdatedAt,
		refetch: refetchForecast,
	} = useGetForecastWeatherByLatLon({
		count: 6,
		units: weatherSettings?.temperatureUnit,
		enabled: isAuthenticated && user?.city?.id != null,
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

	useEffect(() => {
		if (isAuthenticated && user?.city?.id) {
			refetchWeather()
			refetchForecast()
		}
	}, [user?.city?.id, isAuthenticated, refetchWeather, refetchForecast])

	const onClickSetCity = () => {
		callEvent('openWidgetsSettings', {
			tab: WidgetTabKeys.weather_settings,
		})
		Analytics.event('weather_set_city_clicked')
	}

	if (!weatherSettings) return null

	return (
		<WidgetContainer>
			<RequireAuth mode="preview">
				{!user?.city?.id ? (
					<div className="flex flex-col items-center justify-center w-full h-full p-4 text-center rounded-2xl">
						<div className="mb-4 text-4xl">🌤️</div>
						<p className="mb-4 text-sm leading-relaxed text-muted">
							به‌دلیل تغییرات، لازم است شهر خود را دوباره در تنظیمات ویجت
							انتخاب کنید
						</p>
						<Button
							size="md"
							isPrimary={true}
							className="px-6 py-2 font-medium text-white transition-colors rounded-2xl"
							onClick={onClickSetCity}
						>
							تنظیم شهر
						</Button>
					</div>
				) : (
					<div className="flex flex-col w-full h-full gap-2 py-1">
						<CurrentWeatherBox
							enabledShowName={weatherSettings.enableShowName}
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
				)}
			</RequireAuth>
		</WidgetContainer>
	)
}
