import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../../api'

async function fetchRelatedCities(city: string): Promise<any[]> {
	if (city.length > 1) {
		const client = await getMainClient()

		const response = await client.get(`/weather/direct?q=${city}`)
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
