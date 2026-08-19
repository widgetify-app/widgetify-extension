import type { FetchedWeather } from '@/layouts/widgets/weather/weather.interface'
import { unitsFlag } from '../unit-symbols'
import { CurrentWeatherBox } from '../current/current-box.weather'
import { Forecast } from '../forecast/forecast'

interface WeatherWideFullProps {
	fetchedWeather: FetchedWeather | null
	temperatureUnit: keyof typeof unitsFlag
}

export function WeatherWideFull({
	fetchedWeather,
	temperatureUnit,
}: WeatherWideFullProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full w-full p-1 select-none">
			<div className="flex flex-col justify-between h-full gap-2">
				<CurrentWeatherBox
					fetchedWeather={fetchedWeather}
					temperatureUnit={temperatureUnit}
				/>
			</div>

			<div className="flex flex-col justify-between h-full p-2 rounded-2xl bg-base-200/40 border border-base-content/10">
				<div className="text-xs font-bold text-content px-1">
					پیش‌بینی ساعات آینده
				</div>
				<div className="flex justify-around gap-1">
					<Forecast
						temperatureUnit={temperatureUnit}
						forecast={fetchedWeather?.forecast || []}
					/>
				</div>
			</div>
		</div>
	)
}
