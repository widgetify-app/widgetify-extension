import { cn } from '@/common/utils/cn'
import { popoverMenuItemVariants } from './popover-menu.variants'

export interface PopoverMenuItemProps {
	icon?: React.ReactNode
	label: string
	badge?: React.ReactNode
	onClick?: () => void
	variant?: 'default' | 'danger' | 'primary'
	disabled?: boolean
	className?: string
}

export function PopoverMenuItem({
	icon,
	label,
	badge,
	onClick,
	variant = 'default',
	disabled = false,
	className,
}: PopoverMenuItemProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={(e) => {
				e.stopPropagation()
				if (!disabled) {
					onClick?.()
				}
			}}
			className={cn(popoverMenuItemVariants({ variant }), className)}
		>
			<div className="flex items-center gap-2">
				{icon && <span className="text-sm shrink-0">{icon}</span>}
				<span className="truncate">{label}</span>
			</div>
			{badge && <span className="shrink-0">{badge}</span>}
		</button>
	)
}

export function PopoverMenuDivider() {
	return <div className="h-px my-1 bg-base-content/10" />
}

export function PopoverMenuHeader({ children }: { children: React.ReactNode }) {
	return (
		<div className="px-2.5 py-1 text-[11px] font-semibold text-muted flex items-center justify-between">
			{children}
		</div>
	)
}
