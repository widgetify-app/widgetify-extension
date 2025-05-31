import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { isSyncActive } from '@/common/sync-checker'
import { sleep } from '@/common/utils/timeout'
import { safeAwait } from '@/services/api'
import {
  type FetchedNote,
  deleteNote,
  getNotes,
  upsertNote,
} from '@/services/note/note-api'
import type { AxiosError } from 'axios'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
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
  isSaving: boolean
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function loadNotes() {
      const storedNotes = await getFromStorage('notes_data')
      if (storedNotes && Array.isArray(storedNotes) && storedNotes.length > 0) {
        setNotes(storedNotes)
        setActiveNoteId(storedNotes[0].id)

        const isEnable = await isSyncActive()
        if (isEnable) {
          await sleep(1000)
          setIsSaving(true)
          const [error, fetchedNotes] = await safeAwait<
            AxiosError,
            FetchedNote[]
          >(getNotes())
          setIsSaving(false)
          if (!error) {
            setNotes(fetchedNotes)
            setActiveNoteId(fetchedNotes[0].id)
          }
        }
      } else {
        const defaultNote: Note = {
          id: uuidv4(),
          title: '',
          body: '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        const initialNotes = [defaultNote]
        setNotes(initialNotes)
        setActiveNoteId(defaultNote.id)
        await setToStorage('notes_data', initialNotes)
      }
    }

    loadNotes()
  }, [])

  const addNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: '',
      body: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setNotes((prevNotes) => {
      const updatedNotes = [...prevNotes, newNote]
      setToStorage('notes_data', updatedNotes)
      return updatedNotes
    })
    setActiveNoteId(newNote.id)
    Analytics.featureUsed('add-notes')
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setIsSaving(true)
    let notesAfterUpdate: Note[] = []

    setNotes((prevNotes) => {
      notesAfterUpdate = prevNotes.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note,
      )
      return notesAfterUpdate
    })

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      Analytics.featureUsed('update-notes')
      await setToStorage('notes_data', notesAfterUpdate)
      const isSyncEnabled = await isSyncActive()
      if (isSyncEnabled) {
        await upsertNote({
          title: updates.title || null,
          body: updates.body || null,
          offlineId: id,
          onlineId: notesAfterUpdate.find((note) => note.id === id)?.id,
        })
      }
      setIsSaving(false)
    }, 2500)
  }

  const onDeleteNote = async (id: string) => {
    const existingNote = notes.findIndex((note) => note.id === id)
    if (existingNote !== -1) {
      setIsSaving(true)
      const updatedNotes = [...notes]
      updatedNotes.splice(existingNote, 1)
      setNotes(updatedNotes)
      if (activeNoteId === id) {
        setActiveNoteId(updatedNotes[0]?.id || null)
      } else {
      }

      const isSyncEnabled = await isSyncActive()
      if (isSyncEnabled) {
        await safeAwait(deleteNote(id))
      }

      await setToStorage('notes_data', updatedNotes)
      setIsSaving(false)
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
        deleteNote: onDeleteNote,
        isSaving,
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
