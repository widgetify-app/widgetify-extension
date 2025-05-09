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
	const { theme } = useTheme()

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
						<FiChevronRight size={18} className={getTextColor(theme)} />
					</button>
				</Tooltip>

				<Tooltip content="یادداشت بعدی" position="top" offset={5}>
					<button
						disabled={activeNoteIndex === notes.length - 1}
						onClick={handleNextNote}
						className={`flex items-center cursor-pointer justify-center w-6 h-6 ${activeNoteIndex < notes.length - 1 ? 'opacity-100' : 'opacity-30 cursor-not-allowed'}`}
					>
						<FiChevronLeft size={18} className={getTextColor(theme)} />
					</button>
				</Tooltip>
			</div>

			<div className="flex items-center gap-2">
				<Tooltip content="حذف یادداشت" position="top" offset={5}>
					<button
						disabled={notes.length <= 1}
						onClick={() => notes.length > 1 && onDeleteNote(activeNoteId as string)}
						className={`flex items-center cursor-pointer justify-center w-6 h-6 ${notes.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
					>
						<FiTrash2 size={16} className={getTextColor(theme)} />
					</button>
				</Tooltip>

				<Tooltip content="یادداشت جدید" position="top" offset={5}>
					<button
						onClick={onAddNote}
						className={`flex items-center cursor-pointer justify-center p-2 rounded-lg  ${getButtonStyles(theme, true)} disabled:opacity-50`}
					>
						<FaPlus size={14} />
					</button>
				</Tooltip>
			</div>
		</div>
	)
}
