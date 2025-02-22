import { useQuery } from '@tanstack/react-query'
import { type ApiResponse, getMainClient } from '../../api'

async function fetchRelatedCities(city: string): Promise<any[]> {
	if (city.length > 1) {
		const client = await getMainClient()

		const response = await client.get<ApiResponse<any>>(`/weather/cities?city=${city}`)
		return response.data.data
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
