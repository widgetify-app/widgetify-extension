import type React from 'react'
import { useState } from 'react'
import { FiChevronDown, FiTrash2, FiEdit3, FiTag, FiUsers } from 'react-icons/fi'
import CustomCheckbox from '@/components/checkbox'
import type { FetchedTodo, Todo } from '@/services/hooks/todo/todo.interface'
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
import { IoCalendarOutline } from 'react-icons/io5'
import { useUpdateTodo } from '@/services/hooks/todo/update-todo.hook'
import { playAlarm } from '@/common/playAlarm'
import Tooltip from '@/components/toolTip'
import { TodoFriends } from './components/friends.todo'

interface Prop {
	todo: Todo
	blurMode?: boolean
	onEdit: any
	onUpdated?: () => void
}

const translatedPriority = {
	low: 'کم',
	medium: 'متوسط',
	high: 'مهم',
}

export function TodoItem({ todo, blurMode = false, onEdit, onUpdated }: Prop) {
	const { isAuthenticated } = useAuth()
	const [currentTodo, setCurrentTodo] = useState<FetchedTodo>(todo)
	const [expanded, setExpanded] = useState(false)
	const [showConfirmation, setShowConfirmation] = useState(false)
	const { mutateAsync, isPending: isRemoving } = useRemoveTodo(todo.id)
	const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateTodo(
		currentTodo?.id
	)
	const isTemp = currentTodo.id.startsWith('temp-')
	const [isDone, setIsDone] = useState<boolean>(false)

	const isPending = isUpdating || isRemoving
	const handleDelete = (e: React.MouseEvent) => {
		if (isTemp) return showToast('این تسک هنوز همگام‌سازی نشده است.', 'error')
		e.stopPropagation()
		if (isPending) return
		if (!isAuthenticated) return showToast('برای حذف باید وارد شوید', 'error')
		setShowConfirmation(true)
	}

	const handleEdit = (e: React.MouseEvent) => {
		if (isTemp) return showToast('این تسک هنوز همگام‌سازی نشده است.', 'error')
		e.stopPropagation()
		if (!isAuthenticated) return showToast('برای ویرایش باید وارد شوید', 'error')
		onEdit(todo)
	}

	const onConfirmDelete = async () => {
		if (isPending) return
		const onlineId = currentTodo.id
		if (validate(onlineId)) return showToast('خطا در شناسه تسک', 'error')

		const [err] = await safeAwait(mutateAsync())
		setShowConfirmation(false)
		if (err) {
			showToast(translateError(err) as any, 'error')
			return
		}
		onUpdated?.()
		Analytics.event('todo_removed')
	}

	const handleToggleComplete = async () => {
		try {
			if (isPending) return
			setIsDone(!isDone)

			const isCompleted = !isDone
			const updatedTodo = await updateMutation({
				id: currentTodo.id,
				input: { completed: isCompleted },
			})

			if (isCompleted) playAlarm('success')

			setCurrentTodo(updatedTodo)
		} catch (error) {
			showToast(translateError(error) as string, 'error')
		} finally {
			Analytics.event('todo_toggle_complete')
		}
	}

	useEffect(() => {
		setCurrentTodo(todo)
	}, [todo])

	useEffect(() => {
		if (currentTodo.owner?.isSelf) {
			setIsDone(currentTodo.completed)
		} else {
			const shareItem = currentTodo.friends.find((f) => f.isSelf)
			if (shareItem) {
				setIsDone(shareItem.completed)
			}
		}
	}, [currentTodo])

	const isOwner = currentTodo?.owner?.isSelf
	const hasFriends = currentTodo?.friends && currentTodo?.friends?.length > 0
	return (
		<div
			className={`group mb-1 overflow-hidden rounded-lg border border-base-300/40 bg-base-300/30 transition-all  ${blurMode ? 'blur-[2px] opacity-40' : ''}`}
		>
			<div className="flex items-center gap-1.5 px-2 py-1">
				<div className="flex items-center gap-1 shrink-0">
					<CustomCheckbox
						checked={isDone}
						disabled={isUpdating}
						className={`h-4! w-4! border! transition-transform active:scale-90 ${getBorderStyle(currentTodo.priority)}`}
						unCheckedCheckBoxClassName={getUnCheckedCheckboxStyle(
							currentTodo.priority
						)}
						checkedCheckBoxClassName={getCheckedCheckboxStyle(
							currentTodo.priority
						)}
						onClick={handleToggleComplete}
					/>
				</div>

				<div
					className="flex-1 min-w-0 py-1 overflow-hidden cursor-pointer"
					onClick={() => setExpanded(!expanded)}
				>
					<p
						className={`truncate text-[10px] text-shadow-2xs font-medium transition-all ${
							isDone
								? 'text-base-content/40 line-through font-normal'
								: 'text-base-content/90'
						}`}
					>
						{currentTodo.text}
					</p>
				</div>

				<div className="flex relative items-center gap-0.5 shrink-0">
					{isPending && <IconLoading />}
					{hasFriends && (
						<Tooltip content="مشترک">
							<FiUsers size={12} className="text-muted" />
						</Tooltip>
					)}
					<div className="hidden transition-all duration-150 group-hover:flex">
						<div className="flex items-center">
							{isOwner && (
								<button
									onClick={handleEdit}
									className="p-1 rounded-lg cursor-pointer text-blue-500/60 hover:bg-blue-500/10 hover:text-blue-500"
								>
									<FiEdit3 size={13} />
								</button>
							)}
							<button
								onClick={handleDelete}
								className="p-1 rounded-lg cursor-pointer text-error/60 hover:bg-error/10 hover:text-error"
							>
								<FiTrash2 size={13} />
							</button>
						</div>
					</div>

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
					<p className="mb-0 text-[11px] leading-snug text-base-content/70 whitespace-pre-wrap">
						{currentTodo.text}
					</p>
					{hasFriends && (
						<div className="flex items-center w-full">
							<TodoFriends
								currentTodoCompleted={currentTodo.completed}
								friends={currentTodo.friends}
								owner={currentTodo.owner}
							/>
						</div>
					)}
					<div className="flex items-center gap-2 text-[10px]">
						{currentTodo.category && (
							<span className="flex text-[10px] items-center gap-1 rounded-lg border border-dashed border-base-content/20 px-1.5 text-muted">
								<FiTag size={9} />
								{currentTodo.category}
							</span>
						)}

						{currentTodo.priority && (
							<span
								className={`rounded-lg px-1.5 py-0.5 font-bold ${getPriorityColor(currentTodo.priority)}`}
							>
								{translatedPriority[currentTodo.priority]}
							</span>
						)}

						<span className="flex items-center gap-1 mr-auto text-muted/60">
							<IoCalendarOutline size={12} />
							{parseTodoDate(currentTodo.date)
								.locale('fa')
								.format('jD jMMMM')}
						</span>
					</div>

					{currentTodo.description && (
						<div className="mt-2 leading-relaxed whitespace-break-spaces rounded-xl border border-base-content/5 bg-base-100/30 p-1.5 text-[11px] font-black">
							<NoteLinkRenderer note={currentTodo.description} />
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
