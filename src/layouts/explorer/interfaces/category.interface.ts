import type { LinkItem } from './catalog-item.interface'

export interface CategoryItem {
	id: string
	category: string
	hideName?: boolean
	banner?: string
	links: LinkItem[]
	icon?: string
	span?: {
		col?: number | null
		row?: number | null
	}
}
