import { Icon } from '@/icons'
import { WidgetHeader } from '@/features/widgets/components/widget-header'
import type { FetchedWeather } from '@/services/weather/weather.interface'
import { Forecast } from '../components/forecast'
import { Temperature, WeatherIcon } from '../components/weather-reading'
import type { TemperatureUnit } from '../types'
import { cleanCityName } from '../utils/clean-city-name'
import { getTemperatureRange } from '../utils/temperature-range'
import { getWeatherMetrics } from '../utils/weather-metrics'
import { t } from '@/common/i18n'

const FORECAST_SLOTS = 5

interface Weather2x3Props {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: TemperatureUnit
	updatedLabel: string | null
}

export function Weather2x3({
	fetchedWeather,
	temperatureUnit,
	updatedLabel,
}: Weather2x3Props) {
	const weather = fetchedWeather?.weather
	const reading = weather?.temperature
	const range = getTemperatureRange(
		reading?.temp_max,
		reading?.temp_min,
		temperatureUnit
	)

	return (
		<section
			aria-label={t('widgets.weather.aria')}
			aria-busy={!fetchedWeather}
			className="flex flex-col w-full h-full min-h-0 gap-2 select-none"
		>
			<WidgetHeader
				title={
					cleanCityName(fetchedWeather?.city?.fa) || t('widgets.weather.title')
				}
				info={updatedLabel}
			/>

			<div className="flex items-center justify-between gap-2 px-1 pt-0.5">
				<div className="flex flex-col min-w-0 gap-1.5">
					<Temperature
						value={reading?.temp}
						unit={temperatureUnit}
						className="text-5xl"
					/>
					<span className="text-xs font-semibold truncate text-fg">
						{weather?.description?.text}
					</span>
					{range && (
						<span className="font-medium text-3xs text-fg-faint">
							{t('widgets.weather.highLow', {
								high: range.high,
								low: range.low,
							})}
						</span>
					)}
				</div>
				<WeatherIcon src={weather?.icon?.url} className="size-16" />
			</div>

			<dl className="grid grid-cols-3 px-1 py-2 rounded-xl bg-fill">
				{getWeatherMetrics(reading).map((metric) => (
					<div
						key={metric.label}
						className="flex flex-col-reverse items-center gap-px not-first:border-s border-line"
					>
						<dt className="flex items-center gap-0.5 text-3xs text-fg-faint">
							<Icon name={metric.icon} size={12} aria-hidden="true" />
							{metric.label}
						</dt>
						<dd className="text-xs font-bold tabular-nums text-fg-strong">
							{metric.value}
						</dd>
					</div>
				))}
			</dl>

			<Forecast
				forecast={fetchedWeather?.forecast?.slice(0, FORECAST_SLOTS) ?? []}
				temperatureUnit={temperatureUnit}
				iconClassName="size-5"
			/>
		</section>
	)
}
