export interface CoinPackage {
	id: string
	price: number
	title: string
	description: string
	coin: number
}

export interface GetCoinPackagesResponse {
	packages: CoinPackage[]
	totalPages: number
	currentPage: number
	totalCount: number
}

export interface PurchaseCoinPackageInput {
	packageId: string
}

export interface PurchaseCoinPackageResponse {
	success: boolean
	message?: string
	paymentUrl?: string
}
