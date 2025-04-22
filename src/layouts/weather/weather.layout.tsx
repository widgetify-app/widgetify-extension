import { getFromStorage, setToStorage } from '@/common/storage'
import { useWeatherStore } from '@/context/weather.context'
import { useGetForecastWeatherByLatLon } from '@/services/getMethodHooks/weather/getForecastWeatherByLatLon'
import { useGetWeatherByLatLon } from '@/services/getMethodHooks/weather/getWeatherByLatLon'
import type { FetchedWeather } from '@/services/getMethodHooks/weather/weather.interface'
import { useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FreeMode, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { CurrentWeatherBox } from './components/current-box.component'
import { ForecastComponent } from './components/forecast.component'
//@ts-ignore
import 'swiper/css'
//@ts-ignore
import 'swiper/css/pagination'
//@ts-ignore
import 'swiper/css/navigation'
import { useTheme } from '@/context/theme.context'

export function WeatherLayout() {
	const { selectedCity, weatherSettings } = useWeatherStore()
	const { theme, themeUtils } = useTheme()
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

	const getNavigationButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200/80 text-gray-700 hover:bg-gray-300/90 shadow-md'
			case 'dark':
				return 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/90 shadow-md'
			default: // glass
				return 'bg-black/30 text-white hover:bg-black/40 shadow-lg backdrop-blur-sm'
		}
	}

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
			<div
				className={`flex flex-col h-80 p-2 ${themeUtils.getCardBackground()} rounded-xl`}
			>
				{cityWeather ? <CurrentWeatherBox weather={cityWeather.weather} /> : null}

				<div className="relative flex-1 px-3 mt-2 overflow-hidden lg:pb-0">
					<Swiper
						modules={[Pagination, Navigation, FreeMode]}
						spaceBetween={8}
						slidesPerView="auto"
						freeMode={true}
						pagination={false}
						navigation={{
							nextEl: '.swiper-button-next-custom',
							prevEl: '.swiper-button-prev-custom',
						}}
						className="pt-2 weather-forecast-slider"
						dir="ltr"
					>
						{forecast?.map((item, index) => (
							<SwiperSlide key={`${item.date}-${index}`} className="w-auto">
								<ForecastComponent
									forecast={item}
									unit={weatherSettings.temperatureUnit}
								/>
							</SwiperSlide>
						))}

						<div
							className={`absolute left-0 z-10 flex items-center justify-center w-8 h-8 transition-all rounded-full cursor-pointer swiper-button-prev-custom top-[45%] ${getNavigationButtonStyle()}`}
						>
							<FiChevronLeft size={20} />
						</div>

						<div
							className={`absolute right-0 z-10 flex items-center justify-center w-8 h-8 transition-all rounded-full cursor-pointer swiper-button-next-custom top-[45%] ${getNavigationButtonStyle()}`}
						>
							<FiChevronRight size={20} />
						</div>
					</Swiper>
				</div>
			</div>

			<style>{`
  .weather-forecast-slider {
    padding-right: 12px !important;
    padding-bottom: 5px !important; 
  }
  .weather-forecast-slider .swiper-slide {
    width: auto;
    height: auto;
  }
  .swiper-button-prev-custom, .swiper-button-next-custom {
    opacity: 0;
    transform: translateY(-50%) scale(0.8);
    transition: all 0.2s ease;
  }
  .weather-forecast-slider:hover .swiper-button-prev-custom,
  .weather-forecast-slider:hover .swiper-button-next-custom {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
  .swiper-button-disabled {
    opacity: 0.3 !important;
    cursor: not-allowed;
  }
`}</style>
		</>
	)
}
