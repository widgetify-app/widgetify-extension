import type React from 'react'
import { Icon } from '@/icons'
import { cleanCityName } from '../utils/clean-city-name'
import { formatTemperature } from '../utils/format-temperature'
import type { FetchedWeather, TemperatureUnit } from '../weather.interface'

const BANNER_MASK =
	'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 30%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0) 85%)'

interface CurrentWeatherBoxProps {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: TemperatureUnit
}

export const CurrentWeatherBox: React.FC<CurrentWeatherBoxProps> = ({
	fetchedWeather,
	temperatureUnit,
}) => {
	const weather = fetchedWeather?.weather
	const banner = weather?.statusBanner
	const temp = formatTemperature(weather?.temperature?.temp, temperatureUnit)
	const cityName = cleanCityName(fetchedWeather?.city?.fa)

	const metrics = [
		{
			id: 'wind',
			label: 'باد',
			icon: 'wind',
			value: `${Math.round(weather?.temperature?.wind_speed || 0)} m/s`,
		},
		{
			id: 'humidity',
			label: 'رطوبت',
			icon: 'humidity',
			value: `${weather?.temperature?.humidity || 0}%`,
		},
		{
			id: 'clouds',
			label: 'پوشش ابری',
			icon: 'cloudy',
			value: `${weather?.temperature?.clouds || 0}%`,
		},
	] as const

	return (
		<>
			<header
				className={`relative p-2 overflow-hidden bg-fill hover:bg-fill-2 border border-surface-3 ${banner ? 'border-r-0' : ''} rounded-2xl border-surface-3 min-h-28 max-h-28`}
			>
				{banner ? (
					<div
						aria-hidden="true"
						className="absolute inset-0 transition-opacity duration-500 bg-center bg-cover"
						style={{
							backgroundImage: `url(${banner})`,
							maskImage: BANNER_MASK,
							WebkitMaskImage: BANNER_MASK,
						}}
					/>
				) : (
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-gradient-to-br from-surface-2 to-surface-veil"
					/>
				)}

				<div className="relative z-10 flex items-center justify-between py-1">
					<div className="flex flex-col gap-1.5">
						<span className="text-xs font-medium text-fg-muted drop-shadow-lg">
							{cityName}
						</span>

						<span className="flex items-baseline gap-1.5 text-4xl font-bold leading-none text-fg drop-shadow-lg">
							<data value={temp.value}>{temp.value}</data>
							<span className="text-xl font-medium text-fg drop-shadow-lg">
								{temp.symbol}
							</span>
						</span>

						<span className="text-xs leading-tight text-fg-muted drop-shadow-lg">
							{weather?.description?.text} •{' '}
							{weather?.temperature?.temp_description}
						</span>
					</div>

					{weather?.icon?.url ? (
						<img
							src={weather.icon.url}
							className="w-20 h-20 drop-shadow"
							alt={weather.description?.text || ''}
						/>
					) : (
						<div
							aria-hidden="true"
							className="w-20 h-20 rounded-lg animate-pulse bg-fill-2"
						/>
					)}
				</div>
			</header>

			<div className="p-1 rounded-2xl">
				<dl className="grid grid-cols-3 gap-1.5">
					{metrics.map((metric) => (
						<div
							key={metric.id}
							className="flex items-center justify-center gap-1.5 py-2 transition-colors bg-surface-2 border rounded-xl border-surface-3"
						>
							<dt className="flex items-center">
								<Icon
									name={metric.icon}
									className="w-4 h-4 text-fg-muted"
									aria-hidden="true"
								/>
								<span className="sr-only">{metric.label}</span>
							</dt>
							<dd className="text-xs font-medium text-fg-muted">
								{metric.value}
							</dd>
						</div>
					))}
				</dl>
			</div>
		</>
	)
}
