import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getMainClient } from '@/services/api'
import type { FetchedWeather } from '../../../layouts/widgets/weather/weather.interface'

async function fetchWeatherByLatLon(addForecast: boolean): Promise<FetchedWeather> {
	const client = await getMainClient()
	const params = new URLSearchParams()
	if (addForecast) {
		params.append('addForecast', 'true')
	}

	const response = await client.get<FetchedWeather>('/weather/current', { params })
	return response.data
}

export function useGetWeatherByLatLon(addForecast: boolean) {
	return useQuery({
		queryKey: ['getWeatherByLatLon', addForecast],
		queryFn: () => fetchWeatherByLatLon(addForecast),
		staleTime: ms('5m'),
		gcTime: ms('5m'),
	})
}
