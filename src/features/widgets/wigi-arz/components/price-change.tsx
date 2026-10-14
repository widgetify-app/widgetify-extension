import { t, type MessageKey } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { useCurrencyColorMode } from '../hooks/use-currency-color-mode'
import { getChangeColorClass } from '../utils/currency-color-mode'
import { formatChangeAmount, getPriceChange } from '../utils/get-price-change'

const DIRECTION_LABEL_KEY: Record<'up' | 'down', MessageKey> = {
	up: 'widgets.wigiArz.change.up',
	down: 'widgets.wigiArz.change.down',
}

interface PriceChangeProps {
	changePercentage?: number
	amount?: number
}

export function PriceChange({ changePercentage, amount }: PriceChangeProps) {
	const colorMode = useCurrencyColorMode()
	const change = getPriceChange(changePercentage)
	if (change.direction === 'flat') return null

	return (
		<span
			className={cn(
				'inline-flex items-center gap-0.5 font-semibold text-3xs tabular-nums',
				getChangeColorClass(change.direction, colorMode)
			)}
		>
			<Icon
				name={change.direction === 'up' ? 'upLong' : 'downLong'}
				size={10}
				aria-hidden="true"
			/>
			<span className="sr-only">{t(DIRECTION_LABEL_KEY[change.direction])}</span>
			{amount === undefined ? change.percent : formatChangeAmount(amount)}
		</span>
	)
}
