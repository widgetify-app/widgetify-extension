import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export const useGetTags = (enabled: boolean) => {
	return useQuery<string[]>({
		queryKey: ['getTags'],
		queryFn: async () => getTags(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled,
	})
}
export async function getTags(): Promise<string[]> {
	const client = await getMainClient()
	const { data } = await client.get<string[]>('/todos/@me/tags')
	return data
}
