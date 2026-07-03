import { useState, useMemo } from 'react'
import { useSearchSuggestions } from '@/services/hooks/search/getSuggestSearch.hook'
import { SuggestionSkeleton } from './suggestion/suggestion.skeleton'
import { useAuth } from '@/context/auth.context'
import { AutocompleteConsentModal } from './suggestion/autocomplete-consent.modal'
import { Portal } from '@/components/portal/Portal'
import { useSearchHistory } from './hooks/useSearchHistory'
import { Suggestions } from './suggestion/suggestions'
import { Icon } from '@/src/icons'

interface SearchHistoryPortalProps {
	onClose: () => void
	onSearch: (query: string) => void
	onEngineChange: any
	searchQuery: string
	portalStyles?: React.CSSProperties
	portalRef: React.RefObject<HTMLDivElement | null>
}

export function SearchHistoryPortal({
	onSearch,
	searchQuery,
	portalStyles,
	portalRef,
}: SearchHistoryPortalProps) {
	const { isAuthenticated, user } = useAuth()
	const [showConsentModal, setShowConsentModal] = useState(false)
	const { recentSearches, addSearch } = useSearchHistory()

	const { data: suggestions, isFetching } = useSearchSuggestions(
		searchQuery,
		(user?.searchAutocompleteEnabled || false) && isAuthenticated
	)

	const hasQuery = searchQuery.trim().length > 0
	const showSuggestions = user?.searchAutocompleteEnabled && hasQuery
	const showEnableButton = !user?.searchAutocompleteEnabled && isAuthenticated

	const combinedSuggestions = useMemo(() => {
		if (!hasQuery) return []

		const combined: Array<{ text: string; isRecent: boolean }> = []
		const seen = new Set<string>()

		if (user?.searchAutocompleteEnabled && suggestions) {
			suggestions.forEach((s) => {
				if (!seen.has(s.toLowerCase())) {
					combined.push({ text: s, isRecent: false })
					seen.add(s.toLowerCase())
				}
			})
		}

		recentSearches.forEach((item) => {
			const lowerQuery = item.query.toLowerCase()
			if (!seen.has(lowerQuery) && lowerQuery.includes(searchQuery.toLowerCase())) {
				combined.push({ text: item.query, isRecent: true })
				seen.add(lowerQuery)
			}
		})

		return combined
	}, [suggestions, recentSearches, searchQuery, user?.searchAutocompleteEnabled])

	const handleSearch = (query: string) => {
		if (user?.searchAutocompleteEnabled) addSearch(query)
		onSearch(query)
	}

	const showLocalSearches =
		user?.searchAutocompleteEnabled && recentSearches.length > 0 && !hasQuery

	return (
		<>
			<Portal>
				<div
					ref={portalRef}
					style={portalStyles}
					className="z-20 -mt-12 overflow-hidden duration-300 shadow-2xl bg-content bg-glass h-60 rounded-b-2xl rounded-t-md animate-in fade-in slide-in-from-top-2"
				>
					{showSuggestions &&
						hasQuery &&
						(isFetching ? (
							<SuggestionSkeleton />
						) : combinedSuggestions.length > 0 ? (
							<Suggestions
								combinedSuggestions={combinedSuggestions}
								handleSearch={handleSearch}
							/>
						) : null)}

					{!hasQuery && showLocalSearches && (
						<Suggestions
							combinedSuggestions={recentSearches.map((f) => ({
								isRecent: true,
								text: f.query,
							}))}
							handleSearch={handleSearch}
						/>
					)}

					{showEnableButton && (
						<div className="flex flex-col items-center gap-3 px-4 py-5 text-center">
							<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-base-content/5">
								<Icon
									name="search"
									size={15}
									className="text-base-content/40"
								/>
							</div>
							<div className="space-y-1">
								<p className="text-xs font-medium text-base-content/70">
									پیشنهادهای جستجو
								</p>
								<p className="text-[11px] text-base-content/40 leading-relaxed">
									با فعال‌سازی، هنگام تایپ پیشنهادهای هوشمندی داده میشه!
								</p>
							</div>
							<button
								onMouseDown={(e) => {
									e.preventDefault()
									setShowConsentModal(true)
								}}
								className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-xl cursor-pointer transition-all bg-base-content/5 text-base-content/60 hover:text-primary hover:bg-primary/8 searchbox-item"
							>
								فعال‌سازی
							</button>
						</div>
					)}

					{!showSuggestions &&
						!showEnableButton &&
						!showLocalSearches &&
						hasQuery && (
							<div className="flex items-center justify-center h-full">
								<p className="text-xs text-base-content/40">
									نتیجه‌ای برای نمایش وجود ندارد
								</p>
							</div>
						)}
				</div>
			</Portal>

			{showConsentModal && (
				<AutocompleteConsentModal
					isOpen
					onClose={() => setShowConsentModal(false)}
				/>
			)}
		</>
	)
}
