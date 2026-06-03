import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getMainClient } from '@/services/api'
import type { FetchedWeather } from '../../../layouts/widgets/weather/weather.interface'

async function fetchWeatherByLatLon(): Promise<FetchedWeather> {
	const client = await getMainClient()

	const response = await client.get<FetchedWeather>('/weather/current')
	return response.data
}

export function useGetWeatherByLatLon() {
	return useQuery({
		queryKey: ['getWeatherByLatLon'],
		queryFn: () => fetchWeatherByLatLon(),
		staleTime: ms('5m'),
		gcTime: ms('5m'),
	})
}
