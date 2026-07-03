import { showToast } from '@/common/toast'
import Modal from '@/components/modal'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import { safeAwait } from '@/services/api'
import { useUpdateUsername } from '@/services/hooks/auth/authService.hook'
import type { UserProfile } from '@/services/hooks/user/userService.hook'
import { translateError } from '@/utils/translate-error'
import type { AxiosError } from 'axios'
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

		const [err, _] = await safeAwait<AxiosError, UserProfile>(
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
		<Modal
			isOpen={show}
			onClose={onCloseHandler}
			direction="rtl"
			showCloseButton={false}
		>
			<div className="flex flex-col justify-between h-40 gap-4">
				<SectionPanel title={'نام کاربری (یوزرنیم)'} size="xs">
					<TextInput
						value={value}
						placeholder="مثلا: i_rez..."
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
