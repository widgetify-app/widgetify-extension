import type { FetchedWeather } from '@/layouts/widgets/weather/weather.interface'

import { unitsFlag } from '../unitSymbols'

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
						className="flex flex-row-reverse items-center justify-around px-1"
						key={forecast.date}
					>
						<div className="relative">
							<img
								src={forecast.icon}
								alt="weather status"
								className="w-8 h-8 drop-shadow-md"
							/>
							<div className="absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl -z-10" />
						</div>
						<div
							className={
								'mt-0.5 text-sm font-bold text-muted animate-in zoom-in-95 duration-300  w-14 text-center'
							}
						>
							{Math.round(forecast.temp)}
							<span className="text-xs font-medium">
								{unitsFlag[temperatureUnit]}
							</span>
						</div>
						<div>
							{new Date(forecast.date).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
								hour12: false,
							})}
						</div>
					</div>
				)
			})}
		</>
	)
}
