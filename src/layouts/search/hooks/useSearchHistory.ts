import { getFromStorage, removeFromStorage, setToStorage } from '@/common/storage'
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'recent_searches'
const MAX_SEARCHES = 8

export interface SearchHistoryItem {
	query: string
	timestamp: number
	isRecent?: boolean
}

export function useSearchHistory() {
	const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([])
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		const load = async () => {
			try {
				const stored = (await getFromStorage(STORAGE_KEY)) as SearchHistoryItem[]
				if (stored) {
					setRecentSearches(stored)
				}
			} catch {}
		}
		load()
		setIsLoaded(true)
	}, [])

	const addSearch = useCallback((query: string) => {
		try {
			setRecentSearches((prev) => {
				const filtered = prev.filter((item) => item.query !== query)

				const updated = [
					{
						query,
						timestamp: Date.now(),
						isRecent: true,
					},
					...filtered,
				]

				const limited = updated.slice(0, MAX_SEARCHES)

				try {
					setToStorage(STORAGE_KEY, limited)
				} catch {}

				return limited
			})
		} catch {}
	}, [])

	const removeHistoryItem = useCallback((query: string) => {
		try {
			setRecentSearches((prev) => {
				const filtered = prev.filter((item) => item.query !== query)

				try {
					setToStorage(STORAGE_KEY, filtered)
				} catch {}

				return filtered
			})
		} catch {}
	}, [])

	const clearHistory = useCallback(async () => {
		try {
			setRecentSearches([])
			await removeFromStorage(STORAGE_KEY)
		} catch (error) {
			console.error('Failed to clear search history:', error)
		}
	}, [])

	return {
		recentSearches,
		addSearch,
		clearHistory,
		isLoaded,
		removeHistoryItem,
	}
}
