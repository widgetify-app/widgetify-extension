import { useEffect } from 'react'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { MdSyncProblem } from 'react-icons/md'
import { PiSealWarning } from 'react-icons/pi'

type AlertType = 'BOOKMARKS' | 'TODOS'
let items: Record<
	AlertType,
	{
		title: string
		message: string
	}
> = {
	BOOKMARKS: {
		title: 'همگام‌سازی بوکمارک‌ها',
		message:
			'برخی از بوکمارک‌های شما همگام‌سازی نشده‌اند. لطفاً برای همگام‌سازی دوباره تلاش کنید.',
	},
	TODOS: {
		title: 'همگام‌سازی وظایف',
		message:
			'برخی از وظایف شما همگام‌سازی نشده‌اند. لطفاً برای همگام‌سازی دوباره تلاش کنید.',
	},
}

interface SyncAlertModalProps {
	type: AlertType
	isSyncing: boolean
	onTryAgainClick: () => void
	isOpen: boolean
	onClose: () => void
}
export function SyncAlertModal({
	type,
	isSyncing,
	onTryAgainClick,
	isOpen: showModal,
	onClose,
}: SyncAlertModalProps) {
	useEffect(() => {
		if (!showModal) return
		Analytics.event('sync_alert_modal_shown')
	}, [showModal])

	return (
		<Modal
			isOpen={showModal}
			onClose={onClose}
			title={
				<div className="flex items-center gap-2">
					<div className="p-1 rounded-full bg-error/20">
						<MdSyncProblem size={20} className="text-error" />
					</div>
					<span>همگام‌سازی داده‌ها</span>
				</div>
			}
			direction="rtl"
			size="sm"
		>
			<div className="px-1 py-2 text-sm text-justify text-muted">
				{items[type].message}
				{type === 'BOOKMARKS' && (
					<div className="flex items-start gap-3 p-3 mt-3 border rounded-2xl bg-warning/10 border-warning/20">
						<div className="flex-shrink-0 p-2 rounded-full bg-warning/20">
							<PiSealWarning size={20} className="text-warning" />
						</div>
						<div className="min-w-0">
							<div className="text-sm font-semibold text-warning">
								ممکن است آیکون بوکمارک ذخیره نشود!
							</div>
							<p className="mt-1 text-xs leading-relaxed text-warning/90">
								آیکون‌های سفارشی بوکمارک ممکن است پس از همگام‌سازی نیاز به
								تنظیم دوباره داشته باشند.
							</p>
						</div>
					</div>
				)}
			</div>
			<div className="flex justify-center pt-2">
				<Button
					size="md"
					isPrimary={true}
					onClick={onTryAgainClick}
					disabled={isSyncing}
					loading={isSyncing}
					className="w-full rounded-xl"
				>
					همگام‌سـازی
				</Button>
			</div>
		</Modal>
	)
}
