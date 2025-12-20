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
			className={`p-2 bg-base-300/70 hover:bg-base-300 border border-base-300/70 rounded-xl flex flex-col group justify-between items-center cursor-pointer hover:bg-opacity-80 transition-colors gap-2`}
			onClick={() => handleNoteClick(note.id)}
		>
			<div className="flex flex-row items-center justify-between w-full">
				<div
					className={`${p?.bgColor || 'bg-content'} w-2 h-2 rounded-full ml-2`}
				/>
				<div className="flex-1 text-xs truncate text-content">
					{note.title || 'بدون عنوان'}
				</div>
				<div className="text-[10px] text-muted">
					{moment(note.createdAt).locale('fa').format('jD jMMM YY')}
				</div>
			</div>
			<div className="w-full p-2 rounded-md bg-base-200/50 min-h-10">
				<p className="text-xs font-light text-muted">{note.body}</p>
			</div>
		</div>
	)
}
