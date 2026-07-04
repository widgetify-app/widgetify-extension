import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

const MAX_SUGGESTIONS = 6

interface SuggestSearchResponse {
	data: {
		list: string[]
	}
}

async function fetchSuggestSearch(term: string): Promise<string[]> {
	const client = getMainClient()
	const response = await client.get<SuggestSearchResponse>(
		'/searchbox/suggest-search',
		{
			params: { term },
		}
	)
	return (response.data?.data?.list ?? []).slice(0, MAX_SUGGESTIONS)
}

export function useSearchSuggestions(term: string, enabled: boolean) {
	return useQuery<string[]>({
		queryKey: ['searchSuggestions', term],
		queryFn: () => fetchSuggestSearch(term),
		enabled: enabled && term.trim().length > 0,
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		retry: false,
		placeholderData: (prev) => prev,
	})
}
