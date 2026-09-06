import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export type MoodType = 'sad' | 'tired' | 'happy' | 'excited' | 'normal'

export interface MoodLogEntry {
	id?: string
	userId?: string
	mood: MoodType
	date: string | Date
}

export interface MoodStatsResponse {
	userName?: string
	userAvatar?: string | null
	logs: MoodLogEntry[]
	currentJalaliYear?: number
	currentJalaliMonth?: number
	currentJalaliMonthName?: string
	insightText?: string
	badge?: {
		label: string
		color: string
	}
}

export const useGetMoodStats = (enabled: boolean) => {
	return useQuery<MoodStatsResponse>({
		queryKey: ['get-mood-stats'],
		queryFn: async () => getMoodStats(),
		retry: 0,
		enabled,
		refetchOnWindowFocus: false,
	})
}

async function getMoodStats(): Promise<MoodStatsResponse> {
	const client = getMainClient()
	const { data } = await client.get<any>('/users/@me/moods/stats')

	if (!data) return { logs: [] }
	if (data.data) {
		return {
			...data.data,
			logs: Array.isArray(data.data.logs) ? data.data.logs : [],
		}
	}
	return {
		...data,
		logs: Array.isArray(data.logs) ? data.logs : [],
	}
}
