import { PRIORITY_OPTIONS } from '@/common/constant/priority_options'
import type { FetchedNote } from '@/services/hooks/note/note.interface'
import moment from 'jalali-moment'

interface Prop {
	note: FetchedNote
	handleNoteClick: any
}
export function NoteItem({ note, handleNoteClick }: Prop) {
	const p = PRIORITY_OPTIONS.find((p) => p.value === note.priority)
	return (
		<div
			key={note.id}
			className={`p-2   bg-base-300/70 hover:bg-base-300 border border-base-300/70 rounded-xl flex group justify-between items-center cursor-pointer hover:bg-opacity-80 transition-colors`}
			onClick={() => handleNoteClick(note.id)}
		>
			<div className={`${p?.bgColor || 'bg-content'} w-2 h-2 rounded-full ml-2`} />

			<span className="flex-1 text-xs truncate text-content">
				{note.title || 'بدون عنوان'}
			</span>
			<span className="text-[10px] text-muted">
				{moment(note.createdAt).locale('fa').format('jD jMMM YY')}
			</span>
		</div>
	)
}
