import { useMutation, useQuery } from '@tanstack/react-query'
import type {
	GetVipPlansResponse,
	PurchaseVipPlanInput,
	PurchaseVipPlanResponse,
	VipPlan,
} from './market-vip.interface'
import { getMainClient } from '@/services/api'

const getVipPlans = async (): Promise<VipPlan[]> => {
	const api = getMainClient()
	const { data } = await api.get<{ data: GetVipPlansResponse }>('/market/packages/vip')

	return data.data?.packages || []
}

export const useGetVipPlans = () => {
	return useQuery({
		queryKey: ['vipPlans'],
		queryFn: getVipPlans,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})
}

const purchaseVipPlan = async (
	data: PurchaseVipPlanInput
): Promise<PurchaseVipPlanResponse> => {
	const api = getMainClient()
	const response = await api.post('/market/packages/vip/purchase', data)

	const paymentUrl = response.data?.data?.url || response.data?.url

	if (paymentUrl) {
		window.location.href = paymentUrl
	}

	return response.data?.data || response.data
}

export const usePurchaseVipPlan = () => {
	return useMutation({
		mutationFn: purchaseVipPlan,
	})
}
