import type React from 'react'
import { useState } from 'react'
import { FiChevronDown, FiTrash2, FiEdit3 } from 'react-icons/fi'
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

interface Prop {
	todo: Todo
	blurMode?: boolean
	isDragging?: boolean
	dragHandle?: any
}

const translatedPriority = {
	low: 'کم',
	medium: 'متوسط',
	high: 'زیاد',
}

export function TodoItem({
	todo,
	blurMode = false,
	isDragging = false,
	dragHandle,
}: Prop) {
	const { toggleTodo, refetchTodos, todos, setTodos } = useTodoStore()
	const { isAuthenticated } = useAuth()
	const [expanded, setExpanded] = useState(true)
	const [showConfirmation, setShowConfirmation] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
	const isUpdating = useIsMutating({ mutationKey: ['updateTodo'] }) > 0
	const { mutateAsync, isPending } = useRemoveTodo(todo.onlineId || todo.id)

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (isPending) return
		if (!isAuthenticated) return showToast('برای حذف وظیفه باید وارد شوید', 'error')

		setShowConfirmation(true)
	}

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (!isAuthenticated)
			return showToast('برای ویرایش وظیفه باید وارد شوید', 'error')
		setShowEditModal(true)
	}

	const handleExpand = (e: React.MouseEvent) => {
		e.stopPropagation()
		setExpanded(!expanded)
	}

	const onConfirmDelete = async () => {
		if (isPending) return

		const onlineId = todo.onlineId || todo.id
		if (validate(onlineId)) {
			return showToast(
				'این وظیفه هنوز همگام‌سازی نشده است و نمی‌توان آن را حذف کرد.',
				'error'
			)
		}

		const [err, _] = await safeAwait(mutateAsync())
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

	const getBorderStyle = () => {
		switch (todo.priority) {
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

	const getCheckedCheckboxStyle = () => {
		switch (todo.priority) {
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

	const getUnCheckedCheckboxStyle = () => {
		switch (todo.priority) {
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

	const getPriorityColor = () => {
		switch (todo.priority) {
			case 'high':
				return 'bg-error/10 text-error'
			case 'medium':
				return 'bg-warning/10 text-warning'
			case 'low':
				return 'bg-success/10 text-success'
			default:
				return 'bg-primary text-primary-content'
		}
	}

	const onToggleClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (isUpdating) return

		if (!isAuthenticated) {
			return showToast('برای تغییر وضعیت وظیفه باید وارد شوید', 'error')
		}

		toggleTodo(todo.id)
	}

	return (
		<div
			className={`px-1 py-[1px] bg-base-300/90 hover:bg-base-300 border border-base-300/60 active:scale-98  group overflow-hidden rounded-lg transition delay-150 duration-300 ease-in-out ${blurMode ? 'blur-item' : ''} ${isDragging ? 'opacity-50' : ''}`}
		>
			<div className={'flex items-center gap-2 pr-0.5 py-1'}>
				<div className="flex flex-row items-center gap-1">
					<div
						{...dragHandle}
						className="flex-shrink-0 cursor-grab active:cursor-grabbing p-0.5 rounded opacity-100 transition-opacity duration-200"
						onClick={(e) => e.stopPropagation()}
					>
						<MdDragIndicator size={12} className="text-muted" />
					</div>

					<div className="flex-shrink-0">
						<CustomCheckbox
							checked={todo.completed}
							disabled={isUpdating}
							className={`!w-[1.125rem] !h-[1.125rem] !border ${getBorderStyle()}`}
							unCheckedCheckBoxClassName={getUnCheckedCheckboxStyle()}
							checkedCheckBoxClassName={getCheckedCheckboxStyle()}
							onClick={(e) => onToggleClick(e)}
						/>
					</div>
				</div>

				<div
					className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap  text-xs ${todo.completed ? 'line-through text-content opacity-60' : 'text-content'}`}
				>
					{todo.text}
				</div>

				{/* Actions */}
				<div className="flex items-center gap-x-1">
					<button
						onClick={handleEdit}
						className={
							'p-1 rounded-full cursor-pointer hover:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200 delay-100 group-hover:select-none'
						}
					>
						<FiEdit3 size={13} />
					</button>
					<button
						onClick={handleDelete}
						className={
							'p-1 rounded-full cursor-pointer hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200 delay-100 group-hover:select-none'
						}
					>
						<FiTrash2 size={13} />
					</button>

					<button
						onClick={handleExpand}
						className={
							'p-1 rounded-full cursor-pointer hover:bg-gray-500/10 text-gray-400'
						}
					>
						<FiChevronDown
							size={14}
							className={`${expanded ? 'rotate-0' : 'rotate-180'} transition-transform duration-300`}
						/>
					</button>
				</div>
			</div>

			{expanded && (
				<div className={'px-2 pb-1.5 text-[10px] text-content transition-all'}>
					<p className="mt-0.5 mb-1 break-words">{todo.text}</p>

					<div className="flex items-center gap-1.5 mt-0.5 mb-1">
						{todo.category && (
							<span
								className={`text-[10px] px-1 py-0.25 rounded-full ${getPriorityColor()}`}
							>
								{todo.category}
							</span>
						)}
						<span
							className={`text-[10px] px-1 py-0.25 rounded-full ${getPriorityColor()}`}
						>
							{translatedPriority[todo.priority as TodoPriority]}
						</span>
						<span className="flex-1 text-[10px] text-base-content/50">
							{parseTodoDate(todo.date)
								.locale('fa')
								.format('ddd، jD jMMMM')}
						</span>
					</div>

					{/* Notes */}
					{todo.notes && <NoteLinkRenderer note={todo.notes} />}
				</div>
			)}
			{showConfirmation && (
				<ConfirmationModal
					isOpen={showConfirmation}
					onClose={() => (isPending ? null : setShowConfirmation(false))}
					onConfirm={() => onConfirmDelete()}
					confirmText={isPending ? <IconLoading /> : 'حذف'}
					message="آیا از حذف این وظیفه مطمئن هستید؟"
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
interface NoteIsLinkProps {
	note: string
}
function NoteLinkRenderer({ note }: NoteIsLinkProps): React.JSX.Element | null {
	const urlRegex = /(https?:\/\/[^\s]+)/gi
	const urls = note.match(urlRegex)
	if (urls) {
		return (
			<a
				href={urls[0]}
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-500 underline break-all"
			>
				{urls[0]}
			</a>
		)
	}

	return <p className="mt-0.5 font-light">{note}</p>
}
