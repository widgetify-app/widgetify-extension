import { useMemo } from 'react'
import { Button, ConfirmationModal, Tooltip } from '@/components/ui'
import { useNotes } from '@/context/notes.context'
import { useAuth } from '@/context/auth.context'
import Analytics from '@/analytics'
import { IconLoading } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { Icon } from '@/src/icons'

export function NoteNavigation() {
	const { isAuthenticated } = useAuth()

	const {
		notes,
		activeNoteId,
		addNote,
		isCreatingNote,
		setActiveNoteId,
		isSaving,
		deleteNote,
		isRefetching,
		refetch,
	} = useNotes()
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const activeNoteIndex = useMemo(() => {
		return notes.findIndex((note) => note.id === activeNoteId)
	}, [notes, activeNoteId])

	const onBackToList = () => {
		setActiveNoteId(null)
	}

	const onDelete = () => {
		setShowDeleteConfirm(false)
		deleteNote(activeNoteId as string)
	}

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
		Analytics.event(`note_refetch`)
	}

	return (
		<div
			className={`flex items-center ${activeNoteId ? 'justify-end' : 'justify-between'} gap-x-1`}
		>
			{isSaving && <IconLoading title="درحال ذخیره..." />}
			{activeNoteId ? (
				<>
					<Button
						size="xs"
						onClick={() => setShowDeleteConfirm(true)}
						className="h-7 w-7 p-0 text-muted bg-transparent! hover:bg-error/20! hover:text-error! border-none disabled:opacity-75 transition-all duration-300 shadow-none"
						rounded={'full'}
					>
						<Icon name="trash" size={14} />
					</Button>
					<Tooltip content="لیست یادداشت ها" position="top">
						<button
							className={`h-7 w-7 flex items-center justify-center rounded-full cursor-pointer transition-colors text-muted opacity-70 hover:bg-base-300 hover:opacity-100 ${activeNoteIndex > 0 ? 'opacity-100' : 'opacity-30 cursor-not-allowed'} duration-300`}
							onClick={() => onBackToList()}
						>
							<Icon name="chevronLeft" size={18} className="text-content" />
						</button>
					</Tooltip>
				</>
			) : (
				<>
					<Tooltip content="یادداشت جدید">
						<Button
							variant="ghost"
							size="sm"
							onClick={onAdd}
							disabled={isCreatingNote}
							loading={isCreatingNote}
							loadingText={<IconLoading title="درحال ساخت..." />}
							className="w-7 h-7 p-0! border-none! text-muted hover:text-primary hover:bg-base-300/50 rounded-xl shrink-0 active:scale-95 transition-colors"
						>
							<Icon name="plus" size={16} />
						</Button>
					</Tooltip>
					<div className="space-x-1">
						<Tooltip content="بارگذاری مجدد">
							<Button
								variant="ghost"
								size="sm"
								className="w-7 h-7 p-0! border-none! text-muted hover:text-content hover:bg-base-300/50 rounded-xl shrink-0 active:scale-95 transition-colors"
								onClick={onRefresh}
							>
								<Icon
									name="refresh"
									size={15}
									className={`opacity-60 hover:opacity-100 ${isRefetching ? 'animate-spin' : ''}`}
								/>
							</Button>
						</Tooltip>
					</div>
				</>
			)}

			<ConfirmationModal
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={() => onDelete()}
				message="از حذف این یادداشت مطمعنی؟"
			/>
		</div>
	)
}
