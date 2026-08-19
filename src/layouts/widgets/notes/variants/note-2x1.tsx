import { useNotes } from '@/context/notes.context'
import { Icon } from '@/src/icons'

export function NoteCompactRow() {
	const { notes, setActiveNoteId, addNote } = useNotes()
	const latestNote = notes[0]

	const handleOpen = () => {
		if (latestNote) {
			setActiveNoteId(latestNote.id)
		} else {
			addNote()
		}
	}

	return (
		<div
			onClick={handleOpen}
			className="flex items-center justify-between h-full w-full px-3.5 py-2 select-none cursor-pointer hover:bg-base-200/30 transition-colors"
		>
			<div className="flex items-center gap-2.5 min-w-0">
				<div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
					<Icon name="notebook" className="w-3.5 h-3.5" />
				</div>

				<div className="flex flex-col min-w-0">
					<span className="text-xs font-bold text-content truncate max-w-44">
						{latestNote?.title || 'یادداشت جدید'}
					</span>
					<span className="text-[9px] text-base-content/60 mt-0.5 truncate">
						{latestNote?.body || 'برای نوشتن کلیک کنید...'}
					</span>
				</div>
			</div>

			<div className="text-[10px] text-base-content/60 shrink-0">
				{notes.length} یادداشت
			</div>
		</div>
	)
}
