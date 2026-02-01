import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { ReactNode } from 'react'

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

export interface UpcomingCalendarEvent {
	id: string
	title: string
	start: string
	end: string
	description: string | null
	htmlLink: string
	location: string | null
	platformLink: string | null
}

export interface NotificationItem {
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
}
export interface WigiPadDataResponse {
	birthdays: WigiPadBirthday[]
	notifications: WigiPadNotification[]
	upcomingCalendarEvents: UpcomingCalendarEvent[]
	widgetifyCardNotifications: NotificationItem[]
}

async function fetchWigiPadData(timezone: string): Promise<WigiPadDataResponse> {
	const client = await getMainClient()
	const { data } = await client.get<{
		data: WigiPadDataResponse
	}>('/extension/wigi-pad-data', {
		params: {
			timezone,
		},
	})

	return data.data
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
