import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { ReactNode } from 'react'

export interface NotificationItem {
	id?: string
	title?: string
	subTitle?: string
	description?: string
	node?: ReactNode
	link?: string
	icon?: string
	closeable?: boolean
	ttl?: number
	type?: 'text' | 'url' | 'action' | 'page'
	goTo?: 'explorer'
	target?: string
}

export interface NotificationItemResponse {
	data: {
		notifications: Array<{
			id?: string
			title: string
			subTitle: string
			description?: string
			link?: string
			icon?: string
			closeable: boolean | null
			type?: 'text' | 'url' | 'action' | 'page'
			goTo?: 'explorer'
			target?: string
		}>
		upcomingCalendarEvents: any[]
	}
}

async function fetchNotifications(): Promise<NotificationItemResponse> {
	const client = await getMainClient()
	const { data } = await client.get<NotificationItemResponse>('/notifications/beta')

	return data
}

export function useGetNotifications(options: {
	enabled?: boolean
	refetchInterval?: number | null
}) {
	const { enabled = true, refetchInterval = null } = options

	return useQuery<NotificationItemResponse>({
		queryKey: ['notifications'],
		queryFn: () => fetchNotifications(),
		enabled,
		refetchInterval: refetchInterval || false,
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
