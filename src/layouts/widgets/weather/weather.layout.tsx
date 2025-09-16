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
import { CurrentWeatherBox } from './current/current-box.weather'
import { Forecast } from './forecast/forecast'
import { unitsFlag } from './unitSymbols'
export function WeatherLayout() {
	const { selectedCity } = useGeneralSetting()
	const [weatherSettings, setWeatherSettings] = useState<WeatherSettings | null>(null)
	const [selectedTab, setSelectedTab] = useState<'overview' | 'forecast'>('overview')
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
			count: weatherSettings?.forecastCount,
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
			<div className="flex flex-col w-full h-full gap-1">
				<div className="flex flex-row-reverse items-center w-full gap-3 px-4 py-2 border border-content rounded-2xl min-h-20">
					<img
						src={weatherState?.weather?.icon?.url}
						alt={weatherState?.weather?.description?.text}
						className="flex-shrink-0 w-12 h-12"
					/>

					<div className="flex flex-col justify-center  text-content min-w-[3.4rem] text-center truncate">
						{weatherSettings.enableShowName && (
							<span className="text-xs font-medium text-wrap">
								{selectedCity.name}
							</span>
						)}
					</div>

					<div className="flex flex-col justify-center truncate w-full max-w-[7rem]">
						<div className="flex items-baseline justify-center gap-0.5 text-xl font-bold truncate text-base-content">
							<span className="text-lg font-medium">
								{unitsFlag[weatherSettings.temperatureUnit || 'metric']}
							</span>
							{Math.round(weatherState?.weather?.temperature?.temp || 0)}
						</div>
						<p className="text-xs text-center truncate text-muted">
							{weatherState?.weather?.temperature?.temp_description}
						</p>
					</div>
				</div>
				<div className="flex flex-row items-center justify-around w-full p-0.5 gap-0.5 h-8 text-center border border-content rounded-2xl">
					{[
						{ label: 'نما', value: 'overview' },
						{ label: 'پیش‌بینی', value: 'forecast' },
					].map((tab) => (
						<div
							key={tab.value}
							className={`w-full p-1 text-sm font-medium text-center rounded-2xl transition-all ${
								selectedTab === tab.value
									? 'bg-content text-content'
									: 'cursor-pointer hover:bg-base-200 text-muted'
							}`}
							onClick={() => setSelectedTab(tab.value as any)}
						>
							{tab.label}
						</div>
					))}
				</div>
				<div
					className={`w-full h-full transition-border ${selectedTab === 'forecast' && 'border rounded-2xl border-content'}`}
				>
					{selectedTab === 'overview' ? (
						<CurrentWeatherBox weather={weatherState?.weather} />
					) : (
						<div
							className="flex flex-col py-1 overflow-y-auto max-h-40"
							style={{
								scrollbarWidth: 'none',
							}}
						>
							<Forecast
								forecast={forecastWeather || []}
								temperatureUnit={weatherSettings.temperatureUnit}
							/>
						</div>
					)}
				</div>
			</div>
		</WidgetContainer>
	)
}
