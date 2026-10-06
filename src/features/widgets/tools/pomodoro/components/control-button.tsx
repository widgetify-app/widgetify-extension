import type React from 'react'
import { cn } from '@/common/utils/cn'
import { Icon, type IconName } from '@/icons'

interface ControlButtonProps {
	icon: IconName
	label: string
	onClick: () => void
	isPrimary?: boolean
}

export const ControlButton: React.FC<ControlButtonProps> = ({
	icon,
	label,
	onClick,
	isPrimary = false,
}) => (
	<button
		type="button"
		onClick={onClick}
		aria-label={label}
		className={cn(
			'grid rounded-full cursor-pointer place-items-center transition-ui active:scale-95 focus-visible:focus-ring',
			isPrimary
				? 'size-12 bg-brand text-on-brand shadow-md shadow-brand-fill-2 hover:bg-brand-hover'
				: 'size-7 rounded-lg text-fg-muted hover:bg-fill-2 hover:text-fg-strong'
		)}
	>
		<Icon name={icon} size={isPrimary ? 20 : 16} aria-hidden="true" />
	</button>
)
