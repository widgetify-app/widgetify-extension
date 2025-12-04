import { PRIORITY_OPTIONS } from '@/common/constant/priority_options'
import Tooltip from '@/components/toolTip'
import type { FetchedNote } from '@/services/hooks/note/note.interface'
import { useEffect, useRef, useState } from 'react'
import { FiFlag } from 'react-icons/fi'

interface NoteEditorProps {
	note: FetchedNote
	onUpdateNote: (id: string, updates: Partial<FetchedNote>) => void
}

const EDITOR_DEBOUNCE_TIME = 500 //0.5s

export function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
	const titleRef = useRef<HTMLInputElement>(null)
	const bodyRef = useRef<HTMLTextAreaElement>(null)
	const [priority, setPriority] = useState(note.priority)

	const [currentTitle, setCurrentTitle] = useState(note.title)
	const [currentBody, setCurrentBody] = useState(note.body)

	const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		setCurrentTitle(note.title)
		setCurrentBody(note.body)
		if (titleRef.current && !note.title && note.body === '') {
			titleRef.current.focus()
		}
	}, [note.id, note.title, note.body])

	// auto resize
	useEffect(() => {
		const titleElement = titleRef.current
		const bodyElement = bodyRef.current

		if (titleElement) {
			titleElement.style.height = 'auto'
			titleElement.style.height = `${titleElement.scrollHeight}px`
		}

		if (bodyElement) {
			bodyElement.style.height = 'auto'
			bodyElement.style.height = `${bodyElement.scrollHeight}px`
		}
	}, [currentTitle, currentBody, note.id])

	const handleInputChange = (
		field: 'title' | 'body',
		value: string,
		targetElement: HTMLTextAreaElement | HTMLInputElement
	) => {
		if (field === 'title') {
			setCurrentTitle(value)
			note.title = value
		} else {
			setCurrentBody(value)
			note.body = value
		}

		targetElement.style.height = 'auto'
		targetElement.style.height = `${targetElement.scrollHeight}px`

		if (updateTimeoutRef.current) {
			clearTimeout(updateTimeoutRef.current)
		}

		updateTimeoutRef.current = setTimeout(() => {
			onUpdateNote(note.id, {
				...note,
				title: note.title,
				body: note.body,
			})
		}, EDITOR_DEBOUNCE_TIME)
	}

	const onPriority = (value: string) => {
		setPriority(value as any)
		onUpdateNote(note.id, {
			priority: value as any,
			body: note.body,
			title: note.title,
		})
	}

	return (
		<div className="flex flex-col h-full gap-y-2">
			<input
				ref={titleRef}
				type="text"
				className={
					'w-full py-3 px-2 text-xs font-medium text-content rounded-xl bg-base-300/70 outline-none'
				}
				placeholder="عنوان یادداشت..."
				value={currentTitle}
				onChange={(e) => handleInputChange('title', e.target.value, e.target)}
				dir="rtl"
			/>

			<textarea
				ref={bodyRef}
				className={
					'w-full px-2 pt-2 text-sm flex-grow resize-none text-content rounded-xl bg-base-300/70 outline-none'
				}
				placeholder="متن یادداشت..."
				value={currentBody}
				onChange={(e) => handleInputChange('body', e.target.value, e.target)}
				rows={3}
				dir="rtl"
			/>

			<div className="flex flex-row items-center h-6 w-fit bg-base-300/50 rounded-xl">
				<div className="flex items-center gap-1 px-1">
					{PRIORITY_OPTIONS.map((p) => (
						<PriorityButton
							key={p.ariaLabel}
							isSelected={priority === p.value}
							onClick={() => onPriority(p.value)}
							option={p}
						/>
					))}
				</div>
				<div className=""></div>
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
			{isSelected && <FiFlag size={8} className="text-white" />}
		</button>
	</Tooltip>
)
