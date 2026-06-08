import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { CacheName, type SwEvent, SwEventType } from '@/common/types/sw-events'

export type NotificationType = 'text' | 'url' | 'action' | 'page' | 'banner'
export enum NotificationGoTo {
	Explorer = 'explorer',
	Profile = 'openProfile',
	Settings = 'openSettings',
}

export interface NotificationItem {
	id?: string
	title: string
	description?: string
	link?: string
	icon?: string
	closeable: boolean | null
	type?: NotificationType
	goTo?: NotificationGoTo
	target?: string
	backgroundColor?: string
	borderRadius?: string
	titleColor?: string
	titleDecoration?: string
	ttl?: number
	hasBorder?: boolean
	hight?: number
	createdAt?: string
}

export interface DialogNotificationItem {
	id: string
	title: string
	dialogTitle: string | null
	description: string
	media: string
	link: string
	type: NotificationType
	target: string
	goTo: NotificationGoTo
	buttonColor: string
	buttonLabel: string
}

export interface NotificationItemResponse {
	wigiPad: Array<NotificationItem>
	widgetifyCard: Array<NotificationItem>
	dialog: DialogNotificationItem | null
	wigipadBanner: string | null
}

async function fetchNotifications(): Promise<NotificationItemResponse> {
	const client = await getMainClient()
	const { data } = await client.get<{ data: NotificationItemResponse }>(
		'/extension/notifications'
	)

	return data.data
}

export function useGetNotifications() {
	return useQuery<NotificationItemResponse>({
		queryKey: ['notifications'],
		retry: 1,
		queryFn: () => fetchNotifications(),
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
