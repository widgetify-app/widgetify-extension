import { useState } from 'react'
import { Button, ConfirmationModal, Tooltip } from '@/components/ui'
import { useNotes } from '@/context/notes.context'
import { useAuth } from '@/context/auth.context'
import Analytics from '@/analytics'
import { IconLoading } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'

export function NoteNavigation() {
	const { isAuthenticated } = useAuth()

	const {
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
		<nav
			aria-label="یادداشت‌ها"
			className={cn(
				'flex flex-none items-center gap-x-1',
				activeNoteId ? 'justify-end' : 'justify-between'
			)}
		>
			{isSaving && <IconLoading title="درحال ذخیره..." />}
			{activeNoteId ? (
				<>
					<Button
						size="xs"
						onClick={() => setShowDeleteConfirm(true)}
						aria-label="حذف یادداشت"
						className="h-7 w-7 p-0 disabled:opacity-75 transition-ui shadow-none"
						variant="ghost"
						color="danger"
						rounded={'full'}
					>
						<Icon name="trash" size={14} aria-hidden="true" />
					</Button>
					<Tooltip content="لیست یادداشت ها" position="top">
						<button
							type="button"
							onClick={onBackToList}
							aria-label="بازگشت به لیست یادداشت‌ها"
							className="flex items-center justify-center transition-colors duration-300 rounded-full cursor-pointer h-7 w-7 text-muted opacity-70 hover:bg-hovered hover:opacity-100 focus-visible:focus-ring"
						>
							<Icon
								name="chevronLeft"
								size={18}
								aria-hidden="true"
								className="text-content"
							/>
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
							aria-label="یادداشت جدید"
							disabled={isCreatingNote}
							loading={isCreatingNote}
							loadingText={<IconLoading title="درحال ساخت..." />}
							className="w-7 h-7 p-0! border-none! hover:text-primary rounded-xl shrink-0 active:scale-95 transition-colors"
						>
							<Icon name="plus" size={16} aria-hidden="true" />
						</Button>
					</Tooltip>
					<Tooltip content="بارگذاری مجدد">
						<Button
							variant="ghost"
							size="sm"
							aria-label="بارگذاری مجدد"
							className="w-7 h-7 p-0! border-none! rounded-xl shrink-0 active:scale-95 transition-colors"
							onClick={onRefresh}
						>
							<Icon
								name="refresh"
								size={15}
								aria-hidden="true"
								className={cn(
									'opacity-60 hover:opacity-100',
									isRefetching && 'animate-spin'
								)}
							/>
						</Button>
					</Tooltip>
				</>
			)}

			<ConfirmationModal
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={() => onDelete()}
				message="از حذف این یادداشت مطمعنی؟"
			/>
		</nav>
	)
}
