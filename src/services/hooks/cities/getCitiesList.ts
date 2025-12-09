import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface CityResponse {
	city: string
	cityId: string
}

async function fetchCitiesList(): Promise<CityResponse[]> {
	const client = await getMainClient()
	const response = await client.get<CityResponse[]>('/cities/list')
	return response.data
}

export function useGetCitiesList(enabled: boolean) {
	return useQuery({
		queryKey: ['getCitiesList'],
		queryFn: fetchCitiesList,
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
}
