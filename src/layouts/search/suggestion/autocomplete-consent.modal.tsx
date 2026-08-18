import { autoFormatErrorToast } from '@/common/toast'
import { Button, Modal } from '@/components/ui'
import { safeAwait } from '@/services/api'
import { useUpdateSearchAutocomplete } from '@/services/hooks/extension/update-setting.hook'

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
						rounded={'2xl'}
						className="w-20"
						disabled={isPending}
					>
						لغو
					</Button>
					<Button
						type="button"
						onClick={() => onUpdateStatus()}
						disabled={isPending}
						size="md"
						variant={'primary'}
						rounded={'2xl'}
						loading={isPending}
						className="px-8"
					>
						قبوله، فعالسازی
					</Button>
				</div>
			</div>
		</Modal>
	)
}
