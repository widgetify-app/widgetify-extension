import moment from 'jalali-moment'
import type React from 'react'
import { Icon } from '@/icons'
import { cleanCityName } from '../utils/clean-city-name'
import { formatTemperature } from '../utils/format-temperature'
import type { FetchedWeather, TemperatureUnit } from '../weather.interface'

const FORECAST_SLOTS = 4

interface Weather2x2Props {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: TemperatureUnit
}

export const Weather2x2: React.FC<Weather2x2Props> = ({
	fetchedWeather,
	temperatureUnit,
}) => {
	const cityName = cleanCityName(fetchedWeather?.city?.fa)
	const temp = formatTemperature(
		fetchedWeather?.weather?.temperature?.temp,
		temperatureUnit
	)
	const description = fetchedWeather?.weather?.description?.text || ''
	const humidity = fetchedWeather?.weather?.temperature?.humidity || 0
	const windSpeed = Math.round(fetchedWeather?.weather?.temperature?.wind_speed || 0)
	const heroIconUrl = fetchedWeather?.weather?.icon?.url

	const forecastList = fetchedWeather?.forecast?.slice(0, FORECAST_SLOTS) || []

	return (
		<section
			aria-label="آب و هوا"
			aria-busy={!fetchedWeather}
			className="flex flex-col justify-between w-full h-full my-auto p-3.5 select-none overflow-hidden text-right bg-content rounded-widget bg-glass"
		>
			<header className="flex items-center justify-between w-full gap-2">
				<div className="flex items-center justify-center shrink-0">
					{heroIconUrl ? (
						<img
							src={heroIconUrl}
							alt=""
							className="object-contain w-16 h-16 drop-shadow-md"
						/>
					) : (
						<div
							aria-hidden="true"
							className="rounded-full w-14 h-14 bg-raised animate-pulse"
						/>
					)}
				</div>

				<div className="flex flex-col items-end min-w-0 gap-1">
					<span className="max-w-30 text-xs font-medium truncate text-muted">
						{cityName || 'تهران'}
					</span>

					<div className="flex items-center gap-2.5 mt-0.5">
						<div className="flex flex-col items-end gap-0.5">
							<span className="text-xs font-semibold leading-tight truncate text-content max-w-32.5">
								{description || 'صاف'}
							</span>

							<dl className="flex items-center gap-2 text-[10px] font-medium text-muted">
								<div className="flex items-center gap-0.5">
									<dt className="flex items-center">
										<Icon
											name="humidity"
											className="w-3 h-3"
											aria-hidden="true"
										/>
										<span className="sr-only">رطوبت</span>
									</dt>
									<dd>{humidity}%</dd>
								</div>
								<span aria-hidden="true" className="opacity-40">
									•
								</span>
								<div className="flex items-center gap-0.5">
									<dt className="flex items-center">
										<Icon
											name="wind"
											className="w-3 h-3"
											aria-hidden="true"
										/>
										<span className="sr-only">باد</span>
									</dt>
									<dd>{windSpeed} m/s</dd>
								</div>
							</dl>
						</div>

						<span className="text-4xl font-black leading-none tracking-tight text-content">
							<data value={temp.value}>{temp.value}</data>
							<span className="text-lg font-medium">{temp.symbol}</span>
						</span>
					</div>
				</div>
			</header>

			<ul className="grid w-full grid-cols-4 gap-4 pt-2 text-center">
				{forecastList.map((item) => {
					const at = moment(item.date).locale('fa')
					const itemTemp = formatTemperature(item.temp, temperatureUnit)

					return (
						<li
							key={item.date}
							className="flex flex-col items-center justify-between min-w-0 gap-1"
						>
							<time
								dateTime={at.clone().locale('en').format()}
								className="text-[11px] font-medium text-muted w-full"
							>
								{at.format('HH:mm')}
							</time>

							{item.icon ? (
								<img
									src={item.icon}
									alt=""
									className="object-contain w-6 h-6 drop-shadow-xs"
								/>
							) : (
								<div
									aria-hidden="true"
									className="w-5 h-5 rounded-full bg-raised animate-pulse"
								/>
							)}

							<span className="text-xs font-bold leading-none text-content">
								<data value={itemTemp.value}>{itemTemp.value}</data>°
							</span>
						</li>
					)
				})}
			</ul>
		</section>
	)
}
