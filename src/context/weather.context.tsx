import React, { createContext, useEffect, useState } from 'react'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'

export interface SelectedCity {
	city: string
	lat: number
	lon: number
}

export interface WeatherContext {
	selectedCity: SelectedCity
	setSelectedCity: (city: SelectedCity) => void
}

export const weatherContext = createContext<WeatherContext>({
	selectedCity: {
		city: '',
		lat: 0,
		lon: 0,
	},
	setSelectedCity: () => {},
})

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null)

	useEffect(() => {
		async function load() {
			const storedCity = await getFromStorage<SelectedCity>(StoreKey.SELECTED_CITY)
			setSelectedCity(storedCity ?? { city: 'Tehran', lat: 35.6892523, lon: 51.3896004 })
		}

		load()
	}, [])

	useEffect(() => {
		async function save() {
			if (selectedCity === null) return
			await setToStorage(StoreKey.SELECTED_CITY, selectedCity)
		}
		save()
	}, [selectedCity])

	if (selectedCity === null) {
		return null
	}

	return (
		<weatherContext.Provider
			value={{
				selectedCity,
				setSelectedCity,
			}}
		>
			{children}
		</weatherContext.Provider>
	)
}

export function useWeatherStore(): WeatherContext {
	const context = React.useContext(weatherContext)
	if (!context) {
		throw new Error('useStore must be used within a StoreProvider')
	}

	return context
}
