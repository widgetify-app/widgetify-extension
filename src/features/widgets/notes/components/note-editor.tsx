import { t } from '@/common/i18n'
import { Button, Spinner } from '@/components/ui'
import { useNotes } from '@/features/widgets/notes/notes.context'
import type { FetchedNote } from '@/services/note/note.interface'
import { useEffect, useRef, useState } from 'react'
import { NoteColorPicker } from './note-color-picker'
import { NoteFields } from './note-fields'

interface NoteEditorProps {
	note: FetchedNote
}

export function NoteEditor({ note }: NoteEditorProps) {
	const { updateNote, isSaving } = useNotes()

	const titleRef = useRef<HTMLInputElement>(null)
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

	return (
		<div className="flex flex-col flex-1 min-h-0 gap-2">
			<NoteFields
				title={currentTitle}
				body={currentBody}
				onTitleChange={setCurrentTitle}
				onBodyChange={setCurrentBody}
				titleRef={titleRef}
			/>

			<footer className="flex items-center flex-none gap-2 px-2">
				<NoteColorPicker value={priority} onChange={setPriority} />
				<span className="flex-1" />
				<Button
					size="xs"
					onClick={onSave}
					loading={isSaving}
					disabled={isSaving}
					loadingText={<Spinner size="sm" tone="current" />}
					color="brand"
					rounded="lg"
					className="px-3 h-7"
				>
					{t('widgets.notes.save')}
				</Button>
			</footer>
		</div>
	)
}
