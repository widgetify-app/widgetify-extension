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
	iconIsS3Hosted: boolean
	children: FetchedBookmark[]
	customTextColor?: string
	customBackground?: string
	sticker?: string
	order?: number
}

export const useGetBookmarks = (id: string | null, enabled: boolean) => {
	const queryKey = id ? ['getBookmarks', id] : ['getBookmarks']

	return useQuery<FetchedBookmark[]>({
		queryKey,
		queryFn: async () => getBookmarks(id),
		retry: 0,
		enabled,
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

export async function getBookmarks(id: string | null): Promise<FetchedBookmark[]> {
	const params = id ? { id } : {}
	const client = await getMainClient()
	const { data } = await client.get<FetchedBookmark[]>('/bookmarks/@me', { params })
	return data
}

export async function getSuggestedBookmarks(): Promise<BookmarkSuggestion[]> {
	const client = await getMainClient()
	const { data } = await client.get<BookmarkSuggestion[]>('/bookmarks/suggestions')
	return data
}
