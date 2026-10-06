import { cn } from '@/common/utils/cn'
import { Dropdown } from '@/components/ui'
import { TodoPriority } from '@/services/todo/todo.interface'
import { TodoComposerTool } from './todo-composer-tool'

const OPTION_CLASS =
	'px-3 py-2 rounded-xl text-xs text-start cursor-pointer transition-ui focus-visible:focus-ring'

const priorityOptions = [
	{
		value: TodoPriority.Low,
		label: 'کم‌اهمیت',
		color: 'text-success',
		bg: 'bg-success-fill',
	},
	{
		value: TodoPriority.Medium,
		label: 'متوسط',
		color: 'text-warning',
		bg: 'bg-warning-fill',
	},
	{
		value: TodoPriority.High,
		label: 'مهم',
		color: 'text-danger',
		bg: 'bg-danger-fill',
	},
]

interface PriorityDropdownProps {
	priority: TodoPriority | undefined
	setPriority: (priority: TodoPriority | undefined) => void
}

export function PriorityDropdown({ priority, setPriority }: PriorityDropdownProps) {
	const selected = priorityOptions.find((f) => f.value === priority)

	return (
		<Dropdown
			trigger={
				<TodoComposerTool
					icon="outlineFilterList"
					label="اولویت"
					isActive={Boolean(selected)}
				>
					{selected?.label}
				</TodoComposerTool>
			}
			position="top-left"
		>
			<div className="flex flex-col gap-0.5 p-1.5 min-w-32">
				<button
					type="button"
					onClick={() => setPriority(undefined)}
					className={cn(
						OPTION_CLASS,
						priority === undefined
							? 'bg-brand-fill text-brand font-medium'
							: 'text-fg-muted hover:bg-fill'
					)}
				>
					بدون اولویت
				</button>

				{priorityOptions.map((option) => (
					<button
						type="button"
						key={option.value}
						onClick={() => setPriority(option.value)}
						className={cn(
							OPTION_CLASS,
							priority === option.value
								? cn(option.bg, option.color, 'font-medium')
								: 'text-fg-muted hover:bg-fill'
						)}
					>
						{option.label}
					</button>
				))}
			</div>
		</Dropdown>
	)
}
