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
			playlist: string
			img: string
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
