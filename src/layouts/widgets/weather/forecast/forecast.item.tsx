import {
	getBorderColor,
	getWidgetItemBackground,
	useTheme,
} from '@/context/theme.context'
import { LazyMotion, domAnimation, m } from 'framer-motion'
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
	const { theme } = useTheme()

	const getWeekdayStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'
			case 'dark':
				return 'text-neutral-400'
			default: // glass
				return 'text-neutral-400'
		}
	}

	const getTemperatureStyle = () => {
		switch (theme) {
			case 'light':
				return 'from-gray-700 to-gray-900'
			default:
				return 'from-gray-200 to-gray-400'
		}
	}

	return (
		<LazyMotion features={domAnimation}>
			<div
				className={`flex flex-col items-center justify-between w-12 h-[5.8rem] p-2 transition-all duration-300 ${getBorderColor(theme)} border ${getWidgetItemBackground(theme)}  rounded-2xl`}
			>
				{/* Time Section */}
				<div className="flex items-center justify-center w-full">
					{forecast.isDaily ? (
						<div
							className={`text-[.6rem] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-md ${getWeekdayStyle()} text-center w-full transition-colors duration-300`}
						>
							{new Date(forecast.date).toLocaleDateString('fa-IR', {
								weekday: 'short',
							})}
						</div>
					) : (
						<div
							className={`px-1.5 py-0.5 text-[.6rem] font-medium rounded-md ${getWeekdayStyle()} w-full text-center transition-colors duration-300`}
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
					<img src={forecast.icon} alt="weather status" className="w-4 h-4" />
					<div className="absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl -z-10" />
				</div>

				{/* Temperature */}
				<m.div
					initial={{ scale: 0.9 }}
					animate={{ scale: 1 }}
					className={`text-sm font-extrabold text-transparent bg-gradient-to-r ${getTemperatureStyle()} bg-clip-text drop-shadow-temperature`}
				>
					{Math.round(forecast.temp)}
					<span className="text-sm font-medium">{unitsFlag[unit]}</span>
				</m.div>
			</div>
		</LazyMotion>
	)
}
