import moment from 'jalali-moment'
import type React from 'react'
import type { FetchedWeather, TemperatureUnit } from '../weather.interface'
import { formatTemperature } from '../utils/format-temperature'

interface ForecastProps {
	forecast?: FetchedWeather['forecast'] | null
	temperatureUnit: TemperatureUnit
}

export const Forecast: React.FC<ForecastProps> = ({ forecast, temperatureUnit }) => {
	if (!forecast?.length) return null

	return (
		<ul className="flex justify-between w-full gap-0.5">
			{forecast.map((item) => {
				const at = moment(item.date).locale('fa')
				const temp = formatTemperature(item.temp, temperatureUnit)

				return (
					<li
						key={item.date}
						className="flex flex-col items-center justify-between w-16 gap-2 py-2 transition-ui border rounded-2xl bg-raised border-content hover:bg-raised"
					>
						<time
							dateTime={at.clone().locale('en').format()}
							className="text-[10px] font-medium text-muted"
						>
							{at.format('HH:mm')}
						</time>

						<img src={item.icon} className="w-9 h-9" alt="" />

						<span className="text-sm font-bold text-content">
							<data value={temp.value}>{temp.value}</data>
							<span className="text-[10px] font-medium text-muted">
								{temp.symbol}
							</span>
						</span>
					</li>
				)
			})}
		</ul>
	)
}
