export type NotePriority = 'low' | 'medium' | 'high'

type NotesVariant = 'list' | 'sticky'

export interface NotesMeta {
	variant?: NotesVariant
	activeNoteId?: string
	noteId?: string
}

export interface StickyColorTheme {
	bg: string
	text: string
	onColor: boolean
}
