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
	console.log(fetchedWeather?.weather?.icon?.url)
	const description = fetchedWeather?.weather?.description?.text || ''

	return (
		<div className="relative flex flex-col items-center justify-between h-full w-full p-2.5 text-center select-none">
			<span className="text-[11px] font-medium text-base-content/70 truncate max-w-full">
				{cityName}
			</span>

			<div className="flex flex-col items-center my-auto">
				<span className="text-2xl font-black text-content leading-none mt-1">
					{temp}
					<span className="text-xs font-medium text-base-content/80 mr-0.5">
						{unitsFlag[temperatureUnit || 'metric']}
					</span>
				</span>
			</div>

			<span className="text-[10px] font-medium text-primary truncate max-w-full">
				{description}
			</span>
		</div>
	)
}
