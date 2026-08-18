import { useState, useRef } from 'react'
import { Dropdown } from '@/components/ui'
import type { ProfileMetaItem } from '@/services/hooks/profile/get-profile-meta.hook'
import { Chip } from '@/components/ui'

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
		<div className="p-2 border w-82 bg-base-200  rounded-2xl border-base-300">
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
		</div>
	)

	return (
		<Dropdown
			trigger={
				<button
					ref={triggerRef}
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center justify-between w-full py-2 text-right transition-colors hover:bg-content"
				>
					{triggerElement}
				</button>
			}
			className="w-full"
		>
			{content}
		</Dropdown>
	)
}
