import moment from 'jalali-moment'
import type { FetchedForecast } from '@/services/weather/weather.interface'
import type { TemperatureUnit } from '../types'
import { Temperature, WeatherIcon } from './weather-reading'

interface ForecastProps {
	forecast: FetchedForecast[]
	temperatureUnit: TemperatureUnit
	iconClassName: string
}

export function Forecast({ forecast, temperatureUnit, iconClassName }: ForecastProps) {
	if (!forecast.length) return null

	return (
		<ul
			aria-label="پیش‌بینی ساعتی"
			className="grid mt-auto text-center"
			style={{ gridTemplateColumns: `repeat(${forecast.length}, minmax(0, 1fr))` }}
		>
			{forecast.map((item) => {
				const at = moment(item.date).locale('fa')

				return (
					<li
						key={item.date}
						className="flex flex-col items-center min-w-0 gap-1"
					>
						<time
							dateTime={at.clone().locale('en').format()}
							className="font-semibold text-3xs text-fg-faint tabular-nums"
						>
							{at.format('HH:mm')}
						</time>
						<WeatherIcon src={item.icon} className={iconClassName} />
						<Temperature
							value={item.temp}
							unit={temperatureUnit}
							className="text-xs font-bold tracking-normal"
						/>
					</li>
				)
			})}
		</ul>
	)
}
