import type { IconName } from '@/icons'
import type { FetchedWeather } from '@/services/weather/weather.interface'
import { t } from '@/common/i18n'

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
			label: t('widgets.weather.metric.wind'),
			icon: 'wind',
			value: `${Math.round(reading?.wind_speed || 0)} m/s`,
		},
		{
			label: t('widgets.weather.metric.humidity'),
			icon: 'humidity',
			value: `${reading?.humidity || 0}%`,
		},
		{
			label: t('widgets.weather.metric.clouds'),
			icon: 'cloudy',
			value: `${reading?.clouds || 0}%`,
		},
	]
}
