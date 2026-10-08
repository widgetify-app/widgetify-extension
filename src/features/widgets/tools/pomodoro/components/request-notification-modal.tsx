import Analytics from '@/analytics'
import { Button, Modal } from '@/components/ui'
import { showToast } from '@/common/toast'
import { t } from '@/common/i18n'

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
				showToast(t('widgets.pomodoro.notify.enabledToast'), 'success')
				setShowRequireNotificationModal(false)
				startPomodoro()
				Analytics.event('grant_notification_permission')
			} else {
				showToast(t('widgets.pomodoro.notify.continueWithout'), 'info')
				setShowRequireNotificationModal(false)
				Analytics.event('deny_notification_permission')
			}
		} catch {
			showToast(t('widgets.pomodoro.notify.permissionError'), 'error')
		}
	}

	return (
		<Modal
			isOpen={showRequireNotificationModal}
			onClose={() => setShowRequireNotificationModal(false)}
			size="sm"
			title={t('widgets.pomodoro.notify.title')}
			closeLabel={t('ui.common.close')}
		>
			<div className="flex flex-col gap-3.5">
				<figure className="flex flex-col overflow-hidden rounded-2xl bg-fill">
					<img
						src="https://cdn.widgetify.ir/extension/pomodoroTimer-notification.png"
						alt={t('widgets.pomodoro.notify.sampleTitle')}
						className="object-cover w-full h-auto"
					/>
					<figcaption className="px-3 py-2 text-center text-3xs text-fg-muted">
						{t('widgets.pomodoro.notify.sampleBody')}
					</figcaption>
				</figure>

				<p className="text-xs leading-relaxed text-fg-muted">
					{t('widgets.pomodoro.notify.description')}
				</p>

				<div className="flex items-center gap-1.5 pt-1">
					<Button
						size="md"
						rounded="xl"
						onClick={() => setShowRequireNotificationModal(false)}
						className="w-1/4"
					>
						{t('widgets.pomodoro.notify.notNow')}
					</Button>
					<Button
						color="brand"
						size="md"
						rounded="xl"
						onClick={onRequestPermission}
						className="flex-1"
					>
						{t('widgets.pomodoro.notify.enable')}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
