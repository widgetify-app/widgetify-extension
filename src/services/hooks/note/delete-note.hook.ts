import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '../../api'

export const useRemoveNote = () => {
	return useMutation({
		mutationKey: ['removeNote'],
		mutationFn: (id: string) => deleteNote(id),
	})
}

export async function deleteNote(id: string) {
	const api = await getMainClient()
	await api.delete(`/notes/${id}`)
}
