import { useState, useRef, ReactNode } from 'react'
import { FaFilter } from 'react-icons/fa'
import { ClickableTooltip } from '@/components/clickableTooltip'
import Tooltip from '../toolTip'

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
				<button
					ref={filterButtonRef}
					className={`flex items-center cursor-pointer hover:bg-base-300! rounded-full gap-1 px-2 py-2 text-[10px] transition-all duration-200   bg-content border-content hover:border-primary/40 text-content ${buttonClassName || ''}`}
				>
					{icon}
				</button>
			</Tooltip>
			<ClickableTooltip
				triggerRef={filterButtonRef}
				isOpen={showTooltip}
				setIsOpen={setShowTooltip}
				position="bottom"
				contentClassName={`!p-2 !max-w-none ${tooltipClassName || ''}`}
				content={
					<div className="flex flex-col gap-1 min-w-[100px]">
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
