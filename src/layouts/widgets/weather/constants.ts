import type { TemperatureUnit } from './weather.interface'

export const TEMPERATURE_UNIT_SYMBOLS: Record<TemperatureUnit, string> = {
	standard: 'K',
	metric: '°C',
	imperial: '°F',
}

export const DEFAULT_WEATHER_SETTINGS = {
	useAI: true,
	forecastCount: 4,
	temperatureUnit: 'metric',
	enableShowName: true,
} as const
