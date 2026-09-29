import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { LEGACY_DATE_FILTERS } from '../constants'

export function useTodoFilters() {
	const [dateFilter, setDateFilter] = useState<string>('all')
	const [sort, setSort] = useState<string>('def')
	const [tagFilter, setTagFilter] = useState<string>('')
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		async function load() {
			const [storedFilter, storedSort] = await Promise.all([
				getFromStorage('todoFilter'),
				getFromStorage('todoSort'),
			])

			if (storedFilter) {
				const normalized = LEGACY_DATE_FILTERS[storedFilter] || storedFilter
				setDateFilter(normalized)
				if (normalized !== storedFilter) {
					setToStorage('todoFilter', normalized)
				}
			}
			if (storedSort) setSort(storedSort)
			setIsReady(true)
		}

		load()
	}, [])

	const onDateFilterChange = (value: string) => {
		setDateFilter(value)
		Analytics.event(`todo_select_date_${value}_filter`)
		setToStorage('todoFilter', value)
	}

	const onSortChange = (value: string) => {
		setSort(value)
		Analytics.event(`todo_select_sort_${value}`)
		setToStorage('todoSort', value)
	}

	const onTagFilterChange = (value: string) => {
		setTagFilter(value)
		Analytics.event('todo_tag_change')
	}

	return {
		dateFilter,
		sort,
		tagFilter,
		isReady,
		onDateFilterChange,
		onSortChange,
		onTagFilterChange,
	}
}
