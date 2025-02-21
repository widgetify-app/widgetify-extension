import { useStore } from '../../context/store.context'
import { useGetSupportCurrencies } from '../../services/getMethodHooks/getSupportCurrencies.hook'
import { AddCurrencyBox } from './components/addCurrency-box'
import { CurrencyBox } from './components/currency-box'
export function ArzLiveLayout() {
	const { data } = useGetSupportCurrencies()
	const { selectedCurrencies } = useStore()

	return (
		<section>
			<div className="grid grid-cols-4 gap-2 p-1 overflow-scroll overflow-y-auto md:grid-cols-4 max-h-96 overflow-x-clip scroll-smooth max-w-[60vw] mx-auto">
				{selectedCurrencies.map((currency, index) => (
					<CurrencyBox key={index} code={currency} />
				))}
				<AddCurrencyBox supportCurrencies={data || []} />
			</div>
		</section>
	)
}
