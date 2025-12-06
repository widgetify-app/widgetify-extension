import type { PRIORITY_OPTIONS } from '@/common/constant/priority_options'
import Tooltip from '../toolTip'
import { FiFlag } from 'react-icons/fi'

export const PriorityButton = ({
	option,
	isSelected,
	onClick,
}: {
	option: (typeof PRIORITY_OPTIONS)[0]
	isSelected: boolean
	onClick: () => void
}) => (
	<Tooltip content={option.ariaLabel}>
		<button
			type="button"
			onClick={onClick}
			className={`
				flex items-center justify-center w-4 h-4 rounded-full
				transition-all duration-150 cursor-pointer 
				${option.bgColor} ${option.hoverBgColor}
				${isSelected ? 'ring-2 ring-offset-0 ring-primary' : ''}
			`}
		>
			{isSelected && <FiFlag size={8} className="text-white" />}
		</button>
	</Tooltip>
)
