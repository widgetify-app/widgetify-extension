import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { StoreKey } from '../../common/constant/store.key'
import { getFromStorage, setToStorage } from '../../common/storage'
import { useGetWeatherByLatLon } from '../../services/getMethodHooks/weather/getWeatherByLatLon'
import type { FetchedWeather } from '../../services/getMethodHooks/weather/weather.interface'

import { Colors } from '../../common/constant/colors.constant'
import { useWeatherStore } from '../../context/weather.context'
import { useGetForecastWeatherByLatLon } from '../../services/getMethodHooks/weather/getForecastWeatherByLatLon'
import { CurrentWeatherBox } from './components/current-box.component'
import { ForecastComponent } from './components/forecast.component'

export function WeatherLayout() {
	const { selectedCity, weatherSettings } = useWeatherStore()
	const [cityWeather, setCityWeather] = useState<FetchedWeather | null>(null)
	const [forecast, setForecast] = useState<FetchedWeather['forecast'] | null>([])
	const [isExpanded, setIsExpanded] = useState(false)
	const contentRef = useRef<HTMLDivElement>(null)

	// Track content height for animation
	const [contentHeight, setContentHeight] = useState(210)

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

	// Measure content height when content or expanded state changes
	useEffect(() => {
		if (contentRef.current && isExpanded) {
			setContentHeight(contentRef.current.scrollHeight)
		}
	}, [forecast, isExpanded])

	const visibleItems = isExpanded ? forecast : forecast?.slice(0, 4)
	const hasMoreItems = forecast && forecast.length > 4

	// Toggle with smooth animation
	const toggleExpand = () => {
		if (!isExpanded && contentRef.current) {
			// Before expanding, measure content height
			setContentHeight(contentRef.current.scrollHeight)
		}
		setIsExpanded((prev) => !prev)
	}

	return (
		<>
			<section className="rounded">
				<div className="flex flex-col gap-1">
					{cityWeather ? <CurrentWeatherBox weather={cityWeather.weather} /> : null}

					<motion.div
						ref={contentRef}
						className="relative overflow-hidden rounded-lg "
						animate={{
							height: isExpanded ? contentHeight : 210,
							opacity: 1,
						}}
						initial={{ opacity: 0.9 }}
						transition={{
							height: {
								duration: 0.5,
								ease: [0.04, 0.62, 0.23, 0.98], // Custom smooth easing
							},
							opacity: { duration: 0.3 },
						}}
					>
						<div className="grid grid-cols-2 grid-rows-2 gap-2 p-1 overflow-visible">
							<AnimatePresence>
								{visibleItems?.map((item, index) => (
									<motion.div
										key={`${item.date}-${index}`}
										initial={index >= 4 ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
										animate={{ opacity: 1, y: 0 }}
										exit={index >= 4 ? { opacity: 0, y: -10 } : {}}
										transition={{
											duration: 0.3,
											delay: index >= 4 ? index * 0.05 : 0,
										}}
									>
										<ForecastComponent
											forecast={item}
											unit={weatherSettings.temperatureUnit}
										/>
									</motion.div>
								))}
							</AnimatePresence>
						</div>

						{hasMoreItems && (
							<div
								className={`absolute bottom-0 left-0 right-0 flex items-center justify-center ${Colors.bgDiv}`}
							>
								<motion.button
									onClick={toggleExpand}
									className="flex items-center justify-center w-full py-1 transition-colors backdrop-blur-sm hover:bg-gray-700/80"
									whileTap={{ scale: 0.95 }}
								>
									<motion.div
										animate={{ rotate: isExpanded ? 180 : 0 }}
										transition={{
											duration: 0.5,
											delay: isExpanded ? 0 : 0.1,
											ease: 'anticipate',
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-5 h-5 text-blue-300"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</motion.div>
									<span className="sr-only">
										{isExpanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
									</span>
								</motion.button>
							</div>
						)}
					</motion.div>
				</div>
			</section>
		</>
	)
}
