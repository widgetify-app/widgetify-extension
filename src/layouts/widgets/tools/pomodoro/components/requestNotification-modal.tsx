import toast from 'react-hot-toast'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'

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
		Analytics.event('view_request_notification_modal')
	}, [])

	async function onRequestPermission() {
		try {
			const perm = await Notification.requestPermission()
			if (perm === 'granted') {
				toast.success('اعلان‌ها با موفقیت فعال شدند!')
				setShowRequireNotificationModal(false)
				startPomodoro()
				Analytics.event('grant_notification_permission')
			} else {
				toast.error('برای شروع باید اعلان‌ها را فعال کنید.')
				Analytics.event('deny_notification_permission')
			}
		} catch {
			toast.error('خطا در درخواست دسترسی اعلان‌ها.')
		}
	}

	return (
		<Modal
			isOpen={showRequireNotificationModal}
			onClose={() => setShowRequireNotificationModal(false)}
			size="sm"
			title="فعال کردن اعلان‌ها"
		>
			<div className="p-4 max-h-[80vh] overflow-y-auto">
				<article className="pb-4 border-b blog-post border-content animate-fade-in animate-slide-up">
					{/* Type badge and title */}
					<div className="flex items-start justify-between mb-3">
						<h3 className="text-xl font-bold text-content">
							می‌خواهیم به شما یادآوری کنیم!
						</h3>
					</div>

					<div className="media-container">
						<div className="my-2 overflow-hidden rounded-lg shadow-md">
							<img
								src={
									'https://widgetify-ir.storage.c2.liara.space/extension/pomodoroTimer-notification.png'
								}
								alt={'نمونه اعلان'}
								className="object-cover w-full h-auto"
							/>
							<p className="p-2 text-xs text-center text-muted bg-content/30">
								نمونه اعلان که دریافت خواهید کرد
							</p>
						</div>
					</div>

					{/* Content */}
					<div className="mt-2">
						<p className="leading-relaxed text-justify text-muted">
							برای اینکه به شما یادآوری کنیم، نیاز داریم اعلان‌ها را فعال
							کنید. این کار باعث می‌شود هیچ تایمری یا یادآوری مهمی را از دست
							ندهید.
						</p>
					</div>
				</article>

				{/* Actions */}
				<div className="flex gap-3 mt-2">
					<Button
						onClick={() => {
							setShowRequireNotificationModal(false)
						}}
						className="flex-1 px-4 py-2 text-sm font-medium transition-colors border rounded-2xl border-content text-content"
						size="md"
					>
						فعلاً نه
					</Button>
					<Button
						isPrimary={true}
						size="md"
						onClick={onRequestPermission}
						className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors rounded-2xl"
					>
						فعال کردن اعلان‌ها
					</Button>
				</div>
			</div>
		</Modal>
	)
}
