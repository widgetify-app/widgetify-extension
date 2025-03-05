import React, { createContext, useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '../common/storage'

export interface StoreContext {
	selectedCurrencies: Array<string>
	setSelectedCurrencies: (currencies: Array<string>) => void
}

export const currencyContext = createContext<StoreContext>({
	selectedCurrencies: [],
	setSelectedCurrencies: () => {},
})

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [selectedCurrencies, setSelectedCurrencies] = useState<string[] | null>(null)

	useEffect(() => {
		async function load() {
			const storedCurrencies = await getFromStorage('currencies')

			setSelectedCurrencies(storedCurrencies ?? ['USD', 'EUR', 'GRAM'])
		}

		load()
	}, [])

	useEffect(() => {
		async function save() {
			await setToStorage('currencies', selectedCurrencies || [])
		}
		save()
	}, [selectedCurrencies])

	return (
		<currencyContext.Provider
			value={{
				selectedCurrencies: selectedCurrencies ?? [],
				setSelectedCurrencies,
			}}
		>
			{children}
		</currencyContext.Provider>
	)
}

export function useCurrencyStore(): StoreContext {
	const context = React.useContext(currencyContext)
	if (!context) {
		throw new Error('useStore must be used within a StoreProvider')
	}

	return context
}
