import { useQuery } from '@tanstack/react-query'
import { type ApiResponse, getMainClient } from '../../api'
import type { FetchedWeather } from './weather.interface'

async function fetchWeatherByLatLon(lat: number, lon: number): Promise<FetchedWeather> {
	const client = await getMainClient()

	const response = await client.get<ApiResponse<FetchedWeather>>(
		`/weather/current?lat=${lat}&lon=${lon}`,
	)
	return response.data.data
}

export function useGetWeatherByLatLon(
	lat: number,
	lon: number,
	options: { refetchInterval: number | null },
) {
	return useQuery({
		queryKey: ['getWeatherByLatLon', lat, lon],
		queryFn: () => fetchWeatherByLatLon(lat, lon),
		refetchInterval: options.refetchInterval || false,
	})
}
