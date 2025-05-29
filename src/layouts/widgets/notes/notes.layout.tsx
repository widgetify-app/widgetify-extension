import { RequireAuth } from '@/components/auth/require-auth'
import { NotesProvider, useNotes } from '@/context/notes.context'
import { FiBook, FiLoader } from 'react-icons/fi'
import { WidgetContainer } from '../widget-container'
import { NoteEditor } from './components/note-editor'
import { NoteNavigation } from './components/note-navigation'

function NotesContent() {
	const { notes, activeNoteId, setActiveNoteId, addNote, updateNote, deleteNote } =
		useNotes()

	const activeNote = notes.find((note) => note.id === activeNoteId)

	if (!activeNote) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<FiBook className={'w-8 h-8 mb-2 text-content opacity-50'} />
				<p className={'text-sm text-muted'}>هیچ یادداشتی پیدا نشد</p>
				<button
					onClick={addNote}
					className="px-3 py-1 mt-2 text-sm text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
				>
					ساخت یادداشت جدید
				</button>
			</div>
		)
	}

	return (
		<>
			<div className="sticky top-0 z-10 bg-inherit">
				<NoteNavigation
					notes={notes}
					activeNoteId={activeNoteId}
					onSelectNote={setActiveNoteId}
					onAddNote={addNote}
					onDeleteNote={deleteNote}
				/>
			</div>

			<div className="flex-grow overflow-auto h-[calc(100%-40px)]">
				<div key={activeNoteId} className="h-full">
					<NoteEditor note={activeNote} onUpdateNote={updateNote} />
				</div>
			</div>
		</>
	)
}

function NotesHeader() {
	const { isSaving } = useNotes()

	return (
		<div className="flex items-center justify-between mb-2">
			<h4 className={'text-sm font-medium text-content'}>دفترچه یادداشت</h4>
			{isSaving && <FiLoader className={'block w-4 h-4 animate-spin text-content'} />}
		</div>
	)
}

export function NotesLayout() {
	return (
		<WidgetContainer className="overflow-hidden">
			<NotesProvider>
				<div className="flex flex-col h-full">
					<NotesHeader />
					<RequireAuth mode="preview">
						<NotesContent />
					</RequireAuth>
				</div>
			</NotesProvider>
		</WidgetContainer>
	)
}
