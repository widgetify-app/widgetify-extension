import { useDate } from '@/context/date.context'
import { useWeatherStore } from '@/context/weather.context'
import type { FetchedWeather } from '@/services/hooks/weather/weather.interface'
import { BsRobot } from 'react-icons/bs'
import { unitsFlag } from '../unitSymbols'

interface CurrentWeatherBoxProps {
	weather: FetchedWeather['weather']
}

export function CurrentWeatherBox({ weather }: CurrentWeatherBoxProps) {
	const { weatherSettings, selectedCity } = useWeatherStore()
	const { currentDate } = useDate()

	return (
		<section className="col-span-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
			<header className="p-2.5 bg-base-300/80 space-y-2 rounded-xl">
				<div className="flex gap-5 px-2">
					<div className="flex items-center">
						<img
							src={weather.icon.url}
							alt={
								weather.temperature.temp_description || 'Current weather'
							}
							className="w-10 h-10 rounded-full drop-shadow-lg"
							loading="lazy"
						/>
					</div>

					<div>
						<div className="text-[10px] text-muted">
							{currentDate.format('dddd، jD jMMMM jYYYY')}
						</div>
						<div
							className={
								'mt-0.5 text-xl font-bold truncate text-base-content transition-colors'
							}
							aria-label={`Temperature: ${Math.round(weather.temperature.temp)} degrees`}
						>
							{/* <span>ابری</span> */}
							{Math.round(weather.temperature.temp)}
							<span className="mr-1 text-lg font-medium">
								{unitsFlag[weatherSettings.temperatureUnit || 'metric']}
							</span>
						</div>
						{selectedCity?.name && (
							<p
								className="mt-0.5 text-xs text-muted"
								title={selectedCity.name}
							>
								{selectedCity.name}
							</p>
						)}
					</div>
				</div>
				<div className="w-full h-8 px-3 bg-base-100/30 border border-content flex items-center justify-between gap-6 rounded-xl">
					<div className="flex-auto flex items-center justify-between">
						<span className="text-content-base font-medium">رطوبت</span>
						<span className="text-muted font-semibold flex items-baseline gap-x-0.5">
							<span>%</span>
							<span>{weather.temperature.humidity}</span>
						</span>
					</div>
					<div className="flex-auto flex items-center justify-between">
						<span className="text-content-base font-medium">باد</span>
						<span className="text-muted font-semibold flex items-baseline gap-x-0.5">
							<span>km/h</span>
							<span>{weather.temperature.wind_speed}</span>
						</span>
					</div>
				</div>
			</header>

			<div className={'relative mt-2 p-2.5 bg-base-300/80 space-y-2 rounded-xl'}>
				<div className="flex gap-3 overflow-y-auto min-h-12 max-h-12">
					<div className="flex-1">
						<div>
							{weather.ai?.description && (
								<div
									className="float-end pr-1 text-primary animate-in fade-in-0 slide-in-from-left-2 duration-500 delay-500"
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
