import { getFromStorage, setToStorage } from '@/common/storage'
import { upsertNote } from '@/services/hooks/note/upsert-note.hook'
import type { FetchedNote } from '@/services/hooks/note/note.interface'

export async function createNoteForDuplicatedWidget(
	isAuthenticated: boolean
): Promise<{ noteId: string; note: FetchedNote }> {
	const now = Date.now()
	const localNote: FetchedNote = {
		id: `note-${now}`,
		title: '',
		body: '',
		createdAt: now,
		updatedAt: now,
	}

	if (isAuthenticated) {
		try {
			const serverNote = await upsertNote({ title: '', body: '' })
			if (serverNote?.id) {
				localNote.id = serverNote.id
			}
		} catch {}
	}

	const storedNotes = (await getFromStorage('notes_data')) || []
	await setToStorage('notes_data', [localNote, ...storedNotes])

	return { noteId: localNote.id, note: localNote }
}
