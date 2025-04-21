import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../api'

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

export async function getBookmarks(): Promise<FetchedBookmark[]> {
	const client = await getMainClient()
	const { data } = await client.get<FetchedBookmark[]>('/bookmarks/@me')
	return data
}
