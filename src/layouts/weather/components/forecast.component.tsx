import { motion } from 'motion/react'
import type { FetchedForecast } from '../../../services/getMethodHooks/weather/weather.interface'

interface ForecastProps {
	forecast: FetchedForecast
}

export function ForecastComponent({ forecast }: ForecastProps) {
	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className="flex flex-col items-center justify-center h-40 gap-2 p-3 transition-all duration-300 shadow-md bg-gradient-to-b from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl hover:shadow-lg"
		>
			<div className="text-sm font-medium text-gray-400 dark:text-gray-500">
				{new Date(forecast.date).toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				})}
			</div>

			<div className="relative group">
				<motion.img
					src={forecast.icon}
					alt="forecast"
					className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
					initial={{ scale: 0.8 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.3 }}
				/>
				<div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-md -z-10" />
			</div>

			<div className="text-xl font-bold text-transparent bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-200 dark:to-gray-400 bg-clip-text">
				{Math.round(forecast.temp)}°C
			</div>
		</motion.div>
	)
}
