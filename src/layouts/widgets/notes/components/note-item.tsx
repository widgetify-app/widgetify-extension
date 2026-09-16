import moment from 'jalali-moment'
import type React from 'react'
import { useState } from 'react'
import Analytics from '@/analytics'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { FetchedNote } from '@/services/hooks/note/note.interface'
import { NOTE_PREVIEW_CHARACTER_LIMIT, PRIORITY_BG_COLORS } from '../constants'

interface NoteItemProps {
	note: FetchedNote
	onSelect: (noteId: string) => void
}

export const NoteItem: React.FC<NoteItemProps> = ({ note, onSelect }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const priorityBg = note.priority
		? PRIORITY_BG_COLORS[note.priority]
		: 'bg-subtle'
	const shouldShowReadMore =
		!!note.body && note.body.length > NOTE_PREVIEW_CHARACTER_LIMIT

	const createdAt = moment(note.createdAt).locale('fa')
	const title = note.title || 'بدون عنوان'

	const toggleExpand = () => {
		setIsExpanded(!isExpanded)
		Analytics.event('note_toggle_expand')
	}

	return (
		<article
			className={cn('group flex flex-col rounded-2xl overflow-hidden', priorityBg)}
		>
			<button
				type="button"
				onClick={() => onSelect(note.id)}
				aria-label={`باز کردن یادداشت ${title}`}
				className="flex flex-col w-full text-start cursor-pointer active:scale-[0.99] hover:opacity-90 focus-visible:focus-ring"
			>
				<span className="flex items-center justify-between w-full gap-2 px-2.5 py-1.5">
					<span className="text-[12px] font-bold truncate">{title}</span>
					<span className="flex items-center gap-1 shrink-0">
						<Icon name="calendarDays" size={10} aria-hidden="true" />
						<time
							dateTime={createdAt.clone().locale('en').format('YYYY-MM-DD')}
							className="text-[10px]"
						>
							{createdAt.format('jD jMMM')}
						</time>
					</span>
				</span>

				<span className="block px-2.5 pb-2.5 pt-0 w-full">
					<span
						className={cn(
							'block text-[11.5px] leading-relaxed text-shadow-2xs whitespace-pre-wrap wrap-break-word font-medium',
							!isExpanded && shouldShowReadMore && 'line-clamp-3'
						)}
					>
						{note.body}
					</span>
				</span>
			</button>

			{shouldShowReadMore && (
				<button
					type="button"
					onClick={toggleExpand}
					aria-expanded={isExpanded}
					aria-label={isExpanded ? 'بستن متن یادداشت' : 'نمایش کامل یادداشت'}
					className="flex items-center gap-1 mx-2.5 mb-2 text-xs font-medium cursor-pointer text-muted hover:bg-muted p-0.5 rounded-full w-fit focus-visible:focus-ring"
				>
					<Icon
						name="chevronDown"
						size={12}
						aria-hidden="true"
						className={cn(
							'transition-transform duration-300',
							isExpanded && 'rotate-180'
						)}
					/>
				</button>
			)}
		</article>
	)
}
