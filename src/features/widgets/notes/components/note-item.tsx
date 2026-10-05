import moment from 'jalali-moment'
import type React from 'react'
import { cn } from '@/common/utils/cn'
import { useKeyboardFocusWithin } from '@/features/widgets/hooks/use-keyboard-focus-within'
import { Icon, type IconName } from '@/icons'
import type { FetchedNote } from '@/services/note/note.interface'
import { PRIORITY_BG_COLORS } from '../constants'

interface NoteItemProps {
	note: FetchedNote
	onSelect: (noteId: string) => void
	onDelete: (noteId: string) => void
}

export const NoteItem: React.FC<NoteItemProps> = ({ note, onSelect, onDelete }) => {
	const keyboardFocus = useKeyboardFocusWithin()

	const createdAt = moment(note.createdAt).locale('fa')
	const title = note.title || 'بدون عنوان'

	return (
		<article
			{...keyboardFocus}
			className="flex items-start rounded-xl group/note transition-ui hover:bg-fill data-[keyboard-focus]:bg-fill"
		>
			<button
				type="button"
				onClick={() => onSelect(note.id)}
				aria-label={`باز کردن یادداشت ${title}`}
				className="flex items-start flex-1 min-w-0 gap-2.5 p-2 rounded-xl cursor-pointer text-start focus-visible:focus-ring"
			>
				<span
					aria-hidden="true"
					className="grid size-4 place-items-center shrink-0"
				>
					<span
						className={cn(
							'rounded-full size-1.75',
							note.priority
								? PRIORITY_BG_COLORS[note.priority]
								: 'bg-fg-ghost'
						)}
					/>
				</span>
				<span className="flex flex-col flex-1 min-w-0 leading-control">
					<span className="text-xs font-semibold truncate text-fg">
						{title}
					</span>
					{note.body && (
						<span className="truncate text-2xs text-fg-muted">
							{note.body}
						</span>
					)}
				</span>
			</button>

			<span className="flex items-center h-6 mt-1.5 shrink-0 pe-2">
				<time
					dateTime={createdAt.clone().locale('en').format('YYYY-MM-DD')}
					className="px-0.5 font-medium text-3xs text-fg-faint group-hover/note:hidden group-data-[keyboard-focus]/note:hidden"
				>
					{createdAt.format('jD jMMM')}
				</time>
				<span className="items-center hidden group-hover/note:flex group-data-[keyboard-focus]/note:flex">
					<RowButton
						icon="edit"
						label="ویرایش یادداشت"
						onClick={() => onSelect(note.id)}
					/>
					<RowButton
						icon="trash"
						label="حذف یادداشت"
						onClick={() => onDelete(note.id)}
						isDanger
					/>
				</span>
			</span>
		</article>
	)
}

interface RowButtonProps {
	icon: IconName
	label: string
	onClick: () => void
	isDanger?: boolean
}

function RowButton({ icon, label, onClick, isDanger }: RowButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className={cn(
				'grid rounded-lg cursor-pointer place-items-center size-6 text-fg-muted transition-ui focus-visible:focus-ring',
				isDanger
					? 'hover:bg-danger-fill hover:text-danger'
					: 'hover:bg-fill-2 hover:text-fg-strong'
			)}
		>
			<Icon name={icon} size={14} aria-hidden="true" />
		</button>
	)
}
