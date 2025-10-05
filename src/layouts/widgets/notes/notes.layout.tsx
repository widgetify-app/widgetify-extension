import moment from 'jalali-moment'
import { PiNotepad } from 'react-icons/pi'
import Analytics from '@/analytics'
import { RequireAuth } from '@/components/auth/require-auth'
import { useGeneralSetting } from '@/context/general-setting.context'
import { NotesProvider, useNotes } from '@/context/notes.context'
import { WidgetContainer } from '../widget-container'
import { NoteEditor } from './components/note-editor'
import { NoteNavigation } from './components/note-navigation'

function NotesContent() {
	const { notes, activeNoteId, addNote, updateNote } = useNotes()
	const { blurMode } = useGeneralSetting()

	const activeNote = notes.find((note) => note.id === activeNoteId)

	if (!activeNote && !notes.length) {
		return (
			<div
				className={`flex flex-col items-center justify-center h-full ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
			>
				<PiNotepad size={42} className={'mb-2 text-content opacity-50'} />
				<p className={'text-sm text-muted'}>یادداشتی پیدا نشد</p>
				<button
					onClick={addNote}
					className="px-3 py-1 mt-2 text-sm text-white transition-colors bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600"
				>
					ساخت یادداشت جدید
				</button>
			</div>
		)
	}

	if (!activeNote) {
		return <NoteList />
	}

	return (
		<div
			className={`mt-2 flex-grow overflow-auto h-[calc(100%-40px)] ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
		>
			<div key={activeNoteId} className="h-full">
				<NoteEditor note={activeNote} onUpdateNote={updateNote} />
			</div>
		</div>
	)
}

function NoteList() {
	const { notes, setActiveNoteId } = useNotes()
	const { blurMode } = useGeneralSetting()
	function handleNoteClick(noteId: string) {
		setActiveNoteId(noteId)
		Analytics.event('note_selected')
	}

	return (
		<div
			className={`w-full overflow-y-auto hide-scrollbar h-96 flex flex-col gap-0.5 mt-4 ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
		>
			{notes.map((note) => (
				<div
					key={note.id}
					className={`p-2   bg-base-300/70 hover:bg-base-300 border border-base-300/70 rounded-md flex group justify-between items-center cursor-pointer hover:bg-opacity-80 transition-colors`}
					onClick={() => handleNoteClick(note.id)}
				>
					<span className="flex-1 text-xs truncate text-content">
						{note.title || 'بدون عنوان'}
					</span>
					<span className="text-[10px] text-muted">
						{moment(note.createdAt).locale('fa').format('jD jMMM YY')}
					</span>
				</div>
			))}
		</div>
	)
}

function NotesHeader() {
	return (
		<div className="flex items-center justify-between">
			<h4 className={'text-sm font-medium text-content truncate'}>
				دفترچه یادداشت
			</h4>

			<NoteNavigation />
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
