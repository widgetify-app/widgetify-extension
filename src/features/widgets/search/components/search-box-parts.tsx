import { cn } from '@/common/utils/cn'
import { WidgetMenuButton } from '@/features/widgets/components/widget-menu-button'
import { Icon, type IconName } from '@/icons'

export const SEARCH_BOX_CLASS =
	'flex items-center gap-1.5 h-11 ps-1.5 pe-1.5 rounded-2xl transition-ui focus-within:bg-surface-2 focus-within:ring-[1.5px] focus-within:ring-inset focus-within:ring-brand-muted'

export const SEARCH_INPUT_CLASS =
	'flex-1 min-w-0 px-1 text-sm font-medium bg-transparent outline-none text-fg-strong placeholder:font-normal placeholder:text-fg-faint'

interface SearchBoxButtonProps {
	label: string
	icon: IconName
	onClick: () => void
	isActive?: boolean
}

export function SearchBoxButton({
	label,
	icon,
	onClick,
	isActive = false,
}: SearchBoxButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className={cn(
				'grid rounded-lg cursor-pointer size-7 place-items-center shrink-0 transition-ui focus-visible:focus-ring',
				isActive
					? 'bg-brand-fill text-brand hover:bg-brand-fill-2'
					: 'text-fg-muted hover:bg-fill-2 hover:text-fg-strong'
			)}
		>
			<Icon name={icon} size={16} aria-hidden="true" />
		</button>
	)
}

export function SearchMenuButton() {
	return (
		<span className="absolute top-0 left-0 z-30 widget-control">
			<WidgetMenuButton placement="compact" />
		</span>
	)
}
