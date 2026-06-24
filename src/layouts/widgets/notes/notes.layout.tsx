import Analytics from '@/analytics'
import { useGeneralSetting } from '@/context/general-setting.context'
import { NotesProvider, useNotes } from '@/context/notes.context'
import { NoteEditor } from './components/note-editor'
import { NoteItem } from './components/note-item'
import { NoteNavigation } from './components/note-navigation'

function NotesContent() {
	const { notes, activeNoteId } = useNotes()
	const { blurMode } = useGeneralSetting()

	const activeNote = notes.find((note) => note.id === activeNoteId)

	if (!activeNote && !notes.length) {
		return (
			<div
				className={`flex flex-col items-center justify-center h-full ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
			>
				<div className="flex items-center justify-center w-12 h-12">
					<img
						src="https://cdn.widgetify.ir/system/no-items.png"
						alt="بدون عادت"
						className="object-contain w-48 h-auto select-none"
					/>
				</div>
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
			className={`grow overflow-auto h-full ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
		>
			<div key={activeNoteId} className="h-full">
				<NoteEditor note={activeNote} />
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
			className={`w-full overflow-y-auto scrollbar-none h-full flex flex-col gap-0.5 ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
		>
			{notes.map((note) => (
				<NoteItem note={note} handleNoteClick={handleNoteClick} key={note.id} />
			))}
		</div>
	)
}

export function NotesLayout() {
	return (
		<NotesProvider>
			<div className="flex-none">
				<div className="w-full my-1">
					<NoteNavigation />
				</div>
			</div>

			<div className="mt-0.5 grow overflow-hidden">
				<NotesContent />
			</div>
		</NotesProvider>
	)
}
