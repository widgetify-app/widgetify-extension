import { RequireAuth } from '@/components/auth/require-auth'
import { useGeneralSetting } from '@/context/general-setting.context'
import { NotesProvider, useNotes } from '@/context/notes.context'
import { FiBook, FiLoader } from 'react-icons/fi'
import { WidgetContainer } from '../widget-container'
import { NoteEditor } from './components/note-editor'
import { NoteNavigation } from './components/note-navigation'

function NotesContent() {
	const { notes, activeNoteId, addNote, updateNote } = useNotes()
	const { blurMode } = useGeneralSetting()

	const activeNote = notes.find((note) => note.id === activeNoteId)

	if (!activeNote) {
		return (
			<div className={`flex flex-col items-center justify-center h-full ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}>
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
			<div className={`mt-2 flex-grow overflow-auto h-[calc(100%-40px)] ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}>
				<div key={activeNoteId} className="h-full">
					<NoteEditor note={activeNote} onUpdateNote={updateNote} />
				</div>
			</div>
		</>
	)
}

function NotesHeader() {
	const { notes, activeNoteId, setActiveNoteId, addNote, deleteNote, isSaving } =
		useNotes()
	return (
		<div className="flex items-center justify-between">
			<h4 className={'text-sm font-medium text-content truncate'}>
				دفترچه یادداشت
			</h4>
			{isSaving && (
				<FiLoader className={'mx-2 block w-4 h-4 animate-spin text-content'} />
			)}
			<NoteNavigation
				notes={notes}
				activeNoteId={activeNoteId}
				onSelectNote={setActiveNoteId}
				onAddNote={addNote}
				onDeleteNote={deleteNote}
			/>
		</div>
	)
}

export function NotesLayout() {
	return (
		<WidgetContainer className="overflow-hidden">
			<NotesProvider>
				<div className="flex flex-col h-full">
					<RequireAuth mode="preview">
						<NotesHeader />
						<NotesContent />
					</RequireAuth>
				</div>
			</NotesProvider>
		</WidgetContainer>
	)
}
