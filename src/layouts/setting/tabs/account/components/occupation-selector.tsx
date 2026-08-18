import { useState, useRef } from 'react'
import { Dropdown } from '@/components/ui'
import type { ProfileMetaItem } from '@/services/hooks/profile/get-profile-meta.hook'
import { Chip } from '@/components/ui'

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
