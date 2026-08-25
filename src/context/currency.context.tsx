import React, { createContext, useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'

export interface StoreContext {
	selectedCurrencies: Array<string>
	setSelectedCurrencies: (currencies: Array<string>) => void
	currencyColorMode: CurrencyColorMode | null
	setCurrencyColorMode: (mode: CurrencyColorMode) => void
	reorderCurrencies: (currencies: Array<string>) => void
	compactCurrencies: Record<string, string>
	setCompactCurrency: (instanceId: string, code: string) => void
	getCompactCurrency: (instanceId?: string) => string
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
	reorderCurrencies: () => {},
	compactCurrencies: {},
	setCompactCurrency: () => {},
	getCompactCurrency: () => 'USD',
})

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [selectedCurrencies, setSelectedCurrencies] = useState<string[] | null>(null)
	const [currencyColorMode, setCurrencyColorMode] = useState<CurrencyColorMode | null>(
		null
	)
	const [compactCurrencies, setCompactCurrencies] = useState<Record<string, string>>({})

	useEffect(() => {
		async function load() {
			const [storedCurrencies, storedColorMode, storedCompactCurrencies] =
				await Promise.all([
					getFromStorage('currencies'),
					getFromStorage('currencyColorMode'),
					getFromStorage('compact_currencies'),
				])
			setSelectedCurrencies(storedCurrencies ?? ['USD', 'EUR', 'GRAM'])
			setCurrencyColorMode(storedColorMode || CurrencyColorMode.NORMAL)
			setCompactCurrencies(storedCompactCurrencies || {})
		}

		const listen = listenEvent(
			'currencies_updated',
			(data: {
				currencies: string[]
				colorMode: CurrencyColorMode
				compactCurrencies?: Record<string, string>
			}) => {
				if (data.currencies) setSelectedCurrencies(data.currencies)
				if (data.colorMode) setCurrencyColorMode(data.colorMode)
				if (data.compactCurrencies) setCompactCurrencies(data.compactCurrencies)
			}
		)

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

	useEffect(() => {
		async function save() {
			if (currencyColorMode) {
				await setToStorage('currencyColorMode', currencyColorMode)
			}
		}

		save()
	}, [currencyColorMode])

	useEffect(() => {
		async function save() {
			await setToStorage('compact_currencies', compactCurrencies)
		}
		if (compactCurrencies && Object.keys(compactCurrencies).length > 0) {
			save()
		}
	}, [compactCurrencies])

	const reorderCurrencies = (currencies: Array<string>) => {
		setSelectedCurrencies(currencies)
	}

	const setCompactCurrency = (instanceId: string, code: string) => {
		setCompactCurrencies((prev) => {
			const updated = { ...prev, [instanceId]: code }
			setToStorage('compact_currencies', updated)
			return updated
		})
	}

	const getCompactCurrency = (instanceId?: string): string => {
		if (instanceId && compactCurrencies[instanceId]) {
			return compactCurrencies[instanceId]
		}
		if (compactCurrencies.default) {
			return compactCurrencies.default
		}
		if (selectedCurrencies && selectedCurrencies.length > 0) {
			return selectedCurrencies[0]
		}
		return 'USD'
	}

	return (
		<currencyContext.Provider
			value={{
				selectedCurrencies: selectedCurrencies ?? [],
				setSelectedCurrencies,
				setCurrencyColorMode,
				currencyColorMode,
				reorderCurrencies,
				compactCurrencies,
				setCompactCurrency,
				getCompactCurrency,
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
