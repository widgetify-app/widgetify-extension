import type React from 'react'
import { Tooltip } from '@/components/ui'
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
				className={`relative p-2 overflow-hidden bg-subtle border ${banner ? 'border-r-0' : ''} rounded-2xl border-content min-h-28 max-h-28`}
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
						className="absolute inset-0 bg-gradient-to-br from-content to-content"
					/>
				)}

				<div className="relative z-10 flex items-center justify-between py-1">
					<div className="flex flex-col gap-1.5">
						<span className="text-xs font-medium text-muted drop-shadow-lg">
							{cityName}
						</span>

						<span className="flex items-baseline gap-1.5 text-4xl font-bold leading-none text-content drop-shadow-lg">
							<data value={temp.value}>{temp.value}</data>
							<span className="text-xl font-medium text-content drop-shadow-lg">
								{temp.symbol}
							</span>
						</span>

						<span className="text-xs leading-tight text-muted drop-shadow-lg">
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
							className="w-20 h-20 rounded-lg animate-pulse bg-hovered"
						/>
					)}
				</div>
			</header>

			<div className="p-2 border rounded-2xl bg-subtle border-content">
				<dl className="grid grid-cols-3 gap-1.5">
					{metrics.map((metric) => (
						<Tooltip key={metric.id} content={metric.label}>
							<div className="flex items-center justify-center gap-1.5 py-2 transition-colors border rounded-xl border-content">
								<dt className="flex items-center">
									<Icon
										name={metric.icon}
										className="w-4 h-4 text-muted"
										aria-hidden="true"
									/>
									<span className="sr-only">{metric.label}</span>
								</dt>
								<dd className="text-xs font-medium text-muted">
									{metric.value}
								</dd>
							</div>
						</Tooltip>
					))}
				</dl>
			</div>
		</>
	)
}
