import type { FetchedWeather } from '@/layouts/widgets/weather/weather.interface'
import { unitsFlag } from '../unit-symbols'
import { cleanCityName } from '../utils/clean-city-name'
import { Icon } from '@/src/icons'

interface WeatherCompactRowProps {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: keyof typeof unitsFlag
}

export function WeatherCompactRow({
	fetchedWeather,
	temperatureUnit,
}: WeatherCompactRowProps) {
	const temp = Math.round(fetchedWeather?.weather?.temperature?.temp || 0)
	const cityName = cleanCityName(fetchedWeather?.city?.fa || '')
	const iconUrl = fetchedWeather?.weather?.icon?.url
	const description = fetchedWeather?.weather?.description?.text || ''
	const humidity = fetchedWeather?.weather?.temperature?.humidity || 0
	const windSpeed = Math.round(
		fetchedWeather?.weather?.temperature?.wind_speed || 0
	)

	return (
		<div className="flex items-center justify-between h-full w-full px-3.5 py-2 select-none">
			<div className="flex items-center gap-3">
				{iconUrl ? (
					<img
						src={iconUrl}
						className="w-11 h-11 drop-shadow"
						alt={description}
					/>
				) : (
					<div className="w-11 h-11 rounded-full animate-pulse bg-base-300/50" />
				)}

				<div className="flex flex-col">
					<div className="flex items-baseline gap-1.5">
						<span className="text-2xl font-black text-content leading-none">
							{temp}
							<span className="text-xs font-medium text-base-content/80 mr-0.5">
								{unitsFlag[temperatureUnit || 'metric']}
							</span>
						</span>
						<span className="text-xs font-bold text-content">
							{cityName}
						</span>
					</div>
					<span className="text-[11px] text-base-content/70 font-medium mt-0.5 truncate max-w-36">
						{description}
					</span>
				</div>
			</div>

			<div className="flex flex-col items-end gap-1 text-[10px] text-base-content/70">
				<div className="flex items-center gap-1">
					<Icon name="wind" className="w-3 h-3 text-muted" />
					<span>{windSpeed} m/s</span>
				</div>
				<div className="flex items-center gap-1">
					<Icon name="humidity" className="w-3 h-3 text-muted" />
					<span>{humidity}%</span>
				</div>
			</div>
		</div>
	)
}
