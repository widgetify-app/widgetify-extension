import { useMemo } from 'react'
import { Dropdown, NewBadge } from '@/components/ui'
import { Icon } from '@/src/icons'
import { useGetNotifications } from '@/services/hooks/extension/get-notifications.hook'
import { NotificationCenter } from '@/layouts/widgetify-card/notification-center/notification-center'
import Analytics from '@/analytics'

export function NotificationNavbar() {
	const { data: notificationsData } = useGetNotifications()

	const notificationsCount = useMemo(() => {
		const wigiPadCount = notificationsData?.wigiPad?.length || 0
		const cardCount = notificationsData?.widgetifyCard?.length || 0
		return Math.max(wigiPadCount, cardCount)
	}, [notificationsData])

	const hasNotifications = notificationsCount > 0

	const handleOpen = () => {
		Analytics.event('notification_navbar_opened')
	}

	return (
		<Dropdown
			trigger={
				<div
					onClick={handleOpen}
					className="relative p-2 transition-all cursor-pointer nav-btn text-base-content/40 hover:text-base-content active:scale-90"
					id="notifications-button"
				>
					<Icon name="notification" size={15} />
					{hasNotifications && <NewBadge className="top-1 right-1" />}
				</div>
			}
		>
			<div
				className="p-3 bg-content bg-glass min-h-96 min-w-80 rounded-2xl flex flex-col gap-2 max-h-96 overflow-y-auto scrollbar-none"
				dir="rtl"
			>
				<div className="flex items-center justify-between pb-2 border-b border-base-content/10">
					<div className="flex items-center gap-1.5 text-content">
						<Icon name="notification" size={14} />
						<span className="text-xs font-bold ">اعلان‌ها</span>
					</div>
				</div>

				<NotificationCenter hasBorder={true} />

				{!hasNotifications && (
					<div className="flex flex-col items-center justify-center py-8 text-center text-muted">
						<div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center mb-2 text-muted">
							<Icon name="notification" size={18} />
						</div>
						<span className="text-xs font-bold text-content">
							اعلان جدیدی نداری
						</span>
						<span className="text-[10px] text-muted mt-0.5">
							همه چیز به‌روز و مرتبه
						</span>
					</div>
				)}
			</div>
		</Dropdown>
	)
}
