import type { FetchedWeather } from '@/layouts/widgets/weather/weather.interface'
import { unitsFlag } from '../unitSymbols'
import Tooltip from '@/components/toolTip'
import { TbWind } from 'react-icons/tb'
import { WiCloudy, WiHumidity } from 'react-icons/wi'

interface CurrentWeatherBoxProps {
	fetchedWeather: FetchedWeather['weather'] | null
	enabledShowName: boolean
	temperatureUnit: keyof typeof unitsFlag
	selectedCityName: string
}

export function CurrentWeatherBox({
	fetchedWeather,
	enabledShowName,
	selectedCityName,
	temperatureUnit,
}: CurrentWeatherBoxProps) {
	return (
		<>
			<div className="relative p-2 overflow-hidden border rounded-2xl border-content min-h-28 max-h-28">
				{fetchedWeather?.statusBanner && (
					<div
						className="absolute inset-0 bg-center bg-cover"
						style={{
							backgroundImage: `url(${fetchedWeather.statusBanner})`,
							maskImage:
								'linear-gradient(to left, rgba(0, 0, 0, 0.4) 10%, rgba(0, 0, 0, 0) 80%)',
							WebkitMaskImage:
								'linear-gradient(to left, rgba(0, 0, 0, 0.4) 10%, rgba(0, 0, 0, 0) 80%)',
						}}
					/>
				)}

				{!fetchedWeather?.statusBanner && (
					<div className="absolute inset-0 bg-gradient-to-br from-base-200/80 to-base-200/60"></div>
				)}

				<div className="relative z-10 flex items-center justify-between py-1">
					<div className="flex flex-col gap-1.5">
						<span className="text-xs font-medium text-muted drop-shadow-lg">
							{enabledShowName ? cleanCityName(selectedCityName) : '🏠'}
						</span>

						<span className="flex items-baseline gap-1.5 text-4xl font-bold leading-none text-base-content drop-shadow-lg">
							{Math.round(fetchedWeather?.temperature?.temp || 0)}
							<span className="text-xl font-medium text-base-content/90 drop-shadow-lg">
								{unitsFlag[temperatureUnit || 'metric']}
							</span>
						</span>

						<span className="text-xs leading-tight text-muted drop-shadow-lg">
							{fetchedWeather?.description.text} •{' '}
							{fetchedWeather?.temperature.temp_description}
						</span>
					</div>

					<img
						src={fetchedWeather?.icon?.url}
						className="w-20 h-20 drop-shadow"
						alt={fetchedWeather?.description?.text}
					/>
				</div>
			</div>

			<div className="p-2 border rounded-2xl bg-base-200/40 border-content">
				<div className="grid grid-cols-3 gap-1.5">
					<Tooltip content={'باد'}>
						<div className="flex items-center justify-center gap-1.5 py-2 transition-colors border rounded-xl border-content">
							<TbWind className="w-4 h-4 text-muted" />
							<span className="text-xs font-medium text-muted">
								{Math.round(fetchedWeather?.temperature.wind_speed || 0)}{' '}
								m/s
							</span>
						</div>
					</Tooltip>

					<Tooltip content={'رطوبت'}>
						<div className="flex items-center justify-center gap-1.5 py-2 transition-colors border rounded-xl border-content">
							<WiHumidity className="w-4 h-4 text-muted" />
							<span className="text-xs font-medium text-muted">
								{fetchedWeather?.temperature.humidity || 0}%
							</span>
						</div>
					</Tooltip>

					<Tooltip content="پوشش ابری">
						<div className="flex items-center justify-center gap-1.5 py-2 transition-colors border rounded-xl border-content">
							<WiCloudy className="w-4 h-4 text-muted" />
							<span className="text-xs font-medium text-muted">
								{fetchedWeather?.temperature.clouds || 0}%
							</span>
						</div>
					</Tooltip>
				</div>
			</div>
		</>
	)
}

function cleanCityName(name: string) {
	const regex = /\s*شهرستان\s*/g
	return name.replace(regex, ' ').trim()
}
