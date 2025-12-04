import { PiNotepad } from 'react-icons/pi'
import Analytics from '@/analytics'
import { useGeneralSetting } from '@/context/general-setting.context'
import { NotesProvider, useNotes } from '@/context/notes.context'
import { WidgetContainer } from '../widget-container'
import { NoteEditor } from './components/note-editor'
import { NoteNavigation } from './components/note-navigation'
import { NoteItem } from './components/note-item'

function NotesContent() {
	const { notes, activeNoteId, updateNote } = useNotes()
	const { blurMode } = useGeneralSetting()

	const activeNote = notes.find((note) => note.id === activeNoteId)

	if (!activeNote && !notes.length) {
		return (
			<div
				className={`flex flex-col items-center justify-center h-full ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
			>
				<PiNotepad size={42} className={'mb-2 text-content opacity-50'} />
				<p className={'text-sm text-muted'}>یادداشتی پیدا نشد</p>
				<span className="font-light text-muted">
					منتظر چی هستی؟ شروع کن به نوشتن!
				</span>
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
				<NoteItem note={note} handleNoteClick={handleNoteClick} key={note.id} />
			))}
		</div>
	)
}

interface Prop {
	onChangeTab?: any
}
export function NotesLayout({ onChangeTab }: Prop) {
	return (
		<WidgetContainer className="overflow-hidden">
			<NotesProvider>
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-between">
						<div className="flex items-center justify-around p-1 text-xs font-medium bg-base-300 w-28 rounded-2xl text-content">
							<div
								onClick={() => onChangeTab()}
								className="cursor-pointer hover:bg-primary/10 rounded-xl py-0.5 px-1"
							>
								<span>وظایف</span>
							</div>
							<div className="bg-primary rounded-xl py-0.5 px-1 text-gray-200">
								یادداشت
							</div>
						</div>

						<NoteNavigation />
					</div>
					<NotesContent />
				</div>
			</NotesProvider>
		</WidgetContainer>
	)
}
