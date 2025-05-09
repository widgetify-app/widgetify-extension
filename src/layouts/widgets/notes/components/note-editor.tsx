import type { Note } from '@/context/notes.context'
import { getTextColor, useTheme } from '@/context/theme.context'
import { useEffect, useRef } from 'react'

interface NoteEditorProps {
	note: Note
	onUpdateNote: (id: string, updates: Partial<Note>) => void
}

export function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
	const { theme } = useTheme()
	const titleRef = useRef<HTMLTextAreaElement>(null)
	const bodyRef = useRef<HTMLTextAreaElement>(null)

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
	}, [note.title, note.body])

	useEffect(() => {
		if (titleRef.current && !note.title) {
			titleRef.current.focus()
		}
	}, [note.id])

	const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onUpdateNote(note.id, { title: e.target.value })
		e.target.style.height = 'auto'
		e.target.style.height = `${e.target.scrollHeight}px`
	}

	const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onUpdateNote(note.id, { body: e.target.value })
		e.target.style.height = 'auto'
		e.target.style.height = `${e.target.scrollHeight}px`
	}

	return (
		<div className="flex flex-col h-full">
			<textarea
				ref={titleRef}
				className={`w-full p-2 text-sm font-bold text-center resize-none bg-transparent outline-none ${getTextColor(theme)} opacity-90`}
				placeholder="عنوان یادداشت..."
				value={note.title}
				onChange={handleTitleChange}
				rows={1}
				dir="rtl"
			/>

			<textarea
				ref={bodyRef}
				className={`w-full px-2 pt-2 text-base flex-grow resize-none bg-transparent outline-none ${getTextColor(theme)} opacity-80`}
				placeholder="متن یادداشت..."
				value={note.body}
				onChange={handleBodyChange}
				rows={3}
				dir="rtl"
			/>
		</div>
	)
}
