import Analytics from '@/analytics'
import { useGeneralSetting } from '@/context/general-setting.context'
import { NotesProvider, useNotes } from '@/context/notes.context'
import { NoteEditor } from './components/note-editor'
import { NoteItem } from './components/note-item'
import { NoteNavigation } from './components/note-navigation'
import { NoteEmpty } from './components/note-empty'
import { NoteSticky } from './variants/note-sticky'
import type { WidgetSize } from '../layout-engine/types'

function NotesContent() {
	const { notes, activeNoteId } = useNotes()
	const { blurMode } = useGeneralSetting()

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
	meta?: Record<string, any>
	instanceId?: string
}

export function NotesLayout({ size = { w: 2, h: 3 }, meta }: NotesLayoutProps = {}) {
	const isSticky = meta?.variant === 'sticky' || (size.w === 2 && size.h === 2)

	return (
		<NotesProvider>
			{isSticky ? (
				<NoteSticky />
			) : (
				<div className="flex flex-col h-full overflow-hidden">
					<div className="flex-none">
						<div className="w-full my-1">
							<NoteNavigation />
						</div>
					</div>

					<div className="mt-0.5 grow overflow-hidden">
						<NotesContent />
					</div>
				</div>
			)}
		</NotesProvider>
	)
}
