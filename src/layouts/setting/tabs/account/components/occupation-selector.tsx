import { useState, useRef } from 'react'
import { ClickableTooltip } from '@/components/clickableTooltip'
import type { ProfileMetaItem } from '@/services/hooks/profile/getProfileMeta.hook'

interface OccupationSelectorProps {
	occupations: ProfileMetaItem[]
	selectedOccupation: string | null
	onSelect: (occupationId: string | null) => void
	isLoading?: boolean
	triggerElement: React.ReactNode
}

export const OccupationSelector = ({
	occupations,
	selectedOccupation,
	onSelect,
	isLoading = false,
	triggerElement,
}: OccupationSelectorProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const triggerRef = useRef<HTMLButtonElement>(null)

	const handleSelect = (occupationId: string) => {
		if (selectedOccupation === occupationId) {
			onSelect(null)
		} else {
			onSelect(occupationId)
		}
		setIsOpen(false)
	}

	const content = (
		<div className="w-48 p-1 overflow-x-hidden overflow-y-auto scrollbar-none max-h-40">
			{isLoading ? (
				<div className="py-4 text-xs italic font-medium text-center animate-pulse">
					درحال بارگذاری...
				</div>
			) : (
				<div className="flex flex-row flex-wrap gap-1">
					{occupations.map((occupation) => {
						const isActive = selectedOccupation === occupation.id
						return (
							<button
								key={occupation.id}
								type="button"
								onClick={() => handleSelect(occupation.id)}
								className={`
									h-8 px-3 w-fit flex items-center justify-center 
									text-[10px] font-black  rounded-full text-muted border 
									transition-all duration-200 active:scale-95 cursor-pointer
									${
										isActive
											? 'bg-primary border-primary shadow-sm text-white!'
											: 'bg-base-200/50 border-base-300/30 text-content hover:bg-base-200'
									}
								`}
							>
								{occupation.title}
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
				className=""
			/>
		</>
	)
}
