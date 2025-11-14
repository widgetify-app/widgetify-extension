import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface ReferralUser {
	name: string
	avatar: string
	username: string | null
}

export interface UserReferrals {
	referrals: ReferralUser[]
	totalPages: number
	totalCount: number
}

export interface Task {
	task: string
	reward_coin: string
	isDone: boolean
	icon: string
	button?: {
		label: string
		type: 'link'
		url: string
	}
}

export interface ReferralsResponse extends UserReferrals {
	code: string
	tasks: Task[]
}

export interface GetReferralsParams {
	page?: number
	limit?: number
	enabled?: boolean
}

async function getReferrals(params: GetReferralsParams = {}): Promise<ReferralsResponse> {
	const { page, limit } = params
	const client = await getMainClient()

	const queryParams = new URLSearchParams()
	if (page !== undefined) queryParams.append('page', page.toString())
	if (limit !== undefined) queryParams.append('limit', limit.toString())

	const response = await client.get<ReferralsResponse>(
		`/users/@me/rewards?${queryParams.toString()}`
	)
	return response.data
}

export function useGetReferrals(params: GetReferralsParams = {}) {
	return useQuery({
		queryKey: ['referrals', params.page, params.limit],
		queryFn: () => getReferrals(params),
		retry: 1,
		enabled: params.enabled !== undefined ? params.enabled : true,
	})
}

async function getOrCreateReferralCode(): Promise<{ referralCode: string }> {
	const client = await getMainClient()
	const response = await client.get<{ referralCode: string }>('/users/@me/rewards/code')
	return response.data
}

export function useGetOrCreateReferralCode(enabled: boolean) {
	return useQuery({
		queryKey: ['getOrCreateReferralCode'],
		queryFn: getOrCreateReferralCode,
		staleTime: Infinity,
		enabled,
	})
}
