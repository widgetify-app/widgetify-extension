import type { FetchedWeather } from '@/layouts/widgets/weather/weather.interface'

interface CurrentWeatherBoxProps {
	weather?: FetchedWeather['weather']
}

export function CurrentWeatherBox({ weather }: CurrentWeatherBoxProps) {
	return (
		<div className="grid items-center justify-center w-full h-full grid-cols-2 gap-2">
			<div className="flex flex-col justify-between w-full h-[5.3rem] p-2 border rounded-2xl border-content">
				<p className="text-[10px] text-muted">سرعت باد</p>

				<p className="self-end text-sm font-bold text-content" dir="ltr">
					{weather?.temperature?.wind_speed} km/h
				</p>

				<p className="text-[11px] text-muted truncate">
					تندباد:{' '}
					<span dir="ltr" className="ml-1">
						{weather?.temperature?.wind_gus ?? '-'} km/h
					</span>
				</p>
			</div>
			<div className="flex flex-col justify-between w-full h-[5.3rem] p-2 border rounded-2xl border-content">
				<p className="text-[10px] text-muted">رطوبت</p>
				<p className="self-end text-sm font-bold text-content" dir="ltr">
					{weather?.temperature?.humidity}%
				</p>
				<p className="text-[11px] text-muted truncate">رطوبت هوا</p>
			</div>

			<CompactAirQualityCard airPollution={weather?.airPollution} />

			<div className="flex flex-col justify-between w-full h-[5.3rem] p-2 border rounded-2xl border-content">
				<p className="text-[10px] text-muted">ابرها</p>
				<p className="self-end text-sm font-bold text-content" dir="ltr">
					{weather?.temperature?.clouds}%
				</p>
				<p className="text-[11px] text-muted truncate">میزان پوشش ابر</p>
			</div>
		</div>
	)
}

interface CompactAirQualityCardProp {
	airPollution?: FetchedWeather['weather']['airPollution']
}
function CompactAirQualityCard({ airPollution }: CompactAirQualityCardProp) {
	const getAirQualityInfo = (aqi: any, components: any) => {
		if (!aqi && !components) return { status: '-', color: 'text-gray-500' }

		if (aqi) {
			switch (aqi) {
				case 1:
					return { status: 'عالی', color: 'text-green-600' }
				case 2:
					return { status: 'خوب', color: 'text-green-500' }
				case 3:
					return { status: 'متوسط', color: 'text-yellow-600' }
				case 4:
					return { status: 'ناسالم', color: 'text-orange-600' }
				case 5:
					return { status: 'خطرناک', color: 'text-red-600' }
				default:
					return { status: 'نامعلوم', color: 'text-gray-500' }
			}
		}

		if (components) {
			if (components.pm2_5 > 50 || components.pm10 > 100) {
				return { status: 'هوای ناسالم', color: 'text-orange-600' }
			}
			return { status: 'کیفیت مناسب', color: 'text-green-600' }
		}

		return { status: '-', color: 'text-gray-500' }
	}

	const getStatusDot = (aqi: any) => {
		if (!aqi) return 'bg-gray-400'

		switch (aqi) {
			case 1:
				return 'bg-green-500'
			case 2:
				return 'bg-green-400'
			case 3:
				return 'bg-yellow-500'
			case 4:
				return 'bg-orange-500'
			case 5:
				return 'bg-red-500'
			default:
				return 'bg-gray-400'
		}
	}

	const airQuality = getAirQualityInfo(airPollution?.aqi, airPollution?.components)

	return (
		<div className="flex flex-col justify-between w-full h-[5.3rem] p-2 border rounded-2xl border-content hover:shadow-md transition-shadow duration-200">
			<div className="flex items-center justify-between">
				<p className="text-[10px] text-muted">کیفیت هوا</p>
				<div
					className={`w-2 h-2 rounded-full ${getStatusDot(airPollution?.aqi)}`}
				></div>
			</div>

			<div className="flex items-end justify-between">
				<p className={`text-sm font-bold ${airQuality.color}`} dir="ltr">
					{airPollution?.aqi ?? '-'}
				</p>

				{airPollution?.aqi && (
					<div className="flex space-x-0.5" dir="ltr">
						{[1, 2, 3, 4, 5].map((level) => (
							<div
								key={level}
								className={`w-1 h-3 rounded-sm ${
									level <= airPollution?.aqi
										? level <= 2
											? 'bg-green-500'
											: level === 3
												? 'bg-yellow-500'
												: level === 4
													? 'bg-orange-500'
													: 'bg-red-500'
										: 'bg-gray-200'
								}`}
							/>
						))}
					</div>
				)}
			</div>

			<div className="flex items-center justify-between">
				<p className={`text-[11px] truncate ${airQuality.color}`}>
					{airQuality.status}
				</p>

				{airPollution?.components && (
					<p className="text-[9px] text-muted" dir="ltr">
						PM2.5: {airPollution.components?.pm2_5.toFixed(0)}
					</p>
				)}
			</div>
		</div>
	)
}
