import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface TopUser {
	duration: number
	name: string
	avatar: string
	username: string | null
	id: string
	friendshipStatus: 'PENDING' | 'ACCEPTED' | null
	isSelf?: boolean
	rank: number | null
}

export interface TopUsersResponse {
	tops: TopUser[]
}

export enum TopUsersType {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
	ALL_TIME = 'ALL_TIME',
}
export function useGetTopUsers(type: TopUsersType) {
	return useQuery({
		queryKey: ['pomodoro', 'top-users', type],
		queryFn: async (): Promise<TopUsersResponse> => {
			const client = await getMainClient()
			const res = await client.get<TopUsersResponse>('/pomodoro/tops', {
				params: { type },
			})
			return res.data
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
