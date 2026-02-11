import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { useUpdateUserProfile } from '@/services/hooks/auth/authService.hook'
import { useEffect, useState } from 'react'
import JalaliDatePicker from '../profile-date-picker'
import moment from 'jalali-moment'
import { SectionPanel } from '@/components/section-panel'

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
		console.log(currentValue)
	}, [])

	return (
		<Modal
			isOpen={show}
			onClose={onCloseHandler}
			direction="rtl"
			showCloseButton={false}
		>
			<div className="flex flex-col justify-between h-40 gap-4">
				<SectionPanel title="تاریخ تولدت؟">
					<JalaliDatePicker
						value={value}
						enable={!updateProfileMutation.isPending}
						onChange={(val) => setValue(val)}
					/>
				</SectionPanel>

				<div className="flex gap-2">
					<Button
						size="sm"
						type="submit"
						disabled={updateProfileMutation.isPending}
						isPrimary={true}
						onClick={() => onClickSave()}
						className="text-sm shadow-xs flex-2 rounded-xl shadow-primary/20"
					>
						{updateProfileMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
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
