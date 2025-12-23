import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getMainClient } from '@/services/api'
import type { FetchedWeather } from '../../../layouts/widgets/weather/weather.interface'

type units = 'standard' | 'metric' | 'imperial'
async function fetchWeatherByLatLon(op: GetWeatherByLatLon): Promise<FetchedWeather> {
	const client = await getMainClient()

	const response = await client.get<FetchedWeather>('/weather/current', {
		params: {
			lat: op.lat,
			lon: op.lon,
			units: op.units,
			useAI: op.useAI,
		},
	})
	return response.data
}

type GetWeatherByLatLon = {
	units?: units
	useAI?: boolean
	refetchInterval: number | null
	enabled: boolean
	lat?: number
	lon?: number
}
export function useGetWeatherByLatLon(options: GetWeatherByLatLon) {
	return useQuery({
		queryKey: ['getWeatherByLatLon', options],
		queryFn: () => fetchWeatherByLatLon(options),
		refetchInterval: options?.refetchInterval || false,
		enabled: options.enabled,
		staleTime: ms('5m'),
		gcTime: ms('5m'),
	})
}
