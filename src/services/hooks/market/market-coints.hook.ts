import { useMutation, useQuery } from '@tanstack/react-query'
import type {
	GetCoinPackagesResponse,
	PurchaseCoinPackageInput,
	PurchaseCoinPackageResponse,
} from './market-coins.interface'
import { getMainClient } from '@/services/api'

interface GetCoinPackagesParams {
	limit?: number
	page?: number
}

const getCoinPackages = async (
	params: GetCoinPackagesParams
): Promise<GetCoinPackagesResponse> => {
	const api = await getMainClient()
	const response = await api.get('/market/packages/coins', {
		params: {
			limit: params.limit || 12,
			page: params.page || 1,
		},
	})

	return {
		packages: response.data.data.packages,
		totalPages: response.data.data.totalPages || 1,
		currentPage: response.data.data.currentPage || params.page || 1,
		totalCount: response.data.data.totalCount || response.data.data.packages.length,
	}
}

export const useGetCoinPackages = (params: GetCoinPackagesParams = {}) => {
	return useQuery({
		queryKey: ['coinPackages', params],
		queryFn: () => getCoinPackages(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
}

const purchaseCoinPackage = async (
	data: PurchaseCoinPackageInput
): Promise<PurchaseCoinPackageResponse> => {
	const api = await getMainClient()

	const response = await api.post('/market/packages/coins/purchase', data)

	if (response.data.data?.url) {
		window.location.href = response.data.data.url
	}

	return response.data.data
}

export const usePurchaseCoinPackage = () => {
	return useMutation({
		mutationFn: purchaseCoinPackage,
	})
}
