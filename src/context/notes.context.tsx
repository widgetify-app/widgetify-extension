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
import { getFromStorage, setToStorage, watchStorage } from '@/common/storage'
import { safeAwait } from '@/services/api'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import { useGetNotes } from '@/services/hooks/note/get-notes.hook'
import { useAuth } from './auth.context'
import { useRemoveNote } from '@/services/hooks/note/delete-note.hook'
import { useUpsertNote } from '@/services/hooks/note/upsert-note.hook'
import type { FetchedNote, NoteCreateInput } from '@/services/hooks/note/note.interface'

interface NotesContextType {
	notes: FetchedNote[]
	activeNoteId: string | null
	setActiveNoteId: (id: string | null) => void
	addNote: (initial?: Partial<FetchedNote>) => Promise<FetchedNote | null>
	updateNote: (id: string, updates: Partial<FetchedNote>) => void
	deleteNote: (id: string) => Promise<void>
	isSaving: boolean
	isCreatingNote: boolean
	isLoading: boolean
	isError: boolean
	isRefetching: boolean
	refetch: () => void
}

const SAVE_DEBOUNCE_MS = 500

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
	const { isAuthenticated } = useAuth()
	const [notes, setNotes] = useState<FetchedNote[]>([])
	const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const [isCreatingNote, setIsCreatingNote] = useState(false)
	const saveTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

	const {
		data: fetchedNotes,
		refetch,
		dataUpdatedAt,
		isRefetching,
		isLoading,
		isError,
		isSuccess,
	} = useGetNotes(isAuthenticated)
	const { mutateAsync: removeNoteAsync } = useRemoveNote()
	const { mutateAsync: upsertNoteAsync } = useUpsertNote()

	useEffect(() => {
		async function loadNotes() {
			const storedNotes = await getFromStorage('notes_data')
			if (storedNotes && storedNotes.length > 0) {
				setNotes(storedNotes)
			}
		}

		loadNotes()
		return watchStorage('notes_data', (newVal) => {
			if (newVal && Array.isArray(newVal)) {
				setNotes(newVal)
			}
		})
	}, [])

	useEffect(() => {
		if (!isAuthenticated || !isSuccess) return

		sync(fetchedNotes || [], true)
	}, [dataUpdatedAt, isAuthenticated, isSuccess])

	const addNote = async (
		initial?: Partial<FetchedNote>
	): Promise<FetchedNote | null> => {
		if (isCreatingNote) return null

		setIsCreatingNote(true)

		const newNote: FetchedNote = {
			id: '',
			title: initial?.title || '',
			body: initial?.body || '',
			priority: initial?.priority,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}

		const [er, createdNote] = await safeAwait<AxiosError, FetchedNote>(
			upsertNoteAsync(newNote)
		)

		setIsCreatingNote(false)

		if (er) {
			showToast(translateError(er) as string, 'error')
			return null
		}

		sync([createdNote, ...notes], true)
		setActiveNoteId(createdNote.id)
		Analytics.event('add_notes')
		return createdNote
	}

	const updateNote = (id: string, updates: Partial<FetchedNote>) => {
		setNotes((prev) => {
			const updated = prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
			setToStorage('notes_data', updated)
			return updated
		})

		const pending = saveTimersRef.current.get(id)
		if (pending) clearTimeout(pending)

		const timer = setTimeout(async () => {
			saveTimersRef.current.delete(id)
			setIsSaving(true)
			Analytics.event('update_notes')

			const payload: NoteCreateInput = { id }
			if (updates.title !== undefined) payload.title = updates.title
			if (updates.body !== undefined) payload.body = updates.body
			if (updates.priority !== undefined) payload.priority = updates.priority

			const [error, updatedNote] = await safeAwait<AxiosError, FetchedNote>(
				upsertNoteAsync(payload)
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

			setNotes((prev) => {
				const updated = prev.map((n) => (n.id === id ? updatedNote : n))
				setToStorage('notes_data', updated)
				return updated
			})
		}, SAVE_DEBOUNCE_MS)

		saveTimersRef.current.set(id, timer)
	}

	const onDeleteNote = async (id: string): Promise<any> => {
		setIsSaving(true)
		const [err, _] = await safeAwait(removeNoteAsync(id))
		if (err) {
			setIsSaving(false)
			return showToast(translateError(err) as string, 'error')
		}

		await refetch()
		Analytics.event('delete_notes')
		setActiveNoteId(null)
		setIsSaving(false)
	}

	const sync = (data: FetchedNote[], syncLocal: boolean) => {
		setNotes([...data])
		if (syncLocal) {
			setToStorage('notes_data', data)
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
				deleteNote: onDeleteNote,
				isSaving,
				isLoading,
				isError,
				isRefetching,
				refetch,
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
