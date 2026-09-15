import React, { createContext, useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'

export interface StoreContext {
	selectedCurrencies: Array<string>
	setSelectedCurrencies: (currencies: Array<string>) => void
	reorderCurrencies: (currencies: Array<string>) => void
}

export const currencyContext = createContext<StoreContext>({
	selectedCurrencies: [],
	setSelectedCurrencies: () => {},
	reorderCurrencies: () => {},
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

		const listen = listenEvent('currencies_updated', (data) => {
			if (data.currencies) setSelectedCurrencies(data.currencies)
		})

		load()
		return () => {
			listen()
		}
	}, [])

	useEffect(() => {
		async function save() {
			await setToStorage('currencies', selectedCurrencies || [])
		}
		if (Array.isArray(selectedCurrencies)) save()
	}, [selectedCurrencies])

	const reorderCurrencies = (currencies: Array<string>) => {
		setSelectedCurrencies(currencies)
	}

	return (
		<currencyContext.Provider
			value={{
				selectedCurrencies: selectedCurrencies ?? [],
				setSelectedCurrencies,
				reorderCurrencies,
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
