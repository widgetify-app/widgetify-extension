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
		refetchOnWindowFocus: false,
	})
}

async function getMoods(start: string, end: string): Promise<GetMoodsResponse> {
	const client = getMainClient()
	const { data } = await client.get<any>(
		`/users/@me/moods?start=${start}&end=${end}`
	)

	if (!data) return { moods: [] }
	if (Array.isArray(data)) return { moods: data }
	if (Array.isArray(data.moods)) return { moods: data.moods }
	if (Array.isArray(data.data)) return { moods: data.data }
	if (data.data && Array.isArray(data.data.moods)) return { moods: data.data.moods }
	return { moods: [] }
}
