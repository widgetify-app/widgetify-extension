import ms from 'ms'
import { useContext, useEffect, useState } from 'react'
import { FaGears } from 'react-icons/fa6'
import { StoreKey } from '../../common/constant/store.key'
import { getFromStorage, setToStorage } from '../../common/storage'
import { storeContext } from '../../context/setting.context'
import { useGetWeatherByLatLon } from '../../services/getMethodHooks/weather/getWeatherByLatLon'
import type { FetchedWeather } from '../../services/getMethodHooks/weather/weather.interface'

import { useGetForecastWeatherByLatLon } from '../../services/getMethodHooks/weather/getForecastWeatherByLatLon'
import { CurrentWeatherBox } from './components/current-box.component'
import { ForecastComponent } from './components/forecast.component'
import { WeatherOptionsModal } from './components/options-modal.component'

export function WeatherLayout() {
	const { selectedCity } = useContext(storeContext)
	const [cityWeather, setCityWeather] = useState<FetchedWeather | null>(
		getFromStorage(StoreKey.CURRENT_WEATHER) || null,
	)

	const [forecast, setForecast] = useState<FetchedWeather['forecast'] | null>([])

	const { data, dataUpdatedAt } = useGetWeatherByLatLon(
		selectedCity.lat,
		selectedCity.lon,
		{
			refetchInterval: ms('10m'), // 10 minutes
		},
	)
	const { data: forecastData, dataUpdatedAt: forecastUpdatedAt } =
		useGetForecastWeatherByLatLon(selectedCity.lat, selectedCity.lon, {
			refetchInterval: ms('2m'),
		})

	const [showModal, setShowModal] = useState(false)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (forecastData) {
			setForecast([...forecastData])
		}
	}, [forecastUpdatedAt])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (data) {
			setCityWeather(data)
			setToStorage(StoreKey.CURRENT_WEATHER, data)
		}
	}, [dataUpdatedAt])

	return (
		<>
			<section className="rounded max-w-[30vw] w-[20vw]">
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
			<WeatherOptionsModal show={showModal} onClose={() => setShowModal(false)} />
		</>
	)
}
