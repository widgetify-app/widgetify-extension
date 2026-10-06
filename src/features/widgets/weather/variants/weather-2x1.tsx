import { Icon } from '@/icons'
import { WidgetHeader } from '@/features/widgets/components/widget-header'
import type { FetchedWeather } from '@/services/weather/weather.interface'
import { Temperature, WeatherIcon } from '../components/weather-reading'
import type { TemperatureUnit } from '../types'
import { cleanCityName } from '../utils/clean-city-name'
import { getWeatherMetrics } from '../utils/weather-metrics'

const ROW_METRICS = 2

interface WeatherCompactRowProps {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: TemperatureUnit
}

export function WeatherCompactRow({
	fetchedWeather,
	temperatureUnit,
}: WeatherCompactRowProps) {
	const weather = fetchedWeather?.weather

	return (
		<>
			<WidgetHeader
				title={cleanCityName(fetchedWeather?.city?.fa) || 'آب و هوا'}
				info={weather?.description?.text}
			/>
			<section
				aria-label="آب و هوا"
				aria-busy={!fetchedWeather}
				className="flex items-center flex-1 min-h-0 gap-2.5 px-1 select-none"
			>
				<WeatherIcon src={weather?.icon?.url} className="size-[50cqh]" />
				<Temperature
					value={weather?.temperature?.temp}
					unit={temperatureUnit}
					className="text-[42cqh]"
				/>
				{fetchedWeather && (
					<dl className="flex flex-col items-end gap-0.5 ms-auto min-w-0">
						{getWeatherMetrics(weather?.temperature)
							.slice(0, ROW_METRICS)
							.map((metric) => (
								<div
									key={metric.label}
									className="flex items-center gap-1.5 leading-tight text-2xs whitespace-nowrap"
								>
									<dt className="flex items-center gap-1 text-fg-faint">
										<Icon
											name={metric.icon}
											size={12}
											aria-hidden="true"
										/>
										{metric.label}
									</dt>
									<dd className="font-bold tabular-nums text-fg">
										{metric.value}
									</dd>
								</div>
							))}
					</dl>
				)}
			</section>
		</>
	)
}
