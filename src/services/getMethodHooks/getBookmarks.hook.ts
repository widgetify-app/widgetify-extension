import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../api'

export interface FetchedSuggestionsBookmark {
	id: string
	title: string
	url: string
	icon: string
	isManageable: boolean
	type: 'BOOKMARK' | 'FOLDER'
	parentId: string
	children: FetchedSuggestionsBookmark[]
}

export const useGetBookmarks = () => {
	return useQuery<FetchedSuggestionsBookmark[]>({
		queryKey: ['getBookmarks'],
		queryFn: async () => getBookmarks(),
		retry: 0,
		initialData: [],
	})
}

async function getBookmarks(): Promise<FetchedSuggestionsBookmark[]> {
	const client = await getMainClient()
	const { data } = await client.get<FetchedSuggestionsBookmark[]>(
		'/bookmarks/suggestions',
	)
	return data
}
