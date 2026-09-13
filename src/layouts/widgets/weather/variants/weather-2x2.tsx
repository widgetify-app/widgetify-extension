import type { FetchedWeather } from '@/layouts/widgets/weather/weather.interface'
import { cleanCityName } from '../utils/clean-city-name'
import { Icon } from '@/icons'
import moment from 'jalali-moment'

interface Weather2x2Props {
	fetchedWeather: FetchedWeather | null
}

export function Weather2x2({ fetchedWeather }: Weather2x2Props) {
	const cityName = cleanCityName(fetchedWeather?.city?.fa || '')
	const temp = Math.round(fetchedWeather?.weather?.temperature?.temp || 0)
	const description = fetchedWeather?.weather?.description?.text || ''
	const humidity = fetchedWeather?.weather?.temperature?.humidity || 0
	const windSpeed = Math.round(fetchedWeather?.weather?.temperature?.wind_speed || 0)
	const heroIconUrl = fetchedWeather?.weather?.icon?.url

	const forecastList = fetchedWeather?.forecast?.slice(0, 4) || []

	return (
		<div className="flex flex-col justify-between w-full h-42 my-auto p-3.5 select-none overflow-hidden text-right bg-content rounded-widget bg-glass">
			<div className="flex items-center justify-between w-full gap-2">
				<div className="shrink-0 flex items-center justify-center">
					{heroIconUrl ? (
						<img
							src={heroIconUrl}
							alt={description}
							className="w-16 h-16 object-contain drop-shadow-md"
						/>
					) : (
						<div className="w-14 h-14 rounded-full bg-base-300/40 animate-pulse" />
					)}
				</div>

				<div className="flex flex-col gap-1 min-w-0 items-end">
					<div className="flex items-center self-end gap-1 text-muted text-xs">
						<span className="font-medium truncate max-w-30">
							{cityName || 'تهران'}
						</span>
					</div>

					<div className="flex items-center gap-2.5 mt-0.5">
						<div className="flex flex-col gap-0.5 items-end">
							<span className="text-xs font-semibold text-content truncate max-w-32.5 leading-tight">
								{description || 'صاف'}
							</span>

							<div className="flex items-center gap-2 text-[10px] font-medium text-muted">
								<span className="flex items-center gap-0.5">
									<Icon
										name="humidity"
										className="w-3 h-3 text-muted"
									/>
									<span>{humidity}%</span>
								</span>
								<span className="text-muted/40">•</span>
								<span className="flex items-center gap-0.5">
									<Icon name="wind" className="w-3 h-3 text-muted" />
									<span>{windSpeed} m/s</span>
								</span>
							</div>
						</div>

						<span className="text-4xl font-black text-content tracking-tight leading-none">
							{temp}°
						</span>
					</div>
				</div>
			</div>

			<div className="w-full pt-2">
				<div className="grid grid-cols-4 gap-4 w-full text-center">
					{forecastList.map((item, index) => {
						const hourText = item.date
							? moment(item.date).locale('fa').format('HH:mm')
							: index === 0
								? 'الان'
								: `${index * 3}:۰۰`
						const itemTemp = Math.round(item.temp)

						return (
							<div
								key={item.date || index}
								className="flex flex-col items-center justify-between gap-1 min-w-0"
							>
								<span className="text-[11px] font-medium text-muted w-full">
									{hourText}
								</span>

								{item.icon ? (
									<img
										src={item.icon}
										alt="forecast"
										className="w-6 h-6 object-contain drop-shadow-xs"
									/>
								) : (
									<div className="w-5 h-5 rounded-full bg-base-300/30 animate-pulse" />
								)}

								<span className="text-xs font-bold text-content leading-none">
									{itemTemp}°
								</span>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
