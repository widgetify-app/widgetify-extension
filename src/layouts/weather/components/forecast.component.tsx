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
			className="flex flex-row items-center justify-around h-20 gap-2 p-3 transition-all duration-300 shadow-md bg-gradient-to-b bg-neutral-900/70 backdrop-blur-sm rounded-xl hover:shadow-lg"
		>
			{/* Time Section */}
			<div className="flex flex-col items-center gap-1">
				<div className="text-xs font-semibold tracking-wide uppercase text-neutral-400">
					{new Date(forecast.date).toLocaleDateString('fa-IR', {
						weekday: 'short',
					})}
				</div>
				<div className="px-3 py-1 text-sm font-medium rounded-full text-neutral-300 bg-neutral-700/30">
					{new Date(forecast.date).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
						hour12: false,
					})}
				</div>
			</div>

			{/* Weather Icon */}
			<div className="relative group">
				<motion.div
					initial={{ rotate: 0 }}
					whileHover={{ rotate: [0, -15, 15, 0] }}
					transition={{ duration: 0.6 }}
					className="p-2"
				>
					<motion.img
						src={forecast.icon}
						alt="weather status"
						className="w-14 h-14 drop-shadow-weatherIcon"
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
				className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text drop-shadow-temperature"
			>
				{Math.round(forecast.temp)}
				<span className="text-lg font-medium">{unitsFlag[unit]}</span>
			</motion.div>
		</motion.div>
	)
}
