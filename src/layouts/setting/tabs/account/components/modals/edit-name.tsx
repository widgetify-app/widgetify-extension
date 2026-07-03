import Modal from '@/components/modal'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import { useUpdateUserProfile } from '@/services/hooks/auth/authService.hook'
import { useState } from 'react'
import { FooterButtons } from './footer-buttons'

interface Prop {
	show: boolean
	onClose: (type: 'success' | 'cancel') => void
	currentValue?: string
}
export function ChangeNameModal({ show, onClose, currentValue }: Prop) {
	const [value, setValue] = useState(currentValue)
	const updateProfileMutation = useUpdateUserProfile()

	const onCloseHandler = () => {
		onClose('cancel')
	}

	const onClickSave = async () => {
		if (!value) return
		const data = new FormData()
		data.append('name', value)

		await updateProfileMutation.mutateAsync(data)
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
				<SectionPanel title={'نام کامل'} size="xs">
					<TextInput
						value={value}
						placeholder="مثلا: ایلان رضایی"
						className="mt-2"
						onChange={(val) => setValue(val)}
					/>
				</SectionPanel>

				<FooterButtons
					handleCancel={onCancel}
					handleConfirm={onClickSave}
					isPending={updateProfileMutation.isPending}
				/>
			</div>
		</Modal>
	)
}
