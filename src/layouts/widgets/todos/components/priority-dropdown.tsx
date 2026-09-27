import { Button, Dropdown } from '@/components/ui'
import { TodoPriority } from '@/services/hooks/todo/todo.interface'
import { Icon } from '@/icons'

const priorityOptions = [
	{
		value: TodoPriority.Low,
		label: 'کم اهمیت',
		color: 'text-ds-success',
		bg: 'bg-success-subtle',
		border: 'border-success-muted',
	},
	{
		value: TodoPriority.Medium,
		label: 'متوسط',
		color: 'text-ds-warning',
		bg: 'bg-ds-warning-fill',
		border: 'border-warning-muted',
	},
	{
		value: TodoPriority.High,
		label: 'مهم',
		color: 'text-ds-danger',
		bg: 'bg-ds-danger-fill',
		border: 'border-ds-danger-fill-2',
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
							: 'text-faint hover:text-brand-strong'
					}`}
				>
					<Icon name="filterLeft" size={18} />
				</Button>
			}
			position="top-left"
		>
			<div className="flex flex-col gap-1 border min-w-32 bg-ds-surface-2 border-ds-surface-3 rounded-2xl p-1.5">
				<button
					onClick={() => setPriority(undefined)}
					className={`px-3 py-2 rounded-lg text-xs text-right cursor-pointer transition-colors ${
						priority === undefined
							? 'bg-ds-brand-fill text-ds-brand font-medium'
							: 'text-ds-fg-muted hover:bg-ds-fill'
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
								: 'text-ds-fg-muted hover:bg-ds-fill'
						}`}
					>
						{option.label}
					</button>
				))}
			</div>
		</Dropdown>
	)
}
