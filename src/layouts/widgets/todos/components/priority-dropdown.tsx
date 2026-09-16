import { Button, Dropdown } from '@/components/ui'
import { TodoPriority } from '@/services/hooks/todo/todo.interface'
import { Icon } from '@/icons'
import { PRIORITY_SOFT_CLASS } from '../constants'

const priorityOptions = [
	{ value: TodoPriority.Low, label: 'کم اهمیت', ...PRIORITY_SOFT_CLASS.low },
	{ value: TodoPriority.Medium, label: 'متوسط', ...PRIORITY_SOFT_CLASS.medium },
	{ value: TodoPriority.High, label: 'مهم', ...PRIORITY_SOFT_CLASS.high },
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
							: 'text-faint hover:text-primary/60'
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
							? 'bg-primary/10 text-primary font-medium'
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
