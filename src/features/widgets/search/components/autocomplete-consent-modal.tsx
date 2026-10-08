import { autoFormatErrorToast } from '@/common/toast'
import { Button, Modal } from '@/components/ui'
import { safeAwait } from '@/services/api'
import { useUpdateSearchAutocomplete } from '@/services/extension/update-setting.hook'
import { t } from '@/common/i18n'

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
			title={t('widgets.search.consent.title')}
			size="sm"
			closeLabel={t('ui.common.close')}
		>
			<div className="flex flex-col gap-4 pt-1">
				<p className="px-1 text-sm leading-relaxed text-fg">
					{t('widgets.search.consent.body')}
				</p>
				<div className="flex items-center justify-end gap-2">
					<Button
						onClick={() => onClose()}
						size="md"
						rounded={'2xl'}
						className="w-20"
						disabled={isPending}
					>
						{t('widgets.search.consent.notNow')}
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
						{t('widgets.search.consent.enable')}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
