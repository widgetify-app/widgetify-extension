import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getMainClient } from '@/services/api'
import type { FetchedWeather } from '../../../layouts/widgets/weather/weather.interface'

type units = 'standard' | 'metric' | 'imperial'
async function fetchWeatherByLatLon(
	units?: units,
	useAI?: boolean
): Promise<FetchedWeather> {
	const client = await getMainClient()

	const response = await client.get<FetchedWeather>('/weather/current', {
		params: {
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
export function useGetWeatherByLatLon(options: GetWeatherByLatLon) {
	return useQuery({
		queryKey: ['getWeatherByLatLon'],
		queryFn: () => fetchWeatherByLatLon(options.units, options.useAI),
		refetchInterval: options?.refetchInterval || false,
		enabled: options.enabled,
		staleTime: ms('5m'),
		gcTime: ms('5m'),
	})
}
