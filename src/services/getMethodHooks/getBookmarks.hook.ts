import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../api'

export interface FetchedBookmark {
	id: string
	title: string
	url: string
	icon: string
	pinned: boolean
	type: 'BOOKMARK' | 'FOLDER'
	parentId: string
	children: FetchedBookmark[]
}

export const useGetBookmarks = () => {
	return useQuery<FetchedBookmark[]>({
		queryKey: ['getBookmarks'],
		queryFn: async () => getBookmarks(),
		retry: 0,
		initialData: [],
	})
}

async function getBookmarks(): Promise<FetchedBookmark[]> {
	const client = await getMainClient()
	const { data } = await client.get<FetchedBookmark[]>('/bookmarks')
	console.log('fetched bookmarks', data)
	return data
}
