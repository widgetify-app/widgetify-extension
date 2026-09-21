import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export interface ExplorerCategoryBadge {
	label?: string
	iconSrc?: string
	bgColor?: string
	textColor?: string
	url?: string
}
export interface CatalogItemPromo {
	title?: string
	code?: string
	discount?: string
	badge?: string
	expiresText?: string
	targetUrl?: string
	highlights?: string[]
}

export interface CatalogItemMenuItem {
	id?: string
	title: string
	url: string
	badge?: string
	icon?: string
	isExternal?: boolean
}

export interface CatalogItemMeta {
	type?: 'POPOVER_MENU'
	action?: 'OPEN_MODAL' | 'OPEN_POPOVER' | 'DIRECT_URL'
	title?: string
	description?: string
	badge?: string
	gallery?: string[]
	promo?: CatalogItemPromo
	menuItems?: CatalogItemMenuItem[]
}

export interface FetchedContent {
	id: string
	category: string
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
		isNew: boolean
		badge?: string
		badgeColor?: string
		description?: string
		backgroundSrc?: string
		miniAppAuthRequired?: boolean
		meta?: CatalogItemMeta
	}[]
	lockHeight?: boolean

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
			const api = getMainClient()

			const { data } = await api.get<FetchedContentsResponse>('/contents')
			return data
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
