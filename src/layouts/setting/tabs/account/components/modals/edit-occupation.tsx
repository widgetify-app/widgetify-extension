import Modal from '@/components/modal'
import { useUpdateUserProfile } from '@/services/hooks/auth/authService.hook'
import { useState } from 'react'
import { OccupationSelector } from '../occupation-selector'
import { useGetOccupations } from '@/services/hooks/profile/getProfileMeta.hook'
import { SectionPanel } from '@/components/section-panel'
import { Icon } from '@/src/icons'
import { FooterButtons } from './footer-buttons'

interface Prop {
	show: boolean
	onClose: (type: 'success' | 'cancel') => void
	currentValue?: any
}
export function ChangeOccupationModal({ show, onClose, currentValue }: Prop) {
	const [occupation, setOccupations] = useState<string>(currentValue?.id || '')
	const updateProfileMutation = useUpdateUserProfile()
	const { data: FetchedOccupations = [], isLoading: occupationsLoading } =
		useGetOccupations()

	const onCloseHandler = () => {
		onClose('cancel')
	}

	const onClickSave = async () => {
		if (!occupation) return
		const data = new FormData()

		data.append('occupationId', occupation)

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
				<SectionPanel title="چه‌کاره‌ای؟" size="xs">
					<OccupationSelector
						occupations={FetchedOccupations}
						selectedOccupation={occupation}
						onSelect={(id) => setOccupations(id || '')}
						isLoading={occupationsLoading}
						triggerElement={
							<div className="flex items-center justify-between w-full h-12 p-3 transition-colors border cursor-pointer border-content rounded-xl hover:border-primary/50!">
								<div className="flex items-center gap-3">
									<Icon
										name="briefcase"
										size={14}
										className="text-primary"
									/>
									<span
										className={`text-sm ${occupation ? 'text-content' : 'text-muted'}`}
									>
										{occupation
											? FetchedOccupations.find(
													(o) => o.id === occupation
												)?.title
											: 'انتخاب شغل'}
									</span>
								</div>
								<Icon
									name="chevronRight"
									size={18}
									className="text-muted"
								/>
							</div>
						}
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
