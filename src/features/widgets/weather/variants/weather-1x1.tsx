import { WidgetCenteredHeader } from '@/features/widgets/components/widget-header'
import type { FetchedWeather } from '@/services/weather/weather.interface'
import { Temperature, WeatherIcon } from '../components/weather-reading'
import type { TemperatureUnit } from '../types'
import { cleanCityName } from '../utils/clean-city-name'
import { t } from '@/common/i18n'

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
				title={
					cleanCityName(fetchedWeather?.city?.fa) || t('widgets.weather.title')
				}
			/>
			<section
				aria-label={t('widgets.weather.aria')}
				aria-busy={!fetchedWeather}
				className="flex flex-col items-center justify-center flex-1 min-h-0 gap-0.5 select-none"
			>
				<span className="flex items-center gap-1">
					<WeatherIcon
						src={weather?.icon?.url}
						className="size-[min(34cqh,calc(100cqh-46px))]"
					/>
					<Temperature
						value={weather?.temperature?.temp}
						unit={temperatureUnit}
						className="text-[length:min(32cqh,calc(100cqh-46px))]"
					/>
				</span>
				<span className="max-w-full font-medium truncate shrink-0 text-3xs text-fg-muted">
					{weather?.description?.text}
				</span>
			</section>
		</>
	)
}
