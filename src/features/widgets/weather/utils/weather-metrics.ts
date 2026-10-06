import type { IconName } from '@/icons'
import type { FetchedWeather } from '@/services/weather/weather.interface'

interface WeatherMetric {
	label: string
	icon: IconName
	value: string
}

export function getWeatherMetrics(
	reading: Partial<FetchedWeather['weather']['temperature']> | undefined
): WeatherMetric[] {
	return [
		{
			label: 'باد',
			icon: 'wind',
			value: `${Math.round(reading?.wind_speed || 0)} m/s`,
		},
		{ label: 'رطوبت', icon: 'humidity', value: `${reading?.humidity || 0}%` },
		{ label: 'ابر', icon: 'cloudy', value: `${reading?.clouds || 0}%` },
	]
}
