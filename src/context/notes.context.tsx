import type { AxiosError } from 'axios'
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { safeAwait } from '@/services/api'
import { translateError } from '@/utils/translate-error'
import { showToast } from '@/common/toast'
import { useGetNotes } from '@/services/hooks/note/get-notes.hook'
import { useAuth } from './auth.context'
import { useRemoveNote } from '@/services/hooks/note/delete-note.hook'
import { useUpsertNote } from '@/services/hooks/note/upsert-note.hook'
import type { FetchedNote } from '@/services/hooks/note/note.interface'

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
	const { isAuthenticated } = useAuth()
	const [notes, setNotes] = useState<Note[]>([])
	const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const [isCreatingNote, setIsCreatingNote] = useState(false)
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const { data: fetchedNotes, dataUpdatedAt, refetch } = useGetNotes(isAuthenticated)
	const { mutateAsync: removeNoteAsync } = useRemoveNote()
	const { mutateAsync: upsertNoteAsync } = useUpsertNote()

	useEffect(() => {
		async function loadNotes() {
			const storedNotes = await getFromStorage('notes_data')
			if (storedNotes && Array.isArray(storedNotes) && storedNotes.length > 0) {
				setNotes(storedNotes)
			}
		}

		loadNotes()
	}, [])

	useEffect(() => {
		if (fetchedNotes.length) {
			setNotes(fetchedNotes)
		}
	}, [dataUpdatedAt])

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
			upsertNoteAsync(newNote)
		)

		setIsCreatingNote(false)

		if (er) {
			showToast(translateError(er) as any, 'error')
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
				upsertNoteAsync({
					title: updates.title || null,
					body: updates.body || null,
					id,
				})
			)
			setIsSaving(false)
			if (error) {
				const translatedError = translateError(error)
				if (typeof translatedError === 'string') {
					return showToast(translatedError, 'error')
				}
				const key = Object.keys(translatedError)[0]
				return showToast(`${key}: ${translatedError[key]}`, 'error')
			}

			// update notes
			const updatedNotes = notes.map((note) =>
				note.id === id ? updatedNote : note
			)

			await setToStorage('notes_data', updatedNotes)
		}, 2500)
	}

	const onDeleteNote = async (id: string) => {
		setIsSaving(true)
		const [err, _] = await safeAwait(removeNoteAsync(id))
		if (err) {
			setIsSaving(false)
			return showToast(translateError(err) as any, 'error')
		}

		Analytics.event('delete_notes')
		setActiveNoteId(null)
		refetch()
		setIsSaving(false)
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
