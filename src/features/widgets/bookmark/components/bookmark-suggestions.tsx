import { SectionPanel } from '@/components/ui'
import {
	type BookmarkSuggestion,
	useGetSuggestedBookmarks,
} from '@/services/bookmark/get-bookmarks.hook'
import { Icon } from '@/icons'

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
							className="p-1.5 flex flex-col items-center justify-center text-center transition-ui duration-200 bg-surface-2 hover:bg-brand-fill hover:border-brand-fill-2 h-14 border border-line rounded-xl cursor-pointer"
						>
							<div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mb-1">
								{suggestion.icon ? (
									<img
										src={suggestion.icon}
										alt={suggestion.title}
										className="object-contain w-6 h-6 rounded-lg"
										onError={(e) => {
											const target = e.target as HTMLImageElement
											target.style.display = 'none'
										}}
									/>
								) : (
									<Icon
										name="bookmark"
										size={16}
										className="text-fg-muted"
									/>
								)}
							</div>
							<p className="w-full text-2xs font-medium truncate text-fg">
								{suggestion.title}
							</p>
						</button>
					))}
				</div>
			</SectionPanel>
		</div>
	)
}
