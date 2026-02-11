import { useState, useRef } from 'react'
import { ClickableTooltip } from '@/components/clickableTooltip'
import type { ProfileMetaItem } from '@/services/hooks/profile/getProfileMeta.hook'
import { Button } from '@/components/button/button'
import { FiCheck } from 'react-icons/fi'

interface InterestsSelectorProps {
	interests: ProfileMetaItem[]
	selectedInterests: string[]
	onSelect: (interestIds: string[]) => void
	isLoading?: boolean
	triggerElement: React.ReactNode
}

export const InterestsSelector = ({
	interests,
	selectedInterests,
	onSelect,
	isLoading = false,
	triggerElement,
}: InterestsSelectorProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const triggerRef = useRef<HTMLButtonElement>(null)

	const handleInterestToggle = (interestId: string) => {
		const isSelected = selectedInterests.includes(interestId)
		if (isSelected) {
			onSelect(selectedInterests.filter((id) => id !== interestId))
		} else {
			onSelect([...selectedInterests, interestId])
		}
	}

	const content = (
		<div className="w-64 p-1">
			{isLoading ? (
				<div className="py-3 text-[10px] italic font-medium text-center animate-pulse text-muted">
					صبر کنید...
				</div>
			) : (
				<div className="flex flex-wrap gap-2 p-1 overflow-x-hidden overflow-y-auto scrollbar-none max-h-40">
					{interests.map((interest) => {
						const isSelected = selectedInterests.includes(interest.id)

						return (
							<button
								key={interest.id}
								type="button"
								onClick={() => handleInterestToggle(interest.id)}
								className={`
								h-8 px-2 flex items-center justify-center w-fit gap-1.5 hover:border-none cursor-pointer
								text-[11px] font-medium rounded-xl border whitespace-nowrap
								transition-all duration-150 active:scale-95
								${
									isSelected
										? 'bg-primary border-primary text-white shadow-sm'
										: 'border border-base-content/20 text-content'
								}
							`}
							>
								<span className="text-[11px] leading-none">
									{interest.title}
								</span>
							</button>
						)
					})}
				</div>
			)}

			<div className="flex gap-2 pt-2">
				<Button
					onClick={() => setIsOpen(!isOpen)}
					size="sm"
					className={`flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-white`}
				>
					<FiCheck size={16} className="ml-1" />
					تایید{' '}
				</Button>
				<Button
					onClick={() => setIsOpen(!isOpen)}
					size="sm"
					className="w-20 rounded-2xl border-muted hover:bg-muted/50 text-content"
				>
					لغو
				</Button>
			</div>
		</div>
	)

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-between w-full p-3 text-right transition-colors hover:bg-content"
			>
				{triggerElement}
			</button>

			<ClickableTooltip
				content={content}
				triggerRef={triggerRef}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				position="bottom"
			/>
		</>
	)
}
