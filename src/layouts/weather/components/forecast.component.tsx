import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import { unitsFlag } from '../unitSymbols'

interface ForecastProps {
	forecast: {
		temp: number
		icon: string
		date: string
	}
	unit: keyof typeof unitsFlag
}

export function ForecastComponent({ forecast, unit }: ForecastProps) {
	const { theme } = useTheme()

	const getCardStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gradient-to-b from-gray-100 to-gray-200 border-gray-300/30 hover:shadow-lg hover:from-gray-100/90 hover:to-gray-300/80 shadow-sm'
			case 'dark':
				return 'bg-gradient-to-b from-neutral-900 to-neutral-800 border-white/5 hover:shadow-lg hover:from-neutral-800/70 hover:to-neutral-700/70 shadow-md'
			default: // glass
				return 'bg-gradient-to-b from-black/30 to-black/40 border-white/5 hover:shadow-lg hover:from-black/40 hover:to-black/50 shadow-md backdrop-blur-md'
		}
	}

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

	const getTimeStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700 bg-gray-200/50'
			case 'dark':
				return 'text-neutral-300'
			default: // glass
				return 'text-neutral-300'
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
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className={`flex flex-col items-center justify-between w-20 h-[5.8rem] p-2 transition-all duration-300 border shadow-md ${getCardStyle()} rounded-xl`}
		>
			{/* Time Section */}
			<div className="flex flex-col items-center gap-0.5 w-full">
				<div
					className={`text-[.55rem] font-semibold tracking-wide uppercase ${getWeekdayStyle()}`}
				>
					{new Date(forecast.date).toLocaleDateString('fa-IR', {
						weekday: 'short',
					})}
				</div>
				<div
					className={`px-2 py-0.5  text-[.65rem]  font-medium rounded-full ${getTimeStyle()} w-full text-center`}
				>
					{new Date(forecast.date).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
						hour12: false,
					})}
				</div>
			</div>

			{/* Weather Icon */}
			<div className="relative my-1 group">
				<motion.div
					initial={{ rotate: 0 }}
					whileHover={{ rotate: [0, -15, 15, 0] }}
					transition={{ duration: 0.6 }}
				>
					<motion.img
						src={forecast.icon}
						alt="weather status"
						className="w-4 h-4 drop-shadow-weatherIcon"
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.3 }}
					/>
				</motion.div>
				<div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl -z-10" />
			</div>

			{/* Temperature */}
			<motion.div
				initial={{ scale: 0.9 }}
				animate={{ scale: 1 }}
				className={`text-sm font-extrabold text-transparent bg-gradient-to-r ${getTemperatureStyle()} bg-clip-text drop-shadow-temperature`}
			>
				{Math.round(forecast.temp)}
				<span className="text-sm font-medium">{unitsFlag[unit]}</span>
			</motion.div>
		</motion.div>
	)
}
