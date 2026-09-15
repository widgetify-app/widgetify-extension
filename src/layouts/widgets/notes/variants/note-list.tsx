import Analytics from '@/analytics'
import { cn } from '@/common/utils/cn'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useNotes } from '@/context/notes.context'
import { NoteEditor } from '../components/note-editor'
import { NoteEmpty } from '../components/note-empty'
import { NoteError } from '../components/note-error'
import { NoteItem } from '../components/note-item'
import { NoteNavigation } from '../components/note-navigation'
import { NoteSkeleton } from '../components/note-skeleton'

const SKELETON_COUNT = 4

function NotesContent() {
	const { notes, activeNoteId, setActiveNoteId, isLoading, isError, refetch } =
		useNotes()
	const { blurMode } = useGeneralSetting()

	const activeNote = notes.find((note) => note.id === activeNoteId)

	if (isLoading && !notes.length) {
		return (
			<div className="flex flex-col gap-1">
				{Array.from({ length: SKELETON_COUNT }, (_, i) => (
					<NoteSkeleton key={`note-skeleton-${i}`} />
				))}
			</div>
		)
	}

	if (isError && !notes.length) {
		return <NoteError onRetry={refetch} />
	}

	if (!activeNote && !notes.length) {
		return <NoteEmpty />
	}

	const blurClass = blurMode ? 'blur-mode' : 'disabled-blur-mode'

	if (!activeNote) {
		const handleNoteClick = (noteId: string) => {
			setActiveNoteId(noteId)
			Analytics.event('note_selected')
		}

		return (
			<ul
				aria-label="یادداشت‌ها"
				className={cn(
					'flex flex-col w-full h-full pb-1 overflow-y-auto gap-0.5 scrollbar-none',
					blurClass
				)}
			>
				{notes.map((note) => (
					<li key={note.id}>
						<NoteItem note={note} onSelect={handleNoteClick} />
					</li>
				))}
			</ul>
		)
	}

	return (
		<div className={cn('h-full overflow-auto grow', blurClass)}>
			<div key={activeNoteId} className="h-full">
				<NoteEditor note={activeNote} />
			</div>
		</div>
	)
}

export function NoteList() {
	return (
		<section className="flex flex-col h-full overflow-hidden" aria-label="یادداشت‌ها">
			<NoteNavigation />

			<div className="mt-0.5 grow overflow-hidden">
				<NotesContent />
			</div>
		</section>
	)
}
