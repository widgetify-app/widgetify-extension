export type NotePriority = 'low' | 'medium' | 'high'

export type NotesVariant = 'list' | 'sticky'

export interface NotesMeta {
	variant?: NotesVariant
	activeNoteId?: string
	noteId?: string
}

export interface StickyColorTheme {
	bg: string
	border: string
	text: string
	headerBg: string
	divider: string
}
