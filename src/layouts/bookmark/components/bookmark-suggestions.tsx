import { getFaviconFromUrl } from '@/common/utils/icon'
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
		<div className="mt-1">
			<h3 className="mb-2 text-sm font-medium text-content">پیشنهاد ویجتی‌فای:</h3>
			<div className="grid grid-cols-5 gap-1 overflow-y-auto max-h-14">
				{suggestions.map((suggestion, index) => (
					<div
						key={index}
						onClick={() => onSelect(suggestion)}
						className="flex flex-col items-center p-1 text-center transition-colors duration-200 rounded-lg cursor-pointer bg-content hover:!bg-base-300"
					>
						<div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mb-1">
							{suggestion.icon ? (
								<img
									src={suggestion.icon}
									alt={suggestion.title}
									className="object-contain w-4 h-4"
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
									className="object-contain w-4 h-4"
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
						<p className="w-full text-xs font-medium truncate text-content">
							{suggestion.title}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}
