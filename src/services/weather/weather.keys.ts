export const weatherKeys = {
	all: ['getWeatherByLatLon'] as const,
	byLatLon: (addForecast: boolean) => ['getWeatherByLatLon', addForecast] as const,
}
