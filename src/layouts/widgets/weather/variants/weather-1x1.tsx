import type { FetchedWeather } from '@/layouts/widgets/weather/weather.interface'
import { unitsFlag } from '../unit-symbols'
import { cleanCityName } from '../utils/clean-city-name'

interface WeatherCompactSquareProps {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: keyof typeof unitsFlag
}

export function WeatherCompactSquare({
	fetchedWeather,
	temperatureUnit,
}: WeatherCompactSquareProps) {
	const temp = Math.round(fetchedWeather?.weather?.temperature?.temp || 0)
	const cityName = cleanCityName(fetchedWeather?.city?.fa || '')
	const description = fetchedWeather?.weather?.description?.text || ''
	const iconUrl = fetchedWeather?.weather?.icon?.url

	return (
		<div className="relative flex flex-col justify-between h-full w-full p-2.5 select-none overflow-hidden text-right">
			<div className="flex items-center justify-between gap-1 w-full">
				<span className="text-[11px] font-bold text-content truncate max-w-[55px]">
					{cityName || 'مکان شما'}
				</span>
				{iconUrl ? (
					<img
						src={iconUrl}
						className="w-7 h-7 object-contain drop-shadow-xs"
						alt={description}
					/>
				) : (
					<div className="w-6 h-6 rounded-full bg-base-content/10 animate-pulse" />
				)}
			</div>

			<div className="flex flex-col my-auto">
				<div className="flex items-baseline gap-0.5 leading-none">
					<span className="text-3xl font-black text-content tracking-tight">
						{temp}
					</span>
					<span className="text-xs font-bold text-muted">
						{unitsFlag[temperatureUnit || 'metric']}
					</span>
				</div>
			</div>

			<span className="text-[10px] font-medium text-muted truncate max-w-full leading-tight">
				{description || 'درحال دریافت...'}
			</span>
		</div>
	)
}
