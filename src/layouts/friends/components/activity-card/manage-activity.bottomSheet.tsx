import { useState } from 'react'
import { BottomSheet } from '@/components/bottom-sheet/bottom-sheet'
import { Button } from '@/components/button/button'
import { showToast } from '@/common/toast'
import { FiTrash2 } from 'react-icons/fi'
import Modal from '@/components/modal'
import { useRemoveActivity, useSetActivity } from '@/services/hooks/user/userService.hook'
import { translateError } from '@/utils/translate-error'
import { playAlarm } from '@/common/playAlarm'

interface ManageActivityBottomSheetProps {
	isOpen: boolean
	onClose: () => void
	currentActivity: {
		id: string
		content: string
	} | null
}

const MAX_ACTIVITY_LENGTH = 40
// const ACTIVITY_COOLDOWN_HOURS = 24

export function ManageActivityBottomSheet({
	isOpen,
	onClose,
	currentActivity,
}: ManageActivityBottomSheetProps) {
	const [activity, setActivity] = useState('')
	const [showModal, setShowModal] = useState(false)
	const { mutateAsync, isPending: isSubmitting } = useSetActivity()
	const { mutateAsync: removeAsync, isPending: isRemoving } = useRemoveActivity()

	const handleSave = async () => {
		if (!activity.trim()) {
			showToast('لطفاً متنی وارد کنید', 'error')
			return
		}

		if (currentActivity) {
			showToast('شما نمی‌توانید در این زمان نوشته جدید ارسال کنید', 'error')
			return
		}

		try {
			await mutateAsync({ content: activity })
			playAlarm('done_todo')
			setActivity('')
			onClose()
		} catch (er) {
			const translatedError = translateError(er)
			if (typeof translatedError === 'string') {
				return showToast(translatedError, 'error')
			}

			const key = Object.keys(translatedError)[0]
			return showToast(translatedError[key], 'error')
		}
	}

	const handleDelete = async () => {
		if (!currentActivity) return

		try {
			await removeAsync({ id: currentActivity.id })

			showToast('نوشته شما حذف شد', 'success')
			setActivity('')
			onClose()
		} catch {
			showToast('خطا در حذف نوشته', 'error')
		}
	}

	const handleClose = () => {
		setActivity('')
		onClose()
	}

	return (
		<>
			<div className="flex flex-col gap-2 p-2">
				{currentActivity && (
					<div className="p-4 border rounded-xl bg-content border-content">
						<p className="mb-2 text-sm font-bold text-base-content/70">
							نوشته فعلی شما:
						</p>
						<p className="text-content">{currentActivity.content}</p>
					</div>
				)}

				{!currentActivity && (
					<div className="space-y-1">
						<div className="space-y-1">
							<div className="text-sm font-medium text-content">
								<p> متن نوشته</p>
							</div>
							<textarea
								id="activity-text"
								name="activity-text"
								value={activity}
								onChange={(e) =>
									setActivity(
										e.target.value.slice(0, MAX_ACTIVITY_LENGTH)
									)
								}
								placeholder="یه چیزی بگو..."
								className="w-full h-16 px-4 py-2 mt-1 text-base leading-relaxed transition-all border-none outline-none resize-none max-h-16 bg-content text-muted rounded-2xl placeholder:font-light focus:placeholder-base-content/10"
								rows={4}
								maxLength={MAX_ACTIVITY_LENGTH}
							/>
						</div>

						<div className="text-center">
							<p className="text-xs text-muted">
								نوشته شما به مدت 24 ساعت برای دوستان شما نمایش داده می‌شود.
							</p>
						</div>

						<Button
							type="submit"
							onClick={handleSave}
							disabled={isSubmitting || !activity.trim()}
							size="sm"
							className="w-full mt-1 rounded-xl"
							isPrimary
							loading={isSubmitting}
						>
							انتشار نوشته
						</Button>
					</div>
				)}

				{currentActivity && (
					<div className="space-y-3">
						<p className="text-sm text-center text-muted">
							شما می‌توانید نوشته خود را حذف کنید. امکان ویرایش وجود ندارد.
						</p>
						<Button
							type="button"
							onClick={handleDelete}
							disabled={isRemoving}
							size="sm"
							className="w-full rounded-xl bg-error hover:bg-error/90"
							loading={isRemoving}
						>
							<span className="flex items-center gap-2">
								<FiTrash2 className="w-5 h-5" />
								حذف نوشته
							</span>
						</Button>
					</div>
				)}
			</div>

			<Modal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				direction="rtl"
				showCloseButton={false}
				className="px-4"
				title="قوانین"
			>
				<div className="space-y-3 text-sm leading-relaxed text-muted">
					<p>
						از درج هرگونه متن یا محتوای توهین‌آمیز، سیاسی یا دینی خودداری کنید.
					</p>

					<p>از اشتراک‌گذاری لینک‌ها و محتوای خارجی خودداری کنید.</p>

					<p>
						در صورت گزارش محتوای نامناسب، حساب کاربری شما ممکن است محدود شود.
					</p>

					<p>لطفاً با رعایت قوانین به ما در حفظ فضای امن و دوستانه کمک کنید.</p>

					<p>در هر روز فقط یک بار امکان انتشار نوشته جدید دارید.</p>
				</div>

				<Button
					size="sm"
					type="button"
					className="h-12 mt-5 text-base font-bold shadow-sm btn-block rounded-2xl"
					onClick={() => setShowModal(false)}
				>
					متوجه شدم
				</Button>
			</Modal>
		</>
	)
}
