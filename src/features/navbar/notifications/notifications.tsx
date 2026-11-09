import { useMemo } from 'react'
import { Button, Dropdown, NewBadge } from '@/components/ui'
import { Icon } from '@/icons'
import {
	useGetNotifications,
	useMarkAllAsSeen,
} from '@/services/extension/get-notifications.hook'
import { NotificationCenter } from '@/features/navbar/notifications/components/notification-center'
import Analytics from '@/analytics'
import { NavIconButton } from '../components/nav-icon-button'
import { t } from '@/common/i18n'
import { safeAwait } from '@/services/api'

export { IslandNotification } from './components/island-notification'

export function NotificationNavbar() {
	const { data: notificationsData } = useGetNotifications()

	const hasCloseableNotifications = useMemo(() => {
		const cardItems = notificationsData?.cards || []
		return cardItems.some((item) => item.closeable)
	}, [notificationsData])

	const { mutateAsync: markAllAsSeen } = useMarkAllAsSeen()

	const handleMarkAllRead = async () => {
		Analytics.event('notifications_mark_all_read')
		await safeAwait(markAllAsSeen(notificationsData?.cards || []))
	}

	const handleOpen = () => {
		Analytics.event('notification_navbar_opened')
	}

	return (
		<Dropdown
			maxHeight="420px"
			dropdownClassName="w-80 sm:w-96 rounded-2xl"
			trigger={
				<NavIconButton
					id="notifications-button"
					icon="notification"
					label={
						hasCloseableNotifications
							? t('navbar.notifications.new')
							: t('navbar.notifications.label')
					}
					onClick={handleOpen}
				>
					{hasCloseableNotifications && <NewBadge className="top-1 right-1" />}
				</NavIconButton>
			}
		>
			<div className="flex flex-col w-80 sm:w-96 bg-glass-surface-2" dir="rtl">
				<div className="sticky top-0 z-10 flex items-center justify-between px-3.5 pt-3 pb-2 shrink-0">
					<div className="flex items-center gap-2 text-fg-strong">
						<Icon name="notification" size={16} />
						<span className="text-sm font-bold">
							{t('navbar.notifications.label')}
						</span>
					</div>

					{hasCloseableNotifications && (
						<Button
							variant="ghost"
							size="xs"
							rounded="lg"
							onClick={handleMarkAllRead}
						>
							{t('navbar.notifications.markAllRead')}
						</Button>
					)}
				</div>

				<div className="flex-1 px-3 pt-1 pb-3 overflow-y-auto min-h-48 max-h-80 overscroll-contain">
					<NotificationCenter hasBorder={true} />
				</div>
			</div>
		</Dropdown>
	)
}
