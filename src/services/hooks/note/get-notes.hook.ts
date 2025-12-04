import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../../api'
import type { FetchedNote, GetNotesResponse } from './note.interface'

export async function getNotes(): Promise<FetchedNote[]> {
	const api = await getMainClient()
	const response = await api.get<GetNotesResponse>('/notes')
	return response.data.notes
}

export const useGetNotes = (enabled: boolean) => {
	return useQuery<FetchedNote[]>({
		queryKey: ['getNotes'],
		queryFn: async () => getNotes(),
		enabled,
		initialData: [],
	})
}
