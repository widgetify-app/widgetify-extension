import jalaliMoment from 'jalali-moment'
import { type ReactNode, useState } from 'react'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { playAlarm } from '@/common/utils/play-alarm'
import { translateError } from '@/common/utils/translate-error'
import { Button } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon, type IconName } from '@/icons'
import { safeAwait } from '@/services/api'
import type { Todo } from '@/services/todo/todo.interface'
import { useUpdateTodo } from '@/services/todo/update-todo.hook'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { TodoCheck } from '../components/todo-check'
import { currentTaskIndex, nextOpenTaskId } from '../utils/current-task-index'
import { parseTodoDate } from '../utils/parse-date'
import { resolveIsDone } from '../utils/resolve-is-done'
import { todoDueLabel } from '../utils/todo-due-label'

interface TodoCompactRowProps {
	header: ReactNode
	todos: Todo[]
	total: number
	isLoading: boolean
	isError: boolean
	isAuthenticated: boolean
	hasNextPage: boolean
	isFetchingNextPage: boolean
	onLoadMore: () => void
	onRefresh: () => void
	onUpdated: () => void
	onAdd: () => void
	onOpen: (todo: Todo) => void
}

export function TodoCompactRow(props: TodoCompactRowProps) {
	return (
		<>
			{props.header}
			<div className="flex-1 min-h-0">
				<TodoCompactContent {...props} />
			</div>
		</>
	)
}

function TodoCompactContent({
	todos,
	total,
	isLoading,
	isError,
	isAuthenticated,
	hasNextPage,
	isFetchingNextPage,
	onLoadMore,
	onRefresh,
	onUpdated,
	onAdd,
	onOpen,
}: TodoCompactRowProps) {
	const { blurMode } = useGeneralSetting()
	const [currentId, setCurrentId] = useState<string | null>(null)

	const tasks = todos.map((todo) => ({ id: todo.id, completed: resolveIsDone(todo) }))
	const index = currentTaskIndex(tasks, currentId)
	const current = todos[index] as Todo | undefined

	const { mutateAsync: updateTodo, isPending } = useUpdateTodo(current?.id || null)

	if (!isAuthenticated) {
		return (
			<CompactLayout
				icon="user"
				title="تسک‌هات توی حسابته"
				subtitle="برای دیدنشون وارد شو"
				action={
					<Button
						size="xs"
						color="brand"
						rounded="lg"
						onClick={() => callEvent('openProfile')}
					>
						ورود
					</Button>
				}
			/>
		)
	}

	if (isLoading) {
		return (
			<div aria-hidden="true" className="flex items-center h-full gap-2.5 px-2">
				<div className="rounded-full size-4 skeleton shrink-0" />
				<div className="flex flex-col flex-1 gap-1.5">
					<div className="w-3/4 h-3 rounded-sm skeleton" />
					<div className="w-1/2 h-2 rounded-sm skeleton" />
				</div>
			</div>
		)
	}

	if (isError) {
		return <WidgetError message="تسک‌ها دریافت نشدند" compact onRetry={onRefresh} />
	}

	if (!current) {
		return (
			<CompactLayout
				icon="check"
				title="هنوز تسکی نداری"
				subtitle="یه کار برای امروز بنویس"
				action={
					<Button size="xs" color="brand" rounded="lg" onClick={onAdd}>
						افزودن
					</Button>
				}
			/>
		)
	}

	const isDone = tasks[index].completed
	const isTemp = current.id.startsWith('temp-')
	const isLast = index === todos.length - 1

	const handleToggle = async () => {
		if (isPending || isTemp) return
		const completed = !isDone

		const [error] = await safeAwait(
			updateTodo({ id: current.id, input: { completed } })
		)
		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}

		if (completed) {
			playAlarm('success')
			const nextId = nextOpenTaskId(tasks, index)
			if (nextId) setCurrentId(nextId)
		}
		Analytics.event('todo_toggle_complete')
		onUpdated()
	}

	const openCurrent = () => {
		if (isTemp) {
			showToast('این تسک هنوز همگام‌سازی نشده است.', 'error')
			return
		}
		onOpen(current)
	}

	const goNext = () => {
		if (!isLast) setCurrentId(todos[index + 1].id)
		else if (hasNextPage) onLoadMore()
	}

	const dueLabel = isDone
		? null
		: todoDueLabel(parseTodoDate(current.date), jalaliMoment())
	const subtitle = [dueLabel, `${index + 1} از ${Math.max(total, todos.length)}`]
		.filter(Boolean)
		.join(' · ')

	return (
		<div className="flex items-center h-full gap-1">
			<div
				className={cn(
					'flex items-center flex-1 min-w-0 gap-2.5 px-2 rounded-xl min-h-8.5 transition-ui hover:bg-fill',
					blurMode ? 'blur-mode' : 'disabled-blur-mode'
				)}
			>
				<TodoCheck
					text={current.text}
					isDone={isDone}
					priority={current.priority}
					disabled={isPending || isTemp}
					onToggle={handleToggle}
				/>
				<button
					type="button"
					onClick={openCurrent}
					className="flex flex-col flex-1 min-w-0 py-1 rounded-lg cursor-pointer text-start leading-control focus-visible:focus-ring"
				>
					<span
						title={current.text}
						className={cn(
							'text-xs font-medium truncate',
							isDone
								? 'text-fg-faint line-through decoration-fg-ghost'
								: 'text-fg'
						)}
					>
						{current.text}
					</span>
					<span className="truncate text-3xs text-fg-faint">{subtitle}</span>
				</button>
			</div>

			<span className="flex flex-col flex-none">
				<NavButton
					icon="chevronUp"
					label="تسک قبلی"
					onClick={() => setCurrentId(todos[index - 1].id)}
					disabled={index === 0}
				/>
				<NavButton
					icon="chevronDown"
					label="تسک بعدی"
					onClick={goNext}
					disabled={(isLast && !hasNextPage) || isFetchingNextPage}
				/>
			</span>
		</div>
	)
}

interface NavButtonProps {
	icon: IconName
	label: string
	onClick: () => void
	disabled: boolean
}

function NavButton({ icon, label, onClick, disabled }: NavButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
			className="grid rounded-lg cursor-pointer place-items-center size-5 text-fg-muted transition-ui hover:bg-fill-2 hover:text-fg-strong focus-visible:focus-ring disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
		>
			<Icon name={icon} size={14} aria-hidden="true" />
		</button>
	)
}

interface CompactLayoutProps {
	icon: 'check' | 'user'
	title: string
	subtitle: string
	action?: ReactNode
}

function CompactLayout({ icon, title, subtitle, action }: CompactLayoutProps) {
	return (
		<div className="flex items-center h-full gap-2.5 px-2">
			<span className="grid rounded-xl place-items-center size-9 shrink-0 bg-fill text-fg-muted">
				<Icon name={icon} size={16} aria-hidden="true" />
			</span>
			<div className="flex flex-col flex-1 min-w-0 leading-control">
				<span className="text-xs font-semibold truncate text-fg">{title}</span>
				<span className="truncate text-3xs text-fg-faint">{subtitle}</span>
			</div>
			{action}
		</div>
	)
}
