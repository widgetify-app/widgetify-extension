import { PRIORITY_OPTIONS } from '@/common/constant/priority_options'
import type { FetchedNote } from '@/services/hooks/note/note.interface'
import moment from 'jalali-moment'
import { FiCalendar } from 'react-icons/fi'

interface Prop {
	note: FetchedNote
	handleNoteClick: any
}
export function NoteItem({ note, handleNoteClick }: Prop) {
	const p = PRIORITY_OPTIONS.find((p) => p.value === note.priority)

	return (
		<div
			className="group flex flex-col rounded-2xl border border-base-300/40 bg-base-300/30 transition-all hover:bg-base-300/60 active:scale-[0.98] cursor-pointer"
			onClick={() => handleNoteClick(note.id)}
		>
			<div className="flex items-center justify-between gap-2 px-2.5 py-1.5 border-b border-base-content/5  bg-base-content/2 rounded-t-2xl">
				<div className="flex items-center gap-1.5 min-w-0">
					<div
						className={`h-1.5 w-1.5 shrink-0 rounded-full ${p?.bgColor || 'bg-base-content/20'}`}
					/>
					<h3 className=" text-[12px] font-bold text-base-content/90">
						{note.title || 'بدون عنوان'}
					</h3>
				</div>
				<div className="flex items-center gap-1 shrink-0 text-muted/60">
					<FiCalendar size={10} />
					<span className="text-[10px]">
						{moment(note.createdAt).locale('fa').format('jD jMMM')}
					</span>
				</div>
			</div>

			<div className="p-2.5 bg-base-100/10">
				<p className="text-[11.5px] leading-relaxed text-base-content/80 whitespace-pre-wrap wrap-break-word font-medium">
					{note.body}
				</p>
			</div>
		</div>
	)
}
