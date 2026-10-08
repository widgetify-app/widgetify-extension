import { type ReactNode, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { ConfirmationModal, PopoverMenuItem } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { WidgetError } from '@/features/widgets/components/widget-error'
import {
	WidgetHeader,
	WidgetHeaderButton,
} from '@/features/widgets/components/widget-header'
import { useNotes } from '@/features/widgets/notes/notes.context'
import { useWidgetMenuActions } from '@/features/widgets/widget-menu.context'
import { Icon } from '@/icons'
import { NoteBoardEditor } from '../components/note-board-editor'
import { NoteEmpty } from '../components/note-empty'
import { NoteItem } from '../components/note-item'
import { NoteSkeleton } from '../components/note-skeleton'

const SKELETON_COUNT = 4

interface NoteBoardProps {
	tabs?: ReactNode
}

export function NoteBoard({ tabs }: NoteBoardProps) {
	const { isAuthenticated } = useAuth()
	const { blurMode } = useGeneralSetting()
	const {
		notes,
		activeNoteId,
		setActiveNoteId,
		addNote,
		deleteNote,
		isCreatingNote,
		isLoading,
		isError,
		refetch,
	} = useNotes()
	const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
	const [createdNoteId, setCreatedNoteId] = useState<string | null>(null)

	const selectedNote = notes.find((note) => note.id === activeNoteId) ?? notes[0]
	const blurClass = blurMode ? 'blur-mode' : 'disabled-blur-mode'

	const onAdd = async () => {
		if (!isAuthenticated) {
			callEvent('open_require_auth_modal')
			Analytics.event('note_open_required_auth_modal')
			return
		}
		const created = await addNote()
		if (created) setCreatedNoteId(created.id)
	}

	const onSelect = (noteId: string) => {
		setActiveNoteId(noteId)
		Analytics.event('note_selected')
	}

	useWidgetMenuActions(
		<PopoverMenuItem
			icon={<Icon name="refresh" size={14} />}
			label={t('widgets.notes.refresh')}
			onClick={() => {
				refetch()
				Analytics.event('note_refetch')
			}}
		/>
	)

	const body =
		isLoading && !notes.length ? (
			<NoteBoardSkeleton />
		) : isError && !notes.length ? (
			<WidgetError message={t('widgets.notes.loadError')} onRetry={refetch} />
		) : !selectedNote ? (
			<NoteEmpty onAdd={onAdd} />
		) : (
			<div className="flex flex-1 min-h-0 gap-3">
				<ul
					aria-label={t('widgets.notes.listAria')}
					className={cn(
						'flex flex-col gap-0.5 w-52 shrink-0 overflow-y-auto scrollbar-none',
						blurClass
					)}
				>
					{notes.map((note) => (
						<li key={note.id}>
							<NoteItem
								note={note}
								isSelected={note.id === selectedNote.id}
								onSelect={onSelect}
								onDelete={setNoteToDelete}
							/>
						</li>
					))}
				</ul>

				<NoteBoardEditor
					key={selectedNote.id}
					note={selectedNote}
					isNew={selectedNote.id === createdNoteId}
					onDelete={() => setNoteToDelete(selectedNote.id)}
					className={blurClass}
				/>
			</div>
		)

	return (
		<>
			<WidgetHeader
				title={tabs ?? t('widgets.notes.title')}
				info={
					notes.length > 0
						? t('widgets.notes.count', { count: notes.length })
						: undefined
				}
				actions={
					<WidgetHeaderButton
						label={t('widgets.notes.new')}
						icon="plus"
						onClick={onAdd}
						disabled={isCreatingNote}
					/>
				}
			/>
			{body}
			<ConfirmationModal
				isOpen={noteToDelete !== null}
				onClose={() => setNoteToDelete(null)}
				onConfirm={() => {
					if (noteToDelete) deleteNote(noteToDelete)
					setNoteToDelete(null)
				}}
				title={t('widgets.notes.deleteConfirmTitle')}
				message={t('widgets.notes.deleteConfirmMessage')}
				confirmText={t('widgets.notes.deleteConfirm')}
				cancelText={t('widgets.notes.deleteCancel')}
			/>
		</>
	)
}

function NoteBoardSkeleton() {
	return (
		<div aria-hidden="true" className="flex flex-1 min-h-0 gap-3">
			<div className="flex flex-col gap-0.5 w-52 shrink-0">
				{Array.from({ length: SKELETON_COUNT }, (_, i) => (
					<NoteSkeleton key={`note-board-skeleton-${i}`} />
				))}
			</div>
			<div className="flex flex-col flex-1 gap-2.5 pt-1.5 border-s border-line ps-3.5">
				<div className="w-1/3 h-3.5 rounded-sm skeleton" />
				<div className="w-full h-2.5 rounded-sm skeleton" />
				<div className="w-5/6 h-2.5 rounded-sm skeleton" />
				<div className="w-2/3 h-2.5 rounded-sm skeleton" />
			</div>
		</div>
	)
}
