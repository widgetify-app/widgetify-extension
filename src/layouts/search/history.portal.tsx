import { useRef, useState } from 'react'
import { EngineSelector } from './select-engine/engine-selector'
import { Button } from '@/components/button/button'
import { FaSearch } from 'react-icons/fa'
import { LuSparkles } from 'react-icons/lu'
import { useSearchSuggestions } from '@/services/hooks/search/getSuggestSearch.hook'
import { SuggestionSkeleton } from './suggestion/suggestion.skeleton'
import { useAuth } from '@/context/auth.context'
import { AutocompleteConsentModal } from './suggestion/autocomplete-consent.modal'
import { Suggestions } from './suggestion/suggestions'

interface SearchHistoryPortalProps {
	onClose: () => void
	onSearch: (query: string) => void
	onEngineChange: any
	searchQuery: string
}
export function SearchHistoryPortal({
	onEngineChange,
	onSearch,
	searchQuery,
}: SearchHistoryPortalProps) {
	const { isAuthenticated, user } = useAuth()
	const portalRef = useRef<HTMLDivElement>(null)
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
			<div
				ref={portalRef}
				className="absolute left-0 w-full mt-1 overflow-hidden duration-300 shadow-2xl portal top-full z-60 bg-content bg-glass rounded-2xl animate-in fade-in"
			>
				{showSuggestions &&
					(isFetching && !hasSuggestions ? (
						<SuggestionSkeleton />
					) : hasSuggestions ? (
						<div className="px-2 pt-2 pb-1 space-y-0.5">
							<Suggestions suggestions={suggestions} onSearch={onSearch} />
						</div>
					) : null)}

				<div className="px-5 py-3 border-t border-base-content/5 bg-base-content/2">
					<div className="flex items-center justify-between">
						<EngineSelector
							trigger={
								<Button
									size="xs"
									className="flex items-center btn btn-ghost rounded-xl text-muted"
								>
									<FaSearch size={12} />
									انتخاب موتور جستجو
								</Button>
							}
							onSelected={onEngineChange}
						/>

						{showEnableButton && (
							<button
								onMouseDown={(e) => {
									e.preventDefault()
									setShowConsentModal(true)
								}}
								className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl cursor-pointer transition-colors text-base-content/50 hover:text-base-content/80 hover:bg-base-content/5"
							>
								<LuSparkles size={13} />
								پیشنهادهای جستجو
							</button>
						)}
					</div>
				</div>
			</div>

			{showConsentModal && (
				<AutocompleteConsentModal
					isOpen
					onClose={() => setShowConsentModal(false)}
				/>
			)}
		</>
	)
}
