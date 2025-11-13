export type MarketItemType = 'BROWSER_TITLE' | 'FONT' | 'THEME' | string

export interface MarketItem {
	id: string
	name: string
	description: string
	type: MarketItemType
	price: number
	meta: Record<string, any>
	previewUrl: string | null
	itemValue?: string
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

export interface UserInventoryResponse {
	fonts: MarketItem[]
	browser_titles: MarketItem[]
	themes: MarketItem[]
	pagination: {
		totalPages: number
		total: number
	}
}
