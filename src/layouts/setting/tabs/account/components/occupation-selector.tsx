import { useState, useRef } from 'react'
import { ClickableTooltip } from '@/components/clickableTooltip'
import type { ProfileMetaItem } from '@/services/hooks/profile/getProfileMeta.hook'
import { Button } from '@/components/button/button'
import { Icon } from '@/src/icons'
import { Chip } from '@/components/chip.component'

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
		<div className="w-64 p-2 border bg-base-200 rounded-2xl border-base-300">
			{isLoading ? (
				<div className="py-4 text-xs italic font-medium text-center animate-pulse">
					درحال بارگذاری...
				</div>
			) : (
				<div className="flex flex-row flex-wrap gap-1 overflow-x-hidden overflow-y-auto max-h-40">
					{occupations.map((occupation) => {
						const isActive = selectedOccupation === occupation.id
						return (
							<Chip
								selected={isActive}
								className="text-[11px]"
								key={occupation.id}
								onClick={() => handleSelect(occupation.id)}
							>
								{occupation.title}
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
				className=""
			/>
		</>
	)
}
