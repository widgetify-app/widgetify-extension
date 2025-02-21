import React, { createContext, useEffect } from 'react'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'
import CalendarLayout from '../layouts/calendar/calendar'
import { WeatherLayout } from '../layouts/weather/weather.layout'
export interface SelectedCity {
	city: string
	lat: number
	lon: number
}

export type LayoutItem = {
	id: string
	component: React.ReactNode
	moveable: boolean
}

export interface StoreContext {
	selectedCurrencies: Array<string>
	setSelectedCurrencies: (currencies: Array<string>) => void
	layouts: LayoutItem[]
	setLayouts: (layouts: LayoutItem[]) => void
	selectedCity: SelectedCity
	setSelectedCity: (city: SelectedCity) => void
}

export const storeContext = createContext<StoreContext>({
	selectedCurrencies: [],
	setSelectedCurrencies: () => {},
	selectedCity: {
		city: '',
		lat: 0,
		lon: 0,
	},
	setSelectedCity: () => {},

	layouts: [],
	setLayouts: () => {},
})

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [selectedCurrencies, setSelectedCurrencies] = React.useState<Array<string>>([
		'USD',
		'EUR',
		'GRAM',
	])
	const [selectedCity, setSelectedCity] = React.useState<SelectedCity>({
		city: 'Tehran',
		lat: 35.6892523,
		lon: 51.3896004,
	})

	const initialLayouts: LayoutItem[] = [
		{
			id: 'weather',
			component: <WeatherLayout />,
			moveable: true,
		},
		{
			id: 'calendar',
			component: <CalendarLayout />,
			moveable: true,
		},
	]

	const [layouts, setLayouts] = React.useState<LayoutItem[]>([])

	useEffect(() => {
		async function load() {
			const storedCurrencies = await getFromStorage(StoreKey.CURRENCIES)
			const storedCity = await getFromStorage(StoreKey.SELECTED_CITY)
			const storedOrder = await getFromStorage<string[]>(StoreKey.LAYOUT_ORDER)
			if (storedCurrencies) {
				setSelectedCurrencies(storedCurrencies as any)
			}
			if (storedCity) {
				setSelectedCity(storedCity as any)
			}
			console.log('storedOrder:', storedOrder)
			if (storedOrder?.length) {
				const mapped = storedOrder
					.map((id) => initialLayouts.find((layout) => layout.id === id))
					.filter((layout): layout is LayoutItem => layout !== undefined)

				setLayouts(mapped)
			} else {
				setLayouts(initialLayouts)
			}
		}

		load()
	}, [])

	useEffect(() => {
		async function save() {
			await setToStorage(StoreKey.CURRENCIES, selectedCurrencies)
		}
		save()
	}, [selectedCurrencies])

	useEffect(() => {
		async function save() {
			await setToStorage(StoreKey.SELECTED_CITY, selectedCity)
		}
		save()
	}, [selectedCity])

	useEffect(() => {
		async function save() {
			await setToStorage(
				StoreKey.LAYOUT_ORDER,
				layouts.map((layout) => layout.id),
			)
		}
		save()
	}, [layouts])

	return (
		<storeContext.Provider
			value={{
				selectedCurrencies,
				setSelectedCurrencies,
				selectedCity,
				setSelectedCity,
				layouts,
				setLayouts,
			}}
		>
			{children}
		</storeContext.Provider>
	)
}

export function useStore(): StoreContext {
	const context = React.useContext(storeContext)
	if (!context) {
		throw new Error('useStore must be used within a StoreProvider')
	}

	return context
}
