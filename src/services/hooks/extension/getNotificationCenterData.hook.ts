import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export interface NotificationCenterBirthday {
	name: string
	date: string
	avatar?: string
}

export interface NotificationCenterNotification {
	content: string // can be HTML
	timestamp: string | null
}

export interface NotificationCenterEmailMessage {
	id: string
	threadId: string
	subject: string
	sender: string
	snippet: string
}

export interface NotificationCenterDataResponse {
	data: {
		birthdays: NotificationCenterBirthday[]
		notifications: NotificationCenterNotification[]
		emailMessages: NotificationCenterEmailMessage[]
	}
}

async function fetchNotificationCenterData(
	timezone: string
): Promise<NotificationCenterDataResponse> {
	const client = await getMainClient()
	const { data } = await client.get<NotificationCenterDataResponse>(
		'/extension/notification-center-data',
		{
			params: {
				timezone,
			},
		}
	)
	return data
}

export function useGetNotificationCenterData(options: {
	timezone: string
	enabled?: boolean
	refetchInterval?: number | null
}) {
	const { enabled = true, refetchInterval = null } = options

	return useQuery<NotificationCenterDataResponse>({
		queryKey: ['notification-center-data'],
		queryFn: () => fetchNotificationCenterData(options.timezone),
		enabled,
		refetchInterval: refetchInterval || false,
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
