import Analytics from '@/analytics'
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

	useEffect(() => {
		async function loadNotes() {
			const storedNotes = await getFromStorage('notes_data')
			if (storedNotes && Array.isArray(storedNotes) && storedNotes.length > 0) {
				setNotes(storedNotes)
				setActiveNoteId(storedNotes[0].id)
			} else {
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

	useEffect(() => {
		if (isLoaded && notes.length > 0) {
			setToStorage('notes_data', notes)
		}
	}, [notes, isLoaded])

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
		Analytics.featureUsed('add-notes')
	}

	const updateNote = (id: string, updates: Partial<Note>) => {
		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note,
			),
		)
		Analytics.featureUsed('update-notes')
	}

	const deleteNote = (id: string) => {
		setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))

		if (activeNoteId === id && notes.length > 1) {
			const remainingNotes = notes.filter((note) => note.id !== id)
			setActiveNoteId(remainingNotes[0].id)
		} else if (notes.length === 1) {
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

		Analytics.featureUsed('delete-notes')
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
