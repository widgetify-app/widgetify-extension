export interface VipPlan {
	id: string
	title: string
	price: number
	days: number
	isActive: boolean
	order?: number | null
	meta?: {
		badge?: string
		description?: string
		[key: string]: any
	} | null
	createdAt?: string
	updatedAt?: string
}

export interface GetVipPlansResponse {
	packages: VipPlan[]
}

export interface PurchaseVipPlanInput {
	packageId: string
}

export interface PurchaseVipPlanResponse {
	url?: string
}
