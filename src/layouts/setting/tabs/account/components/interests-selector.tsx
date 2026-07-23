import { useState, useRef } from 'react'
import { ClickableTooltip } from '@/components/clickableTooltip'
import type { ProfileMetaItem } from '@/services/hooks/profile/getProfileMeta.hook'
import { Button } from '@/components/button/button'
import { Icon } from '@/src/icons'
import { Chip } from '@/components/chip.component'

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
		<div className="p-2 border w-72 bg-base-200 rounded-2xl border-base-300">
			{isLoading ? (
				<div className="py-3 text-[10px] italic font-medium text-center animate-pulse text-muted">
					صبر کنید...
				</div>
			) : (
				<div className="flex flex-wrap gap-0.5 p-1 overflow-x-hidden overflow-y-auto max-h-40">
					{interests.map((interest) => {
						const isSelected = selectedInterests.includes(interest.id)

						return (
							<Chip
								key={interest.id}
								selected={isSelected}
								className="w-fit! text-[11px]"
								onClick={() => handleInterestToggle(interest.id)}
							>
								{interest.title}
							</Chip>
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
					<Icon name="check" size={16} className="ml-1" />
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
