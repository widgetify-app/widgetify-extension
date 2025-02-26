import React, { createContext, useCallback, useEffect, useState } from 'react'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'

export interface SelectedCity {
	city: string
	lat: number
	lon: number
}

export interface LocalBookmark {
	id: string
	title: string
	url: string
	icon: string
	isLocal: boolean
	pinned: boolean
}

export interface StoreContext {
	selectedCurrencies: Array<string>
	setSelectedCurrencies: (currencies: Array<string>) => void

	selectedCity: SelectedCity
	setSelectedCity: (city: SelectedCity) => void

	bookmarks: LocalBookmark[]
	setBookmarks: (bookmarks: LocalBookmark[]) => void
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

	bookmarks: [],
	setBookmarks: () => {},
})

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [selectedCurrencies, setSelectedCurrencies] = useState<string[] | null>(null)
	const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null)
	const [bookmarks, setBookmarks] = useState<LocalBookmark[] | null>(null)

	useEffect(() => {
		async function load() {
			const storedCurrencies = await getFromStorage<string[]>(StoreKey.CURRENCIES)
			const storedCity = await getFromStorage<SelectedCity>(StoreKey.SELECTED_CITY)
			const storedBookmarks = await getFromStorage<LocalBookmark[]>(StoreKey.Bookmarks)

			setSelectedCurrencies(storedCurrencies ?? ['USD', 'EUR', 'GRAM'])
			setSelectedCity(storedCity ?? { city: 'Tehran', lat: 35.6892523, lon: 51.3896004 })
			setBookmarks(storedBookmarks ?? [])
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
		console.log('selectedCity')
		async function save() {
			await setToStorage(StoreKey.SELECTED_CITY, selectedCity)
		}
		save()
	}, [selectedCity])

	useEffect(() => {
		async function save() {
			console.log('SAVE')
			if (Array.isArray(bookmarks)) {
				const localBookMarks = bookmarks.filter((bookmark) => bookmark.isLocal)
				await setToStorage(StoreKey.Bookmarks, localBookMarks)
			}
		}
		save()
	}, [bookmarks])

	if (selectedCurrencies === null || selectedCity === null || bookmarks === null) {
		return null
	}

	return (
		<storeContext.Provider
			value={{
				selectedCurrencies,
				setSelectedCurrencies,
				selectedCity,
				setSelectedCity,
				bookmarks,
				setBookmarks,
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
