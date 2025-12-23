import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type {
	FetchedForecast,
	TemperatureUnit,
} from '../../../layouts/widgets/weather/weather.interface'
interface Options {
	refetchInterval: number | null
	count?: number
	units?: TemperatureUnit
	enabled: boolean
	lat?: number
	lon?: number
}
async function fetchForecastWeatherByLatLon(
	options: Options
): Promise<FetchedForecast[]> {
	const client = await getMainClient()

	const response = await client.get<FetchedForecast[]>('/weather/forecast', {
		params: {
			...(options.count !== null && { count: options.count }),
			...(options.units !== null && { units: options.units }),
			...(options.lat !== null && { lat: options.lat }),
			...(options.lon !== null && { lon: options.lon }),
		},
	})
	return response.data
}

export function useGetForecastWeatherByLatLon(options: Options) {
	return useQuery({
		queryKey: ['ForecastGetWeatherByLatLon', options],
		queryFn: () => fetchForecastWeatherByLatLon(options),
		refetchInterval: options.refetchInterval || false,
		enabled: options.enabled,
	})
}
