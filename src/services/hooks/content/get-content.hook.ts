import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export interface FetchedContent {
	contents: {
		id: string
		category: string
		icon?: string
		links: {
			name: string
			url: string
			type: 'SITE' | 'REMOTE_IFRAME'
			icon?: string
			span?: {
				col?: number | null
				row?: number | null
			}
			height?: number
		}[]
		span?: {
			col?: number | null
			row?: number | null
		}
	}[]
}

export const useGetContents = () => {
	return useQuery<FetchedContent>({
		queryKey: ['contents'],
		queryFn: async () => {
			const api = await getMainClient()

			const { data } = await api.get<FetchedContent>('/contents')
			return data
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
