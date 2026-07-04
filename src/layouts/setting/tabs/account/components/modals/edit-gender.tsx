import Modal from '@/components/modal'
import { SectionPanel } from '@/components/section-panel'
import { useUpdateUserProfile } from '@/services/hooks/auth/authService.hook'
import { useState } from 'react'
import { FooterButtons } from './footer-buttons'

const options = {
	MALE: {
		label: 'آقا هستم',
		icon: '🙋‍♂️',
	},
	FEMALE: {
		label: 'خانم هستم',
		icon: '🙋‍♀️',
	},
	OTHER: {
		label: 'بماند',
		icon: '☃️',
	},
}

interface Prop {
	show: boolean
	onClose: (type: 'success' | 'cancel') => void
	currentValue?: string
}
export function ChangeGenderModal({ show, onClose, currentValue }: Prop) {
	const [value, setValue] = useState(currentValue)
	const updateProfileMutation = useUpdateUserProfile()

	const onCloseHandler = () => {
		onClose('cancel')
	}

	const onClickSave = async () => {
		if (!value) return
		const data = new FormData()
		data.append('gender', value)

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
				<SectionPanel title="جنسیت (کاملا اختیاری)" size="xs">
					<div className="flex gap-2 p-1.5 bg-content rounded-2xl">
						{(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => {
							const isActive = value === g

							return (
								<button
									key={g}
									type="button"
									onClick={() => setValue(g)}
									className={`flex-1 py-2 px-1 flex flex-col  items-center gap-1 text-[10px] font-bold rounded-xl transition-all duration-300 cursor-pointer ${
										isActive
											? 'text-primary shadow-sm ring-1 ring-primary/20 scale-[1.02]'
											: 'text-base-content/80 hover:text-primary/80 hover:ring-1 hover:ring-primary/10 active:scale-95'
									}`}
								>
									<span
										className={
											isActive ? 'text-primary' : 'text-muted/60'
										}
									>
										{options[g].icon}
									</span>
									{options[g].label}
								</button>
							)
						})}
					</div>
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
