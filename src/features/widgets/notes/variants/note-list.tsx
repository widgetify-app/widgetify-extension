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
	WidgetBackButton,
	WidgetHeader,
	WidgetHeaderButton,
} from '@/features/widgets/components/widget-header'
import { useNotes } from '@/features/widgets/notes/notes.context'
import { useWidgetMenuActions } from '@/features/widgets/widget-menu.context'
import { Icon } from '@/icons'
import { NoteEditor } from '../components/note-editor'
import { NoteEmpty } from '../components/note-empty'
import { NoteItem } from '../components/note-item'
import { NoteSkeleton } from '../components/note-skeleton'

const SKELETON_COUNT = 4

interface NoteListProps {
	tabs?: ReactNode
}

export function NoteList({ tabs }: NoteListProps) {
	const { isAuthenticated } = useAuth()
	const { blurMode } = useGeneralSetting()
	const {
		notes,
		activeNoteId,
		setActiveNoteId,
		addNote,
		deleteNote,
		isCreatingNote,
		isSaving,
		isLoading,
		isError,
		refetch,
	} = useNotes()
	const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

	const activeNote = notes.find((note) => note.id === activeNoteId)
	const blurClass = blurMode ? 'blur-mode' : 'disabled-blur-mode'

	const onAdd = () => {
		if (!isAuthenticated) {
			callEvent('open_require_auth_modal')
			Analytics.event('note_open_required_auth_modal')
			return
		}
		addNote()
	}

	const onRefresh = () => {
		refetch()
		Analytics.event('note_refetch')
	}

	const onSelect = (noteId: string) => {
		setActiveNoteId(noteId)
		Analytics.event('note_selected')
	}

	useWidgetMenuActions(
		<PopoverMenuItem
			icon={<Icon name="refresh" size={14} />}
			label={t('widgets.notes.refresh')}
			onClick={onRefresh}
		/>
	)

	const header = activeNote ? (
		<WidgetHeader
			leading={
				<WidgetBackButton
					label={t('widgets.notes.backToList')}
					onClick={() => setActiveNoteId(null)}
				/>
			}
			title={t('widgets.notes.editTitle')}
			badge={
				isSaving && (
					<span className="font-medium text-3xs text-fg-faint">
						{t('widgets.notes.saving')}
					</span>
				)
			}
			actions={
				<WidgetHeaderButton
					label={t('widgets.notes.deleteThis')}
					icon="trash"
					onClick={() => setNoteToDelete(activeNote.id)}
				/>
			}
		/>
	) : (
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
	)

	const body =
		isLoading && !notes.length ? (
			<div className="flex flex-col gap-0.5">
				{Array.from({ length: SKELETON_COUNT }, (_, i) => (
					<NoteSkeleton key={`note-skeleton-${i}`} />
				))}
			</div>
		) : isError && !notes.length ? (
			<WidgetError message={t('widgets.notes.loadError')} onRetry={refetch} />
		) : activeNote ? (
			<div
				key={activeNoteId}
				className={cn('flex flex-col flex-1 min-h-0', blurClass)}
			>
				<NoteEditor note={activeNote} />
			</div>
		) : !notes.length ? (
			<NoteEmpty onAdd={onAdd} />
		) : (
			<ul
				aria-label={t('widgets.notes.listAria')}
				className={cn(
					'flex flex-col flex-1 min-h-0 gap-0.5 overflow-y-auto scrollbar-none',
					blurClass
				)}
			>
				{notes.map((note) => (
					<li key={note.id}>
						<NoteItem
							note={note}
							onSelect={onSelect}
							onEdit={onSelect}
							onDelete={setNoteToDelete}
						/>
					</li>
				))}
			</ul>
		)

	return (
		<>
			{header}
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
