import { useMemo } from 'react'
import { Dropdown, NewBadge } from '@/components/ui'
import { Icon } from '@/icons'
import { useGetNotifications } from '@/services/extension/get-notifications.hook'
import { NotificationCenter } from '@/features/navbar/notifications/components/notification-center'
import Analytics from '@/analytics'
import { NavIconButton } from '../components/nav-icon-button'
import { t } from '@/common/i18n'

export function NotificationNavbar() {
	const { data: notificationsData } = useGetNotifications()

	const hasCloseableNotifications = useMemo(() => {
		const cardItems = notificationsData?.widgetifyCard || []
		return cardItems.some((item) => item.closeable)
	}, [notificationsData])

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
			<div className="flex flex-col p-3 w-80 bg-glass-surface-2" dir="rtl">
				<div className="sticky top-0 z-10 flex items-center justify-between pb-1 mb-2 border-b border-line shrink-0">
					<div className="flex items-center gap-1.5 text-fg">
						<Icon name="notification" size={14} />
						<span className="text-xs font-bold">
							{t('navbar.notifications.label')}
						</span>
					</div>
				</div>

				<div className="flex-1 h-48 overflow-y-auto min-h-48 max-h-48 scrollbar-none overscroll-contain">
					<NotificationCenter hasBorder={true} />
				</div>
			</div>
		</Dropdown>
	)
}
