import React, { createContext, useEffect, useState } from 'react'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'
import type { WeatherSettings } from '../services/getMethodHooks/weather/weather.interface'

export interface SelectedCity {
	name: string
	lat: number
	lon: number
	state?: string | null
}

export interface WeatherContext {
	selectedCity: SelectedCity
	setSelectedCity: (city: SelectedCity) => void
	weatherSettings: WeatherSettings
	updateWeatherSettings: <K extends keyof WeatherSettings>(
		key: K,
		value: WeatherSettings[K],
	) => void
}
const defSetting: WeatherSettings = {
	forecastCount: 4,
	temperatureUnit: 'metric',
	useAI: true,
}

export const weatherContext = createContext<WeatherContext>({
	selectedCity: {
		name: '',
		lat: 0,
		lon: 0,
		state: null,
	},
	setSelectedCity: () => {},
	weatherSettings: defSetting,
	updateWeatherSettings: () => {},
})

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState(true)
	const [selectedCity, setSelectedCity] = useState<SelectedCity>({
		name: '',
		lat: 0,
		lon: 0,
		state: null,
	})
	const [weatherSettings, setWeatherSettings] = useState<WeatherSettings>(defSetting)

	useEffect(() => {
		async function load() {
			const [storedCity, storedSettings] = await Promise.all([
				getFromStorage<SelectedCity>(StoreKey.SELECTED_CITY),
				getFromStorage<WeatherSettings>(StoreKey.WEATHER_SETTINGS),
			])

			setSelectedCity(storedCity || { name: 'Tehran', lat: 35.6892523, lon: 51.3896004 })
			if (storedSettings) setWeatherSettings(storedSettings)
			setIsLoading(false)
		}
		load()
	}, [])

	useEffect(() => {
		async function save() {
			await Promise.all([
				setToStorage(StoreKey.SELECTED_CITY, selectedCity),
				setToStorage(StoreKey.WEATHER_SETTINGS, weatherSettings),
			])
		}
		if (!isLoading) save()
	}, [selectedCity, weatherSettings, isLoading])

	const updateWeatherSettings = <K extends keyof WeatherSettings>(
		key: K,
		value: WeatherSettings[K],
	) => {
		console.log(key, value)
		if (key === 'forecastCount' && ((value as number) < 1 || (value as number) > 10)) {
			value = 4 as WeatherSettings[K]
		}
		setWeatherSettings((prev) => ({ ...prev, [key]: value }))
	}

	return (
		<weatherContext.Provider
			value={{ selectedCity, setSelectedCity, weatherSettings, updateWeatherSettings }}
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
