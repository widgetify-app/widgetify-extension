import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../api'

export interface DailyMessageResponse {
	content: string
}

async function fetchDailyMessage(): Promise<DailyMessageResponse> {
	const client = await getMainClient()
	const { data } = await client.get<DailyMessageResponse>('/extension/day/daily')
	return data
}

export function useGetDailyMessage(
	options: {
		enabled?: boolean
	} = {},
) {
	return useQuery<DailyMessageResponse>({
		queryKey: ['daily-message'],
		queryFn: fetchDailyMessage,
		enabled: options.enabled !== false,
		refetchOnWindowFocus: false,
		retry: 1,
	})
}
