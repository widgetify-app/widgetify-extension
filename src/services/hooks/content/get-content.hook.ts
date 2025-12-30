import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export interface FetchedContent {
	contents: {
		id: string
		category: string
		links: { name: string; url: string; icon?: string }[]
	}[]
}

export const useGetContents = () => {
	return useQuery<FetchedContent>({
		queryKey: ['contents'],
		queryFn: async () => {
			const api = await getMainClient()

			const { data } = await api.get<FetchedContent>('/contents/beta')
			return data
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
