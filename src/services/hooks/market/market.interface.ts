export type MarketItemType = 'BROWSER_TITLE' | 'FONT' | 'THEME' | 'wallpapers' | string

export interface MarketItem {
	id: string
	name: string
	description: string
	type: MarketItemType
	price: number
	meta: Record<string, any>
	previewUrl: string | null
	itemValue?: string
	isOwned: boolean
}

export interface MarketResponse {
	totalPages: number
	items: MarketItem[]
}

export interface MarketQueryParams {
	page?: number
	limit?: number
	type?: MarketItemType
}

export interface UserInventoryItem {
	id: string
	type: MarketItemType
	name?: string
	description?: string
	value: string
	previewUrl?: string
}

export interface UserInventoryResponse {
	fonts: UserInventoryItem[]
	browser_titles: UserInventoryItem[]
	themes: UserInventoryItem[]
	pagination: {
		totalPages: number
		total: number
	}
}
