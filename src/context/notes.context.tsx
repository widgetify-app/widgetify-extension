import type { AxiosError } from 'axios'
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import toast from 'react-hot-toast'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { sleep } from '@/common/utils/timeout'
import { safeAwait } from '@/services/api'
import {
	deleteNote,
	type FetchedNote,
	getNotes,
	upsertNote,
} from '@/services/note/note-api'
import { translateError } from '@/utils/translate-error'

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
	setActiveNoteId: (id: string | null) => void
	addNote: () => void
	updateNote: (id: string, updates: Partial<Note>) => void
	deleteNote: (id: string) => void
	isSaving: boolean
	isCreatingNote: boolean
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
	const [notes, setNotes] = useState<Note[]>([])
	const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const [isCreatingNote, setIsCreatingNote] = useState(false)
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		async function loadNotes() {
			const storedNotes = await getFromStorage('notes_data')
			if (storedNotes && Array.isArray(storedNotes) && storedNotes.length > 0) {
				setNotes(storedNotes)

				await sleep(1000)
				setIsSaving(true)
				const [error, fetchedNotes] = await safeAwait<AxiosError, FetchedNote[]>(
					getNotes()
				)
				setIsSaving(false)
				if (!error) {
					setNotes(fetchedNotes)
				}
			}
		}

		loadNotes()
	}, [])

	const addNote = async () => {
		if (isCreatingNote) return

		setIsCreatingNote(true)

		const newNote: Note = {
			id: '',
			title: '',
			body: '',
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}

		const [er, createdNote] = await safeAwait<AxiosError, FetchedNote>(
			upsertNote(newNote)
		)

		setIsCreatingNote(false)

		if (er) {
			return
		}

		setNotes((prevNotes) => {
			const updatedNotes = [createdNote, ...prevNotes]
			setToStorage('notes_data', updatedNotes)
			return updatedNotes
		})
		setActiveNoteId(createdNote.id)
		Analytics.event('add_notes')
	}

	const updateNote = (id: string, updates: Partial<Note>) => {
		setIsSaving(true)

		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current)
		}

		saveTimeoutRef.current = setTimeout(async () => {
			Analytics.event('update_notes')
			const [error, updatedNote] = await safeAwait<AxiosError, FetchedNote>(
				upsertNote({
					title: updates.title || null,
					body: updates.body || null,
					id,
				})
			)
			setIsSaving(false)
			if (error) {
				const translatedError = translateError(error)
				if (typeof translatedError === 'string') {
					return toast.error(translatedError)
				}
				const key = Object.keys(translatedError)[0]
				return toast.error(`${key}: ${translatedError[key]}`)
			}

			// update notes
			const updatedNotes = notes.map((note) =>
				note.id === id ? updatedNote : note
			)

			await setToStorage('notes_data', updatedNotes)
		}, 2500)
	}

	const onDeleteNote = async (id: string) => {
		const existingNote = notes.findIndex((note) => note.id === id)
		if (existingNote !== -1) {
			setIsSaving(true)
			const updatedNotes = [...notes]
			updatedNotes.splice(existingNote, 1)
			setNotes(updatedNotes)
			setActiveNoteId(null)

			await safeAwait(deleteNote(id))

			await setToStorage('notes_data', updatedNotes)
			setIsSaving(false)
		}
		Analytics.event('delete_notes')
	}

	return (
		<NotesContext.Provider
			value={{
				notes,
				activeNoteId,
				setActiveNoteId,
				addNote,
				updateNote,
				deleteNote: onDeleteNote,
				isSaving,
				isCreatingNote,
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
