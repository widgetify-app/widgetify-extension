import Analytics from '@/analytics'
import { useGeneralSetting } from '@/context/general-setting.context'
import { NotesProvider, useNotes } from '@/context/notes.context'
import { NoteEditor } from './components/note-editor'
import { NoteItem } from './components/note-item'
import { NoteNavigation } from './components/note-navigation'
import { NoteEmpty } from './components/note-empty'
import { NoteCompactRow } from './variants/note-2x1'
import { NoteWideFull } from './variants/note-4x2'
import type { WidgetSize } from '../layout-engine/types'

function NotesContent({ size }: { size?: WidgetSize }) {
	const { notes, activeNoteId } = useNotes()
	const { blurMode } = useGeneralSetting()

	if (size && size.w === 2 && size.h === 1) {
		return <NoteCompactRow />
	}

	if (size && size.w >= 4 && size.h >= 2) {
		return <NoteWideFull />
	}

	const activeNote = notes.find((note) => note.id === activeNoteId)

	if (!activeNote && !notes.length) {
		return <NoteEmpty />
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

interface NotesLayoutProps {
	size?: WidgetSize
}

export function NotesLayout({ size = { w: 2, h: 2 } }: NotesLayoutProps = {}) {
	if (size.w === 2 && size.h === 1) {
		return (
			<NotesProvider>
				<NoteCompactRow />
			</NotesProvider>
		)
	}

	if (size.w >= 4 && size.h >= 2) {
		return (
			<NotesProvider>
				<NoteWideFull />
			</NotesProvider>
		)
	}

	return (
		<NotesProvider>
			<div className="flex-none">
				<div className="w-full my-1">
					<NoteNavigation />
				</div>
			</div>

			<div className="mt-0.5 grow overflow-hidden">
				<NotesContent size={size} />
			</div>
		</NotesProvider>
	)
}
