import type { FetchedWeather } from '@/layouts/widgets/weather/weather.interface'
import { unitsFlag } from '../unit-symbols'
import { cleanCityName } from '../utils/clean-city-name'
import { Icon } from '@/src/icons'

interface WeatherWideBannerProps {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: keyof typeof unitsFlag
}

export function WeatherWideBanner({
	fetchedWeather,
	temperatureUnit,
}: WeatherWideBannerProps) {
	const temp = Math.round(fetchedWeather?.weather?.temperature?.temp || 0)
	const cityName = cleanCityName(fetchedWeather?.city?.fa || '')
	const iconUrl = fetchedWeather?.weather?.icon?.url
	const description = fetchedWeather?.weather?.description?.text || ''
	const tempDescription = fetchedWeather?.weather?.temperature?.temp_description || ''
	const humidity = fetchedWeather?.weather?.temperature?.humidity || 0
	const windSpeed = Math.round(fetchedWeather?.weather?.temperature?.wind_speed || 0)
	const clouds = fetchedWeather?.weather?.temperature?.clouds || 0

	return (
		<div className="flex items-center justify-between h-full w-full px-4 py-2 select-none">
			<div className="flex items-center gap-3.5">
				{iconUrl ? (
					<img
						src={iconUrl}
						className="w-12 h-12 drop-shadow"
						alt={description}
					/>
				) : (
					<div className="w-12 h-12 rounded-full animate-pulse bg-base-300/50" />
				)}

				<div className="flex items-baseline gap-2">
					<span className="text-3xl font-black text-content leading-none">
						{temp}
						<span className="text-sm font-medium text-base-content/80 mr-0.5">
							{unitsFlag[temperatureUnit || 'metric']}
						</span>
					</span>
					<span className="text-sm font-bold text-content">{cityName}</span>
				</div>

				<div className="hidden sm:flex flex-col text-xs text-base-content/70">
					<span className="font-medium text-primary">{description}</span>
					{tempDescription && (
						<span className="text-[10px] text-base-content/60">
							{tempDescription}
						</span>
					)}
				</div>
			</div>

			<div className="flex items-center gap-3 text-xs text-base-content/70">
				<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-base-200/50 border border-base-content/10">
					<Icon name="wind" className="w-3.5 h-3.5 text-muted" />
					<span className="text-xs">{windSpeed} m/s</span>
				</div>

				<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-base-200/50 border border-base-content/10">
					<Icon name="humidity" className="w-3.5 h-3.5 text-muted" />
					<span className="text-xs">{humidity}%</span>
				</div>

				<div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-base-200/50 border border-base-content/10">
					<Icon name="cloudy" className="w-3.5 h-3.5 text-muted" />
					<span className="text-xs">{clouds}%</span>
				</div>
			</div>
		</div>
	)
}
