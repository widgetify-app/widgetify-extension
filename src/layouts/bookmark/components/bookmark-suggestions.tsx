import { SectionPanel } from '@/components/ui'
import {
	type BookmarkSuggestion,
	useGetSuggestedBookmarks,
} from '@/services/hooks/bookmark/get-bookmarks.hook'
import { Icon } from '@/src/icons'

interface BookmarkSuggestionsProps {
	onSelect: (suggestion: BookmarkSuggestion) => void
}

export function BookmarkSuggestions({ onSelect }: BookmarkSuggestionsProps) {
	const { data: suggestions } = useGetSuggestedBookmarks()

	if (!suggestions || suggestions?.length === 0) {
		return null
	}

	return (
		<div className="mt-2">
			<SectionPanel title="پیشنهاد ویجتیفای" size="xs">
				<div className="grid grid-cols-5 gap-2 mt-1 py-1 max-h-24 overflow-y-auto">
					{suggestions.map((suggestion, index) => (
						<button
							key={index}
							type="button"
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								onSelect(suggestion)
							}}
							className="p-1.5 flex flex-col items-center justify-center text-center transition-all duration-200 bg-base-200 hover:bg-primary/10 hover:border-primary/30 h-14 border border-base-content/10 rounded-xl cursor-pointer"
						>
							<div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mb-1">
								{suggestion.icon ? (
									<img
										src={suggestion.icon}
										alt={suggestion.title}
										className="object-contain w-6 h-6 rounded-md"
										onError={(e) => {
											const target = e.target as HTMLImageElement
											target.style.display = 'none'
										}}
									/>
								) : (
									<Icon name="bookmark" size={16} className="text-muted" />
								)}
							</div>
							<p className="w-full text-[11px] font-medium truncate text-content">
								{suggestion.title}
							</p>
						</button>
					))}
				</div>
			</SectionPanel>
		</div>
	)
}
