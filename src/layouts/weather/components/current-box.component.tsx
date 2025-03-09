import { motion } from 'framer-motion'
import { BsRobot } from 'react-icons/bs'
import { WiHumidity, WiStrongWind } from 'react-icons/wi'
import { useWeatherStore } from '../../../context/weather.context'
import type { FetchedWeather } from '../../../services/getMethodHooks/weather/weather.interface'
import { unitsFlag } from '../unitSymbols'

interface CurrentWeatherBoxProps {
	weather: FetchedWeather['weather']
}

export function CurrentWeatherBox({ weather }: CurrentWeatherBoxProps) {
	const { weatherSettings } = useWeatherStore()

	const fadeInUp = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	}

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={{
				hidden: {},
				visible: {
					transition: {
						staggerChildren: 0.1,
					},
				},
			}}
			className="h-full col-span-2 p-5 shadow-lg bg-gradient-to-br from-neutral-900/80 to-neutral-800/70 backdrop-blur-sm rounded-xl"
		>
			<div className="flex flex-row-reverse items-start justify-between gap-4">
				<motion.div
					className="relative group"
					variants={fadeInUp}
					whileHover={{ scale: 1.1 }}
					transition={{ type: 'spring', stiffness: 300 }}
				>
					<img
						src={weather.icon.url}
						alt={weather.temperature.temp_description || 'Current weather'}
						width={weather.icon.width}
						height={weather.icon.height}
						className="drop-shadow-lg"
					/>
				</motion.div>

				<div className="flex-1">
					<motion.span
						variants={fadeInUp}
						className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 dark:from-white dark:to-gray-200"
						dir="ltr"
					>
						{Math.round(weather.temperature.temp)}
						<span className="ml-1 text-3xl">
							{unitsFlag[weatherSettings.temperatureUnit || 'metric']}
						</span>
					</motion.span>

					<motion.div
						variants={fadeInUp}
						className="flex flex-wrap items-center gap-2 mt-3"
					>
						<div className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-full dark:text-blue-200 dark:bg-blue-500/30 transition-all hover:shadow-md">
							<WiHumidity size={20} className="flex-shrink-0" />
							<span>{weather.temperature.humidity}%</span>
						</div>
						<div className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-green-600 bg-green-100 rounded-full dark:text-green-200 dark:bg-green-500/30 transition-all hover:shadow-md">
							<WiStrongWind size={20} className="flex-shrink-0" />
							<span>{weather.temperature.wind_speed} m/s</span>
						</div>
					</motion.div>
				</div>
			</div>

			<motion.div
				variants={fadeInUp}
				className="relative p-2 mt-5 overflow-hidden transition-colors shadow-inner rounded-xl bg-neutral-800/10 backdrop-blur-sm hover:bg-neutral-800/60"
			>
				<div className="flex gap-3 overflow-y-auto min-h-28 max-h-28">
					<div className="flex-1">
						{weather.ai?.description && (
							<motion.div
								className="absolute flex items-center gap-2 left-4 top-0 p-1.5"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5 }}
							>
								<BsRobot className="text-xl text-purple-600 dark:text-purple-400" />
							</motion.div>
						)}

						<div className="relative pl-8 pr-2">
							<p className="py-2 text-sm leading-relaxed text-gray-700 transition-all duration-300 dark:text-gray-300 line-clamp-none">
								{weather.ai?.description || weather.temperature.temp_description}
							</p>

							{weather.ai?.playlist && (
								<motion.a
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.7 }}
									href={weather.ai.playlist}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 mt-2 text-xs font-medium text-purple-600 transition-colors dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
								>
									<span className="p-1 bg-purple-100 rounded-full dark:bg-purple-900/30">
										🎵
									</span>
									<span>پلی‌لیست پیشنهادی</span>
								</motion.a>
							)}
						</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	)
}
