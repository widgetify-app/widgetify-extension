import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export interface MoodEntry {
	mood: 'sad' | 'normal' | 'happy' | 'excited'
	date: string // "2025-11-20"
}

export interface GetMoodsResponse {
	moods: MoodEntry[]
}

export const useGetMoods = (enabled: boolean, start: string, end: string) => {
	return useQuery<GetMoodsResponse>({
		queryKey: ['get-moods', start, end],
		queryFn: async () => getMoods(start, end),
		retry: 0,
		enabled: enabled && !!start && !!end,
		initialData: {
			moods: [],
		},
		refetchOnWindowFocus: false,
	})
}

async function getMoods(start: string, end: string): Promise<GetMoodsResponse> {
	const client = await getMainClient()
	const { data } = await client.get<GetMoodsResponse>(
		`/users/@me/moods?start=${start}&end=${end}`
	)
	return data ?? { moods: [] }
}
