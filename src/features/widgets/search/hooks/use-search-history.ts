import { getFromStorage, setToStorage } from '@/common/storage'
import { useCallback, useEffect, useState } from 'react'
import { SEARCH_HISTORY_LIMIT } from '../constants'
import {
	normalizeSearchHistory,
	type SearchHistoryItem,
} from '../utils/normalize-search-history'

const STORAGE_KEY = 'recent_searches'

export type { SearchHistoryItem }

export function useSearchHistory() {
	const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([])

	useEffect(() => {
		const load = async () => {
			const stored = await getFromStorage(STORAGE_KEY)
			setRecentSearches(normalizeSearchHistory(stored))
		}
		load()
	}, [])

	const addSearch = useCallback((query: string) => {
		setRecentSearches((prev) => {
			const filtered = prev.filter((item) => item.query !== query)
			const limited = [{ query, timestamp: Date.now() }, ...filtered].slice(
				0,
				SEARCH_HISTORY_LIMIT
			)

			setToStorage(STORAGE_KEY, limited)
			return limited
		})
	}, [])

	const removeHistoryItem = useCallback((query: string) => {
		setRecentSearches((prev) => {
			const filtered = prev.filter((item) => item.query !== query)
			setToStorage(STORAGE_KEY, filtered)
			return filtered
		})
	}, [])

	return {
		recentSearches,
		addSearch,
		removeHistoryItem,
	}
}
