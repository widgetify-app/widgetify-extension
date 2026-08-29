import { useMemo } from 'react'
import { Dropdown, NewBadge } from '@/components/ui'
import { Icon } from '@/src/icons'
import { useGetNotifications } from '@/services/hooks/extension/get-notifications.hook'
import { NotificationCenter } from '@/layouts/widgetify-card/notification-center/notification-center'
import Analytics from '@/analytics'

export function NotificationNavbar() {
	const { data: notificationsData } = useGetNotifications()

	const hasCloseableNotifications = useMemo(() => {
		const cardItems = notificationsData?.widgetifyCard || []
		return cardItems.some((item) => item.closeable)
	}, [notificationsData])

	const hasNotifications = useMemo(() => {
		const cardCount = notificationsData?.widgetifyCard?.length || 0
		return cardCount > 0
	}, [notificationsData])

	const handleOpen = () => {
		Analytics.event('notification_navbar_opened')
	}

	return (
		<Dropdown
			maxHeight="420px"
			dropdownClassName="w-80 sm:w-96 rounded-2xl"
			trigger={
				<div
					onClick={handleOpen}
					className="relative p-2 transition-all cursor-pointer nav-btn text-base-content/40 hover:text-base-content active:scale-90"
					id="notifications-button"
				>
					<Icon name="notification" size={15} />
					{hasCloseableNotifications && <NewBadge className="top-1 right-1" />}
				</div>
			}
		>
			<div className="flex flex-col p-3 w-80 bg-content bg-glass" dir="rtl">
				<div className="sticky top-0 z-10 flex items-center justify-between pb-2 mb-2 border-b bg-content border-base-content/10 shrink-0">
					<div className="flex items-center gap-1.5 text-content">
						<Icon name="notification" size={14} />
						<span className="text-xs font-bold">اعلان‌ها</span>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto max-h-48 scrollbar-none overscroll-contain">
					<NotificationCenter hasBorder={true} />

					{!hasNotifications && (
						<div className="flex flex-col items-center justify-center py-8 text-center text-muted">
							<div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-base-300 text-muted">
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
			</div>
		</Dropdown>
	)
}
