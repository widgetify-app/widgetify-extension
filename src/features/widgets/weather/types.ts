export type TemperatureUnit = 'standard' | 'metric' | 'imperial'

export interface WeatherSettings {
	forecastCount: number
	temperatureUnit: TemperatureUnit
	useAI: boolean
	enableShowName: boolean
}

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		weatherSettings: WeatherSettings
	}
}

declare module '@/common/utils/call-event' {
	interface EventName {
		weatherSettingsChanged: WeatherSettings
	}
}
