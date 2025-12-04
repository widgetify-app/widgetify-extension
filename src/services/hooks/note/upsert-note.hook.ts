import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '../../api'
import type { FetchedNote, NoteCreateInput } from './note.interface'

export const useUpsertNote = () => {
	return useMutation({
		mutationKey: ['upsertNote'],
		mutationFn: (input: NoteCreateInput) => upsertNote(input),
	})
}

export async function upsertNote(input: NoteCreateInput): Promise<FetchedNote> {
	const api = await getMainClient()

	const response = await api.post('/notes', input)

	return response.data
}
