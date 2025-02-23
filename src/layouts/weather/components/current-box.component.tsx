import { motion } from 'motion/react'
import { BsRobot } from 'react-icons/bs'
import type { FetchedWeather } from '../../../services/getMethodHooks/weather/weather.interface'

interface CurrentWeatherBoxProps {
	weather: FetchedWeather['weather']
}
export function CurrentWeatherBox({ weather }: CurrentWeatherBoxProps) {
	return (
		<div className="h-full col-span-2 p-5 shadow-lg bg-neutral-900/70 backdrop-blur-sm rounded-xl">
			<div className="flex items-start justify-between gap-4">
				<div className="relative group">
					<motion.img
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						src={weather.icon.url}
						alt="weather"
						width={weather.icon.width}
						height={weather.icon.height}
						className="transition-transform duration-300 group-hover:scale-110"
					/>
				</div>

				<div className="flex-1 text-right">
					<span className="text-4xl font-bold text-gray-800 dark:text-white">
						{Math.round(weather.temperature.temp)}°C
					</span>

					<p className="mt-1 text-sm text-gray-600 dark:text-gray-300"></p>

					<div className="flex items-center justify-end gap-3 mt-2">
						<div className="px-2 py-1 text-sm text-blue-600 bg-blue-100 rounded-lg dark:text-blue-300 dark:bg-blue-500/20">
							🌡️ {weather.temperature.humidity}%
						</div>
						<div className="px-2 py-1 text-sm text-green-600 bg-green-100 rounded-lg dark:text-green-300 dark:bg-green-500/20">
							🍃 {weather.temperature.wind_speed} m/s
						</div>
					</div>
				</div>
			</div>

			<div className="relative p-3 mt-4 rounded-lg bg-gray-100/80 dark:bg-neutral-800/50">
				<div className="flex items-center gap-3">
					<div className="flex-1">
						{weather.ai?.description && (
							<div className="absolute left-3 top-3">
								<BsRobot size={20} className="text-purple-600 dark:text-purple-400" />
							</div>
						)}
						<p className="pl-8 pr-2 text-sm font-light leading-relaxed text-gray-700 dark:text-gray-300">
							{weather.ai?.description || weather.temperature.temp_description}
						</p>
						{weather.ai?.playlist && (
							<a
								href={weather.ai.playlist}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 mt-2 text-xs text-purple-600 dark:text-purple-400 hover:underline"
							>
								<span>🎵</span>
								<span>پلی‌لیست پیشنهادی</span>
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
