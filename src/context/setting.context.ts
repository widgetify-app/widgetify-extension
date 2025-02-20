import { createContext } from 'react'
export interface SelectedCity {
	city: string
	lat: number
	lon: number
}
export interface StoreContext {
	selectedCurrencies: Array<string>
	setSelectedCurrencies: (currencies: Array<string>) => void

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
})
