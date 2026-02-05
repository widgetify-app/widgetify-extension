import type React from 'react'
import { useState } from 'react'
import { FiChevronDown, FiTrash2, FiEdit3, FiClock, FiTag } from 'react-icons/fi'
import { MdDragIndicator } from 'react-icons/md'
import CustomCheckbox from '@/components/checkbox'
import { useTodoStore, type TodoPriority } from '@/context/todo.context'
import { useIsMutating } from '@tanstack/react-query'
import type { Todo } from '@/services/hooks/todo/todo.interface'
import { ConfirmationModal } from '@/components/modal/confirmation-modal'
import { useAuth } from '@/context/auth.context'
import { showToast } from '@/common/toast'
import { useRemoveTodo } from '@/services/hooks/todo/remove-todo.hook'
import { safeAwait } from '@/services/api'
import { translateError } from '@/utils/translate-error'
import { validate } from 'uuid'
import Analytics from '@/analytics'
import { IconLoading } from '@/components/loading/icon-loading'
import { parseTodoDate } from './tools/parse-date'
import { EditTodoModal } from './edit-todo-modal'
import { IoCalendarOutline } from 'react-icons/io5'

interface Prop {
	todo: Todo
	blurMode?: boolean
	isDragging?: boolean
	dragHandle?: any
}

const translatedPriority = {
	low: 'کم',
	medium: 'متوسط',
	high: 'مهم',
}

export function TodoItem({
	todo,
	blurMode = false,
	isDragging = false,
	dragHandle,
}: Prop) {
	const { toggleTodo, refetchTodos, todos, setTodos } = useTodoStore()
	const { isAuthenticated } = useAuth()
	const [expanded, setExpanded] = useState(false)
	const [showConfirmation, setShowConfirmation] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
	const isUpdating = useIsMutating({ mutationKey: ['updateTodo'] }) > 0
	const { mutateAsync, isPending } = useRemoveTodo(todo.onlineId || todo.id)
	const [isSyncing, setIsSyncing] = useState(todo.id.startsWith('temp-') || false)

	const isTemp = todo.id.startsWith('temp-')

	const handleDelete = (e: React.MouseEvent) => {
		if (isTemp) return showToast('این وظیفه هنوز همگام‌سازی نشده است.', 'error')
		e.stopPropagation()
		if (isPending) return
		if (!isAuthenticated) return showToast('برای حذف باید وارد شوید', 'error')
		setShowConfirmation(true)
	}

	const handleEdit = (e: React.MouseEvent) => {
		if (isTemp) return showToast('این وظیفه هنوز همگام‌سازی نشده است.', 'error')
		e.stopPropagation()
		if (!isAuthenticated) return showToast('برای ویرایش باید وارد شوید', 'error')
		setShowEditModal(true)
	}

	const onConfirmDelete = async () => {
		if (isPending || isSyncing) return
		const onlineId = todo.onlineId || todo.id
		if (validate(onlineId)) return showToast('خطا در شناسه وظیفه', 'error')

		const [err] = await safeAwait(mutateAsync())
		setShowConfirmation(false)
		if (err) {
			showToast(translateError(err) as any, 'error')
			return
		}

		Analytics.event('todo_removed')
		const updatedTodos = todos.filter(
			(t) => t.id !== onlineId || t.onlineId !== onlineId
		)
		setTodos(updatedTodos)

		refetchTodos()
	}

	const onToggleClick = async (e: React.MouseEvent) => {
		e.stopPropagation()
		if (isUpdating || isSyncing) return

		if (!isAuthenticated) {
			return showToast('برای تغییر وضعیت وظیفه باید وارد شوید', 'error')
		}

		setIsSyncing(true)
		try {
			await toggleTodo(todo.id)
		} finally {
			setIsSyncing(false)
		}
	}

	return (
		<div
			className={`group mb-1 overflow-hidden rounded-lg border border-base-300/40 bg-base-300/30 transition-all ${
				isDragging ? 'scale-[1.02] opacity-50 shadow-lg' : ''
			} ${blurMode ? 'blur-[2px] opacity-40' : ''}`}
		>
			<div className="flex items-center gap-1.5 px-2 py-1">
				<div className="flex items-center gap-1 shrink-0">
					<div
						{...dragHandle}
						className="cursor-grab p-0.5 text-muted hover:text-base-content active:cursor-grabbing"
					>
						<MdDragIndicator size={14} />
					</div>

					<CustomCheckbox
						checked={todo.completed}
						disabled={isUpdating || isSyncing}
						className={`!h-4 !w-4 !border transition-transform active:scale-90 ${getBorderStyle(todo.priority)}`}
						unCheckedCheckBoxClassName={getUnCheckedCheckboxStyle(
							todo.priority
						)}
						checkedCheckBoxClassName={getCheckedCheckboxStyle(todo.priority)}
						onClick={onToggleClick}
					/>
				</div>

				<div
					className="flex-1 min-w-0 py-1 overflow-hidden cursor-pointer"
					onClick={() => setExpanded(!expanded)}
				>
					<p
						className={`truncate text-[10px] font-medium transition-all ${
							todo.completed
								? 'text-base-content/40 line-through font-normal'
								: 'text-base-content/90'
						}`}
					>
						{todo.text}
					</p>
				</div>

				<div className="flex relative items-center gap-0.5 shrink-0">
					{isSyncing ? (
						<IconLoading className="scale-[0.6] opacity-40 mx-1" />
					) : (
						<div className="hidden transition-all duration-150 group-hover:flex">
							<div className="flex items-center">
								<button
									onClick={handleEdit}
									className="p-1 rounded-lg cursor-pointer text-blue-500/60 hover:bg-blue-500/10 hover:text-blue-500"
								>
									<FiEdit3 size={13} />
								</button>
								<button
									onClick={handleDelete}
									className="p-1 rounded-lg cursor-pointer text-error/60 hover:bg-error/10 hover:text-error"
								>
									<FiTrash2 size={13} />
								</button>
							</div>
						</div>
					)}

					<button
						onClick={() => setExpanded(!expanded)}
						className={`rounded p-0.5 text-muted/50 cursor-pointer transition-transform duration-300 ${
							expanded ? 'rotate-180' : ''
						} hover:scale-110`}
					>
						<FiChevronDown size={15} />
					</button>
				</div>
			</div>

			{expanded && (
				<div className="border-t border-base-content/5 bg-base-content/1 px-2.5 py-2">
					<p className="mb-2 text-[11px] leading-snug text-base-content/70 whitespace-pre-wrap">
						{todo.text}
					</p>

					<div className="flex items-center gap-2 text-[10px]">
						{todo.category && (
							<span className="flex text-[10px] items-center gap-1 rounded-lg border border-dashed border-base-content/20 px-1.5 text-muted">
								<FiTag size={9} />
								{todo.category}
							</span>
						)}

						{todo.priority && (
							<span
								className={`rounded-lg px-1.5 py-0.5 font-bold ${getPriorityColor(todo.priority)}`}
							>
								{translatedPriority[todo.priority as TodoPriority]}
							</span>
						)}

						<span className="flex items-center gap-1 mr-auto text-muted/60">
							<IoCalendarOutline size={12} />
							{parseTodoDate(todo.date).locale('fa').format('jD jMMMM')}
						</span>
					</div>

					{todo.notes && (
						<div className="mt-2 leading-relaxed whitespace-break-spaces rounded-xl border border-base-content/5 bg-base-100/30 p-1.5 text-[11px] font-black">
							<NoteLinkRenderer note={todo.notes} />
						</div>
					)}
				</div>
			)}

			{showConfirmation && (
				<ConfirmationModal
					isOpen={showConfirmation}
					onClose={() => setShowConfirmation(false)}
					onConfirm={onConfirmDelete}
					confirmText={isPending ? <IconLoading /> : 'حذف'}
					message="آیا از حذف مطمئن هستید؟"
					variant="danger"
				/>
			)}
			{showEditModal && (
				<EditTodoModal
					todo={todo}
					isOpen={showEditModal}
					onClose={() => setShowEditModal(false)}
				/>
			)}
		</div>
	)
}

function NoteLinkRenderer({ note }: { note: string }) {
	const urlRegex = /(https?:\/\/[^\s]+)/gi
	const urls = note.match(urlRegex)
	if (urls) {
		return (
			<a
				href={urls[0]}
				target="_blank"
				rel="noopener noreferrer"
				className="block text-blue-500 underline break-all"
			>
				{urls[0]}
			</a>
		)
	}
	return <p className="font-light opacity-70">{note}</p>
}

const getBorderStyle = (priority: string) => {
	switch (priority) {
		case 'high':
			return '!border-error'
		case 'medium':
			return '!border-warning'
		case 'low':
			return '!border-success'
		default:
			return '!border-primary'
	}
}

const getCheckedCheckboxStyle = (priority: string) => {
	switch (priority) {
		case 'high':
			return '!border-error !bg-error'
		case 'medium':
			return '!border-warning !bg-warning'
		case 'low':
			return '!border-success !bg-success'
		default:
			return '!border-primary !bg-primary'
	}
}

const getUnCheckedCheckboxStyle = (priority: string) => getBorderStyle(priority)

const getPriorityColor = (priority: string) => {
	switch (priority) {
		case 'high':
			return 'bg-error/10 text-error'
		case 'medium':
			return 'bg-warning/10 text-warning'
		case 'low':
			return 'bg-success/10 text-success'
		default:
			return 'bg-primary/10 text-primary'
	}
}
