import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getMainClient } from '@/services/api'
import type { FetchedWeather } from '../../../layouts/widgets/weather/weather.interface'

type units = 'standard' | 'metric' | 'imperial'
async function fetchWeatherByLatLon(
	lat: number,
	lon: number,
	units?: units,
	useAI?: boolean
): Promise<FetchedWeather> {
	if (lat === 0 && lon === 0) {
		throw new Error('Invalid coordinates')
	}

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

type GetWeatherByLatLon = {
	units?: units
	useAI?: boolean
	refetchInterval: number | null
	enabled: boolean
}
export function useGetWeatherByLatLon(
	lat: number,
	lon: number,
	options: GetWeatherByLatLon
) {
	return useQuery({
		queryKey: ['getWeatherByLatLon', lat, lon],
		queryFn: () => fetchWeatherByLatLon(lat, lon, options.units, options.useAI),
		refetchInterval: options?.refetchInterval || false,
		enabled: options.enabled,
		staleTime: ms('5m'),
		gcTime: ms('5m'),
	})
}
