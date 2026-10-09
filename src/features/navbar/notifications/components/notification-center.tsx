import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { NotificationCardItem } from './notification-item'
import { listenEvent } from '@/common/utils/call-event'
import { getWithExpiry, setToStorage, setWithExpiry } from '@/common/storage'
import {
	useGetNotifications,
	useNotifyAsSeen,
} from '@/services/extension/get-notifications.hook'
import Analytics from '@/analytics'
import { useAuth } from '@/context/auth.context'
import { DailyMoodNotification } from './daily-mood'
import { ProfileProgressNotification } from './profile-progress'
import { safeAwait } from '@/services/api'
import { EmptyState } from '@/components/ui'
import { t } from '@/common/i18n'

const localIds = ['notificationMood', 'update_profile']

interface PushedNotification {
	id: string
	node: ReactNode
}

interface Prop {
	hasBorder?: boolean
}

export function NotificationCenter({ hasBorder }: Prop = { hasBorder: true }) {
	const { user, isAuthenticated, isLoadingUser, profilePercentage } = useAuth()
	const { data: fetchedNotifications } = useGetNotifications()
	const { mutateAsync: notifyAsSeen } = useNotifyAsSeen()

	const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
	const [pushed, setPushed] = useState<PushedNotification[]>([])

	const notifications = useMemo(() => {
		const items = fetchedNotifications?.widgetifyCard || []
		return items.filter((item) => item.id && !dismissedIds.has(item.id))
	}, [fetchedNotifications?.widgetifyCard, dismissedIds])

	const addToNodes = useCallback(async (notif: PushedNotification) => {
		const removedRecently = await getWithExpiry(`removed_notification_${notif.id}`)
		if (removedRecently) return

		setPushed((prev) =>
			prev.some((item) => item.id === notif.id) ? prev : [...prev, notif]
		)
	}, [])

	const removeFromNodes = useCallback((id: string) => {
		setPushed((prev) =>
			prev.some((item) => item.id === id)
				? prev.filter((item) => item.id !== id)
				: prev
		)
	}, [])

	useEffect(() => {
		if (isAuthenticated && !isLoadingUser) {
			if (user?.hasTodayMood === false && !user?.inCache) {
				addToNodes({
					id: 'notificationMood',
					node: (
						<DailyMoodNotification
							className={`${hasBorder ? '' : 'border-none!'}`}
						/>
					),
				})
			}

			if (
				user?.progressbar?.length &&
				!user.isProfileCompleted &&
				profilePercentage > 0
			) {
				addToNodes({
					id: 'update_profile',
					node: (
						<ProfileProgressNotification
							className={`${hasBorder ? '' : 'border-none!'}`}
						/>
					),
				})
			} else {
				removeFromNodes('update_profile')
			}
		}
	}, [isAuthenticated, user, hasBorder, addToNodes, removeFromNodes])

	useEffect(() => {
		const addEvent = listenEvent('add_to_notifications', addToNodes)

		const removeEvent = listenEvent(
			'remove_from_notifications',
			async ({ id, ttl }) => {
				removeFromNodes(id)
				if (ttl) {
					await setWithExpiry(`removed_notification_${id}`, 'true', ttl)
				} else {
					await setToStorage(`removed_notification_${id}`, 'true')
				}
			}
		)

		return () => {
			addEvent()
			removeEvent()
		}
	}, [addToNodes, removeFromNodes])

	const onClose = async (e: any, id: string, ttl = 1200) => {
		e.preventDefault()
		setDismissedIds((prev) => new Set([...prev, id]))
		Analytics.event('notifications_close')

		if (!localIds.includes(id)) {
			await safeAwait(notifyAsSeen(id))
		} else {
			await setWithExpiry(`removed_notification_${id}`, 'true', ttl)
		}
	}

	return (
		<div className="flex flex-col gap-2">
			{notifications.map((item, index) => (
				<NotificationCardItem
					notification={item}
					className={`${hasBorder ? '' : 'border-none!'}`}
					key={item.id || `no-${index}`}
					onClose={(e) => onClose(e, item.id || '', item.ttl)}
				/>
			))}

			{pushed.map((f) => f.node)}

			{notifications.length === 0 && pushed.length === 0 && (
				<EmptyState
					icon="allCaughtUp"
					title={t('navbar.notifications.emptyTitle')}
					description={t('navbar.notifications.emptyBody')}
					className="py-10"
				/>
			)}
		</div>
	)
}
