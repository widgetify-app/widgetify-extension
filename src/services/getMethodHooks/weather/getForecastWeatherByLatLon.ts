import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../../api'
import type { FetchedForecast } from './weather.interface'

async function fetchForecastWeatherByLatLon(
	lat: number,
	lon: number,
): Promise<FetchedForecast[]> {
	const client = await getMainClient()

	const response = await client.get<FetchedForecast[]>(
		`/weather/forecast?lat=${lat}&lon=${lon}`,
	)
	return response.data
}

export function useGetForecastWeatherByLatLon(
	lat: number,
	lon: number,
	options: { refetchInterval: number | null },
) {
	return useQuery({
		queryKey: ['ForecastGetWeatherByLatLon', lat, lon],
		queryFn: () => fetchForecastWeatherByLatLon(lat, lon),
		refetchInterval: options.refetchInterval || false,
	})
}
