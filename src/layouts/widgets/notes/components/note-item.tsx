import { useState } from 'react' // اضافه شد
import { PRIORITY_OPTIONS } from '@/common/constant/priority_options'
import type { FetchedNote } from '@/services/hooks/note/note.interface'
import moment from 'jalali-moment'
import { FiCalendar } from 'react-icons/fi'
import { HiChevronDown } from 'react-icons/hi2' // آیکون برای dropdown
import Analytics from '@/analytics'

interface Prop {
	note: FetchedNote
	handleNoteClick: any
}

export function NoteItem({ note, handleNoteClick }: Prop) {
	const p = PRIORITY_OPTIONS.find((p) => p.value === note.priority)
	const [isExpanded, setIsExpanded] = useState(false)

	const CHARACTER_LIMIT = 120

	const toggleExpand = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsExpanded(!isExpanded)
		Analytics.event(`note_toggle_expand`)
	}

	const shouldShowReadMore = note.body && note.body.length > CHARACTER_LIMIT

	return (
		<div
			className={`group flex flex-col rounded-2xl border border-base-300/40  transition-all active:scale-[0.99] cursor-pointer ${p?.bgColor || 'bg-base-300/30'} hover:opacity-90`}
			onClick={() => handleNoteClick(note.id)}
		>
			<div className="flex items-center justify-between gap-2 px-2.5 py-1.5  rounded-t-2xl">
				<div className="flex items-center gap-1.5 min-w-0">
					<h3 className="text-[12px] font-bold">
						{note.title || 'بدون عنوان'}
					</h3>
				</div>
				<div className="flex items-center gap-1 shrink-0">
					<FiCalendar size={10} />
					<span className="text-[10px]">
						{moment(note.createdAt).locale('fa').format('jD jMMM')}
					</span>
				</div>
			</div>

			<div className="p-2.5 bg-base-100/10">
				<div className="relative">
					<p
						className={`text-[11.5px] leading-relaxed  whitespace-pre-wrap wrap-break-word font-medium transition-all duration-300 ${
							!isExpanded && shouldShowReadMore ? 'line-clamp-3' : ''
						}`}
					>
						{note.body}
					</p>

					{shouldShowReadMore && (
						<button
							onClick={toggleExpand}
							className="flex items-center gap-1 mt-1 text-xs font-medium cursor-pointer text-muted hover:bg-base-300 p-0.5 rounded-full"
						>
							<HiChevronDown
								className={`transition-transform duration-300 ${
									isExpanded ? 'rotate-180' : ''
								}`}
								size={12}
							/>
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
