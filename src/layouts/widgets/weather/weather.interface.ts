export interface FetchedWeather {
	city: {
		fa: string
		en: string
	}
	weather: {
		statusBanner: string | null
		label: string
		icon: {
			url: string
			width: number
			height: number
		}
		description: {
			text: string
			emoji: string
		}
		temperature: {
			clouds: number
			humidity: number
			pressure: number
			temp: number
			temp_description: string
			temp_max: number
			temp_min: number
			wind_speed: number
			wind_deg: number
			wind_gus: number
		}
		airPollution: {
			aqi: number
			components: any
		}
	}

	forecast: FetchedForecast[]
}

export interface FetchedForecast {
	temp: number
	icon: string
	date: string
	description: string | null
}

export interface FetchedCity {
	name: string
	country: string
	state: string | null
	lat: number
	lon: number
}

export type TemperatureUnit = 'standard' | 'metric' | 'imperial'

export interface WeatherSettings {
	forecastCount: number
	temperatureUnit: TemperatureUnit
	useAI: boolean
	enableShowName: boolean
}
