import type React from 'react'
import { Icon } from '@/icons'
import { cleanCityName } from '../utils/clean-city-name'
import { formatTemperature } from '../utils/format-temperature'
import type { FetchedWeather, TemperatureUnit } from '../weather.interface'

interface WeatherCompactRowProps {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: TemperatureUnit
}

export const WeatherCompactRow: React.FC<WeatherCompactRowProps> = ({
	fetchedWeather,
	temperatureUnit,
}) => {
	const temp = formatTemperature(
		fetchedWeather?.weather?.temperature?.temp,
		temperatureUnit
	)
	const cityName = cleanCityName(fetchedWeather?.city?.fa)
	const iconUrl = fetchedWeather?.weather?.icon?.url
	const description = fetchedWeather?.weather?.description?.text || ''
	const humidity = fetchedWeather?.weather?.temperature?.humidity || 0
	const windSpeed = Math.round(fetchedWeather?.weather?.temperature?.wind_speed || 0)

	return (
		<section
			aria-label="آب و هوا"
			aria-busy={!fetchedWeather}
			className="flex items-center justify-between w-full h-full px-3.5 py-2 select-none"
		>
			<div className="flex items-center gap-3">
				{iconUrl ? (
					<img src={iconUrl} className="w-11 h-11 drop-shadow" alt="" />
				) : (
					<div
						aria-hidden="true"
						className="rounded-full w-11 h-11 animate-pulse bg-base-content/10"
					/>
				)}

				<div className="flex flex-col">
					<div className="flex items-baseline gap-1.5">
						<span className="text-2xl font-black leading-none text-content">
							<data value={temp.value}>{temp.value}</data>
							<span className="text-xs font-medium text-muted mr-0.5">
								{temp.symbol}
							</span>
						</span>
						<span className="text-xs font-bold text-content">{cityName}</span>
					</div>
					<span className="text-[11px] text-muted font-medium mt-0.5 truncate max-w-36">
						{description}
					</span>
				</div>
			</div>

			<dl className="flex flex-col items-end gap-1 text-[10px] text-muted">
				<div className="flex items-center gap-1">
					<dt className="flex items-center">
						<Icon name="wind" className="w-3 h-3" aria-hidden="true" />
						<span className="sr-only">باد</span>
					</dt>
					<dd>{windSpeed} m/s</dd>
				</div>
				<div className="flex items-center gap-1">
					<dt className="flex items-center">
						<Icon name="humidity" className="w-3 h-3" aria-hidden="true" />
						<span className="sr-only">رطوبت</span>
					</dt>
					<dd>{humidity}%</dd>
				</div>
			</dl>
		</section>
	)
}
