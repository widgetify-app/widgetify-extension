import Tooltip from '@/components/toolTip'
import {
	getBorderColor,
	getWidgetItemBackground,
	useTheme,
} from '@/context/theme.context'
import { useWeatherStore } from '@/context/weather.context'
import type { FetchedWeather } from '@/services/getMethodHooks/weather/weather.interface'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { BsRobot } from 'react-icons/bs'
import { FaSpotify } from 'react-icons/fa'
import { IoLocationOutline } from 'react-icons/io5'
import { WiHumidity, WiStrongWind } from 'react-icons/wi'
import { unitsFlag } from '../unitSymbols'

interface CurrentWeatherBoxProps {
	weather: FetchedWeather['weather']
}

export function CurrentWeatherBox({ weather }: CurrentWeatherBoxProps) {
	const { weatherSettings, selectedCity } = useWeatherStore()
	const { theme } = useTheme()

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
				return 'text-indigo-600 bg-indigo-100/80'
			case 'dark':
				return 'text-indigo-300 bg-indigo-800/40'
			default: // glass
				return 'text-indigo-300 bg-gray-800/30'
		}
	}

	const getSpotifyButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-green-600 bg-green-100/80 shadow-green-900/20 hover:shadow-green-900/30'
			default:
				return 'text-green-400 bg-green-900/40 shadow-green-900/20 hover:shadow-green-900/30'
		}
	}

	const getCityNameStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'
			case 'dark':
				return 'text-gray-400'
			default: // glass
				return 'text-gray-300'
		}
	}

	return (
		<LazyMotion features={domAnimation}>
			<m.div
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
				className={'col-span-2  flex-2 px-3'}
			>
				<div className="flex flex-row-reverse items-center justify-between gap-3">
					<m.div
						className="relative group"
						variants={fadeInUp}
						transition={{ type: 'spring', stiffness: 300 }}
					>
						<img
							src={weather.icon.url}
							alt={weather.temperature.temp_description || 'Current weather'}
							className="w-8 h-8 rounded-full drop-shadow-lg"
						/>
					</m.div>

					<div className="flex-1 mb-2 truncate">
						<m.span
							variants={fadeInUp}
							className={`text-2xl font-bold truncate text-transparent bg-clip-text bg-gradient-to-r ${getTemperatureGradient()}`}
							dir="ltr"
						>
							{Math.round(weather.temperature.temp)}
							<span className="ml-1 text-xl">
								{unitsFlag[weatherSettings.temperatureUnit || 'metric']}
							</span>
						</m.span>
						{selectedCity?.name && (
							<div
								className={`text-sm flex gap-1 font-medium truncate ${getCityNameStyle()}`}
							>
								<IoLocationOutline className="flex-shrink-0 text-xs" />
								<p className="text-xs font-medium truncate">{selectedCity.name}</p>
							</div>
						)}
					</div>
				</div>

				<m.div variants={fadeInUp} className="flex flex-wrap items-center gap-2">
					<div
						className={
							'py-0.5 flex items-center gap-1 text-sm font-medium rounded-full transition-all'
						}
					>
						<WiHumidity size={20} className="flex-shrink-0" />
						<span>{weather.temperature.humidity}%</span>
					</div>
					<div
						className={
							'px-2 py-0.5 flex items-center gap-1 text-sm font-medium rounded-full transition-all'
						}
					>
						<WiStrongWind size={20} className="flex-shrink-0" />
						<span>{weather.temperature.wind_speed} m/s</span>
					</div>

					{weather.ai?.playlist && (
						<Tooltip content="پلی‌لیست پیشنهادی اسپاتیفای">
							<m.a
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3 }}
								href={weather.ai.playlist}
								target="_blank"
								rel="noopener noreferrer"
								className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${getSpotifyButtonStyle()}`}
							>
								<FaSpotify className="text-lg" />
							</m.a>
						</Tooltip>
					)}
				</m.div>

				<m.div
					variants={fadeInUp}
					className={`relative mt-4 overflow-hidden transition-colors shadow-inner rounded-xl ${getBorderColor(theme)} border ${getWidgetItemBackground(theme)}`}
				>
					<div className="flex gap-3 overflow-y-auto min-h-24 max-h-24">
						<div className="flex-1">
							{weather.ai?.description && (
								<m.div
									className={`absolute flex items-center gap-1.5 left-3 top-1 p-1 rounded-md ${getAiIconStyle()}`}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.5 }}
								>
									<BsRobot className="text-xs" />
								</m.div>
							)}

							<div className="relative pl-8 pr-2">
								<p
									className={`py-2 text-xs font-light leading-relaxed transition-all duration-300 line-clamp-none ${getDescriptionTextStyle()}`}
								>
									{weather.ai?.description || weather.temperature.temp_description}
								</p>
							</div>
						</div>
					</div>
				</m.div>
			</m.div>
		</LazyMotion>
	)
}
