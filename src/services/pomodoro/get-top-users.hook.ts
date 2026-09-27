import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { pomodoroKeys } from '@/services/pomodoro/pomodoro.keys'

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

interface TopUsersResponse {
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
		queryKey: pomodoroKeys.topUsers(type),
		queryFn: async (): Promise<TopUsersResponse> => {
			const client = getMainClient()
			const res = await client.get<TopUsersResponse>('/pomodoro/tops', {
				params: { type },
			})
			return res.data
		},
		staleTime: 1 * 60 * 1000, //1 minute
	})
}
