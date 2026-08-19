import { useNotes } from '@/context/notes.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { NoteEditor } from '../components/note-editor'
import { NoteItem } from '../components/note-item'
import { NoteEmpty } from '../components/note-empty'
import { Button } from '@/components/ui'
import { Icon } from '@/src/icons'

export function NoteWideFull() {
	const { notes, activeNoteId, setActiveNoteId, addNote } = useNotes()
	const { blurMode } = useGeneralSetting()

	const activeNote = notes.find((note) => note.id === activeNoteId) || notes[0]

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-full w-full p-1 select-none overflow-hidden">
			<div className="flex flex-col h-full overflow-hidden p-2 rounded-2xl bg-base-200/40 border border-base-content/10">
				<div className="flex items-center justify-between pb-1.5 border-b border-base-content/10">
					<span className="text-xs font-bold text-content">یادداشت‌ها</span>
					<Button
						variant="primary"
						rounded="xl"
						size="sm"
						className="h-6! px-2! text-xs shrink-0"
						onClick={addNote}
					>
						<Icon name="plus" className="w-3 h-3" />
					</Button>
				</div>

				<div className="grow overflow-y-auto space-y-0.5 mt-1.5 scrollbar-none">
					{notes.length === 0 ? (
						<div className="flex items-center justify-center h-full text-xs text-muted">
							یادداشتی وجود ندارد
						</div>
					) : (
						notes.map((note) => (
							<NoteItem
								key={note.id}
								note={note}
								handleNoteClick={(id: string) => setActiveNoteId(id)}
							/>
						))
					)}
				</div>
			</div>

			<div className="md:col-span-2 flex flex-col h-full overflow-hidden p-2 rounded-2xl bg-base-200/40 border border-base-content/10">
				{activeNote ? (
					<div
						key={activeNote.id}
						className={`h-full ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
					>
						<NoteEditor note={activeNote} />
					</div>
				) : (
					<NoteEmpty />
				)}
			</div>
		</div>
	)
}
