import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import type { FetchedCity } from './weather.interface'

async function fetchRelatedCities(city: string): Promise<FetchedCity[]> {
	if (city.length > 1) {
		const client = await getMainClient()

		const response = await client.get<any>(`/weather/cities?city=${city}`)
		return response.data
	}

	return []
}

export function useGetRelatedCities(city: string) {
	return useQuery({
		queryKey: ['getRelatedCities', city],
		queryFn: () => fetchRelatedCities(city),
		enabled: city.length > 0,
	})
}
