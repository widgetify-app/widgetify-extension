import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { useUpdateUserProfile } from '@/services/hooks/auth/authService.hook'
import { useEffect, useState } from 'react'
import { InterestsSelector } from '../interests-selector'
import { useGetInterests } from '@/services/hooks/profile/getProfileMeta.hook'
import { SectionPanel } from '@/components/section-panel'

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
			<div className="flex flex-col justify-between h-40 gap-4">
				<SectionPanel title="به چی علاقه داری؟" size="xs">
					<InterestsSelector
						interests={fetchedInterests}
						selectedInterests={interests}
						onSelect={(ids) => setInterests(() => [...ids])}
						isLoading={interestsLoading}
						triggerElement={
							<div className="flex flex-wrap w-full max-h-32 overflow-y-auto gap-1 p-3 transition-all border   border-content rounded-2xl hover:border-primary/40! cursor-pointer">
								{interests.length > 0 ? (
									interests.map((id) => (
										<div
											key={id}
											className="flex items-center w-fit px-2 py-1 text-[11px] bg-primary/10 text-primary rounded-full border border-primary/20 h-6"
										>
											{
												fetchedInterests.find((i) => i.id === id)
													?.title
											}
										</div>
									))
								) : (
									<span className="text-xs text-muted">
										انتخاب زمینه‌های مورد علاقه...
									</span>
								)}
							</div>
						}
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
