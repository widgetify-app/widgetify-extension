import { useMemo } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { FiChevronLeft, FiLoader, FiTrash2 } from 'react-icons/fi'
import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import { useNotes } from '@/context/notes.context'
import { useAuth } from '@/context/auth.context'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import Analytics from '@/analytics'

export function NoteNavigation() {
	const { isAuthenticated } = useAuth()
	const [isOpen, setIsOpen] = useState(false)
	const {
		notes,
		activeNoteId,
		addNote,
		isCreatingNote,
		setActiveNoteId,
		isSaving,
		deleteNote,
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
			setIsOpen(true)
			Analytics.event('note_open_required_auth_modal')
			return
		}
		addNote()
	}

	return (
		<div className="flex items-center justify-between gap-x-1">
			<div className="flex items-center">
				{isSaving && (
					<FiLoader
						className={'mx-2 block w-4 h-4 animate-spin text-content'}
					/>
				)}
				{activeNoteId ? (
					<>
						<Tooltip
							alwaysShow={showDeleteConfirm}
							content={
								showDeleteConfirm ? (
									<ToolTipConfirmContent
										onConfirm={onDelete}
										onCancel={() => setShowDeleteConfirm(false)}
									/>
								) : (
									'حذف یادداشت'
								)
							}
							position="bottom"
						>
							<Button
								size="xs"
								onClick={() => setShowDeleteConfirm(true)}
								className="h-7 w-7 p-0 text-muted !bg-transparent hover:!bg-error/20 hover:!text-error border-none rounded-full disabled:opacity-75 transition-all duration-300 shadow-none"
							>
								<FiTrash2 size={14} />
							</Button>
						</Tooltip>
						<Tooltip content="لیست یادداشت ها" position="top">
							<button
								className={`h-7 w-7 flex items-center justify-center rounded-full cursor-pointer transition-colors text-muted opacity-70 hover:bg-base-300 hover:opacity-100 ${activeNoteIndex > 0 ? 'opacity-100' : 'opacity-30 cursor-not-allowed'} duration-300`}
								onClick={() => onBackToList()}
							>
								<FiChevronLeft size={18} className="text-content" />
							</button>
						</Tooltip>
					</>
				) : (
					<Tooltip content="یادداشت جدید" position="top" offset={5}>
						<Button
							onClick={onAdd}
							size="xs"
							disabled={isCreatingNote}
							className={`h-6 w-6 text-xs !p-0 font-medium rounded-[0.55rem] transition-colors border-none shadow-none bg-primary text-white`}
						>
							{isCreatingNote ? (
								<FiLoader className="block w-4 h-4 mx-2 animate-spin text-content" />
							) : (
								<FaPlus size={12} />
							)}
						</Button>
					</Tooltip>
				)}
			</div>

			<AuthRequiredModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</div>
	)
}
interface Props {
	onConfirm: () => void
	onCancel: () => void
}
function ToolTipConfirmContent({ onConfirm, onCancel }: Props) {
	return (
		<div className="flex flex-col gap-1 p-3 w-52">
			<p className="mb-2 text-sm font-medium text-muted">
				آیا از حذف این یادداشت مطمئن هستید؟
			</p>
			<div className="flex justify-between gap-2">
				<Button onClick={onCancel} size="xs" className="btn rounded-2xl">
					انصراف
				</Button>
				<Button
					onClick={onConfirm}
					size="xs"
					className="text-white btn btn-error rounded-2xl"
				>
					حذف یادداشت
				</Button>
			</div>
		</div>
	)
}
