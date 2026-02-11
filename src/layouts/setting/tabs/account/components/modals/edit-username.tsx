import { showToast } from '@/common/toast'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import { safeAwait } from '@/services/api'
import { useUpdateUsername } from '@/services/hooks/auth/authService.hook'
import type { UserProfile } from '@/services/hooks/user/userService.hook'
import { translateError } from '@/utils/translate-error'
import type { AxiosError } from 'axios'
import { useState } from 'react'

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

				<div className="flex gap-2">
					<Button
						size="sm"
						type="submit"
						disabled={updateUsernameMutation.isPending}
						isPrimary={true}
						onClick={() => onClickSave()}
						className="text-sm shadow-xs flex-2 rounded-xl shadow-primary/20"
					>
						{updateUsernameMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
					</Button>
					<Button
						size="sm"
						type="button"
						onClick={onCancel}
						className="flex-1 text-sm font-medium border-none rounded-2xl bg-content"
					>
						انصراف
					</Button>
				</div>
			</div>
		</Modal>
	)
}
