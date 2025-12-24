import { useState, useRef } from 'react'
import { ClickableTooltip } from '@/components/clickableTooltip'
import type { ProfileMetaItem } from '@/services/hooks/profile/getProfileMeta.hook'

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
		<div className="w-48 p-1 overflow-x-hidden overflow-y-auto scrollbar-none max-h-40">
			{isLoading ? (
				<div className="py-4 text-xs italic font-medium text-center animate-pulse">
					صبر کنید...
				</div>
			) : (
				<div className="flex flex-row flex-wrap gap-2">
					{interests.map((interest) => {
						const isSelected = selectedInterests.includes(interest.id)

						return (
							<button
								key={interest.id}
								type="button"
								onClick={() => handleInterestToggle(interest.id)}
								className={`
									h-8 px-3 w-fit flex items-center justify-center 
									text-[10px] font-black rounded-full text-muted border 
									transition-all duration-200 active:scale-95 cursor-pointer
									${
										isSelected
											? 'bg-primary border-primary shadow-sm text-white!'
											: 'bg-base-200/50 border-base-300 text-content  hover:bg-base-200 shadow-xs'
									}
								`}
							>
								{interest.title}
							</button>
						)
					})}
				</div>
			)}
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
