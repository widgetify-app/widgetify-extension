import type { CurrencyColorMode } from '@/context/currency.context'
import { CurrencyEmptyState } from '../components/currency-empty-state'
import { CurrencyList } from '../components/currency-list'

interface WigiArz2x3Props {
	currencies: string[]
	currencyColorMode: CurrencyColorMode | null
	onReorder: (currencies: string[]) => void
	instanceId?: string
}

export function WigiArz2x3({
	currencies,
	currencyColorMode,
	onReorder,
	instanceId,
}: WigiArz2x3Props) {
	if (currencies.length === 0) {
		return <CurrencyEmptyState instanceId={instanceId} />
	}

	return (
		<CurrencyList
			currencies={currencies}
			currencyColorMode={currencyColorMode}
			onReorder={onReorder}
			className="flex flex-col h-full gap-1.5 overflow-x-hidden overflow-y-auto scrollbar-none"
		/>
	)
}
