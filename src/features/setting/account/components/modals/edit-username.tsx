import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { Modal } from '@/components/ui'
import { SectionPanel } from '@/components/ui'
import { TextInput } from '@/components/ui'
import { type ApiError, safeAwait } from '@/services/api'
import { useUpdateUsername } from '@/services/auth/auth-service.hook'
import type { UserProfile } from '@/services/user/user-service.hook'
import { translateError } from '@/common/utils/translate-error'
import { useState } from 'react'
import { FooterButtons } from './footer-buttons'

interface Prop {
	show: boolean
	onClose: (type: 'success' | 'cancel') => void
	currentValue?: string
}
export function ChangeUsernameModal({ show, onClose, currentValue }: Prop) {
	const [value, setValue] = useState(currentValue)
	const updateUsernameMutation = useUpdateUsername()

	const onCloseHandler = () => {
		onClose('cancel')
	}

	const onClickSave = async () => {
		if (!value) return

		const [err, _] = await safeAwait<ApiError, UserProfile>(
			updateUsernameMutation.mutateAsync(value)
		)
		if (err) {
			if (err.response) {
				const translate = translateError(err)
				showToast(
					typeof translate === 'string'
						? translate
						: Object.values(translate).join('\n'),
					'error'
				)
			}
			return
		}
		onClose('success')
	}

	const onCancel = () => {
		onClose('cancel')
	}

	return (
		<Modal isOpen={show} onClose={onCloseHandler} showCloseButton={false}>
			<div className="flex flex-col justify-between h-40 gap-4">
				<SectionPanel title={t('setting.modal.username.label')} size="xs">
					<TextInput
						value={value}
						placeholder={t('setting.modal.username.placeholder')}
						className="mt-2"
						direction="ltr"
						onChange={(val) => setValue(val)}
					/>
				</SectionPanel>

				<FooterButtons
					handleCancel={onCancel}
					handleConfirm={onClickSave}
					isPending={updateUsernameMutation.isPending}
				/>
			</div>
		</Modal>
	)
}
