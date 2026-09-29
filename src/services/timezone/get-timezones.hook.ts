import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { timezoneKeys } from '@/services/timezone/timezone.keys'

export interface FetchedTimezone {
	label: string
	value: string
	offset: string
}

export async function getTimezones(): Promise<FetchedTimezone[]> {
	try {
		const api = getMainClient()
		const response = await api.get<FetchedTimezone[]>('/date/timezones')
		return response.data
	} catch {
		return []
	}
}

export function useTimezones(enabled: boolean = true) {
	// react query
	return useQuery<FetchedTimezone[]>({
		queryKey: timezoneKeys.list,
		queryFn: getTimezones,
		enabled,
		gcTime: 1000 * 60 * 5, // 5 minutes
	})
}
