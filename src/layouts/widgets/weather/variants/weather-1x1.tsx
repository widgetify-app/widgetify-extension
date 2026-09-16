import type React from 'react'
import { cleanCityName } from '../utils/clean-city-name'
import { formatTemperature } from '../utils/format-temperature'
import type { FetchedWeather, TemperatureUnit } from '../weather.interface'

interface WeatherCompactSquareProps {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: TemperatureUnit
}

export const WeatherCompactSquare: React.FC<WeatherCompactSquareProps> = ({
	fetchedWeather,
	temperatureUnit,
}) => {
	const temp = formatTemperature(
		fetchedWeather?.weather?.temperature?.temp,
		temperatureUnit
	)
	const cityName = cleanCityName(fetchedWeather?.city?.fa)
	const description = fetchedWeather?.weather?.description?.text || ''
	const iconUrl = fetchedWeather?.weather?.icon?.url

	return (
		<section
			aria-label="آب و هوا"
			aria-busy={!fetchedWeather}
			className="relative flex flex-col justify-between w-full h-full p-[10.4cqh] overflow-hidden text-right select-none"
		>
			<div className="flex items-center justify-between w-full gap-1">
				<span className="text-[11.5cqh] font-bold text-content truncate max-w-[55px]">
					{cityName || 'مکان شما'}
				</span>
				{iconUrl ? (
					<img
						src={iconUrl}
						className="object-contain w-[29.2cqh] h-[29.2cqh] drop-shadow-xs"
						alt=""
					/>
				) : (
					<div
						aria-hidden="true"
						className="w-[25cqh] h-[25cqh] rounded-full bg-muted animate-pulse"
					/>
				)}
			</div>

			<div className="flex items-baseline gap-0.5 my-auto leading-none">
				<span className="text-[31.2cqh] font-black tracking-tight text-content">
					<data value={temp.value}>{temp.value}</data>
				</span>
				<span className="text-[12.5cqh] font-bold text-muted">{temp.symbol}</span>
			</div>

			<span className="text-[10.4cqh] font-medium text-muted truncate max-w-full leading-tight">
				{description || 'درحال دریافت...'}
			</span>
		</section>
	)
}
