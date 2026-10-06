import { WidgetHeader } from '@/features/widgets/components/widget-header'
import type { FetchedWeather } from '@/services/weather/weather.interface'
import { Forecast } from '../components/forecast'
import { Temperature, WeatherIcon } from '../components/weather-reading'
import type { TemperatureUnit } from '../types'
import { cleanCityName } from '../utils/clean-city-name'
import { getTemperatureRange } from '../utils/temperature-range'

const FORECAST_SLOTS = 4

interface Weather2x2Props {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: TemperatureUnit
}

export function Weather2x2({ fetchedWeather, temperatureUnit }: Weather2x2Props) {
	const weather = fetchedWeather?.weather
	const reading = weather?.temperature
	const range = getTemperatureRange(
		reading?.temp_max,
		reading?.temp_min,
		temperatureUnit
	)

	return (
		<section
			aria-label="آب و هوا"
			aria-busy={!fetchedWeather}
			className="flex flex-col w-full h-full min-h-0 gap-2 select-none"
		>
			<WidgetHeader
				title={cleanCityName(fetchedWeather?.city?.fa) || 'آب و هوا'}
				info={weather?.description?.text}
			/>

			<div className="flex items-center justify-between gap-2 px-1">
				<div className="flex flex-col min-w-0 gap-1">
					<Temperature
						value={reading?.temp}
						unit={temperatureUnit}
						className="text-[21cqh]"
					/>
					{range && (
						<span className="font-medium text-3xs text-fg-faint">
							{range.high} / {range.low}
						</span>
					)}
				</div>
				<WeatherIcon src={weather?.icon?.url} className="size-12" />
			</div>

			<Forecast
				forecast={fetchedWeather?.forecast?.slice(0, FORECAST_SLOTS) ?? []}
				temperatureUnit={temperatureUnit}
				iconClassName="size-4.5"
			/>
		</section>
	)
}
