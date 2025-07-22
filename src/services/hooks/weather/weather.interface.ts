export interface FetchedWeather {
	city: {
		fa: string
		en: string
	}
	weather: {
		label: string
		icon: {
			url: string
			width: number
			height: number
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
		}
		ai: {
			description: string
			playlist: {
				description: string
				external_urls: {
					spotify: string
				}
				images: [
					{
						url: string
					},
				]
				name: string
				primary_color: null
			}
		}
	}

	forecast: FetchedForecast[]
}

export interface FetchedForecast {
	temp: number
	icon: string
	date: string
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
}
