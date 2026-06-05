import { useState } from 'react'
import { LuSparkles } from 'react-icons/lu'
import { useSearchSuggestions } from '@/services/hooks/search/getSuggestSearch.hook'
import { SuggestionSkeleton } from './suggestion/suggestion.skeleton'
import { useAuth } from '@/context/auth.context'
import { AutocompleteConsentModal } from './suggestion/autocomplete-consent.modal'
import { Suggestions } from './suggestion/suggestions'
import { Portal } from '@/components/portal/Portal'

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

	const { data: suggestions, isFetching } = useSearchSuggestions(
		searchQuery,
		(user?.searchAutocompleteEnabled || false) && isAuthenticated
	)

	const hasQuery = searchQuery.trim().length > 0
	const hasSuggestions = suggestions && suggestions.length > 0
	const showSuggestions = user?.searchAutocompleteEnabled && hasQuery
	const showEnableButton = !user?.searchAutocompleteEnabled && isAuthenticated

	return (
		<>
			<Portal>
				<div
					ref={portalRef}
					style={portalStyles}
					className="z-20 -mt-12 overflow-hidden duration-300 shadow-2xl bg-content bg-glass h-60 rounded-b-2xl rounded-t-md animate-in fade-in slide-in-from-top-2"
				>
					{showSuggestions &&
						(isFetching && !hasSuggestions ? (
							<SuggestionSkeleton />
						) : hasSuggestions ? (
							<div className="px-2 pt-2 pb-1 space-y-0.5">
								<Suggestions
									suggestions={suggestions}
									onSearch={onSearch}
								/>
							</div>
						) : null)}

					{showEnableButton && (
						<div className="flex flex-col items-center gap-3 px-4 py-5 text-center">
							<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-base-content/5">
								<LuSparkles size={15} className="text-base-content/40" />
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
								<LuSparkles size={12} />
								فعال‌سازی
							</button>
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
