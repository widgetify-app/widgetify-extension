import { useEffect, useState } from 'react'
import { StoreKey } from '../../common/constant/store.key'
import { getFromStorage, setToStorage } from '../../common/storage'
import { useGetWeatherByLatLon } from '../../services/getMethodHooks/weather/getWeatherByLatLon'
import type { FetchedWeather } from '../../services/getMethodHooks/weather/weather.interface'

import { useWeatherStore } from '../../context/weather.context'
import { useGetForecastWeatherByLatLon } from '../../services/getMethodHooks/weather/getForecastWeatherByLatLon'
import { CurrentWeatherBox } from './components/current-box.component'
import { ForecastComponent } from './components/forecast.component'

export function WeatherLayout() {
	const { selectedCity } = useWeatherStore()
	const [cityWeather, setCityWeather] = useState<FetchedWeather | null>(null)

	const [forecast, setForecast] = useState<FetchedWeather['forecast'] | null>([])

	const { data, dataUpdatedAt } = useGetWeatherByLatLon(
		selectedCity.lat,
		selectedCity.lon,
		{
			refetchInterval: 0,
		},
	)
	const { data: forecastData, dataUpdatedAt: forecastUpdatedAt } =
		useGetForecastWeatherByLatLon(selectedCity.lat, selectedCity.lon, {
			refetchInterval: 0,
		})

	useEffect(() => {
		async function load() {
			const data = await getFromStorage<FetchedWeather>(StoreKey.CURRENT_WEATHER)
			if (data) {
				setCityWeather(data)
			}
		}

		load()
	}, [])

	useEffect(() => {
		if (forecastData) {
			setForecast([...forecastData])
		}
	}, [forecastUpdatedAt])

	useEffect(() => {
		if (data) {
			setCityWeather(data)
			setToStorage(StoreKey.CURRENT_WEATHER, data)
		}
	}, [dataUpdatedAt])

	return (
		<>
			<section className="rounded">
				<div className="flex flex-col gap-1">
					{cityWeather ? <CurrentWeatherBox weather={cityWeather.weather} /> : null}
					<div className="grid grid-cols-2 grid-rows-2 gap-2 p-1 overflow-scroll overflow-y-auto overflow-x-clip scroll-smooth">
						{forecast?.length
							? forecast.map((item) => (
									<ForecastComponent forecast={item} key={item.temp} />
								))
							: null}
					</div>
				</div>
			</section>
		</>
	)
}
