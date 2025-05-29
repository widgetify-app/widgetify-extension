import Tooltip from '@/components/toolTip'
import { useWeatherStore } from '@/context/weather.context'
import type { FetchedWeather } from '@/services/hooks/weather/weather.interface'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { BsRobot } from 'react-icons/bs'
import { FaSpotify } from 'react-icons/fa'
import { IoLocationSharp } from 'react-icons/io5'
import { WiHumidity, WiStrongWind } from 'react-icons/wi'
import { unitsFlag } from '../unitSymbols'

interface CurrentWeatherBoxProps {
	weather: FetchedWeather['weather']
}

export function CurrentWeatherBox({ weather }: CurrentWeatherBoxProps) {
	const { weatherSettings, selectedCity } = useWeatherStore()

	const getAiIconStyle = () => {
		return 'text-indigo-600 bg-indigo-100/80'
	}

	const getSpotifyButtonStyle = () => {
		return 'text-green-600 bg-green-100/80 shadow-green-900/20 hover:shadow-green-900/30'
	}

	const baseWeatherInfoClass =
		'flex items-center gap-1 text-sm font-medium rounded-full transition-all'

	return (
		<LazyMotion features={domAnimation}>
			<m.section
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
				className="col-span-2 px-3 flex-2 "
			>
				<header className="flex flex-row justify-between w-full">
					<div className="flex flex-wrap items-center">
						{weather.ai?.playlist && (
							<Tooltip content="پلی‌لیست پیشنهادی اسپاتیفای">
								<a
									href={weather.ai.playlist}
									target="_blank"
									rel="noopener noreferrer"
									className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${getSpotifyButtonStyle()}`}
								>
									<FaSpotify className="text-lg" />
								</a>
							</Tooltip>
						)}
					</div>

					<div className="flex flex-row gap-5 px-2 mb-2 truncate">
						<div className="flex flex-col">
							<span
								className={
									'text-2xl font-bold truncate text-left text-base-content transition-colors'
								}
								aria-label={`Temperature: ${Math.round(weather.temperature.temp)} degrees`}
							>
								{Math.round(weather.temperature.temp)}
								<span className="ml-1 text-xl font-medium">
									{unitsFlag[weatherSettings.temperatureUnit || 'metric']}
								</span>
							</span>
							{selectedCity?.name && (
								<div
									className={
										'text-sm flex items-center gap-1 transition-colors opacity-90 ltr:justify-center flex-row-reverse rtl:justify-end'
									}
									dir="auto"
								>
									<p className="text-xs font-light truncate" title={selectedCity.name}>
										{selectedCity.name}
									</p>
									<span className="h-[16px] opacity-60">
										<IoLocationSharp />
									</span>
								</div>
							)}
						</div>
						<div className="flex items-center">
							<img
								src={weather.icon.url}
								alt={weather.temperature.temp_description || 'Current weather'}
								className="w-8 h-8 rounded-full drop-shadow-lg "
								loading="lazy"
							/>
						</div>
					</div>
				</header>

				<div className="flex items-center justify-between mt-2">
					<div className={`${baseWeatherInfoClass} py-0.5`}>
						<WiHumidity size={20} className="flex-shrink-0" />
						<span
							aria-label={`Humidity: ${weather.temperature.humidity}%`}
							className="h-[18px]"
						>
							{weather.temperature.humidity}%
						</span>
					</div>
					<div className={`${baseWeatherInfoClass} px-2 py-0.5`}>
						<WiStrongWind size={20} className="flex-shrink-0" />
						<div
							className="flex flex-row-reverse items-center gap-1"
							aria-label={`Wind speed: ${weather.temperature.wind_speed} meters per second`}
						>
							{weather.temperature.wind_speed}
							<span className="text-[12px] leading-normal"> m/s </span>
						</div>
					</div>
				</div>

				<div
					className={
						'relative overflow-hidden transition-colors shadow-inner rounded-xl mt-2 border-base-200 border widget-item-background'
					}
				>
					<div className="flex gap-3 overflow-y-auto min-h-24 max-h-24">
						<div className="flex-1">
							{weather.ai?.description && (
								<m.div
									className={`absolute flex items-center gap-1.5 left-3 top-1 p-1 rounded-md ${getAiIconStyle()}`}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.5 }}
									aria-label="AI generated content"
								>
									<BsRobot className="text-xs" />
								</m.div>
							)}

							<div className="relative pl-8 pr-2">
								<p
									className={
										'py-2 text-xs font-light leading-relaxed transition-all duration-300 text-content'
									}
								>
									{weather.ai?.description || weather.temperature.temp_description}
								</p>
							</div>
						</div>
					</div>
				</div>
			</m.section>
		</LazyMotion>
	)
}
