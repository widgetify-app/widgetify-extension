import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type {
	FetchedForecast,
	TemperatureUnit,
} from '../../../layouts/widgets/weather/weather.interface'

async function fetchForecastWeatherByLatLon(
	count?: number,
	units?: TemperatureUnit
): Promise<FetchedForecast[]> {
	const client = await getMainClient()

	const response = await client.get<FetchedForecast[]>('/weather/forecast', {
		params: {
			...(count !== null && { count }),
			...(units !== null && { units }),
		},
	})
	return response.data
}

export function useGetForecastWeatherByLatLon(options: {
	refetchInterval: number | null
	count?: number
	units?: TemperatureUnit
	enabled: boolean
}) {
	return useQuery({
		queryKey: ['ForecastGetWeatherByLatLon'],
		queryFn: () => fetchForecastWeatherByLatLon(options.count, options.units),
		refetchInterval: options.refetchInterval || false,
		enabled: options.enabled,
	})
}
