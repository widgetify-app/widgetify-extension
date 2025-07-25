import { BsRobot } from 'react-icons/bs'
import { FaMusic } from 'react-icons/fa'
import Tooltip from '@/components/toolTip'
import { useWeatherStore } from '@/context/weather.context'
import type { FetchedWeather } from '@/services/hooks/weather/weather.interface'
import { unitsFlag } from '../unitSymbols'

interface CurrentWeatherBoxProps {
	weather: FetchedWeather['weather']
}

export function CurrentWeatherBox({ weather }: CurrentWeatherBoxProps) {
	const { weatherSettings, selectedCity } = useWeatherStore()

	return (
		<section className="col-span-2 duration-300 animate-in fade-in-0 slide-in-from-bottom-2">
			<header className="p-2.5 bg-base-300/50 space-y-2 rounded-xl">
				<div className="flex gap-5 px-2">
					<div className="relative flex items-center flex-shrink-0">
						<img
							src={weather.icon.url}
							alt={
								weather.temperature.temp_description || 'Current weather'
							}
							className="w-10 h-10 rounded-full drop-shadow-lg"
							loading="lazy"
						/>
						{weather.ai?.playlist && (
							<Tooltip
								content="پلی‌لیست پیشنهادی"
								className="!p-0 bottom-1 absolute"
							>
								<a
									href={weather.ai?.playlist?.external_urls?.spotify}
									target="_blank"
								>
									<div className="p-1 rounded-full shadow-md cursor-pointer bg-primary/80 animate-pulse hover:animate-none">
										<FaMusic className="!p-0 text-xs text-content" />
									</div>
								</a>
							</Tooltip>
						)}
					</div>

					<div className="flex-1 min-w-0">
						<div className="text-[10px] text-muted truncate">
							{weather.label}
						</div>
						<div
							className={
								'mt-0.5 text-xl font-bold truncate text-base-content transition-colors'
							}
							aria-label={`Temperature: ${Math.round(weather.temperature.temp)} degrees`}
						>
							{Math.round(weather.temperature.temp)}
							<span className="mr-1 text-lg font-medium">
								{unitsFlag[weatherSettings.temperatureUnit || 'metric']}
							</span>
						</div>
						{selectedCity?.name && (
							<p className="mt-0.5 text-xs text-muted">
								{selectedCity.name}
							</p>
						)}
					</div>
				</div>
				<div className="flex items-center justify-between w-full h-8 gap-6 px-3 border bg-base-100/30 border-content rounded-xl">
					<div className="flex items-center justify-between flex-auto">
						<span className="font-medium text-content-base">رطوبت</span>
						<span className="text-muted font-semibold flex items-baseline gap-x-0.5">
							<span>%</span>
							<span>{weather.temperature.humidity}</span>
						</span>
					</div>
					<div className="flex items-center justify-between flex-auto">
						<span className="font-medium text-content-base">باد</span>
						<span className="text-muted font-semibold flex items-baseline gap-x-0.5">
							<span>km/h</span>
							<span>{weather.temperature.wind_speed}</span>
						</span>
					</div>
				</div>
			</header>

			<div className={'relative mt-2 p-2.5 bg-base-300/50 space-y-2 rounded-xl'}>
				<div className="flex gap-3 overflow-y-auto min-h-12 max-h-12">
					<div className="flex-1">
						<div>
							{weather.ai?.description && (
								<div
									className="pr-1 duration-500 delay-500 float-end text-primary animate-in fade-in-0 slide-in-from-left-2"
									aria-label="AI generated content"
								>
									<BsRobot className="text-sm" />
								</div>
							)}

							<p
								className={
									'text-xs font-light leading-relaxed text-content'
								}
							>
								{weather.ai?.description ||
									weather.temperature.temp_description}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
