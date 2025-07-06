import type { Note } from '@/context/notes.context'
import { useEffect, useRef, useState } from 'react'

interface NoteEditorProps {
	note: Note
	onUpdateNote: (id: string, updates: Partial<Note>) => void
}

const EDITOR_DEBOUNCE_TIME = 500 //0.5s

export function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
	const titleRef = useRef<HTMLInputElement>(null)
	const bodyRef = useRef<HTMLTextAreaElement>(null)

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
				title: note.title,
				body: note.body,
			})
		}, EDITOR_DEBOUNCE_TIME)
	}

	return (
		<div className="h-full flex flex-col gap-y-2">
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
		</div>
	)
}
