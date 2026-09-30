export enum MarketItemType {
	BROWSER_TITLE = 'BROWSER_TITLE',
	FONT = 'FONT',
	THEME = 'THEME',
	PET = 'PET',
	PET_BACKGROUND = 'PET_BACKGROUND',
	wallpapers = 'wallpapers',
}

export interface MarketItem {
	id: string
	name: string
	description: string
	type: MarketItemType
	price: number
	meta: Record<string, any>
	imageUrl?: string | null
	previewUrl: string | null
	itemValue?: string
	isOwned: boolean
	canPreview?: boolean
}

export interface MarketResponse {
	totalPages: number
	total?: number
	items: MarketItem[]
}

export interface MarketQueryParams {
	page?: number
	limit?: number
	type?: MarketItemType | string
}

export interface UserInventoryItem {
	id: string
	type: MarketItemType
	name?: string
	description?: string
	value: string
	imageUrl?: string
	previewUrl?: string
	meta?: Record<string, any>
}

export interface UserInventoryResponse {
	fonts: UserInventoryItem[]
	browser_titles: UserInventoryItem[]
	themes: UserInventoryItem[]
	pets?: UserInventoryItem[]
	pet_backgrounds?: UserInventoryItem[]
	pagination: {
		totalPages: number
		total: number
	}
}
