import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { getFromStorage, setToStorage } from '@/common/storage'

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
	const client = getMainClient()
	const { data } = await client.get<{ data: NotificationItemResponse }>(
		'/extension/notifications'
	)

	return data.data
}

export function useGetNotifications() {
	const [cachedData, setCachedData] = useState<NotificationItemResponse | undefined>(
		undefined
	)

	useEffect(() => {
		getFromStorage('notifications').then((cached) => {
			if (cached) setCachedData(cached)
		})
	}, [])

	return useQuery<NotificationItemResponse>({
		queryKey: ['notifications'],
		retry: 1,
		queryFn: async () => {
			const response = await fetchNotifications()
			await setToStorage('notifications', response)
			return response
		},
		placeholderData: cachedData,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

export function useNotifyAsSeen() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (id: string) => {
			const client = getMainClient()
			await client.put(`/notifications/${id}/seen`)
		},
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: ['notifications'] })
			const previous = queryClient.getQueryData<NotificationItemResponse>([
				'notifications',
			])
			if (previous) {
				const updated: NotificationItemResponse = {
					...previous,
					wigiPad: previous.wigiPad?.filter((item) => item.id !== id) || [],
					widgetifyCard:
						previous.widgetifyCard?.filter((item) => item.id !== id) || [],
				}
				queryClient.setQueryData(['notifications'], updated)
				await setToStorage('notifications', updated)
			}
			return { previous }
		},
		onError: (_err, _id, context) => {
			if (context?.previous) {
				queryClient.setQueryData(['notifications'], context.previous)
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['notifications'],
			})
		},
		mutationKey: ['seen_notification'],
	})
}
