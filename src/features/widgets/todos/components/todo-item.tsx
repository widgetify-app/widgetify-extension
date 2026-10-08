import { t } from '@/common/i18n'
import type React from 'react'
import { useEffect, useState } from 'react'
import { cn } from '@/common/utils/cn'
import type { FetchedTodo, Todo } from '@/services/todo/todo.interface'
import { ConfirmationModal } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { showToast } from '@/common/toast'
import { useRemoveTodo } from '@/services/todo/remove-todo.hook'
import { safeAwait } from '@/services/api'
import { translateError } from '@/common/utils/translate-error'
import Analytics from '@/analytics'
import { Spinner } from '@/components/ui'
import { parseTodoDate } from '../utils/parse-date'
import { useUpdateTodo } from '@/services/todo/update-todo.hook'
import { playAlarm } from '@/common/utils/play-alarm'
import jalaliMoment from 'jalali-moment'
import { TodoFriends } from './friends'
import { TodoCheck } from './todo-check'
import { Icon, type IconName } from '@/icons'
import { PRIORITY_LABELS } from '../constants'
import { todoDueLabel } from '../utils/todo-due-label'
import { resolveIsDone } from '../utils/resolve-is-done'
import { useKeyboardFocusWithin } from '@/features/widgets/hooks/use-keyboard-focus-within'

interface Prop {
	todo: Todo
	blurMode?: boolean
	onEdit: (todo: Todo) => void
	onUpdated?: () => void
}

export function TodoItem({ todo, blurMode = false, onEdit, onUpdated }: Prop) {
	const { isAuthenticated } = useAuth()
	const keyboardFocus = useKeyboardFocusWithin()
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
		if (isTemp) return showToast(t('widgets.todos.item.notSavedYet'), 'error')
		e.stopPropagation()
		if (isPending) return
		if (!isAuthenticated)
			return showToast(t('widgets.todos.item.deleteNeedAuth'), 'error')
		setShowConfirmation(true)
	}

	const handleEdit = (e: React.MouseEvent) => {
		if (isTemp) return showToast(t('widgets.todos.item.notSavedYet'), 'error')
		e.stopPropagation()
		if (!isAuthenticated)
			return showToast(t('widgets.todos.item.editNeedAuth'), 'error')
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
		showToast(t('widgets.todos.form.deletedToast'), 'success')
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

	const dueDate = parseTodoDate(currentTodo.date)
	const isoDate = dueDate.format('YYYY-MM-DD')
	const dueLabel = todoDueLabel(dueDate, jalaliMoment())
	const isOwner = currentTodo?.owner?.isSelf
	const hasFriends = currentTodo?.friends && currentTodo?.friends?.length > 0
	return (
		<div
			{...keyboardFocus}
			className={cn(
				'group/row rounded-xl transition-ui hover:bg-fill data-[keyboard-focus]:bg-fill',
				blurMode ? 'blur-mode' : 'disabled-blur-mode'
			)}
		>
			<div className="flex items-center gap-2.5 px-2 min-h-8.5">
				<TodoCheck
					text={currentTodo.text}
					isDone={isDone}
					priority={currentTodo.priority}
					disabled={isUpdating}
					onToggle={handleToggleComplete}
				/>

				<button
					type="button"
					onClick={() => setExpanded(!expanded)}
					aria-expanded={expanded}
					className={cn(
						'flex-1 min-w-0 py-1.5 text-xs font-medium text-start cursor-pointer transition-ui focus-visible:focus-ring',
						expanded ? 'whitespace-pre-wrap wrap-break-word' : 'truncate',
						isDone
							? 'text-fg-faint line-through decoration-fg-ghost'
							: 'text-fg'
					)}
				>
					{currentTodo.text}
				</button>

				<span className="flex items-center gap-1 shrink-0">
					{isPending && <Spinner size="xs" />}
					{hasFriends && (
						<Icon
							name="users"
							size={12}
							className="text-fg-faint"
							aria-label={t('widgets.todos.item.shared')}
						/>
					)}
					{!isDone && dueLabel && (
						<time
							dateTime={isoDate}
							className="font-medium text-3xs text-fg-faint group-hover/row:hidden group-data-[keyboard-focus]/row:hidden"
						>
							{dueLabel}
						</time>
					)}
					<span className="items-center hidden group-hover/row:flex group-data-[keyboard-focus]/row:flex">
						{isOwner && (
							<button
								type="button"
								onClick={handleEdit}
								aria-label={t('widgets.todos.form.editTitle')}
								className="grid rounded-lg cursor-pointer place-items-center size-6 text-fg-muted transition-ui hover:bg-fill-2 hover:text-fg-strong focus-visible:focus-ring"
							>
								<Icon name="edit" size={14} aria-hidden="true" />
							</button>
						)}
						<button
							type="button"
							onClick={handleDelete}
							aria-label={t('widgets.todos.item.delete')}
							className="grid rounded-lg cursor-pointer place-items-center size-6 text-fg-muted transition-ui hover:bg-danger-fill hover:text-danger focus-visible:focus-ring"
						>
							<Icon name="trash" size={14} aria-hidden="true" />
						</button>
					</span>
				</span>
			</div>

			{expanded && (
				<div className="flex flex-col gap-1.5 pt-0.5 pb-2 leading-relaxed ps-8.5 pe-2 text-2xs text-fg-muted">
					{currentTodo.description && (
						<NoteLinkRenderer note={currentTodo.description} />
					)}
					<span className="flex flex-wrap gap-1">
						<TodoDetail icon="calendar">
							<time dateTime={isoDate}>
								{dueDate.clone().locale('fa').format('jD jMMMM')}
							</time>
						</TodoDetail>
						{currentTodo.category && (
							<TodoDetail icon="tags">{currentTodo.category}</TodoDetail>
						)}
						{currentTodo.priority && (
							<TodoDetail icon="outlineFilterList">
								{PRIORITY_LABELS[currentTodo.priority]}
							</TodoDetail>
						)}
					</span>
					{hasFriends && (
						<TodoFriends
							currentTodoCompleted={currentTodo.completed}
							friends={currentTodo.friends}
							owner={currentTodo.owner}
						/>
					)}
				</div>
			)}

			<ConfirmationModal
				isOpen={showConfirmation}
				onClose={() => setShowConfirmation(false)}
				onConfirm={onConfirmDelete}
				confirmText={
					isPending ? (
						<Spinner size="sm" tone="current" />
					) : (
						t('widgets.todos.form.delete')
					)
				}
				cancelText={t('widgets.todos.form.deleteCancel')}
				message={t('widgets.todos.item.deleteIrreversible')}
				variant="danger"
				title={t('widgets.todos.item.deleteConfirm')}
			/>
		</div>
	)
}

function TodoDetail({ icon, children }: { icon: IconName; children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center h-6 gap-1 px-2 font-semibold rounded-lg bg-fill text-3xs text-fg-muted">
			<Icon name={icon} size={12} aria-hidden="true" />
			{children}
		</span>
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
				className="block text-brand underline break-all"
			>
				{urls[0]}
			</a>
		)
	}
	return <p className="whitespace-pre-wrap">{note}</p>
}
