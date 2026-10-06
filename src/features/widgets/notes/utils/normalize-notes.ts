import type { FetchedNote } from '@/services/note/note.interface'

type RawNote = Omit<FetchedNote, 'title' | 'body' | 'priority'> & {
	title?: string | null
	body?: string | null
	priority?: FetchedNote['priority'] | null
}

export function normalizeNote(note: RawNote): FetchedNote {
	return {
		...note,
		title: note.title ?? '',
		body: note.body ?? '',
		priority: note.priority ?? undefined,
	}
}

export function normalizeNotes(stored: unknown): FetchedNote[] {
	if (!Array.isArray(stored)) return []
	return stored
		.filter((note): note is RawNote => typeof note?.id === 'string')
		.map(normalizeNote)
}
