import { useEffect, useState } from 'react'
import { FaGlobe } from 'react-icons/fa'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { SectionPanel } from '@/components/section-panel'
import { getMainClient } from '@/services/api'

interface BookmarkSuggestion {
	title: string
	url: string
	icon: string | null
}

interface BookmarkSuggestionsProps {
	onSelect: (suggestion: BookmarkSuggestion) => void
}

export function BookmarkSuggestions({ onSelect }: BookmarkSuggestionsProps) {
	const [suggestions, setSuggestions] = useState<BookmarkSuggestion[]>([])
	useEffect(() => {
		const fetchSuggestions = async () => {
			const client = await getMainClient()
			const response = await client.get<BookmarkSuggestion[]>(
				'/bookmarks/suggestions'
			)
			setSuggestions(response.data)
		}

		fetchSuggestions()
	}, [])

	if (suggestions.length === 0) {
		return null
	}

	return (
		<div className="mt-2">
			<SectionPanel title="پیشنهاد ویجتی‌فای" size="xs">
				<div className="grid h-16 grid-cols-5 gap-2 mt-1 overflow-y-auto">
					{suggestions.map((suggestion, index) => (
						<div
							key={index}
							onClick={() => onSelect(suggestion)}
							className="p-2 flex flex-col items-center gap-y-0.5 text-center transition-colors duration-200 bg-content hover:!bg-base-300/75 border border-base-300/40 rounded-xl cursor-pointer"
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
											target.nextElementSibling?.classList.remove(
												'hidden'
											)
										}}
									/>
								) : (
									<img
										src={getFaviconFromUrl(suggestion.url)}
										alt={suggestion.title}
										className="object-contain w-6 h-6 rounded-md"
										onError={(e) => {
											const target = e.target as HTMLImageElement
											target.style.display = 'none'
											target.nextElementSibling?.classList.remove(
												'hidden'
											)
										}}
									/>
								)}
								<FaGlobe className="hidden w-4 h-4 text-content/60" />
							</div>
							<p className="w-full text-[11px] font-medium truncate text-muted">
								{suggestion.title}
							</p>
						</div>
					))}
				</div>
			</SectionPanel>
		</div>
	)
}
