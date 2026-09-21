import type React from 'react'
import { useEffect, useState } from 'react'
import { cn } from '@/common/utils/cn'
import { Checkbox } from '@/components/ui'
import type { FetchedTodo, Todo } from '@/services/hooks/todo/todo.interface'
import { ConfirmationModal } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { showToast } from '@/common/toast'
import { useRemoveTodo } from '@/services/hooks/todo/remove-todo.hook'
import { safeAwait } from '@/services/api'
import { translateError } from '@/common/utils/translate-error'
import Analytics from '@/analytics'
import { IconLoading } from '@/components/ui'
import { parseTodoDate } from '../utils/parse-date'
import { useUpdateTodo } from '@/services/hooks/todo/update-todo.hook'
import { playAlarm } from '@/common/play-alarm'
import { Tooltip } from '@/components/ui'
import { TodoFriends } from './friends'
import { Icon } from '@/icons'
import {
	PRIORITY_BADGE_CLASS,
	PRIORITY_BORDER_CLASS,
	PRIORITY_CHECKED_CLASS,
	PRIORITY_LABELS,
	priorityClass,
} from '../constants'

interface Prop {
	todo: Todo
	blurMode?: boolean
	comfortable?: boolean
	onEdit: (todo: Todo) => void
	onUpdated?: () => void
}

export function TodoItem({
	todo,
	blurMode = false,
	comfortable = false,
	onEdit,
	onUpdated,
}: Prop) {
	const { isAuthenticated } = useAuth()
	const [currentTodo, setCurrentTodo] = useState<FetchedTodo>(todo)
	const [expanded, setExpanded] = useState(false)
	const [showConfirmation, setShowConfirmation] = useState(false)
	const { mutateAsync, isPending: isRemoving } = useRemoveTodo(todo.id)
	const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateTodo(
		currentTodo?.id
	)
	const isTemp = currentTodo.id.startsWith('temp-')
	const [isDone, setIsDone] = useState<boolean>(() => resolveIsDone(todo))

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

		const [err] = await safeAwait(mutateAsync())
		setShowConfirmation(false)
		if (err) {
			showToast(translateError(err) as string, 'error')
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
		setIsDone(resolveIsDone(currentTodo))
	}, [currentTodo])

	const isoDate = parseTodoDate(currentTodo.date).format('YYYY-MM-DD')
	const isOwner = currentTodo?.owner?.isSelf
	const hasFriends = currentTodo?.friends && currentTodo?.friends?.length > 0
	return (
		<div
			className={`group overflow-hidden border rounded-xl bg-base-content/2 border-base-content/5 transition-ui hover:border-base-content/10 hover:bg-base-content/10 ${comfortable ? 'mb-1.5' : 'mb-1'} ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
		>
			<div
				className={`flex items-center ${comfortable ? 'gap-2.5 px-3 py-2' : 'gap-1.5 px-2 py-1'}`}
			>
				<div className="flex items-center gap-1 shrink-0">
					<Checkbox
						checked={isDone}
						disabled={isUpdating}
						className={`${comfortable ? 'h-4.5! w-4.5!' : 'h-4! w-4!'} border! transition-transform active:scale-90 ${priorityClass(PRIORITY_BORDER_CLASS, currentTodo.priority)}`}
						unCheckedCheckBoxClassName={priorityClass(
							PRIORITY_BORDER_CLASS,
							currentTodo.priority
						)}
						checkedCheckBoxClassName={priorityClass(
							PRIORITY_CHECKED_CLASS,
							currentTodo.priority
						)}
						onClick={handleToggleComplete}
					/>
				</div>

				<button
					type="button"
					onClick={() => setExpanded(!expanded)}
					aria-expanded={expanded}
					className="flex-1 min-w-0 py-1 overflow-hidden text-start cursor-pointer focus-visible:focus-ring"
				>
					<p
						className={`truncate font-medium transition-ui ${
							comfortable ? 'text-[11.5px]' : 'text-[10px]'
						} ${
							isDone
								? 'text-muted opacity-60 line-through font-normal'
								: 'text-content'
						}`}
					>
						{currentTodo.text}
					</p>

					{comfortable && !expanded && (
						<span className="flex items-center gap-1.5 mt-1 text-[9px] text-muted">
							<span className="flex items-center gap-1 shrink-0">
								<Icon name="calendar" size={10} aria-hidden="true" />
								<time dateTime={isoDate}>
									{parseTodoDate(currentTodo.date)
										.locale('fa')
										.format('jD jMMMM')}
								</time>
							</span>
							{currentTodo.category && (
								<span className="flex items-center gap-1 min-w-0">
									<Icon name="tags" size={10} aria-hidden="true" />
									<span className="truncate">
										{currentTodo.category}
									</span>
								</span>
							)}
						</span>
					)}
				</button>

				<div className="flex relative items-center gap-0.5 shrink-0">
					{isPending && <IconLoading />}
					{hasFriends && (
						<Tooltip content="مشترک">
							<Icon
								name="users"
								size={12}
								className="text-muted"
								aria-hidden="true"
							/>
						</Tooltip>
					)}
					<div className="hidden group-hover:flex">
						<div className="flex items-center">
							{isOwner && (
								<button
									type="button"
									onClick={handleEdit}
									aria-label="ویرایش تسک"
									className="p-1 rounded-lg cursor-pointer text-primary/60 hover:bg-primary/10 hover:text-primary focus-visible:focus-ring"
								>
									<Icon name="edit" size={13} aria-hidden="true" />
								</button>
							)}
							<button
								type="button"
								onClick={handleDelete}
								aria-label="حذف تسک"
								className="p-1 rounded-lg cursor-pointer text-error/60 hover:bg-error/10 hover:text-error focus-visible:focus-ring"
							>
								<Icon name="trash" size={13} aria-hidden="true" />
							</button>
						</div>
					</div>

					<button
						type="button"
						onClick={() => setExpanded(!expanded)}
						aria-expanded={expanded}
						aria-label={expanded ? 'بستن جزئیات' : 'نمایش جزئیات'}
						className={cn(
							'rounded p-0.5 text-muted opacity-50 cursor-pointer transition-transform duration-300 hover:scale-110 focus-visible:focus-ring',
							expanded && 'rotate-180'
						)}
					>
						<Icon name="chevronDown" size={15} aria-hidden="true" />
					</button>
				</div>
			</div>

			{expanded && (
				<div className="border-t border-base-content/5 bg-base-content/1 px-2.5 py-2">
					<p className="mb-0 text-[11px] leading-snug text-muted whitespace-pre-wrap">
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
								<Icon name="tags" size={9} aria-hidden="true" />
								{currentTodo.category}
							</span>
						)}

						{currentTodo.priority && (
							<span
								className={`rounded-lg px-1.5 py-0.5 font-bold ${priorityClass(PRIORITY_BADGE_CLASS, currentTodo.priority)}`}
							>
								{PRIORITY_LABELS[currentTodo.priority]}
							</span>
						)}

						<span className="flex items-center gap-1 mr-auto text-muted">
							<Icon name="calendar" size={12} aria-hidden="true" />
							<time dateTime={isoDate}>
								{parseTodoDate(currentTodo.date)
									.locale('fa')
									.format('jD jMMMM')}
							</time>
						</span>
					</div>

					{currentTodo.description && (
						<div className="mt-2 leading-relaxed whitespace-break-spaces rounded-xl border border-base-content/5 bg-base-content/5 p-1.5 text-[11px] font-black">
							<NoteLinkRenderer note={currentTodo.description} />
						</div>
					)}
				</div>
			)}

			<ConfirmationModal
				isOpen={showConfirmation}
				onClose={() => setShowConfirmation(false)}
				onConfirm={onConfirmDelete}
				confirmText={isPending ? <IconLoading /> : 'حذف'}
				message="این عمل قابل بازگشت نیست و وظیفه برای همیشه حذف خواهد شد"
				variant="danger"
				title="حذف این تسک؟"
			/>
		</div>
	)
}

function resolveIsDone(todo: Todo): boolean {
	if (todo.owner?.isSelf) return todo.completed

	return todo.friends?.find((f) => f.isSelf)?.completed ?? todo.completed
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
				className="block text-primary underline break-all"
			>
				{urls[0]}
			</a>
		)
	}
	return <p className="font-light opacity-70">{note}</p>
}
