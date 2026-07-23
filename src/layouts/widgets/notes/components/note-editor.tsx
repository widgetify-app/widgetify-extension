import { PRIORITY_BG_COLORS, PRIORITY_OPTIONS } from '@/common/constant/priority_options'
import { Button } from '@/components/button/button'
import { IconLoading } from '@/components/loading/icon-loading'
import { TextInput } from '@/components/text-input'
import Tooltip from '@/components/toolTip'
import { useNotes } from '@/context/notes.context'
import type { FetchedNote } from '@/services/hooks/note/note.interface'
import { Icon } from '@/src/icons'
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

	const handleInputChange = (field: 'title' | 'body', value: string) => {
		if (field === 'title') {
			setCurrentTitle(value)
			note.title = value
		} else {
			setCurrentBody(value)
			note.body = value
		}
	}

	const onSave = () => {
		updateNote(note.id, {
			priority: priority,
			body: note.body,
			title: note.title,
		})
	}

	const onPriority = (value: string) => {
		setPriority(value as any)
	}

	const bgColor = priority ? PRIORITY_BG_COLORS[priority] : ' bg-base-300/70'
	return (
		<div className="flex flex-col h-full overflow-hidden">
			<TextInput
				ref={titleRef}
				type="text"
				className={`w-full h-12 font-bold! border-0 rounded-b-none! ${bgColor}`}
				placeholder="عنوان یادداشت..."
				value={currentTitle}
				onChange={(val) => handleInputChange('title', val)}
			/>

			<textarea
				ref={bodyRef}
				className={`w-full h-full px-2 pt-1 pb-4 text-sm grow resize-none text-shadow-2xs rounded-b-2xl  outline-none font-light ${bgColor}`}
				placeholder="متن یادداشت..."
				value={currentBody}
				onChange={(e) => handleInputChange('body', e.target.value)}
				rows={3}
				dir="rtl"
			/>

			<div className="flex flex-row items-center justify-between mt-1 w-full py-0.5 px-1 rounded-xl">
				<div className="flex items-center gap-1">
					{PRIORITY_OPTIONS.map((p) => (
						<PriorityButton
							key={p.ariaLabel}
							isSelected={priority === p.value}
							onClick={() => onPriority(p.value)}
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
						isPrimary={true}
						className="w-24 h-6 rounded-2xl"
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
			className={`
				flex items-center justify-center w-4 h-4 rounded-full
				transition-all duration-150 cursor-pointer 
				${option.bgColor} ${option.hoverBgColor}
				${isSelected ? 'ring-2 ring-offset-0 ring-primary' : ''}
			`}
		>
			{isSelected && <Icon name="check" size={8} className="text-white" />}
		</button>
	</Tooltip>
)
