import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'
import { Icon, type IconName } from '@/icons'

interface NavIconButtonProps {
	icon: IconName
	label: string
	onClick?: () => void
	pressed?: boolean
	id?: string
	className?: string
	children?: ReactNode
}

export function NavIconButton({
	icon,
	label,
	onClick,
	pressed,
	id,
	className,
	children,
}: NavIconButtonProps) {
	return (
		<button
			type="button"
			id={id}
			aria-label={label}
			aria-pressed={pressed}
			onClick={onClick}
			className={cn(
				'relative p-2 transition-ui cursor-pointer text-nav hover:text-nav-hover active:scale-90',
				className
			)}
		>
			<Icon name={icon} size={16} aria-hidden="true" />
			{children}
		</button>
	)
}
