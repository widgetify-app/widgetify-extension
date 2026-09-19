import { showToast } from '@/common/toast'
import { cn } from '@/common/utils/cn'
import { translateError } from '@/common/utils/translate-error'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import { safeAwait } from '@/services/api'
import type { Todo } from '@/services/hooks/todo/todo.interface'
import { useUpdateTodo } from '@/services/hooks/todo/update-todo.hook'
import { TodosError } from '../components/todo-error'

interface TodoCompactRowProps {
	todos: Todo[]
	isLoading: boolean
	isError: boolean
	isAuthenticated: boolean
	onRefresh: () => void
}

export function TodoCompactRow({
	todos,
	isLoading,
	isError,
	isAuthenticated,
	onRefresh,
}: TodoCompactRowProps) {
	const totalCount = todos.length
	const completedCount = todos.filter((t) => t.completed).length
	const nextPending = todos.find((t) => !t.completed) || todos[0]
	const { blurMode } = useGeneralSetting()

	const { mutateAsync: updateTodo, isPending } = useUpdateTodo(nextPending?.id || null)

	const handleToggle = async (e: React.MouseEvent) => {
		e.stopPropagation()
		if (!nextPending || isPending) return

		const [error] = await safeAwait(
			updateTodo({
				id: nextPending.id,
				input: { completed: !nextPending.completed },
			})
		)

		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}

		onRefresh()
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-between w-full h-full px-3 py-2 select-none">
				<div className="flex items-center gap-2">
					<div className="w-5 h-5 rounded-md skeleton" />
					<div className="w-32 h-4 rounded skeleton" />
				</div>
				<div className="w-12 h-4 rounded skeleton" />
			</div>
		)
	}

	if (isError) {
		return <TodosError compact onRetry={onRefresh} />
	}

	return (
		<div className="flex items-center justify-between w-full h-full px-3.5 py-2 select-none">
			<div className="flex items-center gap-2.5 overflow-hidden">
				{!isAuthenticated ? (
					<span className="text-xs text-muted">
						برای دیدن تسک‌ها وارد حسابت شو
					</span>
				) : nextPending ? (
					<>
						<button
							type="button"
							onClick={handleToggle}
							disabled={isPending}
							aria-pressed={nextPending.completed}
							aria-label={`${nextPending.text} را ${nextPending.completed ? 'ناتمام' : 'انجام‌شده'} کن`}
							className={cn(
								'w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 cursor-pointer',
								'disabled:cursor-not-allowed disabled:opacity-60 focus-visible:focus-ring',
								nextPending.completed
									? 'bg-success-subtle border-success text-success'
									: 'border-strong hover:border-primary'
							)}
						>
							{nextPending.completed && (
								<Icon
									name="check"
									className="w-3.5 h-3.5"
									aria-hidden="true"
								/>
							)}
						</button>
						<span
							className={cn(
								'text-xs font-medium truncate max-w-44 text-content',
								blurMode ? 'blur-mode' : 'disabled-blur-mode',
								nextPending.completed &&
									'line-through text-muted opacity-70'
							)}
						>
							{nextPending.text}
						</span>
					</>
				) : (
					<div className="flex items-center gap-1.5 text-xs text-muted">
						<Icon
							name="taskList"
							className="w-4 h-4 text-primary"
							aria-hidden="true"
						/>
						<span>همه تسک‌ها انجام شدند</span>
					</div>
				)}
			</div>

			{isAuthenticated && (
				<div className="flex items-center gap-2 text-xs shrink-0">
					<div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-subtle text-content border border-subtle text-[11px]">
						<span className="font-bold text-success">{completedCount}</span>
						<span>/</span>
						<span>{totalCount}</span>
					</div>
				</div>
			)}
		</div>
	)
}
