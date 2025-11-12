import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface PurchaseMarketItemParams {
	itemId: string
}

export interface PurchaseMarketItemResponse {
	success: boolean
	message: string
	remainingCoins: number
}

export const usePurchaseMarketItem = () => {
	const queryClient = useQueryClient()

	return useMutation<PurchaseMarketItemResponse, Error, PurchaseMarketItemParams>({
		mutationFn: async (params: PurchaseMarketItemParams) =>
			purchaseMarketItem(params),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getUser'] })
			queryClient.invalidateQueries({ queryKey: ['getUserPurchases'] })
		},
	})
}

export async function purchaseMarketItem(
	params: PurchaseMarketItemParams
): Promise<PurchaseMarketItemResponse> {
	const client = await getMainClient()
	const { data } = await client.post<PurchaseMarketItemResponse>(
		'/market/purchase',
		params
	)
	return data
}
