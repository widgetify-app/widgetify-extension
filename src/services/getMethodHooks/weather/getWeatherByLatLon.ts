import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../../api'
import type { FetchedWeather } from './weather.interface'

type units = 'standard' | 'metric' | 'imperial'
async function fetchWeatherByLatLon(
	lat: number,
	lon: number,
	units: units,
	useAI: boolean,
): Promise<FetchedWeather> {
	const client = await getMainClient()

	const response = await client.get<FetchedWeather>('/weather/current', {
		params: {
			lat,
			lon,
			units,
			useAI,
		},
	})
	return response.data
}

export function useGetWeatherByLatLon(
	lat: number,
	lon: number,
	options: {
		units: units
		useAI: boolean
		refetchInterval: number | null
	},
) {
	return useQuery({
		queryKey: ['getWeatherByLatLon', lat, lon],
		queryFn: () => fetchWeatherByLatLon(lat, lon, options.units, options.useAI),
		refetchInterval: options.refetchInterval || false,
	})
}
