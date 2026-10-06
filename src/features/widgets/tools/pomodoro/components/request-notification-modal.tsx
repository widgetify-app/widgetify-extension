import Analytics from '@/analytics'
import { Button, Modal } from '@/components/ui'
import { showToast } from '@/common/toast'

interface Prop {
	showRequireNotificationModal: boolean
	setShowRequireNotificationModal: (value: boolean) => void
	startPomodoro: () => void
}
export function RequestNotificationModal({
	showRequireNotificationModal,
	setShowRequireNotificationModal,
	startPomodoro,
}: Prop) {
	useEffect(() => {
		if (showRequireNotificationModal)
			Analytics.event('view_request_notification_modal')
	}, [showRequireNotificationModal])

	async function onRequestPermission() {
		try {
			const perm = await Notification.requestPermission()
			if (perm === 'granted') {
				showToast('اعلان‌ها روشن شد', 'success')
				setShowRequireNotificationModal(false)
				startPomodoro()
				Analytics.event('grant_notification_permission')
			} else {
				showToast('باشه، بدون اعلان ادامه می‌دیم', 'info')
				setShowRequireNotificationModal(false)
				Analytics.event('deny_notification_permission')
			}
		} catch {
			showToast('نتونستیم اجازه‌ی اعلان رو بگیریم', 'error')
		}
	}

	return (
		<Modal
			isOpen={showRequireNotificationModal}
			onClose={() => setShowRequireNotificationModal(false)}
			size="sm"
			title="اعلان‌های تایمر"
		>
			<div className="flex flex-col gap-3.5">
				<figure className="flex flex-col overflow-hidden rounded-2xl bg-fill">
					<img
						src="https://cdn.widgetify.ir/extension/pomodoroTimer-notification.png"
						alt="نمونه‌ی اعلان تایمر"
						className="object-cover w-full h-auto"
					/>
					<figcaption className="px-3 py-2 text-center text-3xs text-fg-muted">
						آخر هر دور، یه همچین اعلانی می‌گیری
					</figcaption>
				</figure>

				<p className="text-xs leading-relaxed text-fg-muted">
					اگه اعلان‌ها رو روشن کنی، وقتی کار یا استراحتت تموم شد خبرت می‌کنیم، حتی
					اگه این صفحه باز نباشه.
				</p>

				<div className="flex items-center gap-1.5 pt-1">
					<Button
						size="md"
						rounded="xl"
						onClick={() => setShowRequireNotificationModal(false)}
						className="w-1/4"
					>
						فعلاً نه
					</Button>
					<Button
						color="brand"
						size="md"
						rounded="xl"
						onClick={onRequestPermission}
						className="flex-1"
					>
						روشن کردن اعلان‌ها
					</Button>
				</div>
			</div>
		</Modal>
	)
}
