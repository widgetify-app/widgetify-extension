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
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import { useGetNotes } from '@/services/hooks/note/get-notes.hook'
import { useAuth } from './auth.context'
import { useRemoveNote } from '@/services/hooks/note/delete-note.hook'
import { useUpsertNote } from '@/services/hooks/note/upsert-note.hook'
import type { FetchedNote } from '@/services/hooks/note/note.interface'

interface NotesContextType {
	notes: FetchedNote[]
	activeNoteId: string | null
	setActiveNoteId: (id: string | null) => void
	addNote: (initial?: Partial<FetchedNote>) => Promise<FetchedNote | null>
	updateNote: (id: string, updates: Partial<FetchedNote>) => void
	deleteNote: (id: string) => Promise<void>
	isSaving: boolean
	isCreatingNote: boolean
	isRefetching: boolean
	refetch: any
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
	const { isAuthenticated } = useAuth()
	const [notes, setNotes] = useState<FetchedNote[]>([])
	const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const [isCreatingNote, setIsCreatingNote] = useState(false)
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const {
		data: fetchedNotes,
		refetch,
		dataUpdatedAt,
		isRefetching,
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
	}, [])

	useEffect(() => {
		sync(fetchedNotes || [], true)
	}, [dataUpdatedAt])

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
			showToast(translateError(er) as any, 'error')
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

		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current)
		}

		saveTimeoutRef.current = setTimeout(async () => {
			setIsSaving(true)
			Analytics.event('update_notes')
			const [error, updatedNote] = await safeAwait<AxiosError, FetchedNote>(
				upsertNoteAsync({
					title: updates.title ?? null,
					body: updates.body ?? null,
					id,
					priority: updates.priority,
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

			setNotes((prev) => {
				const updated = prev.map((n) => (n.id === id ? updatedNote : n))
				setToStorage('notes_data', updated)
				return updated
			})
		}, 500)
	}

	const onDeleteNote = async (id: string): Promise<any> => {
		setIsSaving(true)
		const [err, _] = await safeAwait(removeNoteAsync(id))
		if (err) {
			setIsSaving(false)
			return showToast(translateError(err) as any, 'error')
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
