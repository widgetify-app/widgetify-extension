import { autoFormatErrorToast } from '@/common/toast'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { safeAwait } from '@/services/api'
import { useUpdateSearchAutocomplete } from '@/services/hooks/extension/updateSetting.hook'

export function AutocompleteConsentModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean
	onClose: () => void
}) {
	const { mutateAsync, isPending } = useUpdateSearchAutocomplete()

	const onUpdateStatus = async () => {
		const [err, _] = await safeAwait(mutateAsync({ isActive: true }))
		if (err) {
			autoFormatErrorToast(err)
		} else {
			onClose()
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="پیشنهادهای جستجو"
			size="sm"
			direction="rtl"
		>
			<div className="flex flex-col gap-4 pt-1 searchbox-item">
				<p className="px-1 text-sm leading-relaxed text-content">
					با فعال کردن این گزینه، هنگام تایپ در باکس جستجو، پیشنهادها مستقیما از
					گوگل دریافت می‌شوند. هیچ اطلاعاتی ذخیره نمی‌شود.
				</p>
				<div className="flex items-center justify-end gap-2 searchbox-item">
					<Button
						onClick={() => onClose()}
						size="md"
						className={
							'btn btn-circle bg-base-300!  hover:bg-error/10! text-muted hover:text-error! px-10 border-none shadow-none rounded-xl transition-colors duration-300 ease-in-out'
						}
						disabled={isPending}
					>
						لغو
					</Button>
					<Button
						type="button"
						onClick={() => onUpdateStatus()}
						disabled={isPending}
						size="md"
						isPrimary={true}
						loading={isPending}
						className={
							'btn btn-circle w-fit!  px-8 border-none shadow-none text-secondary rounded-xl transition-colors duration-300 ease-in-out'
						}
					>
						قبوله، فعالسازی
					</Button>
				</div>
			</div>
		</Modal>
	)
}
