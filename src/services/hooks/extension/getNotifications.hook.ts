import { useMutation, useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { CacheName, type SwEvent, SwEventType } from '@/common/types/sw-events'

export interface NotificationItem {
	id?: string
	title: string
	description?: string
	link?: string
	icon?: string
	closeable: boolean | null
	type?: 'text' | 'url' | 'action' | 'page' | 'banner'
	goTo?: 'explorer' | 'openProfile' | 'openSettings'
	target?: string
	backgroundColor?: string
	borderRadius?: string
	titleColor?: string
	titleDecoration?: string
	ttl?: number
	hasBorder?: boolean
	hight?: number
}

export interface NotificationItemResponse {
	wigiPad: Array<NotificationItem>
	widgetifyCard: Array<NotificationItem>
}

async function fetchNotifications(q: {
	timezone?: string
}): Promise<NotificationItemResponse> {
	const client = await getMainClient()
	const { data } = await client.get<{ data: NotificationItemResponse }>(
		'/extension/notifications',
		{
			params: q,
		}
	)

	return data.data
}

export function useGetNotifications(options: {
	enabled?: boolean
	refetchInterval?: number | null
	timezone?: string
}) {
	const { enabled = true, refetchInterval = null } = options

	return useQuery<NotificationItemResponse>({
		queryKey: ['notifications'],
		queryFn: () => fetchNotifications({ timezone: options.timezone }),
		enabled,
		refetchInterval: refetchInterval || false,
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

export function useNotifyAsSeen() {
	return useMutation({
		mutationFn: async (id: string) => {
			const client = await getMainClient()
			await client.put(`/notifications/${id}/seen`)
		},
		onSuccess: () => {
			browser.runtime.sendMessage<SwEvent>({
				cacheName: CacheName.API,
				type: SwEventType.DeleteCache,
				path: '/extension/notifications',
			})
		},
		mutationKey: ['seen_notification'],
	})
}
