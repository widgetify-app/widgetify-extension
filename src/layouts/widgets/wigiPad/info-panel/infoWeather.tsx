import { useGetWeatherByLatLon } from '@/services/hooks/weather/getWeatherByLatLon'
import { useAuth } from '@/context/auth.context'
import { TbWind } from 'react-icons/tb'
import { WiHumidity } from 'react-icons/wi'
import { unitsFlag } from '../../weather/unitSymbols'
import { Forecast } from '../../weather/forecast/forecast'
import { useGetForecastWeatherByLatLon } from '@/services/hooks/weather/getForecastWeatherByLatLon'
import moment from 'jalali-moment'

export function InfoWeather() {
	const { user } = useAuth()

	const { data: weather } = useGetWeatherByLatLon({
		units: 'metric',
		lat: user?.city?.id ? undefined : 35.696111,
		lon: user?.city?.id ? undefined : 51.423056,
		enabled: true,
		refetchInterval: 0,
	})

	const { data: forecastData } = useGetForecastWeatherByLatLon({
		count: 6,
		units: 'metric',
		enabled: true,
		refetchInterval: 0,
		lat: user?.city?.id ? undefined : 35.696111,
		lon: user?.city?.id ? undefined : 51.423056,
	})

	if (!weather) return <div className="h-24 animate-pulse bg-base-300/20 rounded-xl" />

	const hasBanner = !!weather.weather?.statusBanner

	return (
		<div className="flex flex-col w-full h-full ">
			<div className="relative flex flex-col justify-between overflow-hidden rounded-xl group">
				{hasBanner && (
					<div
						className="absolute inset-0 transition-transform duration-700 bg-center bg-cover group-hover:scale-105"
						style={{
							backgroundImage: `url(${weather.weather?.statusBanner})`,
							maskImage:
								'linear-gradient(-1deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 30%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0) 85%)',
							WebkitMaskImage:
								'linear-gradient(-1deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 30%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0) 85%)',
						}}
					></div>
				)}

				<div className="relative z-10 flex items-center justify-between p-1 px-2">
					<div className="flex flex-col">
						<span
							className={`text-[10px]  tracking-tight uppercase mb-0.5 ${
								hasBanner
									? "text-white/90 [html[data-theme='light']_&]:text-gray-400 drop-shadow-md"
									: 'text-base-content/60'
							}`}
						>
							{weather.city?.fa}
						</span>
						<div className="flex items-baseline gap-0.5">
							<span
								className={`text-3xl font-bold leading-none tracking-tighter ${
									hasBanner
										? 'text-white drop-shadow-lg'
										: 'text-base-content'
								}`}
							>
								{Math.round(weather.weather?.temperature?.temp || 0)}
							</span>
							<span
								className={`text-xs font-bold ${
									hasBanner ? 'text-white/70' : 'opacity-40'
								}`}
							>
								{unitsFlag['metric']}
							</span>
						</div>
					</div>

					{weather.weather?.icon?.url && (
						<img
							src={weather.weather.icon.url}
							className="w-12 h-12 transition-transform drop-shadow-xl group-hover:scale-110"
							alt="w"
						/>
					)}
				</div>

				<div
					className={`relative z-10 flex items-center justify-between gap-3 px-3 py-2`}
				>
					<div className="flex items-center gap-1.5">
						<TbWind
							className={
								hasBanner ? 'text-white/80' : 'text-base-content/50'
							}
							size={13}
						/>
						<span
							className={`text-[10px] font-bold ${
								hasBanner
									? 'text-white drop-shadow-sm'
									: 'text-base-content/80'
							}`}
						>
							{Math.round(weather.weather?.temperature?.wind_speed || 0)}
							<small className="ml-0.5 font-normal opacity-70">m/s</small>
						</span>
					</div>

					<div className="flex items-center gap-1.5 border-l border-current/10 pl-3">
						<WiHumidity
							className={
								hasBanner ? 'text-white/80' : 'text-base-content/50'
							}
							size={15}
						/>
						<span
							className={`text-[10px] font-bold ${
								hasBanner
									? 'text-white drop-shadow-sm'
									: 'text-base-content/80'
							}`}
						>
							{weather.weather?.temperature?.humidity}%
						</span>
					</div>

					<span
						className={`text-[10px] font-medium truncate flex-1 text-left ${
							hasBanner ? 'text-white/80' : 'text-base-content/60'
						}`}
					>
						{weather.weather?.description?.text}
					</span>
				</div>
			</div>

			<div className="flex flex-col h-48 gap-1 px-2 pb-2 overflow-y-auto scrollbar-none">
				{forecastData?.map((forecast) => (
					<div
						key={forecast.date}
						className="flex items-center justify-between p-1 transition-colors border border-transparent rounded-xl bg-base-200/20 hover:bg-base-200/40 hover:border-base-content/5"
					>
						<span className="w-12 text-xs font-bold">
							{moment(forecast.date).locale('fa').format('HH:mm')}
						</span>

						<div className="flex items-center justify-center flex-1 gap-3">
							<img src={forecast.icon} className="w-8 h-8" alt="icon" />
						</div>

						<div className="flex items-center justify-end w-12">
							<span className="text-sm font-black">
								{Math.round(forecast.temp)}°
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
