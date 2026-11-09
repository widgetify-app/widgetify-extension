import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { getFromStorage } from '@/common/storage'
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

const closedThisSession = new Set<string>()

async function fetchNotifications(): Promise<NotificationsData> {
	const client = getMainClient()
	const token = await getFromStorage('auth_token')

	const response = await client.get<{
		data: { items: RawInboxItem[]; surfaces: RawSurfaces }
	}>('/v2/notifications/feed')

	const { items, surfaces } = response.data.data

	return buildNotifications(items, surfaces, token ? new Set() : closedThisSession)
}

export function useGetNotifications() {
	return useQuery<NotificationsData>({
		queryKey: extensionKeys.notifications,
		retry: 1,
		queryFn: fetchNotifications,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

function without(data: NotificationsData, ids: ReadonlySet<string>): NotificationsData {
	return {
		cards: data.cards.filter((item) => !ids.has(item.id as string)),
		island: data.island && ids.has(data.island.id) ? null : data.island,
		dialog: data.dialog && ids.has(data.dialog.id) ? null : data.dialog,
	}
}

export function useNotifyAsSeen() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (id: string) => {
			const client = getMainClient()
			const token = await getFromStorage('auth_token')

			if (!token) {
				closedThisSession.add(id)
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
				queryClient.setQueryData(
					extensionKeys.notifications,
					without(previous, new Set([id]))
				)
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
				for (const id of [...plan.inbox, ...plan.broadcasts].flat()) {
					closedThisSession.add(id)
				}

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

				queryClient.setQueryData(
					extensionKeys.notifications,
					without(previous, marked)
				)
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
