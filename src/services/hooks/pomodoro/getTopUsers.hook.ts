import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface TopUser {
	duration: number
	user: string
	avatar: string
	usernameExists: boolean
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
