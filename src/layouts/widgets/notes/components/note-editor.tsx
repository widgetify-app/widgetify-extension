import { cn } from '@/common/utils/cn'
import { Button, IconLoading } from '@/components/ui'
import { TextInput } from '@/components/ui'
import { Tooltip } from '@/components/ui'
import { useNotes } from '@/context/notes.context'
import type { FetchedNote } from '@/services/hooks/note/note.interface'
import { PRIORITY_BG_COLORS, PRIORITY_OPTIONS } from '../constants'
import type { NotePriority } from '../types'
import { Icon } from '@/icons'
import { useEffect, useRef, useState } from 'react'

interface NoteEditorProps {
	note: FetchedNote
}

export function NoteEditor({ note }: NoteEditorProps) {
	const { updateNote, isSaving } = useNotes()

	const titleRef = useRef<HTMLInputElement>(null)
	const bodyRef = useRef<HTMLTextAreaElement>(null)
	const [priority, setPriority] = useState(note.priority)

	const [currentTitle, setCurrentTitle] = useState(note.title)
	const [currentBody, setCurrentBody] = useState(note.body)

	useEffect(() => {
		setCurrentTitle(note.title)
		setCurrentBody(note.body)
		if (titleRef.current && !note.title && note.body === '') {
			titleRef.current.focus()
		}
	}, [note.id, note.title, note.body])

	const onSave = () => {
		updateNote(note.id, {
			priority,
			body: currentBody,
			title: currentTitle,
		})
	}

	const bgColor = priority ? PRIORITY_BG_COLORS[priority] : 'bg-subtle'
	return (
		<div className="flex flex-col h-full overflow-hidden">
			<TextInput
				ref={titleRef}
				type="text"
				className={`w-full h-12 font-bold! border-0 rounded-b-none! ${bgColor}`}
				aria-label="عنوان یادداشت"
				placeholder="عنوان یادداشت..."
				value={currentTitle}
				onChange={setCurrentTitle}
			/>

			<textarea
				ref={bodyRef}
				className={`w-full h-full px-2 pt-1 pb-4 text-sm grow resize-none text-shadow-2xs rounded-b-2xl  outline-none font-light ${bgColor}`}
				aria-label="متن یادداشت"
				placeholder="متن یادداشت..."
				value={currentBody}
				onChange={(e) => setCurrentBody(e.target.value)}
				rows={3}
				dir="rtl"
			/>

			<div className="flex flex-row items-center justify-between mt-1 w-full py-0.5 px-1 rounded-xl">
				<div className="flex items-center gap-1">
					{PRIORITY_OPTIONS.map((p) => (
						<PriorityButton
							key={p.value}
							isSelected={priority === p.value}
							onClick={() =>
								setPriority(priority === p.value ? undefined : p.value)
							}
							option={p}
						/>
					))}
				</div>
				<div className="flex items-center">
					<Button
						size="sm"
						onClick={() => onSave()}
						loading={isSaving}
						disabled={isSaving}
						loadingText={<IconLoading />}
						color={'primary'}
						rounded={'xl'}
						className="w-24 h-6"
					>
						<span className="text-xs">ذخیـره</span>
					</Button>
				</div>
			</div>
		</div>
	)
}

const PriorityButton = ({
	option,
	isSelected,
	onClick,
}: {
	option: (typeof PRIORITY_OPTIONS)[0]
	isSelected: boolean
	onClick: () => void
}) => (
	<Tooltip content={option.ariaLabel}>
		<button
			type="button"
			onClick={onClick}
			aria-label={option.ariaLabel}
			aria-pressed={isSelected}
			className={cn(
				'flex items-center justify-center w-4 h-4 rounded-full cursor-pointer transition-ui focus-visible:focus-ring',
				option.bgColor,
				isSelected
					? 'ring-2 ring-offset-0 ring-primary'
					: 'opacity-70 hover:opacity-100'
			)}
		>
			{isSelected && <Icon name="check" size={8} aria-hidden="true" />}
		</button>
	</Tooltip>
)
