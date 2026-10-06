import { autoFormatErrorToast } from '@/common/toast'
import { Button, Modal } from '@/components/ui'
import { safeAwait } from '@/services/api'
import { useUpdateSearchAutocomplete } from '@/services/extension/update-setting.hook'

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
		<Modal isOpen={isOpen} onClose={onClose} title="پیشنهادهای جستجو" size="sm">
			<div className="flex flex-col gap-4 pt-1">
				<p className="px-1 text-sm leading-relaxed text-fg">
					اگه روشنش کنی، موقع تایپ پیشنهادها مستقیم از گوگل میان. ما چیزی ذخیره
					نمی‌کنیم.
				</p>
				<div className="flex items-center justify-end gap-2">
					<Button
						onClick={() => onClose()}
						size="md"
						rounded={'2xl'}
						className="w-20"
						disabled={isPending}
					>
						فعلاً نه
					</Button>
					<Button
						type="button"
						onClick={() => onUpdateStatus()}
						disabled={isPending}
						size="md"
						color={'brand'}
						rounded={'2xl'}
						loading={isPending}
						className="px-8"
					>
						روشنش کن
					</Button>
				</div>
			</div>
		</Modal>
	)
}
