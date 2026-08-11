import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { FetchedForecast } from '../../../layouts/widgets/weather/weather.interface'
import ms from 'ms'
interface Options {
	count?: number
}
async function fetchForecastWeatherByLatLon(
	options: Options
): Promise<FetchedForecast[]> {
	const client = getMainClient()

	const response = await client.get<FetchedForecast[]>('/weather/forecast', {
		params: {
			...(options.count !== null && { count: options.count }),
		},
	})
	return response.data
}

export function useGetForecastWeatherByLatLon(options: Options) {
	return useQuery({
		queryKey: ['ForecastGetWeatherByLatLon', options.count || 0],
		queryFn: () => fetchForecastWeatherByLatLon(options),
		staleTime: ms('5m'),
		gcTime: ms('5m'),
	})
}
