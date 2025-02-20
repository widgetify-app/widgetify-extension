import jalaliMoment from 'jalali-moment'
import { useContext, useEffect, useState } from 'react'
import { StoreKey } from '../../common/constant/store.key'
import { storeContext } from '../../context/setting.context'
import { useGetSupportCurrencies } from '../../services/getMethodHooks/getSupportCurrencies.hook'
import { AddCurrencyBox } from './components/addCurrency-box'
import { CurrencyBox } from './components/currency-box'
export function ArzLiveLayout() {
	const { isLoading, data } = useGetSupportCurrencies()
	const { selectedCurrencies } = useContext(storeContext)
	const [updatedAt, setUpdatedAt] = useState(
		localStorage.getItem(StoreKey.CURRENCY_UPDATED_AT) || new Date(),
	)

	useEffect(() => {
		function handleUpdatedAt() {
			setUpdatedAt(new Date())
			localStorage.setItem(StoreKey.CURRENCY_UPDATED_AT, new Date().toString())
		}

		window.addEventListener('fetched-data', handleUpdatedAt)

		return () => {
			window.removeEventListener('fetched-data', handleUpdatedAt)
		}
	}, [])

	return (
		<section>
			<div className="grid grid-cols-2 gap-2 p-1 overflow-scroll overflow-y-auto md:grid-cols-4 max-h-96 overflow-x-clip scroll-smooth">
				{selectedCurrencies.map((currency, index) => (
					<CurrencyBox key={index} code={currency} />
				))}
				<AddCurrencyBox supportCurrencies={data || []} />
			</div>
		</section>
	)
}
