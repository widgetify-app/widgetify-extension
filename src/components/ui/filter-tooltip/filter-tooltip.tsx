import { useState, useRef, type ReactNode } from 'react'
import { ClickableTooltip } from '@/components/ui'
import { Tooltip } from '../tooltip/tooltip'
import { Button } from '../button/button'

export interface FilterOption {
	value: string
	label: string
}

export interface FilterTooltipProps {
	options: FilterOption[]
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
	buttonClassName?: string
	tooltipClassName?: string
	icon: ReactNode
}

export function FilterTooltip({
	options,
	value,
	onChange,
	placeholder = 'فیلتر',
	className,
	buttonClassName,
	tooltipClassName,
	icon,
}: FilterTooltipProps) {
	const [showTooltip, setShowTooltip] = useState(false)
	const filterButtonRef = useRef<HTMLButtonElement>(null)

	const handleFilterSelect = (selectedValue: string) => {
		onChange(selectedValue)
		setShowTooltip(false)
	}

	return (
		<div className={className}>
			<Tooltip content={placeholder}>
				<Button
					size="sm"
					ref={filterButtonRef}
					className={`px-2 border h-7! border-none! rounded-xl text-faint shrink-0 active:scale-95 ${buttonClassName || ''}`}
				>
					{icon}
				</Button>
			</Tooltip>
			<ClickableTooltip
				triggerRef={filterButtonRef}
				isOpen={showTooltip}
				setIsOpen={setShowTooltip}
				position="bottom"
				contentClassName={tooltipClassName || ''}
				content={
					<div className="flex flex-col gap-1 p-2 overflow-y-auto border border-content rounded-2xl min-w-25 bg-content max-h-52">
						{options.map((option) => (
							<button
								key={option.value}
								onClick={() => handleFilterSelect(option.value)}
								className={`px-3 py-2 text-xs cursor-pointer text-right rounded-lg transition-colors ${
									value === option.value
										? 'bg-brand-subtle text-primary border border-brand-muted'
										: 'hover:bg-hovered text-content'
								}`}
							>
								{option.label}
							</button>
						))}
					</div>
				}
			/>
		</div>
	)
}
