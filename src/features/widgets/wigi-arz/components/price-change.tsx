import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { getPriceChange } from '../utils/get-price-change'

const DIRECTION_STYLE = {
	up: { className: 'text-danger', label: 'افزایش' },
	down: { className: 'text-success', label: 'کاهش' },
} as const

interface PriceChangeProps {
	changePercentage?: number
}

export function PriceChange({ changePercentage }: PriceChangeProps) {
	const change = getPriceChange(changePercentage)
	if (change.direction === 'flat') return null

	const style = DIRECTION_STYLE[change.direction]

	return (
		<span
			className={cn(
				'inline-flex items-center gap-0.5 font-semibold text-3xs tabular-nums',
				style.className
			)}
		>
			<Icon
				name={change.direction === 'up' ? 'upLong' : 'downLong'}
				size={10}
				aria-hidden="true"
			/>
			<span className="sr-only">{style.label}</span>
			{change.percent}
		</span>
	)
}
