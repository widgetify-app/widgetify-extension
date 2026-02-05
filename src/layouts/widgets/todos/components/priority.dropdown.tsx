import { BsFilterLeft } from 'react-icons/bs'
import { Dropdown } from '@/components/dropdown'
import { Button } from '@/components/button/button'
import { TodoPriority } from '@/context/todo.context'

const priorityOptions = [
	{
		value: TodoPriority.Low,
		label: 'کم اهمیت',
		color: 'text-success',
		bg: 'bg-success/10',
		border: 'border-success/20',
	},
	{
		value: TodoPriority.Medium,
		label: 'متوسط',
		color: 'text-warning',
		bg: 'bg-warning/10',
		border: 'border-warning/20',
	},
	{
		value: TodoPriority.High,
		label: 'مهم',
		color: 'text-error',
		bg: 'bg-error/10',
		border: 'border-error/20',
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
					className={`p-2 border rounded-xl shrink-0 active:scale-95 transition-colors ${
						selected
							? `${selected.bg} ${selected.color} ${selected.border}`
							: 'text-base-content/40 hover:text-primary/60'
					}`}
				>
					<BsFilterLeft size={18} />
				</Button>
			}
			dropdownClassName="p-1.5"
			position="top-left"
		>
			<div className="flex flex-col gap-1 min-w-32">
				<button
					onClick={() => setPriority(undefined)}
					className={`px-3 py-2 rounded-lg text-xs text-right cursor-pointer transition-colors ${
						priority === undefined
							? 'bg-primary/10 text-primary font-medium'
							: 'text-base-content/60 hover:bg-base-content/5'
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
								: 'text-base-content/60 hover:bg-base-content/5'
						}`}
					>
						{option.label}
					</button>
				))}
			</div>
		</Dropdown>
	)
}
