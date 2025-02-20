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
		<section className="p-2 mx-1 rounded lg:mx-4">
			<div className="flex items-center justify-between w-full px-1">
				<h2 className="text-lg font-semibold dark:text-gray-200 font-[balooTamma] w-full">
					🪙 ArzLive
				</h2>
				<span className="text-xs text-gray-500 dark:text-gray-400 font-[balooTamma] font-semibold  w-full text-end">
					{jalaliMoment(updatedAt).format('jYYYY/jM/jD, HH:mm A')}
				</span>
			</div>
			<div className="grid grid-cols-2 gap-2 p-1 overflow-scroll overflow-x-hidden overflow-y-auto max-h-96 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 scroll-smooth">
				{selectedCurrencies.map((currency, index) => (
					<CurrencyBox key={index} code={currency} />
				))}

				<AddCurrencyBox loading={isLoading} supportCurrencies={data || []} />
			</div>
		</section>
	)
}
