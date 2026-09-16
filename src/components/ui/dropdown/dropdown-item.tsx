import { cn } from '@/common/utils/cn'
import {
	dropdownItemIconVariants,
	dropdownItemVariants,
	type DropdownItemVariantProps,
} from './dropdown-item.variants'

export interface DropdownItemProps extends DropdownItemVariantProps {
	icon?: React.ReactNode
	label: React.ReactNode
	badge?: React.ReactNode
	onClick?: () => void
	disabled?: boolean
	className?: string
}

export function DropdownItem({
	icon,
	label,
	badge,
	onClick,
	variant,
	disabled = false,
	className,
}: DropdownItemProps) {
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
			className={cn(dropdownItemVariants({ variant }), className)}
		>
			<div className="flex items-center gap-3 min-w-0">
				{icon && (
					<span className={cn(dropdownItemIconVariants({ variant }))}>
						{icon}
					</span>
				)}
				<span className="truncate">{label}</span>
			</div>
			{badge && <span className="shrink-0">{badge}</span>}
		</button>
	)
}

export function DropdownDivider() {
	return <div className="h-px my-1 bg-muted" />
}
