import moment from 'jalali-moment'
import { useEffect, useRef, useState } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Tooltip } from '@/components/ui'
import { useNotes } from '@/features/widgets/notes/notes.context'
import { Icon } from '@/icons'
import type { FetchedNote } from '@/services/note/note.interface'
import type { NotePriority } from '../types'
import { countWords } from '../utils/count-words'
import { NoteColorPicker } from './note-color-picker'
import { NoteFields } from './note-fields'

interface NoteBoardEditorProps {
	note: FetchedNote
	isNew: boolean
	onDelete: () => void
	className?: string
}

export function NoteBoardEditor({
	note,
	isNew,
	onDelete,
	className,
}: NoteBoardEditorProps) {
	const { updateNote, isSaving } = useNotes()
	const titleRef = useRef<HTMLInputElement>(null)
	const [title, setTitle] = useState(note.title)
	const [body, setBody] = useState(note.body)
	const [priority, setPriority] = useState<NotePriority | undefined>(note.priority)

	useEffect(() => {
		if (isNew) titleRef.current?.focus()
	}, [isNew])

	const save = (changes: Partial<Pick<FetchedNote, 'title' | 'body' | 'priority'>>) => {
		updateNote(note.id, { title, body, priority, ...changes })
	}

	const words = countWords(body)
	const editedAt = moment(note.updatedAt || note.createdAt)
		.locale('fa')
		.format('jD jMMMM')

	return (
		<section
			aria-label={note.title || t('widgets.notes.untitled')}
			className="flex flex-col flex-1 min-w-0 min-h-0 gap-2 border-s border-line ps-3.5"
		>
			<NoteFields
				title={title}
				body={body}
				onTitleChange={(value) => {
					setTitle(value)
					save({ title: value })
				}}
				onBodyChange={(value) => {
					setBody(value)
					save({ body: value })
				}}
				titleRef={titleRef}
				className={cn('px-0 pt-0.5', className)}
			/>

			<footer className="flex items-center flex-none gap-2 h-7">
				<NoteColorPicker
					value={priority}
					onChange={(value) => {
						setPriority(value)
						save({ priority: value })
					}}
				/>
				<span className="flex-1 min-w-0 truncate text-end text-3xs text-fg-faint">
					{isSaving
						? t('widgets.notes.saving')
						: words > 0
							? t('widgets.notes.wordCount', {
									words,
									editedAt,
								})
							: editedAt}
				</span>
				<Tooltip content={t('widgets.notes.deleteThis')} delay={500}>
					<button
						type="button"
						onClick={onDelete}
						aria-label={t('widgets.notes.deleteThis')}
						className="grid rounded-lg cursor-pointer place-items-center size-7 text-fg-muted transition-ui hover:bg-danger-fill hover:text-danger focus-visible:focus-ring"
					>
						<Icon name="trash" size={16} aria-hidden="true" />
					</button>
				</Tooltip>
			</footer>
		</section>
	)
}
