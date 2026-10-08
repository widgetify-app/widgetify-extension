import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { PRIORITY_BORDER_CLASS, priorityClass } from '../constants'

interface TodoCheckProps {
	text: string
	isDone: boolean
	priority?: string
	disabled?: boolean
	onToggle: () => void
}

export function TodoCheck({
	text,
	isDone,
	priority,
	disabled,
	onToggle,
}: TodoCheckProps) {
	return (
		<button
			type="button"
			onClick={onToggle}
			disabled={disabled}
			aria-pressed={isDone}
			aria-label={
				isDone
					? t('widgets.todos.item.markUndoneAria', { p0: text })
					: t('widgets.todos.item.markDoneAria', { p0: text })
			}
			className={cn(
				'grid flex-none rounded-full place-items-center size-4 border-[1.5px] cursor-pointer transition-ui focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-60',
				isDone
					? 'bg-brand border-brand text-on-brand'
					: cn(
							'hover:bg-fill-2',
							priorityClass(PRIORITY_BORDER_CLASS, priority)
						)
			)}
		>
			{isDone && <Icon name="check" size={10} aria-hidden="true" />}
		</button>
	)
}
