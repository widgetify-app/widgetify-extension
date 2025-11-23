import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import type { GoogleCalendarEvent } from '../date/getGoogleCalendarEvents.hook'

export interface FetchedUserMood {
	mood: 'sad' | 'normal' | 'happy' | 'excited'
	date: string // "2025-11-20"
}

export interface GetCalendarDataResponse {
	moods: FetchedUserMood[]
	googleEvents: GoogleCalendarEvent[]
}

export const useGetCalendarData = (enabled: boolean, start: string, end: string) => {
	return useQuery<GetCalendarDataResponse>({
		queryKey: ['get-calendar-data', start, end],
		queryFn: async () => getCalendarData(start, end),
		retry: 0,
		enabled: enabled && !!start && !!end,
		initialData: {
			moods: [],
			googleEvents: [],
		},
		refetchOnWindowFocus: false,
	})
}

async function getCalendarData(
	start: string,
	end: string
): Promise<GetCalendarDataResponse> {
	const client = await getMainClient()
	const { data } = await client.get<GetCalendarDataResponse>(
		`/widgets/calendar?start=${start}&end=${end}`
	)
	return data ?? { moods: [], googleEvents: [] }
}
