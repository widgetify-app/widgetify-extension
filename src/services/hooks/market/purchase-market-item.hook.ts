import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

interface PurchaseMarketItemParams {
	itemId: string
}

interface PurchaseMarketItemResponse {
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

async function purchaseMarketItem(
	params: PurchaseMarketItemParams
): Promise<PurchaseMarketItemResponse> {
	const client = getMainClient()
	const { data } = await client.post<PurchaseMarketItemResponse>(
		'/market/purchase',
		params
	)
	return data
}
