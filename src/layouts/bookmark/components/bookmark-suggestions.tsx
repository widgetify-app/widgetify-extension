import { getFaviconFromUrl } from '@/common/utils/icon'
import { SectionPanel } from '@/components/section-panel'
import { getMainClient } from '@/services/api'
import { useEffect, useState } from 'react'
import { FaGlobe } from 'react-icons/fa'

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
		<div className="mt-4">
			<SectionPanel title="پیشنهاد ویجتی‌فای" size="xs">
				<div className="grid grid-cols-5 gap-0.5">
					{suggestions.map((suggestion, index) => (
						<div
							key={index}
							onClick={() => onSelect(suggestion)}
							className="p-2 flex flex-col items-center gap-y-0.5 text-center transition-colors duration-200 bg-content hover:!bg-base-300/75 border border-base-300/40 rounded-xl cursor-pointer"
						>
							<div className="flex items-center justify-center flex-shrink-0 w-5 h-5 mb-1">
								{suggestion.icon ? (
									<img
										src={suggestion.icon}
										alt={suggestion.title}
										className="object-contain w-5 h-5"
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
										className="object-contain w-5 h-5"
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
