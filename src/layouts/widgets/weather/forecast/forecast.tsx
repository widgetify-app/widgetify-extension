import type { FetchedWeather } from '@/layouts/widgets/weather/weather.interface'

import { unitsFlag } from '../unitSymbols'
import moment from 'jalali-moment'

interface WeatherLayoutProps {
	forecast?: FetchedWeather['forecast'] | null
	temperatureUnit: keyof typeof unitsFlag
}
export function Forecast({ forecast, temperatureUnit }: WeatherLayoutProps) {
	return (
		<>
			{forecast?.map((forecast) => {
				return (
					<div
						key={forecast.date}
						className="flex flex-col items-center justify-between w-16 gap-2 py-3 transition-all duration-200 border rounded-2xl bg-base-200/40 border-content hover:bg-base-100/50"
					>
						<span className="text-[10px] font-medium text-muted">
							{moment(forecast.date).locale('fa').format('HH:mm')}
						</span>

						<img src={forecast.icon} className="w-9 h-9" alt="weather icon" />

						<span className="text-sm font-bold text-base-content">
							{Math.round(forecast.temp)}
							<span className="text-[10px] font-medium text-muted">
								{unitsFlag[temperatureUnit || 'metric']}
							</span>
						</span>
					</div>
				)
			})}
		</>
	)
}
