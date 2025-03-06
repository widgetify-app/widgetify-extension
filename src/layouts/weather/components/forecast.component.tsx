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
	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className="flex flex-col items-center justify-between w-24 h-32 p-2 transition-all duration-300 border shadow-md bg-gradient-to-b from-neutral-900/70 to-neutral-800/70 backdrop-blur-sm rounded-xl hover:shadow-lg hover:from-neutral-800/70 hover:to-neutral-700/70 border-white/5"
		>
			{/* Time Section */}
			<div className="flex flex-col items-center gap-0.5 w-full">
				<div className="text-xs font-semibold tracking-wide uppercase text-neutral-400">
					{new Date(forecast.date).toLocaleDateString('fa-IR', {
						weekday: 'short',
					})}
				</div>
				<div className="px-2 py-0.5 text-xs font-medium rounded-full text-neutral-300  w-full text-center">
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
						className="w-10 h-10 drop-shadow-weatherIcon"
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
				className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text drop-shadow-temperature"
			>
				{Math.round(forecast.temp)}
				<span className="text-lg font-medium">{unitsFlag[unit]}</span>
			</motion.div>
		</motion.div>
	)
}
