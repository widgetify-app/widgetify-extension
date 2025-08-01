import { getFromStorage, setToStorage } from '@/common/storage'
import React, { createContext, useEffect, useState } from 'react'

export interface StoreContext {
	selectedCurrencies: Array<string>
	setSelectedCurrencies: (currencies: Array<string>) => void
	currencyColorMode: CurrencyColorMode | null
	setCurrencyColorMode: (mode: CurrencyColorMode) => void
}

export enum CurrencyColorMode {
	NORMAL = 'NORMAL',
	X = 'X',
}

export const currencyContext = createContext<StoreContext>({
	selectedCurrencies: [],
	setSelectedCurrencies: () => {},
	currencyColorMode: null,
	setCurrencyColorMode: () => {},
})

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [selectedCurrencies, setSelectedCurrencies] = useState<string[] | null>(null)
	const [currencyColorMode, setCurrencyColorMode] = useState<CurrencyColorMode | null>(
		null
	)

	useEffect(() => {
		async function load() {
			const [storedCurrencies, currencyColorMode] = await Promise.all([
				getFromStorage('currencies'),
				getFromStorage('currencyColorMode'),
			])
			setSelectedCurrencies(storedCurrencies ?? ['USD', 'EUR', 'GRAM'])
			setCurrencyColorMode(currencyColorMode || CurrencyColorMode.NORMAL)
		}

		load()
	}, [])

	useEffect(() => {
		async function save() {
			await setToStorage('currencies', selectedCurrencies || [])
		}
		if (Array.isArray(selectedCurrencies)) save()
	}, [selectedCurrencies])

	useEffect(() => {
		async function save() {
			if (currencyColorMode) {
				await setToStorage('currencyColorMode', currencyColorMode)
			}
		}

		save()
	}, [currencyColorMode])

	return (
		<currencyContext.Provider
			value={{
				selectedCurrencies: selectedCurrencies ?? [],
				setSelectedCurrencies,
				setCurrencyColorMode,
				currencyColorMode,
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
