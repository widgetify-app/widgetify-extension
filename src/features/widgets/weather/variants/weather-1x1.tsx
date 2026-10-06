import { WidgetCenteredHeader } from '@/features/widgets/components/widget-header'
import type { FetchedWeather } from '@/services/weather/weather.interface'
import { Temperature, WeatherIcon } from '../components/weather-reading'
import type { TemperatureUnit } from '../types'
import { cleanCityName } from '../utils/clean-city-name'

interface WeatherCompactSquareProps {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: TemperatureUnit
}

export function WeatherCompactSquare({
	fetchedWeather,
	temperatureUnit,
}: WeatherCompactSquareProps) {
	const weather = fetchedWeather?.weather

	return (
		<>
			<WidgetCenteredHeader
				title={cleanCityName(fetchedWeather?.city?.fa) || 'آب و هوا'}
			/>
			<section
				aria-label="آب و هوا"
				aria-busy={!fetchedWeather}
				className="flex flex-col items-center justify-center flex-1 min-h-0 gap-0.5 select-none"
			>
				<span className="flex items-center gap-1">
					<WeatherIcon src={weather?.icon?.url} className="size-[34cqh]" />
					<Temperature
						value={weather?.temperature?.temp}
						unit={temperatureUnit}
						className="text-[32cqh]"
					/>
				</span>
				<span className="max-w-full font-medium leading-tight truncate text-3xs text-fg-muted">
					{weather?.description?.text}
				</span>
			</section>
		</>
	)
}
