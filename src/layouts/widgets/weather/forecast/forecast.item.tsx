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
		<div
			className={
				'flex flex-col items-center justify-between w-12 h-[5.8rem] p-2 transition-all duration-300 border border-content bg-content rounded-2xl hover:scale-105 hover:shadow-lg animate-in fade-in-0 zoom-in-95'
			}
		>
			{/* Time Section */}
			<div className="flex items-center justify-center w-full">
				{forecast.isDaily ? (
					<div
						className={
							'text-[.6rem] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-md text-content  text-center w-full transition-colors duration-300'
						}
					>
						{new Date(forecast.date).toLocaleDateString('fa-IR', {
							weekday: 'short',
						})}
					</div>
				) : (
					<div
						className={
							'px-1.5 py-0.5 text-[.6rem] font-medium rounded-md text-content  w-full text-center transition-colors duration-300'
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
			<div className="relative my-1 group">
				<img
					src={forecast.icon}
					alt="weather status"
					className="w-7 h-7 drop-shadow-md"
				/>
				<div className="absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl -z-10" />
			</div>

			{/* Temperature */}
			<div
				className={
					'text-sm font-extrabold text-transparent bg-gradient-to-r text-content opacity-90 bg-clip-text drop-shadow-temperature animate-in zoom-in-95 duration-300'
				}
			>
				{Math.round(forecast.temp)}
				<span className="text-sm font-medium">{unitsFlag[unit]}</span>
			</div>
		</div>
	)
}
