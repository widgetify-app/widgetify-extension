import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import type { Note } from '@/context/notes.context'
import { useMemo } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi'

interface NoteNavigationProps {
	notes: Note[]
	activeNoteId: string | null
	onSelectNote: (id: string) => void
	onAddNote: () => void
	onDeleteNote: (id: string) => void
}

export function NoteNavigation({
	notes,
	activeNoteId,
	onSelectNote,
	onAddNote,
	onDeleteNote,
}: NoteNavigationProps) {
	const activeNoteIndex = useMemo(() => {
		return notes.findIndex((note) => note.id === activeNoteId)
	}, [notes, activeNoteId])

	const handlePrevNote = () => {
		if (activeNoteIndex > 0) {
			onSelectNote(notes[activeNoteIndex - 1].id)
		}
	}

	const handleNextNote = () => {
		if (activeNoteIndex < notes.length - 1) {
			onSelectNote(notes[activeNoteIndex + 1].id)
		}
	}

	return (
		<div className="flex items-center justify-between mt-1 mb-2">
			<div className="flex items-center space-x-1">
				<Tooltip content="یادداشت قبلی" position="top" offset={5}>
					<button
						disabled={activeNoteIndex === 0}
						onClick={handlePrevNote}
						className={`h-7 w-7 flex items-center justify-center rounded-full cursor-pointer transition-colors text-muted opacity-70 hover:bg-base-300 hover:opacity-100 ${activeNoteIndex > 0 ? 'opacity-100' : 'opacity-30 cursor-not-allowed'} duration-300`}
					>
						<FiChevronRight size={18} className="text-base" />
					</button>
				</Tooltip>

				<Tooltip content="یادداشت بعدی" position="top" offset={5}>
					<button
						disabled={activeNoteIndex === notes.length - 1}
						onClick={handleNextNote}
						className={`h-7 w-7 flex items-center justify-center rounded-full cursor-pointer transition-colors text-muted opacity-70 hover:bg-base-300 hover:opacity-100 ${activeNoteIndex < notes.length - 1 ? 'opacity-100' : 'opacity-30 cursor-not-allowed'} duration-300`}
					>
						<FiChevronLeft size={18} className="text-base" />
					</button>
				</Tooltip>
			</div>

			<div className="w-fit p-1 flex items-center gap-1">
				<Tooltip content="حذف یادداشت" position="top" offset={5}>
					<Button
						size="xs"
						disabled={notes.length <= 1}
						onClick={() =>
							notes.length > 1 && onDeleteNote(activeNoteId as string)
						}
						className="h-6 w-6 p-0 text-error !bg-transparent hover:!bg-error/20 border-none rounded-xl disabled:opacity-75 transition-all duration-300"
					>
						<FiTrash2 size={13} />
					</Button>
				</Tooltip>

				<Tooltip content="یادداشت جدید" position="top" offset={5}>
					<Button
						onClick={onAddNote}
						size="xs"
						className="h-6 w-9 p-0 bg-primary !text-white border-none rounded-xl transition-all duration-300"
					>
						<FaPlus size={12} />
					</Button>
				</Tooltip>
			</div>
		</div>
	)
}
