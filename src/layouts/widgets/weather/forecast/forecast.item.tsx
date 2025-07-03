import { unitsFlag } from '../unitSymbols'

interface ForecastProps {
	forecast: {
		temp: number
		icon: string
		date: string
		isDaily?: boolean
	}
	unit: keyof typeof unitsFlag
}

export function ForecastItem({ forecast, unit }: ForecastProps) {
	return (
		<div className="px-3 py-2 flex flex-col items-center justify-between transition-all duration-300 bg-base-300/80 rounded-xl animate-in fade-in-0">
			{/* Time Section */}
			<div className="flex items-center justify-center w-full">
				{forecast.isDaily ? (
					<div
						className={
							'text-[.6rem] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-md text-content text-center w-full transition-colors duration-300'
						}
					>
						{new Date(forecast.date).toLocaleDateString('fa-IR', {
							weekday: 'short',
						})}
					</div>
				) : (
					<div
						className={
							'text-xs font-semibold rounded-md text-muted opacity-80 w-full text-center transition-colors duration-300'
						}
					>
						{new Date(forecast.date).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
							hour12: false,
						})}
					</div>
				)}
			</div>

			{/* Weather Icon */}
			<div className="mt-0.5 relative group">
				<img
					src={forecast.icon}
					alt="weather status"
					className="w-8 h-8 drop-shadow-md"
				/>
				<div className="absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl -z-10" />
			</div>

			{/* Temperature */}
			<div
				className={
					'mt-0.5 text-sm font-semibold text-muted animate-in zoom-in-95 duration-300'
				}
			>
				{Math.round(forecast.temp)}
				<span className="text-xs font-medium">{unitsFlag[unit]}</span>
			</div>
		</div>
	)
}
