import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '../api'
import type { FetchedNote, NoteCreateInput } from './note.interface'
import { noteKeys } from '@/services/note/note.keys'

export const useUpsertNote = () => {
	return useMutation({
		mutationKey: noteKeys.upsert,
		mutationFn: (input: NoteCreateInput) => upsertNote(input),
	})
}

export async function upsertNote(input: NoteCreateInput): Promise<FetchedNote> {
	const api = getMainClient()

	const response = await api.post('/notes', input)

	return response.data
}
