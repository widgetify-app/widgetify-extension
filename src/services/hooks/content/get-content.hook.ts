import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export interface FetchedContent {
	id: string
	category: string
	hideName?: boolean
	icon?: string
	banner?: string
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
		hasBorder: boolean
		isNew: boolean
		badge?: string
		badgeColor?: string
		backgroundSrc?: string
		badgeAnimate?: 'bounce' | 'pulse'
	}[]
	span?: {
		col?: number | null
		row?: number | null
	}
}
;[]
export interface FetchedContentsResponse {
	contents: FetchedContent[]
}

export const useGetContents = () => {
	return useQuery<FetchedContentsResponse>({
		queryKey: ['contents'],
		queryFn: async () => {
			const api = await getMainClient()

			const { data } = await api.get<FetchedContentsResponse>('/contents')
			return data
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
