import { CurrencyEmpty } from '../components/currency-empty'
import { CurrencyList } from '../components/currency-list'

interface WigiArz2x3Props {
	currencies: string[]
	onReorder: (currencies: string[]) => void
	instanceId?: string
}

export function WigiArz2x3({ currencies, onReorder, instanceId }: WigiArz2x3Props) {
	if (currencies.length === 0) {
		return <CurrencyEmpty instanceId={instanceId} />
	}

	return (
		<CurrencyList
			currencies={currencies}
			onReorder={onReorder}
			className="flex flex-col h-full gap-1.5 overflow-x-hidden overflow-y-auto scrollbar-none"
		/>
	)
}
