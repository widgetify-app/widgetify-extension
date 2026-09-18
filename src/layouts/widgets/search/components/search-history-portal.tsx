import { useEffect, useMemo, useRef, useState } from 'react'
import { Motion, Presence } from '@/common/motion'
import { Portal } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import { useSearchSuggestions } from '@/services/hooks/search/get-suggest-search.hook'
import { useSearchHistory } from '../hooks/use-search-history'
import { AutocompleteConsentModal } from './autocomplete-consent-modal'
import { SuggestionSkeleton } from './suggestion-skeleton'
import { Suggestions } from './suggestions'

interface SearchHistoryPortalProps {
	isOpen: boolean
	onSearch: (query: string) => void
	searchQuery: string
	portalStyles?: React.CSSProperties
	portalRef: React.RefObject<HTMLDivElement | null>
	selectedIndex?: number
	onSuggestionsChange?: (items: { text: string; isRecent: boolean }[]) => void
}

export function SearchHistoryPortal({
	isOpen,
	onSearch,
	searchQuery,
	portalStyles,
	portalRef,
	selectedIndex = -1,
	onSuggestionsChange,
}: SearchHistoryPortalProps) {
	const { isAuthenticated, user } = useAuth()
	const [showConsentModal, setShowConsentModal] = useState(false)
	const { recentSearches, addSearch, removeHistoryItem } = useSearchHistory()

	const isAutocompleteEnabled = Boolean(user?.searchAutocompleteEnabled)
	const hasQuery = searchQuery.trim().length > 0

	const { data: suggestions, isFetching } = useSearchSuggestions(
		searchQuery,
		isAutocompleteEnabled && isAuthenticated
	)

	const showEnableButton = !isAutocompleteEnabled && isAuthenticated

	const combinedSuggestions = useMemo(() => {
		if (!hasQuery) return []

		const combined: Array<{ text: string; isRecent: boolean }> = []
		const seen = new Set<string>()

		if (isAutocompleteEnabled && suggestions) {
			for (const suggestion of suggestions) {
				if (!seen.has(suggestion.toLowerCase())) {
					combined.push({ text: suggestion, isRecent: false })
					seen.add(suggestion.toLowerCase())
				}
			}
		}

		for (const item of recentSearches) {
			const lowerQuery = item.query.toLowerCase()
			if (!seen.has(lowerQuery) && lowerQuery.includes(searchQuery.toLowerCase())) {
				combined.push({ text: item.query, isRecent: true })
				seen.add(lowerQuery)
			}
		}

		return combined
	}, [suggestions, recentSearches, searchQuery, isAutocompleteEnabled, hasQuery])

	const showLocalSearches =
		isAutocompleteEnabled && recentSearches.length > 0 && !hasQuery

	const currentList = useMemo(() => {
		if (hasQuery) return combinedSuggestions
		if (showLocalSearches) {
			return recentSearches.map((item) => ({ isRecent: true, text: item.query }))
		}
		return []
	}, [hasQuery, combinedSuggestions, showLocalSearches, recentSearches])

	const isLoadingSuggestions = isAutocompleteEnabled && hasQuery && isFetching
	const hasContent =
		isLoadingSuggestions ||
		currentList.length > 0 ||
		showEnableButton ||
		(hasQuery && isAutocompleteEnabled)

	const onSuggestionsChangeRef = useRef(onSuggestionsChange)
	onSuggestionsChangeRef.current = onSuggestionsChange

	const prevListRef = useRef(currentList)
	useEffect(() => {
		const prev = prevListRef.current
		const hasChanged =
			prev.length !== currentList.length ||
			prev.some(
				(item, i) =>
					item.text !== currentList[i]?.text ||
					item.isRecent !== currentList[i]?.isRecent
			)

		if (hasChanged) {
			prevListRef.current = currentList
			onSuggestionsChangeRef.current?.(currentList)
		}
	}, [currentList])

	const handleSearch = (query: string) => {
		if (isAutocompleteEnabled) addSearch(query)
		onSearch(query)
	}

	return (
		<>
			<Portal>
				<Presence>
					{isOpen && hasContent && (
						<Motion.div
							key="search-history"
							ref={portalRef}
							style={portalStyles}
							initial={{ opacity: 0, y: -8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.18, ease: 'easeOut' }}
							className="z-20 overflow-y-auto shadow-2xl bg-content bg-glass max-h-60 rounded-2xl"
						>
							{isLoadingSuggestions ? (
								<SuggestionSkeleton />
							) : currentList.length > 0 ? (
								<Suggestions
									combinedSuggestions={currentList}
									handleSearch={handleSearch}
									onRemove={removeHistoryItem}
									selectedIndex={selectedIndex}
								/>
							) : showEnableButton ? (
								<div className="flex flex-col items-center gap-3 px-4 py-5 text-center">
									<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-raised">
										<Icon
											name="search"
											size={15}
											className="text-subtle"
										/>
									</div>
									<div className="space-y-1">
										<p className="text-xs font-medium text-muted">
											پیشنهادهای جستجو
										</p>
										<p className="text-[11px] text-subtle leading-relaxed">
											با فعال‌سازی، هنگام تایپ پیشنهادهای هوشمندی
											داده میشه!
										</p>
									</div>
									<button
										type="button"
										onMouseDown={(e) => {
											e.preventDefault()
											setShowConsentModal(true)
										}}
										className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-xl cursor-pointer bg-raised text-muted transition-ui hover:text-primary hover:bg-brand-subtle focus-visible:focus-ring searchbox-item"
									>
										فعال‌سازی
									</button>
								</div>
							) : (
								<p className="px-4 py-6 text-xs text-center text-subtle">
									نتیجه‌ای برای نمایش وجود ندارد
								</p>
							)}
						</Motion.div>
					)}
				</Presence>
			</Portal>

			<AutocompleteConsentModal
				isOpen={showConsentModal}
				onClose={() => setShowConsentModal(false)}
			/>
		</>
	)
}
