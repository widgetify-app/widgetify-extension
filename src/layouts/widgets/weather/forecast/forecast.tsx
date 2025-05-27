import type { FetchedWeather } from '@/services/hooks/weather/weather.interface'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FreeMode, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
//@ts-ignore
import 'swiper/css'
//@ts-ignore
import 'swiper/css/pagination'
//@ts-ignore
import 'swiper/css/navigation'
import { useTheme } from '@/context/theme.context'
import type { unitsFlag } from '../unitSymbols'
import { ForecastItem } from './forecast.item'

interface WeatherLayoutProps {
	forecast: FetchedWeather['forecast'] | null
	temperatureUnit: keyof typeof unitsFlag
}
export function Forecast({ forecast, temperatureUnit }: WeatherLayoutProps) {
	const { theme } = useTheme()
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

	return (
		<>
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
						<ForecastItem forecast={item} unit={temperatureUnit} />
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
    display: none !important;
    cursor: not-allowed;
  }
`}</style>
		</>
	)
}
