import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import type { Note } from '@/context/notes.context'
import { getButtonStyles, getTextColor, useTheme } from '@/context/theme.context'
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
		<div className="flex items-center justify-between px-1 mb-2">
			<div className="flex items-center space-x-1">
				<Tooltip content="یادداشت قبلی" position="top" offset={5}>
					<button
						disabled={activeNoteIndex === 0}
						onClick={handlePrevNote}
						className={`flex items-center cursor-pointer justify-center w-6 h-6 ${activeNoteIndex > 0 ? 'opacity-100' : 'opacity-30 cursor-not-allowed'}`}
					>
						<FiChevronRight size={18} className="text-base-content" />
					</button>
				</Tooltip>

				<Tooltip content="یادداشت بعدی" position="top" offset={5}>
					<button
						disabled={activeNoteIndex === notes.length - 1}
						onClick={handleNextNote}
						className={`flex items-center cursor-pointer justify-center w-6 h-6 ${activeNoteIndex < notes.length - 1 ? 'opacity-100' : 'opacity-30 cursor-not-allowed'}`}
					>
						<FiChevronLeft size={18} className="text-base-content" />
					</button>
				</Tooltip>
			</div>

			<div className="flex items-center gap-2">
				<Tooltip content="حذف یادداشت" position="top" offset={5}>
					<Button
						size="xs"
						disabled={notes.length <= 1}
						onClick={() => notes.length > 1 && onDeleteNote(activeNoteId as string)}
						className={
							'flex btn-circle items-center btn-ghost justify-center disabled:opacity-30'
						}
					>
						<FiTrash2 size={14} />
					</Button>
				</Tooltip>

				<Tooltip content="یادداشت جدید" position="top" offset={5}>
					<Button
						onClick={onAddNote}
						size="sm"
						rounded="md"
						className={
							'flex  items-center btn-primary p-0.5 w-10 justify-center disabled:opacity-30'
						}
					>
						<FaPlus size={14} />
					</Button>
				</Tooltip>
			</div>
		</div>
	)
}
