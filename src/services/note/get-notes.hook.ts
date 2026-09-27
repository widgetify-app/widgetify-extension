import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../api'
import type { FetchedNote, GetNotesResponse } from './note.interface'
import { noteKeys } from '@/services/note/note.keys'

async function getNotes(): Promise<FetchedNote[]> {
	const api = getMainClient()
	const response = await api.get<GetNotesResponse>('/notes')
	return response.data.notes
}

export const useGetNotes = (enabled: boolean) => {
	return useQuery<FetchedNote[]>({
		queryKey: noteKeys.list,
		queryFn: async () => getNotes(),
		enabled,
		initialData: [],
	})
}
