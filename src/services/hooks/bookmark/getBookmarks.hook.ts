import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
export interface BookmarkSuggestion {
	title: string
	url: string
	icon: string | null
}

export interface FetchedBookmark {
	id: string
	offlineId: string | null
	title: string
	url: string
	icon: string
	isManageable: boolean
	type: 'BOOKMARK' | 'FOLDER'
	parentId: string
	widgetify_host: boolean
	children: FetchedBookmark[]
	customTextColor?: string
	customBackground?: string
	sticker?: string
	order?: number
}

export const useGetBookmarks = () => {
	return useQuery<FetchedBookmark[]>({
		queryKey: ['getBookmarks'],
		queryFn: async () => getBookmarks(),
		retry: 0,
		initialData: [],
	})
}

export const useGetSuggestedBookmarks = () => {
	return useQuery<BookmarkSuggestion[]>({
		queryKey: ['getSuggestedBookmarks'],
		queryFn: async () => getSuggestedBookmarks(),
		retry: 0,
		gcTime: 1000 * 60 * 5, // 5 minutes
		staleTime: 1000 * 60 * 1, // 1 minute
	})
}

export async function getBookmarks(): Promise<FetchedBookmark[]> {
	const client = await getMainClient()
	const { data } = await client.get<FetchedBookmark[]>('/bookmarks/@me')
	return data
}

export async function getSuggestedBookmarks(): Promise<BookmarkSuggestion[]> {
	const client = await getMainClient()
	const { data } = await client.get<BookmarkSuggestion[]>('/bookmarks/suggestions')
	return data
}
