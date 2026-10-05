export type NotePriority = 'low' | 'medium' | 'high'

export type NotesVariant = 'list' | 'sticky' | 'board'

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
