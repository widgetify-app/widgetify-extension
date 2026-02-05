import { useState, useRef, ReactNode } from 'react'
import { FaFilter } from 'react-icons/fa'
import { ClickableTooltip } from '@/components/clickableTooltip'
import Tooltip from '../toolTip'
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
					className={`px-2 border h-7! border-none! rounded-xl text-base-content/40 shrink-0 active:scale-95 ${buttonClassName || ''}`}
				>
					{icon}
				</Button>
			</Tooltip>
			<ClickableTooltip
				triggerRef={filterButtonRef}
				isOpen={showTooltip}
				setIsOpen={setShowTooltip}
				position="bottom"
				contentClassName={`!p-2 !max-w-none ${tooltipClassName || ''}`}
				content={
					<div className="flex flex-col gap-1 min-w-[100px] max-h-52 overflow-y-auto pl-1">
						{options.map((option) => (
							<button
								key={option.value}
								onClick={() => handleFilterSelect(option.value)}
								className={`px-3 py-2 text-xs cursor-pointer text-right rounded-lg transition-colors ${
									value === option.value
										? 'bg-primary/10 text-primary border border-primary/20'
										: 'hover:bg-base-content/10 text-content'
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
