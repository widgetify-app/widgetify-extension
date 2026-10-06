import { useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { cn } from '@/common/utils/cn'
import { useAuth } from '@/context/auth.context'
import type { EngineMeta } from '@/services/trends/get-trends.hook'
import { EngineSelector } from '../components/engine-selector'
import {
	SEARCH_BOX_CLASS,
	SEARCH_INPUT_CLASS,
	SearchBoxButton,
} from '../components/search-box-parts'
import { SearchHistoryPortal } from '../components/search-history-portal'
import { DEFAULT_ENGINE } from '../constants'
import { usePortalAnchor } from '../hooks/use-portal-anchor'
import { useSearchHistory } from '../hooks/use-search-history'
import { runSearch } from '../utils/run-search'

export function SearchCompactRow() {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedEngine, setSelectedEngine] = useState<EngineMeta>(DEFAULT_ENGINE)
	const [showHistoryPortal, setShowHistoryPortal] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [currentSuggestions, setCurrentSuggestions] = useState<
		{ text: string; isRecent: boolean }[]
	>([])
	const searchRef = useRef<HTMLDivElement>(null)
	const portalRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const { user } = useAuth()
	const { addSearch } = useSearchHistory()

	const { style: portalStyles, updatePosition } = usePortalAnchor(
		searchRef,
		showHistoryPortal,
		4
	)

	const submitQuery = (rawQuery: string, event: string) => {
		const query = rawQuery.trim()
		if (!query) return

		if (user?.searchAutocompleteEnabled) addSearch(query)
		runSearch(query, selectedEngine)
		Analytics.event(event)
		setShowHistoryPortal(false)
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const targetQuery =
			selectedIndex >= 0 && currentSuggestions[selectedIndex]
				? currentSuggestions[selectedIndex].text
				: searchQuery
		submitQuery(targetQuery, 'search_query_submitted_2x1')
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') {
			setShowHistoryPortal(false)
			setSelectedIndex(-1)
			return
		}

		if (!showHistoryPortal || currentSuggestions.length === 0) return

		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setSelectedIndex((prev) =>
				prev < currentSuggestions.length - 1 ? prev + 1 : -1
			)
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setSelectedIndex((prev) =>
				prev > -1 ? prev - 1 : currentSuggestions.length - 1
			)
		}
	}

	const handleClearSearch = () => {
		setSearchQuery('')
		setSelectedIndex(-1)
		inputRef.current?.focus()
	}

	const handleSearchButtonClick = () => {
		if (!searchQuery.trim()) {
			inputRef.current?.focus()
			return
		}

		submitQuery(searchQuery, 'search_button_submitted_2x1')
	}

	const handleHistorySearch = (query: string) => {
		setSearchQuery(query)
		submitQuery(query, 'history_search_submitted')
	}

	const onEngineSelected = (engine: EngineMeta) => {
		setSelectedEngine(engine)
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement
			if (!target) return

			if (
				target.closest('[popover]') ||
				target.closest('.modal') ||
				target.closest('[role="dialog"]')
			) {
				return
			}

			if (portalRef?.current?.contains(target)) {
				return
			}

			if (
				showHistoryPortal &&
				searchRef?.current &&
				!searchRef?.current?.contains(target)
			) {
				setShowHistoryPortal(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [showHistoryPortal])

	const hasQuery = searchQuery.length > 0

	return (
		<div ref={searchRef} className="relative w-full">
			<form onSubmit={handleSubmit}>
				<div className={cn(SEARCH_BOX_CLASS, 'bg-glass-surface')}>
					<EngineSelector onSelected={onEngineSelected} />

					<input
						ref={inputRef}
						type="text"
						name="search"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value)
							setSelectedIndex(-1)
						}}
						onKeyDown={handleKeyDown}
						onFocus={() => {
							setShowHistoryPortal(true)
							updatePosition()
							Analytics.event('search_input_focused_2x1')
						}}
						className={SEARCH_INPUT_CLASS}
						placeholder="جستجو..."
						aria-label="جستجو"
						autoComplete="off"
					/>

					<SearchBoxButton
						label={hasQuery ? 'پاک کردن عبارت جستجو' : 'جستجو'}
						icon={hasQuery ? 'close' : 'search'}
						onClick={hasQuery ? handleClearSearch : handleSearchButtonClick}
					/>
				</div>
			</form>

			<SearchHistoryPortal
				isOpen={showHistoryPortal}
				portalRef={portalRef}
				onSearch={handleHistorySearch}
				searchQuery={searchQuery}
				portalStyles={portalStyles}
				selectedIndex={selectedIndex}
				onSuggestionsChange={setCurrentSuggestions}
			/>
		</div>
	)
}
