import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { getFromStorage, setToStorage } from '@/common/storage'
import { extensionKeys } from '@/services/extension/extension.keys'
import { buildNotifications, planMarkAll } from './notification-map'
import type {
	NotificationItem,
	NotificationsData,
	RawInboxItem,
	RawSurfaces,
} from './notification.interface'

export type {
	DialogNotificationItem,
	IslandNotificationItem,
	NotificationItem,
	NotificationsData,
} from './notification.interface'

async function fetchNotifications(): Promise<NotificationsData> {
	const client = getMainClient()
	const token = await getFromStorage('auth_token')

	const [inbox, surfaces, dismissed] = await Promise.all([
		token
			? client
					.get<{ data: { items: RawInboxItem[] } }>('/v2/notifications/inbox')
					.catch(() => null)
			: null,
		client.get<{ data: RawSurfaces }>('/v2/notifications/surfaces'),
		token ? [] : getFromStorage('dismissed_notifications'),
	])

	return buildNotifications(
		inbox?.data.data.items ?? [],
		surfaces.data.data,
		new Set(dismissed ?? [])
	)
}

export function useGetNotifications() {
	const [cachedData, setCachedData] = useState<NotificationsData | undefined>(undefined)

	useEffect(() => {
		getFromStorage('inbox').then((cached) => {
			if (cached) setCachedData(cached)
		})
	}, [])

	return useQuery<NotificationsData>({
		queryKey: extensionKeys.notifications,
		retry: 1,
		queryFn: async () => {
			const response = await fetchNotifications()
			await setToStorage('inbox', response)
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
			const token = await getFromStorage('auth_token')

			if (!token) {
				const dismissed = (await getFromStorage('dismissed_notifications')) ?? []
				await setToStorage('dismissed_notifications', [...dismissed, id])
				return
			}

			const current = queryClient.getQueryData<NotificationsData>(
				extensionKeys.notifications
			)
			const isInboxItem = current?.cards.some(
				(card) => card.id === id && card.source === 'inbox'
			)

			if (isInboxItem) {
				await client.post('/v2/notifications/read', { ids: [id] })
			} else {
				await client.post(`/v2/notifications/surfaces/${id}/dismiss`)
			}
		},
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: extensionKeys.notifications })
			const previous = queryClient.getQueryData<NotificationsData>(
				extensionKeys.notifications
			)
			if (previous) {
				const updated: NotificationsData = {
					cards: previous.cards.filter((item) => item.id !== id),
					island: previous.island?.id === id ? null : previous.island,
					dialog: previous.dialog?.id === id ? null : previous.dialog,
				}
				queryClient.setQueryData(extensionKeys.notifications, updated)
				await setToStorage('inbox', updated)
			}
			return { previous }
		},
		onError: (_err, _id, context) => {
			if (context?.previous) {
				queryClient.setQueryData(extensionKeys.notifications, context.previous)
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: extensionKeys.notifications,
			})
		},
		mutationKey: extensionKeys.seenNotification,
	})
}

export function useMarkAllAsSeen() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (cards: NotificationItem[]) => {
			const client = getMainClient()
			const token = await getFromStorage('auth_token')
			const plan = planMarkAll(cards)

			if (!token) {
				const ids = [...plan.inbox, ...plan.broadcasts].flat()
				const dismissed = (await getFromStorage('dismissed_notifications')) ?? []

				await setToStorage('dismissed_notifications', [...dismissed, ...ids])
				return
			}

			await Promise.all([
				...plan.inbox.map((ids) =>
					client.post('/v2/notifications/read', { ids })
				),
				...plan.broadcasts.map((ids) =>
					client.post('/v2/notifications/surfaces/dismiss', { ids })
				),
			])
		},
		onMutate: async (cards: NotificationItem[]) => {
			await queryClient.cancelQueries({ queryKey: extensionKeys.notifications })
			const previous = queryClient.getQueryData<NotificationsData>(
				extensionKeys.notifications
			)

			if (previous) {
				const plan = planMarkAll(cards)
				const marked = new Set([...plan.inbox, ...plan.broadcasts].flat())

				const updated: NotificationsData = {
					...previous,
					cards: previous.cards.filter(
						(item) => !marked.has(item.id as string)
					),
				}

				queryClient.setQueryData(extensionKeys.notifications, updated)
				await setToStorage('inbox', updated)
			}

			return { previous }
		},
		onError: (_err, _cards, context) => {
			if (context?.previous) {
				queryClient.setQueryData(extensionKeys.notifications, context.previous)
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: extensionKeys.notifications })
		},
		mutationKey: extensionKeys.seenNotification,
	})
}
