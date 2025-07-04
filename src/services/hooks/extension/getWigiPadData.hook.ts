import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export interface WigiPadBirthday {
	name: string
	date: string
	avatar?: string
}

export interface WigiPadNotification {
	content: string // can be HTML
	timestamp: string | null
}

export interface WigiPadEmailMessage {
	id: string
	threadId: string
	subject: string
	sender: string
	snippet: string
}

export interface WigiPadDataResponse {
	data: {
		birthdays: WigiPadBirthday[]
		notifications: WigiPadNotification[]
		emailMessages: WigiPadEmailMessage[]
	}
}

async function fetchWigiPadData(timezone: string): Promise<WigiPadDataResponse> {
	const client = await getMainClient()
	const { data } = await client.get<WigiPadDataResponse>('/extension/wigi-pad-data', {
		params: {
			timezone,
		},
	})
	return data
}

export function useGetWigiPadData(options: {
	timezone: string
	enabled?: boolean
	refetchInterval?: number | null
}) {
	const { enabled = true, refetchInterval = null } = options

	return useQuery<WigiPadDataResponse>({
		queryKey: ['wigi-pad-data'],
		queryFn: () => fetchWigiPadData(options.timezone),
		enabled,
		refetchInterval: refetchInterval || false,
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
