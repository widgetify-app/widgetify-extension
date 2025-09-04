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

export function useGetTopUsers() {
	return useQuery({
		queryKey: ['pomodoro', 'top-users'],
		queryFn: async (): Promise<TopUsersResponse> => {
			const client = await getMainClient()
			const res = await client.get<TopUsersResponse>('/pomodoro/tops')
			return res.data
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
