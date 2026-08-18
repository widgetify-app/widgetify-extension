import { Chip, Modal } from '@/components/ui'
import { useUpdateUserProfile } from '@/services/hooks/auth/auth-service.hook'
import { useEffect, useState } from 'react'
import { InterestsSelector } from '../interests-selector'
import { useGetInterests } from '@/services/hooks/profile/get-profile-meta.hook'
import { SectionPanel } from '@/components/ui'
import { FooterButtons } from './footer-buttons'

interface Prop {
	show: boolean
	onClose: (type: 'success' | 'cancel') => void
	currentValue?: any
}
export function ChangeInterestsModal({ show, onClose, currentValue }: Prop) {
	const [interests, setInterests] = useState<any[]>([])
	const updateProfileMutation = useUpdateUserProfile()
	const { data: fetchedInterests = [], isLoading: interestsLoading } = useGetInterests()

	const onCloseHandler = () => {
		onClose('cancel')
	}

	const onClickSave = async () => {
		const data = new FormData()
		if (interests.length) interests.map((id) => data.append('interestIds[]', id))
		else data.append('interestIds[]', '')
		await updateProfileMutation.mutateAsync(data)
		onClose('success')
	}

	const onCancel = () => {
		onClose('cancel')
	}

	useEffect(() => {
		if (currentValue?.length) {
			setInterests(currentValue.map((p: any) => p.id))
		}
	}, [currentValue])

	return (
		<Modal
			isOpen={show}
			onClose={onCloseHandler}
			direction="rtl"
			showCloseButton={false}
		>
			<SectionPanel title="به چی علاقه داری؟" size="xs">
				<InterestsSelector
					interests={fetchedInterests}
					selectedInterests={interests}
					onSelect={(ids) => setInterests(() => [...ids])}
					isLoading={interestsLoading}
					triggerElement={
						<div className="flex flex-wrap w-full min-h-24 max-h-24 h-24 overflow-y-auto gap-1 p-2 transition-all border   border-content rounded-2xl hover:border-primary/40! cursor-pointer">
							{interests.length > 0 ? (
								interests.map((id) => (
									<Chip
										key={id}
										className="py-0.5 px-1 h-fit"
										selected
										onClick={() => {}}
									>
										{fetchedInterests.find((i) => i.id === id)?.title}
									</Chip>
								))
							) : (
								<span className="text-xs text-muted">
									انتخاب زمینه‌های مورد علاقه...
								</span>
							)}
						</div>
					}
				/>
				<FooterButtons
					handleCancel={onCancel}
					handleConfirm={onClickSave}
					isPending={updateProfileMutation.isPending}
				/>
			</SectionPanel>
		</Modal>
	)
}
