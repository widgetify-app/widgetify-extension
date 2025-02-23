import { useStore } from '../../context/store.context'
import { useGetSupportCurrencies } from '../../services/getMethodHooks/getSupportCurrencies.hook'
import { AddCurrencyBox } from './components/addCurrency-box'
import { CurrencyBox } from './components/currency-box'
export function ArzLiveLayout() {
	const { data } = useGetSupportCurrencies()
	const { selectedCurrencies } = useStore()

	return (
		<div className="flex flex-col h-48 gap-1 px-2 overflow-x-hidden overflow-y-auto">
			{selectedCurrencies.map((currency, index) => (
				<CurrencyBox key={index} code={currency} />
			))}
			<AddCurrencyBox supportCurrencies={data || []} />
		</div>
	)
}
