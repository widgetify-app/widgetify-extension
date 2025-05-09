import { getFromStorage, setToStorage } from '@/common/storage'
import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface Note {
	id: string
	title: string
	body: string
	createdAt: number
	updatedAt: number
}

interface NotesContextType {
	notes: Note[]
	activeNoteId: string | null
	setActiveNoteId: (id: string) => void
	addNote: () => void
	updateNote: (id: string, updates: Partial<Note>) => void
	deleteNote: (id: string) => void
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
	const [notes, setNotes] = useState<Note[]>([])
	const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
	const [isLoaded, setIsLoaded] = useState(false)

	// Load notes from storage
	useEffect(() => {
		async function loadNotes() {
			const storedNotes = await getFromStorage('notes_data')
			if (storedNotes && Array.isArray(storedNotes) && storedNotes.length > 0) {
				setNotes(storedNotes)
				setActiveNoteId(storedNotes[0].id)
			} else {
				// Create a default note if none exist
				const defaultNote: Note = {
					id: uuidv4(),
					title: '',
					body: '',
					createdAt: Date.now(),
					updatedAt: Date.now(),
				}
				setNotes([defaultNote])
				setActiveNoteId(defaultNote.id)
				setToStorage('notes_data', [defaultNote])
			}
			setIsLoaded(true)
		}

		loadNotes()
	}, [])

	// Save notes to storage when they change
	useEffect(() => {
		if (isLoaded && notes.length > 0) {
			setToStorage('notes_data', notes)
		}
	}, [notes, isLoaded])

	// Add a new note
	const addNote = () => {
		const newNote: Note = {
			id: uuidv4(),
			title: '',
			body: '',
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}
		setNotes((prevNotes) => [...prevNotes, newNote])
		setActiveNoteId(newNote.id)
	}

	// Update an existing note
	const updateNote = (id: string, updates: Partial<Note>) => {
		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note,
			),
		)
	}

	// Delete a note
	const deleteNote = (id: string) => {
		setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))

		// If we deleted the active note, set the active note to the first note
		if (activeNoteId === id && notes.length > 1) {
			const remainingNotes = notes.filter((note) => note.id !== id)
			setActiveNoteId(remainingNotes[0].id)
		} else if (notes.length === 1) {
			// If this was the last note, create a new empty note
			const newNote: Note = {
				id: uuidv4(),
				title: '',
				body: '',
				createdAt: Date.now(),
				updatedAt: Date.now(),
			}
			setNotes([newNote])
			setActiveNoteId(newNote.id)
		}
	}

	return (
		<NotesContext.Provider
			value={{
				notes,
				activeNoteId,
				setActiveNoteId,
				addNote,
				updateNote,
				deleteNote,
			}}
		>
			{children}
		</NotesContext.Provider>
	)
}

export function useNotes() {
	const context = useContext(NotesContext)
	if (context === undefined) {
		throw new Error('useNotes must be used within a NotesProvider')
	}
	return context
}
