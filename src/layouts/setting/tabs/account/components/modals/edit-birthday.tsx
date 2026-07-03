import Modal from '@/components/modal'
import { useUpdateUserProfile } from '@/services/hooks/auth/authService.hook'
import { useEffect, useState } from 'react'
import JalaliDatePicker from '../profile-date-picker'
import moment from 'jalali-moment'
import { SectionPanel } from '@/components/section-panel'
import { FooterButtons } from './footer-buttons'

interface Prop {
	show: boolean
	onClose: (type: 'success' | 'cancel') => void
	currentValue?: string
}
export function ChangeBirthdayModal({ show, onClose, currentValue }: Prop) {
	const [value, setValue] = useState('')
	const updateProfileMutation = useUpdateUserProfile()

	const onCloseHandler = () => {
		onClose('cancel')
	}

	const onClickSave = async () => {
		if (!value) return

		const data = new FormData()
		const gregorianDate = moment(value, 'jYYYY-jMM-jDD')
			.doAsGregorian()
			.format('YYYY-MM-DD')
		data.append('birthdate', gregorianDate)

		await updateProfileMutation.mutateAsync(data)
		onClose('success')
	}

	const onCancel = () => {
		onClose('cancel')
	}

	useEffect(() => {
		if (currentValue) setValue(currentValue)
	}, [])

	return (
		<Modal
			isOpen={show}
			onClose={onCloseHandler}
			direction="rtl"
			showCloseButton={false}
		>
			<div className="flex flex-col justify-between h-40 gap-4">
				<SectionPanel title="تاریخ تولدت؟" size="xs">
					<JalaliDatePicker
						value={value}
						enable={!updateProfileMutation.isPending}
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
