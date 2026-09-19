import { Button, Dropdown } from '@/components/ui'
import { TodoPriority } from '@/services/hooks/todo/todo.interface'
import { Icon } from '@/icons'

const priorityOptions = [
	{
		value: TodoPriority.Low,
		label: 'کم اهمیت',
		color: 'text-success',
		bg: 'bg-success-subtle',
		border: 'border-success-muted',
	},
	{
		value: TodoPriority.Medium,
		label: 'متوسط',
		color: 'text-warning',
		bg: 'bg-warning-subtle',
		border: 'border-warning-muted',
	},
	{
		value: TodoPriority.High,
		label: 'مهم',
		color: 'text-error',
		bg: 'bg-danger-subtle',
		border: 'border-danger-muted',
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
				<Button
					size="sm"
					rounded={'xl'}
					className={`p-2 border shrink-0 active:scale-95 transition-colors ${
						selected
							? `${selected.bg} ${selected.color} ${selected.border}`
							: 'text-faint hover:text-brand'
					}`}
				>
					<Icon name="filterLeft" size={18} />
				</Button>
			}
			position="top-left"
		>
			<div className="flex flex-col gap-1 border min-w-32 bg-content border-content rounded-2xl p-1.5">
				<button
					onClick={() => setPriority(undefined)}
					className={`px-3 py-2 rounded-lg text-xs text-right cursor-pointer transition-colors ${
						priority === undefined
							? 'bg-brand-subtle text-primary font-medium'
							: 'text-muted hover:bg-subtle'
					}`}
				>
					بدون اولویت
				</button>

				{priorityOptions.map((option) => (
					<button
						key={option.value}
						onClick={() => setPriority(option.value)}
						className={`px-3 py-2 rounded-lg text-xs text-right cursor-pointer transition-colors ${
							priority === option.value
								? `${option.bg} ${option.color} font-medium`
								: 'text-muted hover:bg-subtle'
						}`}
					>
						{option.label}
					</button>
				))}
			</div>
		</Dropdown>
	)
}
