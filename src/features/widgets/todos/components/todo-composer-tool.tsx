import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'
import { Icon, type IconName } from '@/icons'

interface TodoComposerToolProps {
	icon: IconName
	label: string
	isActive?: boolean
	children?: ReactNode
}

export function TodoComposerTool({
	icon,
	label,
	isActive = false,
	children,
}: TodoComposerToolProps) {
	return (
		<button
			type="button"
			aria-label={children ? undefined : label}
			className={cn(
				'inline-flex items-center gap-1 h-6 px-2 rounded-lg text-3xs font-semibold shrink-0 cursor-pointer transition-ui focus-visible:focus-ring',
				isActive
					? 'bg-brand-fill text-brand hover:bg-brand-fill-2'
					: 'bg-fill text-fg-muted hover:bg-fill-2 hover:text-fg'
			)}
		>
			<Icon name={icon} size={12} aria-hidden="true" />
			{children && <span className="truncate max-w-16">{children}</span>}
		</button>
	)
}
