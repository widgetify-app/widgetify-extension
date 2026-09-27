import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { contentKeys } from '@/services/content/content.keys'

export interface ExplorerCategoryBadge {
	label?: string
	iconSrc?: string
	bgColor?: string
	textColor?: string
	url?: string
}
export interface FetchedContent {
	id: string
	category: string
	hideName?: boolean
	icon?: string
	banner?: string
	links: {
		name: string
		url: string
		type: 'SITE' | 'REMOTE_IFRAME' | 'BANNER' | 'MINI_APP'
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
		miniAppAuthRequired?: boolean
	}[]
	lockHeight?: boolean
	badges: ExplorerCategoryBadge[]
	span?: {
		col?: number | null
		row?: number | null
	}
}
;[]
interface FetchedContentsResponse {
	contents: FetchedContent[]
}

export const useGetContents = () => {
	return useQuery<FetchedContentsResponse>({
		queryKey: contentKeys.all,
		queryFn: async () => {
			const api = getMainClient()

			const { data } = await api.get<FetchedContentsResponse>('/contents')
			return data
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
