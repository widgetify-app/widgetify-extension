import { motion } from 'framer-motion'
import { BsRobot } from 'react-icons/bs'
import { WiHumidity, WiStrongWind } from 'react-icons/wi'
import { useTheme } from '../../../context/theme.context'
import { useWeatherStore } from '../../../context/weather.context'
import type { FetchedWeather } from '../../../services/getMethodHooks/weather/weather.interface'
import { unitsFlag } from '../unitSymbols'

interface CurrentWeatherBoxProps {
	weather: FetchedWeather['weather']
}

export function CurrentWeatherBox({ weather }: CurrentWeatherBoxProps) {
	const { weatherSettings } = useWeatherStore()
	const { theme, themeUtils } = useTheme()

	const fadeInUp = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	}

	const getTemperatureGradient = () => {
		switch (theme) {
			case 'light':
				return 'from-gray-700 to-gray-900'
			default:
				return 'from-gray-100 to-gray-300'
		}
	}

	const getHumidityPillStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-blue-700 bg-blue-100/80 hover:bg-blue-100'
			case 'dark':
				return 'text-blue-200 bg-blue-500/30 hover:bg-blue-500/40'
			default: // glass
				return 'text-blue-100 bg-blue-500/20 hover:bg-blue-500/30'
		}
	}

	const getWindPillStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-green-700 bg-green-100/80 hover:bg-green-100'
			case 'dark':
				return 'text-green-200 bg-green-500/30 hover:bg-green-500/40'
			default: // glass
				return 'text-green-100 bg-green-500/20 hover:bg-green-500/30'
		}
	}

	const getDescriptionBoxStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/70 hover:bg-gray-200/80'
			case 'dark':
				return 'bg-neutral-800/10 hover:bg-neutral-800/60'
			default: // glass
				return 'bg-white/5 hover:bg-white/10'
		}
	}

	const getDescriptionTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			case 'dark':
				return 'text-gray-300'
			default: // glass
				return 'text-gray-200'
		}
	}

	const getAiIconStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-purple-600'
			default:
				return 'text-purple-400'
		}
	}

	const getPlaylistLinkStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-purple-600 hover:text-purple-800 bg-purple-100'
			default:
				return 'text-purple-400 hover:text-purple-300 bg-purple-900/30'
		}
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
			className={`h-full col-span-2 p-5 shadow-lg bg-gradient-to-br ${themeUtils.getCardBackground()} backdrop-blur-sm rounded-xl`}
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
						className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${getTemperatureGradient()}`}
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
						<div
							className={`px-3 py-1.5 flex items-center gap-2 text-sm font-medium rounded-full transition-all hover:shadow-md ${getHumidityPillStyle()}`}
						>
							<WiHumidity size={20} className="flex-shrink-0" />
							<span>{weather.temperature.humidity}%</span>
						</div>
						<div
							className={`px-3 py-1.5 flex items-center gap-2 text-sm font-medium rounded-full transition-all hover:shadow-md ${getWindPillStyle()}`}
						>
							<WiStrongWind size={20} className="flex-shrink-0" />
							<span>{weather.temperature.wind_speed} m/s</span>
						</div>
					</motion.div>
				</div>
			</div>

			<motion.div
				variants={fadeInUp}
				className={`relative p-2 mt-5 overflow-hidden transition-colors shadow-inner rounded-xl backdrop-blur-sm ${getDescriptionBoxStyle()}`}
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
								<BsRobot className={`text-xl ${getAiIconStyle()}`} />
							</motion.div>
						)}

						<div className="relative pl-8 pr-2">
							<p
								className={`py-2 text-sm leading-relaxed transition-all duration-300 line-clamp-none ${getDescriptionTextStyle()}`}
							>
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
									className={`inline-flex items-center gap-2 mt-2 text-xs font-medium transition-colors ${getPlaylistLinkStyle()}`}
								>
									<span className="p-1 rounded-full">🎵</span>
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
